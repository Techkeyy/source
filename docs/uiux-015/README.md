# UI/UX Directive 015 evidence index

This folder records the local, isolated frontend reconstruction requested in
Creative Director Directive 015. It is evidence for review, not a production
release declaration.

## Verified artifacts

- `reference-inspection.json` — machine-captured inspection of the supplied
  Findor reference at 320, 390, 768, 1280 and 1440px.
- `reference-screenshots/` — real Chromium screenshots of the reference,
  including hover, focus and sign-up interaction captures.
- `source-screenshots/` — real Chromium screenshots of Source's reconstructed
  landing page, error/loading states, profile evidence review, all four
  customer types, live results, proposal, save/refresh recovery and
  logout/login recovery.
- `uiux-015-reference-audit.mjs` and `uiux-015-after.mjs` — reproducible local
  browser evidence scripts.

## Decision

The reconstruction is complete as a local/preview vertical slice and passes
the real local browser journey. It is not merged, pushed, or deployed from
this branch. The owner/director must review the rendered screenshots and the
known protected-backend limitation before authorizing a production release.
