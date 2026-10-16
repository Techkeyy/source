import { existsSync } from "node:fs";

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) process.loadEnvFile(".env.local");

const clean = (value) => typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
const asDate = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
const endpoint = () => {
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return `https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search?publishedFrom=${from}&publishedTo=${to}&stages=tender&limit=100`;
};

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { accept: "application/json", "user-agent": "Source/0.1 buyer-intent feasibility probe" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

const serviceTerms = ["web", "website", "digital", "software", "application", "app", "design", "ux", "user experience", "branding", "marketing", "communications", "creative", "development", "media planning", "content", "e-commerce", "catalogue", "catalog"];

try {
  const url = endpoint();
  const payload = await fetchJson(url);
  const releases = Array.isArray(payload.releases) ? payload.releases : [];
  const matches = releases.flatMap((release) => {
    const tender = release?.tender;
    if (!tender || typeof tender !== "object") return [];
    const title = clean(tender.title);
    const description = clean(tender.description);
    const classification = clean(tender.classification?.description);
    const combined = `${title} ${description} ${classification}`.toLowerCase();
    const status = clean(tender.status).toLowerCase() || "not stated";
    if (!title || !description || (status !== "active" && status !== "not stated")) return [];
    if (!serviceTerms.some((term) => combined.includes(term))) return [];
    const document = (Array.isArray(tender.documents) ? tender.documents : []).find((item) => clean(item?.documentType).toLowerCase() === "tendernotice");
    const noticeUrl = clean(document?.url);
    const suitability = tender.suitability && typeof tender.suitability === "object" ? `SME suitability: ${tender.suitability.sme === true ? "yes" : tender.suitability.sme === false ? "no" : "not stated"}.` : "SME suitability not exposed.";
    const procurementMethod = clean(tender.procurementMethodDetails || tender.procurementMethod) || "not stated";
    const deadline = asDate(tender.tenderPeriod?.endDate);
    return [{
      ocid: clean(release.ocid),
      title,
      noticeStatus: status,
      publishedAt: asDate(tender.datePublished || release.date),
      deadline,
      buyer: clean(release.buyer?.name),
      scope: description.slice(0, 420),
      qualification: `${suitability} Procurement method: ${procurementMethod}. Detailed selection criteria require inspection of the notice documents.`,
      noticeUrl,
      hasBuyer: Boolean(clean(release.buyer?.name)),
      hasDeadline: Boolean(deadline),
      hasOfficialNotice: Boolean(noticeUrl),
    }];
  });
  const complete = matches.filter((match) => match.hasBuyer && match.hasDeadline && match.hasOfficialNotice).length;
  console.log(JSON.stringify({
    status: releases.length > 0 && matches.length > 0 && complete > 0 ? "pass" : "hold",
    generatedAt: new Date().toISOString(),
    endpoint: url,
    access: { httpStatus: 200, public: true, authenticationRequired: false, permittedUse: "Official published-notice OCDS search endpoint; no scraping performed." },
    sample: { tenderReleases: releases.length, serviceMatches: matches.length, completeEvidenceRecords: complete },
    fieldsVerified: ["notice status", "publication date", "tender deadline", "scope/description", "buyer identity", "procurement method", "SME suitability", "official notice URL"],
    actionableRequests: matches.slice(0, 12),
    limitations: ["The endpoint returns a bounded recent release page; production use would need cursor pagination and deduplication by OCID.", "Detailed qualification and selection criteria often require opening the official notice documents; they are not always embedded in the OCDS summary.", "A tender is an external buying request, not a guarantee that a particular user is eligible or will win."],
  }));
} catch (error) {
  console.log(JSON.stringify({ status: "hold", generatedAt: new Date().toISOString(), endpoint: endpoint(), error: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
}
