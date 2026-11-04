import { useEffect, useRef, useState } from 'react'

/** Adds the original `.rv` reveal-on-scroll behaviour. `d` = stagger step (data-d). */
export default function Reveal({ as: Tag = 'div', d = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} data-d={d || undefined} className={`rv ${inView ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
