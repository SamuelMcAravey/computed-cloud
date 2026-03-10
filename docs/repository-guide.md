# Repository guide

This repo started as an Astro site template and was then reshaped into a personal site with a public blog, portfolio, and a small tools section. The public surface is small. The working process behind it is larger on purpose.

## Top-level layout

- `README.md`
  Public entry point for contributors, readers, and future me
- `AGENTS.md`
  Codex-specific operating instructions for working in this repo
- `notes/`
  Editorial roadmap, backlog, outlines, and research notes
- `public/`
  Static assets, favicons, and downloadable files
- `scripts/`
  Repo and content maintenance helpers
- `src/`
  Astro app source

## App structure

- `src/pages/`
  Route entry points for:
  - home (`/`)
  - blog index and detail pages
  - tag indexes
  - search
  - portfolio
  - tools
  - RSS
- `src/layouts/`
  Shared page shells
- `src/components/`
  Blog cards, navigation, footer, and tool UIs
- `src/styles/`
  Global site styling
- `src/utils/`
  Small helpers used by content and page rendering

## Content model

Published and collection-backed content:

- `src/content/blog/`
  This is the only Astro content collection in the repo. Anything here is part of the site's content graph.

Working files that should not ship:

- `src/content_inprogress/`
  Markdown files that are intentionally excluded from the Astro content collection. This is the safest place for repo-backed drafts that should not appear on the site.

Editorial support files:

- `notes/blog-backlog.yml`
  Source of truth for per-post specs
- `notes/plan.md`
  Higher-level publishing order and content mix
- `notes/how-to.md`
  Drafting workflow and prompt shape
- `notes/outlines/`
  Post-specific outline files
- `notes/research/`
  Research dossiers and placeholders for future work
- `facts_bank.yml`
  Resume, portfolio, and background facts that can be reused safely

## Draft and publish rules

- `draft: true` inside `src/content/blog/` means "tracked, but hidden"
- `PUBLIC_SHOW_DRAFTS=true` only affects local development and only for collection-backed posts
- `src/content_inprogress/` bypasses Astro content loading entirely

That split gives the repo three clear states:

1. Published
2. Site-backed draft
3. Repo-only work in progress

## Search, Markdown, and presentation

- Search is provided by `astro-pagefind`
- Markdown uses `remark-gfm` plus a custom callout transform
- Images are wrapped into figures by a custom rehype plugin
- Missing asset references can fall back to `/assets/image-missing.svg`
- Mermaid diagrams are enabled at the Astro markdown layer

## Browser tools section

The tools pages are intentionally simple Astro components. They are useful public artifacts, but they are not the center of the repo. The blog and portfolio are the primary product surface.

## Deployment assumptions

- Build command: `npm run build`
- Preview command: `npm run preview`
- Cloudflare adapter is configured in `astro.config.mjs`

## Public repo posture

This repo is public on purpose. That means a few choices are deliberate:

- editorial notes live in git
- collection drafts may live in git
- in-progress posts can live in git without becoming public site content
- secrets and environment-specific values do not belong here
