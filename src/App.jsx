import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { initLenis, jumpToTop } from './lib/smooth'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'

// every page except Home loads on demand, keeping the first paint light
const About = lazy(() => import('./pages/About'))
const Journey = lazy(() => import('./pages/Journey'))
const International = lazy(() => import('./pages/International'))
const Awards = lazy(() => import('./pages/Awards'))
const SparkTree = lazy(() => import('./pages/SparkTree'))
const Chatroom = lazy(() => import('./pages/Chatroom'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Game = lazy(() => import('./pages/Game'))
const NotFound = lazy(() => import('./pages/NotFound'))

const PAGES = {
  '/': 'home', '/about': 'about', '/journey': 'journey',   '/international': 'international', '/awards': 'awards', '/sparktree': 'sparktree',
  '/chatroom': 'chatroom', '/gallery': 'gallery', '/contact': 'contact',
}

/** Golden spotlight that follows the cursor (fine pointers only). */
function Spot() {
  const ref = useRef(null)
  useEffect(() => {
    const fine = window.matchMedia('(pointer:fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    document.body.classList.add('spot-on')
    let tx = window.innerWidth / 2
    let ty = window.innerHeight * 0.3
    let cx = tx
    let cy = ty
    let raf = null
    const tick = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      if (ref.current) ref.current.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`
      raf = Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5 ? requestAnimationFrame(tick) : null
    }
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
      document.body.classList.remove('spot-on')
    }
  }, [])
  return <div id="spot" aria-hidden="true" ref={ref} />
}

/** Thin gold scroll-progress line across the top of the page. */
function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (ref.current) ref.current.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return <i id="sprog" ref={ref} aria-hidden="true" />
}

/**
 * Scroll-driven effects engine. Elements opt in via attributes:
 *  data-par="0.1"    parallax: layer drifts at its own speed
 *  data-zoom="0.1"   scales up as the layer scrolls past (combine with data-par)
 *  data-fx="grow"    scales 0.94→1 and fades in, scrubbed to scroll (reversible)
 *  data-fx="driftl"  / "driftr"  glides horizontally tied to scroll position
 *  data-skewv        skews with scroll velocity, settles back on stop
 */
function ScrollFX({ path }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pars = [...document.querySelectorAll('[data-par],[data-zoom]')]
    const fx = [...document.querySelectorAll('[data-fx]')]
    const skews = [...document.querySelectorAll('[data-skewv]')]
    if (!pars.length && !fx.length && !skews.length) return
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
    let lastY = window.scrollY
    let vel = 0
    let ticking = false

    const apply = () => {
      const vh = window.innerHeight
      const y = window.scrollY
      vel = vel * 0.86 + (y - lastY) * 0.14
      lastY = y

      pars.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -120 || r.top > vh + 120) return
        const mid = r.top + r.height / 2 - vh / 2
        const par = parseFloat(el.dataset.par || 0)
        const zoom = parseFloat(el.dataset.zoom || 0)
        let t = `translate3d(0,${(-mid * par).toFixed(1)}px,0)`
        if (zoom) t += ` scale(${(1 + clamp(-mid / vh, 0, 1) * zoom).toFixed(3)})`
        el.style.transform = t
      })

      fx.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -120 || r.top > vh + 120) return
        if (el.dataset.fx === 'grow') {
          const pe = clamp((vh - r.top) / (vh * 0.85), 0, 1)
          el.style.transform = `scale(${(0.94 + 0.06 * pe).toFixed(3)})`
          el.style.opacity = (0.3 + 0.7 * pe).toFixed(2)
        } else {
          const pc = (r.top + r.height / 2 - vh / 2) / vh
          const dir = el.dataset.fx === 'driftl' ? 1 : -1
          el.style.transform = `translate3d(${(pc * 70 * dir).toFixed(1)}px,0,0)`
        }
      })

      const sk = clamp(vel * 0.05, -5, 5)
      skews.forEach((el) => {
        el.style.transform = `skewX(${sk.toFixed(2)}deg)`
      })

      // keep animating until the velocity skew settles back to rest
      if (Math.abs(vel) > 0.3) requestAnimationFrame(apply)
      else ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [path])
  return null
}

/** Velvet curtain that closes over the old page and parts to reveal the new one. */
function RouteCurtain({ phase }) {
  return (
    <div className={`rcurtain ${phase}`} aria-hidden="true">
      <div className="panel l"></div>
      <div className="panel r"></div>
      <div className="rc-mono">
        <img src="/img/logo.jpg" alt="" />
      </div>
    </div>
  )
}

const CLOSE_MS = 480 // curtain fully shut — swap the page behind it
const OPEN_MS = 720 // panels fully parted again

export default function App() {
  const location = useLocation()
  const [shown, setShown] = useState(location) // the location actually rendered
  const [phase, setPhase] = useState('idle') // idle | closing | opening

  // luxury inertia scrolling, once for the whole app
  useEffect(() => initLenis(), [])

  // theatre-curtain routing: close over the old page, swap while covered, part to reveal
  useEffect(() => {
    if (location.pathname === shown.pathname) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(location)
      return
    }
    setPhase('closing')
    const t1 = setTimeout(() => {
      setShown(location)
      setPhase('opening')
    }, CLOSE_MS)
    const t2 = setTimeout(() => setPhase('idle'), CLOSE_MS + OPEN_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [location, shown.pathname])

  const pathname = shown.pathname

  // mirror the original per-page <body> attributes; runs while the curtain covers the swap
  useEffect(() => {
    jumpToTop()
    document.body.dataset.page = PAGES[pathname] || 'home'
    document.body.classList.toggle('inner', pathname !== '/')
    if (pathname !== '/') document.body.classList.add('ready')
  }, [pathname])

  return (
    <>
      <ScrollProgress />
      <ScrollFX path={pathname} />
      <Spot />
      <Nav />
      <main id="top">
        <Suspense fallback={<div className="route-fallback" />}>
          <Routes location={shown}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/international" element={<International />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/sparktree" element={<SparkTree />} />
          <Route path="/chatroom" element={<Chatroom />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <RouteCurtain phase={phase} />
    </>
  )
}
