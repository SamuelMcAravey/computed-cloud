import type { ImageRef, Link, RoutePath } from "./base";

export type Paragraphs = string[];
export type Bullets = string[];

export type SectionHeadingData = {
  eyebrow?: string;
  headline: string;
  body?: string | Paragraphs;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  headingTag?: "h2" | "h3";
  maxWidth?: "none" | "narrow";
  class?: string;
};

export type HeroVariant = "simple" | "centered" | "background";
export type HeroSectionData = {
  variant?: HeroVariant;
  headline: string;
  subheadline?: string;
  highlights?: string[];
  primaryCta: Link;
  secondaryCta?: Link;
  image?: ImageRef;
  background?: { src: string; alt: string; overlay?: "none" | "light" | "dark" };
};

export type SplitSectionData = {
  eyebrow?: string;
  headline: string;
  body: Paragraphs;
  bullets?: Bullets;
  image: ImageRef;
  imageSide?: "left" | "right";
};

export type FeatureItem = { title: string; description: string };
export type FeatureGridData = {
  headline?: string;
  items: FeatureItem[];
};

export type TextSectionData = {
  headline: string;
  body: Paragraphs;
};

export type TestimonialsData = {
  items: Array<{ name: string; quote: string }>;
};

export type ServicesGridData = {
  headline?: string;
  body?: string;
  items: Array<{
    title: string;
    description: string;
    href?: RoutePath | string;
    icon?: ImageRef;
    iconName?: string;
  }>;
  variant?: "cards" | "minimal";
  columns?: 2 | 3 | 4;
};

export type ServiceHighlightsData = {
  eyebrow?: string;
  headline: string;
  body?: Paragraphs;
  highlights: string[];
  variant?: "check" | "dot";
  columns?: 1 | 2;
};

export type ServiceAreaListData = {
  eyebrow?: string;
  headline: string;
  body?: string;
  locations: string[];
  variant?: "columns" | "pills";
  columns?: 2 | 3;
  note?: string;
};

export type StatsBandData = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  stats: Array<{ label: string; value: string; sublabel?: string }>;
  variant?: "plain" | "cards";
};

export type ProcessStepsData = {
  eyebrow?: string;
  headline: string;
  body?: string;
  steps: Array<{ title: string; body?: string }>;
  variant?: "horizontal" | "vertical";
};

export type LogoCloudData = {
  headline?: string;
  body?: string;
  logos: Array<{ src: string; alt: string; href?: string }>;
  variant?: "strip" | "grid";
  columns?: 2 | 3 | 4 | 5 | 6;
  tone?: "plain" | "muted";
};

export type PricingPlan = {
  name: string;
  price?: string;
  priceNote?: string;
  description?: string;
  features: Bullets;
  cta: Link;
  featured?: boolean;
};

export type PricingPlansData = {
  eyebrow?: string;
  headline: string;
  body?: string;
  plans: PricingPlan[];
  variant?: "simple" | "withNotes";
  details?: {
    billingHeading?: string;
    billingSteps?: Bullets;
    includedHeading?: string;
    includedItems?: Bullets;
  };
};

export type ComparisonTableData = {
  headline?: string;
  body?: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<{
    label: string;
    values: Record<string, string | boolean | null>;
  }>;
  booleanStyle?: "check" | "yesno";
};

export type FAQAccordionData = {
  eyebrow?: string;
  headline: string;
  body?: string;
  items: Array<{ question: string; answer: string | string[] }>;
  openFirst?: boolean;
};

export type QuoteSectionData = {
  quote: string;
  name?: string;
  title?: string;
  company?: string;
  image?: ImageRef;
  tone?: "plain" | "muted";
};

export type CaseStudyGridData = {
  eyebrow?: string;
  headline: string;
  body?: string;
  items: Array<{
    title: string;
    summary: string;
    href?: RoutePath | string;
    image?: ImageRef;
    tags?: string[];
    metrics?: Array<{ label: string; value: string }>;
  }>;
  variant?: "cards" | "list";
};

export type GalleryGridData = {
  headline?: string;
  body?: string;
  items: Array<{
    src: string;
    alt: string;
    fullSrc?: string;
    caption?: string;
  }>;
  variant?: "grid" | "masonry";
  columns?: 2 | 3 | 4;
  lightbox?: boolean;
};

export type VideoEmbedData = {
  headline?: string;
  body?: string;
  title: string;
  provider: "youtube" | "vimeo";
  videoId: string;
  variant?: "embed" | "thumbnail";
  thumbnail?: ImageRef;
  aspect?: "16/9" | "4/3" | "1/1";
};

export type TeamGridData = {
  eyebrow?: string;
  headline: string;
  body?: string;
  members: Array<{
    name: string;
    role?: string;
    bio?: string;
    image?: ImageRef;
    social?: {
      linkedin?: string;
      x?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
    };
  }>;
  variant?: "compact" | "detailed";
};

export type TimelineData = {
  eyebrow?: string;
  headline: string;
  body?: string;
  items: Array<{ date?: string; title: string; body?: string }>;
  variant?: "vertical" | "horizontal";
};

export type ValuesGridData = {
  eyebrow?: string;
  headline: string;
  body?: string;
  items: Array<{ title: string; description: string; icon?: ImageRef }>;
  columns?: 2 | 3 | 4;
  variant?: "cards" | "plain";
};

export type ContactCardsData = {
  headline: string;
  phoneLabel?: string;
  emailLabel?: string;
  addressLabel?: string;
  serviceAreaLabel?: string;
};

export type ContactFormData = {
  headline: string;
  body?: string;
  notice?: string;
  successMessage: string;
  consentText: string;
  submitLabel: string;
  quickStart?: {
    headline: string;
    body?: string;
    cta: Link;
  };
  sections: {
    contact: {
      title: string;
      firstNameLabel: string;
      lastNameLabel: string;
      emailLabel: string;
      phoneLabel: string;
    };
    company: {
      title: string;
      companyLabel: string;
      industryLabel: string;
      industryPlaceholder: string;
      industryOptions: string[];
    };
    requirements: {
      title: string;
      servicesLabel: string;
      serviceOptions: Array<{ id: string; label: string }>;
      timelineLabel: string;
      timelinePlaceholder: string;
      timelineOptions: Array<{ value: string; label: string }>;
      volumeLabel: string;
      volumePlaceholder: string;
      detailsLabel: string;
      detailsPlaceholder: string;
    };
  };
};

export type CtaBannerData = {
  headline: string;
  body?: string;
  cta: Link;
};

export type PageSeo = {
  title?: string;
  description?: string;
  canonicalPath?: RoutePath;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
};
