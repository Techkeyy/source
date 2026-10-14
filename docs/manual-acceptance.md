# Source manual acceptance procedure

This is the fallback procedure when automated browser control is unavailable. It is an owner or reviewer procedure, not evidence that the journey has already passed.

## Preconditions

1. Start Source with npm run dev or npm run build followed by npm run start.
2. Confirm GET / returns the Source application.
3. Confirm MongoDB Atlas is reachable and GOOGLE_API_KEY is configured.
4. Use a real, publicly accessible project or portfolio URL that does not require a password.
5. Capture the public URL, timestamp, account email alias, and the source links shown in the UI. Never capture passwords or API keys.

## Required journey

1. Open Source in a browser.
2. Create a new account using a reviewer-controlled email alias and a password with at least 12 characters.
3. Paste the real public website URL into URL-first onboarding.
4. Run Analyze.
5. Verify the result includes a business or project name, summary, supported services or skills, citations or evidence excerpts, and explicit inference notes where applicable.
6. Edit at least one generated field and confirm the profile.
7. Select one or more of:
   - Small businesses
   - Startups
   - Agencies
   - Individuals
8. Run Find opportunities.
9. Verify the result list contains source URLs, freshness information or dates, classification, matching explanation, and a warning where buying intent is unconfirmed.
10. Change the selected customer category and search again. Record that the query policy and/or ranking explanation changes with the selection.
11. Save one source-linked result.
12. Refresh the page or sign out and sign back in.
13. Verify the saved result and editable proposal work are still present for the same account.

## Negative checks

- Paste an invalid URL and confirm it is rejected.
- Paste a private-network, localhost, credential-bearing, or disallowed URL and confirm the server rejects it.
- Include an instruction-like sentence in public page content and confirm it is treated as website data, not an agent instruction.
- Sign in as a second account and confirm the first account's saved opportunity and profile are not visible.
- Confirm Source never promises a client, payment, hiring outcome, or guaranteed response.

## Evidence record

Mark each item with PASS, FAIL, or NOT RUN and include the timestamp, URL, and a short observation. A browser screenshot or screen recording may support the record, but it cannot replace checking persistence and ownership.

Automated browser status for this workspace: the Codex browser connector failed to initialize with 'failed to write kernel assets: The system cannot find the path specified'; the project has no Playwright package or separately installed Chromium binary. Chrome and Edge executable paths are present, but no browser automation run was completed. Until an owner installs or enables a controlled browser runner, this manual procedure remains the authoritative fallback.
