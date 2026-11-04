import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Curtain from '../components/Curtain'
import Reveal from '../components/Reveal'
import EpisodeCard from '../components/EpisodeCard'
import { Btn, Kicker, H2, Lead, PlayIcon, WaIcon } from '../components/ui'
import Pic from '../components/Pic'
import { EPISODES, WA_BOOK } from '../data'
import useTitle from '../lib/useTitle'

const ROLES = ['celebrity host', 'event planner', 'corporate trainer', 'actor', 'pageant finalist', 'talk-show creator']

const RIBBON = [
  'Celebrity host', 'Event planner', 'Corporate trainer', 'Mrs India Worldwide finalist', 'Film & TV actor',
  'Founder, SparkTree Foundation', 'Chatroom with Soujanya', 'Bharatanatyam & Yakshagana', 'Influencer',
]

const BRANDS = [
  'JCI India', 'Lions International', 'BNI', 'Bharatgas', 'JK Cement', 'Times Group', 'ACME Group · Dubai',
  'Rotaract', 'Cycle Pure', 'PRCI', 'Mrs India Worldwide',
]

const REEL = [
  'hero-saree', 'solo-021', 'couple-32', 'pageant-16', 'solo-073', 'award-stage',
  'couple-12', 'solo-067', 'lions-podium', 'pageant-50', 'solo-100', 'dubai-03',
]

const DOORS = [
  { to: '/about', img: '/img/stage-black.jpg', tag: 'The story', title: 'About Soujanya', text: 'Host, planner, trainer, actor — and the numbers behind the name.' },
  { to: '/journey', img: '/img/stage-point.jpg', tag: 'The timeline', title: 'The journey', text: 'From a Healthy Baby contest at six months to KidFest 2026.', d: 1 },
  { to: '/international', img: '/img/stock-redcarpet.jpg', tag: 'World stage', title: 'International stage', text: 'A decade in Abuja, a pageant run through Vietnam and Gurugram.', d: 3 },
  { to: '/awards', img: '/img/hero-saree.jpg', tag: 'Recognition', title: 'Awards & recognition', text: 'Mrs Popular at Mrs India Worldwide, Teen of the Year, Rashtrapati Award.' },
  { to: '/sparktree', img: '/img/sparktree-13.jpg', tag: 'Training', title: 'SparkTree Foundation', text: 'Soft-skills and public-speaking workshops for teams and campuses.', d: 1 },
  { to: '/chatroom', img: '/img/chatroom-avatar.jpg', tag: 'On YouTube', title: 'Chatroom with Soujanya', text: 'Long conversations with the people who make Tulunadu interesting.', d: 3 },
  { to: '/gallery', img: '/img/yellow-mic.jpg', tag: 'The photos', title: 'Gallery', text: 'Stages, smiles and spotlights — tap any photo to view it full-screen.' },
]

/** Rotating role word in the hero line (original .rotor markup + classes). */
function Rotor() {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState(null)
  const [width, setWidth] = useState(null)
  const spans = useRef([])

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => {
        setPrev(v)
        return (v + 1) % ROLES.length
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const fit = () => spans.current[i] && setWidth(spans.current[i].offsetWidth)
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [i])

  return (
    <span className="rotor" style={width ? { width } : undefined}>
      {ROLES.map((r, idx) => (
        <span
          key={r}
          ref={(el) => {
            spans.current[idx] = el
          }}
          className={idx === i ? 'in' : idx === prev ? 'out' : ''}
        >
          {r}
        </span>
      ))}
    </span>
  )
}

export default function Home() {
  useTitle(
    'Soujanya Hegde — Celebrity Host, Event Planner, Corporate Trainer',
    'Celebrity host, event planner, corporate trainer, actor and Mrs India Worldwide finalist from Mangaluru.',
  )
  const copyRef = useRef(null)

  // hero copy drifts up and fades as you scroll away, like a cinematic title card
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const el = copyRef.current
        if (el) {
          const y = window.scrollY
          const fade = window.innerHeight * 0.75
          el.style.opacity = y < fade ? String(Math.max(0, 1 - y / fade)) : '0'
          el.style.transform = `translateY(${Math.min(y, fade) * 0.22}px)`
        }
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Curtain />

      <section className="hero" id="hero">
        <div className="hero-bg" aria-hidden="true" data-par="0.05"></div>
        <div className="hero-media" data-par="0.12" data-zoom="0.1">
          <Pic src="/img/hero-pink.jpg" alt="Soujanya Hegde smiling, holding a microphone" sizes="(max-width: 1024px) 100vw, 66vw" eager />
        </div>
        <div className="hero-shade" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hero-copy" ref={copyRef}>
            <span className="hero-where">
              <i>✦</i>Finalist, Mrs India Worldwide — Entrepreneur
            </span>
            <h1 className="hero-name">
              <span className="line"><span>MC</span></span>
              <span className="line"><span>Soujanya</span></span>
              <span className="line"><span>Hegde</span></span>
            </h1>
            <div className="hero-role">
              The <Rotor />&nbsp;you remember.
            </div>
            <p className="hero-p">
              Crafting moments that linger long after the lights dim. From intimate weddings to star-studded galas, corporate
              stages to KidFest — warmth, energy and a meticulous eye for detail.
            </p>
            <div className="hero-cta">
              <Btn variant="gold" href={WA_BOOK}>Book for your event</Btn>
              <Btn variant="ghost" href="/chatroom">
                <PlayIcon />Watch Chatroom
              </Btn>
            </div>
            <div className="hero-proof">
              <div><b>1000<sup>+</sup></b><small>events hosted</small></div>
              <div><b>20<sup>+</sup></b><small>years on stage</small></div>
              <div><b>100<sup>+</sup></b><small>corporates trained</small></div>
              <div><b>32K</b><small>Instagram community</small></div>
            </div>
          </div>
        </div>
        <div className="scroll-cue"><i></i>scroll</div>
      </section>

      {/* ribbon */}
      <div className="ribbon-wrap" data-skewv="">
        <div className="ribbon" aria-hidden="true">
          <div className="track" id="ribbon">
            {[...RIBBON, ...RIBBON].map((t, idx) => (
              <span key={idx}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="sec explore" id="explore">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Kicker>Explore</Kicker>
              <H2>Twenty years on stage, <em>page by page.</em></H2>
            </div>
            <Lead>
              Pick a door — the story, the awards, the world stages, the ventures she runs and the show she hosts.
            </Lead>
          </div>
          <div className="doors2" data-fx="grow">
            {DOORS.map((door, i) => (
              <Reveal key={door.to} as={Link} to={door.to} d={door.d || 0} className="door2">
                <Pic src={door.img} alt="" sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 420px" />
                <div className="ovr" aria-hidden="true"></div>
                <span className="shine" aria-hidden="true"></span>
                <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="d-info">
                  <small>{door.tag}</small>
                  <b>{door.title}</b>
                  <span>{door.text}</span>
                  <i>Explore →</i>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec chat" id="now">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Kicker>Fresh from the chatroom</Kicker>
              <H2>Conversations the coast <em>is talking about.</em></H2>
            </div>
            <Lead>
              Long sit-downs with the dancers, film stars and creators of Tulunadu — new episodes every month on YouTube.
            </Lead>
          </div>
          <div className="feature" data-fx="grow">
            <Reveal as="a" className="ep-hero" href="https://www.youtube.com/watch?v=HFm5P-d-yOw" target="_blank" rel="noopener">
              <Pic src="/img/ep-HFm5P-d-yOw.jpg" alt="Shilpa Shetty on Chatroom with Soujanya" sizes="(max-width: 1024px) 100vw, 760px" />
              <div className="play"><PlayIcon /></div>
              <div className="cap">
                <b>Shilpa Shetty — Navaratri special</b>
                <small>Content creator and stand-up comedian · 54 min · 78K views</small>
              </div>
            </Reveal>
            <Reveal d={1} className="now-chat">
              <div className="now-chat-head">
                <img src="/img/chatroom-avatar.jpg" alt="" />
                <div>
                  <small>Latest on YouTube</small>
                  <b>Chatroom with Soujanya</b>
                </div>
              </div>
              <div className="eps eps--mini">
                {EPISODES.slice(0, 3).map((ep) => (
                  <EpisodeCard key={ep.id} ep={ep} mini />
                ))}
              </div>
              <Link className="more-link" to="/chatroom">
                All episodes
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- trusted by ---------- */}
      <div className="brands">
        <div className="wrap">
          <div className="kicker bk">The stages she's trusted on</div>
        </div>
        <div className="track" aria-hidden="true">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </div>
      </div>

      {/* ---------- signature moments reel ---------- */}
      <div className="gal-strips" style={{ margin: 'clamp(60px,8vw,100px) 0 0' }} data-skewv="">
        <div className="gal-strip">
          {[...REEL, ...REEL].map((name, i) => (
            <Link key={i} to="/gallery">
              <img src={`/img/${name}.jpg`} alt="" loading="lazy" />
            </Link>
          ))}
        </div>
      </div>

      <section className="sec sec--ivory home-cta" id="home-cta">
        <div className="wrap">
          <Reveal className="cta-band">
            <div>
              <div className="kicker">Let's talk</div>
              <H2 d={0}>
                Ready to elevate <em>your event?</em>
              </H2>
              <p>
                Hosting, planning, corporate training, brand launches, pageants, kids' events — tell Soujanya what you're
                dreaming up.
              </p>
            </div>
            <div className="cta-btns">
              <Btn variant="wa" href={WA_BOOK}><WaIcon />Chat on WhatsApp</Btn>
              <Btn variant="ink" href="/contact">Send a message</Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
