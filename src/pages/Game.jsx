import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Kicker } from '../components/ui'
import useTitle from '../lib/useTitle'

const CODE = '1234'
const GAME_SECONDS = 10
const REDIRECT_MS = 2600

const verdict = (score) => {
  if (score >= 18) return 'Standing ovation!'
  if (score >= 12) return 'Star of the show!'
  if (score >= 6) return 'Great performance!'
  if (score >= 1) return 'The show must go on!'
  return 'Stage fright? Try again sometime!'
}

export default function Game() {
  useTitle('Backstage — Soujanya Hegde', 'A members-only mini game behind the curtain.')
  const navigate = useNavigate()
  const [stage, setStage] = useState('lock') // lock → ready → play → done
  const [code, setCode] = useState('')
  const [err, setErr] = useState(false)
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(GAME_SECONDS)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const endAt = useRef(0)

  useEffect(() => {
    if (stage !== 'play') return
    endAt.current = performance.now() + GAME_SECONDS * 1000
    const id = setInterval(() => {
      const ms = endAt.current - performance.now()
      if (ms <= 0) {
        clearInterval(id)
        setLeft(0)
        setStage('done')
      } else {
        setLeft(ms / 1000)
      }
    }, 100)
    return () => {
      clearInterval(id)
    }
  }, [stage])

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

  const hop = () => {
    setPos({ x: 10 + Math.random() * 80, y: 12 + Math.random() * 76 })
  }

  const start = () => {
    setScore(0)
    setLeft(GAME_SECONDS)
    hop()
    setStage('play')
  }

  const tap = (e) => {
    e.preventDefault()
    setScore((s) => s + 1)
    hop()
  }

  return (
    <section className="sec game">
      <div className="wrap">
        {stage === 'lock' && (
          <form className={`g-card ${err ? 'g-err' : ''}`} onSubmit={unlock}>
            <div className="g-emblem" aria-hidden="true">✦</div>
            <Kicker>Backstage entrance</Kicker>
            <h1>
              Members <em>only.</em>
            </h1>
            <p>Enter the secret code to step behind the curtain.</p>
            <div className="g-row">
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={8}
                placeholder="••••"
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
              Catch the <em>spotlight.</em>
            </h1>
            <p>
              Tap the golden star as many times as you can in <strong>{GAME_SECONDS} seconds</strong>. When the timer runs
              out, the curtain rises on the show.
            </p>
            <div className="g-row">
              <button className="btn btn--gold" type="button" onClick={start}>
                Start the clock
              </button>
            </div>
          </div>
        )}

        {stage === 'play' && (
          <div className="g-play">
            <div className="g-hud">
              <div>
                <small>Score</small>
                <b>{score}</b>
              </div>
              <div className="g-timebar" aria-hidden="true">
                <i style={{ width: `${(left / GAME_SECONDS) * 100}%` }} />
              </div>
              <div>
                <small>Time</small>
                <b>{left.toFixed(1)}s</b>
              </div>
            </div>
            <div className="g-arena">
              <button
                className="g-star"
                type="button"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onPointerDown={tap}
                aria-label="Catch the star"
              >
                ✦
              </button>
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div className="g-card">
            <Kicker>Time's up</Kicker>
            <div className="g-score">{score}</div>
            <h1>
              <em>{verdict(score)}</em>
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
