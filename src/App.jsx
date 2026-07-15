import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Services from './components/Services'
import Audience from './components/Audience'
import Portfolio from './components/Portfolio'
import EventPhotos from './components/EventPhotos'
import InstagramFeed from './components/InstagramFeed'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import GalleryPage from './components/GalleryPage'
import { GALLERIES } from './data'

// Reads the gallery key out of the URL hash (#gallery/<key>). Any other hash
// (the section anchors like #work, #about) resolves to no open gallery.
function readGallery() {
  const h = window.location.hash.replace(/^#/, '')
  if (h.startsWith('gallery/')) {
    const key = h.slice('gallery/'.length)
    return GALLERIES[key] ? key : null
  }
  return null
}

export default function App() {
  const [gallery, setGallery] = useState(readGallery)

  useEffect(() => {
    const onHash = () => setGallery(readGallery())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Lock background scroll while the gallery page is open.
  useEffect(() => {
    document.body.style.overflow = gallery ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [gallery])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Audience />
        <Portfolio />
        <EventPhotos />
        <InstagramFeed />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />

      {gallery && (
        <GalleryPage
          data={GALLERIES[gallery]}
          onClose={() => {
            window.location.hash = 'work'
          }}
        />
      )}
    </>
  )
}
