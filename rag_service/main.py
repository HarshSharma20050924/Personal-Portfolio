
import os
import sys
import logging
from contextlib import asynccontextmanager

# --- SQLite Fix for Vercel/Serverless Environments ---
try:
    __import__('pysqlite3')
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
except ImportError:
    pass
# -----------------------------------------------------

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from groq import Groq
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

# 1. ENVIRONMENT SETUP
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OWNER_NAME = os.getenv("PORTFOLIO_OWNER_NAME", "Harsh Sharma")

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if not GOOGLE_API_KEY:
    logger.warning("GOOGLE_API_KEY not found. Embeddings will not function.")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY not found. Chat generation will not function.")

# 2. CLIENT SETUP
# Gemini for Embeddings (Vector search)
genai.configure(api_key=GOOGLE_API_KEY)

# Groq for Generation (Llama 3.3)
groq_client = Groq(api_key=GROQ_API_KEY)

# Custom Embedding Function using Gemini
class GeminiEmbeddingFunction(embedding_functions.EmbeddingFunction):
    def __init__(self):
        """Initialize the embedding function."""
        super().__init__()
    
    def __call__(self, input: chromadb.Documents) -> chromadb.Embeddings:
        model = 'models/text-embedding-004'
        try:
            # Gemini batch embedding - returns {'embedding': [[float...], [float...], ...]}
            results = genai.embed_content(
                model=model,
                content=input,
                task_type="retrieval_document",
                title="Portfolio Data"
            )
            # The 'embedding' key contains a list of embeddings, one per input document
            if isinstance(results, dict) and 'embedding' in results:
                embeddings = results['embedding']
                # Validate it's in correct format (list of lists)
                if isinstance(embeddings, list) and len(embeddings) > 0:
                    if isinstance(embeddings[0], list):
                        # Correct format: [[float...], [float...], ...]
                        return embeddings
                    else:
                        # Single embedding returned, wrap in list
                        return [embeddings]
                return embeddings
            
            logger.warning(f"Unexpected embedding response format: {results}")
            return [[] for _ in input]  # Fallback
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            return [[] for _ in input]  # Fallback empty embeddings

# ChromaDB (In-Memory/Ephemeral)
# We rely on the Node backend to push the latest data here on startup or save.
chroma_client = chromadb.EphemeralClient()
embedding_fn = GeminiEmbeddingFunction()
collection = chroma_client.get_or_create_collection(
    name="portfolio_knowledge",
    embedding_function=embedding_fn
)

# 3. DATA MODELS
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []

class UpdateKnowledgeRequest(BaseModel):
    text: str

# 4. API ENDPOINTS
app = FastAPI()

@app.get("/")
@app.get("/api/rag/")
def health_check():
    return {
        "status": "RAG Service Online",
        "model": "llama-3.3-70b-versatile",
        "docs_in_memory": collection.count()
    }

@app.post("/update-knowledge")
@app.post("/api/rag/update-knowledge")
async def update_knowledge(request: UpdateKnowledgeRequest):
    """
    Receives full portfolio data from Node.js backend.
    Clears old memory and re-indexes the new data.
    """
    try:
        # Clear existing data to prevent duplicates
        try:
            chroma_client.delete_collection("portfolio_knowledge")
        except:
            pass
        
        # Re-create collection
        new_collection = chroma_client.get_or_create_collection(
            name="portfolio_knowledge",
            embedding_function=embedding_fn
        )
        
        # Split text into chunks (simple newline splitting for portfolio data)
        chunks = [line for line in request.text.split('\n') if line.strip()]
        
        if not chunks:
            return {"message": "No content to index"}

        # Generate IDs
        ids = [str(i) for i in range(len(chunks))]
        
        # Add to Vector DB
        new_collection.add(documents=chunks, ids=ids)
        
        # Update global reference
        global collection
        collection = new_collection
        
        logger.info(f"Knowledge updated. {len(chunks)} documents indexed.")
        return {"status": "success", "indexed_chunks": len(chunks)}
        
    except Exception as e:
        logger.error(f"Update error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
@app.post("/api/rag/chat")
async def chat_endpoint(request: ChatRequest):
    """
    RAG Logic:
    1. Search ChromaDB using Gemini Embeddings.
    2. Generate Answer using Groq (Llama 3.3).
    """
    try:
        user_query = request.message
        
        # 1. Retrieval (Gemini Embeddings)
        query_embedding_result = genai.embed_content(
            model='models/text-embedding-004',
            content=user_query,
            task_type="retrieval_query"
        )
        
        results = collection.query(
            query_embeddings=[query_embedding_result['embedding']],
            n_results=5
        )
        
        context_list = results['documents'][0]
        context_str = "\n\n".join(context_list)
        
        # 2. System Prompt
        system_instruction = f"""You are the AI assistant for {OWNER_NAME}'s Portfolio.
        
        KNOWLEDGE BASE (Strictly adhere to this):
        {context_str if context_str else "No specific database info found."}

        INSTRUCTIONS:
        1. Answer ONLY based on the KNOWLEDGE BASE provided above.
        2. Speak in the THIRD PERSON (e.g., "{OWNER_NAME} is," "He built").
        3. Do NOT make up facts. If the info is missing, say: "I don't have that specific detail in the records."
        4. Be professional, concise, and friendly.
        """

        # 3. Generation (Groq Llama 3.3)
        # Convert history to Groq format
        groq_messages = [{"role": "system", "content": system_instruction}]
        
        for msg in request.history[-5:]:
            role = "user" if msg.role == "user" else "assistant"
            groq_messages.append({"role": role, "content": msg.content})
            
        groq_messages.append({"role": "user", "content": user_query})

        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=groq_messages,
            temperature=0.5,
            max_tokens=500,
            stream=False
        )
        
        return {"reply": completion.choices[0].message.content}

    except Exception as e:
        logger.error(f"Chat error: {e}")
        return {"reply": f"I am currently undergoing system upgrades. Please contact {OWNER_NAME} directly via email."}

@app.get("/warmup")
@app.get("/api/rag/warmup")
def warmup():
    return {"status": "ready", "doc_count": collection.count()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
