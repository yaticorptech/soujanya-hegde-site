import { Link, useParams } from 'react-router-dom'
import { Reveal, useTitle, waLink, WaIcon } from '../components/shared'
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

export default function Trainer() {
  const { slug } = useParams()
  const idx = TRAINERS.findIndex((t) => t.slug === slug)
  const t = TRAINERS[idx]
  useTitle(t ? `${t.name} — Trainer Profile — SparkTree Foundation` : 'SparkTree Foundation', t?.about?.[0])
  if (!t) return <Home />
  const other = TRAINERS[(idx + 1) % TRAINERS.length]

  return (
    <>
      <header className="tp-hero">
        <div className="wrap">
          <div>
            <Reveal className="tp-kicker">Trainer Profile</Reveal>
            <Reveal as="h1">{t.name}</Reveal>
            <Reveal className="tp-roles">{t.roles.join('  |  ')}</Reveal>
            <Reveal as="p" className="tp-tag">{t.tagline}</Reveal>
          </div>
          <Reveal className="tp-photo">
            <img src={t.img} alt={t.name} />
          </Reveal>
        </div>
      </header>

      <div className="tp-body">
        <div className="wrap">
          <div className="tp-cols">
            <div>
              <Reveal className="tp-sec">
                <div className="tp-head">
                  <div className="ico"><Ico name="person" /></div>
                  <h2>About the Trainer</h2>
                </div>
                {t.about.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </Reveal>
              <Reveal className="tp-sec">
                <div className="tp-head">
                  <div className="ico"><Ico name="case" /></div>
                  <h2>Professional Experience</h2>
                </div>
                <ul className="tp-list">
                  {t.experience.map(([b, sub]) => (
                    <li key={b}>
                      <b>{b}</b>
                      {sub && <small>{sub}</small>}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div>
              <Reveal className="tp-sec">
                <div className="tp-head">
                  <div className="ico"><Ico name="cap" /></div>
                  <h2>Education &amp; Certifications</h2>
                </div>
                <ul className="tp-list">
                  {t.education.map(([b, sub]) => (
                    <li key={b}>
                      <b>{b}</b> {sub}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="tp-sec">
                <div className="tp-head">
                  <div className="ico"><Ico name="target" /></div>
                  <h2>Areas of Expertise</h2>
                </div>
                <ul className="tp-checks">
                  {t.expertise.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          <Reveal className="tp-sec">
            <div className="tp-head">
              <div className="ico"><Ico name="people" /></div>
              <h2>Key Roles &amp; Contributions</h2>
            </div>
            <div className="tp-roles-grid">
              {t.keyRoles.map(([icon, b, p]) => (
                <div className="tp-role" key={b}>
                  <div className="ico"><Ico name={icon} /></div>
                  <b>{b}</b>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="tp-quote">
            <h3>{t.quoteTitle}</h3>
            <p>{t.quote}</p>
            <p style={{ marginTop: 14, fontStyle: 'normal', fontWeight: 700, color: '#F6EFDC' }}>{t.closing}</p>
          </Reveal>

          <Reveal className="tp-contact">
            <span><Ico name="phone" />{t.phone}</span>
            <span><Ico name="mail" />{t.email}</span>
            <span><Ico name="pin" />{t.place}</span>
          </Reveal>

          <div className="tp-nav">
            <Link className="btn btn--ghost" to="/#trainers">← All trainers</Link>
            <a className="btn btn--wa" href={waLink(`Hello, I'd like to book a workshop with ${t.name}.`)} target="_blank" rel="noopener">
              <WaIcon />Book a workshop
            </a>
            <Link className="btn btn--ghost" to={`/trainers/${other.slug}`}>{other.name} →</Link>
          </div>
        </div>
      </div>
    </>
  )
}
