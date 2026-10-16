# Directive 021 — Release-Fix Evidence

Date: 2026-10-16 (Africa/Lagos)

## Release identity

- Branch: `codex/release-021-defect-correction`
- Production remains on: `6cbe759b16ae775a13d122abb3d9686b69d73877`
- Release-fix base before edits: `7f29a4ea7872c3337c8bb52b63383a9432401d20`
- Tested release-fix commit: `054f966350d80d8e245bbda3baeafbc67de553a6`
- Production deployment: unchanged; no Render action was taken.
- Rollback point: the existing deployed commit `6cbe759b16ae775a13d122abb3d9686b69d73877`.

## Scope completed

Directive 021 limited this branch to three defects:

1. narrow-screen landing layout clipping;
2. missing eligibility/availability boundary on opportunity cards; and
3. mojibake from an external opportunity feed.

No AI provider, database schema, authentication contract, discovery ranking,
production secret, or deployment configuration was changed.

## Root causes and corrections

| Defect | Proven root cause | Correction | Evidence |
| --- | --- | --- | --- |
| Mobile clipping | `src/app/layout.tsx` did not declare a device-width viewport. In addition, the mobile stylesheet intentionally expanded `.hero-art` to 108%/116% and allowed the headline to grow beyond the narrow content box. | Added Next.js `Viewport` metadata (`width: device-width`, `initialScale: 1`); constrained the hero artwork to its content width; reduced narrow headline growth; tightened the mobile nav gap/padding. | Live Chromium reports `innerWidth: 319`, document `scrollWidth: 304`, hero width `287.53`, heading `scrollWidth: 288`, and no horizontal overflow on the 320-class surface. The retained PNG artifacts are listed with their evidence limitation below; they are not exact CSS-viewport proof. |
| Eligibility visibility | Source had classification evidence, but the card did not state that location, schedule, or availability eligibility was unverified when source restrictions were outside the user profile. | Added a truthful, generic card note directing the user to the original listing. No eligibility engine or inferred restriction was added. | Live BlueTuskr card showed `Eligibility is not verified by Source...` while retaining the original-source link and `freelance-or-contract` classification. |
| Corrupted external characters | Remote OK returned HTTP 200 and valid JSON, but its parsed BlueTuskr description already contained `U+00E2 U+0080 U+0094` (`â`) for an em dash. JSON decoding and React rendering were not the source of corruption. | Added `normalizeExternalText()` at external-feed normalization. It repairs only recognizable UTF-8-as-Latin-1 clusters and preserves ordinary Unicode; invalid candidates are left unchanged. | Byte-level source test: status 200, content type `application/json`, Latin-1 bytes `e2 80 94`, repaired output `—`. Live discovery rendered the em dash correctly. |

## Real browser acceptance

The supported Kane browser runner could not start because its Bash service
returned `E_ACCESSDENIED` before browser launch. The skill-prescribed fallback
was used: the in-app Chromium connector plus local Chromium screenshot capture.

The live Chromium path completed on the in-app connector's 319px
scrollbar-adjusted narrow surface, which is the available 320-class check:

1. disposable registration;
2. live `https://www.frog.co/` analysis;
3. grounded profile review with five cited claims;
4. profile edit and confirmation;
5. selection of startups, small businesses, agencies, and individuals;
6. category-aware live discovery;
7. BlueTuskr source-linked result inspection;
8. eligibility boundary display;
9. proposal generation, edit, and explicit draft save;
10. logout, login, confirmed-profile recovery, saved-opportunity recovery, and exact edited-proposal recovery.

The browser saw the live BlueTuskr description with a correct em dash, not
`â`. The source link resolved to:

`https://remoteok.com/remote-jobs/remote-graphic-designer-video-editor-bluetuskr-1137507`

All disposable records were removed by the acceptance scripts.

Exact 390px visual acceptance remains open. The retained `landing-320.png`
and `landing-390.png` files are unaltered Chromium shell artifacts, but the
standalone screenshot process applied a platform CSS viewport floor of about
490px despite the requested sizes. Their bitmap dimensions are 980x3675 and
1194x3675 respectively, so they must not be represented as exact 320px or
390px CSS viewport evidence. The in-app connector later became unavailable
because its kernel assets could not be written, and Kane CLI could not start
because its Bash service returned `E_ACCESSDENIED` (its direct authentication
token was also expired). An authenticated real Chromium/Kane run at exact
390px is still required.

## Technical gates

| Gate | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 4 files, 13 tests |
| `npm run build` | PASS — Next.js 16.4.0 production build |
| `npm run probe:mongodb` | PASS — ping/insert/read/delete/cleanup |
| `npm run probe:ownership` | PASS — isolation and cleanup |
| `npm run probe:gemma -- https://www.frog.co/` | PASS — actual provider `deepseek`, model `deepseek-flash`, HTTP 200, 3/3 grounded claims |
| `npm run probe:discovery` | PASS — 3 providers queried; Vytalize regression remained `full-time-employment` |
| `npm run probe:core` | PASS — profile, discovery, proposal, recovery, malformed requests, and ownership |

The probe outputs were redacted by omission: no API key, password, session
secret, MongoDB URI, or private account identifier was recorded here.

## Release decision

This branch is a tested local release candidate for Director review. It is
**not merged, deployed, or declared final**. The production service and
auto-deploy state remain unchanged. Exact 390px visual evidence, owner UAT,
and Director approval remain open. A Director must approve the revision before
any controlled deployment.
