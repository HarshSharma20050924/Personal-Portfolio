import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Test single embedding
print("Testing single document:")
result1 = genai.embed_content(
    model='models/text-embedding-004',
    content=["Test document"],
    task_type="retrieval_document",
    title="Test"
)
print(f"Type: {type(result1)}")
print(f"Keys: {result1.keys() if isinstance(result1, dict) else 'N/A'}")
if 'embedding' in result1:
    emb = result1['embedding']
    print(f"Embedding type: {type(emb)}")
    print(f"Embedding is list: {isinstance(emb, list)}")
    if isinstance(emb, list):
        print(f"Embedding length: {len(emb)}")
        if len(emb) > 0:
            print(f"First element type: {type(emb[0])}")

# Test multiple embeddings
print("\nTesting multiple documents:")
result2 = genai.embed_content(
    model='models/text-embedding-004',
    content=["Test 1", "Test 2", "Test 3"],
    task_type="retrieval_document",
    title="Test"
)
print(f"Type: {type(result2)}")
print(f"Keys: {result2.keys() if isinstance(result2, dict) else 'N/A'}")
if 'embedding' in result2:
    emb = result2['embedding']
    print(f"Embedding type: {type(emb)}")
    print(f"Embedding is list: {isinstance(emb, list)}")
    if isinstance(emb, list):
        print(f"Embedding length: {len(emb)}")
        if len(emb) > 0:
            print(f"First element type: {type(emb[0])}")
            if isinstance(emb[0], list):
                print(f"First element is list of length: {len(emb[0])}")
                if len(emb[0]) > 0:
                    print(f"First element of first list type: {type(emb[0][0])}")
