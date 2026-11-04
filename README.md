# Soujanya Hegde — React site

React + Vite + Tailwind CSS v4 version of the static site in `../site`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

## Structure

```
public/img/              all photos (served at /img/…)
src/index.css            Tailwind import + design tokens (@theme) + a few custom bits
src/data.js              content data: nav links, EPISODES, GALLERY arrays
src/App.jsx              routes (react-router-dom)
src/components/          Nav, Footer, Reveal (scroll animations), Lightbox,
                         Curtain (home intro), EpisodeCard, ui.jsx (buttons, headings, icons)
src/pages/               one component per page: Home, About, Journey, Celebrities,
                         International, Awards, SparkTree, KidFest, Chatroom, Gallery, Contact
```

## Editing content

- **Text** — edit the page component in `src/pages/`.
- **Episodes / gallery photos** — edit the arrays in `src/data.js`.
- **Colors / fonts** — design tokens live in the `@theme` block of `src/index.css`
  (they generate utilities like `bg-velvet`, `text-gold`, `font-display`).

## Images

`npm run images` (also runs automatically before every build) generates responsive WebP
variants in `public/imgw/` plus blur-up placeholders in `src/lib/img-manifest.json`.
After adding new photos to `public/img/`, just rebuild — the script only processes new files.
Components render photos through `src/components/Pic.jsx` for srcset + lazy loading.

## Deploying

SPA configs are included for both hosts (`netlify.toml`, `vercel.json`) with asset caching
and the rewrite rule the client-side router needs.

**Netlify:** drag-and-drop the repo at app.netlify.com (or `npx netlify-cli deploy --prod`
after `npx netlify-cli login`). **Vercel:** `npx vercel` and follow the prompts.
Then point the domain (hegdesoujanya.com) at the host and set it as the primary domain —
the canonical URLs, sitemap and OG tags already use it.

**Analytics:** paste a Plausible or GA4 snippet into the marked comment in `index.html`.

SEO already in place: per-route titles/descriptions/canonicals + OpenGraph/Twitter cards,
JSON-LD Person schema, `public/sitemap.xml`, `public/robots.txt`, favicon set.
