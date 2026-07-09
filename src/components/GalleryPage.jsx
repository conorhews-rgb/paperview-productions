import { useEffect, useState } from 'react'
import { asset } from '../data'
import { Icon } from './Icons'

// Full-screen, Instagram-feed-style page for a portfolio series.
// Opened via the URL hash (#gallery/<key>); `onClose` returns to the site.
export default function GalleryPage({ data, onClose }) {
  const items = data.items || []
  const [active, setActive] = useState(null) // lightbox index, or null

  // Esc closes the lightbox first, then the page.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (active !== null) setActive(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onClose])

  const thumb = (it) =>
    asset(it.type === 'video' ? it.poster || it.src : it.src)

  return (
    <div className="gallery" role="dialog" aria-label={data.title}>
      <div className="gallery__bar">
        <button className="gallery__back" onClick={onClose}>
          <Icon.arrowLeft /> Back
        </button>
        <a href="#top" className="gallery__brand" onClick={onClose} aria-label="Paperview Productions home">
          <img src={asset('/logo/Paperview-Productions-Logo-hz-gold.png')} alt="Paperview Productions" />
        </a>
        <a href="#contact" className="btn btn--primary gallery__book">Book a Shoot</a>
      </div>

      <div className="gallery__inner">
        <header className="gallery__head">
          <p className="eyebrow">Portfolio · Series</p>
          <h1 className="gallery__title">{data.title}</h1>
          <p className="gallery__intro">{data.intro}</p>
          <span className="gallery__count">
            {items.length} {items.length === 1 ? 'post' : 'posts'}
          </span>
        </header>

        {items.length === 0 ? (
          <div className="gallery__empty">
            <div className="gallery__grid gallery__grid--ghost" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="gallery__tile gallery__tile--skeleton" key={i}>
                  <Icon.grid />
                </div>
              ))}
            </div>
            <p className="gallery__empty-msg">
              Portraits from this series are dropping here soon.
            </p>
            <a href="#contact" className="btn btn--ghost" onClick={onClose}>
              Want to book a session?
            </a>
          </div>
        ) : (
          <div className="gallery__grid">
            {items.map((it, i) => (
              <button
                className="gallery__tile"
                key={i}
                onClick={() => setActive(i)}
                aria-label={it.caption || `Open item ${i + 1}`}
              >
                <img src={thumb(it)} alt={it.caption || ''} loading="lazy" />
                {it.type === 'video' && (
                  <span className="work__play" aria-hidden="true">
                    <Icon.play />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {active !== null && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <button className="lightbox__close" aria-label="Close" onClick={() => setActive(null)}>
            <Icon.close />
          </button>
          <div className="lightbox__stage" onClick={(e) => e.stopPropagation()}>
            {items[active].type === 'video' ? (
              <video
                src={asset(items[active].src)}
                poster={items[active].poster ? asset(items[active].poster) : undefined}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img src={asset(items[active].src)} alt={items[active].caption || ''} />
            )}
            {items[active].caption && <p className="lightbox__cap">{items[active].caption}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
