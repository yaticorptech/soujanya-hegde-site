# SparkTree Foundation — React site

React + Vite version of the standalone SparkTree Foundation site (`../sparktree-site`).
Light "growth" theme (forest green + spark amber) — original stylesheet in `src/sparktree.css`.

## Run

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # production build → dist/
```

## Structure

- `/` — landing page (hero, pillars, workshops, programmes, trainers, testimonials, field gallery, FAQ, CTA)
- `/events` — events listing
- `/events/:slug` — event photo story with lightbox (8 events)
- `src/events-data.js` — all event content (titles, metas, leads, 190 photos with captions); edit here to add events
- `src/components/shared.jsx` — Nav, Footer, Reveal, Lightbox, WhatsApp helpers

## Deploying

`netlify.toml` / `vercel.json` included with SPA rewrites — deploy `dist/` to the
sparktreefoundation.in host the same way as the main site.
