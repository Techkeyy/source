# Source 015 design tokens

These tokens are implemented in `src/app/globals.css` and are intentionally
small enough to be reused across the public and authenticated surfaces.

## Color

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#FAF8F5` | Editorial page canvas |
| `--surface` | `#FFFFFF` | Cards, header and controls |
| `--ink` | `#14201A` | Primary text and display headings |
| `--muted` | `#59665F` | Supporting copy and metadata |
| `--line` | `#DDE5DF` | Borders and separators |
| `--accent` | `#007C5C` | Primary actions and verified signals |
| `--accent-deep` | `#005843` | Hover and strong action states |
| `--mint` | `#D5F2E6` | Verified surfaces and soft action backgrounds |
| `--lavender` | `#ECE9F8` | Contract classification accent |
| `--signal` | `#A66A08` | Unconfirmed/attention state |
| `--danger` | `#A43D34` | Error state |

## Typography

- Display: `Newsreader, Georgia, serif`; used for page-level and card-level
  editorial headings.
- Interface: `Plus Jakarta Sans, Inter, ui-sans-serif, system-ui, sans-serif`;
  used for labels, forms, metadata and body copy.
- Body target: `16px / 1.5`.
- Lead copy target: `18px / 1.55`.
- Label target: `11px`, uppercase, `0.12em` tracking.
- Mobile display heading: clamp-based size capped to avoid overflow.

## Shape, spacing and motion

- Radius: `12px` controls, `18px` cards, `24px` large surfaces, `999px`
  pills.
- Spacing is based on 4px increments with 8/12/16/24/32/48/64px anchors.
- Shadow is reserved for elevation of primary cards and the hero artwork.
- Focus uses a visible two-layer outline with the accent color.
- Motion is disabled through `prefers-reduced-motion: reduce`.
- Touch targets are padded to at least 44px for primary controls and icon
  buttons.
- Layout uses 980px, 700px and 520px breakpoints; the test run showed no
  horizontal overflow at 320, 390, 768, 1280 or 1440px.
