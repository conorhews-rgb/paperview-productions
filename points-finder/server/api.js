// HTTP API, written as connect-style middleware so it runs both inside the
// Vite dev server and in the standalone production server.
//
//   GET  /api/meta          → provider status + currencies/programs tables
//   POST /api/search        → raw award availability for a route + date range
//   GET  /api/trips/:id     → flight-level detail (live mode only)
//
// Scoring against the wallet happens client-side (shared/optimizer.js), so
// editing balances re-ranks instantly without spending API calls.

import { expandLocation } from '../shared/airports.js'
import { CURRENCIES, TRANSFER_DATA_AS_OF } from '../shared/currencies.js'
import { PROGRAMS } from '../shared/programs.js'
import { searchDemo } from './providers/demo.js'
import { searchSeatsAero, tripDetails } from './providers/seatsAero.js'

const CABINS = ['economy', 'premium', 'business', 'first']
const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_DAYS = 60
const cache = new Map()

const apiKey = () => process.env.SEATS_AERO_API_KEY?.trim() || ''

/** Validate a search request and expand city codes. Throws on bad input. */
export function parseSearch(body = {}) {
  const origins = expandLocation(body.from)
  const destinations = expandLocation(body.to)
  if (!origins.length) throw badRequest('Enter an origin airport or city (e.g. BOS).')
  if (!destinations.length) throw badRequest('Enter a destination airport or city (e.g. TYO).')
  if (origins.length > 10 || destinations.length > 10) throw badRequest('Too many airports (max 10 each side).')

  const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !Number.isNaN(Date.parse(s))
  if (!isDate(body.startDate)) throw badRequest('Start date must be YYYY-MM-DD.')
  const endDate = body.endDate || body.startDate
  if (!isDate(endDate)) throw badRequest('End date must be YYYY-MM-DD.')
  const days = (Date.parse(endDate) - Date.parse(body.startDate)) / 86400000
  if (days < 0) throw badRequest('End date is before start date.')
  if (days > MAX_DAYS) throw badRequest(`Search at most ${MAX_DAYS} days at a time.`)

  const cabin = CABINS.includes(body.cabin) ? body.cabin : 'business'
  return {
    origins,
    destinations,
    startDate: body.startDate,
    endDate,
    cabin,
    directOnly: !!body.directOnly,
  }
}

/** Run a search against seats.aero if a key is configured, otherwise demo data. */
export async function runSearch(query, { forceDemo = false } = {}) {
  const live = !!apiKey() && !forceDemo
  const key = JSON.stringify([live, query])
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return { ...hit.value, cached: true }

  const value = live ? await searchSeatsAero(query, apiKey()) : await searchDemo(query)
  cache.set(key, { at: Date.now(), value })
  return value
}

function badRequest(message) {
  const err = new Error(message)
  err.status = 400
  return err
}

function send(res, status, data) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

async function readJson(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 100_000) throw badRequest('Request too large.')
  }
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    throw badRequest('Body must be JSON.')
  }
}

export function apiMiddleware() {
  return async (req, res, next) => {
    const url = new URL(req.url, 'http://local')
    // Under Vite's `use('/api', …)` the prefix is stripped; standalone it isn't.
    const path = url.pathname.replace(/^\/api(?=\/|$)/, '') || '/'

    try {
      if (req.method === 'GET' && path === '/meta') {
        return send(res, 200, {
          live: !!apiKey(),
          provider: apiKey() ? 'seats.aero' : 'demo',
          transferDataAsOf: TRANSFER_DATA_AS_OF,
          currencies: Object.values(CURRENCIES).map(({ id, name, short, cards, cpp }) => ({ id, name, short, cards, cpp })),
          programs: Object.values(PROGRAMS).map(({ id, name, alliance }) => ({ id, name, alliance })),
        })
      }

      if (req.method === 'POST' && path === '/search') {
        const body = await readJson(req)
        const query = parseSearch(body)
        const result = await runSearch(query, { forceDemo: !!body.demo })
        return send(res, 200, { query, ...result })
      }

      const trip = path.match(/^\/trips\/([\w-]+)$/)
      if (req.method === 'GET' && trip) {
        if (!apiKey()) return send(res, 404, { error: 'Flight details need a seats.aero API key.' })
        return send(res, 200, { trips: await tripDetails(trip[1], apiKey()) })
      }

      if (next) return next()
      send(res, 404, { error: 'Not found' })
    } catch (err) {
      send(res, err.status || 502, { error: err.message || 'Search failed' })
    }
  }
}
