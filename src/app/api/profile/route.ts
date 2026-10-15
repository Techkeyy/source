import { requireUserId } from "@/lib/auth";
import { collection } from "@/lib/db";
import { errorResponse } from "@/lib/errors";
import { cleanProfile, requireCompleteProfile } from "@/lib/profile-validation";

export async function GET() {
  try {
    const userId = await requireUserId();
    const record = await (await collection("profiles")).findOne({ userId });
    return Response.json({
      profile: record?.profile ?? null,
      confirmedAt: record?.confirmedAt instanceof Date ? record.confirmedAt.toISOString() : record?.confirmedAt ?? null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await requireUserId();
    const body = await request.json().catch(() => null);
    const profile = cleanProfile(body && typeof body === "object" ? (body as Record<string, unknown>).profile : null);
    requireCompleteProfile(profile);
    const now = new Date();
    await (await collection("profiles")).updateOne(
      { userId },
      { $set: { userId, profile, updatedAt: now, confirmedAt: now } },
      { upsert: true },
    );
    return Response.json({ profile, saved: true });
  } catch (error) {
    return errorResponse(error);
  }
}
