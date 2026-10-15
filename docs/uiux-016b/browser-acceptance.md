# Directive 016B browser acceptance evidence

Run date: 2026-10-15 (Africa/Lagos)

## Environment

- Application: `http://localhost:3000/`
- Browser: local Chromium-compatible Google Chrome executable
  `C:\Program Files\Google\Chrome\Application\chrome.exe`
- Automation: Playwright package used from an isolated temporary npm cache;
  no application dependency or lockfile was changed.
- Test accounts: generated `example.test` accounts only; each run deleted its
  generated account and owned records after completion.
- External source: `https://www.frog.co/`

## Desktop run

The real browser flow passed at 1440px:

`landing -> registration -> URL onboarding -> invalid-URL recovery -> live
analysis -> grounded profile review -> profile edit -> customer selection ->
live discovery -> proposal generation -> refresh recovery -> logout/login
recovery`

Observed response evidence:

- Profile analysis HTTP 200.
- Discovery HTTP 200.
- Grounded evidence tray visible.
- Profile editor visible.
- Entered invalid URL preserved after the visible error.
- Proposal generated, saved opportunity recovered after refresh, and saved
  work recovered after logout/login.
- Cleanup deleted one generated test account.

## Mobile run

The same real browser flow passed at 390px. The run captured the mobile
profile-review, customer-selection, discovery-results, proposal-editor,
saved-return and logout/login-recovery screens. The landing sweep also
captured 320px, 390px, 768px, 1280px and 1440px widths.

Visual inspection of the 390px profile and proposal captures found no
horizontal overflow, clipped primary actions, or loss of the evidence and
save-state boundaries. The proposal editor remained readable and exposed the
explicit `Save draft` control.

## Stored captures

- Desktop captures: `docs/uiux-016b/source-screenshots/`
- Mobile captures: `docs/uiux-016b/mobile-screenshots/`
- Bootstrap diagnostic: `docs/uiux-016b/bootstrap-inspection.png`

The initial diagnostic also established that the canonical `localhost` origin
hydrates the client correctly. A `127.0.0.1` origin stayed on the server-side
`Opening Source...` shell because the Next development origin policy blocked
its HMR/client path; this was an environment/origin issue, not the product
origin used by the acceptance run.

## Release boundary

This is local browser evidence only. Production was not changed, the branch
was not merged, and no deployment was performed.
