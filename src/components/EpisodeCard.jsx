import Reveal from './Reveal'
import Pic from './Pic'

/** YouTube episode card (original .ep markup). `mini` omits the about line (home sidebar). */
export default function EpisodeCard({ ep, mini = false, d = 0 }) {
  const href = `https://www.youtube.com/watch?v=${ep.id}`
  const thumb = `/img/ep-${ep.id}.jpg`

  if (mini) {
    return (
      <a className="ep" href={href} target="_blank" rel="noopener">
        <figure>
          <Pic src={thumb} alt={ep.guest} sizes="(max-width: 1024px) 50vw, 300px" />
          <span className="dur">{ep.dur}</span>
        </figure>
        <div className="t">
          <b>{ep.guest}</b>
          <small className="v">{ep.views} views</small>
        </div>
      </a>
    )
  }

  return (
    <Reveal as="a" className="ep" d={d} href={href} target="_blank" rel="noopener">
      <figure>
        <Pic src={thumb} alt={ep.guest} sizes="(max-width: 1024px) 50vw, 300px" />
        <span className="dur">{ep.dur}</span>
      </figure>
      <div className="t">
        <b>{ep.guest}</b>
        <small>{ep.about}</small>
        <small className="v">{ep.views} views</small>
      </div>
    </Reveal>
  )
}
