# Computed Cloud

Public source for [computedcloud.com](https://computedcloud.com): Samuel McAravey's personal site, technical blog, portfolio, and a small set of browser-based engineering tools.

The site is opinionated on purpose. It is a content-first Astro project for practical writing about systems, integrations, reliability, and the kind of failures that show up after the demo works.

## What is in this repo

- A public blog built from Markdown in `src/content/blog/`
- A portfolio page that highlights selected work, writing, and resume material
- A small tools section for day-to-day engineering utilities
- Editorial notes, research files, and Codex skills used to draft and refine posts

## Stack

- Astro 5
- React 19
- Tailwind CSS 4
- Cloudflare adapter for deployment
- Pagefind for local search
- Mermaid and Expressive Code for diagrams and code presentation

## Quick start

Prerequisites:

- Node.js 18+
- npm

Install and run locally:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Draft behavior

There are two different "not published yet" states in this repo.

1. Posts in `src/content/blog/` with `draft: true`
   These are part of the Astro content collection, but they are hidden by default. They only render locally when `PUBLIC_SHOW_DRAFTS=true` and the site is running in dev mode.

2. Files in `src/content_inprogress/`
   These are repo-visible working files but not part of the Astro content collection at all, so they are never built into the site.

Preview collection drafts locally in PowerShell:

```powershell
$env:PUBLIC_SHOW_DRAFTS = "true"
npm run dev
```

## Repository map

- `src/content/blog/`
  Published posts and collection-backed drafts
- `src/content_inprogress/`
  In-progress articles that should stay out of the built site
- `src/pages/`
  Astro routes for the home page, blog, tags, portfolio, search, RSS, and tools
- `src/components/`
  Site chrome, blog UI, and browser-based tools
- `src/utils/`
  Draft filtering, tag normalization, Markdown transforms, and figure/callout helpers
- `notes/`
  Editorial roadmap, per-post backlog, outlines, and research notes
- `.codex/skills/`
  Reusable Codex instructions for drafting, polishing, and checking blog posts
- `public/assets/`
  Blog and portfolio assets
- `scripts/`
  Content and repo maintenance helpers

More detail lives in [docs/repository-guide.md](docs/repository-guide.md) and [docs/editorial-workflow.md](docs/editorial-workflow.md).

## Writing workflow

The repo keeps both published content and the editorial process close together:

- `notes/blog-backlog.yml` is the per-post source of truth
- `notes/plan.md` is the high-level roadmap
- `notes/how-to.md` documents the drafting workflow
- `notes/research/` and `notes/outlines/` hold supporting material for upcoming posts

For publishable posts:

1. Define the angle and constraints in `notes/blog-backlog.yml`
2. Add outline or research notes under `notes/`
3. Draft the post in `src/content/blog/` with `draft: true`
4. Run the content checks
5. Publish by setting `draft: false` when the post is ready

For rougher work that should not be part of the site build yet, keep it in `src/content_inprogress/`.

## Content checks

This repo has a few lightweight scripts for keeping posts consistent:

- `pwsh scripts/check-ascii.ps1`
- `pwsh scripts/normalize-punctuation.ps1`
- `pwsh scripts/check-ai-tells.ps1`
- `pwsh scripts/check-blog-accessibility.ps1`
- `npm run a11y`

## Deployment

The site is built with `npm run build` and deployed through Cloudflare using the Astro Cloudflare adapter. The current production URL is [computedcloud.com](https://computedcloud.com).

## Conventions

- Keep blog posts, skills, and notes ASCII-only where practical
- Do not commit secrets, credentials, or environment-specific tokens
- Treat claims in posts as facts to verify, not marketing copy
- Prefer small, explicit content and tooling changes over heavy abstraction

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
