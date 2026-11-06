import { useEffect, useMemo, useState } from 'react'
import { EVENTS } from '../events-data'

/* Entry experience: photo tiles from every album fly in and assemble into a
   full-screen collage wall around the brand, then the camera zooms through
   it into the page. Plays once per browser session; click skips. */

const SEEN_KEY = 'stk-intro-seen'

export const thumb = (src) => src.replace('/img/', '/img/t/')

/** Even sample of n photos across all event albums, interleaved so
    neighbouring tiles come from different events. */
export function samplePhotos(n) {
  const albums = EVENTS.map((e) => e.photos.map((p) => thumb(p.src)))
  const out = []
  for (let round = 0; out.length < n; round++) {
    let added = false
    for (const album of albums) {
      if (round < album.length && out.length < n) {
        out.push(album[round])
        added = true
      }
    }
    if (!added) break
  }
  return out
}

export default function Intro() {
  const [phase, setPhase] = useState(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return 'done'
    } catch { /* storage unavailable — just play */ }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'done' : 'play'
  })

  const tiles = useMemo(
    () =>
      samplePhotos(48).map((src) => ({
        src,
        dx: `${Math.round((Math.random() * 2 - 1) * 46)}vw`,
        dy: `${Math.round((Math.random() * 2 - 1) * 46)}vh`,
        rot: `${Math.round((Math.random() * 2 - 1) * 35)}deg`,
        delay: `${Math.round(Math.random() * 850)}ms`,
      })),
    [],
  )

  useEffect(() => {
    if (phase === 'done') return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'play') {
      const t = setTimeout(() => setPhase('zoom'), 2500)
      return () => clearTimeout(t)
    }
    if (phase === 'zoom') {
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch { /* ignore */ }
      const t = setTimeout(() => setPhase('done'), 950)
      return () => clearTimeout(t)
    }
  }, [phase])

  if (phase === 'done') return null

  return (
    <div
      className={`intro ${phase === 'zoom' ? 'zoom' : ''}`}
      onClick={() => phase === 'play' && setPhase('zoom')}
      role="presentation"
      aria-hidden="true"
    >
      <div className="intro-grid">
        {tiles.map((t, i) => (
          <img
            key={i}
            className="intro-tile"
            src={t.src}
            alt=""
            style={{ '--dx': t.dx, '--dy': t.dy, '--rot': t.rot, '--td': t.delay }}
          />
        ))}
      </div>
      <div className="intro-brand">
        <img src="/img/sparktree-logo.png" alt="" />
        <b>SparkTree Foundation</b>
        <small>Teach · Train · Transform</small>
      </div>
      <span className="intro-skip">tap anywhere to enter</span>
    </div>
  )
}
