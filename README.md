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
    Nav.jsx  Hero.jsx  Marquee.jsx  Services.jsx
    Audience.jsx  Portfolio.jsx  About.jsx  Contact.jsx  Footer.jsx
    Icons.jsx
public/
  favicon.svg
```

## Deploy

Any static host works. Run `npm run build`, then upload the `dist/` folder — or
connect the repo to **Vercel** or **Netlify** (framework preset: Vite) for
push-to-deploy.
