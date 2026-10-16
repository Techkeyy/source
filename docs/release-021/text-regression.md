# External Text Boundary Regression

## Observed source behavior

`GET https://remoteok.com/api?tag=dev` returned:

- HTTP status: `200`
- content type: `application/json`
- valid JSON array
- BlueTuskr record id: redacted from this document
- description fragment: `access dataâmoving from externa...`
- code points: `U+00E2 U+0080 U+0094`
- Latin-1 byte interpretation: `e2 80 94`
- repaired character: `U+2014` em dash (`—`)

This proves the external record itself is mojibaked before Source's React
rendering. `response.json()` successfully decoded the response; no JSON parse
error or HTML extraction error was involved.

## Implemented boundary

`src/lib/text.ts` exports `normalizeExternalText(value)`.

The function recognizes only clusters shaped like common UTF-8-as-Latin-1
mojibake (`Ã`, `Â`, `â`, or `ð` followed by the expected continuation-byte
range). It decodes that cluster and rejects a repair if it would create the
Unicode replacement character. Legitimate accents, curly quotes, em dashes,
and other ordinary Unicode are not transformed.

`src/lib/discovery.ts` applies this function after provider HTML stripping and
whitespace normalization, before provider text is used for classification,
matching, excerpts, evidence, and budget signals.

## Tests

`tests/text.test.ts` covers:

- mojibaked em dash → em dash;
- mojibaked curly quotes with nearby `Café` preserved; and
- legitimate `“Café” — déjà vu; naïve coöperation.` unchanged.

The project test run passed 13 tests across 4 files.
