import { SourceError } from "@/lib/errors";
import type { DiscoveryObjective, OfferingType, ProfileDraft, ProfileOrigin } from "@/lib/types";

const OFFERING_TYPES = new Set<OfferingType>(["service-provider", "product-owner", "unclear"]);
const DISCOVERY_OBJECTIVES = new Set<DiscoveryObjective>(["external-services", "product-users"]);

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
  const profileOrigin: ProfileOrigin = record.profileOrigin === "manual" ? "manual" : "website";
  if (!sourceUrl && profileOrigin !== "manual") throw new SourceError("A profile source URL is required.");
  const portfolioUrl = typeof record.portfolioUrl === "string" ? record.portfolioUrl.trim().slice(0, 500) : "";
  const list = (key: string) => cleanClaimList(record[key]);
  const grounding = record.grounding && typeof record.grounding === "object" ? record.grounding as Record<string, unknown> : {};
  const offeringTypeSuggestion = typeof record.offeringTypeSuggestion === "string" && OFFERING_TYPES.has(record.offeringTypeSuggestion as OfferingType)
    ? record.offeringTypeSuggestion as OfferingType
    : undefined;
  const offeringType = typeof record.offeringType === "string" && OFFERING_TYPES.has(record.offeringType as OfferingType)
    ? record.offeringType as OfferingType
    : undefined;
  const discoveryObjective = typeof record.discoveryObjective === "string" && DISCOVERY_OBJECTIVES.has(record.discoveryObjective as DiscoveryObjective)
    ? record.discoveryObjective as DiscoveryObjective
    : undefined;

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
    ...(portfolioUrl ? { portfolioUrl } : {}),
    ...(profileOrigin === "manual" ? { profileOrigin } : {}),
    analyzedAt: typeof record.analyzedAt === "string" ? record.analyzedAt : new Date().toISOString(),
    model: typeof record.model === "string" ? record.model : "unknown",
    grounding: {
      sourceTitle: typeof grounding.sourceTitle === "string" ? grounding.sourceTitle.slice(0, 200) : "Website",
      sourceExcerptCount: Number(grounding.sourceExcerptCount || 0),
      // These claims remain intentionally unsupported even if a client submits them.
      unsupportedFields: profileOrigin === "manual"
        ? ["services", "skills", "summary", "portfolio", "clients", "testimonials", "qualifications", "experience"]
        : ["pricing", "ownership", "past clients", "years of experience"],
    },
    ...(offeringTypeSuggestion ? { offeringTypeSuggestion } : {}),
    ...(typeof record.offeringTypeSuggestionReason === "string" ? { offeringTypeSuggestionReason: record.offeringTypeSuggestionReason.trim().slice(0, 400) } : {}),
    ...(offeringType ? { offeringType } : {}),
    ...(discoveryObjective ? { discoveryObjective } : {}),
  };
}

export function requireCompleteProfile(profile: ProfileDraft) {
  if (!profile.businessName) throw new SourceError("Add a name before confirming the profile.");
  if (profile.profileOrigin === "manual") {
    if (!profile.productsAndServices.some((claim) => claim.text.trim().length >= 2)) {
      throw new SourceError("Add at least one meaningful service before confirming a manual profile.", 422, "SERVICES_REQUIRED");
    }
    return;
  }
  if (!profile.summary) throw new SourceError("Add a summary before confirming the profile.");
}

export function requireConfirmedDiscoveryIntent(profile: ProfileDraft) {
  if (!profile.offeringType || profile.offeringType === "unclear" || !profile.discoveryObjective) {
    throw new SourceError("Choose whether you provide services or operate a product, then confirm the discovery objective.", 422, "DISCOVERY_INTENT_REQUIRED");
  }
  const expectedObjective = profile.offeringType === "product-owner" ? "product-users" : "external-services";
  if (profile.discoveryObjective !== expectedObjective) {
    throw new SourceError("The discovery objective must match the confirmed offering type.", 422, "DISCOVERY_INTENT_MISMATCH");
  }
}
