
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
        # Using gemini-embedding-001 as a safe fallback if text-embedding-004 is 404ing
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
    "embedding_3072": response.embeddings[i].values,
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
    STRICT MODE ENFORCEMENT: Separates Freelance vs Academic contexts.
    PATH ISOLATION: Ensures generated links exist within the active template.
    """
    try:
        # Step 1: Semantic Search
        query_vec = get_query_embedding(request.message)
        
        rpc_response = supabase.rpc("match_documents", {
            "query_embedding": query_vec,
            "match_threshold": 0.5, 
            "match_count": 10       
        }).execute()

        context = "\n\n".join([m['content'] for m in rpc_response.data]) if rpc_response.data else ""

        # Step 2: Strict Mode Logic
        is_freelance = request.template == "freelance"
        
        if is_freelance:
            site_map_instruction = """
            STRICT NAVIGATION (FREELANCE):
            - Contact Form: `/contact` (Do NOT use #contact)
            - Work Index: `/work`
            - Services: `/` (The home page)
            - Specific Service: `/service/:id`
            """
            mode_instruction = """
            STRICT IDENTITY: FREELANCE / AGENCY PARTNER
            1. AUDIENCE: Business Clients (B2B).
            2. FOCUS: ROI, Automation, Scalability, Business Systems.
            3. CONSTRAINT: IGNORE academic projects, leetcode stats, or "junior" developer traits. Focus on COMMERCIAL experience.
            4. TONE: Executive, confident, concise.
            """
        else:
            # Elite / Standard / Academic Mode
            site_map_instruction = """
            STRICT NAVIGATION (ELITE/PORTFOLIO):
            - Contact Section: `#contact` (Do NOT use /contact)
            - Projects/Work: `#work` (or `#projects`)
            - Experience: `#experience`
            - Blog: `/blogs`
            - Gallery: `/gallery`
            """
            mode_instruction = """
            STRICT IDENTITY: TECHNICAL ARCHITECT / ENGINEER
            1. AUDIENCE: Recruiters, CTOs, Developers.
            2. FOCUS: Code quality, Algorithms, Stack depth, Innovation.
            3. CONSTRAINT: Discuss both academic and personal projects. Highlight technical complexity.
            4. TONE: Sophisticated, intelligent, detailed.
            """

        # Step 3: System Prompt Construction
        system_prompt = f"""You are the AI interface for {OWNER_NAME}'s Digital Portfolio.

        {mode_instruction}

        {site_map_instruction}

        CONTEXT FROM KNOWLEDGE BASE:
        {context if context else "No specific database records found. Rely on general professional knowledge compatible with the current mode."}

        CRITICAL DIRECTIVES:
        1. **Third Person Only**: Always refer to {OWNER_NAME} as "he", "him", or "{OWNER_NAME}". Never use "I" for the developer.
        2. **Link Safety**: ONLY recommend links listed in "STRICT NAVIGATION". Do not hallucinate paths from other templates.
        3. **Context Isolation**: 
           - If in FREELANCE mode, do not send users to academic blogs or the elite contact section.
           - If in ELITE mode, do not send users to the freelance lead form (/contact).
        4. **Output**: Markdown format.

        Example Interaction (Correct Mode):
        User: "How can I hire him?"
        Bot (Freelance): "You can initiate a project proposal via the [Contact Form](/contact)."
        Bot (Elite): "You can reach out directly through the [Contact Section](#contact) below."
        """

        # Step 4: LLM Generation
        messages = [{"role": "system", "content": system_prompt}]
        
        # Limit history
        messages.extend([m.dict() for m in request.history[-4:]]) 
        messages.append({"role": "user", "content": request.message})

        response = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.5, 
            max_tokens=512
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        print(f"Chat error: {e}")
        return {"reply": "Connection to neural core unstable. Please try again."}

@app.post("/warmup")
@app.post("/api/rag/warmup")
async def manual_warmup():
    asyncio.create_task(asyncio.to_thread(_do_warmup))
    return {"status": "warmup initiated"}
