export interface PortfolioFact {
  value: string;
  label: string;
  detail: string;
}

export interface PortfolioBlock {
  title: string;
  description: string;
}

export interface PortfolioLink {
  label: string;
  href: string;
}

export interface PortfolioCaseStudy {
  name: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  links?: PortfolioLink[];
}

export interface PortfolioProject {
  name: string;
  href: string;
  summary: string;
  details: string[];
}

export interface PortfolioTimelineEntry {
  period: string;
  title: string;
  company: string;
  summary: string;
}

export const portfolioLinks = {
  email: "mailto:samuel@mcaravey.pro",
  linkedin: "https://linkedin.com/in/samuel-mcaravey",
  github: "https://github.com/SamuelMcAravey",
  githubOrg: "https://github.com/incursa",
  resume: "/assets/portfolio/samuel-mcaravey-resume.pdf",
  brief: "/assets/portfolio/samuel-mcaravey-brief.pdf",
};

export const portfolioQuickFacts: PortfolioFact[] = [
  {
    value: "18+ years",
    label: "building production software",
    detail: "Mostly in B2B SaaS, enterprise systems, and operational tooling.",
  },
  {
    value: "99.99%",
    label: "uptime on payment and compliance workflows",
    detail: "Azure-based, geo-redundant platform delivery at PayeWaive.",
  },
  {
    value: "50+ people",
    label: "engineering org modernization",
    detail: "Drove Git, Agile, and CI/CD adoption at Nvoicepay.",
  },
  {
    value: "Founder + operator",
    label: "software and operations",
    detail: "Built internal ERP/MRP tooling while helping run a wholesale bakery.",
  },
];

export const portfolioFocusAreas: PortfolioBlock[] = [
  {
    title: "Systems that survive production",
    description:
      "I tend to work on systems where bad data, downtime, or hidden failure modes cost real money. Payments, compliance, ERP sync, and operational workflows are where I have spent most of my time.",
  },
  {
    title: "Hands-on architecture with delivery pressure",
    description:
      "My background is a mix of leadership and implementation. I have led teams, roadmaps, incident response, and modernization work, but I still like getting close enough to the code and deployment model to make decisions that hold up later.",
  },
  {
    title: "Public work I can share",
    description:
      "A lot of my most important work was private. What I can share publicly is here: shipped outcomes, open repositories, technical writing, and current resume material.",
  },
];

export const portfolioCaseStudies: PortfolioCaseStudy[] = [
  {
    name: "PayeWaive",
    role: "Chief Technology Officer | Head of Engineering",
    period: "Dec 2017 - Present",
    summary:
      "Led technology, product, and engineering for a B2B SaaS platform in construction payments and compliance.",
    highlights: [
      "Architected a secure, geo-redundant Azure platform that supported mission-critical payment and compliance workflows at 99.99% uptime.",
      "Drove a modular, multi-tenant architecture that cut time-to-market for new client requirements by 60%.",
      "Defined the roadmap for ERP integration work with systems such as Viewpoint Vista and Spectrum, reducing client processing time by 50%.",
      "Built AI-assisted support and engineering workflows around Freshdesk, Sentry, and codebase-grounded analysis to shorten response and debugging loops.",
    ],
  },
  {
    name: "Pearl Bakery",
    role: "Founding Partner",
    period: "Jan 2020 - Feb 2023",
    summary:
      "Co-founded and scaled a wholesale bakery, then built the internal software needed to run it day to day.",
    highlights: [
      "Built a custom ERP/MRP system for order intake, production planning, bill of materials, packing sheets, invoicing, and accounting integration.",
      "Designed iPad-based production floor workflows that non-technical staff used during daily operations.",
      "Helped grow the business at roughly 100% year-over-year revenue while supporting around 1,000 units per day across about 20 SKUs.",
      "Managed hiring, training, scheduling, operating procedures, and acquisition transition work for a team of 20+ people.",
    ],
    links: [
      {
        label: "Read the bakery ERP write-up",
        href: "/blog/pearl-bakery-custom-erp-for-production",
      },
    ],
  },
  {
    name: "Nvoicepay (Corpay)",
    role: "Development Team Lead / DevOps",
    period: "Jun 2015 - Jun 2020",
    summary:
      "Led teams and modernization work for a high-volume B2B payments platform processing billions annually.",
    highlights: [
      "Helped modernize a 50+ person engineering organization by pushing Git, Agile, and CI/CD adoption, improving release velocity and reducing rollback incidents.",
      "Designed geo-redundant Azure infrastructure and deployment automation to remove single points of failure.",
      "Led early Kubernetes rollout and testing work, including setup, operations, and deployment flow changes.",
      "Delivered international payments initiatives and enterprise platform features in collaboration with QA, DevOps, and Product.",
    ],
  },
];

export const portfolioOpenSourceProjects: PortfolioProject[] = [
  {
    name: "incursa/platform",
    href: "https://github.com/incursa/platform",
    summary:
      "Public .NET monorepo for reusable platform capabilities, hosting adapters, and vendor integrations.",
    details: [
      "Provider-neutral capability packages plus vendor-specific adapters for systems such as Cloudflare and WorkOS.",
      "Architecture notes and package boundaries are documented in the repo instead of left implicit.",
    ],
  },
  {
    name: "incursa/workbench",
    href: "https://github.com/incursa/workbench",
    summary:
      "Repo-native .NET CLI for specs, ADRs, work items, validation, and GitHub sync.",
    details: [
      "Built around the idea that Markdown and JSON contracts in the repo should be the source of truth.",
      "Shows how I think about engineering process, developer tooling, and making automation serve the codebase instead of the other way around.",
    ],
  },
  {
    name: "incursa/generators",
    href: "https://github.com/incursa/generators",
    summary:
      "Generation tooling for deterministic code output and explicit project integration.",
    details: [
      "Mixes Roslyn source generators with a .NET tool for cases where generated output should be explicit and versioned.",
      "Focused on repeatable generation flows instead of hidden build-time magic.",
    ],
  },
  {
    name: "incursa/types",
    href: "https://github.com/incursa/types",
    summary:
      "Reusable value objects and helper abstractions for strong typing, formatting, parsing, and deterministic identifiers.",
    details: [
      "Includes types such as Money, Percentage, Duration, Period, FastId, VirtualPath, and other domain-level building blocks.",
      "Good example of API design, behavioral hardening, and package quality discipline.",
    ],
  },
  {
    name: "incursa/ui-kit",
    href: "https://github.com/incursa/ui-kit",
    summary:
      "Reusable UI kit for data-heavy business applications.",
    details: [
      "Extracts recurring admin and operator-facing patterns into a consistent `inc-*` class surface.",
      "Focused on dense but readable workflows such as tables, validation states, filters, drawers, and record detail screens.",
    ],
  },
  {
    name: "incursa/apt-repo-catalog",
    href: "https://github.com/incursa/apt-repo-catalog",
    summary:
      "Catalog of APT repositories with fingerprint pinning, validation, and generated install documentation.",
    details: [
      "Good example of infrastructure work that cares about drift, provenance, and repeatable automation.",
      "Includes smoke testing against real repository metadata instead of relying on copied docs.",
    ],
  },
];

export const portfolioTimeline: PortfolioTimelineEntry[] = [
  {
    period: "2017 - Present",
    title: "CTO / Head of Engineering",
    company: "PayeWaive",
    summary:
      "Payments, compliance, ERP integration, incident response, and team leadership for a multi-tenant B2B SaaS platform.",
  },
  {
    period: "2020 - 2023",
    title: "Founding Partner",
    company: "Pearl Bakery",
    summary:
      "Operations, software, and process design for a wholesale manufacturing business.",
  },
  {
    period: "2015 - 2020",
    title: "Development Team Lead / DevOps",
    company: "Nvoicepay (Corpay)",
    summary:
      "Platform modernization, delivery systems, and payments infrastructure at scale.",
  },
  {
    period: "2012",
    title: "Senior Software Engineer",
    company: "EasyPower",
    summary:
      "Modernized technical software used by field engineers at enterprise customers.",
  },
  {
    period: "2008 - 2010",
    title: "Junior Programmer",
    company: "SoftSource Consulting",
    summary:
      "Built custom enterprise software for clients including Microsoft, Nike, and Intel.",
  },
];

export const portfolioWritingSlugs = [
  "how-i-build-software-that-survives-reality",
  "schema-drift-erp-integrations",
  "pearl-bakery-custom-erp-for-production",
];
