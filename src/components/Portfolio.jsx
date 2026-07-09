import { useState } from 'react'
import BeholdWidget from '@behold/react'
import { PORTFOLIO, PORTFOLIO_FILTERS, INSTAGRAM, asset } from '../data'
import { Icon } from './Icons'

// A portfolio tile. Video items show a poster + play badge, and swap to an
// inline player when clicked.
function WorkTile({ w }) {
  const [playing, setPlaying] = useState(false)
  const hasVideo = Boolean(w.videoSrc)

  if (playing && hasVideo) {
    return (
      <article className="work work--playing">
        <video
          src={asset(w.videoSrc)}
          poster={asset(w.image)}
          controls
          autoPlay
          playsInline
          preload="metadata"
        />
      </article>
    )
  }

  const play = () => hasVideo && setPlaying(true)
  return (
    <article
      className="work"
      onClick={play}
      role={hasVideo ? 'button' : undefined}
      tabIndex={hasVideo ? 0 : undefined}
      aria-label={hasVideo ? `Play ${w.title}` : undefined}
      onKeyDown={
        hasVideo
          ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), play())
          : undefined
      }
    >
      <img src={asset(w.image)} alt={`${w.title} — ${w.client}`} loading="lazy" />
      {w.video && (
        <span className="work__play" aria-hidden="true">
          <Icon.play />
        </span>
      )}
      <div className="work__overlay">
        <span className="work__cat">{w.category}</span>
        <h3 className="work__title">{w.title}</h3>
        <span className="work__client">{w.client}</span>
      </div>
    </article>
  )
}

export default function Portfolio() {
  const [filter, setFilter] = useState('All')

  const items =
    filter === 'All'
      ? PORTFOLIO
      : PORTFOLIO.filter((w) => w.category === filter)

  return (
    <section className="section" id="work">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Selected Work</p>
          <h2 className="section-title">The portfolio</h2>
          <p className="section-lede">
            A snapshot of recent projects across gyms, promotions, local
            businesses, and private clients. Placeholders for now — real reels and
            galleries dropping in soon.
          </p>
        </div>

        <div className="filters">
          {PORTFOLIO_FILTERS.map((f) => (
            <button
              key={f}
              className={`filter ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="portfolio__grid">
          {items.map((w) => (
            <WorkTile key={w.id} w={w} />
          ))}
        </div>

        <p className="portfolio__note">
          ✕ &nbsp;Placeholder images — swap in your real photos &amp; video in{' '}
          <code>src/data.js</code>
        </p>

        {INSTAGRAM.beholdFeedId && (
          <div className="portfolio__feed">
            <div className="portfolio__feed-head">
              <div>
                <p className="eyebrow">Live from Instagram</p>
                <h3 className="portfolio__feed-title">Straight from Combat Zone MMA</h3>
                <p className="section-lede">
                  The social we run day-to-day for Combat Zone MMA — pulled live
                  from Instagram and updated automatically as new posts go up.
                </p>
              </div>
              <a
                className="btn btn--ghost portfolio__feed-follow"
                href={INSTAGRAM.url}
                target="_blank"
                rel="noreferrer"
              >
                <Icon.instagram /> Follow @{INSTAGRAM.handle}
              </a>
            </div>
            <div className="portfolio__feed-widget">
              <BeholdWidget feedId={INSTAGRAM.beholdFeedId} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
