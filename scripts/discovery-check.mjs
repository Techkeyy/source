import { existsSync } from "node:fs";

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const clean = (value) => typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
const toDate = (value) => {
  if (typeof value === "number") return new Date(value > 10_000_000_000 ? value : value * 1000);
  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
};
const freshnessDays = { "Hacker News": 21, Jobicy: 30, "Remote OK": 21, SerpApi: 14 };
const classificationNames = ["explicit-project-request", "freelance-or-contract", "potential-buyer-signal-unconfirmed", "full-time-employment", "irrelevant", "expired-or-stale"];

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000), headers: { accept: "application/json", "user-agent": "Source/0.1 discovery probe", ...headers } });
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}

function classify(provider, title, description, type, publishedAt) {
  const combined = (title + " " + description + " " + type).toLowerCase();
  const date = toDate(publishedAt);
  const age = date ? Date.now() - date.getTime() : Number.POSITIVE_INFINITY;
  if (!date || age < 0 || age > (freshnessDays[provider] || 14) * 86_400_000) return "expired-or-stale";
  if (/full[- ]?time|permanent|salary|employee/.test(type.toLowerCase()) || /full[- ]time employment|full[- ]time role/.test(combined)) return "full-time-employment";
  if (provider === "Hacker News" && /seek(?:ing|s)\s+freelancer|looking for (?:a|an) freelancer|need (?:a|an) freelancer/.test(combined)) return "explicit-project-request";
  if (/freelance|contractor|contract|project[- ]based|part[- ]time contract/.test(combined)) return "freelance-or-contract";
  if (/looking for|seeking|need|wanted|hiring/.test(combined)) return "potential-buyer-signal-unconfirmed";
  return "irrelevant";
}

function summarize(provider, records) {
  const counts = Object.fromEntries(classificationNames.map((name) => [name, 0]));
  for (const record of records) counts[classify(provider, record.title, record.description, record.type, record.publishedAt)] += 1;
  return { provider, fetched: records.length, counts };
}

const providers = [];
try {
  const query = new URLSearchParams({ query: "SEEKING FREELANCER", tags: "comment", hitsPerPage: "50" });
  const payload = await fetchJson("https://hn.algolia.com/api/v1/search_by_date?" + query);
  const records = (payload.hits || []).map((hit) => ({ title: clean(hit.story_title) || "Hacker News freelancer discussion", description: clean(hit.comment_text || hit.story_title || hit.title), type: "comment", publishedAt: hit.created_at || hit.created_at_i })).filter((record) => record.description);
  providers.push(summarize("Hacker News", records));
} catch (error) {
  providers.push({ provider: "Hacker News", status: "failed", message: error.message });
}

try {
  const payload = await fetchJson("https://jobicy.com/api/v2/remote-jobs?count=50&tag=typescript");
  const jobs = ["jobs", "jobListings", "data", "results"].flatMap((key) => Array.isArray(payload?.[key]) ? payload[key] : []);
  const records = jobs.map((job) => ({ title: clean(job.title || job.position || job.jobTitle), description: clean(job.description || job.jobDescription || job.excerpt), type: clean(job.jobType || job.employmentType), publishedAt: job.pubDate || job.published || job.publishedAt || job.date })).filter((record) => record.title);
  providers.push(summarize("Jobicy", records));
} catch (error) {
  providers.push({ provider: "Jobicy", status: "failed", message: error.message });
}

try {
  const payload = await fetchJson("https://remoteok.com/api?tag=dev");
  const records = (Array.isArray(payload) ? payload : []).map((job) => ({ title: clean(job.position || job.title), description: clean(job.description), type: clean(job.job_type || job.type), publishedAt: job.date || job.created_at })).filter((record) => record.title);
  providers.push(summarize("Remote OK", records));
} catch (error) {
  providers.push({ provider: "Remote OK", status: "failed", message: error.message });
}

if (process.env.SERPAPI_KEY?.trim()) {
  try {
    const query = new URLSearchParams({ engine: "google_jobs", q: "freelance web development startup", api_key: process.env.SERPAPI_KEY });
    const payload = await fetchJson("https://serpapi.com/search.json?" + query);
    const records = (payload.jobs_results || []).map((job) => ({ title: clean(job.title), description: clean(job.description), type: clean(job.schedule_type || job.employment_type), publishedAt: job.detected_extensions?.posted_at })).filter((record) => record.title);
    providers.push(summarize("SerpApi", records));
  } catch (error) {
    providers.push({ provider: "SerpApi", status: "failed", message: error.message });
  }
} else {
  providers.push({ provider: "SerpApi", status: "skipped", reason: "SERPAPI_KEY is not configured; no paid request was made." });
}

const queried = providers.filter((provider) => provider.status !== "failed" && provider.status !== "skipped");
const pass = queried.length > 0;
console.log(JSON.stringify({ status: pass ? "pass" : "fail", queriedProviders: queried.length, providers, policy: { freshnessDays, selectedCustomerTypes: ["small-businesses", "startups", "agencies", "individuals"], note: "This probe reports public source signals; it does not claim that every record is a verified job or paying client." } }));
if (!pass) process.exitCode = 1;
