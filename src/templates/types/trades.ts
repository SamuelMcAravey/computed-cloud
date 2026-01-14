import type { BaseSite, BusinessBasics } from "./base";
import type {
  HeroSectionData,
  SplitSectionData,
  ServicesGridData,
  ServiceHighlightsData,
  ServiceAreaListData,
  GalleryGridData,
  TestimonialsData,
  QuoteSectionData,
  PricingPlansData,
  ComparisonTableData,
  FAQAccordionData,
  TextSectionData,
  ContactCardsData,
  ContactFormData,
  CtaBannerData,
  PageSeo,
  ProcessStepsData,
} from "./sections";

export type TradesBusinessBasics = BusinessBasics & {
  phone: string;
  serviceArea: string;
};

export type TradesProfile = {
  /** e.g. "Residential + commercial", "Emergency service", etc. Keep factual. */
  serviceNotes?: string;

  /** Useful for headlines like "Billings Fence Company" */
  primaryServiceNoun: string; // required for type-safety and templating
};

export type TradesPages = {
  home: {
    seo?: PageSeo;
    hero: HeroSectionData;

    /** Trades: usually fewer words, more proof + clarity */
    servicesGridPreview: ServicesGridData;

    highlights: ServiceHighlightsData;
    serviceAreaList?: ServiceAreaListData;

    gallery?: GalleryGridData;
    testimonials?: TestimonialsData;
    featuredQuote?: QuoteSectionData;

    faq?: FAQAccordionData;

    ctaBanner: CtaBannerData;
  };

  services: {
    seo?: PageSeo;
    hero: HeroSectionData;

    intro?: TextSectionData;

    servicesGrid: ServicesGridData;

    highlights?: ServiceHighlightsData;
    processSteps?: ProcessStepsData;
    serviceAreaList?: ServiceAreaListData;

    faq?: FAQAccordionData;
    ctaBanner: CtaBannerData;
  };

  about: {
    seo?: PageSeo;
    hero: HeroSectionData;

    story?: TextSectionData;
    splitSections?: SplitSectionData[];

    gallery?: GalleryGridData;
    testimonials?: TestimonialsData;
    featuredQuote?: QuoteSectionData;

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

export type TradesSite = Omit<BaseSite, "template" | "business"> & {
  template: "trades";

  /** Strengthen business requirements for this template */
  business: TradesBusinessBasics;

  /** Required “extra” property */
  trades: TradesProfile;

  pages: TradesPages;
};
