# Known Limitations and Release Boundary

- The Kane CLI browser runner was unavailable because its Bash service
  returned `E_ACCESSDENIED`. Real Chromium fallback evidence was captured and
  the limitation is recorded rather than hidden.
- The high-DPI screenshots preserve Chromium's original output dimensions;
  their CSS viewport sizes are the requested 320px and 390px. The live
  connector's measured narrow surface was 319px after scrollbar allocation.
- No production deployment or public post-fix UAT was performed. Production
  remains on the previously accepted commit until Director approval.
- Source displays a general eligibility reminder but does not implement a
  user-specific eligibility engine. Users must inspect the original source.
- SerpApi was not called because `SERPAPI_KEY` is not configured; this is an
  existing documented limitation, not a new release dependency.
- The local browser acceptance used a disposable account and cleaned its
  records. Owner-led acceptance is still required before release.
