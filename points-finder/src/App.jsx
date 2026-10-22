import { useEffect, useMemo, useState } from 'react'
import { cheapestByDate, evaluateAwards, highlights, rankAwards } from '../shared/optimizer.js'
import { airportLabel } from '../shared/airports.js'
import { getProgram } from '../shared/programs.js'
import WalletPanel from './components/WalletPanel.jsx'
import SearchForm from './components/SearchForm.jsx'
import Highlights from './components/Highlights.jsx'
import DateStrip from './components/DateStrip.jsx'
import ResultCard from './components/ResultCard.jsx'
import { usePersistentState } from './usePersistentState.js'
import { addDays, CABIN_LABEL, fmtDate } from './format.js'

const today = new Date().toISOString().slice(0, 10)
const DEFAULT_FORM = {
  from: 'BOS',
  to: 'TYO',
  startDate: addDays(today, 45),
  endDate: addDays(today, 51),
  cabin: 'business',
  passengers: 1,
  cashFare: '',
  directOnly: false,
}
const PAGE = 30

export default function App() {
  const [meta, setMeta] = useState(null)
  const [wallet, setWallet] = usePersistentState('pf.wallet', { currencies: {}, programs: {} })
  const [form, setForm] = usePersistentState('pf.form', DEFAULT_FORM)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [sort, setSort] = useState('points')
  const [filters, setFilters] = useState({ reachableOnly: true, affordableOnly: false, directOnly: false, maxTaxes: '' })
  const [programFilter, setProgramFilter] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [limit, setLimit] = useState(PAGE)
  const [focusId, setFocusId] = useState(null)

  useEffect(() => {
    fetch('/api/meta')
      .then((r) => r.json())
      .then(setMeta)
      .catch(() => setMeta({ live: false, provider: 'offline' }))
  }, [])

  // Old saved forms may hold past dates; roll them forward.
  useEffect(() => {
    if (form.startDate < today) setForm((f) => ({ ...f, startDate: DEFAULT_FORM.startDate, endDate: DEFAULT_FORM.endDate }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const search = async (f) => {
    setLoading(true)
    setError('')
    setSelectedDate(null)
    setProgramFilter([])
    setLimit(PAGE)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(f),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Search failed')
      setData({ ...json, passengers: Math.max(1, Number(f.passengers) || 1), cashFare: Number(f.cashFare) || undefined })
      if (f.directOnly) setFilters((x) => ({ ...x, directOnly: true }))
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const hasWallet =
    Object.values(wallet.currencies || {}).some((n) => n > 0) || Object.values(wallet.programs || {}).some((n) => n > 0)

  // Scoring runs in the browser so balance edits re-rank instantly.
  const evaluated = useMemo(
    () => (data ? evaluateAwards(data.awards, { wallet, passengers: data.passengers, cashFare: data.cashFare }) : []),
    [data, wallet],
  )
  const activeFilters = {
    ...filters,
    reachableOnly: filters.reachableOnly && hasWallet,
    maxTaxes: filters.maxTaxes === '' ? null : Number(filters.maxTaxes),
    programs: programFilter,
  }
  const filtered = useMemo(() => rankAwards(evaluated, { sort, filters: activeFilters }), [evaluated, sort, JSON.stringify(activeFilters)]) // eslint-disable-line react-hooks/exhaustive-deps
  const shown = selectedDate ? filtered.filter((a) => a.date === selectedDate) : filtered
  const byDate = useMemo(() => cheapestByDate(filtered), [filtered])
  const picks = useMemo(() => highlights(rankAwards(evaluated, { filters: { ...activeFilters, programs: [] } })), [evaluated, JSON.stringify(activeFilters)]) // eslint-disable-line react-hooks/exhaustive-deps

  const programCounts = useMemo(() => {
    const counts = {}
    for (const a of evaluated) counts[a.program] = (counts[a.program] || 0) + 1
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [evaluated])

  useEffect(() => {
    if (!focusId) return
    document.getElementById(`r-${focusId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setFocusId(null)
  }, [focusId, shown])

  const pickHighlight = (a) => {
    setSelectedDate(a.date)
    setFocusId(a.id)
  }
  const toggleProgram = (id) =>
    setProgramFilter((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
  const setFilter = (k) => (e) =>
    setFilters((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const live = !!data?.meta?.live

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden="true">✈</span>
          <div>
            <h1>Points Finder</h1>
            <p className="muted small">Award flights priced in the points you hold</p>
          </div>
        </div>
        {meta && (
          <span className={`mode ${meta.live ? 'live' : 'demo'}`}>
            {meta.live ? '● Live · seats.aero' : '● Demo data'}
          </span>
        )}
      </header>

      {meta && !meta.live && (
        <div className="banner">
          <strong>Demo mode.</strong> Availability and prices here are simulated, so you can try the app, but don't book from them. Add a{' '}
          <a href="https://seats.aero/apikey" target="_blank" rel="noreferrer">seats.aero Pro API key</a> as{' '}
          <code>SEATS_AERO_API_KEY</code> in <code>points-finder/.env</code> and restart to search real award space.
        </div>
      )}

      <div className="layout">
        <WalletPanel wallet={wallet} setWallet={setWallet} />

        <main>
          <SearchForm form={form} setForm={setForm} onSearch={search} loading={loading} />

          {error && <div className="panel error">{error}</div>}

          {!data && !error && (
            <div className="panel empty">
              <h2>How it works</h2>
              <ol>
                <li>Enter your card points (and any airline miles) on the left. They're saved only in this browser.</li>
                <li>Search a route and a date window, e.g. <strong>BOS → TYO</strong> in business.</li>
                <li>
                  Every award is checked against every program your points transfer to. You'll see what you can book now, what you'd
                  transfer, and how many cents each point is worth.
                </li>
              </ol>
              <p className="muted small">
                Transfers are one-way and can't be undone. Always confirm the seat is bookable on the airline's site before you move
                points.
              </p>
            </div>
          )}

          {data && (
            <section className="results" aria-live="polite">
              <div className="results-head">
                <div>
                  <h2>
                    {data.query.origins.map(airportLabel).join(', ')} → {data.query.destinations.map(airportLabel).join(', ')}
                  </h2>
                  <p className="muted small">
                    {CABIN_LABEL[data.query.cabin]} · {fmtDate(data.query.startDate)} – {fmtDate(data.query.endDate)} ·{' '}
                    {data.passengers} traveler{data.passengers > 1 ? 's' : ''} · {data.awards.length} award options across{' '}
                    {programCounts.length} programs{data.cached ? ' · cached' : ''}
                    {!live && ' · demo data'}
                  </p>
                </div>
              </div>

              {!hasWallet && (
                <p className="note">Add your balances on the left to see what you can book. Until then, every award is shown.</p>
              )}

              <Highlights h={picks} onPick={pickHighlight} />

              <DateStrip
                start={data.query.startDate}
                end={data.query.endDate}
                byDate={byDate}
                selected={selectedDate}
                onSelect={setSelectedDate}
              />

              <div className="toolbar">
                <label className="check">
                  <input type="checkbox" checked={filters.reachableOnly} onChange={setFilter('reachableOnly')} disabled={!hasWallet} />
                  Only my points
                </label>
                <label className="check">
                  <input type="checkbox" checked={filters.affordableOnly} onChange={setFilter('affordableOnly')} />
                  Can afford now
                </label>
                <label className="check">
                  <input type="checkbox" checked={filters.directOnly} onChange={setFilter('directOnly')} />
                  Nonstop
                </label>
                <label className="inline">
                  Max fees $
                  <input inputMode="numeric" value={filters.maxTaxes} onChange={setFilter('maxTaxes')} placeholder="any" />
                </label>
                <label className="inline">
                  Sort
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="points">Fewest points</option>
                    <option value="cost">Lowest total cost</option>
                    <option value="value">Best ¢ per point</option>
                    <option value="taxes">Lowest fees</option>
                    <option value="date">Date</option>
                  </select>
                </label>
              </div>

              <div className="chips" role="group" aria-label="Filter by program">
                {programCounts.map(([id, n]) => (
                  <button
                    key={id}
                    type="button"
                    className={`chip ${programFilter.includes(id) ? 'on' : ''}`}
                    aria-pressed={programFilter.includes(id)}
                    onClick={() => toggleProgram(id)}
                  >
                    {getProgram(id).name} <span className="muted">{n}</span>
                  </button>
                ))}
                {programFilter.length > 0 && (
                  <button type="button" className="chip clear" onClick={() => setProgramFilter([])}>
                    Clear
                  </button>
                )}
              </div>

              <p className="muted small count">
                {shown.length} result{shown.length === 1 ? '' : 's'}
                {selectedDate && (
                  <>
                    {' '}on {fmtDate(selectedDate)} ·{' '}
                    <button type="button" className="link" onClick={() => setSelectedDate(null)}>
                      show all dates
                    </button>
                  </>
                )}
              </p>

              <div className="result-list">
                {shown.slice(0, limit).map((a) => (
                  <div key={a.id} id={`r-${a.id}`}>
                    <ResultCard a={a} live={live} wallet={wallet} />
                  </div>
                ))}
              </div>
              {shown.length > limit && (
                <button type="button" className="btn ghost more" onClick={() => setLimit((n) => n + PAGE)}>
                  Show {Math.min(PAGE, shown.length - limit)} more
                </button>
              )}
              {!shown.length && (
                <div className="panel empty">
                  <p>No awards match these filters.</p>
                  {filters.reachableOnly && hasWallet && (
                    <p className="muted small">Untick "Only my points" to see awards bookable with other cards.</p>
                  )}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      <footer className="muted tiny footer">
        Transfer partners as of {meta?.transferDataAsOf || '—'}. Point values and cash fares are estimates. Not affiliated with any
        airline, bank, PointsGPT or seats.aero.
      </footer>
    </div>
  )
}
