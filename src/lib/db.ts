import { MongoClient, type Db, type Document, type Collection } from "mongodb";
import { requiredEnv } from "./env";

declare global {
  var sourceMongoClientPromise: Promise<MongoClient> | undefined;
}

async function getClient(): Promise<MongoClient> {
  if (global.sourceMongoClientPromise) return global.sourceMongoClientPromise;
  const client = new MongoClient(requiredEnv("MONGODB_URI"), {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8_000,
  });
  global.sourceMongoClientPromise = client.connect();
  return global.sourceMongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || "source");
}

export async function collection<T extends Document>(name: string): Promise<Collection<T>> {
  return (await getDb()).collection<T>(name);
}

export async function ensureIndexes() {
  const users = await collection("users");
  await users.createIndex({ email: 1 }, { unique: true });
  const profiles = await collection("profiles");
  await profiles.createIndex({ userId: 1, updatedAt: -1 });
  const opportunities = await collection("opportunities");
  await opportunities.createIndex({ userId: 1, savedAt: -1 });
  await opportunities.createIndex({ userId: 1, sourceUrl: 1 }, { unique: true });
}
