import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Kicker } from '../components/ui'
import useTitle from '../lib/useTitle'

const CODE = '1234'
const GOAL = 10
const REDIRECT_MS = 2600

export default function Game() {
  useTitle('Backstage — Soujanya Hegde', 'A members-only mini game behind the curtain.')
  const navigate = useNavigate()
  const [stage, setStage] = useState('lock') // lock → ready → play → done
  const [code, setCode] = useState('')
  const [err, setErr] = useState(false)
  const [score, setScore] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    if (stage !== 'play' || score < GOAL) return
    setStage('done')
  }, [stage, score])

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
              Catch the <em>spotlight.</em>
            </h1>
            <p>
              Catch the golden star <strong>{GOAL} times</strong> — no clock, no pressure. When you catch them all, the
              curtain rises on the show.
            </p>
            <div className="g-row">
              <button className="btn btn--gold" type="button" onClick={start}>
                Start the game
              </button>
            </div>
          </div>
        )}

        {stage === 'play' && (
          <div className="g-play">
            <div className="g-hud">
              <div>
                <small>Caught</small>
                <b>{score}</b>
              </div>
              <div className="g-timebar" aria-hidden="true">
                <i style={{ width: `${(score / GOAL) * 100}%` }} />
              </div>
              <div>
                <small>Goal</small>
                <b>{GOAL}</b>
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
            <Kicker>All caught</Kicker>
            <div className="g-score">✦</div>
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
