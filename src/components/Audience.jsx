import { AUDIENCES } from '../data'

export default function Audience() {
  return (
    <section className="section section--alt" id="audience">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Who I Work With</p>
          <h2 className="section-title">Different clients.<br />Same standard.</h2>
          <p className="section-lede">
            You don't have to be a fighter to work with me. The gym down the street
            and the contractor across town get the exact same care — and so do you.
          </p>
        </div>

        <div className="audiences">
          {AUDIENCES.map((a, i) => (
            <article className="audience" key={a.id}>
              <div className="audience__num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{a.title}</h3>
              <p>{a.copy}</p>
              <span className="audience__tag">{a.tag}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
