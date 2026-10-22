// Airline loyalty programs that sell award seats. Program ids match the
// seats.aero `Source` values where seats.aero covers the program, so live
// results map straight onto this table.
//
// `carriers` are the operating airlines a program can book (its alliance plus
// notable bilateral partners). Demo mode uses them to decide who flies what;
// live mode reports the real operating carriers.
// `priceFactor` scales the demo award price relative to a typical saver chart.
// `taxes` is the demo tax/surcharge profile: low ≈ $6–60, medium ≈ $60–200,
// high ≈ $200–700 one-way in premium cabins.

export const ALLIANCE_CARRIERS = {
  star: ['UA', 'AC', 'NH', 'BR', 'SQ', 'TG', 'LH', 'LX', 'OS', 'TP', 'TK', 'AI', 'ET', 'NZ', 'AV', 'CM'],
  oneworld: ['AA', 'AS', 'BA', 'IB', 'AY', 'JL', 'CX', 'QR', 'QF', 'MH'],
  skyteam: ['DL', 'AF', 'KL', 'VS', 'KE', 'CI', 'AM', 'VN', 'AR', 'KQ'],
}

export const CARRIERS = {
  UA: { name: 'United', hub: 'na' },
  AC: { name: 'Air Canada', hub: 'na' },
  NH: { name: 'ANA', hub: 'nas' },
  BR: { name: 'EVA Air', hub: 'nas' },
  SQ: { name: 'Singapore Airlines', hub: 'sea' },
  TG: { name: 'Thai Airways', hub: 'sea' },
  LH: { name: 'Lufthansa', hub: 'eu' },
  LX: { name: 'SWISS', hub: 'eu' },
  OS: { name: 'Austrian', hub: 'eu' },
  TP: { name: 'TAP Air Portugal', hub: 'eu' },
  TK: { name: 'Turkish Airlines', hub: 'eu', connector: true },
  AI: { name: 'Air India', hub: 'sas' },
  ET: { name: 'Ethiopian', hub: 'af' },
  NZ: { name: 'Air New Zealand', hub: 'oc' },
  AV: { name: 'Avianca', hub: 'sa' },
  CM: { name: 'Copa', hub: 'car' },
  AA: { name: 'American', hub: 'na' },
  AS: { name: 'Alaska', hub: 'na' },
  BA: { name: 'British Airways', hub: 'eu' },
  IB: { name: 'Iberia', hub: 'eu' },
  AY: { name: 'Finnair', hub: 'eu' },
  JL: { name: 'Japan Airlines', hub: 'nas' },
  CX: { name: 'Cathay Pacific', hub: 'nas' },
  QR: { name: 'Qatar Airways', hub: 'me', connector: true },
  QF: { name: 'Qantas', hub: 'oc' },
  MH: { name: 'Malaysia Airlines', hub: 'sea' },
  DL: { name: 'Delta', hub: 'na' },
  AF: { name: 'Air France', hub: 'eu' },
  KL: { name: 'KLM', hub: 'eu' },
  VS: { name: 'Virgin Atlantic', hub: 'eu' },
  KE: { name: 'Korean Air', hub: 'nas' },
  CI: { name: 'China Airlines', hub: 'nas' },
  AM: { name: 'Aeromexico', hub: 'car' },
  VN: { name: 'Vietnam Airlines', hub: 'sea' },
  AR: { name: 'Aerolineas Argentinas', hub: 'sa' },
  KQ: { name: 'Kenya Airways', hub: 'af' },
  EK: { name: 'Emirates', hub: 'me', connector: true },
  EY: { name: 'Etihad', hub: 'me', connector: true },
  B6: { name: 'JetBlue', hub: 'na' },
  WN: { name: 'Southwest', hub: 'na' },
  EI: { name: 'Aer Lingus', hub: 'eu' },
}

const P = (id, name, alliance, opts) => ({
  id,
  name,
  alliance,
  carriers: [...(ALLIANCE_CARRIERS[alliance] || []), ...(opts.extra || [])],
  dynamic: !!opts.dynamic,
  priceFactor: opts.factor ?? 1,
  taxes: opts.taxes || 'medium',
  bookingUrl: opts.url,
  // Rough value of one mile in this program, in cents, for "effective cost".
  cpp: opts.cpp ?? 1.3,
})

export const PROGRAMS = Object.fromEntries(
  [
    // Star Alliance
    P('aeroplan', 'Air Canada Aeroplan', 'star', { extra: ['EY'], factor: 1.0, taxes: 'medium', url: 'https://www.aircanada.com/aeroplan/redeem', cpp: 1.5 }),
    P('united', 'United MileagePlus', 'star', { extra: ['EI'], dynamic: true, factor: 1.15, taxes: 'low', url: 'https://www.united.com/en/us/book-flight/award-travel', cpp: 1.25 }),
    P('lifemiles', 'Avianca LifeMiles', 'star', { factor: 0.95, taxes: 'low', url: 'https://www.lifemiles.com/fly/find', cpp: 1.4 }),
    P('turkish', 'Turkish Miles&Smiles', 'star', { factor: 0.75, taxes: 'medium', url: 'https://www.turkishairlines.com/en-us/miles-and-smiles/', cpp: 1.3 }),
    P('singapore', 'Singapore KrisFlyer', 'star', { factor: 1.1, taxes: 'medium', url: 'https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/use-miles/redeem-flights/', cpp: 1.4 }),
    P('ana', 'ANA Mileage Club', 'star', { factor: 0.9, taxes: 'medium', url: 'https://www.ana.co.jp/en/us/amc/', cpp: 1.5 }),
    P('eva', 'EVA Infinity MileageLands', 'star', { factor: 1.05, taxes: 'medium', url: 'https://www.evaair.com/en-us/infinity-mileagelands/', cpp: 1.2 }),
    P('thai', 'Thai Royal Orchid Plus', 'star', { factor: 0.95, taxes: 'medium', url: 'https://www.thaiairways.com/en/royal-orchid-plus/', cpp: 1.1 }),
    P('tap', 'TAP Miles&Go', 'star', { factor: 0.9, taxes: 'medium', url: 'https://www.flytap.com/en-us/miles-and-go', cpp: 1.1 }),
    // oneworld
    P('american', 'American AAdvantage', 'oneworld', { dynamic: true, factor: 0.85, taxes: 'low', url: 'https://www.aa.com/booking/find-flights', cpp: 1.5 }),
    P('alaska', 'Alaska Atmos Rewards', 'oneworld', { factor: 0.85, taxes: 'low', url: 'https://www.alaskaair.com/search', cpp: 1.5 }),
    P('british', 'British Airways Club', 'oneworld', { factor: 1.05, taxes: 'high', url: 'https://www.britishairways.com/travel/redeem/execclub/', cpp: 1.4 }),
    P('iberia', 'Iberia Club', 'oneworld', { factor: 0.8, taxes: 'medium', url: 'https://www.iberia.com/us/iberia-plus/', cpp: 1.4 }),
    P('qatar', 'Qatar Privilege Club', 'oneworld', { factor: 0.95, taxes: 'high', url: 'https://www.qatarairways.com/en-us/Privilege-Club/redeem-avios.html', cpp: 1.4 }),
    P('cathay', 'Cathay Asia Miles', 'oneworld', { factor: 1.0, taxes: 'medium', url: 'https://www.cathaypacific.com/cx/en_US/membership/asia-miles.html', cpp: 1.3 }),
    P('qantas', 'Qantas Frequent Flyer', 'oneworld', { extra: ['EK'], factor: 1.05, taxes: 'high', url: 'https://www.qantas.com/us/en/frequent-flyer/use-points/classic-flight-rewards.html', cpp: 1.2 }),
    P('jal', 'JAL Mileage Bank', 'oneworld', { extra: ['EK'], factor: 0.95, taxes: 'medium', url: 'https://www.jal.co.jp/jp/en/jmb/', cpp: 1.4 }),
    P('aerlingus', 'Aer Lingus AerClub', 'oneworld', { extra: ['EI'], factor: 0.85, taxes: 'high', url: 'https://www.aerlingus.com/aerclub/', cpp: 1.3 }),
    P('finnair', 'Finnair Plus', 'oneworld', { factor: 0.95, taxes: 'medium', url: 'https://www.finnair.com/us-en/finnair-plus', cpp: 1.3 }),
    // SkyTeam
    P('delta', 'Delta SkyMiles', 'skyteam', { dynamic: true, factor: 1.6, taxes: 'low', url: 'https://www.delta.com/flight-search/book-a-flight', cpp: 1.1 }),
    P('flyingblue', 'Air France/KLM Flying Blue', 'skyteam', { dynamic: true, factor: 1.05, taxes: 'medium', url: 'https://wwws.airfrance.us/search/advanced?bookingFlow=REWARD', cpp: 1.3 }),
    P('virginatlantic', 'Virgin Atlantic Flying Club', 'skyteam', { extra: ['NH'], factor: 0.8, taxes: 'medium', url: 'https://www.virginatlantic.com/flying-club/spend-points/reward-flights', cpp: 1.4 }),
    P('aeromexico', 'Aeromexico Rewards', 'skyteam', { dynamic: true, factor: 1.3, taxes: 'medium', url: 'https://www.aeromexicorewards.com/', cpp: 0.8 }),
    // Independent
    P('emirates', 'Emirates Skywards', 'none', { extra: ['EK', 'QF'], dynamic: true, factor: 1.35, taxes: 'high', url: 'https://www.emirates.com/us/english/skywards/', cpp: 1.2 }),
    P('etihad', 'Etihad Guest', 'none', { extra: ['EY', 'AA', 'AF', 'KL'], factor: 0.9, taxes: 'medium', url: 'https://www.etihad.com/en-us/etihadguest', cpp: 1.3 }),
    P('jetblue', 'JetBlue TrueBlue', 'none', { extra: ['B6'], dynamic: true, factor: 1.4, taxes: 'low', url: 'https://www.jetblue.com/trueblue', cpp: 1.3 }),
    P('southwest', 'Southwest Rapid Rewards', 'none', { extra: ['WN'], dynamic: true, factor: 1.2, taxes: 'low', url: 'https://www.southwest.com/', cpp: 1.3 }),
  ].map((p) => [p.id, p]),
)

/** Look up a program, falling back to a stub for sources we don't model yet. */
export function getProgram(id) {
  return (
    PROGRAMS[id] || {
      id,
      name: id,
      alliance: 'none',
      carriers: [],
      dynamic: false,
      priceFactor: 1,
      taxes: 'medium',
      bookingUrl: null,
      cpp: 1.2,
    }
  )
}
