# Source Sponsor and Category Strategy

Date: 2026-10-13 (Africa/Lagos)

Status: category research and proposed qualification plan. No category has
been claimed, and no partner integration has been implemented.

## Strategy

Use the smallest set of technologies that make Source more useful and more
credible. A partner is CORE only when Source needs the capability in its
normal user journey and can show the integration in the deployed product.
An integration that is only a badge, logo, or write-up mention is not enough.

## Matrix

| Sponsor or category | Proposed Source integration | Why Source needs it | Official eligibility requirement researched | Complexity | Verification method | Decision |
|---|---|---|---|---|---|---|
| Gemma | Use an open-weight Gemma model for evidence-bounded profile extraction, keyword suggestions, match explanations, and proposal drafting | The challenge requires open-weight/open-source AI as the product core; Gemma can make the central extraction workflow inspectable and aligned with the product promise | Use a Google Gemma open-weight model locally, fine-tune it, or serve it through a cloud or other provider according to the challenge category | Medium to high; depends on inference route and output quality | Show the deployed profile-analysis path, model configuration, structured-output validation, and before/after evidence in the write-up | CORE |
| MongoDB Atlas | Persist accounts, profile versions, evidence spans, category preferences, opportunities, saves, and proposal drafts; evaluate Vector Search only if it improves evidence retrieval | Source requires real multiuser persistence and refresh recovery | Use Atlas as the data layer, Vector Search, long-term agent memory, or the database behind the open-weight application | Medium | Demonstrate two-user isolation, persisted saves, and Atlas-backed records in a real run | CORE |
| Render | Deploy the Source web service and backend with a public URL and health check | The acceptance test needs a publicly reachable application; Render also has a direct featured category | Use Render as AI runtime, host an agent frontend, or run the qualifying agent path described by the live challenge | Low to medium | Public deployment link, deployment configuration, health endpoint, and browser-to-backend proof | CORE |
| Node.js | Runtime for server, adapters, fetch controls, and web application | Best fit for a TypeScript-first product and current ecosystem | Not a prize partner category; runtime choice must still be compatible with deployment and dependencies | Low | Pin Node 24 LTS and pass typecheck, smoke, and deployment checks | CORE foundation |
| TypeScript | Strict types for normalized source records, evidence, profile schema, and ownership boundaries | Reduces ambiguity at the security and persistence boundaries | Not a prize partner category; use a maintained version and lockfile | Low | Compiler and test evidence | CORE foundation |
| Mastra | Optional bounded workflow for extracting a profile, calling permitted source tools, and explaining matches | Could reduce orchestration code and qualify for its category if it materially runs the workflow | Orchestrate an agent over open models, memory/tools, or a workflow such as issue triage according to the live category | Medium | A traceable Mastra workflow in the deployed product, with tools and outputs visible and bounded | OPTIONAL / HOLD |
| SerpApi | Optional Google Jobs search adapter for broader fresh coverage | It could materially expand opportunity coverage after a credential is available | Use SerpApi for live web search, fresh RAG, or news tracking | Low to medium, but credential and usage cost | Valid API response, query logging without secrets, attribution and quota monitoring | OPTIONAL / HOLD |
| Sentry Agent Tracing | Trace extraction/search latency and failures after a real flow exists | Helps diagnose model and source performance; not a substitute for product evidence | Show agent setup/performance, debug, and include traces or screenshots in the write-up | Low to medium | Redacted trace or dashboard evidence from the deployed flow | OPTIONAL / HOLD |
| Backboard | Memory/RAG assistant or R-CLI path | Not required for the core Source journey and could duplicate MongoDB | Must satisfy the specific live category mechanism | Medium | Only pursue if a real workflow needs it | REJECTED for initial release |
| ElevenLabs | Audio narration or voice input | Not needed for URL-first discovery and would distract from evidence UX | Voice, transcription, or qualifying demo narration | Medium | Would require a real voice feature and additional UAT | REJECTED for initial release |
| Entire | Agent-session sharing or historical search | No need in the first Source journey | Share or search agent work | Medium | Would require a separate session product | REJECTED for initial release |
| GitHub Copilot | Coding-agent or GitHub Actions workflow | Development aid is not a user-facing Source capability | Use the qualifying GitHub Copilot mechanism in the challenge | Low to medium | Only claim if the qualifying product integration is visible and permitted | REJECTED for initial release |
| TabPFN | Forecast, classification, or anomaly model for opportunities | Not needed for the first evidence-backed ranking path | Use TabPFN for a qualifying tabular prediction task | High and unjustified | Would need a real prediction task, evaluation set, and current license path | REJECTED |
| Tinker | Fine-tune an open model for Source | Fine-tuning is not required to establish a reliable first release | Fine-tune for a specific task and show improvement in performance, latency, or cost | High | Need reproducible baseline and improvement evidence | REJECTED for Phase 0 |
| Arduino | Hardware agent or UNO Q integration | Unrelated to the core web product | Use the specified hardware or Qualcomm AI Hub path | Very high and irrelevant | Hardware demo and category-specific proof | REJECTED |
| DigitalOcean | GPU Droplet or Gradient AI Platform hosting | Render plus a modest hosted model path is simpler until inference is verified | Deploy on DigitalOcean and use the qualifying open-weight AI path | Medium to high | Public deployment and AI runtime proof | REJECTED for initial release |
| .tech | Register and use a .tech domain | A domain does not improve discovery, trust evidence, or persistence | Claim the free domain through the challenge path and link it in the write-up; renewal is paid after the first year | Low but external account dependency | Live domain and account evidence | REJECTED unless owner explicitly wants the domain |
| Temporal | Durable workflow for extraction and refresh | Useful later for retries and long-running work, but not needed before a simple request path is proven | Use a durable workflow that survives failures, retries, and resumes | High | Failure-injection and resume evidence | REJECTED for initial release |
| Tiger Data | pgvector, hybrid search, or MCP | Duplicates the selected MongoDB persistence path | Use the qualifying Tiger Data mechanism | Medium to high | Real vector/hybrid workflow and database evidence | REJECTED |

## Recommended qualification set

The target is four credible categories at most:

1. Gemma: central open-weight model capability.
2. MongoDB Atlas: actual persistent user data and source-backed records.
3. Render: actual public deployment and runtime.
4. Optionally Mastra, SerpApi, or Sentry, but only one or two after they
   improve the real product and have direct evidence.

The implementation must not contort Source to collect categories. If a
technology adds complexity without improving the complete user journey, it
stays REJECTED.

## Credential and account constraints

The following environment variables were not present during Phase 0:

- SERPAPI_API_KEY
- MONGODB_URI
- SENTRY_DSN
- GOOGLE_API_KEY
- GEMMA_API_KEY
- RENDER_API_KEY
- MASTRA_API_KEY

This is not a failure; it means integrations that require them are not yet
proven. Credentials must be supplied through local secret storage or deployment
environment settings and never committed or exposed to the browser.

## Directive 002 reclassification

The owner wants to compete in multiple legitimate $100 categories. The
following classification balances that goal with evidence:

| Category | Classification | Meaningful role in Source | Proof required before entry |
|---|---|---|---|
| Gemma | CORE | Open-weight extraction and grounded proposal language are central to the product promise and the open-AI challenge requirement | A real Gemma call on the tested URLs, structured output validation, evidence spans, latency, and failure behavior |
| MongoDB Atlas | CORE | User accounts, confirmed profiles, opportunities, saves, and proposals require durable user-scoped data | Two-user isolation, save/reload, and database-backed browser path |
| Render | CORE | The required public user journey needs a public runtime | Public deployment, health check, environment configuration, and browser proof |
| Mastra | LOW-COST OPPORTUNITY | A real multi-step workflow over Gemma and controlled source tools could make orchestration traceable | Mastra workflow visibly runs in the product and is not a one-call label |
| SerpApi | LOW-COST OPPORTUNITY | Live web or Google Jobs search could expand fresh coverage after public feeds are evaluated | Owner-approved key, quota, source attribution, successful live response, and cost guard |
| Sentry Agent Tracing | LOW-COST OPPORTUNITY | Redacted latency, token, cost, and failure traces can improve the real AI workflow | Real deployed trace or screenshot, with page content and credentials excluded |
| Entire | LOW-COST OPPORTUNITY | An authentic development-session artifact can document how the agent-assisted work was produced | Actual Entire session evidence linked in the write-up; no fabricated session |
| ElevenLabs | LOW-COST OPPORTUNITY | Optional demo narration can make the product understandable without changing discovery behavior | Real narration or useful voice feature; do not claim product value from a logo |
| .tech Domain | CONDITIONAL | A public domain may improve demo presentation but is not required for Source functionality | Owner claims the free domain and explicitly approves renewal exposure |
| Temporal | CONDITIONAL | Durable retry/resume could matter only if real analysis jobs exceed the simple request path | Failure-injection evidence showing resume value |
| Backboard | CONDITIONAL | Memory or model comparison could be useful only if Atlas plus Gemma leave a verified gap | Real user-facing memory/RAG need and authenticated integration |
| GitHub Copilot | CONDITIONAL | Only relevant if the owner actually uses a qualifying Copilot coding tool or workflow | Verifiable Copilot use; development assistance alone is not Source functionality |
| TabPFN | REJECTED | No justified historical tabular prediction problem in the core journey | Would require a new prediction problem and evaluation set |
| Tinker | REJECTED | No justified fine-tuning dataset or baseline yet | Would require measured improvement over a baseline |
| Arduino | REJECTED | No hardware requirement in URL-first web discovery | Would require a separate physical product |
| DigitalOcean | REJECTED | Render is the simpler public runtime and local Gemma hardware is unverified | Would require a justified GPU-hosting need |
| Tiger Data | REJECTED | Duplicates the selected Atlas persistence path | Would require a real hybrid-search need that Atlas cannot cover |

No paid service, recurring-cost domain, or optional category is activated by
this document. LOW-COST OPPORTUNITY still means conditional on real use and
proof, not permission to spend.
