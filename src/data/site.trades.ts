import type { TradesSite, SiteConfig } from "../templates/types";
import { tradesTheme } from "./themes";

export const site: SiteConfig = {
  template: "trades",

  business: {
    businessName: "Billings Example Trades Co",
    tagline: "Reliable service in Billings and surrounding areas.",
    shortDescription: "PLACEHOLDER: one sentence description of the trade business.",
    phone: "(406) 555-0123",
    email: "BUSINESS_EMAIL",
    serviceArea: "Billings, MT and surrounding areas",
    hoursText: ["Mon–Fri: 8am–5pm", "PLACEHOLDER: weekends/after-hours if applicable"],
  },

  brand: {
    primary: "#0F172A",
    accent: "#F59E0B",
    dark: false,
  },
  theme: tradesTheme,

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  headerCta: { label: "Request a quote", href: "/contact" },

  footer: {
    description: "Local service with clear pricing and responsive communication.",
    showContactInfo: true,
    contactHeadline: "Get in touch",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    serviceLinks: [
      { label: "Service 1", href: "/services" },
      { label: "Service 2", href: "/services" },
      { label: "Service 3", href: "/services" },
    ],
    cta: {
      headline: "Need a quote?",
      body: "Tell us what you need and we’ll follow up.",
      buttonLabel: "Request a quote",
      href: "/contact",
    },
    copyrightName: "Billings Example Trades Co",
  },

  trades: {
    primaryServiceNoun: "Contractor", // required by TradesProfile
    serviceNotes: "PLACEHOLDER: any limitations or notes (residential/commercial, etc.)",
  },

  pages: {
    home: {
      hero: {
        headline: "Fast, reliable service in Billings.",
        subheadline: "Clear communication, quality work, and straightforward scheduling.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "Call now", href: "tel:(406) 555-0123" },
        image: {
          src: "/images/hero/hero-home.jpg",
          alt: "A tradesperson working on a job site",
          rights: "unknown",
        },
      },

      servicesGridPreview: {
        headline: "Services",
        items: [
          { title: "Service 1", description: "PLACEHOLDER: 1–2 sentence description." },
          { title: "Service 2", description: "PLACEHOLDER: 1–2 sentence description." },
          { title: "Service 3", description: "PLACEHOLDER: 1–2 sentence description." },
          { title: "Service 4", description: "PLACEHOLDER: 1–2 sentence description." },
        ],
      },

      highlights: {
        headline: "Why customers choose us",
        highlights: [
          "Clear estimates and communication",
          "On-time scheduling",
          "Work backed by practical experience",
          "Respectful jobsite cleanup",
        ],
      },

      serviceAreaList: {
        headline: "Service area",
        body: "Billings, MT and surrounding areas.",
        locations: ["Billings", "Laurel", "Lockwood", "PLACEHOLDER: add more"],
      },

      gallery: {
        headline: "Recent work",
        items: [
          { src: "/images/gallery/1.jpg", alt: "Project photo 1" },
          { src: "/images/gallery/2.jpg", alt: "Project photo 2" },
          { src: "/images/gallery/3.jpg", alt: "Project photo 3" },
        ],
      },

      faq: {
        headline: "FAQ",
        items: [
          {
            question: "What areas do you serve?",
            answer: "Billings and surrounding areas.",
          },
          {
            question: "How do I get a quote?",
            answer: "Use the contact form or call us.",
          },
        ],
      },

      ctaBanner: {
        headline: "Ready to get started?",
        body: "Send details and we’ll schedule next steps.",
        cta: { label: "Request a quote", href: "/contact" },
      },
    },

    services: {
      hero: {
        headline: "Services",
        subheadline: "A clear list of what we do and how we help.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "Call now", href: "tel:(406) 555-0123" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Tools and materials used for service work",
          rights: "unknown",
        },
      },

      intro: {
        headline: "What we do",
        body: ["PLACEHOLDER: short intro for services page."],
      },

      servicesGrid: {
        headline: "Service list",
        items: [
          { title: "Service 1", description: "PLACEHOLDER" },
          { title: "Service 2", description: "PLACEHOLDER" },
          { title: "Service 3", description: "PLACEHOLDER" },
          { title: "Service 4", description: "PLACEHOLDER" },
        ],
      },

      highlights: {
        headline: "How we work",
        highlights: ["Assess", "Estimate", "Schedule", "Complete and clean up"],
      },

      ctaBanner: {
        headline: "Need help deciding?",
        body: "Tell us what you’re dealing with and we’ll recommend next steps.",
        cta: { label: "Contact us", href: "/contact" },
      },
    },

    about: {
      hero: {
        headline: "About",
        subheadline: "Local service, clear communication, quality work.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-about.jpg",
          alt: "Team working on a job site",
          rights: "unknown",
        },
      },

      story: {
        headline: "Our story",
        body: ["PLACEHOLDER: how the business started.", "PLACEHOLDER: what you’re known for."],
      },

      splitSections: [
        {
          eyebrow: "Reliability",
          headline: "We show up and communicate.",
          body: ["PLACEHOLDER: what reliability looks like in your process."],
          image: { src: "/images/sections/section-1.jpg", alt: "Scheduling and communication", rights: "unknown" },
          imageSide: "right",
        },
      ],

      ctaBanner: {
        headline: "Want a quote?",
        body: "We’ll reply quickly and keep it simple.",
        cta: { label: "Request a quote", href: "/contact" },
      },
    },

    pricing: {
      hero: {
        headline: "Pricing",
        subheadline: "Clear estimates based on scope and access.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "View services", href: "/services" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Service estimate planning",
          rights: "unknown",
        },
      },
      pricingPlans: {
        headline: "Estimate ranges",
        body: "We scope every job, but typical ranges help with planning.",
        plans: [
          {
            name: "Small projects",
            price: "Custom",
            description: "Quick turnaround for simple work.",
            features: ["Basic materials", "Clear timeline", "Clean finish"],
            cta: { label: "Request a quote", href: "/contact" },
          },
          {
            name: "Standard",
            price: "Custom",
            description: "Most residential or light commercial jobs.",
            features: ["On-site assessment", "Detailed estimate", "Scheduled work"],
            cta: { label: "Request a quote", href: "/contact" },
            featured: true,
          },
          {
            name: "Complex",
            price: "Custom",
            description: "Larger or multi-day scopes.",
            features: ["Project planning", "Material coordination", "Progress updates"],
            cta: { label: "Contact us", href: "/contact" },
          },
        ],
      },
      faq: {
        headline: "Pricing questions",
        items: [
          {
            question: "Do you offer on-site estimates?",
            answer: "Yes. We can visit the site to give an accurate quote.",
          },
          {
            question: "What affects pricing?",
            answer: "Scope, materials, site access, and timeline are the main drivers.",
          },
        ],
      },
      ctaBanner: {
        headline: "Need a detailed estimate?",
        body: "Tell us about the project and we’ll follow up quickly.",
        cta: { label: "Request a quote", href: "/contact" },
      },
    },

    contact: {
      hero: {
        headline: "Contact",
        subheadline: "Request a quote or ask a question—either works.",
        primaryCta: { label: "Send a message", href: "/contact#form" },
        secondaryCta: { label: "Call now", href: "tel:(406) 555-0123" },
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
        body: "Tell us what you need and we’ll follow up.",
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
            title: "Property details",
            companyLabel: "Company or household",
            industryLabel: "Project type",
            industryPlaceholder: "Select a project type",
            industryOptions: ["Residential", "Commercial", "Other"],
          },
          requirements: {
            title: "Service details",
            servicesLabel: "Services needed",
            serviceOptions: [
              { id: "service-1", label: "Service 1" },
              { id: "service-2", label: "Service 2" },
              { id: "service-3", label: "Service 3" },
            ],
            timelineLabel: "Timeline",
            timelinePlaceholder: "Select a timeline",
            timelineOptions: [
              { value: "asap", label: "ASAP" },
              { value: "this-week", label: "This week" },
              { value: "this-month", label: "This month" },
              { value: "exploring", label: "Just exploring" },
            ],
            volumeLabel: "Project size",
            volumePlaceholder: "e.g., 1,500 sq ft",
            detailsLabel: "Project notes",
            detailsPlaceholder: "Share access details, constraints, or photos.",
          },
        },
      },
    },
  },
} satisfies TradesSite;
