# RAG Service

This service hosts a simple Retrieval-Augmented Generation (RAG) API using:
- Google Generative API for embeddings
- Groq for LLM chat completions
- Supabase for document storage and vector search

## Important env vars
- `SUPABASE_URL`, `SUPABASE_KEY`
- `GOOGLE_API_KEY`
- `GROQ_API_KEY`

## Warmup
Cold starts on the embedding or LLM provider can make the very first request slow. The service includes a non-blocking startup warmup that:
- calls a small embedding
- sends a tiny Groq chat (1 token max)

Configuration:
- `WARMUP_ENABLED` (default `true`) — set to `false` to disable
- `WARMUP_KEEPALIVE_INTERVAL` (seconds, default `0`) — if >0, periodically runs warmups

You can also trigger a warmup manually:

POST /warmup -> returns `{ "status": "warmup triggered" }`

## Measuring cold vs warm
- `python measure_direct.py` — measures raw embedding and Groq chat times
- `python measure_http.py` — measures HTTP `/chat` endpoint cold vs warm

## Run locally
1. Install dependencies and set env vars
2. Start server:

```bash
uvicorn main:app --reload --port 8000
```

3. Try warmup manually:

```bash
curl -X POST http://127.0.0.1:8000/warmup
```

## Notes
- Periodic keepalive can incur extra cost (embedding + small LLM calls). Only enable if you need very low latency for live traffic.
- Large LLM models (70B) may still have non-negligible first-request latency at provider level; warmup mitigates much of that in practice.
