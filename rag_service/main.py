import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
from groq import Groq
from google import genai
from google.genai import types
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)
genai_client = genai.Client(api_key=GOOGLE_API_KEY)

# Warmup configuration
WARMUP_ENABLED = os.getenv("WARMUP_ENABLED", "true").lower() in ("1", "true", "yes")
WARMUP_KEEPALIVE_INTERVAL = int(os.getenv("WARMUP_KEEPALIVE_INTERVAL", "0"))  # seconds, 0 = no periodic keepalive

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message]

class UpdateKnowledgeRequest(BaseModel):
    content: str
    source: str = "portfolio_live"

def get_embedding(text):
    try:
        response = genai_client.models.embed_content(
            model="text-embedding-004",
            contents=text,
            config=types.EmbedContentConfig(task_type="retrieval_query")
        )
        return response.embeddings[0].values
    except Exception as e:
        print(f"Embedding error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Embedding service error: {str(e)}")

def get_document_embedding(text):
    try:
        response = genai_client.models.embed_content(
            model="text-embedding-004",
            contents=text,
            config=types.EmbedContentConfig(task_type="retrieval_document", title="Portfolio Content")
        )
        return response.embeddings[0].values
    except Exception as e:
        print(f"Document embedding error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Embedding service error: {str(e)}")


def _do_warmup():
    """Synchronous warmup routine: generate a small embedding and a tiny chat completion.
    Keep it small (max_tokens=1) to reduce cost but still trigger provider cold-starts.
    """
    try:
        print("Warmup: generating test embedding...")
        _ = get_embedding("Warmup query for service startup")
        print("Warmup: embedding done.")

        print("Warmup: sending tiny chat to Groq to warm model...")
        # Minimal chat to warm model servers (1 token max, temperature 0)
        _ = groq_client.chat.completions.create(
            messages=[{"role": "system", "content": "Warmup."}, {"role": "user", "content": "Hello"}],
            model="llama-3.3-70b-versatile",
            temperature=0.0,
            max_tokens=1,
        )
        print("Warmup: Groq chat done.")
    except Exception as e:
        print(f"Warmup failed: {e}")


@app.on_event("startup")
async def startup_warmup():
    """Trigger warmup on application startup in a non-blocking way.

    This avoids delaying FastAPI startup while still ensuring the first real user
    request is faster because heavy providers are already warmed.
    """
    if not WARMUP_ENABLED:
        print("Warmup disabled by WARMUP_ENABLED env var.")
        return

    import asyncio
    # Run synchronous warmup in a thread so startup is not blocked
    asyncio.create_task(asyncio.to_thread(_do_warmup))

    # Optionally schedule periodic keepalive warmups
    if WARMUP_KEEPALIVE_INTERVAL and WARMUP_KEEPALIVE_INTERVAL > 0:
        async def periodic_keepalive():
            while True:
                await asyncio.sleep(WARMUP_KEEPALIVE_INTERVAL)
                await asyncio.to_thread(_do_warmup)

        asyncio.create_task(periodic_keepalive())

@app.get("/")
@app.get("/api/rag/")
def read_root():
    return {"status": "RAG Service Running"}

@app.post("/update-knowledge")
@app.post("/api/rag/update-knowledge")
async def update_knowledge(request: UpdateKnowledgeRequest):
    """
    Receives raw text content, chunks it, embeds it, and stores it in Supabase.
    Replaces old data for the given source to keep it fresh.
    """
    try:
        # 1. Clean up old data for this source
        try:
            supabase.table("documents").delete().eq("metadata->>source", request.source).execute()
        except Exception as delete_err:
            print(f"Could not delete old records (might be empty): {delete_err}")

        # 2. Text Splitting
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""],
            length_function=len,
        )
        chunks = text_splitter.split_text(request.content)
        
        print(f"Generated {len(chunks)} chunks.")

        # 3. Generate Embeddings and Prepare Records
        records = []
        for chunk in chunks:
            vector = get_document_embedding(chunk)
            records.append({
                "content": chunk,
                "embedding": vector,
                "metadata": {"source": request.source}
            })

        # 4. Insert into Supabase
        if records:
            supabase.table("documents").insert(records).execute()
        
        return {"message": "Knowledge base updated successfully", "chunks_processed": len(chunks)}

    except Exception as e:
        print(f"Update failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/warmup")
@app.post("/api/rag/warmup")
async def warmup_endpoint():
    """Manual warmup endpoint. Triggers the same warmup routine in background and returns immediately."""
    import asyncio
    asyncio.create_task(asyncio.to_thread(_do_warmup))
    return {"status": "warmup triggered"}

@app.post("/chat")
@app.post("/api/rag/chat")
async def chat(request: ChatRequest):
    try:
        # 1. Generate embedding for the user query
        query_embedding = get_embedding(request.message)

        # 2. Search Supabase for relevant documents
        try:
            response = supabase.rpc(
                "match_documents",
                {
                    "query_embedding": query_embedding,
                    "match_threshold": 0.5, # Adjust based on result quality
                    "match_count": 5
                }
            ).execute()
            matches = response.data
        except Exception as e:
            print(f"Supabase error: {str(e)}")
            # Retry once after a short delay
            import time
            time.sleep(0.5)
            try:
                response = supabase.rpc(
                    "match_documents",
                    {
                        "query_embedding": query_embedding,
                        "match_threshold": 0.5,
                        "match_count": 5
                    }
                ).execute()
                matches = response.data
            except Exception as e2:
                print(f"Supabase retry failed: {str(e2)}")
                raise HTTPException(status_code=500, detail=f"Database search error: {str(e2)}")
        
        # 3. Construct Context from matches
        context_str = ""
        if matches:
            context_str = "\n\n".join([f"Source ({m['metadata']['source']}): {m['content']}" for m in matches])
        else:
            context_str = "No specific documents found for this query."

        # 4. Prepare Prompt for LLM
        system_prompt = f"""You are a helpful AI assistant for a portfolio website. 
        Your goal is to answer questions about the portfolio owner based STRICTLY on the provided context.
        
        Context information:
        {context_str}
        
        Instructions:
        - Be friendly and professional.
        - If the answer is not in the context, say "I don't have that information in my knowledge base."
        - Do not hallucinate information.
        - Keep answers concise but informative.
        """

        messages = [{"role": "system", "content": system_prompt}]
        
        # Add a few recent history messages for context (optional, limit to avoid token limits)
        messages.extend([m.dict() for m in request.history[-5:]])
        
        messages.append({"role": "user", "content": request.message})

        # 5. Call Groq (Llama 3)
        try:
            chat_completion = groq_client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=500,
            )
            return {"reply": chat_completion.choices[0].message.content}
        except Exception as e:
            print(f"Groq error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"LLM service error: {str(e)}")

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))