import type { RetailSite, SiteConfig } from "../templates/types";
import { pearlBakeryTheme } from "./themes";

export const site: SiteConfig = {
  template: "retail",

  business: {
    businessName: "Pearl Bakery",
    tagline: "Fresh baked goods, made simply.",
    shortDescription: "PLACEHOLDER: 1–2 sentences about the bakery.",
    phone: "BUSINESS_PHONE",
    email: "BUSINESS_EMAIL",
    addressLine: "ADDRESS_LINE",
    cityStateZip: "CITY_STATE_ZIP",
    serviceArea: "PLACEHOLDER: delivery radius or ‘in-store only’",
    hoursText: ["Mon–Fri: 7am–3pm", "Sat: 8am–2pm", "Sun: Closed"],
  },

  brand: {
    primary: "#263D87",
    accent: "#4F46E5",
    dark: false,
  },
  theme: pearlBakeryTheme,

  nav: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/services" }, // still /services route
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  headerCta: { label: "Contact", href: "/contact" },

  social: {
    instagram: "INSTAGRAM_URL",
    facebook: "FACEBOOK_URL",
    youtube: "YOUTUBE_URL",
  },

  footer: {
    description: "Fresh baked goods and simple catering options.",
    showContactInfo: true,
    contactHeadline: "Visit",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: {
      headline: "Have a catering request?",
      body: "Tell us the date and what you have in mind.",
      buttonLabel: "Send a message",
      href: "/contact",
    },
    copyrightName: "Pearl Bakery",
  },

  retail: {
    venueType: "Bakery",
    primaryCtaMode: "visit",
  },

  pages: {
    home: {
      hero: {
        headline: "Fresh baked goods, made simply.",
        subheadline: "Stop by for classics, seasonal specials, and catering requests.",
        primaryCta: { label: "View menu", href: "/services" },
        secondaryCta: { label: "Contact", href: "/contact" },
        image: {
          src: "/images/hero/hero-home.jpg",
          alt: "Fresh pastries displayed in a bakery case",
          rights: "unknown",
        },
      },

      gallery: {
        headline: "From the kitchen",
        items: [
          { src: "/images/gallery/1.jpg", alt: "Pastries on a tray" },
          { src: "/images/gallery/2.jpg", alt: "Fresh bread loaf" },
          { src: "/images/gallery/3.jpg", alt: "Cakes and desserts" },
          { src: "/images/gallery/4.jpg", alt: "Bakery interior" },
        ],
      },

      offerings: {
        headline: "Popular items",
        items: [
          { title: "Item 1", description: "PLACEHOLDER: short description." },
          { title: "Item 2", description: "PLACEHOLDER: short description." },
          { title: "Item 3", description: "PLACEHOLDER: short description." },
          { title: "Catering", description: "PLACEHOLDER: what you can provide." },
        ],
      },

      story: {
        headline: "A simple approach",
        body: ["PLACEHOLDER: short brand story, 1–2 paragraphs."],
      },

      faq: {
        headline: "FAQ",
        items: [
          { question: "Do you take pre-orders?", answer: "PLACEHOLDER" },
          { question: "Do you do catering?", answer: "PLACEHOLDER" },
        ],
      },

      ctaBanner: {
        headline: "Planning something?",
        body: "Send us the date and what you need and we’ll follow up.",
        cta: { label: "Contact", href: "/contact" },
      },
    },

    services: {
      hero: {
        headline: "Menu",
        subheadline: "A quick overview—ask us about seasonal items.",
        primaryCta: { label: "Contact", href: "/contact" },
        secondaryCta: { label: "About", href: "/about" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Assorted pastries on a counter",
          rights: "unknown",
        },
      },

      intro: {
        headline: "Offerings",
        body: ["PLACEHOLDER: short menu intro."],
      },

      offerings: {
        headline: "Menu highlights",
        items: [
          { title: "Category / Item 1", description: "PLACEHOLDER" },
          { title: "Category / Item 2", description: "PLACEHOLDER" },
          { title: "Category / Item 3", description: "PLACEHOLDER" },
          { title: "Custom orders", description: "PLACEHOLDER" },
        ],
      },

      ctaBanner: {
        headline: "Need a custom order?",
        body: "Tell us what you’re thinking and we’ll confirm details.",
        cta: { label: "Contact", href: "/contact" },
      },
    },

    about: {
      hero: {
        headline: "About",
        subheadline: "What we make and how we think about food.",
        primaryCta: { label: "View menu", href: "/services" },
        secondaryCta: { label: "Contact", href: "/contact" },
        image: {
          src: "/images/hero/hero-about.jpg",
          alt: "Baker shaping dough",
          rights: "unknown",
        },
      },

      story: {
        headline: "Our story",
        body: ["PLACEHOLDER: origin story.", "PLACEHOLDER: what you’re known for."],
      },

      ctaBanner: {
        headline: "Have a question?",
        body: "We’re happy to help.",
        cta: { label: "Contact", href: "/contact" },
      },
    },

    pricing: {
      hero: {
        headline: "Pricing",
        subheadline: "Every order is scoped to size and complexity.",
        primaryCta: { label: "Request a quote", href: "/contact" },
        secondaryCta: { label: "View menu", href: "/services" },
        image: {
          src: "/images/hero/hero-services.jpg",
          alt: "Menu and pricing overview",
          rights: "unknown",
        },
      },
      pricingPlans: {
        headline: "Common order types",
        body: "Typical ranges to help you plan. We confirm details on request.",
        plans: [
          {
            name: "Custom orders",
            price: "Custom",
            description: "Special orders for events or gifting.",
            features: ["Made to order", "Pickup scheduling", "Customization"],
            cta: { label: "Request a quote", href: "/contact" },
          },
          {
            name: "Catering",
            price: "Custom",
            description: "Small events and team gatherings.",
            features: ["Menu planning", "Volume pricing", "Lead time guidance"],
            cta: { label: "Request a quote", href: "/contact" },
            featured: true,
          },
          {
            name: "Retail",
            price: "In-store",
            description: "Daily offerings in the shop.",
            features: ["Walk-in orders", "Seasonal specials", "Made fresh"],
            cta: { label: "Visit us", href: "/contact" },
          },
        ],
      },
      faq: {
        headline: "Pricing questions",
        items: [
          {
            question: "How far ahead should I order?",
            answer: "For custom or catering orders, 1–2 weeks is ideal.",
          },
          {
            question: "Do you accommodate dietary needs?",
            answer: "Let us know your constraints and we’ll confirm options.",
          },
        ],
      },
      ctaBanner: {
        headline: "Planning an event?",
        body: "We’ll help you choose the right menu and timeline.",
        cta: { label: "Request a quote", href: "/contact" },
      },
    },

    contact: {
      hero: {
        headline: "Contact",
        subheadline: "Questions, custom orders, and catering requests.",
        primaryCta: { label: "Send a message", href: "/contact#form" },
        secondaryCta: { label: "View menu", href: "/services" },
        image: {
          src: "/images/hero/hero-contact.jpg",
          alt: "A simple contact form section",
          rights: "unknown",
        },
      },

      contactCards: {
        headline: "Visit or message us",
        phoneLabel: "Phone",
        emailLabel: "Email",
        addressLabel: "Address",
        serviceAreaLabel: "Service area",
      },

      form: {
        headline: "Send a message",
        body: "Include the date if you’re asking about a custom order or catering.",
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
            title: "Order details",
            companyLabel: "Organization (optional)",
            industryLabel: "Order type",
            industryPlaceholder: "Select an order type",
            industryOptions: ["General question", "Custom order", "Catering", "Other"],
          },
          requirements: {
            title: "Request details",
            servicesLabel: "Request type",
            serviceOptions: [
              { id: "question", label: "General question" },
              { id: "custom-order", label: "Custom order" },
              { id: "catering", label: "Catering" },
            ],
            timelineLabel: "Timing",
            timelinePlaceholder: "Select a timeframe",
            timelineOptions: [
              { value: "this-week", label: "This week" },
              { value: "next-week", label: "Next week" },
              { value: "this-month", label: "This month" },
              { value: "exploring", label: "Just exploring" },
            ],
            volumeLabel: "Guest count",
            volumePlaceholder: "e.g., 25 people",
            detailsLabel: "Request details",
            detailsPlaceholder: "Share dates, items, and any preferences.",
          },
        },
      },
    },
  },
} satisfies RetailSite;
