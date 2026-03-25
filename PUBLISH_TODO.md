# Publish TODO (Agency Site)

Tracking checklist for launch prep. Focused on `src/data/site.ts` and related assets.

## Business + Contact
- [ ] Replace placeholders: `business.shortDescription`, `phone`, `email`, `serviceArea`.
- [ ] Confirm `businessName` + `tagline` match brand voice.
- [ ] Update footer `copyrightName`.

## Brand + Theme
- [ ] Verify `brand.primary` and `brand.accent` match your logo/colors.
- [ ] Confirm `theme` choice (currently `studioTheme`) or switch to another preset.
- [ ] Add logo assets under `public/images/brand` and map via `site.brand.logo` if needed.

## Navigation + CTAs
- [ ] Validate `nav` labels and routes (Home/Services/About/Contact).
- [ ] Confirm `headerCta` label and target.
- [ ] Review all CTA labels for consistent phrasing (home/services/about/contact).

## Social + Footer
- [ ] Replace `site.social` URLs (LinkedIn, Instagram, YouTube).
- [ ] Update footer `description`, `quickLinks`, `serviceLinks` as needed.
- [ ] Confirm footer CTA copy and target.
- [ ] Set `legalLinks` to real routes or external URLs (Privacy/Terms).

## SEO
- [ ] Set `seo.canonicalBaseUrl` (e.g., `https://yourdomain.com`).
- [ ] Replace `seo.defaultTitle` and `seo.defaultDescription`.
- [ ] Ensure page-level headlines match desired keywords and location.

## Offer + Pricing (Agency Template)
- [ ] Review `offer` (package name, pricing, timeline, payment terms).
- [ ] Update `included` and `addOns` to match real services.
- [ ] Review `pricingPlans` details for accuracy and clarity.

## Page Content (Replace all PLACEHOLDER strings)
- [ ] Home: `splitSections` body text, `pricingPlans.body`.
- [ ] Services: `intro.body`.
- [ ] About: `story.body`, `featuredQuote`, `caseStudies`.
- [ ] Contact: `form.notice`, `form.consentText`, `ctaBanner.body`.

## Images + Alt Text
- [ ] Confirm all image paths exist under `public/images`.
- [ ] Replace any `rights: "unknown"` if you track licensing.
- [ ] Improve `alt` text to be specific and accurate.

## Contact Form
- [ ] Review form labels/options for your ideal leads.
- [ ] Decide on submission handling (current form is placeholder).
- [ ] Add spam protection if needed (e.g., honeypot or CAPTCHA).

## Legal + Compliance
- [ ] Add Privacy Policy and Terms content/routes.
- [ ] Add consent language if collecting personal data.

## Pre-Launch Checks
- [ ] Run `npm run build` and review for warnings/errors.
- [ ] Test `/`, `/services`, `/about`, `/contact` on mobile + desktop.
- [ ] Check links, CTA targets, and form focus states.

## Deployment + DNS
- [ ] Choose host and configure build/deploy pipeline.
- [ ] Point domain DNS to hosting provider.
- [ ] Verify SSL and canonical URL in production.
