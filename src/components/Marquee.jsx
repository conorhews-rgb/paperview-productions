import { CREDIBILITY } from '../data'

export default function Marquee() {
  // Duplicate the list so the loop is seamless.
  const items = [...CREDIBILITY, ...CREDIBILITY]
  return (
    <section className="marquee" aria-label="Trusted by">
      <p className="marquee__label">Trusted with the media of</p>
      <div className="marquee__track">
        {items.map((name, i) => (
          <span className="marquee__item" key={i}>
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
