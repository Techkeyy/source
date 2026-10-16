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

## Exact 390px Chrome verification

The exact viewport pass is documented in
[`viewport-390.md`](viewport-390.md). Installed Chrome was controlled through
CDP with `width: 390`, `height: 844`, `deviceScaleFactor: 1`, mobile
emulation, and touch emulation. The page reported `innerWidth: 390`,
`documentElement.clientWidth: 390`, `documentElement.scrollWidth: 390`,
`visualViewport.width: 390`, `devicePixelRatio: 1`, and
`body.scrollWidth: 390`. The hero, headline, header navigation, and primary
header CTA all remained within the horizontal viewport.

## Screenshot artifacts and acceptance boundary

The retained files `landing-320.png` and `landing-390.png` are original,
unaltered outputs from the standalone Chromium screenshot process. Their
bitmap dimensions are 980x3675 and 1194x3675 respectively. That process
applied a platform CSS viewport floor of about 490px despite the requested
320px and 390px sizes, so these files are useful shell visual artifacts but
are not proof of exact 320px or 390px CSS viewport behavior.

The valid interactive narrow-width evidence now includes both the earlier
319px scrollbar-adjusted connector check and the exact 390px Chrome CDP pass.
The earlier shell PNGs remain retained as historical artifacts but are not
used as exact viewport proof.

The desktop/full-width browser path was also opened in Chromium during the
same task. No production page was used for screenshot generation.
