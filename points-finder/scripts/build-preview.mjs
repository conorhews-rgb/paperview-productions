// Builds a single self-contained HTML file of the app running on in-browser
// demo data (no server), for sharing as a hosted preview.
//
//   npm run build:preview  →  dist-preview/points-finder.html

import { build } from 'vite'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const tmp = join(root, 'dist-preview', 'build')
process.env.VITE_STATIC = '1'
await build({ root, base: './', logLevel: 'warn', build: { outDir: tmp, emptyOutDir: true, assetsInlineLimit: Infinity } })

const assets = join(tmp, 'assets')
const read = (ext) => readdirSync(assets).filter((f) => f.endsWith(ext)).map((f) => readFileSync(join(assets, f), 'utf8'))
const css = read('.css').join('\n')
const js = read('.js').join('\n').replace(/<\/script/gi, '<\\/script')

const html = `<title>Points Finder</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Find the cheapest award flights for the credit card points you actually hold.">
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`
mkdirSync(join(root, 'dist-preview'), { recursive: true })
writeFileSync(join(root, 'dist-preview', 'points-finder.html'), html)
console.log(`dist-preview/points-finder.html (${(html.length / 1024).toFixed(0)} KB)`)
