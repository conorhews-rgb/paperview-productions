import BeholdWidget from '@behold/react'
import { INSTAGRAM } from '../data'
import { Icon } from './Icons'

export default function InstagramFeed() {
  if (!INSTAGRAM.beholdFeedId) return null

  return (
    <section className="section" id="feed">
      <div className="container">
        <div className="portfolio__feed">
          <div className="portfolio__feed-head">
            <div>
              <p className="eyebrow">Live from Instagram</p>
              <h3 className="portfolio__feed-title">Straight from Combat Zone MMA</h3>
              <p className="section-lede">
                The social we run day-to-day for Combat Zone MMA, pulled live
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
      </div>
    </section>
  )
}
