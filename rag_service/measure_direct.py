"""Simple measurement script to measure embedding and model chat cold vs warm.

Usage:
    python measure_direct.py

Make sure env vars (SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY, GROQ_API_KEY) are set.
"""
import time
from main import get_embedding, groq_client


def measure_embedding(text="Hello warmup test"):
    start = time.time()
    try:
        emb = get_embedding(text)
        duration = time.time() - start
        print(f"Embedding took {duration:.3f}s. Embedding length: {len(emb)}")
    except Exception as e:
        duration = time.time() - start
        print(f"Embedding failed after {duration:.3f}s: {e}")


def measure_groq_chat():
    start = time.time()
    try:
        resp = groq_client.chat.completions.create(
            messages=[{"role": "system", "content": "Ping."}, {"role": "user", "content": "Hi"}],
            model="llama-3.3-70b-versatile",
            temperature=0.0,
            max_tokens=1,
        )
        duration = time.time() - start
        print(f"Groq chat took {duration:.3f}s. Response size: {len(str(resp))}")
    except Exception as e:
        duration = time.time() - start
        print(f"Groq chat failed after {duration:.3f}s: {e}")


if __name__ == "__main__":
    print("=== First (cold) run ===")
    measure_embedding()
    measure_groq_chat()

    print("\n=== Second (warm) run ===")
    measure_embedding()
    measure_groq_chat()
