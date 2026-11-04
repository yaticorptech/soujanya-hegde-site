import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Nav, Footer } from './components/shared'
import Home from './pages/Home'
import Events from './pages/Events'
import Event from './pages/Event'
import Trainer from './pages/Trainer'

/** Scroll to top on route change; honour /#section links from any page. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // wait a tick so the target section exists after a route change
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<Event />} />
        <Route path="/trainers/:slug" element={<Trainer />} />
        <Route path="*" element={<Events />} />
      </Routes>
      <Footer />
    </>
  )
}
