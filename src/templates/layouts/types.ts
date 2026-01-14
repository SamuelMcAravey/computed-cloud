export type RouteId = "home" | "services" | "about" | "pricing" | "contact";

export type SectionKind =
  | "Hero"
  | "HeroProductTruth"
  | "PageHeader"
  | "SplitSections"
  | "FeatureGrid"
  | "ServicesGrid"
  | "ServicesOrFeatureGrid"
  | "StatsBand"
  | "ProcessSteps"
  | "PricingPlans"
  | "PricingEstimator"
  | "ComparisonTable"
  | "FAQ"
  | "Quote"
  | "CaseStudies"
  | "Gallery"
  | "Video"
  | "LogoCloud"
  | "CtaBanner"
  | "TextSection"
  | "ServiceHighlights"
  | "ServiceAreaList"
  | "Testimonials"
  | "TeamGrid"
  | "Timeline"
  | "ValuesGrid"
  | "SampleOutput"
  | "ContactSection";

export type LayoutItem<TPage> = {
  kind: SectionKind;
  key?: keyof TPage & string;
  fallbackKey?: keyof TPage & string;
  optional?: boolean;
};

export type TemplateLayouts<TPages extends Record<RouteId, unknown>> = {
  [K in RouteId]: readonly LayoutItem<TPages[K]>[];
};
