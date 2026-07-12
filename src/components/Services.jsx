import { SERVICES } from '../data'
import { Icon } from './Icons'

const BADGE = {
  retainer: { cls: 'badge--retainer', label: 'Ongoing / Retainer' },
  shoot: { cls: 'badge--shoot', label: 'One-off Shoot' },
  both: { cls: 'badge--both', label: 'Retainer or One-off' },
}

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">What I Do</p>
          <h2 className="section-title">Services built to<br />make you look pro</h2>
          <p className="section-lede">
            Everything under one roof, whether you need someone in your corner
            every month or a single shoot done right. Ongoing retainers and
            one-off projects both welcome.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map((s) => {
            const IconEl = Icon[s.icon]
            const badge = BADGE[s.type]
            return (
              <article className="service" key={s.id}>
                <div className="service__icon">{IconEl && <IconEl />}</div>
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <span className={`badge ${badge.cls}`}>{badge.label}</span>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
