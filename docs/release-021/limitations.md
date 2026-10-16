# Known Limitations and Release Boundary

- The Kane CLI browser runner was unavailable because its Bash service
  returned `E_ACCESSDENIED`. Real Chromium fallback evidence was captured and
  the limitation is recorded rather than hidden.
- The retained historical high-DPI screenshots preserve the standalone Chromium output
  dimensions, but that process applied a platform CSS viewport floor of about
  490px despite the requested 320px and 390px sizes. The 980x3675 and
  1194x3675 PNGs are therefore unaltered shell artifacts, not exact CSS
  viewport proof. Exact 390px evidence is now provided separately by the
  installed Chrome CDP capture set in `viewport-390.md`.
- No production deployment or public post-fix UAT was performed. Production
  remains on the previously accepted commit until Director approval.
- Source displays a general eligibility reminder but does not implement a
  user-specific eligibility engine. Users must inspect the original source.
- SerpApi was not called because `SERPAPI_KEY` is not configured; this is an
  existing documented limitation, not a new release dependency.
- The local browser acceptance used a disposable account and cleaned its
  records. Owner-led acceptance is still required before release.
