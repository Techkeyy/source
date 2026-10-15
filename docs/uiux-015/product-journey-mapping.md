# Product journey mapping

The reconstruction maps the actual Source contract to the Evidence Desk
composition without changing protected backend routes.

| Journey stage | User question | Rendered UI | Real contract preserved | Evidence |
|---|---|---|---|---|
| Public landing | What is Source for? | Direct hero promise, original pipeline artwork, three-step story and boundaries | No API change | `landing-1440.png`, `landing-390.png` |
| Account entry | Can I start safely? | Accessible registration/sign-in card, visible errors and honest busy state | `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout` | `landing-auth-1440.png`, full-flow script |
| URL onboarding | What should I provide? | Dominant labeled URL form, public-page guidance, manual alternative | `/api/profile/analyze` | `onboarding-1440.png` |
| Invalid URL | What failed and what is safe? | Visible `role=alert`, preserved input, retry guidance | SSRF-safe server route unchanged | `url-error-1440.png` |
| Analysis loading | Is Source working? | “Reading page…” state with spinner and no success claim | Real request to profile route | `analysis-loading-1440.png` |
| Profile review | Can I trust the draft? | Identity, page evidence, grounded claims, suggestions and editable fields | `/api/profile/confirm` payload unchanged | `profile-review-1440.png` |
| Customer selection | Who should be found? | Four explicit controls: small businesses, startups, agencies, individuals | `/api/opportunities/search` receives selected categories | `customer-selection-all-1440.png` |
| Discovery | Why did this appear? | Source, classification, fit score, evidence and original-source link | Live providers and ranking unchanged | `results-1440.png` |
| Proposal | Can I adapt the outreach? | Editable proposal panel, saved-draft state, copy/original-source actions | `/api/opportunities/[id]/proposal` | `proposal-1440.png` |
| Return | Is my work still there? | Saved work rail and recovered saved opportunity/proposal | `/api/saved`, session cookie and account ownership | `saved-return-1440.png`, `recovered-opportunity-1440.png`, `logout-login-recovery-1440.png` |

## Minimum complete local slice demonstrated

The final browser run used a fresh temporary account and a real public URL,
`https://www.frog.co/`. It completed registration, invalid URL recovery, live
analysis, evidence review, profile edit, all four customer selections, live
discovery, proposal generation, save, refresh recovery and logout/login
recovery. The run returned HTTP 200 for profile analysis and opportunity search
and removed its temporary account in cleanup.

The current backend contract does not expose a profile-read endpoint. The
frontend therefore recovers saved opportunities and proposal drafts but does
not claim to restore the confirmed profile editor after a fresh session. This
boundary is recorded in `known-limitations.md` and requires separate backend
approval if the director wants that acceptance criterion closed.
