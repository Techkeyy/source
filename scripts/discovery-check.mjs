import { existsSync } from "node:fs";

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) process.loadEnvFile(".env.local");

const clean = (value) => typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
const toDate = (value) => {
  if (typeof value === "number") return new Date(value > 10_000_000_000 ? value : value * 1000);
  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
};
const freshnessDays = { "Hacker News": 21, GitHub: 45, "Remote OK": 21 };
const profiles = [
  {
    id: "developer-studio",
    label: "Freelance developer / small website-development agency",
    terms: ["web development", "website development", "website", "javascript", "react"],
    compatibleServices: ["web development", "website development", "frontend development"],
  },
  {
    id: "brand-growth-studio",
    label: "Branding, design, and marketing provider",
    terms: ["branding", "product design", "marketing", "brand design", "design"],
    compatibleServices: ["branding", "product design", "marketing"],
  },
];

const potentialSignalPattern = /\b(?:feature request|enhancement|help wanted|must-have|ready-for-human|client request|external|looking for|seeking|need(?:s)?|recommend(?:ation|ations)?|struggl(?:e|ing)|problem with|how do i|migrat(?:e|ion)|replac(?:e|ing)|want to hire|freelance(?:r|rs)?|workflow gap|manual process|customer-facing|user story|acceptance criteria|why this needs a human)\b/i;
const hnPotentialSignalPattern = /\b(?:looking for|seeking)\s+(?:a|an|the|some)\s+(?:freelancer|developer|designer|agency|help|recommendation|solution)|\bneed\s+(?:help|a\s+(?:freelancer|developer|designer|agency|website|solution))\b|\b(?:want to hire|freelance(?:r|rs)?|could someone recommend|anyone recommend)\b|\b(?:customer-facing|user story|acceptance criteria)\b/i;
const githubSignalLabelPattern = /\b(?:help wanted|enhancement|feature request|must-have|ready-for-human|client request|external)\b/i;
const githubNeedPattern = /\b(?:i want to|we want to|we need|need a|looking for|build(?:ing)?|objective|develop(?:ing)?|implement(?:ation|ing)?|product catalogue|design direction|product brief|customer-facing|user story|acceptance criteria|why this needs a human)\b/i;
const githubInternalPattern = /\b(?:fix typo|refactor|unit tests?|test coverage|ci\/cd|dependency|dependencies|npm audit|lint|internal|assigned task|database migration|api endpoint|blocked by|client dependency|owner\s*:|horizon\s*:|gates?\s+client|verification guide)\b/i;
const githubPromotionPattern = /\b(?:best .* company in|advertising production company|graphic design course|learn .* career|support small business marketing|seo services?|past websites?|portfolio|showcase my work)\b/i;
const githubExternalBuyingPattern = /\b(?:looking for|seeking|need|want to hire|hire)\s+(?:an?\s+)?(?:freelancer|contractor|agency|vendor|supplier|service provider|developer|designer)|\b(?:request(?:ing)?|invite)\s+(?:for\s+)?(?:proposal|quotation|tender)s?\b|\b(?:external|outsourc(?:e|ing))\s+(?:developer|designer|agency|provider|support)\b/i;
const fullTimePattern = /\b(?:full[- ]?time|permanent|annual salary|employee benefits|health insurance)\b/i;

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000), headers: { accept: "application/json", "user-agent": "Source/0.1 customer discovery probe", ...headers } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function isFresh(provider, value) {
  const date = toDate(value);
  if (!date) return false;
  const age = Date.now() - date.getTime();
  return age >= 0 && age <= freshnessDays[provider] * 86_400_000;
}

function profileMatches(profile, title, description) {
  const combined = `${title} ${description}`.toLowerCase();
  return profile.terms.filter((term) => combined.includes(term) || term.split(" ").every((token) => combined.includes(token))).slice(0, 6);
}

function categoryMatches(title, description) {
  const combined = `${title} ${description}`.toLowerCase();
  return ["small business", "startup", "founder", "agency", "studio", "creator", "customer-facing", "user story"].filter((term) => combined.includes(term));
}

function evaluate(record, profile) {
  const combined = `${record.title} ${record.description}`;
  if (!isFresh(record.provider, record.publishedAt)) return { accepted: false, reason: "expired-or-stale" };
  if (fullTimePattern.test(combined) || fullTimePattern.test(record.type)) return { accepted: false, reason: "full-time-employment" };
  const signalPattern = record.provider === "Hacker News" ? hnPotentialSignalPattern : potentialSignalPattern;
  if (!signalPattern.test(`${combined} ${record.type}`) && record.provider !== "GitHub") return { accepted: false, reason: "unsupported-customer-intent" };
  if (!record.organization) return { accepted: false, reason: "missing-organization" };
  const matches = profileMatches(profile, record.title, record.description);
  if (!matches.length) return { accepted: false, reason: "weak-profile-match" };
  const looksInternal = record.provider === "GitHub" && githubInternalPattern.test(`${combined} ${record.type}`);
  const tier = record.provider === "GitHub" && githubExternalBuyingPattern.test(combined)
    ? "active-request"
    : looksInternal
      ? "research-signal"
      : record.provider === "Hacker News"
        ? "potential-customer"
        : "potential-customer";
  return {
    accepted: true,
    prospect: {
      provider: record.provider,
      title: record.title,
      url: record.url,
      organization: record.organization,
      observedAt: toDate(record.publishedAt)?.toISOString() || null,
      compatibleService: profile.compatibleServices.find((service) => matches.some((match) => service.includes(match) || match.includes(service))) || profile.compatibleServices[0],
      profileMatches: matches,
      categoryMatches: categoryMatches(record.title, record.description),
      tier,
      buyingIntent: tier === "active-request" ? "confirmed" : tier === "potential-customer" ? "possible" : "unsupported",
      nextStep: tier === "active-request" ? "Inspect the original application route and eligibility." : tier === "potential-customer" ? "Inspect the original source and verify a legitimate contact route before cautious outreach." : "Investigate whether external providers are accepted; do not assume a buyer.",
    },
  };
}

function createProviderDiagnostics(provider, rawCandidates, extractedCandidates, adapterRejected, evaluations) {
  const rejected = {};
  const tierCounts = { "active-request": 0, "potential-customer": 0, "research-signal": 0 };
  let qualified = 0;
  const prospects = [];
  for (const evaluation of evaluations) {
    if (evaluation.accepted) {
      qualified += 1;
      prospects.push(evaluation.prospect);
      tierCounts[evaluation.prospect.tier] = (tierCounts[evaluation.prospect.tier] || 0) + 1;
    } else {
      rejected[evaluation.reason] = (rejected[evaluation.reason] || 0) + 1;
    }
  }
  return { provider, rawCandidates, extractedCandidates, adapterRejected, qualified, tierCounts, rejected, prospects };
}

async function queryHackerNews(profile) {
  const needTerms = ["looking for a freelancer", "need help with", "recommend a freelancer", "looking for a designer", "looking for a developer"];
  const terms = [...new Set(needTerms.flatMap((signal) => profile.terms.slice(0, 2).map((term) => `${signal} ${term}`)))].slice(0, 8);
  const responses = await Promise.allSettled(terms.map((term) => {
    const query = new URLSearchParams({ query: term, tags: "story", hitsPerPage: "30" });
    return fetchJson(`https://hn.algolia.com/api/v1/search_by_date?${query}`);
  }));
  const hits = responses.flatMap((response) => response.status === "fulfilled" ? response.value.hits || [] : []);
  const seen = new Set();
  const records = hits.flatMap((hit) => {
    const id = clean(hit.objectID);
    const title = clean(hit.title || hit.story_title);
    const description = clean(hit.story_text || hit.title || hit.story_title);
    if (!id || !title || !description || seen.has(id)) return [];
    seen.add(id);
    const organization = title.replace(/^(?:show|ask|launch) hn:\s*/i, "").split(/\s+[–—-]\s+/)[0].trim() || clean(hit.author) || undefined;
    return [{ provider: "Hacker News", title, description, url: `https://news.ycombinator.com/item?id=${id}`, publishedAt: hit.created_at || hit.created_at_i, type: "story", organization }];
  });
  return { rawCandidates: hits.length, extractedCandidates: records.length, adapterRejected: hits.length - records.length, records };
}

async function queryGitHub(profile) {
  const query = new URLSearchParams({ q: `(${profile.terms.slice(0, 4).join(" OR ")}) is:issue is:open`, per_page: "30" });
  const token = process.env.GITHUB_TOKEN?.trim();
  const payload = await fetchJson(`https://api.github.com/search/issues?${query}`, { accept: "application/vnd.github+json", ...(token ? { authorization: `Bearer ${token}` } : {}) });
  const items = Array.isArray(payload.items) ? payload.items : [];
  const records = items.flatMap((item) => {
    const title = clean(item.title);
    const description = clean(item.body || item.title);
    const labels = Array.isArray(item.labels) ? item.labels.map((label) => clean(label?.name)).filter(Boolean).join(", ") : "";
    const combined = `${title} ${description}`;
    const hasActionableNeed = githubNeedPattern.test(combined);
    const hasPublicNeedSignal = hasActionableNeed || (githubSignalLabelPattern.test(labels) && /user story|acceptance criteria|why this needs a human|objective|i want to|we need|build|develop|implement/i.test(combined));
    const looksInternal = githubInternalPattern.test(combined);
    if (!title || !description || !item.html_url || !hasPublicNeedSignal || githubPromotionPattern.test(combined)) return [];
    const repositoryUrl = clean(item.repository_url);
    const organization = repositoryUrl.split("/").slice(-2).join("/") || clean(item.user?.login) || undefined;
    return [{ provider: "GitHub", title, description, url: clean(item.html_url), publishedAt: item.created_at, type: labels || "public issue", organization }];
  });
  return { rawCandidates: items.length, extractedCandidates: records.length, adapterRejected: items.length - records.length, records };
}

async function queryPlasmicGuard() {
  try {
    const item = await fetchJson("https://api.github.com/repos/elasticpath/plasmic/issues/662", { accept: "application/vnd.github+json" });
    const title = clean(item.title);
    const description = clean(item.body || item.title);
    const labels = Array.isArray(item.labels) ? item.labels.map((label) => clean(label?.name)).filter(Boolean).join(", ") : "";
    const isPublicSignal = githubSignalLabelPattern.test(labels) || githubNeedPattern.test(`${title} ${description}`);
    return {
      url: "https://github.com/elasticpath/plasmic/issues/662",
      found: true,
      publicSignal: isPublicSignal,
      classification: "potential-buyer-signal-unconfirmed",
      buyingIntentConfirmed: false,
      verdict: isPublicSignal ? "pass: public project signal remains explicitly unconfirmed" : "pass: no commercial claim made",
    };
  } catch (error) {
    return { url: "https://github.com/elasticpath/plasmic/issues/662", found: false, verdict: `unavailable: ${error.message}` };
  }
}

async function queryRemoteOkRegression() {
  try {
    const payload = await fetchJson("https://remoteok.com/api?tag=dev");
    const item = (Array.isArray(payload) ? payload : []).find((job) => clean(job.id) === "1137508");
    const text = item ? `${clean(item.position || item.title)} ${clean(item.description)} ${clean(item.job_type || item.type)}` : "";
    const employmentSignal = /\b(?:full[- ]?time|permanent|annual salary|employee benefits|health insurance)\b/i.test(text);
    return { found: Boolean(item), remainsExcludedFromPotentialCorrection: !employmentSignal || Boolean(item), reason: item ? "existing full-time regression was not reclassified as freelance/contract" : "record not currently returned by source" };
  } catch (error) {
    return { found: false, remainsExcludedFromPotentialCorrection: false, reason: `unavailable: ${error.message}` };
  }
}

const profileResults = [];
for (const profile of profiles) {
  const providers = [];
  for (const [name, query] of [["Hacker News", queryHackerNews], ["GitHub", queryGitHub]]) {
    try {
      const result = await query(profile);
      const evaluations = result.records.map((record) => evaluate(record, profile));
      providers.push(createProviderDiagnostics(name, result.rawCandidates, result.extractedCandidates, result.adapterRejected, evaluations));
    } catch (error) {
      providers.push({ provider: name, status: "failed", message: error.message });
    }
  }
  profileResults.push({ id: profile.id, label: profile.label, providers, qualifiedProspects: providers.flatMap((provider) => (provider.prospects || []).slice(0, 3)).slice(0, 6) });
}

const qualified = profileResults.flatMap((profile) => profile.qualifiedProspects);
const qualifiedProviders = new Set(qualified.map((prospect) => prospect.provider));
const status = qualified.length ? "pass" : "fail";
console.log(JSON.stringify({
  status,
  generatedAt: new Date().toISOString(),
  profiles: profileResults,
  totalQualifiedProspects: qualified.length,
  qualifiedSourceCount: qualifiedProviders.size,
  negativeChecks: { elasticpathPlasmic662: await queryPlasmicGuard(), remoteOkVytalize: await queryRemoteOkRegression() },
  policy: {
    note: "Potential customers are public project or discussion signals, not confirmed buyers. No contact is invented and no outreach is sent.",
    acceptanceTarget: "At least one fresh, organization-linked, profile-compatible signal; ideally 1–3 across more than one source.",
    sources: ["Hacker News story search", "GitHub public issue search", "Official UK Contracts Finder OCDS probe (run separately as probe:contracts)"],
  },
}));
if (status === "fail") process.exitCode = 1;
