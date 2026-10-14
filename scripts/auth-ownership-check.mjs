import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { ObjectId, MongoClient } from "mongodb";

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const runId = randomUUID();
const emails = ["source-a-" + runId + "@example.test", "source-b-" + runId + "@example.test"];
const password = "Source-" + runId + "-Passphrase!";
const jars = [new Map(), new Map()];
const users = [];
let opportunityId;

function cookieHeader(jar) {
  return [...jar.entries()].map(([name, value]) => name + "=" + value).join("; ");
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
  headers.set("content-type", "application/json");
  const cookies = cookieHeader(jar);
  if (cookies) headers.set("cookie", cookies);
  const response = await fetch(baseUrl + path, { ...options, headers, signal: AbortSignal.timeout(12_000) });
  rememberCookies(response, jar);
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function cleanup() {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) return;
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8_000 });
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const records = await db.collection("users").find({ email: { $in: emails } }).project({ _id: 1 }).toArray();
    const ids = records.map((record) => record._id);
    if (ids.length) await db.collection("opportunities").deleteMany({ userId: { $in: ids } });
    await db.collection("users").deleteMany({ email: { $in: emails } });
  } finally {
    await client.close().catch(() => undefined);
  }
}

try {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) throw new Error("MONGODB_URI and MONGODB_DB are required for cleanup.");
  for (let index = 0; index < 2; index += 1) {
    const result = await request("/api/auth/register", { method: "POST", body: JSON.stringify({ email: emails[index], displayName: "Source Test " + (index + 1), password }) }, jars[index]);
    if (result.response.status !== 201) throw new Error("registration " + (index + 1) + " returned HTTP " + result.response.status);
    if (!result.data?.user?.id || !ObjectId.isValid(result.data.user.id)) throw new Error("registration " + (index + 1) + " did not return a user id");
    users.push(result.data.user.id);
  }
  const saved = await request("/api/opportunities/save", {
    method: "POST",
    body: JSON.stringify({
      opportunity: {
        source: "Directive 005 ownership probe",
        sourceUrl: "https://example.com/source-ownership-" + runId,
        title: "Synthetic ownership probe record",
        description: "Created through the supported save route and removed during cleanup.",
        publishedAt: new Date().toISOString(),
        classification: "freelance-or-contract",
        clientType: "startups",
        score: 1,
        profileMatches: [],
        categoryMatches: ["startup"],
        evidence: ["Synthetic record used only for ownership isolation testing."],
        budgetSignal: null,
        contactSignal: false,
        attribution: "Integration probe",
      },
    }),
  }, jars[0]);
  if (!saved.response.ok || !saved.data?.opportunity?.id) throw new Error("save returned HTTP " + saved.response.status);
  opportunityId = saved.data.opportunity.id;
  const crossAccount = await request("/api/opportunities/" + opportunityId + "/proposal", { method: "POST", body: JSON.stringify({ note: "cross-account access must fail" }) }, jars[1]);
  const otherSaved = await request("/api/saved", { method: "GET" }, jars[1]);
  const crossAccountDenied = crossAccount.response.status === 404;
  const savedIsolated = otherSaved.response.ok && !(otherSaved.data?.opportunities || []).some((item) => item.id === opportunityId);
  const pass = crossAccountDenied && savedIsolated;
  console.log(JSON.stringify({ status: pass ? "pass" : "fail", checks: { separateRegistrations: users.length === 2, ownerCanSave: true, crossAccountDenied, savedListIsolated: savedIsolated }, testDataCleanup: "requested" }));
  if (!pass) process.exitCode = 1;
} catch (error) {
  console.log(JSON.stringify({ status: "fail", reason: "auth-or-ownership-check-failed", message: error.message }));
  process.exitCode = 1;
} finally {
  try {
    await cleanup();
    console.log(JSON.stringify({ cleanup: "pass", deletedTestAccounts: emails.length }));
  } catch (error) {
    console.log(JSON.stringify({ cleanup: "fail", message: error.message }));
    process.exitCode = 1;
  }
}
