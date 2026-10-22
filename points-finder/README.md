# Points Finder

A local, self-hosted take on [PointsGPT](https://pointsgpt.app/): search a route
(say **Boston → Tokyo in business**) across a date window, check every award seat
against every airline program, and price each one in **the credit card points
you actually hold**.

For each award it shows:

- **Whether you can book it now**, plus the exact transfers to make. It pools
  several cards into one airline if needed, and uses miles you already hold in
  that airline first.
- **How short you are** if your balances don't cover it.
- **Every way to pay**: Amex MR, Chase UR, Capital One, Citi TY and Bilt, each
  with its transfer ratio and the points needed, rounded up to the
  1,000-point transfer increment.
- **Value per point** against the cash fare (estimated from distance, or enter
  the real fare), and taxes & fees converted to USD.
- Highlights (best you can book now, fewest points, best value, lowest fees), a
  calendar strip with the cheapest award each day, and filters (only my
  points, can afford now, nonstop, max fees, program).

You can also type a plain-English search, e.g. *"Boston to Tokyo business first
week of December for 2"*.

## Run it

Needs Node 18+.

```bash
cd points-finder
npm install
npm run dev          # → http://localhost:5173 (UI + API in one process)
```

Production-style:

```bash
npm run build && npm start     # → http://localhost:4173
```

From the terminal:

```bash
npm run search -- BOS TYO 2026-12-01 2026-12-07 --amex 150000 --chase 60000 --miles alaska=40000 --pax 2
npm run search -- JFK LON 2026-11-10 --cabin first --citi 200000 --affordable --sort value
```

CLI flags: `--cabin`, `--pax`, `--sort points|cost|value|taxes|date`,
`--amex/--chase/--capitalone/--citi/--bilt N`, `--miles program=N`,
`--cash USD`, `--direct`, `--affordable`, `--mine`, `--top N`, `--demo`.

## Live data vs. demo data

Without configuration the app runs on **simulated demo data**: realistic in
shape, deterministic, and clearly labeled, but **not real availability**.

For real award space it uses the [seats.aero](https://seats.aero) Partner API,
which caches award availability from about 25 airline programs. That's the same
kind of data source tools like PointsGPT are built on.

1. Get a seats.aero Pro subscription and generate a key at https://seats.aero/apikey
   (1,000 API calls/day, personal use).
2. `cp .env.example .env` and set `SEATS_AERO_API_KEY=...`
3. Restart. The badge turns to **Live · seats.aero**, and each result gets a
   **Details** button with flight numbers, times and aircraft.

Searches are cached in memory for 10 minutes to save API calls. Scoring
against your wallet happens in the browser, so editing balances re-ranks
instantly without a new search.

## How it's built

```
shared/            pure logic, used by the server, the CLI and the browser
  airports.js      airports, metro codes (TYO, NYC, LON…), distances
  programs.js      airline programs, alliances, carriers, booking links
  currencies.js    card currencies → transfer partners + ratios
  optimizer.js     funding plans, transfer paths, ranking, highlights
  valuation.js     cash-fare estimate, cents-per-point, value tiers
  parseQuery.js    plain-English trip parser
server/
  api.js           /api/meta, /api/search, /api/trips/:id (connect middleware)
  providers/       seatsAero.js (live) and demo.js (simulated)
  index.js         production server (serves dist/ + API)
src/               React UI
cli.js             terminal search
test/              node:test suites (`npm test`)
```

### Keeping transfer partners current

Banks add and drop partners and change ratios a few times a year. Everything
lives in `shared/currencies.js` (`ratio` is airline miles per card point, so
5:4 → `0.8`). Update `TRANSFER_DATA_AS_OF` when you change it. Point values
used for "lowest total cost" are the `cpp` fields in `currencies.js` and
`programs.js`. Set them to your own valuations.

## Caveats

- **Transfers are one-way and usually irreversible.** Always confirm the seat on
  the airline's site before moving points.
- Cash fares are distance-based estimates unless you type the real one. Treat
  ¢/pt as a guide.
- seats.aero data is cached and can be hours old. Saver space disappears fast.
- Not affiliated with PointsGPT, seats.aero, any airline or any bank.
