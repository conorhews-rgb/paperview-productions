#!/usr/bin/env node
// Terminal version of the search:
//
//   npm run search -- BOS TYO 2026-12-01 2026-12-07 --amex 150000 --chase 90000
//   npm run search -- BOS TYO 2026-12-01 --cabin first --pax 2 --miles alaska=60000
//
// Flags: --cabin economy|premium|business|first   --pax N   --sort points|cost|value|date|taxes
//        --amex/--chase/--capitalone/--citi/--bilt N   --miles program=N (repeatable)
//        --cash USD (real cash fare per person)  --direct  --affordable  --mine (only awards your points reach)
//        --top N  --demo

import { parseSearch, runSearch } from './server/api.js'
import { loadEnv } from './server/env.js'
import { CURRENCIES } from './shared/currencies.js'
import { evaluateAwards, highlights, rankAwards } from './shared/optimizer.js'

loadEnv()

const args = process.argv.slice(2)
const positional = []
const flags = { miles: [] }
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (!a.startsWith('--')) positional.push(a)
  else if (['--direct', '--affordable', '--mine', '--demo'].includes(a)) flags[a.slice(2)] = true
  else if (a === '--miles') flags.miles.push(args[++i])
  else flags[a.slice(2)] = args[++i]
}

if (positional.length < 3) {
  console.log('Usage: npm run search -- FROM TO START_DATE [END_DATE] [--amex 150000 ...]')
  process.exit(1)
}

const [from, to, startDate, endDate] = positional
const wallet = { currencies: {}, programs: {} }
for (const id of Object.keys(CURRENCIES)) if (flags[id]) wallet.currencies[id] = Number(flags[id])
for (const pair of flags.miles) {
  const [program, n] = String(pair).split('=')
  wallet.programs[program] = Number(n)
}
const passengers = Number(flags.pax) || 1

try {
  const query = parseSearch({ from, to, startDate, endDate, cabin: flags.cabin, directOnly: flags.direct })
  const { awards, meta } = await runSearch(query, { forceDemo: flags.demo })
  const evaluated = evaluateAwards(awards, { wallet, passengers, cashFare: Number(flags.cash) || undefined })
  const ranked = rankAwards(evaluated, {
    sort: flags.sort || 'points',
    filters: { affordableOnly: flags.affordable, directOnly: flags.direct, reachableOnly: flags.mine },
  })

  const fmt = (n) => Math.round(n).toLocaleString('en-US')
  console.log(
    `\n${query.origins.join('/')} → ${query.destinations.join('/')}  ${query.startDate}…${query.endDate}  ` +
      `${query.cabin}  ×${passengers}  [${meta.live ? 'LIVE seats.aero' : 'DEMO data — not bookable'}]`,
  )
  console.log(`${awards.length} award(s) found, ${ranked.length} after filters.\n`)

  const h = highlights(evaluated)
  if (h.bestAffordable) console.log(`★ Best you can book now: ${line(h.bestAffordable)}`)
  if (h.fewestPoints) console.log(`★ Fewest points:          ${line(h.fewestPoints)}`)
  if (h.bestValue) console.log(`★ Best value per point:   ${line(h.bestValue)}`)
  console.log('')

  for (const a of ranked.slice(0, Number(flags.top) || 20)) {
    console.log(line(a))
    const plan = a.funding.affordable
      ? a.funding.steps.map((s) => (s.kind === 'program' ? `use ${fmt(s.points)} ${s.name} miles` : `move ${fmt(s.points)} ${s.name} (${s.ratioLabel})`)).join(' + ')
      : a.reachable
        ? `you're ${fmt(a.funding.shortfallMiles)} miles short after transferring what you have`
        : a.paths.length
          ? `your points don't transfer here — needs ${a.paths.slice(0, 3).map((p) => `${fmt(p.points)} ${p.currencyName}`).join(' or ')}`
          : 'no card currency transfers to this program'
    console.log(`    ${plan}`)
  }

  function line(a) {
    const cpp = a.cpp != null ? `${a.cpp.toFixed(1)}¢/pt` : ''
    return [
      a.date,
      `${a.origin}-${a.destination}`,
      a.programName.padEnd(28),
      `${fmt(a.totalMiles)} mi`.padStart(11),
      `+$${fmt(a.totalTaxesUsd)}`.padStart(7),
      (a.carriers.join('/') || '?').padEnd(6),
      a.direct ? 'nonstop' : 'connect',
      cpp,
      a.funding.affordable ? '✓ affordable' : '',
    ].join('  ')
  }
} catch (err) {
  console.error(`Error: ${err.message}`)
  process.exit(1)
}
