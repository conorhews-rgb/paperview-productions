import { PIXIESET_URL } from '../data'
import { Icon } from './Icons'

export default function EventPhotos() {
  if (!PIXIESET_URL) return null

  return (
    <section className="section section--alt" id="event-photos">
      <div className="container">
        <div className="eventphotos">
          <div className="eventphotos__copy">
            <p className="eyebrow">Were You There?</p>
            <h2 className="section-title">Get your event photos</h2>
            <p className="section-lede">
              Shot at a fight night, weigh-in, or event we covered? Browse the
              full gallery and buy your photos straight from the source, no
              watermarks, high-res downloads and prints available.
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
          <div className="eventphotos__badge" aria-hidden="true">
            <Icon.photo />
          </div>
        </div>
      </div>
    </section>
  )
}
