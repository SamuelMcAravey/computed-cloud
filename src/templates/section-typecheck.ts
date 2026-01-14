import type {
  CaseStudyGridData,
  ComparisonTableData,
  ContactCardsData,
  ContactFormData,
  CtaBannerData,
  FAQAccordionData,
  FeatureGridData,
  GalleryGridData,
  HeroSectionData,
  LogoCloudData,
  PricingPlansData,
  ProcessStepsData,
  QuoteSectionData,
  ServiceAreaListData,
  ServiceHighlightsData,
  ServicesGridData,
  SplitSectionData,
  StatsBandData,
  TeamGridData,
  TextSectionData,
  TimelineData,
  ValuesGridData,
  VideoEmbedData,
  TestimonialsData,
} from "./types/sections";

const heroExample: HeroSectionData = {
  headline: "Hero headline",
  subheadline: "Supporting subheadline text.",
  primaryCta: { label: "Get started", href: "/contact" },
  secondaryCta: { label: "Learn more", href: "/about" },
  variant: "simple",
  image: { src: "/images/hero.jpg", alt: "Hero image" },
};

const splitExample: SplitSectionData = {
  eyebrow: "Eyebrow",
  headline: "Split headline",
  body: ["First paragraph.", "Second paragraph."],
  image: { src: "/images/sections/section-1.jpg", alt: "Section image" },
  imageSide: "right",
  bullets: ["Bullet one", "Bullet two"],
};

const featureGridExample: FeatureGridData = {
  headline: "Feature grid",
  items: [{ title: "Feature", description: "Feature description." }],
};

const textSectionExample: TextSectionData = {
  headline: "Text section",
  body: ["Paragraph one.", "Paragraph two."],
};

const testimonialsExample: TestimonialsData = {
  items: [{ name: "Customer", quote: "Short testimonial." }],
};

const servicesGridExample: ServicesGridData = {
  headline: "Services",
  body: "Services overview.",
  items: [
    {
      title: "Service One",
      description: "Description.",
      href: "/services",
      icon: { src: "/images/brand/logo-icon.svg", alt: "Service icon" },
    },
  ],
  variant: "cards",
  columns: 3,
};

const highlightsExample: ServiceHighlightsData = {
  eyebrow: "Highlights",
  headline: "Service highlights",
  body: ["Short intro."],
  highlights: ["Highlight one", "Highlight two"],
  variant: "check",
  columns: 2,
};

const serviceAreaExample: ServiceAreaListData = {
  headline: "Locations served",
  locations: ["Location One", "Location Two"],
  variant: "columns",
  columns: 2,
  note: "And surrounding areas.",
};

const statsBandExample: StatsBandData = {
  eyebrow: "Stats",
  headline: "Key metrics",
  stats: [{ label: "Metric", value: "98%" }],
  variant: "cards",
};

const processStepsExample: ProcessStepsData = {
  headline: "How it works",
  steps: [{ title: "Step One", body: "Step details." }],
  variant: "horizontal",
};

const pricingExample: PricingPlansData = {
  headline: "Pricing",
  plans: [
    {
      name: "Plan",
      price: "Custom",
      features: ["Feature one"],
      cta: { label: "Contact", href: "/contact" },
      featured: true,
    },
  ],
  variant: "withNotes",
};

const comparisonExample: ComparisonTableData = {
  headline: "Compare plans",
  columns: [{ key: "planA", label: "Plan A" }],
  rows: [{ label: "Support", values: { planA: true } }],
  booleanStyle: "check",
};

const faqExample: FAQAccordionData = {
  headline: "FAQ",
  items: [{ question: "Question?", answer: "Answer." }],
  openFirst: true,
};

const quoteExample: QuoteSectionData = {
  quote: "A concise quote.",
  name: "Person Name",
  title: "Title",
  company: "Company",
  image: { src: "/images/sections/section-2.jpg", alt: "Portrait" },
  tone: "muted",
};

const caseStudyExample: CaseStudyGridData = {
  headline: "Case studies",
  items: [
    {
      title: "Case Study",
      summary: "Summary text.",
      href: "/services",
      image: { src: "/images/sections/section-3.jpg", alt: "Case study image" },
      tags: ["Category"],
      metrics: [{ label: "Impact", value: "15%" }],
    },
  ],
  variant: "cards",
};

const galleryExample: GalleryGridData = {
  headline: "Gallery",
  items: [
    {
      src: "/images/sections/section-1.jpg",
      alt: "Gallery image",
      caption: "Caption",
    },
  ],
  variant: "grid",
  columns: 3,
  lightbox: false,
};

const videoExample: VideoEmbedData = {
  headline: "Video",
  title: "Video title",
  provider: "youtube",
  videoId: "your-video-id",
  variant: "embed",
  aspect: "16/9",
};

const teamExample: TeamGridData = {
  headline: "Team",
  members: [
    {
      name: "Team Member",
      role: "Role",
      bio: "Bio text.",
      image: { src: "/images/sections/section-4.jpg", alt: "Team portrait" },
      social: { linkedin: "https://example.com" },
    },
  ],
  variant: "detailed",
};

const timelineExample: TimelineData = {
  headline: "Timeline",
  items: [{ date: "2024", title: "Milestone", body: "Details." }],
  variant: "vertical",
};

const valuesExample: ValuesGridData = {
  headline: "Values",
  items: [{ title: "Value", description: "Description." }],
  variant: "cards",
  columns: 3,
};

const logoCloudExample: LogoCloudData = {
  headline: "Trusted by teams",
  logos: [{ src: "/images/brand/logo-icon.svg", alt: "Logo" }],
  variant: "grid",
  columns: 4,
  tone: "muted",
};

const contactCardsExample: ContactCardsData = {
  headline: "Contact details",
  phoneLabel: "Phone",
  emailLabel: "Email",
};

const contactFormExample: ContactFormData = {
  headline: "Contact form",
  successMessage: "Thanks.",
  consentText: "Consent text.",
  submitLabel: "Submit",
  sections: {
    contact: {
      title: "Contact",
      firstNameLabel: "First name",
      lastNameLabel: "Last name",
      emailLabel: "Email",
      phoneLabel: "Phone",
    },
    company: {
      title: "Company",
      companyLabel: "Company",
      industryLabel: "Industry",
      industryPlaceholder: "Select industry",
      industryOptions: ["Option"],
    },
    requirements: {
      title: "Requirements",
      servicesLabel: "Services",
      serviceOptions: [{ id: "service", label: "Service" }],
      timelineLabel: "Timeline",
      timelinePlaceholder: "Select timeline",
      timelineOptions: [{ value: "soon", label: "Soon" }],
      volumeLabel: "Volume",
      volumePlaceholder: "Estimate",
      detailsLabel: "Details",
      detailsPlaceholder: "Details",
    },
  },
};

const ctaBannerExample: CtaBannerData = {
  headline: "Ready to start?",
  body: "Short supporting text.",
  cta: { label: "Contact", href: "/contact" },
};

void [
  heroExample,
  splitExample,
  featureGridExample,
  textSectionExample,
  testimonialsExample,
  servicesGridExample,
  highlightsExample,
  serviceAreaExample,
  statsBandExample,
  processStepsExample,
  pricingExample,
  comparisonExample,
  faqExample,
  quoteExample,
  caseStudyExample,
  galleryExample,
  videoExample,
  teamExample,
  timelineExample,
  valuesExample,
  logoCloudExample,
  contactCardsExample,
  contactFormExample,
  ctaBannerExample,
];
