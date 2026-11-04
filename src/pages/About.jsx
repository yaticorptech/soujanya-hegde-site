import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import { Kicker, H2, SectionHead, ArrowRight } from '../components/ui'
import { SPARKTREE_URL } from '../data'
import useTitle from '../lib/useTitle'

/** Counts from 0 to `to` when scrolled into view (original .count behaviour). */
function Count({ to }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const dur = 1600
        const step = (now) => {
          const p = Math.min(1, (now - t0) / dur)
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])

  return <span ref={ref} className="count">{val}</span>
}

const TAGS = ['Celebrity host', 'Event planner', 'SparkTree trainer', 'KidFest organizer', 'Actor', 'Choreographer', 'Influencer', 'Law graduate', 'Mother of two']

const STATS = [
  { to: 1000, label: 'events hosted — weddings, galas, launches, reality TV' },
  { to: 20, label: 'years as a professional host and anchor', d: 1 },
  { to: 100, label: 'corporates trained through SparkTree Foundation', d: 2 },
  { to: 600, label: 'prizes and certificates before she left school', d: 3 },
]

export default function About() {
  useTitle('About Soujanya Hegde', 'Hosting hearts, planning moments — bio, numbers, stage & screen, and the ventures she runs.')

  return (
    <>
      <section className="sec about2" id="about">
        <div className="wrap ab-grid">
          <Reveal className="ab-media">
            <span className="ab-side">Soujanya Hegde · Mangaluru</span>
            <div className="ab-frame" aria-hidden="true"></div>
            <figure className="ab-main">
              <img src="/img/solo-021.jpg" alt="Soujanya in a gold lehenga, seated on a golden throne" loading="lazy" decoding="async" />
            </figure>
            <figure className="ab-disc">
              <img src="/img/solo-100.jpg" alt="Soujanya smiling in a maroon sequin gown against a rose wall" loading="lazy" decoding="async" />
            </figure>
            <figure className="ab-float">
              <img src="/img/solo-094.jpg" alt="Soujanya laughing mid-hosting, microphone in hand" loading="lazy" decoding="async" />
            </figure>
            <div className="ab-seal" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <defs>
                  <path id="abSealPath" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" fill="none" />
                </defs>
                <text>
                  <textPath href="#abSealPath">STAGES ✦ SMILES ✦ SPOTLIGHTS ✦</textPath>
                </text>
              </svg>
              <b>SH</b>
            </div>
            <i className="sp sp1">✦</i>
            <i className="sp sp2">✦</i>
          </Reveal>
          <div className="ab-text">
            <Kicker>Get to know</Kicker>
            <H2>Hosting hearts, <em>planning moments.</em></H2>
            <Reveal as="p" d={2} className="ab-quote">
              On a stage since she was six months old — and it never once felt borrowed.
            </Reveal>
            <Reveal as="p" d={2} className="ab-p first">
              I'm Soujanya Hegde — a celebrity host and event planner with a passion for turning ordinary gatherings into
              extraordinary memories. From intimate weddings to large-scale corporate galas, I bring warmth, energy and a
              meticulous eye for detail.
            </Reveal>
            <Reveal as="p" d={3} className="ab-p">
              As a corporate trainer, I help teams find their stage presence and voice. As an actor and dancer, I've lived on
              stages since I was six months old. As a Mrs India Worldwide finalist and a mother of two, I champion women who
              dare to dream — and kids who dare to perform.
            </Reveal>
            <Reveal as="p" d={3} className="ab-p">
              A law graduate from SDM Law College and an MBA diploma holder from ICFAI, I spent a decade in Abuja, Nigeria
              running a dance institute before coming home to Mangaluru to build events, ventures and a community of performers.
            </Reveal>
            <Reveal d={4} className="ab-rule">✦</Reveal>
            <Reveal d={4} className="ab-tags">
              {TAGS.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </Reveal>
          </div>
        </div>
        <div className="wrap">
          <div className="stats2" data-fx="grow">
            {STATS.map((s) => (
              <Reveal key={s.label} d={s.d || 0} className="st">
                <b>
                  <Count to={s.to} />
                  <sup>+</sup>
                </b>
                <small>{s.label}</small>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--plum" id="stage">
        <div className="wrap">
          <SectionHead
            kicker="Stage & screen"
            title={<>Three disciplines, <em>one performer.</em></>}
            lead="Hosting is where the city knows her. But the mic sits on a foundation of classical dance, folk theatre and film — which is why the stage never feels borrowed."
          />
          <div className="trio" data-fx="driftr">
            <Reveal as="article" className="panel">
              <img src="/img/hero-saree.jpg" alt="" loading="lazy" decoding="async" />
              <div className="in">
                <h3>On the mic</h3>
                <ul>
                  <li><span>Live shows &amp; star-studded musical evenings</span><span>Host</span></li>
                  <li><span>Corporate brandings, launches, galas</span><span>Compère</span></li>
                  <li><span>Reality shows on television</span><span>Anchor</span></li>
                  <li><span>Weddings, receptions, birthdays</span><span>Planner</span></li>
                </ul>
              </div>
            </Reveal>
            <Reveal as="article" className="panel" d={1}>
              <img src="/img/lions-podium.jpg" alt="" loading="lazy" decoding="async" />
              <div className="in">
                <h3>On screen</h3>
                <ul>
                  <li><span><em>Mayajinke</em> — Kannada film</span><span>2001</span></li>
                  <li><span><em>Bollilu</em> — Tulu film</span><span>2016</span></li>
                  <li><span><em>Deyi Baidethi</em> — Tulu film</span><span>2019</span></li>
                  <li><span>Chatroom with Soujanya — Host</span><span>YouTube</span></li>
                </ul>
              </div>
            </Reveal>
            <Reveal as="article" className="panel" d={2}>
              <img src="/img/stage-point.jpg" alt="" loading="lazy" decoding="async" />
              <div className="in">
                <h3>In dance</h3>
                <ul>
                  <li><span>Bharatanatyam</span><span>Classical</span></li>
                  <li><span>Thenku Thittu Yakshagana</span><span>Folk theatre</span></li>
                  <li><span>Folk, Bollywood &amp; freestyle</span><span>Choreographer</span></li>
                  <li><span>Nrityalaya, Abuja &amp; Golden Girls troupe</span><span>Director</span></li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec sec--ivory" id="ventures">
        <div className="wrap">
          <SectionHead
            kicker="Ventures"
            title={<>Businesses built around <em>celebration.</em></>}
            lead="Each one started as a gap she noticed while planning someone else's party."
          />
          <div className="ventures" data-fx="grow">
            <Reveal as="article" className="vent">
              <div className="em">🎉</div>
              <h3>Let'Z Party</h3>
              <div className="role">Managing Director</div>
              <p>The complete party store — supplies, accessories and décor under one roof in Mangaluru. One of its kind in the city when it opened.</p>
              <a className="more" href="https://www.instagram.com/letzparty_decorstore/" target="_blank" rel="noopener">
                @letzparty_decorstore <ArrowRight />
              </a>
            </Reveal>
            <Reveal as="article" className="vent" d={1}>
              <div className="em">🌱</div>
              <h3>SparkTree Foundation</h3>
              <div className="role">Co-founder &amp; Lead Trainer</div>
              <p>Soft-skills and public-speaking workshops for corporates, campuses and leaders — 100+ teams trained across Karnataka, with programmes like Campus to Corporate, Step Up and Mic Magic.</p>
              <a className="more" href={SPARKTREE_URL} target="_blank" rel="noopener">
                sparktreefoundation.in <ArrowRight />
              </a>
            </Reveal>
            <Reveal as="article" className="vent" d={2}>
              <div className="em">🥻</div>
              <h3>Sarees Run Mangalore</h3>
              <div className="role">Organiser</div>
              <p>A celebration of the saree in motion — women running the streets of Mangaluru in six yards, for fitness, pride and a lot of photographs.</p>
              <a className="more" href="https://www.instagram.com/sareerun.mangalore/" target="_blank" rel="noopener">
                @sareerun.mangalore <ArrowRight />
              </a>
            </Reveal>
            <Reveal as="article" className="vent" d={3}>
              <div className="em">🎪</div>
              <h3>KidFest</h3>
              <div className="role">Founder &amp; Organizer</div>
              <p>Because every kid is a star — a two-day festival of 13 competitions, a flea market and stage shows at Palemar Convention Centre, Mangalore, organised with SparkTree Foundation.</p>
              <a className="more" href="https://www.instagram.com/kidfestindia/" target="_blank" rel="noopener">
                @kidfestindia <ArrowRight />
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
