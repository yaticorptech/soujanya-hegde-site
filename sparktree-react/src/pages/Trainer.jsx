import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowIcon, Reveal, useTitle, waLink, WaIcon } from '../components/shared'
import { glideTo } from '../lib/smooth'
import { TRAINERS } from '../trainers-data'
import Home from './Home'

const ICONS = {
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  cap: <path d="M12 3 2 8l10 5 10-5-10-5zm-6 8v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4M22 8v6" />,
  case: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  people: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20a7 7 0 0 1 14 0M17 5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7" /></>,
  handshake: <path d="M2 12l4-5h4l3 3m0 0 3-3h4l2 5-5 6-4-3m0-5-4 4 2 2 4-4m-6 2-2 2 2 2 2-2" />,
  crown: <path d="M3 18h18l-1.5-9-4.5 4-3-7-3 7-4.5-4zM4 20h16" />,
  mic: <path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zM6 12a6 6 0 0 0 12 0M12 18v3" />,
  calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
  book: <path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a0 0 0 0 0 0 0v14a2 2 0 0 1 2 2h4z" />,
  pen: <path d="M17 3l4 4L8 20l-5 1 1-5zM14 6l4 4" />,
  phone: <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6L22 7" /></>,
  pin: <><path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
}

const Ico = ({ name }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{ICONS[name]}</svg>
)

const SECTIONS = [
  ['about', 'About'],
  ['roles', 'Key roles'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['expertise', 'Expertise'],
  ['contact', 'Contact'],
]

export default function Trainer() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const idx = TRAINERS.findIndex((t) => t.slug === slug)
  const t = TRAINERS[idx]
  useTitle(t ? `${t.name} — Trainer Profile — SparkTree Foundation` : 'SparkTree Foundation', t?.about?.[0])
  // highlight the section currently being read
  const [cur, setCur] = useState('about')
  useEffect(() => {
    const els = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCur(e.target.id)),
      { rootMargin: '-35% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [slug])
  if (!t) return <Home />
  const other = TRAINERS[(idx + 1) % TRAINERS.length]
  const [first, ...restName] = t.name.split(' ')
  const book = waLink(`Hello, I'd like to book a workshop with ${t.name}.`)
  const jump = (id) => (e) => {
    e.preventDefault()
    glideTo(`#${id}`)
  }

  return (
    <>
      <header className="tr-hero">
        <div className="wrap tr-topbar">
          <button
            type="button"
            className="tr-back"
            aria-label="Go back"
            title="Back"
            onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/#trainers'))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </button>
        </div>
        <div className="wrap tr-hero-grid">
          <div className="tr-hero-copy">
            <Reveal as="h1" className="tr-name" d={1}>
              <span className="tr-first">{first}</span> <em>{restName.join(' ')}</em>
            </Reveal>
            <Reveal className="tr-roles" d={2}>
              {t.roles.map((r) => <span key={r}>{r}</span>)}
            </Reveal>
            <Reveal as="p" className="tr-tagline" d={2}>{t.tagline}</Reveal>
            <Reveal className="tr-ctas" d={3}>
              <a className="btn btn--wa" href={book} target="_blank" rel="noopener">
                <WaIcon /><span className="tr-bk-l">Book a workshop with {first}</span><span className="tr-bk-s">Book {first} on WhatsApp</span>
              </a>
              <a className="tr-call" href={`tel:+91${t.phone}`}>
                <Ico name="phone" />Call {t.phone}
              </a>
            </Reveal>
          </div>

          <Reveal className="tr-portrait" d={2}>
            <span className="tr-portrait-glow" aria-hidden="true" />
            <span className="tr-portrait-beam" aria-hidden="true" />
            <figure className="tr-photo">
              <img src={t.cut || t.img} alt={t.name} width="873" height="900" />
            </figure>
          </Reveal>
        </div>
      </header>

      <div className="tr-body">
        <div className="wrap">
          <nav className="tr-toc" aria-label="On this page">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={jump(id)} className={cur === id ? 'on' : ''} aria-current={cur === id ? 'true' : undefined}>{label}</a>
            ))}
          </nav>

          <div className="tr-bento">
            <section className="tr-panel tr-about" id="about">
              <Reveal className="tr-label">About</Reveal>
              <Reveal as="p" className="tr-lead" d={1}>{t.about[0]}</Reveal>
              {t.about.slice(1).map((p) => (
                <Reveal as="p" className="tr-p" d={2} key={p.slice(0, 24)}>{p}</Reveal>
              ))}
            </section>

            <Reveal className="tr-panel tr-facts" d={1}>
              <div><b>{t.roles.length}</b><span>roles they play</span></div>
              <div><b>{t.expertise.length}</b><span>areas of expertise</span></div>
              <div><b>{t.education.length}</b><span>degrees &amp; certifications</span></div>
              <div className="tr-facts-place"><Ico name="pin" /><span>{t.place}</span></div>
            </Reveal>

            <section className="tr-panel tr-span" id="roles">
              <Reveal className="tr-label">Key roles &amp; contributions</Reveal>
              <div className="tr-roles-grid">
                {t.keyRoles.map(([icon, b, p], i) => (
                  <Reveal className="tr-role" d={i % 3} key={b}>
                    <i><Ico name={icon} /></i>
                    <span>
                      <b>{b}</b>
                      <p>{p}</p>
                    </span>
                  </Reveal>
                ))}
              </div>
            </section>

            <div className="tr-col">
              <section className="tr-panel" id="experience">
                <Reveal className="tr-label">Professional experience</Reveal>
                <ol className="tr-timeline">
                  {t.experience.map(([b, sub], i) => (
                    <Reveal as="li" d={i % 3} key={b}>
                      <b>{b}</b>
                      {sub && <small>{sub}</small>}
                    </Reveal>
                  ))}
                </ol>
              </section>

              <Reveal className="tr-quote">
                <span className="tr-quote-mark" aria-hidden="true">“</span>
                <small>{t.quoteTitle}</small>
                <p>{t.quote}</p>
                <b>{t.closing}</b>
              </Reveal>
            </div>
            <div className="tr-col">
              <section className="tr-panel" id="education">
                <Reveal className="tr-label">Education &amp; certifications</Reveal>
                <div className="tr-certs">
                  {t.education.map(([b, sub], i) => (
                    <Reveal className="tr-cert" d={i % 2} key={b}>
                      <i><Ico name="cap" /></i>
                      <span>
                        <b>{b}</b>
                        {sub && <small>{sub.replace(/^from\s+/i, '')}</small>}
                      </span>
                    </Reveal>
                  ))}
                </div>
                <div className="tr-sub" id="expertise">
                  <Reveal className="tr-label">Areas of expertise</Reveal>
                  <Reveal className="tr-tags" d={1}>
                    {t.expertise.map((x) => <span key={x}>{x}</span>)}
                  </Reveal>
                </div>
              </section>

              <section className="tr-panel tr-contact" id="contact">
                <span className="tr-label">Work with {first}</span>
                <h2>Bring {first} to your team.</h2>
                <p>Share your team size, goals and preferred dates — SparkTree sends a tailored plan.</p>
                <a className="btn btn--wa" href={book} target="_blank" rel="noopener"><WaIcon />Book on WhatsApp</a>
                <ul className="tr-contact-list">
                  <li><a href={`tel:+91${t.phone}`}><i><Ico name="phone" /></i><span><small>Phone</small>{t.phone}</span></a></li>
                  <li><a href={`mailto:${t.email}`}><i><Ico name="mail" /></i><span><small>Email</small>{t.email}</span></a></li>
                </ul>
              </section>
            </div>

            <Link className="tr-next tr-span" to={`/trainers/${other.slug}`}>
              <img src={other.cut || other.img} alt="" loading="lazy" />
              <span>
                <small>Meet the other lead trainer</small>
                <b>{other.name}</b>
                <em>{other.roles.slice(0, 3).join(' · ')}</em>
              </span>
              <i aria-hidden="true"><ArrowIcon /></i>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
