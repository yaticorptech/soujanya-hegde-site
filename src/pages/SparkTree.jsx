import Reveal from '../components/Reveal'
import Pic from '../components/Pic'
import { Btn, Kicker, H2 } from '../components/ui'
import { SPARKTREE_URL } from '../data'
import useTitle from '../lib/useTitle'

const WORKSHOPS = [
  { title: 'Confidence building', text: 'Help your team overcome stage fright, speak up in meetings and project authority.' },
  { title: 'Public speaking', text: 'Master voice, pace, body language and nerves for client calls and town halls.', d: 1 },
  { title: "Exclusive women's workshop", text: 'A women-centric, supportive space to build confidence and everyday speaking skills.', d: 2 },
  { title: 'Campus to corporate', text: 'Prepare students and early-career hires for interviews, group discussions and meeting etiquette.', d: 3 },
]

const TEACH = [
  {
    icon: <path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zM6 12a6 6 0 0 0 12 0M12 18v3" />,
    b: 'Speak with confidence',
    text: 'Overcome stage fright, control nerves and sound clear in any meeting or presentation.',
  },
  {
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    b: 'Engage your audience',
    text: 'Use voice, tone and body language to hold attention and sound natural.', d: 1,
  },
  {
    icon: <path d="M4 6h16M4 12h10M4 18h7" />,
    b: 'Structure your message',
    text: 'Organise thoughts quickly and make your point in a clear, logical way.', d: 2,
  },
]

const PROGRAMS = [
  { img: '/img/sparktree-03.jpg', small: 'Pre-recruitment programme', b: 'Campus to Corporate' },
  { img: '/img/sparktree-06.jpg', small: 'Building Lion leaders of tomorrow', b: 'Step Up', d: 1 },
  { img: '/img/sparktree-12.jpg', small: 'Leadership training programme', b: 'Rise to Level Up', d: 2 },
  { img: '/img/sparktree-07.jpg', small: "Women's Networking Club", b: 'Mic Magic', d: 3 },
]

const QUOTES = [
  {
    stars: '★★★★★',
    text: 'Step Up by SparkTree was a truly transformative experience. Confidence soared and communication skills sharpened. The sessions led by Preetham Ponnappa and Soujanya Hegde pushed us beyond our comfort zones.',
    img: '/img/sparktree-14.jpg', who: 'Lion Bindu Ganapathi', role: 'Zone Chairperson',
  },
  {
    stars: '★★★★',
    text: 'The Mic Magic session was truly a game changer — body language, speech structure, ideation and all the little details that make a big difference. It gave me the confidence to deliver a speech on any topic.',
    img: '/img/sparktree-15.jpg', who: 'Alka Manoj', role: 'Founder & Designer, Ohana by Alka', d: 1,
  },
  {
    stars: '★★★★★',
    text: "SparkTree's Campus to Corporate training for our new joinees exceeded all expectations — content-rich sessions packed with learning, delivered with fun and engagement.",
    img: '/img/sparktree-16.jpg', who: 'Kripa', role: 'General Manager, YatiCorp India', d: 2,
  },
]

const GAL = [
  '/img/sparktree-02.jpg', '/img/sparktree-09.jpg', '/img/sparktree-04.jpg', '/img/sparktree-10.jpg',
  '/img/sparktree-08.jpg', '/img/sparktree-11.jpg', '/img/corp-10.jpg', '/img/sparktree-01.jpg', '/img/corp-13.jpg',
]

export default function SparkTree() {
  useTitle('SparkTree Foundation — Soujanya Hegde', 'Custom soft-skills and public-speaking workshops for teams, campuses and leaders.')

  return (
    <section className="sec spark" id="sparktree">
      <div className="wrap">
        <div className="spark-head">
          <div>
            <Reveal className="spark-logo">
              <img src="/img/sparktree-logo.png" alt="SparkTree Foundation" />
            </Reveal>
            <Kicker d={1}>SparkTree Foundation</Kicker>
            <H2 d={2}>Custom soft-skills programmes, <em>built on your needs.</em></H2>
          </div>
          <Reveal as="p" d={3} className="lead">
            SparkTree designs and delivers niche workshops after a quick needs analysis, so teams get exactly what moves the
            needle — stage presence, clear structure and the confidence to speak up.
          </Reveal>
        </div>

        <div className="ws" data-fx="grow">
          {WORKSHOPS.map((w) => (
            <Reveal key={w.title} as="article" d={w.d || 0}>
              <div className="n">Workshop</div>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="spark-two">
          <Reveal as="figure">
            <img src="/img/sparktree-13.jpg" alt="Soujanya Hegde and Preetham Ponnappa, SparkTree trainers" loading="lazy" decoding="async" />
            <figcaption>
              <b>Soujanya Hegde &amp; Preetham Ponnappa</b>Lead trainers — content-rich sessions with an atmosphere of fun
            </figcaption>
          </Reveal>
          <div>
            <Reveal as="h3" style={{ fontSize: '1.9rem' }}>What every participant takes home</Reveal>
            <ul className="teach">
              {TEACH.map((t) => (
                <Reveal as="li" key={t.b} d={t.d || 0}>
                  <div className="k">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {t.icon}
                    </svg>
                  </div>
                  <div>
                    <b>{t.b}</b>
                    <span>{t.text}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal as="p" d={3} style={{ marginTop: '22px', color: 'rgba(43,27,32,.72)', fontSize: '.95rem' }}>
              Formats: one-day onsite, or two half-day virtual sessions. Ideal batch of 16–24 so every participant gets
              individual feedback and speaking time; larger teams run in multiple batches.
            </Reveal>
          </div>
        </div>

        <div className="programs" data-fx="grow">
          {PROGRAMS.map((p) => (
            <Reveal key={p.b} as="a" className="prog" href={`${SPARKTREE_URL}/events`} target="_blank" rel="noopener" d={p.d || 0}>
              <img src={p.img} alt="" loading="lazy" decoding="async" />
              <div>
                <small>{p.small}</small>
                <b>{p.b}</b>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="quotes" data-fx="grow">
          {QUOTES.map((q) => (
            <Reveal key={q.who} as="article" className="quote" d={q.d || 0}>
              <div className="stars5">{q.stars}</div>
              <p>{q.text}</p>
              <div className="who">
                <img src={q.img} alt="" loading="lazy" decoding="async" />
                <div>
                  <b>{q.who}</b>
                  <small>{q.role}</small>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="spark-gal" id="sparkGal">
          {GAL.map((src) => (
            <figure key={src}>
              <Pic src={src} alt="" sizes="(max-width: 700px) 70vw, 360px" />
            </figure>
          ))}
        </Reveal>

        <Reveal className="spark-cta">
          <div>
            <h3>Not sure which workshop fits your team?</h3>
            <p>Share your team size, location and preferred dates — SparkTree sends a tailored quote.</p>
          </div>
          <div className="btns">
            <Btn variant="wa" href="https://wa.me/919880842007?text=Hello%2C%20I%27d%20like%20to%20know%20more%20about%20your%20corporate%20workshops.">
              Book a workshop
            </Btn>
            <Btn variant="ghost" href={SPARKTREE_URL}>Visit the SparkTree site</Btn>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
