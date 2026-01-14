import type { AgencyPages } from "../types";
import type { TemplateLayouts } from "./types";

export const agencyLayouts = {
  home: [
    { kind: "Hero", key: "hero" },
    { kind: "SplitSections", key: "splitSections" },
    {
      kind: "ServicesOrFeatureGrid",
      key: "servicesGridPreview",
      fallbackKey: "featureGrid",
    },
    { kind: "StatsBand", key: "statsBand", optional: true },
    { kind: "ProcessSteps", key: "processSteps", optional: true },
    { kind: "PricingPlans", key: "pricingPlans", optional: true },
    { kind: "ComparisonTable", key: "comparisonTable", optional: true },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "Quote", key: "featuredQuote", optional: true },
    { kind: "CaseStudies", key: "caseStudies", optional: true },
    { kind: "Gallery", key: "gallery", optional: true },
    { kind: "Video", key: "video", optional: true },
    { kind: "LogoCloud", key: "logoCloud", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  services: [
    { kind: "Hero", key: "hero" },
    { kind: "TextSection", key: "intro", optional: true },
    { kind: "ServiceHighlights", key: "highlights", optional: true },
    { kind: "ServiceAreaList", key: "serviceAreaList", optional: true },
    { kind: "ServicesGrid", key: "servicesGrid" },
    { kind: "ProcessSteps", key: "processSteps", optional: true },
    { kind: "CaseStudies", key: "caseStudies", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  about: [
    { kind: "Hero", key: "hero" },
    { kind: "SplitSections", key: "splitSections", optional: true },
    { kind: "TextSection", key: "story", optional: true },
    { kind: "ValuesGrid", key: "values", optional: true },
    { kind: "TeamGrid", key: "team", optional: true },
    { kind: "Timeline", key: "timeline", optional: true },
    { kind: "Testimonials", key: "testimonials", optional: true },
    { kind: "Quote", key: "featuredQuote", optional: true },
    { kind: "CaseStudies", key: "caseStudies", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  pricing: [
    { kind: "Hero", key: "hero" },
    { kind: "PricingPlans", key: "pricingPlans" },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  contact: [
    { kind: "Hero", key: "hero" },
    { kind: "ContactSection" },
    { kind: "CtaBanner", key: "ctaBanner", optional: true },
  ],
} satisfies TemplateLayouts<AgencyPages>;
