import { useMemo, useState } from 'react'
import Reveal from '../components/Reveal'
import Lightbox from '../components/Lightbox'
import Pic from '../components/Pic'
import { SectionHead } from '../components/ui'
import { GALLERY, GALLERY_FILTERS } from '../data'
import useTitle from '../lib/useTitle'

const bySrc = Object.fromEntries(GALLERY.map((g) => [g.src, g]))
const pick = (names) => names.map((n) => bySrc[`/img/${n}.jpg`]).filter(Boolean)

/* film strips — a curated mix, each row loops in its own direction */
const STRIP_TOP = pick([
  'hero-saree', 'solo-021', 'yellow-mic', 'pageant-16', 'solo-073', 'award-stage',
  'solo-067', 'pageant-50', 'stage-point', 'solo-100', 'solo-034', 'podium-kannada',
])
const STRIP_BOTTOM = pick([
  'couple-32', 'lions-podium', 'couple-12', 'audience', 'couple-19', 'jci-presidential',
  'couple-03', 'couple-06', 'couple-16', 'engineering-event', 'couple-30', 'aicard-launch',
])

function FilmStrip({ items, reverse = false, onOpen }) {
  return (
    <div className={`gal-strip ${reverse ? 'rev' : ''}`.trim()}>
      {[...items, ...items].map((g, i) => (
        <figure key={i} onClick={() => onOpen(items, i % items.length)}>
          <Pic src={g.src} alt={g.cap} sizes="270px" />
          <figcaption>{g.cap}</figcaption>
        </figure>
      ))}
    </div>
  )
}

export default function Gallery() {
  useTitle('Gallery — Soujanya Hegde', 'Stages, smiles and spotlights — photos from the mic, the podium and the festival ground.')
  const [filter, setFilter] = useState('all')
  const [lb, setLb] = useState(null) // { list, idx }

  const visible = useMemo(
    () => (filter === 'all' ? GALLERY : GALLERY.filter((g) => g.cat === filter || g.also === filter)),
    [filter],
  )
  const open = (list, idx) => setLb({ list, idx })

  return (
    <section className="sec" id="gallery">
      <div className="wrap">
        <SectionHead
          kicker="The gallery"
          title={<>Stages, smiles <em>&amp; spotlights.</em></>}
          lead="Moments from the mic, the podium, the workshop floor and the festival ground. Tap any photo to view it full-screen."
        />
      </div>

      {/* moving film strips — full-bleed, opposite directions, hover to pause */}
      <Reveal className="gal-strips">
        <div data-skewv="">
          <FilmStrip items={STRIP_TOP} onOpen={open} />
          <FilmStrip items={STRIP_BOTTOM} reverse onOpen={open} />
        </div>
      </Reveal>

      <div className="wrap">
        <div className="gal-note">
          <i>✦</i>
          <span>The reels above drift on their own — hover to pause, tap any photo to zoom. Browse the full archive below.</span>
        </div>
        <Reveal className="filters" id="filters">
          {GALLERY_FILTERS.map((f) => (
            <button key={f.key} className={filter === f.key ? 'on' : ''} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </Reveal>
        {/* key by filter so cards re-run their staggered entrance on every switch */}
        <div className="masonry" id="masonry" key={filter} data-fx="grow">
          {visible.map((g, i) => (
            <Reveal key={g.src} as="figure" d={(i % 4) + 1} onClick={() => open(visible, i)}>
              <Pic src={g.src} alt={g.cap} sizes="(max-width: 700px) 50vw, 300px" />
              <figcaption>{g.cap}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>

      <Lightbox
        items={lb?.list ?? []}
        index={lb ? lb.idx : null}
        onClose={() => setLb(null)}
        onIndex={(i) => setLb((l) => ({ ...l, idx: i }))}
      />
    </section>
  )
}
