// Turn a plain-English trip description into search fields, e.g.
//   "Boston to Tokyo business Dec 1-7 for 2"
//   "from nyc to london first class in march"
//   "BOS → HND 2026-12-03"
// Returns only the fields it could read; the form keeps the rest.

import { expandLocation } from './airports.js'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 }
const STOP_WORDS = new Set([
  'in', 'on', 'for', 'around', 'between', 'during', 'next', 'this', 'from', 'leaving', 'departing',
  'business', 'biz', 'first', 'economy', 'coach', 'premium', 'class', 'cabin', 'nonstop', 'direct',
  ...MONTHS,
])

const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const daysIn = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate()

/** Longest run of leading words that resolves to an airport, city or metro. */
function readPlace(words) {
  const usable = []
  for (const w of words) {
    if (STOP_WORDS.has(w.toLowerCase()) || /^\d/.test(w)) break
    usable.push(w)
  }
  for (let n = usable.length; n > 0; n--) {
    const text = usable.slice(0, n).join(' ')
    if (expandLocation(text).length && (n > 1 || text.length >= 3)) {
      return /^[a-z]{3}$/i.test(text) ? text.toUpperCase() : text.replace(/\b\w/g, (c) => c.toUpperCase())
    }
  }
  return null
}

export function parseQuery(text, today = new Date()) {
  const out = {}
  const s = ` ${text.trim().replace(/[→>]|->/g, ' to ').replace(/\s+/g, ' ')} `
  const lower = s.toLowerCase()

  const toIdx = lower.indexOf(' to ')
  if (toIdx > 0) {
    const before = s.slice(0, toIdx).trim().split(' ')
    // Origin: the words right before "to", skipping a leading "from"/"fly".
    for (let i = 0; i < before.length; i++) {
      const place = readPlace(before.slice(i).filter((w) => !/^(from|fly|flying|flights?)$/i.test(w)))
      if (place && expandLocation(place).length) {
        const consumed = before.slice(i).join(' ').toLowerCase()
        if (consumed.replace(/^(from|fly|flying|flights?) /, '') === place.toLowerCase()) {
          out.from = place
          break
        }
      }
    }
    const to = readPlace(s.slice(toIdx + 4).trim().split(' '))
    if (to) out.to = to
  }

  if (/\bbusiness\b|\bbiz\b|\blie[- ]?flat\b/.test(lower)) out.cabin = 'business'
  else if (/\bfirst class\b|\bfirst(?!\s+(?:week|half|of|few))\b/.test(lower)) out.cabin = 'first'
  else if (/\bpremium\b/.test(lower)) out.cabin = 'premium'
  else if (/\beconomy\b|\bcoach\b/.test(lower)) out.cabin = 'economy'

  const pax =
    lower.match(/\bfor (\d+|one|two|three|four|five|six|seven|eight|nine)\b(?! (?:day|night|week))/) ||
    lower.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine) (?:people|persons|passengers|pax|adults|travell?ers|of us)\b/)
  if (pax) out.passengers = Number(pax[1]) || NUMBER_WORDS[pax[1]]
  if (/\b(?:me and my|my (?:wife|husband|partner)|couple)\b/.test(lower) && !out.passengers) out.passengers = 2

  if (/\bnonstop\b|\bdirect\b/.test(lower)) out.directOnly = true

  // ISO dates: "2026-12-03" or "2026-12-03 to 2026-12-09".
  const isoDates = [...lower.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g)].map((m) => m[1])
  if (isoDates.length) {
    out.startDate = isoDates[0]
    out.endDate = isoDates[1] || isoDates[0]
    return out
  }

  // "Dec 1-7", "December 3", "dec 28 - jan 4", "in March".
  const monthRe = '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?'
  const range = lower.match(
    new RegExp(`\\b${monthRe}\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:\\s*(?:-|–|to|through|until)\\s*(?:${monthRe}\\s+)?(\\d{1,2})(?:st|nd|rd|th)?)?`),
  )
  const yearOf = (m, d) => {
    const y = today.getUTCFullYear()
    return Date.UTC(y, m, d) < Date.UTC(y, today.getUTCMonth(), today.getUTCDate()) ? y + 1 : y
  }
  if (range) {
    const m1 = MONTHS.indexOf(range[1])
    const d1 = Number(range[2])
    const m2 = range[3] ? MONTHS.indexOf(range[3]) : m1
    const d2 = range[4] ? Number(range[4]) : d1
    const y1 = yearOf(m1, d1)
    const y2 = m2 < m1 ? y1 + 1 : y1
    out.startDate = iso(y1, m1, Math.min(d1, daysIn(y1, m1)))
    out.endDate = iso(y2, m2, Math.min(d2, daysIn(y2, m2)))
    return out
  }
  const month = lower.match(new RegExp(`\\b(?:in|during|for|around)?\\s*(?:early|mid|late)?\\s*${monthRe}\\b`))
  if (month) {
    const m = MONTHS.indexOf(month[1])
    const y = yearOf(m, daysIn(today.getUTCFullYear(), m))
    const last = daysIn(y, m)
    const part =
      lower.match(/\b(early|mid|late)\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/)?.[1] ||
      lower.match(/\b(first|last) week\b/)?.[1]
    const [a, b] = {
      early: [1, 10],
      mid: [10, 20],
      late: [20, last],
      first: [1, 7],
      last: [last - 6, last],
    }[part] || [1, last]
    const now = iso(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    const start = iso(y, m, a)
    out.startDate = start < now ? now : start
    out.endDate = iso(y, m, b)
  }
  return out
}
