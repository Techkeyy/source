import { requireUserId } from "@/lib/auth";
import { collection } from "@/lib/db";
import { discoverOpportunities } from "@/lib/discovery";
import { errorResponse, SourceError } from "@/lib/errors";
import type { CustomerType, DiscoveryMode, ProfileDraft } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = (await request.json()) as { customerTypes?: CustomerType[]; mode?: DiscoveryMode };
    const profileRecord = await (await collection<{ userId: typeof userId; profile: ProfileDraft; confirmedAt: Date }>("profiles")).findOne({ userId });
    if (!profileRecord) throw new SourceError("Confirm your profile before searching.", 422, "PROFILE_REQUIRED");
    const selected = Array.isArray(body.customerTypes) ? body.customerTypes : [];
    const allowed = new Set(["small-businesses", "startups", "agencies", "individuals"]);
    if (!selected.length || selected.some((item) => !allowed.has(item))) throw new SourceError("Select at least one valid customer type.");
    if (!profileRecord.profile.offeringType || profileRecord.profile.offeringType === "unclear" || !profileRecord.profile.discoveryObjective) {
      throw new SourceError("Confirm your offering type and discovery objective before searching.", 422, "DISCOVERY_INTENT_REQUIRED");
    }
    const requestedMode: DiscoveryMode = body.mode === "potential-customers" || body.mode === "product" ? body.mode : "active-requests";
    const mode: DiscoveryMode = profileRecord.profile.discoveryObjective === "product-users"
      ? "potential-customers"
      : requestedMode === "potential-customers"
        ? "potential-customers"
        : "active-requests";
    const result = await discoverOpportunities(profileRecord.profile, selected, mode);
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
