# Directive 015 regression results

## Reference audit

Command:

```powershell
$auditNodeModules = Join-Path $env:TEMP 'source-ui-audit\node_modules'
$env:NODE_PATH = $auditNodeModules
node scripts\uiux-015-reference-audit.mjs
```

Result: **PASS**. The reference opened in real Chromium, captured all required
widths, produced hover/focus/sign-up captures and reported no horizontal
overflow at 320, 390, 768, 1280 or 1440px.

## Local Source journey

Command:

```powershell
$auditNodeModules = Join-Path $env:TEMP 'source-ui-audit\node_modules'
$env:NODE_PATH = $auditNodeModules
node scripts\uiux-015-after.mjs
```

Result: **PASS**.

```json
{
  "status": "pass",
  "stages": [
    "landing", "account", "onboarding", "url-error", "analysis-loading",
    "live-analysis", "profile-edit", "customer-selection", "discovery",
    "proposal", "refresh-recovery", "logout-login-recovery"
  ],
  "profileAnalysisHttpStatus": 200,
  "discoveryHttpStatus": 200,
  "evidenceVisible": true,
  "editorVisible": true,
  "errorInputPreserved": true,
  "savedAndDrafted": true,
  "sourceUrl": "https://www.frog.co/"
}
```

Cleanup result: `{"cleanup":"pass","deletedTestAccounts":1}`.

## Typecheck

`npm run typecheck` passed with `tsc --noEmit --incremental false`.

## Quality gates and protected-path probes

- `npm run lint`: **PASS**, ESLint exit code 0.
- `npm test -- --run`: **PASS**, 2 test files and 8 tests passed.
- `npm run build`: **PASS**, Next.js 16.4.0 compiled and generated all 12
  routes.
- `npm run probe:mongodb`: **PASS**, ping/insert/read/delete/cleanup all true.
- `npm run probe:ownership`: **PASS**, separate registrations, owner save,
  cross-account denial and saved-list isolation all true; two temporary test
  accounts deleted.
- `npm run probe:gemma -- https://www.frog.co/`: **PASS** using the existing
  DeepSeek path, provider `deepseek`, model `deepseek-flash`, source fetch HTTP
  200, inference HTTP 200, 5 claims and 5 grounded claims, one JSON object,
  finish reason `stop`. No credential was printed.

## Remaining gates

Owner-led visual review, any manual accessibility pass beyond the direct
checks, and explicit approval for merge/production release remain outstanding.
