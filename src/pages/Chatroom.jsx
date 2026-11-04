import Reveal from '../components/Reveal'
import EpisodeCard from '../components/EpisodeCard'
import { Btn, Kicker, H2, PlayIcon, YtIcon } from '../components/ui'
import { EPISODES } from '../data'
import useTitle from '../lib/useTitle'

const STATS = [
  ['1.15K', 'subscribers'],
  ['29', 'episodes'],
  ['78K', 'views, top episode'],
]

const GUEST_TAGS = ['Dancers', 'Tulu film stars', 'Creators', 'Theatre artists', 'Founders', 'Record holders']

export default function Chatroom() {
  useTitle('Chatroom with Soujanya — YouTube', 'Long conversations with the dancers, actors and creators of Tulunadu.')

  return (
    <section className="sec chat" id="chatroom">
      <div className="wrap">
        <div className="chat-head">
          <Reveal as="img" className="av" src="/img/chatroom-avatar.jpg" alt="Soujanya, host of Chatroom with Soujanya" />
          <div>
            <Kicker>Chatroom with Soujanya</Kicker>
            <H2>Long conversations with the people who make <em>Tulunadu interesting.</em></H2>
          </div>
          <Reveal d={2} className="chat-stats">
            {STATS.map(([b, s]) => (
              <div key={s}>
                <b>{b}</b>
                <small>{s}</small>
              </div>
            ))}
          </Reveal>
        </div>
        <div className="feature" data-fx="grow">
          <Reveal as="a" className="ep-hero" href="https://www.youtube.com/watch?v=HFm5P-d-yOw" target="_blank" rel="noopener">
            <img src="/img/ep-HFm5P-d-yOw.jpg" alt="Shilpa Shetty on Chatroom with Soujanya" loading="lazy" decoding="async" />
            <div className="play">
              <PlayIcon />
            </div>
            <div className="cap">
              <b>Shilpa Shetty — Navaratri special</b>
              <small>Content creator and stand-up comedian · 54 min · 78K views</small>
            </div>
          </Reveal>
          <Reveal d={1} className="ep-side">
            <h3>What the show is</h3>
            <p>
              Dancers, film actors, record holders, doctors who run marathons, content creators with a million followers —
              Soujanya sits them down for an hour and lets Mangaluru hear the story behind the reel. Recorded in Mangaluru, in
              Tulu, Kannada and English.
            </p>
            <div className="guests">
              {GUEST_TAGS.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
            <Btn variant="gold" href="https://www.youtube.com/@chatroomwithsoujanya?sub_confirmation=1">
              <YtIcon />Subscribe on YouTube
            </Btn>
          </Reveal>
        </div>
        <div className="eps" id="eps" data-fx="grow">
          {EPISODES.map((ep, i) => (
            <EpisodeCard key={ep.id} ep={ep} d={(i % 4) + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
