# Developer Guide

## 1. Overview

- Direction: RTL (`<html lang="ar" dir="rtl">`). Layout uses CSS grid/flex and logical properties, so it mirrors correctly.
- Responsive: fluid (`clamp()`, `minmax()`, auto-fit grids). Main breakpoint: **820px** (header link bar hides, drawer menu remains). No fixed-width layout.
- Every page repeats the same **header + side drawer** and **footer** markup. If you move to a templating system, extract them as partials (they are identical on all pages except `aria-current="page"` on the active link).
- The icon sprite (`<svg><defs>…`) at the top of each page is shared too; icons are used as `<svg class="i"><use href="#i-phone"/></svg>`.

## 2. CSS (`css/styles.css`)

Sections are numbered in the file header: Fonts, Tokens, Base, Layout, Components, Header/Drawer, Footer, Pages, Reveal animation, Reduced motion.

### Design tokens (`:root`)

| Token | Value | Use |
|---|---|---|
| `--black` | `#000` | page background |
| `--ink` / `--ink-soft` / `--ink-mute` | `#f4f6f4` / `#c9d0c9` / `#9aa39a` | text levels |
| `--green` | `#2db34a` | brand green: borders, buttons, markers |
| `--green-bright` | `#3fd45c` | green text, hover |
| `--green-deep` | `#0a5c1b` | filled stat cards |
| `--surface`, `--line`, `--line-2` | dark greens/greys | cards, dividers |
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | all motion |
| `--pad-x` | `clamp(16px,4vw,48px)` | horizontal page padding |

### Reusable classes

`.section`, `.wrap` (1000px content column), `.label` + `.diamond` (section marker), `.circled` (word circled in green), `.btn` (+ `--lg`, `--solid`), `.text-link`, `.round` (round icon button/social), `.lift` (hover lift), `.chip`, `.cta`, `.pill-nav`.

### Typography

Bahij TheSansArabic, three static weights mapped by range: Light (100–350), Plain (351–599), Bold (600–900). The font files are TrueType; converting them to WOFF2 (e.g. `woff2_compress`) will reduce size — update the three `@font-face` rules.

## 3. JavaScript (`js/main.js`)

One IIFE, no globals, no dependencies. Each feature self-initialises only if its markup exists on the page.

1. **Scroll reveal** — elements with `data-reveal="up|fade|zoom|spin"` animate in once when scrolled into view. `data-stagger` staggers siblings; `data-delay="ms"` sets a manual delay. The attribute is removed after the entrance so hover transitions work normally. The `js` class on `<html>` (set by an inline script in `<head>`) means content is fully visible if JavaScript is off.
2. **Side drawer** — `[data-drawer-open]` opens `#drawer`; `[data-drawer-close]` (button, overlay) or **Esc** closes it. Locks body scroll, manages `aria-expanded` / focus.
3. **Hero video** — autoplays muted and inline (works on iOS/Android); retries on first touch/scroll if the browser blocks autoplay (e.g. low-power mode). Format: WebM with PNG poster. **Safari/iOS < 15 may not play WebM — add an MP4 `<source>` if you need older Apple devices.**
4. **Journeys rail** (`[data-rail]`) — moves continuously and slowly (right to left). Speed: `SPEED` constant (px/frame; lower = slower). Pauses while the pointer is over a card, while a card has keyboard focus, and while dragging. Arrow buttons jump with easing; the filter buttons (`[data-filter]`) rebuild the loop from the cards' `data-cat`. Users with *reduced motion* get no automatic movement (arrows/drag still work). Cards are duplicated in JS to make the loop seamless; duplicates are `aria-hidden`.
5. **Detail gallery** (`[data-gallery]`) — CSS scroll-snap strip; arrows and dots in JS.
6. **Contact form** — see BACKEND-INTEGRATION.md.

## 4. Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, labelled icon buttons, visible `:focus-visible` outline.
- Drawer is a modal dialog (`role="dialog"`, `aria-modal`), closes with Esc.
- `prefers-reduced-motion` disables reveal animations and the rail's auto-movement.
- Contrast: body text on black ≥ 4.5:1. Muted text (`--ink-mute`) is used only for secondary captions.
- Add real `alt` text when replacing placeholder images (currently project/person names).

## 5. Browser support

Current Chrome, Edge, Firefox, Safari (desktop + mobile). The rail's dimming of sibling cards uses `:has()` (Safari 15.4+, Chrome 105+, Firefox 121+); on older browsers it simply doesn't dim.

## 6. Performance notes

- Client logos and below-the-fold images use `loading="lazy"`.
- The hero video is ~3 MB; keep it muted/looped. Consider a lower-bitrate variant for mobile if needed.
- No third-party requests except the placeholder images (`placehold.co`), which go away when real images are added.
