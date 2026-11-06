import Lenis from 'lenis'

/** Shared Lenis instance so route changes, nav links and in-page buttons use the same smooth engine. */
export let lenis = null

export function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  if (!window.matchMedia('(pointer: fine)').matches) return () => {} // touch keeps native momentum
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

/** Smoothly scroll to a pixel offset or an element / selector, leaving room for the sticky nav. */
export function glideTo(target) {
  const offset = -70
  if (lenis) return lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : offset })
  if (typeof target === 'number') return window.scrollTo({ top: target, behavior: 'smooth' })
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}

export function lockScroll(on) {
  if (!lenis) return
  if (on) lenis.stop()
  else lenis.start()
}
