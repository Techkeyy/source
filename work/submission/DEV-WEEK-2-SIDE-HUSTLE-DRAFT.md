---
title: Source — Evidence-backed customer discovery for service businesses
published: false
tags: devchallenge, hf26challenge, sidehustle, opensource
---

*This is a submission draft for the [Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12). It is not published.*

## What I Built

Freelancers, agencies, consultants, and small service businesses often know what they can deliver but still have to search from a blank keyword box. They translate their portfolio into search terms, decide whether a public signal represents a real buying opportunity, and write a first response without much evidence.

Source turns a public project, portfolio, agency, or business URL into an editable, evidence-grounded service profile. The owner reviews the extracted claims, confirms the offering and discovery objective, selects customer categories, and then investigates source-linked opportunities.

Source deliberately separates three outcomes:

- **Active Request** — the source explicitly seeks an external supplier, contractor, vendor, agency, or tender response. This is the highest-intent result, but Source still does not verify eligibility, budget, award, or response.
- **Potential Customer** — an identifiable organization or project has an observed need and a defensible reason the user’s service may help. Commercial intent is possible, not confirmed.
- **Research Signal** — the source shows that work needs doing, but does not show that an outside provider is being considered. Source offers research guidance instead of an unsolicited outreach message.

The product does not treat an issue, an unassigned task, technical compatibility, or a generic recruitment advert as proof of outsourcing. It keeps the original URL, date, source evidence, fit explanation, buyer-intent level, and limitation beside every result.

### A real service-provider example

The strongest verified run used the public [Mindshare services page](https://www.mindshareworld.com/services). Source produced a reviewable profile, the operator confirmed a service-provider objective, and the normal Active Requests flow surfaced this official procurement notice:

- **Buyer:** Northampton College
- **Notice:** CA18543 — Northampton College — Media planning & Buying Services
- **Classification:** Active Request
- **Buying intent:** Confirmed external-service signal
- **Status:** Active
- **Deadline:** November 4, 2026 at 12:00 UTC
- **Official notice and application route:** [Contracts Finder notice](https://www.contractsfinder.service.gov.uk/Notice/d2301388-4ca6-48fc-805d-eb2e5793377e)
- **Fit:** the notice asks for media planning and buying services, matching the confirmed service profile
- **Limitation:** Source shows SME suitability and the public procurement route, but does not determine the applicant’s location, schedule, eligibility, budget, award probability, or response

This is evidence of a relevant active request, not evidence that Northampton College became a customer.

The product-owner/Reach path is intentionally not presented as a success story. Reach and FASTKEYS were not used to claim successful customer discovery. Product-owner discovery is experimental and must remain labeled as such.

## Demo

Live demo: [Source on Render](https://source-9k1o.onrender.com)

Code: [Techkeyy/source on GitHub](https://github.com/Techkeyy/source)

Prepared video: `work/submission/source-demo-88s.mp4` (88 seconds, genuine browser footage captured from the normal local application flow; upload it to the DEV post before publishing).

The video shows:

1. Source’s customer-discovery landing page.
2. Mindshare website analysis.
3. Grounded evidence review and editable service profile.
4. Explicit service-provider and external-services confirmation.
5. All four customer categories selected.
6. Northampton College’s source-linked active request with buyer, deadline, fit, source evidence, and eligibility warning.
7. Saving the opportunity and generating an editable application draft.
8. Editing and saving the draft to the account.

The footage uses a disposable account and the account was deleted after capture. It represents the supported service-provider workflow and does not claim a customer, contract, award, income, or guaranteed result.

## Code

[https://github.com/Techkeyy/source](https://github.com/Techkeyy/source)

The public deployment is [https://source-9k1o.onrender.com](https://source-9k1o.onrender.com). The Director-verified live record is commit `06bf4da64afffa4c99d74b9c46e17d3220a90520` in Render deployment `dep-db9jjv5g1s2s738v6meg`, with automatic deployment disabled. It includes the approved semantic product-discovery correction merged in `b8c27b267e82b20765be410bd281a4cabfbb0494`. The preserved immediate rollback target is the pre-correction runtime `1be26da3366c9ddbbd49018ec0cbbdab3ce8795e` in deployment `dep-db9cu2favr4c73djgm4g`. No redeployment was performed during this documentation pass.

## How I Built It

Source is a TypeScript/Next.js application with server-side ownership checks and a small number of explicit stages:

1. Fetch a public URL with SSRF protections, redirect revalidation, size limits, and content normalization.
2. Send bounded, untrusted page text to the configured DeepSeek Chat Completions integration using `deepseek-flash` and JSON-mode structured output.
3. Run profile extraction through the real Mastra workflow `source-profile-analysis`.
4. Validate grounded claims with schema checks and exact evidence matching. Unsupported ownership, pricing, past-client, and experience claims are not accepted as verified facts.
5. Let the user edit and confirm the service profile, offering type, and discovery objective.
6. Query permitted public sources and classify each record deterministically as Active Request, Potential Customer, or Research Signal.
7. Store profiles, saved opportunities, status, and editable proposal drafts in MongoDB Atlas with authenticated user ownership boundaries.
8. Host the web service on Render.

DeepSeek supplies structured candidate text; the application rules decide grounding, source eligibility, buyer classification, source restrictions, ranking, ownership, and whether a draft is allowed.

## Why Does Open Innovation Matter?

The project depends on open-source AI tooling as part of its real workflow rather than using AI as a decorative chat box. Mastra is the open-source workflow layer that wraps the grounded profile-analysis step, making the model call an explicit, inspectable stage. The structured prompt, schema validation, evidence checks, and deterministic classification remain in the repository and can be audited or changed without giving a closed model control over the product’s trust boundaries.

Source uses a hosted DeepSeek API in the verified deployment. It does not claim local inference, Gemma usage, zero-cost inference, or a specific model license. The honest open-innovation claim is the meaningful use of the open-source Mastra workflow and the ability to inspect, replace, and constrain the model step while keeping user-facing decisions deterministic.

## My Agent Session

No DevRelay session is attached to this draft. This optional section should be removed before publication unless the owner adds a genuine session link.

## Prize Categories

The following categories are the only ones supported by the repository evidence and should be entered only after the owner confirms the current challenge page still lists them:

- **Best Use of Render** — Source is hosted as a live Render web service.
- **Best Use of Mastra** — the `source-profile-analysis` workflow uses Mastra’s workflow primitives around the grounded model step.
- **Best Use of MongoDB Atlas** — Atlas is the persistent data layer for owned accounts, confirmed profiles, saved opportunities, and proposal drafts.

Do not enter Best Use of Gemma, SerpApi, Reddit, Sentry Agent Tracing, or any other category. They are not configured or meaningfully proven in this release. Category entry is a request for consideration, not a claim of sponsorship, prize eligibility, partnership, or winning.

## Honest Limitations

- Source finds public evidence-backed signals; it does not guarantee customers, contracts, income, payment, eligibility, or responses.
- A live procurement notice is an actionable public request, not a confirmed sale.
- Potential Customers are hypotheses with observed demand, not buyers.
- Research Signals can be saved for investigation but do not receive unsupported outreach drafts.
- Source does not verify the user’s location, schedule, employment status, procurement eligibility, budget, selection outcome, or availability.
- Public feeds can be stale, duplicated, closed, incomplete, or poorly labeled; the original source must be inspected before acting.
- Reddit is disabled without authorized commercial API access. SerpApi is skipped when no key is configured.
- The production-only audit found five moderate findings, including the documented transitive Mastra parser-chain risk. No forced dependency upgrade was applied under the release boundary.
- The current production identity is recorded above; the owner should retain the Render deployment record and verify the public behavior before publication. This draft does not claim guaranteed customer acquisition or successful product-owner discovery.

## Owner Checklist Before Publishing

- Confirm the participant is 18+ and otherwise eligible under the [official Week 2 rules](https://dev.to/page/hacktoberfest-week2-2026-10-12-contest-rules).
- Confirm this repository/project was started and completed during the October 12–18, 2026 challenge window. The recorded GitHub repository creation date is October 14, 2026 at 16:52 UTC, and the earliest reachable commit is October 14, 2026 at 16:10 UTC—both after the official October 12, 2026 at 12:00 PM PDT opening. This supports the date-window requirement, but the owner must still attest that no earlier private or local version existed and that the project satisfies the official brand-new-project rule.
- Confirm the post will be the team’s one Week 2 entry and that any teammates’ DEV handles are credited.
- Upload the 88-second demo video or replace the Demo section with an approved public video URL.
- Preserve the Director-verified deployed commit/deployment record and recheck the public production behavior if the post is updated after publication.
- Verify the current official challenge page, template, tags, and partner-category list immediately before publishing.
- Publish only after explicit owner authorization.
