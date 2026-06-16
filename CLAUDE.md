# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Digital wedding RSVP invitation website — single-page, mobile-first, plain HTML/CSS/JS (no framework, no backend). Guests open an animated envelope, read the invitation, and RSVP via a form that posts to Google Sheets through a hidden Google Form submission.

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
│   ├── main.js             # envelope interaction, petal spawner, IntersectionObserver, RSVP form
│   └── countdown.js        # live countdown timer (updates every second)
├── images/
│   └── placeholder/
│       ├── couple.jpg      # hero background — landscape, min 1200px wide
│       └── venue.jpg       # location card photo — landscape, ~700×270px or larger
└── ref/                    # reference screenshots (do not delete)
```

## Design Tokens (CSS variables in `style.css`)

| Variable | Value | Use |
|---|---|---|
| `--ivory` | `#FEFAF6` | Page background |
| `--ivory-warm` | `#FBF3EC` | Story section background |
| `--blush` | `#F5D8DF` | Borders, envelope |
| `--rose` | `#9D3D58` | Buttons, timeline chips, accents |
| `--rose-dark` | `#7A2E43` | Hover states |
| `--gold` | `#B8863F` | Eyebrows, ornaments, CTA button |
| `--gold-light` | `#E4CC96` | Dividers, subtle accents |
| `--text` | `#2C1A22` | Body text (dark plum, not black) |
| `--text-muted` | `#7A6068` | Secondary text |

**Fonts (Google Fonts CDN):**
- Display: `Cormorant Garamond` — italic 700, upright 700 (theatrical, NOT the default Playfair Display)
- Body: `DM Sans` — 300, 400, 600, 700

## Key Animation Details

- **Envelope:** 3D flap via CSS `perspective: 900px` + `transform-style: preserve-3d` on `.env-flap`. Clicking `.envelope-wrap` adds class `.opening` → flap rotates `rotateX(-170deg)`. Wax seal scales to 0 + rotates.
- **Falling petals (signature element):** On envelope open AND on RSVP success, `spawnPetals()` in `main.js` creates 18 `<div class="petal">` elements with randomized size/position/delay. 6 CSS keyframe animations (`petalFall-1` through `petalFall-6`) in `animations.css` handle the paths. Petals self-remove via `animationend`.
- **Hero entrance:** 7 elements stagger in via `riseIn` keyframe, triggered only after `#main-content` gets class `.visible`. Names also get a looping `nameShimmer` glow.
- **Scroll reveal:** `.reveal` elements observed by `IntersectionObserver` in `main.js`. Gets class `.visible` → CSS `opacity` + `translateY` transition.
- **Diagonal section dividers:** `.section--wave` uses `clip-path: polygon(0 3%, 100% 0, 100% 97%, 0 100%)`.
- **RSVP card:** Frosted glass via `backdrop-filter: blur(20px)` + semi-transparent background.

## Sections

1. **Envelope intro** — 3D CSS envelope with glowing wax seal; tap/click to open, petals fall
2. **Hero** — couple photo background, italic names with gold glow, glassmorphism countdown, CTA
3. **Our Story** — alternating timeline (desktop), single-column (mobile), scroll-reveal per entry
4. **Location** — venue photo (`venue.jpg`), address, Google Maps link, dress code
5. **Schedule** — day-of timeline with rose time-chips and gold dots
6. **RSVP** — attendance toggle (Yes/No/Maybe), 7 fields, guest stepper, frosted-glass card, petal celebration on submit
7. **Footer** — names, date, ornament

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
- `14th April 2027` — real wedding date
- `[Venue Name]`, `[City]`, `[Street & Number]`, `[ZIP]` — real venue details
- `[VENUE_ADDRESS]` — Google Maps query string
- `WEDDING_DATE` in `js/countdown.js` — real ISO date string
- Story entries — real couple story
- Schedule times and descriptions — real day program
- RSVP deadline date — real cutoff date

## `prefers-reduced-motion`

All animations and transitions are disabled via `@media (prefers-reduced-motion: reduce)` in `animations.css`. Petals are also hidden (`display: none`).
