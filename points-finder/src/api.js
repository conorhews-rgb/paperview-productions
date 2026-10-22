// Client-side API layer. Normally this talks to the local /api server; the
// hosted preview build (VITE_STATIC=1) has no server, so it runs the same
// validation and demo provider directly in the browser.

import { parseSearch } from '../server/api.js'
import { searchDemo } from '../server/providers/demo.js'
import { TRANSFER_DATA_AS_OF } from '../shared/currencies.js'

export const STATIC = import.meta.env.VITE_STATIC === '1'

export async function getMeta() {
  if (STATIC) return { live: false, provider: 'demo', static: true, transferDataAsOf: TRANSFER_DATA_AS_OF }
  const res = await fetch('/api/meta')
  return res.json()
}

export async function searchAwards(form) {
  if (STATIC) {
    const query = parseSearch(form)
    return { query, ...(await searchDemo(query)) }
  }
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(form),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Search failed')
  return json
}

export async function getTrips(id) {
  const res = await fetch(`/api/trips/${encodeURIComponent(id)}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Could not load flight details')
  return json.trips
}
