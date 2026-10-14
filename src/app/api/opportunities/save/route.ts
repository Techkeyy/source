import { ObjectId } from "mongodb";
import { requireUserId } from "@/lib/auth";
import { collection } from "@/lib/db";
import { errorResponse, SourceError } from "@/lib/errors";
import type { Opportunity } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const opportunity = (await request.json()).opportunity as Opportunity;
    if (!opportunity?.sourceUrl || !opportunity?.title) throw new SourceError("That opportunity is missing its source link or title.");
    const opportunities = await collection("opportunities");
    const now = new Date();
    await opportunities.updateOne(
      { userId, sourceUrl: opportunity.sourceUrl },
      { $set: { ...opportunity, userId, sourceUrl: opportunity.sourceUrl, updatedAt: now }, $setOnInsert: { savedAt: now, status: "saved", proposalDraft: null, createdAt: now } },
      { upsert: true },
    );
    const saved = await opportunities.findOne({ userId, sourceUrl: opportunity.sourceUrl });
    return Response.json({ opportunity: { ...saved, id: saved?._id instanceof ObjectId ? saved._id.toHexString() : undefined } });
  } catch (error) {
    return errorResponse(error);
  }
}
