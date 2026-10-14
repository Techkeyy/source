# Directive 005 dependency security review

Date: 2026-10-14, Africa/Lagos

## Evidence

The production dependency audit completed with approved network access. It reported five moderate findings, all through the Mastra dependency chain:

@mastra/core 1.77.0 -> gray-matter 4.0.3 -> js-yaml 3.15.2 -> argparse 1.0.10 -> sprintf-js 1.0.3

The installed package tree confirms that the vulnerable path is production-reachable as a dependency of @mastra/core. The application imports @mastra/core in the profile-analysis workflow, so the package cannot currently be removed without changing the selected architecture.

The findings are not evidence that Source is safe to release. They are a release-risk item that needs a dependency owner decision and regression testing.

## Decision

No blind npm audit fix --force was run. npm reported that the forced resolution would install a breaking Mastra downgrade. No compatible patched path was proven during this review, so no override was added to package.json.

Safe controls currently in place:

- Website input is limited by server-side URL validation, response size, content type, redirects, and timeout checks.
- Website content is isolated as untrusted data before the model call.
- The application does not execute YAML, front matter, or arbitrary dependency input from user-controlled website content.
- No dependency audit output or secret value is exposed to the browser.

## Required follow-up

Before public release, run the audit again against the exact lockfile and check for a compatible Mastra release or upstream patch. If upgrading Mastra, rerun typecheck, lint, tests, production build, Gemma probe, and the complete acceptance path. If the advisory remains, record the accepted risk and confirm that the deployed service does not parse attacker-controlled front matter through the Mastra path.

## Browser automation boundary

The Codex browser connector failed before page load with the exact error 'failed to write kernel assets: The system cannot find the path specified'. Playwright and @playwright/test are not installed in the project. Chrome and Edge executable paths are present, but no controlled browser test was completed. See docs/manual-acceptance.md for the owner-run fallback.
