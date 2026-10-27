# Armand · personal homebase

Personal Cloudflare Worker site for an X bio link — **Night (B)** design lock (2026-10-27). Calm, fast, near-black with muted cyan (`#8ec4ce`).

## Stack

- Static HTML/CSS in `public/`
- Minimal Worker (`src/index.ts`) serves assets via Wrangler `[assets]`

## Local dev

```bash
npm install
npm run dev
```

Opens on port **43123** by default (`wrangler dev --port 43123`).

## Deploy

Infra wires production deploy. When ready:

```bash
npm run deploy
```

Suggested Worker name in `wrangler.toml`: `personal`.

## Design source

- `public/b.css` — Night terminal tokens and layout
- Locked hero: `💡 Builds & ships · Grok.bot + Cursor + Cloudflare Workers`
