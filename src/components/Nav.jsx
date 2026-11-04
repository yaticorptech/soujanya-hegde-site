import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS, SPARKTREE_URL, WA_BOOK, WHATSAPP } from '../data'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
        <div className="wrap">
          <Link className="brand" to="/">
            <img src="/img/logo.jpg" alt="" />
            <span>
              Soujanya <em>Hegde</em>
            </span>
          </Link>
          <nav aria-label="Main">
            <ul className="nav-links" id="navLinks">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <NavLink to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                      {l.label}
                    </NavLink>
                  ) : (
                    <a href={l.href} target="_blank" rel="noopener">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <a className="nav-cta" href={WA_BOOK} target="_blank" rel="noopener">
            Book Soujanya
          </a>
          <button
            className={`burger ${open ? 'open' : ''}`}
            id="burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <i></i>
            <i></i>
          </button>
        </div>
      </header>
      <div className={`menu ${open ? 'open' : ''}`} id="menu">
        {[
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About' },
          { to: '/journey', label: 'Journey' },
          { to: '/international', label: 'International stage' },
          { to: '/awards', label: 'Awards' },
          { href: 'sparktree', label: 'SparkTree Foundation' },
          { to: '/chatroom', label: 'Chatroom' },
          { to: '/gallery', label: 'Gallery' },
          { to: '/contact', label: 'Contact' },
        ].map((l, i) =>
          l.to ? (
            <Link key={l.label} to={l.to} style={{ transitionDelay: `${0.08 + i * 0.05}s` }}>
              {l.label}
            </Link>
          ) : (
            <a key={l.label} href={SPARKTREE_URL} target="_blank" rel="noopener" style={{ transitionDelay: `${0.08 + i * 0.05}s` }}>
              {l.label}
            </a>
          ),
        )}
        <div className="m-cta">
          <a className="btn btn--gold" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener">
            Book Soujanya on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
