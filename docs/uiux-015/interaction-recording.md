# Real-browser interaction record

No video file was created. The interaction is reproducible through the
Playwright script `scripts/uiux-015-after.mjs`, which runs against the local
app and emits deterministic named screenshots.

## Recorded sequence

1. Open the public Source landing page at desktop and mobile widths.
2. Submit a fresh registration through the rendered auth form.
3. Open URL onboarding and capture the empty state.
4. Submit `http://127.0.0.1:1/` to prove visible SSRF-safe error handling and
   preserved input.
5. Submit `https://www.frog.co/` and capture loading and profile review.
6. Edit search keywords and confirm the profile.
7. Select small businesses, startups, agencies and individuals.
8. Search live sources and capture result classification/evidence.
9. Save an opportunity and generate the editable proposal.
10. Refresh, select recovered saved work, log out, log back in and capture
    recovered saved work again.

The `source-screenshots/` filenames correspond to these checkpoints. The
owner/director may use the same command for a short manual or screen-recorded
walkthrough during review.
