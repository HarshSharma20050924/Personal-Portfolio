// Central API base URL — reads from Vercel env var, falls back to relative (local dev via Vite proxy)
const BASE = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;

export default API_BASE;
