import { datesBetween, fmtDate, fmtK } from '../format.js'

/** One cell per day with the cheapest award, shaded by how cheap it is. */
export default function DateStrip({ start, end, byDate, selected, onSelect }) {
  const dates = datesBetween(start, end)
  const prices = Object.values(byDate).map((a) => a.effectivePoints)
  const lo = Math.min(...prices)
  const hi = Math.max(...prices)

  return (
    <div className="datestrip" role="group" aria-label="Cheapest award by day">
      {dates.map((d) => {
        const a = byDate[d]
        const t = a && hi > lo ? (a.effectivePoints - lo) / (hi - lo) : 0
        const level = a ? (t < 0.15 ? 'best' : t < 0.5 ? 'mid' : 'high') : 'none'
        return (
          <button
            key={d}
            type="button"
            className={`day ${level} ${selected === d ? 'selected' : ''}`}
            disabled={!a}
            aria-pressed={selected === d}
            onClick={() => onSelect(selected === d ? null : d)}
          >
            <span className="tiny">{fmtDate(d, { weekday: 'short' })}</span>
            <strong>{fmtDate(d, { month: 'short', day: 'numeric' })}</strong>
            <span className="tiny">{a ? fmtK(a.effectivePoints) : '—'}</span>
          </button>
        )
      })}
    </div>
  )
}
