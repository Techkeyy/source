import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { MongoClient } from "mongodb";

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const redact = (value) => String(value)
  .replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, "[redacted-mongodb-uri]")
  .replace(/(GOOGLE_API_KEY|GEMINI_API_KEY|GEMMA_API_KEY|SESSION_SECRET)=[^\s]+/gi, "$1=[redacted]");

const required = ["MONGODB_URI", "MONGODB_DB"];
const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) {
  console.log(JSON.stringify({ status: "blocked", reason: "missing-environment", missing }));
  process.exitCode = 2;
} else {
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8_000 });
  const marker = "directive-005-" + randomUUID();
  let checks;
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB);
    await database.command({ ping: 1 });
    checks = database.collection("_source_integration_checks");
    const inserted = await checks.insertOne({ marker, kind: "directive-005", createdAt: new Date() });
    const found = await checks.findOne({ _id: inserted.insertedId, marker });
    const deleted = await checks.deleteOne({ _id: inserted.insertedId, marker });
    const remains = await checks.countDocuments({ marker });
    const pass = Boolean(found) && deleted.deletedCount === 1 && remains === 0;
    console.log(JSON.stringify({
      status: pass ? "pass" : "fail",
      database: process.env.MONGODB_DB,
      checks: { ping: true, insert: Boolean(found), read: Boolean(found), delete: deleted.deletedCount === 1, cleanup: remains === 0 },
    }));
    if (!pass) process.exitCode = 1;
  } catch (error) {
    console.log(JSON.stringify({ status: "fail", reason: "mongodb-operation-failed", message: redact(error?.message || error) }));
    process.exitCode = 1;
  } finally {
    if (checks) await checks.deleteMany({ marker }).catch(() => undefined);
    await client.close().catch(() => undefined);
  }
}
