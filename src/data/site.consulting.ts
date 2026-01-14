import type { ConsultingSite, SiteConfig } from "../templates/types";
import { rixianTheme } from "./themes";

export const site: SiteConfig = {
  template: "consulting",

  business: {
    businessName: "Rixian",
    tagline: "Tech consulting for practical software teams.",
    shortDescription: "PLACEHOLDER: one sentence describing what you do.",
    phone: "BUSINESS_PHONE",
    email: "BUSINESS_EMAIL",
    serviceArea: "Remote (US) / Billings, MT (by request)",
  },

  brand: {
    primary: "#0F172A",
    accent: "#2563EB",
    dark: false,
  },
  theme: rixianTheme,

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  headerCta: { label: "Book a call", href: "/contact" },

  social: {
    linkedin: "LINKEDIN_URL",
  },

  footer: {
    description: "Practical engineering and delivery support for small teams.",
    showContactInfo: true,
    contactHeadline: "Contact",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    serviceLinks: [
      { label: "Architecture", href: "/services" },
      { label: "Delivery support", href: "/services" },
      { label: "Systems integration", href: "/services" },
    ],
    cta: {
      headline: "Want a second set of eyes on your system?",
      body: "Share your goals and constraints and we’ll propose a practical plan.",
      buttonLabel: "Book a call",
      href: "/contact",
    },
    legalLinks: [
      { label: "Privacy Policy", href: "PRIVACY_POLICY_URL_OR_ROUTE" },
      { label: "Terms of Service", href: "TERMS_URL_OR_ROUTE" },
    ],
    copyrightName: "Rixian",
  },

  seo: {
    canonicalBaseUrl: "CANONICAL_BASE_URL",
    defaultTitle: "Rixian",
    defaultDescription: "Tech consulting for practical software teams.",
  },

  consulting: {
    positioningHeadline: "Clear architecture and execution help for small teams.",
    positioningSubheadline: "Practical improvements without over-engineering.",
    targetClients: ["Small product teams", "Founder-led software companies", "Ops-heavy industries"],
    focusAreas: ["Architecture", "Integration", "Delivery", "Maintainability"],
  },

  pages: {
    home: {
      hero: {
        headline: "Practical consulting for building and shipping software.",
        subheadline: "Architecture, integration, and delivery support—focused on clarity and outcomes.",
        primaryCta: { label: "Book a call", href: "/contact" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-home.jpg",
          alt: "A clean software planning board and code editor",
          rights: "unknown",
        },
      },

      servicesGrid: {
        headline: "Services",
        items: [
          { title: "Architecture review", description: "Identify risks, simplify dependencies, and clarify boundaries." },
          { title: "Implementation support", description: "Hands-on help moving key features to production." },
          { title: "Systems integration", description: "Practical integrations with ERPs, APIs, and external services." },
          { title: "Dev process + tooling", description: "CI/CD, testing strategy, and maintainable workflows." },
        ],
      },

      processSteps: {
        headline: "How it works",
        steps: [
          { title: "Intro call", body: "Understand goals, constraints, and current state." },
          {
            title: "Short assessment",
            body: "Review the system and identify the highest-leverage changes.",
          },
          { title: "Execution", body: "Deliver improvements in small, safe steps." },
          {
            title: "Handoff",
            body: "Document decisions and leave the team stronger than before.",
          },
        ],
      },

      faq: {
        headline: "FAQ",
        items: [
          {
            question: "What types of engagements do you do?",
            answer: "PLACEHOLDER: fixed-scope or retainer, etc.",
          },
          { question: "Do you work remotely?", answer: "Yes—remote by default." },
        ],
      },

      ctaBanner: {
        headline: "Have a project that needs clarity?",
        body: "Send a short overview and we’ll propose next steps.",
        cta: { label: "Contact us", href: "/contact" },
      },
    },

    services: {
      hero: {
        headline: "Services",
        subheadline: "Focused help for architecture, integration, and execution.",
        primaryCta: { label: "Book a call", href: "/contact" },
        secondaryCta: { label: "About", href: "/about" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "A software architecture diagram on a whiteboard",
          rights: "unknown",
        },
      },

      intro: {
        headline: "Practical support without ceremony",
        body: [
          "We keep engagements focused on outcomes: shipping, simplifying, and reducing risk.",
          "PLACEHOLDER: add your preferred engagement style.",
        ],
      },

      servicesGrid: {
        headline: "Capabilities",
        items: [
          { title: "Architecture + refactoring", description: "Tighten boundaries and reduce complexity." },
          { title: "Testing strategy", description: "Confidence without slow test suites." },
          { title: "Integrations", description: "APIs, exports, workflows, and operational reliability." },
          { title: "CI/CD improvements", description: "Make deployments safer and repeatable." },
        ],
      },

      processSteps: {
        headline: "Engagement flow",
        steps: [
          { title: "Discover", body: "Goals, constraints, system overview." },
          { title: "Plan", body: "Small set of prioritized changes." },
          { title: "Deliver", body: "Implement in safe increments." },
        ],
      },

      ctaBanner: {
        headline: "Want a proposal?",
        body: "Share scope and timeline and we’ll follow up.",
        cta: { label: "Contact us", href: "/contact" },
      },
    },

    about: {
      hero: {
        headline: "About",
        subheadline: "Engineering help focused on clarity and maintainability.",
        primaryCta: { label: "Book a call", href: "/contact" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-about.jpg",
          alt: "A developer reviewing code and notes",
          rights: "unknown",
        },
      },

      story: {
        headline: "Our story",
        body: [
          "PLACEHOLDER: why you started consulting and what you learned.",
          "PLACEHOLDER: what kind of teams you work best with.",
        ],
      },

      values: {
        headline: "Principles",
        items: [
          { title: "Clarity", description: "Make systems easier to understand." },
          { title: "Small steps", description: "Reduce risk with incremental delivery." },
          { title: "Maintainability", description: "Leave behind code teams can own." },
        ],
      },

      ctaBanner: {
        headline: "Let’s talk",
        body: "If you’re stuck on architecture or delivery, we can help.",
        cta: { label: "Contact us", href: "/contact" },
      },
    },

    pricing: {
      hero: {
        headline: "Pricing",
        subheadline: "Engagements scoped to your delivery timeline.",
        primaryCta: { label: "Book a call", href: "/contact" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Consulting engagement planning",
          rights: "unknown",
        },
      },
      pricingPlans: {
        headline: "Engagement models",
        body: "Choose a structure that matches your pace and scope.",
        plans: [
          {
            name: "Advisory",
            price: "Custom",
            description: "Architecture guidance and reviews.",
            features: ["Weekly syncs", "Design reviews", "Roadmap input"],
            cta: { label: "Book a call", href: "/contact" },
          },
          {
            name: "Delivery",
            price: "Custom",
            description: "Hands-on delivery support.",
            features: ["Implementation support", "Pairing sessions", "Milestone reviews"],
            cta: { label: "Talk to us", href: "/contact" },
            featured: true,
          },
          {
            name: "Retainer",
            price: "Custom",
            description: "Ongoing technical leadership.",
            features: ["Priority access", "Monthly planning", "Team enablement"],
            cta: { label: "Contact us", href: "/contact" },
          },
        ],
      },
      faq: {
        headline: "Pricing questions",
        items: [
          {
            question: "How do you scope engagements?",
            answer: "We start with goals, constraints, and timelines, then propose a clear scope.",
          },
          {
            question: "Can you work with internal teams?",
            answer: "Yes. We often partner with internal teams to guide architecture and delivery.",
          },
        ],
      },
      ctaBanner: {
        headline: "Need a scoped proposal?",
        body: "Share your timeline and we’ll outline the right engagement.",
        cta: { label: "Book a call", href: "/contact" },
      },
    },

    contact: {
      hero: {
        headline: "Contact",
        subheadline: "Tell us what you’re building and where you’re stuck.",
        primaryCta: { label: "Send a message", href: "/contact#form" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-contact.jpg",
          alt: "A simple contact form section",
          rights: "unknown",
        },
      },

      contactCards: {
        headline: "Contact details",
        phoneLabel: "Phone",
        emailLabel: "Email",
        serviceAreaLabel: "Service area",
      },

      form: {
        headline: "Book a call",
        body: "Share a bit of context and we’ll follow up.",
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
            industryOptions: ["SaaS", "Construction", "Manufacturing", "Other"],
          },
          requirements: {
            title: "Engagement needs",
            servicesLabel: "Services needed",
            serviceOptions: [
              { id: "architecture", label: "Architecture review" },
              { id: "delivery", label: "Delivery support" },
              { id: "integration", label: "Integrations" },
              { id: "other", label: "Other" },
            ],
            timelineLabel: "Timeline",
            timelinePlaceholder: "Select a timeline",
            timelineOptions: [
              { value: "asap", label: "ASAP" },
              { value: "this-month", label: "This month" },
              { value: "1-3-months", label: "1–3 months" },
              { value: "exploring", label: "Just exploring" },
            ],
            volumeLabel: "Team size",
            volumePlaceholder: "e.g., 5 people",
            detailsLabel: "Project details",
            detailsPlaceholder: "Share goals, systems, or constraints.",
          },
        },
      },
    },
  },
} satisfies ConsultingSite;
