import { HERO, asset } from '../data'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero__media">
        {HERO.video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={asset(HERO.image)}
            aria-hidden="true"
          >
            <source src={asset(HERO.video)} type="video/mp4" />
          </video>
        ) : (
          <img
            src={asset(HERO.image)}
            srcSet={
              HERO.imageMobile
                ? `${asset(HERO.imageMobile)} 1080w, ${asset(HERO.image)} 2000w`
                : undefined
            }
            sizes="100vw"
            alt=""
            fetchpriority="high"
          />
        )}
      </div>
      <div className="hero__scrim" />

      <div className="container">
        <div className="hero__inner">
          <p className="hero__kicker">Digital Media &amp; Content Production · Haverhill, MA</p>

          <h1 className="hero__title">
            Media that hits <span className="accent">harder.</span>
            <br />
            <span className="outline">Work</span> that shows up.
          </h1>

          <p className="hero__sub">
            Full-service video, photography, and social media for businesses that
            mean business — <strong>combat gyms, contractors, local shops,</strong> and
            the people who run them. Built with the eye of a media pro and the
            discipline of a fighter.
          </p>

          <div className="hero__cta">
            <a href="#contact" className="btn btn--primary">
              Start a Project
            </a>
            <a href="#work" className="btn btn--ghost">
              See the Work
            </a>
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <span />
        Scroll
      </div>
    </header>
  )
}
