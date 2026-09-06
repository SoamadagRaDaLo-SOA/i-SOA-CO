import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The app MUST bind to 0.0.0.0 so it is reachable behind the sandbox preview proxy.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Accept the dynamic sandbox preview host (e2b.app) that proxies this app.
    allowedHosts: ['.e2b.app', 'localhost'],
    hmr: { host: true },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
})
