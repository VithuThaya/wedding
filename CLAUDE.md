# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Digital wedding RSVP invitation website — single-page, mobile-first, static HTML/CSS/JS (no framework, no build step, no backend). Guests open an animated envelope, read the invitation, browse a photo gallery, and RSVP via a form that posts JSON to Google Sheets through a Google Apps Script Web App.

Two lightweight motion libraries are loaded via CDN (still no build, page stays static):
- **Lenis** (`lenis@1.1.13`) — smooth scrolling
- **GSAP + ScrollTrigger** (`gsap@3.12.5`) — scroll-driven parallax & hero motion

Both degrade gracefully: if the CDN is unavailable or `prefers-reduced-motion` is set, the site falls back to CSS `IntersectionObserver` reveals + native scrolling.

**Couple:** Vithu & Saru · **Reception (this site + RSVP):** 29. Mai 2027, ab 16:00 · **Venue:** Saalbau Kirchberg.
**Traditional Hindu wedding** (separate physical invitation, *not* this site's RSVP): 16. Mai 2027 · Kulturverein Murugan Bern, Gürbestrasse 9, 3125 Toffen — shown as an info-only `#ceremony` block.
**Language:** All guest-facing content is in **German** (`<html lang="de">`), informal **„Du"** address throughout.

## How to Run

Open `index.html` directly in any browser — no build step, no server required. (Needs internet for the Google Fonts + Lenis/GSAP CDNs; without it, motion degrades but the page still works.)

## Git Workflow

**After every change, do all three of these — every time, without being asked (standing authorization from the repo owner):**

1. **Commit & push to GitHub** — stage all changes, write a concise descriptive commit message, push to `origin/main`.
2. **Update this `CLAUDE.md`** — reflect what changed (relevant section + the "Known Issues / Next Session" note + cache-bust version) so the docs never go stale.
3. **Update the memory** at `~/.claude/projects/-Users-vithuthaya-Project-wedding/memory/` — so the next session doesn't have to redo or rediscover anything.

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
- **Cover** (opening screen): a creme wax-sealed **envelope** on a light greige gradient — the triangular flap flips open on tap and the wax seal lifts away, revealing the dark interior that bridges into the dramatic dark site

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

- **Cover (`.cover`) — wax-sealed envelope (redesigned 2026-07-03, session 6):** Inside `#envelope-screen` (light greige gradient) a centred creme paper **envelope** (`.envelope`, `min(92vw,440px) × min(82vh,620px)`, `perspective:1300px`) built from stacked layers: `.env-interior` (dark wine inside, revealed on open), `.env-front` (creme pocket, `clip-path` covers everything **except** the top-centre triangle so the interior only shows once the flap lifts), `.env-flap` (top downward-triangle `clip-path:polygon(0 0,100% 0,50% 100%)`, `transform-origin:center top`, `backface-visibility:hidden`), the wax-seal image `.cover-seal` (`images/siegel.png`, transparent PNG centred at the flap tip via `top:52%;left:50%;translate(-50%,-50%)`, `width:min(40%,168px)`), and the Great Vibes line `.cover-script` printed on the front. Flap + front share a delicate tone-on-tone botanical **SVG data-URI print** (diagonal leafy vine). Seal breathes (`sealBreath`, keeps the centring translate). **On tap** (`openEnvelope()`) → `.cover.opening`: the flap 3D-flips up (`rotateX(-168deg)`), the seal lifts away (`translateY(-46vh) rotate(-8deg) scale(.86)` + fade), `.cover-script`/`.cover-hint` fade; petals at 500ms; `#envelope-screen.closing` runs `screenFadeOut` at **1150ms**; content reveals + scroll unlocks + music + hero video at **2000ms**. No hanging thread, no `.seal-svg`, no `.cover-seal-img` anymore.
- **Falling petals:** On envelope open AND on RSVP success. 18 petals, 6 keyframe paths. Self-remove via `animationend`.
- **Smooth scroll:** Lenis drives the whole page. `lenis.stop()` keeps it locked behind the envelope; `lenis.start()` is called when the envelope finishes opening (and while the lightbox is open). All `a[href^="#"]` links use offset-aware `lenis.scrollTo()` (accounts for `--nav-h`).
- **Hero entrance:** Text elements stagger in via `riseIn` (1s, `--ease`) after `#main-content` gets `.visible` (CSS only).
- **Ken Burns + parallax (GSAP):** When GSAP is present (desktop, motion allowed), `js/main.js` adds `.gsap-hero` to `<html>` — this **disables** the CSS `kenBurns` so GSAP solely owns the `.hero-bg` transform (avoids a CSS-animation vs inline-transform conflict). GSAP then does the slow zoom (`scale 1.08→1.2`, 22s) **and** scroll parallax (`yPercent 18`, scrubbed) on hero photo + video, plus a fade of `.hero-content` on scroll-away. Fallback without GSAP: lightweight rAF parallax (0.4x), CSS Ken Burns stays on.
- **Scroll reveal:** `.reveal` elements via `IntersectionObserver` → class `.visible` → opacity + translateY (0.9s, `--ease`). Delay helpers `.reveal-delay-1..4`. (Kept on `IntersectionObserver` even with GSAP — only smooth-scroll & parallax use GSAP.)
- **Sticky nav:** `#site-nav` is hidden until scrolled past ~62% of the hero, then `.nav-visible` + frosted `.nav-scrolled`. Active section highlighted via a second `IntersectionObserver`. Mobile: `.nav-toggle` burger opens `.nav-links.mobile-open` dropdown.
- **Gallery + lightbox:** `.gallery-item` tiles (CSS-columns masonry, see Gallery Integration), hover zoom. Click/Enter opens `#lightbox`; supports prev/next buttons, ←/→ keys, Esc, backdrop click. Reads the tile `<img>` `currentSrc` (so the onerror placeholder fallback carries through).
- **Music player:** Floating round button bottom-right with animated equalizer bars (`musicBar`). Toggles play/pause; `.paused` freezes bars. Hidden until music starts.
- **Section transitions:** No diagonal clip-path dividers — flat sections with alternating `--blush-bg` / `--blush-soft` backgrounds.

> The old animated scroll-cue pill at the bottom of the hero was removed (didn't look good) — `.scroll-cue` markup, CSS and the `scrollCue` keyframe are all gone.

## Sections

Plus a **sticky nav** (`#site-nav`, outside `#main-content`) and a **lightbox** (`#lightbox`, after the footer) that overlay all sections.

1. **Cover intro** — Creme wax-sealed **envelope** on a light greige gradient: triangular flap held shut by the V&S wax seal, Great Vibes line „Diese Einladung ist exklusiv für dich" on the front, „tippen zum Öffnen". On tap: flap flips open + seal lifts away → dark interior → music starts + petals fall + hero video begins playing
2. **Hero** — Full-bleed couple photo + optional video BG (starts on cover open, not autoplay), vignette, `Wir heiraten` eyebrow with hairlines, names in Great Vibes script, intro line, frosted countdown (Tage/Stunden/Minuten/**Sekunden**, counts to the **Reception** 29.05.2027), italic date, location, a `.hero-note` clarifying **„Diese Einladung gilt für die Reception (Afterparty)"**, `Jetzt zusagen` CTA (with shimmer)
3. **Unsere Geschichte** — Nicholas Sparks quote, single-column vertical timeline with rose dots + blush date chips
4. **Location & Anfahrt** (`#location`) — Reception venue (Saalbau Kirchberg) shown via the **interactive animated expand-map** (`.location-card--interactive`; the old Google-Maps iframe was **removed**). Collapsed = small map tile + hint; one tap expands the illustrated map **and** reveals the details (badge „Reception · Afterparty", address, meta SVG icons date/time/dress code, `Route anzeigen` Maps link) together. See "Expand-Map = the interactive Location card" below
5. **Traditionelle Hochzeit** (`#ceremony`) — dedicated compact block for the traditional Hindu ceremony (**16.05.2027**, Kulturverein Murugan Bern, Gürbestrasse 9, 3125 Toffen). Now also an **interactive animated expand-map** (`.location-card--compact.location-card--interactive`, `#expand-map-ceremony` → `#ceremony-details`): collapsed map tile + hint, one tap expands the illustrated map **and** reveals the details (badge „Traditionelle Zeremonie", address, 16.05.2027, `Route anzeigen` Maps link) together — same mechanic as the Reception card (see "Expand-Map = the interactive venue cards"). Note: a **separate physical invitation** is sent by post; the digital RSVP is **only** for the Reception
6. **Galerie** — **infinite auto-scroll marquee** (`.gallery-marquee`/`.gallery-track`, edge-fade mask) of the 6 photos looped seamlessly; pauses on hover so a tile click opens the lightbox. Images from `images/gallery/`. See "Gallery Integration"
7. **Tagesablauf** — Rose pill time-chips (e.g. `13:30`) + vertical line, clean left-aligned layout
8. **RSVP** — `Bist du dabei?` heading + a `.rsvp-note` clarifying the reply is **only for the Reception (29.05.2027)**, attendance toggles (SVG icons: Ja / Nein) with colored icon chips, name/guest-stepper/dietary/song/message. On submit → full-screen **Farewell** closing page (`#farewell-screen`). On reload, if this browser already submitted, the form is replaced by an inline „Schon erledigt!" notice (double-submit guard via `localStorage`)
9. **Farewell** (`#farewell-screen`, outside `#main-content`) — full-screen dark-wine closing takeover after a successful RSVP: gold heart ornament, names in Great Vibes, attendance-aware title/text (Zusage vs Absage), date & venue, „Zum Kalender hinzufügen" (.ics blob, only on Zusage), contact email for changes, falling petals (own `.farewell-petals` layer). Scroll-locked, stays until reload
10. **Footer** — Names (Great Vibes), date, SVG ornament, "Mit Liebe gemacht"

All icons are inline **SVG** (no emojis) — meta, attendance toggles, success state, footer ornament, gallery zoom, lightbox & nav controls.

## Music Integration

File: `audio/wedding-music.mp3` (constant `MUSIC_SRC` in `main.js`)

`startMusic()` is called on envelope open: creates an `Audio`, loops it, and fades volume 0→0.55 over 2s via `fadeAudio()`. The floating `#music-toggle` button is revealed once playback begins and toggles play/pause (with a short fade).

Browser autoplay policy: music only starts after user interaction (the envelope click counts — compliant). If `play()` is still blocked, the toggle appears in `.paused` state so the user can start it manually. Music does **not** start if `prefers-reduced-motion` is set.

## Video Integration

File: `video/wedding-highlight.mp4` (committed, **~5.8 MB**, H.264, vertical 1090×1920 source → scaled to **1080px height** (614×1080), **compressed** with ffmpeg, CRF 27).

- **⚠️ Mobile "video didn't show" (2026-07-03):** at **15.8 MB** the clip loaded too slowly over mobile data — `openEnvelope()` calls `heroVid.play()` immediately on the seal tap, so if the video isn't buffered yet nothing paints and (since `couple.jpg` poster was deleted) you just see the wine-gradient `.hero-bg` fallback. Fix: **recompressed to ~5.8 MB** (CRF 24→27, height 1440→1080). Note the live site is a **project page under `/wedding/`** (`https://vithuthaya.github.io/wedding/…`) — test asset URLs against that base, not the domain root, or you'll get a misleading 404.
- **⚠️ Deploy lesson (2026-07-02):** an uncompressed **68 MB** clip made the **GitHub Pages deploy time out** (`##[error]Timeout reached, aborting!` — the publish step hangs in `deployment_queued` past the ~10-min limit), so the site silently stayed on the previous commit and the video didn't load. **Keep the video small** (single-digit MB is ideal). Recompress any new clip before committing:
  `ffmpeg -i in.mp4 -vf "scale=-2:1080" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 27 -preset slow -an -movflags +faststart out.mp4` (strip audio `-an` — the hero video is silent; `+faststart` lets it start before fully downloaded).
- The `<source>` in `index.html` carries a `?v=YYYYMMDD` cache-bust so phones don't serve a stale clip when the file is swapped (same name). Currently `?v=20270703`.

- `<video muted loop playsinline preload="auto">` — **no `autoplay`**. It would otherwise start playing while the cover is still closed. Instead `openEnvelope()` in `main.js` calls `heroVid.play().catch(()=>{})` on the seal tap, so the video starts together with the music + petals.
- **Layering (z-index):** `.hero-video` is `z-index: 1`, sitting **above** the photo fallback `.hero-bg` (`z-index: 0`) but **below** `.hero-overlay`/`.hero-vignette` (`z-index: 1`, later in DOM). The photo `div` comes *after* the video in the DOM, so without this the photo painted on top and the video was invisible. If the video is missing/blocked, its `poster="couple.jpg"` covers the same area, so the fallback still looks right.
- The GSAP Ken Burns zoom rides on `.hero-bg` (photo); the video sits on top statically (plus scroll parallax). Overlay gradient + vignette keep text readable.

## Gallery Integration

Files: `images/gallery/1.jpg … 6.jpg` (see `images/gallery/README.txt`). Real photos are in & compressed (see note below).

**Layout = infinite auto-scroll marquee** (vanilla port of a React `image-auto-slider` the user found — replaced the old CSS-columns masonry). `.gallery-marquee` (edge-fade via CSS `mask`) wraps `.gallery-track` (`display:flex; width:max-content; animation: galleryScroll 42s linear infinite` → `translateX(0)`→`-50%`). The track holds **the 6 photos twice**: 6 originals (`figure.gallery-item[data-index]` + `.gallery-zoom` icon) then **6 clones** (`figure.gallery-item[data-clone][aria-hidden]`, `<img>` only). Each `.gallery-item` is a fixed-size tile (`clamp` width/height, `object-fit:cover`, `margin-right:1.25rem` so `translateX(-50%)` loops **seamlessly** — don't switch to flex `gap`, it breaks the seam). Hover/`focus-within` sets `animation-play-state: paused` so tiles can be clicked.

- **Lightbox** discovers **originals only** via `document.querySelectorAll('.gallery-item:not([data-clone])')` (clones are skipped so prev/next cycles 6, not 12). Clicking a clone does nothing (no handler) — acceptable.
- **Change photo count:** keep **both halves equal** — add/remove a matching original *and* clone `figure`. (The old masonry `.gallery-grid`/`column-count` classes and `--tall`/`--wide` modifiers are gone — don't reintroduce.)
- **Reduced motion:** `@media (prefers-reduced-motion)` in `animations.css` kills the scroll (`animation:none; transform:none`) and turns `.gallery-marquee` into a manually scrollable strip (`overflow-x:auto`, mask off).
- Placeholder `onerror` fallbacks were removed 2026-07-02 (real photos 1–6 in). Placeholder images `couple.jpg`/`venue.jpg` were deleted; hero uses a wine-gradient fallback.

> **Image filenames must be lowercase `.jpg`** — the `<img src>` references are lowercase, and GitHub Pages (Linux) is **case-sensitive**, so `3.JPG` would 404 on the live site even though it works locally on macOS (case-insensitive). Always normalize extensions to lowercase before committing.
> **Compression:** source photos were huge (up to 7000×8000, ~34 MB total). Compressed in place with macOS `sips -Z 1600 -s formatOptions 80 *.jpg` → ~2.5 MB total, max 1600px long edge. Originals remain in git history. Re-run this for any new drops.

## Expand-Map = the interactive venue cards (`#location` **and** `#ceremony`)

**Both** venue cards are animated maps now — a **vanilla CSS/JS port** of a React/framer-motion component the user found (`expand-map.tsx`). Applied to **two** cards:
- **`#location`** (Reception): `#expand-map` → Saalbau Kirchberg (`47.0918° N, 7.5290° O`), details `#location-details`. **Replaced the Google-Maps `<iframe>` embed** (the old `.location-img-wrap`/`.location-map` iframe is gone).
- **`#ceremony`** (traditional): `#expand-map-ceremony` → Kulturverein Murugan Bern (`46.8620° N, 7.4699° O`), details `#ceremony-details`. The card is `.location-card--compact.location-card--interactive`.

Each card got class `.location-card--interactive`; the animated `.expand-map` sits in a `.location-map-stage` at the top. The **real** Google Maps stays reachable via each card's `Route anzeigen` button (`btn-outline`) — navigation isn't lost.

- **Combined open:** collapsed card shows only the small map tile (240×140) + hint „Für Karte & Details tippen"; the details body is collapsed (`max-height:0; opacity:0; padding-y:0`). **One tap/click (or Enter/Space)** on a `.expand-map` toggles `.expanded` on **both** the map (→ 360×280 illustrated view) **and** its parent `.location-card` (→ body expands to `max-height:640px`, padding + opacity restored). Wired in `initExpandMaps()` via `map.closest('.location-card')`, so each card opens **independently**.
- **`initExpandMaps()`** (plural — `js/main.js`) iterates `document.querySelectorAll('.expand-map')`, so adding a 3rd card is just markup (unique `id` + `aria-controls`, its own name/coords). Inside each iteration the inner `.expand-map-card` is `card`, the parent is `locationCard` — don't shadow.
- **Illustrated scene:** champagne-hairline roads (SVG `<line pathLength="1">` drawn via `stroke-dashoffset` `@keyframes roadDraw`), wine-tinted `.building` blocks (`buildingPop`), a **rose `.expand-map-pin`** (`pinDrop`), venue name + coordinates, pulsing "Live" dot. Grid pattern shows only while collapsed.
- **3D tilt:** on `mousemove` (desktop only — gated by `(hover:hover) and (pointer:fine)` + not reduced-motion), sets `rotateX/rotateY` (±8°) on `.expand-map-card`; reset on `mouseleave`/collapse. **No JS library** — framer-motion springs replaced by CSS transitions/keyframes.
- **Theme mapping:** original emerald palette → **rose `--rose` pin/accents + champagne roads**; `bg-background`/`muted` → `--blush-card`/`--blush-soft`.
- **Reduced motion:** the global `@media (prefers-reduced-motion)` rule zeroes animation/transition durations, so the `forwards` scene animations + the body reveal just **snap to their final visible state** (no empty card, details still openable). Tilt is skipped.
- **Hint** is visible by default (`opacity:.7`), not hover-only, since touch has no hover and it's the key affordance.
- Styles live at the **end of `css/style.css`** (`/* Decorative animated expand-map */` + `/* interactive location card */`); markup is the two `.location-card--interactive` blocks in `#location` / `#ceremony`.

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

**Done since:** Gallery photos (1–6) added & compressed; `WEB_APP_URL` set & verified live; hero video + music wired.

## `prefers-reduced-motion`

All animations and transitions are disabled via `@media (prefers-reduced-motion: reduce)` in `animations.css`. Petals are also hidden (`display: none`). Music does not autoplay if reduced-motion is set.

## Known Issues / Next Session

> Updated 2026-07-02 (session 4, end). Live on **GitHub Pages → `vithuthaya.github.io`**. This session: (a) **separated Reception from the traditional Hindu wedding** — added `#ceremony` section (16.05.2027, Kulturverein Murugan Bern), hero `.hero-note` + RSVP `.rsvp-note` (site/RSVP is only for the Reception), relabelled Reception location badge; (b) a 68 MB hero video **broke the Pages deploy (timeout)** → **compressed to ~15.8 MB** with ffmpeg; (c) removed placeholder images — Location now an **embedded Google Map**, hero uses a themed gradient fallback (`couple.jpg`/`venue.jpg` deleted), gallery `onerror` fallbacks removed. CSS/JS + video cache-bust now `?v=20270116`.

1. **Background music polish (deferred by user).** `audio/wedding-music.mp3` is committed but **~10.8 MB** — slow on mobile. Compress to ~2–4 MB (128 kbps, maybe trim to 2–3 min). Optionally tweak fade-in volume (`0.55` in `startMusic()`).
2. **Story content** (`#story`) — replace placeholder text + 4 timeline entries.
3. **Schedule** (`#schedule`) — generic program; still says "Trauungszeremonie" though the event is a **reception** — fix with real times.
4. **Real-device test** the Farewell page + "Zum Kalender hinzufügen" on actual iOS & Android.

**Resolved this session:** hero video display (z-index layering), scroll-cue removed, gallery photos in + compressed + masonry layout, video gated to seal click. Mobile animations bug from last session appears resolved (site rendered correctly on the user's iPhone, incl. gallery).

**Reminder:** local CSS/JS in `index.html` are cache-busted with a `?v=YYYYMMDD` query — **bump it whenever CSS/JS changes** so phones don't serve stale files (mobile Chrome bit us before). Currently at `?v=20270707` (the hero **video** keeps its own `?v=20270706` — don't bump it unless the .mp4 file actually changes, or phones needlessly re-download 5.8 MB).

**Design overhaul (2026-07-03, session 5) — reference-image driven, DESIGN ONLY (text unchanged), gold = "Mittelweg" (glossy gold at key spots, sparing glow).** New token `--gold-metallic` (145° gold gradient for glossy fills / background-clip script names — always give a solid `--gold-soft` fallback). Etappes 1 done then 2–5 batched at the user's request (they do final fine-tuning). **All 5 Etappen shipped:**
- **Etappe 1** (`8d1c9f8`, footer clip fix `ab23c71`): Navbar → wine-gradient bar (`.site-nav.nav-scrolled`), gold uppercase links + gold underline, `.nav-cta` = **gold-metallic pill** (dark text, now visible on mobile). Footer → wine-gradient bg (was `#1F0905`), names in metallic gold (needs padding around the names or Great Vibes swashes get clipped by the `background-clip` box).
- **Etappe 2–5** (`a2a30e7`):
  - **Cover:** CSS embossed seal SVG replaced by **`images/siegel.png`** (user-supplied wax seal V&S + gold thread, trimmed/`object-fit:cover` top to crop its transparent lower half). Idle = `sealSway` (pendulum on thread); open = seal **lifts up the thread + fades** (`.cover.opening .cover-seal` → `translateY(-42vh) rotate(-7deg)`). Old `.cover-seal::before` thread + `.seal-svg` removed.
  - **RSVP:** `.rsvp-card` gold-hairline panel + `overflow:hidden`; two `.rsvp-corner` gold filigree SVGs (`--tl`, `--br` rotated 180°); labels/inputs gold-outlined with gold focus glow; `.btn-submit` = glossy gold-metallic; attendance-active + stepper switched rose→gold.
  - **Tagesablauf:** markup now `.schedule-time` (gold-ring **circle**) + `.schedule-info` glass card with `.schedule-head` (`.schedule-icon` line-SVG + h4). 5 items kept. Old vertical line + `.schedule-dot` gone.
  - **Story:** markup now `.story-entry` = `.story-photo` (empty **gold photo-circle**, `.story-photo-ph` "Foto hier" placeholder — drop an `<img>` inside later) + `.story-text`. Alternating L/R (`nth-child(even)` row-reverse) around a central gold line (`.story-timeline::before`); single centred column ≤700px. 4 entries kept.

**Open fine-tuning candidates (user will polish):** story "vine" is a straight gold line (not the winding render); schedule icons are approximate line-SVGs; story photos still to be supplied.

**Update 2026-07-03 (session 6) — Cover redesigned into a real wax-sealed envelope.** User's feedback: the seal looked bad (the old `images/siegel.png` had the checkerboard transparency **baked in** — `hasAlpha:no`) and there was no visible "envelope opening" animation. User supplied a clean transparent seal (`~/Downloads/siegel.png`, no thread) + a reference screen-recording of a green floral envelope whose flap peels open. Chose: **echter Umschlag**, no thread, seal **größer & mittig**. Rebuilt the cover (see the Cover bullet under *Key Animation Details*): new seal cropped to a tight transparent 460×460 square (`sips -c 460 460`, ~130 KB) and centred on the flap tip; creme CSS envelope with 3D-flip flap + dark interior reveal; timings retuned (petals 500ms, screen fade 1150ms, reveal 2000ms). Verified closed + mid-open in headless Chrome — both look right. Cache-bust bumped to `?v=20270707`. **Left for the user to fine-tune:** exact seal size/vertical position; the botanical print reads a touch like linked ovals (swap the SVG path if you want true florals); whether to show the flap's underside during the flip (currently `backface-visibility:hidden` so it cleanly disappears past 90°).

**Update 2026-07-03 (session 5):** hero video **wouldn't show on mobile** — at 15.8 MB it wasn't buffered by the time `openEnvelope()` fires `play()`, so only the wine-gradient fallback painted. **Recompressed 15.8 MB → 5.8 MB** (CRF 27, height 1440→1080, 614×1080), bumped all `?v=` to `20270703`. Verified the live file serves (200) at the real `/wedding/` base path. **Optional next step:** re-add a `poster` (extract a frame from the video as a small JPG) so a still image shows instantly even before the video buffers. Also added `.claude/settings.json` (`worktree.bgIsolation: none`) so background sessions edit in place per the push-to-main workflow.
