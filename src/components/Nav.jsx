import { useEffect, useState } from 'react'
import { asset } from '../data'

const LINKS = [
  ['Services', '#services'],
  ['Who We Work With', '#audience'],
  ['Work', '#work'],
  ['About', '#about'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="brand" onClick={close}>
          <img
            src={asset('/logo/Paperview-Productions-Logo-hz-gold.png')}
            alt="Paperview Productions"
            className="brand__logo"
          />
        </a>

        <div className={`nav__links ${open ? 'open' : ''}`}>
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={close}>
              {label}
            </a>
          ))}
          <a href="#contact" className="btn btn--primary" onClick={close}>
            Book / Inquire
          </a>
        </div>

        <button
          className={`nav__toggle ${open ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
