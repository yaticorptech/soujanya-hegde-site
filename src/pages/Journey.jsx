import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, H2 } from '../components/ui'
import { glideTo } from '../lib/smooth'
import useTitle from '../lib/useTitle'

const MILESTONES = [
  { yr: '6 mo.', title: 'First spotlight', text: 'Wins a Healthy Baby contest — her very first appearance on a stage. Over 600 prizes in dance, singing, elocution, fancy dress, rangoli and Yakshagana follow through school.' },
  { yr: '1994', title: 'Bala Prathibha Award', text: 'State-level recognition for a child performer; she serves as Vice-President of Bala Prathibha the same year, at St Agnes, Mangaluru.' },
  { yr: '1996', title: 'Yakshagana honours', text: 'Prathibha Puraskara from Shri Yakshanugraha Kala Sampada for Thenku Thittu Yakshagana, and the Most Talented Youth award from Sandesha Prathistana.' },
  { yr: '2000', title: 'Teen of the Year', text: <>National Youth Talent Hunt: winner of the South Indian zonals, runner-up at the nationals. The same year she receives the Rashtrapati Award for Bharat Scouts &amp; Guides from President K. R. Narayanan, and wins Boogie Woogie's state round twice over.</> },
  { yr: '2001', title: 'Miss Mangalore Jaycee Queen', text: <>Crowned at the city pageant, then Miss Karavali Udupi in 2002. Makes her film debut the same year in the Kannada feature <em>Mayajinke</em>.</> },
  { yr: '2006', title: 'Law, then management', text: 'Graduates in law from SDM Law College, Mangaluru — a national moot-court semi-finalist along the way — and adds an MBA diploma from ICFAI University in 2010.' },
  { yr: 'Abuja', title: 'The Nigeria decade', text: 'Moves to Abuja after marriage. Founds and runs Nrityalaya, a dance institute, serves as Cultural Secretary of the Indian Cultural Association, and receives a certificate of appreciation from the High Commissioner of India in 2012.' },
  { yr: '2016', title: 'Home to Mangaluru', text: <>Stars in the Tulu film <em>Bollilu</em> and opens Let'Z Party — the city's complete party store, and the first of the ventures she builds back home.</> },
  { yr: '2017', title: 'Mrs India Worldwide', text: <>From 8,000 entries to the top 60, then Vietnam for the semi-finals and the grand finale at Kingdom of Dreams, Gurugram. Finishes sixth and is crowned <strong>Mrs Popular</strong> at Haut Monde Mrs India Worldwide.</> },
  { yr: '2018', title: 'Mrs Mangalore, her own pageant', text: "As President of JCI Mangalore Lalbagh she organises coastal Karnataka's first pageant for married women — mentoring every contestant on the way to the crown." },
  { yr: '2019', title: 'Deyi Baidethi', text: <>Returns to the screen in the acclaimed Tulu film <em>Deyi Baidethi</em>, playing Kaajal Kunder and Seetha Kote.</> },
  { yr: '2024', title: 'SparkTree Foundation', text: 'Co-founds a soft-skills and public-speaking training company. Campus to Corporate, Step Up and Mic Magic programmes reach students, Lions leaders and corporate teams.' },
  { yr: '2025', title: 'Chatroom with Soujanya', text: 'Launches a YouTube talk show with the performers, creators and film stars of Tulunadu — the Shilpa Shetty episode alone crosses 78,000 views.' },
  { yr: '2026', title: 'KidFest — because every kid is a star', text: 'Two days, thirteen competitions, a flea market and stage performances at Palemar Convention Centre, Mangaluru, on 16 & 17 May — organised with SparkTree Foundation.' },
  { yr: '…', title: 'Next act', text: 'Your event.' },
]

const N = MILESTONES.length
// zig-zag path: one point per milestone, alternating high / low
const POINTS = MILESTONES.map((_, i) => `${i * 100 + 50},${i % 2 ? 260 : 140}`).join(' ')

const PIN = 0.55 // page px scrolled per px of sideways travel

export default function Journey() {
  useTitle('The Journey — Soujanya Hegde', 'From a six-month-old on stage to a stage of her own: 15 milestones.')
  const section = useRef(null)
  const track = useRef(null)
  const prog = useRef(null)
  const lit = useRef(null)
  const geo = useRef({ travel: 0, top: 0, span: 0, active: false })
  const activeIdx = useRef(-1)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const layout = () => {
      const sec = section.current
      const tr = track.current
      if (!sec || !tr) return
      if (reduce || window.innerWidth <= 900) {
        sec.style.height = ''
        tr.style.transform = ''
        geo.current.active = false
        return
      }
      const travel = Math.max(0, tr.scrollWidth - window.innerWidth)
      sec.style.height = `${Math.round(window.innerHeight + travel * PIN + 120)}px`
      geo.current = { travel, top: sec.offsetTop, span: sec.offsetHeight - window.innerHeight, active: travel > 0 }
    }

    const onScroll = () => {
      const { travel, top, span, active } = geo.current
      if (!active) return
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / span))
      track.current.style.transform = `translate3d(${(-p * travel).toFixed(1)}px,0,0)`
      if (prog.current) prog.current.style.width = `${(p * 100).toFixed(1)}%`
      if (lit.current) lit.current.style.strokeDashoffset = (100 - p * 100).toFixed(2)
      const idx = Math.round(p * (N - 1))
      if (idx !== activeIdx.current) {
        activeIdx.current = idx
        track.current.querySelectorAll('.ms').forEach((el, i) => el.classList.toggle('on', i === idx))
      }
    }

    let ticking = false
    const scrollHandler = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          onScroll()
          ticking = false
        })
      }
    }
    let rsz
    const resizeHandler = () => {
      clearTimeout(rsz)
      rsz = setTimeout(() => {
        layout()
        onScroll()
      }, 120)
    }

    layout()
    onScroll()
    const t = setTimeout(() => {
      layout()
      onScroll()
    }, 600)
    window.addEventListener('scroll', scrollHandler, { passive: true })
    window.addEventListener('resize', resizeHandler)
    return () => {
      clearTimeout(t)
      clearTimeout(rsz)
      window.removeEventListener('scroll', scrollHandler)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  const goTo = (i) => {
    const { top, span, active } = geo.current
    if (!active) return
    glideTo(top + (span / (N - 1)) * i)
  }

  const go = (dir) => {
    const { top, span, active } = geo.current
    if (!active) return
    const step = span / (N - 1)
    const cur = Math.round((window.scrollY - top) / step)
    goTo(Math.min(N - 1, Math.max(0, cur + dir)))
  }

  return (
    <section className="journey" id="journey" ref={section}>
      <div className="journey-sticky">
        <div className="journey-head">
          <div>
            <div className="kicker">The journey</div>
            <H2 d={0}>From a six-month-old on stage to a <em>stage of her own.</em></H2>
          </div>
          <div className="journey-ctl">
            <div className="journey-hint">
              <button type="button" aria-label="Previous milestone" onClick={() => go(-1)}>
                <ChevronLeft />
              </button>
              <span>Scroll — the years zig-zag sideways</span>
              <button type="button" aria-label="Next milestone" onClick={() => go(1)}>
                <ChevronRight />
              </button>
            </div>
            <div className="journey-prog" aria-hidden="true">
              <i ref={prog}></i>
            </div>
          </div>
        </div>
        <div className="journey-track" ref={track}>
          <svg className="jz" viewBox={`0 0 ${N * 100} 400`} preserveAspectRatio="none" aria-hidden="true">
            <polyline className="base" points={POINTS} />
            <polyline className="lit" points={POINTS} pathLength="100" ref={lit} />
          </svg>
          {MILESTONES.map((ms, i) => (
            <article key={ms.title} className="ms">
              <i className="dot" onClick={() => goTo(i)} title={ms.title}></i>
              <div className="txt">
                <div className="yr">{ms.yr}</div>
                <h3>{ms.title}</h3>
                <p>{ms.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
