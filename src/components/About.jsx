import { useEffect, useRef, useState } from 'react'
import { ABOUT, asset } from '../data'

// Counts a stat up from 0 to its target when it first scrolls into view.
// Preserves any non-numeric suffix (e.g. "100+", "100%") and respects
// prefers-reduced-motion.
function StatValue({ value }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const m = String(value).match(/^(\d+)(.*)$/)
    if (!m) return // non-numeric → leave as-is
    const target = parseInt(m[1], 10)
    const suffix = m[2]

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(value)
      return
    }

    // Start at 0 so the count-up is visible from the first frame.
    setDisplay(`0${suffix}`)

    let raf
    const run = () => {
      const duration = 1500
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
        setDisplay(`${Math.round(eased * target)}${suffix}`)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          obs.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    obs.observe(el)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return <div className="stat__value" ref={ref}>{display}</div>
}

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
                  <StatValue value={s.value} />
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
