import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { FX, Nav, Footer } from './components/shared'
import Home from './pages/Home'
import Events from './pages/Events'
import Event from './pages/Event'
import Trainer from './pages/Trainer'
import { initLenis, jumpToTop, glideTo } from './lib/smooth'
import 'lenis/dist/lenis.css'

/** Scroll to top on route change; honour /#section links from any page. */
// A fresh visit always opens on the hero: no restored scroll position, no stale #hash jump.
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search)
  window.scrollTo(0, 0)
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // wait a tick so the target section exists after a route change
      requestAnimationFrame(() => glideTo(hash))
    } else {
      jumpToTop()
    }
  }, [pathname, hash])
  return null
}

/** Pause CSS animations in any section that is off screen; resume when it scrolls back (keeps the page light). */
function OffscreenPause() {
  const { pathname } = useLocation()
  useEffect(() => {
    let io
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.page > header, .page section, .page > div > header, header.sk-hero, footer')
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)),
        { rootMargin: '120px 0px' },
      )
      els.forEach((el) => io.observe(el))
    }, 60)
    return () => {
      clearTimeout(t)
      io?.disconnect()
    }
  }, [pathname])
  return null
}

export default function App() {
  useEffect(() => initLenis(), [])
  const { pathname } = useLocation()
  return (
    <>
      <ScrollManager />
      <OffscreenPause />
      <FX />
      <Nav />
      <div className="page" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<Event />} />
          <Route path="/trainers/:slug" element={<Trainer />} />
          <Route path="*" element={<Events />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
