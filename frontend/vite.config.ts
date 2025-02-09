import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
//iadded
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),// iadded
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:49152',
        changeOrigin: true,
        secure: false,
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    }
  },
})
