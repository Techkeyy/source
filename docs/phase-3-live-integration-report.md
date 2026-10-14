# Source Phase 3 Live Integration Report

Date: 2026-10-14 (Africa/Lagos)

Status: **BLOCKED AT OWNER-CONTROLLED INFRASTRUCTURE GATE**

Directive 004 authorized live integration and end-to-end acceptance. No new
feature development was started in this pass. The existing implementation was
inspected and the first unavailable critical dependency was checked.

## Infrastructure inspection

The following names were checked without reading or printing values:

- `GOOGLE_API_KEY`
- `GEMINI_API_KEY`
- `GEMMA_API_KEY`
- `GEMMA_MODEL`
- `MONGODB_URI`
- `MONGODB_DB`
- `SESSION_SECRET`
- `SERPAPI_KEY`
- `SENTRY_DSN`

Observed state:

- No required or optional integration variables were present in the process
  environment.
- `C:\Users\HomePC\Desktop\source\.env.local` does not exist.
- [`.env.example`](../.env.example) exists and contains placeholders only.
- A 48-byte cryptographically random ephemeral session-secret candidate was
  generated locally. Its value was not printed, committed, or persisted because
  no owner-authorized Atlas or model configuration is present.

## Gemma result

No live request was attempted because there is no owner-provided model key. The
application path is implemented in `src/lib/gemma.ts` and uses the configured
server-only key with the default model `gemma-4-26b-a4b-it`. The correct evidence
needed next is a real response status, model identity, latency, structured
profile output, and unsupported-claim validation against one real public URL.

Current status: **IMPLEMENTED, INTEGRATION UNPROVEN**.

## MongoDB Atlas result

No connection attempt was possible because `MONGODB_URI` and `MONGODB_DB` are
absent. The application has user-scoped filters, index creation, save, reload,
and proposal persistence code, but no Atlas record was created or deleted.

Current status: **IMPLEMENTED, INTEGRATION UNPROVEN**.

## Browser result

The browser automation connector was attempted and failed before opening a page:

`failed to write kernel assets: The system cannot find the path specified`

The previous local production server was stopped. HTTP smoke evidence remains:

- `GET /` returned HTTP 200.
- `GET /api/auth/me` returned `{"user":null}`.
- Unauthenticated `POST /api/profile/analyze` returned HTTP 401.

These are not browser acceptance evidence. Normal registration, profile
analysis, discovery, save, proposal, refresh, logout, and recovery remain
unrun.

## Security audit

Passed in the current code and tests:

- SSRF tests reject loopback, private IPv4, metadata, credentials, and unsafe
  ports.
- Session and ownership checks are server-side.
- External HTML is rendered as text, not injected as markup.
- No credential-shaped strings were found in Source files outside ignored
  dependencies and build output.

The required npm audit was attempted first in the restricted environment and
then completed against the official npm audit endpoint with approved network
access. Production dependencies report five moderate vulnerabilities through
the Mastra dependency chain (`sprintf-js` via `argparse`, `js-yaml`, and
`gray-matter`). npm recommends `npm audit fix --force`, which would downgrade
Mastra and introduce a breaking change. It was not run. This is an open release
blocker requiring an owner decision or a compatible dependency update.

## Owner-executable acceptance procedure

1. Create `C:\Users\HomePC\Desktop\source\.env.local` from `.env.example`.
2. Add a least-privilege MongoDB Atlas URI, database name, a random
   `SESSION_SECRET` of at least 32 characters, and an owner-approved Google API
   key. Do not paste values into chat or commit them.
3. Confirm Atlas network access allows the development or Render host and that
   the database user can read and write only the Source database.
4. Run `npm run start -- -p 3000` from the Source directory.
5. Open `http://localhost:3000` in a normal browser.
6. Register account A through the visible form.
7. Paste a real public HTTPS project or business URL and analyze it.
8. Record the actual model name, response status, latency, and evidence-backed
   profile. Check that unsupported fields remain unsupported or marked as
   inference.
9. Edit and confirm the profile.
10. Select each customer category in separate searches and preserve the visible
    query, ranking, classification, or explanation change.
11. Run service-provider discovery and inspect at least one canonical source
    URL, published timestamp, classification, profile overlap, and category
    explanation.
12. Record at least one false match or excluded permanent/stale result.
13. Save a result, draft and edit a proposal, refresh, log out, log back in,
    and confirm the saved record and proposal recover.
14. Register account B and attempt both a direct read and a direct write against
    account A's saved opportunity id. Both must be refused.
15. Test invalid credentials, logout, unsafe URLs, failed website fetch,
    failed model request, failed discovery provider, repeated save, and a
    refresh during a pending request.
16. Only after local acceptance passes, deploy the exact build to Render and
    repeat the same journey against the public URL.

## Exact blocker

Owner intervention is required for the model key, Atlas connection and Render
account. Until those values are configured, Source must remain classified as
**BUILDING, CORE PATH NOT YET PROVEN**.
