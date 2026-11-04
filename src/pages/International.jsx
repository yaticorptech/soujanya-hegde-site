import Reveal from '../components/Reveal'
import { SectionHead } from '../components/ui'
import useTitle from '../lib/useTitle'

const STAMPS = [
  {
    seal: '10 YRS', flag: '🇳🇬', title: 'Abuja, Nigeria', where: 'Nrityalaya · Indian Cultural Association',
    text: 'Founded and directed Nrityalaya dance institute, led the Golden Girls troupe and served as Cultural Secretary of the ICA — recognised by the High Commissioner of India in 2012.',
    img: '/img/stage-black.jpg',
  },
  {
    seal: '2017', flag: '🇻🇳', title: 'Vietnam', where: 'Mrs India Worldwide semi-finals',
    text: 'Grooming, portfolio shoots and the semi-final rounds of Haut Monde Mrs India Worldwide 2017 — one of only seven finalists chosen from Karnataka.',
    img: '/img/stock-redcarpet.jpg', imgStyle: { objectPosition: '50% 60%' }, d: 1,
  },
  {
    seal: 'TOP 6', flag: '🇮🇳', title: 'Gurugram, India', where: 'Grand finale, Kingdom of Dreams',
    text: 'Crowned Mrs Popular on 5 August 2017, finishing sixth among contestants drawn from more than 8,000 applications across the world.',
    img: '/img/audience.jpg', d: 2,
  },
  {
    seal: '25 YRS', flag: '🇦🇪', title: 'Dubai, UAE', where: 'ACME Group silver jubilee',
    text: 'Hosted the 25th-anniversary celebration of ACME Group, led by Mr Harish Sherigar — a black-tie ballroom night in Dubai with a live band and a packed floor of guests.',
    img: '/img/dubai-01.jpg', imgAlt: 'Soujanya at the ACME 25th anniversary backdrop in Dubai', d: 3,
  },
]

const DUBAI_GAL = [
  { src: '/img/dubai-03.jpg', alt: 'Hosting from the podium at the ACME 25th anniversary, Dubai' },
  { src: '/img/dubai-13.jpg', alt: 'With the live band on the ACME stage', d: 1 },
  { src: '/img/dubai-21.jpg', alt: 'On the mic under the stage lights', d: 2 },
  { src: '/img/dubai-05.jpg', alt: 'Sharing the mic with the youngest guest of the night', d: 3 },
  { src: '/img/dubai-09.jpg', alt: 'On the red carpet with guests', d: 1 },
  { src: '/img/dubai-17.jpg', alt: 'The ACME ballroom, set and waiting', d: 2 },
]

export default function International() {
  useTitle('International Stage — Soujanya Hegde', 'Abuja, Vietnam, Gurugram — a passport stamped by applause.')

  return (
    <section className="sec world" id="world">
      <div className="world-bg" aria-hidden="true" data-par="0.07"></div>
      <div className="wrap">
        <SectionHead
          kicker="International stage"
          title={<>Passport stamped <em>by applause.</em></>}
          lead="Shows in, around and well outside India — a decade of cultural leadership in West Africa, a pageant run across two countries, and a stage voice that travels."
        />
        <div className="stamps" data-fx="grow">
          {STAMPS.map((s) => (
            <Reveal key={s.title} as="article" className="stamp-card" d={s.d || 0}>
              <div className="seal">{s.seal}</div>
              <div className="flag">{s.flag}</div>
              <h3>{s.title}</h3>
              <div className="where">{s.where}</div>
              <p>{s.text}</p>
              <figure>
                <img src={s.img} alt={s.imgAlt || ''} loading="lazy" decoding="async" style={s.imgStyle} />
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="world-spot">
          <Reveal as="h3">Spotlight — ACME Silver Jubilee, Dubai</Reveal>
          <div className="world-gal" data-fx="driftl">
            {DUBAI_GAL.map((g) => (
              <Reveal key={g.src} as="figure" d={g.d || 0}>
                <img src={g.src} alt={g.alt} loading="lazy" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
