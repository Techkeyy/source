import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { ObjectId, MongoClient } from "mongodb";

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) process.loadEnvFile(".env.local");

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const runId = randomUUID();
const emails = [`source-core-a-${runId}@example.test`, `source-core-b-${runId}@example.test`];
const password = `Source-${runId}-Integration!`;
const jars = [new Map(), new Map()];
const state = { userIds: [], profile: null, startupSearch: null, smallBusinessSearch: null, savedId: null, proposal: null };

function cookieHeader(jar) {
  return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
}

function rememberCookies(response, jar) {
  for (const value of response.headers.getSetCookie?.() || []) {
    const pair = value.split(";")[0];
    const separator = pair.indexOf("=");
    if (separator > 0) jar.set(pair.slice(0, separator), pair.slice(separator + 1));
  }
}

async function request(path, options = {}, jar = new Map()) {
  const headers = new Headers(options.headers || {});
  if (options.body !== undefined) headers.set("content-type", "application/json");
  const cookies = cookieHeader(jar);
  if (cookies) headers.set("cookie", cookies);
  const response = await fetch(baseUrl + path, { ...options, headers, signal: AbortSignal.timeout(120_000) });
  rememberCookies(response, jar);
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function groundedClaimCount(profile) {
  return ["productsAndServices", "problemsSolved", "skillsAndTechnologies", "valueProposition", "differentiators", "portfolioEvidence", "customerSegments", "buyerIntentSignals"]
    .flatMap((key) => Array.isArray(profile?.[key]) ? profile[key] : [])
    .filter((claim) => Array.isArray(claim?.evidence) && claim.evidence.length > 0).length;
}

function providerQuery(result, provider) {
  return result?.providers?.find((item) => item.provider === provider)?.query || null;
}

function summarizeSearch(result) {
  return {
    opportunityCount: result?.opportunities?.length || 0,
    providers: (result?.providers || []).map((item) => ({ provider: item.provider, status: item.status, queryPresent: Boolean(item.query) })),
    policy: result?.policy || null,
    relevantCount: (result?.opportunities || []).filter((item) => item.profileMatches?.length > 0 && ["explicit-project-request", "freelance-or-contract"].includes(item.classification)).length,
  };
}

async function cleanup() {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) return { status: "skipped" };
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8_000 });
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const users = await db.collection("users").find({ email: { $in: emails } }).project({ _id: 1 }).toArray();
    const ids = users.map((record) => record._id);
    if (ids.length) {
      await db.collection("profiles").deleteMany({ userId: { $in: ids } });
      await db.collection("opportunities").deleteMany({ userId: { $in: ids } });
    }
    await db.collection("users").deleteMany({ email: { $in: emails } });
    return { status: "pass", deletedTestAccounts: emails.length };
  } finally {
    await client.close().catch(() => undefined);
  }
}

try {
  assert(process.env.INFERENCE_PROVIDER === "deepseek", "INFERENCE_PROVIDER is not deepseek");
  assert(process.env.DEEPSEEK_MODEL === "deepseek-flash", "DEEPSEEK_MODEL is not deepseek-flash");

  const firstRegistration = await request("/api/auth/register", { method: "POST", body: JSON.stringify({ email: emails[0], displayName: "Source Core Test A", password }) }, jars[0]);
  assert(firstRegistration.response.status === 201, `registration returned HTTP ${firstRegistration.response.status}`);
  assert(ObjectId.isValid(firstRegistration.data?.user?.id), "registration did not return a user id");
  state.userIds.push(firstRegistration.data.user.id);

  const meAfterRegistration = await request("/api/auth/me", {}, jars[0]);
  assert(meAfterRegistration.response.ok && meAfterRegistration.data?.user?.id === state.userIds[0], "authenticated session was not recovered");

  const analysis = await request("/api/profile/analyze", { method: "POST", body: JSON.stringify({ url: "https://www.frog.co/" }) }, jars[0]);
  assert(analysis.response.ok, `profile analysis returned HTTP ${analysis.response.status}`);
  assert(analysis.data?.analysis?.provider === "deepseek", `profile analysis provider was ${analysis.data?.analysis?.provider || "missing"}`);
  assert(analysis.data?.analysis?.model === "deepseek-flash", `profile analysis model was ${analysis.data?.analysis?.model || "missing"}`);
  assert(typeof analysis.data?.profile?.businessName === "string" && analysis.data.profile.businessName.length > 0, "profile has no business name");
  assert(typeof analysis.data?.profile?.summary === "string" && analysis.data.profile.summary.length > 0, "profile has no summary");
  assert(groundedClaimCount(analysis.data.profile) >= 1, "profile contains no grounded claims");
  state.profile = { ...analysis.data.profile, summary: `${analysis.data.profile.summary} Integration review confirmed.` };

  const confirmation = await request("/api/profile/confirm", { method: "POST", body: JSON.stringify({ profile: state.profile }) }, jars[0]);
  assert(confirmation.response.ok && confirmation.data?.saved === true, `profile confirmation returned HTTP ${confirmation.response.status}`);

  const startupSearch = await request("/api/opportunities/search", { method: "POST", body: JSON.stringify({ customerTypes: ["startups"], mode: "services" }) }, jars[0]);
  assert(startupSearch.response.ok, `startup discovery returned HTTP ${startupSearch.response.status}`);
  assert(JSON.stringify(startupSearch.data?.policy?.selectedCustomerTypes) === JSON.stringify(["startups"]), "startup customer selection was not preserved");
  state.startupSearch = startupSearch.data;

  const smallBusinessSearch = await request("/api/opportunities/search", { method: "POST", body: JSON.stringify({ customerTypes: ["small-businesses"], mode: "services" }) }, jars[0]);
  assert(smallBusinessSearch.response.ok, `small-business discovery returned HTTP ${smallBusinessSearch.response.status}`);
  assert(JSON.stringify(smallBusinessSearch.data?.policy?.selectedCustomerTypes) === JSON.stringify(["small-businesses"]), "small-business customer selection was not preserved");
  state.smallBusinessSearch = smallBusinessSearch.data;
  const startupQuery = providerQuery(state.startupSearch, "Hacker News");
  const smallBusinessQuery = providerQuery(state.smallBusinessSearch, "Hacker News");
  assert(startupQuery && smallBusinessQuery && startupQuery !== smallBusinessQuery, "customer selection did not materially change the Hacker News query");

  const relevant = [...(state.startupSearch.opportunities || []), ...(state.smallBusinessSearch.opportunities || [])]
    .find((item) => item?.sourceUrl && item?.profileMatches?.length > 0 && ["explicit-project-request", "freelance-or-contract"].includes(item.classification));
  assert(relevant, "no source-linked opportunity with profile overlap and freelance/project classification was returned");

  const saved = await request("/api/opportunities/save", { method: "POST", body: JSON.stringify({ opportunity: relevant }) }, jars[0]);
  assert(saved.response.ok && saved.data?.opportunity?.id, `opportunity save returned HTTP ${saved.response.status}`);
  state.savedId = saved.data.opportunity.id;

  const proposal = await request(`/api/opportunities/${state.savedId}/proposal`, { method: "POST", body: JSON.stringify({ note: "Integration acceptance note: keep the first deliverable measurable." }) }, jars[0]);
  assert(proposal.response.ok && typeof proposal.data?.proposal === "string" && proposal.data.proposal.includes(relevant.title), `proposal generation returned HTTP ${proposal.response.status}`);
  state.proposal = proposal.data.proposal;

  const savedBeforeLogout = await request("/api/saved", {}, jars[0]);
  assert(savedBeforeLogout.response.ok && savedBeforeLogout.data.opportunities.some((item) => item.id === state.savedId && item.proposalDraft), "saved opportunity or proposal was not persisted");

  const logout = await request("/api/auth/logout", { method: "POST" }, jars[0]);
  assert(logout.response.ok, `logout returned HTTP ${logout.response.status}`);
  const login = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: emails[0], password }) }, jars[0]);
  assert(login.response.ok, `login recovery returned HTTP ${login.response.status}`);
  const savedAfterLogin = await request("/api/saved", {}, jars[0]);
  assert(savedAfterLogin.response.ok && savedAfterLogin.data.opportunities.some((item) => item.id === state.savedId && item.proposalDraft), "saved work was not recovered after login");

  const secondRegistration = await request("/api/auth/register", { method: "POST", body: JSON.stringify({ email: emails[1], displayName: "Source Core Test B", password }) }, jars[1]);
  assert(secondRegistration.response.status === 201, `second registration returned HTTP ${secondRegistration.response.status}`);
  state.userIds.push(secondRegistration.data.user.id);
  const otherSaved = await request("/api/saved", {}, jars[1]);
  assert(otherSaved.response.ok && !otherSaved.data.opportunities.some((item) => item.id === state.savedId), "second account could read the first account's saved opportunity");
  const crossAccountProposal = await request(`/api/opportunities/${state.savedId}/proposal`, { method: "POST", body: JSON.stringify({ note: "must be denied" }) }, jars[1]);
  assert(crossAccountProposal.response.status === 404, `cross-account proposal access returned HTTP ${crossAccountProposal.response.status}`);

  console.log(JSON.stringify({
    status: "pass",
    provider: analysis.data.analysis.provider,
    model: analysis.data.analysis.model,
    profile: { businessNamePresent: true, sourceUrl: analysis.data.profile.sourceUrl, groundedClaimCount: groundedClaimCount(analysis.data.profile), extractedExcerptCount: analysis.data.analysis.extractedExcerptCount },
    discovery: { startups: summarizeSearch(state.startupSearch), smallBusinesses: summarizeSearch(state.smallBusinessSearch), queryChanged: startupQuery !== smallBusinessQuery, selectedOpportunity: { source: relevant.source, sourceUrl: relevant.sourceUrl, classification: relevant.classification, profileMatches: relevant.profileMatches.length, categoryMatches: relevant.categoryMatches.length } },
    proposal: { generated: true, length: state.proposal.length },
    persistence: { savedBeforeLogout: true, savedAfterLogin: true },
    ownership: { secondAccountSavedListIsolated: true, crossAccountProposalDenied: true },
  }));
  process.exitCode = 0;
} catch (error) {
  console.log(JSON.stringify({ status: "fail", reason: "core-acceptance-check-failed", message: String(error?.message || error), completed: { provider: process.env.INFERENCE_PROVIDER || null, model: process.env.DEEPSEEK_MODEL || null, userRegistered: state.userIds.length > 0, profileAnalyzed: Boolean(state.profile), startupSearch: Boolean(state.startupSearch), smallBusinessSearch: Boolean(state.smallBusinessSearch), savedId: Boolean(state.savedId), proposalGenerated: Boolean(state.proposal) }, discoveryDiagnostics: { startups: summarizeSearch(state.startupSearch), smallBusinesses: summarizeSearch(state.smallBusinessSearch), candidates: [...(state.startupSearch?.opportunities || []), ...(state.smallBusinessSearch?.opportunities || [])].slice(0, 8).map((item) => ({ source: item.source, classification: item.classification, profileMatches: item.profileMatches?.length || 0, categoryMatches: item.categoryMatches?.length || 0, sourceUrlPresent: Boolean(item.sourceUrl) })) } }));
  process.exitCode = 1;
} finally {
  try {
    console.log(JSON.stringify({ cleanup: await cleanup() }));
  } catch (error) {
    console.log(JSON.stringify({ cleanup: { status: "fail", message: String(error?.message || error) } }));
    process.exitCode = 1;
  }
}
