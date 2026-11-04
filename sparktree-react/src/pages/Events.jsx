import { Link } from 'react-router-dom'
import { Reveal, useTitle } from '../components/shared'
import { EVENTS } from '../events-data'

export default function Events() {
  useTitle(
    'Events — SparkTree Foundation',
    "Photo stories from SparkTree workshops for kids, campuses, co-operatives, Lions Clubs and women's networks across Karnataka.",
  )

  return (
    <>
      <header className="hero" style={{ padding: '72px 0 10px' }}>
        <div className="wrap">
          <Reveal className="kicker">From the field</Reveal>
          <Reveal as="h1" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)' }}>
            Events &amp; <em>photo stories.</em>
          </Reveal>
          <Reveal as="p" className="lead">
            Every SparkTree workshop leaves a trail of first speeches, team games and thumbs-up group photos. Open an event to
            see the full album.
          </Reveal>
        </div>
      </header>

      <section style={{ padding: '50px 0 70px' }}>
        <div className="wrap">
          <div className="post-grid">
            {EVENTS.map((e) => (
              <Reveal as={Link} className="post-card" to={`/events/${e.slug}`} key={e.slug}>
                <div className="post-img">
                  <img src={e.cover} alt="" loading="lazy" />
                </div>
                <h2>{e.title}</h2>
                <p className="post-meta">{e.meta}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
