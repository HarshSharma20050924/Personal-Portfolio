"""Measure HTTP latency for /chat endpoint (cold vs warm).

Usage:
  1. Start the service, e.g.: uvicorn main:app --port 8000
  2. Run this script: python measure_http.py

The script sends one request, waits 2s, and sends another to compare.
"""
import time
import requests

URL = "http://127.0.0.1:8000/chat"

payload = {
    "message": "What is this portfolio about?",
    "history": []
}

headers = {"Content-Type": "application/json"}


def send_once():
    start = time.time()
    try:
        r = requests.post(URL, json=payload, headers=headers, timeout=60)
        duration = time.time() - start
        print(f"Status: {r.status_code}, Duration: {duration:.3f}s, Response: {r.text[:200]}")
    except Exception as e:
        duration = time.time() - start
        print(f"Request failed after {duration:.3f}s: {e}")


if __name__ == "__main__":
    print("=== First (cold) request ===")
    send_once()
    print("Waiting 2s before second request...")
    time.sleep(2)
    print("=== Second (warm) request ===")
    send_once()
