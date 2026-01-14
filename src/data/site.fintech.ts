import type { FintechSite, SiteConfig } from "../templates/types";
import { incursaTheme } from "./themes";

export const site: SiteConfig = {
  template: "fintech",

  business: {
    businessName: "Incursa",
    tagline: "Invoice OCR and normalization for AP teams.",
    shortDescription: "Convert vendor PDFs into structured, normalized outputs.",
    email: "BUSINESS_EMAIL",
    serviceArea: "Remote / United States",
  },

  brand: {
    primary: "#262A63",
    accent: "#A475FF",
    dark: false,
  },
  theme: incursaTheme,

  nav: [
    { label: "Home", href: "/" },
    { label: "Product", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  headerCta: { label: "Request a demo", href: "/contact" },

  social: {
    linkedin: "LINKEDIN_URL",
    x: "X_URL",
  },

  footer: {
    description: "Invoice OCR + normalization for AP teams.",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Product", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: {
      headline: "Want to see it on your invoices?",
      body: "Send a couple sample PDFs and we’ll show the structured output.",
      buttonLabel: "Request a demo",
      href: "/contact",
    },
    legalLinks: [
      { label: "Privacy Policy", href: "PRIVACY_POLICY_URL_OR_ROUTE" },
      { label: "Terms of Service", href: "TERMS_URL_OR_ROUTE" },
    ],
    copyrightName: "Incursa",
  },

  product: {
    productName: "Incursa",
    oneLiner: "Invoice OCR that produces clean, usable data.",
    primaryMetricLabel: "PLACEHOLDER (only if real)",
  },

  fintech: {
    trustHighlights: {
      headline: "Built for reliability and auditability",
      items: [
        { title: "Human-in-the-loop", description: "Review exceptions instead of retyping everything." },
        { title: "Stable outputs", description: "Predictable JSON/CSV fields for downstream systems." },
        { title: "Audit-friendly", description: "Keep source docs and extracted values connected." },
        { title: "Practical onboarding", description: "Start with exports, add automation later." },
      ],
    },
    complianceNotes: ["PLACEHOLDER: only list real compliance items if applicable."],
  },

  pages: {
    home: {
      hero: {
        headline: "Invoice OCR that produces clean, usable data.",
        subheadline: "Convert vendor PDFs into normalized outputs so AP teams move faster with fewer exceptions.",
        primaryCta: { label: "Request a demo", href: "/contact" },
        secondaryCta: { label: "View product", href: "/services" },
        image: {
          src: "/images/hero/hero-home.jpg",
          alt: "Invoice PDF transformed into structured fields",
          rights: "unknown",
        },
      },

      trust: {
        headline: "Trust-first by design",
        items: [
          { title: "Clear outputs", description: "Stable fields and predictable formatting." },
          { title: "Exception-focused", description: "Spend time only where needed." },
          { title: "Reviewable", description: "Understand and correct extracted values." },
          { title: "Export-ready", description: "Files you can map to your process." },
        ],
      },

      featureGrid: {
        headline: "Capabilities",
        items: [
          { title: "OCR extraction", description: "Extract header fields and line items from PDFs." },
          { title: "Normalization", description: "Normalize outputs into a consistent schema." },
          { title: "Exports", description: "JSON/CSV outputs for mapping and handoff." },
          { title: "Validation hooks", description: "Surface anomalies and missing fields." },
          { title: "Review workflow", description: "Correct low-confidence fields." },
          { title: "Integration-ready", description: "Start with exports; automate later." },
        ],
      },

      faq: {
        headline: "FAQ",
        items: [
          { question: "What types of invoices work best?", answer: "PLACEHOLDER" },
          { question: "How do we send sample PDFs?", answer: "PLACEHOLDER" },
        ],
      },

      ctaBanner: {
        headline: "Want to see it on your invoices?",
        body: "Send 2–3 sample PDFs and tell us your target output format.",
        cta: { label: "Request a demo", href: "/contact" },
      },
    },

    services: {
      hero: {
        headline: "Product",
        subheadline: "Everything you need to turn invoice PDFs into structured outputs.",
        primaryCta: { label: "Request a demo", href: "/contact" },
        secondaryCta: { label: "About", href: "/about" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Invoice data extraction and export",
          rights: "unknown",
        },
      },

      intro: {
        headline: "Start small, then automate",
        body: ["Begin with exports. Add integration once outputs match your requirements."],
      },

      servicesGrid: {
        headline: "What it includes",
        items: [
          { title: "Invoice OCR extraction", description: "Extract header fields and line items." },
          { title: "Normalization", description: "Consistent schema across vendors." },
          { title: "Exports", description: "JSON/CSV ready for mapping." },
          { title: "Review workflow", description: "Correct exceptions quickly." },
        ],
      },

      ctaBanner: {
        headline: "Need a specific export format?",
        body: "Tell us the target system and fields you need.",
        cta: { label: "Contact us", href: "/contact" },
      },
    },

    about: {
      hero: {
        headline: "About",
        subheadline: "Quiet, practical tools for AP teams.",
        primaryCta: { label: "Talk to us", href: "/contact" },
        secondaryCta: { label: "View product", href: "/services" },
        image: {
          src: "/images/hero/hero-about.jpg",
          alt: "Back-office team working with documents",
          rights: "unknown",
        },
      },

      story: {
        headline: "Our story",
        body: [
          "PLACEHOLDER: why you started Incursa.",
          "PLACEHOLDER: what you’re building next (no overpromises).",
        ],
      },

      ctaBanner: {
        headline: "Want to reduce PDF re-keying?",
        body: "We can show a simple extraction + normalization flow on your documents.",
        cta: { label: "Request a demo", href: "/contact" },
      },
    },

    pricing: {
      hero: {
        headline: "Pricing",
        subheadline: "Start with a self-serve plan or talk to us about volume workflows.",
        primaryCta: { label: "Request a demo", href: "/contact" },
        secondaryCta: { label: "View product", href: "/services" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Product overview dashboard",
          rights: "unknown",
        },
      },
      pricingPlans: {
        headline: "Plans",
        body: "Start simple and scale when volume grows.",
        plans: [
          {
            name: "Starter",
            price: "Custom",
            description: "For testing and early usage.",
            features: ["PDF extraction", "Review workflow", "JSON/CSV export"],
            cta: { label: "Request a demo", href: "/contact" },
          },
          {
            name: "Team",
            price: "Custom",
            description: "For AP teams processing invoices weekly.",
            features: ["Batch uploads", "Team access", "Priority support"],
            cta: { label: "Talk to sales", href: "/contact" },
            featured: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            description: "For high-volume or integrated workflows.",
            features: ["Custom exports", "Onboarding support", "Security review"],
            cta: { label: "Contact us", href: "/contact" },
          },
        ],
      },
      faq: {
        headline: "Pricing questions",
        items: [
          {
            question: "How is pricing structured?",
            answer: "Pricing is based on invoice volume and workflow requirements.",
          },
          {
            question: "Can we run a pilot?",
            answer: "Yes. Reach out and we can outline a pilot plan.",
          },
        ],
      },
      ctaBanner: {
        headline: "Ready to see pricing for your volume?",
        body: "Share your invoice volume and workflow details.",
        cta: { label: "Request a demo", href: "/contact" },
      },
    },

    contact: {
      hero: {
        headline: "Contact",
        subheadline: "Tell us what invoices you have and what output you need.",
        primaryCta: { label: "Send a message", href: "/contact#form" },
        secondaryCta: { label: "View product", href: "/services" },
        image: {
          src: "/images/hero/hero-contact.jpg",
          alt: "Support and onboarding for AP tooling",
          rights: "unknown",
        },
      },

      form: {
        headline: "Request a demo",
        body: "Share context and we’ll follow up with next steps.",
        successMessage: "Thanks — we received your message and will follow up soon.",
        consentText: "PLACEHOLDER: consent language.",
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
            title: "Company details",
            companyLabel: "Company name",
            industryLabel: "Industry",
            industryPlaceholder: "Select an industry",
            industryOptions: ["Construction", "Manufacturing", "Healthcare", "Other"],
          },
          requirements: {
            title: "Project needs",
            servicesLabel: "Services needed",
            serviceOptions: [
              { id: "ocr", label: "Invoice OCR extraction" },
              { id: "normalization", label: "Normalization" },
              { id: "export", label: "Exports" },
              { id: "integration", label: "Integration" },
            ],
            timelineLabel: "Timeline",
            timelinePlaceholder: "Select a timeline",
            timelineOptions: [
              { value: "this-month", label: "This month" },
              { value: "1-3-months", label: "1–3 months" },
              { value: "exploring", label: "Just exploring" },
            ],
            volumeLabel: "Monthly invoice volume",
            volumePlaceholder: "e.g., 2,000 invoices",
            detailsLabel: "Requirements",
            detailsPlaceholder: "Share formats, outputs, or system constraints.",
          },
        },
      },
    },
  },
} satisfies FintechSite;
