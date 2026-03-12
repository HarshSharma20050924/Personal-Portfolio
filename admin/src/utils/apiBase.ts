// Central API base URL — reads from Vercel env var, falls back to relative (local dev via Vite proxy)
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default API_BASE;
