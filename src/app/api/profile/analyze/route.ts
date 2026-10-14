import { requireUserId } from "@/lib/auth";
import { extractWebsite } from "@/lib/extract";
import { errorResponse, SourceError } from "@/lib/errors";
import { runProfileAnalysis } from "@/lib/profile-workflow";
import { assertRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    assertRateLimit(`analyze:${userId.toHexString()}`, 5, 60 * 60 * 1000);
    const body = (await request.json()) as { url?: string };
    if (!body.url?.trim()) throw new SourceError("Paste a live website URL to analyze.");
    const extracted = await extractWebsite(body.url.trim());
    if (extracted.text.length < 40) throw new SourceError("This page did not expose enough readable content to build a grounded profile.", 422, "SPARSE_PAGE");
    const result = await runProfileAnalysis(extracted);
    return Response.json({ profile: result.draft, analysis: { model: result.model, provider: result.provider, latencyMs: result.latencyMs, finalUrl: extracted.finalUrl, extractedExcerptCount: extracted.excerpts.length } });
  } catch (error) {
    return errorResponse(error);
  }
}
