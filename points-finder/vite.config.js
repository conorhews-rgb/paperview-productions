import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { apiMiddleware } from './server/api.js'
import { loadEnv } from './server/env.js'

loadEnv()

// Mount the /api routes on the dev server so `npm run dev` is one process.
const api = () => ({
  name: 'points-finder-api',
  configureServer(server) {
    server.middlewares.use('/api', apiMiddleware())
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api', apiMiddleware())
  },
})

export default defineConfig({
  plugins: [react(), api()],
})
