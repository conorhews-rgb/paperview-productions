import { test } from 'node:test'
import assert from 'node:assert/strict'
import { distanceMiles, expandLocation } from '../shared/airports.js'
import { evaluateAwards, fundAward, rankAwards, transferPaths } from '../shared/optimizer.js'
import { parseSearch } from '../server/api.js'
import { searchDemo } from '../server/providers/demo.js'

const award = (over = {}) => ({
  id: 'x',
  program: 'aeroplan',
  date: '2026-12-01',
  origin: 'BOS',
  destination: 'HND',
  cabin: 'business',
  miles: 75000,
  taxes: 80,
  taxesCurrency: 'USD',
  seats: 2,
  direct: false,
  carriers: ['NH'],
  distance: 6700,
  source: 'demo',
  ...over,
})

test('city codes and names expand to airports', () => {
  assert.deepEqual(expandLocation('TYO'), ['HND', 'NRT'])
  assert.deepEqual(expandLocation('tokyo'), ['HND', 'NRT'])
  assert.deepEqual(expandLocation('bos, JFK'), ['BOS', 'JFK'])
  assert.deepEqual(expandLocation('Boston'), ['BOS'])
  assert.deepEqual(expandLocation('nowhere land'), [])
})

test('great-circle distance is in the right ballpark', () => {
  const d = distanceMiles('BOS', 'HND')
  assert.ok(d > 6600 && d < 6800, `BOS-HND was ${d}`)
})

test('transfer paths respect ratios and round up to transfer increments', () => {
  const paths = transferPaths('cathay', 70000)
  const amex = paths.find((p) => p.currency === 'amex') // 5:4
  const citi = paths.find((p) => p.currency === 'citi') // 1:1
  assert.equal(amex.points, 88000) // 70000 / 0.8 = 87500 → 88000
  assert.equal(citi.points, 70000)
  assert.equal(paths[0].points, 70000, 'cheapest path first')
})

test('fundAward uses program miles first, then pools card points', () => {
  const plan = fundAward('aeroplan', 75000, {
    programs: { aeroplan: 20000 },
    currencies: { amex: 30000, chase: 100000 },
  })
  assert.equal(plan.affordable, true)
  assert.equal(plan.steps[0].kind, 'program')
  assert.equal(plan.steps[0].points, 20000)
  // Amex (1.6¢) is cheaper to give up than Chase (1.7¢), so it goes next.
  assert.deepEqual(
    plan.steps.slice(1).map((s) => [s.id, s.points]),
    [['amex', 30000], ['chase', 25000]],
  )
})

test('fundAward reports shortfall and unreachable programs', () => {
  const short = fundAward('aeroplan', 75000, { currencies: { amex: 50000 } })
  assert.equal(short.affordable, false)
  assert.equal(short.reachable, true)
  assert.equal(short.shortfallMiles, 25000)

  const none = fundAward('turkish', 50000, { currencies: { amex: 500000 } })
  assert.equal(none.reachable, false)
  assert.equal(none.affordable, false)
})

test('evaluateAwards scales by passengers and prices in your currency', () => {
  const [a] = evaluateAwards([award()], { wallet: { currencies: { chase: 200000 } }, passengers: 2 })
  assert.equal(a.totalMiles, 150000)
  assert.equal(a.totalTaxesUsd, 160)
  assert.equal(a.funding.affordable, true)
  assert.equal(a.effectivePoints, 150000)
  assert.ok(a.cpp > 1, 'business class to Tokyo should beat 1¢/pt')
})

test('a real cash fare overrides the estimate', () => {
  const [a] = evaluateAwards([award({ miles: 100000, taxes: 0 })], { cashFare: 3000 })
  assert.equal(a.cashIsEstimate, false)
  assert.equal(a.cpp, 3)
})

test('rankAwards filters and sorts', () => {
  const list = evaluateAwards(
    [
      award({ id: 'a', program: 'aeroplan', miles: 80000 }),
      award({ id: 'b', program: 'turkish', miles: 50000, direct: true }),
      award({ id: 'c', program: 'united', miles: 90000, taxes: 6 }),
    ],
    { wallet: { currencies: { chase: 85000 } } },
  )
  assert.deepEqual(rankAwards(list).map((a) => a.id), ['b', 'a', 'c'])
  assert.deepEqual(rankAwards(list, { filters: { affordableOnly: true } }).map((a) => a.id), ['a'])
  assert.deepEqual(rankAwards(list, { filters: { reachableOnly: true } }).map((a) => a.id), ['a', 'c'])
  assert.deepEqual(rankAwards(list, { filters: { directOnly: true } }).map((a) => a.id), ['b'])
  assert.equal(rankAwards(list, { sort: 'taxes' })[0].id, 'c')
})

test('parseSearch validates input', () => {
  const q = parseSearch({ from: 'BOS', to: 'TYO', startDate: '2026-12-01', endDate: '2026-12-05' })
  assert.deepEqual(q.destinations, ['HND', 'NRT'])
  assert.equal(q.cabin, 'business')
  assert.throws(() => parseSearch({ from: 'BOS', to: 'TYO', startDate: '12/01/2026' }), /YYYY-MM-DD/)
  assert.throws(() => parseSearch({ from: 'BOS', to: 'TYO', startDate: '2026-12-05', endDate: '2026-12-01' }), /before/)
  assert.throws(() => parseSearch({ from: '', to: 'TYO', startDate: '2026-12-05' }), /origin/)
})

test('demo provider is deterministic and covers several programs', async () => {
  const q = { origins: ['BOS'], destinations: ['HND', 'NRT'], startDate: '2026-12-01', endDate: '2026-12-07', cabin: 'business' }
  const a = await searchDemo(q)
  const b = await searchDemo(q)
  assert.deepEqual(a, b)
  assert.ok(a.awards.length > 20)
  assert.ok(new Set(a.awards.map((x) => x.program)).size >= 8)
  assert.ok(a.awards.every((x) => x.source === 'demo' && x.miles > 0))
})
