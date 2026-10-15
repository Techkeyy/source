# Directive 015 defect ledger

| ID | Priority | Defect / risk | Evidence | Disposition |
|---|---|---|---|---|
| UX-015-01 | P0 | Landing or full workflow could be decorative only | Final Chromium run reached all stages with live HTTP 200 responses | Closed; no P0 remains |
| UX-015-02 | P0 | Customer categories could be visual-only | Four checkbox controls were selected and the search request completed through `/api/opportunities/search` | Closed for local vertical slice; query/ranking contract was preserved |
| UX-015-03 | P1 | URL-analysis error was present in state but not visibly surfaced | `url-error-1440.png` shows `role=alert` and preserved invalid URL | Closed in frontend |
| UX-015-04 | P1 | Confirmed profile is not reloaded into the editor after a fresh session | Existing API surface has no profile-read route; `PublicUser` carries no profile | Open; separate backend approval required |
| UX-015-05 | P1 | Proposal edits are not persisted by the current backend contract | UI explicitly says edits stay local until copied; no proposal-edit endpoint exists | Open; honest boundary retained |
| UX-015-06 | P1 | Legacy before screenshot was not re-captured | Turbopack rejected temporary dependency symlink; bounded offline install did not finish | Open evidence gap; no fake before image claimed |
| UX-015-07 | P2 | One external opportunity excerpt displayed replacement glyphs in the real source text | `proposal-1440.png` / `results-1440.png` | Open; external-source encoding should be normalized in a separately approved data-layer change |
| UX-015-08 | P2 | No recorded video artifact | Browser script and screenshots are reproducible, but no video was created | Open; owner can record manual walkthrough during review |

## Gate result

No P0 defect remains in the implemented local slice. UX-015-04 and UX-015-05
are product persistence limitations, not silently papered over by the UI.
