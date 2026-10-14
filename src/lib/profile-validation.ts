import { SourceError } from "@/lib/errors";
import type { ProfileDraft } from "@/lib/types";

function cleanClaimList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const claim = typeof record.text === "string" ? record.text.trim().slice(0, 500) : "";
    const evidence = Array.isArray(record.evidence)
      ? record.evidence
          .filter((entry): entry is string => typeof entry === "string")
          .map((entry) => entry.trim().slice(0, 500))
          .filter(Boolean)
          .slice(0, 3)
      : [];
    if (!claim) return [];
    return [{ text: claim, evidence, ...(record.inference === true ? { inference: true } : {}) }];
  }).slice(0, 24);
}

export function cleanProfile(input: unknown): ProfileDraft {
  if (!input || typeof input !== "object") throw new SourceError("The profile could not be read.");
  const record = input as Record<string, unknown>;
  const sourceUrl = typeof record.sourceUrl === "string" ? record.sourceUrl.trim() : "";
  if (!sourceUrl) throw new SourceError("A profile source URL is required.");
  const list = (key: string) => cleanClaimList(record[key]);
  const grounding = record.grounding && typeof record.grounding === "object" ? record.grounding as Record<string, unknown> : {};

  return {
    businessName: typeof record.businessName === "string" ? record.businessName.trim().slice(0, 140) : "",
    summary: typeof record.summary === "string" ? record.summary.trim().slice(0, 1_000) : "",
    productsAndServices: list("productsAndServices"),
    problemsSolved: list("problemsSolved"),
    skillsAndTechnologies: list("skillsAndTechnologies"),
    valueProposition: list("valueProposition"),
    differentiators: list("differentiators"),
    portfolioEvidence: list("portfolioEvidence"),
    customerSegments: list("customerSegments"),
    searchKeywords: Array.isArray(record.searchKeywords)
      ? record.searchKeywords
          .filter((entry): entry is string => typeof entry === "string")
          .map((entry) => entry.trim().slice(0, 80))
          .filter(Boolean)
          .slice(0, 20)
      : [],
    buyerIntentSignals: list("buyerIntentSignals"),
    inferenceNotes: Array.isArray(record.inferenceNotes)
      ? record.inferenceNotes
          .filter((entry): entry is string => typeof entry === "string")
          .map((entry) => entry.trim().slice(0, 300))
          .filter(Boolean)
          .slice(0, 10)
      : [],
    sourceUrl,
    analyzedAt: typeof record.analyzedAt === "string" ? record.analyzedAt : new Date().toISOString(),
    model: typeof record.model === "string" ? record.model : "unknown",
    grounding: {
      sourceTitle: typeof grounding.sourceTitle === "string" ? grounding.sourceTitle.slice(0, 200) : "Website",
      sourceExcerptCount: Number(grounding.sourceExcerptCount || 0),
      // These claims remain intentionally unsupported even if a client submits them.
      unsupportedFields: ["pricing", "ownership", "past clients", "years of experience"],
    },
  };
}

export function requireCompleteProfile(profile: ProfileDraft) {
  if (!profile.businessName || !profile.summary) throw new SourceError("Add a name and summary before confirming the profile.");
}
