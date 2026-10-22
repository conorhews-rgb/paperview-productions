export const fmtNum = (n) => (n == null ? '—' : Math.round(n).toLocaleString('en-US'))

export const fmtK = (n) => {
  if (n == null) return '—'
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return String(Math.round(n))
}

export const fmtUsd = (n) =>
  n == null ? '—' : `$${Math.round(n).toLocaleString('en-US')}`

export function fmtDate(iso, opts = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', ...opts })
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function datesBetween(start, end) {
  const out = []
  for (let d = start; d <= end && out.length < 62; d = addDays(d, 1)) out.push(d)
  return out
}

export const TIER_LABEL = {
  outstanding: 'Outstanding',
  great: 'Great value',
  good: 'Good value',
  poor: 'Low value',
  unknown: '',
}

export const CABIN_LABEL = {
  economy: 'Economy',
  premium: 'Premium economy',
  business: 'Business',
  first: 'First',
}
