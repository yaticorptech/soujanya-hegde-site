import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Lightbox, Reveal, useTitle } from '../components/shared'
import { EVENTS } from '../events-data'
import Events from './Events'

export default function Event() {
  const { slug } = useParams()
  const idx = EVENTS.findIndex((e) => e.slug === slug)
  const event = EVENTS[idx]
  const [lbIndex, setLbIndex] = useState(null)
  useTitle(event ? `${event.title} — SparkTree Foundation` : 'Events — SparkTree Foundation', event?.lead)

  if (!event) return <Events />
  const next = EVENTS[(idx + 1) % EVENTS.length]

  return (
    <>
      <header className="hero" style={{ padding: '64px 0 0' }}>
        <div className="wrap">
          <Reveal className="kicker">Photo story</Reveal>
          <Reveal as="h1" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>{event.title}</Reveal>
          <Reveal as="p" className="post-meta">{event.meta}</Reveal>
          <Reveal as="p" className="lead">{event.lead}</Reveal>
        </div>
      </header>

      <section style={{ padding: '40px 0 70px' }}>
        <div className="wrap">
          <div className="gal-event" style={{ marginTop: 0 }}>
            <div className="gal-grid">
              {event.photos.map((p, i) => (
                <figure key={p.src} onClick={() => setLbIndex(i)}>
                  <img src={p.src} alt={p.cap} loading="lazy" />
                  {p.cap && <figcaption>{p.cap}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
          <div className="gal-toggle" style={{ textAlign: 'center' }}>
            <Link className="btn btn--ghost" to="/events">← All events</Link>{' '}
            <Link className="btn btn--ghost" to={`/events/${next.slug}`}>Next event →</Link>
          </div>
        </div>
      </section>

      <Lightbox items={event.photos} index={lbIndex} onClose={() => setLbIndex(null)} onIndex={setLbIndex} />
    </>
  )
}
