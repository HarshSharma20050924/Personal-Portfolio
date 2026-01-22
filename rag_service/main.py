
import os
import asyncio
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
from groq import Groq
from google import genai
from google.genai import types
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 1. ENVIRONMENT SETUP
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OWNER_NAME = os.getenv("PORTFOLIO_OWNER_NAME", "Harsh Sharma")

# 2. LIFESPAN (Vercel-Friendly Startup)
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Triggers on Vercel spin-up to eliminate cold starts."""
    if os.getenv("WARMUP_ENABLED", "true").lower() == "true":
        asyncio.create_task(asyncio.to_thread(_do_warmup))
    yield

app = FastAPI(lifespan=lifespan)

# 3. CLIENT INITIALIZATION
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)
genai_client = genai.Client(api_key=GOOGLE_API_KEY)

# 4. DATA MODELS
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message]

class UpdateKnowledgeRequest(BaseModel):
    content: str
    source: str = "portfolio_live"

# 5. CORE UTILITIES
def _do_warmup():
    """Warms up embedding and LLM providers."""
    try:
        genai_client.models.embed_content(model="text-embedding-004", contents="warmup")
        groq_client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}],
            model="llama-3.3-70b-versatile",
            max_tokens=1
        )
    except: pass

def get_query_embedding(text: str):
    """Generates embedding for user queries."""
    response = genai_client.models.embed_content(
        model="text-embedding-004",
        contents=text,
        config=types.EmbedContentConfig(task_type="retrieval_query")
    )
    return response.embeddings[0].values

# 6. API ENDPOINTS

@app.get("/")
@app.get("/api/rag/")
async def health_check():
    return {"status": "RAG Service Online", "owner": OWNER_NAME}

@app.post("/update-knowledge")
@app.post("/api/rag/update-knowledge")
async def update_knowledge(request: UpdateKnowledgeRequest):
    """
    LOOP UPDATE: Uses Batch Embedding to process all chunks at once.
    This replaces the old slow serial loop.
    """
    try:
        # Step 1: Clean old data
        supabase.table("documents").delete().eq("metadata->>source", request.source).execute()

        # Step 2: Chunking
        # Increased chunk overlap to ensure context flows better between sections
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(request.content)
        
        if not chunks: return {"message": "Empty content"}

        # Step 3: BATCH EMBEDDING (The "Loop Update")
        # Instead of calling API 50 times for 50 chunks, we call it ONCE.
        response = genai_client.models.embed_content(
            model="text-embedding-004",
            contents=chunks,
            config=types.EmbedContentConfig(task_type="retrieval_document", title="Portfolio Update")
        )
        
        records = []
        for i, chunk in enumerate(chunks):
            records.append({
                "content": chunk,
                "embedding": response.embeddings[i].values,
                "metadata": {"source": request.source}
            })

        # Step 4: Bulk Insert
        supabase.table("documents").insert(records).execute()
        return {"status": "success", "chunks": len(records)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
@app.post("/api/rag/chat")
async def chat(request: ChatRequest):
    """
    THIRD PERSON UPDATE: Forces AI to speak about the owner as a separate person.
    """
    try:
        # Step 1: Semantic Search
        query_vec = get_query_embedding(request.message)
        rpc_response = supabase.rpc("match_documents", {
            "query_embedding": query_vec,
            "match_threshold": 0.3, # Lowered slightly to catch more broad context
            "match_count": 10       # Increased for better context window
        }).execute()

        context = "\n\n".join([m['content'] for m in rpc_response.data]) if rpc_response.data else ""

        # Step 2: Third-Person Prompting & Formatting
        system_prompt = f"""You are the sophisticated AI interface for {OWNER_NAME}'s Digital Portfolio.

        CONTEXT FROM DATABASE:
        {context if context else "No specific database records found for this query. Rely on general professional knowledge."}

        Directives:
        1.  **Identity**: You are an AI assistant. {OWNER_NAME} is the developer/architect. Refer to him in the THIRD PERSON (e.g., "He built," "Harsh specializes in").
        2.  **Formatting**: You MUST return responses in MARKDOWN.
            -   **Links**: If a URL is present in the context (like a GitHub repo or Live Demo), you MUST format it as a clickable Markdown link: `[Link Text](URL)`.
            -   **Lists**: Use bullet points for skills or lists.
            -   **Emphasis**: Use bolding for key technologies or project titles.
        3.  **Tone**: Professional, concise, intelligent, and "Elite". Avoid excessive apologies.
        4.  **Unknowns**: If the context doesn't have the answer, suggest checking the specific "Contact" section or imply that {OWNER_NAME} can discuss it directly.
        5.  **Source Attribution**: If you find specific project names or sections in the context, mention them (e.g., "According to the Project Alpha logs...").

        Example Output:
        "{OWNER_NAME} developed **Project X**, a scalable SaaS platform. You can view the code at [GitHub Repository](https://github.com/...). He utilized React and Node.js for this architecture."
        """

        # Step 3: LLM Generation
        messages = [{"role": "system", "content": system_prompt}]
        
        # Limit history to prevent token overflow
        messages.extend([m.dict() for m in request.history[-4:]]) 
        messages.append({"role": "user", "content": request.message})

        response = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.4, # Lower temperature for more factual/grounded responses
            max_tokens=512
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        print(f"Chat error: {e}")
        # Return a fallback message instead of 500ing to the frontend
        return {"reply": "Connection to neural core unstable. Please try again or contact the administrator directly."}

@app.post("/warmup")
@app.post("/api/rag/warmup")
async def manual_warmup():
    asyncio.create_task(asyncio.to_thread(_do_warmup))
    return {"status": "warmup initiated"}
