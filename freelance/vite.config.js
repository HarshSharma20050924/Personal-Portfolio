import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Uncomment to analyze bundle size
    // visualizer({ open: true, gzipSize: true, brotliSize: true })
  ],
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
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js into its own chunk
          'three-core': ['three'],
          'three-addons': ['@react-three/fiber', '@react-three/drei', '@react-three/rapier'],
          // Split animation libraries
          'animations': ['framer-motion', 'gsap'],
          // Split React into its own chunk
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Increase chunk size warning limit (since Three.js is large)
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (optional, disable for smaller builds)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
})