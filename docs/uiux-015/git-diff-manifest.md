# Git diff manifest

## Branch and rollback

- Active branch: `codex/uiux-015-findor-reconstruction`.
- Branch base / rollback point: `70f8042550cfbf28b15bc5adbf969a9baa48bd40`.
- Verified implementation commit: `80e8f248e767d0c625f4c1c5c18e732f74ce8f83`.
- The branch was created from the pre-014A known-good point; rejected 014A UI
  changes are not part of this branch.
- No push, merge or production deployment is authorized by this phase.

## Files intentionally changed

- `src/components/SourceApp.tsx` — complete frontend reconstruction, preserved
  API calls and added evidence-led UI stages.
- `src/app/globals.css` — Source 015 tokens, layout, responsive rules, focus
  states and reduced-motion behavior.
- `scripts/uiux-015-reference-audit.mjs` — real Chromium reference audit.
- `scripts/uiux-015-after.mjs` — real Chromium local journey and screenshot
  evidence.
- `docs/uiux-015/**` — Directive 015 evidence and handoff artifacts.

## Files intentionally not changed

No backend route, schema, auth, SSRF, AI provider, discovery adapter,
database, secret, Render blueprint or production configuration file was
modified for the visual reconstruction.

The exact command `git diff --name-only
70f8042550cfbf28b15bc5adbf969a9baa48bd40..80e8f248e767d0c625f4c1c5c18e732f74ce8f83`
returned 48 paths: `director.md`, the `docs/uiux-015/` evidence set, the two
`scripts/uiux-015-*.mjs` browser audits, and only
`src/app/globals.css` / `src/components/SourceApp.tsx`. No backend, auth,
database, provider, secret or deployment file appeared.
