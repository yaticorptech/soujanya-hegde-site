import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

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
  const barRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    const onScroll = () => {
      const h = document.documentElement
      bar.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`
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
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      glow.style.opacity = 1
    }
    const tick = () => {
      x += (tx - x) * 0.09
      y += (ty - y) * 0.09
      glow.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div className="fx-progress" ref={barRef} aria-hidden="true" />
      <div className="fx-glow" ref={glowRef} aria-hidden="true" />
    </>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    ['/#takeaways', 'What you learn'],
    ['/#workshops', 'Workshops'],
    ['/#programmes', 'Programmes'],
    ['/#trainers', 'Trainers'],
    ['/events', 'Events'],
    ['/#faq', 'FAQ'],
  ]

  return (
    <nav className="nav">
      <div className="wrap">
        <Link className="brand" to="/">
          <img src="/img/sparktree-logo.png" alt="SparkTree Foundation logo" />
          <span>
            SparkTree<small>Foundation</small>
          </span>
        </Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          {links.map(([to, label]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
          <a className="btn btn--green" href={waLink("Hello, I'd like to know more about your workshops.")} target="_blank" rel="noopener">
            Book a workshop
          </a>
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
