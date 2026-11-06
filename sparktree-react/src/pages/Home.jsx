import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, Mag, WaIcon, ArrowIcon, waLink, useTitle } from '../components/shared'
import { EVENTS } from '../events-data'
import { TRAINERS as TRAINER_PROFILES } from '../trainers-data'
import SkillHero from '../components/SkillHero'

const PILLARS = [
  {
    icon: <path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zM6 12a6 6 0 0 0 12 0M12 18v3" />,
    title: 'Speak with confidence',
    text: 'Overcome stage fright, control nerves and sound clear in any meeting or presentation.',
    tags: ['Nerve control', 'Clear voice', 'Stage presence'],
  },
  {
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    title: 'Engage your audience',
    text: 'Use voice, tone and body language to hold attention and sound natural.',
    tags: ['Voice & tone', 'Body language', 'Eye contact'],
  },
  {
    icon: <path d="M4 6h16M4 12h10M4 18h7" />,
    title: 'Structure your message',
    text: 'Organise thoughts quickly and make your point in a clear, logical way.',
    tags: ['Quick ideation', 'Logical flow', 'Strong close'],
  },
]

/* ---- a realistic bough for the "three skills" cards (viewBox 1200 × 118, cards hang at y = 118) ---- */
const BW = 1200
const BH = 118
const boughY = (u) => 50 - 20 * Math.sin(Math.PI * u * 0.92) + 3.5 * Math.sin(5.2 * Math.PI * u) + 8 * u
const boughT = (u) => 15 * Math.pow(1 - u, 1.15) + 3.2
const BOUGH = (() => {
  const N = 60
  const top = []
  const bot = []
  for (let k = 0; k <= N; k++) {
    const u = k / N
    const x = -20 + u * (BW + 40)
    const y = boughY(u)
    const t = boughT(u) / 2
    top.push(`${x.toFixed(1)} ${(y - t).toFixed(1)}`)
    bot.unshift(`${x.toFixed(1)} ${(y + t).toFixed(1)}`)
  }
  const hi = []
  for (let k = 0; k <= N; k++) {
    const u = k / N
    hi.push(`${(-20 + u * (BW + 40)).toFixed(1)} ${(boughY(u) - boughT(u) / 2 + 1.6).toFixed(1)}`)
  }
  return { body: `M${top.join(' L')} L${bot.join(' L')} Z`, hi: `M${hi.join(' L')}` }
})()
const uOf = (x) => (x + 20) / (BW + 40)
const yAt = (x) => boughY(uOf(x))
/* twigs: start on the bough, curve out, carry a small leaf cluster */
const TWIGS = [[230, -1, 46, 30], [520, 1, 40, 22], [790, -1, 52, 26], [1050, -1, 40, 30], [1130, 1, 30, 16]].map(([x, dir, len, rise]) => {
  const y0 = yAt(x)
  const x1 = x + len
  const y1 = y0 + dir * rise
  return { d: `M${x} ${y0.toFixed(1)} Q${(x + len * 0.45).toFixed(1)} ${(y0 + dir * rise * 0.15).toFixed(1)} ${x1} ${y1.toFixed(1)}`, x1, y1, dir }
})
const KNOTS = [140, 410, 680, 960].map((x) => [x, yAt(x)])
/* vines: two per card, from the bough down to the card top */
const VINES = (() => {
  const g = 0.026
  const w = (1 - 2 * g) / 3
  const out = []
  for (let i = 0; i < 3; i++) {
    for (const f of [0.24, 0.76]) {
      const x = (i * (w + g) + f * w) * BW
      const y0 = yAt(x) + 2
      out.push({ x, y0, d: `M${x.toFixed(1)} ${y0.toFixed(1)} Q${(x + (f < 0.5 ? -5 : 5)).toFixed(1)} ${((y0 + BH) / 2).toFixed(1)} ${x.toFixed(1)} ${BH}` })
    }
  }
  return out
})()

const WORKSHOPS = [
  { title: 'Speak with Confidence', text: 'Overcome nerves and speak clearly and confidently in meetings, reviews and presentations.', who: 'Teams that present', img: '/img/mangalore-01.jpg', ev: 'mangalore' },
  { title: 'Confidence Building', text: 'Help your team beat stage fright, speak up in meetings and project authority.', who: 'Emerging leaders', img: '/img/hyderabad-01.jpg', ev: 'hyderabad' },
  { title: 'Public Speaking', text: 'Master voice, pace, body language and nerves for client calls and town halls.', who: 'Managers & client-facing teams', img: '/img/madikeri-ps-22.jpg', ev: 'madikeri-ps' },
  { title: "Exclusive Women's Workshop", text: 'A women-only, supportive space to build confidence and everyday speaking skills.', who: 'Women professionals', img: '/img/women-11.jpg', ev: 'women' },
  { title: 'Campus to Corporate', text: 'Prepare students and new hires for interviews, group discussions and meeting etiquette.', who: 'Students & new joinees', img: '/img/yaticorp-01.jpg', ev: 'yaticorp' },
]

const WsIc = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const WS_META = (w) => [
  [<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.3A6.5 6.5 0 0 1 21.5 20" /></>, w.who],
  [<><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>, '1 day onsite · or 2 virtual half-days'],
  [<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>, '16–24 per batch'],
]

/** One workshop's details — used by the desktop panel and the mobile accordion. */
function WsDetail({ w, i }) {
  return (
    <>
      <figure className="wsx-photo">
        <img src={w.img} alt="" loading="lazy" />
        <figcaption>Workshop 0{i + 1}</figcaption>
      </figure>
      <div className="wsx-body">
        <h3>{w.title}</h3>
        <p>{w.text}</p>
        <ul className="wsx-meta">
          {WS_META(w).map(([d, t]) => (
            <li key={t}><WsIc d={d} />{t}</li>
          ))}
        </ul>
        <div className="wsx-ctas">
          <a className="btn btn--wa" href={waLink(`Hello, I'd like to book the ${w.title} workshop.`)} target="_blank" rel="noopener">
            <WaIcon />Book this workshop
          </a>
          <Link className="wsx-see" to={`/events/${w.ev}`}>See it in action <ArrowIcon /></Link>
        </div>
      </div>
    </>
  )
}

/** Phones: swipeable snap carousel of compact workshop cards. */
function WorkshopRail() {
  const railRef = useRef(null)
  const [cur, setCur] = useState(0)
  const onScroll = () => {
    const el = railRef.current
    if (!el) return
    const card = el.firstElementChild
    const step = card ? card.offsetWidth + 14 : el.clientWidth
    setCur(Math.max(0, Math.min(WORKSHOPS.length - 1, Math.round(el.scrollLeft / step))))
  }
  return (
    <div className="wsr">
      <div className="wsr-rail" ref={railRef} onScroll={onScroll}>
        {WORKSHOPS.map((w, i) => (
          <article key={w.title} className={`wsr-card ${i === cur ? 'on' : ''}`} style={{ '--i': i }}>
            <figure className="wsr-photo">
              <img src={w.img} alt="" loading="lazy" />
              <span className="wsr-num">0{i + 1} <i>/ 0{WORKSHOPS.length}</i></span>
              <figcaption>
                <b>{w.title}</b>
                <small>{w.who}</small>
              </figcaption>
            </figure>
            <div className="wsr-body">
              <p>{w.text}</p>
              <div className="wsr-meta">
                <span><WsIc d={<><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>} />1 day · or 2 half-days</span>
                <span><WsIc d={<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /></>} />16–24 / batch</span>
              </div>
              <div className="wsr-ctas">
                <a className="wsr-book" href={waLink(`Hello, I'd like to book the ${w.title} workshop.`)} target="_blank" rel="noopener">
                  <WaIcon />Book
                </a>
                <Link className="wsr-see" to={`/events/${w.ev}`} aria-label={`See ${w.title} in action`}>
                  See it in action <ArrowIcon />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function WorkshopExplorer() {
  const [active, setActive] = useState(0)
  const w = WORKSHOPS[active]
  return (
    <>
      <div className="wsx">
        <ol className="wsx-list">
          {WORKSHOPS.map((x, i) => (
            <li key={x.title} className={i === active ? 'on' : ''}>
              <button
                type="button"
                className="wsx-row"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="wsx-n">0{i + 1}</span>
                <span className="wsx-t">
                  <b>{x.title}</b>
                  <small>{x.who}</small>
                </span>
                <span className="wsx-arrow" aria-hidden="true"><ArrowIcon /></span>
              </button>
            </li>
          ))}
        </ol>
        <div className="wsx-panel" aria-live="polite">
          <div className="wsx-panel-in" key={active}>
            <WsDetail w={w} i={active} />
          </div>
        </div>
      </div>
      <WorkshopRail />
    </>
  )
}

const PROGRAMMES = [
  ['Pre-recruitment programme', 'Campus to Corporate', '/img/sparktree-03.jpg', 'alvas', 'Interviews, group discussions and workplace etiquette for final-year students and new joinees.'],
  ['Building Lion leaders of tomorrow', 'Step Up', '/img/sparktree-06.jpg', 'madikeri', 'Confidence and stage time for Lions Club members stepping into leadership roles.'],
  ['Leadership training programme', 'Rise to Level Up', '/img/sparktree-12.jpg', 'hyderabad', 'Drills, role plays and stage time that help emerging leaders discover their voice.'],
  ["Women's Networking Club", 'Mic Magic', '/img/sparktree-07.jpg', 'women', 'Body language, speech structure and ideation in a supportive, women-only room.'],
]

const STATS = [
  [100, '+', 'Corporates & teams trained', <><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" /></>],
  [10, '+', 'Programmes across India', <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>],
  [240, '+', 'Workshop moments captured', <><path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>],
  [2, '', 'Lead trainers on every floor', <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.3A6.5 6.5 0 0 1 21.5 20" /></>],
]

const STRIP = [
  ['yaticorp', 'yaticorp-01'], ['kadaba', 'kadaba-09'], ['mangalore', 'mangalore-02'], ['alvas', 'alvas-12'],
  ['madikeri-ps', 'madikeri-ps-01'], ['bootcamp', 'bootcamp-01'], ['yaticorp', 'yaticorp-20'], ['atmashakthi', 'atmashakthi-12'],
  ['madikeri', 'madikeri-03'], ['women', 'women-11'], ['kadaba', 'kadaba-05'], ['mangalore', 'mangalore-01'],
  ['yaticorp', 'yaticorp-10'], ['hyderabad', 'hyderabad-01'], ['madikeri-ps', 'madikeri-ps-25'], ['bootcamp', 'bootcamp-02'],
  ['hyderabad', 'hyderabad-12'],
]
const STRIP_B = [...STRIP].reverse()

/** Counts up when scrolled into view. */
function Count({ to, delay = 0, dur = 1600 }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to)
      return
    }
    let raf = 0
    let timer = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        timer = setTimeout(() => {
          const t0 = performance.now()
          const step = (now) => {
            const p = Math.min(1, (now - t0) / dur)
            setVal(Math.round(to * (1 - Math.pow(1 - p, 4))))
            if (p < 1) raf = requestAnimationFrame(step)
          }
          raf = requestAnimationFrame(step)
        }, delay)
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => {
      io.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [to, delay, dur])
  return <span ref={ref}>{val}</span>
}

/** Cycles through a trainer's roles. */
function RoleTicker({ roles }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2200)
    return () => clearInterval(id)
  }, [roles.length])
  return (
    <span className="trn-role" aria-label={roles.join(', ')}>
      <span className="trn-role-dot" aria-hidden="true" />
      <span className="trn-role-w" key={i} aria-hidden="true">{roles[i]}</span>
    </span>
  )
}

/** Bento grid: one featured programme + three tiles, each opens its event album. */
function ProgrammeBento() {
  return (
    <div className="pgb">
      {PROGRAMMES.map(([small, name, img, ev, text], i) => (
        <Link key={name} to={`/events/${ev}`} className={`pgb-card pgb-card--${i + 1}`} style={{ '--i': i }} aria-label={`${name} — ${small}. See the album`}>
          <img src={img} alt="" loading="lazy" />
          <span className="pgb-shade" aria-hidden="true" />
          <span className="pgb-top" aria-hidden="true">
            <em>0{i + 1}</em>
            <span className="pgb-go"><ArrowIcon /></span>
          </span>
          <span className="pgb-cap">
            <small>{small}</small>
            <b>{name}</b>
            <span className="pgb-text">{text}</span>
            {i === 0 && <span className="pgb-cta">See the album <ArrowIcon /></span>}
          </span>
        </Link>
      ))}
    </div>
  )
}

const QUOTES = [
  ['★★★★★', 'Step Up by SparkTree was a truly transformative experience. Confidence soared and communication skills sharpened. The sessions pushed us beyond our comfort zones.', 'BG', 'Lion Bindu Ganapathi', 'Zone Chairperson'],
  ['★★★★', 'The Mic Magic session was truly a game changer — body language, speech structure, ideation and all the little details that make a big difference. It gave me the confidence to deliver a speech on any topic.', 'AM', 'Alka Manoj', 'Founder & Designer, Ohana by Alka'],
  ['★★★★★', "SparkTree's Campus to Corporate training for our new joinees exceeded all expectations — content-rich sessions packed with learning, delivered with fun and engagement.", 'K', 'Kripa', 'General Manager, YatiCorp India'],
]

const QUOTE_PROG = ['Step Up', 'Mic Magic', 'Campus to Corporate']
const QUOTE_MS = 7000

/** One big rotating quote + a picker of who said it. */
function QuoteStage() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setI((v) => (v + 1) % QUOTES.length), QUOTE_MS)
    return () => clearTimeout(id)
  }, [i, paused])
  const [stars, text, , who, role] = QUOTES[i]
  return (
    <div className={`qs ${paused ? 'is-paused' : ''}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <figure className="qs-stage" aria-live="polite">
        <svg className="qs-mark" viewBox="0 0 64 48" aria-hidden="true">
          <path d="M0 48V28C0 12 8 3 24 0l3 6C17 9 13 15 12 24h12v24zm36 0V28c0-16 8-25 24-28l3 6c-10 3-14 9-15 18h12v24z" />
        </svg>
        <div className="qs-in" key={i}>
          <div className="qs-stars" aria-label={`${stars.length} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, k) => (
              <svg key={k} viewBox="0 0 24 24" className={k < stars.length ? 'on' : ''} aria-hidden="true">
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.5 6.6-.8z" />
              </svg>
            ))}
          </div>
          <blockquote>{text}</blockquote>
          <figcaption>
            <b>{who}</b>
            <span>{role}</span>
          </figcaption>
        </div>
      </figure>

      <div className="qs-pick" role="tablist" aria-label="Choose a testimonial">
        {QUOTES.map(([, , av, name, r], k) => (
          <button key={name} type="button" role="tab" aria-selected={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)}>
            <span className="qs-av">
              {av}
              <svg className="qs-ring" viewBox="0 0 60 60" aria-hidden="true">
                <circle className="track" cx="30" cy="30" r="28" />
                <circle className="fill" cx="30" cy="30" r="28" pathLength="1" key={k === i ? `r-${i}` : 'off'} style={{ animationDuration: `${QUOTE_MS}ms` }} />
              </svg>
            </span>
            <span className="qs-who">
              <b>{name}</b>
              <small>{QUOTE_PROG[k]} · {r.split(',')[0]}</small>
            </span>
            <span className="qs-bar" aria-hidden="true"><i key={k === i ? `on-${i}` : 'off'} style={{ animationDuration: `${QUOTE_MS}ms` }} /></span>
          </button>
        ))}
      </div>
    </div>
  )
}

const FAQ = [
  ['Who are these workshops for?', 'Teams that present at work — sales, product, marketing, operations, managers and emerging leaders — plus students and new hires through Campus to Corporate.'],
  ['What is the format?', 'A one-day onsite session, or two half-day virtual sessions. Every programme is customised to your goals after a quick needs analysis.'],
  ['What group size works best?', 'An ideal batch is 16–24 participants, so everyone gets speaking time and individual feedback. Larger teams run in multiple batches.'],
  ['How do pricing and dates work?', 'Share your team size, location and preferred dates — we send a tailored quote and lock the calendar together.'],
]

const FIELD_COVERS = {
  yaticorp: '28 photos · 5-day programme',
  hyderabad: '25 photos · with JCI Hyderabad Deccan',
  kadaba: '41 photos · kids & Lions Club Panja', mangalore: '33 photos · two-day session',
  alvas: '22 photos · campus to corporate', atmashakthi: '22 photos · 35+ centres',
  bootcamp: '22 photos · Mangalore', madikeri: '12 photos · Lions Club Murnad',
  women: '11 photos · Mangalore', 'madikeri-ps': '27 photos · one-day',
}
const FIELD_TITLES = {
  yaticorp: 'Campus to Corporate — YatiCorp, 5 days',
  hyderabad: 'Rise to Level Up — Hyderabad',
  kadaba: 'Speech Spark Junior — Kadaba', mangalore: 'Presentation Skills for Kids — Mangalore',
  alvas: "Pre-Recruitment — Alva's, Moodbidri", atmashakthi: 'Managerial Enrichment — Athmashakthi',
  bootcamp: 'Confidence Bootcamp for Kids', madikeri: 'Lions Workshop — Madikeri',
  women: "Mic Magic — Women's Networking Club", 'madikeri-ps': 'Presentation Skills Intensive — Madikeri',
}

/** Accordion with animated open/close (replaces native <details>). */
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq" style={{ textAlign: 'left' }}>
      {FAQ.map(([q, a], i) => (
        <Reveal className={`faq-item ${open === i ? 'open' : ''}`} key={q} d={i % 2}>
          <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            {q}
            <span className="pm" aria-hidden="true">+</span>
          </button>
          <div className="faq-body">
            <div>
              <p>{a}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export default function Home() {
  useTitle(
    'SparkTree Foundation — Soft-skills & Public-speaking Workshops',
    'SparkTree Foundation designs custom soft-skills and public-speaking workshops for teams, campuses and leaders.',
  )

  return (
    <>
      <SkillHero />

      <section id="takeaways" className="tk">
        <div className="wrap">
          <div className="tk-head">
            <div>
              <Reveal className="kicker">What every participant takes home</Reveal>
              <Reveal as="h2" className="h2" d={1}>Three skills. <em>For life.</em></Reveal>
            </div>
            <Reveal as="p" className="tk-lead" d={2}>
              A one-day onsite or two virtual half-days — whatever the format, every SparkTree programme is built around these three.
            </Reveal>
          </div>

          <Reveal className="tk-path">
            <svg className="tk-bough" viewBox={`0 0 ${BW} ${BH}`} preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="tkBark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#A07D3E" />
                  <stop offset=".45" stopColor="#7A5C28" />
                  <stop offset="1" stopColor="#4A3717" />
                </linearGradient>
                <linearGradient id="tkLeafJ" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#2F8A5E" />
                  <stop offset="1" stopColor="#8FDDB5" />
                </linearGradient>
                <linearGradient id="tkLeafG" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#A8812F" />
                  <stop offset="1" stopColor="#F0D58A" />
                </linearGradient>
                <linearGradient id="tkVine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#6E5424" />
                  <stop offset="1" stopColor="#D2AE57" />
                </linearGradient>
                <mask id="tkGrow" maskUnits="userSpaceOnUse" x="-40" y="-40" width={BW + 80} height={BH + 80}>
                  <rect className="tk-grow" x="-40" y="-40" width={BW + 80} height={BH + 80} fill="#fff" />
                </mask>
              </defs>

              <g className="tk-vines">
                {VINES.map((v, k) => (
                  <path key={k} d={v.d} pathLength="1" style={{ '--k': k }} />
                ))}
              </g>

              <g mask="url(#tkGrow)">
                <path className="bark" d={BOUGH.body} />
                <path className="bark-hi" d={BOUGH.hi} />
                {KNOTS.map(([x, y], k) => (
                  <ellipse key={k} className="knot" cx={x} cy={y.toFixed(1)} rx="5" ry="2.2" />
                ))}
                {TWIGS.map((t, k) => (
                  <path key={k} className="twig" d={t.d} />
                ))}
              </g>

              <g className="tk-tufts">
                {TWIGS.flatMap((t, k) =>
                  [[-28, 1], [18, 0.85], [62, 0.7]].map(([a, sc], m) => (
                    <g key={`${k}-${m}`} transform={`translate(${t.x1} ${t.y1.toFixed(1)}) rotate(${(t.dir < 0 ? -40 : 30) + a}) scale(${sc})`}>
                      <path className={`leaf ${(k + m) % 3 === 1 ? 'leaf--g' : 'leaf--j'}`} d="M0 0 C7 -9 21 -9 30 0 C21 9 7 9 0 0Z" style={{ '--k': k * 3 + m }} />
                    </g>
                  )),
                )}
                {[[90, -1], [330, 1], [610, -1], [870, 1], [1180, -1]].map(([x, side], k) => (
                  <g key={`b${k}`} transform={`translate(${x} ${(yAt(x) + side * 3).toFixed(1)}) rotate(${side < 0 ? -55 : 125})`}>
                    <path className={`leaf ${k % 2 ? 'leaf--g' : 'leaf--j'}`} d="M0 0 C7 -9 21 -9 30 0 C21 9 7 9 0 0Z" style={{ '--k': 15 + k }} />
                  </g>
                ))}
              </g>
            </svg>
            <svg className="tk-road" viewBox="0 0 56 600" preserveAspectRatio="none" aria-hidden="true">
              <path className="kerb" d="M28 0 Q44 50 28 100 T28 200 T28 300 T28 400 T28 500 T28 600" vectorEffect="non-scaling-stroke" />
              <path className="asphalt" d="M28 0 Q44 50 28 100 T28 200 T28 300 T28 400 T28 500 T28 600" vectorEffect="non-scaling-stroke" />
              <path className="lane" d="M28 0 Q44 50 28 100 T28 200 T28 300 T28 400 T28 500 T28 600" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="tk-cards">
              {PILLARS.map((p, i) => (
                <article className="tk-card" key={p.title} style={{ '--i': i }}>
                  <span className="tk-knot tk-knot--l" aria-hidden="true" />
                  <span className="tk-knot tk-knot--r" aria-hidden="true" />
                  <span className="tk-node" aria-hidden="true">0{i + 1}</span>
                  <div className="tk-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p.icon}</svg>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <ul>
                    {p.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className="tk-ledger" d={1}>
            <div className="tk-ledger-intro">
              <small>SparkTree in numbers</small>
              <b>The work <em>so far.</em></b>
            </div>
            {STATS.map(([n, suf, label, icon], i) => (
              <div className="tk-stat" key={label} style={{ '--i': i }}>
                <span className="tk-stat-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
                </span>
                <b>
                  <Count to={n} delay={250 + i * 160} />
                  {suf && <i>{suf}</i>}
                </b>
                <small>{label}</small>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="band wsx-sec" id="workshops">
        <div className="wrap">
          <div className="tk-head">
            <div>
              <Reveal className="kicker">What we teach</Reveal>
              <Reveal as="h2" className="h2" d={1}>Workshops for every stage of the <em>speaking journey.</em></Reveal>
            </div>
            <Reveal as="p" className="tk-lead" d={2}>
              Every workshop is customised after a needs analysis — pick a starting point and we shape it around your team.
            </Reveal>
          </div>

          <Reveal d={1}>
            <WorkshopExplorer />
          </Reveal>

          <Reveal className="wsc" d={1}>
            <div className="wsc-top">
              <div className="wsc-copy">
                <small><span className="wsc-dot" />Custom programme</small>
                <b>Your team, <em>your programme.</em></b>
                <p>Running something in-company? We tailor every session to your goals, team size and skill level.</p>
              </div>
              <a className="btn wsc-cta" href={waLink("Hello, we'd like a custom in-company workshop.")} target="_blank" rel="noopener">
                <WaIcon />Talk to us
              </a>
            </div>
            <ol className="wsc-steps">
              {[
                ['Needs analysis', 'A quick call to learn your team and goals.', <><circle cx="11" cy="11" r="6.5" /><path d="M20.5 20.5l-4.8-4.8" /></>],
                ['Custom design', 'Sessions shaped around exactly what you need.', <><path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z" /><path d="M14 7.5l3 3" /></>],
                ['Delivered your way', 'One day onsite, or two virtual half-days.', <><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" /></>],
              ].map(([t, d, ic], i) => (
                <li key={t} style={{ '--i': i }}>
                  <span className="wsc-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ic}</svg>
                  </span>
                  <div>
                    <em>Step 0{i + 1}</em>
                    <b>{t}</b>
                    <p>{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section id="programmes" className="prg-sec">
        <div className="wrap">
          <div className="tk-head">
            <div>
              <Reveal className="kicker">Signature programmes</Reveal>
              <Reveal as="h2" className="h2" d={1}>Flagships we run <em>across the year.</em></Reveal>
            </div>
            <Reveal as="p" className="tk-lead" d={2}>
              Four recurring programmes — for campuses, Lions Clubs, emerging leaders and women's networks.
            </Reveal>
          </div>
          <Reveal d={1}>
            <ProgrammeBento />
          </Reveal>
        </div>
      </section>

      <section className="trn" id="trainers">
        <div className="trn-glow" aria-hidden="true" />
        <div className="wrap">
          <div className="tk-head">
            <div>
              <Reveal className="kicker">The trainers</Reveal>
              <Reveal as="h2" className="h2" d={1}>Content-rich sessions, <em>an atmosphere of fun.</em></Reveal>
            </div>
            <Reveal as="p" className="tk-lead" d={2}>
              Two lead trainers on every floor — decades of stage, classroom and community experience between them.
            </Reveal>
          </div>
          <div className="trn-grid">
            {TRAINER_PROFILES.map((t, i) => (
              <Reveal as="article" className="trn-card" key={t.slug} d={i}>
                <Link to={`/trainers/${t.slug}`} className="trn-photo" aria-label={`${t.name} — full profile`}>
                  <span className="trn-ring" aria-hidden="true" />
                  <span className="trn-arch">
                    <img src={t.img} alt={t.name} loading="lazy" />
                  </span>
                  <span className="trn-badge">Lead trainer</span>
                </Link>
                <div className="trn-info">
                  <RoleTicker roles={t.roles} />
                  <h3>{t.name}</h3>
                  <p className="trn-tag">{t.tagline}</p>
                  <p className="trn-short">{t.short}</p>
                  <ul className="trn-skills">
                    {t.expertise.slice(0, 3).map((x) => <li key={x}>{x}</li>)}
                  </ul>
                  <div className="trn-ctas">
                    <Link className="trn-more" to={`/trainers/${t.slug}`}>
                      View full profile <ArrowIcon />
                    </Link>
                    <a className="trn-wa" href={waLink(`Hello, I'd like to book a session with ${t.name}.`)} target="_blank" rel="noopener" aria-label={`Book ${t.name} on WhatsApp`}>
                      <WaIcon />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="qs-sec">
        <div className="wrap">
          <div className="tk-head">
            <div>
              <Reveal className="kicker">What participants say</Reveal>
              <Reveal as="h2" className="h2" d={1}>Confidence, <em>heard out loud.</em></Reveal>
            </div>
            <Reveal as="p" className="tk-lead" d={2}>
              In their own words — Lions leaders, founders and new joinees on what changed after a SparkTree session.
            </Reveal>
          </div>
          <Reveal d={1}>
            <QuoteStage />
          </Reveal>
        </div>
      </section>

      <section className="band" id="gallery">
        <div className="wrap center">
          <Reveal className="kicker" style={{ justifyContent: 'center' }}>From the field</Reveal>
          <Reveal as="h2" className="h2" d={1}>Workshops <em>in action.</em></Reveal>
          <Reveal as="p" className="lead" d={2}>
            Real rooms, real first speeches — photo stories from recent SparkTree programmes. Tap an event to see the full album.
          </Reveal>
          <Reveal className="stk-strip">
            <div className="track">
              {[...STRIP, ...STRIP].map(([slug, img], i) => (
                <Link key={i} to={`/events/${slug}`}>
                  <img src={`/img/${img}.jpg`} alt="" loading="lazy" />
                </Link>
              ))}
            </div>
            <div className="track rev">
              {[...STRIP_B, ...STRIP_B].map(([slug, img], i) => (
                <Link key={i} to={`/events/${slug}`}>
                  <img src={`/img/${img}.jpg`} alt="" loading="lazy" />
                </Link>
              ))}
            </div>
          </Reveal>
          <div className="prog-grid" style={{ marginTop: 46 }}>
            {EVENTS.map((e, i) => (
              <Reveal as={Link} className="prog" to={`/events/${e.slug}`} key={e.slug} d={i % 4}>
                <img src={e.cover} alt="" loading="lazy" />
                <figcaption>
                  <small>{FIELD_COVERS[e.slug]}</small>
                  <b>{FIELD_TITLES[e.slug]}</b>
                </figcaption>
              </Reveal>
            ))}
          </div>
          <Reveal className="gal-toggle">
            <Mag>
              <Link className="btn btn--green" to="/events">See all events &amp; photos</Link>
            </Mag>
          </Reveal>
        </div>
      </section>

      <section id="faq">
        <div className="wrap center">
          <Reveal className="kicker" style={{ justifyContent: 'center' }}>FAQ</Reveal>
          <Reveal as="h2" className="h2" d={1}>Everything you need <em>to know.</em></Reveal>
          <Faq />
        </div>
      </section>

      <section id="contact" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="cta-ring">
            <div className="cta">
              <i className="sp c1" aria-hidden="true">✦</i>
              <i className="sp c2" aria-hidden="true">✦</i>
              <div>
                <h3>Not sure which workshop fits your team?</h3>
                <p>Share your team size, location and preferred dates — SparkTree sends a tailored quote.</p>
              </div>
              <Mag>
                <a className="btn btn--wa" href={waLink("Hello, I'd like to know more about your corporate workshops.")} target="_blank" rel="noopener">
                  <WaIcon />
                  Book a workshop
                </a>
              </Mag>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
