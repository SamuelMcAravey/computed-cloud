import type { BaseSite, BusinessBasics } from "./base";
import type {
  HeroSectionData,
  SplitSectionData,
  ServicesGridData,
  ProcessStepsData,
  StatsBandData,
  LogoCloudData,
  CaseStudyGridData,
  TestimonialsData,
  QuoteSectionData,
  PricingPlansData,
  ComparisonTableData,
  ValuesGridData,
  TeamGridData,
  TimelineData,
  TextSectionData,
  ContactCardsData,
  ContactFormData,
  CtaBannerData,
  FAQAccordionData,
  PageSeo,
} from "./sections";

export type ConsultingProfile = {
  /** e.g. "Tech consulting for small construction software teams" */
  positioningHeadline: string;
  positioningSubheadline?: string;

  /** Optional: helps fill “who we help” sections */
  targetClients?: string[];

  /** Optional: can be used for “Capabilities” bullets */
  focusAreas?: string[];
};

export type ConsultingPages = {
  home: {
    seo?: PageSeo;
    hero: HeroSectionData;

    splitSections?: SplitSectionData[];
    statsBand?: StatsBandData;
    logoCloud?: LogoCloudData;

    /** Required: consulting sites live/die by services clarity */
    servicesGrid: ServicesGridData;

    /** Required: show process so prospects trust execution */
    processSteps: ProcessStepsData;

    caseStudies?: CaseStudyGridData;
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
    processSteps?: ProcessStepsData;

    caseStudies?: CaseStudyGridData;
    testimonials?: TestimonialsData;

    ctaBanner: CtaBannerData;
  };

  about: {
    seo?: PageSeo;
    hero: HeroSectionData;

    story?: TextSectionData;
    values?: ValuesGridData;
    team?: TeamGridData;
    timeline?: TimelineData;

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

export type ConsultingSite = Omit<BaseSite, "template"> & {
  template: "consulting";

  /** Required “extra” property (for type-safety testing and contract completeness) */
  consulting: ConsultingProfile;

  pages: ConsultingPages;
};
