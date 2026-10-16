# Contracts Finder feasibility — Directive 026

Date: 2026-10-16 (Africa/Lagos)

The official UK Contracts Finder published-notice OCDS search endpoint was tested with a bounded 45-day window:

`https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search?publishedFrom=2026-09-01&publishedTo=2026-10-16&stages=tender&limit=100`

The endpoint returned HTTP 200 without an API key or login. The response was an official OCDS JSON release package; no website scraping or restricted service was used. The live response contained:

| Check | Result |
|---|---:|
| Tender releases returned | 100 |
| Broad public design/web/marketing/digital term matches | 59 |
| Records with buyer, deadline, and official notice link | 59 |
| Authentication required | No |

The response exposed the fields Source needs to show an explicit external buying request: tender status, publication date, future tender deadline, buyer identity, scope/description, procurement method, SME suitability, classification/CPV information, and the official notice URL. One representative live match was `CA18543 - Northampton College - Media planning & Buying Services`, an active open procurement with a 2026-11-04 deadline, Northampton College as buyer, advertising/marketing CPV classification, SME suitability, and a supplier portal route in the official notice.

The adapter is intentionally conservative. It keeps only active tender notices that match a confirmed profile-specific service term; generic architectural, civil, grounds-maintenance, or unrelated “design” work is not treated as a web/design lead merely because the word `design` appears. The UI labels these records **Active Request**, not “likely customer” or a guaranteed contract. The public notice is the contact/application route, while eligibility, selection criteria, budget, award, and response remain unverified.

Known limitations:

- The bounded page is limited to 100 releases; production-scale use should follow the OCDS cursor and deduplicate by OCID.
- Detailed qualification and selection criteria may be in linked notice documents rather than the summary response.
- A tender is evidence of external procurement, not evidence that a particular Source user is eligible or will win.
- Current matching is profile-term based and should be reviewed against the original notice before any bid.

Verdict: **FEASIBLE AND SUITABLE AS A STRONGER BUYING-INTENT SOURCE.** It is retained alongside Hacker News, GitHub, Jobicy, Remote OK, optional SerpApi, and the disabled Reddit boundary. It does not replace or reinterpret existing public project-signal sources.
