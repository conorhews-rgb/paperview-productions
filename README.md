# Paperview Productions

The website at [paperviewproductions.com](https://paperviewproductions.com).

Plain HTML, CSS and JavaScript. There is no build step: every push to `main` is published by the workflow in `.github/workflows/deploy.yml`.

## Where things live

- `index.html` is the page and most of the copy.
- `js/site.js` holds the content data: the camera modes, services, industries and proof videos.
- `js/more.js` holds the result slider numbers and the wall of work.
- `js/fx.js` is the 3D camera and page motion.
- `css/` has the styles: `site.css` (layout), `fx.css` (camera and motion), `more.css` (later sections).
- `assets/` has the photos, clips and logos.

When you change a CSS or JS file, bump the `?v=` number on its link in `index.html` so returning visitors get the new file.

## Preview locally

```bash
python3 -m http.server 5177
```

Then open http://localhost:5177.

## The previous site

The earlier React version of the site is kept on the `old-site` branch.
