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

## Directive 016 / Authorization 016A — persistence and seamless return flow

Updated: 2026-10-14 (Africa/Lagos). Owner authorization received for the two
narrow backend changes described in Authorization 016A. The approved Directive
015 visual system remains frozen. No provider, discovery-ranking,
authentication-architecture, secret, infrastructure, merge, or production
deployment change was made.

### Root causes identified

1. **Confirmed profile recovery:** `POST /api/profile/confirm` already wrote a
   profile scoped by the authenticated `userId`, but there was no authenticated
   read route. On a fresh session `SourceApp` called `/api/auth/me` and
   `/api/saved`, then initialized the profile to an empty local object. The
   sign-out path also intentionally cleared that local object. Consequently a
   returning user could recover saved opportunities but not the confirmed
   profile or its discovery context.
2. **Proposal draft persistence:** `POST /api/opportunities/:id/proposal`
   generated and stored the original proposal, but the UI textarea only changed
   React state. There was no explicit draft-save route or UI save action; the
   existing footer accurately said edits stayed local. Reloading therefore
   recovered the generated text, not the user's edits. Reopening a saved item
   could also regenerate and overwrite that stored draft.

### Implemented authorized fix

- Added authenticated `GET /api/profile`. It reads only `{ userId }` from the
  session and returns the user's confirmed profile or `profile: null` for a new
  account.
- Added authenticated `PUT /api/profile`. It reuses the existing bounded
  profile sanitizer, requires a source URL, business/project name and summary,
  writes by session `userId`, and updates the same `profiles` document. It does
  not accept a client-supplied owner id.
- Refactored the existing confirm route to use the same validation boundary.
- Added authenticated `PUT /api/opportunities/:id/proposal`. It accepts only a
  string proposal up to 12,000 characters and updates by `{ _id, userId }`.
  The response confirms `saved: true` only after MongoDB acknowledges the
  update. The exact submitted text is preserved, including user edits.
- Made proposal generation non-destructive by default: if a saved proposal
  already exists, `POST` returns it instead of silently replacing it. Explicit
  regeneration remains available only through a future explicit action with
  `regenerate: true`.
- On authenticated bootstrap, the UI now retrieves a confirmed profile and
  opens the audience step. Users can edit and save the profile without
  repeating website analysis, or intentionally use **Start over**.
- The proposal editor now exposes **Save draft**, with saving, saved, unsaved,
  and failed states. Failed saves retain the textarea content.

### Changed files

- `src/lib/profile-validation.ts` — shared server-side profile normalization
  and completeness checks.
- `src/app/api/profile/route.ts` — authenticated profile read/update contract.
- `src/app/api/profile/confirm/route.ts` — uses the shared validation boundary.
- `src/app/api/opportunities/[id]/proposal/route.ts` — idempotent generation and
  ownership-scoped exact draft updates.
- `src/components/SourceApp.tsx` — session profile recovery, edit/start-over
  controls, and persistent proposal editor states.
- `src/app/globals.css` — minimal layout treatment for the profile action row.
- `scripts/core-acceptance-check.mjs` — profile/draft recovery, malformed
  request and cross-account read/write assertions.
- `tests/profile-persistence.test.ts` — focused profile validation regression
  tests.

### API and ownership boundaries

All new operations require the existing HTTP-only session cookie. Profile reads
and writes use the authenticated session's MongoDB `userId`; proposal reads,
generation and writes use both the authenticated `userId` and opportunity
`_id`. A client cannot select another account by passing an id. The existing
SSRF guard, auth/session implementation, DeepSeek route, discovery adapters and
ranking logic were not changed.

### Verified evidence

Engineering and live integration evidence from 2026-10-14:

```text
npm run typecheck                         PASS
npm run lint -- --no-cache                PASS (0 errors, 0 warnings)
npm test -- --run --testTimeout=15000     PASS (3 files, 10 tests)
npm run build                             PASS (Next.js 16.4.0; /api/profile added)
npm run probe:mongodb                     PASS (ping/insert/read/delete/cleanup)
npm run probe:ownership                   PASS (isolation and cross-account denial)
npm run probe:gemma -- https://www.frog.co/ PASS (DeepSeek active path)
npm run probe:core                        PASS; cleanup PASS (2 accounts deleted)
```

The successful profile probe reported safe, redacted metadata only:

```json
{
  "provider": "deepseek",
  "model": "deepseek-flash",
  "sourceFetchHttpStatus": 200,
  "responseHttpStatus": 200,
  "sourceTitle": "frog | Your reinvention and experience partner",
  "claimCount": 5,
  "groundedClaimCount": 5,
  "candidateCount": 1,
  "finishReasons": ["stop"],
  "jsonObjectCount": 1
}
```

The updated core acceptance reached the real local frontend APIs and live
external sources, then reported: DeepSeek `deepseek-flash`; Frog profile with
8 grounded claims and 37 extracted excerpts; different startup and small-
business query strings; one source-linked relevant result; generated proposal;
exact edited proposal recovery after login; profile edit recovery after login;
unauthenticated profile denial; second-account profile/saved-list isolation;
cross-account proposal read and write denial; and malformed profile/proposal
requests rejected. Test accounts were deleted after the pass.

The earlier first run encountered transient Atlas SRV DNS timeouts during the
probe and cleanup. After network permission was granted, the probes and cleanup
passed. No credential or private profile content was printed.

### Browser evidence and release boundary

The existing Directive 015 Chromium evidence remains valid for the approved
visual system and its pre-016 journey. A new 016 browser screenshot run was
not completed in this environment: the in-app browser reported the localhost
tab could not be reached and the CUA connector rejected a localhost tab
attachment; Playwright was not installed in the project, and temporary no-save
installation attempts were stopped after npm cache/network permission errors.
No screenshot was fabricated or added as 016 evidence. The HTTP core probe is
not a substitute for desktop/mobile visual acceptance.

Therefore the branch status is:

**FUNCTIONAL BACKEND AND HTTP ACCEPTANCE PROVEN; LOCAL BROWSER UAT PENDING;
PREVIEW-ONLY; DO NOT MERGE OR DEPLOY.**

### Owner manual UAT required before release

On the running local app at `http://localhost:3000/`, use a fresh account and
record screenshots at 1440px and 390px:

1. Register, analyze `https://www.frog.co/`, edit the summary, and confirm.
2. Sign out and sign back in; verify the confirmed profile is shown at the
   audience step without re-analysis.
3. Choose at least two customer types, search, and inspect the source link,
   classification and evidence.
4. Save/draft an opportunity. Edit the proposal, confirm **Unsaved edit**,
   click **Save draft**, and confirm **Saved draft** only after the request
   completes.
5. Refresh, reopen the saved opportunity, and verify the exact edited text.
6. Sign out/in again and repeat the saved proposal check.
7. In a second account, verify no first-account profile or saved opportunity is
   visible. Do not use production credentials or real private data.
8. Check keyboard focus, 320/390px horizontal overflow, and failed-save/error
   recovery before authorizing a merge.

### Next director actions

1. Complete the owner-led desktop/mobile browser UAT above and attach original
   screenshots to the Director review.
2. If UAT passes, commit this isolated change set, review the diff and release
   plan, then request explicit merge/deployment authorization.
3. If UAT finds a defect, keep production unchanged and fix only the reported
   persistence/recovery issue on this branch.

## Directive 016B — resumed repair and verified local acceptance

Updated: 2026-10-15 (Africa/Lagos). Work resumed from persistence commit
`23b4962c9d018448857cf1591592f00a0449f7a5` without reset, rebuild, redesign,
merge, or deployment. The approved UI and protected provider, discovery,
authentication, database, and SSRF paths remained frozen.

### Interruption root cause and repair

The interrupted local server was not failing because of Source code or a stale
application lock. Next.js reported an access-denied error while creating its
`.next/dev/lock`; a harmless write probe confirmed that the execution sandbox
also denied writes to the Desktop checkout. The Windows ACL itself granted the
owner full access. A narrowly scoped workspace write permission restored the
ability to create Next generated cache/lock files. The repaired dependency
tree then resolved `next@16.4.0`, `@next/swc-win32-x64-msvc@16.4.0`, and
`rolldown/parseAst` successfully. No `package.json` or `package-lock.json`
change was made.

Vitest initially attempted to clean a cache outside the project at
`C:\Users\HomePC\node_modules\.vitest-cache`, which the sandbox rejected.
The required test suite passed when its cache was explicitly confined to the
project with `--fsModuleCachePath .vitest-cache`. This is an execution
environment detail, not an application test failure.

### Authorized JSON hardening

The exact remaining code change is committed as
`b512aed` (`fix: handle malformed profile JSON`). Both authenticated profile
write routes now convert invalid JSON bodies into the existing truthful HTTP
400 validation path instead of allowing `request.json()` to throw. The
acceptance script adds malformed JSON checks for both `POST /api/profile/confirm`
and `PUT /api/profile`. The correction is deliberately narrow: it does not
truncate model output, change providers, alter persistence schemas, or weaken
ownership checks.

### Post-repair technical gates

All gates below were rerun after dependency restoration and the JSON change:

```text
npm run typecheck                                      PASS
npm run lint                                           PASS (0 errors, 0 warnings)
npm test -- --run --testTimeout=15000                 ENV BLOCKED (Vitest tried to
                                                         clean an external cache)
npm test -- --run --testTimeout=15000 --fsModuleCachePath .vitest-cache
                                                         PASS (3 files, 10 tests)
npm run build                                          PASS (Next.js 16.4.0)
npm run probe:mongodb                                 PASS
npm run probe:ownership                               PASS; cleanup deleted 2 accounts
npm run probe:gemma -- https://www.frog.co/           PASS; DeepSeek active path
npm run probe:core                                    PASS; cleanup deleted 2 accounts
```

The first MongoDB rerun encountered a transient Atlas SRV DNS timeout. After
network permission was available, the same probe passed with ping, insert,
read, delete, and cleanup all true. The first ownership invocation was made
while the app was stopped for the production build and therefore returned
`fetch failed`; after the local server was restarted, the ownership probe
passed. These transient orchestration outcomes were not counted as product
passes.

The final live profile probe returned safe redacted metadata only:

```json
{
  "provider": "deepseek",
  "model": "deepseek-flash",
  "sourceFetchHttpStatus": 200,
  "responseHttpStatus": 200,
  "sourceTitle": "frog | Your reinvention and experience partner",
  "claimCount": 5,
  "groundedClaimCount": 5,
  "candidateCount": 1,
  "finishReasons": ["stop"],
  "jsonObjectCount": 1
}
```

The final core acceptance proved 7 grounded profile claims with 37 extracted
excerpts, changed startup versus small-business query strings, one relevant
source-linked opportunity, proposal generation, exact proposal edit recovery,
profile edit recovery, unauthenticated profile denial, second-account profile
and saved-list isolation, cross-account proposal read/write denial, malformed
shape rejection, and malformed JSON rejection. Test accounts were removed.

### Real Chromium browser acceptance

The full browser journey passed against the real local app at
`http://localhost:3000/` using the installed Chrome executable. A temporary
Playwright package cache was used only for this test and removed afterward;
the application dependency graph was unchanged.

Desktop 1440px passed:

`landing -> registration -> URL onboarding -> invalid URL error with input
preserved -> live frog.co analysis -> grounded evidence/profile review ->
profile edit -> customer selection -> live discovery -> proposal generation ->
refresh recovery -> logout/login recovery`.

The run reported profile-analysis HTTP 200, discovery HTTP 200, visible
evidence tray, visible editor, preserved invalid input, saved/drafted proposal,
and cleanup of one generated account.

The same journey passed at 390px. The run captured mobile profile review,
customer selection, results, proposal editor, saved return, and logout/login
recovery. The landing sweep captured 320px, 390px, 768px, 1280px, and 1440px.
Visual inspection of the 390px profile and proposal captures found no
horizontal overflow or clipped primary action. Original captures are stored
under `docs/uiux-016b/source-screenshots/` and
`docs/uiux-016b/mobile-screenshots/`; the evidence log is
`docs/uiux-016b/browser-acceptance.md`.

The in-app browser connector could not attach to localhost because of its
browser URL policy. The local Chromium run is the accepted alternative. A
diagnostic showed that `127.0.0.1` remained on the SSR `Opening Source...`
shell because the Next development origin policy blocked its client/HMR path;
the canonical `localhost` origin hydrated and passed. No production URL was
used and no production data was changed.

### Current release decision and replacement-director handoff

Code repair commit: `b512aed` (`fix: handle malformed profile JSON`). The
follow-up Director/evidence commit contains this acceptance record and the
original-resolution browser captures.

Rollback point: `23b4962c9d018448857cf1591592f00a0449f7a5` (the complete
profile/proposal persistence implementation before malformed-JSON hardening).

Current status: **LOCAL CORE AND DESKTOP/MOBILE BROWSER ACCEPTANCE PROVEN;
PRODUCTION UNCHANGED; MERGE/DEPLOYMENT NOT AUTHORIZED**.

Remaining owner action is release review: inspect the changed three files,
`docs/uiux-016b/browser-acceptance.md`, and the 390px captures; then authorize
or reject a separate merge/deployment step. No new defect or blocker was found
in the resumed functional workflow. Do not claim the product is deployed or
finished until the authorized release path and public UAT are completed.

## Directive 017 — controlled production promotion

Updated: 2026-10-15 (Africa/Lagos). The owner authorized a controlled
promotion of the approved release candidate. This section records the
predeployment gate and the current release boundary; it does not mark Source
accepted or finished.

### Release candidate and rollback target

- Release branch: `codex/uiux-015-findor-reconstruction`.
- Release-candidate code HEAD before the release-status documentation change:
  `21d3aa5`.
- `origin/main` was fetched and remained at `70f8042`; the candidate was seven
  commits ahead of that base at the time of the audit.
- The local working tree was clean before the README correction. The README
  correction is currently an uncommitted documentation change and must be
  committed before the normal merge.
- Existing production last-successful commit: `70f8042550cfbf28b15bc5adbf969a9baa48bd40`.
  This is the documented rollback target until a new deployment passes public
  acceptance.
- No force-push, merge, Render deploy, environment mutation, or production
  database mutation has occurred during this promotion step.

### Predeployment audit evidence

- Remote: `https://github.com/Techkeyy/source.git`.
- Render service: `source`, service ID `srv-db7rok8473hc739m4cvg`, connected to
  `Techkeyy/source` on `main`, URL `https://source-9k1o.onrender.com`.
- Render deploy history showed the live service on `70f8042` with a successful
  deploy and an available rollback action. The service uses the existing
  Blueprint and `0.5c-512mb` web-service plan. No new service or paid upgrade
  was created by this directive.
- Render Environment displayed the required server-side variable names:
  `MONGODB_URI`, `MONGODB_DB`, `SESSION_SECRET`, `INFERENCE_PROVIDER`,
  `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL`, `NEXT_PUBLIC_APP_URL`, and
  `NODE_VERSION`. Secret values were masked and were not copied, revealed, or
  logged. Nonempty production behavior still requires public UAT after the
  candidate is deployed.
- `render.yaml` matches the active application contract: `npm ci && npm run
  build`, `npm run start`, health path `/`, `INFERENCE_PROVIDER=deepseek`,
  `DEEPSEEK_MODEL=deepseek-flash`, and server-side MongoDB/session/DeepSeek
  variables. Atlas security is not weakened.
- Classification logic and regression coverage were inspected. A listing is
  only labelled freelance/contract when explicit independent-work or contract
  evidence exists; salaried listings remain full-time and untyped listings
  remain unknown. The Vytalize-shaped regression is covered in
  `tests/discovery.test.ts`.
- The current Render dashboard log view did not expose a retained build log for
  the old deployment (`Build not found`); this is a dashboard-retention
  limitation, not evidence of a new deploy failure. The deploy history itself
  reported the old deploy as successful.
- Shell HTTPS probes from this environment could not establish TLS to GitHub or
  the Render URL. This is an execution-network limitation; it is not counted
  as a production health pass. The authenticated Render dashboard did confirm
  the service URL and prior successful deployment. Public browser acceptance
  remains outstanding.

### README correction

`README.md` was corrected to state the current verified local acceptance,
active DeepSeek provider, GitHub/Render links, existing service rollback target,
and the fact that public production acceptance is pending. It explicitly makes
no Gemma prize-category claim and does not claim Source is finished. The change
must be included in the normal merge and checked again at the merged revision.

### Current acceptance status and next director actions

Status: **CONTROLLED PROMOTION PREPARED; LOCAL CORE AND DESKTOP/MOBILE
CHROMIUM ACCEPTANCE PROVEN; PUBLIC PRODUCTION ACCEPTANCE PENDING.**

Next actions for the replacement director:

1. Commit the README correction on the release branch and record its SHA.
2. Run typecheck, lint, confined-cache tests, production build, MongoDB probe,
   ownership probe, DeepSeek profile probe, and core acceptance against the
   exact merged revision.
3. Merge the release branch into local `main` with a normal non-force merge and
   push `main` to the authorized GitHub repository only after all gates pass.
4. Trigger the existing Render service to deploy exactly that merged SHA and
   record the Render deploy ID and logs/status.
5. Run the disposable-account public desktop and 390px Chromium journey,
   including grounded profile claims, category-dependent discovery,
   source-linked classification evidence, proposal edit persistence,
   profile/proposal logout-login recovery, malformed/input-recovery states, and
   cross-account isolation.
6. If public auth, persistence, ownership, or startup fails, stop the release,
   capture sanitized evidence, roll back to `70f8042` through Render, and verify
   the old service before reporting the blocker.
7. Do not call Source finished or submission-ready until public acceptance is
   verified and the owner confirms final acceptance.

### Controlled promotion result and rollback

Updated: 2026-10-15 (Africa/Lagos). The predeployment gates passed on the
merged release, and the normal merge and push completed without force-push:

- GitHub `main` now points to merge commit
  `6cbe759b16ae775a13d122abb3d9686b69d73877` (`merge: promote Source release
  candidate`) at `https://github.com/Techkeyy/source`.
- The exact merged revision deployed to the existing Render service as deploy
  `dep-db8f2t4s728c73832up0` and Render reported **Live / Deployed**. The
  service booted on the merged revision; no new service, paid upgrade, secret,
  or database was created.
- Server-side production environment names were present and masked in the
  Render dashboard. No secret values were revealed, copied, or logged.

The disposable-account public core probe reached the deployed application but
stopped at the first stateful operation:

```text
status=fail
reason=core-acceptance-check-failed
registration returned HTTP 500
completed: provider=deepseek, model=deepseek-flash, userRegistered=false,
profileAnalyzed=false, startupSearch=false, smallBusinessSearch=false,
savedId=false, proposalGenerated=false, proposalEdited=false
cleanup: pass; deletedTestAccounts=2
```

Render application logs provide the sanitized root cause: the container
started normally, but the registration path could not select a MongoDB Atlas
replica-set primary because the outbound TLS handshake failed with
`ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR`. The resulting driver state was
`ReplicaSetNoPrimary`, and the route returned HTTP 500. This is a production
Atlas connectivity/TLS failure, not evidence of a profile, authentication,
discovery, proposal, or ownership regression. No API keys, credentials, or
private user data were included in the diagnostic record.

Per Directive 017 Phase F, the service was rolled back to the documented
known-good production commit `70f8042550cfbf28b15bc5adbf969a9baa48bd40`.
Render rollback deploy `dep-db8f5rcs728c7396ucjg` reported **Deploy succeeded**;
its startup logs show Next.js ready on the service port. A real browser then
loaded `https://source-9k1o.onrender.com/` and displayed the Source landing
page. This verifies rollback availability only; it is not full public UAT.
The rollback action disabled Render auto-deploy to prevent an accidental
re-promotion, and that setting was left unchanged.

### Production acceptance boundary

Current status: **NOT FINISHED — PRODUCTION ROLLED BACK; PUBLIC UAT BLOCKED
AT REGISTRATION BY MONGODB ATLAS TLS/CONNECTIVITY.**

No public profile, discovery, proposal, persistence, recovery, or
cross-account acceptance is claimed. The complete real workflow remains
proven only against the local application: DeepSeek profile inference returned
HTTP 200 with 5/5 grounded claims; local core acceptance proved category-
dependent queries, source-linked opportunity evidence, proposal/profile
persistence, malformed-input handling, and account isolation. The merged
revision also passed local typecheck, lint, confined-cache tests, build,
MongoDB, ownership, and DeepSeek probes before deployment.

Required owner action before another production deploy: inspect and correct
MongoDB Atlas network access, Render outbound connectivity, TLS compatibility,
and cluster/replica-set health for the existing secure connection. Do not
weaken Atlas access controls or publish credentials. After the correction,
perform a controlled deploy of the verified GitHub revision (or a separately
audited correction), record the new Render deploy ID and commit, and rerun the
entire disposable-account desktop and 390px mobile journey:

`register -> live frog.co analysis -> grounded/editable profile -> confirm ->
each customer category -> category-dependent discovery -> source and
classification evidence -> proposal generate/edit/save -> refresh ->
logout/login -> profile and exact proposal recovery -> continue discovery ->
second-account isolation -> malformed/loading/empty/save-failure recovery`.

Owner manual-UAT gate after the infrastructure correction:

1. Open `https://source-9k1o.onrender.com/` in Chromium at desktop width and
   create a disposable account; do not use private owner data.
2. Analyze `https://www.frog.co/`, confirm that claims show their evidence and
   that edits remain distinguishable from verified facts.
3. Run discovery separately for small businesses, startups, agencies, and
   individuals; record changed query/policy behavior and inspect the source
   URL plus classification evidence for each result.
4. Generate a proposal, edit it with a unique marker, explicitly save it,
   refresh, log out, log back in, and verify the exact marker is recovered.
5. Repeat with a second disposable account and verify direct profile,
   opportunity, and proposal access cannot cross the account boundary.
6. Repeat the critical recovery and save checks at 390px, including visible
   errors and preservation of entered input. Capture original Chromium
   screenshots and retain the deploy ID, commit SHA, and sanitized response
   evidence.

Until that gate passes and the owner confirms acceptance, Source must not be
called finished, submission-ready, or publicly accepted. DeepSeek is the
proven inference provider; no Gemma category claim is made.

## Directive 018 — Atlas connectivity diagnosis before redeployment

Updated: 2026-10-15 (Africa/Lagos). The rollback was accepted and no release
candidate was redeployed. Render auto-deploy remains disabled. No application
code, authentication logic, discovery logic, profile/proposal persistence,
production secret, Atlas rule, or application record was changed during this
diagnostic.

### Render outbound and Atlas boundary

The existing Render service `source` (`srv-db7rok8473hc739m4cvg`) was inspected
through Connect -> Outbound. Render displayed these shared outbound CIDR
ranges:

- `74.220.48.0/24`
- `74.220.56.0/24`

Atlas access-list matching is **not verified**. The Atlas browser session was
redirected to the signed-out login page, and no Atlas credentials were entered
or exposed. Therefore no missing range is asserted and no access-list change
was made. The owner must sign in to Atlas and compare the two exact Render
ranges above against the project access list, approving only the missing
entries if required. Internet-wide access (`0.0.0.0/0`) must not be used.

### Read-only Render-shell evidence

At the existing rollback runtime, Render Web Shell instance `47c7n` executed a
bounded diagnostic using the server-side `MONGODB_URI` and `MONGODB_DB`. The
diagnostic emitted only redacted booleans, counts, protocol metadata and
sanitized error fields. It performed no inserts, updates, deletes, or
application-account operations.

Verified output:

```json
{
  "node": "v24.21.0",
  "driver": "7.7.0",
  "env": { "mongodbUriPresent": true, "mongodbDbPresent": true },
  "srv": { "status": "pass", "count": 3 },
  "tcp": { "status": "pass", "attempted": 3, "success": 3, "errors": [] },
  "tls": {
    "status": "pass",
    "attempted": 3,
    "success": 3,
    "authorized": 3,
    "protocols": ["TLSv1.3"],
    "errors": []
  },
  "auth": { "status": "pass", "authenticatedUserCount": 1 },
  "ping": { "status": "pass", "ok": true }
}
```

A second read-only command using the URI's normal TLS configuration ran the
MongoDB `hello` command with bounded timeouts and returned:

```json
{
  "status": "pass",
  "isWritablePrimary": true,
  "secondary": false,
  "setNamePresent": true,
  "hostsCount": 3,
  "primaryPresent": true
}
```

This proves that the current Render shell can resolve the SRV records, reach
all three replica-set endpoints, complete authorized TLS 1.3, authenticate,
select a writable primary, and execute a read-only ping. The MongoDB driver
was `7.7.0` under Node.js `v24.21.0`; TLS certificate verification was not
disabled and no insecure TLS flags were used.

The diagnostic wrapper itself had two corrected harness errors before the
successful `hello` run: an initial top-level-await shell syntax error, then an
unsupported client-option placement for `minVersion` and a nested `tls`
option. These failed during local command construction before contacting
MongoDB and are not connectivity results. The final successful check relied
on the URI's application-compatible TLS configuration and bounded
`serverSelectionTimeoutMS=8000`, `connectTimeoutMS=5000`, and
`waitQueueTimeoutMS=5000` settings.

### Root-cause interpretation and release gate

The retained Render application log from the failed release still records a
real application-process failure at 04:33:12: the MongoDB driver reported
`ReplicaSetNoPrimary` with a nested `MongoNetworkError` and sanitized
`ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR`. The container then started normally on
rollback commit `70f8042` at 04:36:36. The independent, current shell
diagnostic now passes every network/authentication stage and reports a
writable primary. Consequently, the prior failure is not currently
reproducible at the Render-to-Atlas boundary. The evidence is insufficient to
claim an Atlas outage, an access-list mismatch, or a Source code regression.
The remaining possibilities are a transient or deployment-instance-specific
TLS/connection event, a time-varying network/access condition, or an
application-process connection-lifecycle difference; an application-level
registration recheck is required to distinguish those, but it is intentionally
not run under this no-redeploy directive.

Current release decision: **network shell gate PASS; Atlas access-list
comparison NOT VERIFIED; application registration gate NOT RETESTED; release
candidate redeployment NOT AUTHORIZED**. Keep the rollback and auto-deploy
disabled. The next authorized action is for the owner to sign in to Atlas,
compare/apply the exact missing Render ranges if any, and then authorize a
controlled application-level registration probe before considering deployment.

## Directive 019 — production database recovery gate

Updated: 2026-10-15 (Africa/Lagos). The Render dashboard remains accessible
and confirms that rollback `70f8042` is live for service `source`, with
auto-deploy disabled. The release candidate `6cbe759` has not been redeployed.

The required owner-controlled Atlas step is still pending. Opening
`https://cloud.mongodb.com/` redirects to the MongoDB signed-out login page;
no credentials were entered and no Atlas project or access-list entry was
changed. The Render outbound ranges awaiting comparison remain
`74.220.48.0/24` and `74.220.56.0/24`.

Because the Atlas access-list comparison has not yet been confirmed, the
one-time disposable-account registration test against rollback was not run.
This preserves the directive's order of operations and avoids treating a
successful direct shell ping as proof that the application registration path
is ready. After the owner verifies or corrects the two scoped Atlas ranges,
the next step is exactly one redacted rollback registration attempt, followed
by cleanup of any account created successfully. No frontend, provider,
schema, security protection, or deployment setting was changed.

## Directive 019A — controlled production testing and release candidate promotion

Updated: 2026-10-15 (Africa/Lagos). Owner verification confirmed that both
Render outbound CIDR ranges are present and Active in MongoDB Atlas Project 0:

- `74.220.48.0/24`
- `74.220.56.0/24`

No Atlas network change was required. Render auto-deploy remained disabled.

### Rollback registration gate

One disposable registration was sent through the real public application on
rollback `70f8042`, using a unique `example.test` account and a bounded HTTP
request. Safe result:

```json
{
  "status": "pass",
  "target": "rollback-70f8042",
  "registration": {
    "httpStatus": 201,
    "cookieSet": true,
    "userIdPresent": true,
    "errorPresent": false
  },
  "cleanup": {
    "status": "pass",
    "matchedAccounts": 1,
    "deletedAccounts": 1,
    "deletedProfiles": 0,
    "deletedOpportunities": 0
  }
}
```

The first local wrapper attempt before this result failed during promise-chain
construction and produced no HTTP status. Render's log window showed no new
application log for that failed wrapper, so it was not counted as a
production registration result and no account from it was retained.

### Controlled deployment

Because rollback registration passed, the verified release candidate was
manually deployed through the existing Render service dashboard with
auto-deploy still disabled:

- Commit: `6cbe759b16ae775a13d122abb3d9686b69d73877`
- Render deploy ID: `dep-db8lcfnavr4c7386v3lg`
- Trigger: manual dashboard deployment
- Build: successful
- Runtime: Next.js ready; service reported Live
- Public URL: `https://source-9k1o.onrender.com`

Render's deployment log showed checkout of the exact commit, successful
TypeScript/build stages, `npm run start`, Next.js readiness, and the service
becoming Live. No environment, secret, provider, schema, or Atlas security
configuration was changed.

### Release registration and full production core journey

Registration was tested first on the new live release. Safe result:

```json
{
  "status": "pass",
  "target": "release-6cbe759",
  "registration": {
    "httpStatus": 201,
    "cookieSet": true,
    "userIdPresent": true,
    "errorPresent": false
  },
  "cleanup": {
    "status": "pass",
    "matchedAccounts": 1,
    "deletedAccounts": 1,
    "deletedProfiles": 0,
    "deletedOpportunities": 0
  }
}
```

The existing `npm run probe:core` was then run against the public Render URL.
It completed the real backend journey with two disposable accounts and passed:

- DeepSeek profile generation using `deepseek-flash`.
- `https://www.frog.co/` analysis with 9 grounded claims from 37 extracted
  excerpts.
- Profile confirmation, edit, retrieval, logout, login, and profile recovery.
- Startup and small-business discovery with distinct selected customer types
  and different Hacker News queries.
- The production automated run covered the startup and small-business
  branches; agency and individual production-category checks remain part of
  the owner’s final four-category UAT.
- One source-linked relevant opportunity with six profile matches and the
  `freelance-or-contract` classification.
- Proposal generation, exact edited draft save, refresh/recovery, and
  logout/login recovery.
- Unauthenticated profile denial, malformed JSON/input rejection, and
  cross-account saved-list/profile/proposal isolation.
- Cleanup of both disposable accounts.

Sanitized probe summary:

```text
status=pass
provider=deepseek
model=deepseek-flash
groundedClaimCount=9
extractedExcerptCount=37
startupOpportunityCount=1
smallBusinessOpportunityCount=1
queryChanged=true
proposalEditedAndSaved=true
exactTextRecovered=true
profileEditedAndRecovered=true
crossAccountProposalDenied=true
malformedRequestsRejected=true
cleanup=pass; deletedTestAccounts=2
```

### Browser evidence and remaining acceptance boundary

The public deployed landing page rendered in Chromium after hydration. The
desktop smoke check at a 1280px viewport showed the expected Source headline,
URL-first value proposition, account creation form, sign-in toggle, evidence
workflow, customer-fit explanation, and honest no-guarantee boundary. The
document and body scroll widths were both 1265px against a 1280px viewport;
no horizontal overflow was detected. The deployed sign-in view also rendered
with email/password controls and a clear create-account return action.

The current in-app browser connector did not expose a viewport override in
this run, so a fresh 390px/320px production browser capture was not claimed.
The same release candidate has existing Chromium 390px and 320px evidence in
`docs/uiux-016b/mobile-screenshots/`; owner UAT must still repeat the public
journey at mobile widths before final acceptance. This is an evidence-boundary
note, not a reported mobile defect.

Current status: **PRODUCTION DEPLOYMENT AND API-LEVEL CORE JOURNEY PASS;
DESKTOP PUBLIC SMOKE PASS; AGENCY/INDIVIDUAL AND MOBILE PUBLIC UAT PLUS OWNER
FINAL ACCEPTANCE PENDING.** The product is not yet marked finished or publicly
accepted.

## Directive 020 — final production UAT and release acceptance

Updated: 2026-10-16 (Africa/Lagos). No application code, infrastructure,
secrets, database schema, AI provider, deployment setting, or production
revision was changed during this UAT. The public service remains on commit
`6cbe759b16ae775a13d122abb3d9686b69d73877`, with Render auto-deploy disabled.

### Public mobile Chromium evidence

The deployed URL was exercised in the real Codex Chromium browser with an
explicit viewport override, and the browser completed the URL-first workflow
at 390px. Authentic landing screenshots were also captured by the installed
Google Chrome binary at the exact requested viewport sizes:

- [390px landing screenshot](docs/production-uat-020/landing-390.png)
- [320px landing screenshot](docs/production-uat-020/landing-320.png)

Observed responsive results:

- **390px: PARTIAL / visual defect.** The public landing page loaded and the
  registration controls were usable. The measured document/body width was
  391px against a 390px viewport; the widest element was `.hero-art`, whose
  right edge reached 391px. The saved screenshot shows the hero/header content
  clipped at the right edge. This is a real one-pixel horizontal-overflow
  defect, not a substituted HTTP result.
- **320px: FAIL for visual acceptance.** The page loaded and the measured page
  scroll width stayed within the viewport, but the hero heading's rendered
  content width exceeded its client width and the original-resolution capture
  visibly clips the right side of the headline and the header action. The
  proposal surface remained usable at 320px in the interactive browser, but
  the landing breakpoint is not acceptable as a clean final release.

The local `kane-cli` browser skill was inspected as required for this browser
task, but its installed service was not authenticated (`Not authenticated
[prod]`). No owner credential was entered. The acceptance evidence therefore
uses the available real Chromium browser and its Playwright-backed tab with
viewport controls; no Playwright/Selenium simulation or local application was
used.

### Real public user journey

A disposable production account was created through the public UI and then
removed after the test. The browser journey completed these steps:

1. Registration succeeded and the private Source workspace loaded.
2. `https://www.frog.co/` was analyzed through the live DeepSeek route.
3. The profile review showed the grounded business description, source URL,
   five visibly grounded website claims, and the explicit boundary that
   pricing, ownership, past clients, and years of experience were not verified.
4. The profile was edited (user-added skills and search keywords) and
   confirmed.
5. Startup discovery returned a live Remote OK result with a source URL and
   match explanation. Hacker News, Jobicy, and Remote OK were queried; SerpApi
   was honestly shown as skipped.
6. The BlueTuskr result was inspected, a proposal was generated, its text was
   edited, and the edited draft was explicitly saved. The UI reported
   `Proposal draft saved to your account.` only after the save response.
7. Refresh recovered the confirmed profile, saved opportunity, and exact
   edited proposal text. Logout followed by login recovered the same profile
   and exact edited proposal without repeating website analysis.

The redacted cleanup result for this browser account was:

```json
{
  "status": "pass",
  "matchedAccounts": 1,
  "deleted": { "profiles": 1, "opportunities": 1, "users": 1 },
  "remaining": 0
}
```

The production browser captured no console warnings or errors. The browser's
`document.cookie` surface exposed no cookie names; the existing auth contract
sets the session cookie as `httpOnly`, `sameSite: "lax"`, and
`secure: process.env.NODE_ENV === "production"` in `src/lib/auth.ts`. The
previous public release probe also verified malformed requests, unauthenticated
profile denial, cross-account proposal denial, exact profile/proposal
recovery, and cleanup. The rerun of `npm run probe:ownership` against the
public URL passed:

```json
{
  "status": "pass",
  "checks": {
    "separateRegistrations": true,
    "ownerCanSave": true,
    "crossAccountDenied": true,
    "savedListIsolated": true
  },
  "cleanup": { "status": "pass", "deletedTestAccounts": 2 }
}
```

### Four customer-category comparison

The same confirmed frog profile was used in the public browser for each
category, one selection at a time. Every branch displayed the same live
provider status line: `Hacker News: queried · Jobicy: queried · Remote OK:
queried · SerpApi: skipped`.

The actual provider-request contract in the deployed revision is recorded
below. Hacker News receives the category-specific terms; Jobicy uses the first
confirmed keyword as its tag; Remote OK uses its fixed `tag=dev` endpoint; and
SerpApi is not called because its key is not configured.

| Selected type | Hacker News query terms sent | Jobicy request | Remote OK request | UI result and classification |
| --- | --- | --- | --- | --- |
| Small businesses | `SEEKING FREELANCER reinvention partner transformative experiences eco-digital era small business small team` | `tag=reinvention partner` | `https://remoteok.com/api?tag=dev` | 1 result: BlueTuskr; `freelance-or-contract`; client type unknown; no explicit small-business evidence; score 23 |
| Startups | `SEEKING FREELANCER reinvention partner transformative experiences eco-digital era startup founder` | `tag=reinvention partner` | `https://remoteok.com/api?tag=dev` | 1 result: BlueTuskr; `freelance-or-contract`; client type unknown; no explicit startup evidence; score 23 |
| Agencies | `SEEKING FREELANCER reinvention partner transformative experiences eco-digital era agency studio` | `tag=reinvention partner` | `https://remoteok.com/api?tag=dev` | 1 result: BlueTuskr; `freelance-or-contract`; client type agencies; source evidence includes `agency`; score 25 |
| Individuals | `SEEKING FREELANCER reinvention partner transformative experiences eco-digital era personal project creator` | `tag=reinvention partner` | `https://remoteok.com/api?tag=dev` | 1 result: BlueTuskr; `freelance-or-contract`; client type unknown; no explicit individual evidence; score 23 |

The category selection materially changed the live HN request and the
qualification/ranking evidence. It did **not** manufacture a customer type:
the UI truthfully left the result as unknown when the source did not support
that category. No generic full-time or unknown-employment listing was counted
as a qualified opportunity by Source.

### BlueTuskr accuracy and trust check

The original source was opened directly at:
`https://remoteok.com/remote-jobs/remote-graphic-designer-video-editor-bluetuskr-1137507`.
The detail page states that the role is fully remote, part-time contractor,
starts at 15 hours/week, requires availability between 9 a.m. and 6 p.m. EST,
and describes a U.S.-based team. It also shows compensation of $20–25 USD/hour
based on experience and portfolio. The board summary says “Probably
worldwide,” which must not override the detailed availability and team
requirements.

Source currently labels the card `freelance-or-contract` and `Customer type
unknown`, but its 360-character description excerpt does not surface the
hours, EST availability, or U.S.-based team requirement. Therefore Source
does **not** currently prove eligibility for a particular user and must not
imply worldwide eligibility. This is a release-blocking accuracy/trust issue
for final acceptance: the user is directed to inspect the original source, but
the result should also visibly state that location/availability eligibility is
unverified when those restrictions are outside the user's profile.

The same live card exposed an upstream text-decoding defect: the browser
rendered an em dash from the public description as `â`. This remains an
outstanding encoding defect and was not altered under the release-freeze
directive.

### Acceptance status and owner handoff

Current status: **CORE WORKFLOW PASS; PUBLIC MOBILE VISUAL ACCEPTANCE FAIL;
BLUE TUSKR ELIGIBILITY ACCURACY BLOCKED; OWNER ACCEPTANCE PENDING.** The
production service remains live and no redeployment is recommended until the
Director reviews these two product-trust defects.

Owner manual UAT requires no terminal commands:

1. Open `https://source-9k1o.onrender.com` on a phone or desktop browser.
2. Create an account with the owner's own email, or use Sign in if the account
   already exists.
3. Paste a public portfolio/project URL such as `https://www.frog.co/` and
   choose **Analyze website**.
4. Review page evidence and edit the profile; do not treat suggestions or
   personal edits as externally verified. Confirm the profile.
5. Select one customer type, choose **Projects and contracts**, and start the
   live search.
6. Open the original source link on a result and verify its employment,
   location, schedule, and application restrictions before acting.
7. Use **Save and draft**, edit the proposal, choose **Save draft**, refresh,
   sign out, sign back in, and reopen the saved opportunity to confirm the
   exact edit is still present.
8. Report any mismatch in evidence, eligibility, mobile layout, or recovery to
   the Director. Owner approval has not been claimed.

### Replacement-director next steps

1. Keep Render auto-deploy disabled and retain commit `6cbe759` as the rollback
   point.
2. Obtain Director approval for a narrow, separately reviewed fix for the
   replacement-character decoding and the visible eligibility/restriction
   boundary. Do not change providers, schemas, auth, or discovery architecture
   as part of that fix.
3. Re-run the public 390px and 320px Chromium journey after the approved fix,
   including the four-category comparison, BlueTuskr source inspection,
   ownership probe, and disposable-data cleanup.
4. Only after those checks pass should the owner perform manual UAT and decide
   whether a controlled deployment is warranted.

## Directive 021 — Production Defect Correction Release Candidate

Date: 2026-10-16 (Africa/Lagos)

### Phase and release boundary

Active phase: **RELEASE-FIX CANDIDATE — DIRECTOR REVIEW REQUIRED**.

Work is isolated on `codex/release-021-defect-correction`. The existing
production deployment remains unchanged at
`6cbe759b16ae775a13d122abb3d9686b69d73877`; no Render deployment, merge,
secret change, Atlas change, or auto-deploy change was made. That deployed
commit remains the rollback point. The branch was created from the actual
deployed ancestry after a narrowly authorized Git metadata ACL correction;
`.git/index.lock` was absent and no lock was deleted.

The tested branch revision is
`054f966350d80d8e245bbda3baeafbc67de553a6`.

The complete evidence package is in [`docs/release-021/`](docs/release-021/),
including exact 390px Chrome screenshots, viewport measurements, retained
historical shell artifacts, text-boundary proof, eligibility evidence, test
results, limitations, and the diff manifest.

### Proven defects and corrections

1. **Mobile landing clipping.** The root cause was a missing device-width
   viewport declaration in `src/app/layout.tsx`, compounded by intentional
   108%/116% hero-art expansion and headline growth at narrow widths. The fix
   adds Next.js `Viewport` metadata (`width: device-width`, `initialScale: 1`),
   constrains the hero art to its content box, reduces narrow headline growth,
   and tightens only the mobile navigation spacing. No blanket overflow rule
   was added. The exact Chrome target reported `innerWidth: 390`, document
   `clientWidth: 390`, document `scrollWidth: 390`, visual viewport `390`,
   and device pixel ratio `1`. Hero width was `351`, headline width was `351`,
   public header width was `390`, and the primary header CTA ended at x=`374`;
   all remained inside the 390px horizontal viewport. Full measurements and
   exact screenshots are in `docs/release-021/viewport-390.md`.

2. **Eligibility/availability visibility.** Source already required explicit
   contract or freelance evidence for `freelance-or-contract`; this fix does
   not alter that classification logic. Opportunity cards now show a truthful
   reminder: “Eligibility is not verified by Source. Check the original
   listing for location, schedule, and availability requirements before
   acting.” The BlueTuskr card kept its original-source link and did not claim
   worldwide or user-specific eligibility. No eligibility engine or new
   profile field was introduced.

3. **External text corruption.** Remote OK returned HTTP 200 and valid JSON,
   but the parsed BlueTuskr description already contained the code points
   `U+00E2 U+0080 U+0094` (`â`) for an em dash. This is an external feed
   encoding defect, not JSON parsing, website extraction, or React rendering.
   `src/lib/text.ts` now repairs only recognizable UTF-8-as-Latin-1 clusters
   at the discovery ingestion boundary and leaves ordinary accents/curly
   punctuation unchanged. The live card displayed `—` after normalization.

### Real local browser journey

Using installed Chrome with an exact 390x844 mobile target and a disposable
account, the tested path passed: registration → live `https://www.frog.co/`
analysis → grounded profile review → profile confirmation → selection of
startups, small businesses, agencies, and individuals → live discovery →
BlueTuskr source-linked match inspection → eligibility boundary → proposal
generation → exact proposal edit/save → saved-work navigation. The browser
reported no alert errors, and the result source was
`https://remoteok.com/remote-jobs/remote-graphic-designer-video-editor-bluetuskr-1137507`.
The earlier 319px connector run also covered logout/login recovery and exact
edited-proposal recovery. The exact screenshots and endpoint evidence are in
`docs/release-021/viewport-390.md`. All disposable records were cleaned up.

Kane CLI was attempted as required by the browser skill but its Bash service
returned `E_ACCESSDENIED` before launch; direct Kane authentication was also
expired and no owner credential was entered. The installed Chrome CDP target
provided the exact 390px evidence instead. The connector limitation and the
historical shell-artifact boundary remain recorded in
`docs/release-021/limitations.md`.

### Technical evidence

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS — 4 files, 13 tests.
- `npm run build`: PASS — Next.js 16.4.0 production build.
- `npm run probe:mongodb`: PASS — ping, insert, read, delete, cleanup.
- `npm run probe:ownership`: PASS — separate registrations, saved-list
  isolation, cross-account denial; 2 test accounts deleted.
- `npm run probe:gemma -- https://www.frog.co/`: PASS with the configured
  provider `deepseek`, model `deepseek-flash`, response HTTP 200, one JSON
  object, and 3/3 grounded claims. No Gemma category claim is made.
- `npm run probe:discovery`: PASS — Hacker News, Jobicy, and Remote OK
  queried; SerpApi skipped without a key; Vytalize regression remained
  `full-time-employment`.
- `npm run probe:core`: PASS — grounded profile, category-dependent query
  change, proposal persistence, profile recovery, exact proposal recovery,
  malformed-request rejection, and cross-account ownership checks.

### Claim → mechanism → boundary → proof ledger

| Claim | Mechanism | Boundary | Proof |
| --- | --- | --- | --- |
| Narrow landing content fits | Device-width viewport metadata plus scoped mobile sizing | Only the tested responsive surfaces are claimed | Exact 390px Chrome geometry and screenshots in `viewport-390.md` |
| Contract labels remain honest | Existing explicit-context classifier | Unknown employment type remains unknown; no eligibility engine | Discovery probe and Vytalize regression |
| External punctuation is readable | Targeted mojibake-cluster normalization | Legitimate Unicode and invalid repair candidates are preserved | `tests/text.test.ts` plus live BlueTuskr card |
| Eligibility is not overstated | Visible reminder plus original-source link | Source does not determine user-specific location/schedule eligibility | BlueTuskr browser card and `docs/release-021/eligibility.md` |
| Returning work persists | Existing authenticated profile/saved/proposal contracts | Account ownership remains server-enforced | Core probe and browser logout/login recovery |

### Changed files and protected paths

Changed files are `src/app/layout.tsx`, `src/app/globals.css`,
`src/components/SourceApp.tsx`, `src/lib/discovery.ts`, new
`src/lib/text.ts`, new `tests/text.test.ts`, this handoff, and
`docs/release-021/*`. Protected API routes, `auth.ts`, `db.ts`, `ssrf.ts`,
`gemma.ts`, profile workflow, Render configuration, secrets, and database
settings were not changed.

### Current acceptance status and replacement-director next steps

Current status: **LOCAL CORE JOURNEY PASS; EXACT 390PX LIVE CHROME PASS;
PRODUCTION UNCHANGED; DIRECTOR APPROVAL PENDING**.

1. Review the exact 390px evidence package and the isolated branch commit.
2. Approve or reject the candidate for controlled deployment. Do not merge or
   deploy automatically.
3. If approved, deploy only this reviewed revision with auto-deploy still
   disabled, then run production registration first and the full production
   journey before any release acceptance claim.
4. If any production gate fails, roll back to
   `6cbe759b16ae775a13d122abb3d9686b69d73877` and record sanitized evidence.
5. Owner manual UAT is still required; owner approval has not been claimed.

## Directive 022 — Final controlled deployment preflight

Date: 2026-10-16 (Africa/Lagos)

The Director authorized the controlled merge and production deployment in
Directive 022. The approved branch is
`codex/release-021-defect-correction`; the verified code commit is
`054f966350d80d8e245bbda3baeafbc67de553a6`; the evidence HEAD before this
preflight is `e17a0d4bb6e1461a42c3e8d4e08d925a18417684`; and the rollback
point remains `6cbe759b16ae775a13d122abb3d9686b69d73877`.

### Predeployment checks completed

- The working tree was clean before the deployment preflight.
- The branch contained the approved defect corrections and exact 390px
  evidence package.
- No protected authentication, MongoDB, DeepSeek, Render configuration, or
  secret files were changed by Directive 021A.
- Typecheck, lint, unit tests, production build, MongoDB probe, and ownership
  probe passed.
- No `.env` or credential-looking files are tracked.
- Render auto-deploy was not changed, and no production request was sent.

### Release blocker before merge

The merge and deployment could not begin because the current host has no valid
GitHub credential for `Techkeyy`:

- `gh auth status` reports the stored GitHub token is invalid.
- `git ls-remote` reaches GitHub but fails with sanitized
  `SEC_E_NO_CREDENTIALS`.
- The authenticated Render dashboard/CLI is not available through the current
  browser connector; the connector fails before exposing an authenticated
  page, and no Render API credential is configured locally.

Consequently, no remote `main` state could be fetched or safely compared, no
merge SHA can be reported, and no Render deployment ID or deployed SHA exists
for this directive. Production remains on the known-good rollback revision.

### Required owner action

The owner must re-authenticate the approved GitHub account in the GitHub CLI
or use the authenticated GitHub web session to merge the reviewed branch, and
must provide an authenticated Render dashboard session for the existing
`source` service. After authentication is available, the replacement director
must fetch `origin/main`, perform a normal non-force merge, record the new merge
SHA, manually deploy that exact SHA with auto-deploy disabled, record the
Render deployment ID, and run the production acceptance gates before claiming
technical acceptance.

Current Directive 022 status: **PREDEPLOYMENT BLOCKED BY MISSING GITHUB AND
RENDER AUTHENTICATION; PRODUCTION UNCHANGED; ROLLBACK READY**.

## Directive 022A — authentication recheck

Date: 2026-10-16 (Africa/Lagos)

The authorized retry was performed after the owner was asked to restore
GitHub access. The result is unchanged:

- `gh auth status` still reports the active `Techkeyy` token as invalid and
  directs re-authentication.
- `git ls-remote origin refs/heads/main` reaches the configured GitHub remote
  but fails with sanitized `SEC_E_NO_CREDENTIALS`.
- The actual remote `main` could not be fetched or compared.
- No merge, push, force push, Render deployment, or production UAT was
  performed.

The local approved branch and evidence remain intact. The next owner action is
to re-authenticate GitHub with `gh auth login -h github.com` or use the signed-in
GitHub web session to perform the reviewed merge. If Render authentication is
still unavailable after the GitHub merge, the owner should use Render's
dashboard **Deploy a specific commit** action for the exact merged SHA. No
Render API credential is requested.

Current Directive 022A status: **BLOCKED BEFORE REMOTE MAIN FETCH; INVALID
GITHUB AUTHENTICATION; PRODUCTION UNCHANGED; ROLLBACK READY**.

## Directive 022B — builder authentication recheck

Date: 2026-10-16 (Africa/Lagos)

The replacement builder rechecked the authorized release preflight before
attempting any merge or deployment. The blocker remains unresolved:

- `gh auth status` reports that the active `Techkeyy` token is invalid and
  directs re-authentication.
- `gh auth setup-git` could not update the global Git configuration because
  `C:/Users/HomePC/.gitconfig` was locked by the host permission boundary.
- `git ls-remote origin refs/heads/main` did not obtain the remote `main`
  revision; this session could not connect to GitHub over HTTPS.
- No fetch, merge, push, force push, Render deployment, secret change, or
  production UAT was performed.

The local approved branch and evidence remain intact. The owner must complete
GitHub CLI device authorization for the `Techkeyy` account in an authenticated
browser session, then rerun the controlled release. If the CLI still cannot
write its credential helper, the owner may use the authenticated GitHub web
session to perform the reviewed normal merge and then deploy the exact merge
SHA through Render's authenticated **Deploy a specific commit** action. Keep
Render auto-deploy disabled and retain `6cbe759b16ae775a13d122abb3d9686b69d73877`
as the rollback target.

Current Directive 022B status: **BLOCKED BEFORE REMOTE MAIN FETCH; OWNER
GITHUB DEVICE AUTHORIZATION REQUIRED; PRODUCTION UNCHANGED; ROLLBACK READY**.

## Directive 022C — final controlled release completed

Date: 2026-10-16 (Africa/Lagos)

The owner restored GitHub authentication and authorized completion of the
controlled release. The approved correction branch was inspected, the
legitimate Directive 022B handoff change was safeguarded, and the release was
merged normally into `main` without resetting history or force-pushing.

### GitHub release record

- Live `origin/main` before merge: `52b5c8cef524ffe79b9cedeb489ba3b705a5d0b7`.
- Approved code commit preserved as an ancestor:
  `054f966350d80d8e245bbda3baeafbc67de553a6`.
- Exact 390px evidence and subsequent release handoff commits were preserved.
- Final normal merge commit:
  `64807d1ce7da0c036949d430a0627c9878770323`.
- GitHub `origin/main` was verified after push to point to the exact merge SHA.
- Commit link:
  `https://github.com/Techkeyy/source/commit/64807d1ce7da0c036949d430a0627c9878770323`.
- The merged working tree passed `git diff --check` and contained no tracked
  `.env`, credential, token, private-key, or secret-looking file. The only
  tracked environment file is `.env.example`; `.env.local` remains ignored.

### Verification on the exact merge commit

- `npm run typecheck`: PASS.
- `npm run lint`: PASS with `--max-warnings 0`.
- `npm test`: PASS — 4 files, 13 tests.
- `npm run build`: PASS — Next.js 16.4.0 production build and route
  generation completed successfully.

### Render deployment record

- Existing Render service: `source` (`srv-db7rok8473hc739m4cvg`).
- Auto-deploy remained disabled throughout the release.
- The dashboard's **Deploy a specific commit** flow matched and deployed the
  exact merge SHA `64807d1ce7da0c036949d430a0627c9878770323` from `main`.
- Render deployment ID: `dep-db8tm949v7es73drf4tg`.
- Render build completed successfully, Next.js started on port 10000, the
  health check returned successfully, and the dashboard reported **Deploy
  succeeded**.
- The prior production revision
  `6cbe759b16ae775a13d122abb3d9686b69d73877` remains the rollback target.
- Deployment URL: `https://source-9k1o.onrender.com`.

### Production acceptance evidence

The live public service was tested after deployment using disposable records
that were removed afterward.

- Production core probe: PASS. Registration, live `deepseek` /
  `deepseek-flash` analysis of `https://www.frog.co/`, 8 grounded claims from
  37 extracted excerpts, profile confirmation and edit persistence, live
  Hacker News/Jobicy/Remote OK discovery, source-linked
  `freelance-or-contract` opportunity, proposal generation, exact proposal
  edit/save/recovery, logout/login recovery, malformed-request rejection,
  unauthenticated denial, cross-account proposal denial, and cleanup all
  passed. Two disposable accounts were deleted.
- Dedicated ownership probe: PASS. Separate registrations, owner save,
  cross-account denial, saved-list isolation, and cleanup all passed. Two
  disposable accounts were deleted.
- Browser UAT: PASS. A disposable account completed registration, website
  analysis, grounded profile review, profile confirmation, startup discovery,
  source inspection, proposal generation, proposal edit/save, refresh
  recovery, logout/login recovery, and exact edited-proposal recovery.
- The live result rendered the corrected em dash (`—`) rather than the prior
  replacement-character corruption and displayed the eligibility boundary:
  “Eligibility is not verified by Source. Check the original listing for
  location, schedule, and availability requirements before acting.”
- The BlueTuskr result retained its original source link, remained classified
  as `freelance-or-contract`, and did not claim user-specific eligibility or
  worldwide availability.
- Four-category production comparison: PASS. Separate searches for small
  businesses, startups, agencies, and individuals preserved the selected
  category and produced distinct Hacker News query terms. All four returned a
  qualified source-linked contract result; only the agencies branch surfaced
  an evidence-backed `agency` category match, while the other branches
  truthfully left customer type unknown when the source did not support it.
- Final browser cleanup deleted the exact disposable UAT user. The dedicated
  four-category probe also deleted its disposable test account.

### Exact post-deploy mobile verification

The installed Chrome binary was controlled through an isolated DevTools
session against the public deployment. Both requested CSS viewports passed:

| Viewport | Inner/client/document/body width | Visual viewport | Overflow | Key geometry |
| --- | ---: | ---: | --- | --- |
| 390px | 390 / 390 / 390 / 390 | 390 | None | hero 351px wide; headline 351px wide; header 390px wide |
| 320px | 320 / 320 / 320 / 320 | 320 | None | hero 288px wide; headline 288px wide; header 320px wide |

Device pixel ratio was `1` in both runs. The public page stayed within the
horizontal viewport at both widths.

### Remaining release notes and owner sign-off

No critical production gate failed and no rollback was required. The known
product boundary remains that Source does not determine user-specific
location, schedule, or availability eligibility; users must inspect the
original listing before acting. SerpApi remains honestly skipped when no key
is configured. Render's build log reported 10 npm audit findings (5 moderate,
5 high) from the existing dependency tree; this did not block the verified
build or deployment and was not changed under the release-freeze scope.

Owner final acceptance should be performed manually at
`https://source-9k1o.onrender.com` using the owner's own account: analyze a
public URL, review and confirm the grounded profile, exercise the four
customer categories, open the original opportunity source to verify its
restrictions, edit and save a proposal, refresh, sign out, sign back in, and
confirm the saved work remains isolated to that account. Do not use the
disposable test records as owner data. If a critical regression appears,
deploy the preserved rollback commit
`6cbe759b16ae775a13d122abb3d9686b69d73877` through Render's exact-commit
deployment control while keeping auto-deploy disabled.

Current Directive 022C status: **CONTROLLED MERGE PASS; GITHUB PUSH PASS;
RENDER DEPLOYMENT PASS; PRODUCTION CORE AND OWNERSHIP ACCEPTANCE PASS; EXACT
390PX AND 320PX MOBILE PASS; OWNER MANUAL SIGN-OFF PENDING**.

## Directive 023 — final documentation and security triage

Date: 2026-10-16 (Africa/Lagos)

Directive 023 was completed within the release boundary. The deployed
application, Render service, production secrets, hosting plan, infrastructure,
package manifest, and lockfile were not changed.

### Documentation correction

`README.md` now records the actual public release state instead of the prior
pre-deployment/Atlas-blocked state:

- Public deployment: `https://source-9k1o.onrender.com`.
- GitHub repository: `https://github.com/Techkeyy/source`.
- Verified deployed merge: `64807d1ce7da0c036949d430a0627c9878770323`.
- Active inference integration: DeepSeek `deepseek-flash`.
- Confirmed profile, proposal, refresh, logout/login recovery, and account
  isolation results.
- Four-category behavior for small businesses, startups, agencies, and
  individuals, including the evidence-backed agency result and truthful
  unknown category results where the source did not support a match.
- Production desktop acceptance and exact 390px/320px mobile acceptance.
- The known eligibility boundary: Source does not determine a user’s
  location, schedule, employment, geographic, or availability eligibility;
  the original listing must be checked.
- Current unit result: 4 files and 13 tests; typecheck, ESLint, and build
  passed on the verified merge.
- Honest technology and sponsor language. No unsupported prize, ranking,
  sponsor, partner, performance, or submission-complete claim is made.

The detailed audit record is [docs/audit-triage-2026-10-16.md](docs/audit-triage-2026-10-16.md).

### Dependency audit evidence

Commands executed:

- `npm audit --omit=dev`
- `npm audit --omit=dev --json`
- `npm audit --json`
- `npm ls @mastra/core gray-matter js-yaml argparse sprintf-js eslint-config-next @next/eslint-plugin-next fast-glob micromatch braces --all`

The production-only audit reported **5 moderate, 0 high, 0 critical**
findings. The full audit reported **5 high, 5 moderate, 0 critical** findings.
The ten npm package-node findings reduce to two advisory chains:

1. **High, development-only:** `braces@3.0.3` through
   `micromatch@4.0.8` → `fast-glob@3.3.1` →
   `@next/eslint-plugin-next@16.4.1` → `eslint-config-next@16.4.1`,
   advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
   The chain is absent from `npm audit --omit=dev` and is not used by the
   production application. npm’s suggested forced remediation would install
   `eslint-config-next@14.2.35`, a breaking/downgrade path, so it was not
   accepted.
2. **Moderate, production-transitive:** `sprintf-js@1.0.3` through
   `argparse@1.0.10` → `js-yaml@3.15.2` → `gray-matter@4.0.3` →
   `@mastra/core@1.77.0`, advisory
   [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c).
   `@mastra/core` is a real production dependency used by
   `src/lib/profile-workflow.ts` and `src/app/api/profile/analyze/route.ts`.
   Source does not import the vulnerable transitive packages or use Mastra’s
   workspace-skill/front-matter APIs, but the installed Mastra runtime bundle
   includes that parser. The risk is therefore limited but non-zero rather
   than development-only.

No `npm audit fix --force` was run. No safe non-breaking remediation was
identified. npm’s automated production fix requires `@mastra/core@1.0.4` and
reports a major change; removing or replacing the workflow boundary would be
a separate application correction. The moderate chain is documented as a
follow-up security item and must receive a separately approved correction
before changing the dependency tree.

### Production-risk verdict and release status

No credible high-severity production exposure was found. The high advisory is
development-only, and production-only audit reports zero high or critical
findings. The moderate Mastra chain is residual production risk, but the
accepted production path does not invoke its vulnerable front-matter
functionality. The existing verified release remains deployed unchanged.

Current Directive 023 status: **README CORRECTED; AUDIT TRIAGED; NO FORCE FIX;
NO PRODUCTION CODE OR INFRASTRUCTURE CHANGE; MODERATE TRANSITIVE FOLLOW-UP
OPEN; OWNER SIGN-OFF PENDING**.

## Directive 024 — three-hour customer-discovery pivot

Date: 2026-10-16 (Africa/Lagos)

### Release boundary

The customer-discovery pivot is isolated on branch
`codex/directive-024-customer-discovery`. The existing public deployment at
`https://source-9k1o.onrender.com` remains unchanged at deployed commit
`64807d1ce7da0c036949d430a0627c9878770323`; Render auto-deploy remains
disabled. No production secrets, hosting plan, infrastructure, or existing
data were changed. The preserved rollback target remains
`6cbe759b16ae775a13d122abb3d9686b69d73877`.

### Implemented product boundary

Source now presents the narrow pivot promise: **Find customers who need what
you do.** The existing public-page, DeepSeek, evidence-grounding, MongoDB,
ownership, persistence, SSRF, and proposal foundations were preserved.

- **Active requests** remain explicit public requests or source-advertised
  freelance/contract needs from Hacker News, Jobicy, and Remote OK. SerpApi is
  still optional and is skipped without an owner-configured key.
- **Potential customers** are separate, cautious signals inferred from public
  Hacker News discussion and GitHub project issues. Buying intent is never
  presented as confirmed. Jobicy, Remote OK, and SerpApi are explicitly
  skipped in this mode.
- GitHub uses its public issues API with local signal-label filtering for
  `help wanted`, `enhancement`, and `feature request`; the optional
  `GITHUB_TOKEN` is server-only when configured.
- Reddit has a clean disabled adapter boundary. Source does not scrape Reddit
  or bypass Reddit access restrictions.
- Each opportunity keeps the organization when the source provides one, the
  original URL, publication date, source type, observed need/evidence, profile
  fit, explicit-versus-inferred intent, and eligibility limitation.
- Active requests offer an editable application proposal. Potential signals
  offer a cautious, non-assumptive outreach draft. Source never sends messages
  or performs bulk outreach.
- My Pipeline now persists status (`saved`, `contacted`, `closed`) and a
  user-owned next-step note through `PATCH /api/opportunities/[id]`.
- The existing owned proposal route now generates a cautious outreach draft
  for potential signals and retains the application-proposal behavior for
  active requests.

### Local acceptance evidence

A disposable local account was created against the local preview only. It was
not a production account. The controlled browser journey completed:

- Registration succeeded.
- `https://www.frog.co/` was analyzed through the active DeepSeek integration;
  the review UI displayed grounded excerpts and kept editable suggestions
  visibly separate.
- The profile was confirmed and persisted.
- All four customer-category controls were selected successfully: small
  businesses, startups, agencies, and individuals.
- Active-request search returned a source-linked Remote OK result for
  `Graphic Designer & Video Editor` from BlueTuskr, with source date, source
  link, evidence excerpt, profile fit, contract classification, and the
  eligibility warning visible.
- The result was saved to My Pipeline. An editable application proposal was
  generated, changed to `Edited proposal test.`, saved, and shown as persisted.
- Potential-customer mode was corrected and rechecked. The provider boundary
  reported `Hacker News: queried`, `Jobicy: skipped`, `Remote OK: skipped`,
  `GitHub: queried`, `Reddit: skipped`, and `SerpApi: skipped`. The current
  frog profile returned no qualifying potential signal, and the UI displayed
  the honest empty state rather than relabeling an active job as a potential
  customer.

During source investigation, a direct public GitHub issue search produced the
public example
`https://github.com/elasticpath/plasmic/issues/662` (created 2026-10-05), an
open product-design/build issue with public acceptance criteria. It is usable
only as an inferred project signal; it does not prove that the organization is
buying services. Hacker News broad “seeking freelancer” results were also
reviewed and are intentionally excluded when they advertise the freelancer’s
availability rather than a customer request.

### Checks on the pivot branch

- `npm run typecheck`: PASS.
- `npm run lint`: PASS with `--max-warnings 0`.
- `npm test -- --run`: PASS — 4 files, 16 tests.
- `npm run build`: PASS — Next.js 16.4.0 production build; 13 static pages
  generated and the new owned opportunity route included.
- `npm run probe:discovery`: PASS. The live probe queried Hacker News, Jobicy,
  Remote OK, and GitHub; SerpApi was skipped without a key. The Remote OK
  Vytalize regression remained classified as full-time employment rather than
  freelance/contract. The probe reports source signals, not verified buyers.
- `npm audit --omit=dev --json`: 0 high, 5 moderate, 0 critical.
- `npm audit --json`: 5 high, 5 moderate, 0 critical. The high chain is
  development-only ESLint tooling; the moderate Mastra parser chain is the
  same limited residual production risk documented in
  `docs/audit-triage-2026-10-16.md`.
- No `npm audit fix --force` was run. No dependency or framework upgrade was
  made.

### Outstanding blockers and owner action

The pivot is not a production release yet. Before promotion, the owner must
review the branch, run the new journey against the public service, and approve
a controlled exact-commit Render deployment with auto-deploy still disabled.
The public production release remains the rollback baseline while that review
is pending. A separate security correction is required before changing the
Mastra dependency chain; the current audit did not justify changing the
approved application.

Current Directive 024 status: **PIVOT IMPLEMENTED ON ISOLATED BRANCH; LOCAL
ACCEPTANCE AND STATIC CHECKS PASS; PRODUCTION UNCHANGED; RENDER DEPLOYMENT NOT
REQUESTED; OWNER REVIEW AND CONTROLLED PROMOTION PENDING**.

## Directive 025 — make potential-customer discovery work

Date: 2026-10-16 (Africa/Lagos)

### Release boundary

This correction remains on `codex/directive-024-customer-discovery`, based on
the accepted pivot commit `3af7c4e527da298f1ad4ee6b574c27c558384224`. No Render
deployment, GitHub `main` update, production secret change, infrastructure
change, model/provider change, or Reddit integration was performed. Production
remains at `https://source-9k1o.onrender.com` on the existing deployed release;
the exact final local commit is recorded by Git after this section is committed.

### Phase A — diagnosed empty potential-customer pipeline

The empty result was not caused by the database, profile persistence, or the
pipeline. It was caused by source-adapter and qualification gates:

- Hacker News searched one highly restrictive, comment-only, AND-style query.
  Realistic customer-discovery material is primarily in fresh Ask HN / Show HN
  stories, so the adapter was searching the wrong object type and vocabulary.
- GitHub limited collection to `help wanted`, `enhancement`, and `feature
  request` labels. Real public project needs were also unlabeled or used
  `must-have` / `ready-for-human` labels. The old exact-overlap gate then
  discarded otherwise compatible project descriptions.
- The old result path had no provider-stage accounting, so a zero list did not
  distinguish source retrieval, extraction, local adapter filtering, stale
  records, unsupported intent, missing organization, or weak profile fit.

The correction adds provider diagnostics with raw, extracted, adapter-rejected,
qualified, and reasoned-rejection counts. Potential signals now require a
fresh organization/project identity, a public-need signal, a compatible
profile match, and an explicit unconfirmed-intent boundary. Generic HN launch
posts and generic GitHub promotional/course/portfolio issues are not accepted
merely because they contain words such as “website” or “design”.

### Phase B/C/D — live public-source evidence

The bounded probe in `scripts/discovery-check.mjs` used two transparent manual
profiles, without claiming website-grounded qualifications:

1. Freelance developer / small website-development agency — web development,
   website development, JavaScript, and React.
2. Branding, design, and marketing provider — branding, product design,
   marketing, brand design, and design.

Final live probe counts on 2026-10-16:

| Profile / source | Raw | Extracted | Adapter rejected | Qualified | Local rejection reasons |
| --- | ---: | ---: | ---: | ---: | --- |
| Developer / Hacker News stories | 185 | 159 | 26 | 0 | 157 stale; 2 unsupported intent |
| Developer / GitHub open issues | 30 | 2 | 28 | 1 | 1 unsupported intent |
| Brand / design / marketing / Hacker News stories | 174 | 163 | 11 | 0 | 160 stale; 1 weak profile; 2 unsupported intent |
| Brand / design / marketing / GitHub open issues | 30 | 13 | 17 | 13 | none after adapter filtering |

The probe found four representative accepted records in its capped evidence
set, with provider-level qualification counts of one developer GitHub result
and thirteen brand/design/marketing GitHub results. The credible examples
selected for review are:

- [Device Website Development](https://github.com/edwardschmitz/sigcore-uc/issues/6)
  — `edwardschmitz/sigcore-uc`, observed 2026-10-10; the public issue has an
  objective and concrete browser-interface requirements compatible with web and
  website development.
- [[DESIGN] Branding: logo, favicon, marketing landing page](https://github.com/Transf-ORM/Transf-ORM-CLI/issues/149)
  — `Transf-ORM/Transf-ORM-CLI`, observed 2026-09-08; the public issue is a
  branding/design work signal compatible with branding services.
- [Brand + design pipeline for client-facing content](https://github.com/federicomrod/Milton/issues/59)
  — `federicomrod/Milton`, observed 2026-10-05; the public issue describes a
  client-facing brand-kit/template workflow compatible with branding and
  design services.

All accepted records display the original URL, source date, organization or
project identity, observed need excerpt, compatible profile terms, and the next
step to inspect a legitimate contact route. None invents an email or claims a
confirmed buyer. Buying intent is explicitly `unconfirmed`.

The Hacker News stage was deliberately allowed to return zero qualified
prospects after the stricter source-specific request gate. Its 185/174 raw
records were not silently relabeled as customers. GitHub supplied the usable
signals in this run; the source mix is reported honestly rather than padded to
meet a target.

Negative overclaiming guard: [elasticpath/plasmic#662](https://github.com/elasticpath/plasmic/issues/662)
was found and remains classified as `potential-buyer-signal-unconfirmed`, with
`buyingIntentConfirmed: false`. It is not classified as an active buyer or a
confirmed commercial request. Reddit remains disabled by policy.

### Phase E — local customer journey

A synthetic local account was used only against the local preview and then
deleted. The controlled browser journey passed:

- Manual developer profile entered transparently as user-edited, with
  `https://example.com/` retained as a supporting URL rather than claimed as
  portfolio evidence.
- All four customer categories selected: small businesses, startups,
  agencies, and individuals.
- Potential-customer mode returned the GitHub `Device Website Development`
  signal. The card displayed **Potential customer**, source/date/project
  identity, public evidence, profile fit, and the warning that intent is
  inferred rather than confirmed.
- The record was saved to My Pipeline; cautious outreach was generated,
  edited to `Edited cautious outreach for acceptance.`, saved, and visibly
  recovered in the pipeline.
- Logout/login recovery restored the confirmed profile, the saved potential
  record, and its saved draft.
- Existing ownership probe passed: separate registrations, owner save,
  cross-account denial, and isolated saved lists. Two probe accounts were
  deleted by the probe. The Directive 025 synthetic account cleanup removed
  one opportunity, one profile, and one user document.
- The Remote OK Vytalize regression remained excluded from freelance/contract
  reclassification.

### Checks

- `npm run typecheck`: PASS.
- `npm run lint`: PASS with `--max-warnings 0`.
- `npm test -- --run`: PASS — 4 files, 16 tests.
- `npm run build`: PASS — Next.js 16.4.0 compiled, TypeScript completed, 13
  static pages generated, and the dynamic API routes were included.
- `npm run probe:discovery`: PASS — live HN/GitHub diagnostics, two manual
  profiles, plasmic overclaiming guard, and Remote OK regression.
- `npm run probe:ownership`: PASS — owner save, cross-account denial, and
  saved-list isolation; cleanup PASS.
- `git diff --check`: PASS.
- No production browser account, production data, Render deployment, or
  production infrastructure was touched.

### Directive 025 status

**POTENTIAL-CUSTOMER DISCOVERY CORRECTED AND LOCALLY ACCEPTED; GITHUB PUBLIC
PROJECT SIGNALS NOW RECOVER; HACKER NEWS EMPTY RESULT IS HONEST AFTER STRICT
INTENT FILTERING; ACCOUNT/PERSISTENCE/OUTREACH JOURNEY PASS; PRODUCTION
UNCHANGED; OWNER REVIEW AND CONTROLLED PROMOTION REQUIRED.**

## Directive 026 — buyer-quality distinction and procurement feasibility

Date: 2026-10-16 (Africa/Lagos)

### Release boundary

This correction remains on `codex/directive-024-customer-discovery`, based on
the accepted implementation `0240698ec4e245a495e927b275f5443e5aa696d1`.
The tested implementation commit is `43ce98d60dbe3d4a22f79873f597771bf7bcf475`.
No GitHub merge, push, Render deployment, production secret change,
infrastructure change, model/provider switch, or Reddit activation was made.
Production remains at [source-9k1o.onrender.com](https://source-9k1o.onrender.com)
on deployed commit `64807d1ce7da0c036949d430a0627c9878770323`; the rollback
target remains `6cbe759b16ae775a13d122abb3d9686b69d73877`.

### Implemented buyer-quality boundary

The discovery model now carries a three-way `prospectType` and an explicit
buyer-intent level:

- **Active Request** (`active-request`, confirmed): the source explicitly seeks
  a supplier, contractor, vendor, tender response, or other external service.
- **Potential Customer** (`potential-customer`, possible): an identifiable
  organization/project has an observed business or service need and a
  defensible service fit, but commercial intent is unknown.
- **Research Signal** (`research-signal`, unsupported): work needs doing, but
  the source does not support the conclusion that an external provider is
  being considered.

The card, pipeline, evidence list, next-step guidance, and saved-record
compatibility path now expose the tier and uncertainty. No commercial
confidence percentage or buyer score is presented. Numeric ranking remains an
internal service-fit ordering only. Research signals cannot create a new
proposal/outreach draft, and potential/active records require a public
`contactUrl` before a new draft is generated. Existing saved drafts continue
to load and remain editable for compatibility.

The GitHub adapter no longer silently drops internal or blocked work. It
records blocker/dependency/owner metadata as research evidence, while
external-service language can qualify an issue as an active request. Issue
creation, an unassigned issue, a `help wanted` label, or technical fit alone
does not imply outsourcing.

### Named GitHub examples

The live public bodies were re-read from the GitHub API and classified as
follows:

| Example | Evidence | Final classification | Intent |
| --- | --- | --- | --- |
| [SigCore — Device Website Development](https://github.com/edwardschmitz/sigcore-uc/issues/6) | Concrete website/device-interface objective and requirements; no supplier, contractor, proposal, or external-provider language | Potential Customer | Possible; external buying unverified |
| [Transf-ORM — Branding: logo, favicon, marketing landing page](https://github.com/Transf-ORM/Transf-ORM-CLI/issues/149) | Internal product visual-identity backlog, blocked by another issue, acceptance criteria | Research Signal | Unsupported |
| [Milton — Brand + design pipeline for client-facing content](https://github.com/federicomrod/Milton/issues/59) | Internal status/owner/horizon, named Miles/Sofia/Federico owners, Canva workflow and client dependency metadata | Research Signal | Unsupported |

None of these three is presented as a confirmed buyer. No unsolicited GitHub
issue comment or invented contact detail is produced.

### Live discovery evidence

The updated two-profile live probe passed and returned the following bounded
counts on 2026-10-16:

| Profile / provider | Raw | Extracted | Adapter rejected | Accepted | Active | Potential | Research | Local rejection reasons |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Developer / Hacker News | 185 | 159 | 26 | 0 | 0 | 0 | 0 | 157 stale; 2 unsupported |
| Developer / GitHub | 30 | 6 | 24 | 5 | 0 | 2 | 3 | 1 stale |
| Brand/design / Hacker News | 165 | 152 | 13 | 0 | 0 | 0 | 0 | 149 stale; 3 unsupported |
| Brand/design / GitHub | 30 | 15 | 15 | 15 | 0 | 8 | 7 | none after adapter filtering |

The source mix therefore produced **20 accepted GitHub candidates** across
the two profiles: **10 Potential Customer**, **10 Research Signal**, and **0
confirmed Active Request** in that GitHub/HN sample. Hacker News returned no
fresh qualified record in this run. The acceptance is honest: the real
confirmed external requests came from the procurement source below, not from
relabeling GitHub project issues.

### Stronger source feasibility — official UK Contracts Finder

The official public OCDS endpoint
`https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search`
was queried for 2026-09-01 through 2026-10-16 with `stages=tender&limit=100`.
It returned HTTP 200 without credentials. The result contained 100 tender
releases, 59 broad digital/design/marketing-related matches, and 59 records
with buyer identity, deadline, and official notice links. The response also
exposed notice status, publication date, scope, procurement method, SME
suitability, and CPV classification. The [Contracts Finder feasibility
note](docs/contracts-finder-feasibility-2026-10-16.md) records the exact
probe and limitations.

One actionable public request reviewed was [CA18543 — Northampton College
Media planning & Buying Services](https://www.contractsfinder.service.gov.uk/Notice/d2301388-4ca6-48fc-805d-eb2e5793377e): active/open procurement, deadline
2026-11-04 12:00 UTC, buyer Northampton College, advertising/marketing CPV
classification, SME suitability, and a supplier-portal route in the public
notice. It is an Active Request, not a promise of eligibility, award, or
payment. The adapter preserves the existing HN, GitHub, Jobicy, Remote OK,
optional SerpApi, and disabled Reddit boundaries.

### UI, persistence, and security evidence

- Discovery cards show Active Request, Potential Customer, or Research Signal;
  each card includes source, date, organization/project, observed need,
  service fit, buyer-intent level, evidence, limitations, and next step.
- Research cards offer save/research guidance only. No outreach draft is
  offered without a legitimate public contact/application route.
- Existing profile, saved opportunity, proposal edit, refresh, logout/login,
  account-isolation, and cleanup paths remain compatible.
- `npm run probe:core`: PASS — real `https://www.frog.co/` DeepSeek profile,
  9 grounded claims, live discovery including Contracts Finder, save/edit/
  recovery, ownership, malformed-request guards, and cleanup.
- `npm run probe:ownership`: PASS — separate registrations, owner save,
  cross-account denial, isolated saved list, and cleanup.
- Updated browser journey: PASS — public page analysis, profile confirmation,
  discovery, save, proposal-route behavior, refresh recovery, logout/login
  recovery, and exact 390px/320px checks with no horizontal overflow. Updated
  screenshots are retained under `docs/uiux-015/source-screenshots/`.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS with `--max-warnings 0`.
- `npm test -- --run`: PASS — 4 files, 18 tests.
- `npm run build`: PASS — Next.js 16.4.0 production build, 13 static pages,
  all dynamic API routes included.
- `npm run probe:discovery`: PASS — two realistic profiles, HN/GitHub live
  evidence, tier counts, overclaiming guard, and Remote OK full-time
  regression.
- `npm run probe:contracts`: PASS — official public endpoint, 100 releases,
  59 complete current matches.
- `npm audit --omit=dev --json`: PASS for high/critical exposure — 0 high,
  0 critical, 5 moderate. The previously documented high findings remain in
  the development-only audit chain; no `npm audit fix --force` or speculative
  framework/core upgrade was run.

### Directive 026 status

**BUYER-QUALITY DISTINCTION IMPLEMENTED AND LOCALLY ACCEPTED; OFFICIAL
PROCUREMENT SOURCE FEASIBLE AND INTEGRATED CONSERVATIVELY; PRODUCTION
UNCHANGED; NO MERGE/PUSH/DEPLOYMENT; DIRECTOR APPROVAL REQUIRED.**

## Directive 027 — controlled customer-discovery release verification

Date: 2026-10-16 (Africa/Lagos)

The final buyer-quality correction was tested on branch
`codex/directive-024-customer-discovery` at code commit
`8fe019da74cae1682d1d95b896fa47e9cca09ae2` (`fix: keep inferred GitHub work
out of active requests`). The normal no-fast-forward merge into `main`
produced `53a24e72543f6ed300996a62d711b93b7f48ce4c` and was pushed to
`https://github.com/Techkeyy/source`. Render manually deployed that exact
merge SHA as deployment `dep-db918lmq1p3s739n88dg`; the dashboard verified
`Deploy succeeded | Live`. Auto-deploy remains disabled, no production
secrets, infrastructure, plan, MongoDB configuration, or AI provider was
changed. The previous production commit `64807d1ce7da0c036949d430a0627c9878770323`
remains the rollback target alongside the preserved emergency rollback commit
`6cbe759b16ae775a13d122abb3d9686b69d73877`.

### Browser acceptance — normal Source flow

The rebuilt production server was exercised through the real browser UI using
a disposable account and the public media-services page
`https://www.mindshareworld.com/services`. The profile was analyzed, reviewed,
edited honestly to media planning/media buying/marketing communications, and
confirmed through the normal workflow. The browser then ran both Active
Requests and Potential Customers + Research searches.

- **Active Request surfaced:** `CA18543 - Northampton College - Media planning
  & Buying Services` from Contracts Finder.
- **Buyer:** Northampton College.
- **Status/deadline:** `active`; `2026-11-04T12:00:00.000Z`.
- **Official notice and application route:**
  `https://www.contractsfinder.service.gov.uk/Notice/d2301388-4ca6-48fc-805d-eb2e5793377e`.
- **Qualification boundary:** the card showed SME suitability and open
  procedure, while explicitly directing the user to inspect the official
  notice for detailed selection criteria; no eligibility, award, budget, or
  payment was inferred.
- **Potential/research results:** browser response tier counts were
  `active-request: 1`, `potential-customer: 7`, and `research-signal: 9` in
  the potential-customer view. GitHub issues with contract/job wording were
  kept out of Active Request unless explicit external-buying language was
  present. The regression test now protects this boundary.
- **Research protection:** research cards showed “Research guidance only” and
  exposed no draft action. Potential cards showed possible, not confirmed,
  buying intent.
- **Service compatibility guard:** after the same account was edited to a
  branding-only profile, the specialized Northampton media-buying notice was
  not returned. Mentioning “marketing” alone did not qualify the profile.
- **Cleanup:** the disposable test account and its records were deleted after
  the run.

### Production acceptance after controlled promotion

The public deployment at [source-9k1o.onrender.com](https://source-9k1o.onrender.com)
was then exercised with disposable accounts. The production browser harness
passed profile analysis, profile confirmation, both buyer-discovery views,
Northampton notice inspection, the branding-versus-media mismatch guard,
research-only draft blocking, and cleanup. The existing production UI
regression also passed registration, DeepSeek profile analysis, all four
customer categories, save, proposal generation and edit, refresh recovery,
logout/login recovery, and exact 390px and 320px no-horizontal-overflow checks.

- `node scripts/directive-027-browser-check.mjs`: PASS against the public URL;
  Northampton active request visible, official link verified, potential and
  research tiers visible, research draft action absent, branding-only mismatch
  rejected, cleanup PASS.
- `node scripts/uiux-015-after.mjs`: PASS against the public URL;
  analysis HTTP 200, discovery HTTP 200, grounded evidence and editor visible,
  saved/drafted recovery PASS, logout/login recovery PASS, and mobile layout
  `{320: {scrollWidth: 320, horizontalOverflow: false}, 390: {scrollWidth:
  390, horizontalOverflow: false}}`.
- Production `npm run probe:core`: PASS — DeepSeek `deepseek-flash`, profile
  and proposal persistence, recovery, malformed-request guards, cross-account
  denial, isolated saved lists, and cleanup.
- Production `npm run probe:ownership`: PASS — separate registrations,
  owner save, cross-account denial, saved-list isolation, and cleanup.

No real customer data, personal credentials, unsolicited messages, or public
GitHub comments were sent. The only created records were disposable test
records and each production run reported cleanup PASS.

### Final verification for controlled promotion

- `npm run typecheck`: PASS.
- `npm run lint`: PASS with `--max-warnings 0`.
- `npm test -- --run`: PASS — 4 files, 19 tests.
- `npm run build`: PASS — Next.js 16.4.0, TypeScript, 13 static pages, and
  all dynamic API routes.
- `npm run probe:discovery`: PASS — live Developer and Brand/design profiles;
  GitHub accepted candidates were separated into potential/research tiers and
  no confirmed GitHub/HN buyer was manufactured.
- `npm run probe:contracts`: PASS — official public OCDS endpoint returned
  HTTP 200 without credentials; 100 releases and 59 complete service-related
  evidence records were observed.
- `npm run probe:core`: PASS — DeepSeek `deepseek-flash`, grounded profile,
  live discovery including Contracts Finder, profile/save/draft persistence,
  logout/login recovery, malformed-request guards, account isolation, and
  cleanup.
- `npm run probe:ownership`: PASS — separate registrations, owner save,
  cross-account denial, isolated saved list, and cleanup.
- `node scripts/directive-027-browser-check.mjs`: PASS — active procurement
  card, original notice link, future deadline, potential/research separation,
  research draft block, branding mismatch rejection, and cleanup.
- `npm audit --omit=dev --json`: 0 high, 0 critical, 5 moderate. The five
  moderate findings remain the documented production-transitive Mastra parser
  chain (`@mastra/core` → `gray-matter` → `js-yaml` → `argparse` →
  `sprintf-js`). No `npm audit fix --force` or speculative dependency change
  was made. This is residual risk requiring a separately approved correction;
  it is not claimed as remediated.

### Directive 027 status

**CONTROLLED MERGE, GITHUB PUSH, RENDER DEPLOYMENT, AND PRODUCTION
CUSTOMER-DISCOVERY UAT PASS; NORTHAMPTON PROCUREMENT NOTICE SURFACED; GITHUB
BUYER-QUALITY BOUNDARY CORRECTED; OWNER SIGN-OFF AND HACKATHON SUBMISSION
AUTHORIZATION REMAIN REQUIRED.**

## Directive 030 — final Reach relevance release gates

Updated 2026-10-17 (Africa/Lagos). The bounded legacy-profile compatibility
correction was tested locally on `codex/directive-029-reach-regression`.

- Gate 1: **PASS**. Legacy Reach-style and service-provider profiles without
  offering/objective fields remained readable but received
  `DISCOVERY_INTENT_REQUIRED` before discovery. Confirmed product objectives
  were enforced server-side even when the client requested active jobs.
- Gate 2: **PASS for the required live examples**. Real Reach analysis produced
  an honest product-signal empty state with unrelated job feeds skipped. A real
  Mindshare media-service profile surfaced the live Northampton College CA18543
  Contracts Finder notice through the normal results interface. The official
  notice URL, buyer, scope, active status, deadline, open procedure, SME signal,
  and application route were verified. User-edited media-planning terms remain
  distinct from page evidence. Unrelated Jobicy noise was not counted as a
  positive result and remains a source limitation.
- Gate 3: **HOLD / FAIL at exact 320px; PASS at 390px**. Installed Chrome
  DevTools measured 390px with document width 375px and no overflow. At 320px,
  the document/body measured 342/343px and the authenticated Sign out control
  extended beyond the viewport, producing a horizontal scrollbar.

### Directive 030 release decision

**HOLD — no merge, push, Render deployment, or production UAT was performed.**
The existing production revision and rollback state remain unchanged. The
minimum server/UI compatibility guard and its disposable probe are recorded in
[docs/directive-030-release-gates.md](docs/directive-030-release-gates.md).
A separate explicitly approved mobile-only correction is required before
controlled promotion. The exact local viewport evidence must not be described
as a production acceptance result.

## Directive 031 — final mobile and Jobicy relevance correction

Updated 2026-10-17 (Africa/Lagos). The bounded correction is on
`codex/directive-029-reach-regression` and is recorded in
[docs/directive-031-release-gates.md](docs/directive-031-release-gates.md).

### Verified production identity before promotion

Render dashboard inspection established that the actual live service was:

- Live deployment: `dep-db918lmq1p3s739n88dg`.
- Live commit: `53a24e72543f6ed300996a62d711b93b7f48ce4c`.
- Immediate predecessor and correct rollback target: `64807d1ce7da0c036949d430a0627c9878770323`, deployment `dep-db8tm949v7es73drf4tg`.
- `origin/main` before merge: `168689760751e7d20aca274c0ffade63bc5b054f`.
- Render automatic deployment: disabled.

The prior `64807d1…` and `53a24e7…` reports were different deployments. The
older `6cbe759…` revision was not used as the immediate rollback target.

### Gate 1 — 320px overflow

Installed Chrome DevTools with a real authenticated session measured the
pre-fix 320px document/body as `342/343px`; the Sign out button ended at
`342.840px`. The root cause was the existing mobile selector `.app-brand em`
not matching the authenticated `.app-nav .brand` markup, leaving the label in
the flex row. The minimal correction is `.app-nav .brand em { display: none; }`.

After correction, the 320px document/body is `305/305px` and Sign out is
`235.572px–288.888px` with width `53.316px`. At 390px the document/body is
`375/375px` and Sign out is `301.968px–355.284px`. Profile confirmation,
results, saved pipeline, and landing/registration all measured with no
horizontal overflow at both widths; buttons remained enabled and within the
viewport. No overflow clipping was added.

**Gate 1: PASS.**

### Gate 2 — Jobicy false-positive correction

The observed Jobicy records for Reddit (`EMEA Insights Lead, Consumer and
Commercial Strategy` and `Staff Machine Learning Engineer, Ads Foundational
Representations`) were `Contract` records whose original bodies described
internal recruitment roles, responsibilities, qualifications, benefits,
interviews, and candidate/employment handling. They did not request external
media planning or buying services. Generic profile overlap had previously
allowed them through.

The adapter now normalizes the current public Jobicy schema, requires an
external/freelance service signal, and rejects recruitment-context records.
The targeted false-positive regression passes, while a project-based freelance
media-buying regression remains eligible. The live media-planning query
returned 43 Jobicy records: 41 full-time rejections, 2 unsupported recruitment
rejections, and 0 qualified Jobicy recommendations.

The real Mindshare browser path still surfaced the current Contracts Finder
Northampton College CA18543 active request with buyer, official notice URL,
status, deadline, application route, and explicit qualification limitations.
The browser also verified Potential Customer and Research Signal labels,
research-only draft blocking, and rejection of that specialized notice for a
branding-only profile.

**Gate 2: PASS.**

### Gate 3 — release verification

Typecheck, zero-warning lint, 30 unit/regression tests, production build, live
discovery, Contracts Finder, DeepSeek core acceptance, ownership isolation,
legacy-profile compatibility, Mindshare browser acceptance, Jobicy regression,
and exact 320px/390px checks passed. The core acceptance probe uses the real
Mindshare procurement path so persistence and proposal recovery are exercised
against a current source with an official route; it does not use a hardcoded
result. Production-only audit remains `0 high / 0 critical / 5 moderate` in
the documented transitive Mastra parser chain; no dependency upgrade or forced
fix was made.

**Local gates: PASS.**

### Directive 031 promotion status

**READY FOR CONTROLLED PROMOTION.** The code correction and evidence are ready
for a normal merge, exact-merge verification, push, and manually targeted
Render deployment. The final merge SHA, new Render deployment ID/SHA, and
post-promotion production Reach/Mindshare, persistence, ownership, and mobile
results must be appended after promotion. If a critical production gate fails,
roll back to the verified `64807d1ce7da0c036949d430a0627c9878770323` deployment
and return HOLD. Do not publish the hackathon entry without owner approval.

### Controlled promotion completed

Updated 2026-10-17 after the authorized promotion. The normal merge was pushed
to GitHub and the exact SHA was manually deployed to Render:

- Merge and deployed SHA: `1be26da3366c9ddbbd49018ec0cbbdab3ce8795e`.
- GitHub runtime push: `1be26da3366c9ddbbd49018ec0cbbdab3ce8795e`.
- Documentation-only evidence follow-up: `c64baf4b519d9ea165749b94d7de0b077d924c4c` on `origin/main`; it was not redeployed.
- Render deployment: `dep-db9cu2favr4c73djgm4g`, status `Deploy succeeded | Live`.
- Render source link verified the full SHA above; automatic deployment remained
  disabled.
- Correct immediate rollback target: `53a24e72543f6ed300996a62d711b93b7f48ce4c`,
  deployment `dep-db918lmq1p3s739n88dg`.

Production Reach negative and Mindshare positive acceptance passed with
disposable accounts. The Mindshare browser flow surfaced the real active
Contracts Finder Northampton College CA18543 media-planning/buying request
with buyer, official URL, status, deadline, application route, and eligibility
limitations. Potential Customer and Research Signal labels, research-only
guidance, branding mismatch rejection, Jobicy false-positive exclusion,
profile/proposal persistence, logout/login recovery, ownership isolation, and
cleanup passed. The Reach flow analyzed the real public page as Product Owner,
forced the server's effective mode to Potential Customers, skipped Jobicy,
Remote OK, and SerpApi, and did not promote generic job/project signals.

The exact installed-Chrome 320px/390px geometry gate passed directly against
the live Render service on authenticated landing/profile/results/saved-pipeline
screens: 320px document/body `305/305`, Sign out `235.572–288.888`; 390px
document/body `375/375`, Sign out `301.968–355.284`; no visible control
exceeded the viewport and Sign out remained enabled/clickable. The disposable
production account and records were deleted after the check.

**Directive 031 final status: GO for owner sign-off; HOLD on hackathon
publication until the owner explicitly authorizes submission.**

## Directive 033 — Reach semantic matching and cross-objective correction

Updated 2026-10-17 (Africa/Lagos). The P0 correction is complete on the new
branch `codex/directive-033-semantic-product-matching`; controlled promotion is
pending the final merge/deployment record below.

The defect was systemic: product-owner discovery still queried Contracts Finder,
and product compatibility accepted broad source/profile token overlap. The
bounded correction now requires a grounded, phrase-level product capability and
a concrete product use-case signal. Product brand names, generic vocabulary,
incidental payment words, and unrelated service-procurement notices do not
qualify. Contracts Finder is explicitly skipped for product-owner discovery and
remains enabled for service-provider procurement matching. The result-card CSS
also prevents long evidence text from expanding the document at 320px without
using overflow clipping.

The required matrix passed: Northampton media buying, Department for Education
Oracy, BlueTuskr graphic design, generic GitHub work, brand-only overlap,
incidental payment/passkey overlap, and branding-vs-media cross-objective
matches were rejected. A synthetic, clearly labeled product evaluator with
passkey peer-to-peer payment and claim-link requirements qualified in unit
tests only; no live product buyer was invented. A live Mindshare service profile
continued to surface Northampton College CA18543 as a confirmed active request.

The real local browser journey against the public Reach page returned an honest
empty state: 0 active requests, 0 potential customers, and 0 research signals;
Contracts Finder was reported as skipped. Exact 320px and 390px profile and
results measurements passed with document/body widths equal to the viewport and
the Sign out control visible. Disposable accounts were cleaned up.

Final local verification passed: typecheck, zero-warning lint, 33 unit/regression
tests, production build, discovery, Contracts Finder, DeepSeek core, ownership,
legacy compatibility, and the Directive 033 browser harness. Full evidence is
in [docs/directive-033-release-gates.md](docs/directive-033-release-gates.md).

