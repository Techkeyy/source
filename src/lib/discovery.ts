import { SourceError } from "./errors";
import { optionalEnv } from "./env";
import { normalizeExternalText } from "./text";
import { CUSTOMER_TYPES, type BuyerIntent, type CustomerType, type DiscoveryMode, type Opportunity, type OpportunityClassification, type ProfileDraft, type ProspectType } from "./types";

const FRESHNESS_DAYS: Record<string, number> = { "Hacker News": 21, Jobicy: 30, "Remote OK": 21, GitHub: 45, "Contracts Finder": 45, Reddit: 21, Himalayas: 30, SerpApi: 14 };
const CATEGORY_TERMS: Record<CustomerType, string[]> = {
  "small-businesses": ["small business", "small team", "local business", "owner", "smb"],
  startups: ["startup", "founder", "seed", "mvp", "early stage"],
  agencies: ["agency", "studio", "consultancy", "white label", "subcontract"],
  individuals: ["personal project", "creator", "coach", "author", "individual", "one off"],
};

interface ProviderStatus {
  provider: string;
  status: "queried" | "skipped" | "failed";
  detail: string;
  query?: string;
  rawCount?: number;
  adapterRejected?: number;
}

export type DiscoveryRejectionReason =
  | "expired-or-stale"
  | "full-time-employment"
  | "unsupported-customer-intent"
  | "missing-organization"
  | "weak-profile-match"
  | "weak-category-match";

export interface DiscoveryProviderDiagnostics {
  rawCandidates: number;
  extractedCandidates: number;
  adapterRejected: number;
  qualified: number;
  rejected: Partial<Record<DiscoveryRejectionReason, number>>;
}

export interface RawOpportunity {
  provider: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string | null;
  type: string;
  id?: string;
  prospectType?: ProspectType;
  buyerIntent?: BuyerIntent;
  organization?: string;
  buyerName?: string;
  contactUrl?: string | null;
  noticeStatus?: string;
  deadline?: string | null;
  qualificationSummary?: string | null;
}

const FULL_TIME_TYPE_PATTERN = /\b(full[- ]?time|permanent|salary|employee|employment)\b/i;
const FULL_TIME_CONTEXT_PATTERN = /\b(full[- ]?time|permanent(?:\s+(?:role|position|job|employment))?|annual\s+salary|salary\s+(?:range|package)|employee\s+benefits|health\s+insurance|paid\s+(?:time off|vacation|sick)|benefits\s+package)\b/i;
const JOBICY_EXTERNAL_SERVICE_PATTERN = /\b(?:freelance|independent|external)\s+(?:service(?:s)?|consult(?:ant|ing)|contract(?:or)?|agency|vendor|supplier|designer|developer|writer|marketer|media\s+(?:planner|buyer|buying))\b|\b(?:seeking|looking for|need(?:s)?|hire)\s+(?:an?\s+)?(?:freelance|independent|external)\b/i;
const JOBICY_RECRUITMENT_PATTERN = /\b(?:role|position|responsibilit(?:y|ies)|qualifications?|benefits?|interview|recruit(?:er|ment)|candidate|workforce|employee|salary|paid\s+(?:leave|time off|vacation)|reports?\s+to|hiring|application\s+process|equal\s+opportunity)\b/i;
const CONTRACT_TYPE_PATTERN = /\b(freelance|contract(?:or)?|temporary|fixed[- ]term|project[- ]based|part[- ]time\s+contract)\b/i;
const CONTRACT_CONTEXT_PATTERNS = [
  /\bfreelance(?:r|rs)?\b/i,
  /\bindependent\s+contractor\b/i,
  /\bcontract(?:or)?\s+(?:role|position|job|engagement|assignment|opportunity|work)\b/i,
  /\b(?:role|position|job|engagement|assignment|opportunity|work)\s+(?:is|as|on)\s+(?:a\s+)?contract(?:or)?\b/i,
  /\bcontract[- ]to[- ]hire\b/i,
  /\b(?:temporary|short[- ]term|fixed[- ]term|hourly)\s+(?:contract|position|role|engagement)\b/i,
  /\b(?:contract|freelance)\s+(?:basis|work|engagement)\b/i,
  /\b(?:1099|c2c|corp[- ]to[- ]corp)\b/i,
  /\bproject[- ]based\s+(?:role|work|engagement)\b/i,
];
const POTENTIAL_SIGNAL_PATTERN = /\b(?:feature request|enhancement|help wanted|must-have|ready-for-human|client request|external|looking for|seeking|need(?:s)?|recommend(?:ation|ations)?|struggl(?:e|ing)|problem with|how do i|migrat(?:e|ion)|replac(?:e|ing)|want to hire|freelance(?:r|rs)?|workflow gap|manual process|customer-facing|user story|acceptance criteria|why this needs a human)\b/i;
const HN_POTENTIAL_SIGNAL_PATTERN = /\b(?:looking for|seeking)\s+(?:a|an|the|some)\s+(?:freelancer|developer|designer|agency|help|recommendation|solution)|\bneed\s+(?:help|a\s+(?:freelancer|developer|designer|agency|website|solution))\b|\b(?:want to hire|freelance(?:r|rs)?|could someone recommend|anyone recommend)\b|\b(?:customer-facing|user story|acceptance criteria)\b/i;
const EXTERNAL_BUYING_PATTERN = /\b(?:seeking to appoint|appoint(?:ing)?\s+(?:an?\s+)?(?:agency|supplier|contractor|provider|vendor)|invites?\s+(?:tenders?|proposals?)|request(?:s|ed)?\s+for\s+(?:proposal|quotation)|requesting\s+proposals?|tender(?:ing)?\s+for|supplier|contractor|service provider|vendor|procurement|rfq|itt|open competition|commission(?:ing)?\s+(?:a|an|the)?\s*(?:agency|provider|contractor|supplier))\b/i;
const POTENTIAL_CUSTOMER_NEED_PATTERN = /\b(?:business|company|organisation|organization|startup|founder|customer-facing|client-facing|product|website|e-commerce|brand|branding|marketing|service|commercial|shop|catalogue|catalog|user story|acceptance criteria|objective|build|develop|implement|need(?:s)?|looking for|want to)\b/i;
const GITHUB_SIGNAL_LABEL_PATTERN = /\b(?:help wanted|enhancement|feature request|must-have|ready-for-human|client request|external)\b/i;
const GITHUB_NEED_PATTERN = /\b(?:i want to|we want to|we need|need a|looking for|build(?:ing)?|objective|develop(?:ing)?|implement(?:ation|ing)?|product catalogue|design direction|product brief|customer-facing|user story|acceptance criteria|why this needs a human)\b/i;
const GITHUB_INTERNAL_PATTERN = /\b(?:fix typo|refactor|unit tests?|test coverage|ci\/cd|dependency|dependencies|npm audit|lint|internal|assigned task|database migration|api endpoint|blocked by|client dependency|owner\s*:|horizon\s*:|gates?\s+client|verification guide)\b/i;
const GITHUB_PROMOTION_PATTERN = /\b(?:best .* company in|advertising production company|graphic design course|learn .* career|support small business marketing|seo services?|past websites?|portfolio|showcase my work|key services|best for:|final thoughts|before hiring|companies? helping .* businesses|businesses looking for .* (?:company|partner|provider)|top .* companies?|leading .* companies?)\b/i;
const GITHUB_EXTERNAL_BUYING_PATTERN = /\b(?:looking for|seeking|need|want to hire|hire)\s+(?:an?\s+)?(?:freelancer|contractor|agency|vendor|supplier|service provider|developer|designer)|\b(?:request(?:ing)?|invite)\s+(?:for\s+)?(?:proposal|quotation|tender)s?\b|\b(?:external|outsourc(?:e|ing))\s+(?:developer|designer|agency|provider|support)\b/i;
const GENERIC_MATCH_TERMS = new Set(["about", "account", "after", "again", "also", "and", "app", "available", "batch", "between", "business", "calmer", "clear", "company", "customers", "develop", "development", "doing", "fast", "from", "fund", "have", "help", "human", "into", "made", "move", "need", "open", "people", "private", "product", "project", "projects", "protected", "record", "right", "service", "services", "settle", "share", "simple", "sends", "send", "sending", "test", "that", "the", "this", "their", "token", "tokens", "using", "value", "want", "way", "what", "with", "work", "works"]);
const PRODUCT_NEED_PATTERN = /\b(?:adopt|buy|buying|customer(?:s)?|integrat(?:e|ion|ing)|need(?:s)?|pilot|procure|replace|roll ?out|seeking|solution|use case|user(?:s)?|vendor|workflow|(?:payment|payout|wallet|checkout|remittance|settlement|claim|passkey|token|finance|money|transaction)s?)\b/i;

function text(value: unknown) {
  return typeof value === "string" ? normalizeExternalText(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()) : "";
}

function textList(value: unknown) {
  return Array.isArray(value) ? value.map(text).filter(Boolean).join(", ") : text(value);
}

function dateValue(value: unknown) {
  if (typeof value === "number") return new Date(value > 10_000_000_000 ? value : value * 1000).toISOString();
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

async function fetchJson(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000), headers: { accept: "application/json", "user-agent": "Source/0.1 customer discovery" } });
  if (!response.ok) throw new SourceError(`A discovery source returned HTTP ${response.status}.`, 502, "DISCOVERY_PROVIDER_FAILED");
  return response.json() as Promise<unknown>;
}

function isFresh(provider: string, publishedAt: string | null) {
  if (!publishedAt) return false;
  const age = Date.now() - new Date(publishedAt).getTime();
  return age >= 0 && age <= FRESHNESS_DAYS[provider] * 24 * 60 * 60 * 1000;
}

function isJobicyExternalServiceRequest(record: RawOpportunity) {
  const combined = `${record.title} ${record.description} ${record.type}`;
  return JOBICY_EXTERNAL_SERVICE_PATTERN.test(combined) && !JOBICY_RECRUITMENT_PATTERN.test(combined);
}

export function classifyOpportunity(record: RawOpportunity, mode: DiscoveryMode): OpportunityClassification {
  const combined = `${record.title} ${record.description} ${record.type}`;
  if (!isFresh(record.provider, record.publishedAt)) return "expired-or-stale";
  if (FULL_TIME_TYPE_PATTERN.test(record.type) || FULL_TIME_CONTEXT_PATTERN.test(combined)) return "full-time-employment";
  if (record.provider === "Jobicy" && !isJobicyExternalServiceRequest(record)) return "unknown-employment-type";
  if (record.buyerIntent === "confirmed" || (record.provider === "Contracts Finder" && EXTERNAL_BUYING_PATTERN.test(combined)) || (record.provider === "GitHub" && GITHUB_EXTERNAL_BUYING_PATTERN.test(combined))) return "explicit-project-request";
  if (record.provider === "Hacker News" && /\b(?:looking for|need|seeking)\s+(?:a\s+)?freelancer\b/i.test(combined)) return "explicit-project-request";
  if ((mode === "product" || mode === "potential-customers") && (record.prospectType === "research-signal" || record.provider === "GitHub")) {
    const hasNeed = POTENTIAL_SIGNAL_PATTERN.test(combined) || POTENTIAL_CUSTOMER_NEED_PATTERN.test(combined);
    const looksInternal = record.provider === "GitHub" && GITHUB_INTERNAL_PATTERN.test(combined);
    const potentialSignal = record.provider === "Hacker News" ? HN_POTENTIAL_SIGNAL_PATTERN.test(combined) : hasNeed && !looksInternal;
    if (potentialSignal) return "potential-buyer-signal-unconfirmed";
    if (hasNeed || looksInternal) return "research-signal-only";
  }
  if (CONTRACT_TYPE_PATTERN.test(record.type) || CONTRACT_CONTEXT_PATTERNS.some((pattern) => pattern.test(combined))) return "freelance-or-contract";
  if ((mode === "product" || mode === "potential-customers") && record.prospectType === "potential-customer") {
    const potentialSignal = record.provider === "Hacker News" ? HN_POTENTIAL_SIGNAL_PATTERN : POTENTIAL_SIGNAL_PATTERN;
    return potentialSignal.test(combined) ? "potential-buyer-signal-unconfirmed" : record.provider === "Hacker News" ? "unknown-employment-type" : "research-signal-only";
  }
  return "unknown-employment-type";
}

export function profileTerms(profile: ProfileDraft) {
  const phrases = [
    ...profile.searchKeywords,
    ...profile.skillsAndTechnologies.map((claim) => claim.text),
    ...profile.productsAndServices.map((claim) => claim.text),
  ].map((item) => item.toLowerCase().replace(/[^a-z0-9+#. -]/g, " ").replace(/\s+/g, " ").trim()).filter((item) => item.length >= 3);
  const terms = phrases.flatMap((phrase) => {
    const tokens = phrase.split(" ").filter((token) => token.length >= 4 && !GENERIC_MATCH_TERMS.has(token));
    const ngrams = tokens.length > 1 ? tokens.flatMap((_, index) => index < tokens.length - 1 ? [`${tokens[index]} ${tokens[index + 1]}`] : []) : [];
    return [tokens.length > 1 ? tokens.join(" ") : "", ...ngrams, ...tokens];
  });
  const uniqueTerms = [...new Set(terms)].filter(Boolean);
  return [...new Set(uniqueTerms.flatMap((term) => term.endsWith("s") && term.length > 4 ? [term, term.slice(0, -1)] : [term]))].slice(0, 36);
}

function termInText(term: string, value: string) {
  return new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(value);
}

function profileMatchesFor(profile: ProfileDraft, combined: string) {
  return profileTerms(profile).filter((term) => termInText(term, combined)).slice(0, 6);
}

function budgetSignal(value: string) {
  const match = value.match(/(?:\$|€|£)\s?[\d,.]+(?:\s?(?:\/\s?hour|per hour|k))?/i) || value.match(/(?:budget|hourly|per hour|rate|compensation)\s*[:\-]?\s*[^.;]{0,50}/i);
  return match?.[0]?.trim() || null;
}

function inferClientType(value: string, selected: CustomerType[]) {
  const lower = value.toLowerCase();
  const matched = selected.find((category) => CATEGORY_TERMS[category].some((term) => lower.includes(term)));
  return matched || "unknown";
}

function evaluateOpportunity(record: RawOpportunity, profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode): { opportunity: Opportunity | null; reason?: DiscoveryRejectionReason } {
  const combined = `${record.title} ${record.description}`.toLowerCase();
  const productOwner = profile.discoveryObjective === "product-users" || profile.offeringType === "product-owner";
  if (productOwner && ["Jobicy", "Remote OK", "SerpApi"].includes(record.provider)) return { opportunity: null, reason: "unsupported-customer-intent" };
  const classification = classifyOpportunity(record, mode);
  if (classification === "expired-or-stale") return { opportunity: null, reason: "expired-or-stale" };
  if (classification === "full-time-employment") return { opportunity: null, reason: "full-time-employment" };
  if (!["explicit-project-request", "freelance-or-contract", "potential-buyer-signal-unconfirmed", "research-signal-only"].includes(classification)) return { opportunity: null, reason: "unsupported-customer-intent" };
  if (classification === "research-signal-only" && mode !== "product" && mode !== "potential-customers") return { opportunity: null, reason: "unsupported-customer-intent" };
  if ((classification === "potential-buyer-signal-unconfirmed" || classification === "research-signal-only") && !record.organization) return { opportunity: null, reason: "missing-organization" };
  const profileMatches = profileMatchesFor(profile, combined);
  const categoryMatches = selected.flatMap((category) => CATEGORY_TERMS[category].filter((term) => combined.includes(term))).slice(0, 6);
  if (productOwner && !PRODUCT_NEED_PATTERN.test(combined)) return { opportunity: null, reason: "weak-profile-match" };
  if (["potential-buyer-signal-unconfirmed", "research-signal-only"].includes(classification) && !profileMatches.length) return { opportunity: null, reason: "weak-profile-match" };
  if (!profileMatches.length) return { opportunity: null, reason: "weak-profile-match" };
  const score = (classification === "explicit-project-request" ? 30 : classification === "freelance-or-contract" ? 20 : classification === "potential-buyer-signal-unconfirmed" ? 10 : 0) + Math.min(profileMatches.length * 2, 12) + Math.min(categoryMatches.length * 2, 8) + (isFresh(record.provider, record.publishedAt) ? 3 : 0);
  const excerpt = record.description.slice(0, 360).trim();
  const prospectType: ProspectType = classification === "potential-buyer-signal-unconfirmed" ? "potential-customer" : classification === "research-signal-only" ? "research-signal" : "active-request";
  const buyerIntent: BuyerIntent = record.buyerIntent || (classification === "potential-buyer-signal-unconfirmed" ? "possible" : classification === "research-signal-only" ? "unsupported" : "confirmed");
  const nextStep = prospectType === "active-request"
    ? record.provider === "Contracts Finder"
      ? "Check the deadline, buyer requirements, and official tender route before deciding whether you can bid."
      : "Open the original request and confirm the application or contact route before responding."
    : prospectType === "potential-customer"
      ? record.contactUrl
        ? "Inspect the project signal and verify the legitimate public contact route before cautious outreach."
        : "Inspect the project evidence and look for an official contact or procurement route; do not assume the organization is buying."
      : "Investigate whether the organization accepts external providers. Do not post a promotional issue comment or assume a buyer.";
  const intentEvidence = buyerIntent === "confirmed"
    ? "The source explicitly identifies a supplier, contractor, tender, or application need; award and eligibility remain unverified."
    : buyerIntent === "possible"
      ? "The source shows an observed project or business need, but external buying intent is possible rather than confirmed."
      : "The source shows work that may need doing, but provides no defensible evidence that an external provider is being sought.";
  return { opportunity: {
      source: record.provider,
      sourceUrl: record.url,
      title: record.title || "Untitled opportunity",
      description: excerpt || "The source did not provide a description.",
      publishedAt: record.publishedAt,
      classification,
      prospectType,
      buyerIntent,
      organization: record.organization || "Organization not identified by the source",
      buyerName: record.buyerName,
      observedNeed: excerpt || "The source did not provide a clear need statement.",
      nextStep,
      contactUrl: record.contactUrl || null,
      noticeStatus: record.noticeStatus,
      deadline: record.deadline || null,
      qualificationSummary: record.qualificationSummary || null,
      clientType: inferClientType(combined, selected),
      score,
      profileMatches,
      categoryMatches,
      evidence: [
        `Public evidence: “${excerpt || "The source did not provide a usable excerpt."}”`,
        profileMatches.length ? `Meaningful offering terms found in source text: ${profileMatches.join(", ")}.` : "No meaningful offering-term overlap was found.",
        categoryMatches.length ? `Customer category language found in source text: ${categoryMatches.join(", ")}.` : "The source does not explicitly identify a selected customer category; category language is never enough by itself.",
        intentEvidence,
        record.buyerName ? `Buyer identity from the source: ${record.buyerName}.` : "The source identifies a project or organization, not necessarily a buyer.",
        record.noticeStatus ? `Notice status: ${record.noticeStatus}.` : "The source did not expose a notice status in the retrieved record.",
        record.deadline ? `Published deadline: ${record.deadline}.` : "No source deadline was exposed in the retrieved record.",
        record.qualificationSummary ? `Qualification signal: ${record.qualificationSummary}.` : "Qualification requirements were not exposed in the retrieved record; inspect the original source.",
      ],
      budgetSignal: budgetSignal(`${record.title} ${record.description}`),
      contactSignal: /\b(apply|application|contact|email|submit|reach out)\b/i.test(combined),
      attribution: `Source data from ${record.provider}. Open the original listing before acting.`,
      providerRecordId: record.id,
    } };
}

export function qualifyOpportunity(record: RawOpportunity, profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode): Opportunity | null {
  return evaluateOpportunity(record, profile, selected, mode).opportunity;
}

async function queryHackerNews(profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const categoryQuery = selected.flatMap((category) => CATEGORY_TERMS[category].slice(0, 2)).join(" ");
  const skillQuery = profile.searchKeywords.slice(0, 3).join(" ");
  if (mode === "services" || mode === "active-requests") {
    const query = `"looking for a freelancer" OR "need a freelancer" OR "seeking a freelancer" ${skillQuery} ${categoryQuery}`.trim();
    const url = `https://hn.algolia.com/api/v1/search_by_date?${new URLSearchParams({ query, tags: "comment", hitsPerPage: "50" })}`;
    const payload = (await fetchJson(url)) as { hits?: Array<Record<string, unknown>> };
    const hits = payload.hits || [];
    const records = hits.flatMap((hit) => {
      const objectId = text(hit.objectID);
      const description = text(hit.comment_text || hit.story_title || hit.title);
      if (!objectId || !description) return [];
      return [{ provider: "Hacker News", title: text(hit.story_title) || "Hacker News community discussion", description, url: `https://news.ycombinator.com/item?id=${objectId}`, publishedAt: dateValue(hit.created_at || hit.created_at_i), type: "comment", id: objectId, prospectType: "active-request" as const }];
    });
    return { records, status: { provider: "Hacker News", status: "queried", detail: `${records.length} public comments returned.`, query, rawCount: hits.length, adapterRejected: hits.length - records.length } };
  }

  const serviceTerms = [...new Set([...profile.searchKeywords, ...profile.productsAndServices.map((claim) => claim.text), ...profile.skillsAndTechnologies.map((claim) => claim.text)].filter(Boolean))].slice(0, 3);
  const needTerms = ["looking for a freelancer", "need help with", "recommend a freelancer", "looking for a designer", "looking for a developer"];
  const searchTerms = [...new Set(needTerms.flatMap((signal) => serviceTerms.slice(0, 2).map((term) => `${signal} ${term}`)).concat(categoryQuery ? [`${categoryQuery} ${serviceTerms[0] || "project"}`] : []))].slice(0, 8);
  const results = await Promise.allSettled(searchTerms.map(async (term) => {
    const query = term.replaceAll('"', "");
    const url = `https://hn.algolia.com/api/v1/search_by_date?${new URLSearchParams({ query, tags: "story", hitsPerPage: "30" })}`;
    return (await fetchJson(url)) as { hits?: Array<Record<string, unknown>> };
  }));
  const hits = results.flatMap((result) => result.status === "fulfilled" ? result.value.hits || [] : []);
  const seen = new Set<string>();
  const records = hits.flatMap((hit) => {
    const objectId = text(hit.objectID);
    const title = text(hit.title || hit.story_title);
    const description = text(hit.story_text || hit.comment_text || hit.title || hit.story_title);
    if (!objectId || !title || !description || seen.has(objectId)) return [];
    seen.add(objectId);
    const organization = title.replace(/^(?:show|ask|launch) hn:\s*/i, "").split(/\s+[–—-]\s+/)[0].trim() || text(hit.author) || undefined;
    return [{ provider: "Hacker News", title, description, url: `https://news.ycombinator.com/item?id=${objectId}`, publishedAt: dateValue(hit.created_at || hit.created_at_i), type: "story", id: objectId, prospectType: "potential-customer" as const, organization }];
  });
  return { records, status: { provider: "Hacker News", status: "queried", detail: `${records.length} public Ask/Show/Launch stories returned from ${searchTerms.length} profile-aware queries.`, query: searchTerms.join(" | "), rawCount: hits.length, adapterRejected: hits.length - records.length } };
}

async function queryContractsFinder(profile: ProfileDraft): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const publishedTo = new Date().toISOString().slice(0, 10);
  const publishedFrom = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const query = `publishedFrom=${publishedFrom}&publishedTo=${publishedTo}&stages=tender&limit=100`;
  const payload = await fetchJson(`https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search?${query}`) as { releases?: Array<Record<string, unknown>> };
  const releases = Array.isArray(payload.releases) ? payload.releases : [];
  const serviceTerms = [...profile.searchKeywords, ...profile.productsAndServices.map((claim) => claim.text), ...profile.skillsAndTechnologies.map((claim) => claim.text)].map((term) => term.toLowerCase()).filter(Boolean);
  const usableProfileTerms = serviceTerms.filter((term) => term.length >= 4 && !["design", "development", "service", "services"].includes(term));
  const procurementTerms = ["web", "website", "digital", "software", "application", "app", "design", "ux", "user experience", "branding", "marketing", "communications", "creative", "development", "media planning", "content", "e-commerce", "catalogue", "catalog"];
  const records = releases.flatMap((release) => {
    const tender = release.tender && typeof release.tender === "object" ? release.tender as Record<string, unknown> : null;
    if (!tender) return [];
    const title = text(tender.title);
    const description = text(tender.description) || title;
    const status = text(tender.status).toLowerCase();
    const combined = `${title} ${description} ${text(tender.classification && typeof tender.classification === "object" ? (tender.classification as Record<string, unknown>).description : "")}`.toLowerCase();
    if (!title || !description || (status && status !== "active")) return [];
    if (!procurementTerms.some((term) => combined.includes(term)) && !serviceTerms.some((term) => term.length >= 3 && combined.includes(term))) return [];
    if (!usableProfileTerms.some((term) => combined.includes(term))) return [];
    const buyer = release.buyer && typeof release.buyer === "object" ? release.buyer as Record<string, unknown> : null;
    const buyerName = text(buyer?.name);
    const parties = Array.isArray(release.parties) ? release.parties : [];
    const buyerParty = parties.find((party) => party && typeof party === "object" && Array.isArray((party as Record<string, unknown>).roles) && ((party as Record<string, unknown>).roles as unknown[]).some((role) => text(role).toLowerCase() === "buyer"));
    const partyRecord = buyerParty && typeof buyerParty === "object" ? buyerParty as Record<string, unknown> : null;
    const organization = buyerName || text(partyRecord?.name) || undefined;
    const documents = Array.isArray(tender.documents) ? tender.documents : [];
    const noticeDocument = documents.find((document) => document && typeof document === "object" && text((document as Record<string, unknown>).documentType).toLowerCase() === "tendernotice");
    const noticeUrl = text(noticeDocument && typeof noticeDocument === "object" ? (noticeDocument as Record<string, unknown>).url : "") || `https://www.contractsfinder.service.gov.uk/Notice/${text(release.id).split("-").slice(0, 5).join("-")}`;
    const tenderPeriod = tender.tenderPeriod && typeof tender.tenderPeriod === "object" ? tender.tenderPeriod as Record<string, unknown> : null;
    const deadline = dateValue(tenderPeriod?.endDate);
    const suitability = tender.suitability && typeof tender.suitability === "object" ? tender.suitability as Record<string, unknown> : null;
    const procurementMethod = text(tender.procurementMethodDetails || tender.procurementMethod) || "not stated";
    const qualificationSummary = suitability
      ? `SME suitability: ${suitability.sme === true ? "yes" : suitability.sme === false ? "no" : "not stated"}; procurement method: ${procurementMethod}. Detailed selection criteria are in the official notice documents.`
      : `Procurement method: ${procurementMethod}. Detailed selection criteria are in the official notice documents.`;
    return [{
      provider: "Contracts Finder",
      title,
      description,
      url: noticeUrl,
      publishedAt: dateValue(tender.datePublished || release.date),
      type: `tender · ${text(tender.mainProcurementCategory) || "services"}`,
      id: text(release.ocid || release.id || noticeUrl),
      prospectType: "active-request" as const,
      buyerIntent: "confirmed" as const,
      organization,
      buyerName: organization,
      contactUrl: noticeUrl,
      noticeStatus: status || "not stated",
      deadline,
      qualificationSummary,
    }];
  });
  return { records, status: { provider: "Contracts Finder", status: "queried", detail: `${records.length} current tender notices matched public digital, design, marketing, or related service terms.`, query, rawCount: releases.length, adapterRejected: releases.length - records.length } };
}

async function queryJobicy(profile: ProfileDraft): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const tag = profile.searchKeywords[0] || "freelance";
  const query = `tag=${tag}`;
  const payload = (await fetchJson(`https://jobicy.com/api/v2/remote-jobs?${new URLSearchParams({ count: "50", tag })}`)) as Record<string, unknown>;
  const jobs = ["jobs", "jobListings", "data", "results"].flatMap((key) => Array.isArray(payload[key]) ? payload[key] : []).filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
  const records = jobs.flatMap((job) => {
    const url = text(job.url || job.jobUrl || job.link);
    const title = text(job.jobTitle || job.title || job.position);
    if (!url || !title) return [];
    return [{ provider: "Jobicy", title, description: text(job.jobDescription || job.description || job.jobExcerpt || job.excerpt), url, publishedAt: dateValue(job.pubDate || job.published || job.publishedAt || job.date), type: textList(job.jobType || job.employmentType), id: text(job.id || url), prospectType: "active-request" as const, organization: text(job.companyName || job.company || job.organization) || undefined, contactUrl: text(job.applyUrl || job.applicationUrl || job.jobApplyLink) || null }];
  });
  return { records, status: { provider: "Jobicy", status: "queried", detail: `${records.length} public records returned. Contract status is rechecked from source fields.`, query } };
}

async function queryRemoteOk(profile: ProfileDraft): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const tag = profileTerms(profile).find((term) => term.length >= 4)?.replace(/\s+/g, "-");
  if (!tag) return { records: [], status: { provider: "Remote OK", status: "skipped", detail: "No meaningful confirmed service term was available for a Remote OK query." } };
  const payload = (await fetchJson(`https://remoteok.com/api?tag=${encodeURIComponent(tag)}`)) as Array<Record<string, unknown>>;
  const records = payload.filter((item) => item && typeof item === "object").flatMap((job) => {
    const url = text(job.url || (job.id ? `https://remoteok.com/remote-jobs/${text(job.id)}` : ""));
    const title = text(job.position || job.title);
    if (!url || !title) return [];
    return [{ provider: "Remote OK", title, description: text(job.description), url, publishedAt: dateValue(job.date || job.created_at), type: text(job.job_type || job.type), id: text(job.id || url), prospectType: "active-request" as const, organization: text(job.company || job.company_name) || undefined, contactUrl: text(job.apply_url || job.applyUrl) || null }];
  });
  return { records, status: { provider: "Remote OK", status: "queried", detail: `${records.length} public records returned. Only explicit project or contract signals can pass.` } };
}

async function querySerpApi(profile: ProfileDraft, selected: CustomerType): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const key = optionalEnv("SERPAPI_KEY");
  if (!key) return { records: [], status: { provider: "SerpApi", status: "skipped", detail: "SERPAPI_KEY is not configured. No paid search request was made." } };
  const query = `${profile.searchKeywords.slice(0, 3).join(" ")} freelance ${CATEGORY_TERMS[selected].slice(0, 2).join(" ")}`;
  const params = new URLSearchParams({ engine: "google_jobs", q: query, api_key: key });
  const payload = (await fetchJson(`https://serpapi.com/search.json?${params}`)) as { jobs_results?: Array<Record<string, unknown>> };
  const records = (payload.jobs_results || []).flatMap((job) => {
    const title = text(job.title);
    const applyOptions = Array.isArray(job.apply_options) ? job.apply_options : [];
    const firstApply = applyOptions[0] && typeof applyOptions[0] === "object" ? applyOptions[0] as Record<string, unknown> : undefined;
    const url = text(job.share_link || firstApply?.link);
    if (!title || !url) return [];
    return [{ provider: "SerpApi", title, description: text(job.description), url, publishedAt: dateValue(job.detected_extensions && typeof job.detected_extensions === "object" ? (job.detected_extensions as Record<string, unknown>).posted_at : null), type: text(job.schedule_type || job.employment_type), id: url, prospectType: "active-request" as const, organization: text(job.company_name || job.company) || undefined, contactUrl: url }];
  });
  return { records, status: { provider: "SerpApi", status: "queried", detail: `${records.length} Google Jobs records returned.`, query } };
}

async function queryGithub(profile: ProfileDraft): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const terms = [...profile.searchKeywords, ...profile.productsAndServices.map((claim) => claim.text)].filter(Boolean).slice(0, 3);
  if (!terms.length) return { records: [], status: { provider: "GitHub", status: "skipped", detail: "No confirmed or user-edited service terms were available for the public issue search." } };
  const keywordQuery = terms.length > 1 ? `(${terms.map((term) => term.replaceAll('"', "")).join(" OR ")})` : terms[0].replaceAll('"', "");
  const query = `${keywordQuery} is:issue is:open`;
  const token = optionalEnv("GITHUB_TOKEN");
  const response = await fetch(`https://api.github.com/search/issues?${new URLSearchParams({ q: query, per_page: "30" })}`, { signal: AbortSignal.timeout(12_000), headers: { accept: "application/vnd.github+json", "user-agent": "Source/0.1 customer discovery", ...(token ? { authorization: `Bearer ${token}` } : {}) } });
  if (!response.ok) throw new SourceError(`GitHub public issue search returned HTTP ${response.status}.`, 502, "DISCOVERY_PROVIDER_FAILED");
  const payload = (await response.json()) as { items?: Array<Record<string, unknown>> };
  const items = payload.items || [];
  const records = items.flatMap((item) => {
    const url = text(item.html_url);
    const repositoryUrl = text(item.repository_url);
    const title = text(item.title);
    const description = text(item.body) || title;
    if (!url || !title || !description) return [];
    const repository = repositoryUrl.split("/").slice(-2).join("/");
    const labels = Array.isArray(item.labels) ? item.labels.flatMap((label) => label && typeof label === "object" ? [text((label as Record<string, unknown>).name)] : []).filter(Boolean).join(", ") : "";
    const combined = `${title} ${description}`;
    const hasActionableNeed = GITHUB_NEED_PATTERN.test(combined);
    const hasPublicNeedSignal = hasActionableNeed || POTENTIAL_CUSTOMER_NEED_PATTERN.test(combined) || (GITHUB_SIGNAL_LABEL_PATTERN.test(labels) && /user story|acceptance criteria|why this needs a human|objective|i want to|we need|build|develop|implement/i.test(combined));
    const looksInternal = GITHUB_INTERNAL_PATTERN.test(combined);
    if (!hasPublicNeedSignal || GITHUB_PROMOTION_PATTERN.test(combined)) return [];
    const externalIntent = GITHUB_EXTERNAL_BUYING_PATTERN.test(combined);
    return [{ provider: "GitHub", title, description, url, publishedAt: dateValue(item.created_at), type: labels || "public issue", id: text(item.id || url), prospectType: externalIntent ? "active-request" as const : looksInternal ? "research-signal" as const : "potential-customer" as const, buyerIntent: externalIntent ? "confirmed" as const : looksInternal ? "unsupported" as const : "possible" as const, organization: repository || text(item.user && typeof item.user === "object" ? (item.user as Record<string, unknown>).login : "") || undefined }];
  });
  return { records, status: { provider: "GitHub", status: "queried", detail: `${records.length} open public issues returned after local public-need filtering. Internal or blocked work remains visible as research-only; unsupported commercial assumptions are not upgraded.`, query, rawCount: items.length, adapterRejected: items.length - records.length } };
}

async function queryReddit(): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  return { records: [], status: { provider: "Reddit", status: "skipped", detail: "Disabled until authorized commercial API access exists. Source does not scrape Reddit or bypass its access restrictions." } };
}

export function dedupeAndRankOpportunities(raw: RawOpportunity[], profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode) {
  const seen = new Set<string>();
  return raw.flatMap((record) => {
    const key = record.url || `${record.provider}:${record.title.toLowerCase()}`;
    if (seen.has(key)) return [];
    seen.add(key);
    const opportunity = qualifyOpportunity(record, profile, selected, mode);
    return opportunity ? [opportunity] : [];
  }).sort((a, b) => b.score - a.score || (b.publishedAt || "").localeCompare(a.publishedAt || "")).slice(0, 20);
}

export async function discoverOpportunities(profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode) {
  if (!selected.length) throw new SourceError("Select at least one customer type before searching.");
  const productOwner = profile.discoveryObjective === "product-users" || profile.offeringType === "product-owner";
  const effectiveMode: DiscoveryMode = productOwner ? "potential-customers" : mode;
  const activeMode = !productOwner && (effectiveMode === "services" || effectiveMode === "active-requests");
  const results = await Promise.allSettled([
    queryHackerNews(profile, selected, effectiveMode),
    queryContractsFinder(profile),
    activeMode ? queryJobicy(profile) : Promise.resolve({ records: [], status: { provider: "Jobicy", status: "skipped" as const, detail: "Jobicy job listings are active-request sources and were skipped for the potential-customer view.", rawCount: 0, adapterRejected: 0 } }),
    activeMode ? queryRemoteOk(profile) : Promise.resolve({ records: [], status: { provider: "Remote OK", status: "skipped" as const, detail: "Remote OK job listings are active-request sources and were skipped for the potential-customer view.", rawCount: 0, adapterRejected: 0 } }),
    queryGithub(profile),
    queryReddit(),
    activeMode ? querySerpApi(profile, selected[0]) : Promise.resolve({ records: [], status: { provider: "SerpApi", status: "skipped" as const, detail: "SerpApi job search is an active-request source and was skipped for the potential-customer view.", rawCount: 0, adapterRejected: 0 } }),
  ]);
  const statuses: ProviderStatus[] = [];
  const raw: RawOpportunity[] = [];
  const diagnostics: Record<string, DiscoveryProviderDiagnostics> = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      statuses.push(result.value.status);
      raw.push(...result.value.records);
      const rejected: Partial<Record<DiscoveryRejectionReason, number>> = {};
      let qualified = 0;
      for (const record of result.value.records) {
        const evaluation = evaluateOpportunity(record, profile, selected, effectiveMode);
        if (evaluation.opportunity) qualified += 1;
        else if (evaluation.reason) rejected[evaluation.reason] = (rejected[evaluation.reason] || 0) + 1;
      }
      diagnostics[result.value.status.provider] = {
        rawCandidates: result.value.status.rawCount ?? result.value.records.length,
        extractedCandidates: result.value.records.length,
        adapterRejected: result.value.status.adapterRejected ?? 0,
        qualified,
        rejected,
      };
    } else {
      statuses.push({ provider: "Unknown provider", status: "failed", detail: "The provider could not be reached. Other sources were kept separate." });
    }
  }
  const opportunities = dedupeAndRankOpportunities(raw, profile, selected, effectiveMode);
  const tierCounts = opportunities.reduce((counts, opportunity) => {
    const tier = opportunity.prospectType || (opportunity.classification === "potential-buyer-signal-unconfirmed" ? "potential-customer" : opportunity.classification === "research-signal-only" ? "research-signal" : "active-request");
    counts[tier] += 1;
    return counts;
  }, { "active-request": 0, "potential-customer": 0, "research-signal": 0 } as Record<ProspectType, number>);
  return { opportunities, providers: statuses, diagnostics, tierCounts, policy: { freshnessDays: FRESHNESS_DAYS, excluded: ["full-time employment", "unknown employment type", "irrelevant", "expired or stale", "unrelated job feeds for product owners"], mode: effectiveMode, selectedCustomerTypes: selected, sourceBoundary: "Active requests have explicit supplier intent; potential customers have observed need with buying intent possible; research signals show work without defensible external-buying evidence." } };
}
