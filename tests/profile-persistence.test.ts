import { describe, expect, it } from "vitest";
import { cleanProfile, requireCompleteProfile } from "@/lib/profile-validation";

const validProfile = {
  businessName: "Example Studio",
  summary: "A product design studio.",
  sourceUrl: "https://example.com/",
  productsAndServices: [{ text: "Product design", evidence: ["We design products."] }],
  skillsAndTechnologies: [{ text: "Research", evidence: ["Our research practice."] }],
  grounding: { sourceTitle: "Example", sourceExcerptCount: 2 },
};

describe("profile persistence boundary", () => {
  it("keeps the saved profile shape bounded and unsupported claims marked by policy", () => {
    const profile = cleanProfile({ ...validProfile, summary: `  ${validProfile.summary}  `, grounding: { sourceTitle: "Example", sourceExcerptCount: 2, unsupportedFields: ["invented"] } });
    expect(profile.summary).toBe(validProfile.summary);
    expect(profile.grounding.unsupportedFields).toEqual(["pricing", "ownership", "past clients", "years of experience"]);
    expect(profile.productsAndServices[0].evidence).toEqual(["We design products."]);
  });

  it("rejects an incomplete profile before it can be saved", () => {
    expect(() => cleanProfile({ ...validProfile, sourceUrl: "" })).toThrow(/source URL/i);
    expect(() => requireCompleteProfile({ ...cleanProfile(validProfile), summary: "" })).toThrow(/name and summary/i);
  });
});
