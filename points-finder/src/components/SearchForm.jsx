import { useState } from 'react'
import { parseQuery } from '../../shared/parseQuery.js'
import { addDays, CABIN_LABEL, fmtDate } from '../format.js'

function describe(p) {
  const bits = []
  if (p.from || p.to) bits.push(`${p.from || '?'} → ${p.to || '?'}`)
  if (p.cabin) bits.push(CABIN_LABEL[p.cabin])
  if (p.startDate) bits.push(p.endDate && p.endDate !== p.startDate ? `${fmtDate(p.startDate)} – ${fmtDate(p.endDate)}` : fmtDate(p.startDate))
  if (p.passengers) bits.push(`${p.passengers} traveler${p.passengers > 1 ? 's' : ''}`)
  if (p.directOnly) bits.push('nonstop')
  return bits.join(' · ')
}

export default function SearchForm({ form, setForm, onSearch, loading }) {
  const [quick, setQuick] = useState('')
  const [quickNote, setQuickNote] = useState('')
  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const submitQuick = (e) => {
    e.preventDefault()
    const parsed = parseQuery(quick)
    const fields = Object.keys(parsed)
    if (!fields.length) {
      setQuickNote('Try something like "Boston to Tokyo business Dec 1–7 for 2".')
      return
    }
    const next = { ...form, ...parsed }
    setForm(next)
    setQuickNote(`Understood: ${describe(parsed)}`)
    if (next.from && next.to && next.startDate) onSearch(next)
  }

  const submit = (e) => {
    e.preventDefault()
    onSearch(form)
  }

  return (
    <section className="panel search" aria-label="Search">
      <form className="quick" onSubmit={submitQuick}>
        <input
          value={quick}
          onChange={(e) => setQuick(e.target.value)}
          placeholder='Describe your trip — "Boston to Tokyo business first week of December for 2"'
          aria-label="Describe your trip"
        />
        <button type="submit" className="btn ghost" disabled={loading}>
          Search
        </button>
      </form>
      {quickNote && <p className="muted tiny quick-note">{quickNote}</p>}

      <form className="fields" onSubmit={submit}>
        <label>
          <span>From</span>
          <input value={form.from} onChange={set('from')} placeholder="BOS" required />
        </label>
        <button
          type="button"
          className="swap"
          aria-label="Swap origin and destination"
          onClick={() => setForm((f) => ({ ...f, from: f.to, to: f.from }))}
        >
          ⇄
        </button>
        <label>
          <span>To</span>
          <input value={form.to} onChange={set('to')} placeholder="TYO" required />
        </label>
        <label>
          <span>Earliest</span>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => {
              const startDate = e.target.value
              setForm((f) => ({
                ...f,
                startDate,
                endDate: !f.endDate || f.endDate < startDate ? addDays(startDate, 6) : f.endDate,
              }))
            }}
            required
          />
        </label>
        <label>
          <span>Latest</span>
          <input type="date" value={form.endDate} min={form.startDate} onChange={set('endDate')} required />
        </label>
        <label>
          <span>Cabin</span>
          <select value={form.cabin} onChange={set('cabin')}>
            <option value="business">Business</option>
            <option value="first">First</option>
            <option value="premium">Premium econ.</option>
            <option value="economy">Economy</option>
          </select>
        </label>
        <label className="narrow">
          <span>Travelers</span>
          <input type="number" min="1" max="9" value={form.passengers} onChange={set('passengers')} />
        </label>
        <label>
          <span>Cash fare (opt.)</span>
          <input
            inputMode="numeric"
            value={form.cashFare}
            onChange={set('cashFare')}
            placeholder="per person $"
            title="The real one-way cash price per person, to compute value per point. Otherwise we estimate it."
          />
        </label>
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Searching…' : 'Find awards'}
        </button>
      </form>
      <p className="muted tiny hint">
        Use airport or city codes (TYO = Haneda + Narita, NYC, LON) or several separated by commas. Up to 60 days per search.
      </p>
    </section>
  )
}
