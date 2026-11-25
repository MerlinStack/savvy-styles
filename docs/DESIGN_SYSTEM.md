# Savvy Style — Design System

## Concept

**Quiet editorial luxury.** The site should read like a small, carefully
art-directed footwear house — not a marketplace. Space, proportion and
typography carry the premium signal; motion supports them and never substitutes
for them.

Guiding phrase: *Home to the classy.*

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#191511` | Primary text, dark sections, buttons |
| `ink-soft` | `#2A241D` | Raised dark surfaces |
| `espresso` | `#3A2E23` | Warm dark accents |
| `ivory` | `#F5F0E7` | Page background |
| `paper` | `#FBF8F2` | Cards, elevated surfaces |
| `sand` | `#E8DFD1` | Secondary surfaces, image mats |
| `stone` | `#9A8F80` | Muted labels |
| `gold` | `#A9865A` | Fine rules, accents, italic emphasis |
| `gold-deep` | `#8C6D45` | Small text on light backgrounds |
| `line` | `#D8CEBF` | Hairline borders |

Rules:

- Gold is an accent, never a background wash or a body-text colour.
- No pure black (`#000`) or pure white (`#FFF`).
- Gradients are restricted to photographic overlays for legibility.
- Dark sections use `ink`, not black.

## Typography

- **Display:** Instrument Serif (400, normal + italic).
- **Interface/body:** Instrument Sans (variable).

Editorial serif is used for section titles, product names and statements.
Italic serif is reserved for emphasis — one or two words, not whole paragraphs.
Sans-serif handles navigation, labels, body copy, forms and all admin UI.

Scale (fluid where noted):

| Role | Size |
| --- | --- |
| Hero | `clamp(3.25rem, 8.2vw, 8.5rem)` / 0.9 line-height |
| Page title | `clamp(2.75rem, 5vw, 5rem)` |
| Section title | `clamp(2rem, 3.4vw, 3.5rem)` |
| Product name | `1.25–1.5rem` serif |
| Body | `0.9375–1.0625rem` / 1.7 |
| Eyebrow | `0.6875rem` / uppercase / `0.28em` tracking |

Body copy should not exceed ~68 characters per line. Product descriptions use a
narrower measure.

## Layout and space

- Max content width: `90rem` (1440px).
- Gutters: 20px mobile, 32px tablet, 48px desktop.
- Section rhythm: 80–128px vertical on desktop, 56–80px on mobile.
- 12-column desktop grid; asymmetrical spans are preferred over equal cards.
- Borders are 1px hairlines. Corners are square or 2px maximum.
- Shadows are rare; depth comes from surface contrast and photography.
- Mobile layouts are composed deliberately: full-bleed imagery, stacked
  editorial blocks, 2-column product grids where legibility allows.

## Components

### Buttons

- Primary: ink fill, ivory label, square corners, 1px inset feel on hover.
- Secondary: transparent with ink hairline; fills on hover.
- Text link: sans, small caps feel, animated underline in gold.
- Minimum target height: 44px. Disabled states remain legible.

### Product card

- 4:5 image field on a `sand` mat.
- Availability label as a small uppercase marker, never a loud pill.
- Wishlist control top-right, visible on touch.
- Hover: 1.04 image scale, a thin gold rule and a “View” cue. No card lift.
- Name in serif, price in sans with currency code available.

### Forms

- Labels above fields, 12px uppercase tracking; no placeholder-only labels.
- 1px line fields on paper; focus ring gold with 2px offset.
- Errors are text plus icon, never colour alone.

### Drawers and dialogs

- Cart drawer from the right; max width 30rem; full height.
- Backdrop `ink/40` with blur restrained to 2px.
- Focus trapped, Escape closes, focus returns to the trigger.
- Mobile navigation is a full-screen ink panel with oversized serif links.

## Motion

Motion language: **measured, weighted, quiet.** Entrances use a single
`cubic-bezier(0.22, 1, 0.36, 1)` curve, 400–800ms. Interaction feedback is
120–200ms. Nothing bounces.

- **GSAP:** hero image reveal, restrained scroll parallax, editorial section
  reveals with ScrollTrigger.
- **Framer Motion:** drawers, dialogs, menu, wishlist/cart feedback, small
  component transitions.
- **CSS:** marquee, hover states, page-enter fade.
- No scroll hijacking, no pinned sections that trap the reader, no layout-shift
  animation, no animating `width`/`height`/`top`/`left` where transform works.
- `prefers-reduced-motion: reduce` removes parallax, marquee and entrance
  transforms. Content is always present in the DOM.

## Imagery

The owner supplies final product photography. Until then, development fixtures
use licensed editorial footwear photos, clearly recorded in `CREDITS.md` and
disclosed in the footer. Fixtures are never presented as current stock.

Art direction for final assets:

- consistent warm-neutral backgrounds or environmental street shots;
- 4:5 portrait crops for catalogue; 3:2 for editorial;
- soft directional light, honest colour, no heavy filters;
- one clean product-led frame plus one detail/on-foot frame per variant where
  possible;
- alt text describes the product and colour, not marketing copy.

## Voice

Confident, spare, unhurried. Short declaratives. No exclamation marks, no
“shop now!!”, no discount language in the premium surfaces. The tagline is used
as a sign-off, not a headline repeated everywhere.

Examples:

- “Footwear, considered.”
- “The art of arrival.”
- “A quieter kind of presence.”
- “Selected for shape, finish and the way they carry a room.”

## Accessibility

- Semantic landmarks and heading order.
- Visible gold focus rings on every interactive element.
- Contrast checked for all text pairings; gold is not used for small text on
  ivory unless it is `gold-deep`.
- Dialogs labelled, keyboard operable; drawers close on Escape.
- Form errors announced and tied to inputs.
- Images have meaningful alt text; decorative rules are hidden.
- Motion respects system preference.
