# Source Phase 1 and Phase 2 Feasibility Report

Date: 2026-10-14 (Africa/Lagos)

Status: focused feasibility evidence only. The complete Source application has
not been built, deployed, or accepted.

## Recommendation

**CONDITIONAL PROCEED TO MINIMUM VERTICAL SLICE**

Proceed only if the next phase remains service-provider-first, labels potential
buyers honestly, uses source-specific freshness and classification rules, and
obtains an owner-approved Gemma inference route before claiming model-backed
profile generation or the Gemma prize category.

Do not proceed to a broad buyer database, automatic outreach, or a multi-source
marketplace aggregator. The evidence does not support those claims.

## A. Website analysis

### Real URLs tested

| Input | Result | Notes |
|---|---|---|
| https://www.austinkleon.com/ | PASS | Redirected to https://austinkleon.com/; HTTP 200; 65,562 bytes; creator/portfolio-like content extracted |
| https://www.frog.co/ | PASS | HTTP 200; 313,315 bytes; direct service, research, AI, and experience signals extracted |
| https://linear.app/ | HOLD | Exceeded the isolated 1 MB response limit; no unbounded fetch was attempted |
| https://www.campfire.so/ | PASS with limitation | HTTP 200; 19,676 bytes; page was a domain-for-sale landing page, not a product page |
| https://example.com/ | PASS for sparse handling | HTTP 200; 577 bytes; sparse content produced no service or direct customer-segment claims |

### Security cases

The isolated fetcher rejected file URLs, 127.0.0.1, localhost resolving to
loopback, 10.0.0.1, and 169.254.169.254. It accepted a public HTTPS URL,
validated public DNS addresses, bound the connection to the validated address,
used a bounded response size, and manually constrained redirects.

This is a feasibility control, not a production security certification. The
production implementation still needs redirect, DNS-rebinding, timeout,
content-type, browser-rendering, and adversarial prompt-injection tests.

### Structured output and grounding

The fallback parser produced JSON fields for names, descriptions, service or
product signals, technology signals, evidence excerpts, source URLs, inferred
customer categories, keywords, and unsupported fields. Unsupported fields
including pricing, ownership, past clients, and years of experience were
marked as unsupported when the source did not support them.

The fallback parser is deterministic and is not a Gemma integration.

### Model status

**BLOCKED.** No Gemma credential, Ollama host, or local Gemma runtime was
available on October 14, 2026. No model output was mocked or substituted for a
real model call.

Evidence:

[website-analysis.py](C:/Users/HomePC/Desktop/source/feasibility/website-analysis.py)  
[website-analysis-results-2026-10-14.json](C:/Users/HomePC/Desktop/source/feasibility/website-analysis-results-2026-10-14.json)

Overall website status: **PARTIAL PASS; Gemma BLOCKED.**

## B. Opportunity discovery

The live providers were queried with fixed public endpoints. A 30-day
freshness threshold was used for this feasibility run; it is not yet a final
product policy.

| Provider | Total | Fresh | Main finding |
|---|---:|---:|---|
| Hacker News job-tagged freelance query | 15 | 0 | 11 contract/freelance signals and 4 unconfirmed demand signals, but none passed the 30-day threshold; one duplicate |
| Jobicy TypeScript feed | 50 | 50 | 47 permanent/unspecified, 2 explicit freelance/contract, 1 unclear |
| Remote OK developer feed | 100 | 17 | Fresh subset: 1 explicit contract, 6 unconfirmed demand, 4 permanent/unspecified, 6 unclear |
| Himalayas TypeScript search | 20 | 20 | 2 explicit contractor records and 18 permanent/unspecified |

The records include canonical URLs and timestamps where providers returned them.
Budget/compensation and application/contact signals were also measured. The
provider results are mixed rather than a clean pool of freelance requests.

HTTP 200 was not treated as opportunity proof. Potential buyer signals were
not promoted to confirmed requests. Stale results were counted and rejected
rather than silently shown as recent. Classifications are conservative script
heuristics, not provider truth labels.

Evidence:

[discovery-analysis.py](C:/Users/HomePC/Desktop/source/feasibility/discovery-analysis.py)  
[discovery-analysis-results-2026-10-14.json](C:/Users/HomePC/Desktop/source/feasibility/discovery-analysis-results-2026-10-14.json)

Overall discovery status: **PARTIAL PASS for access; HOLD for a broad
genuine-freelance-opportunity claim.**

## C. Customer category differentiation

The same frog profile was used to run live HN searches for:

- small businesses: small business design;
- startups: startup design;
- agencies: agency design;
- individuals: personal project design.

Each returned 20 records. The query string, qualification vocabulary, score
components, freshness signal, and explanation text changed with the selected
category. This proves the category selection can materially affect the
discovery mechanism.

However, the returned HN records often lacked reliable customer-type evidence
and many were stale or irrelevant. The test therefore does not prove that the
source can identify customer types accurately enough for an unconditional
ranking claim.

Overall category status: **HOLD.**

The next implementation must use source-specific fields where available and
must show uncertain customer type rather than inventing a label.

## D. Grounded matching

The matching test used the real frog extraction and real provider records.

Accepted for review:

- Source: Remote OK
- Title: Product Design Lead
- Published: October 9, 2026
- Classification: potential-buyer-signal-unconfirmed
- Profile overlap: AI, design, experience
- Boundary: the record is a public signal to investigate, not proof that the
  organization explicitly requested the user’s service.

Rejected:

- Source: Jobicy
- Title: Senior iOS Engineer (Swift & AWS)
- Reason: permanent/unspecified employment and no confirmed overlap with the
  profile vocabulary.

Proposal evidence:

The generated draft used only direct frog-page evidence such as transformative
experiences, designing robots for human spaces, AI-augmented research, and the
public profile URL. It did not add past clients, ownership, pricing,
guarantees, or automatic sending.

Evidence:

[matching-analysis.py](C:/Users/HomePC/Desktop/source/feasibility/matching-analysis.py)  
[matching-analysis-results-2026-10-14.json](C:/Users/HomePC/Desktop/source/feasibility/matching-analysis-results-2026-10-14.json)

Overall matching status: **PASS for the isolated deterministic proof; not
product UAT.**

## E. Sponsor strategy revision

The updated sponsor strategy uses the required classifications:

- CORE: Gemma, MongoDB Atlas, Render.
- LOW-COST OPPORTUNITY: Mastra, SerpApi, Sentry Agent Tracing, Entire, and
  ElevenLabs, only if each has a genuine observable role and proof.
- CONDITIONAL: .tech, Temporal, Backboard, and GitHub Copilot, dependent on
  owner approval, a real product or development use, and no unjustified
  complexity.
- REJECTED: TabPFN, Tinker, Arduino, DigitalOcean, and Tiger Data for the
  current product shape.

This does not mean all LOW-COST OPPORTUNITY categories will be activated.
Paid services and recurring-cost domains remain owner-approved decisions.

See [sponsor-strategy.md](C:/Users/HomePC/Desktop/source/docs/sponsor-strategy.md).

## F. Implementation readiness

### Unresolved assumptions

- An approved Gemma route can produce structured, grounded output at usable
  latency and cost.
- A 30-day or source-specific freshness policy can produce enough useful
  service-provider opportunities.
- Category-specific source fields can be found or safely treated as uncertain.
- Provider terms permit the intended display, attribution, refresh, and
  bounded retention behavior.
- Two-user ownership checks can be proven before adding broad features.

### Required credentials or owner actions

- Gemma or approved Google/hosted inference access.
- MongoDB Atlas account and connection configuration.
- Render account for the public deployment proof.
- Optional SerpApi key and quota decision.
- Optional Sentry DSN.
- Eligibility and repository-owner confirmation.

### Smallest viable vertical slice

1. One real account path.
2. One secure static URL fetch path plus manual-entry fallback.
3. One real Gemma extraction call with evidence spans, or an explicitly
   blocked/manual state until the route is available.
4. User edit and confirmation.
5. Four category selections with observable query and score changes.
6. One source adapter with canonical URL and freshness state.
7. One accepted and one rejected match explanation.
8. Editable proposal from confirmed claims only.
9. Save and reload under the same account.

No complete application, database architecture, paid API activation, or public
deployment is authorized by this report.
