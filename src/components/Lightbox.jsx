import { useCallback, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, CloseIcon } from './ui'

/**
 * Full-screen photo viewer (original .lb markup). `items` is [{src, cap}],
 * `index` the open photo (null = closed). Keyboard arrows + Escape + swipe.
 */
export default function Lightbox({ items, index, onClose, onIndex }) {
  const open = index != null
  const touchX = useRef(0)

  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex])
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, prev, next])

  if (!open) return null
  const it = items[index]

  return (
    <div
      className="lb open"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
      }}
    >
      <button className="x" aria-label="Close" onClick={onClose}>
        <CloseIcon />
      </button>
      <button className="p" aria-label="Previous" onClick={prev}>
        <ChevronLeft />
      </button>
      <img src={it.src} alt={it.cap || ''} />
      <button className="n" aria-label="Next" onClick={next}>
        <ChevronRight />
      </button>
      <div className="cap">{it.cap || ''}</div>
    </div>
  )
}
