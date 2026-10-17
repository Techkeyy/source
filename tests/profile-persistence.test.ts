import { describe, expect, it } from "vitest";
import { cleanProfile, requireCompleteProfile, requireConfirmedDiscoveryIntent } from "@/lib/profile-validation";
import { inferOfferingTypeSuggestion } from "@/lib/offering";

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

  it("persists confirmed offering type and objective without weakening legacy profile compatibility", () => {
    const profile = cleanProfile({ ...validProfile, offeringType: "product-owner", discoveryObjective: "product-users", offeringTypeSuggestion: "product-owner" });
    requireConfirmedDiscoveryIntent(profile);
    expect(profile.offeringType).toBe("product-owner");
    expect(profile.discoveryObjective).toBe("product-users");
    expect(() => requireConfirmedDiscoveryIntent(cleanProfile(validProfile))).toThrow(/offering|objective/i);
  });

  it("suggests product ownership for Reach's public payment page", () => {
    const suggestion = inferOfferingTypeSuggestion({
      summary: "Reach is a passkey-powered payment product for sending test-token payments.",
      productsAndServices: [{ text: "Passkey payment product", evidence: ["payment product"] }],
      customerSegments: [{ text: "People sending money", evidence: ["sending money to people"] }],
      searchKeywords: ["payments", "passkey", "test tokens"],
      sourceText: "Reach uses test tokens, passkey accounts, private claim links, and human payments.",
    });
    expect(suggestion.type).toBe("product-owner");
  });
});
