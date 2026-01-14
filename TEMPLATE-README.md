# Template README

## What to edit for a new client
- `src/data/site.ts`: update business name, tagline, contact info, nav, services, page copy, and form labels.
- `public/images` and `public/images/sections`: replace the hero and section images. Keep the filenames or update paths in `src/data/site.ts`.
- `public/favicon.svg`: replace if the client has a custom icon.

## How to run locally
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Deploy to Cloudflare Pages
1. Push the repo to your Git provider.
2. Create a Cloudflare Pages project and connect the repo.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Environment: Node.js 18+ (match your local version).

## QA checklist
- Routes render: `/`, `/services`, `/about`, `/contact`.
- Header and footer nav match `src/data/site.ts`.
- Business info (name, phone, email, address, service area) matches `src/data/site.ts`.
- CTAs and button labels are sourced from `src/data/site.ts`.
- Images load from `public/images` paths referenced in `src/data/site.ts`.
- Split sections stack on mobile and align side-by-side on desktop.
- Contact form shows the backend-integration notice and submits without console errors.
