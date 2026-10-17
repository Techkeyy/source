import type { GroundedClaim, OfferingType } from "./types";

export interface OfferingSuggestion {
  type: OfferingType;
  reason: string;
}

const PRODUCT_SIGNAL_PATTERN = /\b(?:saas|platform|tool|tools|payment|payments|payout|payouts|passkey|token|tokens|wallet|checkout|recipient|claim|subscription|marketplace|consumer product)\b/i;
const SERVICE_SIGNAL_PATTERN = /\b(?:agency|agencies|company|companies|consult(?:ant|ing|ancy)?|freelance(?:r|rs)?|hire us|client work|services?|studio|portfolio|campaigns?|design services?|development services?|marketing services?|video editing services?|developers?|designers?|software development|web development|mobile development|product design|team extension)\b/i;

function claimText(claims: GroundedClaim[]) {
  return claims.map((claim) => claim.text).join(" ");
}

export function inferOfferingTypeSuggestion(input: {
  summary: string;
  productsAndServices: GroundedClaim[];
  customerSegments: GroundedClaim[];
  searchKeywords: string[];
  sourceText?: string;
}): OfferingSuggestion {
  const combined = [
    input.summary,
    claimText(input.productsAndServices),
    claimText(input.customerSegments),
    input.searchKeywords.join(" "),
    input.sourceText || "",
  ].join(" ");
  const productSignals = combined.match(new RegExp(PRODUCT_SIGNAL_PATTERN.source, "gi"))?.length || 0;
  const serviceSignals = combined.match(new RegExp(SERVICE_SIGNAL_PATTERN.source, "gi"))?.length || 0;

  if (productSignals >= 2 && productSignals > serviceSignals) {
    return {
      type: "product-owner",
      reason: "The public page describes a product, application, or tool used by people, so Source suggests finding potential users or organizations with a relevant use case.",
    };
  }
  if (serviceSignals >= 2 && serviceSignals > productSignals) {
    return {
      type: "service-provider",
      reason: "The public page describes services or client-facing work, so Source suggests finding organizations that may be seeking an external provider.",
    };
  }
  return {
    type: "unclear",
    reason: "The public page does not clearly establish whether you sell services or operate a product. Choose an offering type before discovery.",
  };
}
