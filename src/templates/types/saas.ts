import type { BaseSite } from "./base";
import type {
  HeroSectionData,
  SplitSectionData,
  FeatureGridData,
  ProcessStepsData,
  FAQAccordionData,
  QuoteSectionData,
  ContactCardsData,
  ContactFormData,
  CtaBannerData,
  PageSeo,
  ServicesGridData,
  TextSectionData,
  StatsBandData,
  PricingPlansData,
  ComparisonTableData,
  LogoCloudData,
  GalleryGridData,
  VideoEmbedData,
  TeamGridData,
  TimelineData,
  ValuesGridData,
  TestimonialsData,
  CaseStudyGridData,
} from "./sections";

export type SaasProduct = {
  productName: string;
  oneLiner: string;
  /** Keep optional unless you can guarantee it’s true */
  primaryMetricLabel?: string;
};

export type SaasPages = {
  home: {
    seo?: PageSeo;
    hero: HeroSectionData;

    /** SaaS often uses how-it-works steps */
    howItWorks?: ProcessStepsData;

    /** 1–3 split sections to explain value (can be fewer than agency) */
    splitSections?: SplitSectionData[];

    featureGrid: FeatureGridData;
    statsBand?: StatsBandData;
    pricingPlans?: PricingPlansData;
    comparisonTable?: ComparisonTableData;

    /** FAQ is common to address objections */
    faq?: FAQAccordionData;
    quote?: QuoteSectionData;
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

    /** Feature/services grid */
    servicesGrid: ServicesGridData;
    caseStudies?: CaseStudyGridData;

    ctaBanner: CtaBannerData;
  };

  about: {
    seo?: PageSeo;
    hero: HeroSectionData;

    splitSections?: SplitSectionData[];
    story?: TextSectionData;
    quote?: QuoteSectionData;
    team?: TeamGridData;
    timeline?: TimelineData;
    values?: ValuesGridData;
    testimonials?: TestimonialsData;

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

    contactCards?: ContactCardsData;
    form: ContactFormData;

    ctaBanner?: CtaBannerData;
  };
};

export type SaasSite = Omit<BaseSite, "template"> & {
  template: "saas";
  product: SaasProduct;
  pages: SaasPages;
};
