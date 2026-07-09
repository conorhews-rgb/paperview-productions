# Paperview Productions — Website

A single-page marketing site for Paperview Productions (digital media & content
production, Haverhill, MA). Built with **React + Vite**, fully mobile-responsive,
with a dark, gritty, fight-promo aesthetic.

## Run it locally

You'll need [Node.js](https://nodejs.org) 18+ installed. Then:

```bash
npm install      # first time only
npm run dev      # start the dev server → http://localhost:5173
```

Other commands:

```bash
npm run build    # production build into /dist
npm run preview  # preview the production build
```

## Where to swap in your real content

**Almost everything lives in one file: [`src/data.js`](src/data.js).**
You rarely need to touch the components. In there you can edit:

- **Business info** — email, phone, Instagram, location (`BUSINESS`)
- **Hero video/image** — `HERO.video` (mp4) and `HERO.image` (poster still)
- **Credibility ticker** — the scrolling names (`CREDIBILITY`)
- **Services** — titles, descriptions, and retainer vs. one-off badges (`SERVICES`)
- **Who I work with** — the three audience cards (`AUDIENCES`)
- **Portfolio** — project images, titles, clients, categories (`PORTFOLIO`)
- **About** — your headshot + story paragraphs + stats (`ABOUT`)
- **Contact form** — the service dropdown options (`INQUIRY_TYPES`)

### Swapping images & video

Placeholders currently point at stock URLs. To use your own files:

1. Drop them into the `public/` folder (e.g. `public/hero-reel.mp4`,
   `public/work-1.jpg`).
2. Reference them in `src/data.js` with a leading slash, e.g.
   `video: '/hero-reel.mp4'` or `image: '/work-1.jpg'`.

### Wiring up the contact form

The form currently logs submissions to the browser console and shows a success
message. To actually receive inquiries, connect it to a form service in
[`src/components/Contact.jsx`](src/components/Contact.jsx) (look for the `TODO`
in `handleSubmit`). Easiest options:

- **[Formspree](https://formspree.io)** — set the form `action` to your endpoint.
- **[Netlify Forms](https://docs.netlify.com/forms/setup/)** — if you deploy on Netlify.

## Structure

```
src/
  data.js              ← all editable content (start here)
  App.jsx              ← page assembly / section order
  index.css            ← all styling & the dark theme
  components/
    Nav.jsx  Hero.jsx  Marquee.jsx  Services.jsx  Audience.jsx
    Portfolio.jsx  (includes the live Behold Instagram feed)
    Testimonials.jsx  About.jsx  Contact.jsx  Footer.jsx  Icons.jsx
public/
  hero.jpg / hero-mobile.jpg        ← hero background
  logo/                             ← PPV logos (gold/black/white)
  posters/  *.mp4                   ← testimonial videos + poster stills
  portfolio/                        ← portfolio photos
```

## Deploy

**This repo auto-deploys to GitHub Pages.** Every push to `main` triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the
site and publishes `dist/` to Pages.

- **Live URL:** https://conorhews-rgb.github.io/paperview-productions/
- To publish a change: commit and `git push` — that's it. Watch the run under the
  repo's **Actions** tab.

The Vite `base` is set to `'./'` (relative) in [`vite.config.js`](vite.config.js),
and all local assets resolve through the `asset()` helper in
[`src/data.js`](src/data.js). This means the exact same build works both at the
Pages sub-path above **and** at a custom domain root — no rebuild needed when you
switch domains.

### Custom domain — pointing paperviewproductions.com at the site

The domain is registered at **Network Solutions**. When you're ready to go live on
it (~10 minutes, then wait for DNS/HTTPS to propagate):

1. **Network Solutions → DNS / Advanced DNS** for `paperviewproductions.com`:
   - Add **four A records** for the apex (`@`), one per IP:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Add a **CNAME** record: host `www` → value `conorhews-rgb.github.io`
2. **GitHub → repo Settings → Pages → Custom domain:** enter
   `paperviewproductions.com` and Save. (This commits a `CNAME` file to the repo.)
3. Once GitHub finishes the DNS check, tick **Enforce HTTPS**.

No code changes are required — the relative `base` handles the switch.

### Notes for hosting elsewhere

Any static host also works: run `npm run build` and upload `dist/`, or connect the
repo to **Netlify/Vercel** (framework preset: Vite). If you move to Netlify, its
Forms feature can capture the contact form (see below).

## Still to wire up

- **Contact form** — currently shows a success message but doesn't send anywhere.
  Since GitHub Pages is static-only, connect it to **[Formspree](https://formspree.io)**
  (set the form `action` in [`src/components/Contact.jsx`](src/components/Contact.jsx))
  to receive inquiries at conor.hews@gmail.com.
- **Combat Zone Instagram feed** — powered live by Behold; its styling (grid gaps,
  corners, hover) is tuned in the Behold dashboard.
