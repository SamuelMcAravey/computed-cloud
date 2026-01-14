import type { SaasSite, SiteConfig } from "../templates/types";
import { vendorHubTheme } from "./themes";

export const site: SiteConfig = {
  template: "saas",

  business: {
    businessName: "VendorHub",
    tagline: "PLACEHOLDER: one-line value proposition.",
    shortDescription: "PLACEHOLDER: short descriptionon what the product does.",
    email: "BUSINESS_EMAIL",
  },

  brand: {
    primary: "#0F172A",
    accent: "#22C55E",
    dark: false,
  },
  theme: vendorHubTheme,

  nav: [
    { label: "Home", href: "/" },
    { label: "Product", href: "/services" }, // still /services route, just relabeled
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  headerCta: { label: "Request a demo", href: "/contact" },

  footer: {
    description: "PLACEHOLDER: short footer summary.",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Product", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: {
      headline: "Want to see it in action?",
      body: "Tell us your use case and we’ll follow up.",
      buttonLabel: "Request a demo",
      href: "/contact",
    },
    legalLinks: [
      { label: "Privacy Policy", href: "PRIVACY_POLICY_URL_OR_ROUTE" },
      { label: "Terms of Service", href: "TERMS_URL_OR_ROUTE" },
    ],
    copyrightName: "VendorHub",
  },

  seo: {
    canonicalBaseUrl: "CANONICAL_BASE_URL",
    defaultTitle: "VendorHub",
    defaultDescription: "PLACEHOLDER: default meta description.",
  },

  // SaaS-only required block:
  product: {
    productName: "VendorHub",
    oneLiner: "PLACEHOLDER: what it does in one sentence.",
    primaryMetricLabel: "PLACEHOLDER (only if real)", // optional
  },

  pages: {
    home: {
      hero: {
        headline: "PLACEHOLDER: clear product outcome headline.",
        subheadline: "PLACEHOLDER: 1–2 sentence explanation.",
        primaryCta: { label: "Request a demo", href: "/contact" },
        secondaryCta: { label: "View features", href: "/services" },
        image: {
          src: "/images/hero/hero-home.jpg",
          alt: "Product UI screenshot or abstract product image",
          rights: "unknown",
        },
      },

      howItWorks: {
        headline: "How it works",
        steps: [
          { title: "Step 1", body: "PLACEHOLDER" },
          { title: "Step 2", body: "PLACEHOLDER" },
          { title: "Step 3", body: "PLACEHOLDER" },
        ],
      },

      splitSections: [
        {
          eyebrow: "Problem",
          headline: "PLACEHOLDER: what’s broken today",
          body: ["PLACEHOLDER: paragraph one.", "PLACEHOLDER: paragraph two."],
          image: {
            src: "/images/sections/section-1.jpg",
            alt: "Problem illustration",
            rights: "unknown",
          },
          imageSide: "right",
        },
      ],

      featureGrid: {
        headline: "Key features",
        items: [
          { title: "Feature 1", description: "PLACEHOLDER" },
          { title: "Feature 2", description: "PLACEHOLDER" },
          { title: "Feature 3", description: "PLACEHOLDER" },
          { title: "Feature 4", description: "PLACEHOLDER" },
          { title: "Feature 5", description: "PLACEHOLDER" },
          { title: "Feature 6", description: "PLACEHOLDER" },
        ],
      },

      faq: {
        headline: "FAQ",
        items: [
          { question: "Question 1", answer: "PLACEHOLDER" },
          { question: "Question 2", answer: "PLACEHOLDER" },
        ],
      },

      ctaBanner: {
        headline: "Ready to talk?",
        body: "Tell us your workflow and what you’re trying to accomplish.",
        cta: { label: "Request a demo", href: "/contact" },
      },
    },

    services: {
      hero: {
        headline: "Product",
        subheadline: "A clear overview of what the product does.",
        primaryCta: { label: "Request a demo", href: "/contact" },
        secondaryCta: { label: "About", href: "/about" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Feature overview image",
          rights: "unknown",
        },
      },

      intro: {
        headline: "What you get",
        body: ["PLACEHOLDER: short intro paragraph."],
      },

      servicesGrid: {
        headline: "Capabilities",
        items: [
          { title: "Capability 1", description: "PLACEHOLDER" },
          { title: "Capability 2", description: "PLACEHOLDER" },
          { title: "Capability 3", description: "PLACEHOLDER" },
          { title: "Capability 4", description: "PLACEHOLDER" },
        ],
      },

      ctaBanner: {
        headline: "Want a quick walkthrough?",
        body: "Share your use case and we’ll show how it fits.",
        cta: { label: "Contact us", href: "/contact" },
      },
    },

    about: {
      hero: {
        headline: "About",
        subheadline: "Why we built this and who it’s for.",
        primaryCta: { label: "Talk to us", href: "/contact" },
        secondaryCta: { label: "View product", href: "/services" },
        image: {
          src: "/images/hero/hero-about.jpg",
          alt: "Team or product philosophy image",
          rights: "unknown",
        },
      },

      story: {
        headline: "Our story",
        body: [
          "PLACEHOLDER: why this exists.",
          "PLACEHOLDER: what you’re building next (no overpromises).",
        ],
      },

      quote: {
        quote: "PLACEHOLDER: testimonial quote.",
        name: "TESTIMONIAL_NAME",
        title: "CUSTOMER_ROLE",
      },

      ctaBanner: {
        headline: "Let’s see if it fits your workflow",
        body: "We’ll ask a few questions and show what a demo looks like.",
        cta: { label: "Request a demo", href: "/contact" },
      },
    },

    pricing: {
      hero: {
        headline: "Pricing",
        subheadline: "Simple plans that scale with your team.",
        primaryCta: { label: "Request a demo", href: "/contact" },
        secondaryCta: { label: "View product", href: "/services" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Product dashboard preview",
          rights: "unknown",
        },
      },
      pricingPlans: {
        headline: "Plans",
        body: "Start small, then scale when ready.",
        plans: [
          {
            name: "Starter",
            price: "$0",
            description: "Try the core workflow.",
            features: ["Core features", "Email support", "Single workspace"],
            cta: { label: "Get started", href: "/contact" },
          },
          {
            name: "Growth",
            price: "Custom",
            description: "For growing teams.",
            features: ["Team access", "Priority support", "Usage-based pricing"],
            cta: { label: "Talk to sales", href: "/contact" },
            featured: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            description: "Security and integrations.",
            features: ["SSO options", "Custom onboarding", "Dedicated support"],
            cta: { label: "Contact us", href: "/contact" },
          },
        ],
      },
      faq: {
        headline: "Pricing questions",
        items: [
          {
            question: "How does pricing work?",
            answer: "Pricing is based on team size and usage. We can scope it in a quick call.",
          },
          {
            question: "Is there a free trial?",
            answer: "Yes. Start with the Starter plan and upgrade when you’re ready.",
          },
        ],
      },
      ctaBanner: {
        headline: "Want a tailored quote?",
        body: "Tell us about your team and we’ll recommend a plan.",
        cta: { label: "Request a demo", href: "/contact" },
      },
    },

    contact: {
      hero: {
        headline: "Contact",
        subheadline: "Tell us what you’re trying to do and we’ll follow up.",
        primaryCta: { label: "Send a message", href: "/contact#form" },
        secondaryCta: { label: "View product", href: "/services" },
        image: {
          src: "/images/hero/hero-contact.jpg",
          alt: "Contact form image",
          rights: "unknown",
        },
      },

      form: {
        headline: "Request a demo",
        body: "Share a little context and we’ll follow up with next steps.",
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
            industryOptions: [
              "Construction",
              "Manufacturing",
              "Professional Services",
              "Other",
            ],
          },
          requirements: {
            title: "Product needs",
            servicesLabel: "Services needed",
            serviceOptions: [
              { id: "demo", label: "Product demo" },
              { id: "pricing", label: "Pricing overview" },
              { id: "security", label: "Security review" },
            ],
            timelineLabel: "Timeline",
            timelinePlaceholder: "Select a timeline",
            timelineOptions: [
              { value: "this-month", label: "This month" },
              { value: "1-3-months", label: "1–3 months" },
              { value: "exploring", label: "Just exploring" },
            ],
            volumeLabel: "Team size",
            volumePlaceholder: "e.g., 10 people",
            detailsLabel: "Notes",
            detailsPlaceholder: "Share any context or requirements.",
          },
        },
      },

      ctaBanner: {
        headline: "Prefer email?",
        body: "PLACEHOLDER: add preferred contact instructions.",
        cta: { label: "Email us", href: "mailto:BUSINESS_EMAIL" },
      },
    },
  },
} satisfies SaasSite;
