import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const WA = 'https://wa.me/919880842007'
export const waLink = (msg) => `${WA}?text=${encodeURIComponent(msg)}`

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

/** Reveal-on-scroll using the stylesheet's .rv / .in classes. */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      { threshold: 0.12 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`rv ${inView ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
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
