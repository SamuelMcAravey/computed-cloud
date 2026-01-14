import type { FintechSite, SiteConfig } from "../templates/types";
import { incursaTheme } from "./themes";

const googleTagId = (import.meta.env.PUBLIC_GOOGLE_TAG_ID || "").trim() || undefined;
const pricingConfig = {
  documentPrice: 0.25,
  includedPages: 5,
  additionalPagePrice: 0.03,
  maxPages: 50,
  signupUrl: "https://app.incursa.com",
};

const formatUsd = (value: number) => `$${value.toFixed(2)}`;
const perDocumentPrice = `${formatUsd(pricingConfig.documentPrice)} / document`;
const extraPagePrice = `${formatUsd(pricingConfig.additionalPagePrice)} / page`;

export const site: SiteConfig = {
  template: "fintech",

  business: {
    businessName: "Incursa",
    tagline: "Invoice OCR and normalization for AP teams.",
    shortDescription: "Upload invoices and export clean, normalized JSON/CSV for review and downstream workflows.",
    email: "hello@incursa.com",
    serviceArea: "United States",
  },

  brand: {
    logo: {
      light: "/images/brand/logo-light.svg",
      dark: "/images/brand/logo-dark.svg",
      icon: "/images/brand/logo-icon.svg",
    },
    primary: "#312E81",
    accent: "#6366F1",
    dark: false,
  },
  theme: incursaTheme,

  nav: [
    { label: "Home", href: "/" },
    { label: "Product", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Sign up", href: "https://app.incursa.com" },
    { label: "Contact", href: "/contact" },
  ],

  headerCta: { label: "Start free", href: pricingConfig.signupUrl },
  headerSecondaryCta: { label: "Log In", href: "https://app.incursa.com" },
  analytics: {
    googleTagId,
  },

  footer: {
    description: "Focused tools for accounts payable teams.",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Product", href: "/services" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: {
      headline: "Try it on a real invoice.",
      body: "Create an account and upload a sample PDF to see the structured output.",
      buttonLabel: "Start free",
      href: "https://app.incursa.com",
    },
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    copyrightName: "Incursa",
  },

  marketing: {
    sampleOutput: {
      previewJson: `{
  "vendor_name": "Northwind Industrial Supply",
  "invoice_number": "INV-10428",
  "invoice_date": "2024-07-18",
  "due_date": "2024-08-17",
  "subtotal": 1480.0,
  "tax": 118.4,
  "total": 1598.4,
  "line_items": [
    { "description": "Warehouse gloves - nitrile, medium", "qty": 120, "unit_price": 4.5, "amount": 540.0 },
    { "description": "Pallet wrap, 18in x 1500ft", "qty": 20, "unit_price": 22.0, "amount": 440.0 },
    { "description": "Dock labels, thermal roll", "qty": 10, "unit_price": 50.0, "amount": 500.0 }
  ]
}`,
      previewCsv: `vendor_name,invoice_number,invoice_date,due_date,subtotal,tax,total,line_description,line_qty,line_unit_price,line_amount
"Northwind Industrial Supply",INV-10428,2024-07-18,2024-08-17,1480.00,118.40,1598.40,"Warehouse gloves - nitrile, medium",120,4.50,540.00
"Northwind Industrial Supply",INV-10428,2024-07-18,2024-08-17,1480.00,118.40,1598.40,"Pallet wrap, 18in x 1500ft",20,22.00,440.00
"Northwind Industrial Supply",INV-10428,2024-07-18,2024-08-17,1480.00,118.40,1598.40,"Dock labels, thermal roll",10,50.00,500.00`,
      downloadJsonUrl: "/samples/sample-invoice.json",
      downloadCsvUrl: "/samples/sample-invoice.csv",
    },
  },

  pricing: pricingConfig,

  product: {
    productName: "Incursa Extract",
    oneLiner: "Invoice OCR + normalization with clean JSON/CSV exports.",
    primaryMetricLabel: "Invoices processed",
  },

  fintech: {
    trustHighlights: {
      headline: "Built for clear, reviewable workflows",
      items: [
        { title: "Consistent data", description: "Standardize key fields for downstream use." },
        { title: "Review step", description: "Spot-check and resolve exceptions." },
        { title: "Export-ready", description: "Deliver outputs your team can map downstream." },
        { title: "Process alignment", description: "Fit the platform to existing workflows." },
      ],
    },
  },

  pages: {
    home: {
      hero: {
        headline: "Turn invoice PDFs into clean, import-ready data.",
        subheadline: "Upload invoices, verify key fields with source context, and export consistent columns your AP workflow can map.",
        highlights: [
          "Header + line items captured",
          "Review with source context",
          "Consistent columns for mapping",
        ],
        primaryCta: { label: "Start free", href: "https://app.incursa.com" },
        secondaryCta: { label: "See export preview", href: "#export-preview" },
      },

      trust: {
        headline: "Built for real AP workflows",
        items: [
          { title: "Document-first approach", description: "Keep a clear link from source PDF to structured output." },
          { title: "Built for variety", description: "Handle different vendor layouts without maintaining brittle rules." },
          { title: "Integration-friendly", description: "Export structured JSON or CSV for mapping into downstream workflows." },
        ],
      },

      featureGrid: {
        headline: "Key capabilities",
        items: [
          { title: "Header + line items", description: "Capture vendor, dates, totals, and line-level detail in one pass." },
          { title: "Review with context", description: "Spot-check key fields against the source PDF." },
          { title: "Standardized fields", description: "Clean up dates, totals, and line items into consistent columns." },
          { title: "Export-ready formats", description: "Download CSV or JSON built for mapping and automation." },
        ],
      },
      caseStudies: {
        eyebrow: "In practice",
        headline: "How teams use Extract",
        body: "Replace manual re-keying with a clear review + export flow.",
        items: [
          {
            title: "Weekly vendor batches",
            summary: "Batch upload PDFs, review exceptions, and export JSON for downstream mapping.",
            image: {
              src: "/images/sections/home-credibility-storefront.jpg",
              alt: "Workspace with documents and laptop",
              rights: "unknown",
            },
            tags: ["Batch", "Review"],
          },
          {
            title: "Line-item normalization",
            summary: "Normalize line items and totals for consistent downstream reporting.",
            image: {
              src: "/images/sections/home-speed-checklist.jpg",
              alt: "Checklist and invoice paperwork",
              rights: "unknown",
            },
            tags: ["Normalization", "Exports"],
          },
        ],
      },
      howItWorks: {
        eyebrow: "How it works",
        headline: "From invoice to export in minutes",
        body: "Upload, spot-check exceptions, and export clean columns.",
        steps: [
          { title: "Upload", body: "Drop in PDFs (single or batch)." },
          { title: "Review", body: "Spot-check key fields against the source." },
          { title: "Export", body: "Download clean columns (CSV) or structured JSON." },
        ],
      },
      splitSections: [
        {
          eyebrow: "Field coverage",
          headline: "Capture the fields AP teams actually use",
          body: [
            "Incursa Extract focuses on the data AP teams need to keep invoices moving: vendor identity, dates, totals, line items, and terms.",
            "Normalization keeps formats consistent so review and downstream mapping are predictable.",
          ],
          bullets: ["Vendor + remit-to details", "Dates, totals, and tax breakout", "Line items and memo fields"],
          image: {
            src: "/images/sections/home-speed-checklist.jpg",
            alt: "Checklist and invoice paperwork",
            rights: "unknown",
          },
        },
        {
          eyebrow: "Exception handling",
          headline: "Resolve edge cases without rebuilding rules",
          body: [
            "Review extracted values alongside the source document when needed, then correct once and move forward.",
            "The workflow stays clear for AP teams without introducing brittle per-vendor templates.",
          ],
          bullets: ["Side-by-side review", "Clear exception visibility", "Consistent export formats"],
          image: {
            src: "/images/sections/home-ownership-handoff.jpg",
            alt: "Hands reviewing documents",
            rights: "unknown",
          },
          imageSide: "left",
        },
      ],
      statsBand: {
        eyebrow: "What you get",
        headline: "Structured exports with review-ready context",
        stats: [
          { value: "PDF → JSON", label: "Structured export format" },
          { value: "Line items", label: "Normalized line-level data" },
          { value: "Review-ready", label: "Source-linked validation" },
        ],
      },

      faq: {
        headline: "FAQ",
        items: [
          {
            question: "What types of invoices work best?",
            answer: "Incursa Extract is designed for common vendor invoice PDFs. It can handle scans too, and higher-quality scans generally produce better results.",
          },
          {
            question: "Do I need to create templates for each vendor?",
            answer: "No. The system is designed to work without vendor-specific templates.",
          },
          {
            question: "How do we try it with our own PDFs?",
            answer: "The fastest path is to sign up and upload a sample invoice. If you have enterprise questions, integrations, or a pilot in mind, reach out via Contact.",
          },
          {
            question: "How do I get the data out?",
            answer: "Extracted data can be exported as structured JSON or CSV.",
          },
        ],
      },

      ctaBanner: {
        headline: "Try Extract on a real invoice.",
        body: "Create an account, upload a sample PDF, and export the normalized output.",
        cta: { label: "Start free", href: "https://app.incursa.com" },
      },
    },

    services: {
      hero: {
        headline: "Incursa Extract",
        subheadline: "Invoice OCR with review-first exports in clean, import-ready columns.",
        primaryCta: { label: "Start free", href: "https://app.incursa.com" },
        secondaryCta: { label: "Contact sales", href: "/contact" },
      },
      intro: {
        headline: "Turn invoices into mapping-ready data",
        body: [
          "Incursa Extract turns vendor PDFs into structured data you can review and send downstream without hand-entering fields.",
          "Standardized header + line items keep mappings stable across vendors and formats.",
        ],
      },
      sampleOutput: {
        headline: "Preview clean, import-ready columns",
        body: [
          "Keep predictable field names for vendor, dates, totals, and line items.",
          "Review with source context, then export clean CSV or structured JSON for your AP stack.",
        ],
      },
      splitSections: [
        {
          eyebrow: "Workflow clarity",
          headline: "Keep review and corrections in one place",
          body: [
            "Each invoice keeps a clear link between the source PDF and extracted fields.",
            "When exceptions appear, review the source and resolve without rebuilding rules.",
          ],
          bullets: ["Source-linked review", "Clear exception handling", "Consistent exports"],
          image: {
            src: "/images/sections/home-ownership-handoff.jpg",
            alt: "Documents reviewed by a team",
            rights: "unknown",
          },
        },
        {
          eyebrow: "Structured outputs",
          headline: "Normalize data for downstream mapping",
          body: [
            "Extract totals, dates, vendor details, and line items into normalized fields.",
            "Exports stay consistent so downstream imports and automations are predictable.",
          ],
          bullets: ["JSON or CSV exports", "Normalized line items", "Predictable field names"],
          image: {
            src: "/images/sections/home-speed-checklist.jpg",
            alt: "Checklist and invoice paperwork",
            rights: "unknown",
          },
          imageSide: "left",
        },
      ],
      processSteps: {
        eyebrow: "Process",
        headline: "A simple, review-first flow",
        body: "Move from PDF to export with a clear, repeatable workflow.",
        steps: [
          { title: "Ingest invoices", body: "Upload PDFs individually or in batches." },
          { title: "Review extracted fields", body: "Validate key fields alongside the source document." },
          { title: "Export structured data", body: "Deliver normalized JSON/CSV to downstream systems." },
        ],
      },

      servicesGrid: {
        headline: "Key capabilities",
        body: "Everything AP teams need to move from PDF to export with confidence.",
        items: [
          { title: "PDF ingestion", description: "Upload invoices individually or in batches.", iconName: "fileText" },
          { title: "Structured extraction", description: "Capture vendor, dates, totals, and line items into consistent fields.", iconName: "scanLine" },
          { title: "Standardized fields", description: "Predictable columns that map cleanly to downstream systems.", iconName: "layers" },
          { title: "Review with source context", description: "Verify fields alongside the original invoice before export.", iconName: "eye" },
          { title: "Exception handling", description: "Resolve outliers quickly without rebuilding vendor rules.", iconName: "shieldCheck" },
          { title: "Export controls", description: "Download JSON or CSV with consistent header + line item data.", iconName: "arrowDownToLine" },
        ],
      },

      faq: {
        headline: "Product questions",
        items: [
          {
            question: "What formats do you export, and how do we get started?",
            answer: "Exports include structured JSON and CSV designed for mapping into downstream workflows. Self-serve signup is immediate; for high-volume pilots or integration support, contact us.",
          },
          {
            question: "Can we review the data before it leaves the platform?",
            answer: "Yes. Each invoice includes a review step with source visibility so you can validate key fields before exporting.",
          },
          {
            question: "Do you support batch uploads?",
            answer: "Batch uploads are supported so teams can process multiple invoices in a single run.",
          },
        ],
      },

      ctaBanner: {
        headline: "Want to see the output?",
        body: "Start with a self-serve account to upload a sample invoice. For pilots, integrations, or enterprise questions, contact us.",
        cta: { label: "Start free", href: "https://app.incursa.com" },
      },
    },

    about: {
      hero: {
        headline: "Incursa",
        subheadline: "A modular suite of practical tools for accounts payable and operations teams.",
        primaryCta: { label: "Start free", href: "https://app.incursa.com" },
        secondaryCta: { label: "Contact", href: "/contact" },
      },

      story: {
        headline: "What is Incursa?",
        body: [
          "Incursa is a modular toolkit for AP and operations teams that need clean, reviewable document data.",
          "The first module, Incursa Extract, turns invoice PDFs into structured fields you can review and export.",
          "Each module stays workflow-first so teams review only where needed.",
        ],
      },
      availableNow: {
        headline: "What's available now",
        body: "Start with a focused module today and expand later.",
        items: [
          {
            title: "Incursa Extract",
            description:
              "Invoice OCR, review with source context, and export clean CSV/JSON columns.",
            iconName: "scanLine",
          },
        ],
        columns: 2,
      },
      roadmap: {
        headline: "What's next",
        body: "Planned modules we are working toward.",
        items: [
          {
            date: "Planned",
            title: "COI expiration tracker",
            body: "Track expirations and prompt follow-ups before coverage lapses.",
          },
          {
            date: "Planned",
            title: "W-9 capture and validation",
            body: "Collect vendor W-9s and validate required fields.",
          },
          {
            date: "Planned",
            title: "Invoice renamer and organizer",
            body: "Standardize file names and keep invoices organized.",
          },
          {
            date: "Planned",
            title: "Vendor inbox / mini portal",
            body: "Give vendors a simple path to submit invoices and documents.",
          },
        ],
        variant: "horizontal",
      },
      principles: {
        headline: "Principles",
        items: [
          {
            title: "Workflow-first",
            description: "Review where needed, not everywhere.",
          },
          {
            title: "Predictable outputs",
            description: "Consistent fields and formats you can rely on.",
          },
          {
            title: "Small tools, minimal setup",
            description: "Focused modules that fit into real-world workflows.",
          },
        ],
        columns: 3,
        variant: "cards",
      },
      trustNote: {
        headline: "Security and privacy",
        body: [
          "Security and privacy matter. If you have requirements (SOC docs, retention, access controls), contact us.",
        ],
      },

      ctaBanner: {
        headline: "Built by operators, not marketers.",
        body: "We focus on clarity, reliability, and workflows that make sense in the real world.",
        cta: { label: "Start free", href: "https://app.incursa.com" },
      },
    },
    pricing: {
      hero: {
        headline: "Simple, usage-based pricing.",
        subheadline: "Free to sign up. Pay only for what you process.",
        primaryCta: { label: "Start free", href: pricingConfig.signupUrl },
        secondaryCta: { label: "Contact", href: "/contact" },
      },
      pricingPlans: {
        headline: "Pay-as-you-go",
        variant: "withNotes",
        plans: [
          {
            name: "Pay-as-you-go",
            price: perDocumentPrice,
            priceNote: `Includes up to ${pricingConfig.includedPages} pages`,
            features: [
              "Billed monthly based on usage",
              "No subscriptions",
              "No minimums",
              "No user limits",
            ],
            cta: { label: "Start free", href: pricingConfig.signupUrl },
            featured: true,
          },
        ],
        details: {
          billingHeading: "How billing works",
          billingSteps: [
            "Upload PDFs (single or batch)",
            "Review key fields (optional spot-check)",
            "Billed monthly based on processed usage",
          ],
          includedHeading: "What's included",
          includedItems: [
            "OCR + field extraction",
            "Review with source context",
            "Header + line items",
            "CSV + JSON export",
          ],
        },
      },
      pricingCallouts: {
        headline: "Additional pages and volume pricing",
        items: [
          {
            title: "Additional pages",
            description: `Additional pages after ${pricingConfig.includedPages} pages: ${extraPagePrice}`,
          },
          {
            title: "High volume?",
            description: "Contact us for volume pricing.",
          },
        ],
        columns: 2,
        variant: "cards",
      },
      faq: {
        headline: "Pricing questions",
        items: [
          {
            question: "What counts toward usage?",
            answer: "One processed document = one PDF invoice processed.",
          },
          {
            question: "How are pages counted?",
            answer: "We count pages in the uploaded PDF for that document.",
          },
          {
            question: "Is there a subscription?",
            answer: "No subscription. Usage is billed monthly.",
          },
          {
            question: "Can I start small?",
            answer: "Yes, sign up free and process as needed.",
          },
        ],
      },
      ctaBanner: {
        headline: "Ready to see Extract in action?",
        body: "Upload a real invoice and see the normalized output immediately.",
        cta: { label: "Start free", href: pricingConfig.signupUrl },
      },
    },

    contact: {
      hero: {
        headline: "Contact",
        subheadline:
          "Most teams should start free to see Extract output. Reach out for high volume, integrations, security reviews, or support.",
        primaryCta: { label: "Contact us", href: "/contact#form" },
        secondaryCta: { label: "Start free", href: pricingConfig.signupUrl },
      },
      decisionCards: {
        eyebrow: "Most teams should start here",
        headline: "Choose the best path",
        cards: [
          {
            title: "Start free",
            body: "Upload a real invoice and see the cleaned output.",
            cta: { label: "Start free", href: pricingConfig.signupUrl },
            tone: "primary",
          },
          {
            title: "Contact us",
            body: "Use this for high volume, integrations, security reviews, or support.",
            cta: { label: "Contact us", href: "/contact#form" },
            tone: "secondary",
          },
        ],
      },
      helperPanel: {
        nextHeadline: "What happens next",
        nextSteps: [
          "We follow up by email with next steps.",
          "We confirm volume and workflow details.",
          "We suggest the best starting path (self-serve vs volume).",
        ],
        includeHeadline: "What to include",
        includeList: [
          "Monthly invoice volume",
          "Typical page count",
          "Whether line items are required",
          "Any export requirements (CSV/JSON)",
        ],
      },

      contactCards: {
        headline: "Contact details",
        phoneLabel: "Phone",
        emailLabel: "Email",
        addressLabel: "Location",
        serviceAreaLabel: "Service area",
      },

      form: {
        headline: "Contact us",
        body: "Use this form for high volume, integrations, security reviews, or support.",
        successMessage: "Thanks — we’ve received your message and will be in touch shortly.",
        consentText: "By submitting, you agree to be contacted about your message.",
        submitLabel: "Send message",
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
            industryOptions: ["Construction", "Manufacturing", "Professional services", "Healthcare", "Public sector", "Other"],
          },
          requirements: {
            title: "Reason for reaching out",
            servicesLabel: "Reason",
            serviceOptions: [
              { id: "demo", label: "Product questions" },
              { id: "pilot", label: "High-volume / pilot" },
              { id: "integration", label: "Integration support" },
              { id: "general", label: "Security review / support" },
            ],
            timelineLabel: "Timeline",
            timelinePlaceholder: "Select a timeline",
            timelineOptions: [
              { value: "asap", label: "Immediately" },
              { value: "this-quarter", label: "Within 1-3 months" },
              { value: "exploring", label: "Just exploring" },
            ],
            volumeLabel: "Monthly invoice volume",
            volumePlaceholder: "e.g., 1,000",
            detailsLabel: "Message",
            detailsPlaceholder: "Tell us what you need help with.",
          },
        },
      },

      ctaBanner: {
        headline: "Want to try it right now?",
        body: "Create an account and upload a sample invoice.",
        cta: { label: "Start free", href: "https://app.incursa.com" },
      },
    },
  },
} satisfies FintechSite;
