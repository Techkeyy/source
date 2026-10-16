# Source

Source turns a freelancer’s public project URL into an editable, evidence-grounded profile and uses it to find customers who may need what they do. It keeps explicit active requests separate from potential-customer signals inferred from public project evidence.

The approved release is live at [https://source-9k1o.onrender.com](https://source-9k1o.onrender.com). The application is deployed from the verified merge commit [`64807d1ce7da0c036949d430a0627c9878770323`](https://github.com/Techkeyy/source/commit/64807d1ce7da0c036949d430a0627c9878770323) in the [Techkeyy/source GitHub repository](https://github.com/Techkeyy/source). Render automatic deployment remains disabled; the prior production revision `6cbe759b16ae775a13d122abb3d9686b69d73877` is retained as the rollback target.

**[Director evidence](director.md)** · **[Manual acceptance](docs/manual-acceptance.md)** · **[Phase 3 live report](docs/phase-3-live-integration-report.md)** · **[Source probes](evidence/source-probes-2026-10-13.md)** · **[Security audit triage](docs/audit-triage-2026-10-16.md)**

> *“What can I credibly offer this buyer, and where is the evidence that I am a relevant match?”*

Source is for freelancers and small independent businesses that need a faster path from their existing work to credible customer discovery. It does not guarantee customers, payments, hiring outcomes, or responses. The public production deployment is the approved pre-pivot release; the customer-discovery pivot in this branch is not deployed until owner approval.

## Why this exists

Most customer discovery starts with a blank keyword box or an unverified assumption about who needs help. That leaves the freelancer to translate their own work into search terms, judge whether a public signal is meaningful, and write outreach without a grounded account of what they can support.

Source starts with the user’s own public project, portfolio, agency, or business URL. It extracts a reviewable profile, keeps evidence quotes attached to claims, lets the user choose small businesses, startups, agencies, and individuals, then separates explicit active requests from potential customers inferred from public project signals.

```text
Public project URL
       |
       v
Safe fetch + content extraction
       |
       v
DeepSeek JSON profile + evidence validation
       |
       v
User edits and confirms profile
       |
       v
Customer discovery query planning
       |
       v
Live permitted sources -> active requests and potential signals
       |
       v
Proposal or cautious outreach draft -> pipeline -> recovery
```

## What it does

1. **Creates** an account with a server-side session and MongoDB ownership boundary.
2. **Fetches** a public URL with SSRF checks, redirect revalidation, size limits, and content normalization.
3. **Extracts** a structured profile with the active DeepSeek Chat Completions integration, JSON mode, disabled thinking, and a bounded prompt.
4. **Validates** the response with Zod-compatible schema checks and deterministic evidence matching. Claims without matching source quotes are not accepted as verified facts.
5. **Lets the user edit and confirm** the generated profile before it is persisted.
6. **Plans** discovery queries from confirmed services, skills, keywords, and one or more selected customer categories: small businesses, startups, agencies, or individuals.
7. **Finds active requests** from public Hacker News, Jobicy, and Remote OK records, with optional SerpApi coverage when an owner-configured key exists.
8. **Finds potential customers** from public Hacker News discussion and GitHub issues/repos where the source exposes a relevant project signal; GitHub labels and evidence are filtered locally. Reddit is deliberately disabled until authorized commercial API access exists.
9. **Classifies and ranks** fresh source-backed signals, retains original URLs and dates, explains profile/category matches, and labels inferred intent as unconfirmed.
10. **Drafts** an editable application for an active request or a cautious, non-assumptive outreach note for an inferred signal. Source never sends messages or performs bulk outreach.
11. **Persists** profiles, opportunities, statuses, next steps, and proposal/outreach drafts so the same account can recover them after refresh or logout/login.

## Quickstart

Install dependencies:

```powershell
npm install
```

Configure the server, never the browser:

```powershell
Copy-Item .env.example .env.local
# Edit .env.local and set:
# MONGODB_URI, MONGODB_DB, SESSION_SECRET
# INFERENCE_PROVIDER=deepseek
# DEEPSEEK_MODEL=deepseek-flash
# DEEPSEEK_API_KEY=<owner-configured-secret>
```

Run the application:

```powershell
npm run dev
```

Before relying on the UI, run the server-side health checks:

```powershell
npm run probe:mongodb
npm run probe:gemma -- https://www.frog.co/
npm run probe:core
```

The historical script name `probe:gemma` is retained for compatibility with the handoff. It reports the active provider and model, and currently exercises DeepSeek when `INFERENCE_PROVIDER=deepseek`.

## The accepted production path and current pivot boundary

The existing production technical acceptance used the public deployment at [source-9k1o.onrender.com](https://source-9k1o.onrender.com) with disposable records that were deleted after testing. It covered registration, live website analysis, grounded profile review, profile confirmation and editing, discovery, proposal editing and saving, recovery, ownership isolation, and cleanup. Production remains unchanged while the customer-discovery pivot is reviewed on `codex/directive-024-customer-discovery`.

The production path is:

1. Register an account.
2. Analyze a public website such as `https://www.frog.co/`.
3. Review the DeepSeek-generated claims and evidence, then confirm and edit the profile.
4. Select one or more customer categories: small businesses, startups, agencies, and individuals.
5. Choose **Active requests** for explicit public requests or **Potential customers** for public signals whose buying intent is inferred rather than confirmed.
6. Inspect the original source, publication date, observed need, profile fit, and eligibility limitations before acting.
7. Generate, edit, and save an application proposal for an active request, or a cautious outreach draft for an inferred signal. Source never sends it.
8. Refresh, log out, and log back in to recover the confirmed profile, saved prospect, and edited draft.

The pivot is deliberately not described as production acceptance yet. Local browser evidence confirms the new navigation, all four category controls, active-request results, pipeline persistence, mode-aware provider boundaries, and proposal editing. The current frog profile produced no qualifying potential-customer result after the evidence rules; that is reported as an empty result, not converted into a customer claim.

There is no offline fixture path in the current release. Source’s core acceptance intentionally requires a real public website, a real model response, permitted live sources, and real persistence. The product does not substitute fixtures when those dependencies are missing.

## Verified production result

The verified public release produced the following results:

| Check | Result |
|---|---|
| Public deployment | Render service `source`, deployed commit `64807d1ce7da0c036949d430a0627c9878770323`, deployment `dep-db8tm949v7es73drf4tg` |
| Active provider/model | DeepSeek, `deepseek-flash` |
| Website analysis | `https://www.frog.co/`, live HTTP 200 source fetch |
| Profile grounding | 8 grounded claims from 37 extracted source excerpts in the production response |
| Profile persistence | Confirmed profile and edits recovered after refresh and logout/login |
| Four customer categories | Small businesses, startups, agencies, and individuals all preserved the selected category and produced distinct Hacker News query terms |
| Category evidence | The agencies branch surfaced an evidence-backed `agency` match; the other branches truthfully left customer type unknown when the source did not support it |
| Discovery | Live Hacker News, Jobicy, and Remote OK sources returned a qualified source-linked contract result in the accepted release; the pivot also adds GitHub potential-signal querying behind a separate mode |
| Eligibility warning | The UI correctly warned that Source does not verify user-specific location, schedule, or availability eligibility |
| Proposal persistence | Proposal was generated, edited, saved exactly, and recovered after refresh and logout/login |
| Account isolation | A second account could not read or draft against the first account’s opportunity; saved lists remained isolated |
| Desktop acceptance | Public Chromium browser UAT passed the core user journey and cleanup |
| Mobile acceptance | Exact 390px and 320px checks passed with no horizontal overflow |
| Unit suite | Existing production merge: 4 files, 13 tests; customer-discovery branch: 4 files, 16 tests passing |
| Build and static checks | Typecheck, ESLint, and production build passed on the verified merge and again on the customer-discovery branch |

The corrected public result rendered the em dash (`—`) correctly, retained original source links, and did not claim user-specific eligibility or worldwide availability.

## Architecture

| Module | Job |
|---|---|
| `src/components/SourceApp.tsx` | URL onboarding, profile review, category selection, results, proposal, and saved-work UI |
| `src/lib/extract.ts` | Safe public fetch, HTML normalization, and evidence excerpts |
| `src/lib/gemma.ts` | DeepSeek request, disabled thinking, JSON parsing, schema validation, and grounding |
| `src/lib/profile-workflow.ts` | Mastra workflow boundary around profile analysis |
| `src/lib/discovery.ts` | Category-aware source queries, classification, deduplication, and ranking |
| `src/app/api/opportunities/[id]/route.ts` | Owned pipeline status and next-step updates |
| `src/lib/auth.ts` | Password hashing, session cookies, and user identity |
| `src/lib/db.ts` | MongoDB connection and collection access |
| `scripts/core-acceptance-check.mjs` | Reproducible full local integration and cleanup harness |

## Why URL-first matching matters

The differentiator is not a generic job search. Source uses the user’s own public work as the starting evidence, then requires the user to confirm the resulting profile before discovery. Active requests remain explicit and application-oriented. Potential customers are hypotheses based on public GitHub or Hacker News evidence, not confirmed buyers. Every result keeps its original URL, publication date, observed need, source type, profile-match explanation, and limitation close to the action.

## How I tried to break it

| Input or condition | Result |
|---|---|
| Loopback, private, and metadata URLs | Rejected by SSRF tests |
| Credential-bearing and non-standard-port URLs | Rejected by SSRF tests |
| Wrong password | Password verification test returned false |
| OpenRouter free route unavailable | HTTP 429 was recorded; no profile was fabricated and no paid model was substituted |
| DeepSeek returned invalid claim shapes | Rejected before acceptance; prompt was corrected with valid JSON example syntax |
| Different customer categories | Live query changed and policy preserved the selected category |
| Second account reading first account’s saved opportunity | Denied; saved list remained isolated |
| Second account drafting against first account’s opportunity | Denied with HTTP 404 |

Source’s invariant is: **missing or unverified website evidence never becomes a verified profile claim.** Rules decide grounding, classification, ownership, and ranking deterministically; DeepSeek supplies structured candidate text only.

## Security and honest limits

- API keys and MongoDB credentials are server-only. `.env.local` is ignored and is not committed.
- Website content is treated as untrusted data and is not allowed to become privileged instructions.
- The system rejects private-network URL targets, credentials in URLs, unsafe redirects, oversized pages, and unsupported ports.
- Discovery results are public signals, not guarantees of a client, contract, buyer, payment, or response.
- Unconfirmed buyer signals must be treated as leads to investigate, not as confirmed work.
- Source does not determine whether a particular user is eligible for a listing’s location, schedule, employment, geographic, or availability requirements. Users must inspect the original listing before acting.
- Source only shows a contact or application route when the public source provides one. It does not send messages, scrape private areas, or perform bulk outreach.
- Reddit is an explicit disabled adapter boundary until authorized commercial API access exists; Source does not scrape Reddit or bypass its restrictions.
- SerpApi is optional and is honestly skipped when no key is configured.
- The production-only npm audit found 5 moderate and 0 high or critical findings. The full development-inclusive audit found 5 high and 5 moderate findings. The high findings are in the development-only ESLint chain; the moderate findings are a transitive Mastra parser chain with residual production risk. No forced audit fix or dependency change was made under this release boundary. See the [full audit triage](docs/audit-triage-2026-10-16.md).

## Sponsor and submission honesty

The documented technologies used by the release are DeepSeek, Mastra, MongoDB Atlas, and Render. Their use is described factually; it is not a claim of sponsorship, prize eligibility, partner status, or a specific hackathon category. No prize, ranking, performance metric, or sponsor integration is claimed without evidence. Owner confirmation is still required before calling the hackathon submission complete.

## Verification and handoff

```powershell
npm run typecheck
npm run lint
npm test -- --run
npm run build
npm audit --omit=dev
node --check scripts/gemma-check.mjs
```

Read [director.md](director.md) for the authoritative claim ledger, provider evidence, deployment gates, production acceptance, and owner sign-off state. See [docs/manual-acceptance.md](docs/manual-acceptance.md) for the browser procedure when controlled browser automation is unavailable.

## Status

**EXISTING PRODUCTION TECHNICAL ACCEPTANCE PASSED; CUSTOMER-DISCOVERY PIVOT LOCALLY VERIFIED; OWNER SIGN-OFF AND CONTROLLED PROMOTION PENDING.**

The public release is deployed and its production desktop, mobile, persistence, four-category, ownership, and cleanup gates passed. The customer-discovery pivot is committed on a separate branch and has not been deployed. Remaining blockers are owner review of the pivot, a fresh production acceptance of the new journey, owner sign-off, and a separately controlled follow-up for the moderate Mastra transitive dependency risk. This branch does not change the deployed application or production infrastructure.

License: not yet selected; this remains a private hackathon deployment candidate.
