import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // PROXY: Any request starting with /api will be forwarded to the backend.
  // This means instead of writing fetch('http://localhost:5000/api/auth/login')
  // you just write fetch('/api/auth/login') and Vite handles the rest.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
