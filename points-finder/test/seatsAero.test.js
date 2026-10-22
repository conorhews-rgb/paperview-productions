import { test } from 'node:test'
import assert from 'node:assert/strict'
import { searchSeatsAero } from '../server/providers/seatsAero.js'

// Shape of a seats.aero cached-search row (trimmed to the fields we read).
const row = (over) => ({
  ID: 'abc123',
  Route: { OriginAirport: 'BOS', DestinationAirport: 'HND', Distance: 6700, Source: 'aeroplan' },
  Date: '2026-12-03',
  Source: 'aeroplan',
  JAvailable: true,
  JMileageCost: '75,000',
  JTotalTaxes: 8655,
  JRemainingSeats: 2,
  JAirlines: 'NH, UA',
  JDirect: false,
  TaxesCurrency: 'USD',
  UpdatedAt: '2026-10-21T10:00:00Z',
  ...over,
})

test('maps seats.aero rows, paginates and drops unavailable cabins', async () => {
  const calls = []
  const pages = [
    { data: [row(), row({ ID: 'nope', JAvailable: false })], hasMore: true, cursor: 99 },
    { data: [row({ ID: 'def', Source: 'united', JMileageCost: '88000', JDirect: true, JAirlines: 'UA' })], hasMore: false },
  ]
  const realFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), auth: init.headers['Partner-Authorization'] })
    return { ok: true, json: async () => pages.shift() }
  }
  try {
    const { awards, meta } = await searchSeatsAero(
      { origins: ['BOS'], destinations: ['HND', 'NRT'], startDate: '2026-12-01', endDate: '2026-12-07', cabin: 'business' },
      'KEY',
    )
    assert.equal(meta.live, true)
    assert.equal(calls.length, 2)
    assert.equal(calls[0].auth, 'KEY')
    assert.match(calls[0].url, /destination_airport=HND%2CNRT/)
    assert.match(calls[1].url, /cursor=99/)

    assert.equal(awards.length, 2)
    const [a, b] = awards
    assert.deepEqual(
      { program: a.program, miles: a.miles, taxes: a.taxes, seats: a.seats, carriers: a.carriers, direct: a.direct, source: a.source },
      { program: 'aeroplan', miles: 75000, taxes: 86.55, seats: 2, carriers: ['NH', 'UA'], direct: false, source: 'live' },
    )
    assert.equal(b.program, 'united')
    assert.equal(b.direct, true)
  } finally {
    globalThis.fetch = realFetch
  }
})

test('surfaces API errors', async () => {
  const realFetch = globalThis.fetch
  globalThis.fetch = async () => ({ ok: false, status: 401, statusText: 'Unauthorized', text: async () => 'bad key' })
  try {
    await assert.rejects(
      searchSeatsAero({ origins: ['BOS'], destinations: ['HND'], startDate: '2026-12-01', endDate: '2026-12-01', cabin: 'business' }, 'x'),
      /401: bad key/,
    )
  } finally {
    globalThis.fetch = realFetch
  }
})
