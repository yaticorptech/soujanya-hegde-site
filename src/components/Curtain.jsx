import { useEffect, useState } from 'react'

let played = false // intro runs once per visit; later returns to Home use the route curtain

/** Theatre-curtain intro (original #curtain markup), shown once on the home page. */
export default function Curtain() {
  const [phase, setPhase] = useState(played ? 'gone' : 'closed') // closed → open → gone

  useEffect(() => {
    if (played) {
      document.body.classList.add('ready')
      setPhase('gone')
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      played = true
      document.body.classList.add('ready')
      setPhase('gone')
      return
    }
    const t1 = setTimeout(() => {
      played = true
      setPhase('open')
      document.body.classList.add('ready')
    }, 900)
    const t2 = setTimeout(() => setPhase('gone'), 2600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.classList.add('ready')
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div id="curtain" className={phase === 'open' ? 'open' : ''} aria-hidden="true">
      <div className="panel l"></div>
      <div className="panel r"></div>
      <div className="mono">
        <img src="/img/logo.jpg" alt="" />
        <small>STAGES · SMILES · SPOTLIGHTS</small>
      </div>
    </div>
  )
}
