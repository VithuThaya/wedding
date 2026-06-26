# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Digital wedding RSVP invitation website — single-page, mobile-first, static HTML/CSS/JS (no framework, no build step, no backend). Guests open an animated envelope, read the invitation, browse a photo gallery, and RSVP via a form that posts JSON to Google Sheets through a Google Apps Script Web App.

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
Style keywords: **Editorial luxury, dramatic dark wine, cinematic, elegant, champagne accents, flowing motion**. The site flipped from the original soft-blush light theme to a **dramatic dark wine-red** palette (deep wine-black backgrounds, warm off-white text, champagne-gold hairlines, luminous-rose accents). Inspired by the "Red Wine / Dark Fire" palette.

### What this means in practice
- Deep wine-black background site-wide (`--blush-bg` = `#2E0D08`), alternating slightly-lifted wine tints for `#location` / `#rsvp`
- Cards are dark lifted panels (`--blush-card`), **not** white — warm off-white text inside
- Champagne gold (`--gold`) for fine hairlines (`--gold-grad`), dividers & eyebrow underlines, never heavy ornaments
- Luminous rose (`--rose`) for accent text, eyebrows, chips, outlines, timeline dots; deep wine (`--wine`) for **filled** buttons / time-chips with off-white labels
- Glassmorphism only where intentional — frosted countdown pills, dark frosted sticky nav, lightbox backdrop
- Pill-shaped buttons and timeline chips (fully rounded)
- Couple names set in the **Great Vibes** script (hero + footer); cover line also uses Great Vibes
- **Cover** (opening screen): a light greige→off-white gradient with an embossed tone-on-tone wax seal, a fine hanging thread, and a Great Vibes line — a calm light cover that opens into the dramatic dark site

> **Note on token names:** the `--blush-*` variable names are legacy (from the original light theme) but now hold **dark** wine values. Don't be misled by the names.

## Design Tokens (CSS variables in `style.css`)

> Token **names** are legacy (`--blush-*`) but hold **dark wine** values now.

| Variable | Value | Use |
|---|---|---|
| `--blush-bg` | `#2E0D08` | Main page background — deep wine-black |
| `--blush-soft` | `#3D120C` | Alternating section tint (`#location`, `#rsvp`) |
| `--blush-card` | `#4A1610` | Card / chip / input backgrounds (dark panels) |
| `--blush` | `#5E231C` | Subtle borders on dark panels |
| `--blush-line` | `rgba(231,210,162,.16)` | Hairline dividers (champagne, translucent) |
| `--wine` | `#7E1A18` | **Filled** buttons, time-chips, active fills |
| `--wine-bright` | `#9C2A24` | Fill hover |
| `--rose` | `#DE93A4` | Luminous rose accent — text, eyebrows, chips, outlines, dots |
| `--rose-dark` | `#C97184` | Deeper rose |
| `--rose-muted` | `#9F6171` | Timeline lines |
| `--sage` | `#6B7F6B` | (legacy, unused) |
| `--gold` | `#C9A86A` | Champagne accent |
| `--gold-soft` | `#D8BD86` | Champagne accent |
| `--gold-light` | `#E7D2A2` | Thin divider lines |
| `--gold-grad` | gradient | Fine champagne hairline for dividers / eyebrow underlines |
| `--text` | `#F4E7E2` | Body text (warm off-white) |
| `--text-soft` | `#DBC3BD` | Paragraph text |
| `--text-muted` | `#B6938C` | Secondary / placeholder text |
| `--nav-h` | `68px` | Sticky nav height (used for scroll offset in JS) |
| `--maxw` | `1180px` | Wide container (nav, gallery) |
| `--radius` / `--radius-lg` | `22px` / `28px` | Card / large radii |
| `--shadow-rose` | shadow | Rose-tinted shadow for primary CTAs |

**Fonts (Google Fonts CDN):**
- Display: `Cormorant Garamond` — weights 500/600/700, upright + italic
- Body: `DM Sans` — 300, 400, 500, 600, 700
- Script: `Great Vibes` — couple names + cover line (`.hero-names`, `.footer-names`, `.cover-script`)

## Key Animation Details

- **Cover (`.cover`, was `.envelope-wrap`):** Flat opening screen — light greige→off-white gradient (`#envelope-screen`), a centered **embossed tone-on-tone wax seal** (`.cover-seal`, CSS radial gradient + inset shadows; SVG `.seal-svg` = two interlocking hearts + "UNSERE EINLADUNG" text path, engraved via drop-shadow filter), a **fine hanging thread** (`.cover-seal::before`, ~46vh), and a Great Vibes line „Diese Einladung ist exklusiv für dich" (`.cover-script`) + tap hint (`.cover-hint`). Seal breathes (`sealBreath`) to invite the tap. On tap → `.cover.opening` fades/presses the seal, `#envelope-screen.closing` runs `screenFadeOut`, content reveals, music fades in. (No 3D flap anymore.)
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

1. **Cover intro** — Light greige→off-white gradient, embossed tone-on-tone wax seal, fine hanging thread, Great Vibes line „Diese Einladung ist exklusiv für dich", "tippen zum Öffnen". Music starts + petals fall on open
2. **Hero** — Full-bleed couple photo + optional video BG, vignette, `Wir heiraten` eyebrow with hairlines, names in Great Vibes script, intro line, frosted countdown (Tage/Stunden/Minuten/**Sekunden**), italic date, location, `Jetzt zusagen` CTA (with shimmer), scroll cue
3. **Unsere Geschichte** — Nicholas Sparks quote, single-column vertical timeline with rose dots + blush date chips
4. **Location & Anfahrt** — Venue photo in rounded white card, address, meta (SVG icons: date/time/dress code), `Route anzeigen` Maps link
5. **Galerie** — Asymmetric photo grid (`.gallery-item`, tall/wide variants) with hover zoom → opens lightbox. Images from `images/gallery/`, auto-fallback to placeholders
6. **Tagesablauf** — Rose pill time-chips (e.g. `13:30`) + vertical line, clean left-aligned layout
7. **RSVP** — `Bist du dabei?` heading, attendance toggles (SVG icons: Ja / Nein) with colored icon chips, name/guest-stepper/dietary/song/message. On submit → full-screen **Farewell** closing page (`#farewell-screen`). On reload, if this browser already submitted, the form is replaced by an inline „Schon erledigt!" notice (double-submit guard via `localStorage`)
8. **Farewell** (`#farewell-screen`, outside `#main-content`) — full-screen dark-wine closing takeover after a successful RSVP: gold heart ornament, names in Great Vibes, attendance-aware title/text (Zusage vs Absage), date & venue, „Zum Kalender hinzufügen" (.ics blob, only on Zusage), contact email for changes, falling petals (own `.farewell-petals` layer). Scroll-locked, stays until reload
9. **Footer** — Names (Great Vibes), date, SVG ornament, "Mit Liebe gemacht"

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

The form POSTs a **JSON body** to a **Google Apps Script Web App** (`doPost`), which appends a row to the Sheet. The script lives in `apps-script/Code.gs` (copy into the Sheet's Apps Script editor). Set one constant in `js/main.js`:

```js
const WEB_APP_URL = '...'; // the Web-App /exec URL from Bereitstellen → Web-App
```

JSON payload sent on submit:

```js
{ attendance: "Ja"|"Nein", name, guests, dietary, songRequest, message }
```

Sheet columns (written by `doPost` when the sheet is empty): `Zeitstempel, Name, Status (Zusage/Absage), Anzahl Gäste, Unverträglichkeiten / Allergien, Musikwunsch, Nachricht`. `attendance === "Ja"` → "Zusage", else "Absage".

Notes:
- Deploy the Web App with **Ausführen als: Ich** and **Zugriff: Jeder (anonym)**, else the request is blocked.
- The fetch uses `mode: 'no-cors'` + `Content-Type: text/plain` (Apps Script returns no CORS headers; text/plain avoids a preflight). We can't read the response, so success is shown optimistically — the row is still written.
- If the Sheet already has an older header row, clear it once so the new headers get created.
- The form has **no email field** and only **Ja/Nein** (no "Vielleicht").

## Content Placeholders

**Done** — couple names (Vithu & Saru), date (29. Mai 2027), reception time (ab 16:00), venue (Saalbau Kirchberg, Neuhofstrasse 33, 3422 Kirchberg), Maps link, RSVP deadline (Ende 2026), nav monogram (V & S), `WEDDING_DATE` in `countdown.js` (`2027-05-29T16:00:00`), and "Du" address throughout.

**Still to replace:**
- Story quote + 4 timeline entries (`#story`) — currently placeholder text (kept on purpose)
- Schedule times + descriptions (`#schedule`) — still the generic program; note it references a "Trauungszeremonie" though the event is a reception, so revisit when finalizing
- Gallery photos — drop `images/gallery/1.jpg…6.jpg`
- `WEB_APP_URL` in `js/main.js` — paste the deployed Apps Script Web-App `/exec` URL (code is in `apps-script/Code.gs`)

## `prefers-reduced-motion`

All animations and transitions are disabled via `@media (prefers-reduced-motion: reduce)` in `animations.css`. Petals are also hidden (`display: none`). Music does not autoplay if reduced-motion is set.
