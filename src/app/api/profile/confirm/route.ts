import { requireUserId } from "@/lib/auth";
import { collection } from "@/lib/db";
import { errorResponse } from "@/lib/errors";
import { cleanProfile, requireCompleteProfile } from "@/lib/profile-validation";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const profile = cleanProfile((await request.json()).profile);
    requireCompleteProfile(profile);
    const profiles = await collection("profiles");
    await profiles.updateOne({ userId }, { $set: { userId, profile, updatedAt: new Date(), confirmedAt: new Date() } }, { upsert: true });
    return Response.json({ profile, saved: true });
  } catch (error) {
    return errorResponse(error);
  }
}
