import { requireUserId } from "@/lib/auth";
import { collection } from "@/lib/db";
import { errorResponse } from "@/lib/errors";
import { cleanProfile, requireCompleteProfile, requireConfirmedDiscoveryIntent } from "@/lib/profile-validation";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = await request.json().catch(() => null);
    const profile = cleanProfile(body && typeof body === "object" ? (body as Record<string, unknown>).profile : null);
    requireCompleteProfile(profile);
    requireConfirmedDiscoveryIntent(profile);
    const profiles = await collection("profiles");
    await profiles.updateOne({ userId }, { $set: { userId, profile, updatedAt: new Date(), confirmedAt: new Date() } }, { upsert: true });
    return Response.json({ profile, saved: true });
  } catch (error) {
    return errorResponse(error);
  }
}
