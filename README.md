# Armand · personal page

A single Marginalia page served from a Cloudflare Worker — the destination linked from an X bio.
Cream paper, serif display type, small grotesque margin labels, one narrow column.
**Zero page JavaScript.** Locale detection and cookie persist live in the Worker.
Live at **https://a4ds5t.soholocal.nl/** (canonical English path: `/en/`).

## Locales

Path segments are language-only (short codes). Content voice is unchanged.

| Locale | Path | Notes |
| --- | --- | --- |
| `en` | `/en/` | English — fallback for unmatched browsers |
| `nl` | `/nl/` | Dutch (Netherlands voice); primary translation from English |
| `es` | `/es/` | Spanish (Latin America voice), not Spain |
| `zh` | `/zh/` | Simplified Mandarin; CJK glyphs use system fonts |

Legacy regional paths redirect permanently:

| Old | New |
| --- | --- |
| `/nl-NL/` | `/nl/` |
| `/es-419/` | `/es/` |
| `/zh-Hans/` | `/zh/` |

### Detection and persist

On `/` the Worker resolves a locale, then `302`s to `/{locale}/`:

1. `?lang=` query (manual switch from the top-right links) → that locale, and **Set-Cookie** `locale`
   (accepts short codes and legacy aliases `nl-NL` / `es-419` / `zh-Hans`)
2. else valid `locale` cookie (short or legacy)
3. else first matching `Accept-Language` tag: `zh*`→`zh`, `es*`→`es`, `nl*`→`nl`, `en*`→`en`
4. else **`en`** (fallback — matches the live English default)

Cookie is written **only** after a manual switch (`?lang=`), not on Accept-Language detect.
No `localStorage`, no inline scripts — CSP stays `script-src 'self' https://static.cloudflareinsights.com`.

## Layout

```
public/
  en/ nl/ es/ zh/   one index.html per locale
  b.css           styles and @font-face rules (+ CJK system fallbacks)
  fonts/          self-hosted woff2 (Newsreader roman + italic, Inter latin)
  _headers        security headers, font and CSS caching
  og-image.png    share card (1200×630)
  favicon.svg
  robots.txt
  sitemap.xml     all four locale URLs + hreflang alternates
src/index.ts      Worker — `/` locale redirect; legacy regional → short; else ASSETS
tools/og/         source for the share card; not served
wrangler.toml     Worker name, assets, run_worker_first for `/` + legacy paths
```

## Editing content

Edit the matching `public/{locale}/index.html`. Project names (`Almost Christmas`, `StartPage`)
and handles stay as-is across locales. Section banners still help when swapping volatile bands.

Copy that also appears on the share card (`tools/og/og-image.html`) is duplicated by hand;
change both if you change the English headline used on the card.

## Local dev

```bash
npm install
npm run dev      # wrangler dev --port 43123
```

Then open http://localhost:43123/ (redirects by Accept-Language / cookie).
`npm run check` runs `tsc --noEmit` over `src/`.

## Deploy

```bash
npx wrangler deploy
```

Pushes a new Worker version to production. Preview without touching production:

```bash
npx wrangler versions upload
```

## Custom domain

`a4ds5t.soholocal.nl` is a custom domain on the Worker, attached outside this repo. Absolute
URLs appear in each locale HTML (`canonical`, `og:url`, image tags), `sitemap.xml`, and
`person.jsonld`; change all of it together if the domain ever moves.

## Share card

`public/og-image.png` is generated from `tools/og/og-image.html` — edit the HTML and re-render
(the exact Chrome command is in that file's header comment). It uses the same woff2 files as the
page, so the card cannot drift from the site's type.
