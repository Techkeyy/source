# Directive 031 — Release gates

Updated 2026-10-17 (Africa/Lagos). This record covers the bounded mobile-header
and Jobicy relevance correction on `codex/directive-029-reach-regression`.

## Production identity before promotion

Render was inspected from the existing authenticated service dashboard before
any merge or deployment:

| Item | Verified value |
|---|---|
| Service | `source` / `srv-db7rok8473hc739m4cvg` |
| Live deployment | `dep-db918lmq1p3s739n88dg` |
| Live commit | [`53a24e72543f6ed300996a62d711b93b7f48ce4c`](https://github.com/Techkeyy/source/commit/53a24e72543f6ed300996a62d711b93b7f48ce4c) |
| Immediate predecessor and rollback target | [`64807d1ce7da0c036949d430a0627c9878770323`](https://github.com/Techkeyy/source/commit/64807d1ce7da0c036949d430a0627c9878770323), deployment `dep-db8tm949v7es73drf4tg` |
| GitHub `origin/main` before merge | `168689760751e7d20aca274c0ffade63bc5b054f` |
| Automatic deployment | Disabled; Render explicitly reports that auto-deploy is disabled and the service was rolled back to a previous deploy. |

The earlier `64807d1…` and `53a24e7…` reports therefore refer to different
Render deployments. The live service was `53a24e7…`; the directly preceding
deployment, not the older `6cbe759…` release, is the correct immediate rollback
target.

## Gate 1 — exact mobile header geometry

The pre-fix failure was reproduced in installed Chrome DevTools with a real
authenticated local Source session at exactly 320 CSS pixels:

| Measurement | Before | After |
|---|---:|---:|
| Viewport width | 320 | 320 |
| Document width | 342 | 305 |
| Body width | 343 | 305 |
| Header content width | 304.896 | 304.896 |
| Brand right edge | 290.928 | 121.656 |
| Sign-out left edge | 314.928 | 235.572 |
| Sign-out right edge | 342.840 | 288.888 |
| Sign-out width | 27.912 | 53.316 |
| Horizontal overflow | Yes | No |

The cause was a selector mismatch. The mobile rule targeted `.app-brand em`,
but the authenticated header uses `.app-nav .brand`; the nonessential
“Customer discovery” label therefore remained in the flex row. The correction
changes that selector to `.app-nav .brand em`. It does not hide overflow, clip
the page, remove the account control, or change the desktop header.

The corrected account control was enabled and fully inside the scrollable
content area. The exact-width state checks were:

| Screen | 320px document/body | 390px document/body | Controls |
|---|---:|---:|---|
| Profile confirmation | 305 / 305 | 375 / 375 | No control exceeded the viewport; Sign out clickable |
| Results | 305 / 305 | 375 / 375 | No control exceeded the viewport; Sign out clickable |
| Saved pipeline | 305 / 305 | 375 / 375 | Real saved CA18543 card visible; action controls in bounds |
| Landing/registration | 305 / 305 | 375 / 375 | Header CTA and registration controls in bounds |

## Gate 2 — Jobicy false-positive correction

The real Jobicy response for the media-planning query contained, among other
records:

- [EMEA Insights Lead, Consumer and Commercial Strategy](https://jobicy.com/jobs/155052-emea-insights-lead-consumer-and-commercial-strategy), company Reddit, `Contract` type. Its body describes an internal Reddit insights role with responsibilities, qualifications, benefits, interviews, and candidate/employment handling.
- [Staff Machine Learning Engineer, Ads Foundational Representations](https://jobicy.com/jobs/155056-staff-machine-learning-engineer-ads-foundational-representations), company Reddit, `Contract` type. Its body describes an internal engineering role, not an external media-planning/buying service request.

These records were not external-service opportunities. The old qualification
path treated a generic `Contract` label plus overlapping words such as
“media”, “planning”, “global”, and “experience” as enough to produce a
freelance-or-contract match. The adapter also did not normalize the current
Jobicy fields (`jobTitle`, `jobDescription`, `companyName`, and array-valued
`jobType`).

The correction normalizes the current public schema and requires a Jobicy
record to contain an external/freelance service signal without recruitment
context before it can qualify. Recruitment evidence such as role,
responsibilities, qualifications, benefits, interview, candidate, workforce,
employee, salary, or application-process language blocks the match. A targeted
regression covers the observed Reddit contract-role shape, and a separate
regression preserves a genuinely project-based freelance media-buying match.

The live local media-planning query returned 43 extracted Jobicy records: 41
were rejected as full-time employment and the two observed Reddit contract
roles were rejected as unsupported customer intent. Qualified Jobicy results:
`0`. Jobicy remains enabled for genuine external freelance/contract wording;
it was not globally disabled.

## Real customer-discovery acceptance

The normal browser journey used the real public [Mindshare services page](https://www.mindshareworld.com/services), explicit service-provider and external-services confirmation, and live public providers.

The active-request result surfaced through the browser was:

- `CA18543 - Northampton College - Media planning & Buying Services`
- Buyer: Northampton College
- Source: Contracts Finder
- Status: `active`
- Deadline: `2026-11-04T12:00:00.000Z`
- Official notice: [Contracts Finder notice](https://www.contractsfinder.service.gov.uk/Notice/d2301388-4ca6-48fc-805d-eb2e5793377e)
- Application route: the same official notice route, which directs suppliers to the published competition route.
- Qualification limitation: SME suitability and open procedure were shown, while detailed selection criteria, eligibility, award, budget, and user-specific response eligibility remained unverified.

The same browser acceptance run also verified Potential Customer and Research
Signal separation, research-only guidance with no draft action, and rejection
of the Northampton specialized media-buying notice after changing the profile
to branding-only. Its observed tier counts were:

| Search | Active Request | Potential Customer | Research Signal |
|---|---:|---:|---:|
| Active requests | 2 | 0 | 0 |
| Potential customers + research | 1 | 7 | 9 |

The core DeepSeek acceptance probe was aligned to this current, mandated real
Mindshare procurement path so persistence and proposal recovery are tested
against a live source with an official contact route. It passed profile
grounding, edited-profile persistence, source-linked save, proposal generation,
proposal editing, logout/login recovery, unauthenticated denial, cross-account
isolation, and malformed-request rejection. The disposable accounts were
deleted after each probe.

## Verification results

| Check | Result |
|---|---|
| Typecheck | PASS |
| ESLint (`--max-warnings 0`) | PASS; zero warnings |
| Unit/regression suite | PASS; 4 files, 30 tests |
| Production build | PASS; Next.js 16.4.0, 13 static pages |
| Discovery probe | PASS; live Hacker News/GitHub evidence and tier boundaries |
| Contracts Finder probe | PASS; public HTTP 200, 100 releases, 62 complete service evidence records |
| DeepSeek core acceptance | PASS; Mindshare/Contracts Finder persistence path |
| Ownership probe | PASS; separate registrations, isolated saved lists, cross-account denial |
| Legacy compatibility | PASS; old Reach-style and service profiles require explicit intent; product job-source bypass blocked |
| Mindshare browser acceptance | PASS; procurement, tier labels, research draft block, branding mismatch rejection |
| Jobicy false-positive regression | PASS; observed Reddit role excluded; genuine project-based contract regression retained |
| Exact 320px/390px checks | PASS; all required screens, no horizontal overflow |
| Production-only npm audit | 0 high, 0 critical, 5 moderate; existing transitive Mastra parser-chain risk remains documented and unremediated |

No application secret, disposable credential, or private record was committed.
No new adapter, AI provider, dependency, infrastructure setting, or production
secret was changed.

## Promotion boundary

This document records the pre-promotion identity and local gates. The final
merge SHA, Render deployment ID/SHA, and post-promotion production UAT must be
appended after the controlled merge and manual Render deployment. If any
critical production check fails, use the verified immediate rollback
`53a24e72543f6ed300996a62d711b93b7f48ce4c` / `dep-db918lmq1p3s739n88dg` and
record the HOLD decision. Do not publish the hackathon entry without owner
authorization.

## Controlled promotion and production acceptance

Promotion completed after the local gates passed:

| Item | Verified value |
|---|---|
| GitHub merge SHA | [`1be26da3366c9ddbbd49018ec0cbbdab3ce8795e`](https://github.com/Techkeyy/source/commit/1be26da3366c9ddbbd49018ec0cbbdab3ce8795e) |
| GitHub `origin/main` after runtime push | `1be26da3366c9ddbbd49018ec0cbbdab3ce8795e` |
| Documentation-only evidence follow-up | `c64baf4b519d9ea165749b94d7de0b077d924c4c` on `origin/main`; not redeployed |
| Render deployment | `dep-db9cu2favr4c73djgm4g` |
| Render deployed SHA | `1be26da3366c9ddbbd49018ec0cbbdab3ce8795e` |
| Immediate rollback target | `53a24e72543f6ed300996a62d711b93b7f48ce4c` / `dep-db918lmq1p3s739n88dg` |
| Render status | `Deploy succeeded | Live`; manually deployed; automatic deployment remained disabled |

Production acceptance on the new live deployment passed with disposable
accounts and cleanup:

- The real Mindshare service page produced a DeepSeek-grounded service profile.
  The normal browser flow surfaced Northampton College's active
  `CA18543 - Northampton College - Media planning & Buying Services` notice,
  buyer, official Contracts Finder URL, active status, 2026-11-04 deadline,
  official application route, and the limitation that detailed selection and
  user-specific eligibility criteria require inspection of the notice documents.
- The browser showed `Active Request`, `Potential Customer`, and `Research
  Signal` tiers. Research-only cards exposed guidance only, not an outreach
  or proposal action. A branding-only profile did not match the specialized
  media-buying notice.
- The real Reach page analyzed as `product-owner` with DeepSeek. The server
  forced the effective mode to `potential-customers`; Jobicy, Remote OK, and
  SerpApi were skipped, and generic project/job signals were not promoted. The
  returned procurement items were official Contracts Finder records, not
  freelance job-feed recommendations.
- The observed Jobicy contract-role false positives remained excluded in the
  production discovery path. Jobicy stayed enabled for genuine external
  freelance/contract wording.
- Profile edits, saved opportunity, proposal generation, proposal editing,
  logout/login recovery, unauthenticated denial, malformed-request rejection,
  cross-account proposal denial, and saved-list/profile isolation all passed.
- Exact installed-Chrome measurements passed directly against the live Render
  service after promotion on authenticated landing/profile/results/saved-
  pipeline screens: document/body widths were `305/305` at 320px and `375/375`
  at 390px, with Sign out at `235.572–288.888` and `301.968–355.284`
  respectively, enabled and clickable. No visible control exceeded the
  viewport. The pre-fix 320px geometry remains recorded above for audit
  comparison.

**Post-promotion production gates: PASS.** Owner sign-off and authorization to
publish the hackathon submission remain outstanding. The moderate transitive
Mastra parser-chain risk remains documented and unremediated.
