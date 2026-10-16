# Exact 390px Chromium Verification

Date: 2026-10-16 (Africa/Lagos)

## Method

The local Source application was exercised at `http://localhost:3000/` with
the installed Google Chrome binary (`Chrome/155.0.8059.84`) through the Chrome
DevTools Protocol. The page target used:

```json
{
  "viewport": { "width": 390, "height": 844 },
  "deviceScaleFactor": 1,
  "mobile": true,
  "hasTouch": true
}
```

The browser window's platform floor was not used as evidence. The CDP device
metrics override was applied to the page target, and the values below were
read back from the page before the visual checks.

## Verified page measurements

```json
{
  "windowInnerWidth": 390,
  "documentElementClientWidth": 390,
  "documentElementScrollWidth": 390,
  "visualViewportWidth": 390,
  "devicePixelRatio": 1,
  "bodyScrollWidth": 390
}
```

Key landing geometry, measured in the same exact viewport:

| Element | x | y | width | height | right edge | Result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Hero artwork | 19.50 | 734.44 | 351.00 | 301.56 | 370.50 | Within viewport |
| Headline | 19.50 | 162.38 | 351.00 | 182.94 | 370.50 | Within viewport |
| Public header/navigation | 0.00 | 0.00 | 390.00 | 67.00 | 390.00 | Within viewport |
| Primary header CTA | 239.78 | 11.00 | 134.22 | 44.00 | 374.00 | Within viewport |

The document and body scroll widths equal the verified 390px CSS viewport.
No horizontal overflow or unreachable primary action was observed. Content
below the fold remains vertically scrollable as expected.

## Captured evidence

All files below were captured directly from the exact 390px Chrome target,
without cropping or post-processing. The screenshot parser confirmed the
following bitmap widths:

| Screenshot | Bitmap dimensions | State |
| --- | --- | --- |
| `landing-390-exact-full.png` | 390 x 3841 | Full landing page and hero |
| `landing-390-exact.png` | 390 x 844 | Landing viewport |
| `header-navigation-390-exact.png` | 390 x 844 | Header and landing viewport |
| `auth-390-exact.png` | 390 x 844 | Account creation section |
| `onboarding-390-exact.png` | 390 x 1762 | URL onboarding |
| `profile-review-390-exact.png` | 390 x 3233 | Grounded profile review |
| `customer-selection-390-exact.png` | 390 x 1943 | Four customer categories |
| `opportunity-results-390-exact.png` | 390 x 2119 | Live source results |
| `proposal-editing-390-exact.png` | 390 x 844 | Unsaved proposal edit |
| `proposal-saved-390-exact.png` | 390 x 844 | Saved proposal state |
| `saved-work-390-exact.png` | 390 x 844 | Saved-work navigation and recovery entry |

## Real workflow evidence

Using one disposable account, the browser completed:

`registration -> frog.co analysis -> grounded profile review -> profile
confirmation -> all four customer types -> live discovery -> source-linked
BlueTuskr result -> proposal generation -> exact proposal edit -> explicit
draft save -> saved-work navigation`

The browser/server exchange recorded HTTP 201 for registration and HTTP 200
for profile analysis, profile confirmation, discovery, opportunity save,
proposal generation, and proposal draft update. The BlueTuskr card displayed
the corrected em dash and the eligibility warning. The disposable account's
profile, opportunity, and user record were removed after capture.

An initial attempt against a stale local development process returned a real
MongoDB SRV `querySrv ETIMEOUT`. After the process was restarted, the same
journey completed successfully; the MongoDB probe and the production build
also passed. This transient infrastructure event is recorded as diagnostic
evidence, not hidden as a browser result.
