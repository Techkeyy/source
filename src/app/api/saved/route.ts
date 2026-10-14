import { ObjectId } from "mongodb";
import { requireUserId } from "@/lib/auth";
import { collection } from "@/lib/db";
import { errorResponse } from "@/lib/errors";

export async function GET() {
  try {
    const userId = await requireUserId();
    const records = await (await collection("opportunities")).find({ userId }).sort({ savedAt: -1 }).limit(50).toArray();
    return Response.json({ opportunities: records.map((record) => ({ ...record, id: record._id instanceof ObjectId ? record._id.toHexString() : String(record._id) })) });
  } catch (error) {
    return errorResponse(error);
  }
}
