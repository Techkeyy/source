import { describe, expect, it } from "vitest";
import { classifyOpportunity, type RawOpportunity } from "@/lib/discovery";

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
  });
});
