import { ABOUT, asset } from '../data'

export default function About() {
  return (
    <section className="section section--alt" id="about">
      <div className="container">
        <div className="about__grid">
          <div className="about__media">
            <img src={asset(ABOUT.headshot)} alt="Founder of Paperview Productions" loading="lazy" />
          </div>

          <div className="about__body">
            <p className="eyebrow">The Story</p>
            <h2 className="section-title">Built in the corner,<br />sharpened in the field</h2>

            {ABOUT.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div className="about__stats">
              {ABOUT.stats.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="stat__value">{s.value}</div>
                  <div className="stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
