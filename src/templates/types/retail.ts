import type { BaseSite, BusinessBasics } from "./base";
import type {
  HeroSectionData,
  GalleryGridData,
  ServicesGridData,
  TextSectionData,
  SplitSectionData,
  VideoEmbedData,
  TestimonialsData,
  QuoteSectionData,
  FAQAccordionData,
  PricingPlansData,
  ComparisonTableData,
  ContactCardsData,
  ContactFormData,
  CtaBannerData,
  PageSeo,
  ServiceAreaListData,
} from "./sections";

export type RetailBusinessBasics = BusinessBasics & {
  addressLine: string;
  cityStateZip: string;
  hoursText: string[];
};

export type RetailProfile = {
  /** e.g. "Bakery", "Café", "Shop", "Studio" */
  venueType: string;

  /** Optional: used for “Order / Catering / Reservations” CTA framing */
  primaryCtaMode: "visit" | "order" | "catering" | "contact";
};

export type RetailPages = {
  home: {
    seo?: PageSeo;
    hero: HeroSectionData;

    /** REQUIRED: retail is visual; make home have a gallery */
    gallery: GalleryGridData;

    /**
     * Use ServicesGridData to represent:
     * - “Menu highlights”
     * - “Offerings”
     * - “Popular items”
     */
    offerings: ServicesGridData;

    /** Optional: short story / brand vibe */
    story?: TextSectionData;

    /** Optional: promo video (e.g. YouTube short) */
    video?: VideoEmbedData;

    faq?: FAQAccordionData;

    ctaBanner: CtaBannerData;
  };

  services: {
    seo?: PageSeo;
    hero: HeroSectionData;

    /** For bakery: this can be “Menu”, “Catering”, etc. */
    intro?: TextSectionData;

    offerings: ServicesGridData;
    faq?: FAQAccordionData;

    ctaBanner: CtaBannerData;
  };

  about: {
    seo?: PageSeo;
    hero: HeroSectionData;

    story?: TextSectionData;
    splitSections?: SplitSectionData[];

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

    /** Optional: sometimes “service area” is still relevant (delivery radius) */
    serviceAreaList?: ServiceAreaListData;

    ctaBanner?: CtaBannerData;
  };
};

export type RetailSite = Omit<BaseSite, "template" | "business"> & {
  template: "retail";

  business: RetailBusinessBasics;

  /** Required “extra” property */
  retail: RetailProfile;

  pages: RetailPages;
};
