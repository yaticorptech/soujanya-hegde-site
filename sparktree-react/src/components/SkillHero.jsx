import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { WaIcon, waLink } from './shared'
import { TRAINERS } from '../trainers-data'
import { glideTo } from '../lib/smooth'

/* ---------- icon pack: 24px line icons, inherit currentColor ---------- */
const Ic = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)
const IcMic = () => <Ic><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M5.5 10.5a6.5 6.5 0 0 0 13 0M12 17v4.5M8.5 21.5h7" /></Ic>
const IcShield = () => <Ic><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" /><path d="M8.8 12l2.2 2.2 4.4-4.4" /></Ic>
const IcWave = () => <Ic><path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10.5v3M21 12h0" /></Ic>
const IcHeart = () => <Ic><path d="M12 20.5s-8-4.6-8-10.4A4.4 4.4 0 0 1 12 7.5a4.4 4.4 0 0 1 8 2.6c0 5.8-8 10.4-8 10.4z" /></Ic>
const IcCap = () => <Ic><path d="M2.5 9L12 4.5 21.5 9 12 13.5z" /><path d="M6.5 11v4.5c1.5 1.5 3.4 2.2 5.5 2.2s4-.7 5.5-2.2V11M21.5 9v5" /></Ic>
const IcLion = () => <Ic><circle cx="12" cy="12.5" r="4.5" /><path d="M12 3l1.6 2.6L16.5 4l.3 3 3 .4-1.4 2.7 2 2.3-2.8 1.1.4 3-3-.6L13.5 19 12 21.5 10.5 19l-1.5-3.1-3 .6.4-3-2.8-1.1 2-2.3-1.4-2.7 3-.4.3-3 2.9 1.6z" /></Ic>
const IcCampus = () => <Ic><path d="M3 20.5h18M5 20.5V10M19 20.5V10M3 10l9-6 9 6M9.5 20.5v-5h5v5" /></Ic>
const IcCoop = () => <Ic><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2.5 19a5.5 5.5 0 0 1 11 0M10.5 19a5.5 5.5 0 0 1 11 0" /></Ic>
const IcBriefcase = () => <Ic><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" /></Ic>
const IcArrow = () => <Ic><path d="M5 12h14M13 6l6 6-6 6" /></Ic>

/* ---------- the skill tree: viewBox 520 × 520, fork at (260,360) ---------- */
const F = [260, 360]
const TRUNK = 'M260 488 C258 450 262 400 260 360'
const NODES = [
  { id: 'campus', x: 86, y: 300, c1: [205, 356], c2: [130, 342], Icon: IcCap, label: 'Campus to Corporate',
    text: 'Interviews, group discussions and meeting etiquette for students and new hires.', who: 'Students · new joinees' },
  { id: 'speak', x: 122, y: 160, c1: [228, 292], c2: [158, 236], Icon: IcMic, label: 'Speak with Confidence',
    text: 'Overcome nerves and speak clearly in meetings, reviews and presentations.', who: 'Teams that present' },
  { id: 'build', x: 260, y: 80, c1: [266, 270], c2: [250, 170], Icon: IcShield, label: 'Confidence Building',
    text: 'Beat stage fright, speak up in meetings and project quiet authority.', who: 'Emerging leaders' },
  { id: 'public', x: 398, y: 160, c1: [292, 292], c2: [362, 236], Icon: IcWave, label: 'Public Speaking',
    text: 'Voice, pace, body language and nerves for client calls and town halls.', who: 'Managers · client-facing' },
  { id: 'women', x: 434, y: 300, c1: [315, 356], c2: [390, 342], Icon: IcHeart, label: "Women's Workshop",
    text: 'A women-only, supportive space to build confidence and everyday speaking skills.', who: 'Women professionals' },
].map((n) => ({ ...n, path: `M${F[0]} ${F[1]} C${n.c1.join(' ')} ${n.c2.join(' ')} ${n.x} ${n.y}` }))

/* point + tangent angle on a cubic bezier */
const bez = (t, p0, p1, p2, p3) => {
  const u = 1 - t
  const pt = (i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]
  const dv = (i) => 3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i])
  return [pt(0), pt(1), (Math.atan2(dv(1), dv(0)) * 180) / Math.PI]
}

/* leaves sprout along every branch, alternating sides */
const LEAF = 'M0 0 C6 -7.5 17 -8 25 0 C17 8 6 7.5 0 0Z'
const LEAVES = NODES.flatMap((n, bi) =>
  [0.32, 0.52, 0.7].map((t, li) => {
    const [x, y, ang] = bez(t, F, n.c1, n.c2, [n.x, n.y])
    const side = (li + bi) % 2 ? 1 : -1
    return {
      key: `${n.id}-${li}`, b: bi, ld: 0.5 + 0.72 * t, x, y, a: ang + side * 52, s: 0.72 + ((li + bi) % 3) * 0.16,
      tone: (li + bi) % 3 === 0 ? 'g' : 'j', d: 1.25 + bi * 0.12 + li * 0.14, sw: 4.5 + ((bi + li) % 4),
    }
  }),
).concat(
  [[0.35, -1], [0.62, 1]].map(([t, side], i) => {
    const [x, y, ang] = bez(t, [260, 488], [258, 450], [262, 400], [260, 360])
    return { key: `trunk-${i}`, b: -1, ld: 0.12 + 0.5 * t, x, y, a: ang + side * 58, s: 0.85, tone: 'g', d: 0.9 + i * 0.15, sw: 6 }
  }),
)

const ROOTS = ['M260 488 C232 492 206 486 184 474', 'M260 488 C290 494 318 488 338 474', 'M260 488 C250 496 234 500 218 500', 'M260 488 C270 496 290 500 304 500']
const FLIES = [[150, 110, 7], [372, 96, 9], [330, 250, 10], [96, 228, 11], [260, 30, 9.5]]
const TRUST = [
  { Icon: IcLion, label: 'Lions Clubs' },
  { Icon: IcCampus, label: 'Campuses' },
  { Icon: IcCoop, label: 'Co-operatives' },
  { Icon: IcBriefcase, label: 'Corporates' },
]

const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 41 + 7) % 100}%`,
  delay: `${-((i * 1.9) % 13)}s`,
  dur: `${10 + (i % 4) * 2.5}s`,
  s: `${2 + (i % 3)}px`,
}))

const RIBBON = [{ t: 'Teach' }, { t: 'Train' }, { t: 'Transform' }, { t: 'SparkTree Foundation' }]
const IcLeaf = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 19C5 10 10 5 20 4c-.5 10-5.5 15-14 15z" />
    <path d="M5 19l8-8" />
  </svg>
)

/* twinkling four-point sparks scattered across the background */
const TWINKLES = [
  [6, 18, 14, 0], [18, 72, 10, 1.4], [31, 8, 8, 2.6], [44, 88, 12, 0.8], [52, 14, 9, 3.2],
  [63, 64, 7, 1.9], [72, 6, 13, 0.4], [86, 30, 10, 2.2], [94, 78, 14, 3.6], [79, 90, 8, 1.1],
  [12, 46, 7, 2.9], [38, 40, 6, 0.2], [58, 36, 8, 2.4], [97, 12, 9, 1.6],
].map(([x, y, size, delay], i) => ({ x, y, size, delay, dur: 3.2 + (i % 4) * 0.9, gold: i % 3 !== 1 }))
const SHOOTERS = [
  { top: 12, left: 8, delay: 2, dur: 9 },
  { top: 34, left: 46, delay: 6.5, dur: 11 },
  { top: 6, left: 70, delay: 10, dur: 13 },
]
const SPARK_D = 'M12 0C12.9 7.6 16.4 11.1 24 12 16.4 12.9 12.9 16.4 12 24 11.1 16.4 7.6 12.9 0 12 7.6 11.1 11.1 7.6 12 0Z'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function SkillHero() {
  const secRef = useRef(null)
  const treeRef = useRef(null)
  const [step, setStep] = useState(0)
  const active = (1 + step) % NODES.length
  const [grown, setGrown] = useState(false)

  // grow the tree on mount
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 120)
    return () => clearTimeout(t)
  }, [])

  // hide the floating WhatsApp button while the hero is on screen
  useEffect(() => {
    const sec = secRef.current
    if (!sec) return
    const io = new IntersectionObserver(([e]) => document.body.classList.toggle('hero-in', e.intersectionRatio > 0.15), {
      threshold: [0, 0.15, 0.3],
    })
    io.observe(sec)
    return () => {
      io.disconnect()
      document.body.classList.remove('hero-in')
    }
  }, [])

  // tour the branches on a fixed interval (hover does not change it)
  useEffect(() => {
    if (reduced()) return
    const id = setInterval(() => setStep((v) => v + 1), 3800)
    return () => clearInterval(id)
  }, [])

  // pointer parallax: moves only the tree layer (compositor transform, no style recalcs)
  useEffect(() => {
    const sec = secRef.current
    const el = treeRef.current
    if (!sec || !el || reduced() || !window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    const s = { tx: 0, ty: 0, x: 0, y: 0 }
    const loop = () => {
      s.x += (s.tx - s.x) * 0.1
      s.y += (s.ty - s.y) * 0.1
      el.style.transform = `translate3d(${(s.x * -10).toFixed(2)}px, ${(s.y * -8).toFixed(2)}px, 0)`
      raf = Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) > 0.003 ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onMove = (e) => {
      const r = sec.getBoundingClientRect()
      s.tx = ((e.clientX - r.left) / r.width) * 2 - 1
      s.ty = ((e.clientY - r.top) / r.height) * 2 - 1
      kick()
    }
    const onLeave = () => {
      s.tx = 0
      s.ty = 0
      kick()
    }
    sec.addEventListener('pointermove', onMove, { passive: true })
    sec.addEventListener('pointerleave', onLeave)
    return () => {
      sec.removeEventListener('pointermove', onMove)
      sec.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  const motion = !reduced()
  // only the very first pass fills from the root; later passes start at the fork
  const first = motion && step === 0
  // a branch keeps its leaves once the green has visited it
  const seen = (b) => !motion || step >= (b - 1 + NODES.length) % NODES.length

  return (
    <header className={`sk-hero ${grown ? 'is-grown' : ''} ${first ? '' : 'is-cont'}`} id="top" ref={secRef}>
      <div className="sk-atmo" aria-hidden="true">
        <div className="sk-orb sk-orb--a" />
        <div className="sk-orb sk-orb--b" />
        <div className="sk-orb sk-orb--c" />
        <div className="sk-dots" />
        <div className="sk-twinkles">
          {TWINKLES.map((t, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className={t.gold ? 'g' : 'j'}
              style={{ left: `${t.x}%`, top: `${t.y}%`, width: t.size, height: t.size, animationDelay: `${t.delay}s`, animationDuration: `${t.dur}s` }}
            >
              <path d={SPARK_D} />
            </svg>
          ))}
          {SHOOTERS.map((sh, i) => (
            <i
              key={i}
              className="sk-shoot"
              style={{ top: `${sh.top}%`, left: `${sh.left}%`, animationDelay: `${sh.delay}s`, animationDuration: `${sh.dur}s` }}
            />
          ))}
        </div>
        <div className="sk-sparks">
          {SPARKS.map((p, i) => (
            <i key={i} style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur, width: p.s, height: p.s }} />
          ))}
        </div>
      </div>

      <div className="wrap sk-grid">
        <div className="sk-copy">
          <h1 className="sk-h1">
            <span className="sk-ln"><span>Custom soft-skills</span></span>
            <span className="sk-ln"><span>programmes, built</span></span>
            <span className="sk-ln sk-ln--hl">
              <span>on</span>
              <span className="sk-hl">
                <em>your needs.</em>
                <svg className="sk-scribble" viewBox="0 0 320 28" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="skInk" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#D9B35B" />
                      <stop offset=".55" stopColor="#F2DFA4" />
                      <stop offset="1" stopColor="#7EDDB0" />
                    </linearGradient>
                  </defs>
                  <path className="s1" d="M6 15c38-6 82-9 128-8.5 52 .6 104 4.2 150 2.6 10-.3 20-1.2 30-2.6" pathLength="1" vectorEffect="non-scaling-stroke" />
                  <path className="s2" d="M38 23c46-4.6 100-6.6 152-5.8 34 .5 68 2.4 98 .8" pathLength="1" vectorEffect="non-scaling-stroke" />
                </svg>
              </span>
            </span>
          </h1>
          <p className="sk-lead">
            SparkTree designs and delivers niche workshops after a quick needs analysis — so your team gets exactly what moves
            the needle: stage presence, clear structure and the confidence to speak up.
          </p>
          <div className="sk-btns">
            <a className="btn sk-btn-main" href={waLink("Hello, I'd like to book a workshop.")} target="_blank" rel="noopener">
              <WaIcon />
              Book on WhatsApp
            </a>
            <a
              className="btn sk-btn-ghost"
              href="#workshops"
              onClick={(e) => {
                e.preventDefault()
                glideTo('#workshops')
              }}
            >
              Explore workshops <span className="sk-btn-arrow"><IcArrow /></span>
            </a>
          </div>

          <div className="sk-trust">
            <small>Trusted across Karnataka by</small>
            <div className="sk-trust-rail">
              <ul>
                {[...TRUST, ...TRUST].map(({ Icon, label }, i) => (
                  <li key={i} className={i >= TRUST.length ? 'dup' : ''} aria-hidden={i >= TRUST.length || undefined}>
                    <Icon />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sk-led">
            <div className="sk-avatars">
              {TRAINERS.map((t) => (
                <Link key={t.slug} to={`/trainers/${t.slug}`} title={t.name} aria-label={`Trainer profile: ${t.name}`}>
                  <img src={t.img} alt="" width="44" height="44" />
                </Link>
              ))}
            </div>
            <span>
              Led by <b>{TRAINERS.map((t) => t.name.split(' ')[0]).join(' & ')}</b> · in every session
            </span>
          </div>
        </div>

        {/* interactive skill tree */}
        <div className="sk-stage">
          <div className="sk-tree-wrap" ref={treeRef}>
            <svg className="sk-tree" viewBox="0 0 520 520" aria-hidden="true">
              <defs>
                <linearGradient id="skTrunk" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#D9B35B" />
                  <stop offset="1" stopColor="#F2DFA4" />
                </linearGradient>
                <radialGradient id="skHalo">
                  <stop offset="0" stopColor="#7EDDB0" stopOpacity=".55" />
                  <stop offset="1" stopColor="#7EDDB0" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="skCanopy">
                  <stop offset="0" stopColor="#7EDDB0" stopOpacity=".16" />
                  <stop offset=".6" stopColor="#7EDDB0" stopOpacity=".05" />
                  <stop offset="1" stopColor="#7EDDB0" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="skLeafJ" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#3FA877" />
                  <stop offset="1" stopColor="#9BE8C2" />
                </linearGradient>
                <linearGradient id="skLeafG" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#B8913E" />
                  <stop offset="1" stopColor="#F2DFA4" />
                </linearGradient>
                <radialGradient id="skGround">
                  <stop offset="0" stopColor="#D9B35B" stopOpacity=".45" />
                  <stop offset="1" stopColor="#D9B35B" stopOpacity="0" />
                </radialGradient>
              </defs>

              <ellipse className="sk-canopy" cx="260" cy="210" rx="210" ry="170" fill="url(#skCanopy)" />
              <g className="sk-rings">
                <circle cx="260" cy="250" r="238" />
                <circle cx="260" cy="250" r="196" strokeDasharray="2 10" />
              </g>
              <ellipse className="sk-ground" cx="260" cy="492" rx="120" ry="14" fill="url(#skGround)" />

              <g className="sk-roots">
                {ROOTS.map((d) => <path key={d} d={d} pathLength="1" />)}
              </g>
              <path className="sk-trunk-glow" d={TRUNK} />
              <path className="sk-trunk" d={TRUNK} pathLength="1" />
              <path className="sk-flow sk-flow--trunk" d={TRUNK} pathLength="1" />

              {NODES.map((n, i) => (
                <g key={n.id} className={`sk-branch ${i === active ? 'on' : ''}`} style={{ '--d': `${0.5 + i * 0.12}s` }}>
                  <path className="glow" d={n.path} />
                  <path className="line" d={n.path} pathLength="1" />
                  <path className="sk-flow" d={n.path} pathLength="1" style={{ animationDelay: `${1.8 + i * 0.35}s` }} />
                  <circle className="halo" cx={n.x} cy={n.y} r="48" fill="url(#skHalo)" />
                </g>
              ))}

              {/* green energy: fills root → trunk → active branch, replayed on every change */}
              {grown && (
                <g className={`sk-fill ${first ? '' : 'from-fork'}`} key={active}>
                  <path className={`halo-line ${first ? '' : 'still'}`} d={TRUNK} pathLength="1" />
                  <path className="halo-line b" d={NODES[active].path} pathLength="1" />
                  <path className={`core t ${first ? '' : 'still'}`} d={TRUNK} pathLength="1" />
                  <path className="core b" d={NODES[active].path} pathLength="1" />
                </g>
              )}

              <g className="sk-leaves sk-leaves--base">
                {LEAVES.map((l) => (
                  <g key={l.key} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.a.toFixed(1)}) scale(${l.s.toFixed(2)})`}>
                    <g className={`leaf leaf--${l.tone} ${(l.b === -1 && !first) || (l.b >= 0 && l.b !== active && seen(l.b)) ? 'shown' : ''}`}>
                      <path d={LEAF} />
                      <path className="vein" d="M2 0 L21 0" />
                    </g>
                  </g>
                ))}
              </g>

              {/* leaves the green touches burst into jade, timed to the fill */}
              {grown && (
                <g className="sk-leaves sk-leaves--live" key={`l-${active}`}>
                  {LEAVES.filter((l) => (first && l.b === -1) || l.b === active).map((l) => (
                    <g key={l.key} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.a.toFixed(1)}) scale(${l.s.toFixed(2)})`}>
                      <g className={`leaf leaf--${l.tone}`} style={{ '--ld': `${Math.max(0, l.ld - (first ? 0 : 0.5)).toFixed(2)}s` }}>
                        <path d={LEAF} />
                        <path className="vein" d="M2 0 L21 0" />
                      </g>
                    </g>
                  ))}
                </g>
              )}

              {motion && (
                <g className="sk-flies">
                  {FLIES.map(([x, y, dur], i) => (
                    <circle key={i} cx={x} cy={y} r={i % 3 ? 1.8 : 2.4} style={{ animationDuration: `${dur}s`, animationDelay: `${-i * 1.3}s` }} />
                  ))}
                </g>
              )}
              <circle className="sk-forkdot" cx="260" cy="360" r="4.5" />
            </svg>

            <div className="sk-nodes">
              {NODES.map((n, i) => (
                <a
                  key={n.id}
                  className={`sk-node ${i === active ? 'on' : ''}`}
                  style={{ left: `${(n.x / 520) * 100}%`, top: `${(n.y / 520) * 100}%`, '--d': `${0.9 + i * 0.12}s` }}
                  href={waLink(`Hello, I'd like to know more about the "${n.label}" workshop.`)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${n.label}: ${n.text} Enquire on WhatsApp`}
                  title={n.text}
                >
                  <span className="dot"><n.Icon /></span>
                  <span className="lbl">{n.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="sk-caption" aria-hidden="true">
            <svg className="sk-arc" viewBox="0 0 320 96">
              <defs>
                <path id="skArcPath" d="M18 18 Q160 86 302 18" />
                <linearGradient id="skArcInk" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#F2DFA4" stopOpacity="0" />
                  <stop offset=".5" stopColor="#F2DFA4" stopOpacity=".5" />
                  <stop offset="1" stopColor="#F2DFA4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="sk-arc-line" d="M18 30 Q160 98 302 30" />
              <text className="sk-arc-text" key={active}>
                <textPath href="#skArcPath" startOffset="50%" textAnchor="middle">
                  {NODES[active].label}
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className="sk-ribbon" aria-hidden="true">
        <div className="sk-ribbon-track">
          {[0, 1].map((half) => (
            <div className="sk-ribbon-set" key={half}>
              {[...RIBBON, ...RIBBON].map((r, i) => (
                <span className="sk-ribbon-item" key={i}>
                  <span className="w">{r.t}</span>
                  <span className="sep"><IcLeaf /></span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
