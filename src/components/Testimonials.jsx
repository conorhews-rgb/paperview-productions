import { useEffect, useRef, useState } from 'react'
import { TESTIMONIALS, asset } from '../data'

// Fires once when the wrapped content first scrolls into view, so the whole
// testimonials block (video, names, descriptions) can fade up together.
// Respects prefers-reduced-motion by skipping straight to visible.
function useRevealOnScroll() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

// Merges a base className with the fade-up reveal classes/timing.
function reveal(baseClass, visible, delayMs) {
  return {
    className: `${baseClass ? baseClass + ' ' : ''}reveal-item${visible ? ' is-visible' : ''}`,
    style: { transitionDelay: `${delayMs}ms` },
  }
}

function VideoTestimonial({ t, visible, baseDelay = 0 }) {
  return (
    <div className="testimonial testimonial--video">
      <div {...reveal('testimonial__player', visible, baseDelay)}>
        <video
          controls
          preload="metadata"
          poster={t.poster ? asset(t.poster) : undefined}
          playsInline
        >
          <source src={asset(t.video)} type="video/mp4" />
          Your browser doesn’t support embedded video.
        </video>
      </div>
      <div className="testimonial__meta">
        <span
          {...reveal('testimonial__quotemark', visible, baseDelay + 150)}
          aria-hidden="true"
        >
          “
        </span>
        <p {...reveal('testimonial__caption', visible, baseDelay + 150)}>
          {t.caption}
        </p>
        <div {...reveal('testimonial__attr', visible, baseDelay + 300)}>
          <span className="testimonial__name">{t.name}</span>
          <span className="testimonial__role">{t.role}</span>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ t, visible, baseDelay = 0 }) {
  return (
    <figure className="testimonial-card">
      <div {...reveal('testimonial-card__player', visible, baseDelay)}>
        <video
          controls
          preload="metadata"
          poster={t.poster ? asset(t.poster) : undefined}
          playsInline
        >
          <source src={asset(t.video)} type="video/mp4" />
        </video>
      </div>
      <figcaption {...reveal('', visible, baseDelay + 150)}>
        <span className="testimonial__name">{t.name}</span>
        <span className="testimonial__role">{t.role}</span>
        <p className="testimonial-card__caption">{t.caption}</p>
      </figcaption>
    </figure>
  )
}

function TextTestimonial({ t, visible, baseDelay = 0 }) {
  return (
    <figure className="testimonial testimonial--text">
      <span {...reveal('testimonial__quotemark', visible, baseDelay)} aria-hidden="true">
        “
      </span>
      <blockquote {...reveal('', visible, baseDelay + 100)}>{t.quote}</blockquote>
      <figcaption {...reveal('', visible, baseDelay + 250)}>
        <span className="testimonial__name">{t.name}</span>
        <span className="testimonial__role">{t.role}</span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  const [ref, visible] = useRevealOnScroll()

  if (!TESTIMONIALS.length) return null

  const featured = TESTIMONIALS.find((t) => t.featured) || TESTIMONIALS[0]
  const rest = TESTIMONIALS.filter((t) => t !== featured)

  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">In Their Words</p>
          <h2 className="section-title">Don’t take our<br />word for it</h2>
          <p className="section-lede">
            The people who’ve trusted us with their media, including athletes who
            compete at the highest level, say it better than we can.
          </p>
        </div>

        <div ref={ref}>
          {featured.type === 'video' ? (
            <VideoTestimonial t={featured} visible={visible} baseDelay={0} />
          ) : (
            <TextTestimonial t={featured} visible={visible} baseDelay={0} />
          )}

          {rest.length > 0 && (
            <div className="testimonials__grid">
              {rest.map((t, i) => {
                const baseDelay = 350 + i * 150
                return t.type === 'video' ? (
                  <VideoCard key={t.id} t={t} visible={visible} baseDelay={baseDelay} />
                ) : (
                  <TextTestimonial key={t.id} t={t} visible={visible} baseDelay={baseDelay} />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
