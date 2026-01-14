import type { FintechPages } from "../types";
import type { TemplateLayouts } from "./types";

export const fintechLayouts = {
  home: [
    { kind: "HeroProductTruth", key: "hero" },
    { kind: "ProcessSteps", key: "howItWorks", optional: true },
    { kind: "FeatureGrid", key: "featureGrid" },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  services: [
    { kind: "HeroProductTruth", key: "hero" },
    { kind: "TextSection", key: "intro", optional: true },
    { kind: "SampleOutput", key: "sampleOutput", optional: true },
    { kind: "ProcessSteps", key: "processSteps", optional: true },
    { kind: "ServicesGrid", key: "servicesGrid" },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  about: [
    { kind: "PageHeader", key: "hero" },
    { kind: "TextSection", key: "story", optional: true },
    { kind: "ServicesGrid", key: "availableNow", optional: true },
    { kind: "Timeline", key: "roadmap", optional: true },
    { kind: "ValuesGrid", key: "principles", optional: true },
    { kind: "TextSection", key: "trustNote", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  pricing: [
    { kind: "PageHeader", key: "hero" },
    { kind: "PricingPlans", key: "pricingPlans" },
    { kind: "PricingEstimator" },
    { kind: "ValuesGrid", key: "pricingCallouts", optional: true },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  contact: [
    { kind: "PageHeader", key: "hero" },
    { kind: "ContactSection" },
    { kind: "CtaBanner", key: "ctaBanner", optional: true },
  ],
} satisfies TemplateLayouts<FintechPages>;
