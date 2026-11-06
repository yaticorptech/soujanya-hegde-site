import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { glideTo, lockScroll } from '../lib/smooth'

export const WA = 'https://wa.me/919880842007'
export const waLink = (msg) => `${WA}?text=${encodeURIComponent(msg)}`

const finePointer = () => window.matchMedia('(pointer: fine)').matches
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.1.1.5-.2 1.2z" />
  </svg>
)

export const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
)

/** One-shot in-view flag (always true under prefers-reduced-motion). */
export function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (reducedMotion()) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

/**
 * Reveal-on-scroll using the stylesheet's .rv / .in classes.
 * d = stagger step (90ms each); tilt = 3D mouse tilt + glare once revealed.
 */
export function Reveal({ as: Tag = 'div', className = '', d = 0, tilt = false, style, children, ...rest }) {
  const [ref, inView] = useInView()

  const onMove = tilt
    ? (e) => {
        if (!finePointer() || reducedMotion()) return
        const el = ref.current
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        el.style.setProperty('--rx', `${((py - 0.5) * -2 * 6).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${((px - 0.5) * 2 * 6).toFixed(2)}deg`)
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      }
    : undefined
  const onLeave = tilt
    ? () => {
        ref.current.style.setProperty('--rx', '0deg')
        ref.current.style.setProperty('--ry', '0deg')
      }
    : undefined

  return (
    <Tag
      ref={ref}
      className={`rv ${tilt ? 'tilt' : ''} ${inView ? 'in' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      style={{ transitionDelay: d ? `${d * 90}ms` : undefined, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
      {tilt && <i className="glare" aria-hidden="true" />}
    </Tag>
  )
}

/** Splits text into per-word mask spans for the assemble-on-view headline.
    The space must live OUTSIDE the overflow-hidden mask span — a trailing
    space inside an inline-block is collapsed and the words run together. */
export function Words({ text, from = 0, step = 70 }) {
  return text.split(' ').map((w, i) => (
    <Fragment key={i}>
      <span className="wm">
        <span className="w" style={{ transitionDelay: `${(from + i) * step}ms` }}>
          {w}
        </span>
      </span>
      {' '}
    </Fragment>
  ))
}

/** Cycles through words with a flip-up animation. */
export function RotatingWord({ words, interval = 2800 }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reducedMotion()) return
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval)
    return () => clearInterval(t)
  }, [words.length, interval])
  return (
    <span className="rot-wrap">
      <span className="rot-word" key={i}>
        {words[i]}
      </span>
    </span>
  )
}

/** Magnetic hover wrapper — the child gently follows the cursor. */
export function Mag({ children, strength = 0.22 }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (!finePointer() || reducedMotion()) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * strength).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * strength).toFixed(1)}px)`
  }
  const onLeave = () => {
    ref.current.style.transform = ''
  }
  return (
    <span className="mag" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  )
}

/** Global effects layer: scroll progress bar, nav shadow, cursor spotlight. */
export function FX() {
  const glowRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      document.querySelector('.nav')?.classList.toggle('scrolled', h.scrollTop > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return
    const glow = glowRef.current
    let x = innerWidth / 2
    let y = innerHeight / 3
    let tx = x
    let ty = y
    let raf = 0
    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      glow.style.opacity = 1
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div className="fx-glow" ref={glowRef} aria-hidden="true" />
    </>
  )
}

const NAV_LINKS = [
  { to: '/#takeaways', id: 'takeaways', label: 'What you learn' },
  { to: '/#workshops', id: 'workshops', label: 'Workshops' },
  { to: '/#programmes', id: 'programmes', label: 'Programmes' },
  { to: '/#trainers', id: 'trainers', label: 'Trainers' },
  { to: '/events', id: 'events', label: 'Events' },
  { to: '/#faq', id: 'faq', label: 'FAQ' },
]

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 10.5L12 3.5l8.5 7" />
    <path d="M5.5 9v10.5h13V9M10 19.5v-5h4v5" />
  </svg>
)

const NavArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
)

export function Nav() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const [pill, setPill] = useState(null)
  const { pathname } = useLocation()
  const listRef = useRef(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // which section is on screen (home) / which page (events)
  useEffect(() => {
    if (pathname.startsWith('/events')) {
      setCurrent('events')
      return
    }
    if (pathname !== '/') {
      setCurrent('')
      return
    }
    setCurrent('')
    const els = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    const onTop = () => window.scrollY < 200 && setCurrent('')
    window.addEventListener('scroll', onTop, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onTop)
    }
  }, [pathname])

  // lock page scroll + Esc to close while the mobile sheet is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lockScroll(true)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // sliding highlight: follows hover, rests on the current section
  const place = (el) => {
    const list = listRef.current
    if (!el || !list) return setPill(null)
    setPill({ x: el.offsetLeft, w: el.offsetWidth })
  }
  useEffect(() => {
    const list = listRef.current
    const el = list?.querySelector(`[data-id="${current}"]`)
    place(el || null)
  }, [current])

  // home: on the home page glide back to the hero, otherwise route to /
  const goHome = (e) => {
    setOpen(false)
    if (pathname === '/') {
      e.preventDefault()
      glideTo(0)
      if (window.location.hash) history.replaceState(null, '', '/')
    }
  }
  const atHero = pathname === '/' && current === ''

  const book = waLink("Hello, I'd like to know more about your workshops.")

  return (
    <nav className={`nav snav ${open ? 'is-open' : ''}`} aria-label="Main">
      <div className="wrap snav-bar">
        <Link className="brand snav-brand" to="/" aria-label="SparkTree Foundation home" onClick={goHome}>
          <img src="/img/sparktree-logo.png" alt="" />
          <span>
            SparkTree<small>Foundation</small>
          </span>
        </Link>

        <div
          className="snav-links"
          ref={listRef}
          onMouseLeave={() => place(listRef.current?.querySelector(`[data-id="${current}"]`) || null)}
        >
          <span
            className="snav-pill"
            aria-hidden="true"
            style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w, opacity: 1 } : { opacity: 0 }}
          />
          <Link to="/" className={`snav-home ${atHero ? 'on' : ''}`} aria-label="Home" title="Home" onClick={goHome}>
            <HomeIcon />
          </Link>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.id}
              to={l.to}
              data-id={l.id}
              className={current === l.id ? 'on' : ''}
              aria-current={current === l.id ? 'true' : undefined}
              onMouseEnter={(e) => place(e.currentTarget)}
              onFocus={(e) => place(e.currentTarget)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <a className="snav-cta" href={book} target="_blank" rel="noopener">
          <WaIcon />
          <span>Book a workshop</span>
        </a>

        <button
          className="snav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="snav-sheet"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="snav-sheet" id="snav-sheet" data-lenis-prevent aria-hidden={!open} inert={!open}>
        <div className="snav-sheet-in">
          <small className="snav-sheet-kick">Menu</small>
          <ul>
            <li style={{ '--i': -1 }}>
              <Link to="/" className={atHero ? 'on' : ''} onClick={goHome}>
                <em><HomeIcon /></em>
                <span>Home</span>
                <NavArrow />
              </Link>
            </li>
            {NAV_LINKS.map((l, i) => (
              <li key={l.id} style={{ '--i': i }}>
                <Link to={l.to} className={current === l.id ? 'on' : ''} onClick={() => setOpen(false)}>
                  <em>0{i + 1}</em>
                  <span>{l.label}</span>
                  <NavArrow />
                </Link>
              </li>
            ))}
          </ul>
          <div className="snav-sheet-foot" style={{ '--i': NAV_LINKS.length }}>
            <a className="snav-sheet-cta" href={book} target="_blank" rel="noopener">
              <WaIcon />
              Book a workshop on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <>
      <footer>
        <div className="wrap">
          <Link className="brand" to="/">
            <img src="/img/sparktree-logo.png" alt="" />
            <span>
              SparkTree<small>Foundation</small>
            </span>
          </Link>
          <span>© 2026 SparkTree Foundation. All rights reserved.</span>
          <span>
            Developed by{' '}
            <a href="https://yaticorp.com" target="_blank" rel="noopener">
              Yaticorp
            </a>
          </span>
          <a href={WA} target="_blank" rel="noopener">
            WhatsApp: +91 98808 42007
          </a>
        </div>
      </footer>
      <a className="wa-fab" href={waLink("Hello, I'd like to know more about your workshops.")} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <WaIcon />
      </a>
    </>
  )
}

/** Full-screen photo viewer using the stylesheet's .lb markup. */
export function Lightbox({ items, index, onClose, onIndex }) {
  const open = index != null
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    lockScroll(true)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, index, items.length, onClose, onIndex])

  if (!open) return null
  return (
    <div className="lb open" role="dialog" aria-label="Photo viewer" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="x" aria-label="Close" onClick={onClose}>✕</button>
      <button className="p" aria-label="Previous" onClick={() => onIndex((index - 1 + items.length) % items.length)}>‹</button>
      <img src={items[index].src} alt={items[index].cap || ''} />
      <button className="n" aria-label="Next" onClick={() => onIndex((index + 1) % items.length)}>›</button>
    </div>
  )
}

export function useTitle(title, description) {
  useEffect(() => {
    document.title = title
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
