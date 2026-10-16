import { describe, expect, it } from "vitest";
import { classifyOpportunity, dedupeAndRankOpportunities, qualifyOpportunity, type RawOpportunity } from "@/lib/discovery";
import type { ProfileDraft } from "@/lib/types";

function record(overrides: Partial<RawOpportunity> = {}): RawOpportunity {
  return {
    provider: "Remote OK",
    title: "Software role",
    description: "A current listing with ordinary role details.",
    url: "https://example.com/listing",
    publishedAt: new Date().toISOString(),
    type: "",
    ...overrides,
  };
}

const profile: ProfileDraft = {
  businessName: "Example Studio",
  summary: "A product design studio.",
  productsAndServices: [{ text: "Product design", evidence: ["We design products."] }],
  problemsSolved: [],
  skillsAndTechnologies: [{ text: "Research", evidence: ["Our research practice."] }],
  valueProposition: [],
  differentiators: [],
  portfolioEvidence: [],
  customerSegments: [],
  searchKeywords: ["product design", "research"],
  buyerIntentSignals: [],
  inferenceNotes: [],
  sourceUrl: "https://example.com/",
  analyzedAt: new Date().toISOString(),
  model: "test",
  grounding: { sourceTitle: "Example", sourceExcerptCount: 2, unsupportedFields: [] },
};

describe("opportunity employment classification", () => {
  it("does not mistake technical API contracts for a contract job", () => {
    expect(classifyOpportunity(record({ description: "Design API contracts and integrations for a product team." }), "services")).toBe("unknown-employment-type");
  });

  it("classifies the Vytalize-shaped listing as employment when salary evidence is present", () => {
    expect(classifyOpportunity(record({
      title: "Principal Software Engineer",
      description: "Own API contracts, receive an annual salary, health insurance, and paid sick days.",
    }), "services")).toBe("full-time-employment");
  });

  it("requires explicit employment context for freelance or contract classification", () => {
    expect(classifyOpportunity(record({ description: "This is a six-month contract role for an independent contractor." }), "services")).toBe("freelance-or-contract");
    expect(classifyOpportunity(record({ description: "Design API contracts and document contract schemas." }), "services")).not.toBe("freelance-or-contract");
  });

  it("keeps an untyped listing unknown instead of implying a contract", () => {
    expect(classifyOpportunity(record({ type: "", description: "Build a useful product with a small engineering team." }), "services")).toBe("unknown-employment-type");
    expect(classifyOpportunity(record({ provider: "Hacker News", description: "SEEKING FREELANCE WORK in UX and web design." }), "active-requests")).not.toBe("explicit-project-request");
  });

  it("keeps inferred potential-customer signals separate from active requests", () => {
    expect(classifyOpportunity(record({ provider: "GitHub", title: "Feature request: improve product design workflow", description: "We need product design help to replace this manual process.", type: "enhancement", prospectType: "potential-customer" }), "potential-customers")).toBe("potential-buyer-signal-unconfirmed");
    expect(classifyOpportunity(record({ provider: "GitHub", title: "Responsive Product Catalogue Design", description: "As a visitor, I want to browse a visually clear and responsive catalogue.", type: "must-have", prospectType: "potential-customer" }), "potential-customers")).toBe("potential-buyer-signal-unconfirmed");
    expect(classifyOpportunity(record({ provider: "GitHub", title: "Build support for a product workflow", description: "Acceptance criteria cover the public project behavior.", type: "enhancement", prospectType: "potential-customer" }), "potential-customers")).toBe("potential-buyer-signal-unconfirmed");
    expect(classifyOpportunity(record({ provider: "Hacker News", title: "Show HN: A new website tool", description: "I built a website tool and shared the launch.", prospectType: "potential-customer" }), "potential-customers")).toBe("unknown-employment-type");
    expect(classifyOpportunity(record({ provider: "Hacker News", title: "Ask HN: Looking for a website designer", description: "Could someone recommend a designer for this project?", prospectType: "potential-customer" }), "potential-customers")).toBe("potential-buyer-signal-unconfirmed");
    expect(classifyOpportunity(record({ provider: "Hacker News", title: "Looking for a freelancer", description: "We need a freelancer for a product design project." }), "active-requests")).toBe("explicit-project-request");
  });

  it("does not promote unsupported intent or stale content", () => {
    expect(classifyOpportunity(record({ provider: "GitHub", title: "Project update", description: "We shipped a new release.", prospectType: "potential-customer" }), "potential-customers")).toBe("unknown-employment-type");
    expect(classifyOpportunity(record({ publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() }), "active-requests")).toBe("expired-or-stale");
  });

  it("filters irrelevant prospects and removes duplicate source records", () => {
    const relevant = record({ provider: "GitHub", title: "Product design feature request", description: "We need product design help.", prospectType: "potential-customer", organization: "example/project" });
    const duplicate = { ...relevant, title: "Duplicate title" };
    expect(qualifyOpportunity(record({ provider: "GitHub", title: "Unrelated gardening issue", description: "We need a garden hose.", prospectType: "potential-customer" }), profile, ["startups"], "potential-customers")).toBeNull();
    expect(qualifyOpportunity(record({ provider: "GitHub", title: "Product design feature request", description: "We need product design help.", prospectType: "potential-customer" }), profile, ["startups"], "potential-customers")).toBeNull();
    expect(dedupeAndRankOpportunities([relevant, duplicate], profile, ["startups"], "potential-customers")).toHaveLength(1);
  });
});
