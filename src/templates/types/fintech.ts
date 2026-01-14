import type { BaseSite } from "./base";
import type {
  HeroSectionData,
  SplitSectionData,
  FeatureGridData,
  ProcessStepsData,
  ServicesGridData,
  FAQAccordionData,
  QuoteSectionData,
  CaseStudyGridData,
  LogoCloudData,
  StatsBandData,
  TextSectionData,
  ContactCardsData,
  ContactFormData,
  CtaBannerData,
  PageSeo,
  ComparisonTableData,
  PricingPlansData,
  TestimonialsData,
  TimelineData,
  ValuesGridData,
} from "./sections";

export type FintechProduct = {
  productName: string;
  oneLiner: string;
  /** Optional unless true */
  primaryMetricLabel?: string;
};

export type FintechTrust = {
  /** Required: a trust-first block for fintech tone */
  trustHighlights: FeatureGridData;

  /** Optional: linkable notes like “SOC 2”, “PCI”, etc. Only if real. */
  complianceNotes?: string[];
};

export type FintechPages = {
  home: {
    seo?: PageSeo;
    hero: HeroSectionData;

    /** Fintech: trust + clarity */
    trust: FeatureGridData;

    howItWorks?: ProcessStepsData;

    splitSections?: SplitSectionData[];

    featureGrid: FeatureGridData;

    statsBand?: StatsBandData;
    logoCloud?: LogoCloudData;

    pricingPlans?: PricingPlansData;
    comparisonTable?: ComparisonTableData;

    faq?: FAQAccordionData;
    quote?: QuoteSectionData;
    testimonials?: TestimonialsData;

    caseStudies?: CaseStudyGridData;

    ctaBanner: CtaBannerData;
  };

  services: {
    seo?: PageSeo;
    hero: HeroSectionData;

    intro?: TextSectionData;
    sampleOutput?: TextSectionData;
    splitSections?: SplitSectionData[];
    processSteps?: ProcessStepsData;

    servicesGrid: ServicesGridData;
    faq?: FAQAccordionData;

    ctaBanner: CtaBannerData;
  };

  about: {
    seo?: PageSeo;
    hero: HeroSectionData;

    story?: TextSectionData;
    splitSections?: SplitSectionData[];
    availableNow?: ServicesGridData;
    roadmap?: TimelineData;
    principles?: ValuesGridData;
    trustNote?: TextSectionData;

    quote?: QuoteSectionData;
    testimonials?: TestimonialsData;

    ctaBanner: CtaBannerData;
  };

  pricing: {
    seo?: PageSeo;
    hero: HeroSectionData;
    pricingPlans: PricingPlansData;
    pricingIntro?: TextSectionData;
    pricingCallouts?: ValuesGridData;
    faq?: FAQAccordionData;
    ctaBanner: CtaBannerData;
  };

  contact: {
    seo?: PageSeo;
    hero: HeroSectionData;

    contactCards?: ContactCardsData;
    form: ContactFormData;

    ctaBanner?: CtaBannerData;
  };
};

export type FintechSite = Omit<BaseSite, "template"> & {
  template: "fintech";

  product: FintechProduct;

  /** Required “extra” property */
  fintech: FintechTrust;

  pages: FintechPages;
};
