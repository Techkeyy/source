# Directive 029 — Reach false-match regression

**Date:** 2026-10-16 (Africa/Lagos)  
**Branch:** `codex/directive-029-reach-regression`  
**Base:** `53a24e72543f6ed300996a62d711b93b7f48ce4c` (verified production merge)  
**Production:** unchanged; no merge, push, or Render deployment performed

## Root cause

The failing Reach result was caused by four independent weaknesses in the local discovery path:

1. A confirmed profile had no offering type or business objective, so a product page could enter the service-provider/job-search path.
2. `profileTerms()` expanded phrases into generic single words, and `evaluateOpportunity()` used substring/token overlap. Words such as `people`, `human`, `between`, `test`, `service`, `project`, and `work` could therefore look like compatibility evidence.
3. Category language could satisfy the qualifier when no actual profile offering term matched.
4. Remote OK used a fixed generic `dev` tag instead of a confirmed service term.

The displayed Reach rationale, `between, people, test, human`, was not evidence of payment-product compatibility. It was generic lexical overlap.

## Correction

- Added a reviewable offering suggestion: `service-provider`, `product-owner`, or `unclear`.
- Added a confirmed, persisted `offeringType` and `discoveryObjective` with backward-compatible optional fields for existing records.
- New confirmations require a consistent intent pair:
  - service provider → `external-services`
  - product owner → `product-users`
- Reach’s public page is inferred as a product suggestion from its payment, passkey, and test-token evidence. The owner must confirm or correct that suggestion before discovery.
- Product owners use product-relevant demand discovery and skip Jobicy, Remote OK, and SerpApi job feeds. Product results require product-need evidence and meaningful offering overlap.
- Matching now uses meaningful exact phrases/tokens, excludes generic terms, requires actual offering overlap for every accepted result, and leaves category terms as prioritization evidence only.
- Remote OK uses a meaningful confirmed service term instead of a fixed `dev` query.
- Promotional GitHub company roundups are rejected at the adapter boundary so they cannot appear as active external requests.

## Browser evidence

The local app was exercised in a real browser using disposable accounts.

### Reach product-owner path

Source analyzed the actual public page:

`https://reach-seven-lemon.vercel.app/`

The grounded profile showed Reach as a passkey-powered payment product using test tokens. The review screen displayed the product-owner suggestion and allowed the owner to confirm:

- Offering: product, app, or tool
- Objective: potential users, pilots, or relevant use cases

After confirmation, the profile was persisted. Discovery showed:

`Hacker News: queried · Contracts Finder: queried · Jobicy: skipped · Remote OK: skipped · GitHub: queried · Reddit: skipped · SerpApi: skipped`

The first run exposed an unrelated GitHub false positive caused by the generic token `made`. That token was added to the generic exclusion boundary and the browser search was rerun. The final result was the honest empty state:

`No current match passed the evidence rules.`

The original BlueTuskr-style graphic-design contractor cannot pass the corrected product-owner gate. The Reach profile and objective were also recovered after logout and login.

The local browser control used for this run did not expose an exact viewport override, so 320px and 390px screenshots were not claimed as verified. The correction adds a compact review card without changing the approved layout system; exact-width mobile UAT remains a Director pre-promotion check.

### Service-provider path

Source analyzed the real public web-development agency page:

`https://www.netguru.com/`

The page was suggested as a service provider, the owner confirmed the external-services objective, and the service-provider discovery path queried the active-request sources. After the promotional GitHub roundup was rejected, no current result was accepted from that live search, which is preferable to labeling that article as a buyer request.

The corrected service path remains positively covered by the real DeepSeek-backed core acceptance run, which found a current Contracts Finder `explicit-project-request` with two meaningful profile matches and exercised save, proposal generation/editing, logout/login recovery, and ownership isolation.

## Procurement source evidence

The existing official Contracts Finder OCDS probe passed on 2026-10-16:

- Public endpoint returned HTTP 200 without authentication.
- 100 recent tender releases were returned.
- 59 service-related notices contained complete buyer, deadline, status, scope, and official notice URL evidence.
- Northampton College `CA18543` was not present in the current 45-day page and is not claimed as a current/open candidate.
- The probe recorded real current examples, including the North East Autism Society managed IT and cyber-security supplier pre-qualification notice.

The probe continues to document that detailed eligibility and selection requirements require inspection of the official notice documents and that a tender is not a guarantee of eligibility or award.

## Verification results

| Check | Result |
|---|---|
| Typecheck | Passed |
| ESLint | Passed with zero warnings |
| Unit and regression tests | 4 files, 26 tests passed |
| Production build | Passed |
| Live discovery probe | Passed |
| Contracts Finder probe | Passed; 59 complete service evidence records |
| Core DeepSeek account/proposal acceptance | Passed |
| Ownership and account isolation probe | Passed |
| Disposable local UAT cleanup | Passed; 2 created accounts and 2 profiles removed |

## Release recommendation

**HOLD.** The corrective branch is tested locally, but Directive 029 explicitly prohibits merging or deploying without Director approval. Production remains on the existing verified release and no production data, secrets, provider configuration, or infrastructure was changed.
