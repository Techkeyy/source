import { describe, expect, it } from "vitest";
import { classifyOpportunity, dedupeAndRankOpportunities, profileTerms, qualifyOpportunity, type RawOpportunity } from "@/lib/discovery";
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
  offeringType: "service-provider",
  discoveryObjective: "external-services",
};

const reachProfile: ProfileDraft = {
  ...profile,
  businessName: "Reach",
  summary: "A passkey-powered payment product that lets people send and claim test-token payments.",
  productsAndServices: [{ text: "Passkey payment product", evidence: ["passkey payment product"] }, { text: "Test-token payments", evidence: ["test-token payments"] }],
  skillsAndTechnologies: [{ text: "Passkey account", evidence: ["passkey account"] }],
  searchKeywords: ["payments", "passkey", "test tokens"],
  offeringType: "product-owner",
  discoveryObjective: "product-users",
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
    expect(classifyOpportunity(record({ provider: "GitHub", title: "Project update", description: "We shipped a new release.", prospectType: "potential-customer" }), "potential-customers")).toBe("research-signal-only");
    expect(classifyOpportunity(record({ publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() }), "active-requests")).toBe("expired-or-stale");
  });

  it("keeps internal GitHub work as research signals instead of buyers", () => {
    expect(classifyOpportunity(record({ provider: "GitHub", title: "Device Website Development", description: "Objective: develop a browser-based interface for device monitoring and control.", prospectType: "potential-customer", organization: "edwardschmitz/sigcore-uc" }), "potential-customers")).toBe("potential-buyer-signal-unconfirmed");
    expect(classifyOpportunity(record({ provider: "GitHub", title: "Branding backlog", description: "Internal project backlog with an existing blocker and assigned task.", prospectType: "research-signal", organization: "Transf-ORM/Transf-ORM-CLI" }), "potential-customers")).toBe("research-signal-only");
    expect(classifyOpportunity(record({ provider: "GitHub", title: "Brand + design pipeline", description: "Internal branding workflow with named project owners.", prospectType: "research-signal", organization: "federicomrod/Milton" }), "potential-customers")).toBe("research-signal-only");
  });

  it("does not promote GitHub contract wording to an active request without external buying evidence", () => {
    const issue = record({ provider: "GitHub", title: "New TV roles", description: "We need media work for a customer-facing project, with contract role requirements.", type: "contract", prospectType: "potential-customer", organization: "example/project" });
    expect(classifyOpportunity(issue, "potential-customers")).toBe("potential-buyer-signal-unconfirmed");
    expect(classifyOpportunity(issue, "active-requests")).not.toBe("explicit-project-request");
  });

  it("treats an official procurement notice as an active external request", () => {
    expect(classifyOpportunity(record({ provider: "Contracts Finder", title: "Website and digital services tender", description: "The buyer is seeking to appoint an experienced digital service provider.", prospectType: "active-request", buyerIntent: "confirmed", organization: "Public Buyer", contactUrl: "https://www.contractsfinder.service.gov.uk/Notice/example", deadline: new Date(Date.now() + 86_400_000).toISOString(), noticeStatus: "active" }), "potential-customers")).toBe("explicit-project-request");
  });

  it("filters irrelevant prospects and removes duplicate source records", () => {
    const relevant = record({ provider: "GitHub", title: "Product design feature request", description: "We need product design help.", prospectType: "potential-customer", organization: "example/project" });
    const duplicate = { ...relevant, title: "Duplicate title" };
    expect(qualifyOpportunity(record({ provider: "GitHub", title: "Unrelated gardening issue", description: "We need a garden hose.", prospectType: "potential-customer" }), profile, ["startups"], "potential-customers")).toBeNull();
    expect(qualifyOpportunity(record({ provider: "GitHub", title: "Product design feature request", description: "We need product design help.", prospectType: "potential-customer" }), profile, ["startups"], "potential-customers")).toBeNull();
    expect(dedupeAndRankOpportunities([relevant, duplicate], profile, ["startups"], "potential-customers")).toHaveLength(1);
  });

  it("does not match Reach's payment product to a graphic-design contractor listing", () => {
    const blueTuskr = record({
      provider: "Jobicy",
      title: "Graphic Designer & Video Editor",
      description: "Create branded visual content for a team. Coordinate with people and test creative concepts.",
      type: "contract",
      organization: "BlueTuskr",
      contactUrl: "https://example.com/apply",
    });
    expect(profileTerms(reachProfile)).not.toEqual(expect.arrayContaining(["people", "human", "between", "test"]));
    expect(qualifyOpportunity(blueTuskr, reachProfile, ["startups"], "active-requests")).toBeNull();
  });

  it("rejects brand-name, generic, and incidental-payment matches for a product owner", () => {
    const northampton = record({
      provider: "Contracts Finder",
      title: "Media Planning & Buying Services",
      description: "Northampton College invites tenders for media planning and buying services. The supplier will manage campaign reach.",
      organization: "Northampton College",
      buyerIntent: "confirmed",
      noticeStatus: "active",
      deadline: new Date(Date.now() + 86_400_000).toISOString(),
    });
    const oracy = record({
      provider: "Contracts Finder",
      title: "Oracy Framework Expert Panel",
      description: "The Department for Education seeks experts for an education framework and panel.",
      organization: "Department for Education",
      buyerIntent: "confirmed",
      noticeStatus: "active",
    });
    const brandOnly = record({ provider: "GitHub", title: "Reach release notes", description: "Reach is mentioned in this unrelated project update.", prospectType: "potential-customer", organization: "example/repo" });
    const incidentalPayment = record({ provider: "GitHub", title: "Finance dashboard copy", description: "We need a marketing dashboard that mentions payment status and customer reach.", prospectType: "potential-customer", organization: "example/finance" });
    const incidentalPasskeyPayment = record({ provider: "GitHub", title: "Passkey onboarding documentation", description: "We need to document account onboarding while a separate payment status field remains in the dashboard.", prospectType: "potential-customer", organization: "example/docs" });
    const genericIssue = record({ provider: "GitHub", title: "General product backlog", description: "We need to improve the user workflow and replace a manual process.", prospectType: "potential-customer", organization: "example/backlog" });

    for (const candidate of [northampton, oracy, brandOnly, incidentalPayment, incidentalPasskeyPayment, genericIssue]) {
      expect(qualifyOpportunity(candidate, reachProfile, ["startups"], "potential-customers")).toBeNull();
    }
  });

  it("accepts a product opportunity only when a grounded capability and concrete use case both match", () => {
    const productEvaluation = record({
      provider: "GitHub",
      title: "Evaluating passkey peer-to-peer payment pilots",
      description: "Our organization is seeking a product for passkey-based peer-to-peer payment flows and claim-link payments. We want to pilot a safer recipient workflow.",
      prospectType: "potential-customer",
      organization: "synthetic-payments-evaluator/example",
    });
    expect(qualifyOpportunity(productEvaluation, reachProfile, ["startups"], "potential-customers")).toEqual(expect.objectContaining({ prospectType: "potential-customer", profileMatches: expect.arrayContaining(["passkey-based payment interactions"]) }));
  });

  it("rejects Contracts Finder from product-owner qualification even when the tender mentions payment", () => {
    const tender = record({
      provider: "Contracts Finder",
      title: "Payment processing services",
      description: "The buyer is seeking a supplier for payment processing and customer communications.",
      organization: "Public Buyer",
      buyerIntent: "confirmed",
      noticeStatus: "active",
    });
    expect(qualifyOpportunity(tender, reachProfile, ["startups"], "active-requests")).toBeNull();
  });

  it("rejects the observed Jobicy full-time media recruitment false positive", () => {
    const observedRecruitment = record({
      provider: "Jobicy",
      title: "Director, Programmatic B2B",
      description: "We are looking for a Director, Programmatic to oversee the programmatic buying division of multiple B2B clients. This full-time role includes annual salary, benefits, and employee responsibilities.",
      type: "Full-Time",
      organization: "Wpromote",
      url: "https://jobicy.com/jobs/155535-director-programmatic-b2b",
    });
    const mediaBuyer: ProfileDraft = { ...profile, productsAndServices: [{ text: "Media planning and buying", evidence: ["media planning and buying"] }], skillsAndTechnologies: [], searchKeywords: ["media planning", "media buying"] };
    expect(classifyOpportunity(observedRecruitment, "active-requests")).toBe("full-time-employment");
    expect(qualifyOpportunity(observedRecruitment, mediaBuyer, ["agencies"], "active-requests")).toBeNull();
  });

  it("rejects a Jobicy contract-role listing when its source is recruitment rather than an external service request", () => {
    const observedContractRole = record({
      provider: "Jobicy",
      title: "Staff Machine Learning Engineer, Ads Foundational Representations",
      description: "Reddit is hiring for a staff engineering role. Responsibilities include building ads models and cross-functional projects. Qualifications, interviews, benefits, and candidate privacy information are provided.",
      type: "Contract",
      organization: "Reddit",
      url: "https://jobicy.com/jobs/155056-staff-machine-learning-engineer-ads-foundational-representations",
    });
    const mediaBuyer: ProfileDraft = { ...profile, productsAndServices: [{ text: "Media planning and buying", evidence: ["media planning and buying"] }], skillsAndTechnologies: [], searchKeywords: ["media planning", "media buying"] };
    expect(classifyOpportunity(observedContractRole, "active-requests")).toBe("unknown-employment-type");
    expect(qualifyOpportunity(observedContractRole, mediaBuyer, ["agencies"], "active-requests")).toBeNull();
  });

  it("preserves a genuinely contract-shaped Jobicy match for a service provider", () => {
    const contractListing = record({
      provider: "Jobicy",
      title: "Freelance media buying consultant",
      description: "Seeking a freelance media buying consultant for a project-based engagement supporting campaign planning and paid media execution.",
      type: "Contract",
      organization: "Example Agency",
      contactUrl: "https://jobicy.com/jobs/example-media-contract",
    });
    const mediaBuyer: ProfileDraft = { ...profile, productsAndServices: [{ text: "Media planning and buying", evidence: ["media planning and buying"] }], skillsAndTechnologies: [], searchKeywords: ["media planning", "media buying"] };
    expect(classifyOpportunity(contractListing, "active-requests")).toBe("freelance-or-contract");
    expect(qualifyOpportunity(contractListing, mediaBuyer, ["agencies"], "active-requests")).not.toBeNull();
  });

  it("does not let generic profile words establish product relevance", () => {
    const genericIssue = record({
      provider: "GitHub",
      title: "Operational backup preparation",
      description: "This issue records a read-only preparation stage and a simple way to review the work.",
      prospectType: "potential-customer",
      organization: "Example/project",
    });
    expect(qualifyOpportunity(genericIssue, reachProfile, ["startups"], "potential-customers")).toBeNull();
  });

  it("does not treat promotional company roundups as external requests", () => {
    const promotion = record({
      provider: "GitHub",
      title: "8 eCommerce App Development Companies Helping South African Businesses Go Mobile",
      description: "Businesses looking for a scalable eCommerce technology partner can compare these companies. Key Services include mobile development and payment integrations. Best for startups.",
      type: "public issue",
      organization: "example/promotion",
      prospectType: "potential-customer",
    });
    expect(classifyOpportunity(promotion, "active-requests")).not.toBe("explicit-project-request");
    expect(qualifyOpportunity(promotion, profile, ["startups"], "active-requests")).toBeNull();
  });

  it("rejects category-only matches for a service provider", () => {
    const categoryOnly = record({
      provider: "Jobicy",
      title: "Startup operations coordinator",
      description: "Help our startup organize its weekly work and customer meetings.",
      type: "contract",
      organization: "Example Startup",
    });
    expect(qualifyOpportunity(categoryOnly, profile, ["startups"], "active-requests")).toBeNull();
  });

  it("keeps specialized media buying eligible while rejecting broad branding overlap", () => {
    const northampton = record({
      provider: "Contracts Finder",
      title: "Media planning and buying services",
      description: "Northampton College invites tenders for media planning and buying services.",
      type: "tender · services",
      organization: "Northampton College",
      buyerIntent: "confirmed",
      noticeStatus: "active",
      deadline: new Date(Date.now() + 86_400_000).toISOString(),
      contactUrl: "https://www.contractsfinder.service.gov.uk/Notice/CA18543",
    });
    const mediaBuyer: ProfileDraft = { ...profile, productsAndServices: [{ text: "Media planning and buying", evidence: ["media planning and buying"] }], skillsAndTechnologies: [], searchKeywords: ["media planning", "media buying"] };
    const brandingProvider: ProfileDraft = { ...profile, productsAndServices: [{ text: "Brand strategy and visual identity", evidence: ["brand strategy"] }], skillsAndTechnologies: [], searchKeywords: ["branding", "visual identity"] };
    expect(qualifyOpportunity(northampton, mediaBuyer, ["small-businesses"], "active-requests")).not.toBeNull();
    expect(qualifyOpportunity(northampton, brandingProvider, ["small-businesses"], "active-requests")).toBeNull();
  });

  it("requires product-relevant demand for product owners", () => {
    const relevant = record({
      provider: "Hacker News",
      title: "Ask HN: How can we handle passkey peer-to-peer payments?",
      description: "We need a passkey-based peer-to-peer payment workflow for recipients. Could someone recommend a safer claim-link experience for a pilot?",
      prospectType: "potential-customer",
      organization: "Example Payments",
    });
    const irrelevant = record({
      provider: "Hacker News",
      title: "Ask HN: Looking for a graphic designer",
      description: "Could someone recommend a designer for our marketing site?",
      prospectType: "potential-customer",
      organization: "Example Studio",
    });
    expect(qualifyOpportunity(relevant, reachProfile, ["startups"], "potential-customers")).not.toBeNull();
    expect(qualifyOpportunity(irrelevant, reachProfile, ["startups"], "potential-customers")).toBeNull();
  });
});
