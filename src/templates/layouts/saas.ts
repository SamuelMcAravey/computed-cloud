import type { SaasPages } from "../types";
import type { TemplateLayouts } from "./types";

export const saasLayouts = {
  home: [
    { kind: "Hero", key: "hero" },
    { kind: "ProcessSteps", key: "howItWorks", optional: true },
    { kind: "SplitSections", key: "splitSections", optional: true },
    { kind: "FeatureGrid", key: "featureGrid" },
    { kind: "StatsBand", key: "statsBand", optional: true },
    { kind: "PricingPlans", key: "pricingPlans", optional: true },
    { kind: "ComparisonTable", key: "comparisonTable", optional: true },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "Quote", key: "quote", optional: true },
    { kind: "CaseStudies", key: "caseStudies", optional: true },
    { kind: "Gallery", key: "gallery", optional: true },
    { kind: "Video", key: "video", optional: true },
    { kind: "LogoCloud", key: "logoCloud", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  services: [
    { kind: "PageHeader", key: "hero" },
    { kind: "TextSection", key: "intro", optional: true },
    { kind: "ServicesGrid", key: "servicesGrid" },
    { kind: "CaseStudies", key: "caseStudies", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  about: [
    { kind: "PageHeader", key: "hero" },
    { kind: "SplitSections", key: "splitSections", optional: true },
    { kind: "TextSection", key: "story", optional: true },
    { kind: "Quote", key: "quote", optional: true },
    { kind: "TeamGrid", key: "team", optional: true },
    { kind: "Timeline", key: "timeline", optional: true },
    { kind: "ValuesGrid", key: "values", optional: true },
    { kind: "Testimonials", key: "testimonials", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  pricing: [
    { kind: "PageHeader", key: "hero" },
    { kind: "PricingPlans", key: "pricingPlans" },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  contact: [
    { kind: "PageHeader", key: "hero" },
    { kind: "ContactSection" },
    { kind: "CtaBanner", key: "ctaBanner", optional: true },
  ],
} satisfies TemplateLayouts<SaasPages>;
