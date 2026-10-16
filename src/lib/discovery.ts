import { SourceError } from "./errors";
import { optionalEnv } from "./env";
import { normalizeExternalText } from "./text";
import { CUSTOMER_TYPES, type CustomerType, type DiscoveryMode, type Opportunity, type OpportunityClassification, type ProfileDraft, type ProspectType } from "./types";

const FRESHNESS_DAYS: Record<string, number> = { "Hacker News": 21, Jobicy: 30, "Remote OK": 21, GitHub: 45, Reddit: 21, Himalayas: 30, SerpApi: 14 };
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
  organization?: string;
  contactUrl?: string | null;
}

const FULL_TIME_TYPE_PATTERN = /\b(full[- ]?time|permanent|salary|employee|employment)\b/i;
const FULL_TIME_CONTEXT_PATTERN = /\b(full[- ]?time|permanent(?:\s+(?:role|position|job|employment))?|annual\s+salary|salary\s+(?:range|package)|employee\s+benefits|health\s+insurance|paid\s+(?:time off|vacation|sick)|benefits\s+package)\b/i;
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
const POTENTIAL_SIGNAL_PATTERN = /\b(?:feature request|enhancement|help wanted|looking for|seeking|need(?:s)?|recommend(?:ation|ations)?|struggl(?:e|ing)|problem with|how do i|migrat(?:e|ion)|replac(?:e|ing)|launch(?:ed|ing)?|workflow gap|manual process)\b/i;

function text(value: unknown) {
  return typeof value === "string" ? normalizeExternalText(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()) : "";
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

export function classifyOpportunity(record: RawOpportunity, mode: DiscoveryMode): OpportunityClassification {
  const combined = `${record.title} ${record.description} ${record.type}`;
  if (!isFresh(record.provider, record.publishedAt)) return "expired-or-stale";
  if (FULL_TIME_TYPE_PATTERN.test(record.type) || FULL_TIME_CONTEXT_PATTERN.test(combined)) return "full-time-employment";
  if (record.provider === "Hacker News" && /\b(?:looking for|need|seeking)\s+(?:a\s+)?freelancer\b/i.test(combined)) return "explicit-project-request";
  if (CONTRACT_TYPE_PATTERN.test(record.type) || CONTRACT_CONTEXT_PATTERNS.some((pattern) => pattern.test(combined))) return "freelance-or-contract";
  if ((mode === "product" || mode === "potential-customers") && record.prospectType === "potential-customer" && POTENTIAL_SIGNAL_PATTERN.test(combined)) return "potential-buyer-signal-unconfirmed";
  return "unknown-employment-type";
}

function profileTerms(profile: ProfileDraft) {
  const stopWords = new Set(["about", "after", "again", "also", "and", "with", "from", "into", "that", "this", "their", "your", "have", "help", "more", "most", "only", "page", "project", "projects", "service", "services", "work", "works"]);
  const phrases = [
    ...profile.searchKeywords,
    ...profile.skillsAndTechnologies.map((claim) => claim.text),
    ...profile.productsAndServices.map((claim) => claim.text),
  ].map((item) => item.toLowerCase().replace(/[^a-z0-9+#. -]/g, " ").replace(/\s+/g, " ").trim()).filter((item) => item.length >= 3);
  const terms = phrases.flatMap((phrase) => [phrase, ...phrase.split(" ").filter((token) => token.length >= 4 && !stopWords.has(token))]);
  return [...new Set(terms)].slice(0, 36);
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

export function qualifyOpportunity(record: RawOpportunity, profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode): Opportunity | null {
  const combined = `${record.title} ${record.description}`.toLowerCase();
  const classification = classifyOpportunity(record, mode);
  if (!["explicit-project-request", "freelance-or-contract", "potential-buyer-signal-unconfirmed"].includes(classification)) return null;
  const terms = profileTerms(profile);
  const profileMatches = terms.filter((term) => combined.includes(term)).slice(0, 6);
  const categoryMatches = selected.flatMap((category) => CATEGORY_TERMS[category].filter((term) => combined.includes(term))).slice(0, 6);
  if (!profileMatches.length && !categoryMatches.length) return null;
  if (classification === "potential-buyer-signal-unconfirmed" && !profileMatches.length) return null;
  const score = (classification === "explicit-project-request" ? 10 : classification === "freelance-or-contract" ? 8 : 4) + Math.min(profileMatches.length * 2, 12) + Math.min(categoryMatches.length * 2, 8) + (isFresh(record.provider, record.publishedAt) ? 3 : 0);
  const excerpt = record.description.slice(0, 360).trim();
  const prospectType: ProspectType = classification === "potential-buyer-signal-unconfirmed" ? "potential-customer" : "active-request";
  return {
    source: record.provider,
    sourceUrl: record.url,
    title: record.title || "Untitled opportunity",
    description: excerpt || "The source did not provide a description.",
    publishedAt: record.publishedAt,
    classification,
    prospectType,
    organization: record.organization || "Organization not identified by the source",
    observedNeed: excerpt || "The source did not provide a clear need statement.",
    nextStep: prospectType === "potential-customer" ? "Inspect the project signal and verify a legitimate contact route before reaching out." : "Open the original request and decide whether to apply or respond.",
    contactUrl: record.contactUrl || null,
    clientType: inferClientType(combined, selected),
    score,
    profileMatches,
    categoryMatches,
    evidence: [
      `Public evidence: “${excerpt || "The source did not provide a usable excerpt."}”`,
      profileMatches.length ? `Profile terms found in source text: ${profileMatches.join(", ")}.` : "No direct profile keyword overlap was found.",
      categoryMatches.length ? `Customer category language found in source text: ${categoryMatches.join(", ")}.` : "The source does not explicitly identify a selected customer category.",
      classification === "potential-buyer-signal-unconfirmed" ? "Buying intent is inferred, not explicit. Treat this as a public signal to investigate, not a promise of work." : `The source text supports the classification: ${classification.replaceAll("-", " ")}.`,
    ],
    budgetSignal: budgetSignal(`${record.title} ${record.description}`),
    contactSignal: /\b(apply|application|contact|email|submit|reach out)\b/i.test(combined),
    attribution: `Source data from ${record.provider}. Open the original listing before acting.`,
    providerRecordId: record.id,
  };
}

async function queryHackerNews(profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const categoryQuery = selected.flatMap((category) => CATEGORY_TERMS[category].slice(0, 2)).join(" ");
  const skillQuery = profile.searchKeywords.slice(0, 3).join(" ");
  const phrase = mode === "services" || mode === "active-requests" ? '"looking for a freelancer" OR "need a freelancer" OR "seeking a freelancer"' : '"looking for" OR seeking OR recommendation OR struggling';
  const query = `${phrase} ${skillQuery} ${categoryQuery}`.trim();
  const url = `https://hn.algolia.com/api/v1/search_by_date?${new URLSearchParams({ query, tags: "comment", hitsPerPage: "50" })}`;
  const payload = (await fetchJson(url)) as { hits?: Array<Record<string, unknown>> };
  const records = (payload.hits || []).flatMap((hit) => {
    const objectId = text(hit.objectID);
    const description = text(hit.comment_text || hit.story_title || hit.title);
    if (!objectId || !description) return [];
    return [{ provider: "Hacker News", title: text(hit.story_title) || "Hacker News community discussion", description, url: `https://news.ycombinator.com/item?id=${objectId}`, publishedAt: dateValue(hit.created_at || hit.created_at_i), type: "comment", id: objectId, prospectType: (mode === "services" || mode === "active-requests" ? "active-request" : "potential-customer") as ProspectType }];
  });
  return { records, status: { provider: "Hacker News", status: "queried", detail: `${records.length} public comments returned.`, query } };
}

async function queryJobicy(profile: ProfileDraft): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const tag = profile.searchKeywords[0] || "freelance";
  const query = `tag=${tag}`;
  const payload = (await fetchJson(`https://jobicy.com/api/v2/remote-jobs?${new URLSearchParams({ count: "50", tag })}`)) as Record<string, unknown>;
  const jobs = ["jobs", "jobListings", "data", "results"].flatMap((key) => Array.isArray(payload[key]) ? payload[key] : []).filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
  const records = jobs.flatMap((job) => {
    const url = text(job.url || job.jobUrl || job.link);
    const title = text(job.title || job.position || job.jobTitle);
    if (!url || !title) return [];
    return [{ provider: "Jobicy", title, description: text(job.description || job.jobDescription || job.excerpt), url, publishedAt: dateValue(job.pubDate || job.published || job.publishedAt || job.date), type: text(job.jobType || job.employmentType), id: text(job.id || url), prospectType: "active-request" as const, organization: text(job.company || job.companyName || job.organization) || undefined, contactUrl: text(job.applyUrl || job.applicationUrl) || null }];
  });
  return { records, status: { provider: "Jobicy", status: "queried", detail: `${records.length} public records returned. Contract status is rechecked from source fields.`, query } };
}

async function queryRemoteOk(): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const payload = (await fetchJson("https://remoteok.com/api?tag=dev")) as Array<Record<string, unknown>>;
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
  const records = (payload.items || []).flatMap((item) => {
    const url = text(item.html_url);
    const repositoryUrl = text(item.repository_url);
    const title = text(item.title);
    const description = text(item.body) || title;
    if (!url || !title || !description) return [];
    const repository = repositoryUrl.split("/").slice(-2).join("/");
    const labels = Array.isArray(item.labels) ? item.labels.flatMap((label) => label && typeof label === "object" ? [text((label as Record<string, unknown>).name)] : []).filter(Boolean).join(", ") : "";
    if (!/(?:help wanted|enhancement|feature request)/i.test(labels)) return [];
    return [{ provider: "GitHub", title, description, url, publishedAt: dateValue(item.created_at), type: labels || "public issue", id: text(item.id || url), prospectType: "potential-customer" as const, organization: repository || text(item.user && typeof item.user === "object" ? (item.user as Record<string, unknown>).login : "") || undefined }];
  });
  return { records, status: { provider: "GitHub", status: "queried", detail: `${records.length} open public issues returned after local signal-label filtering. Potential-customer labels are inferred from public project signals.`, query } };
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
  const activeMode = mode === "services" || mode === "active-requests";
  const results = await Promise.allSettled([
    queryHackerNews(profile, selected, mode),
    activeMode ? queryJobicy(profile) : Promise.resolve({ records: [], status: { provider: "Jobicy", status: "skipped" as const, detail: "Jobicy job listings are active-request sources and were skipped for the potential-customer view." } }),
    activeMode ? queryRemoteOk() : Promise.resolve({ records: [], status: { provider: "Remote OK", status: "skipped" as const, detail: "Remote OK job listings are active-request sources and were skipped for the potential-customer view." } }),
    queryGithub(profile),
    queryReddit(),
    activeMode ? querySerpApi(profile, selected[0]) : Promise.resolve({ records: [], status: { provider: "SerpApi", status: "skipped" as const, detail: "SerpApi job search is an active-request source and was skipped for the potential-customer view." } }),
  ]);
  const statuses: ProviderStatus[] = [];
  const raw: RawOpportunity[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      statuses.push(result.value.status);
      raw.push(...result.value.records);
    } else {
      statuses.push({ provider: "Unknown provider", status: "failed", detail: "The provider could not be reached. Other sources were kept separate." });
    }
  }
  const opportunities = dedupeAndRankOpportunities(raw, profile, selected, mode);
  return { opportunities, providers: statuses, policy: { freshnessDays: FRESHNESS_DAYS, excluded: ["full-time employment", "unknown employment type", "irrelevant", "expired or stale"], mode, selectedCustomerTypes: selected, sourceBoundary: "Potential customers are public signals, not confirmed buying intent." } };
}
