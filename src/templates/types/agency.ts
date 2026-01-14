import type { BaseSite } from "./base";
import type {
  HeroSectionData,
  SplitSectionData,
  FeatureGridData,
  ServicesGridData,
  ServiceHighlightsData,
  ServiceAreaListData,
  ProcessStepsData,
  StatsBandData,
  LogoCloudData,
  PricingPlansData,
  ComparisonTableData,
  FAQAccordionData,
  QuoteSectionData,
  CaseStudyGridData,
  GalleryGridData,
  VideoEmbedData,
  TestimonialsData,
  TeamGridData,
  TimelineData,
  ValuesGridData,
  TextSectionData,
  ContactCardsData,
  ContactFormData,
  CtaBannerData,
  PageSeo,
} from "./sections";

export type AgencyOffer = {
  packageName: string;          // "Simple Business Website"
  priceDisplay: string;         // "$995 flat"
  timelineDisplay?: string;     // "Typically 7 days"
  paymentTermsDisplay?: string; // "50% to start, 50% at launch"
  included?: string[];
  addOns?: Array<{ label: string; priceDisplay: string }>;
};

export type AgencyPages = {
  home: {
    seo?: PageSeo;
    hero: HeroSectionData;

    /** The 3 “image + text side-by-side” sections */
    splitSections: [SplitSectionData, SplitSectionData, SplitSectionData];

    /** “What you get” / “Included” style grid */
    featureGrid?: FeatureGridData;

    servicesGridPreview?: ServicesGridData;
    statsBand?: StatsBandData;
    processSteps?: ProcessStepsData;

    /** Pricing block for the agency site is usually important */
    pricingPlans?: PricingPlansData;
    comparisonTable?: ComparisonTableData;

    /** Short FAQ to reduce objections */
    faq?: FAQAccordionData;
    featuredQuote?: QuoteSectionData;
    caseStudies?: CaseStudyGridData;
    gallery?: GalleryGridData;
    video?: VideoEmbedData;
    logoCloud?: LogoCloudData;

    ctaBanner: CtaBannerData;
  };

  services: {
    seo?: PageSeo;
    hero: HeroSectionData;

    intro?: TextSectionData;
    highlights?: ServiceHighlightsData;
    serviceAreaList?: ServiceAreaListData;

    /** What you do (service offerings) */
    servicesGrid: ServicesGridData;

    /** Simple process is common for agency/professional services */
    processSteps?: ProcessStepsData;
    caseStudies?: CaseStudyGridData;

    ctaBanner: CtaBannerData;
  };

  about: {
    seo?: PageSeo;
    hero: HeroSectionData;

    splitSections?: SplitSectionData[];
    story?: TextSectionData;
    values?: ValuesGridData;
    team?: TeamGridData;
    timeline?: TimelineData;
    testimonials?: TestimonialsData;
    featuredQuote?: QuoteSectionData;

    /** Optional portfolio/case studies */
    caseStudies?: CaseStudyGridData;

    ctaBanner: CtaBannerData;
  };

  pricing: {
    seo?: PageSeo;
    hero: HeroSectionData;
    pricingPlans: PricingPlansData;
    comparisonTable?: ComparisonTableData;
    faq?: FAQAccordionData;
    ctaBanner: CtaBannerData;
  };

  contact: {
    seo?: PageSeo;
    hero: HeroSectionData;

    contactCards: ContactCardsData;
    form: ContactFormData;

    ctaBanner?: CtaBannerData;
  };
};

export type AgencySite = Omit<BaseSite, "template"> & {
  template: "agency";
  offer: AgencyOffer;
  pages: AgencyPages;
};
