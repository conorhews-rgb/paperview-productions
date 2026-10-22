import { useState } from 'react'
import { getTrips } from '../api.js'
import { fmtDate, fmtNum, fmtUsd, TIER_LABEL } from '../format.js'

export default function ResultCard({ a, live, wallet }) {
  const [open, setOpen] = useState(false)
  const [trips, setTrips] = useState(null)
  const [tripError, setTripError] = useState('')

  const loadTrips = async () => {
    setOpen(true)
    if (trips || !live) return
    try {
      setTrips(await getTrips(a.id))
    } catch (err) {
      setTripError(err.message || 'Could not load flight details')
    }
  }

  const status = a.funding.affordable ? 'can-book' : a.reachable ? 'short' : 'no-path'

  return (
    <article className={`result ${status}`}>
      <div className="result-main">
        <div className="result-when">
          <strong>{fmtDate(a.date)}</strong>
          <span className="route">
            {a.origin} <span aria-hidden="true">→</span> {a.destination}
          </span>
        </div>

        <div className="result-what">
          <div className="program">
            {a.programName}
            {a.alliance !== 'none' && <span className={`tag alliance-${a.alliance}`}>{a.alliance}</span>}
          </div>
          <div className="muted small">
            {a.carrierNames.length ? a.carrierNames.join(' + ') : 'Carrier n/a'}
            {' · '}
            <span className={a.direct ? 'nonstop' : ''}>{a.direct ? 'Nonstop' : 'Connecting'}</span>
            {a.seats ? ` · ${a.seats} seat${a.seats > 1 ? 's' : ''} left` : ''}
          </div>
        </div>

        <div className="result-cost">
          <div className="miles">
            {fmtNum(a.totalMiles)} <span className="unit">miles</span>
          </div>
          <div className="muted small">
            + {fmtUsd(a.totalTaxesUsd)} taxes &amp; fees
          </div>
        </div>

        <div className="result-value">
          {a.cpp != null && (
            <span className={`pill tier-${a.valueTier}`} title={`vs. ${a.cashIsEstimate ? 'estimated ' : ''}cash fare of ${fmtUsd(a.cashEstimate)} per person`}>
              {a.cpp.toFixed(1)}¢/pt · {TIER_LABEL[a.valueTier]}
            </span>
          )}
        </div>
      </div>

      <div className="plan">
        <Plan a={a} wallet={wallet} />
        <div className="actions">
          {a.bookingUrl && (
            <a className="btn small ghost" href={a.bookingUrl} target="_blank" rel="noreferrer">
              Book on {a.programName.split(' ').slice(0, 2).join(' ')} ↗
            </a>
          )}
          <button type="button" className="btn small ghost" onClick={() => (open ? setOpen(false) : loadTrips())}>
            {open ? 'Hide details' : 'Details'}
          </button>
        </div>
      </div>

      {open && (
        <div className="details">
          <div>
            <h4>Every way to pay ({fmtNum(a.totalMiles)} miles)</h4>
            {a.paths.length ? (
              <ul className="paths">
                {a.paths.map((p) => (
                  <li key={p.currency} className={wallet.currencies?.[p.currency] ? 'held' : ''}>
                    <span>{p.currencyName}</span>
                    <span className="muted">{p.ratioLabel}</span>
                    <strong>{fmtNum(p.points)} pts</strong>
                    {(wallet.currencies?.[p.currency] || 0) >= p.points && <span className="ok">✓ enough</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">No major card currency transfers to {a.programName}. Earn or buy miles directly.</p>
            )}
          </div>
          <div>
            <h4>Flights</h4>
            {!live && <p className="muted small">Flight numbers and times come from live seats.aero data. Demo results have none.</p>}
            {live && !trips && !tripError && <p className="muted small">Loading…</p>}
            {tripError && <p className="error small">{tripError}</p>}
            {trips?.map((t, i) => (
              <div key={i} className="trip">
                <strong>{t.flightNumbers}</strong>{' '}
                <span className="muted small">
                  {t.departsAt?.slice(11, 16)} → {t.arrivesAt?.slice(11, 16)}
                  {t.durationMinutes ? ` · ${Math.floor(t.durationMinutes / 60)}h${String(t.durationMinutes % 60).padStart(2, '0')}` : ''}
                  {t.stops != null ? ` · ${t.stops ? `${t.stops} stop` : 'nonstop'}` : ''}
                </span>
                <div className="muted tiny">
                  {t.segments.map((s) => `${s.flight} ${s.origin}-${s.destination}${s.aircraft ? ` (${s.aircraft})` : ''}`).join(' · ')}
                </div>
              </div>
            ))}
            {a.updatedAt && <p className="muted tiny">Seen {new Date(a.updatedAt).toLocaleString()}</p>}
          </div>
        </div>
      )}
    </article>
  )
}

function Plan({ a, wallet }) {
  const { funding } = a
  if (funding.affordable) {
    return (
      <div className="plan-steps">
        <span className="ok">✓ You can book this</span>
        {funding.steps.map((s) => (
          <span key={s.id} className="step">
            {s.kind === 'program'
              ? `Use ${fmtNum(s.points)} miles already in ${s.name}`
              : `Move ${fmtNum(s.points)} ${s.name} → ${a.programName} (${s.ratioLabel})`}
          </span>
        ))}
        {funding.leftoverMiles > 0 && (
          <span className="muted tiny">{fmtNum(funding.leftoverMiles)} miles left over after rounding</span>
        )}
      </div>
    )
  }
  if (a.reachable) {
    return (
      <div className="plan-steps">
        <span className="warn">{fmtNum(funding.shortfallMiles)} miles short</span>
        <span className="muted small">
          Even after moving {funding.steps.map((s) => `${fmtNum(s.points)} ${s.name}`).join(' + ')}
        </span>
      </div>
    )
  }
  const hasAny = Object.values(wallet.currencies || {}).some((n) => n > 0)
  return (
    <div className="plan-steps">
      <span className="muted small">
        {a.paths.length
          ? `${hasAny ? "Your points don't transfer here. " : ''}Bookable with ${a.paths
              .slice(0, 3)
              .map((p) => `${fmtNum(p.points)} ${p.currencyName}`)
              .join(' · ')}`
          : `No card currency transfers to ${a.programName}.`}
      </span>
    </div>
  )
}
