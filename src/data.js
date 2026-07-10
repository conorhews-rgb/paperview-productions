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
    id: 'video',
    title: 'Video Production',
    type: 'both',
    blurb:
      'Promos, brand films, event coverage, walkouts, testimonials, and short-form vertical content built to stop the scroll. Full shoot-to-edit or a standing content pipeline.',
    icon: 'video',
  },
  {
    id: 'photo',
    title: 'Photography',
    type: 'both',
    blurb:
      'Commercial, event, product, and action photography. On-site at your gym, job site, or shop — images that make the everyday look like a main event.',
    icon: 'photo',
  },
  {
    id: 'strategy',
    title: 'Content Strategy',
    type: 'retainer',
    blurb:
      'The game plan behind the posts: what to make, when to drop it, and why. Positioning, content calendars, and a system your business can actually keep up with.',
    icon: 'strategy',
  },
  {
    id: 'headshots',
    title: 'Professional Headshots',
    type: 'shoot',
    blurb:
      'Sharp, confident headshots for owners, teams, coaches, and pros. Studio or on-location — you look like the person people want to hire.',
    icon: 'headshots',
  },
  {
    id: 'portrait',
    title: 'Family & Portrait Photography',
    type: 'shoot',
    blurb:
      'Portrait and family sessions with the same eye for detail and lighting. Real moments, made to last — booked as simple one-off shoots.',
    icon: 'portrait',
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
    image:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1974&auto=format&fit=crop',
    // Clicking this tile opens a dedicated gallery page (see GALLERIES below).
    gallery: 'athlete-portraits',
  },
  {
    id: 4,
    title: 'On-Site Job Feature',
    client: 'Local Contractor',
    category: 'Video',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
    video: true,
  },
  {
    id: 5,
    title: 'Owner & Team Headshots',
    client: 'Rebel Electric',
    category: 'Headshots',
    image: '/portfolio/rebel-electric-headshot.jpg',
  },
  {
    id: 6,
    title: 'Combat Zone MMA Feed',
    client: 'Combat Zone MMA',
    category: 'Social',
    image:
      'https://images.unsplash.com/photo-1615117972428-28de67cda58e?q=80&w=1974&auto=format&fit=crop',
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
    { value: '5+', label: 'Elite athletes served' },
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
