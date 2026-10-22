import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseQuery } from '../shared/parseQuery.js'

const TODAY = new Date('2026-10-22T12:00:00Z')

test('reads route, cabin, dates and party size', () => {
  assert.deepEqual(parseQuery('Boston to Tokyo business Dec 1-7 for 2', TODAY), {
    from: 'Boston',
    to: 'Tokyo',
    cabin: 'business',
    passengers: 2,
    startDate: '2026-12-01',
    endDate: '2026-12-07',
  })
})

test('handles codes, arrows, multi-word cities and first class', () => {
  const q = parseQuery('from new york → london first class march 3', TODAY)
  assert.equal(q.from, 'New York')
  assert.equal(q.to, 'London')
  assert.equal(q.cabin, 'first')
  assert.equal(q.startDate, '2027-03-03', 'past months roll to next year')
})

test('"first week" is a date, not a cabin', () => {
  const q = parseQuery('BOS to HND first week of december', TODAY)
  assert.equal(q.from, 'BOS')
  assert.equal(q.to, 'HND')
  assert.equal(q.cabin, undefined)
  assert.equal(q.startDate, '2026-12-01')
  assert.equal(q.endDate, '2026-12-07')
})

test('month ranges and year wrap', () => {
  const q = parseQuery('SFO to SIN dec 28 - jan 4 nonstop', TODAY)
  assert.equal(q.startDate, '2026-12-28')
  assert.equal(q.endDate, '2027-01-04')
  assert.equal(q.directOnly, true)
  const late = parseQuery('BOS to LHR late november for three people', TODAY)
  assert.equal(late.startDate, '2026-11-20')
  assert.equal(late.endDate, '2026-11-30')
  assert.equal(late.passengers, 3)
})

test('ISO dates', () => {
  const q = parseQuery('BOS to TYO 2026-12-03 to 2026-12-09', TODAY)
  assert.equal(q.from, 'BOS')
  assert.equal(q.to, 'TYO')
  assert.equal(q.startDate, '2026-12-03')
  assert.equal(q.endDate, '2026-12-09')
})
