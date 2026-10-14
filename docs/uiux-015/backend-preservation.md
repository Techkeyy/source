# Protected backend preservation evidence

Directive 015 explicitly froze backend behavior. The active branch was created
from `70f8042` and the reconstruction changed only the two frontend source
files, the two local browser evidence scripts and this evidence folder.

## Protected contracts exercised, not redesigned

- `/api/auth/me`
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/profile/analyze`
- `/api/profile/confirm`
- `/api/opportunities/search`
- `/api/opportunities/save`
- `/api/opportunities/[id]/proposal`
- `/api/saved`

## Evidence

- TypeScript typecheck passed after the frontend changes.
- The browser run created a fresh account, received live profile analysis HTTP
  200 from `https://www.frog.co/`, confirmed the profile, selected all four
  categories, received discovery HTTP 200, generated a proposal, saved it,
  refreshed, logged out, logged in again and recovered saved work.
- Temporary browser accounts were deleted by exact email prefix in cleanup.
- `npm run probe:mongodb` passed ping, insert, read, delete and cleanup.
- `npm run probe:ownership` passed separate registrations, owner save,
  cross-account denial and saved-list isolation; two temporary accounts were
  deleted.
- `npm run probe:gemma -- https://www.frog.co/` passed with DeepSeek
  `deepseek-flash`, source HTTP 200, inference HTTP 200, one JSON object and
  five grounded claims. The response metadata was redacted of credentials.
- `git diff --name-only 70f8042..80e8f248e767d0c625f4c1c5c18e732f74ce8f83`
  returned 48 expected paths: the director handoff, `docs/uiux-015/`, the two
  browser scripts, `src/app/globals.css` and
  `src/components/SourceApp.tsx`. No protected backend path appeared.

## Explicit non-change

The lack of a profile-read endpoint and proposal-edit persistence is not
silently worked around in the UI. Those are documented dependencies in
`known-limitations.md` and require a separately approved backend phase.
