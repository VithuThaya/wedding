# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Digital wedding RSVP invitation website — single-page, mobile-first, static HTML/CSS/JS (no framework, no build step, no backend). Guests open an animated envelope, read the invitation, browse a photo gallery, and RSVP via a form that posts to Google Sheets through a hidden Google Form submission.

Two lightweight motion libraries are loaded via CDN (still no build, page stays static):
- **Lenis** (`lenis@1.1.13`) — smooth scrolling
- **GSAP + ScrollTrigger** (`gsap@3.12.5`) — scroll-driven parallax & hero motion

Both degrade gracefully: if the CDN is unavailable or `prefers-reduced-motion` is set, the site falls back to CSS `IntersectionObserver` reveals + native scrolling.

**Couple:** Vithu & Saru · **Reception:** 29. Mai 2027, ab 16:00 · **Venue:** Saalbau Kirchberg.
**Language:** All guest-facing content is in **German** (`<html lang="de">`), informal **„Du"** address throughout.

## How to Run

Open `index.html` directly in any browser — no build step, no server required. (Needs internet for the Google Fonts + Lenis/GSAP CDNs; without it, motion degrades but the page still works.)

## Git Workflow

**After every change, commit and push to GitHub.** Once a task is complete and verified, stage all changes, write a concise descriptive commit message, and push to `origin/main` — no need to ask each time (standing authorization from the repo owner).

```bash
git add -A && git commit -m "<what changed>" && git push
```

Remote: `origin` → `github.com/VithuThaya/wedding.git` · default branch: `main`.

## File Structure

```
Wedding-1/
├── index.html              # all sections and markup
├── css/
│   ├── style.css           # layout, typography, design tokens, all section styles
│   └── animations.css      # envelope open, falling petals, scroll reveals, hero entrance
├── js/
│   ├── main.js             # envelope, music, Lenis+GSAP init, parallax, sticky nav, gallery lightbox, petals, reveals, RSVP form
│   └── countdown.js        # live countdown timer (days/hours/minutes/seconds, updates every second)
├── images/
│   ├── placeholder/
│   │   ├── couple.jpg      # hero background — landscape, min 1920×1080px
│   │   └── venue.jpg       # location card photo — landscape, ~1400×600px or larger
│   └── gallery/            # gallery photos 1.jpg…6.jpg (optional — tiles fall back to placeholder/* if missing)
│       └── README.txt      # drop-file hint + sizing guidance
├── video/
│   ├── wedding-highlight.mp4  # silent looping hero background video, max 60s, 1080p H.264
│   └── README.txt          # drop-file hint
├── audio/
│   ├── wedding-music.mp3   # background music, starts on envelope open, 128–192kbps MP3
│   └── README.txt          # drop-file hint
└── ref/                    # reference screenshots (do not delete)
```

> `video/` and `audio/` files are optional — if missing, the hero falls back to `couple.jpg` and the music player simply doesn't appear.

## Design Direction

Reference style: [unsereeinladung.de TikTok](https://www.tiktok.com/@unsereeinladung/video/7650917755788545313)
Style keywords: **Editorial luxury, soft blush, cinematic, elegant, lots of whitespace, feminine, flowing motion** (the "Soft UI Evolution" direction — see the ui-ux-pro-max design system).

### What this means in practice
- Consistent soft blush background throughout — no alternating ivory/cream sections
- Gold only as a subtle accent — fine champagne hairlines (`--gold-grad`) for dividers & eyebrow underlines, never heavy ornaments
- Diagonal section dividers removed — flat, clean transitions instead
- Glassmorphism only where intentional — frosted countdown pills, frosted sticky nav, lightbox backdrop
- Pill-shaped buttons and timeline chips (fully rounded)
- Generous whitespace — sections breathe, nothing feels cramped
- Couple names set in the **Great Vibes** script (hero + footer) for the classic, high-end invitation feel

## Design Tokens (CSS variables in `style.css`)

| Variable | Value | Use |
|---|---|---|
| `--blush-bg` | `#FDF1F1` | Main page background |
| `--blush-soft` | `#FAE6E7` | Alternating section tint (`#location`, `#rsvp`) |
| `--blush-card` | `#F8E1E2` | Card / chip backgrounds |
| `--blush` | `#F0D2D6` | Borders, envelope body |
| `--blush-line` | `#ECCFD3` | Hairline dividers |
| `--rose` | `#BC5874` | Buttons, time-chips, active states |
| `--rose-dark` | `#973652` | Hover states |
| `--rose-muted` | `#D193A4` | Timeline lines, soft accents |
| `--sage` | `#6B7F6B` | Wax seal color |
| `--gold` | `#A67C36` | Richer gold accent |
| `--gold-soft` | `#C9A86A` | Champagne accent |
| `--gold-light` | `#E2CFA6` | Thin divider lines |
| `--gold-grad` | gradient | Fine champagne hairline for dividers / eyebrow underlines |
| `--text` | `#34232A` | Body text (deep plum) |
| `--text-soft` | `#574048` | Paragraph text |
| `--text-muted` | `#8C7178` | Secondary / placeholder text |
| `--nav-h` | `68px` | Sticky nav height (used for scroll offset in JS) |
| `--maxw` | `1180px` | Wide container (nav, gallery) |
| `--radius` / `--radius-lg` | `22px` / `28px` | Card / large radii |
| `--shadow-rose` | shadow | Rose-tinted shadow for primary CTAs |

**Fonts (Google Fonts CDN):**
- Display: `Cormorant Garamond` — weights 500/600/700, upright + italic
- Body: `DM Sans` — 300, 400, 500, 600, 700
- Script: `Great Vibes` — couple names only (`.hero-names`, `.footer-names`)

## Key Animation Details

- **Envelope:** 3D flap rotates `rotateX(-172deg)` over 1.5s. Sage-green wax seal (two interlocking hearts + "UNSERE EINLADUNG" text path). A `::after` shimmer sweep (`envShimmer`) draws the eye before opening. Music fades in on open.
- **Falling petals:** On envelope open AND on RSVP success. 18 petals, 6 keyframe paths. Self-remove via `animationend`.
- **Smooth scroll:** Lenis drives the whole page. `lenis.stop()` keeps it locked behind the envelope; `lenis.start()` is called when the envelope finishes opening (and while the lightbox is open). All `a[href^="#"]` links use offset-aware `lenis.scrollTo()` (accounts for `--nav-h`).
- **Hero entrance:** Text elements stagger in via `riseIn` (1s, `--ease`) after `#main-content` gets `.visible` (CSS only).
- **Ken Burns + parallax (GSAP):** When GSAP is present (desktop, motion allowed), `js/main.js` adds `.gsap-hero` to `<html>` — this **disables** the CSS `kenBurns` so GSAP solely owns the `.hero-bg` transform (avoids a CSS-animation vs inline-transform conflict). GSAP then does the slow zoom (`scale 1.08→1.2`, 22s) **and** scroll parallax (`yPercent 18`, scrubbed) on hero photo + video, plus a fade of `.hero-content` on scroll-away. Fallback without GSAP: lightweight rAF parallax (0.4x), CSS Ken Burns stays on.
- **Scroll reveal:** `.reveal` elements via `IntersectionObserver` → class `.visible` → opacity + translateY (0.9s, `--ease`). Delay helpers `.reveal-delay-1..4`. (Kept on `IntersectionObserver` even with GSAP — only smooth-scroll & parallax use GSAP.)
- **Sticky nav:** `#site-nav` is hidden until scrolled past ~62% of the hero, then `.nav-visible` + frosted `.nav-scrolled`. Active section highlighted via a second `IntersectionObserver`. Mobile: `.nav-toggle` burger opens `.nav-links.mobile-open` dropdown.
- **Gallery + lightbox:** `.gallery-item` tiles (asymmetric grid, hover zoom). Click/Enter opens `#lightbox`; supports prev/next buttons, ←/→ keys, Esc, backdrop click. Reads the tile `<img>` `currentSrc` (so the onerror placeholder fallback carries through).
- **Music player:** Floating round button bottom-right with animated equalizer bars (`musicBar`). Toggles play/pause; `.paused` freezes bars. Hidden until music starts.
- **Scroll cue:** Animated `.scroll-cue` pill at bottom of hero (`scrollCue` keyframe).
- **Section transitions:** No diagonal clip-path dividers — flat sections with alternating `--blush-bg` / `--blush-soft` backgrounds.

## Sections

Plus a **sticky nav** (`#site-nav`, outside `#main-content`) and a **lightbox** (`#lightbox`, after the footer) that overlay all sections.

1. **Envelope intro** — Blush envelope, sage wax seal, shimmer sweep, "tippen zum Öffnen". Music starts + petals fall on open
2. **Hero** — Full-bleed couple photo + optional video BG, vignette, `Wir heiraten` eyebrow with hairlines, names in Great Vibes script, intro line, frosted countdown (Tage/Stunden/Minuten/**Sekunden**), italic date, location, `Jetzt zusagen` CTA (with shimmer), scroll cue
3. **Unsere Geschichte** — Nicholas Sparks quote, single-column vertical timeline with rose dots + blush date chips
4. **Location & Anfahrt** — Venue photo in rounded white card, address, meta (SVG icons: date/time/dress code), `Route anzeigen` Maps link
5. **Galerie** — Asymmetric photo grid (`.gallery-item`, tall/wide variants) with hover zoom → opens lightbox. Images from `images/gallery/`, auto-fallback to placeholders
6. **Tagesablauf** — Rose pill time-chips (e.g. `13:30`) + vertical line, clean left-aligned layout
7. **RSVP** — `Bist du dabei?` heading, attendance toggles (SVG icons: Ja / Nein / Vielleicht) with colored icon chips, name/email/guest-stepper/dietary/song/message, frosted success state
8. **Footer** — Names (Great Vibes), date, SVG ornament, "Mit Liebe gemacht"

All icons are inline **SVG** (no emojis) — meta, attendance toggles, success state, footer ornament, gallery zoom, lightbox & nav controls.

## Music Integration

File: `audio/wedding-music.mp3` (constant `MUSIC_SRC` in `main.js`)

`startMusic()` is called on envelope open: creates an `Audio`, loops it, and fades volume 0→0.55 over 2s via `fadeAudio()`. The floating `#music-toggle` button is revealed once playback begins and toggles play/pause (with a short fade).

Browser autoplay policy: music only starts after user interaction (the envelope click counts — compliant). If `play()` is still blocked, the toggle appears in `.paused` state so the user can start it manually. Music does **not** start if `prefers-reduced-motion` is set.

## Video Integration

File: `video/wedding-highlight.mp4`

- Placed behind hero photo as `<video autoplay muted loop playsinline>`
- On mobile: video hidden, `couple.jpg` shown instead (performance)
- Overlay gradient ensures text remains readable

## Gallery Integration

Files: `images/gallery/1.jpg … 6.jpg` (see `images/gallery/README.txt`).

Each `.gallery-item` `<img>` uses an inline `onerror` handler that swaps to a placeholder (`couple.jpg` / `venue.jpg`) and adds `.is-placeholder` when the real file is missing — so the grid always looks populated and auto-upgrades when you drop real photos in. Add/remove `<figure class="gallery-item">` blocks (with `--tall` / `--wide` modifiers) to change count/layout. The lightbox auto-discovers all `.gallery-item` images at load.

## RSVP → Google Sheets Integration

The form posts to a hidden Google Form. Constants to replace in `js/main.js`:

```js
const GOOGLE_FORM_ACTION_URL = '...'; // your Google Form /formResponse URL
const ENTRY = {
  attendance: 'entry.XXXXXXXXX',
  name:       'entry.XXXXXXXXX',
  email:      'entry.XXXXXXXXX',
  guests:     'entry.XXXXXXXXX',
  dietary:    'entry.XXXXXXXXX',
  song:       'entry.XXXXXXXXX',
  message:    'entry.XXXXXXXXX',
};
```

Step-by-step instructions are in the `// TODO` comment block at the top of `main.js`.

## Content Placeholders

**Done** — couple names (Vithu & Saru), date (29. Mai 2027), reception time (ab 16:00), venue (Saalbau Kirchberg, Neuhofstrasse 33, 3422 Kirchberg), Maps link, RSVP deadline (Ende 2026), nav monogram (V & S), `WEDDING_DATE` in `countdown.js` (`2027-05-29T16:00:00`), and "Du" address throughout.

**Still to replace:**
- Story quote + 4 timeline entries (`#story`) — currently placeholder text (kept on purpose)
- Schedule times + descriptions (`#schedule`) — still the generic program; note it references a "Trauungszeremonie" though the event is a reception, so revisit when finalizing
- Gallery photos — drop `images/gallery/1.jpg…6.jpg`
- Google Form wiring (`GOOGLE_FORM_ACTION_URL` + `ENTRY` IDs in `js/main.js`) — still placeholder; not yet set up

## `prefers-reduced-motion`

All animations and transitions are disabled via `@media (prefers-reduced-motion: reduce)` in `animations.css`. Petals are also hidden (`display: none`). Music does not autoplay if reduced-motion is set.
