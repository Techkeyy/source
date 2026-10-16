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

## Screenshot artifacts and acceptance boundary

The retained files `landing-320.png` and `landing-390.png` are original,
unaltered outputs from the standalone Chromium screenshot process. Their
bitmap dimensions are 980x3675 and 1194x3675 respectively. That process
applied a platform CSS viewport floor of about 490px despite the requested
320px and 390px sizes, so these files are useful shell visual artifacts but
are not proof of exact 320px or 390px CSS viewport behavior.

The valid interactive narrow-width evidence in this package is the live
connector measurement above: a 319px scrollbar-adjusted surface with equal
heading client and scroll widths and no horizontal overflow. Exact 390px
visual acceptance remains pending a real Chromium/Kane run with a verified
390px CSS viewport.

The desktop/full-width browser path was also opened in Chromium during the
same task. No production page was used for screenshot generation.
