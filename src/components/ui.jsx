import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'

/* ---------- typography (original class names) ---------- */

export function Kicker({ children, className = '', reveal = true, d = 0 }) {
  return reveal ? (
    <Reveal d={d} className={`kicker ${className}`.trim()}>{children}</Reveal>
  ) : (
    <div className={`kicker ${className}`.trim()}>{children}</div>
  )
}

/* Split headline content into per-word mask spans; inline elements (<em>) wrap each of their words. */
function splitWords(children, state, wrapper = null) {
  return Children.toArray(children).flatMap((child, ci) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child)
        .split(/(\s+)/)
        .map((part, pi) => {
          if (!part) return null
          if (/^\s+$/.test(part)) return ' '
          const i = state.i++
          return (
            <span className="wm" key={`${ci}-${pi}${wrapper ? 'e' : ''}`}>
              <span className="w" style={{ transitionDelay: `${state.base + i * 55}ms` }}>
                {wrapper ? cloneElement(wrapper, {}, part) : part}
              </span>
            </span>
          )
        })
    }
    if (isValidElement(child)) return splitWords(child.props.children, state, child)
    return child
  })
}

/** Big serif headline that assembles word by word as it enters the viewport. */
export function H2({ children, className = '', d = 1, ...rest }) {
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
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const state = { i: 0, base: d * 90 }
  return (
    <h2 ref={ref} className={`h2 ${inView ? 'in' : ''} ${className}`.trim()} {...rest}>
      {splitWords(children, state)}
    </h2>
  )
}

export function Lead({ children, className = '', d = 2, style }) {
  return (
    <Reveal as="p" d={d} className={`lead ${className}`.trim()} style={style}>
      {children}
    </Reveal>
  )
}

export function SectionHead({ kicker, title, lead }) {
  return (
    <div className="sec-head">
      <div>
        <Kicker>{kicker}</Kicker>
        <H2>{title}</H2>
      </div>
      <Lead>{lead}</Lead>
    </div>
  )
}

/* ---------- buttons (original .btn classes) ---------- */

const BTN_VARIANTS = {
  gold: 'btn btn--gold',
  ghost: 'btn btn--ghost',
  ink: 'btn btn--ink',
  wa: 'btn btn--wa',
  kid: 'btn btn--kid',
  kid2: 'btn btn--kid2',
}

export function Btn({ variant = 'gold', href, className = '', children, ...rest }) {
  const cls = `${BTN_VARIANTS[variant]} ${className}`.trim()
  if (href?.startsWith('/')) {
    return (
      <Link to={href} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={cls} target="_blank" rel="noopener" {...rest}>
      {children}
    </a>
  )
}

/* ---------- icons ---------- */

export const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.3.8 3.1.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.2c0-.2-.2-.3-.4-.4z" />
  </svg>
)

export const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.2zM9.8 15.1V8.9l6 3.1z" />
  </svg>
)

export const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

export const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 6l-6 6 6 6" />
  </svg>
)

export const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
