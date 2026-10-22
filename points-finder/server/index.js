// Production server: serves the built UI from dist/ plus the /api routes.
// `npm run build && npm start` → http://localhost:4173

import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { apiMiddleware } from './api.js'
import { loadEnv } from './env.js'

loadEnv()

const DIST = fileURLToPath(new URL('../dist', import.meta.url))
const PORT = Number(process.env.PORT) || 4173
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

const api = apiMiddleware()

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://local').pathname)
  let file = normalize(join(DIST, urlPath))
  if (!file.startsWith(DIST)) {
    res.statusCode = 403
    return res.end()
  }
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html')
  if (!existsSync(file)) {
    res.statusCode = 503
    return res.end('UI not built yet — run `npm run build` first (or use `npm run dev`).')
  }
  res.setHeader('content-type', TYPES[extname(file)] || 'application/octet-stream')
  res.end(readFileSync(file))
}

createServer((req, res) => {
  if (req.url.startsWith('/api/')) return api(req, res)
  serveStatic(req, res)
}).listen(PORT, () => {
  const mode = process.env.SEATS_AERO_API_KEY ? 'live seats.aero data' : 'DEMO data (set SEATS_AERO_API_KEY for live)'
  console.log(`Points Finder → http://localhost:${PORT}  [${mode}]`)
})
