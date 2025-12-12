import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
from groq import Groq
import google.generativeai as genai
from dotenv import load_dotenv

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
genai.configure(api_key=GOOGLE_API_KEY)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message]

def get_embedding(text):
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_query"
    )
    return result['embedding']

@app.get("/")
def read_root():
    return {"status": "RAG Service Running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # 1. Generate embedding for the user query
        query_embedding = get_embedding(request.message)

        # 2. Search Supabase for relevant documents
        response = supabase.rpc(
            "match_documents",
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.5, # Adjust based on result quality
                "match_count": 5
            }
        ).execute()
        
        matches = response.data
        
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
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=500,
        )

        return {"reply": chat_completion.choices[0].message.content}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))