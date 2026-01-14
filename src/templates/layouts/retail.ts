import type { RetailPages } from "../types";
import type { TemplateLayouts } from "./types";

export const retailLayouts = {
  home: [
    { kind: "Hero", key: "hero" },
    { kind: "Gallery", key: "gallery" },
    { kind: "ServicesGrid", key: "offerings" },
    { kind: "TextSection", key: "story", optional: true },
    { kind: "Video", key: "video", optional: true },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  services: [
    { kind: "PageHeader", key: "hero" },
    { kind: "TextSection", key: "intro", optional: true },
    { kind: "ServicesGrid", key: "offerings" },
    { kind: "FAQ", key: "faq", optional: true },
    { kind: "CtaBanner", key: "ctaBanner" },
  ],
  about: [
    { kind: "PageHeader", key: "hero" },
    { kind: "TextSection", key: "story", optional: true },
    { kind: "SplitSections", key: "splitSections", optional: true },
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
    { kind: "ServiceAreaList", key: "serviceAreaList", optional: true },
    { kind: "CtaBanner", key: "ctaBanner", optional: true },
  ],
} satisfies TemplateLayouts<RetailPages>;
