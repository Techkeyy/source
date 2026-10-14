# Source Project Director Handoff

Last updated: 2026-10-14 (Africa/Lagos), after Directive 003 implementation checkpoint

## Authoritative status

**BUILDING — CORE PATH NOT YET PROVEN**

Directive 003 authorizes the minimum complete Source product. A Next.js 16.4.0
TypeScript application now exists locally with the URL-first flow, real account
routes, server-side source adapters, Atlas persistence code, Mastra workflow
boundary, grounded Gemma call path, and proposal/save routes implemented. The
Core Outcome remains unproven because the owner has not supplied MongoDB Atlas,
Gemma, or Render access and normal browser UAT has not completed.

No feature is complete merely because code, a provider HTTP response, a passing
unit test, or a successful build exists.

The requested project directory is:

C:\Users\HomePC\Desktop\source

The actual Desktop path was resolved with Windows special-folder lookup and
verified to exist. The existing skills folder was identified as
C:\Users\HomePC\Desktop\skill. The separate local research skill is at
C:\Users\HomePC\Desktop\research-skill.

## Product promise and Core Outcome

### Product promise

Source helps freelancers and small independent businesses turn a public project
or portfolio URL into an editable, evidence-backed profile, then discover
relevant paying opportunities through permitted, source-linked discovery paths
and prepare a credible, editable proposal without inventing experience.

Source does not guarantee clients, contracts, payments, replies, or outcomes.
Source helps a user make a better-informed search and proposal decision.

### Core Outcome

Source is only genuinely working when a fresh signed-in user can complete this
normal product path without operator rescue:

1. Create or sign into their own account.
2. Submit an actual public HTTPS project, portfolio, agency, or business URL.
3. Trigger real server-side analysis of that URL.
4. Receive a grounded profile with evidence links and clear inference labels.
5. Edit and confirm the profile.
6. Select one or more of small businesses, startups, agencies, and individuals.
7. Start a real opportunity search whose query plan and ranking use those
   selections.
8. Receive recent, source-linked results from a permitted source.
9. Inspect why a result matches the confirmed profile and selected categories.
10. Generate an editable proposal from confirmed claims only.
11. Save an opportunity and return later to find it persisted for that user.

Current acceptance status: **UNPROVEN**. The local application exists, but the
normal multiuser path, live model path, persistence path, and deployed path are
not yet demonstrated.

## Minimum complete product contract

### Core user journey

New user -> create account -> paste public project URL or use manual entry ->
run analysis -> review evidence-backed profile -> edit and confirm -> choose
discovery goal and customer categories -> search real sources -> inspect a
source-linked match and rationale -> edit proposal -> save opportunity -> leave
and return -> recover profile, selections, saved opportunity, and proposal.

Every network action must expose loading, success, empty, and error states. A
failure must say what failed, what remains safe, and whether retrying is useful.

### Smallest reliably shippable slice

The first vertical slice should prove:

- One real account can be created and authenticated.
- One public HTTPS URL can be fetched server-side with SSRF controls.
- Static HTML extraction works first, with a bounded JavaScript-rendering
  fallback only when needed.
- The model produces a typed draft profile, but deterministic citation checks
  and schema validation reject unsupported claims.
- A user can edit and confirm every field.
- The four customer categories are stored per user and materially change query
  terms and deterministic ranking.
- The service-provider discovery mode returns live results from Jobicy and
  Hacker News search, with source URL, source name, published time, and the
  original excerpt or a bounded evidence reference.
- One opportunity and proposal are saved under the authenticated user and can
  be reloaded in a fresh session.

The slice does not send applications, contact prospects, scrape private pages,
promise a client, or auto-publish a proposal.

### Two discovery strategies

Source must not treat these as the same problem:

| Strategy | What the user is trying to do | First-release treatment | Result language |
|---|---|---|---|
| Service provider | Find freelance projects, contracts, or hiring requests that fit their capabilities | Core proof path using permitted job and hiring-request sources | Opportunity, contract, hiring request |
| Business or product | Find potential buyers or customer prospects for an offering | Separate strategy in the contract; source and credential proof still HOLD | Prospect signal, not a hiring request |

The data model and query planner should carry an explicit discovery goal. The
first acceptance test proves service-provider discovery. The buyer/prospect
strategy must not be advertised as shipped until a real, permitted, fresh
prospect source is verified. SerpApi is the leading candidate for that strategy,
but the current workspace has no SerpApi credential and the no-key probe returned
401.

### Mandatory customer categories

The categories are product data, not decorative filters:

1. Small businesses
2. Startups
3. Agencies
4. Individuals

The query planner must derive category-specific terms and buyer-intent signals
from the confirmed profile. The ranking layer must score evidence that a result
matches the selected categories. The result explanation must show which
category signals contributed. A user cannot select a category and receive the
same query and ranking as an unselected category.

Initial deterministic category signal vocabulary:

| Category | Query and ranking signals to test and version |
|---|---|
| Small businesses | small business, SMB, local business, owner, shop, clinic, studio, local service, website refresh |
| Startups | startup, founder, seed, MVP, SaaS, product launch, early-stage, YC |
| Agencies | agency, studio, white-label, subcontract, overflow, client work, delivery partner |
| Individuals | personal brand, creator, consultant, coach, portfolio, independent, event, personal site |

These are initial hypotheses, not claims that every matching result belongs to a
category. The system must retain the source excerpt that supports any category
label and must allow the user to correct or dismiss a match.

## URL-first onboarding contract

### Input

The user may paste a live public URL for a project, portfolio, agency site, or
business landing page. A manual profile path remains available for users without
a public site. Public GitHub repositories and additional portfolio links may
provide supporting evidence when accessed legitimately.

Source never asks for website passwords, private tokens, or private repository
credentials as part of URL-first onboarding.

### Extracted profile

The editable draft may contain:

- Business or project name
- What the project or business does
- Products and services
- Problems solved
- Skills and technologies, only when supported
- Value proposition and differentiators
- Relevant portfolio or project evidence
- Potential customer segments
- Suggested search keywords and buyer-intent signals

Each claim carries:

- claim text
- claim type: fact or inference
- evidence URL
- short evidence excerpt or content anchor
- fetched-at timestamp
- content hash or snapshot identifier
- extraction status
- user-confirmed status

The model may suggest structure and language. It may not invent ownership,
clients, revenue, pricing, qualifications, or past work.

### Grounding boundary

Raw website and feed content is untrusted data. It is never privileged
instruction. The extraction model receives it in a quarantined data channel,
with no credentials and no tool permission. Structured output is validated
against a schema, and each factual claim is checked against the extracted
content before it can appear as a supported fact. Unsupported output is either
removed or labelled as inference for explicit user review.

## Proposed architecture

### User-facing flow

Landing or workspace -> account -> URL/manual onboarding -> review profile ->
customer selection -> source search -> match detail -> proposal editor ->
saved opportunities.

Use the fewest pages that keep these jobs clear. A dashboard is justified only
after saved work and search history exist. Do not begin with an empty dashboard.

### Technical pipeline

Validated URL/manual input -> safe fetcher -> static extraction -> bounded
rendered-page fallback -> normalized content and evidence spans -> Gemma
structured extraction -> schema and citation validator -> user confirmation ->
category-aware query planner -> source adapters -> normalizer and deduplicator
-> deterministic qualifier and ranker -> evidence-backed result explanation ->
proposal drafter -> MongoDB persistence -> reload.

The load-bearing module is the source-backed discovery and grounding boundary:
if the system cannot obtain recent, permitted, inspectable opportunities and
trace profile/ranking claims back to source evidence, Source has no honest value.

### Technology decisions at Phase 0

| Layer | Proposed choice | Decision status |
|---|---|---|
| Runtime | Node.js 24 LTS | CORE candidate. Local Node is v24.14.0; pin an exact supported version during implementation |
| Language | TypeScript, project-local and locked | CORE. Local npm reports TypeScript support is project-local; exact version to be resolved in implementation |
| Web application | TypeScript full-stack web app, likely Next.js on Node | PROPOSED. Framework version and auth library require implementation proof |
| Profile intelligence | Gemma open-weight model, with model output constrained by schema and citations | CORE candidate for the open-source AI requirement, inference path unproven |
| Workflow/tool orchestration | Mastra only if it removes real orchestration/retry complexity | OPTIONAL pending smoke test. Do not call a single model call an agent |
| Persistence | MongoDB Atlas with server-side ownership checks | CORE candidate because accounts, profiles, source records, saved work, and proposals must persist |
| Discovery | Jobicy and HN adapters first; Remote OK and Himalayas as supplementary adapters | CORE source path, all tested live at least once from this workspace |
| Search discovery | SerpApi Google Jobs and web search adapter | OPTIONAL/HOLD because the key is absent and the provider returned 401 without it |
| Observability | Sentry errors and optional agent traces | OPTIONAL until a DSN and useful trace proof exist |
| Deployment | Render web service with environment secrets | CORE target for public deployment, not yet configured or deployed |

No database, application, or model package has been installed for Source during
Phase 0.

## Hackathon requirements

The active event context is Hacktoberfest 2026 DEV Challenge, Week 2, whose
theme is Side Hustle.

| Requirement | Verified state |
|---|---|
| Entry period | Confirmed: October 12, 2026 at 12:00 PM PDT through October 18, 2026 at 11:59 PM PDT |
| Lagos deadline | Confirmed conversion: October 19, 2026 at 7:59 AM WAT |
| Age | Confirmed: 18+ |
| DEV membership | Confirmed: active DEV Member required by the general rules |
| Project timing | Confirmed: brand-new project and repository started and completed during the challenge window; post-deadline commits must be disclosed |
| Prompt | Confirmed: open-source AI at the core, such as open-weight models, open-source agent frameworks, or local inference |
| Theme | Confirmed: Side Hustle, something a real person or business would plausibly pay for |
| Submission post | Confirmed: publish on DEV using the provided template and challenge tag #hf26challenge |
| Demo evidence | Confirmed: deployed project link or video demo |
| Code evidence | Confirmed: repository link or embed |
| Open innovation explanation | Confirmed: explain why open innovation matters for the project |
| Judging | Confirmed: Writing Quality weighted most heavily, Relevance to Prompt and Theme, Creativity, Technical Execution, and optional Use of Partner Technology |
| Tie-breaker | Confirmed: highest positive reactions on the DEV post |
| Team | Confirmed: up to four people; one submission per team and team DEV handles listed |
| AI assistance | Confirmed: allowed if all other rules are followed |
| Current challenge status | The official page says Week 2 is live and runs through October 18 |

The primary official sources are in
evidence/research-sources.md. The rules are external constraints, not
implementation proof.

## Sponsor-category qualification progress

The current Week 2 page lists six featured $200 categories and eleven $100
partner categories. Source should only opt into categories whose technology is
meaningful, demo-visible, and actually documented in the submission.

| Category | Proposed use | Current status |
|---|---|---|
| Render, $200 | Publicly host the Source web service and its open-model workflow surface | CORE target, not deployed |
| Gemma, $200 | Open-weight profile extraction and proposal language, with user confirmation and evidence checks | CORE candidate, no model run yet |
| MongoDB Atlas, $100 | Persistent user-owned profiles, confirmed claims, opportunities, and proposals; optionally vector retrieval | CORE candidate, no Atlas connection |
| Mastra, $100 | A real multi-step workflow over Gemma and controlled tools if it reduces orchestration complexity | OPTIONAL/HOLD, no proof |
| SerpApi, $100 | Live web/Google Jobs discovery for the separate buyer/prospect strategy or extra job coverage | OPTIONAL/HOLD, no key; unauthenticated request returned 401 |
| Sentry Agent Tracing, $100 | Capture profile/search workflow latency, tokens, cost, and failure traces for debugging | OPTIONAL, DSN absent |
| Temporal, $100 | Durable retries for long-running analysis and flaky external calls | OPTIONAL/LATER unless failure testing shows it is needed |
| Tiger Data, $100 | pgvector or hybrid search | REJECTED for now because Atlas already covers persistence and retrieval needs |
| Backboard, $100 | Agent memory or model comparison | REJECTED for now because it duplicates the proposed Gemma plus Atlas path |
| ElevenLabs, $100 | Voice or demo narration | REJECTED for product scope |
| Entire, $100 | Agent session evidence | REJECTED as a product dependency; optional write-up support is not a user value |
| GitHub Copilot, $100 | Coding agent or Actions | REJECTED as a product integration; development assistance alone is not Source functionality |
| .tech domain, $100 | Host the public app on a claimed .tech domain | OPTIONAL distribution choice, not needed for the core loop |
| TabPFN, $200 | Historical tabular prediction | REJECTED because opportunity ranking is evidence and rules driven, not a historical tabular prediction problem |
| Tinker, $200 | Fine-tune a model and prove improvement | REJECTED for Phase 0 because there is no justified fine-tuning dataset or baseline |
| Arduino, $200 | Physical agent | REJECTED for Source's web product |
| DigitalOcean, $200 | Host or run the open model on a GPU service | OPTIONAL deployment alternative to Render, not both |

Directive 002 reclassifies the sponsor plan using the required decision labels:

- CORE: Gemma, MongoDB Atlas, Render.
- LOW-COST OPPORTUNITY: Mastra, SerpApi, Sentry Agent Tracing, Entire, and
  ElevenLabs, each conditional on real use and proof.
- CONDITIONAL: .tech, Temporal, Backboard, and GitHub Copilot, dependent on
  owner approval and a genuine need.
- REJECTED: TabPFN, Tinker, Arduino, DigitalOcean, and Tiger Data for the
  current product shape.

The detailed proof requirements are in docs/sponsor-strategy.md. No paid
service, recurring-cost domain, or optional category has been activated.

Partner credits are confirmed as available in principle for Tinker, Render,
Backboard, and a free first-year .tech domain through the Hacktoberfest promo
page. Exact account-specific credit amounts and redemption state remain
unverified because no signed-in promo account was used. The .tech category
explicitly states that the first year is free and renewal is $29.99 per year.

## Claim -> Mechanism -> Boundary -> Proof ledger

| Claim | Mechanism | Authoritative boundary | Required proof | Current status |
|---|---|---|---|---|
| URL-first onboarding produces a grounded profile | Safe fetch, normalized content, model schema, citation validator, user review | Server-side fetch and validation plus user confirmation | Fresh user completes URL analysis and every displayed fact maps to source content | UNPROVEN |
| Unsupported experience is not invented | Profile fields require evidence or inference label; proposal generator can use confirmed claims only | Server-side validator and proposal input filter | Adversarial site with no portfolio evidence does not produce past-client or pricing claims | UNPROVEN |
| Customer type preferences affect discovery | Category query vocabulary and deterministic ranking features stored in the user's search plan | Server-side query planner and ranker | Same confirmed profile with different category selections produces different query logs and rank explanations | UNPROVEN |
| Results are genuine opportunities | Source adapters retain canonical URL, provider name, title, excerpt, and publication time | Provider source plus Source's attribution and freshness policy | Live provider response appears with an inspectable original link and timestamp | SUPPORTED by live probes, product path unproven |
| Users only read their own data | Authenticated server handlers derive user identity from session and enforce ownership | Server-side authorization and database filters | Two-user adversarial test: one user cannot read, edit, or save against another's IDs | UNPROVEN |
| Saved work survives refresh and later sessions | Persistent records keyed to authenticated user | MongoDB Atlas and server-side ownership checks | Fresh login reloads the saved opportunity and editable proposal | UNPROVEN |
| Source helps, but does not guarantee, client outcomes | Product copy and proposal UX avoid guarantees and auto-apply behavior | Product language and workflow boundary | Review all customer-facing claims and reject unsupported guarantees | PLANNED |
| Website text cannot instruct privileged tools | Untrusted content channel, no tool access during extraction, allowlisted structured actions | Agent boundary and server authorization | Prompt-injection fixture fails to cause a tool call or data disclosure | UNPROVEN |

## Skills used and applied

The exact local files and supporting references are recorded in
docs/skills-applied.md. The important applications are:

- hackathon-onboarding: official rules first, Windows environment check, no
  installs before understanding the event.
- idea-research and research-skill: primary-source evidence, HOLD labels,
  competition source register, no invented novelty or sponsor necessity.
- project-understanding: one product sentence, one Core Outcome, one
  load-bearing assumption, normal-language flow, explicit non-goals.
- build-process: prove the riskiest dependency before building outward,
  deterministic rules over model judgement, doctor checks, four UI states.
- design-skill: URL-first journey before component choices, evidence-forward
  UI, readable accessible states, no decorative AI chat or invented metrics.
- perfect-readme: do not write a submission README from memory; every claim,
  link, count, and demo step will need a real verification pass.
- project-edge: map the judging checklist to evidence, differentiate on source
  grounding and honest boundaries, try to break the claim.
- audit-skill: every factual document claim becomes a later audit test.
- master director skill: use authoritative status, no hidden rescue, no
  submission-ready language before real-user proof.

## Tests and evidence performed in Phase 0

### Workspace and environment

- Desktop resolved to C:\Users\HomePC\Desktop.
- C:\Users\HomePC\Desktop\source created.
- Existing skills folder located at C:\Users\HomePC\Desktop\skill.
- Node v24.14.0, npm 11.9.0, pnpm 11.19.0, Python 3.11.9, Git 2.53.0,
  Bun 1.3.7, PowerShell 7.6.5 observed.
- No Source-specific credentials were present for SerpApi, MongoDB, Sentry,
  Gemma/Google, Render, or Mastra.
- Docker was not treated as a required Phase 0 dependency; its version probe
  produced an access warning against the local Docker config and no capability
  was used.

### Live read-only source probes

- HN Algolia search returned HTTP 200 and five current records from a query for
  “Ask HN Who is hiring”.
- Official HN Firebase API returned HTTP 200 for a known item.
- Jobicy returned HTTP 200, success true, five JSON jobs, and a continuation
  cursor.
- Remote OK returned HTTP 200 and a current JSON feed.
- Himalayas returned HTTP 200 with totalCount and current jobs.
- SerpApi Google Jobs without a private API key returned HTTP 401.
- A public website fetch returned HTTP 200 with HTML title and script tags,
  proving static fetch is possible but not proving JavaScript-rendered
  extraction.

Full command outputs and timestamps are in
evidence/source-probes-2026-10-13.md.

## Phase 1 and Phase 2 feasibility evidence — 2026-10-14

Directive 002 authorized product-contract correction and focused feasibility
tests only. The isolated scripts and reproducible JSON outputs are under
feasibility/.

### A. Real website understanding

| Check | Evidence | Status |
|---|---|---|
| Public URL allowlist and safe destination preflight | file URL, loopback, localhost, private IPv4, and link-local metadata address were all rejected; a public URL was accepted | PASS for tested cases |
| Bound static HTML fetch | Austin Kleon-like creator site and frog service site returned HTTP 200 and were fetched through a validated public address | PASS |
| Structured grounded fallback profile | Direct title, description, service/product signals, technology signals, source URL, and excerpts were emitted | PASS for fallback parser |
| Sparse/difficult site handling | example.com returned a minimal profile with no services and no direct customer segment; unsupported fields were explicitly marked unsupported | PASS |
| Product landing page | Linear exceeded the 1 MB bounded response limit; the test was then rerun with Campfire.so, which returned HTTP 200 but was a domain-for-sale page rather than a product | PARTIAL; JS-heavy and misleading landing pages remain a limitation |
| Gemma inference | No Gemma credential, Ollama host, or local Gemma runtime was available on October 14 | BLOCKED |

The website script does not claim a model integration. Its output is a
deterministic fallback and records the model test as BLOCKED.

### B. Real opportunity discovery

The discovery script used a 30-day feasibility freshness threshold and sampled
the actual returned records:

| Provider | Returned | Fresh | Classification finding |
|---|---:|---:|---|
| Hacker News job-tagged freelance query | 15 | 0 | 11 explicit contract/freelance signals and 4 unconfirmed demand signals, but all were outside the test freshness window; one duplicate |
| Jobicy TypeScript feed | 50 | 50 | 47 permanent/unspecified employment, 2 explicit freelance/contract, 1 unclear; source URLs and job descriptions were available |
| Remote OK developer feed | 100 | 17 | Fresh subset included 1 explicit contract, 6 unconfirmed demand signals, 4 permanent/unspecified, and 6 unclear |
| Himalayas TypeScript search | 20 | 20 | 2 explicit contractor records and 18 permanent/unspecified records |

The counts use conservative script classifications, not provider-authored
truth labels. They show that public sources are reachable but do not provide a
clean, homogeneous freelance-opportunity pool. Record-level canonical URLs,
timestamps, source excerpts, budget/compensation signals, contact/application
signals, duplicate counts, and raw provider keys are in
feasibility/discovery-analysis-results-2026-10-14.json.

Status: **PARTIAL PASS for source access; HOLD for an unqualified “genuine
freelance opportunities” claim.**

### C. Four customer-category differentiation

The same representative frog profile was used to run four live HN query
variants:

- small businesses: small business design
- startups: startup design
- agencies: agency design
- individuals: personal project design

Each run returned 20 records, and the script changed query terms,
qualification terms, scores, freshness signals, and match explanations.
However, HN story records often lacked reliable customer-type fields and many
were stale or irrelevant. The observed behavior proves that the deterministic
category mechanism can change discovery, not that the sources reliably identify
the requested customer type.

Status: **HOLD.** Category mechanics are observable; source-backed category
classification is not yet reliable enough for a full PASS.

### D. Grounded matching

The isolated matcher used direct evidence from the frog page and real provider
records:

- Accepted for review: Remote OK “Product Design Lead,” published October 9,
  2026, with AI/design/experience overlap. It remains labeled
  potential-buyer-signal-unconfirmed rather than a confirmed request.
- Rejected: Jobicy “Senior iOS Engineer (Swift & AWS),” because it was
  permanent/unspecified and had no confirmed overlap with the profile.
- Proposal draft: generated only from frog evidence such as transformative
  experiences, designing robots for human spaces, AI-augmented research, and
  the source-linked profile URL. It is explicitly editable and not sent.

Status: **PASS for the isolated deterministic matching proof; not product UAT.**
See feasibility/matching-analysis-results-2026-10-14.json.

### Feasibility evidence level

The core mechanism is **PARTIALLY PROVEN**:

- safe static fetching and evidence-shaped fallback extraction: supported;
- real source access and mixed record classification: supported;
- grounded match and rejection behavior: supported in an isolated script;
- Gemma model inference: blocked;
- reliable, fresh, category-labeled freelance discovery: unproven;
- account persistence and deployed user journey: not run.

## Known limitations, risks, and blockers

1. The product is not implemented. The Core Outcome is not proven.
2. SerpApi, MongoDB Atlas, Gemma inference, Render, and Sentry credentials are
   absent. Documentation feasibility is not integration proof.
3. Job feeds can be stale, duplicated, closed, mislabeled, or non-freelance.
   Source must show provider timestamps and link to the original listing.
4. HN search provides hiring signals but not a controlled freelance marketplace.
   Its public search index and provider availability must be monitored.
5. A public site may block fetches, require JavaScript, or contain malicious
   instructions. The product needs bounded retries, an honest extraction error,
   and a manual path.
6. A business buyer/prospect search is not the same as a hiring search. It
   cannot be declared complete without a real, permitted prospect source.
7. Gemma 4 memory requirements may require a hosted or quantized small model;
   no GPU capability was verified. Choose the model after a real inference
   smoke test.
8. Hackathon time is short. Adding every partner category would be unjustified
   scope and could threaten the Core Outcome.
9. The user has not supplied a GitHub repository, deployment account, domain,
   or owner-approved credentials. These are owner actions before integration.
10. The Phase 2 parser is a feasibility fallback, not a production readability
    or JavaScript-rendering implementation. Its extracted title can reflect a
    current article rather than the organization name.
11. Provider record classifications are conservative heuristics. They must not
    be presented as authoritative buyer, contract, or customer-type labels
    without source evidence.
12. A Gemma call is still required before claiming the featured Gemma category
    or model-backed profile generation.

## Deployment and UAT status

| Gate | Status | Evidence |
|---|---|---|
| Local application exists | NOT STARTED | No Source code |
| Account creation through normal UI | UNPROVEN | No UI |
| URL analysis through normal UI | UNPROVEN | No UI |
| External source search through normal UI | UNPROVEN | Provider-only probes exist |
| Persistence through normal UI | UNPROVEN | No Atlas connection |
| Deployed public URL | NOT STARTED | No Render service |
| Fresh-user acceptance test | NOT RUN | No product artifact |
| Human UAT | NOT RUN | No product artifact |
| Hackathon submission | NOT STARTED | Planning only |

## Active phase and exact next tasks

### Phase 1 and Phase 2 decision gate

Phase 0 is conditionally accepted. Phase 1 contract correction is recorded.
Phase 2 feasibility is partially proven but not sufficient to authorize the
complete application. The next director must resolve the Gemma blocker and
decide whether the source evidence is sufficient for a minimum vertical slice.

Immediate next tasks:

1. Obtain an owner-approved Gemma inference route and rerun structured profile
   generation on the same real website inputs.
2. Review provider terms against the exact intended display, caching,
   attribution, and refresh behavior.
3. Decide whether a 30-day freshness threshold is suitable for the first
   release and define source-specific overrides.
4. Improve category qualification using provider fields where available rather
   than relying only on title/description vocabulary.
5. Decide whether buyer discovery remains a labeled secondary strategy while
   service-provider discovery is the first release.
6. Do not start the complete application until the director authorizes the
   smallest vertical slice after these decisions.

### Minimum vertical slice implementation order, if authorized

1. Confirm the active challenge and owner eligibility, then record any changed
   rules before creating a repository.
2. Obtain owner-approved credentials or accounts for the smallest proof:
   MongoDB Atlas, one Gemma inference path, and optionally SerpApi.
3. Build a source doctor that exercises Jobicy, HN, and the chosen model path
   without exposing secrets.
4. Build the safe URL fetcher and static content normalizer first. Test invalid
   schemes, private IPs, redirects, oversized responses, non-HTML content, and
   timeouts before model work.
5. Add a schema-constrained Gemma extraction workflow with evidence spans and a
   malicious-content fixture. Stop if unsupported claims survive validation.
6. Add account/session ownership and the smallest Atlas persistence model.
7. Add URL/manual onboarding UI with edit/confirm states.
8. Add category selection and server-owned query planning. Test that changing
   categories changes both query terms and ranking explanations.
9. Add Jobicy and HN adapters and source-linked results. Add Remote OK or
   Himalayas only after the first path is stable.
10. Add editable proposal drafting from confirmed claims only.
11. Walk the normal user path with a fresh account, save, log out, log back in,
   and recover the saved opportunity.
12. Deploy to Render, verify the public URL serves the exact build, then run
   browser UAT on desktop and mobile.
13. Add only the sponsor instrumentation that is real and visible: Gemma,
   Atlas, Render, and optionally Mastra/Sentry/SerpApi if their proofs are
   complete.
14. Update this director after each meaningful phase. Never change status to
   complete without evidence from the real user-facing path.

### Stop conditions

Stop and report if:

- The chosen core source becomes inaccessible, prohibited, or too stale.
- The model cannot produce grounded structured output after validation.
- URL fetching cannot be secured against SSRF and prompt-injection boundaries.
- Authentication or per-user ownership cannot be proven.
- The result path needs fabricated, hard-coded, or operator-inserted data.
- The external search path needs private credentials that the owner cannot
  provide.
- Render deployment differs from the tested artifact.
- Scope expansion threatens the Core Outcome.

## Replacement director instructions

Read this file, then read the evidence files linked from it. Treat all
UNPROVEN, HOLD, and OPTIONAL labels as real boundaries. Begin the next pass with
the smallest risky proof, not with visual polish. Keep the current product
promise, URL-first onboarding, four customer categories, source-backed results,
user-specific persistence, and honest non-guarantee language fixed.

## Directive 003 implementation checkpoint

Timestamp: 2026-10-14 (Africa/Lagos), after the first authorized build pass.

### What changed

The local application was initialized in the existing project directory:

`C:\Users\HomePC\Desktop\source`

Runtime versions installed and observed from the local dependency tree:

- Next.js 16.4.0
- React and React DOM 19.3.0
- TypeScript 6.0.3
- MongoDB Node driver 7.7.0
- Mastra core 1.77.0
- Cheerio 1.2.0
- Zod 4.6.7
- Vitest 5.0.4

The application is a single Next.js App Router project. The primary routes are
in `src/app/api/` and the product workspace is in
`src/components/SourceApp.tsx`.

Implemented mechanisms:

1. Public landing surface with account registration, sign-in, and logout.
2. Signed session cookie using a server-only HMAC key and bcrypt password hash.
3. User-scoped MongoDB collections for users, profiles, and saved opportunities.
4. URL-first server-side HTML fetching with scheme checks, DNS public-address
   checks, redirect revalidation, timeout, content-type, and 1 MB bounds.
5. HTML text normalization through Cheerio, with scripts, frames, SVG, and
   other executable or non-text elements removed before model input.
6. Mastra `source-profile-analysis` workflow with a typed Gemma profile step.
7. Direct hosted Gemma REST call path using the server-side
   `x-goog-api-key` header and `gemma-4-26b-a4b-it` default model.
8. Evidence quote validation that drops non-grounded claims unless explicitly
   marked as cautious inference.
9. Four customer categories stored in the request and used by server-side query
   terms, category signal matching, ranking, and result explanations.
10. Hacker News comment discovery, Jobicy public feed discovery, Remote OK
    public feed discovery, and optional SerpApi Google Jobs discovery.
11. Explicit exclusion of stale, full-time, and irrelevant records from shown
    results. Unconfirmed buyer signals remain labeled as unconfirmed.
12. MongoDB save and reload route with user ownership in every filter.
13. Editable proposal draft route using only confirmed profile evidence, with no
    automatic message sending.

### Feature-completion matrix

| Feature | UI | Backend | Real integration | Persistence | Deployed behavior | Manual UAT | Recovery |
|---|---|---|---|---|---|---|---|
| Registration and sign-in | Implemented, not browser-proven | Implemented | Atlas credential absent | Atlas credential absent | Not deployed | Not run | Error responses implemented |
| URL analysis | Implemented, not browser-proven | Implemented | Static public fetch path implemented; Gemma credential absent | Draft held client-side until confirmation | Not deployed | Not run | Bounded fetch and truthful errors |
| Grounded profile review | Implemented | Confirm route implemented | Gemma call path unproven | Atlas credential absent | Not deployed | Not run | Edit and retry state in UI |
| Customer categories | Implemented | Query and ranking use selected values | Public provider calls implemented | Saved in confirmed profile when Atlas is available | Not deployed | Not run | Empty state and change-audience path |
| Opportunity discovery | Implemented | Four adapters and deduplication implemented | HTTP feasibility proven previously; app path not runtime-proven | Search results are transient until saved | Not deployed | Not run | Provider failures are kept separate |
| Source evidence and classification | Implemented | Deterministic rules implemented | Provider terms and freshness still bounded | Saved with opportunity | Not deployed | Not run | Stale/full-time records excluded |
| Proposal drafting | Implemented | Ownership and confirmed-claim route implemented | No external model required for this template | Saved on opportunity | Not deployed | Not run | Editable, copy, and original-source link |
| Save and recovery | Implemented | User-scoped MongoDB route implemented | Atlas credential absent | Not proven | Not deployed | Not run | Reload endpoint exists |

Authoritative matrix status: **BUILDING, CORE PATH NOT YET PROVEN**. The matrix
must not be upgraded from “not run” based on code inspection.

### Evidence from this build pass

Commands run from `C:\Users\HomePC\Desktop\source`:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS, zero errors and zero warnings.
- `npm run test`: PASS, 1 test file and 4 tests. Tests cover loopback,
  metadata, private-network, unsafe-port URL rejection and password hashing.
- `python C:\Users\HomePC\Desktop\skill\design-skill\scripts\audit_ui_text.py C:\Users\HomePC\Desktop\source`: PASS, 0 long-dash errors, 0 small-text warnings, 0 copy warnings.
- `npm run build`: PASS. Next.js generated the static landing route and all
  server route bundles. The final production build used Next.js 16.4.0.
- Local HTTP smoke check: `GET /` returned HTTP 200; `GET /api/auth/me`
  returned `{"user":null}`; unauthenticated `POST /api/profile/analyze`
  returned HTTP 401 with `UNAUTHORIZED`.

The browser automation connector was attempted twice after reset but failed
before opening a page with `failed to write kernel assets: The system cannot
find the path specified`. Therefore no browser screenshot or normal UI UAT is
claimed. The local production server did start on `http://localhost:3000` for
HTTP smoke testing; it must be stopped or replaced by the deployment process
before a public release.

### Security status

Supported by implementation and unit tests:

- No browser bundle receives MongoDB, Gemma, or SerpApi keys.
- Session tokens are HTTP-only, same-site cookies with production secure mode.
- Passwords are bcrypt-hashed.
- External URL fetching rejects credentials, non-http schemes, non-standard
  ports, loopback, private IPv4, selected private IPv6, metadata addresses,
  unsafe redirects, non-HTML content, timeouts, and responses above 1 MB.
- Website text is passed to the model inside explicit untrusted-data markers.
- Profile persistence, saved-opportunity retrieval, proposal reads, and writes
  are filtered by the authenticated user id.
- External HTML is rendered as plain text in React. No untrusted HTML is
  injected into the app.

Not yet proven:

- DNS rebinding resistance between validation and the actual Node fetch needs a
  production adversarial test.
- An unauthorized second-account read/write attempt needs two real Atlas-backed
  accounts.
- Model prompt injection needs a real Gemma call against a hostile public page.
- Runtime rate-limit behavior is in-process and should be replaced or backed by
  a shared store before multi-instance deployment.

### Sponsor-category qualification

| Category | Current decision | Evidence | Boundary |
|---|---|---|---|
| Gemma | CORE, blocked | Direct REST call and grounded parser are implemented; no key or live inference | Cannot claim Gemma category or model-backed UX until one live call is recorded |
| Render | CORE, pending | Next build succeeds locally; no Render account or public URL | Deployment and public UAT required |
| MongoDB Atlas | CORE, pending | MongoDB client, indexes, ownership filters, and save/reload routes exist | Atlas URI and two-account UAT required |
| Mastra | CORE-supporting | `source-profile-analysis` workflow contains the real Gemma step | Workflow runtime with live model must be exercised and traced |
| SerpApi | OPTIONAL | Adapter exists and is skipped without `SERPAPI_KEY`; phase-0 probe showed 401 without key | Use only if owner supplies key and result quality improves |
| Sentry Agent Tracing | OPTIONAL | No DSN or verified instrumentation yet | Do not claim category without actual traces |
| Entire | OPTIONAL | No qualifying session capture recorded | Do not claim category without qualifying evidence |
| GitHub Copilot | CONDITIONAL | No claim made | Only document if qualifying development use is captured |
| ElevenLabs | REJECTED FOR NOW | No audio is needed for the core outcome | Revisit only after core product proof |
| .tech | CONDITIONAL | No domain or eligibility decision | Owner approval and deployed domain evidence required |

The npm install reported 10 vulnerabilities (5 moderate, 5 high). No
`npm audit fix --force` was run because it could introduce breaking changes.
This is an open release audit item.

### Claim, mechanism, boundary, proof ledger

| Claim | Mechanism | Boundary | Required proof | Current status |
|---|---|---|---|---|
| A profile claim is grounded in the submitted page | Gemma must provide evidence quotes; server checks quote presence | Server profile sanitizer | Live Gemma response plus hostile-page test | SUPPORTED, live model unproven |
| Customer choices affect discovery | Server derives terms and score from selected values | `/api/opportunities/search` | Same profile with changed selections produces changed query/ranking/evidence | SUPPORTED by code, runtime UAT pending |
| A saved opportunity belongs to its user | Every opportunity query includes session user id | MongoDB query boundary | User A cannot read or write User B record | SUPPORTED by code, adversarial UAT pending |
| Source finds genuine opportunities | Provider adapters preserve source links and classify conservatively | Provider source plus Source classification | Fresh normal-user result from a permitted source | SUPPORTED for provider probes, product UAT pending |
| Source helps prepare an honest proposal | Draft uses only confirmed evidence, is editable, never sends automatically | Proposal route and UI | Fresh user edits and copies proposal with original link | SUPPORTED by code, UAT pending |
| Source does not guarantee clients or payments | Product copy and result language avoid guarantees | User-facing boundary | Review all screens and submission copy | PROVEN in current copy audit, deployed review pending |

### Active blockers and owner actions

Required owner actions before the Core Outcome can be proven:

1. Provide a Google AI Studio or approved Google API key through a local
   `.env.local` or Render secret, never in chat or a committed file.
2. Provide a MongoDB Atlas connection string, database name, and permission to
   run the two-account persistence test.
3. Provide a Render account/repository target and authorize public deployment.
4. Decide whether to supply a SerpApi key. Source can proceed without it using
   public sources, but buyer discovery remains limited and explicitly labeled.
5. Supply or authorize the repository and public demo URL required by the
   hackathon submission.

The current code can continue to be tested locally without these values for
static rendering, typechecking, and security boundaries. The following actions
must stop rather than fabricate proof: claiming live Gemma output, claiming
Atlas persistence, claiming a deployed URL, claiming normal browser UAT, or
claiming sponsor category eligibility without evidence.

### Exact next action for a replacement director

1. Configure only the owner-approved `GOOGLE_API_KEY`, `MONGODB_URI`,
   `MONGODB_DB`, and `SESSION_SECRET` in a local ignored `.env.local`.
2. Start the production server and use a normal browser to create two accounts.
3. On account A, analyze a real public URL, record the Gemma model and latency,
   edit and confirm the profile, select startups, and run discovery.
4. Save an opportunity, generate and edit a proposal, refresh, log out, sign
   back in, and recover the saved record.
5. Attempt account B access to account A's saved id and confirm refusal.
6. Repeat a category search with a different selection and preserve the result
   evidence showing query/ranking change.
7. Run a failed provider call and an unsafe URL submission through the UI.
8. Only if the local path passes, connect Render and repeat the same acceptance
   path against the public URL.
9. Update this matrix, evidence package, README, and hackathon checklist with
   observed results. Keep status as BUILDING until the Director gate answers
   every Core Outcome question with evidence.

## Directive 004 live integration checkpoint

Timestamp: 2026-10-14 (Africa/Lagos).

Directive 004 was read and applied. The instruction to begin with the first
unavailable critical dependency was followed. No feature redesign or broad
research phase was started.

The infrastructure inspection found no values or names for
`GOOGLE_API_KEY`, `GEMINI_API_KEY`, `GEMMA_API_KEY`, `MONGODB_URI`,
`MONGODB_DB`, `SESSION_SECRET`, `SERPAPI_KEY`, or `SENTRY_DSN` in the process
environment. `C:\Users\HomePC\Desktop\source\.env.local` is absent;
`.env.example` is present. A 48-byte cryptographically random session-secret
candidate was generated locally and intentionally withheld and not persisted
because the owner has not supplied an approved integration configuration.

### Live integration status

| Integration | Current status | Evidence | Blocker |
|---|---|---|---|
| Gemma | IMPLEMENTED, INTEGRATION UNPROVEN | Direct server-side REST path and Mastra workflow exist | No owner-approved API key |
| MongoDB Atlas | IMPLEMENTED, INTEGRATION UNPROVEN | Client, indexes, ownership filters, save/reload routes exist | No URI, database, or network authorization |
| Browser UAT | BLOCKED | Connector failed before page load with `failed to write kernel assets: The system cannot find the path specified` | Use another browser method or guided manual UAT |
| Discovery | COMPONENT SUPPORTED, PRODUCT UAT UNPROVEN | Prior live provider probes plus current adapters | No authenticated UI run |
| Render | NOT STARTED | No account, repository target, or deployment URL | Owner authorization and deployment target |

The required npm production dependency audit completed with approved access. It
reported five moderate vulnerabilities through the Mastra dependency chain,
including `sprintf-js` via `argparse`, `js-yaml`, and `gray-matter`. npm's
suggested `npm audit fix --force` would install a breaking Mastra downgrade and
was not run. This remains an open release decision.

The full checkpoint and owner-executable acceptance procedure are in
[docs/phase-3-live-integration-report.md](C:\Users\HomePC\Desktop\source\docs\phase-3-live-integration-report.md).

Current authoritative status remains: **BUILDING, CORE PATH NOT YET PROVEN**.

## Directive Hotfix 007 — Gemma JSON parsing and live boundary

Timestamp: 2026-10-14 (Africa/Lagos).

### Exact root-cause finding

The reported `Unexpected non-whitespace character after JSON at position 283`
was raised by the model-output parser, not by website extraction. Before this
hotfix, both `src/lib/gemma.ts` and `scripts/gemma-check.mjs` found the first
`{`, found the last `}`, sliced everything between them, and passed that slice
to native `JSON.parse`. A valid JSON object followed by model commentary, or
two JSON objects in one candidate, therefore produced the reported native JSON
error. This was unsafe response framing and not evidence of malformed website
HTML.

The boundaries are now explicit:

- `src/lib/extract.ts` uses Cheerio to remove active/non-content elements and
  build plain text; it performs no JSON-LD parsing and contains no `JSON.parse`.
- `src/lib/profile-workflow.ts` only passes the extracted website to the
  Mastra workflow; it contains no response decoding or JSON parsing.
- `src/lib/gemma.ts` decodes the Google HTTP body with a guarded
  `response.json()`, scans balanced JSON object spans while respecting quoted
  strings and escapes, requires exactly one object, parses the complete object,
  and validates it with the Zod profile schema before any claim is used.
- `scripts/gemma-check.mjs` mirrors the same full-object rule and independently
  validates the expected profile shape. It accepts one schema-valid object
  surrounded by harmless text only as a diagnostic compatibility measure; it
  rejects zero objects, incomplete objects, invalid JSON, multiple objects,
  and schema-invalid objects. It never truncates a candidate to make it parse.
- A `MAX_TOKENS` candidate is now reported as `MODEL_MAX_TOKENS` in the app,
  rather than being misreported as an arbitrary JSON parse failure.

Google's official structured-output model support table does not list the
configured Gemma model. The Gemma path therefore does not claim schema-enforced
structured output: it uses an exact-one-object instruction, bounded concise
output, full-document parsing, and Zod validation. The current request does
not send the undocumented `responseMimeType` field to Gemma. References:
[Gemma on the Gemini API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api),
[generateContent API](https://ai.google.dev/api/generate-content), and
[structured outputs model support](https://ai.google.dev/gemini-api/docs/structured-output).

### Redacted live evidence

The public source fetch completed successfully for `https://www.frog.co/`:
`sourceFetchHttpStatus=200`, content type `text/html; charset=utf-8`. This
separates website retrieval and extraction from the model failure.

The first complete post-parser Gemma response returned HTTP 200 with one
candidate, one content part, no prompt block, and
`finishReason=MAX_TOKENS`; the candidate was 5,317 characters and incomplete.
The strict parser correctly rejected it rather than accepting a partial JSON
document. A later attempt timed out at the 90-second transport guard before a
response (`responseHttpStatus=null`), and the next attempts returned
`HTTP 500: Internal error encountered` with zero candidates.

Additional redacted checks against the same configured key/model:

| Check | Result | Interpretation |
|---|---|---|
| Model list | HTTP 200; 50 models; target advertises `generateContent` and `countTokens` | Credential and model discovery path works |
| Target `countTokens` | HTTP 200; 11 tokens for a minimal prompt | Request format/model access is accepted |
| Minimal target `generateContent` | HTTP 500; zero candidates | Live generation service is currently failing independently of Source extraction/parsing |
| Other listed Gemma model | HTTP 500; zero candidates | Not isolated to one configured Gemma model |
| Stable `v1` generation | HTTP 500; zero candidates | Not isolated to the `v1beta` path |
| Streaming generation | HTTP 500; zero candidates/content body only error metadata | Streaming is not a working fallback |

The final probe rerun after tightening the prompt to one concise item per list
returned HTTP 200 with one candidate but still ended at `MAX_TOKENS`; the
10,688-character candidate was rejected as `MODEL_MULTIPLE_JSON_OBJECTS`.
This is expected safe handling of an ambiguous/truncated candidate, not a
successful profile. No candidate text was printed.

No API key, generated text, private account data, or website-private content
was printed in these diagnostics. The only grounded-profile acceptance signal
currently available is the code-level rule that an accepted claim must include
an evidence quote of at least eight normalized characters that occurs in the
extracted source text. A successful Gemma profile with a live grounded claim
has not yet been recorded because Google generation is unavailable.

### Ownership and regression evidence

- `npm run typecheck`: PASS after the hotfix.
- `node --check scripts/gemma-check.mjs`: PASS after the hotfix.
- `npm run build`: PASS; Next.js production build completed successfully.
- `npm run probe:ownership`: PASS against the configured real MongoDB path
  with a running production server. Two generated accounts registered; the
  owner saved an opportunity; the second account was denied proposal access;
  the second account's saved list did not contain the record; both test
  accounts were deleted during cleanup.

The earlier ownership `fetch failed` result was a local-server condition: no
process was listening on port 3000. It is superseded by the subsequent
production-server run above, not silently counted as a MongoDB failure.

### Acceptance status and next owner action

The Gemma parsing hotfix is implemented and statically verified, and the
MongoDB ownership path is proven. The core URL-first acceptance test remains
**BLOCKED at the external Gemma generation step**. The product must not claim
grounded model output, complete end-to-end acceptance, deployment readiness,
or Gemma sponsor qualification until one real request returns a complete,
schema-valid profile with at least one evidence quote matching the submitted
website text.

Next action: retry the same probe after Google resolves the current Gemma
`generateContent` 500/timeout condition, then record the successful
`responseHttpStatus`, candidate finish reason, object count, schema result,
and grounded-evidence count. Only after that should the normal browser journey
be repeated through analyze, edit, confirm, category selection, discovery,
save, refresh, and account isolation.

### Directive 005 live probe evidence

The configured local services were exercised without printing secrets:

| Probe | Result | Evidence |
|---|---|---|
| MongoDB Atlas | FAIL | The driver reached Atlas but returned bad auth: Authentication failed. No CRUD proof was recorded and cleanup could not authenticate. |
| Google model listing | PASS, limited | The configured key received HTTP 200 from the model-list endpoint; the configured Gemma model was visible among 50 listed models. |
| Gemma generateContent | FAIL | A minimal request and the website-grounding probe both returned HTTP 500: Internal error encountered. No model-backed profile claim is accepted as proven. |
| Discovery providers | PASS, public-source probe | Hacker News returned 50 comments: 3 explicit project requests, 12 freelance/contract signals, 1 unconfirmed buyer signal, and 34 stale. Jobicy returned 50 records: 7 freelance/contract, 36 unconfirmed buyer signals, and 7 irrelevant. Remote OK returned 99 records: 3 freelance/contract, 5 unconfirmed buyer signals, 1 irrelevant, and 90 stale. SerpApi was skipped because no key is configured. |
| Authenticated ownership | BLOCKED | The local production server returned HTTP 500 during account registration because the Atlas connection failed authentication. The generated test accounts were not created; cleanup also reported the same Atlas auth failure. |

The provider probe proves current public responses and Source’s conservative
classification counts only. It does not prove that each record is a paying
client or that a normal authenticated UI search has passed.

### Directive 005 regression evidence

After adding the probes and deployment documentation:

- production build: PASS
- TypeScript typecheck: PASS
- ESLint with zero warnings allowed: PASS
- Vitest: PASS, 1 file and 4 tests
- UI copy audit: PASS, 0 long-dash errors, 0 small-text warnings, 0 copy warnings
- Node syntax checks for all four probe scripts: PASS

An initial concurrent test run hit an EPERM while Vite tried to write a
temporary config file under node_modules. The isolated rerun with the required
file access passed; the EPERM was not treated as a product test result.

### Current blockers after live probes

1. Correct or rotate the Atlas application credentials and verify the Atlas
   Network Access rule for this machine. Then rerun the MongoDB probe and the
   ownership probe.
2. Ask the Google AI Studio owner to inspect the project’s Gemma API access,
   quota, billing, and service-side error logs. Model listing works, but
   generateContent returns HTTP 500, so the reason is not proven locally.
3. Run the manual browser journey after both live services pass, including a
   hostile-page grounding check and selected-category comparison.
4. Create the authorized GitHub and Render resources only after local
   acceptance is possible, then configure Render outbound IP access in Atlas
   and repeat the same evidence path publicly.

No Core Outcome, sponsor category, public deployment, or browser acceptance
has been marked complete.
Do not claim Gemma, Atlas, browser UAT, Render, sponsor completion, or
submission readiness until the required owner actions and normal deployed user
journey are evidenced.

## Directive 005 infrastructure preparation checkpoint

Timestamp: 2026-10-14 (Africa/Lagos).

Directive 005 was read and applied. The work shifted from repeating missing
credential checks to preparing controlled integration and deployment evidence.
The owner-provided local configuration was found under an initially named
env.local.txt; it was moved into the ignored .env.local file without printing
any values. The file contains MONGODB_URI, MONGODB_DB, and GOOGLE_API_KEY. A
cryptographically random 64-character SESSION_SECRET was generated and
persisted in the ignored file. Secret values were not displayed or logged.

### Reusable probes

The following owner-runnable probes were added:

| Probe | Mechanism | Evidence boundary |
|---|---|---|
| npm run probe:mongodb | Atlas ping, insert, read, delete, and cleanup against a dedicated check collection | Requires a real URI and network permission; output is redacted |
| npm run probe:gemma -- https://example.com | Fetches a bounded public HTML page, calls the configured Gemma REST model, parses structured JSON, and counts evidence-bearing claims | Requires a real Google key; does not prove the full browser journey |
| npm run probe:discovery | Queries Hacker News Algolia, Jobicy, Remote OK, and optional SerpApi; applies Source freshness and classification policy | Reports public signals, not guaranteed jobs or clients |
| npm run probe:ownership | Registers two generated accounts through HTTP, saves through the supported route, verifies cross-account proposal refusal and saved-list isolation, then removes exact generated test accounts | Requires a running app plus Atlas; direct HTTP integration evidence, not browser UAT |

npm run probe:all runs the four probes sequentially. It has not been
represented as passing until its real output is captured after the owner
configuration is exercised.

### Browser and deployment preparation

Playwright and @playwright/test are not installed. Chrome and Edge executable
paths exist, but the Codex browser connector still fails before page load with
'failed to write kernel assets: The system cannot find the path specified'.
No browser UAT is claimed. The exact manual acceptance procedure is in
[docs/manual-acceptance.md](C:\Users\HomePC\Desktop\source\docs\manual-acceptance.md).

Render preparation is in render.yaml and
[docs/deployment.md](C:\Users\HomePC\Desktop\source\docs\deployment.md). It is
an un-deployed Blueprint for a Node web service with a build command, start
command, health path, generated session secret, and prompted server secrets.
No GitHub repository, Render service, or public URL has been created.

### Directive 005 security review

The production audit continues to report five moderate findings through
@mastra/core -> gray-matter -> js-yaml -> argparse -> sprintf-js. The path is a
production dependency because Source imports Mastra in the profile workflow. No
npm audit fix --force was run because npm indicates a breaking Mastra
downgrade. The exact review and follow-up are in
[docs/security-audit-005.md](C:\Users\HomePC\Desktop\source\docs\security-audit-005.md).

### Updated current status

| Area | Status | Evidence | Remaining boundary |
|---|---|---|---|
| Local configuration | PREPARED | Ignored .env.local with owner service names plus generated session secret; values undisclosed | Must exercise real services |
| MongoDB Atlas | READY TO PROBE | Reusable CRUD/cleanup probe | Need live output, then two-account UI acceptance |
| Gemma | READY TO PROBE | Reusable website-to-model structured-output probe | Need live output, hostile-page test, then UI acceptance |
| Discovery | READY TO PROBE | Reusable provider-quality probe and existing adapter | Need authenticated search output and selected-category comparison |
| Ownership | READY TO PROBE | Reusable two-account HTTP isolation probe | Need browser-backed proof and deployed rerun |
| Browser UAT | BLOCKED | Connector error, no Playwright package, manual fallback prepared | Owner must run normal browser or provide runner |
| Render | PREPARED, NOT DEPLOYED | Blueprint and Atlas guidance | Owner GitHub/Render authorization and public URL |
| Dependency audit | OPEN RISK | Five moderate Mastra-chain findings | Compatible update or explicit accepted-risk decision |

### Exact next actions for a replacement director

1. Run npm run probe:mongodb and record only its redacted result.
2. Run npm run probe:gemma -- <owner-approved-public-url> and record model,
   latency, claim count, and grounded claim count.
3. Run npm run probe:discovery and record provider counts and classifications.
4. Build and start Source, then run npm run probe:ownership; verify cleanup.
5. Run the manual acceptance path in a normal browser, including edit,
   confirm, category change, source-linked result, save, refresh, and account
   isolation.
6. Create the authorized GitHub repository and Render service, add the
   required secrets, configure the Atlas outbound IP allowlist, and rerun the
   same acceptance path against the public URL.
7. Update this document with observed outputs and only then decide whether the
   Core Outcome and sponsor categories can be marked proven.

Current authoritative status remains: **BUILDING, CORE PATH NOT YET PROVEN**.

## Final Hotfix 007 state override

The older Directive 005 tables above are historical snapshots. Hotfix 007 is
the latest evidence: MongoDB-backed ownership is now **PROVEN by the real
production-server probe**, while Gemma profile generation remains **BLOCKED by
Google HTTP 200/`MAX_TOKENS` truncation plus intermittent 500/timeout behavior**
after model-list and token-count checks passed. No earlier `READY TO PROBE`, Atlas-authentication failure, or
Gemma-generation wording should be read as superseding the Hotfix 007 section.

The project is therefore still **BUILDING, CORE PATH NOT YET PROVEN**. The
next director must first obtain one complete schema-valid Gemma profile with a
source-text-matching evidence quote, then repeat normal-browser acceptance and
deployment checks.

## Directive 008 — final AI recovery checkpoint

Timestamp: 2026-10-14 (Africa/Lagos).

Directive 008 was read and applied. Hotfix 007 remains accepted for the parser,
MongoDB CRUD, and ownership isolation, but the AI profile path was not claimed
complete.

### Gemma Phase A and B evidence

The controlled minimal Gemma test used the owner-configured Google key,
`gemma-4-26b-a4b-it`, `thinkingLevel=minimal`, and a 300-token output cap. It
returned:

```json
{"test":"gemma-minimal","model":"gemma-4-26b-a4b-it","httpStatus":500,"latencyMs":981,"candidateCount":0,"finishReason":null,"partCount":0,"outputLength":0,"hasError":true,"errorMessage":"Internal error encountered.","thinkingLevel":"minimal"}
```

The actual `frog.co` profile probe was then reduced to representative page
content, the compact business-name/summary/services/customer-segments contract,
`thinkingLevel=minimal`, and bounded retries. The source fetch still returned
HTTP 200, but Gemma generation remained unavailable. The latest bounded probe
ended with a transport timeout after 90 seconds; earlier controlled attempts
returned HTTP 500 with zero candidates. A previous HTTP 200 attempt returned a
candidate ending in `MAX_TOKENS`; the strict parser rejected it before schema
acceptance. No grounded profile was accepted.

The implementation now records, where Google supplies them, the selected model,
thinking level, output-token limit, bounded retry statuses, candidate count,
finish reason, part count, prompt-block status, usage metadata, response length,
latency, and schema/parser outcome. It classifies `MAX_TOKENS` before parsing,
does not accept incomplete JSON, and uses no unbounded retry loop.

### Fallback preparation

No `GROQ_API_KEY` is present in the owner configuration. The fallback therefore
has not been called and no billable external usage has been created.

The narrow provider boundary is implemented in `src/lib/gemma.ts` and keeps the
existing Mastra workflow, profile schema, evidence verifier, and UI contract.
Set `INFERENCE_PROVIDER=groq` only after owner approval and a server-side
`GROQ_API_KEY` is configured. Without that key, the path fails closed with
`GROQ_NOT_CONFIGURED`.

The prepared fallback uses `qwen/qwen3.8-27b`, `reasoning_effort=none`, and
Groq strict JSON Schema output. Groq's official documentation lists this model
as supporting strict JSON Schema mode and says strict mode guarantees schema
conformance:
[Qwen 3.8 27B model documentation](https://console.groq.com/docs/model/qwen/qwen3.8-27b),
[Groq structured outputs](https://console.groq.com/docs/structured-outputs).
No fallback profile, provider qualification, or sponsor claim is recorded yet.

### Code and regression evidence

- Compact representative-input Gemma prompt and `thinkingLevel=minimal`: implemented.
- Explicit `MAX_TOKENS` handling before parsing: implemented.
- Bounded transient HTTP retry policy: implemented, maximum two attempts for
  429/500/502/503/504 only.
- Optional Groq provider with strict schema and server-only key: implemented,
  not live-tested because the key is missing.
- `.env.example` documents `INFERENCE_PROVIDER` and `GROQ_API_KEY`; the ignored
  local environment was not modified with a placeholder secret.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS.
- `node --check scripts/gemma-check.mjs`: PASS.
- Earlier real MongoDB CRUD probe: PASS.
- Earlier real production-server ownership probe: PASS; cross-account access
  denied and cleanup passed.

### Current release gate

The project remains **BUILDING, CORE PATH NOT YET PROVEN**. Browser UAT,
public deployment, full profile generation, discovery, proposal, persistence
recovery, and second-account browser acceptance are not complete. The only
blocking owner action for AI recovery is to authorize and securely configure a
Groq API key, then set `INFERENCE_PROVIDER=groq`. After that, the next director
must run one minimal fallback test, one real `frog.co` profile test, and the
complete local user journey before preparing Render and public browser UAT.

## Directive 009A — OpenRouter Gemma priority and DeepSeek fallback

Timestamp: 2026-10-14 (Africa/Lagos). This section supersedes the Directive 008
Groq fallback plan. Groq was not used for this decision and is not a Source
provider in the current implementation.

### Credential and provider inspection

The server environment was inspected using presence, length, and variable-name
checks only. No secret value was printed or written. The current local state is:

| Variable | Presence | Meaning |
|---|---:|---|
| `GOOGLE_API_KEY` | present | Direct Google Gemma route is callable, but generation is failing below |
| `OPENROUTER_API_KEY` | absent | OpenRouter Gemma test cannot be authorized |
| `DEEPSEEK_API_KEY` | absent | DeepSeek fallback test cannot be authorized |
| `GROQ_API_KEY` | absent | Groq was not called and is not selected |
| `INFERENCE_PROVIDER` | unset | Application continues to the explicit `gemma` default |

The ignored `.env.local` contains only the previously configured MongoDB,
Google model, and session variable names. The owner must add any new key
through the server environment; no key is requested in chat and no paid
provider is contacted without that configuration.

### Verified provider documentation

- Google's Gemma documentation lists `gemma-4-26b-a4b-it`, the REST
  `generateContent` endpoint, and Gemma 4 `thinkingConfig.thinkingLevel`.
  `minimal` is the documented setting used by the direct route:
  [Google Gemma on the Gemini API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api).
- OpenRouter documents the standard `POST
  https://openrouter.ai/api/v1/chat/completions` endpoint, bearer
  authentication, chat messages, and `response_format`:
  [OpenRouter chat completions API reference](https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request?explorer=true).
  Source uses the requested standard model id
  `google/gemma-4-26b-a4b-it`; it does not append `:free` and therefore does
  not treat a rate-limited free route as an independent fallback.
- DeepSeek documents `https://api.deepseek.com`, model `deepseek-flash`, and
  JSON mode via `response_format: {"type":"json_object"}`:
  [DeepSeek JSON output](https://api-docs.deepseek.com/guides/json_mode/),
  [DeepSeek create chat completion](https://api-docs.deepseek.com/api/create-chat-completion/).

Documentation verifies request feasibility only. Neither OpenRouter Gemma nor
DeepSeek has live integration proof in this workspace because the required
credentials are absent.

### Implementation decision

The provider boundary now preserves the existing Mastra workflow, `ProfileDraft`
schema, evidence-quote verifier, untrusted-website prompt boundary, and
server-only secret handling:

| Provider setting | Endpoint/model | Current decision | Proof boundary |
|---|---|---|---|
| `gemma` | Google Gemma REST, `gemma-4-26b-a4b-it` | Retained for diagnosis and owner-configured direct use | Current live run fails HTTP 500 |
| `openrouter-gemma` | OpenRouter standard endpoint, `google/gemma-4-26b-a4b-it` | **CORE priority if owner supplies an approved key** | Must return a complete grounded profile within the 20-minute time-box |
| `deepseek` | `https://api.deepseek.com/chat/completions`, `deepseek-flash`, JSON mode | **CORE fallback if OpenRouter fails the time-box** | Must pass the same parser, schema, and grounded-evidence checks |

The OpenRouter and DeepSeek routes use the same compact profile prompt,
`response_format: {"type":"json_object"}`, bounded retries, and full Source
schema validation. The parser rejects multiple JSON objects, malformed JSON,
truncated output, and unexpected schema shapes; it does not blindly truncate a
response. The resulting profile is then passed through the same deterministic
evidence-grounding function before the Mastra workflow returns it.

### Live probe evidence

The requested command was rerun:

```text
npm run probe:gemma -- https://www.frog.co/
```

Redacted result:

```json
{
  "status": "fail",
  "reason": "provider-or-extraction-or-parsing-failed",
  "code": "MODEL_HTTP_500",
  "provider": "gemma",
  "model": "gemma-4-26b-a4b-it",
  "sourceFetchHttpStatus": 200,
  "sourceContentType": "text/html; charset=utf-8",
  "responseHttpStatus": 500,
  "responseMeta": {
    "candidateCount": 0,
    "finishReasons": [],
    "partCount": 0,
    "attemptStatuses": [500, 500],
    "usage": null
  },
  "outputLength": 0,
  "latencyMs": 2494
}
```

This proves the website fetch layer succeeded and the model HTTP layer failed;
there was no model output, so JSON parsing and schema validation were not the
source of this particular failure. The provider-aware probe also failed closed
without contacting either new provider:

```json
{"status":"blocked","reason":"missing-environment","provider":"openrouter-gemma","model":"google/gemma-4-26b-a4b-it","missing":["OPENROUTER_API_KEY"]}
{"status":"blocked","reason":"missing-environment","provider":"deepseek","model":"deepseek-flash","missing":["DEEPSEEK_API_KEY"]}
```

### Verification after the provider change

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; the Next.js production bundle completed and exposed
  the expected dynamic API routes.
- `npm test -- --run`: PASS, 1 file and 4 tests.
- `node --check scripts/gemma-check.mjs`: PASS.
- OpenRouter live profile: NOT RUN; `OPENROUTER_API_KEY` absent.
- DeepSeek live profile: NOT RUN; `DEEPSEEK_API_KEY` absent.
- Grounded profile acceptance: NOT PROVEN; neither provider has produced a
  schema-valid profile with a website-text-matching evidence quote.
- MongoDB CRUD and ownership isolation remain PASS from the prior real probes.
- Full normal-user journey, deployed public UAT, and Render deployment remain
  NOT RUN.

### Current release gate and exact next owner action

The project remains **BUILDING, CORE PATH NOT YET PROVEN**. The final provider
choice is intentionally not claimed yet: the implementation is OpenRouter-first
when an owner-approved key is configured, with DeepSeek as the documented
fallback. The next owner action is to securely configure one of these routes
without pasting the key into chat:

```text
INFERENCE_PROVIDER=openrouter-gemma
OPENROUTER_API_KEY=<owner-configured-secret>
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it
```

If the OpenRouter route cannot produce a grounded profile within the agreed
20-minute test window, replace the provider selection with the owner-approved
DeepSeek configuration:

```text
INFERENCE_PROVIDER=deepseek
DEEPSEEK_API_KEY=<owner-configured-secret>
DEEPSEEK_MODEL=deepseek-flash
```

After either route passes the real `frog.co` probe, the replacement director
must immediately run the full user-flow acceptance path, verify persistence and
ownership recovery, then prepare Render deployment and repeat the acceptance
test against the public URL. No Gemma sponsor claim, DeepSeek provider claim,
full acceptance claim, or deployment claim is valid before those proofs exist.

## Directive 010 — final model activation and deployment checkpoint

Timestamp: 2026-10-14 (Africa/Lagos). Owner deadline recorded as October 14,
2026, 11:51 PM WAT. This checkpoint records only newly verified activation and
deployment-preparation evidence; the Core Outcome remains unproven.

### OpenRouter free activation result

The owner-configured server environment was checked without printing secret
values. It contained `INFERENCE_PROVIDER=openrouter-gemma`, an
`OPENROUTER_API_KEY`, and `OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free`.
The standard paid model was not selected. `DEEPSEEK_API_KEY` was absent.

The first-priority command was run against the real public site:

```text
npm run probe:gemma -- https://www.frog.co/
```

Redacted result:

```json
{
  "status": "fail",
  "reason": "provider-or-extraction-or-parsing-failed",
  "code": "MODEL_HTTP_429",
  "provider": "openrouter-gemma",
  "model": "google/gemma-4-26b-a4b-it:free",
  "sourceFetchHttpStatus": 200,
  "responseHttpStatus": 429,
  "responseMeta": {
    "candidateCount": 0,
    "finishReasons": [],
    "partCount": 0,
    "attemptStatuses": [429, 429],
    "usage": null
  },
  "outputLength": 0,
  "latencyMs": 1558
}
```

The website extraction layer passed. OpenRouter's free provider route returned
HTTP 429 on both bounded attempts, so no model content existed to parse and no
profile could reach schema validation or evidence grounding. This is a
provider-capacity/rate-limit failure, not a claim that a profile was generated.
Per the directive, repeated attempts were stopped within the 15-minute
activation window.

The OpenRouter model-selection guard was tightened after this test:

- `INFERENCE_PROVIDER=openrouter-gemma` now requires `OPENROUTER_MODEL`.
- Source never silently substitutes `google/gemma-4-26b-a4b-it` when the
  environment variable is missing.
- `.env.example` and `render.yaml` explicitly select
  `google/gemma-4-26b-a4b-it:free` for the initial activation.
- The provider still uses JSON mode plus Source-side validation; it does not
  rely on free-route strict JSON Schema enforcement.

### DeepSeek fallback result

The fallback was not callable because `DEEPSEEK_API_KEY` is not present in the
server environment. The provider-aware probe therefore failed closed before
contacting DeepSeek:

```json
{
  "status": "blocked",
  "reason": "missing-environment",
  "provider": "deepseek",
  "model": "deepseek-flash",
  "missing": ["DEEPSEEK_API_KEY"]
}
```

No DeepSeek profile, schema result, grounding result, or provider qualification
is claimed. The next permitted model action is to configure the owner's key
securely, set `INFERENCE_PROVIDER=deepseek`, and run the same real `frog.co`
probe once. No further repeated OpenRouter free-route attempts are justified.

### Application and security verification

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test -- --run`: PASS, 1 file and 4 tests.
- `npm run build`: PASS; all current API routes compiled.
- `node --check scripts/gemma-check.mjs`: PASS from the preceding provider
  implementation verification.
- `.env.local` remains ignored and was not staged.
- A filenames-only high-confidence credential scan found no credential pattern
  outside the handoff's explicit placeholder examples.
- The current provider-aware server route remains server-only; no key is sent
  to the browser.

### Repository and Render preparation

Source was initialized as a clean local Git repository at
`C:\Users\HomePC\Desktop\source` and committed locally:

```text
568feaf chore: initialize Source deployment candidate
```

The repository has no configured remote and has not been published. That is an
authorization boundary, not a deployment failure.

The Render Blueprint at `render.yaml` was updated and locally reviewed to use:

- `INFERENCE_PROVIDER=openrouter-gemma`
- `OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free`
- secret `OPENROUTER_API_KEY` with `sync: false`
- secret `DEEPSEEK_API_KEY` with `sync: false`
- `DEEPSEEK_MODEL=deepseek-flash`
- existing MongoDB, session, discovery, observability, and application URL
  variables

No Render API credential is configured, no GitHub token is configured, no
remote repository exists, no Atlas networking change was made, and no service
was created. Publishing and service creation still require owner authorization.

### Core journey status

The full integrated journey was **not run** because neither approved model
route produced a grounded profile:

`Registration -> URL analysis -> profile review/confirmation -> customer
category selection -> live discovery -> source-linked inspection -> proposal ->
save -> refresh -> logout/login recovery`

The earlier real MongoDB CRUD and account-isolation probes remain reusable
evidence, but they do not replace integrated browser proof. No claim is made
that the current deployed-or-local user path has completed end to end, and no
customer-category differentiation was revalidated in this checkpoint.

### Remaining owner actions and exact next step

1. Securely configure the owner's DeepSeek credential in the server environment
   without pasting it into chat:

   ```text
   INFERENCE_PROVIDER=deepseek
   DEEPSEEK_API_KEY=<owner-configured-secret>
   DEEPSEEK_MODEL=deepseek-flash
   ```

2. Run exactly one real `frog.co` probe and record HTTP status, latency,
   schema validity, and grounded-claim count.
3. If that profile passes, authorize GitHub publication and Render service
   creation, add the Atlas networking rule, and run the complete browser path
   against the public deployment.
4. If browser automation remains unavailable, use
   `docs/manual-acceptance.md` and obtain explicit owner acceptance for each
   step; do not convert manual instructions into a pass without that response.

Current status remains **BUILDING — Core Outcome unproven**. No Gemma category,
DeepSeek success, complete user journey, GitHub publication, Render deployment,
or final acceptance is claimed.

## Directive 011 — final DeepSeek core integration checkpoint

Timestamp: 2026-10-14 (Africa/Lagos). The owner selected DeepSeek as the active
provider. Gemma and OpenRouter troubleshooting stopped after this point.

### DeepSeek activation

The environment was inspected with secret-safe presence and length checks:

| Variable | Verified state |
|---|---|
| `INFERENCE_PROVIDER` | `deepseek` |
| `DEEPSEEK_MODEL` | `deepseek-flash` |
| `DEEPSEEK_API_KEY` | Present, value undisclosed |
| `MONGODB_URI` | Present, value undisclosed |
| `MONGODB_DB` | `source` |
| `SESSION_SECRET` | Present, value undisclosed |

The DeepSeek Chat Completions request now sends:

- `https://api.deepseek.com/chat/completions`
- model `deepseek-flash`
- `thinking: {"type":"disabled"}`
- `response_format: {"type":"json_object"}`
- bounded `max_tokens: 4000`
- no `temperature` field in non-thinking mode
- a prompt containing a valid JSON example and an explicit JSON-only request
- website text bounded to 8,000 characters before inference

The thinking-disable request shape is supported by the official [DeepSeek
thinking-mode documentation](https://api-docs.deepseek.com/guides/thinking_mode/)
and the model/endpoint/JSON capability is documented in the [DeepSeek Chat
Completions API](https://api-docs.deepseek.com/api/create-chat-completion/) and
[models and pricing documentation](https://api-docs.deepseek.com/quick_start/pricing/).

### Initial DeepSeek failure and correction

The first real application-compatible request returned HTTP 200 and one
completed choice but was rejected by Source schema validation:

```json
{
  "status": "fail",
  "code": "MODEL_INVALID_SCHEMA",
  "provider": "deepseek",
  "model": "deepseek-flash",
  "responseHttpStatus": 200,
  "finishReasons": ["stop"],
  "outputLength": 1960,
  "schemaIssue": "productsAndServices evidence was not an array"
}
```

The exact request-construction defect was that the prompt showed pseudo-JSON
placeholders such as `"businessName": string` and `"evidence": string[]`,
not a valid JSON example. The probe also required optional profile claim groups
that Source intentionally defaults when omitted. Source did not coerce the bad
evidence shape or truncate the response. It was rejected.

The correction was narrow and provider-specific:

1. Replace pseudo-JSON with a valid example object containing string, array, and
   boolean values.
2. Require DeepSeek to reuse exact grounded service/skill/technology terms in
   `searchKeywords`.
3. Keep `evidence` as a required string array for every claim.
4. Validate required compact fields and validate optional full claim groups only
   when present, matching the existing Zod defaults used by the application.
5. Raise only the DeepSeek output ceiling from 2,000 to 4,000 tokens. Input
   remains bounded and `finish_reason=length` remains a hard failure.

A subsequent application run exposed one intermittent `finish_reason=length`
response at the 2,000-token ceiling. The server log isolated it to model
truncation, not MongoDB, parsing, grounding, or HTTP failure. The bounded
4,000-token ceiling removed that failure in the final run without adding an
unbounded retry.

### Final standalone DeepSeek probe

The required command was rerun after the correction:

```text
npm run probe:gemma -- https://www.frog.co/
```

Final redacted result:

```json
{
  "status": "pass",
  "provider": "deepseek",
  "model": "deepseek-flash",
  "latencyMs": 3697,
  "sourceFetchHttpStatus": 200,
  "sourceTitle": "frog | Your reinvention and experience partner",
  "claimCount": 5,
  "groundedClaimCount": 5,
  "responseHttpStatus": 200,
  "responseMeta": {
    "candidateCount": 1,
    "finishReasons": ["stop"],
    "outputTokenLimit": 4000,
    "attemptStatuses": [200],
    "usage": {
      "promptTokenCount": 1093,
      "candidatesTokenCount": 491,
      "totalTokenCount": 1584
    }
  },
  "outputLength": 2363,
  "jsonObjectCount": 1,
  "wrappedJson": false
}
```

This proves genuine DeepSeek inference, valid JSON, one unwrapped JSON object,
schema acceptance, and five exact website-grounded claims in the standalone
probe.

### Integrated local user journey

The local production server was rebuilt and started with the owner-configured
DeepSeek environment. The named command `npm run probe:core` then passed:

```json
{
  "status": "pass",
  "provider": "deepseek",
  "model": "deepseek-flash",
  "profile": {
    "sourceUrl": "https://www.frog.co/",
    "groundedClaimCount": 7,
    "extractedExcerptCount": 37
  },
  "discovery": {
    "startups": {"opportunityCount": 2, "relevantCount": 2},
    "smallBusinesses": {"opportunityCount": 2, "relevantCount": 2},
    "queryChanged": true,
    "selectedOpportunity": {
      "source": "Remote OK",
      "sourceUrl": "https://remoteOK.com/remote-jobs/remote-principal-software-engineer-vytalize-health-1137508",
      "classification": "freelance-or-contract",
      "profileMatches": 1,
      "categoryMatches": 1
    }
  },
  "proposal": {"generated": true, "length": 922},
  "persistence": {"savedBeforeLogout": true, "savedAfterLogin": true},
  "ownership": {"secondAccountSavedListIsolated": true, "crossAccountProposalDenied": true}
}
```

The harness created two temporary accounts, analyzed the real URL, confirmed an
edited profile, searched startups and small businesses separately, verified the
Hacker News query changed, selected a source-linked Remote OK freelance or
contract opportunity with profile overlap, generated a proposal, saved it,
logged out, logged back in, recovered the saved work, and verified the second
account could neither read the saved record nor draft against it. Generated
test records were deleted after the run.

One earlier run correctly stopped when live source variability returned no
profile-overlap opportunity. The final run passed after the prompt required
search keywords to reuse grounded service or skill terms. The harness remains
strict and will not call a category-only record relevant.

### Regression and security evidence

- `npm run probe:mongodb`: PASS, MongoDB ping/insert/read/delete/cleanup.
- `npm run probe:ownership`: PASS, separate registrations, owner save,
  cross-account denial, saved-list isolation, cleanup.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test -- --run`: PASS, 1 file and 4 tests. One concurrent run exceeded
  the 5-second bcrypt test timeout under load; the isolated rerun passed in
  4.73 seconds.
- `npm run audit:ui`: PASS, 0 long-dash errors, 0 small-text warnings, and 0
  copy warnings.
- `npm run build`: PASS, all current API routes compiled.
- `node --check scripts/gemma-check.mjs`: PASS.
- `node --check scripts/core-acceptance-check.mjs`: PASS.
- `.env.local` remains ignored and was not committed.

### Browser, deployment, and production UAT status

The local production server was reachable at `http://localhost:3000` for the
HTTP integration harness. The Codex in-app browser refused the localhost tab
under its URL policy, so visual browser UAT was not claimed. The manual
procedure is in [docs/manual-acceptance.md](docs/manual-acceptance.md).

The local repository and Render preparation remain ready:

- Local Git commits exist: `568feaf`, Directive 010 evidence commit `aecbde2`,
  and Directive 011 integration commit `351a975`.
- No GitHub remote or GitHub token is configured.
- `render.yaml` uses server-side DeepSeek configuration and does not include
  `.env.local`.
- No Render API credential is configured.
- No Render service or public URL exists.
- No Atlas outbound-IP change was made because deployment authorization and the
  target Render service are not configured.

Therefore local core integration is **PROVEN**, while visual browser UAT,
public deployment, production connectivity, and owner final acceptance remain
open release gates.

### Final provider and release decision

DeepSeek is now the active CORE inference provider. No Gemma prize-category
eligibility is claimed. Optional sponsor integrations remain paused.

The next owner actions are:

1. Authorize GitHub repository publication and provide the approved repository
   destination or connection.
2. Authorize Render service creation and configure the server-side values from
   `render.yaml`, including MongoDB Atlas network access.
3. Run the visual browser procedure against the public URL and inspect the same
   account, profile, category, source, proposal, save, logout/login, and
   ownership path.
4. Record explicit owner acceptance before marking Source finished.

Current status: **BUILDING, CORE LOCAL INTEGRATION PROVEN, PUBLIC DEPLOYMENT AND
VISUAL UAT PENDING**.

## Directive 013 — publication authorization and discovery-classification correction

Directive 013 authorized public GitHub publication and free-tier Render
deployment, subject to owner account authentication and no paid-service
activation. Before publication, the live discovery classifier was corrected.

### Classification root cause and correction

The Remote OK record for Vytalize Health (`1137508`) was previously labeled
`freelance-or-contract` because the description contains ordinary technical
phrases such as “API contracts.” Its provider employment-type field was empty.
That was not sufficient evidence of a contract engagement.

The classifier now:

- checks provider employment fields separately for explicit values such as
  `contract`, `freelance`, or `contractor`;
- accepts free-text contract evidence only when it is employment-contextual,
  such as “contract role,” “independent contractor,” “contract-to-hire,”
  `1099`, or an equivalent explicit phrase;
- recognizes strong full-time evidence such as `full-time`, annual salary,
  health insurance, or paid leave; and
- returns `unknown-employment-type` for fresh records without enough evidence
  instead of implying a contract. Unknown records are excluded from shown
  opportunities.

The corresponding standalone live probe uses the same rule set and now
includes a regression assertion for the affected public record. It passed:

```json
{
  "status": "pass",
  "regressionChecks": {
    "remoteOkVytalize": {
      "found": true,
      "classification": "full-time-employment",
      "freelanceOrContract": false
    }
  }
}
```

Positive and negative unit regressions were added in
`tests/discovery.test.ts`: API-contract language does not imply contract
employment; salary/benefit evidence classifies a Vytalize-shaped listing as
full-time; explicit independent-contractor language qualifies; and untyped
listings remain unknown. The suite passed with 2 test files and 8 tests.
TypeScript, lint, and the discovery probe also passed.

The earlier Directive 011 local acceptance output recorded the Vytalize item as
`freelance-or-contract`; that historical output is superseded by this
correction. A replacement core acceptance run is required before final release
because the corrected policy may legitimately remove that particular item from
the returned freelance/project set.

### Publication and deployment gate

The owner has now authorized creation of the public `source` GitHub repository,
free-tier Render service creation, secure production configuration, deployment,
and production testing. No paid upgrade, domain purchase, or billable resource
activation is authorized. The local repository remains clean apart from the
intentional classification changes and pre-existing workspace files
`next-env.d.ts` and `AGENTS.md`; those files require review before committing.

At this checkpoint no GitHub remote, GitHub authentication, Render service, or
public URL has yet been created. The next execution order is:

1. review and commit the classifier correction without staging `.env.local`;
2. inspect available GitHub/Render authentication and create the new repository
   only after confirming the destination account;
3. validate the Render Blueprint and configure server-side MongoDB, session,
   DeepSeek, and application URL variables;
4. establish Atlas network access using Render's actual outbound IP guidance,
   without weakening database security;
5. redeploy and repeat the complete browser journey against the public URL;
6. capture the deployed commit SHA, URLs, production status, security results,
   and owner manual-UAT outcome here.

Current status: **BUILDING, CLASSIFICATION CORRECTION PROVEN, PUBLIC
PUBLICATION AND DEPLOYMENT AUTHORIZED BUT NOT YET EXECUTED**.

### Post-correction acceptance rerun

The first post-correction core run failed honestly because the former Vytalize
candidate was excluded and the remaining live records had no exact whole-phrase
overlap with the generated Frog profile. The product was not relaxed to accept
an unrelated record. Matching was tightened for recall using grounded phrase
terms plus individual grounded concept tokens, with common stopwords excluded.
The matching evidence still comes only from confirmed profile claims and source
text.

The strict rerun then passed:

```json
{
  "status": "pass",
  "provider": "deepseek",
  "model": "deepseek-flash",
  "profile": {
    "sourceUrl": "https://www.frog.co/",
    "groundedClaimCount": 7,
    "extractedExcerptCount": 37
  },
  "discovery": {
    "startups": {"opportunityCount": 1, "relevantCount": 1},
    "smallBusinesses": {"opportunityCount": 1, "relevantCount": 1},
    "queryChanged": true,
    "selectedOpportunity": {
      "source": "Remote OK",
      "sourceUrl": "https://remoteOK.com/remote-jobs/remote-graphic-designer-video-editor-bluetuskr-1137507",
      "classification": "freelance-or-contract",
      "profileMatches": 6,
      "categoryMatches": 0
    }
  },
  "proposal": {"generated": true, "length": 796},
  "persistence": {"savedBeforeLogout": true, "savedAfterLogin": true},
  "ownership": {"secondAccountSavedListIsolated": true, "crossAccountProposalDenied": true}
}
```

The harness cleanup passed and deleted both temporary accounts. This proves the
corrected local HTTP journey remains complete with an actual source-linked
contract signal, while Vytalize remains excluded from that category.

### GitHub publication

The audited repository was published to the authorized public repository:

- URL: https://github.com/Techkeyy/source
- Published branch: `main`
- Published commit: `5bf4449fc1e363a778561f299842a2fcecb9b4e2`
- `.env.local`: ignored and not published
- Credential-pattern scan: no real keys or connection strings found; only
  documented placeholders remain

The subsequent post-correction matching changes and this handoff update are
now pushed in the current public `main` head:

- Current public `main` commit: `7d1f343a190386905501b912401096c252b45387`
- The earlier `5bf4449fc1e363a778561f299842a2fcecb9b4e2` commit remains in the
  public history as the initial classification-correction publication.

### Render status

The official Render documentation confirms that a Next.js server-rendered app
belongs on a free Web Service, that Free Web Services are available but can
spin down after 15 minutes and have outbound-traffic/build limits, and that a
Blueprint requires owner-supplied secret values. See [Render free services](https://render.com/docs/free),
[Render web services](https://render.com/docs/web-services), and the
[Blueprint reference](https://render.com/docs/infrastructure-as-code).

The Render dashboard opened successfully, but its GitHub OAuth flow reached the
GitHub login screen and requires the owner to authenticate interactively. No
Render service, environment variables, Atlas network change, or public Render
URL has been created yet. No paid action was taken.

Current status: **BUILDING, CLASSIFICATION AND CORRECTED LOCAL CORE JOURNEY
PROVEN, GITHUB PUBLICATION COMPLETE, RENDER AUTHENTICATION AND DEPLOYMENT
PENDING OWNER INTERACTIVE LOGIN**.

### Paid Render deployment checkpoint — 2026-10-14

The owner subsequently authorized paid Render hosting using available credits,
with no domain purchase or other paid service activation. Source was created as
a Render Blueprint named `source-production`:

- Blueprint: `exs-db7rncrbc2fs7388n7i0`
- Web service: `srv-db7rok8473hc739m4cvg`
- Plan: `0.5c-512mb` (Render's current Starter-equivalent paid web plan)
- Estimated service cost shown by Render: approximately `$7/month`
- Public URL: https://source-9k1o.onrender.com
- GitHub repository: https://github.com/Techkeyy/source
- Deployed application commit: `de086455e2ab679c602ebcf2680a1b82cb061483`
- Deployment: `dep-db7rrkmk1f9s73cptra0`

Render evidence showed `Build successful`, Next.js `16.4.0`, `npm run start`,
`Your service is live`, and the successful health check state `Deploy
succeeded | Live`. The public homepage rendered from the deployed service.

The first production registration attempt exposed a configuration failure:
`MONGODB_URI is not configured on the server.` The Render environment screen
was then edited to include the variable names `MONGODB_URI`,
`DEEPSEEK_API_KEY`, and `NEXT_PUBLIC_APP_URL`, followed by a successful
redeploy. However, the production registration check still returned the same
MongoDB configuration error. A follow-up inspection established the exact
blocker: Render displays the expected secret variable names, but the secret
text areas were empty because the attempted browser clipboard transfer did not
populate their values. No secret was logged or committed.

Production acceptance status is therefore **BLOCKED BEFORE REGISTRATION**.
The app runtime is hosted and reachable on Render, but the owner must manually
paste the existing MongoDB connection string into the Render service's
`MONGODB_URI` value field and the existing DeepSeek key into
`DEEPSEEK_API_KEY`, then click **Save, rebuild, and deploy**. The owner should
not paste `.env.local` as a file or expose either value in chat. After that
owner action, rerun the production path and record the actual inference,
database, discovery, persistence, logout/login, and second-account isolation
evidence here.

Current status: **BUILDING, LOCAL CORE PROVEN, PUBLIC GITHUB PUBLISHED, PAID
RENDER SERVICE LIVE, PRODUCTION SECRETS NOT YET POPULATED, CORE UAT BLOCKED**.

## Directive 015 — Creative Director UI/UX reconstruction

Updated: 2026-10-14 (Africa/Lagos). Mode: **REDESIGN with LAUNCH safeguards**.

The owner rejected the earlier Evidence Desk 014A visual direction and supplied
the Findor reference at `https://laudable-fly-396.convex.site/`. A new isolated
branch was created from the pre-014A rollback point:

- Branch: `codex/uiux-015-findor-reconstruction`
- Base / rollback: `70f8042550cfbf28b15bc5adbf969a9baa48bd40` (`70f8042`)
- Verified implementation commit: `80e8f248e767d0c625f4c1c5c18e732f74ce8f83`
- Final handoff metadata commit: `38a19fa` (this branch remains local-only)
- Production/GitHub/Render state: unchanged by this directive
- Release status: local/preview review only; no merge, push or production
  deployment from this branch

### Product Truth Brief

**Observed product promise:** For freelancers and independent professionals
who need credible client leads, Source turns a public portfolio or project URL
into an editable, evidence-backed profile and helps investigate relevant,
source-linked opportunities without promising clients or payment.

**First-time job:** Understand Source, create an account, provide public work,
review what the page actually supports, choose desired customer types, inspect
live opportunity evidence, and prepare a credible proposal.

**Returning-user job:** Sign in and recover saved opportunities and proposal
drafts without repeating the first task when the existing backend can provide
those records.

**Primary value moment:** A real profile is visible with grounded excerpts,
then a live source-linked result explains why it matched.

**Protected surfaces:** Authentication/session routes, SSRF-safe website
fetching, DeepSeek profile generation, Mastra workflow boundary, MongoDB
schemas and ownership, discovery adapters/ranking, proposal route, Render
configuration and secrets. The UI branch did not alter these surfaces.

### Reference inspection evidence

The supplied reference was opened in real Chromium and audited at 320, 390,
768, 1280 and 1440px. Evidence is in `docs/uiux-015/reference-inspection.json`
and `reference-screenshots/`.

Verified observations:

- Warm canvas `rgb(250, 248, 245)` and primary ink `rgb(20, 32, 26)`.
- Plus Jakarta Sans body, Newsreader/Playfair/Fraunces-style display type.
- Reference h1 measured `67.2px / 70.56px`, weight 700, `-2.016px` tracking.
- Reference h2 measured `26.4px / 31.68px`, weight 700, `-0.528px` tracking.
- 14 headings, 20 buttons, 1 text input, 5 sections, and a real sign-up
  interaction that added `Create your account` in place.
- No horizontal overflow at any required width; reference reduced-motion probe
  reported `0s`.

The legacy Source “before” screenshot was not fabricated. A detached rollback
worktree was attempted for a real baseline capture, but Next/Turbopack rejected
the dependency link and the bounded offline dependency install did not finish.
The evidence folder records this P1 gap explicitly in
`reference-teardown.md` and `known-limitations.md`.

### Implemented vertical slice

Only `src/components/SourceApp.tsx` and `src/app/globals.css` were changed in
the product UI. The reconstruction adds:

- A direct landing promise and URL-first activation path.
- Original Source inline SVG logo, icon system and public-work/evidence/fit
  artwork; no Findor artwork, logo, copy or image was copied.
- Accessible registration/sign-in with visible error and busy states.
- Dominant URL onboarding with real label, manual alternative, invalid URL
  alert, preserved input and loading feedback.
- Profile review organized into identity, grounded page evidence, suggestions,
  editable profile fields and explicit evidence limits.
- Four customer categories retained as actual controls: small businesses,
  startups, agencies and individuals.
- Discovery UI with query-impact copy, live provider response, classification,
  rationale, original-source link, empty state and honest unconfirmed signals.
- Proposal, save, refresh recovery, saved-work rail and logout/login recovery.
- Responsive composition at required widths, visible focus, touch-sized
  controls and reduced-motion rules.

### Real browser acceptance evidence

The final corrected `scripts/uiux-015-after.mjs` run passed with a fresh test
account and real `https://www.frog.co/` analysis:

```json
{
  "status": "pass",
  "stages": [
    "landing", "account", "onboarding", "url-error", "analysis-loading",
    "live-analysis", "profile-edit", "customer-selection", "discovery",
    "proposal", "refresh-recovery", "logout-login-recovery"
  ],
  "profileAnalysisHttpStatus": 200,
  "discoveryHttpStatus": 200,
  "evidenceVisible": true,
  "editorVisible": true,
  "errorInputPreserved": true,
  "savedAndDrafted": true,
  "sourceUrl": "https://www.frog.co/"
}
```

The harness selected all four customer types, used live backend routes, and
reported cleanup pass with one temporary account deleted. Visual evidence is
in `docs/uiux-015/source-screenshots/`, including landing at 320/390/768/1280/
1440px, profile evidence, audience selection, results, proposal, saved return
and logout/login recovery.

### Skill usage

The user-supplied `director-uiux-excellence` archive was inspected directly
from `C:\Users\HomePC\Downloads\Telegram Desktop\Director_UIUX_Excellence_Skill_v1.0-2.zip`.
Read and applied: `SKILL.md`, `references/product-fit-and-architecture.md`,
`references/taste-and-visual-system.md`, `references/audit-and-release-gates.md`,
`references/test-missions.md`, `templates/product-truth-brief.md`,
`templates/review-scorecard.md`, and `templates/director-to-builder-task.md`.
The skill changed the work by requiring product truth before styling, a
protected-surface freeze, real Chromium evidence, explicit empty/loading/error/
recovery states, a 100-point scorecard and an honest release boundary.

The Sites skill was also used for the local-only site workflow: keep work in
the existing checkout, use a real local browser preview, and do not register,
publish or deploy without explicit release approval.

### Scorecard and release decision

The recorded local visual score is **91/100** with no P0 defect. Full detail is
in `docs/uiux-015/review-scorecard.md`. The result is not a production release
decision because these P1 limitations remain:

1. The protected backend exposes no profile-read route, so fresh-session UI
   recovery cannot truthfully repopulate the confirmed profile editor.
2. Proposal edits remain local until copied because no proposal-edit persistence
   route exists.
3. The old Source before screenshot could not be captured from the rollback
   worktree in this environment.
4. One live external excerpt contained replacement glyphs; a data-layer
   encoding correction requires separate approval.

Current Directive 015 status: **IMPLEMENTED LOCALLY, REAL BROWSER JOURNEY
PROVEN, PREVIEW-ONLY, DIRECTOR REVIEW REQUIRED**.

### Exact next tasks for a replacement director

1. Review the reference and Source screenshots under `docs/uiux-015/` and the
   scorecard/defect ledger.
2. Decide whether the 91/100 local slice is accepted with disclosed
   limitations or held for a separately authorized profile-read/proposal-edit
   backend phase.
3. Run the remaining quality gates and append their results:
   `npm run lint`, `npm test -- --run`, `npm run build`, and the existing
   backend probes where owner-approved.
4. If accepted, commit this isolated branch, record the final SHA and exact
   diff, then request a separate merge/production authorization. Do not touch
   production in this phase.

### Directive 015 quality gates completed

- `npm run typecheck`: PASS.
- `npm run lint`: PASS, ESLint exit code 0.
- `npm test -- --run`: PASS, 2 test files / 8 tests.
- `npm run build`: PASS, Next.js 16.4.0 compiled and generated 12 routes.
- `npm run probe:mongodb`: PASS, ping/insert/read/delete/cleanup true.
- `npm run probe:ownership`: PASS, separate registrations, owner save,
  cross-account denial and saved-list isolation; two temporary accounts
  deleted.
- `npm run probe:gemma -- https://www.frog.co/`: PASS using the existing
  DeepSeek provider/model, source HTTP 200, inference HTTP 200, one JSON object,
  five claims and five grounded claims, no key exposure.

The isolated UI branch has now passed its local engineering gates. This does
not override the preview-only release boundary or close the documented
profile-read/proposal-edit persistence limitations.

