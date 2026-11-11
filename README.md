# hartrussell.com

Hugo site built by Netlify on every push to `main`.

- Content: `content/` (blog posts under `content/blog/`, page bundles otherwise)
- Layouts: `layouts/` — no theme, hand-written templates
- Photos: drop image files into `assets/photos/`; `layouts/photo-album/single.html`
  resizes each one to webp and builds the grid automatically
- Build settings: `netlify.toml` (Hugo 0.163.3, publish `public/`)

## CV

`resume.tex` is the source of truth for the CV; `static/assets/cv.pdf` is a build
product and is served at `/assets/cv.pdf`.

```
edit resume.tex  ->  GitHub Actions (.github/workflows/render-cv.yml) compiles it
                 ->  bot commits static/assets/cv.pdf
                 ->  Netlify deploys that commit
```

`netlify.toml` has an `ignore` command that skips builds for pushes touching only
`resume.tex` or `.github/`, so the site never deploys a commit with a stale PDF.
Never edit `static/assets/cv.pdf` by hand — it is overwritten on the next render.
