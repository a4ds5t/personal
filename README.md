# Armand · personal page

A single static page served from a Cloudflare Worker — the destination linked from an X bio.
**Marginalia**: cream paper, serif display type, small grotesque margin labels, one narrow column.
No JavaScript, no bindings, no database. Live at **https://a4ds5t.soholocal.nl/**.

## Layout

```
public/
  index.html      the whole page — all content lives here
  b.css           styles and @font-face rules
  fonts/          self-hosted woff2 (Newsreader roman + italic, Inter)
  _headers        security headers, font and CSS caching
  og-image.png    share card (1200×630)
  favicon.svg
  robots.txt
  sitemap.xml
src/index.ts      Worker entry — hands every request to the static assets
tools/og/         source for the share card; not served
wrangler.toml     Worker name, compatibility date, [assets] config
```

## Editing content

Everything visitors read is in `public/index.html`: the intro paragraphs, the "Now" line, the
numbered project rows, and the quoted X posts. Each post links to its real status URL. Edit and
commit — there is no build step.

Sections are separated by comment banners. If you add or swap a volatile band (the "Now" line, the
X posts), bracket it so the next edit is obvious:

```html
<!-- FROM X: start -->
<section class="row" aria-labelledby="posts"> … </section>
<!-- FROM X: end -->
```

Copy that also appears on the share card (`tools/og/og-image.html`, the `<h1>` and the subtitle) is
duplicated by hand; change both if you change the headline.

## Local dev

```bash
npm install
npm run dev      # wrangler dev --port 43123
```

Then open http://localhost:43123/. `npm run check` runs `tsc --noEmit` over `src/`.

## Deploy

```bash
npx wrangler deploy
```

Pushes a new Worker version to production. To check what would ship without deploying:

```bash
npx wrangler deploy --dry-run
```

## Custom domain

`a4ds5t.soholocal.nl` is a custom domain on the Worker, attached outside this repo. The host appears
as an absolute URL in `index.html` (`canonical`, `og:url`, the two image tags) and in `sitemap.xml`;
change all of it together if the domain ever moves.

## Share card

`public/og-image.png` is generated from `tools/og/og-image.html` — edit the HTML and re-render
(the exact Chrome command is in that file's header comment). It uses the same woff2 files as the
page, so the card cannot drift from the site's type.
