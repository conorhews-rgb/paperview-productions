// Cash-fare estimates and cents-per-point math.
//
// We don't have a cash fare feed, so a one-way cash price is estimated from
// distance and cabin. It is only used to show "value per point", and the UI
// lets people type in the real cash fare to replace it.

const CABIN_FARE = {
  economy: { base: 100, perMile: 0.08 },
  premium: { base: 200, perMile: 0.18 },
  business: { base: 400, perMile: 0.5 },
  first: { base: 800, perMile: 1.1 },
}

export function estimateCashFare(distance, cabin) {
  const f = CABIN_FARE[cabin] || CABIN_FARE.business
  if (!distance) return null
  return Math.round((f.base + distance * f.perMile) / 10) * 10
}

// Rough USD conversion for taxes quoted in other currencies.
const FX_TO_USD = {
  USD: 1,
  CAD: 0.73,
  EUR: 1.08,
  GBP: 1.27,
  AUD: 0.66,
  NZD: 0.6,
  JPY: 0.0067,
  SGD: 0.75,
  HKD: 0.128,
  AED: 0.272,
  QAR: 0.275,
  MXN: 0.055,
  BRL: 0.18,
}

export function toUsd(amount, currency = 'USD') {
  if (amount == null) return null
  const rate = FX_TO_USD[(currency || 'USD').toUpperCase()]
  return rate == null ? amount : amount * rate
}

/** Cents of cash fare saved per mile spent. */
export function centsPerPoint(cashFare, taxes, miles) {
  if (!cashFare || !miles) return null
  return Math.max(0, ((cashFare - (taxes || 0)) / miles) * 100)
}

export function valueTier(cpp) {
  if (cpp == null) return 'unknown'
  if (cpp >= 5) return 'outstanding'
  if (cpp >= 2.5) return 'great'
  if (cpp >= 1.5) return 'good'
  return 'poor'
}
