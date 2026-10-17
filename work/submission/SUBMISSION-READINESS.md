# Source — Submission Readiness

Prepared: 2026-10-17

Status: **Draft prepared; not published.**

## Required links

- Public application: [https://source-9k1o.onrender.com](https://source-9k1o.onrender.com)
- GitHub repository: [https://github.com/Techkeyy/source](https://github.com/Techkeyy/source)
- Director-verified live Render commit: `06bf4da64afffa4c99d74b9c46e17d3220a90520` — deployment `dep-db9jjv5g1s2s738v6meg`; automatic deployment disabled
- Preserved immediate rollback target: `1be26da3366c9ddbbd49018ec0cbbdab3ce8795e` — deployment `dep-db9cu2favr4c73djgm4g`
- Official Week 2 announcement: [DEV Team announcement](https://dev.to/devteam/join-the-hacktoberfest-open-source-ai-challenge-side-hustle-2550-prizes-across-18-winners-55ba)
- Official Week 2 rules: [Contest rules](https://dev.to/page/hacktoberfest-week2-2026-10-12-contest-rules)
- Official challenge hub: [HF26 DEV Challenge Hub](https://dev.to/challenges/hf26)
- Official submission template: [DEV Week 2 template](https://dev.to/new?prefill=---%0Atitle%3A+%0Apublished%3A+%0Atags%3A+devchallenge%2C+hf26challenge%0A---)
- Verified procurement evidence: [Northampton College Contracts Finder notice](https://www.contractsfinder.service.gov.uk/Notice/d2301388-4ca6-48fc-805d-eb2e5793377e)
- Verified profile source: [Mindshare services](https://www.mindshareworld.com/services)

## Prepared local artifacts

- Submission draft: `DEV-WEEK-2-SIDE-HUSTLE-DRAFT.md`
- Demo video: `source-demo-88s.mp4` — 88 seconds, 1440×900, genuine browser footage
- Raw recording: `raw-video/page@bfef2c4c55e24c150da8491e91e067ff.webm` — 101.2 seconds, retained for audit
- Capture script: `capture-demo.mjs`
- Landing frame: `01-landing.png`
- Grounded profile: `02-grounded-profile.png`
- Confirmed service profile: `03-confirmed-service-profile.png`
- Live active-request card: `04-live-active-request-card.png`
- Discovery results: `05-discovery-results.png`
- Proposal draft: `06-proposal-draft.png`
- Saved proposal: `07-saved-proposal.png`

## Evidence ledger

| Claim | Evidence | Safe wording |
|---|---|---|
| Service-business customer finder | Current landing copy, README, and normal Mindshare flow | Source helps service businesses investigate evidence-backed customer signals |
| Real buyer-quality example | Live Northampton College notice | An active public procurement request was surfaced; it is not a guaranteed customer |
| DeepSeek | `src/lib/gemma.ts`, runtime acceptance records | DeepSeek `deepseek-flash` is the active hosted profile-analysis provider |
| Mastra | `src/lib/profile-workflow.ts` | Mastra wraps the grounded profile-analysis workflow |
| MongoDB Atlas | `src/lib/db.ts`, persistence/ownership probes | Atlas persists user-owned profiles, opportunities, and proposal drafts |
| Render | `render.yaml`, public service URL, Director-verified deployment `dep-db9jjv5g1s2s738v6meg` at `06bf4da64afffa4c99d74b9c46e17d3220a90520` | Render hosts the public web service; automatic deployment is disabled |
| Open-source AI | Mastra workflow is used in the product path; hosted DeepSeek is the model provider | Claim meaningful open-source workflow tooling; do not claim local/open-weight inference or Gemma, and obtain owner confirmation that the architecture satisfies the challenge-wide model requirement |
| Reach/product-owner discovery | Negative gate evidence only | Product-owner discovery is experimental and must not be presented as a customer-acquisition success |
| First user or paid customer | No verified evidence supplied | Omit the My First User section |

## Sponsor-category recommendation

Recommend asking for consideration only in:

- Best Use of Render
- Best Use of Mastra
- Best Use of MongoDB Atlas

These are technology-use categories, not confirmed eligibility or prize claims. Do not enter Gemma, SerpApi, Reddit, Sentry Agent Tracing, or any category without new evidence and explicit approval.

## Blocking owner checks

1. **Eligibility date window:** GitHub reports repository creation at `2026-10-14T16:52:11Z`; the earliest reachable commit is `568feaf49cc323ce2ee6fe64ca956c61a218f7bc` at `2026-10-14T17:10:27+01:00` (16:10:27 UTC). Both are after the official opening, October 12, 2026 at 12:00 PM PDT (19:00 UTC). The date-window evidence passes, subject to the owner’s attestation that no earlier private or local project existed and the official brand-new-project rule is satisfied.
2. **AI requirement:** production uses hosted DeepSeek and open-source Mastra orchestration. The repository supports a meaningful open-source tooling claim, but the owner must confirm that this architecture satisfies the challenge-wide open-weight/open-source AI requirement; no local/open-weight inference or model-license claim is made.
3. **Production revision:** the Director directly verified the live Render record as commit `06bf4da64afffa4c99d74b9c46e17d3220a90520`, deployment `dep-db9jjv5g1s2s738v6meg`, with automatic deployment disabled. It includes the approved semantic product-discovery correction; no redeployment is required for this documentation pass.
4. **Publication:** the DEV post, video upload, and any external submission are still pending explicit owner authorization.

## Final publishing sequence

1. Owner confirms the date-window evidence, the no-earlier-project attestation, and the one-entry/team-credit requirements.
2. Owner confirms the hosted DeepSeek/open-source Mastra architecture satisfies the official AI requirement.
3. Owner accepts the Director-verified Render revision and confirms that the public behavior shown in the demo remains accurate.
4. Owner uploads `source-demo-88s.mp4` or supplies an approved public video URL.
5. Owner reviews the draft against the current official template and categories.
6. Owner publishes exactly one DEV post with `#devchallenge` and `#hf26challenge`.
