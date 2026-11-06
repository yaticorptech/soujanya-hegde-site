import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, Mag, WaIcon, ArrowIcon, waLink, useTitle } from '../components/shared'
import { EVENTS } from '../events-data'
import { TRAINERS as TRAINER_PROFILES } from '../trainers-data'

const PILLARS = [
  {
    icon: <path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zM6 12a6 6 0 0 0 12 0M12 18v3" />,
    title: 'Speak with confidence',
    text: 'Overcome stage fright, control nerves and sound clear in any meeting or presentation.',
  },
  {
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    title: 'Engage your audience',
    text: 'Use voice, tone and body language to hold attention and sound natural.',
  },
  {
    icon: <path d="M4 6h16M4 12h10M4 18h7" />,
    title: 'Structure your message',
    text: 'Organise thoughts quickly and make your point in a clear, logical way.',
  },
]

const WORKSHOPS = [
  ['Speak with Confidence', 'Overcome nerves and speak clearly and confidently in meetings, reviews and presentations.'],
  ['Confidence Building', 'Help your team beat stage fright, speak up in meetings and project authority.'],
  ['Public Speaking', 'Master voice, pace, body language and nerves for client calls and town halls.'],
  ["Exclusive Women's Workshop", 'A women-only, supportive space to build confidence and everyday speaking skills.'],
  ['Campus to Corporate', 'Prepare students and new hires for interviews, group discussions and meeting etiquette.'],
]

const PROGRAMMES = [
  ['Pre-recruitment programme', 'Campus to Corporate', '/img/sparktree-03.jpg'],
  ['Building Lion leaders of tomorrow', 'Step Up', '/img/sparktree-06.jpg'],
  ['Leadership training programme', 'Rise to Level Up', '/img/sparktree-12.jpg'],
  ["Women's Networking Club", 'Mic Magic', '/img/sparktree-07.jpg'],
]

const RIBBON = ['TEACH', 'TRAIN', 'TRANSFORM', 'SPARKTREE FOUNDATION']

const STATS = [
  [100, '+', 'Corporates & teams trained'],
  [10, '+', 'Programmes across India'],
  [240, '+', 'Workshop moments captured'],
  [2, '', 'Lead trainers on every floor'],
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
function Count({ to }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const step = (now) => {
          const p = Math.min(1, (now - t0) / 1400)
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.5 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{val}</span>
}

const QUOTES = [
  ['★★★★★', 'Step Up by SparkTree was a truly transformative experience. Confidence soared and communication skills sharpened. The sessions pushed us beyond our comfort zones.', 'BG', 'Lion Bindu Ganapathi', 'Zone Chairperson'],
  ['★★★★', 'The Mic Magic session was truly a game changer — body language, speech structure, ideation and all the little details that make a big difference. It gave me the confidence to deliver a speech on any topic.', 'AM', 'Alka Manoj', 'Founder & Designer, Ohana by Alka'],
  ['★★★★★', "SparkTree's Campus to Corporate training for our new joinees exceeded all expectations — content-rich sessions packed with learning, delivered with fun and engagement.", 'K', 'Kripa', 'General Manager, YatiCorp India'],
]

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
      <header className="hero" id="top">
        <i className="sp s1" aria-hidden="true">✦</i>
        <i className="sp s2" aria-hidden="true">✦</i>
        <i className="sp s3" aria-hidden="true">✦</i>
        <div className="wrap">
          <div className="hero-center">
            <Reveal className="kicker">Soft skills · Public speaking · Leadership</Reveal>
            <Reveal as="h1">
              Custom soft-skills programmes, <em>built on <span className="spark-word">your needs.</span></em>
            </Reveal>
            <Reveal as="p" className="lead">
              SparkTree designs and delivers niche workshops after a quick needs analysis — so your team gets exactly what
              moves the needle: stage presence, clear structure and the confidence to speak up.
            </Reveal>
            <Reveal className="hero-btns">
              <a className="btn btn--wa" href={waLink("Hello, I'd like to book a workshop.")} target="_blank" rel="noopener">
                <WaIcon />
                Book on WhatsApp
              </a>
              <a className="btn btn--ghost" href="#workshops">Explore workshops</a>
            </Reveal>
            <Reveal as="p" className="hero-trust">
              Trusted by Lions Clubs <i>✦</i> campuses <i>✦</i> co-operatives <i>✦</i> corporates across Karnataka
            </Reveal>
          </div>
        </div>
      </header>

      <div className="stk-ribbon" aria-hidden="true">
        <div className="track">
          {[...RIBBON, ...RIBBON, ...RIBBON, ...RIBBON].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <section id="takeaways">
        <div className="wrap center">
          <Reveal className="kicker" style={{ justifyContent: 'center' }}>What every participant takes home</Reveal>
          <Reveal as="h2" className="h2" d={1}>Three skills. <em>For life.</em></Reveal>
          <div className="pillars">
            {PILLARS.map((p, i) => (
              <Reveal as="article" className="pillar" key={p.title} d={i} tilt>
                <span className="n">0{i + 1}</span>
                <div className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{p.icon}</svg>
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="stk-stats">
        <div className="wrap">
          {STATS.map(([n, suf, label], i) => (
            <Reveal key={label} d={i}>
              <b>
                <Count to={n} />
                {suf}
              </b>
              <small>{label}</small>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band" id="workshops">
        <div className="wrap center">
          <Reveal className="kicker" style={{ justifyContent: 'center' }}>What we teach</Reveal>
          <Reveal as="h2" className="h2" d={1}>Workshops for every stage of the <em>speaking journey.</em></Reveal>
          <Reveal as="p" className="lead" d={2}>
            Every workshop is customised after a needs analysis — pick a starting point and we shape it around your team.
          </Reveal>
          <div className="ws-grid" style={{ textAlign: 'left' }}>
            {WORKSHOPS.map(([title, text], i) => (
              <Reveal as="article" className="ws-card" key={title} d={i % 3} tilt>
                <span className="tag">Workshop</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <a className="book" href={waLink(`Hello, I'd like to book the ${title} workshop.`)} target="_blank" rel="noopener">
                  Book now <ArrowIcon />
                </a>
              </Reveal>
            ))}
            <Reveal as="article" className="ws-card ws-card--dark" d={2} tilt>
              <span className="tag">Custom</span>
              <h3>Your team, your programme</h3>
              <p>
                Running something in-company? We tailor every session to your goals, team size and skill level.
              </p>
              <a className="book" href={waLink("Hello, we'd like a custom in-company workshop.")} target="_blank" rel="noopener">
                Talk to us <ArrowIcon />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="programmes">
        <div className="wrap center">
          <Reveal className="kicker" style={{ justifyContent: 'center' }}>Signature programmes</Reveal>
          <Reveal as="h2" className="h2" d={1}>Flagships we run <em>across the year.</em></Reveal>
          <div className="prog-grid">
            {PROGRAMMES.map(([small, b, img], i) => (
              <Reveal as="figure" className="prog" key={b} d={i}>
                <img src={img} alt="" loading="lazy" />
                <figcaption>
                  <small>{small}</small>
                  <b>{b}</b>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="band" id="trainers">
        <div className="wrap center">
          <Reveal className="kicker" style={{ justifyContent: 'center' }}>The trainers</Reveal>
          <Reveal as="h2" className="h2" d={1}>Content-rich sessions, <em>an atmosphere of fun.</em></Reveal>
          <div className="team-grid" style={{ textAlign: 'left' }}>
            {TRAINER_PROFILES.map((t, i) => (
              <Reveal as="article" className="trainer" key={t.slug} d={i}>
                <Link to={`/trainers/${t.slug}`}>
                  <div className="photo">
                    <img src={t.img} alt={t.name} />
                  </div>
                </Link>
                <div className="info">
                  <small>Lead trainer</small>
                  <h3>{t.name}</h3>
                  <p>{t.short}</p>
                  <Link className="book" to={`/trainers/${t.slug}`}>
                    View full profile <ArrowIcon />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="wrap center">
          <Reveal className="kicker" style={{ justifyContent: 'center' }}>What participants say</Reveal>
          <Reveal as="h2" className="h2" d={1}>Confidence, <em>heard out loud.</em></Reveal>
          <div className="quotes" style={{ textAlign: 'left' }}>
            {QUOTES.map(([stars, text, av, who, role], i) => (
              <Reveal as="article" className="quote" key={who} d={i} tilt>
                <div className="stars">{stars}</div>
                <p>{text}</p>
                <div className="who">
                  <div className="av">{av}</div>
                  <div>
                    <b>{who}</b>
                    <small>{role}</small>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
