# Source Phase 0 Report

Date: 2026-10-13 (Africa/Lagos)

Status: **Planning and evidence foundation only.** Source has not been built,
tested through its real user-facing path, deployed, or submitted.

## Outcome

The Source project directory is:

C:\Users\HomePC\Desktop\source

The initial product contract is documented in
[product-contract.md](C:\Users\HomePC\Desktop\source\docs\product-contract.md).
The persistent replacement-director handoff is
[director.md](C:\Users\HomePC\Desktop\source\director.md).

The load-bearing Phase 0 conclusion is:

> A credible first release is feasible if Source starts with URL-first profile
> extraction and source-linked opportunity discovery from public feeds, keeps
> buyer/prospect discovery narrower than freelancer job discovery, and treats
> the model as an evidence-bounded extractor and explainer rather than an
> authority that invents claims or decides relevance alone.

## 1. Workspace and skills

The Windows Desktop was resolved with the Windows Desktop special-folder
lookup. C:\Users\HomePC\Desktop exists, and source was created there.
The existing skill locations are:

- C:\Users\HomePC\Desktop\skill
- C:\Users\HomePC\Desktop\research-skill

All requested skill files were found and inspected. The paths and how they
influenced this phase are recorded in
[skills-applied.md](C:\Users\HomePC\Desktop\source\docs\skills-applied.md).
No requested skill was missing.

## 2. Hackathon research

The authoritative live challenge is DEV's Hacktoberfest 2026 Week 2
“Side Hustle” challenge. The challenge page says submissions are due October
18, 2026. The detailed rules state that the entry period ends at 11:59 PM
PDT on October 18, which is October 19, 2026 at 7:59 AM in Lagos (WAT).
The rules, eligibility, required submission material, open-weight/open-source
AI requirement, judging criteria, team limit, and partner categories are
recorded with primary links in
[research-sources.md](C:\Users\HomePC\Desktop\source\evidence\research-sources.md)
and [sponsor-strategy.md](C:\Users\HomePC\Desktop\source\docs\sponsor-strategy.md).

The recommended credible category path is:

- CORE: Gemma, MongoDB Atlas, Render, and the Node.js/TypeScript product
  foundation.
- OPTIONAL / HOLD: SerpApi, Mastra, and Sentry, only if each earns a real
  product role and receives its own verification evidence.
- REJECTED for the first release: partner integrations that add hardware,
  fine-tuning, voice, a new domain, or a second workflow without improving
  the core product.

This is a strategy, not a claim of eligibility or a completed sponsor
submission. Owner confirmation of eligibility and account terms is required.

## 3. Product contract

The smallest complete journey is:

1. User creates or signs into an individual account.
2. User pastes a public URL, or enters a manual profile when no URL exists.
3. Source validates the URL and performs a server-side, SSRF-protected fetch.
4. Source extracts readable public content and stores short evidence spans.
5. A bounded model drafts an editable structured profile, labeling inferences.
6. User reviews, edits, and confirms the profile.
7. User selects one or more of small businesses, startups, agencies, and
   individuals.
8. Source maps the confirmed profile and categories to permitted discovery
   queries and deterministic ranking signals.
9. User inspects source-linked opportunities and the evidence for the match.
10. User edits and saves a proposal, saves an opportunity, refreshes, and
    recovers the saved work.

The product contract distinguishes two strategies:

- Service-provider mode: find freelance projects, contracts, or hiring
  requests that match the user's confirmed services and evidence.
- Buyer/prospect mode: find plausible customer opportunities for the user's
  product or service. The first release must narrow this to source-backed
  public signals and avoid pretending that an inferred prospect is an active
  buyer.

The mandatory customer-category choices affect query vocabulary, buyer-type
qualification, and ranking. They are not presentation-only filters.

## 4. Critical dependency evidence

Read-only live probes were run on October 13, 2026:

- Hacker News Algolia returned HTTP 200 and recent Ask HN: Who is hiring
  results.
- Hacker News Firebase returned HTTP 200 for a public item.
- Jobicy returned HTTP 200 and structured recent listings for a TypeScript
  query.
- Remote OK returned HTTP 200 and structured tagged records.
- Himalayas returned HTTP 200 and recent searchable listings.
- SerpApi returned HTTP 401 without an API key, as expected for the
  credential-gated path.
- A public static website fetch returned HTTP 200 and HTML containing a title
  and script tags. This is not proof that JavaScript-rendered extraction works.

Raw probe details and limitations are in
[source-probes-2026-10-13.md](C:\Users\HomePC\Desktop\source\evidence\source-probes-2026-10-13.md).

The evidence supports a V1 adapter path using HN, Jobicy, Remote OK, and
Himalayas, subject to terms, attribution, freshness filters, and a source
health check. It does not support claiming SerpApi integration because no
credential was available, and it does not support using Remotive or Upwork
without their additional restrictions and approvals.

## 5. Proposed architecture

The proposed sequence is:

1. Node 24 LTS and TypeScript application shell.
2. Individual authentication and user-scoped persistence.
3. URL validation, SSRF-safe fetch, content normalization, and evidence
   storage.
4. Bounded profile extraction with structured output validation.
5. Human confirmation and versioned profile persistence.
6. Source adapters with canonical URLs, source attribution, timestamps, and
   normalized records.
7. Deterministic query construction, category-aware qualification, and
   explainable ranking.
8. Editable proposal drafting constrained by confirmed profile evidence.
9. MongoDB Atlas persistence and optional Vector Search after the basic
   workflow is proven.
10. Render deployment, then real acceptance testing from browser to backend,
    external source, and database.

The model must narrate, extract, and suggest. Deterministic code must own
authorization, URL safety, source rules, category mapping, ranking gates, and
save/recover behavior.

## 6. Blockers and owner actions

No stop condition was reached in Phase 0. The following decisions remain
required before implementation:

- Confirm entrant eligibility, DEV membership, and final submission timing.
- Create or identify the GitHub repository and decide the project start
  timestamp under the challenge rules.
- Choose the initial deployment/account owners for Render and MongoDB Atlas.
- Decide whether the first release is service-provider-first, with buyer mode
  as a bounded secondary mode.
- Obtain a SerpApi key only if live Google Jobs search is approved for V1.
- Choose and verify a Gemma inference path; local GPU capability was not
  verified, so local-only inference is not yet an assumption we can make.
- Confirm retention and deletion policy for fetched public content and
  generated profiles.
- Confirm which source terms allow the intended display, caching, attribution,
  and refresh behavior.

## 7. Acceptance status

The required real acceptance test is **NOT RUN**. No user account, deployed
Source application, real profile analysis, saved opportunity, or end-to-end
frontend-to-backend-to-source-to-database result exists yet.

The only completed tests in this phase are read-only environment and provider
access probes. They are evidence for planning, not product acceptance.

## 8. Replacement-director next action

Read [director.md](C:\Users\HomePC\Desktop\source\director.md), then
[product-contract.md](C:\Users\HomePC\Desktop\source\docs\product-contract.md),
then the source and sponsor evaluations. Before writing application code,
turn the owner actions above into explicit decisions, preserve this evidence,
and create the Phase 1 implementation plan with testable gates.
