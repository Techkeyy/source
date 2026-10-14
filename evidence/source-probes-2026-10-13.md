# Source Access Probes — 2026-10-13

Date: 2026-10-13 (Africa/Lagos)

Purpose: record read-only external access probes used to evaluate candidate
discovery sources. These are not Source product tests and do not prove that an
adapter, account system, or deployed application exists.

## Execution conditions

- Windows 11 environment.
- PowerShell 7.6.5.
- Probes first failed inside the restricted sandbox with a socket permission
  error. The same read-only requests were then run with explicit elevated
  network permission.
- No provider credentials were printed or stored.

## Results

| ID | Request | Result | Observed evidence | Interpretation |
|---|---|---|---|---|
| PROBE-HN-ALGOLIA | https://hn.algolia.com/api/v1/search_by_date?query=Ask%20HN%20Who%20is%20hiring&tags=story&hitsPerPage=5 | PASS | HTTP 200; 32,915 bytes; five hits; nbHits 955; first result was a recent October 13, 2026 Show HN item | Public search path was reachable and returned recent structured results. Search availability needs a health check and strict freshness filtering. |
| PROBE-HN-FIREBASE | https://hacker-news.firebaseio.com/v0/item/1.json | PASS | HTTP 200; public item; type story; title Y Combinator | Official public item API was reachable. Item 1 is historical, so item age must be handled. |
| PROBE-JOBICY | https://jobicy.com/api/v2/remote-jobs?count=5&tag=typescript | PASS | HTTP 200; JSON; success true; five records; first title Senior Backend Engineer; canonical Jobicy URL present | Structured no-key discovery path was reachable. Terms, attribution, and hourly polling limit remain implementation constraints. |
| PROBE-REMOTEOK | https://remoteok.com/api?tag=dev | PASS | HTTP 200; JSON; 100 records; first record Product Design Director; recent date field present | Public tagged feed was reachable. Records need normalization and freshness filtering. |
| PROBE-HIMALAYAS | https://himalayas.app/jobs/api/search?q=typescript&sort=recent | PASS | HTTP 200; JSON; totalCount 4406; 19 jobs; first was Senior React Full-stack Developer | Public searchable job feed was reachable. Pagination, attribution, and source terms need a real adapter review. |
| PROBE-SERPAPI-NO-KEY | https://serpapi.com/search?engine=google_jobs&q=typescript%20freelance | EXPECTED HOLD | HTTP 401 Unauthorized | Documentation-based feasibility only. No SerpApi integration may be claimed until a key and quota are supplied. |
| PROBE-STATIC-WEB | https://www.python.org/ | PASS | HTTP 200; 51,988 bytes; HTML title and script tags present | Static HTML fetching is possible. This does not establish that a target site’s useful content is present without JavaScript rendering. |

## Additional HN query observations

- A 'Who is hiring' story query returned current October 2026 hiring-thread
  titles and a large result count.
- A 'freelance' job query returned only 15 records and included stale 2022 and
  2024 items. This is direct evidence that result age cannot be assumed from
  the provider response and must be a product rule.

## Environment credential check

The following names were checked and were absent:

- SERPAPI_API_KEY
- MONGODB_URI
- SENTRY_DSN
- GOOGLE_API_KEY
- GEMMA_API_KEY
- RENDER_API_KEY
- MASTRA_API_KEY

No secrets were requested, echoed, or committed.

## What this evidence does not prove

- It does not prove permission to cache or redistribute every returned field.
- It does not prove a provider’s uptime or rate-limit guarantee.
- It does not prove source relevance for every customer type.
- It does not prove JavaScript-rendered website extraction.
- It does not prove model quality, database persistence, authentication, or
  deployment.
