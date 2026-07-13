import { BUSINESS, asset } from '../data'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#top" className="brand">
            <img
              src={asset('/logo/Paperview-Productions-Logo-hz-gold.png')}
              alt="Paperview Productions"
              className="brand__logo"
            />
          </a>
          <p>
            Digital media &amp; content production in {BUSINESS.location}. Video,
            photography, and social that makes your work look as good as it is.
          </p>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Services</h4>
            <a href="#services">Social Media Management</a>
            <a href="#services">Video Production</a>
            <a href="#services">Photography</a>
            <a href="#services">Headshots &amp; Portraits</a>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <a href="#audience">Who We Work With</a>
            <a href="#work">Portfolio</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer__col">
            <h4>Get In Touch</h4>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            <a href={`tel:${BUSINESS.phone.replace(/[^0-9+]/g, '')}`}>{BUSINESS.phone}</a>
            <a href={BUSINESS.instagram} target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {year} {BUSINESS.name}. All rights reserved.</span>
        <span>Grit. Discipline. Media that delivers.</span>
      </div>
    </footer>
  )
}
