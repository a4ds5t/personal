# Personal site (X-bio homebase) — SPECS · ronde 1

**Status: LOCKED** — Armand 2026-10-27 (Europe/Amsterdam) · widget: *Night vastleggen*  
**Canonical direction: B — Night terminal only**  
**Build source of truth:** `b.css` + `preview-b-desk.png` / `preview-b-phone.png` (+ `shot-b-*.html`)

## Scope
- **This lock:** homepage visual only (IA + Night look + hero copy).
- **Code / deploy:** separate go via PM → Codebouwer — **preview first**, same Worker (no separate `*-preview` Worker).
- No live data binding required for the visual lock.

## Purpose
Personal Cloudflare Worker site as X-bio destination (instead of GitHub profile).  
Tone: personal, calm, fast — not an agency or product landing.

## Locked hero (exact)
> 💡 Builds & ships · Grok.bot + Cursor + Cloudflare Workers

Name: **Armand**. English primary for body; short NL section labels OK (`Nu bezig`, `Van X`, `Elders`).

## Hard constraints
- Own visual language — **never** mix Almost colors / Fraunces / marigold / ofrenda look
- Do **not** mention Almost on the site (stil-lock)
- Calm muted cyan — **not** neon / cyberpunk

## IA — home sections (order)
1. **Hero** — name + locked tagline + short lede  
2. **Nu bezig** — one active card  
3. **Shipped** — 3 items  
4. **Van X** — 3–6 curated posts (mock: 4)  
5. **Elders** — secondary X + GitHub links  

Topbar: mark `Armand` · mono uppercase nav (desk) · pill `CLOUDFLARE WORKER`.  
Phone: nav hidden; same stack.

## Direction B — Night terminal *(LOCKED — build this)*

### Tokens (from `b.css`)
| Token | Value |
|-------|-------|
| `--bg` | `#080a0d` |
| `--elev` | `#11151b` |
| `--elev-2` | `#181d26` |
| `--ink` | `#f0f2f5` |
| `--ink-soft` | `#a8b0bc` |
| `--ink-mute` | `#6e7685` |
| `--line` | `#2a313c` |
| `--line-strong` | `#3a4352` |
| `--accent` | `#8ec4ce` (muted cyan/silver) |
| `--accent-dim` | `rgba(142,196,206,0.10)` |
| `--accent-line` | `rgba(142,196,206,0.45)` |
| `--radius` | `8px` |

### Type
- Display / name: **Instrument Serif**
- Meta / labels / nav / chips / Elders links: **IBM Plex Mono** (nav + section labels uppercase)
- Body UI: **IBM Plex Sans**

### Layout / chrome (build cues)
- Page: near-black base + subtle cyan linear/radial wash + fine noise overlay (opacity ~0.035, overlay)
- Hero: **2px accent left rule**; kicker mono uppercase accent; large Instrument Serif name; mono tagline (locked line); soft lede
- Cards: `--elev` fill, `--line` border, inset top highlight; Nu bezig uses `--line-strong`
- Section labels: mono uppercase accent + trailing hairline (`::after`)
- Shipped: square accent dots with soft accent-dim ring
- Van X: 2×2 elev-2 cards; first card top accent bar
- Elders row: full-width; mono secondary note + bordered link buttons (arrows in accent)
- Desk mock viewport: **1440×900** · Phone: **402×874**

### Reference shots
- `/workspace/personal-site-mockups/ronde1-home/preview-b-desk.png`
- `/workspace/personal-site-mockups/ronde1-home/preview-b-phone.png`

## Direction A — Quiet ink *(ARCHIVED / rejected for now)*
- Still felt dull vs Night after polish; **do not redesign further**; **not for build**.
- Files kept for archive only: `a.css`, `shot-a-*.html`, `preview-a-*.png`.

## Out of scope until separate go
Implementation, Worker deploy, Notion edits by design, other projects.
