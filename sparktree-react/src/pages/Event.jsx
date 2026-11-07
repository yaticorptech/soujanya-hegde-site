import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowIcon, Lightbox, Reveal, WaIcon, useTitle, waLink } from '../components/shared'
import { EVENTS } from '../events-data'
import { EVENT_INFO, EVENT_TAGS, PICKS, coverOf } from '../event-meta'
import { glideTo } from '../lib/smooth'
import Events from './Events'

export default function Event() {
  const { slug } = useParams()
  const idx = EVENTS.findIndex((e) => e.slug === slug)
  const event = EVENTS[idx]
  const [lbIndex, setLbIndex] = useState(null)
  useTitle(event ? `${event.title} — SparkTree Foundation` : 'Events — SparkTree Foundation', event?.lead)

  if (!event) return <Events />
  const info = EVENT_INFO[event.slug] || {}
  const tag = EVENT_TAGS.find(([k]) => k === info.tag)?.[1]
  const picks = PICKS[event.slug] || []
  const prev = EVENTS[(idx - 1 + EVENTS.length) % EVENTS.length]
  const next = EVENTS[(idx + 1) % EVENTS.length]
  const open = (src) => setLbIndex(Math.max(0, event.photos.findIndex((p) => p.src === src)))
  const chips = [info.place, info.when, info.days, `${event.photos.length} photos`].filter(Boolean)

  return (
    <>
      <header className="evd-hero">
        <div className="wrap evd-grid">
          <div className="evd-copy">
            <Reveal className="evd-crumbs">
              <Link to="/events">← All stories</Link>
              {tag && <em>{tag}</em>}
            </Reveal>
            <Reveal as="h1" className="evd-h" d={1}>{event.title}</Reveal>
            <Reveal className="evd-chips" d={2}>
              {chips.map((c) => <span key={c}>{c}</span>)}
            </Reveal>
            <Reveal as="p" className="evd-lead" d={2}>{event.lead}</Reveal>
            <Reveal className="evd-ctas" d={3}>
              <a
                className="btn btn--wa"
                href={waLink(`Hello, I saw the "${info.short || event.title}" photo story and would like a similar workshop for my team.`)}
                target="_blank"
                rel="noopener"
              >
                <WaIcon />
                Book a similar workshop
              </a>
              <button type="button" className="evd-jump" onClick={() => glideTo('#album')}>
                View all {event.photos.length} photos <ArrowIcon />
              </button>
            </Reveal>
          </div>
          <Reveal className="evd-stack" d={2}>
            {[0, 1, 2].map((k) => {
              const p = picks[k]
              const src = p ? `/img/${p[0]}.jpg` : k === 0 ? coverOf(event.slug, event.cover) : null
              if (!src) return null
              return (
                <button type="button" key={src} className={`evd-print evd-print--${k}`} onClick={() => open(src)} aria-label={p ? p[1] : 'Open photo'}>
                  <img src={src} alt="" />
                </button>
              )
            })}
          </Reveal>
        </div>
      </header>

      {picks.length > 0 && (
        <section className="evd-high">
          <div className="wrap">
            <Reveal className="evd-label">Highlights</Reveal>
            <div className="evd-high-row">
              {picks.map(([src, cap], k) => (
                <Reveal as="button" type="button" className="evd-hcard" d={k} key={src} onClick={() => open(`/img/${src}.jpg`)}>
                  <img src={`/img/${src}.jpg`} alt="" loading="lazy" />
                  <span>
                    <i>0{k + 1}</i>
                    {cap}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="evd-album" id="album">
        <div className="wrap">
          <div className="evd-album-head">
            <Reveal as="h2" className="evd-album-h">The full album</Reveal>
            <Reveal as="p" className="evd-album-n" d={1}>{event.photos.length} photos · tap any photo to view</Reveal>
          </div>
          {/* masonry columns keep every photo uncropped */}
          <div className="evd-masonry">
            {event.photos.map((p, i) => (
              <button type="button" className="evd-ph" key={p.src} onClick={() => setLbIndex(i)} aria-label={p.cap || `Photo ${i + 1}`}>
                <img src={p.src} alt="" loading="lazy" />
                <span className="evd-ph-n">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="evd-more">
        <div className="wrap evd-more-grid">
          {[
            ['Previous story', prev],
            ['Next story', next],
          ].map(([label, e]) => (
            <Link key={label} to={`/events/${e.slug}`} className={`evd-nav ${label.startsWith('Next') ? 'is-next' : ''}`}>
              <img src={coverOf(e.slug, e.cover)} alt="" loading="lazy" />
              <span>
                <small>{label}</small>
                <b>{EVENT_INFO[e.slug]?.short || e.title}</b>
                <em>{e.photos.length} photos <ArrowIcon /></em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Lightbox items={event.photos} index={lbIndex} onClose={() => setLbIndex(null)} onIndex={setLbIndex} />
    </>
  )
}
