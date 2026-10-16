import { ObjectId } from "mongodb";
import { requireUserId } from "@/lib/auth";
import { collection } from "@/lib/db";
import { errorResponse, SourceError } from "@/lib/errors";
import type { ProfileDraft, SavedOpportunity } from "@/lib/types";

function verifiedLines(profile: ProfileDraft) {
  return [...profile.productsAndServices, ...profile.skillsAndTechnologies, ...profile.portfolioEvidence].filter((claim) => claim.evidence.length > 0).slice(0, 4).map((claim) => claim.text);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) throw new SourceError("That saved opportunity could not be found.", 404);
    const [record, profileRecord] = await Promise.all([
      (await collection("opportunities")).findOne({ _id: new ObjectId(id), userId }),
      (await collection<{ userId: typeof userId; profile: ProfileDraft }>("profiles")).findOne({ userId }),
    ]);
    if (!record || !profileRecord) throw new SourceError("That saved opportunity or profile is no longer available.", 404);
    const saved = record as unknown as SavedOpportunity;
    const body = (await request.json().catch(() => ({}))) as { note?: string; regenerate?: boolean };
    if (saved.proposalDraft && body.regenerate !== true) {
      return Response.json({ proposal: saved.proposalDraft, generated: false, saved: true });
    }
    const evidence = verifiedLines(profileRecord.profile);
    const isPotential = saved.prospectType === "potential-customer" || saved.classification === "potential-buyer-signal-unconfirmed";
    const proposal = isPotential
      ? `Hello,\n\nI came across “${saved.title}” while learning about public work in this area. I may be able to help with the kind of work I describe in my profile, but I do not want to assume that you are currently looking for a provider.\n\n${profileRecord.profile.summary}\n\nRelevant evidence from my confirmed profile:\n${evidence.length ? evidence.map((line) => `• ${line}`).join("\n") : "• My confirmed profile does not yet contain a specific evidence line for this signal."}\n\nIf this is relevant, I would be glad to understand the problem, current constraints, and whether a small first step would be useful. Please ignore this note if the public signal is not an active need. ${body.note?.trim() ? `\n\nContext I would add: ${body.note.trim().slice(0, 500)}` : ""}\n\nBest,\n${profileRecord.profile.businessName}`
      : `Hello,\n\nI saw your request, “${saved.title},” and it connects with the work I describe in my public profile.\n\n${profileRecord.profile.summary}\n\nRelevant evidence from my confirmed profile:\n${evidence.length ? evidence.map((line) => `• ${line}`).join("\n") : "• My confirmed profile does not yet contain a specific evidence line for this request."}\n\nA useful next step would be to compare the outcome you need, the current constraints, and the first deliverable. ${body.note?.trim() ? `\n\nContext I would add: ${body.note.trim().slice(0, 500)}` : ""}\n\nBest,\n${profileRecord.profile.businessName}`;
    await (await collection("opportunities")).updateOne({ _id: new ObjectId(id), userId }, { $set: { proposalDraft: proposal, updatedAt: new Date() } });
    return Response.json({ proposal, generated: true, saved: true, draftType: isPotential ? "cautious-outreach" : "application-proposal" });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) throw new SourceError("That saved opportunity could not be found.", 404);
    const body = (await request.json().catch(() => ({}))) as { proposal?: unknown };
    if (typeof body.proposal !== "string" || body.proposal.length > 12_000) {
      throw new SourceError("The proposal draft is invalid or too long.");
    }
    const opportunities = await collection("opportunities");
    const result = await opportunities.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { proposalDraft: body.proposal, updatedAt: new Date() } },
    );
    if (!result.matchedCount) throw new SourceError("That saved opportunity could not be found.", 404);
    return Response.json({ proposal: body.proposal, saved: true, savedAt: new Date().toISOString() });
  } catch (error) {
    return errorResponse(error);
  }
}
