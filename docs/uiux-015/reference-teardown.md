# Reference teardown and baseline findings

## Scope and provenance

The supplied reference was inspected at
`https://laudable-fly-396.convex.site/` in a real Chromium session. The audit
was run with `scripts/uiux-015-reference-audit.mjs` and recorded in
`reference-inspection.json` at `2026-10-14T19:11:38.362Z`.

The reference is treated as a composition and interaction reference only. The
Source implementation does not copy its logo, name, wording, photography,
service taxonomy, code, or proprietary assets.

## Measured reference DNA

- Canvas: `rgb(250, 248, 245)`.
- Primary ink: `rgb(20, 32, 26)`.
- Header: white, bordered, no shadow.
- Body type: Plus Jakarta Sans / Inter fallback, `16px`, `24px` line height.
- Display type: Newsreader / Playfair Display / Fraunces / Georgia fallback.
- Reference h1: `67.2px`, `70.56px` line height, `700` weight,
  `-2.016px` tracking.
- Reference h2: `26.4px`, `31.68px` line height, `700` weight,
  `-0.528px` tracking.
- Layout: white navigation, large split hero, rounded search surface,
  service discovery cards, three-step explanatory section and a quiet privacy
  boundary section.
- Interaction inventory: 14 headings, 20 buttons, 1 text input, 5 sections,
  0 links in the captured DOM, and a sign-up interaction that adds `Create
  your account` without leaving the page.
- Horizontal overflow: false at all required widths: 320, 390, 768, 1280 and
  1440px.
- Reduced-motion probe: the reference reports `0s` for the tested motion
  transition.

## Responsive observations

| Width | Reference document width | Body height | Finding |
|---:|---:|---:|---|
| 320 | 320 | 2880 | Single-column hero and stacked cards; no horizontal scroll |
| 390 | 390 | 2692 | Compact single-column flow; primary action remains visible |
| 768 | 768 | 2197 | Tablet transition; card grids begin to compress |
| 1280 | 1280 | 1699 | Two-column hero and four-column service exploration |
| 1440 | 1440 | 1706 | Full editorial composition with generous whitespace |

## Reference -> Source translation

| Reference principle | Old Source problem observed from the rollback point | Source 015 translation |
|---|---|---|
| Strong editorial hero | Product logic was difficult to parse from the first screen | Direct promise: “Find client opportunities that fit your work.” with a URL-first action |
| Split hero composition | No clear visual explanation of public work to evidence to fit | Original inline SVG pipeline showing `PUBLIC WORK`, `EVIDENCE`, and `FIT` |
| Warm canvas and dark ink | Generic application feel and weak hierarchy | `#FAF8F5` canvas, deep green ink, restrained green action accent |
| Rounded task surfaces | Profile and discovery content read as raw forms | Evidence tray, editable profile card, category cards and opportunity cards |
| Service/category exploration | Customer selection was easy to miss or read as decoration | Four explicit selected/unselected customer-type controls with query impact copy |
| Three-step explanation | Product trust boundary was not obvious | “Bring a public page”, “Review the evidence”, “Investigate fit” story |
| Modal sign-up cue | Account creation was not visually connected to the value proposition | In-page activation card retaining existing auth API contracts |
| Privacy/trust boundary | Source and model limits were easy to miss | Public-page-only copy, grounded/suggestion labels, no-client-guarantee statements |

## Baseline evidence boundary

The reference and reconstructed Source states were captured in real Chromium.
The legacy Source UI screenshot was not successfully re-captured from the
rollback worktree during this phase: Next/Turbopack rejected the temporary
dependency link, and the bounded offline dependency install did not complete.
Therefore this folder does **not** claim a fabricated “before” screenshot. The
old-state column above is based on the recorded product contract and code at
rollback commit `70f8042`, while the “after” state is directly evidenced by
`source-screenshots/`. This is a P1 evidence gap for the next director review.
