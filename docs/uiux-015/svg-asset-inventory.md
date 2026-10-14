# SVG asset inventory

All new visual symbols are inline SVGs in
`src/components/SourceApp.tsx`; no external icon package or copied reference
asset was introduced.

## System icons

`arrow`, `briefcase`, `check`, `chevron`, `clock`, `edit`, `external`, `file`,
`globe`, `lock`, `menu`, `search`, `shield`, `spark`, `target`, `users`, and
`x` are rendered by the shared `Icon` component. Each icon has a fixed viewBox,
inherits the current text color, and is marked decorative where its adjacent
text already supplies the accessible name.

## Brand and hero artwork

- `SourceLogo` is an original inline mark and wordmark used in public and app
  headers.
- `HeroArtwork` is an original illustrated sequence of a public page, evidence
  card and fit card connected by curves. It contains no customer counts, named
  logos, stock photography or claim of actual search results.
- SVG IDs are namespaced with `source-` prefixes for gradients and filters.

## Accessibility decisions

- Decorative illustrations use `aria-hidden="true"`.
- Interactive icon-only controls carry an explicit `aria-label`.
- Text buttons retain visible labels in addition to icons.
- The URL onboarding label is an actual `<label htmlFor="source-url">`, not a
  visual-only span.
