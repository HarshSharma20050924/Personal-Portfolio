import os
import google.generativeai as genai
from supabase import create_client, Client
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY]):
    print("Error: Missing environment variables. Please check .env file.")
    exit(1)

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GOOGLE_API_KEY)

def get_pdf_text(pdf_path):
    text = ""
    pdf_reader = PdfReader(pdf_path)
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def split_text(text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    return text_splitter.split_text(text)

def get_embedding(text):
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_document",
        title="Portfolio Document"
    )
    return result['embedding']

def process_documents():
    docs_folder = "docs"
    if not os.path.exists(docs_folder):
        os.makedirs(docs_folder)
        print(f"Created '{docs_folder}' directory. Please put your PDF/TXT files there and run this script again.")
        return

    files = [f for f in os.listdir(docs_folder) if f.endswith('.pdf') or f.endswith('.txt')]
    
    if not files:
        print("No files found in 'docs/' directory.")
        return

    print(f"Found {len(files)} documents. Processing...")

    for filename in files:
        file_path = os.path.join(docs_folder, filename)
        print(f"Reading {filename}...")
        
        raw_text = ""
        if filename.endswith('.pdf'):
            raw_text = get_pdf_text(file_path)
        else:
            with open(file_path, 'r', encoding='utf-8') as f:
                raw_text = f.read()

        chunks = split_text(raw_text)
        print(f"Split into {len(chunks)} chunks. Generating embeddings...")

        for i, chunk in enumerate(chunks):
            embedding = get_embedding(chunk)
            
            data = {
                "content": chunk,
                "metadata": {"source": filename, "chunk_index": i},
                "embedding": embedding
            }
            
            supabase.table("documents").insert(data).execute()
        
        print(f"Finished uploading {filename}")

if __name__ == "__main__":
    process_documents()