import type { ConsultingPages } from "../types";
import type { TemplateLayouts } from "./types";

export const consultingLayouts = {
  home: [
    { kind: "Hero", key: "hero" },
    { kind: "ServicesGrid", key: "servicesGrid" },
    { kind: "ProcessSteps", key: "processSteps" },
    { kind: "SplitSections", key: "splitSections", optional: true },
    { kind: "StatsBand", key: "statsBand", optional: true },
    { kind: "LogoCloud", key: "logoCloud", optional: true },
    { kind: "CaseStudies", key: "caseStudies", optional: true },
    { kind: "Testimonials", key: "testimonials", optional: true },
    { kind: "Quote", key: "featuredQuote", optional: true },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  services: [
    { kind: "PageHeader", key: "hero" },
    { kind: "TextSection", key: "intro", optional: true },
    { kind: "ServicesGrid", key: "servicesGrid" },
    { kind: "ProcessSteps", key: "processSteps", optional: true },
    { kind: "CaseStudies", key: "caseStudies", optional: true },
    { kind: "Testimonials", key: "testimonials", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  about: [
    { kind: "PageHeader", key: "hero" },
    { kind: "TextSection", key: "story", optional: true },
    { kind: "ValuesGrid", key: "values", optional: true },
    { kind: "TeamGrid", key: "team", optional: true },
    { kind: "Timeline", key: "timeline", optional: true },
    { kind: "Testimonials", key: "testimonials", optional: true },
    { kind: "Quote", key: "featuredQuote", optional: true },
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
} satisfies TemplateLayouts<ConsultingPages>;
