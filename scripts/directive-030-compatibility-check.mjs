import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { MongoClient, ObjectId } from "mongodb";

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) process.loadEnvFile(".env.local");

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const runId = randomUUID();
const emails = [`source-030-reach-${runId}@example.test`, `source-030-service-${runId}@example.test`];
const password = `Source-${runId}-Compatibility!`;
const jars = [new Map(), new Map()];
const userIds = [];

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
  return { response, data: await response.json().catch(() => ({})) };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function legacyProfile(sourceUrl, businessName, summary, productsAndServices, searchKeywords) {
  return {
    businessName,
    summary,
    productsAndServices: productsAndServices.map((text) => ({ text, evidence: [] })),
    problemsSolved: [],
    skillsAndTechnologies: [],
    valueProposition: [],
    differentiators: [],
    portfolioEvidence: [],
    customerSegments: [],
    searchKeywords,
    buyerIntentSignals: [],
    inferenceNotes: [],
    sourceUrl,
    analyzedAt: new Date().toISOString(),
    model: "legacy-fixture",
    grounding: { sourceTitle: businessName, sourceExcerptCount: 1, unsupportedFields: [] },
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
  assert(process.env.MONGODB_URI && process.env.MONGODB_DB, "MONGODB_URI and MONGODB_DB are required");
  const registrations = await Promise.all(emails.map((email, index) => request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, displayName: `Directive 030 ${index === 0 ? "Reach" : "Service"}`, password }),
  }, jars[index])));
  registrations.forEach((result, index) => {
    assert(result.response.status === 201, `registration ${index + 1} returned HTTP ${result.response.status}`);
    assert(ObjectId.isValid(result.data?.user?.id), `registration ${index + 1} did not return a user id`);
    userIds.push(result.data.user.id);
  });

  const oldReachProfile = legacyProfile(
    "https://reach-seven-lemon.vercel.app/",
    "Reach legacy product profile",
    "A passkey-powered product for token payments between people.",
    ["passkey payments", "test tokens"],
    ["payments", "passkeys"],
  );
  const oldServiceProfile = legacyProfile(
    "https://www.netguru.com/",
    "Netguru legacy service profile",
    "A digital product and software delivery studio.",
    ["software development", "web design"],
    ["software development", "web design"],
  );
  const legacyProfiles = [oldReachProfile, oldServiceProfile];
  const legacyResults = [];
  for (let index = 0; index < legacyProfiles.length; index += 1) {
    const write = await request("/api/profile", { method: "PUT", body: JSON.stringify({ profile: legacyProfiles[index] }) }, jars[index]);
    assert(write.response.ok, `legacy profile ${index + 1} write returned HTTP ${write.response.status}`);
    const read = await request("/api/profile", {}, jars[index]);
    assert(read.response.ok && read.data?.profile?.businessName === legacyProfiles[index].businessName, `legacy profile ${index + 1} was not readable`);
    assert(!read.data.profile.offeringType && !read.data.profile.discoveryObjective, `legacy profile ${index + 1} silently gained intent fields`);
    const search = await request("/api/opportunities/search", {
      method: "POST",
      body: JSON.stringify({ customerTypes: ["startups"], mode: "active-requests" }),
    }, jars[index]);
    legacyResults.push({ status: search.response.status, code: search.data?.code });
    assert(search.response.status === 422 && search.data?.code === "DISCOVERY_INTENT_REQUIRED", `legacy profile ${index + 1} was allowed to search (${search.response.status})`);
  }

  const confirmedProduct = {
    ...oldReachProfile,
    offeringType: "product-owner",
    discoveryObjective: "product-users",
    offeringTypeSuggestion: "product-owner",
  };
  const confirm = await request("/api/profile/confirm", { method: "POST", body: JSON.stringify({ profile: confirmedProduct }) }, jars[0]);
  assert(confirm.response.ok, `modern product confirmation returned HTTP ${confirm.response.status}`);
  const bypassAttempt = await request("/api/opportunities/search", {
    method: "POST",
    body: JSON.stringify({ customerTypes: ["startups"], mode: "active-requests" }),
  }, jars[0]);
  assert(bypassAttempt.response.ok, `product-owner search returned HTTP ${bypassAttempt.response.status}`);
  const productProviders = Object.fromEntries((bypassAttempt.data?.providers || []).map((provider) => [provider.provider, provider.status]));
  assert(bypassAttempt.data?.policy?.mode === "potential-customers", "client mode bypassed the confirmed product objective");
  assert(productProviders["Contracts Finder"] === "skipped", "product-owner discovery queried external-service procurement instead of skipping Contracts Finder");
  assert(productProviders.Jobicy === "skipped" && productProviders["Remote OK"] === "skipped" && productProviders.SerpApi === "skipped", "product-owner job sources were not skipped");

  const confirmedService = {
    ...oldServiceProfile,
    offeringType: "service-provider",
    discoveryObjective: "external-services",
    offeringTypeSuggestion: "service-provider",
  };
  const serviceConfirm = await request("/api/profile/confirm", { method: "POST", body: JSON.stringify({ profile: confirmedService }) }, jars[1]);
  assert(serviceConfirm.response.ok, `modern service confirmation returned HTTP ${serviceConfirm.response.status}`);
  const serviceSearch = await request("/api/opportunities/search", {
    method: "POST",
    body: JSON.stringify({ customerTypes: ["startups"], mode: "active-requests" }),
  }, jars[1]);
  assert(serviceSearch.response.ok, `service-provider search returned HTTP ${serviceSearch.response.status}`);
  const serviceProviders = Object.fromEntries((serviceSearch.data?.providers || []).map((provider) => [provider.provider, provider.status]));
  assert(serviceProviders["Contracts Finder"] === "queried", "service-provider discovery did not preserve Contracts Finder procurement matching");

  console.log(JSON.stringify({
    status: "pass",
    legacyProfiles: {
      readable: true,
      explicitIntentRequired: true,
      tested: ["Reach-style product profile", "service-provider profile"],
      searchResponses: legacyResults,
    },
    serverObjectiveEnforcement: {
      clientActiveRequestBypass: "blocked",
      effectiveProductMode: bypassAttempt.data.policy.mode,
      jobSources: productProviders,
      contractsFinder: { productOwner: productProviders["Contracts Finder"], serviceProvider: serviceProviders["Contracts Finder"] },
    },
    cleanup: "requested",
  }));
} catch (error) {
  console.log(JSON.stringify({ status: "fail", reason: "directive-030-compatibility-check-failed", message: error.message }));
  process.exitCode = 1;
} finally {
  try {
    console.log(JSON.stringify({ cleanup: await cleanup() }));
  } catch (error) {
    console.log(JSON.stringify({ cleanup: { status: "fail", message: error.message } }));
    process.exitCode = 1;
  }
}
