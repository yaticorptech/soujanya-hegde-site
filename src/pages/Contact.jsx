import { useMemo, useState } from 'react'
import Reveal from '../components/Reveal'
import { Kicker, H2, WaIcon, YtIcon } from '../components/ui'
import { WHATSAPP } from '../data'
import useTitle from '../lib/useTitle'

const TYPES = ['Event hosting', 'Event planning', 'Corporate training (SparkTree)', "Party supplies & décor (Let'Z Party)", 'Brand collaboration', 'Something else']

export default function Contact() {
  useTitle('Contact — Soujanya Hegde', 'Book Soujanya for hosting, planning or corporate training. Fast replies on WhatsApp.')
  const [form, setForm] = useState({ name: '', phone: '', type: TYPES[0], date: '', msg: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const waHref = useMemo(() => {
    const parts = [`Hi Soujanya, I'm ${form.name.trim() || '…'}.`, `Looking for: ${form.type}.`]
    if (form.date) parts.push(`Event date: ${form.date}.`)
    if (form.phone.trim()) parts.push(`Phone: ${form.phone.trim()}.`)
    if (form.msg.trim()) parts.push(form.msg.trim())
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(parts.join('\n'))}`
  }, [form])

  return (
    <section className="sec sec--ivory contact" id="contact">
      <div className="wrap" data-fx="grow">
        <div className="contact-info">
          <Kicker>Let's create magic</Kicker>
          <H2>Ready to elevate <em>your event?</em></H2>
          <Reveal as="p" d={2}>
            Hosting, planning, corporate training, brand launches, pageants, kids' events — tell Soujanya what you're dreaming
            up and she responds fast on WhatsApp.
          </Reveal>
          <Reveal as="p" d={2}>
            <b>WhatsApp</b> +91 63615 79485
            <br />
            <b>SparkTree workshops</b> +91 98808 42007
          </Reveal>
          <Reveal d={3} className="socials">
            <a href="https://www.instagram.com/hegdesoujanya/" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              @hegdesoujanya
            </a>
            <a href="https://www.youtube.com/@chatroomwithsoujanya" target="_blank" rel="noopener">
              <YtIcon />
              Chatroom with Soujanya
            </a>
            <a href="https://www.facebook.com/destroyer9611/" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3v2.4H7.4V14h2.8v8z" />
              </svg>
              Facebook
            </a>
            <a href="https://sparktreefoundation.in/" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22V12M12 12c-4 0-7-3-7-7 4 0 7 3 7 7zm0 0c4 0 7-3 7-7-4 0-7 3-7 7z" />
              </svg>
              SparkTree Foundation
            </a>
            <a href="https://www.instagram.com/letzparty_decorstore/" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a5 5 0 0 1 5 5c0 3-2.2 5.5-5 5.5S7 11 7 8a5 5 0 0 1 5-5z" />
                <path d="m12 13.5-1 1.8h2l-1 1.7V21" />
              </svg>
              Let'Z Party
            </a>
          </Reveal>
        </div>
        <Reveal
          as="form"
          d={2}
          className="form"
          id="waForm"
          onSubmit={(e) => {
            e.preventDefault()
            window.open(waHref, '_blank', 'noopener')
          }}
        >
          <h3>Send a message</h3>
          <p>Opens WhatsApp with your message pre-filled.</p>
          <div className="row">
            <div className="field">
              <label htmlFor="fName">Your name</label>
              <input id="fName" required placeholder="Your name" value={form.name} onChange={set('name')} />
            </div>
            <div className="field">
              <label htmlFor="fPhone">Phone</label>
              <input id="fPhone" type="tel" placeholder="+91 …" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="fType">What do you need?</label>
            <select id="fType" value={form.type} onChange={set('type')}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="fDate">Event date (optional)</label>
            <input id="fDate" type="date" value={form.date} onChange={set('date')} />
          </div>
          <div className="field">
            <label htmlFor="fMsg">Message</label>
            <textarea id="fMsg" placeholder="Tell me about the occasion, the city and the audience." value={form.msg} onChange={set('msg')} />
          </div>
          <a className="btn btn--wa" id="waSend" href={waHref} target="_blank" rel="noopener">
            <WaIcon />
            Send via WhatsApp
          </a>
          <div className="hint">You'll be taken to WhatsApp — nothing is stored on this page.</div>
        </Reveal>
      </div>
    </section>
  )
}
