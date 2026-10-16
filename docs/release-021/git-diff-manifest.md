# Directive 021 Git Manifest

## Branch and rollback

- Branch: `codex/release-021-defect-correction`
- Base/deployed rollback: `6cbe759b16ae775a13d122abb3d9686b69d73877`
- Existing local HEAD before this branch's commit: `7f29a4ea7872c3337c8bb52b63383a9432401d20`
- `.git/index.lock`: absent during inspection; no lock was deleted.
- Production deployment: not performed.

## Intended changed files

- `src/app/layout.tsx` — responsive viewport metadata.
- `src/app/globals.css` — scoped narrow-screen layout and eligibility note styles.
- `src/components/SourceApp.tsx` — eligibility/availability boundary copy.
- `src/lib/discovery.ts` — external text normalization boundary.
- `src/lib/text.ts` — new targeted mojibake repair helper.
- `tests/text.test.ts` — focused text-boundary regression tests.
- `director.md` — persistent handoff update.
- `docs/release-021/*` — evidence and limitations.

## Protected paths inspected and untouched

No files under `src/app/api/`, `src/lib/auth.ts`, `src/lib/db.ts`,
`src/lib/ssrf.ts`, `src/lib/gemma.ts`, `src/lib/profile-workflow.ts`, or
`render.yaml` were changed by this directive.

No production credentials, `.env.local`, database records, Render settings,
or Atlas network settings were changed.
