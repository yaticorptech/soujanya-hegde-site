import { useEffect, useRef } from 'react'
import { Kicker, H2, Lead } from '../components/ui'
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
  { yr: '2026', title: 'KidFest', text: 'Two days, thirteen competitions, a flea market and stage performances at Palemar Convention Centre, Mangaluru, on 16 & 17 May — organised with SparkTree Foundation.' },
  { yr: '…', title: 'Next act', text: 'Your event.' },
]

const N = MILESTONES.length
const SEG = 300 // viewBox units per milestone segment

// winding road: starts center-top, bends left/right through each milestone, ends center-bottom
const PATH = (() => {
  let d = 'M 500 0'
  let prev = [500, 0]
  MILESTONES.forEach((_, i) => {
    const x = i % 2 ? 700 : 300
    const y = (i + 0.5) * SEG
    d += ` C ${prev[0]} ${prev[1] + SEG * 0.45}, ${x} ${y - SEG * 0.45}, ${x} ${y}`
    prev = [x, y]
  })
  d += ` C ${prev[0]} ${prev[1] + SEG * 0.45}, 500 ${N * SEG - SEG * 0.45}, 500 ${N * SEG}`
  return d
})()

export default function Journey() {
  useTitle('The Journey — Soujanya Hegde', 'From a six-month-old on stage to a stage of her own: 15 milestones.')
  const wrap = useRef(null)
  const lit = useRef(null)

  useEffect(() => {
    const miles = wrap.current.querySelectorAll('.rmile')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (lit.current) lit.current.style.strokeDashoffset = '0'
      miles.forEach((el) => el.classList.add('lit'))
      return
    }
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const r = wrap.current.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height))
        if (lit.current) lit.current.style.strokeDashoffset = (100 - p * 100).toFixed(2)
        miles.forEach((el, i) => el.classList.toggle('lit', p >= (i + 0.45) / N))
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="sec jroad">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <Kicker>The journey</Kicker>
            <H2>From a six-month-old on stage to a <em>stage of her own.</em></H2>
          </div>
          <Lead>Follow the road — it lights up in gold as you travel through the years.</Lead>
        </div>
      </div>
      <div className="road-wrap" ref={wrap} style={{ '--n': N }}>
        <svg className="road-svg" viewBox={`0 0 1000 ${N * SEG}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="roadlit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E2B14C" />
              <stop offset="0.55" stopColor="#C97A3B" />
              <stop offset="1" stopColor="#E8456B" />
            </linearGradient>
          </defs>
          <path className="r-base" d={PATH} />
          <path className="r-lit" d={PATH} pathLength="100" ref={lit} stroke="url(#roadlit)" />
          <path className="r-dash" d={PATH} />
        </svg>
        {MILESTONES.map((ms, i) => (
          <div key={ms.title}>
            <div className={`rmile ${i % 2 ? 'mr' : 'ml'}`} style={{ top: `${((i + 0.5) / N) * 100}%` }}>
              <span>{ms.yr}</span>
            </div>
            <div className={`rcard ${i % 2 ? 'cl' : 'cr'}`} style={{ top: `${((i + 0.5) / N) * 100}%` }}>
              <h3>{ms.title}</h3>
              <p>{ms.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
