import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const DOMAIN = 'https://hegdesoujanya.com'

const setMeta = (selector, attr, value) => {
  const el = document.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/** Per-route SEO: title, description, OpenGraph/Twitter tags and canonical URL. */
export default function useTitle(title, description) {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = title
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[name="twitter:title"]', 'content', title)
    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
      setMeta('meta[name="twitter:description"]', 'content', description)
    }
    const url = DOMAIN + (pathname === '/' ? '/' : pathname)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:url"]', 'content', url)
  }, [title, description, pathname])
}
