// Minimal .env loader (no dependency): KEY=value lines, # comments.
// Real environment variables win over the file.

import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ENV_PATH = fileURLToPath(new URL('../.env', import.meta.url))

export function loadEnv() {
  if (!existsSync(ENV_PATH)) return
  for (const line of readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m || line.trim().startsWith('#')) continue
    const value = m[2].replace(/^(['"])(.*)\1$/, '$2')
    if (process.env[m[1]] === undefined) process.env[m[1]] = value
  }
}
