// Airport + metro reference data. Coordinates are used for great-circle
// distance (award charts and cash-fare estimates key off distance) and the
// region drives which carriers plausibly serve a route in demo mode.
//
// Regions: na (US/Canada), car (Mexico/Caribbean/Central America),
// sa (South America), eu (Europe), me (Middle East), af (Africa),
// nas (North Asia: Japan/Korea/China/Taiwan/HK), sea (Southeast Asia),
// sas (South Asia), oc (Oceania).

// [code, city, country, lat, lon, region]
const RAW = [
  // North America
  ['BOS', 'Boston', 'US', 42.364, -71.005, 'na'],
  ['JFK', 'New York', 'US', 40.641, -73.778, 'na'],
  ['EWR', 'Newark', 'US', 40.690, -74.174, 'na'],
  ['LGA', 'New York', 'US', 40.777, -73.872, 'na'],
  ['IAD', 'Washington', 'US', 38.953, -77.456, 'na'],
  ['DCA', 'Washington', 'US', 38.851, -77.040, 'na'],
  ['PHL', 'Philadelphia', 'US', 39.874, -75.242, 'na'],
  ['ATL', 'Atlanta', 'US', 33.640, -84.427, 'na'],
  ['MIA', 'Miami', 'US', 25.795, -80.287, 'na'],
  ['FLL', 'Fort Lauderdale', 'US', 26.072, -80.153, 'na'],
  ['MCO', 'Orlando', 'US', 28.431, -81.308, 'na'],
  ['CLT', 'Charlotte', 'US', 35.214, -80.947, 'na'],
  ['ORD', 'Chicago', 'US', 41.974, -87.907, 'na'],
  ['DTW', 'Detroit', 'US', 42.216, -83.355, 'na'],
  ['MSP', 'Minneapolis', 'US', 44.885, -93.222, 'na'],
  ['DFW', 'Dallas', 'US', 32.900, -97.040, 'na'],
  ['IAH', 'Houston', 'US', 29.990, -95.337, 'na'],
  ['DEN', 'Denver', 'US', 39.856, -104.674, 'na'],
  ['PHX', 'Phoenix', 'US', 33.437, -112.008, 'na'],
  ['LAS', 'Las Vegas', 'US', 36.084, -115.154, 'na'],
  ['LAX', 'Los Angeles', 'US', 33.942, -118.408, 'na'],
  ['SFO', 'San Francisco', 'US', 37.622, -122.379, 'na'],
  ['SEA', 'Seattle', 'US', 47.450, -122.309, 'na'],
  ['SAN', 'San Diego', 'US', 32.734, -117.190, 'na'],
  ['HNL', 'Honolulu', 'US', 21.319, -157.922, 'na'],
  ['YYZ', 'Toronto', 'CA', 43.677, -79.625, 'na'],
  ['YUL', 'Montreal', 'CA', 45.470, -73.741, 'na'],
  ['YVR', 'Vancouver', 'CA', 49.195, -123.184, 'na'],
  // Mexico / Caribbean / Central America
  ['MEX', 'Mexico City', 'MX', 19.436, -99.072, 'car'],
  ['CUN', 'Cancun', 'MX', 21.037, -86.877, 'car'],
  ['PTY', 'Panama City', 'PA', 9.071, -79.383, 'car'],
  ['SJO', 'San Jose', 'CR', 9.994, -84.209, 'car'],
  ['SJU', 'San Juan', 'PR', 18.439, -66.002, 'car'],
  // South America
  ['GRU', 'Sao Paulo', 'BR', -23.432, -46.469, 'sa'],
  ['GIG', 'Rio de Janeiro', 'BR', -22.810, -43.251, 'sa'],
  ['EZE', 'Buenos Aires', 'AR', -34.822, -58.536, 'sa'],
  ['SCL', 'Santiago', 'CL', -33.393, -70.786, 'sa'],
  ['LIM', 'Lima', 'PE', -12.022, -77.114, 'sa'],
  ['BOG', 'Bogota', 'CO', 4.702, -74.147, 'sa'],
  // Europe
  ['LHR', 'London', 'GB', 51.470, -0.454, 'eu'],
  ['LGW', 'London', 'GB', 51.153, -0.182, 'eu'],
  ['DUB', 'Dublin', 'IE', 53.421, -6.270, 'eu'],
  ['CDG', 'Paris', 'FR', 49.010, 2.548, 'eu'],
  ['AMS', 'Amsterdam', 'NL', 52.310, 4.768, 'eu'],
  ['FRA', 'Frankfurt', 'DE', 50.037, 8.562, 'eu'],
  ['MUC', 'Munich', 'DE', 48.354, 11.786, 'eu'],
  ['ZRH', 'Zurich', 'CH', 47.458, 8.556, 'eu'],
  ['VIE', 'Vienna', 'AT', 48.110, 16.570, 'eu'],
  ['FCO', 'Rome', 'IT', 41.800, 12.239, 'eu'],
  ['MXP', 'Milan', 'IT', 45.630, 8.723, 'eu'],
  ['MAD', 'Madrid', 'ES', 40.472, -3.561, 'eu'],
  ['BCN', 'Barcelona', 'ES', 41.297, 2.078, 'eu'],
  ['LIS', 'Lisbon', 'PT', 38.774, -9.134, 'eu'],
  ['CPH', 'Copenhagen', 'DK', 55.618, 12.656, 'eu'],
  ['ARN', 'Stockholm', 'SE', 59.652, 17.919, 'eu'],
  ['HEL', 'Helsinki', 'FI', 60.317, 24.963, 'eu'],
  ['ATH', 'Athens', 'GR', 37.936, 23.947, 'eu'],
  ['IST', 'Istanbul', 'TR', 41.262, 28.742, 'eu'],
  // Middle East
  ['DXB', 'Dubai', 'AE', 25.253, 55.365, 'me'],
  ['AUH', 'Abu Dhabi', 'AE', 24.433, 54.651, 'me'],
  ['DOH', 'Doha', 'QA', 25.273, 51.608, 'me'],
  ['TLV', 'Tel Aviv', 'IL', 32.011, 34.887, 'me'],
  // Africa
  ['JNB', 'Johannesburg', 'ZA', -26.139, 28.246, 'af'],
  ['CPT', 'Cape Town', 'ZA', -33.970, 18.597, 'af'],
  ['CAI', 'Cairo', 'EG', 30.122, 31.406, 'af'],
  ['ADD', 'Addis Ababa', 'ET', 8.978, 38.799, 'af'],
  ['NBO', 'Nairobi', 'KE', -1.319, 36.928, 'af'],
  ['CMN', 'Casablanca', 'MA', 33.368, -7.590, 'af'],
  // North Asia
  ['NRT', 'Tokyo', 'JP', 35.772, 140.393, 'nas'],
  ['HND', 'Tokyo', 'JP', 35.549, 139.780, 'nas'],
  ['KIX', 'Osaka', 'JP', 34.434, 135.244, 'nas'],
  ['ICN', 'Seoul', 'KR', 37.460, 126.441, 'nas'],
  ['PEK', 'Beijing', 'CN', 40.080, 116.585, 'nas'],
  ['PVG', 'Shanghai', 'CN', 31.144, 121.808, 'nas'],
  ['HKG', 'Hong Kong', 'HK', 22.308, 113.918, 'nas'],
  ['TPE', 'Taipei', 'TW', 25.078, 121.233, 'nas'],
  // Southeast Asia
  ['SIN', 'Singapore', 'SG', 1.364, 103.991, 'sea'],
  ['BKK', 'Bangkok', 'TH', 13.690, 100.750, 'sea'],
  ['KUL', 'Kuala Lumpur', 'MY', 2.746, 101.710, 'sea'],
  ['MNL', 'Manila', 'PH', 14.509, 121.020, 'sea'],
  ['SGN', 'Ho Chi Minh City', 'VN', 10.819, 106.652, 'sea'],
  ['DPS', 'Bali', 'ID', -8.748, 115.167, 'sea'],
  // South Asia
  ['DEL', 'Delhi', 'IN', 28.556, 77.100, 'sas'],
  ['BOM', 'Mumbai', 'IN', 19.090, 72.866, 'sas'],
  ['MLE', 'Male', 'MV', 4.192, 73.529, 'sas'],
  // Oceania
  ['SYD', 'Sydney', 'AU', -33.940, 151.175, 'oc'],
  ['MEL', 'Melbourne', 'AU', -37.669, 144.841, 'oc'],
  ['BNE', 'Brisbane', 'AU', -27.384, 153.117, 'oc'],
  ['AKL', 'Auckland', 'NZ', -37.008, 174.792, 'oc'],
  ['PPT', 'Papeete', 'PF', -17.554, -149.607, 'oc'],
]

export const AIRPORTS = Object.fromEntries(
  RAW.map(([code, city, country, lat, lon, region]) => [
    code,
    { code, city, country, lat, lon, region },
  ]),
)

// Multi-airport city codes, so "TYO" searches both Narita and Haneda.
export const METROS = {
  TYO: ['HND', 'NRT'],
  NYC: ['JFK', 'EWR', 'LGA'],
  WAS: ['IAD', 'DCA'],
  LON: ['LHR', 'LGW'],
  OSA: ['KIX'],
  SEL: ['ICN'],
  SHA: ['PVG'],
  BJS: ['PEK'],
  CHI: ['ORD'],
  PAR: ['CDG'],
  ROM: ['FCO'],
  MIL: ['MXP'],
  STO: ['ARN'],
  SAO: ['GRU'],
  BUE: ['EZE'],
  RIO: ['GIG'],
  YTO: ['YYZ'],
  YMQ: ['YUL'],
}

// Plain-English names people type ("tokyo", "new york") → code.
const CITY_ALIASES = {
  tokyo: 'TYO',
  'new york': 'NYC',
  nyc: 'NYC',
  washington: 'WAS',
  dc: 'WAS',
  london: 'LON',
  paris: 'PAR',
  seoul: 'SEL',
  shanghai: 'SHA',
  beijing: 'BJS',
  chicago: 'CHI',
  rome: 'ROM',
  milan: 'MIL',
  stockholm: 'STO',
  'sao paulo': 'SAO',
  'buenos aires': 'BUE',
  rio: 'RIO',
  toronto: 'YTO',
  montreal: 'YMQ',
  osaka: 'OSA',
}

/** Expand a user-entered code or city name into concrete airport codes. */
export function expandLocation(input) {
  if (!input) return []
  return input
    .split(/[,/]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((token) => {
      const upper = token.toUpperCase()
      if (METROS[upper]) return METROS[upper]
      if (AIRPORTS[upper]) return [upper]
      const lower = token.toLowerCase()
      if (CITY_ALIASES[lower]) return METROS[CITY_ALIASES[lower]]
      const byCity = Object.values(AIRPORTS).filter(
        (a) => a.city.toLowerCase() === lower,
      )
      if (byCity.length) return byCity.map((a) => a.code)
      // Unknown 3-letter codes pass through: the live provider may know them.
      return /^[A-Z]{3}$/.test(upper) ? [upper] : []
    })
    .filter((code, i, all) => all.indexOf(code) === i)
}

const toRad = (deg) => (deg * Math.PI) / 180

/** Great-circle distance in statute miles, or null if either airport is unknown. */
export function distanceMiles(a, b) {
  const A = AIRPORTS[a]
  const B = AIRPORTS[b]
  if (!A || !B) return null
  const R = 3958.8
  const dLat = toRad(B.lat - A.lat)
  const dLon = toRad(B.lon - A.lon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(A.lat)) * Math.cos(toRad(B.lat)) * Math.sin(dLon / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(h)))
}

export function airportLabel(code) {
  const a = AIRPORTS[code]
  return a ? `${a.city} (${code})` : code
}
