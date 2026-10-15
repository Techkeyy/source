# Source

Source turns a freelancer’s public project URL into an editable, evidence-grounded profile and uses it to find source-linked opportunities for the customer types they choose.

Source is hosted on [Render](https://source-9k1o.onrender.com). A controlled
promotion was attempted, but public acceptance stopped at disposable-account
registration because the Render container could not complete its MongoDB Atlas
TLS connection. The service was rolled back to the prior known-good commit;
public acceptance remains pending an Atlas connectivity correction.

**[Director evidence](director.md)** · **[Manual acceptance](docs/manual-acceptance.md)** · **[Phase 3 live report](docs/phase-3-live-integration-report.md)** · **[Source probes](evidence/source-probes-2026-10-13.md)**

> *“What can I credibly offer this buyer, and where is the evidence that I am a relevant match?”*

Source is for freelancers and small independent businesses that need a faster path from their existing work to credible client-opportunity research. It does not guarantee clients, payments, hiring outcomes, or responses.

## Why this exists

Most opportunity search starts with a blank keyword box. That leaves the freelancer to translate their own work into search terms, judge whether a listing is real, and write a proposal without a grounded account of what they can support.

Source starts with the user’s own public project, portfolio, agency, or business URL. It extracts a reviewable profile, keeps evidence quotes attached to claims, lets the user choose small businesses, startups, agencies, and individuals, then changes discovery queries and ranking signals according to those choices.

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
Customer-type query planning
       |
       v
Live permitted sources -> classified, source-linked opportunities
       |
       v
Proposal -> save -> logout/login recovery
```

## What it does

1. **Creates** an account with a server-side session and MongoDB ownership boundary.
2. **Fetches** a public URL with SSRF checks, redirect revalidation, size limits, and content normalization.
3. **Extracts** a structured profile with DeepSeek’s documented Chat Completions endpoint, JSON mode, disabled thinking, and a bounded prompt.
4. **Validates** the response with Zod-compatible schema checks and deterministic evidence matching. Claims without matching source quotes are not accepted as verified facts.
5. **Lets the user edit and confirm** the generated profile before it is persisted.
6. **Plans** discovery queries from confirmed services, skills, keywords, and one or more selected customer categories: small businesses, startups, agencies, or individuals.
7. **Queries** public Hacker News, Jobicy, and Remote OK sources, with optional SerpApi coverage when an owner-configured key exists.
8. **Classifies and ranks** fresh freelance or contract signals, retains original URLs, explains profile/category matches, and labels unconfirmed buyer signals honestly.
9. **Drafts** an editable proposal from the saved opportunity and confirmed profile evidence.
10. **Persists** opportunities and proposal drafts so the same account can recover them after refresh or login.

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

## Try the real demo path

The minimum demonstrated path needs a running MongoDB connection, an owner-configured DeepSeek key, and a public website URL. The reproducible server-side acceptance harness is:

```powershell
npm run build
npm run start
```

In another terminal:

```powershell
npm run probe:core
```

The harness creates temporary test accounts, analyzes `https://www.frog.co/`, confirms an edited profile, runs startup and small-business searches, checks that the Hacker News queries differ, selects a source-linked freelance/contract result with profile overlap, generates a proposal, saves it, logs out and back in, verifies recovery, checks a second account cannot read or draft against the first account’s opportunity, and removes its generated records.

There is no offline fixture path in the current release. Source’s core acceptance intentionally requires a real public website, a real model response, permitted live sources, and real persistence. The product does not substitute fixtures when those dependencies are missing.

## Verified current result

The latest local integration run passed with:

| Check | Result |
|---|---|
| Active provider/model | DeepSeek, `deepseek-flash` |
| Website analysis | `https://www.frog.co/`, HTTP 200 source fetch |
| Profile grounding | 7 evidence-bearing claims and 37 source excerpts in the application response |
| Customer-type behavior | Startup and small-business Hacker News queries differed |
| Discovery | Category-dependent live queries; one relevant source-linked result |
| Relevant result | Source-linked opportunity with profile overlap and explicit classification evidence |
| Proposal | Generated, edited, saved exactly, and persisted |
| Recovery | Confirmed profile and edited proposal recovered after refresh and logout/login |
| Ownership | Second account’s profile/saved list isolated; cross-account proposal read/write denied |
| Test suite | 3 files, 10 tests passing; malformed JSON regression covered |

## Architecture

| Module | Job |
|---|---|
| `src/components/SourceApp.tsx` | URL onboarding, profile review, category selection, results, proposal, and saved-work UI |
| `src/lib/extract.ts` | Safe public fetch, HTML normalization, and evidence excerpts |
| `src/lib/gemma.ts` | DeepSeek request, disabled thinking, JSON parsing, schema validation, and grounding |
| `src/lib/profile-workflow.ts` | Mastra workflow boundary around profile analysis |
| `src/lib/discovery.ts` | Category-aware source queries, classification, deduplication, and ranking |
| `src/lib/auth.ts` | Password hashing, session cookies, and user identity |
| `src/lib/db.ts` | MongoDB connection and collection access |
| `scripts/core-acceptance-check.mjs` | Reproducible full local integration and cleanup harness |

## Why URL-first matching matters

The differentiator is not a generic job search. Source uses the user’s own public work as the starting evidence, then requires the user to confirm the resulting profile before discovery. In the verified run, changing the selection from startups to small businesses changed the live Hacker News query, while the returned opportunity retained its original source URL and profile-match explanation.

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
- Local desktop and 390px mobile Chromium acceptance has passed, including URL analysis, grounded profile review, customer selection, live discovery, proposal saving, refresh recovery, and logout/login recovery. The public landing page is reachable after rollback, but production acceptance remains blocked at registration by the Atlas TLS failure.
- The public repository is [Techkeyy/source](https://github.com/Techkeyy/source), and the existing Render service is [source-9k1o.onrender.com](https://source-9k1o.onrender.com).

## Verification and handoff

```powershell
npm run typecheck
npm run lint
npm test -- --run
npm run build
node --check scripts/gemma-check.mjs
```

Read [director.md](director.md) for the authoritative claim ledger, provider evidence, deployment gates, and exact next owner action. See [docs/manual-acceptance.md](docs/manual-acceptance.md) for the browser procedure when controlled browser automation is unavailable.

## Status

**CONTROLLED PRODUCTION PROMOTION ROLLED BACK; LOCAL CORE AND DESKTOP/MOBILE CHROMIUM ACCEPTANCE PROVEN; PUBLIC ACCEPTANCE BLOCKED BY ATLAS CONNECTIVITY.**

No Gemma prize-category eligibility is claimed. The existing Render service is public and currently serves the rollback commit; the promoted release remains unaccepted until production UAT passes. The active provider is DeepSeek because the owner selected it after the OpenRouter free route returned HTTP 429.

License: not yet selected; this remains a private hackathon deployment candidate.
