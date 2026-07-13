import { TESTIMONIALS, asset } from '../data'

function VideoTestimonial({ t }) {
  return (
    <div className="testimonial testimonial--video">
      <div className="testimonial__player">
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
        <span className="testimonial__quotemark" aria-hidden="true">“</span>
        <p className="testimonial__caption">{t.caption}</p>
        <div className="testimonial__attr">
          <span className="testimonial__name">{t.name}</span>
          <span className="testimonial__role">{t.role}</span>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ t }) {
  return (
    <figure className="testimonial-card">
      <div className="testimonial-card__player">
        <video
          controls
          preload="metadata"
          poster={t.poster ? asset(t.poster) : undefined}
          playsInline
        >
          <source src={asset(t.video)} type="video/mp4" />
        </video>
      </div>
      <figcaption>
        <span className="testimonial__name">{t.name}</span>
        <span className="testimonial__role">{t.role}</span>
        <p className="testimonial-card__caption">{t.caption}</p>
      </figcaption>
    </figure>
  )
}

function TextTestimonial({ t }) {
  return (
    <figure className="testimonial testimonial--text">
      <span className="testimonial__quotemark" aria-hidden="true">“</span>
      <blockquote>{t.quote}</blockquote>
      <figcaption>
        <span className="testimonial__name">{t.name}</span>
        <span className="testimonial__role">{t.role}</span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
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

        {featured.type === 'video' ? (
          <VideoTestimonial t={featured} />
        ) : (
          <TextTestimonial t={featured} />
        )}

        {rest.length > 0 && (
          <div className="testimonials__grid">
            {rest.map((t) =>
              t.type === 'video' ? (
                <VideoCard key={t.id} t={t} />
              ) : (
                <TextTestimonial key={t.id} t={t} />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  )
}
