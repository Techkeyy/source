import { SourceError } from "./errors";
import { optionalEnv } from "./env";
import { CUSTOMER_TYPES, type CustomerType, type DiscoveryMode, type Opportunity, type OpportunityClassification, type ProfileDraft } from "./types";

const FRESHNESS_DAYS: Record<string, number> = { "Hacker News": 21, Jobicy: 30, "Remote OK": 21, Himalayas: 30, SerpApi: 14 };
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

interface RawOpportunity {
  provider: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string | null;
  type: string;
  id?: string;
}

function text(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
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
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000), headers: { accept: "application/json", "user-agent": "Source/0.1 opportunity discovery" } });
  if (!response.ok) throw new SourceError(`A discovery source returned HTTP ${response.status}.`, 502, "DISCOVERY_PROVIDER_FAILED");
  return response.json() as Promise<unknown>;
}

function isFresh(provider: string, publishedAt: string | null) {
  if (!publishedAt) return false;
  const age = Date.now() - new Date(publishedAt).getTime();
  return age >= 0 && age <= FRESHNESS_DAYS[provider] * 24 * 60 * 60 * 1000;
}

function classify(record: RawOpportunity, mode: DiscoveryMode): OpportunityClassification {
  const combined = `${record.title} ${record.description} ${record.type}`.toLowerCase();
  if (!isFresh(record.provider, record.publishedAt)) return "expired-or-stale";
  if (/\b(full[- ]?time|permanent|salary|employee)\b/i.test(record.type) || /full[- ]time employment|full[- ]time role/i.test(combined)) return "full-time-employment";
  if (record.provider === "Hacker News" && /seek(?:ing|s)\s+freelancer|looking for (?:a|an) freelancer|need (?:a|an) freelancer/i.test(combined)) return "explicit-project-request";
  if (/\b(freelance|contractor|contract|project[- ]based|part[- ]time contract)\b/i.test(combined)) return "freelance-or-contract";
  if (mode === "product" && /\b(looking for|seeking|need|wanted|hiring)\b/i.test(combined)) return "potential-buyer-signal-unconfirmed";
  return "irrelevant";
}

function profileTerms(profile: ProfileDraft) {
  return [...new Set([
    ...profile.searchKeywords,
    ...profile.skillsAndTechnologies.map((claim) => claim.text),
    ...profile.productsAndServices.map((claim) => claim.text),
  ].map((item) => item.toLowerCase().replace(/[^a-z0-9+#. -]/g, " ").trim()).filter((item) => item.length >= 3))].slice(0, 24);
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

function toOpportunity(record: RawOpportunity, profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode): Opportunity | null {
  const combined = `${record.title} ${record.description}`.toLowerCase();
  const classification = classify(record, mode);
  if (!["explicit-project-request", "freelance-or-contract", "potential-buyer-signal-unconfirmed"].includes(classification)) return null;
  const terms = profileTerms(profile);
  const profileMatches = terms.filter((term) => combined.includes(term)).slice(0, 6);
  const categoryMatches = selected.flatMap((category) => CATEGORY_TERMS[category].filter((term) => combined.includes(term))).slice(0, 6);
  const score = (classification === "explicit-project-request" ? 10 : classification === "freelance-or-contract" ? 8 : 4) + Math.min(profileMatches.length * 2, 12) + Math.min(categoryMatches.length * 2, 8) + (isFresh(record.provider, record.publishedAt) ? 3 : 0);
  const excerpt = record.description.slice(0, 360).trim();
  return {
    source: record.provider,
    sourceUrl: record.url,
    title: record.title || "Untitled opportunity",
    description: excerpt || "The source did not provide a description.",
    publishedAt: record.publishedAt,
    classification,
    clientType: inferClientType(combined, selected),
    score,
    profileMatches,
    categoryMatches,
    evidence: [
      profileMatches.length ? `Profile terms found in source text: ${profileMatches.join(", ")}.` : "No direct profile keyword overlap was found.",
      categoryMatches.length ? `Customer category language found in source text: ${categoryMatches.join(", ")}.` : "The source does not explicitly identify a selected customer category.",
      classification === "potential-buyer-signal-unconfirmed" ? "Buying intent is unconfirmed. Treat this as a public signal to investigate, not a promise of work." : `The source text supports the classification: ${classification.replaceAll("-", " ")}.`,
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
  const phrase = mode === "services" ? "SEEKING FREELANCER" : "looking for";
  const query = `${phrase} ${skillQuery} ${categoryQuery}`.trim();
  const url = `https://hn.algolia.com/api/v1/search_by_date?${new URLSearchParams({ query, tags: "comment", hitsPerPage: "50" })}`;
  const payload = (await fetchJson(url)) as { hits?: Array<Record<string, unknown>> };
  const records = (payload.hits || []).flatMap((hit) => {
    const objectId = text(hit.objectID);
    const description = text(hit.comment_text || hit.story_title || hit.title);
    if (!objectId || !description) return [];
    return [{ provider: "Hacker News", title: text(hit.story_title) || "Hacker News freelancer discussion", description, url: `https://news.ycombinator.com/item?id=${objectId}`, publishedAt: dateValue(hit.created_at || hit.created_at_i), type: "comment", id: objectId }];
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
    return [{ provider: "Jobicy", title, description: text(job.description || job.jobDescription || job.excerpt), url, publishedAt: dateValue(job.pubDate || job.published || job.publishedAt || job.date), type: text(job.jobType || job.employmentType), id: text(job.id || url) }];
  });
  return { records, status: { provider: "Jobicy", status: "queried", detail: `${records.length} public records returned. Contract status is rechecked from source fields.`, query } };
}

async function queryRemoteOk(): Promise<{ records: RawOpportunity[]; status: ProviderStatus }> {
  const payload = (await fetchJson("https://remoteok.com/api?tag=dev")) as Array<Record<string, unknown>>;
  const records = payload.filter((item) => item && typeof item === "object").flatMap((job) => {
    const url = text(job.url || (job.id ? `https://remoteok.com/remote-jobs/${text(job.id)}` : ""));
    const title = text(job.position || job.title);
    if (!url || !title) return [];
    return [{ provider: "Remote OK", title, description: text(job.description), url, publishedAt: dateValue(job.date || job.created_at), type: text(job.job_type || job.type), id: text(job.id || url) }];
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
    return [{ provider: "SerpApi", title, description: text(job.description), url, publishedAt: dateValue(job.detected_extensions && typeof job.detected_extensions === "object" ? (job.detected_extensions as Record<string, unknown>).posted_at : null), type: text(job.schedule_type || job.employment_type), id: url }];
  });
  return { records, status: { provider: "SerpApi", status: "queried", detail: `${records.length} Google Jobs records returned.`, query } };
}

export async function discoverOpportunities(profile: ProfileDraft, selected: CustomerType[], mode: DiscoveryMode) {
  if (!selected.length) throw new SourceError("Select at least one customer type before searching.");
  const results = await Promise.allSettled([queryHackerNews(profile, selected, mode), queryJobicy(profile), queryRemoteOk(), querySerpApi(profile, selected[0])]);
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
  const seen = new Set<string>();
  const opportunities = raw.flatMap((record) => {
    const key = record.url || `${record.provider}:${record.title.toLowerCase()}`;
    if (seen.has(key)) return [];
    seen.add(key);
    const opportunity = toOpportunity(record, profile, selected, mode);
    return opportunity ? [opportunity] : [];
  }).sort((a, b) => b.score - a.score || (b.publishedAt || "").localeCompare(a.publishedAt || "")).slice(0, 20);
  return { opportunities, providers: statuses, policy: { freshnessDays: FRESHNESS_DAYS, excluded: ["full-time employment", "irrelevant", "expired or stale"], mode, selectedCustomerTypes: selected } };
}
