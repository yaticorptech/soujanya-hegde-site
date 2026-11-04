/**
 * Image pipeline: for every JPEG in public/img, generate responsive WebP
 * variants in public/imgw plus a tiny blur-up placeholder, and write a
 * manifest (src/lib/img-manifest.json) the <Pic> component reads.
 * Also builds the favicon set from the logo. Idempotent — skips existing files.
 */
import sharp from 'sharp'
import { readdirSync, mkdirSync, existsSync, writeFileSync } from 'fs'

const SRC = 'public/img'
const OUT = 'public/imgw'
const WIDTHS = [480, 960, 1600]

mkdirSync(OUT, { recursive: true })
mkdirSync('src/lib', { recursive: true })

const files = readdirSync(SRC).filter((f) => /\.jpe?g$/i.test(f))
const manifest = {}
let made = 0

for (const f of files) {
  const inPath = `${SRC}/${f}`
  const base = f.replace(/\.jpe?g$/i, '')
  let meta
  try {
    meta = await sharp(inPath).metadata()
  } catch {
    console.warn('skip (unreadable):', f)
    continue
  }
  let widths = WIDTHS.filter((w) => w <= meta.width)
  if (!widths.length) widths = [meta.width]

  for (const w of widths) {
    const out = `${OUT}/${base}-${w}.webp`
    if (!existsSync(out)) {
      await sharp(inPath).rotate().resize({ width: w }).webp({ quality: 78 }).toFile(out)
      made++
    }
  }
  const blur = await sharp(inPath).rotate().resize({ width: 14 }).webp({ quality: 30 }).toBuffer()
  manifest[f] = { w: meta.width, h: meta.height, v: widths, blur: `data:image/webp;base64,${blur.toString('base64')}` }
}

writeFileSync('src/lib/img-manifest.json', JSON.stringify(manifest))
console.log(`manifest: ${Object.keys(manifest).length} images, ${made} new webp files`)

// favicon set from the logo
const FAVS = [
  ['public/favicon-32.png', 32],
  ['public/favicon-192.png', 192],
  ['public/apple-touch-icon.png', 180],
]
for (const [out, size] of FAVS) {
  if (!existsSync(out)) {
    await sharp('public/img/logo.jpg').rotate().resize(size, size, { fit: 'cover' }).png().toFile(out)
    console.log('favicon:', out)
  }
}
