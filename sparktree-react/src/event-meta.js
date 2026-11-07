/* Curated presentation data for each event album: best frames, short titles, place, audience. */
/* hand-picked frames per event: first one leads the stage */
export const PICKS = {
  yaticorp: [
    ['yaticorp-07', 'Soujanya opens the floor — five days of Campus to Corporate'],
    ['yaticorp-11', 'Mock interviews, one table at a time'],
    ['yaticorp-05', 'The full batch on the inaugural day'],
    ['yaticorp-24', 'Last-day selfie with the new joinees'],
  ],
  hyderabad: [
    ['hyderabad-06', 'Rise to Level Up — first speeches on the big stage'],
    ['hyderabad-11', 'Expectations first: the trainers open day one'],
    ['hyderabad-04', 'JCI Hyderabad Deccan’s young leaders'],
    ['hyderabad-25', 'Selfie round to close the weekend'],
  ],
  kadaba: [
    ['kadaba-41', 'Speech Spark Junior — every kid gets the mic'],
    ['kadaba-38', 'Tips before the turn on stage'],
    ['kadaba-32', 'The whole Kadaba batch with Lions Club Panja'],
    ['kadaba-37', 'Floor games that loosen the nerves'],
  ],
  mangalore: [
    ['mangalore-02', 'Two days of presentation skills, one proud room'],
    ['mangalore-24', 'Energy drill before the speeches'],
    ['mangalore-04', 'Big smiles after the final round'],
    ['mangalore-31', 'Thumbs up from the front row'],
  ],
  alvas: [
    ['alvas-14', 'Addressing the final-year batch at Alva’s'],
    ['alvas-12', 'A full hall for pre-recruitment prep'],
    ['alvas-11', 'Group discussions, observed and coached'],
    ['alvas-21', 'Panel done — selfie with the students'],
  ],
  atmashakthi: [
    ['atmashakthi-03', 'Managers from 35+ centres, one programme'],
    ['atmashakthi-14', 'Lighting the lamp to begin'],
    ['atmashakthi-04', 'Role plays on the RISE framework'],
    ['atmashakthi-19', 'Thank-you moment with the team'],
  ],
  bootcamp: [
    ['bootcamp-01', 'Confidence Bootcamp — the Mangalore crew'],
    ['bootcamp-13', 'Circle time: everyone speaks'],
    ['bootcamp-16', 'Certificates and big grins'],
    ['bootcamp-03', 'Thumbs up for day one'],
  ],
  madikeri: [
    ['madikeri-07', 'Lions Club Murnad members after the workshop'],
    ['madikeri-01', 'The full Madikeri group'],
    ['madikeri-10', 'Around the table, working in pairs'],
    ['madikeri-08', 'Practice rounds with Preetham'],
  ],
  women: [
    ['women-02', 'Mic Magic — the Women’s Networking Club'],
    ['women-06', 'The whole circle, all smiles'],
    ['women-10', 'Expectations on the board'],
    ['women-04', 'Small groups, big conversations'],
  ],
  'madikeri-ps': [
    ['madikeri-ps-17', 'A day of presentation skills in Madikeri'],
    ['madikeri-ps-02', 'Pair work, presented back'],
    ['madikeri-ps-22', 'Warm-ups before the stage'],
    ['madikeri-ps-07', 'Graduating the one-day intensive'],
  ],
}

export const EVENT_INFO = {
  yaticorp: { short: 'Campus to Corporate — YatiCorp', place: 'YatiCorp', when: 'Nov 2026', days: '5 days', tag: 'campus' },
  hyderabad: { short: 'Rise to Level Up', place: 'Hyderabad', when: '', days: '2 days', tag: 'lions' },
  kadaba: { short: 'Speech Spark Junior', place: 'Panja, Kadaba', when: 'May 2025', days: '2 days', tag: 'kids' },
  mangalore: { short: 'Presentation Skills for Kids', place: 'Mangalore', when: 'Apr 2025', days: '2 days', tag: 'kids' },
  alvas: { short: 'Pre-Recruitment Programme', place: 'Alva’s, Moodbidri', when: '', days: '2 days', tag: 'campus' },
  atmashakthi: { short: 'Managerial Enrichment', place: 'Padil, Mangaluru', when: '', days: '2 days', tag: 'coop' },
  bootcamp: { short: 'Confidence Bootcamp for Kids', place: 'Mangalore', when: '', days: '2 days', tag: 'kids' },
  madikeri: { short: 'Step Up — Lions Workshop', place: 'Madikeri', when: '', days: '', tag: 'lions' },
  women: { short: 'Mic Magic', place: 'Mangalore', when: '', days: '2 days', tag: 'women' },
  'madikeri-ps': { short: 'Presentation Skills Intensive', place: 'Madikeri', when: '', days: '1 day', tag: 'lions' },
}

export const EVENT_TAGS = [
  ['all', 'All stories'],
  ['campus', 'Campus & corporate'],
  ['kids', 'Kids'],
  ['lions', 'Lions & JCI'],
  ['women', 'Women'],
  ['coop', 'Co-operatives'],
]

export const coverOf = (slug, fallback) => (PICKS[slug] ? `/img/${PICKS[slug][0][0]}.jpg` : fallback)
