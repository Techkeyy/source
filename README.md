# Source

Source is an AI-assisted opportunity discovery product for freelancers and
small independent businesses. A user can start with a public project URL, review
the profile Source extracts from that site, choose the kinds of customers they
want to work with, and search permitted sources for relevant opportunities.

## Current status

Directive 003 authorized the minimum complete application build. The first
vertical implementation is present and passes typecheck, lint, security unit
tests, UI copy audit, and a production build. It has not yet passed normal
browser UAT, MongoDB persistence UAT, a real Gemma inference call, or public
deployment. It is not submission-ready.

The current authoritative status is **BUILDING, CORE PATH NOT YET PROVEN**.
The application deliberately reports missing server credentials instead of
substituting fixtures.

The current Core Outcome is:

> Source is only genuinely working when a fresh signed-in user can submit a
> public project URL, review and confirm a citation-backed profile, choose one
> or more customer categories, run a real permitted source query, receive
> source-linked matches with an evidence-based explanation, save one result, and
> reload it later without operator intervention.

## Local development

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Required server values are `MONGODB_URI`, `MONGODB_DB`, `SESSION_SECRET`, and
one approved inference route. `INFERENCE_PROVIDER=gemma` uses one of
`GOOGLE_API_KEY`, `GEMINI_API_KEY`, or `GEMMA_API_KEY` against Google's Gemma
REST API. `INFERENCE_PROVIDER=openrouter-gemma` uses the standard OpenRouter
endpoint with `OPENROUTER_API_KEY` and the explicitly configured model id. The
initial activation value is `google/gemma-4-26b-a4b-it:free`; Source does not
silently substitute the paid model when `OPENROUTER_MODEL` is missing.
`INFERENCE_PROVIDER=deepseek` uses
`DEEPSEEK_API_KEY`, `https://api.deepseek.com`, model `deepseek-flash`, and
JSON output mode. Every route uses the same Source schema and evidence checks;
there is no automatic provider switch and no browser-visible key. Optional
`SERPAPI_KEY` enables broader Google Jobs discovery. Keys stay server-side.

Verification commands:

```powershell
npm run typecheck
npm run lint
npm run test
npm run audit:ui
npm run build
```

Live-service probes, after the corresponding owner configuration is available:

- npm run probe:mongodb
- npm run probe:gemma -- https://your-public-project.example
- npm run probe:discovery
- npm run probe:ownership

The probes print redacted health or count evidence. The ownership probe needs
a running Source server and removes its generated test accounts after the run.
They do not replace normal-browser acceptance or deployed UAT.

## Handoff

- Project director handoff: director.md
- Phase 0 report: docs/phase-0-report.md
- Phase 1 and Phase 2 feasibility report: docs/phase-2-feasibility-report.md
- Product contract: docs/product-contract.md
- Evidence-first schedule: docs/project-schedule.md
- Hackathon checklist: docs/hackathon-checklist.md
- Technical and security research: docs/technical-research.md
- Opportunity source evaluation: docs/source-evaluation.md
- Sponsor strategy: docs/sponsor-strategy.md
- Skills applied: docs/skills-applied.md
- Deployment preparation: docs/deployment.md
- Manual acceptance fallback: docs/manual-acceptance.md
- Directive 005 dependency review: docs/security-audit-005.md
- Research source register: evidence/research-sources.md
- Live source probe evidence: evidence/source-probes-2026-10-13.md
- Local environment evidence: evidence/environment-2026-10-13.md
- Isolated feasibility scripts and results: feasibility/

The replacement director must read director.md first and treat its provenance
labels and acceptance gates as authoritative for the next phase.

