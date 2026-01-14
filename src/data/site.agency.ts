import type { AgencySite, SiteConfig } from "../templates/types";
import { studioTheme } from "./themes";

export const site: SiteConfig = {
  template: "agency",

  business: {
    businessName: "McAravey Studio",
    tagline: "Simple, professional websites for local businesses.",
    shortDescription: "PLACEHOLDER: one sentence description.",
    phone: "BUSINESS_PHONE",
    email: "BUSINESS_EMAIL",
    serviceArea: "Billings, MT and surrounding areas",
  },

  brand: {
    primary: "#0F172A",
    accent: "#2563EB",
    dark: false,
  },
  theme: studioTheme,

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  headerCta: { label: "Request a quote", href: "/contact" },

  social: {
    linkedin: "LINKEDIN_URL",
    instagram: "INSTAGRAM_URL",
    youtube: "YOUTUBE_URL",
  },

  footer: {
    description: "Simple websites for local businesses.",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    serviceLinks: [
      { label: "New website", href: "/services" },
      { label: "Website refresh", href: "/services" },
    ],
    cta: {
      headline: "Want a clean website that’s done quickly?",
      body: "Tell us what you do and what you want customers to do next.",
      buttonLabel: "Request a quote",
      href: "/contact",
    },
    legalLinks: [
      { label: "Privacy Policy", href: "PRIVACY_POLICY_URL_OR_ROUTE" },
      { label: "Terms of Service", href: "TERMS_URL_OR_ROUTE" },
    ],
    copyrightName: "McAravey Studio",
  },

  seo: {
    canonicalBaseUrl: "CANONICAL_BASE_URL", // e.g. "https://mcaravey.studio"
    defaultTitle: "McAravey Studio",
    defaultDescription: "Simple, professional websites for local businesses.",
  },

  // Agency-only required block:
  offer: {
    packageName: "Simple Business Website",
    priceDisplay: "$995 flat",
    timelineDisplay: "Typically 7 days once content is received",
    paymentTermsDisplay: "50% to start, 50% at launch",
    included: [
      "Up to 4 pages",
      "Mobile-friendly",
      "Contact form",
      "Basic SEO setup",
      "Launch support",
    ],
    addOns: [
      { label: "Additional page", priceDisplay: "$150 each" },
      { label: "Gallery page", priceDisplay: "$100" },
      { label: "Copywriting help", priceDisplay: "$150" },
    ],
  },

  // Template contract: AgencyPages
  pages: {
    home: {
      hero: {
        headline: "A simple website that helps customers call and request a quote.",
        subheadline: "Clean, mobile-friendly sites with clear calls-to-action.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "See what’s included", href: "/services" },
        image: {
          src: "/images/hero/hero-home.jpg",
          alt: "A modern website displayed on phone and desktop",
          rights: "unknown",
        },
      },

      // EXACTLY 3 required:
      splitSections: [
        {
          eyebrow: "Credibility",
          headline: "Look professional on day one.",
          body: ["PLACEHOLDER: paragraph one.", "PLACEHOLDER: paragraph two."],
          bullets: ["Clear services", "Mobile-friendly", "Simple CTAs"],
          image: {
            src: "/images/sections/section-credibility.jpg",
            alt: "A clean services section",
            rights: "unknown",
          },
          imageSide: "right",
        },
        {
          eyebrow: "Speed",
          headline: "Fast turnaround with a proven structure.",
          body: ["PLACEHOLDER: paragraph one.", "PLACEHOLDER: paragraph two."],
          bullets: ["Standard pages", "One revision round", "Launch support"],
          image: {
            src: "/images/sections/section-speed.jpg",
            alt: "A build checklist and page layout",
            rights: "unknown",
          },
          imageSide: "left",
        },
        {
          eyebrow: "No lock-in",
          headline: "Own your site. Keep it simple.",
          body: ["PLACEHOLDER: paragraph one.", "PLACEHOLDER: paragraph two."],
          bullets: ["Client-owned domain", "Optional monthly updates", "No platform lock-in"],
          image: {
            src: "/images/sections/section-ownership.jpg",
            alt: "Ownership and hosting options",
            rights: "unknown",
          },
          imageSide: "right",
        },
      ],

      featureGrid: {
        headline: "What you get",
        items: [
          { title: "Mobile-friendly", description: "Looks good on phones and desktop." },
          { title: "Clear calls-to-action", description: "Make it easy to call or request a quote." },
          { title: "Contact form", description: "Messages go straight to your email." },
          { title: "Fast hosting + SSL", description: "Secure, reliable hosting with HTTPS." },
          { title: "Basic SEO setup", description: "Titles and descriptions for previews." },
          { title: "Easy add-ons", description: "Extra pages, gallery, copy help." },
        ],
      },

      pricingPlans: {
        headline: "Simple pricing",
        body: "PLACEHOLDER: any fine print or notes.",
        plans: [
          {
            name: "Standard",
            price: "$995",
            priceNote: "flat",
            features: [
              "Home / Services / About / Contact",
              "Mobile-friendly",
              "Contact form",
              "Basic SEO",
              "Launch support",
            ],
            cta: { label: "Request a quote", href: "/contact" },
            featured: true,
          },
        ],
      },

      faq: {
        headline: "FAQ",
        items: [
          {
            question: "How long does it take?",
            answer: "Typically 7 days once content is received.",
          },
          {
            question: "Do I own the site?",
            answer: "Yes. You own your domain and site content.",
          },
        ],
      },

      ctaBanner: {
        headline: "Ready to get started?",
        body: "Send your services and a few photos and we’ll take it from there.",
        cta: { label: "Request a quote", href: "/contact" },
      },
    },

    services: {
      hero: {
        headline: "Services",
        subheadline: "A clear package with optional add-ons.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "About", href: "/about" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Services page layout",
          rights: "unknown",
        },
      },

      intro: {
        headline: "A standard package that fits most local businesses",
        body: ["PLACEHOLDER: paragraph one.", "PLACEHOLDER: paragraph two."],
      },

      servicesGrid: {
        headline: "What we offer",
        items: [
          { title: "New small-business website", description: "A clean 4-page site." },
          { title: "Website refresh / rebuild", description: "Modernize an old site." },
          { title: "Copywriting help", description: "AI-assisted, you approve." },
          { title: "Gallery", description: "Before/after or projects." },
        ],
      },

      processSteps: {
        headline: "How it works",
        steps: [
          { title: "Quick intake", body: "5–10 minutes to gather basics." },
          { title: "Build + preview", body: "We build and send a preview link." },
          { title: "One revision round", body: "Small tweaks and polish." },
          { title: "Launch", body: "Deploy + domain + final checks." },
        ],
      },

      ctaBanner: {
        headline: "Not sure what you need?",
        body: "Tell us what you do and we’ll recommend a simple path.",
        cta: { label: "Contact us", href: "/contact" },
      },
    },

    about: {
      hero: {
        headline: "About",
        subheadline: "A practical, local-first approach to small-business websites.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-about.jpg",
          alt: "Working on a website layout",
          rights: "unknown",
        },
      },

      story: {
        headline: "Our story",
        body: [
          "PLACEHOLDER: why you started doing this.",
          "PLACEHOLDER: what kind of businesses you help.",
        ],
      },

      values: {
        headline: "What we optimize for",
        items: [
          { title: "Clarity", description: "Customers understand what you do fast." },
          { title: "Speed", description: "Short timeline and tight scope." },
          { title: "Ownership", description: "No platform lock-in." },
        ],
      },

      featuredQuote: {
        quote: "PLACEHOLDER: a short quote/testimonial.",
        name: "TESTIMONIAL_NAME",
        title: "BUSINESS_OWNER",
      },

      caseStudies: {
        headline: "Examples",
        items: [
          { title: "Example project", summary: "PLACEHOLDER: what changed and why." },
        ],
      },

      ctaBanner: {
        headline: "Want a website that doesn’t feel like a project?",
        body: "We keep it simple: clear pages, good copy, clean launch.",
        cta: { label: "Request a quote", href: "/contact" },
      },
    },

    pricing: {
      hero: {
        headline: "Pricing",
        subheadline: "Simple, flat packages for small-business sites.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Website layout preview",
          rights: "unknown",
        },
      },
      pricingPlans: {
        headline: "Website packages",
        body: "Straightforward scopes with a clear launch path.",
        plans: [
          {
            name: "Starter",
            price: "$995",
            description: "Single-page presence with clear CTAs.",
            features: ["Homepage", "Basic copy", "Mobile-ready"],
            cta: { label: "Request a quote", href: "/contact" },
          },
          {
            name: "Core",
            price: "$1,850",
            description: "Multi-page site for services or products.",
            features: ["4 pages", "CTA + contact", "Basic SEO setup"],
            cta: { label: "Request a quote", href: "/contact" },
            featured: true,
          },
          {
            name: "Plus",
            price: "$2,750",
            description: "Extra content and refinement.",
            features: ["6+ pages", "Additional sections", "Launch support"],
            cta: { label: "Request a quote", href: "/contact" },
          },
        ],
      },
      faq: {
        headline: "Pricing questions",
        items: [
          {
            question: "Do you offer add-ons?",
            answer: "Yes. We can add extra pages, copywriting, or advanced SEO as needed.",
          },
          {
            question: "What’s the typical timeline?",
            answer: "Most sites launch in 2–4 weeks depending on content readiness.",
          },
        ],
      },
      ctaBanner: {
        headline: "Want a clear quote?",
        body: "Tell us a little about your business and we’ll scope the right package.",
        cta: { label: "Request a quote", href: "/contact" },
      },
    },

    contact: {
      hero: {
        headline: "Contact",
        subheadline: "Tell us what you do and what you want the site to accomplish.",
        primaryCta: { label: "Send a message", href: "/contact#form" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-contact.jpg",
          alt: "Contact form section",
          rights: "unknown",
        },
      },

      contactCards: {
        headline: "Contact details",
        phoneLabel: "Phone",
        emailLabel: "Email",
        addressLabel: "Address",
        serviceAreaLabel: "Service area",
      },

      form: {
        headline: "Request a quote",
        body: "Share a little context and we’ll follow up with next steps.",
        notice: "PLACEHOLDER: response time note.",
        successMessage: "Thanks — we received your message and will follow up soon.",
        consentText: "PLACEHOLDER: consent language (optional).",
        submitLabel: "Submit",
        sections: {
          contact: {
            title: "Contact information",
            firstNameLabel: "First name",
            lastNameLabel: "Last name",
            emailLabel: "Email",
            phoneLabel: "Phone",
          },
          company: {
            title: "Business details",
            companyLabel: "Business name",
            industryLabel: "Industry",
            industryPlaceholder: "Select an industry",
            industryOptions: [
              "Construction / Trades",
              "Professional Services",
              "Retail",
              "Other",
            ],
          },
          requirements: {
            title: "Project details",
            servicesLabel: "Services needed",
            serviceOptions: [
              { id: "new-site", label: "New website" },
              { id: "rebuild", label: "Website refresh" },
              { id: "copy", label: "Copywriting help" },
            ],
            timelineLabel: "Timeline",
            timelinePlaceholder: "Select a timeline",
            timelineOptions: [
              { value: "asap", label: "ASAP" },
              { value: "1-2-weeks", label: "1–2 weeks" },
              { value: "this-month", label: "This month" },
              { value: "exploring", label: "Just exploring" },
            ],
            volumeLabel: "Estimated page count",
            volumePlaceholder: "e.g., 4 pages",
            detailsLabel: "Project notes",
            detailsPlaceholder: "Share any details, goals, or examples.",
          },
        },
      },

      ctaBanner: {
        headline: "Prefer a quick call?",
        body: "PLACEHOLDER: add a phone CTA if desired.",
        cta: { label: "Call us", href: "tel:BUSINESS_PHONE" },
      },
    },
  },
} satisfies AgencySite;
