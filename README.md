# Armand · personal page

Personal Cloudflare Worker site for the link in an X bio — **Marginalia** design (2026-10-31).
Cream paper, serif display, grotesque margin labels. One static page, no JavaScript.

## Stack

- Static HTML/CSS in `public/` (`index.html`, `b.css`, self-hosted fonts in `public/fonts/`)
- Minimal Worker (`src/index.ts`) serves assets through Wrangler `[assets]`
- No bindings, no database, no secrets — content lives in the page itself

## Content

Edit `public/index.html` directly: intro copy, the "Now" line, project rows, and the quoted
X posts (each links to its real status URL). Anything changed there ships on the next upload.

## Local dev

```bash
npm install
npm run dev
```

Opens on port **43123** by default (`wrangler dev --port 43123`).

## Deploy

Preview version (gives a versioned preview URL, no production deploy):

```bash
npx wrangler versions upload --tag marginalia --message "Marginalia preview"
```

Production deploy is handled outside this repo/agent.

## Notes

- `public/_headers` sets security headers and font caching.
- `public/.assetsignore` keeps the legacy `public/admin/` mock out of the served site; those
  files are still in the repo pending a separate decision.
- `favicon.svg`, `og-image.png`, `robots.txt`, and `sitemap.xml` are hand-maintained.
- The share card is generated, not hand-drawn: edit `tools/og/og-image.html` and re-render it to
  `public/og-image.png` (command in the file's header comment). `tools/` is outside `public/`, so
  the source is never served.
- Canonical host is `https://a4ds5t.soholocal.nl/`; the custom domain is attached outside this repo.

