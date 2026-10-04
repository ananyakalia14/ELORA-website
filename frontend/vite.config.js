import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/*.mp4', '**/*.avi', '**/*.mov', '**/*.ico', '**/*.png', '**/*.jpg', '**/*.jpeg']
      },
      proxy: {
        '/auth': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/orders': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/cart': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/products': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/admin': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/recommendations': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      }
    }
  }
})


