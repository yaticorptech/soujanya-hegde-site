import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Kicker } from '../components/ui'
import useTitle from '../lib/useTitle'

const CODE = '1234'
const N = 6
const CELL = 100 // SVG units per cell
const REDIRECT_MS = 4600

const CONFETTI_COLORS = ['#E2B14C', '#F4D88A', '#F8F1E6', '#E8456B', '#B88A2E']

/* Zip-style puzzle. Cells are row*6+col. A hand-verified solution exists that
   visits the dots in order, fills all 36 cells and crosses no wall. */
const DOTS = [0, 14, 30, 27, 2, 22, 35, 5]
const WALLS = [
  [1, 2],
  [7, 8],
  [12, 13],
  [20, 21],
  [26, 32],
  [27, 28],
]

const DOTMAP = Object.fromEntries(DOTS.map((cell, i) => [cell, i + 1]))
const edgeKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`)
const WALLSET = new Set(WALLS.map(([a, b]) => edgeKey(a, b)))
const LAST_DOT = DOTS[DOTS.length - 1]

const cx = (id) => ((id % N) + 0.5) * CELL
const cy = (id) => (Math.floor(id / N) + 0.5) * CELL

/** Highest dot number already on the path (dots are only enterable in order). */
const dotsVisited = (path) => path.reduce((m, c) => Math.max(m, DOTMAP[c] || 0), 0)

/** The line is locked up to the last star it reached — that part can't be erased. */
const lockedLenOf = (path) => {
  for (let i = path.length - 1; i >= 0; i--) if (DOTMAP[path[i]]) return i + 1
  return 1
}

export default function Game() {
  useTitle('Backstage — Soujanya Hegde', 'A members-only mini game behind the curtain.')
  const navigate = useNavigate()
  const [stage, setStage] = useState('lock') // lock → ready → play → done
  const [code, setCode] = useState('')
  const [err, setErr] = useState(false)
  const [path, setPath] = useState([DOTS[0]])
  const pathRef = useRef([DOTS[0]])
  const boardRef = useRef(null)
  const dragging = useRef(false)
  const audioRef = useRef(null)

  // the context must be created/resumed during a user gesture to be allowed to play
  const ensureAudio = () => {
    if (!audioRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) audioRef.current = new Ctx()
    }
    audioRef.current?.resume?.()
    return audioRef.current
  }

  useEffect(() => {
    return () => {
      audioRef.current?.close?.()
    }
  }, [])

  const playWin = () => {
    const ctx = ensureAudio()
    if (!ctx) return
    const t0 = ctx.currentTime
    const master = ctx.createGain()
    master.gain.value = 0.18
    master.connect(ctx.destination)
    // ascending golden chime: C5 → E5 → G5 → C6
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.value = f
      const t = t0 + i * 0.13
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.9, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.9)
      o.connect(g)
      g.connect(master)
      o.start(t)
      o.stop(t + 1)
    })
    // soft sparkle chord on top
    ;[1318.5, 1568, 2093].forEach((f) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f
      const t = t0 + 0.5
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.3, t + 0.04)
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.5)
      o.connect(g)
      g.connect(master)
      o.start(t)
      o.stop(t + 1.6)
    })
  }

  const commit = (p) => {
    pathRef.current = p
    setPath(p)
  }

  useEffect(() => {
    if (stage !== 'play') return
    if (path[path.length - 1] === LAST_DOT) {
      playWin()
      setStage('done')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, path])

  useEffect(() => {
    if (stage !== 'done') return
    const t = setTimeout(() => {
      navigate('/')
    }, REDIRECT_MS)
    return () => {
      clearTimeout(t)
    }
  }, [stage, navigate])

  const unlock = (e) => {
    e.preventDefault()
    if (code === CODE) {
      setErr(false)
      setStage('ready')
    } else {
      setErr(true)
      setCode('')
    }
  }

  const legal = (cur, last, id) => {
    if (cur.includes(id)) return false
    if (WALLSET.has(edgeKey(last, id))) return false
    const d = DOTMAP[id]
    if (d && d !== dotsVisited(cur) + 1) return false
    return true
  }

  /** Extend (or trim) the line toward the cell under the pointer. */
  const steer = (target) => {
    let cur = pathRef.current
    const idx = cur.indexOf(target)
    if (idx >= 0) {
      // dragging back over the line erases it up to that point — but never past a reached star
      const keep = Math.max(idx + 1, lockedLenOf(cur))
      if (keep < cur.length) commit(cur.slice(0, keep))
      return
    }
    let guard = 0
    let changed = false
    while (guard++ < N * N) {
      const last = cur[cur.length - 1]
      if (last === target) break
      const lr = Math.floor(last / N)
      const lc = last % N
      const tr = Math.floor(target / N)
      const tc = target % N
      const dr = Math.sign(tr - lr)
      const dc = Math.sign(tc - lc)
      const cands = []
      if (Math.abs(tr - lr) >= Math.abs(tc - lc)) {
        if (dr) cands.push(last + dr * N)
        if (dc) cands.push(last + dc)
      } else {
        if (dc) cands.push(last + dc)
        if (dr) cands.push(last + dr * N)
      }
      const next = cands.find((id) => legal(cur, last, id))
      if (next === undefined) break
      cur = [...cur, next]
      changed = true
    }
    if (changed) commit(cur)
  }

  const cellFromEvent = (e) => {
    const r = boardRef.current.getBoundingClientRect()
    const c = Math.floor(((e.clientX - r.left) / r.width) * N)
    const row = Math.floor(((e.clientY - r.top) / r.height) * N)
    if (c < 0 || c >= N || row < 0 || row >= N) return -1
    return row * N + c
  }

  const onDown = (e) => {
    e.preventDefault()
    ensureAudio()
    const id = cellFromEvent(e)
    if (id < 0) return
    dragging.current = true
    boardRef.current.setPointerCapture?.(e.pointerId)
    steer(id)
  }

  const onMove = (e) => {
    if (!dragging.current) return
    const id = cellFromEvent(e)
    if (id >= 0) steer(id)
  }

  const onUp = () => {
    dragging.current = false
  }

  const undo = () => {
    if (pathRef.current.length > lockedLenOf(pathRef.current)) commit(pathRef.current.slice(0, -1))
  }

  const reset = () => {
    commit([DOTS[0]])
  }

  const visited = dotsVisited(path)
  const head = path[path.length - 1]

  const confetti = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => {
        const a = Math.random() * Math.PI * 2
        const d = 70 + Math.random() * 160
        return {
          id: i,
          style: {
            '--dx': `${(Math.cos(a) * d).toFixed(0)}px`,
            '--dy': `${(Math.sin(a) * d - 40).toFixed(0)}px`,
            '--rot': `${(90 + Math.random() * 540).toFixed(0)}deg`,
            '--c': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            width: `${7 + Math.random() * 6}px`,
            height: `${7 + Math.random() * 6}px`,
            borderRadius: i % 3 ? '2px' : '50%',
            animationDelay: `${(Math.random() * 0.6).toFixed(2)}s`,
          },
        }
      }),
    [],
  )

  return (
    <section className="sec game">
      <div className="wrap">
        {stage === 'lock' && (
          <form className={`g-card g-lock2 ${err ? 'g-err' : ''}`} onSubmit={unlock}>
            <img className="g-poster" src="/img/bni-poster.jpg" alt="BNI Inspire — Feature Presentation by Soujanya Hegde" />
            <div className="g-row" style={{ marginTop: 0 }}>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={8}
                placeholder="1234"
                aria-label="Secret code"
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setErr(false)
                }}
              />
              <button className="btn btn--gold" type="submit">
                Unlock
              </button>
            </div>
            {err && <div className="g-msg">That's not the code — try again.</div>}
          </form>
        )}

        {stage === 'ready' && (
          <div className="g-card">
            <div className="g-emblem" aria-hidden="true">✦</div>
            <Kicker>You're in</Kicker>
            <h1>
              Connect the <em>stars.</em>
            </h1>
            <p>
              Draw one continuous golden line from <strong>1</strong> to <strong>{DOTS.length}</strong>, connecting the
              numbers in order. Walls block the way. Drag to draw, drag back to erase.
            </p>
            <div className="g-row">
              <button
                className="btn btn--gold"
                type="button"
                onClick={() => {
                  reset()
                  setStage('play')
                }}
              >
                Start the game
              </button>
            </div>
          </div>
        )}

        {stage === 'play' && (
          <div className="zip-wrap">
            <div className="zip-hud">
              <div>
                <small>Stars</small>
                <b>
                  {visited}/{DOTS.length}
                </b>
              </div>
              <div className="zip-btns">
                <button className="zbtn" type="button" onClick={undo} disabled={path.length <= lockedLenOf(path)}>
                  Undo
                </button>
                <button className="zbtn" type="button" onClick={reset} disabled={path.length < 2}>
                  Restart
                </button>
              </div>
            </div>
            <div
              className="zip-board"
              ref={boardRef}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <svg viewBox={`0 0 ${N * CELL} ${N * CELL}`} aria-hidden="true">
                <defs>
                  <linearGradient id="zgold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F4D88A" />
                    <stop offset="0.55" stopColor="#E2B14C" />
                    <stop offset="1" stopColor="#B88A2E" />
                  </linearGradient>
                </defs>
                {Array.from({ length: N - 1 }, (_, i) => (
                  <g key={i} className="z-grid">
                    <line x1={(i + 1) * CELL} y1="0" x2={(i + 1) * CELL} y2={N * CELL} />
                    <line x1="0" y1={(i + 1) * CELL} x2={N * CELL} y2={(i + 1) * CELL} />
                  </g>
                ))}
                {path.length > 1 && (
                  <polyline className="z-path" points={path.map((id) => `${cx(id)},${cy(id)}`).join(' ')} />
                )}
                <circle className="z-headcap" cx={cx(head)} cy={cy(head)} r="29" />
                {WALLS.map(([a, b]) => {
                  const ar = Math.floor(a / N)
                  const ac = a % N
                  const vertical = ar === Math.floor(b / N)
                  const x = vertical ? Math.max(ac, b % N) * CELL : ac * CELL
                  const y = vertical ? ar * CELL : Math.max(ar, Math.floor(b / N)) * CELL
                  return vertical ? (
                    <line key={`${a}-${b}`} className="z-wall" x1={x} y1={y + 10} x2={x} y2={y + CELL - 10} />
                  ) : (
                    <line key={`${a}-${b}`} className="z-wall" x1={x + 10} y1={y} x2={x + CELL - 10} y2={y} />
                  )
                })}
                {DOTS.map((cell, i) => {
                  const on = path.includes(cell)
                  const next = i + 1 === visited + 1 && !on
                  return (
                    <g key={cell} className={`z-dot ${on ? 'on' : ''} ${next ? 'next' : ''}`}>
                      <circle cx={cx(cell)} cy={cy(cell)} r="27" />
                      <text x={cx(cell)} y={cy(cell)}>
                        {i + 1}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
            <p className="zip-tip">Connect the stars in order · reaching a star locks the line so far</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="g-card g-pop">
            <div className="g-burst" aria-hidden="true">
              {confetti.map((p) => (
                <i key={p.id} style={p.style} />
              ))}
            </div>
            <div className="g-face">
              <img src="/imgw/hero-pink-480.webp" alt="Soujanya Hegde" />
            </div>
            <Kicker>Path complete</Kicker>
            <h1>
              <em>Star of the show!</em>
            </h1>
            <p>Raising the curtain on the show…</p>
            <div className="g-row">
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() => {
                  navigate('/')
                }}
              >
                Enter now
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
