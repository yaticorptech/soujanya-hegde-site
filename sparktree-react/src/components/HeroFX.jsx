import { useEffect, useRef } from 'react'

/**
 * Hero stage effects, all on one canvas + CSS vars:
 * - golden ember particles drifting up, twinkling, repelled by the spotlight
 * - click anywhere on the hero fires a spark burst at the pointer
 * - drives --sx/--sy on the hero (the "spotlight"): follows a fine pointer,
 *   and auto-roams a gentle lissajous path on touch devices or when idle.
 * Pauses when the hero is off-screen or the tab is hidden; skipped entirely
 * under prefers-reduced-motion.
 */
export default function HeroFX({ targetRef }) {
  const cvsRef = useRef(null)

  useEffect(() => {
    const hero = targetRef.current
    const cvs = cvsRef.current
    if (!hero || !cvs) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = cvs.getContext('2d')
    const fine = window.matchMedia('(pointer: fine)').matches
    let W = 0
    let H = 0
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      W = hero.clientWidth
      H = hero.clientHeight
      cvs.width = W * dpr
      cvs.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(hero)

    // pre-rendered glow sprite (cheaper than shadowBlur per particle)
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 64
    const sctx = sprite.getContext('2d')
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(247,233,184,1)')
    grad.addColorStop(0.35, 'rgba(207,167,90,.85)')
    grad.addColorStop(1, 'rgba(207,167,90,0)')
    sctx.fillStyle = grad
    sctx.fillRect(0, 0, 64, 64)

    const rnd = (a, b) => a + Math.random() * (b - a)
    const N = W < 700 ? 26 : 55
    const parts = Array.from({ length: N }, () => ({
      x: rnd(0, W), y: rnd(0, H), r: rnd(1.1, 3.2),
      vy: rnd(0.12, 0.5), sway: rnd(0.4, 1.4), ph: rnd(0, Math.PI * 2), tw: rnd(0.02, 0.06),
    }))
    let bursts = []
    let mx = W / 2
    let my = H * 0.4
    let tx = mx
    let ty = my
    let lastMove = 0
    let t = 0
    let raf = 0
    let visible = true

    const onMove = (e) => {
      const r = hero.getBoundingClientRect()
      tx = e.clientX - r.left
      ty = e.clientY - r.top
      lastMove = performance.now()
    }
    const onClick = (e) => {
      const r = hero.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16 + rnd(-0.25, 0.25)
        const s = rnd(1.5, 4.6)
        bursts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, r: rnd(1.6, 3.4) })
      }
    }
    hero.addEventListener('mousemove', onMove, { passive: true })
    hero.addEventListener('click', onClick)

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(hero)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      t += 0.016

      // spotlight: cursor when fresh, otherwise roam the stage
      if (!fine || performance.now() - lastMove > 2600) {
        tx = W / 2 + Math.sin(t * 0.5) * W * 0.33
        ty = H * 0.45 + Math.sin(t * 0.8 + 1.3) * H * 0.28
      }
      mx += (tx - mx) * 0.06
      my += (ty - my) * 0.06
      hero.style.setProperty('--sx', `${mx.toFixed(1)}px`)
      hero.style.setProperty('--sy', `${my.toFixed(1)}px`)

      ctx.clearRect(0, 0, W, H)
      for (const p of parts) {
        p.ph += p.tw
        p.y -= p.vy
        p.x += Math.sin(p.ph) * p.sway * 0.3
        const dx = p.x - mx
        const dy = p.y - my
        const d2 = dx * dx + dy * dy
        if (d2 < 12100) {
          const d = Math.sqrt(d2) || 1
          const f = ((110 - d) / 110) * 1.6
          p.x += (dx / d) * f
          p.y += (dy / d) * f
        }
        if (p.y < -12) { p.y = H + 12; p.x = rnd(0, W) }
        if (p.x < -12) p.x = W + 12
        else if (p.x > W + 12) p.x = -12
        ctx.globalAlpha = 0.32 + 0.3 * Math.sin(p.ph * 2)
        const s = p.r * 6
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s)
      }
      for (const b of bursts) {
        b.x += b.vx
        b.y += b.vy
        b.vx *= 0.96
        b.vy = b.vy * 0.96 + 0.05
        b.life -= 0.022
        ctx.globalAlpha = Math.max(0, b.life)
        const s = b.r * 7 * b.life + 2
        ctx.drawImage(sprite, b.x - s / 2, b.y - s / 2, s, s)
      }
      bursts = bursts.filter((b) => b.life > 0)
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('click', onClick)
    }
  }, [targetRef])

  return <canvas className="hero-fx" ref={cvsRef} aria-hidden="true" />
}
