import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  server: {
    port: 5173,
    proxy: {
      '/api/rag': {
        target: 'http://localhost:8000', // Python RAG Server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rag/, '')
      },
      '/api': {
        target: 'http://localhost:3001', // Node/Express Server
        changeOrigin: true,
      },
    },
  },
})