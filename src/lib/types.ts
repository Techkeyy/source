export const CUSTOMER_TYPES = [
  "small-businesses",
  "startups",
  "agencies",
  "individuals",
] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[number];
export type DiscoveryMode = "services" | "product" | "active-requests" | "potential-customers";
export type ProspectType = "active-request" | "potential-customer" | "research-signal";
export type BuyerIntent = "confirmed" | "possible" | "unsupported";
export type OfferingType = "service-provider" | "product-owner" | "unclear";
export type DiscoveryObjective = "external-services" | "product-users";
export type OpportunityClassification =
  | "explicit-project-request"
  | "freelance-or-contract"
  | "potential-buyer-signal-unconfirmed"
  | "research-signal-only"
  | "full-time-employment"
  | "unknown-employment-type"
  | "irrelevant"
  | "expired-or-stale";

export interface GroundedClaim {
  text: string;
  evidence: string[];
  inference?: boolean;
}

export interface ProfileDraft {
  businessName: string;
  summary: string;
  productsAndServices: GroundedClaim[];
  problemsSolved: GroundedClaim[];
  skillsAndTechnologies: GroundedClaim[];
  valueProposition: GroundedClaim[];
  differentiators: GroundedClaim[];
  portfolioEvidence: GroundedClaim[];
  customerSegments: GroundedClaim[];
  searchKeywords: string[];
  buyerIntentSignals: GroundedClaim[];
  inferenceNotes: string[];
  sourceUrl: string;
  analyzedAt: string;
  model: string;
  grounding: {
    sourceTitle: string;
    sourceExcerptCount: number;
    unsupportedFields: string[];
  };
  offeringTypeSuggestion?: OfferingType;
  offeringTypeSuggestionReason?: string;
  offeringType?: OfferingType;
  discoveryObjective?: DiscoveryObjective;
}

export interface Opportunity {
  source: string;
  sourceUrl: string;
  title: string;
  description: string;
  publishedAt: string | null;
  classification: OpportunityClassification;
  prospectType?: ProspectType;
  buyerIntent?: BuyerIntent;
  organization?: string;
  buyerName?: string;
  observedNeed?: string;
  nextStep?: string;
  contactUrl?: string | null;
  noticeStatus?: string;
  deadline?: string | null;
  qualificationSummary?: string | null;
  clientType: CustomerType | "unknown";
  score: number;
  profileMatches: string[];
  categoryMatches: string[];
  evidence: string[];
  budgetSignal: string | null;
  contactSignal: boolean;
  attribution: string;
  providerRecordId?: string;
}

export interface SavedOpportunity extends Opportunity {
  id: string;
  status: "saved" | "contacted" | "closed";
  proposalDraft: string | null;
  savedAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
}
