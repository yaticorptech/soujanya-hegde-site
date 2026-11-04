import manifest from '../lib/img-manifest.json'

/**
 * Responsive image: serves right-sized WebP with the original JPEG as fallback,
 * a blur-up placeholder while loading, and width/height to prevent layout shift.
 * The global `picture{display:contents}` rule keeps existing CSS selectors working.
 */
export default function Pic({ src, alt = '', sizes = '(max-width: 700px) 50vw, 33vw', eager = false, style, ...rest }) {
  const name = src.split('/').pop()
  const m = manifest[name]
  const loading = eager ? undefined : 'lazy'

  if (!m) return <img src={src} alt={alt} loading={loading} decoding="async" style={style} {...rest} />

  const base = `/imgw/${name.replace(/\.jpe?g$/i, '')}`
  const srcSet = m.v.map((w) => `${base}-${w}.webp ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={loading}
        decoding="async"
        {...(eager ? { fetchPriority: 'high' } : {})}
        style={{ backgroundImage: `url(${m.blur})`, backgroundSize: 'cover', ...style }}
        {...rest}
      />
    </picture>
  )
}
