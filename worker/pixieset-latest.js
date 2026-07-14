// ============================================================================
// Cloudflare Worker: latest Pixieset gallery proxy
// ----------------------------------------------------------------------------
// Deploy this on Cloudflare Workers (free tier). It fetches your Pixieset
// storefront server-side (the browser can't do this directly — Pixieset
// doesn't allow cross-origin requests), pulls out the most recently posted
// gallery's name, cover photo, and link, and returns it as JSON with CORS
// headers open so paperviewproductions.com (or the GitHub Pages URL) can
// fetch it directly.
//
// SETUP (no coding needed, just paste-and-deploy):
//   1. Sign up free at https://dash.cloudflare.com/sign-up
//   2. Workers & Pages -> Create -> Create Worker
//   3. Deploy the default template once (to create it), then "Edit code"
//   4. Replace ALL the code in the editor with this file's contents
//   5. Save and Deploy
//   6. Copy the URL it gives you (looks like
//      https://<worker-name>.<your-subdomain>.workers.dev) and send it back
//      to be wired into the website (PIXIESET_LATEST_API in src/data.js).
//
// If Pixieset ever redesigns their storefront page, this scraper may need
// a small update to match their new HTML. It fails safe: the website falls
// back to a generic camera icon if this ever returns an error.
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
