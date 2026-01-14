# AGENTS

## Project overview
- Astro 5 + React 19 + Tailwind CSS 4 template for small-business sites.
- Canonical routes: `/`, `/services`, `/about`, `/contact` (Astro pages in `src/pages`).
- Single active site config lives in `src/data/site.ts` (points at a template + theme).
- Template presets live in `src/data/site.<template>.ts` (agency/saas/consulting/trades/retail/fintech).
- Theme presets live in `src/data/themes.ts` (apply via `site.theme`).

## Key files and structure
- `src/data/site.ts`: SiteConfig + all business strings, CTAs, nav, footer, socials.
- `src/data/site.<template>.ts`: template-specific content presets.
- `src/data/themes.ts`: theme presets (palette/radius/typography/shadows/background).
- `src/layouts/BaseLayout.astro`: sets meta tags and global layout.
- `src/templates/TemplatePageRouter.astro` + `src/templates/TemplatePageRenderer.astro`: template-driven page composition.
- `src/templates/layouts/*`: per-template layout definitions.
- `src/components/sections/*`: shared page sections (Hero, SplitSection, FeatureGrid, CtaBanner, TextSection, Testimonials).
- `src/components/Footer.astro` + `src/components/footer/SocialLinks.astro`: footer + social icons.
- `src/components/react/RFQForm.tsx`: contact form (client-side, placeholder submit).
- `public/images/`: image assets referenced by `site.ts` (hero + sections).

## Content and routing rules
- Do not hard-code business data in pages/components; always pull from `src/data/site.ts`.
- Footer/socials are driven by `site.footer` and `site.social`.
- Contact form copy and labels are driven by `site.pages.contact.form`.
- Theme tokens are set in `BaseLayout.astro` and `src/styles/global.css` (palette, radius, typography, shadows, background patterns).

## Assets
- Ensure `site.ts` image paths resolve under `/public/images`.
- Brand logos live under `public/images/brand` and map via `site.brand.logo`.

## Development commands
- `npm run dev` (local dev server)
- `npm run build` (production build to `dist/`)
- `npm run preview` (preview build)
- No lint script is configured in `package.json`.

## Scripts
- `scripts/bootstrap-template.ps1`: copy + initialize a new site (template, theme, business info, logos, favicons).
- `scripts/sync-template.ps1`: sync non-customizable template files into a client site.
- `scripts/sync-clients.ps1`: run sync across multiple client sites.

## Skills
- Skills live in `.codex/skills`. Use the README there for guidance.

## Guardrails for changes
- Keep visual design stable; prefer small refactors.
- Avoid heavy JS; React components should remain lightweight.
- Do not add new frameworks or a CMS.
