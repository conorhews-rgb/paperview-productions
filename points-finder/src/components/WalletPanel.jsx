import { CURRENCIES } from '../../shared/currencies.js'
import { PROGRAMS } from '../../shared/programs.js'
import { fmtNum } from '../format.js'

const parseBalance = (v) => Math.max(0, Number(String(v).replace(/[^\d]/g, '')) || 0)

export default function WalletPanel({ wallet, setWallet }) {
  const setCurrency = (id, value) =>
    setWallet((w) => ({ ...w, currencies: { ...w.currencies, [id]: parseBalance(value) } }))

  const programEntries = Object.entries(wallet.programs || {})
  const setProgram = (id, value) =>
    setWallet((w) => ({ ...w, programs: { ...w.programs, [id]: parseBalance(value) } }))
  const removeProgram = (id) =>
    setWallet((w) => {
      const { [id]: _, ...rest } = w.programs
      return { ...w, programs: rest }
    })
  const unused = Object.values(PROGRAMS).filter((p) => !(p.id in (wallet.programs || {})))
  const addProgram = (id) => id && setProgram(id, 0)

  const total = Object.values(wallet.currencies || {}).reduce((s, n) => s + (n || 0), 0)

  return (
    <aside className="panel wallet" aria-label="Your points">
      <div className="panel-head">
        <h2>Your points</h2>
        <span className="muted small">{fmtNum(total)} card pts</span>
      </div>
      <p className="muted small">
        Enter what you hold. Results are priced in these balances, and you can pool several into one airline.
      </p>

      <div className="wallet-list">
        {Object.values(CURRENCIES).map((c) => (
          <label key={c.id} className="wallet-row">
            <span className="wallet-name">
              <span className={`dot dot-${c.id}`} aria-hidden="true" />
              <span>
                {c.short}
                <span className="muted tiny block">{c.cards.slice(0, 2).join(', ')}</span>
              </span>
            </span>
            <input
              inputMode="numeric"
              placeholder="0"
              value={wallet.currencies?.[c.id] ? fmtNum(wallet.currencies[c.id]) : ''}
              onChange={(e) => setCurrency(c.id, e.target.value)}
              aria-label={`${c.name} balance`}
            />
          </label>
        ))}
      </div>

      <h3 className="subhead">Airline miles you already have</h3>
      <div className="wallet-list">
        {programEntries.map(([id, bal]) => (
          <div key={id} className="wallet-row">
            <span className="wallet-name">{PROGRAMS[id]?.name || id}</span>
            <span className="row-inline">
              <input
                inputMode="numeric"
                placeholder="0"
                value={bal ? fmtNum(bal) : ''}
                onChange={(e) => setProgram(id, e.target.value)}
                aria-label={`${PROGRAMS[id]?.name || id} balance`}
              />
              <button type="button" className="icon-btn" onClick={() => removeProgram(id)} aria-label="Remove">
                ×
              </button>
            </span>
          </div>
        ))}
        <select className="add-program" value="" onChange={(e) => addProgram(e.target.value)}>
          <option value="">+ Add airline miles…</option>
          {unused.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}
