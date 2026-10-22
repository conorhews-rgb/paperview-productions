import { fmtDate, fmtNum, fmtUsd } from '../format.js'

const CARDS = [
  ['bestAffordable', 'Best you can book now', 'Lowest total cost with your current balances'],
  ['fewestPoints', 'Fewest points', 'Cheapest award your points can reach'],
  ['bestValue', 'Best value', 'Most cents per point vs. the cash fare'],
  ['lowestTaxes', 'Lowest fees', 'Least cash out of pocket'],
]

export default function Highlights({ h, onPick }) {
  return (
    <div className="highlights">
      {CARDS.map(([key, title, hint]) => {
        const a = h[key]
        return (
          <button
            key={key}
            type="button"
            className="highlight"
            disabled={!a}
            onClick={() => a && onPick(a)}
            title={hint}
          >
            <span className="tiny muted upper">{title}</span>
            {a ? (
              <>
                <strong className="h-miles">{fmtNum(a.totalMiles)}</strong>
                <span className="small">{a.programName}</span>
                <span className="tiny muted">
                  {fmtDate(a.date, { month: 'short', day: 'numeric' })} · +{fmtUsd(a.totalTaxesUsd)}
                  {a.cpp != null ? ` · ${a.cpp.toFixed(1)}¢` : ''}
                </span>
              </>
            ) : (
              <span className="small muted">Nothing yet</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
