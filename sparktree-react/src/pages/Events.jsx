import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon, Reveal, useTitle } from '../components/shared'
import { EVENTS } from '../events-data'
import { EVENT_INFO, EVENT_TAGS, PICKS, coverOf } from '../event-meta'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const TOTAL_PHOTOS = EVENTS.reduce((n, e) => n + e.photos.length, 0)
const metaLine = (info) => [info.place, info.when, info.days].filter(Boolean).join(' · ')

/** Hero mosaic: four frames that quietly cross-fade through every album's best shots. */
function Mosaic() {
  const pool = EVENTS.flatMap((e) => (PICKS[e.slug] || []).slice(0, 2).map(([src]) => `/img/${src}.jpg`))
  const [t, setT] = useState(0)
  useEffect(() => {
    if (reduced()) return
    const id = setInterval(() => setT((v) => v + 1), 2600)
    return () => clearInterval(id)
  }, [])
  // each tile advances on its own beat so only one changes at a time
  const tile = (k) => pool[(k * 5 + Math.floor((t + (4 - k)) / 4)) % pool.length]
  return (
    <div className="evh-mosaic" aria-hidden="true">
      {[0, 1, 2, 3].map((k) => {
        const src = tile(k)
        return (
          <div className={`evh-tile evh-tile--${k}`} key={k}>
            <img key={src} src={src} alt="" />
          </div>
        )
      })}
      <span className="evh-badge">
        <b>{TOTAL_PHOTOS}+</b>
        <small>moments captured</small>
      </span>
    </div>
  )
}

/** Card whose cover plays through the album's highlight frames while hovered. */
function StoryCard({ e, i }) {
  const info = EVENT_INFO[e.slug] || {}
  const frames = (PICKS[e.slug] || [[e.cover.replace('/img/', '').replace('.jpg', '')]]).map(([src]) => `/img/${src}.jpg`)
  const [f, setF] = useState(0)
  const timer = useRef(0)
  const start = () => {
    if (reduced() || frames.length < 2) return
    clearInterval(timer.current)
    timer.current = setInterval(() => setF((v) => (v + 1) % frames.length), 900)
  }
  const stop = () => {
    clearInterval(timer.current)
    setF(0)
  }
  useEffect(() => () => clearInterval(timer.current), [])
  const tag = EVENT_TAGS.find(([k]) => k === info.tag)?.[1]

  return (
    <Reveal
      as={Link}
      to={`/events/${e.slug}`}
      className="evc"
      d={i % 3}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <span className="evc-media">
        {frames.map((src, k) => (
          <img key={src} src={src} alt="" loading="lazy" className={k === f ? 'on' : ''} />
        ))}
        <span className="evc-count">{e.photos.length} photos</span>
        {frames.length > 1 && (
          <span className="evc-ticks" aria-hidden="true">
            {frames.map((src, k) => <i key={src} className={k === f ? 'on' : ''} />)}
          </span>
        )}
      </span>
      <span className="evc-body">
        <span className="evc-meta">
          {tag && <em>{tag}</em>}
          <span>{metaLine(info)}</span>
        </span>
        <b>{info.short || e.title}</b>
        <span className="evc-lead">{e.lead}</span>
        <span className="evc-go">
          <span className="evc-go-l">Open album</span>
          <span className="evc-go-s">{info.place || `${e.photos.length} photos`}</span>
          <ArrowIcon />
        </span>
      </span>
    </Reveal>
  )
}

export default function Events() {
  useTitle(
    'Events — SparkTree Foundation',
    "Photo stories from SparkTree workshops for kids, campuses, corporates, co-operatives, Lions Clubs, JCI and women's networks across India.",
  )
  const [tag, setTag] = useState('all')
  const [feat, ...rest] = EVENTS
  const featInfo = EVENT_INFO[feat.slug] || {}
  const list = tag === 'all' ? rest : EVENTS.filter((e) => EVENT_INFO[e.slug]?.tag === tag)
  const counts = Object.fromEntries(EVENT_TAGS.map(([k]) => [k, k === 'all' ? EVENTS.length : EVENTS.filter((e) => EVENT_INFO[e.slug]?.tag === k).length]))

  return (
    <>
      <header className="evh">
        <div className="wrap evh-grid">
          <div className="evh-copy">
            <Reveal className="evh-kicker">Field archive</Reveal>
            <Reveal as="h1" className="evh-h" d={1}>
              Events &amp; <em>photo stories.</em>
            </Reveal>
            <Reveal as="p" className="evh-lead" d={2}>
              Every SparkTree workshop leaves a trail of first speeches, team games and thumbs-up group photos. Open a story to
              see the full album.
            </Reveal>
            <Reveal className="evh-stats" d={3}>
              <span><b>{EVENTS.length}</b>photo stories</span>
              <span><b>{TOTAL_PHOTOS}</b>photos</span>
              <span><b>{EVENT_TAGS.length - 1}</b>kinds of rooms</span>
            </Reveal>
          </div>
          <Reveal d={2}>
            <Mosaic />
          </Reveal>
        </div>
      </header>

      <section className="evs">
        <div className="wrap">
          {/* latest story, given the room it deserves */}
          <Reveal as={Link} to={`/events/${feat.slug}`} className="evf">
            <span className="evf-media">
              <img src={coverOf(feat.slug, feat.cover)} alt="" />
              <span className="evf-flag">Latest story</span>
            </span>
            <span className="evf-body">
              <span className="evc-meta">
                <em>{EVENT_TAGS.find(([k]) => k === featInfo.tag)?.[1]}</em>
                <span>{metaLine(featInfo)}</span>
              </span>
              <b className="evf-title">{feat.title}</b>
              <span className="evf-lead">{feat.lead}</span>
              <span className="evf-thumbs" aria-hidden="true">
                {(PICKS[feat.slug] || []).slice(1, 4).map(([src]) => (
                  <img key={src} src={`/img/${src}.jpg`} alt="" loading="lazy" />
                ))}
                <span className="evf-more">+{feat.photos.length - 4}</span>
              </span>
              <span className="evf-cta">
                Open the album · {feat.photos.length} photos <ArrowIcon />
              </span>
            </span>
          </Reveal>

          <div className="evs-bar">
            <h2 className="evs-h">All stories</h2>
            <div className="evs-filters" role="group" aria-label="Filter stories">
              {EVENT_TAGS.map(([k, label]) => (
                <button key={k} type="button" className={tag === k ? 'on' : ''} aria-pressed={tag === k} onClick={() => setTag(k)}>
                  {label}
                  <i>{counts[k]}</i>
                </button>
              ))}
            </div>
          </div>

          <div className="evs-grid" key={tag}>
            {list.map((e, i) => (
              <StoryCard e={e} i={i} key={e.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
