// Live award availability from the seats.aero Partner API (cached search).
// Needs a seats.aero Pro API key: https://seats.aero/apikey
// Docs: https://developers.seats.aero/reference
//
// seats.aero continuously scrapes ~25 airline programs and returns one row
// per (route, date, program) with per-cabin pricing; we flatten that into the
// same normalized award shape the demo provider produces.

import { distanceMiles } from '../../shared/airports.js'

const BASE = 'https://seats.aero/partnerapi'
const CABIN_PREFIX = { economy: 'Y', premium: 'W', business: 'J', first: 'F' }
const MAX_PAGES = 5

const num = (v) => {
  if (v == null || v === '') return null
  const n = typeof v === 'number' ? v : Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

export async function searchSeatsAero(
  { origins, destinations, startDate, endDate, cabin, directOnly },
  apiKey,
) {
  const params = new URLSearchParams({
    origin_airport: origins.join(','),
    destination_airport: destinations.join(','),
    cabins: cabin,
    start_date: startDate,
    end_date: endDate,
    take: '1000',
    order_by: 'lowest_mileage',
  })
  if (directOnly) params.set('only_direct_flights', 'true')

  const rows = []
  let cursor
  for (let page = 0; page < MAX_PAGES; page++) {
    if (cursor) {
      params.set('cursor', String(cursor))
      params.set('skip', String(rows.length))
    }
    const res = await fetch(`${BASE}/search?${params}`, {
      headers: { 'Partner-Authorization': apiKey, accept: 'application/json' },
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`seats.aero ${res.status}: ${body.slice(0, 200) || res.statusText}`)
    }
    const json = await res.json()
    rows.push(...(json.data || []))
    if (!json.hasMore) break
    cursor = json.cursor
  }

  const p = CABIN_PREFIX[cabin] || 'J'
  const awards = rows
    .filter((row) => row[`${p}Available`])
    .map((row) => {
      const origin = row.Route?.OriginAirport ?? row.OriginAirport
      const destination = row.Route?.DestinationAirport ?? row.DestinationAirport
      const taxes = num(row[`${p}TotalTaxes`])
      return {
        id: row.ID,
        program: row.Source ?? row.Route?.Source,
        date: String(row.Date || row.ParsedDate || '').slice(0, 10),
        origin,
        destination,
        cabin,
        miles: num(row[`${p}MileageCostRaw`]) ?? num(row[`${p}MileageCost`]),
        // seats.aero reports taxes in minor units (cents) of TaxesCurrency.
        taxes: taxes == null ? null : taxes / 100,
        taxesCurrency: row.TaxesCurrency || 'USD',
        seats: num(row[`${p}RemainingSeats`]) || null,
        direct: !!row[`${p}Direct`],
        carriers: String(row[`${p}Airlines`] || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        stops: row[`${p}Direct`] ? 0 : null,
        distance: num(row.Route?.Distance) ?? distanceMiles(origin, destination),
        source: 'live',
        updatedAt: row.UpdatedAt || row.ComputedLastSeen || null,
      }
    })
    .filter((a) => a.miles > 0)

  return { awards, meta: { provider: 'seats.aero', live: true, rows: rows.length } }
}

/** Flight-level detail (flight numbers, times, aircraft) for one availability row. */
export async function tripDetails(id, apiKey) {
  const res = await fetch(`${BASE}/trips/${encodeURIComponent(id)}`, {
    headers: { 'Partner-Authorization': apiKey, accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`seats.aero ${res.status}`)
  const json = await res.json()
  return (json.data || []).map((trip) => ({
    cabin: trip.Cabin,
    miles: num(trip.MileageCost),
    taxes: num(trip.TotalTaxes) == null ? null : num(trip.TotalTaxes) / 100,
    taxesCurrency: trip.TaxesCurrency || 'USD',
    seats: num(trip.RemainingSeats),
    stops: num(trip.Stops),
    durationMinutes: num(trip.TotalDuration),
    departsAt: trip.DepartsAt,
    arrivesAt: trip.ArrivesAt,
    flightNumbers: trip.FlightNumbers,
    segments: (trip.AvailabilitySegments || []).map((s) => ({
      flight: s.FlightNumber,
      origin: s.OriginAirport,
      destination: s.DestinationAirport,
      departsAt: s.DepartsAt,
      arrivesAt: s.ArrivesAt,
      aircraft: s.AircraftName,
    })),
  }))
}
