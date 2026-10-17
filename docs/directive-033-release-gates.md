# Directive 033 — Reach semantic matching and cross-objective release gates

Updated 2026-10-17 (Africa/Lagos). This document records the bounded P0
correction on `codex/directive-033-semantic-product-matching` before controlled
promotion.

## Root cause

Product-owner discovery was server-forced into `potential-customers`, but the
provider fan-out still queried Contracts Finder. The evaluator then treated
profile/source token overlap and a broad product-need regex as compatibility.
That allowed a product brand such as Reach, generic payment words, and unrelated
service-procurement notices to cross the product/customer boundary.

The correction is deliberately narrow:

- Product-owner compatibility uses grounded capability phrases from confirmed
  claims, not `businessName` or generic search vocabulary. The current Reach
  capability fixtures require specific relationships such as passkey + payment,
  peer-to-peer + payment, claim-link + payment, or test-token + payment in both
  the profile evidence and source text.
- A concrete evaluation, adoption, pilot, integration, workflow, or similar
  use-case signal is still required.
- Contracts Finder is skipped for product-owner discovery with an explicit
  provider explanation and is rejected again at evaluation as defense in depth.
  Service-provider discovery continues to query Contracts Finder.
- Result-card content now shrinks and wraps at small widths; no horizontal
  overflow is hidden or clipped.

## Required regression matrix

Unit tests cover rejection of Northampton media buying, Department for
Education's Oracy panel, BlueTuskr graphic design, generic GitHub work,
brand-name-only overlap, incidental payment words, and passkey/payment words
that are unrelated in context. They also cover:

- a synthetic product evaluator explicitly seeking passkey peer-to-peer payment
  and claim-link flows;
- a live-shaped specialized media-buying procurement positive;
- a genuine freelance media-buying positive;
- rejection of a branding-only profile against specialized media buying.

The synthetic product evaluator is test evidence only. It is not a live
prospect and is not presented as one.

## Local acceptance evidence

- Legacy Reach-style and service-provider profiles remain readable but require
  explicit offering/objective confirmation before search.
- A client request for active jobs cannot bypass the confirmed product
  objective server-side.
- Product-owner provider status: Hacker News queried, Contracts Finder skipped,
  Jobicy skipped, Remote OK skipped, GitHub queried, Reddit skipped, and SerpApi
  skipped.
- Service-provider provider status: Contracts Finder queried.
- Real Reach browser journey (`https://reach-seven-lemon.vercel.app/`): product
  mode selected, Contracts Finder skipped, 0 active requests, 0 potential
  customers, and 0 research signals. Northampton, Oracy, and unrelated
  brand/payment signals were not surfaced.
- Real Mindshare browser journey (`https://www.mindshareworld.com/services`):
  live Northampton College CA18543 was surfaced as an active request with
  buyer identity, active status, future deadline, official notice/application
  URL, and an explicit limitation that detailed selection criteria remain in
  the official notice documents.
- The branding-only service profile did not qualify Northampton's specialized
  media-buying notice.
- Exact browser measurements at 320px and 390px passed on profile-confirmation,
  product-results, and service-results screens. Document and body widths equal
  the viewport at both widths; Sign out remained visible and within bounds.
- Disposable browser/probe accounts were removed after each run.

## Verification commands

The final local run passed:

- `npm run typecheck`
- `npm run lint` with zero warnings
- `npm test -- --run` — 4 files, 33 tests
- `npm run build`
- `npm run probe:directive-030-compat`
- `npm run probe:discovery`
- `npm run probe:contracts`
- `npm run probe:core`
- `npm run probe:ownership`
- `npm run probe:directive-033-browser`

The final merge and deployment identifiers, production acceptance, and rollback
target are appended below after controlled promotion. No hackathon entry is
published by this correction.

## Controlled promotion status

- The normal merge was pushed to GitHub `main` as
  `b8c27b267e82b20765be410bd281a4cabfbb0494`:
  [GitHub commit](https://github.com/Techkeyy/source/commit/b8c27b267e82b20765be410bd281a4cabfbb0494).
- No Render deployment was initiated in this run. The authenticated dashboard
  connector failed during initialization, so no deployment ID or deployed SHA
  is invented.
- Last verified live runtime before this correction remains
  `1be26da3366c9ddbbd49018ec0cbbdab3ce8795e`; its verified immediate rollback
  target remains `53a24e72543f6ed300996a62d711b93b7f48ce4c`.
- Automatic deployment remains disabled. Production acceptance for this new
  SHA is therefore still pending and the release is **HOLD** until the owner
  manually deploys the exact merge SHA and repeats Reach negative, service
  positive, persistence/isolation, and 320/390 checks.
