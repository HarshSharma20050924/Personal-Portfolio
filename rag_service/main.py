
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
# Initialize GenAI Client
genai_client = genai.Client(api_key=GOOGLE_API_KEY)

# 4. DATA MODELS
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message]
    template: Optional[str] = "default" 

class UpdateKnowledgeRequest(BaseModel):
    content: str
    source: str = "portfolio_live"

# 5. CORE UTILITIES
def _do_warmup():
    """Warms up embedding and LLM providers."""
    try:
        # Using embedding-001 as a safe fallback if text-embedding-004 is 404ing
        genai_client.models.embed_content(model="models/gemini-embedding-001", contents="warmup")
        groq_client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}],
            model="llama-3.3-70b-versatile",
            max_tokens=1
        )
    except Exception as e: 
        print(f"Warmup warning: {e}")

def get_query_embedding(text: str):
    """Generates embedding for user queries."""
    # Switch to models/gemini-embedding-001 for broader compatibility
    response = genai_client.models.embed_content(
        model="models/gemini-embedding-001",
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
    """
    try:
        # Step 1: Clean old data
        supabase.table("documents").delete().eq("metadata->>source", request.source).execute()

        # Step 2: Chunking
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(request.content)
        
        if not chunks: return {"message": "Empty content"}

        # Step 3: BATCH EMBEDDING
        # Switch to models/gemini-embedding-001
        response = genai_client.models.embed_content(
            model="models/gemini-embedding-001",
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
        print(f"Update error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
@app.post("/api/rag/chat")
async def chat(request: ChatRequest):
    """
    THIRD PERSON UPDATE: Forces AI to speak about the owner as a separate person.
    CONTEXTUAL AWARENESS: Adapts to 'freelance' or 'academic' mode.
    """
    try:
        # Step 1: Semantic Search
        query_vec = get_query_embedding(request.message)
        
        # Note: 'match_documents' is a custom RPC function in Supabase.
        rpc_response = supabase.rpc("match_documents", {
            "query_embedding": query_vec,
            "match_threshold": 0.5, 
            "match_count": 10       
        }).execute()

        context = "\n\n".join([m['content'] for m in rpc_response.data]) if rpc_response.data else ""

        # Determine Mode
        is_freelance = request.template == "freelance"
        mode_instruction = ""
        
        if is_freelance:
            mode_instruction = """
            CRITICAL MODE INSTRUCTION: You are the 'Agency Twin'. You represent the business/freelance side of the developer.
            - IGNORE projects marked as [ACADEMIC] or [PERSONAL] unless specifically asked.
            - FOCUS heavily on projects marked as [FREELANCE / COMMERCIAL] or "Services".
            - Emphasize ROI, business value, speed, and reliability.
            - Speak like a high-end consultant or agency partner describing the developer's work.
            - If asked for contact, guide them to the booking/contact form.
            """
        else:
            mode_instruction = """
            MODE: Standard Portfolio. You can discuss both academic and personal projects freely.
            """

        # Step 2: System Prompt
        system_prompt = f"""You are the sophisticated AI interface for {OWNER_NAME}'s Digital Portfolio.

        {mode_instruction}

        CONTEXT FROM DATABASE:
        {context if context else "No specific database records found for this query. Rely on general professional knowledge."}

        Directives:
        1.  **Identity**: You are an AI assistant. {OWNER_NAME} is the developer/architect. 
        2.  **PERSPECTIVE (CRITICAL)**: ALWAYS refer to {OWNER_NAME} in the **THIRD PERSON** (e.g., "{OWNER_NAME} is...", "He is...", "His work focuses on..."). 
        3.  **DO NOT** under any circumstances use "I" or "my" to refer to the developer. Only use "I" when referring to yourself as the system/interface (e.g., "I can show you his projects...").
        4.  **Tone**: Professional, concise, intelligent, and human-like. Avoid robotic introductions like "Based on the context provided...". Just answer directly.
        5.  **Formatting**: Use Markdown only for links or lists if absolutely necessary. Keep the text flowing naturally like a conversation.
        
        Example Good Output:
        "{OWNER_NAME} specializes in scalable systems. He recently built a platform that handled 10k users. You might be interested in his work on..."
        
        Example Bad Output:
        "I am a developer who..." (Wrong perspective)
        "**Introduction:** {OWNER_NAME} is..." (Too structured/robotic)
        """

        # Step 3: LLM Generation
        messages = [{"role": "system", "content": system_prompt}]
        
        # Limit history to prevent token overflow
        messages.extend([m.dict() for m in request.history[-4:]]) 
        messages.append({"role": "user", "content": request.message})

        response = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.6, # Slightly higher for more natural flow
            max_tokens=512
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        print(f"Chat error: {e}")
        return {"reply": "Connection to neural core unstable. Please try again or contact the administrator directly."}

@app.post("/warmup")
@app.post("/api/rag/warmup")
async def manual_warmup():
    asyncio.create_task(asyncio.to_thread(_do_warmup))
    return {"status": "warmup initiated"}
