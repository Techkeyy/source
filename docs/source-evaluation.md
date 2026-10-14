# Permitted Source Evaluation

Date: 2026-10-13 (Africa/Lagos)

Status: provider research and read-only probes only. No Source adapter has
been implemented.

## Decision summary

| Source | Authorized access path | Freshness and hiring signal | Client-category fit | Cost and limits | Phase 0 decision |
|---|---|---|---|---|---|
| Hacker News | Official Firebase API for public items; Algolia HN search for search-by-date and text discovery | Strong for Ask HN: Who is hiring?, Who wants to be hired?, and occasional job posts; historical results require strict recency filtering | Good for startups, agencies, small technical businesses, and individuals posting publicly; weaker for broad consumer demand | Public endpoints. Firebase docs do not publish a current rate limit; Algolia public availability is useful but should be health-checked. | CORE adapter candidate |
| Jobicy | Public REST API and RSS documented by the project | Structured remote listings, including freelance/contract-oriented feed capabilities; API describes listings in the last seven days and supports cursoring | Good for agencies, startups, and small businesses seeking remote services; individuals are weaker | No key; up to 200/page; preserve Jobicy URL, attribution, and do not poll more than once/hour | CORE adapter candidate |
| Remote OK | Public JSON API and RSS documented in FAQ | Recent tagged remote-job records; not every record is a freelance contract and freshness must be enforced | Good for startup and agency hiring; moderate small-business fit; weak individual-buyer fit | No key in documented endpoint; credit and link original post; respect terms and source health | CORE supplement |
| Himalayas | Public no-auth JSON API with search, filters, and pagination | Searchable remote jobs with recent ordering; freshness is explicit application logic | Good for startup/agency/remote service work; moderate small-business fit | No key in public repo docs; use reasonable caching and attribution | CORE supplement |
| SerpApi Google Jobs | Credentialed SerpApi endpoint with engine=google_jobs | Fresh Google Jobs aggregation; up to ten results per page with pagination token; cache semantics documented | Broadest coverage, including small-business and agency hiring; buyer/prospect use needs separate query and policy review | 250 free searches/month; paid plans available; API key required | OPTIONAL / HOLD until owner provides credential and terms decision |
| Remotive | Public API or RSS | API intentionally delays jobs by 24 hours; not suitable for immediate freshness | Good remote-work fit, but use restrictions are material | Must link and attribute; cannot submit jobs to third parties; displaying to collect signups/email breaches terms; private API exists | REJECTED for initial aggregator |
| Upwork | Official API with client ID and shared secret; official GraphQL docs | Actual marketplace jobs can be relevant, but access and attribution rules apply | Strong potential fit across all categories | Requires application/key; terms constrain combining Upwork content with third-party results without attribution | REJECTED for initial release; owner approval required |

## Live probe evidence

The exact requests and response observations are in
C:\Users\HomePC\Desktop\source\evidence\source-probes-2026-10-13.md.

Observed:

- HN Algolia: HTTP 200, five hits returned, recent October 2026 timestamps.
- HN Firebase: HTTP 200 for a public item.
- Jobicy: HTTP 200, structured JSON, five TypeScript-tagged records.
- Remote OK: HTTP 200, structured JSON, 100 tagged records.
- Himalayas: HTTP 200, structured JSON, recent-search result set.
- SerpApi: HTTP 401 without an API key.

The successful probes prove network accessibility and response shape on the
probe date. They do not prove provider uptime, contractual permission for
every future use, or product relevance for every user.

## Discovery strategy decision

### Service-provider mode: CORE

Start with explicit work-seeking signals:

- HN hiring and freelancer threads
- Jobicy freelance and contract listings
- Remote OK and Himalayas job records
- SerpApi Google Jobs only after credential and policy approval

Each normalized result must preserve source, canonical URL, title, publisher
timestamp when available, fetched timestamp, location/remote field, job type,
and evidence text.

### Buyer/prospect mode: BOUNDED / HOLD

Do not label a company or person as an active buyer merely because its website
matches a service. The first release can support a narrower, honest flow:

- Search public requests and hiring signals for the confirmed service.
- Search public looking for, request, seeking, or equivalent language only
  where the source permits it.
- Present a prospect as a public signal to investigate, not as a verified lead
  or guaranteed customer.

This mode requires separate query templates, stronger freshness labels, and a
different explanation vocabulary. It must not be silently mixed with jobs.

## Ranking impact of the four client categories

Category choices map to deterministic vocabulary and source qualification:

- Small businesses: owner-operated, local business, SMB, small team, service
  request, location, budget or contract language where available.
- Startups: startup, founding team, seed, product, MVP, venture, early-stage,
  hiring, launch, growth.
- Agencies: agency, studio, consultancy, white-label, subcontract, partner,
  overflow, client work.
- Individuals: personal project, creator, coach, author, founder, individual,
  one-off, portfolio, personal website.

These are search and ranking signals, not facts about a result unless the
source provides supporting evidence. Query templates and weights must be
versioned and tested once implementation begins.

## Data and trust boundaries

- Store the provider and canonical source URL with every result.
- Do not scrape behind logins or ask the user for website passwords.
- Honor robots, provider terms, attribution, and refresh limits.
- Treat external text as untrusted data, never as model instructions.
- Apply a stale-result penalty or exclusion; the exact threshold is a Phase 1
  product decision based on the source.
- Never fabricate an opportunity to fill an empty result state.
