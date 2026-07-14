import { PIXIESET_URL, PIXIESET_LATEST } from '../data'
import { Icon } from './Icons'

export default function EventPhotos() {
  if (!PIXIESET_URL) return null

  const gallery = PIXIESET_LATEST?.name ? PIXIESET_LATEST : null

  return (
    <section className="section section--alt" id="event-photos">
      <div className="container">
        <div className="eventphotos">
          <div className="eventphotos__copy">
            <p className="eyebrow">Were You There?</p>
            <h2 className="section-title">Get your event photos</h2>
            <p className="section-lede">
              Were you at a fight night, grappling tournament, or event we
              covered? Browse the full gallery and buy your photos straight
              from the source, no watermarks, high-res downloads and prints
              available.
            </p>
            <a
              className="btn btn--primary eventphotos__cta"
              href={PIXIESET_URL}
              target="_blank"
              rel="noreferrer"
            >
              <Icon.photo /> Browse &amp; Buy Photos
            </a>
          </div>

          {gallery ? (
            <a
              className="eventphotos__latest"
              href={gallery.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`View the ${gallery.name} gallery`}
            >
              <img src={gallery.image} alt={gallery.name} loading="lazy" />
              <span className="eventphotos__latest-tag">
                <span className="eventphotos__latest-dot" aria-hidden="true" />
                Latest: {gallery.name}
              </span>
            </a>
          ) : (
            <div className="eventphotos__badge" aria-hidden="true">
              <Icon.photo />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
