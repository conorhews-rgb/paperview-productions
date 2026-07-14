// ============================================================================
// Cloudflare Worker: latest Pixieset gallery proxy (NOT CURRENTLY USED)
// ----------------------------------------------------------------------------
// STATUS: deployed and tested, but Pixieset's storefront returns 403 to
// this Worker's requests (confirmed even with full browser-style headers —
// it's blocking based on network/TLS fingerprint, not user-agent, which
// header changes can't fix). A real browser loads the page fine, so a
// server-side scraper is a dead end without a paid headless-browser
// rendering service, overkill for this feature.
//
// The site instead uses a manually-updated PIXIESET_LATEST object in
// src/data.js — update it by hand whenever a new gallery goes up (takes
// under a minute). This file is kept for reference in case Pixieset's
// bot protection ever changes, or a future fix is worth revisiting.
//
// Original design: fetch the Pixieset storefront server-side (the browser
// can't do this directly cross-origin), pull the most recently posted
// gallery's name/cover/link out of the HTML, and return it as JSON with
// CORS open so the site could fetch it directly on page load.
// ============================================================================

const STOREFRONT_URL = 'https://paperviewproductions.pixieset.com/'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    try {
      const res = await fetch(STOREFRONT_URL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; PaperviewSiteBot/1.0; +https://paperviewproductions.com)',
        },
        // Cache Pixieset's HTML for 30 min so we're not re-fetching on every visitor.
        cf: { cacheTtl: 1800, cacheEverything: true },
      })

      if (!res.ok) {
        throw new Error(`Pixieset responded ${res.status}`)
      }

      const html = await res.text()

      // Match the first "collection-item" card: <a href>, cover background-image
      // url(...), and the <p class="name"> caption. Regex-based HTML scraping is
      // fragile in general, but this markup is simple and stable enough for it.
      const match = html.match(
        /<div class="collection-item[^"]*">\s*<a href="([^"]+)">\s*<div class="image-holder"[^>]*style="background-image:\s*url\(([^)]+)\)[^"]*"[^>]*>\s*<\/div>\s*<p class="name">\s*([\s\S]*?)\s*<\/p>/,
      )

      if (!match) {
        throw new Error('Could not find a gallery on the storefront page')
      }

      const [, href, rawImage, rawName] = match

      let image = rawImage.replace(/^['"]|['"]$/g, '')
      if (image.startsWith('//')) image = `https:${image}`

      const url = href.startsWith('http')
        ? href
        : `https://paperviewproductions.pixieset.com${href}`

      const body = {
        name: rawName.trim(),
        image,
        url,
        fetchedAt: new Date().toISOString(),
      }

      return new Response(JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800',
          ...CORS_HEADERS,
        },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err.message || err) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }
  },
}
