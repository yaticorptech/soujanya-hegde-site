import { useEffect, useRef } from 'react'
import Reveal from '../components/Reveal'
import { SectionHead } from '../components/ui'
import useTitle from '../lib/useTitle'

const ico = (path) => <svg viewBox="0 0 24 24" fill="currentColor">{path}</svg>

const AWARDS = [
  {
    hero: true,
    icon: ico(<><path d="M3 18h18l-1.5-9-4.5 4-3-7-3 7-4.5-4z" /><rect x="3" y="19" width="18" height="2" rx="1" /></>),
    title: 'Mrs Popular — Haut Monde Mrs India Worldwide',
    lvl: 'International · 2017 · 6th place',
    text: 'Shortlisted from 8,000 applications to the top 60, then top 50, 25 and 14 through semi-finals in Vietnam, before the grand finale at Kingdom of Dreams, Gurugram.',
    img: '/img/hero-saree.jpg',
  },
  {
    icon: ico(<path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7z" />),
    title: 'Teen of the Year', lvl: 'National · 2000',
    text: 'National Youth Talent Hunt — South zonal winner and national runner-up.', d: 1,
  },
  {
    icon: ico(<path d="M12 2a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2h6V7a3 3 0 0 0-3-3z" />),
    title: 'Rashtrapati Award', lvl: 'National · 2000',
    text: 'Bharat Scouts & Guides honour, presented by President K. R. Narayanan.', d: 1,
  },
  {
    icon: ico(<><path d="M5 4h14v3a7 7 0 0 1-14 0zM9 18h6v2H9z" /><path d="M11 14h2v4h-2z" /></>),
    title: 'Bala Prathibha Award', lvl: 'State · 1994',
    text: 'Early recognition for an all-round child performer in dance, elocution and Yakshagana.', d: 2,
  },
  {
    icon: ico(<path d="M12 3l3 5h5l-4 4 1.5 6L12 15l-5.5 3L8 12 4 8h5z" />),
    title: 'Miss Mangalore — Jaycee Queen', lvl: 'City · 2001',
    text: 'Followed by Miss Karavali Udupi (2002), Miss Fantasia (2000) and Miss Coastal runner-up (1999).', d: 2,
  },
  {
    icon: ico(<path d="M4 4h16v2H4zm2 4h12l-1 12H7zM9 10l.5 8h5l.5-8z" />),
    title: 'Cultural excellence', lvl: 'Bharatanatyam & Yakshagana',
    text: 'Prathibha Puraskara (1996), Kala Puraskar from Kadriya Kalavidaru (2007), Baila Queen (1997).', d: 3,
  },
  {
    icon: ico(<path d="M12 2a7 7 0 0 1 7 7c0 3-2 5-4 6.5V18H9v-2.5C7 14 5 12 5 9a7 7 0 0 1 7-7zm-3 18h6v2H9z" />),
    title: 'Youth Icon Achievement Award', lvl: 'Jnana Mandara Academy, Bengaluru · 2017',
    text: 'For a career spanning stage, screen, business and community leadership.', d: 3,
  },
  {
    icon: ico(<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z" />),
    title: "Woman's Day Achievement Award", lvl: "Rotary Ann's Club · 2016",
    text: "Recognised for work with children's events and women's platforms in Mangaluru.", d: 4,
  },
]

const HONOURS_L = [
  ['1994', 'Bala Prathibha Award — state level'],
  ['1996', 'Kesaru Gadde Ota winner; Most Talented Youth, Sandesha Prathistana; Prathibha Puraskara for Thenku Thittu Yakshagana'],
  ['1997', 'Baila Queen — state level'],
  ['1999', 'Boogie Woogie state dance winner; Miss Coastal runner-up; School Pupil Leader, St Agnes'],
  ['2000', 'Teen of the Year (National Youth Talent Hunt); Rashtrapati Award, Bharat Scouts & Guides; Miss Fantasia; Boogie Woogie state winner'],
  ['2001', 'Miss Mangalore — Jaycee Queen'],
  ['2002', 'Miss Karavali Udupi'],
  ['2003', 'Best Talented Leo of the Year'],
]

const HONOURS_R = [
  ['2005', 'Diamond Supreme Excellence Award in Lionism; Leo District President 324-D4 (2004–05); National Moot Court semi-finalist, Kerala Law Academy'],
  ['2006', 'Finalist, National Law Fest — V. M. Salgaocar College of Law, Goa'],
  ['2007', 'Kala Puraskar Award — Kadriya Kalavidaru'],
  ['2012', 'Certificate of appreciation — High Commissioner of India, Nigeria'],
  ['2016', "Woman's Day Achievement Award — Rotary Ann's Club"],
  ['2017', 'Youth Icon Achievement Award — Jnana Mandara Academy, Bengaluru; Mrs Popular, Haut Monde Mrs India Worldwide'],
  ['2018', 'President, JCI Mangalore Lalbagh — organiser of Mrs Mangalore'],
]

export default function Awards() {
  useTitle(
    'Awards & Recognition — Soujanya Hegde',
    'Mrs Popular at Mrs India Worldwide 2017, Teen of the Year, Rashtrapati Award and the full honours list.',
  )
  const grid = useRef(null)

  // original .tilt behaviour: 3D tilt + pointer-tracked glow (fine pointers only)
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = grid.current?.querySelectorAll('.tilt') || []
    const cleanups = []
    cards.forEach((c) => {
      const onMove = (e) => {
        const r = c.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        c.style.transform = `rotateX(${((0.5 - y) * 8).toFixed(2)}deg) rotateY(${((x - 0.5) * 10).toFixed(2)}deg) translateY(-4px)`
        c.style.setProperty('--mx', `${x * 100}%`)
        c.style.setProperty('--my', `${y * 100}%`)
      }
      const onLeave = () => {
        c.style.transform = ''
      }
      c.addEventListener('pointermove', onMove)
      c.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        c.removeEventListener('pointermove', onMove)
        c.removeEventListener('pointerleave', onLeave)
      })
    })
    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section className="sec sec--ivory" id="awards">
      <div className="wrap">
        <SectionHead
          kicker="Awards & recognition"
          title={<>A trophy shelf that started <em>before kindergarten.</em></>}
          lead="State, national and international honours across dance, pageantry, leadership and community service."
        />
        <div className="awards-grid" ref={grid} data-fx="grow">
          {AWARDS.map((a) =>
            a.hero ? (
              <Reveal key={a.title} as="article" className="award hero-award tilt">
                <div>
                  <div className="ico">{a.icon}</div>
                  <h3>{a.title}</h3>
                  <div className="lvl">{a.lvl}</div>
                  <p>{a.text}</p>
                </div>
                <figure>
                  <img src={a.img} alt="" loading="lazy" decoding="async" style={{ objectPosition: '50% 15%' }} />
                </figure>
              </Reveal>
            ) : (
              <Reveal key={a.title} as="article" className="award tilt" d={a.d || 0}>
                <div className="ico">{a.icon}</div>
                <h3>{a.title}</h3>
                <div className="lvl">{a.lvl}</div>
                <p>{a.text}</p>
              </Reveal>
            ),
          )}
        </div>
        <Reveal className="honours">
          <h3>The full honours list</h3>
          {[HONOURS_L, HONOURS_R].map((col, ci) => (
            <ol key={ci}>
              {col.map(([yr, text]) => (
                <li key={yr + text}>
                  <b>{yr}</b>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
