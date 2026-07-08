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
│   ├── gallery/            # gallery photos 1.jpg…6.jpg (optional — tiles fall back to placeholder/* if missing)
│   │   └── README.txt      # drop-file hint + sizing guidance
│   └── story/              # #story timeline photos (700×700 square crops for the round .story-photo circles)
│                           #   erste_schritte.jpg · erste_date.jpg · antrag.jpg · grosser_tag.jpg
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
- Deep wine-black background site-wide (`--blush-bg` = `#2E0D08`); **strict** dark/light alternation — the lighter `--blush-soft` tint is on `#location`, `#gallery`, `#rsvp`, and the three dark sections (`#story`, `#ceremony`, `#schedule`) are rounded panels floating over them (see "Section transitions")
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
| `--blush-soft` | `#3D120C` | Light section tint (`#location`, `#gallery`, `#rsvp`) |
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

- **Cover (`.cover`) — wax-sealed envelope (redesigned 2026-07-03, session 6):** Inside `#envelope-screen` (light greige gradient) a centred creme paper **envelope** (`.envelope`, `min(92vw,440px) × min(82vh,620px)`, `perspective:1300px`) built from stacked layers: `.env-interior` (dark wine inside, revealed on open), `.env-front` (creme pocket, `clip-path` covers everything **except** the top-centre rounded-flap area so the interior only shows once the flap lifts), `.env-flap` (top **rounded/oval flap** — no longer a sharp triangle; convex-sided bell `clip-path:polygon(0 0,100% 0, 90% 26%,78% 50%,66% 72%,57% 88%,50% 95%, 43% 88%,34% 72%,22% 50%,10% 26%,0 0)`, `transform-origin:center top`, `backface-visibility:hidden`; the front's notch mirrors this same curve scaled by ×0.46 so flap+notch line up), the wax-seal image `.cover-seal` (`images/siegel.png`, transparent PNG centred on the flap tip via `top:44%;left:50%;translate(-50%,-50%)`, **large** `width:min(58%,300px)`), the Great Vibes line `.cover-script` printed just below the seal (`top:66%`, `clamp(1.5rem,7vw,2.5rem)`), and `.cover-hint` „tippen zum Öffnen" absolutely at `bottom:7%`. The envelope is **full-bleed on phones** (`width:min(100vw,460px)`, `height:min(100svh,720px)` — `svh` so iOS toolbars don't clip it, `border-radius:0`) and **capped + rounded** ≥560px. Flap + front share a delicate tone-on-tone **floral vine SVG data-URI print** (170px tile: a diagonal stem with almond leaves + centre veins + tiny buds — replaced the old chain-of-ovals that read like links). **On tap** (`openEnvelope()`) → `.cover.opening`, choreographed to a smooth ~**3s** open: the flap **slowly** 3D-flips up (`rotateX(-168deg)`, **2.2s**), the seal lifts away (`translateY(-58vh) rotate(-7deg) scale(.82)` + fade, **2.3s**), `.cover-script`/`.cover-hint` fade; petals at 1100ms; then a **gated reveal** (session 12 — see below): the site is revealed only once the flap/seal choreography (`CHOREO_MS` **2300ms**) has run **and** the hero video is actually playing, capped by `MAX_WAIT_MS` (**10000ms**). In the common case the video is ready by 2300ms → `#envelope-screen.closing` runs `screenFadeOut` (**0.7s**) → content reveals + scroll unlocks + music at **3000ms** exactly (unchanged feel). No hanging thread, no `.seal-svg`, no `.cover-seal-img` anymore.
- **Falling petals:** On envelope open AND on RSVP success. 18 petals, 6 keyframe paths. Self-remove via `animationend`.
- **Smooth scroll:** Lenis drives the whole page. `lenis.stop()` keeps it locked behind the envelope; `lenis.start()` is called when the envelope finishes opening (and while the lightbox is open). All `a[href^="#"]` links use offset-aware `lenis.scrollTo()` (accounts for `--nav-h`).
- **Hero entrance:** Text elements stagger in via `riseIn` (1s, `--ease`) after `#main-content` gets `.visible` (CSS only).
- **Ken Burns + parallax (GSAP):** When GSAP is present (desktop, motion allowed), `js/main.js` adds `.gsap-hero` to `<html>` — this **disables** the CSS `kenBurns` so GSAP solely owns the `.hero-bg` transform (avoids a CSS-animation vs inline-transform conflict). GSAP then does the slow zoom (`scale 1.08→1.2`, 22s) **and** scroll parallax (`yPercent 18`, scrubbed) on hero photo + video, plus a fade of `.hero-content` on scroll-away. Fallback without GSAP: lightweight rAF parallax (0.4x), CSS Ken Burns stays on.
- **Scroll reveal:** `.reveal` elements via `IntersectionObserver` → class `.visible` → opacity + translateY (0.9s, `--ease`). Delay helpers `.reveal-delay-1..4`. (Kept on `IntersectionObserver` even with GSAP — only smooth-scroll & parallax use GSAP.)
- **Sticky nav:** `#site-nav` is hidden until scrolled past ~62% of the hero, then `.nav-visible` + frosted `.nav-scrolled`. Active section highlighted via a second `IntersectionObserver`. Mobile: `.nav-toggle` burger opens `.nav-links.mobile-open` dropdown.
- **Gallery + lightbox:** `.gallery-item` tiles (CSS-columns masonry, see Gallery Integration), hover zoom. Click/Enter opens `#lightbox`; supports prev/next buttons, ←/→ keys, Esc, backdrop click. Reads the tile `<img>` `currentSrc` (so the onerror placeholder fallback carries through).
- **Music player:** Floating round button bottom-right with animated equalizer bars (`musicBar`). Toggles play/pause; `.paused` freezes bars. Hidden until music starts.
- **Section transitions (per-edge domes, revised session 11):** No diagonal clip-path dividers. Content sections **strictly alternate** dark/light — `#story` dark, `#location` light, `#ceremony` dark, `#gallery` light, `#schedule` dark, `#rsvp` light, footer dark (perfect D/L/D/L rhythm). The three **dark** sections (`#story`, `#ceremony`, `#schedule`) float as **rounded panels** over the flat light sections. Two tokens (`:root`): **`--panel-r: clamp(5rem,40vw,14rem)`** (dome radius) and **`--sec-pad: clamp(2.75rem,7vw,4.5rem)`** (base vertical padding, **decoupled** from the radius). The rule set lives in `style.css` just after the alternating-background block and is now **per-section, per-edge** (not one shared rule) — the key idea: **round & overlap ONLY the edges that should read as a dome; add `--panel-r` padding ONLY on an edge that actually faces a dome.**
  - Dark panels: `position:relative; z-index:2`. Light sections `#location,#gallery,#rsvp`: `z-index:1`.
  - **`#story` & `#ceremony`** = **flat top, dome bottom**: `border-radius:0 0 var(--panel-r) var(--panel-r)`, `margin-top:0` (no upward bulge — story meets the hero, ceremony meets `#location` cleanly), `margin-bottom:calc(-1*var(--panel-r))`, `padding-top:var(--sec-pad)`, `padding-bottom:calc(var(--sec-pad)+var(--panel-r))`.
  - **`#schedule`** = **dome BOTH edges** (user wanted Tagesablauf rounded top+bottom): `border-radius:var(--panel-r)`, `margin-block:calc(-1*var(--panel-r))`, `padding-block:calc(var(--sec-pad)+var(--panel-r))`.
  - **Light sections** add `--panel-r` padding **only on the edge a dome faces**: `#location` → top only (story dome above; bottom is `--sec-pad` since ceremony's top is flat); `#gallery` → both (ceremony dome above + schedule dome below); `#rsvp` → top only (schedule dome above; bottom is `--sec-pad` since the footer is flat). Footer top padding = `var(--sec-pad)` (flat, no dome).
  - **Rules of thumb:** a dome edge's margin must stay **= −`--panel-r`** (a smaller overlap leaves a dark sliver in the deep corner); a flat edge is `margin:0` + no radius so it can't cover the previous section's content; only a dome-facing edge needs the `+--panel-r` padding, which is why per-edge padding keeps neighbours from drifting absurdly far apart (the old uniform `base+--panel-r` on every edge was the „zu weit auseinander" bug — session 11). Radius is `vw`-based → **phones** approach near-half-circle domes; capped `14rem` on desktop. `--panel-r` and `--sec-pad` are independent now, so you can shrink domes without touching spacing (or vice-versa).

> The old animated scroll-cue pill at the bottom of the hero was removed (didn't look good) — `.scroll-cue` markup, CSS and the `scrollCue` keyframe are all gone.

## Sections

Plus a **sticky nav** (`#site-nav`, outside `#main-content`) and a **lightbox** (`#lightbox`, after the footer) that overlay all sections.

1. **Cover intro** — Creme wax-sealed **envelope** on a light greige gradient: triangular flap held shut by the V&S wax seal, Great Vibes line „Diese Einladung ist exklusiv für dich" on the front, „tippen zum Öffnen". On tap: flap flips open + seal lifts away → dark interior → music starts + petals fall + hero video begins playing
2. **Hero** — Full-bleed couple photo + optional video BG (starts on cover open, not autoplay), vignette, `Wir heiraten` eyebrow with hairlines, names in Great Vibes script, intro line, frosted countdown (Tage/Stunden/Minuten/**Sekunden**, counts to the **Reception** 29.05.2027), italic date, location, a `.hero-note` clarifying **„Diese Einladung gilt für die Reception (Afterparty)"**, `Jetzt zusagen` CTA (with shimmer)
3. **Unsere Geschichte** — Nicholas Sparks quote, then an alternating L/R timeline of gold photo-circles + text, with a **faint winding gold vine** (`images/story-vine.svg`) as a repeating background watermark down the centre (replaced the old straight gold line)
4. **Location & Anfahrt** (`#location`) — Reception venue (Saalbau Kirchberg) shown via the **interactive animated expand-map** (`.location-card--interactive`; the old Google-Maps iframe was **removed**). Collapsed = small map tile + hint; one tap expands the illustrated map **and** reveals the details (badge „Reception · Afterparty", address, meta SVG icons date/time/dress code, `Route anzeigen` Maps link) together. See "Expand-Map = the interactive Location card" below
5. **Traditionelle Hochzeit** (`#ceremony`) — dedicated compact block for the traditional Hindu ceremony (**16.05.2027**, Kulturverein Murugan Bern, Gürbestrasse 9, 3125 Toffen). Now also an **interactive animated expand-map** (`.location-card--compact.location-card--interactive`, `#expand-map-ceremony` → `#ceremony-details`): collapsed map tile + hint, one tap expands the illustrated map **and** reveals the details (badge „Traditionelle Zeremonie", address, 16.05.2027, `Route anzeigen` Maps link) together — same mechanic as the Reception card (see "Expand-Map = the interactive venue cards"). Note: a **separate physical invitation** is sent by post; the digital RSVP is **only** for the Reception
6. **Galerie** — **infinite auto-scroll marquee** (`.gallery-marquee`/`.gallery-track`, edge-fade mask) of the 6 photos looped seamlessly; pauses on hover so a tile click opens the lightbox. Images from `images/gallery/`. See "Gallery Integration"
7. **Tagesablauf** — minimal **centred timeline** (`.schedule-timeline`): a thin champagne-gold centre line with small gold dots; entries (`.schedule-item`) alternate **L/R** — a `.schedule-when` block (gold-italic Cormorant `.schedule-time` + serif `.schedule-title`) on one side, `.schedule-desc` text on the other. No cards, no ring-circles, no icons (session 9 redesign, ref `stitch_interactive_invitation_entrance`). Collapses to a single left-aligned column with a left line ≤640px
8. **RSVP** — `Bist du dabei?` heading + a `.rsvp-note` clarifying the reply is **only for the Reception (29.05.2027)**, attendance toggles (SVG icons: Ja / Nein) with colored icon chips, name/guest-stepper/dietary/song/message. On submit → full-screen **Farewell** closing page (`#farewell-screen`). On reload, if this browser already submitted, the form is replaced by an inline „Schon erledigt!" notice (double-submit guard via `localStorage`)
9. **Farewell** (`#farewell-screen`, outside `#main-content`) — full-screen dark-wine closing takeover after a successful RSVP: gold heart ornament, names in Great Vibes, attendance-aware title/text (Zusage vs Absage), date & venue, „Zum Kalender hinzufügen" (.ics blob, only on Zusage), contact email for changes, falling petals (own `.farewell-petals` layer). Scroll-locked, stays until reload
10. **Footer** — Names (Great Vibes), date, SVG ornament, "Mit Liebe gemacht"

All icons are inline **SVG** (no emojis) — meta, attendance toggles, success state, footer ornament, gallery zoom, lightbox & nav controls.

## Music Integration

File: `audio/wedding-music.mp3` (constant `MUSIC_SRC` in `main.js`)

`startMusic()` is called on envelope open: creates an `Audio`, loops it, and fades volume 0→0.55 over 2s via `fadeAudio()`. The floating `#music-toggle` button is revealed once playback begins and toggles play/pause (with a short fade).

Browser autoplay policy: music only starts after user interaction (the envelope click counts — compliant). If `play()` is still blocked, the toggle appears in `.paused` state so the user can start it manually. Music does **not** start if `prefers-reduced-motion` is set.

## Video Integration

File: `video/wedding-highlight.mp4` (committed, **~3.1 MB**, H.264, vertical 1090×1920 source → scaled to **1080px height** (614×1080), **compressed** with ffmpeg, **CRF 32** as of 2026-07-08). Was ~5.8 MB @ CRF 27; recompressed to CRF 32 (5.8→3.1 MB, −49%) — verified no visible quality loss on an extracted frame (foliage identical), and it sits behind the dark hero overlay anyway. Re-encoded from the committed CRF-27 file (the 68 MB master is gone; a `~/Downloads/wedding-highlight.MP4` „original" is only 576×1008 w/ audio — **not** a better source).

- **⚠️ Mobile "video didn't show" (2026-07-03):** at **15.8 MB** the clip loaded too slowly over mobile data — `openEnvelope()` calls `heroVid.play()` immediately on the seal tap, so if the video isn't buffered yet nothing paints and (since `couple.jpg` poster was deleted) you just see the wine-gradient `.hero-bg` fallback. Fix: **recompressed to ~5.8 MB** (CRF 24→27, height 1440→1080). Note the live site is a **project page under `/wedding/`** (`https://vithuthaya.github.io/wedding/…`) — test asset URLs against that base, not the domain root, or you'll get a misleading 404.
- **⚠️ Deploy lesson (2026-07-02):** an uncompressed **68 MB** clip made the **GitHub Pages deploy time out** (`##[error]Timeout reached, aborting!` — the publish step hangs in `deployment_queued` past the ~10-min limit), so the site silently stayed on the previous commit and the video didn't load. **Keep the video small** (single-digit MB is ideal). Recompress any new clip before committing:
  `ffmpeg -i in.mp4 -vf "scale=-2:1080" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 27 -preset slow -an -movflags +faststart out.mp4` (strip audio `-an` — the hero video is silent; `+faststart` lets it start before fully downloaded).
- The `<source>` in `index.html` carries a `?v=YYYYMMDD` cache-bust so phones don't serve a stale clip when the file is swapped (same name). Currently `?v=20270703`.

- `<video muted loop playsinline preload="auto">` — **no `autoplay`**. It would otherwise start playing while the cover is still closed. Instead `main.js` calls `heroVid.load()` on page load (buffers during the cover) and `heroVid.play()` on the seal tap.
- **Gated reveal (session 12) — guarantees the video is up before the hero shows.** `openEnvelope()` no longer reveals on a fixed 3000ms timer. It waits for **both** the ~2.3s flap/seal choreography **and** the video's `playing` event (`videoReady`), then runs the 0.7s fade → reveal. Signals that flip `videoReady`: `playing` (normal), the `play()` promise resolve/reject, and `error` on the `<video>` **and** its `<source>` (a dead source fires on the `<source>`). A hard `MAX_WAIT_MS` (10000ms) `setTimeout` reveals regardless so a slow/blocked/missing video can never freeze the cover. Because `play()` is already called, the clip also starts on its own the moment it buffers — so even past the cap the video still plays, just a beat after the hero appears. Event-driven (not a rAF/`performance.now` poll — that would stall when the tab is backgrounded). Verified in a scratchpad harness (real gating logic, headless virtual-time): GOOD→reveal 3000ms, STALL(never loads)→reveal 10700ms via the cap, BAD(missing)→cap in headless but ~3s in a real browser where the error/reject fires. Tune `MAX_WAIT_MS` up to favour the video even more on very slow links.
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
- Schedule times + descriptions (`#schedule`) — still the generic program; note it references a "Trauungszeremonie" though the event is a reception, so revisit when finalizing

**Done since:** Gallery photos (1–6) added & compressed; `WEB_APP_URL` set & verified live; hero video + music wired. **Story `#story` finalized (2026-07-08):** real texts (quote + 4 headings/entries, written by the couple) **and** all 4 timeline photos in — `images/story/{erste_schritte,erste_date,antrag,grosser_tag}.jpg`, each cropped square + 700×700 + compressed for the round `.story-photo` circle. Order: **Erste Schritte** (childhood-photo collage — a wide 2-up, so the round frame clips its outer edges; the only imperfect circle fit), **Das erste Date** (car selfie), **Der Antrag** (Gurten proposal), **Unser grosser Tag** (portrait). Crop recipe: `ffmpeg -i in -vf "crop=<sq>:<sq>:<x>:<y>,scale=700:700" -q:v 3 out.jpg`, x/y chosen to centre the couple's faces in the central disk. Filenames **must** be lowercase `.jpg` (case-sensitive Pages). ⚠️ macOS FS is case-insensitive → to rename `X.JPG`→`x.jpg` use temp+`mv`, never `cp x.jpg && rm X.JPG` (same inode → deletes the copy).

## `prefers-reduced-motion`

All animations and transitions are disabled via `@media (prefers-reduced-motion: reduce)` in `animations.css`. Petals are also hidden (`display: none`). Music does not autoplay if reduced-motion is set.

## Known Issues / Next Session

> Updated 2026-07-02 (session 4, end). Live on **GitHub Pages → `vithuthaya.github.io`**. This session: (a) **separated Reception from the traditional Hindu wedding** — added `#ceremony` section (16.05.2027, Kulturverein Murugan Bern), hero `.hero-note` + RSVP `.rsvp-note` (site/RSVP is only for the Reception), relabelled Reception location badge; (b) a 68 MB hero video **broke the Pages deploy (timeout)** → **compressed to ~15.8 MB** with ffmpeg; (c) removed placeholder images — Location now an **embedded Google Map**, hero uses a themed gradient fallback (`couple.jpg`/`venue.jpg` deleted), gallery `onerror` fallbacks removed. CSS/JS + video cache-bust now `?v=20270116`.

1. ~~**Background music polish.**~~ **DONE (session 11):** `audio/wedding-music.mp3` recompressed **320 kbps → 96 kbps stereo** with ffmpeg (`10.3 MB → 4.2 MB`, full 4:26 length kept so the loop stays seamless — not trimmed). `MUSIC_SRC` in `main.js` now carries `?v=20270715` so returning phones fetch the smaller file. Optional future tweak: fade-in volume (`0.55` in `startMusic()`) or go mono (~2.5 MB) if size still matters.
2. ~~**Story content** (`#story`).~~ **DONE (2026-07-08, session 13):** couple wrote the real texts (quote + 4 entries) and supplied all 4 timeline photos — see *Content Placeholders → Done since*. Only open story tweak: „Erste Schritte" is a 2-photo childhood collage that the round frame clips — offered the user single-photo/re-crop alternatives; left as-is pending their call.
3. **Schedule** (`#schedule`) — generic program; still says "Trauungszeremonie" though the event is a **reception** — fix with real times.
4. **Real-device test** the Farewell page + "Zum Kalender hinzufügen" on actual iOS & Android.

**Resolved this session:** hero video display (z-index layering), scroll-cue removed, gallery photos in + compressed + masonry layout, video gated to seal click. Mobile animations bug from last session appears resolved (site rendered correctly on the user's iPhone, incl. gallery).

**Reminder:** local CSS/JS in `index.html` are cache-busted with a `?v=YYYYMMDD` query — **bump it whenever CSS/JS changes** so phones don't serve stale files (mobile Chrome bit us before). Currently at `?v=20270717` (the hero **video** is now `?v=20270708` after the CRF-32 recompress; favicon/OG image/audio stay at `?v=20270715`, gallery `4.jpg` + `wedding.ics` at `?v=20270716` — bump each only when that file changes — don't bump the video unless the .mp4 file actually changes, or phones needlessly re-download it).

**Design overhaul (2026-07-03, session 5) — reference-image driven, DESIGN ONLY (text unchanged), gold = "Mittelweg" (glossy gold at key spots, sparing glow).** New token `--gold-metallic` (145° gold gradient for glossy fills / background-clip script names — always give a solid `--gold-soft` fallback). Etappes 1 done then 2–5 batched at the user's request (they do final fine-tuning). **All 5 Etappen shipped:**
- **Etappe 1** (`8d1c9f8`, footer clip fix `ab23c71`): Navbar → wine-gradient bar (`.site-nav.nav-scrolled`), gold uppercase links + gold underline, `.nav-cta` = **gold-metallic pill** (dark text, now visible on mobile). Footer → wine-gradient bg (was `#1F0905`), names in metallic gold (needs padding around the names or Great Vibes swashes get clipped by the `background-clip` box).
- **Etappe 2–5** (`a2a30e7`):
  - **Cover:** CSS embossed seal SVG replaced by **`images/siegel.png`** (user-supplied wax seal V&S + gold thread, trimmed/`object-fit:cover` top to crop its transparent lower half). Idle = `sealSway` (pendulum on thread); open = seal **lifts up the thread + fades** (`.cover.opening .cover-seal` → `translateY(-42vh) rotate(-7deg)`). Old `.cover-seal::before` thread + `.seal-svg` removed.
  - **RSVP:** `.rsvp-card` gold-hairline panel + `overflow:hidden`; two `.rsvp-corner` gold filigree SVGs (`--tl`, `--br` rotated 180°); labels/inputs gold-outlined with gold focus glow; `.btn-submit` = glossy gold-metallic; attendance-active + stepper switched rose→gold.
  - **Tagesablauf:** markup now `.schedule-time` (gold-ring **circle**) + `.schedule-info` glass card with `.schedule-head` (`.schedule-icon` line-SVG + h4). 5 items kept. Old vertical line + `.schedule-dot` gone.
  - **Story:** markup now `.story-entry` = `.story-photo` (empty **gold photo-circle**, `.story-photo-ph` "Foto hier" placeholder — drop an `<img>` inside later) + `.story-text`. Alternating L/R (`nth-child(even)` row-reverse); single centred column ≤700px. 4 entries kept. The centre used to be a straight gold line; **session 8** replaced it with a faint winding gold vine (see session-8 note).

**Open fine-tuning candidates (user will polish):** schedule icons are approximate line-SVGs; story photos still to be supplied (drop `<img>` into `.story-photo`). *(The story "straight gold line → winding vine" ask was done in session 8.)*

**Update 2026-07-03 (session 10) — Strict section alternation + dark sections as rounded panels.** User wanted the content sections to **alternate dark/light after every component** so it's obvious where each new section begins, and (with two ref photos) wanted the **Tagesablauf** to have strongly rounded top **and** bottom edges revealing the neighbouring colour. When asked, the user also said Geschichte should be rounded too → chose the **consistent** system: **all three dark sections** are rounded panels. (a) **Alternation:** the only background change needed was `#gallery` `--blush-bg → --blush-soft` (light); that yields a perfect D/L/D/L: `#story`(D) `#location`(L) `#ceremony`(D) `#gallery`(L) `#schedule`(D) `#rsvp`(L) footer(D). **`#ceremony` deliberately kept DARK** — the user's literal note wanted it light, but that would put 3 lights in a row (Location, Ceremony, Galerie) and kill the alternation; flagged, user agreed to try. (b) **Rounded panels:** shared rule `#story,#ceremony,#schedule { position:relative; z-index:2; border-radius:clamp(2.5rem,7vw,4rem); margin-block:calc(-1 * clamp(2.5rem,7vw,4rem)); padding-block:calc(clamp(5rem,13vw,9rem) + clamp(2.5rem,7vw,4rem)); }` + `#location,#gallery,#rsvp { position:relative; z-index:1; }`. Each dark panel overlaps up/down into its light neighbours and (higher z-index) paints on top; its rounded corners cut through to the lighter colour → clean rounded reveal both edges. Dark panels never neighbour each other (alternation), so no panel-on-panel overlap. `#story` top overlaps the hero (content-sheet effect — looked fine, no flush-top fallback needed). Verified desktop 1200 + mobile 520 via a section-stack preview page (real `style.css`, fake hero) — rhythm + rounded reveals look right. Cache-bust `?v=20270711→20270712` (video stays `?v=20270706`). Note: gallery edge-fade is a transparency `mask` so it's fine on the now-light bg. **Follow-up (same session):** user said the rounding was too weak — „muss fast ein Halbkreis bilden". Bumped radius `clamp(2.5rem,7vw,4rem) → clamp(6rem,48vw,17rem)` (vw-based → near-half-circle **domes** on phones where it hits the 50%-width cap; strong-capped at 17rem on desktop so full-width panels aren't 600px-tall domes) and **removed** the `≤640px` small-radius override so the main rule's vw scaling makes the phone dome. **Margin must stay = −radius** (a smaller overlap leaves a dark corner sliver). Cache-bust `?v=20270712→20270713`. **BUG (found on-device, fixed same session `?v=20270713→20270714`):** the big domes were **covering the light sections' content** — the negative `margin-block` (= −radius) pulls each dark dome `radius` deep into its light neighbour, and a full-width dome is `radius` deep at its centre, so it bulged right over the centred title/map/photos of Location/Galerie/RSVP (my „sections are tall enough" assumption was wrong — height wasn't the issue, the dome intrudes over content regardless). **Fix:** give the light sections the **same** `padding-block: calc(base + var(--panel-r))` as the dark panels so the domes overlap into empty padding, leaving a clear flat band for content; introduced the `--panel-r` token and trimmed it `48vw/17rem → 40vw/14rem` so the extra padding doesn't make the page absurdly long. Re-verified on mobile 390 via preview with a title+card at the top of each light section (the exact bug case) — content now fully clear of the domes. **User will judge on-device and may refine** (exact `--panel-r`, whether ceremony should be light after all).

**Update 2026-07-03 (session 11) — Rounded panels: flat tops + per-edge padding (on-device feedback, 7 screenshots).** The session-10 all-4-corners domes had two on-device problems: (1) each dark panel's **upper** dome (all-corner radius + negative `margin-top`) **bulged over the previous section's content** — the `#story` dome covered the hero note „Diese Einladung gilt für die Reception", the `#ceremony` dome covered the Location card's „Für Karte & Details tippen"; (2) **too much empty padding everywhere**, because `padding-block: base + --panel-r` was applied to **both** edges of **every** section even where no dome faces that edge (e.g. `#rsvp` bottom before the flat footer), and `base` (`clamp(5rem,13vw,9rem)`) was large. **Fix (design only, text unchanged):** (a) **decoupled** the radius from the spacing — new token `--sec-pad: clamp(2.75rem,7vw,4.5rem)` (base padding), `--panel-r` unchanged (`40vw/14rem`). (b) Replaced the two shared rules with **per-section, per-edge** rules: `#story`/`#ceremony` are now **flat top, dome bottom** (`border-radius:0 0 R R`, `margin-top:0`) so their top can't cover the section above; `#schedule` keeps **both** domes (user explicitly wanted Tagesablauf rounded top+bottom). (c) **Per-edge padding** — a section edge gets the `+--panel-r` compensation **only if a dome actually faces it** (`#location` top-only, `#gallery` both, `#rsvp` top-only, footer top `--sec-pad`); every flat edge uses `--sec-pad` alone. This removes the wasted space and kills the coverage bug in one move. Mapped each of the 7 user screenshots to a boundary (flat-top fixes #2/#4; per-edge + smaller base fixes #3/#5/#6/#7/#8). **Verified** in the scratchpad via a section-stack preview that links the **real** `css/style.css` (fake hero + a title & two cards at BOTH the top and bottom edge of every section = the exact bug case), rendered headless at 390px + 1200px — first with an override mirroring the change, then again with the override removed so the layout came purely from the edited `style.css`: flat tops don't cover content, bottom domes + schedule's twin domes intact, spacing much tighter, no dark corner slivers. Cache-bust `?v=20270714→20270715` (video stays `?v=20270706`). **Margin on a dome edge must stay = −`--panel-r`**. `--panel-r` and `--sec-pad` are now independent — shrink domes or tighten spacing separately. **Open (user on-device judgement):** exact `--sec-pad`/`--panel-r` values; whether `#ceremony` should be light after all.

**Also session 11 — critical review follow-ups (user asked „was kann man noch optimieren"):**
- **Social link preview + favicon (done):** added Open-Graph + Twitter-card meta to `<head>` (title/description/url + `og:image` = new `images/og-image.jpg`, a 1200×630 centre-crop of `gallery/3.jpg`), plus `favicon-32`/`apple-touch-icon-180` derived from `siegel.png` and a wine `theme-color`. So WhatsApp/iMessage shares of the link show the couple + a title, not a bare URL. `robots noindex` kept.
- **Music compressed (done):** see Known-Issue #1 above (10.3 MB → 4.2 MB, 96 kbps stereo).
- **Tagesablauf alignment bug (done):** on desktop the even timeline rows (14:00, 17:00) had the description sitting ~60px LOWER than its time. Cause = CSS grid **sparse auto-placement**: those rows' DOM order is `.schedule-when`(→`grid-column:2`) then `.schedule-desc`(→`grid-column:1`); after placing `.when` in col 2 the cursor is past col 1, so `.desc` got bumped to a new grid row. Fix = pin both `.schedule-when`/`.schedule-desc` to **`grid-row: 1`** (base rule ~`style.css:943`), and **reset `grid-row:auto`** in the `≤640px` block so mobile still stacks them. Verified via a schedule-only preview linking the real `style.css` with an on-page getBoundingClientRect readout: even-row Δ dropped 62px→7px, mobile stacking intact. Cache-bust `?v=20270715→20270716`.
- **Tagesablauf content contradiction (flagged, DEFERRED by user):** `#schedule` still shows a full wedding-day program (`13:30 Einlass`, **`14:00 Trauungszeremonie`**, `15:00 Sektempfang`, …) which contradicts the site's own message that this is **only the Reception, ab 16:00** (the Trauungszeremonie is the separate 16.05 event). User is aware; leaving text until the real reception program is defined — and possibly a full **EN translation** of the whole site — in a later session. Don't "fix" the schedule text unprompted.
- **Gallery 5 & 6 rotation — FALSE ALARM (resolved):** `sips`/the image viewer show `5.jpg`/`6.jpg` sideways (raw pixels), but the **browser renders them upright** via its default `image-orientation: from-image` (the files DO carry usable orientation even though `sips -g orientation` reported `<nil>`). User confirmed on-device that 5 & 6 look correct. No rotation fix needed — don't "rotate" them or they'll end up wrong.
- **Gallery `4.jpg` re-cropped (done):** `4.jpg` was a **landscape** (1600×1066) shot with lots of empty sky; in the portrait marquee tile (`~0.75` aspect) `object-fit:cover` crops only the sides → it showed dead sky + clipped the man on the right. `object-position` can't help (landscape→portrait leaves no vertical crop room). Fixed by physically cropping it to a **portrait 800×1066** framed on the couple (`ffmpeg -vf "crop=800:1066:680:0"`), matching the tile aspect so it fills cleanly. The other 5 photos already crop fine. (`4.jpg` refs in `index.html` got `?v=20270716`; the full landscape original stays in git history.)
- **Calendar address fix (done):** the „Zum Kalender hinzufügen" event geocoded to the wrong Industriestrasse because `LOCATION` began with the venue name („Saalbau Kirchberg, Neuhofstrasse 33…"). Removed the venue prefix so `LOCATION` is the **pure street address** (`Neuhofstrasse 33, 3422 Kirchberg`) in **both** paths — the static `wedding.ics` (Apple) and `googleCalendarUrl()` (`js/main.js`, everyone else) — and moved the venue name into the event `DESCRIPTION`/`details` („Wir feiern im Saalbau Kirchberg! …") so it isn't lost. `wedding.ics` href now carries `?v=20270716`. RSVP→Sheets, Maps links, and the calendar time (16:00–23:00) all verified working by the user across 4 devices (no Android tested).

**Update 2026-07-03 (session 12) — Gated reveal so the hero video reliably plays.** User: „das Video soll unbedingt in jeder Situation abgespielt werden" — make the site reveal only once the video is up. Reworked `openEnvelope()` in `js/main.js`: (a) `heroVid.load()` on page load so the clip **buffers during the cover** (free head-start while the guest reads the envelope); (b) a **gated, event-driven reveal** — reveal fires only when `choreoDone` (2.3s flap/seal) **and** `videoReady` are both true; `videoReady` is set by the `playing` event / `play()` promise / `error` on the `<video>` and its `<source>`; a `MAX_WAIT_MS` (10s) `setTimeout` is a hard safety cap so a slow/blocked/missing video can never freeze the cover (and since `play()` already ran, the clip still starts the moment it buffers). Replaced the earlier fixed `setTimeout(reveal, 3000)`. **Not** a rAF/`performance.now` poll (that stalls when backgrounded, and headless virtual-time can't even run it). See the "Gated reveal" bullet under *Video Integration* for the full signal list + verification (harness: GOOD 3000ms, STALL 10700ms via cap, BAD ~3s real-browser). This **supersedes the old „re-add a poster" idea** — we now wait for the video itself instead of masking the gap with a still. Cache-bust CSS/JS `?v=20270716→20270717`.

**Update 2026-07-03 (session 9) — Footer seam + Tagesablauf simplified.** Two user asks:
- **Footer (small):** the footer sat on the same flat `#3D120C` as `#rsvp` above it, separated only by a gold `border-top` — that hairline read as an ugly „Strich". Removed the `border-top`; footer background is now a **seamless gradient** `linear-gradient(180deg,#3D120C 0%,#340F0A 40%,#290B07 100%)` — top matches the section above (invisible seam) then gently darkens, like the hero. Bumped top padding `4.2rem→5rem`.
- **Tagesablauf (big):** the gold-ring time circles + glass cards + line-icons looked „zu viel". Rebuilt **schlichter**, structure taken from the user's ref `~/Downloads/stitch_interactive_invitation_entrance` (colours & fonts kept ours): a **minimal centred timeline** — thin champagne centre line (`.schedule-timeline::before`), small gold dots (`.schedule-item::before`), entries **alternate L/R** via `nth-child(odd/even)` + CSS grid `1fr 1fr` (`.schedule-when` = gold-italic Cormorant time + serif title on one side, `.schedule-desc` on the other). Removed `.schedule-list`/`.schedule-info`/`.schedule-head`/`.schedule-icon` (+ the icon SVGs in markup) and the old gold-ring `.schedule-time` circle. Markup is now `.schedule-item`→`.schedule-when`(`.schedule-time`+`.schedule-title`)+`.schedule-desc`. Mobile ≤640px: single left-aligned column, line on the left. Added `min-width:0` on grid children (anti-overflow). Content/text unchanged (5 entries). **Render gotcha:** headless Chrome ignored `--window-size=390` and laid out at **500px**, so 390-wide screenshots looked right-clipped — it was a screenshot crop, not CSS overflow (verified `scrollWidth==innerWidth==500`, zero overflowing elements). Cache-bust `?v=20270710→20270711`.

**Update 2026-07-03 (session 8) — Story: straight gold line → faint winding gold vine.** User (with a reference PNG `elegant_story_timeline.png`) disliked the straight vertical gold line running through the `#story` timeline — it cut through the text. Wanted instead a golden **vine (Ranke)** winding in the **background**, faint enough that photos & text stay very readable. Built a vertical winding-vine SVG (`images/story-vine.svg`, 240×420 tile: an S-curve stem that enters top-centre & exits bottom-centre **vertically so it tiles seamlessly** via `background-repeat:repeat-y`, plus spiral flourishes, almond leaves + veins, and buds). Designed & rendered a swatch in headless Chrome first, then wired it into `.story-timeline::before` (was the 2px straight gradient line): now `width:240px`, `background-image:url(../images/story-vine.svg)`, `background-size:240px 420px`, `repeat-y`, `opacity:0.3`, `z-index:0`, `pointer-events:none`, with a top/bottom `mask-image` fade. Bumped `.story-entry` to `z-index:1` so photos **and** text sit above the vine. Mobile (`≤700px`): vine `opacity:0.16`, `width/​size 200px` so the centred single-column text stays perfectly legible. Removed a dead `.story-entry::before` rule (no such pseudo-element exists anymore). Verified desktop (1200px) + mobile (390px) in headless Chrome via a story-only preview page — winding vine reads as a delicate watermark, text/photos clearly on top. Cache-bust `?v=20270709→20270710`. **Next fine-tuning (user):** could tune vine opacity/density or swap the SVG path; real story photos still to be dropped into `.story-photo`.

**Update 2026-07-03 (session 7) — Cover fine-tuning (user-directed).** Three asks: (1) **floral vine pattern** — the envelope's tone-on-tone print read like a chain of linked ovals; replaced with a real leafy botanical vine (170px SVG tile: diagonal stem + almond leaves + centre veins + buds). Designed & rendered a swatch in headless Chrome before embedding as a URL-encoded data-URI on `.env-front,.env-flap`. (2) **Rounded/oval flap** — the flap was a sharp downward triangle; the user wanted it „ovalförmig (leichte Rundung)". Replaced the triangle `clip-path` with a convex-sided **bell** polygon (gentle outward bow + rounded tip); the `.env-front` notch and `.env-flap::before` shading use the matching curve (front = flap-y ×0.46). Seal nudged `top:46%→44%` onto the new tip. (3) **Slower, smoother ~3s open** — retuned so motion is continuous with no dead gap: flap flip `1.7s→2.2s`, seal lift `1.6s→2.3s` (`translateY -56vh→-58vh`), petals `900→1100ms`, `screenFadeOut 0.85s→0.7s`, `.closing` at `2200→2300ms`, reveal `3200→3000ms` (fade finishes exactly at reveal). Verified closed + mid-open + full-open in headless Chrome — floral vine + rounded notch reveal look right. Cache-bust `?v=20270708→20270709`. **Left to fine-tune (user polishes):** exact flap curvature / seal size still tweakable; the real-time 3s feel is best judged on-device.

**Update 2026-07-03 (session 6) — Cover redesigned into a real wax-sealed envelope.** User's feedback: the seal looked bad (the old `images/siegel.png` had the checkerboard transparency **baked in** — `hasAlpha:no`) and there was no visible "envelope opening" animation. User supplied a clean transparent seal (`~/Downloads/siegel.png`, no thread) + a reference screen-recording of a green floral envelope whose flap peels open. Chose: **echter Umschlag**, no thread, seal **größer & mittig**. Rebuilt the cover (see the Cover bullet under *Key Animation Details*): new seal cropped to a tight transparent 460×460 square (`sips -c 460 460`, ~130 KB) and centred on the flap tip; creme CSS envelope with 3D-flip flap + dark interior reveal; timings retuned (petals 500ms, screen fade 1150ms, reveal 2000ms). Verified closed + mid-open in headless Chrome — both look right. Cache-bust bumped to `?v=20270707`. **Left for the user to fine-tune:** exact seal size/vertical position; the botanical print reads a touch like linked ovals (swap the SVG path if you want true florals); whether to show the flap's underside during the flip (currently `backface-visibility:hidden` so it cleanly disappears past 90°).

**Update 2026-07-03 (session 5):** hero video **wouldn't show on mobile** — at 15.8 MB it wasn't buffered by the time `openEnvelope()` fires `play()`, so only the wine-gradient fallback painted. **Recompressed 15.8 MB → 5.8 MB** (CRF 27, height 1440→1080, 614×1080), bumped all `?v=` to `20270703`. Verified the live file serves (200) at the real `/wedding/` base path. **Optional next step:** re-add a `poster` (extract a frame from the video as a small JPG) so a still image shows instantly even before the video buffers. Also added `.claude/settings.json` (`worktree.bgIsolation: none`) so background sessions edit in place per the push-to-main workflow.
