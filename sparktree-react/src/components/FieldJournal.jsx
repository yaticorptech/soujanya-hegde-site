import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { EVENTS } from '../events-data'
import { PICKS } from '../event-meta'
import { ArrowIcon } from './shared'


const FRAME_MS = 3400 // each photo; an album plays all its frames, then the next album wipes in
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* mini album: three photos stacked like prints; the active one deals the current frame on top */
function Stack({ picks, top, live }) {
  const order = [0, 1, 2].map((k) => picks[(top + k) % picks.length][0])
  return (
    <span className={`fj-stack ${live ? 'live' : ''}`} aria-hidden="true">
      {order.map((src, k) => (
        <img
          key={k === 0 && live ? `${src}-top-${top}` : src}
          className={k === 0 && live ? 'deal' : ''}
          src={`/img/${src}.jpg`}
          alt=""
          loading="lazy"
          style={{ '--k': k }}
        />
      )).reverse()}
    </span>
  )
}

export default function FieldJournal({ titles, metas }) {
  const events = EVENTS.filter((e) => PICKS[e.slug])
  // a = album, f = frame, prev = image still showing underneath while the new one wipes in, dir = wipe direction
  const [view, setView] = useState({ a: 0, f: 0, prev: null, dir: 1, album: false })
  const [inView, setInView] = useState(false)
  const boardRef = useRef(null)
  const indexRef = useRef(null)

  const { a: active, f: frame } = view
  const ev = events[active]
  const picks = PICKS[ev.slug]
  const auto = inView && !reduced()
  const srcOf = (v) => PICKS[events[v.a].slug][v.f][0]

  const show = (a, f, dir = 1) =>
    setView((v) => {
      const na = (a + events.length) % events.length
      if (na === v.a && f === v.f) return v
      return { a: na, f, prev: srcOf(v), dir, album: na !== v.a }
    })
  const go = (i, dir = 1) => show(i, 0, dir)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(boardRef.current)
    return () => io.disconnect()
  }, [])

  // autoplay: frame → frame inside the album, then on to the next album; any click restarts the clock
  useEffect(() => {
    if (!auto) return
    const id = setTimeout(() => (frame < picks.length - 1 ? show(active, frame + 1) : go(active + 1)), FRAME_MS)
    return () => clearTimeout(id)
  }, [auto, active, frame])

  // keep the active row visible inside the index (horizontal on phones) without scrolling the page
  useEffect(() => {
    const list = indexRef.current
    const row = list?.children[active]
    if (!row) return
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: row.offsetLeft - 4, behavior: 'smooth' })
    else if (list.scrollHeight > list.clientHeight) list.scrollTo({ top: row.offsetTop - list.clientHeight / 2 + row.clientHeight / 2, behavior: 'smooth' })
  }, [active])

  const [img, cap] = picks[frame]
  const count = ev.photos.length

  return (
    <div className={`fj-board ${auto ? 'is-auto' : ''}`} ref={boardRef} style={{ '--fj-ms': `${FRAME_MS}ms` }}>
      <div className="fj-main">
        <figure className="fj-stage">
          <div className="fj-frame">
          {/* previous shot stays underneath; the new one wipes across it (a full curtain sweep between albums) */}
          {view.prev && <img key={`p-${view.prev}`} className="fj-photo fj-under" src={`/img/${view.prev}.jpg`} alt="" />}
          <img
            key={`${active}-${img}`}
            className={`fj-photo fj-top ${view.album ? 'is-album' : ''} ${view.dir < 0 ? 'is-back' : ''}`}
            src={`/img/${img}.jpg`}
            alt={cap}
          />
          {view.album && <span key={`s-${active}`} className={`fj-sweep ${view.dir < 0 ? 'is-back' : ''}`} aria-hidden="true" />}
          <span className="fj-count" aria-hidden="true">
            <b>{String(active + 1).padStart(2, '0')}</b> / {String(events.length).padStart(2, '0')}
          </span>
          {/* story-style progress: one segment per photo in this album */}
          <div className="fj-segs" aria-hidden="true">
            {picks.map((_, i) => (
              <span key={`${active}-${i}`} className={i < frame ? 'done' : i === frame ? 'now' : ''}>
                <i key={`${active}-${frame}`} />
              </span>
            ))}
          </div>
          </div>
          <figcaption className={`fj-cap ${view.album ? 'is-album' : ''}`} key={`c-${active}`}>
            <small>{metas[ev.slug]}</small>
            <h3>{titles[ev.slug]}</h3>
            <p key={cap}>{cap}</p>
          </figcaption>
          <div className="fj-actions">
            <Link className="fj-open" to={`/events/${ev.slug}`}>
              Open album · {count}<span className="fj-ph">&nbsp;photos</span> <ArrowIcon />
            </Link>
            <div className="fj-nav">
              <button type="button" onClick={() => go(active - 1, -1)} aria-label="Previous event">
                <ArrowIcon />
              </button>
              <button type="button" onClick={() => go(active + 1)} aria-label="Next event">
                <ArrowIcon />
              </button>
            </div>
          </div>
        </figure>

        <div className="fj-thumbs" role="group" aria-label={`Photos from ${titles[ev.slug]}`}>
          {picks.map(([src, c], i) => (
            <button
              type="button"
              key={src}
              className={i === frame ? 'on' : ''}
              onClick={() => show(active, i, i < frame ? -1 : 1)}
              aria-label={c}
              aria-pressed={i === frame}
            >
              <img src={`/img/${src}.jpg`} alt="" loading="lazy" />
            </button>
          ))}
          <Link className="fj-more" to={`/events/${ev.slug}`} aria-label={`See all ${count} photos`}>
            <b>+{count - picks.length}</b>
            <span>more</span>
          </Link>
        </div>
      </div>

      <ol className="fj-index" ref={indexRef} aria-label="Workshops">
        {events.map((e, i) => (
          <li key={e.slug}>
            <button
              type="button"
              className={i === active ? 'on' : ''}
              onClick={() => go(i, i < active ? -1 : 1)}
              aria-current={i === active ? 'true' : undefined}
            >
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <span className="t">
                <b>{titles[e.slug]}</b>
                <small>{metas[e.slug]}</small>
              </span>
              <Stack picks={PICKS[e.slug]} top={i === active ? frame : 0} live={i === active} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
