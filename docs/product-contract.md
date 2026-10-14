# Source Product Contract

Status: Phase 1 product-contract correction, not implementation acceptance.

## One sentence

Source helps freelancers and small independent businesses discover relevant
paying opportunities by turning a public project URL into a reviewable,
evidence-backed profile and using that confirmed profile plus explicit customer
preferences to query and rank permitted sources.

## Problem

Freelancers and small teams often have useful work scattered across a website,
portfolio, repository, or social profile. Searching for work is then a repeated
translation task: describe what they actually do, find a request that needs it,
decide whether the buyer is plausible, and write a proposal without overstating
their experience. Generic job search tools do not know the user's actual
evidence, and generic writing tools can invent credibility.

Source reduces that translation work. It must keep the evidence boundary visible:
the site says what it says, the model may infer a suggestion, and the user
decides what becomes part of their confirmed profile.

## Before and after

| Before | Source intervenes | After |
|---|---|---|
| User repeats a profile from memory across searches and proposals | Source fetches a public URL, extracts claims, attaches evidence, and asks the user to confirm | User has a reusable profile whose claims can be inspected and edited |
| User searches one generic phrase for every buyer type | Category selection produces a versioned query plan and ranking features | Small business, startup, agency, and individual preferences materially change results |
| User cannot tell whether a match is fresh or why it appeared | Adapters keep source, canonical URL, published time, and evidence excerpt | User can inspect the original source and match explanation |
| Proposal writing may introduce unsupported claims | Draft uses only user-confirmed claims and remains editable | User can edit a credible draft without automatic sending |
| Work is lost when a tab closes | Records are tied to the authenticated user | User can return and recover profiles, saved opportunities, and proposals |

## Actors

| Actor | Provides or receives | Direct user interaction |
|---|---|---|
| Freelancer or small business user | Profile, customer preferences, saved opportunities, proposal edits | Yes |
| Source web app | Form controls, evidence, search results, proposal editor | Yes |
| Source server | Fetches, validates, normalizes, ranks, persists | No |
| Gemma model | Suggests structured claims and proposal language from bounded inputs | No |
| HN, Jobicy, Remote OK, Himalayas, or SerpApi | Permitted external discovery data | Indirectly through linked source evidence |
| MongoDB Atlas | Authenticated user data and durable saved work | No |
| Render | Public runtime | No |
| Sentry, if enabled | Error and optional AI workflow telemetry | No |

## Core journey, user side and system side

| Stage | User does | System does |
|---|---|---|
| Arrival | Understands the product and chooses “Start with a URL” or “Enter details manually” | Presents one primary action, no empty dashboard |
| Account | Creates or signs into an account | Creates a session and derives user identity server-side |
| Onboarding | Pastes public URL and starts analysis | Validates URL, blocks private destinations, fetches public content, normalizes it |
| Analysis | Watches progress and can retry | Extracts content, optionally renders JS, calls Gemma with untrusted content quarantined |
| Review | Edits name, services, skills, evidence, and inferences | Shows source links and excerpts; rejects unsupported fields |
| Confirm | Confirms the profile and chooses customer categories | Stores confirmed claims and category preferences under the user |
| Search | Starts “Find opportunities” or the separate prospect strategy | Builds category-aware query, calls permitted adapters, normalizes and ranks results |
| Inspect | Opens a result and reads source, freshness, and match reasons | Shows canonical URL, source timestamp, evidence, matched capabilities, category signals |
| Proposal | Edits a suggested proposal | Drafts only from confirmed claims; never sends automatically |
| Save | Saves an opportunity | Persists opportunity and proposal with owner ID |
| Return | Signs in later and opens saved work | Queries only the authenticated user's records and reconstructs the state |

## Discovery modes and claim boundary

Source has two deliberately different discovery modes:

### Freelance service discovery

Find public requests for projects, hiring opportunities, contracts, or other
work signals that match the user's confirmed services. A source record may be
classified as permanent employment, explicit freelance or contract work,
potential demand, or unclear. The UI must show that classification.

### Potential buyer discovery

Find organizations or individuals with public signals that may indicate demand
for the user's offering. A matching website, company profile, or job record is
not proof that the party requested the user's service. Source must label these
as potential buyer signals to investigate unless the source explicitly supports
stronger wording.

The same source record must not be silently presented as both a contract
opportunity and an active buyer. Query templates, freshness policies,
qualification rules, and match explanations must identify the selected mode.

## Magic moment

The magic moment is seeing a real, recent opportunity whose source excerpt,
profile capability, and selected customer type are all visible in one match
explanation, followed by an editable proposal that uses only claims the user
confirmed.

## Core loop

Public URL -> grounded profile -> confirmed customer intent -> permitted source
query -> evidence-backed match -> editable proposal -> saved work.

## State model

| State | Created by | Persists? | Allowed transitions |
|---|---|---:|---|
| Account | User sign-up | Yes | active, locked, deleted |
| Profile draft | URL analysis or manual entry | Yes | edited, confirmed, superseded |
| Profile confirmed | User review | Yes | edited, reconfirmed, archived |
| Source snapshot | Safe fetch | Bounded retention | normalized, rejected, expired |
| Search run | User action | Yes for audit and recovery | running, succeeded, empty, failed |
| Opportunity | Source result normalization | Yes | new, saved, dismissed, stale |
| Proposal draft | User action | Yes | editing, saved, discarded |

Source must be clear about freshness. A result can be saved after its source
changes, but it must show the last observed timestamp and may be marked stale.

## Data and privacy boundary

Off-platform private data includes passwords, sessions, secret keys, raw model
provider credentials, and any source content not needed for the user's saved
work. The database should keep bounded evidence excerpts, canonical URLs,
metadata, and content hashes rather than copying entire third-party sites by
default. A retention policy must be chosen during implementation.

Every stored record has a server-assigned owner ID. Client-provided IDs are
selectors, never proof of ownership. Queries, updates, and deletes enforce the
authenticated session on the server.

## Deterministic versus model responsibility

Rules decide:

- URL safety and fetch limits
- allowed content types and source policies
- schema validity and citation containment
- user ownership
- query construction
- category filtering and scoring
- freshness labels
- whether a claim may be used in a proposal

Gemma may narrate or suggest:

- structured profile wording from fetched evidence
- keyword suggestions
- match explanation prose from already selected evidence
- a proposal draft from confirmed profile facts

If Gemma is unavailable, the profile can fall back to manual entry and the
source result path can remain usable. This preserves the deterministic core.

## Non-goals for the first complete slice

- Automatic applications, email, messages, or outreach
- Client or payment guarantees
- Scraping behind authentication, paywalls, or blocked sources
- Full marketplace accounts for Upwork or other closed platforms
- Private GitHub repository access
- Unreviewed AI claims or AI-controlled actions
- A general-purpose autonomous agent
- A full CRM, pipeline, invoicing, or payment system
- Historical success-rate claims without product evidence
- A claim that every opportunity is legitimate or still open

## Acceptance checklist

The product contract passes only after all of these are observed through the
normal deployed path:

- [ ] Fresh account creation and sign-in
- [ ] Actual public URL submission
- [ ] Real server-side fetch
- [ ] Grounded profile with citations
- [ ] Edit and confirm
- [ ] One or more client category selections
- [ ] Category-dependent query and ranking proof
- [ ] Live source-linked results
- [ ] Match explanation with evidence
- [ ] Editable proposal based only on confirmed claims
- [ ] Save and reload after a fresh session
- [ ] Wrong-user access denied
- [ ] Empty and failure paths are honest and recoverable

