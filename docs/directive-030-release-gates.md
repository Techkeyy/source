# Directive 030 — Reach relevance correction release gates

Updated 2026-10-17 (Africa/Lagos). This is local evidence for the bounded
correction branch `codex/directive-029-reach-regression`. The prior production
release was left unchanged.

## Gate 1 — Existing-profile compatibility

**PASS locally.** A disposable legacy Reach-style product profile and a
disposable legacy service-provider profile were written through the
backward-compatible profile update route without `offeringType` or
`discoveryObjective`. Both profiles remained readable. A new search from each
returned HTTP 422 with `DISCOVERY_INTENT_REQUIRED`; neither silently entered
service-provider discovery.

The same probe confirmed server-side objective enforcement: a confirmed
product-owner profile that requested `active-requests` was forced to
`potential-customers`, with Jobicy, Remote OK, and SerpApi skipped. The client
request mode cannot bypass the confirmed product objective.

Probe result: `npm run probe:directive-030-compat` — PASS. The disposable
accounts and records were deleted.

## Gate 2 — Live browser evidence

**PASS for the required negative and positive examples.** The normal local
browser flow used real public pages and live sources; no result was injected.

### Negative: Reach

- Source URL: https://reach-seven-lemon.vercel.app/
- The grounded profile described Reach as a passkey-powered payments product.
- The owner confirmed `product-owner` and `product-users`.
- The results view explicitly showed `Potential customers + research leads`.
- Jobicy, Remote OK, and SerpApi were skipped; Hacker News, Contracts Finder,
  GitHub, and Reddit were represented by their actual provider statuses.
- No result passed the product evidence rules. Unrelated freelance jobs and
  generic project signals were not upgraded into customer opportunities.

### Positive: Mindshare → Northampton College

- Service-provider URL: https://www.mindshareworld.com/
- The grounded page evidence described a global media agency network and media
  experiences. The owner confirmed `service-provider` and
  `external-services`, then explicitly added the accurate service term
  `media planning and buying`; that edit is visibly marked as user input, not
  page verification.
- The normal results view surfaced the live Contracts Finder notice
  [CA18543 — Northampton College — Media planning & Buying Services](https://www.contractsfinder.service.gov.uk/Notice/d2301388-4ca6-48fc-805d-eb2e5793377e).
- The card showed buyer `Northampton College`, `Active request`, the
  source-backed media-planning scope, official notice URL, published date,
  deadline `4 November 2026`, open-procedure status, SME suitability, and the
  official tender route. It also kept eligibility, selection, award, and
  response uncertainty visible.
- The official notice page was opened independently and confirmed the active
  status, £250,000 value, 4 November 2026 closing date, open procedure, SME
  suitability, and supplier application route.

The same service-provider search also displayed unrelated Jobicy cards whose
source text was not a genuine media-service request. Those were not used as
positive evidence; the Northampton College Contracts Finder card is the only
claimed positive example. This remaining source-noise limitation is recorded
for owner UAT and is not silently treated as solved.

## Gate 3 — Exact mobile verification

**HOLD / FAIL at 320px; PASS at 390px.** Installed Chrome DevTools was used
with an isolated profile and exact CSS device metrics.

| Viewport | Profile card | Results view | Measured document/body width | Result |
| --- | --- | --- | --- | --- |
| 390px | Rendered | Rendered, including CA18543 | document 375px; no horizontal overflow | PASS |
| 320px | Rendered | Rendered, including CA18543 | document 342px / body 343px | FAIL — horizontal overflow |

At 320px, the authenticated header’s `Sign out` control extended beyond the
layout viewport (`right ≈ 342.84px` while `innerWidth = 320px`). The results
view also showed a horizontal scrollbar. This is a release-blocking mobile
defect. No CSS redesign was made under this directive.

## Promotion decision

**HOLD.** Gate 1 and the live negative/positive discovery checks pass, but the
exact 320px gate fails. Therefore this branch was not merged into `main`, not
pushed, and not deployed to Render. Production remains on the previously
accepted revision. No production accounts, secrets, infrastructure, or
Render settings were changed.

The local correction and compatibility probe remain committed for review. A
separate, explicitly approved mobile-only correction is required before any
controlled promotion. Do not claim Source is a proven customer-acquisition
engine based on these checks.
