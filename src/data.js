// ============================================================================
// PAPERVIEW PRODUCTIONS — CONTENT / DATA FILE
// ----------------------------------------------------------------------------
// Everything you'll want to swap later (images, video, names, copy) lives here.
// Replace the placeholder URLs with your own assets:
//   - Drop real images/video into the /public folder and reference them like
//     "/my-photo.jpg" (a file at public/my-photo.jpg), OR paste a hosted URL.
//   - Update names, tags, and copy in plain text below.
// The rest of the site reads from this file, so you rarely need to touch JSX.
// ============================================================================

// --- Asset path helper ---------------------------------------------------------
// Local assets are written as absolute paths ('/hero.jpg'). This resolves them
// against Vite's base URL so the site works at a GitHub Pages subpath AND at
// the custom domain root. Remote URLs (Unsplash, Behold, etc.) pass through.
export const asset = (p) =>
  /^https?:\/\//.test(p) ? p : import.meta.env.BASE_URL + p.replace(/^\//, '')

// --- Business info -----------------------------------------------------------
export const BUSINESS = {
  name: 'Paperview Productions',
  tagline: 'Digital Media & Content Production',
  location: 'Haverhill, MA',
  email: 'conor.hews@gmail.com',
  phone: '(978) 918-6755',
  instagram: 'https://instagram.com/Paperviewproductions',
  bookingCalendar: '#contact', // e.g. a Calendly URL later
}

// --- Hero --------------------------------------------------------------------
// Static hero background photo. Set `video` to an mp4 path later if you ever
// want a looping reel instead (the photo then acts as its poster/still).
export const HERO = {
  video: null,
  image: '/hero.jpg', // optimized ~2000px wide
  imageMobile: '/hero-mobile.jpg', // optimized ~1080px wide for phones
}

// --- Credibility ticker (marquee of names/logos) -----------------------------
// These scroll across the screen as a trust signal. Swap for real client logos
// later (drop image files in /public and use the Portfolio 'logos' pattern).
export const CREDIBILITY = [
  'Jon Jones',
  'Gordon Ryan',
  'John Danaher',
  'Rob Font',
  'Calvin Kattar',
  'Dirty Boxing Championship',
  'Combat Zone MMA',
]

// --- Services ----------------------------------------------------------------
// type: 'retainer' (ongoing) or 'shoot' (one-off) — drives the badge label.
export const SERVICES = [
  {
    id: 'social',
    title: 'Social Media Management',
    type: 'retainer',
    blurb:
      'Done-for-you posting, community engagement, and growth. I run the day-to-day so your feed looks alive and on-brand — the same work we did for Dirty Boxing Championship 6 and Combat Zone MMA.',
    icon: 'social',
  },
  {
    id: 'digital-media',
    title: 'Digital Media',
    type: 'both',
    blurb:
      'Video production and full-range photography under one roof — promos, brand films, event coverage, walkouts, and scroll-stopping short-form, plus commercial, product, and action stills, professional headshots for owners and teams, and warm family & portrait sessions. Shot and edited to make the everyday look like a main event, as an ongoing content pipeline or a one-off shoot.',
    icon: 'video',
  },
  {
    id: 'strategy',
    title: 'Content Strategy',
    type: 'retainer',
    blurb:
      'The game plan behind the posts: what to make, when to drop it, and why. Positioning, content calendars, and a system your business can actually keep up with.',
    icon: 'strategy',
  },
]

// --- Who I work with ---------------------------------------------------------
export const AUDIENCES = [
  {
    id: 'gyms',
    title: 'Gyms & Combat Sports',
    copy:
      'MMA, BJJ, boxing, and strength gyms. Fight promos, event coverage, athlete media, and social that fills classes and sells tickets.',
    tag: 'Retainer + Event',
  },
  {
    id: 'trades',
    title: 'Trades & Local Business',
    copy:
      'Contractors, service businesses, and local shops. Show the craft, build trust, and win the customer before they ever call — with content that looks the part.',
    tag: 'Retainer + Project',
  },
  {
    id: 'people',
    title: 'Families & Individuals',
    copy:
      'Headshots, portraits, and family sessions. No contract, no runaround — just a clean, easy booking for the photos you actually want.',
    tag: 'One-off Shoots',
  },
]

// --- Portfolio / work --------------------------------------------------------
// category is used for the filter chips. Swap image + title + client later.
export const PORTFOLIO = [
  {
    id: 1,
    title: 'Fight Night Recap Reel',
    client: 'Combat Sports',
    category: 'Video',
    image: '/portfolio/fight-night-recap.jpg', // poster still
    video: true,
    videoSrc: '/portfolio/fight-night-recap.mp4', // plays inline on click
  },
  {
    id: 2,
    title: 'Event Social Coverage',
    client: 'Dirty Boxing Championship 6',
    category: 'Social',
    image: '/portfolio/dbx6-event-coverage.jpg',
  },
  {
    id: 3,
    title: 'Athlete Portrait Series',
    client: 'Pro Athlete',
    category: 'Photography',
    image: '/galleries/athlete/mike-perry.jpg', // cover thumbnail for the tile
    imagePosition: '72% center', // keep Mike (right of frame) in the cropped tile
    // Clicking this tile opens a dedicated gallery page (see GALLERIES below).
    gallery: 'athlete-portraits',
  },
  {
    id: 4,
    title: 'Blue Collar Content',
    client: 'G&C Softwash',
    category: 'Photography',
    image: '/portfolio/blue-collar-content.jpg',
  },
  {
    id: 5,
    title: 'Owner & Team Headshots',
    client: 'Rebel Electric',
    category: 'Headshots',
    image: '/portfolio/rebel-electric-headshot.jpg',
  },
  {
    id: 7,
    title: 'Family Session',
    client: 'Private Client',
    category: 'Photography',
    image: '/portfolio/family-session.jpg',
  },
]

export const PORTFOLIO_FILTERS = ['All', 'Video', 'Photography', 'Social', 'Headshots']

// --- Galleries (dedicated portfolio pages) -----------------------------------
// A portfolio tile with a `gallery` key opens one of these as a full-screen,
// Instagram-feed-style page (its own URL: #gallery/<key>).
//
// TO ADD CONTENT: drop files in `public/galleries/<key>/` and add entries to
// `items` below. Each item is either:
//   { type: 'image', src: '/galleries/athlete/01.jpg', caption: 'Optional text' }
//   { type: 'video', src: '/galleries/athlete/clip.mp4', poster: '/galleries/athlete/clip.jpg', caption: '...' }
// Leave `items` empty to show the built-in "coming soon" placeholder state.
export const GALLERIES = {
  'athlete-portraits': {
    title: 'Athlete Portrait Series',
    intro:
      'Portraits of fighters, coaches, and competitors — shot on location and in studio. A growing collection of the athletes we work with.',
    items: [
      { type: 'image', src: '/galleries/athlete/jon-jones.jpg', caption: 'Jon Jones — UFC LHW/HW Champion' },
      { type: 'image', src: '/galleries/athlete/conor-mcgregor.jpg', caption: 'Conor McGregor — UFC FW/LW Champion' },
      { type: 'image', src: '/galleries/athlete/mike-perry.jpg', caption: 'Mike Perry — BKFC King of Violence Champion' },
      { type: 'image', src: '/galleries/athlete/calvin-kattar.jpg', caption: 'Calvin Kattar — UFC Featherweight' },
      { type: 'image', src: '/galleries/athlete/dillon-danis.jpg', caption: 'Dillon Danis — Misfits MMA Welterweight Champion' },
      { type: 'image', src: '/galleries/athlete/rob-font.jpg', caption: 'Rob Font — UFC Bantamweight' },
    ],
  },
}

// --- About -------------------------------------------------------------------
export const ABOUT = {
  headshot: '/about-founder.jpg',
  paragraphs: [
    "I'm the founder of Paperview Productions — a digital media and content company based in the Haverhill, MA area. I build content and run social media for businesses that want to look as serious as they actually are: combat sports gyms, contractors and trades, local shops, and the people who run them.",
    "I'm also a fighter. I've trained and competed, and I've handled media for elite-level athletes — names like Jon Jones, Gordon Ryan, John Danaher, Rob Font, and Calvin Kattar — plus running social for Dirty Boxing Championship 6 and Calvin Kattar's Combat Zone MMA. When athletes at that level trust you with their image, you learn how to make anyone look their best under pressure.",
    "That's what you get here: the eye and polish of a real media company, backed by the grit, discipline, and follow-through you'd expect from someone who trains. Whether you're filling classes, booking jobs, or just need photos that don't look like everyone else's — the standard is the same.",
  ],
  stats: [
    { value: '200+', label: 'Athletes served' },
    { value: '2', label: 'MMA promotions run' },
    { value: '100%', label: 'Show-up-and-deliver' },
  ],
}

// --- Testimonials ------------------------------------------------------------
// type: 'video' (mp4 in /public) or 'text' (written quote).
// Add more entries here as they come in — video ones render as players,
// text ones as quote cards.
export const TESTIMONIALS = [
  {
    id: 'jon-jones',
    type: 'video',
    video: '/jon-jones-shoutout.mp4',
    poster: '/posters/jon-jones.jpg',
    name: 'Jon Jones',
    role: 'UFC Champion · MMA GOAT',
    caption:
      'A shout-out from Jon Jones — UFC champion and the fighter many consider the greatest of all time.',
    featured: true,
  },
  {
    id: 'rob-font',
    type: 'video',
    video: '/rob-font-testimonial.mp4',
    poster: '/posters/rob-font.jpg',
    name: 'Rob Font',
    role: 'UFC Bantamweight · Former Top 5',
    caption: 'Rob Font on the consistent content we create together.',
  },
  {
    id: 'kyle-bochniak',
    type: 'video',
    video: '/kyle-bochniak-testimonial.mp4',
    poster: '/posters/kyle-bochniak.jpg',
    name: 'Kyle Bochniak',
    role: 'UFC Veteran · Featherweight',
    caption:
      'Kyle Bochniak on his experience working with Paperview Productions.',
  },
  // Example of how to add a written testimonial later:
  // {
  //   id: 'example',
  //   type: 'text',
  //   quote: 'They made our gym look world-class. Bookings jumped within weeks.',
  //   name: 'Client Name',
  //   role: 'Owner, Example Gym',
  // },
]

// --- Instagram feed (Combat Zone MMA) ----------------------------------------
// The site can't pull Instagram posts directly (Instagram blocks that from a
// static site). To make this feed auto-update when @combatzonemma posts, paste
// the embed snippet from a feed widget provider (Behold, SnapWidget, EmbedSocial,
// etc.) into `embedHtml` as a template string. Until then, the on-brand fallback
// grid shows with a "Follow" call-to-action. See notes at the bottom of this file.
export const INSTAGRAM = {
  handle: 'combatzonemma',
  url: 'https://www.instagram.com/combatzonemma/',
  // Behold feed ID (the part after "feeds.behold.so/"). Powers the live
  // @behold/react widget in the Portfolio section. The grid's look — columns,
  // gaps, hover, corners — is configured in your Behold dashboard.
  beholdFeedId: '0NKalbGJj6VLb3oefGN0',
}

// --- Contact form delivery ---------------------------------------------------
// Inquiries email to you automatically via Web3Forms (free, unlimited, no account).
// SETUP (2 minutes):
//   1. Go to https://web3forms.com
//   2. Enter your email (conor.hews@gmail.com) → they email you an "access key"
//   3. Paste that key below.
// Until a key is set, the form shows a success message but does NOT send email.
export const CONTACT_FORM = {
  web3formsKey: '245e6ec5-3dd2-4db7-847d-31c0a436d41a',
}

// --- Contact -----------------------------------------------------------------
export const INQUIRY_TYPES = [
  'Social Media Management (ongoing)',
  'Content Strategy',
  'Video Production',
  'Photography',
  'Professional Headshots',
  'Family / Portrait Session',
  'Not sure yet — let’s talk',
]
