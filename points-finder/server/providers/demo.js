// Synthetic award availability for trying the app without a seats.aero key.
//
// Results are deterministic per route/date/program (seeded), shaped like real
// saver-level pricing and carrier coverage, and always flagged
// `source: 'demo'` so the UI can label them. Do not book off demo data.

import { AIRPORTS, distanceMiles } from '../../shared/airports.js'
import { CARRIERS, PROGRAMS } from '../../shared/programs.js'

// Typical one-way business saver price by distance band.
const BANDS = [
  [700, 15000],
  [1500, 25000],
  [3000, 40000],
  [4500, 55000],
  [6000, 65000],
  [7500, 75000],
  [9500, 87500],
  [Infinity, 105000],
]
const CABIN_MULT = { economy: 0.38, premium: 0.6, business: 1, first: 1.55 }
const CABIN_ODDS = { economy: 0.75, premium: 0.35, business: 0.42, first: 0.18 }
const TAX_RANGE = { low: [6, 60], medium: [60, 200], high: [220, 700] }

// Small, fast, seedable PRNG (mulberry32) keyed on a string.
function rng(seedText) {
  let h = 1779033703 ^ seedText.length
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function eachDate(start, end) {
  const out = []
  const d = new Date(`${start}T00:00:00Z`)
  const last = new Date(`${end}T00:00:00Z`)
  while (d <= last && out.length < 62) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

/** Carriers in this program's network that plausibly fly origin → destination. */
function routeCarriers(program, oRegion, dRegion) {
  return program.carriers.filter((code) => {
    const c = CARRIERS[code]
    if (!c) return false
    if (c.connector) return oRegion !== c.hub && dRegion !== c.hub ? oRegion !== dRegion : true
    return c.hub === oRegion || c.hub === dRegion
  })
}

export async function searchDemo({ origins, destinations, startDate, endDate, cabin }) {
  const results = []
  const dates = eachDate(startDate, endDate)

  for (const origin of origins) {
    for (const destination of destinations) {
      const O = AIRPORTS[origin]
      const D = AIRPORTS[destination]
      if (!O || !D || origin === destination) continue
      const distance = distanceMiles(origin, destination)
      const bandPrice = BANDS.find(([max]) => distance <= max)[1]

      for (const program of Object.values(PROGRAMS)) {
        const carriers = routeCarriers(program, O.region, D.region)
        if (!carriers.length) continue
        // Domestic-only programs don't sell long-haul international awards.
        if (['southwest', 'jetblue'].includes(program.id) && O.region !== D.region && distance > 3500) continue

        for (const date of dates) {
          const r = rng(`${origin}-${destination}-${program.id}-${cabin}-${date}`)
          if (r() > CABIN_ODDS[cabin] * (program.dynamic ? 1.3 : 1)) continue

          const carrier = carriers[Math.floor(r() * carriers.length)]
          const c = CARRIERS[carrier]
          const homeEnd = c.hub === O.region || c.hub === D.region
          const direct = homeEnd && !c.connector && r() < 0.45
          const legs = direct ? [carrier] : pickConnection(carrier, carriers, r)

          let miles = bandPrice * CABIN_MULT[cabin] * program.priceFactor
          if (program.dynamic) miles *= 1 + (r() < 0.35 ? 0 : r() * 1.6)
          if (!direct) miles *= 0.97
          miles = Math.round(miles / 500) * 500

          const [lo, hi] = TAX_RANGE[program.taxes]
          const taxScale = cabin === 'economy' ? 0.5 : 1
          const taxes = Math.round((lo + r() * (hi - lo)) * taxScale * 100) / 100

          results.push({
            id: `demo-${origin}${destination}-${program.id}-${date}`,
            program: program.id,
            date,
            origin,
            destination,
            cabin,
            miles,
            taxes,
            taxesCurrency: 'USD',
            seats: 1 + Math.floor(r() * (cabin === 'economy' ? 9 : 4)),
            direct,
            carriers: legs,
            stops: direct ? 0 : 1,
            distance,
            source: 'demo',
            updatedAt: null,
          })
        }
      }
    }
  }
  return { awards: results, meta: { provider: 'demo', live: false } }
}

function pickConnection(carrier, carriers, r) {
  const others = carriers.filter((c) => c !== carrier)
  if (!others.length || r() < 0.55) return [carrier]
  return [carrier, others[Math.floor(r() * others.length)]]
}
