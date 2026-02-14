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

# =========================================================
# 1. ENVIRONMENT SETUP
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OWNER_NAME = os.getenv("PORTFOLIO_OWNER_NAME", "Harsh Sharma")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing Supabase credentials")

if not GROQ_API_KEY:
    raise RuntimeError("Missing GROQ_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("Missing GOOGLE_API_KEY")

# =========================================================
# 2. FASTAPI LIFESPAN (prevents cold start delay)
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("WARMUP_ENABLED", "true").lower() == "true":
        asyncio.create_task(asyncio.to_thread(_do_warmup))
    yield

app = FastAPI(lifespan=lifespan)

# =========================================================
# 3. CLIENT INITIALIZATION
# =========================================================

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

groq_client = Groq(api_key=GROQ_API_KEY)

genai_client = genai.Client(api_key=GOOGLE_API_KEY)

EMBEDDING_MODEL = "models/gemini-embedding-001"

# =========================================================
# 4. DATA MODELS
# =========================================================

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

# =========================================================
# 5. WARMUP FUNCTION
# =========================================================

def _do_warmup():
    try:
        genai_client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents="warmup",
        )

        groq_client.chat.completions.create(
            messages=[{"role": "user", "content": "hi"}],
            model="llama-3.3-70b-versatile",
            max_tokens=1
        )

        print("Warmup successful")

    except Exception as e:
        print(f"Warmup warning: {e}")

# =========================================================
# 6. EMBEDDING GENERATOR
# =========================================================

def get_query_embedding(text: str):

    response = genai_client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type="retrieval_query"
        )
    )

    return response.embeddings[0].values

# =========================================================
# 7. HEALTH CHECK
# =========================================================

@app.get("/")
@app.get("/api/rag/")
async def health_check():
    return {
        "status": "RAG Service Online",
        "owner": OWNER_NAME,
        "embedding_model": EMBEDDING_MODEL
    }

# =========================================================
# 8. UPDATE KNOWLEDGE ENDPOINT
# =========================================================

@app.post("/update-knowledge")
@app.post("/api/rag/update-knowledge")
async def update_knowledge(request: UpdateKnowledgeRequest):

    try:

        supabase.table("documents") \
            .delete() \
            .eq("metadata->>source", request.source) \
            .execute()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

        chunks = splitter.split_text(request.content)

        if not chunks:
            return {"message": "Empty content"}

        embedding_response = genai_client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=chunks,
            config=types.EmbedContentConfig(
                task_type="retrieval_document",
                title="Portfolio Knowledge"
            )
        )

        records = []

        for i, chunk in enumerate(chunks):

            records.append({
                "content": chunk,
                "embedding": embedding_response.embeddings[i].values,
                "metadata": {
                    "source": request.source,
                    "created_at": int(time.time())
                }
            })

        supabase.table("documents").insert(records).execute()

        return {
            "status": "success",
            "chunks_inserted": len(records),
            "embedding_dimension": len(records[0]["embedding"])
        }

    except Exception as e:

        print("Update error:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# =========================================================
# 9. CHAT ENDPOINT
# =========================================================

@app.post("/chat")
@app.post("/api/rag/chat")
async def chat(request: ChatRequest):

    try:

        query_vector = get_query_embedding(request.message)

        rpc = supabase.rpc(
            "match_documents",
            {
                "query_embedding": query_vector,
                "match_threshold": 0.5,
                "match_count": 10
            }
        ).execute()

        context = ""

        if rpc.data:
            context = "\n\n".join(x["content"] for x in rpc.data)

        is_freelance = request.template == "freelance"

        if is_freelance:

            mode_instruction = """
FREELANCE MODE ACTIVE.
Focus on commercial work.
Ignore academic projects unless explicitly requested.
Emphasize ROI, speed, reliability, scalability.
"""

        else:

            mode_instruction = """
PORTFOLIO MODE ACTIVE.
Academic and personal projects allowed.
"""

        system_prompt = f"""
You are the AI interface for {OWNER_NAME}'s portfolio.

{mode_instruction}

Context:
{context if context else "No DB match. Use general professional knowledge."}

Rules:
• Refer to {OWNER_NAME} in THIRD PERSON.
• Output MUST be markdown.
• Tone: elite, concise, professional.
"""

        messages = [{"role": "system", "content": system_prompt}]

        messages.extend([m.dict() for m in request.history[-4:]])

        messages.append({
            "role": "user",
            "content": request.message
        })

        llm = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.4,
            max_tokens=512
        )

        return {
            "reply": llm.choices[0].message.content
        }

    except Exception as e:

        print("Chat error:", e)

        return {
            "reply": "System temporarily unavailable."
        }

# =========================================================
# 10. MANUAL WARMUP
# =========================================================

@app.post("/warmup")
@app.post("/api/rag/warmup")
async def warmup():

    asyncio.create_task(asyncio.to_thread(_do_warmup))

    return {"status": "warmup started"}
