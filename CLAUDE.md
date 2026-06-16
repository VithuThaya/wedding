# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Digital wedding RSVP invitation website — single-page, mobile-first, plain HTML/CSS/JS (no framework, no backend). Guests open an animated envelope, read the invitation, and RSVP via a form that posts to Google Sheets through a hidden Google Form submission.

**Language:** All guest-facing content is in **German** (`<html lang="de">`).

## How to Run

Open `index.html` directly in any browser — no build step, no server required.

## File Structure

```
Wedding-1/
├── index.html              # all sections and markup
├── css/
│   ├── style.css           # layout, typography, design tokens, all section styles
│   └── animations.css      # envelope open, falling petals, scroll reveals, hero entrance
├── js/
│   ├── main.js             # envelope interaction, music player, parallax, petal spawner, IntersectionObserver, RSVP form
│   └── countdown.js        # live countdown timer (days/hours/minutes, updates every second)
├── images/
│   └── placeholder/
│       ├── couple.jpg      # hero background — landscape, min 1920×1080px
│       └── venue.jpg       # location card photo — landscape, ~1400×600px or larger
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
Style keywords: **Modern-elegant, soft blush, clean, minimal, lots of whitespace, feminine, cinematic**

### What this means in practice
- Consistent soft blush background throughout — no alternating ivory/cream sections
- No heavy gold ornaments — gold only as subtle accent (dividers, eyebrow labels)
- Diagonal section dividers removed — flat, clean transitions instead
- Glassmorphism removed from most elements — only very subtle where needed
- Pill-shaped buttons and timeline chips (fully rounded)
- Generous whitespace — sections breathe, nothing feels cramped

## Design Tokens (CSS variables in `style.css`)

| Variable | Value | Use |
|---|---|---|
| `--blush-bg` | `#FDF0F0` | Main page background |
| `--blush-soft` | `#FBE8E8` | Alternating section tint (`#location`, `#rsvp`) |
| `--blush-card` | `#FAE4E4` | Card / chip backgrounds |
| `--blush` | `#F2D4D8` | Borders, envelope body |
| `--blush-line` | `#EFD3D6` | Hairline dividers |
| `--rose` | `#C2617A` | Buttons, time-chips, active states |
| `--rose-dark` | `#9D3D58` | Hover states |
| `--rose-muted` | `#D49AAB` | Timeline lines, soft accents |
| `--sage` | `#6B7F6B` | Wax seal color |
| `--gold` | `#B8863F` | Subtle accents only |
| `--gold-light` | `#DCC39A` | Thin divider lines |
| `--text` | `#3A2A30` | Body text (soft dark plum) |
| `--text-soft` | `#5C4750` | Paragraph text |
| `--text-muted` | `#927880` | Secondary / placeholder text |

**Fonts (Google Fonts CDN):**
- Display: `Cormorant Garamond` — weights 500/600/700, upright + italic
- Body: `DM Sans` — 300, 400, 500, 600, 700

## Key Animation Details

- **Envelope:** 3D flap rotates `rotateX(-172deg)` over 1.5s. Sage-green wax seal (two interlocking hearts + "UNSERE EINLADUNG" text path). A `::after` shimmer sweep (`envShimmer`) draws the eye before opening. Music fades in on open.
- **Falling petals:** On envelope open AND on RSVP success. 18 petals, 6 keyframe paths. Self-remove via `animationend`.
- **Hero entrance:** Elements stagger in via `riseIn` (1s, `--ease`) after `#main-content` gets `.visible`.
- **Ken Burns:** `.hero-bg` photo gets `kenBurns` (24s, scale 1.05→1.18, ease-out, runs once) once `#main-content.visible`.
- **Parallax:** Hero photo + video translate at 0.4x scroll speed via `requestAnimationFrame` listener — desktop only (`min-width: 768px`).
- **Scroll reveal:** `.reveal` elements via `IntersectionObserver` → class `.visible` → opacity + translateY (0.9s, `--ease`). Slow and fluid, no bounce. Delay helpers `.reveal-delay-1..4`.
- **Music player:** Floating round button bottom-right with animated equalizer bars (`musicBar`). Toggles play/pause; `.paused` freezes bars. Hidden until music starts.
- **Scroll cue:** Animated `.scroll-cue` pill at bottom of hero (`scrollCue` keyframe).
- **Section transitions:** No diagonal clip-path dividers — flat sections with alternating `--blush-bg` / `--blush-soft` backgrounds.

## Sections

1. **Envelope intro** — Blush envelope, sage wax seal, shimmer sweep, "tippen zum Öffnen". Music starts + petals fall on open
2. **Hero** — Full-bleed couple photo + optional video BG, `Wir heiraten!` eyebrow, italic names with `&`, intro line, frosted countdown (Tage/Stunden/Minuten), italic date, location, `Jetzt zusagen` CTA, scroll cue
3. **Unsere Geschichte** — Nicholas Sparks quote, single-column vertical timeline with rose dots + blush date chips
4. **Location & Anfahrt** — Venue photo in rounded white card, address, meta (date/time/dress code), `Route anzeigen` Maps link
5. **Tagesablauf** — Rose pill time-chips (e.g. `13:30`) + vertical line, clean left-aligned layout
6. **RSVP** — `Seid ihr dabei?` heading, attendance toggles (✓ Ja / ✕ Nein / ◷ Vielleicht) with colored icon chips, name/email/guest-stepper/dietary/song/message, frosted success state
7. **Footer** — Names, date, ornament, "Mit Liebe gemacht"

## Music Integration

File: `audio/wedding-music.mp3` (constant `MUSIC_SRC` in `main.js`)

`startMusic()` is called on envelope open: creates an `Audio`, loops it, and fades volume 0→0.55 over 2s via `fadeAudio()`. The floating `#music-toggle` button is revealed once playback begins and toggles play/pause (with a short fade).

Browser autoplay policy: music only starts after user interaction (the envelope click counts — compliant). If `play()` is still blocked, the toggle appears in `.paused` state so the user can start it manually. Music does **not** start if `prefers-reduced-motion` is set.

## Video Integration

File: `video/wedding-highlight.mp4`

- Placed behind hero photo as `<video autoplay muted loop playsinline>`
- On mobile: video hidden, `couple.jpg` shown instead (performance)
- Overlay gradient ensures text remains readable

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

## Content Placeholders (still to be replaced)

All `[TODO]` markers in `index.html`:
- `[Partner 1]`, `[Partner 2]` — real names (hero, footer, title tag)
- `24. April 2027` — real wedding date (hero, location meta, footer)
- `[Venue Name]`, `[City]`, `[Street & Number]`, `[ZIP]` — real venue details
- `[VENUE_ADDRESS]` — Google Maps query string
- `WEDDING_DATE` in `js/countdown.js` — real ISO date string (currently `2027-04-24T14:00:00`)
- Story quote + 4 timeline entries — real couple story text
- Schedule times and event descriptions — real day program
- RSVP deadline `1. Februar 2027` — real cutoff date (in the `#rsvp` lead paragraph)

## `prefers-reduced-motion`

All animations and transitions are disabled via `@media (prefers-reduced-motion: reduce)` in `animations.css`. Petals are also hidden (`display: none`). Music does not autoplay if reduced-motion is set.
