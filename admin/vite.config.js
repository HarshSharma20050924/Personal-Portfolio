import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This is crucial for deploying to a subdirectory like /admin
  base: '/admin/',
  plugins: [react()],
  server: {
    port: 5174, // Different port from the client app
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})