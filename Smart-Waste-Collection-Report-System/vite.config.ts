import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // Allow the sandbox preview hosts (*.e2b.app) in addition to localhost.
    allowedHosts: ['.e2b.app', 'localhost'],
  },
})
