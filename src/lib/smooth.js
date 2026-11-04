import Lenis from 'lenis'

/** Shared Lenis instance so route changes and in-page scrolls use the same engine. */
export let lenis = null

export function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ duration: 1.15, smoothWheel: true })
  let id
  const raf = (t) => {
    lenis.raf(t)
    id = requestAnimationFrame(raf)
  }
  id = requestAnimationFrame(raf)
  return () => {
    cancelAnimationFrame(id)
    lenis.destroy()
    lenis = null
  }
}

export function jumpToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

export function glideTo(top) {
  if (lenis) lenis.scrollTo(top)
  else window.scrollTo({ top, behavior: 'smooth' })
}
