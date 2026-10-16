# Responsive Measurements

## Live Chromium connector

The in-app Chromium connector's narrow surface reported:

```json
{
  "innerWidth": 319,
  "bodyWidth": 304.12799072265625,
  "documentScrollWidth": 304,
  "heroWidth": 287.531982421875,
  "headingClientWidth": 288,
  "headingScrollWidth": 288,
  "headingFontSize": "43px"
}
```

The 319px surface is the connector's scrollbar-adjusted rendering of the
320px mobile class viewport. Its heading and document scroll widths are equal
to their containing widths, so no horizontal overflow is present.

## Canonical screenshots

- `landing-320.png`: Chromium CSS viewport requested at 320px; high-DPI PNG
  preserves the browser's original output resolution.
- `landing-390.png`: Chromium CSS viewport requested at 390px; high-DPI PNG
  preserves the browser's original output resolution.

The desktop/full-width browser path was also opened in Chromium during the
same task. No production page was used for screenshot generation.
