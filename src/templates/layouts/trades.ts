import type { TradesPages } from "../types";
import type { TemplateLayouts } from "./types";

export const tradesLayouts = {
  home: [
    { kind: "Hero", key: "hero" },
    { kind: "ServicesGrid", key: "servicesGridPreview" },
    { kind: "ServiceHighlights", key: "highlights" },
    { kind: "ServiceAreaList", key: "serviceAreaList", optional: true },
    { kind: "Gallery", key: "gallery", optional: true },
    { kind: "Testimonials", key: "testimonials", optional: true },
    { kind: "Quote", key: "featuredQuote", optional: true },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  services: [
    { kind: "PageHeader", key: "hero" },
    { kind: "TextSection", key: "intro", optional: true },
    { kind: "ServicesGrid", key: "servicesGrid" },
    { kind: "ServiceHighlights", key: "highlights", optional: true },
    { kind: "ProcessSteps", key: "processSteps", optional: true },
    { kind: "ServiceAreaList", key: "serviceAreaList", optional: true },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  about: [
    { kind: "PageHeader", key: "hero" },
    { kind: "TextSection", key: "story", optional: true },
    { kind: "SplitSections", key: "splitSections", optional: true },
    { kind: "Gallery", key: "gallery", optional: true },
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
} satisfies TemplateLayouts<TradesPages>;
