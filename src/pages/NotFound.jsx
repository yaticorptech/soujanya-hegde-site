import { Btn, H2 } from '../components/ui'
import useTitle from '../lib/useTitle'

export default function NotFound() {
  useTitle('Page not found — Soujanya Hegde', 'This act does not exist.')
  return (
    <section className="sec" style={{ minHeight: '72vh', display: 'grid', placeItems: 'center' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div
          aria-hidden="true"
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(6rem,18vw,12rem)',
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '2px rgba(226,177,76,.6)',
          }}
        >
          404
        </div>
        <H2 d={0} style={{ margin: '18px auto 10px', maxWidth: 'none' }}>
          This page doesn't <em>exist.</em>
        </H2>
        <p style={{ color: 'rgba(248,241,230,.65)', maxWidth: '44ch', margin: '0 auto 28px' }}>
          The curtain never rose on this page — it may have moved, or the address has a typo. Let's get you back under the
          lights.
        </p>
        <Btn variant="gold" href="/">Back to the stage</Btn>
      </div>
    </section>
  )
}
