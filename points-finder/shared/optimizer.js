// Turns raw award availability into ranked, bookable options for a specific
// wallet: which of *your* points can reach each award, how many you'd move,
// whether you can afford it, and what that's worth.

import { CURRENCIES, transferSourcesFor } from './currencies.js'
import { getProgram, CARRIERS } from './programs.js'
import { centsPerPoint, estimateCashFare, toUsd, valueTier } from './valuation.js'

const roundUpTo = (n, step) => Math.ceil(n / step) * step

/**
 * Every way to pay for `milesNeeded` in `programId`, one currency at a time,
 * whether or not the wallet holds any of it. Sorted cheapest first.
 */
export function transferPaths(programId, milesNeeded) {
  return transferSourcesFor(programId)
    .map(({ currency, ratio, label }) => ({
      currency: currency.id,
      currencyName: currency.short,
      ratio,
      ratioLabel: label,
      points: roundUpTo(milesNeeded / ratio, currency.increment),
    }))
    .sort((a, b) => a.points - b.points)
}

/**
 * Plan how to fund an award from a wallet. Miles already sitting in the
 * program go first, then card currencies in order of what a resulting mile
 * costs you (currency value ÷ transfer ratio). Several currencies can pool
 * into one airline account, so a plan may use more than one.
 *
 * wallet = { currencies: { amex: 120000, ... }, programs: { alaska: 40000, ... } }
 */
export function fundAward(programId, milesNeeded, wallet = {}) {
  const program = getProgram(programId)
  const sources = []

  const held = wallet.programs?.[programId] || 0
  if (held > 0) {
    sources.push({
      kind: 'program',
      id: programId,
      name: program.name,
      ratio: 1,
      balance: held,
      increment: 1,
      costPerMile: program.cpp,
    })
  }
  for (const { currency, ratio, label } of transferSourcesFor(programId)) {
    const balance = wallet.currencies?.[currency.id] || 0
    if (balance <= 0) continue
    sources.push({
      kind: 'currency',
      id: currency.id,
      name: currency.short,
      ratio,
      ratioLabel: label,
      balance,
      increment: currency.increment,
      costPerMile: currency.cpp / ratio,
    })
  }
  // Program miles first: they're already stranded there and cost no transfer.
  sources.sort((a, b) =>
    a.kind !== b.kind ? (a.kind === 'program' ? -1 : 1) : a.costPerMile - b.costPerMile,
  )

  let remaining = milesNeeded
  const steps = []
  for (const s of sources) {
    if (remaining <= 0) break
    if (s.kind === 'program') {
      const use = Math.min(s.balance, remaining)
      steps.push({ kind: 'program', id: s.id, name: s.name, points: use, miles: use, cpp: s.costPerMile })
      remaining -= use
      continue
    }
    const wanted = roundUpTo(remaining / s.ratio, s.increment)
    const usable = Math.floor(s.balance / s.increment) * s.increment
    const points = Math.min(wanted, usable)
    if (points <= 0) continue
    const miles = Math.floor(points * s.ratio)
    steps.push({
      kind: 'currency',
      id: s.id,
      name: s.name,
      ratioLabel: s.ratioLabel,
      points,
      miles,
      cpp: CURRENCIES[s.id].cpp,
    })
    remaining -= miles
  }

  const pointsSpent = steps.reduce((sum, s) => sum + s.points, 0)
  const valueSpentUsd = steps.reduce((sum, s) => sum + (s.points * s.cpp) / 100, 0)
  return {
    // Can any of the wallet's balances reach this program at all?
    reachable: sources.length > 0,
    affordable: remaining <= 0,
    shortfallMiles: Math.max(0, remaining),
    leftoverMiles: Math.max(0, -remaining),
    steps,
    pointsSpent,
    valueSpentUsd,
  }
}

/**
 * Score every award against the wallet.
 *
 * awards: normalized availability rows (see server/providers).
 * opts: { wallet, passengers, cashFare (optional per-person override) }
 */
export function evaluateAwards(awards, { wallet = {}, passengers = 1, cashFare } = {}) {
  return awards.map((award) => {
    const program = getProgram(award.program)
    const totalMiles = award.miles * passengers
    const taxesPerPax = toUsd(award.taxes, award.taxesCurrency) ?? 0
    const totalTaxes = taxesPerPax * passengers
    const funding = fundAward(award.program, totalMiles, wallet)
    const paths = transferPaths(award.program, totalMiles)

    const cashPerPax = cashFare || estimateCashFare(award.distance, award.cabin)
    const cpp = centsPerPoint(cashPerPax, taxesPerPax, award.miles)

    // What this award costs *you*: the plan's points if you can afford it,
    // otherwise the cheapest path from a currency you hold, then from any
    // card, then the raw miles if no card reaches the program.
    const bestPath =
      paths.find((p) => (wallet.currencies?.[p.currency] || 0) > 0) || paths[0]
    const effectivePoints = funding.affordable
      ? funding.pointsSpent
      : bestPath?.points ?? totalMiles
    const effectiveValueUsd = funding.affordable
      ? funding.valueSpentUsd
      : bestPath
        ? (bestPath.points * CURRENCIES[bestPath.currency].cpp) / 100
        : (totalMiles * program.cpp) / 100

    return {
      ...award,
      programName: program.name,
      alliance: program.alliance,
      bookingUrl: program.bookingUrl,
      carrierNames: (award.carriers || []).map((c) => CARRIERS[c]?.name || c),
      totalMiles,
      taxesUsd: taxesPerPax,
      totalTaxesUsd: totalTaxes,
      funding,
      paths,
      reachable: funding.reachable,
      transferable: paths.length > 0,
      effectivePoints,
      totalCostUsd: effectiveValueUsd + totalTaxes,
      cashEstimate: cashPerPax,
      cashIsEstimate: !cashFare,
      cpp,
      valueTier: valueTier(cpp),
    }
  })
}

const SORTERS = {
  points: (a, b) => a.effectivePoints - b.effectivePoints || a.totalTaxesUsd - b.totalTaxesUsd,
  cost: (a, b) => a.totalCostUsd - b.totalCostUsd,
  value: (a, b) => (b.cpp ?? 0) - (a.cpp ?? 0),
  date: (a, b) => a.date.localeCompare(b.date) || a.effectivePoints - b.effectivePoints,
  taxes: (a, b) => a.totalTaxesUsd - b.totalTaxesUsd || a.effectivePoints - b.effectivePoints,
}

/**
 * Filter + sort evaluated awards.
 * filters: { affordableOnly, directOnly, reachableOnly, maxTaxes, programs[], minSeats }
 * (reachableOnly = only awards your wallet can transfer into)
 */
export function rankAwards(evaluated, { sort = 'points', filters = {} } = {}) {
  const f = filters
  return evaluated
    .filter((a) => !f.affordableOnly || a.funding.affordable)
    .filter((a) => !f.reachableOnly || a.reachable)
    .filter((a) => !f.directOnly || a.direct)
    .filter((a) => f.maxTaxes == null || a.totalTaxesUsd <= f.maxTaxes)
    .filter((a) => !f.programs?.length || f.programs.includes(a.program))
    .filter((a) => !f.minSeats || a.seats == null || a.seats >= f.minSeats)
    .sort(SORTERS[sort] || SORTERS.points)
}

/** Cheapest effective-points option per date, for the calendar strip. */
export function cheapestByDate(evaluated) {
  const byDate = {}
  for (const a of evaluated) {
    const cur = byDate[a.date]
    if (!cur || a.effectivePoints < cur.effectivePoints) byDate[a.date] = a
  }
  return byDate
}

/** Headline picks for the summary cards. */
export function highlights(evaluated) {
  const pick = (list, sorter) => [...list].sort(sorter)[0] || null
  const affordable = evaluated.filter((a) => a.funding.affordable)
  const reachable = evaluated.filter((a) => a.reachable)
  return {
    fewestPoints: pick(reachable.length ? reachable : evaluated, SORTERS.points),
    bestAffordable: pick(affordable, SORTERS.cost),
    bestValue: pick(reachable.length ? reachable : evaluated, SORTERS.value),
    lowestTaxes: pick(affordable.length ? affordable : evaluated, SORTERS.taxes),
  }
}
