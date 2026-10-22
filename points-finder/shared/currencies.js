// Transferable credit card currencies and their airline transfer partners.
//
// `ratio` is airline miles received per 1 card point (5:4 → 0.8).
// Partner lists and ratios change a few times a year — the README says how to
// update them, and the UI tells people to confirm a transfer before making it
// (transfers are one-way and can't be undone).

export const TRANSFER_DATA_AS_OF = '2026-10'

const t = (to, ratio = 1, label) => ({
  to,
  ratio,
  label: label || (ratio === 1 ? '1:1' : `1:${ratio}`),
})

export const CURRENCIES = {
  amex: {
    id: 'amex',
    name: 'Amex Membership Rewards',
    short: 'Amex MR',
    cards: ['Platinum', 'Gold', 'Green', 'Business Platinum', 'Business Gold'],
    cpp: 1.6,
    increment: 1000,
    partners: [
      t('aerlingus'),
      t('aeromexico', 1.6, '1:1.6'),
      t('aeroplan'),
      t('ana'),
      t('lifemiles'),
      t('british'),
      t('cathay', 0.8, '5:4'),
      t('delta'),
      t('emirates', 0.8, '5:4'),
      t('etihad'),
      t('flyingblue'),
      t('iberia'),
      t('jetblue', 0.8, '5:4'),
      t('qantas'),
      t('qatar'),
      t('singapore'),
      t('virginatlantic'),
    ],
  },
  chase: {
    id: 'chase',
    name: 'Chase Ultimate Rewards',
    short: 'Chase UR',
    cards: ['Sapphire Reserve', 'Sapphire Preferred', 'Ink Business Preferred'],
    cpp: 1.7,
    increment: 1000,
    partners: [
      t('aerlingus'),
      t('aeroplan'),
      t('british'),
      t('emirates'),
      t('flyingblue'),
      t('iberia'),
      t('jetblue'),
      t('singapore'),
      t('southwest'),
      t('united'),
      t('virginatlantic'),
    ],
  },
  capitalone: {
    id: 'capitalone',
    name: 'Capital One Miles',
    short: 'Capital One',
    cards: ['Venture X', 'Venture', 'Spark Miles'],
    cpp: 1.6,
    increment: 1000,
    partners: [
      t('aeromexico'),
      t('aeroplan'),
      t('lifemiles'),
      t('british'),
      t('cathay'),
      t('emirates'),
      t('etihad'),
      t('eva', 0.75, '4:3'),
      t('finnair'),
      t('flyingblue'),
      t('jal', 0.75, '4:3'),
      t('jetblue', 0.6, '5:3'),
      t('qantas'),
      t('singapore'),
      t('tap'),
      t('turkish'),
      t('virginatlantic'),
    ],
  },
  citi: {
    id: 'citi',
    name: 'Citi ThankYou Points',
    short: 'Citi TY',
    cards: ['Strata Elite', 'Strata Premier'],
    cpp: 1.5,
    increment: 1000,
    partners: [
      t('aeromexico'),
      t('american'),
      t('lifemiles'),
      t('cathay'),
      t('emirates', 0.8, '5:4'),
      t('etihad'),
      t('eva'),
      t('flyingblue'),
      t('jetblue'),
      t('qantas'),
      t('qatar'),
      t('singapore'),
      t('thai'),
      t('turkish'),
      t('virginatlantic'),
    ],
  },
  bilt: {
    id: 'bilt',
    name: 'Bilt Rewards',
    short: 'Bilt',
    cards: ['Bilt Mastercard'],
    cpp: 1.7,
    increment: 1000,
    partners: [
      t('aerlingus'),
      t('aeroplan'),
      t('alaska'),
      t('lifemiles'),
      t('british'),
      t('cathay'),
      t('emirates'),
      t('flyingblue'),
      t('iberia'),
      t('qatar'),
      t('southwest'),
      t('tap'),
      t('turkish'),
      t('united'),
      t('virginatlantic'),
    ],
  },
}

/** All card currencies that can transfer into `programId`, with ratios. */
export function transferSourcesFor(programId) {
  return Object.values(CURRENCIES).flatMap((c) =>
    c.partners
      .filter((p) => p.to === programId)
      .map((p) => ({ currency: c, ratio: p.ratio, label: p.label })),
  )
}
