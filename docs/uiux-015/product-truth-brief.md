# Product Truth Brief — Source / Directive 015

**Mode:** REDESIGN with LAUNCH safeguards
**Date / owner:** 2026-10-14 / owner-directed
**Evidence sources:** local repository, rollback commit `70f8042`, real Chromium
reference audit, real Chromium Source journey, existing director handoff
**Evidence labels:** O = observed, R = owner/director reported, H = hypothesis,
F = future

## Product promise

For freelancers and independent professionals who need credible client leads,
Source helps them turn a public portfolio or project URL into an editable,
evidence-backed profile and investigate relevant source-linked opportunities,
unlike manual searching across disconnected feeds, without requiring private
website credentials or pretending to guarantee a client.

**In plain English:** Find client opportunities that fit your work.

## Beachhead and repeat use

- Primary user: independent service provider with public work and a need for
  paying projects (O/R).
- Primary job-to-be-done: convert existing public work into a grounded search
  profile and inspect relevant opportunities (O).
- Current workaround: manually search job feeds, inspect source pages and write
  proposals from scratch (H; no analytics supplied).
- Three observed frictions: unclear first action, raw profile review, and
  difficulty seeing why a result matches (O from prior UI review and code).
- Moment of first value: a real grounded profile and source-linked result with
  visible match evidence (O in final local browser run).
- Repeat loop: save an opportunity, recover it after refresh/login, and reuse
  the confirmed profile for later investigation (saved-work portion O;
  profile-read portion F due current API boundary).
- Most important unvalidated assumption: freelancers will trust and act on
  evidence-backed discovery often enough to return (H).

## Product behavior inventory

| Flow/feature | Current behavior | O/R/H/F | Must preserve? | Known limitations |
|---|---|---|---|---|
| Main entry | Direct landing promise, URL-first CTA and auth card | O | Yes | Legacy before screenshot gap |
| Core workflow | Analyze URL, review evidence, confirm, choose categories, search, inspect, draft | O | Yes | Profile fresh-session read unavailable |
| Tracking/history | Saved opportunity and proposal recovery | O | Yes | Proposal edits are local until copied |
| Recovery/errors | Visible invalid URL alert, preserved input, empty results and login recovery | O | Yes | Full automated accessibility scan not run |

## User journeys

1. First-time: landing → account → public URL → loading → grounded profile
   review → edit → confirm → customer categories → live result → proposal →
   save.
2. Returning: sign in → saved work rail → recovered opportunity/proposal → open
   original source.
3. Recovery: invalid/blocked URL → visible explanation → preserved input and
   retry/manual path; no current match → empty state → adjust search.

## Structure and copy

- IA/navigation: public landing; authenticated workspace with context rail;
  URL, review, audience, results and proposal stages.
- First screen must answer: who Source serves, what it does, why public work
  helps, and the next action.
- One primary CTA: `Start with your work` → account activation.
- Secondary CTA: sign-in and manual profile alternative.
- Truthful disclosure: public pages only, evidence vs suggestion, unconfirmed
  buyer signals, no client/payment guarantee, source must be inspected.

## Creative north star

Source is **precise, warm, editorial, evidence-led and approachable**; it is not
noisy, sterile, corporate, decorative or AI-clichéd. The visual system uses a
warm canvas, dark green ink, green verified actions, a serif display voice and
a sans interface voice. Surfaces are rounded but restrained, with borders and
shadows used to establish hierarchy rather than decorate every block. The hero
visual is an original SVG showing public work becoming evidence and fit. Motion
supports continuity and is removed for reduced-motion users.

## Protected surfaces and approvals

- Working functionality not to change: auth, SSRF-safe extraction, DeepSeek,
  Mastra, MongoDB, ownership, discovery adapters/ranking, proposals, saved
  work, Render configuration and secrets.
- Sensitive areas: auth/session, source content, user data, API keys and
  database ownership.
- Assets: Source identity retained; new inline SVG hero/icons are original;
  no logo replacement approval claimed.
- Release constraints: isolated branch, local/preview only, rollback `70f8042`.
- Owner-approved UAT: local browser test account and public `frog.co` page;
  no production mutation in this phase.

## Definition of done

- [x] Clear product promise
- [x] Complete top local journeys and trust states
- [x] Coherent responsive visual system
- [x] Evidence from actual rendering
- [x] Behavioral regression passed at appropriate local level
- [x] No protected surfaces changed without approval
- [x] Honest proof-boundary handoff with known gaps
