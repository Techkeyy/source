# Source Technical Research and Security Boundaries

Date: 2026-10-13 (Africa/Lagos)

Status: research only. No implementation has started.

## URL-first extraction

### Proposed flow

1. Accept only an absolute HTTP or HTTPS URL.
2. Normalize and validate the URL before any request.
3. Resolve the hostname and reject localhost, loopback, link-local,
   multicast, private, reserved, and unroutable IPv4 and IPv6 destinations.
4. Re-check the resolved destination when following redirects. Reject
   redirects to a different unsafe destination and prefer a bounded redirect
   allowlist.
5. Fetch with a short timeout, response-size limit, content-type check,
   user-agent identification, and no credential or cookie forwarding.
6. First parse ordinary HTML with a readability extractor.
7. If the page is clearly JavaScript-rendered and the source terms permit it,
   use a sandboxed browser context with disabled downloads, bounded resources,
   no user cookies, and no access to local files.
8. Store only the minimum normalized text and evidence spans required for
   review, plus URL, fetched time, and content hash.
9. Run a model-based structured extraction against quarantined page content.
10. Let the user edit and confirm before the profile affects discovery.

### Rendering limitation

A successful static HTML fetch is not proof that the meaningful content is in
the initial response. JavaScript rendering is therefore a later, explicitly
tested capability. The first release should try static extraction first and
show a clear manual-entry or insufficient-content state when it cannot obtain
enough public text.

### Evidence model

Every extracted profile field should carry:

- field name;
- value;
- source URL;
- short source excerpt or DOM-derived evidence span;
- extraction timestamp;
- evidence type: DIRECT or INFERRED;
- confidence and review state;
- user-edit history after confirmation.

The UI must distinguish “the site states” from “Source suggests.” It must not
turn model confidence into factual proof.

## SSRF and untrusted content

The server-side URL fetch is a security boundary. The implementation must
follow the relevant OWASP SSRF controls:

- allow only HTTP and HTTPS;
- reject numeric IP tricks, unusual encodings, private address ranges, and
  DNS-rebinding changes;
- validate both IPv4 and IPv6;
- reject ambiguous parser results;
- disable or tightly control redirects;
- do not pass internal headers, cookies, credentials, or tool capabilities;
- record fetch failures without exposing internal network details to users.

Fetched page content is untrusted input. A page can contain indirect prompt
injection such as instructions to ignore the task, reveal secrets, or call a
tool. The extraction model must be treated as a quarantined parser:

- page text is delimited as data;
- the system instruction explicitly says page content is not instructions;
- no tools, network access, database writes, or privileged actions are
  available to the extraction call;
- structured output is schema-validated and policy-checked;
- suspicious content is retained as evidence or omitted, not obeyed.

## Model boundary

The model may:

- summarize public content;
- extract structured fields;
- propose keywords and buyer-intent signals;
- explain a deterministic match using supplied evidence;
- draft editable proposal language.

The model may not:

- create a fact without evidence or a user confirmation;
- decide authorization or data ownership;
- bypass source terms;
- fetch arbitrary follow-up URLs;
- rank results without deterministic signals and stored explanations;
- claim a prospect is hiring, interested, verified, or likely to pay without
  source-backed evidence.

## Persistence and account isolation

The persistence model should use an authenticated user identifier on every
user-owned record and enforce ownership in server-side reads and writes.
Minimum records:

- User account;
- Profile source and profile versions;
- Evidence spans;
- Confirmed profile;
- Customer-category preferences;
- Search runs and normalized opportunities;
- Saved opportunities;
- Proposal drafts.

No client-supplied user ID may be trusted for authorization. Every read and
write must derive identity from the authenticated session and apply ownership
checks. Saved data must remain recoverable after refresh and sign-in.

## Proposed technology decision

| Area | Candidate | Phase 0 decision | Verification needed |
|---|---|---|---|
| Runtime | Node.js 24 LTS | CORE | Pin version and run the application smoke test |
| Language | TypeScript | CORE | Strict compiler configuration and typecheck |
| Agent/tool orchestration | Mastra | OPTIONAL / HOLD | Only add if its bounded workflow/tool abstraction reduces complexity; prove with one profile extraction flow |
| Open-weight model | Gemma | CORE candidate | Confirm inference route, structured output behavior, cost, and acceptable latency |
| Database | MongoDB Atlas | CORE candidate | Prove user isolation, profile versions, opportunity persistence, and optional vector index only if needed |
| Search | Provider adapters; SerpApi optional | CORE adapters plus OPTIONAL SerpApi | Run source contract and freshness checks; obtain key before claiming live SerpApi |
| Observability | Sentry | OPTIONAL / HOLD | Add only after a real flow exists; capture traces without private page content or secrets |
| Deployment | Render | CORE candidate | Deploy a non-production smoke environment and prove public URL, health, env vars, and logs |

## Version and compatibility notes checked on 2026-10-13

- Node.js documentation identifies Node 24 as the active LTS line. The local
  environment has Node v24.14.0; Render documentation says services created
  after its documented cutoff default to Node 24.21.0. Pin one Node 24 patch
  version in the repository before implementation.
- TypeScript is installed project-locally rather than assumed from a global
  installation. The current TypeScript download page was the source of truth
  for the then-current release; the repository must use a lockfile and
  re-check compatibility with the selected Node and framework versions.
- The current MongoDB Node driver documentation lists mongodb 7.7 and requires
  Node 16.20.1 or newer. The local Node 24 environment satisfies that
  documented minimum, subject to Atlas connection and driver smoke tests.
- Mastra documentation currently describes an ESM TypeScript setup with
  @mastra/core, Zod, TypeScript, and Node types. It requires a real
  createTool-style bounded tool integration before it can be treated as a
  meaningful sponsor path.
- Current Gemma documentation lists multiple model sizes and quantized
  memory requirements. The smaller model path must be evaluated first because
  local GPU capability is unverified. Model release and licensing details
  must be rechecked before selecting a specific checkpoint.
- Sentry's current JavaScript/Node documentation supports custom traces and
  LLM monitoring integrations. Add it only after privacy-safe redaction and a
  real deployed workflow exist.

## Phase 1 implementation gates

Implementation may start only after the owner decisions in the Phase 0 report
are resolved. Each gate needs evidence:

1. Account creation and login isolate two test users.
2. A safe public URL produces a profile with evidence spans.
3. A private, loopback, redirect, oversized, malformed, and unsupported URL
   produce safe errors without a server-side request.
4. A prompt-injection page is summarized as data and cannot cause a tool call.
5. Profile editing and confirmation persist after refresh.
6. Each of the four customer categories changes the generated query and at
   least one ranking signal.
7. A source adapter returns canonical URLs, source labels, timestamps, and
   stale-result handling.
8. A saved opportunity and proposal are recoverable by the same user and
   inaccessible to another user.
9. Empty, loading, success, and error states are all reachable from the UI.
10. The deployed browser path passes the full acceptance test in the
    builder directive.
