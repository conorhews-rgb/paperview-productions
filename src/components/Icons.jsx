// Simple inline SVG icon set (stroke-based, inherits currentColor).
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export const Icon = {
  social: (p) => (
    <svg {...base} {...p}>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.7" x2="15.4" y2="6.3" /><line x1="8.6" y1="13.3" x2="15.4" y2="17.7" />
    </svg>
  ),
  video: (p) => (
    <svg {...base} {...p}>
      <rect x="2" y="5" width="14" height="14" rx="2" /><path d="M16 9l6-3v12l-6-3" />
    </svg>
  ),
  photo: (p) => (
    <svg {...base} {...p}>
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="12.5" r="3.2" />
    </svg>
  ),
  strategy: (p) => (
    <svg {...base} {...p}>
      <path d="M4 19V5" /><path d="M4 19h16" /><path d="M7 15l4-5 3 3 5-7" />
    </svg>
  ),
  headshots: (p) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="8" r="4" /><path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  ),
  portrait: (p) => (
    <svg {...base} {...p}>
      <circle cx="9" cy="8" r="3" /><circle cx="16" cy="9.5" r="2.4" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M14.5 19a4.5 4.5 0 0 1 6.5-4" />
    </svg>
  ),
  play: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 4l14 8-14 8z" /></svg>
  ),
  mail: (p) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
  ),
  phone: (p) => (
    <svg {...base} {...p}><path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
  ),
  pin: (p) => (
    <svg {...base} {...p}><path d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
  ),
  instagram: (p) => (
    <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
  ),
  check: (p) => (
    <svg {...base} strokeWidth="2.2" {...p}><path d="M5 13l4 4L19 7" /></svg>
  ),
}
