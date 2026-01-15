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


# Computed Cloud (Codex)

This repo uses AI agents (Codex) to draft and edit posts for the Computed Cloud technical blog.

The goal: produce publishable Markdown posts that sound human and unmistakably mine, with a consistent structure and low-noise writing.

---

## Primary objective

Generate **clear, practical engineering posts** about systems, integrations, reliability, and real-world constraints.

Primary reader: **mixed** (engineers + founders). Hiring managers may read it, but they are not the target audience.

---

## Skills Available

Blog management skills live in `skills/blog/`. Prefer using a skill over ad-hoc prompting for these actions.

- Draft New Blog Post: create a new post from notes with the full output contract.
- Promote Draft to Publish-Ready: tighten a draft, fill gaps, and refresh required sections.
- Add Tags to Post: update frontmatter tags only.
- Remove Tags from Post: remove specified frontmatter tags only.
- Normalize Frontmatter: enforce supported keys, ordering, and placeholders.
- Generate or Refresh Mini ToC: add an "On this page" list after TL;DR.
- Refresh Assets/Open Questions/Fact Check: ensure these sections exist and are current.
- Markdown Lint and Clean: fix headings, code fences, and trailing whitespace safely.
- Link and Reference Check: static checks for asset paths and malformed links.

---

## Output contract (non-negotiable)

When asked to draft a post, always output **all** of the following:

1) **Title options** (3-5)  
2) **Recommended title + why** (1-2 sentences)  
3) **Tags** (string array suggestions)  
4) **Frontmatter** (Astro Content Collections format)  
5) **Full Markdown body** (complete, publishable)  
6) **Assets needed** (bulleted list; assume `public/assets/`)  
7) **Open questions / assumptions** (bulleted list)  
8) **Fact check list** (bulleted list of claims to verify)

If any required input is missing, **use placeholders** and list them under "Open questions / assumptions." Do not invent facts or metrics.

---

## File and format rules

- Posts live in: `src/content/blog/`
- Assets live in: `public/assets/`
- Images use: `![Alt text](/assets/example.png "Caption text")`
- Mermaid diagrams use fenced blocks:  
  ```mermaid
  graph TD
    A --> B
  ````

### Frontmatter shape

Use this shape (include `draft: true` unless explicitly told to publish):

```yaml
---
title: "..."
description: "..."
pubDate: 2026-01-14
updatedDate: 2026-01-14 # optional
tags: ["...", "..."]
draft: true
heroImage: "/assets/..." # optional
---
```

Do not add unsupported frontmatter keys.

---

## Voice (enforceable)

### Voice in one sentence

Practical engineering notes: get to the point, name the constraint, explain the tradeoff, and include what broke and what changed.

### Non-negotiables

* Start with a **TL;DR** (3-5 bullets) that states: **decision + constraint + outcome**. Do not bury the lead.
* Use **simple words** and **short sentences**. Prefer 2-4 sentence paragraphs.
* Be confident about what's known. If uncertain, say so directly.
* Include at least one "scar" in substantive posts: **failure mode → change made → new rule of thumb**.
* Don't blame users for confusion. Treat it as UX/product feedback.
* No swear words. Humor is allowed but **very light and infrequent**.

### Banned phrases / words

Avoid:

* "Let's dive in"
* "In this post"
* "It's important to note"
* "At the end of the day"
* "Leverage" (verb)
* "Synergy"
* "Robust" (unless defined)
* "Seamless"
* "Best-in-class / world-class"
* "Game-changing"
* "Powerful" (without specifics)
* "Obviously / Clearly"
* "Just / Simply"
* "Very"

### Preferred phrasing

Use:

* "The constraint was X, so we did Y."
* "We tried X because Y. It worked until Z."
* "Here's what we learned the hard way."
* "This looked fine in a demo. Production disagreed."
* "If you only remember one thing: …"
* "I'm not sure yet, but my current bet is …"
* "Both are valid, but I prefer X because …"
* "Rule of thumb: …"

### Evidence rules (metrics and claims)

* Use numbers when you have them. If you don't, say what you observed and how you know (logs, support tickets, traces, tests).
* If you say "better/faster," specify the dimension (end-to-end latency, render time, cognitive load, reliability, etc.).
* Don't invent metrics. Don't imply measurement you didn't do.

---

## Post structure rules

Default structure (unless the user asks otherwise):

1. **TL;DR** (3-5 bullets): decision + constraint + outcome
2. **Context**: only the constraints that matter
3. **Decision**: what I picked and why (alternatives + tradeoffs)
4. **Implementation**: key files + diagrams + code (only what matters)
5. **What worked / What didn't**: include at least one "scar"
6. **Tradeoffs**: what I'd do differently and why
7. **How to use** (if project/tooling): steps + examples
8. **Wrap-up**: short summary + next steps
9. **Checklist** (optional but preferred if the post is instructional)

### Navigation

If the post is medium/long, include a mini table of contents near the top:

* Either a bullet list of section links, or a short outline.

---

## Code rules

* Code only when it proves a point.
* Keep snippets small. Prefer the "interesting 20%."
* Before a snippet, label:

  * where it lives (file/path or project)
  * what it does
  * why it matters

Avoid giant paste-dumps. If something would be long, summarize and include a short excerpt plus "rest of file omitted."

---

## Callouts / admonitions

Use callouts sparingly for:

* **Rule of thumb**
* **Failure mode**
* **Tradeoff**

Use the site's callout syntax (if unknown, keep it as a simple Markdown blockquote and list as an "Open question" to align with the site's actual implementation).

Example fallback:

> **Rule of thumb:** Don't rely on color alone to communicate errors.

---

## Collaboration flow (agent behavior)

When given a topic or repo context:

1. Propose **2-3 angles** (different narratives).
2. Recommend the best one with a short reason.
3. Draft the post following the output contract.
4. Include:

   * Assets needed
   * Open questions / assumptions
   * Fact check list

If the user supplies a "brain dump," convert it into clean prose while preserving the voice rules.

---

## Editing checklist (agent self-check)

Before final output, verify:

* TL;DR is first and includes decision + constraint + outcome.
* No banned phrases.
* Short sentences; short paragraphs.
* Tradeoffs are explicit.
* At least one "scar" is included.
* Claims are grounded; no invented metrics.
* Code is purposeful and labeled.
* Assets/Open questions/Fact check list included.

---

## Quick "Voice Preamble" for prompts

When starting any drafting task, internally apply:

* Direct, practical, no fluff.
* TL;DR first.
* Simple words, short sentences.
* One scar per post.
* No hype, no invented metrics.
* Light humor allowed, rarely.
