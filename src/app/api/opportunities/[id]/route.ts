import { ObjectId } from "mongodb";
import { requireUserId } from "@/lib/auth";
import { collection } from "@/lib/db";
import { errorResponse, SourceError } from "@/lib/errors";

const statuses = new Set(["saved", "contacted", "closed"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) throw new SourceError("That saved prospect could not be found.", 404);
    const body = (await request.json().catch(() => ({}))) as { status?: unknown; nextStep?: unknown };
    const update: { status?: "saved" | "contacted" | "closed"; nextStep?: string | null; updatedAt: Date } = { updatedAt: new Date() };
    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !statuses.has(body.status)) throw new SourceError("That pipeline status is invalid.");
      update.status = body.status as "saved" | "contacted" | "closed";
    }
    if (body.nextStep !== undefined) {
      if (body.nextStep !== null && (typeof body.nextStep !== "string" || body.nextStep.length > 600)) throw new SourceError("The next step is invalid or too long.");
      update.nextStep = typeof body.nextStep === "string" ? body.nextStep.trim() || null : null;
    }
    if (Object.keys(update).length === 1) throw new SourceError("No pipeline changes were provided.");
    const opportunities = await collection("opportunities");
    const result = await opportunities.updateOne({ _id: new ObjectId(id), userId }, { $set: update });
    if (!result.matchedCount) throw new SourceError("That saved prospect could not be found.", 404);
    const saved = await opportunities.findOne({ _id: new ObjectId(id), userId });
    return Response.json({ opportunity: saved, saved: true });
  } catch (error) {
    return errorResponse(error);
  }
}
