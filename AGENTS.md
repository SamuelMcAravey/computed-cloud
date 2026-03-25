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

## Roadmap and planning

Source of truth for per-post specs:
* `notes/blog-backlog.yml`

High-level editorial roadmap and publishing order:
* `notes/plan.md`

How we draft and edit posts:
* `notes/how-to.md`

How we avoid common AI writing tells:
* `notes/ai-writing-tells.md`

## Notes workflow

By default, when the user asks to "make a note," assume they mean a published site note in `src/content/notes/*.yml`.

Use `notes/` only for internal reference material, working notes, research scratchpads, and repo-only writeups that are not meant to be published.

### Where notes go

- Put published site notes in `src/content/notes/*.yml`.
- Put general reference notes directly under `notes/`.
- Put post research notes under `notes/research/`.
- Put post outlines under `notes/outlines/`.
- Do not put internal notes in `src/content/blog/`. That folder is only for actual blog posts.
- If the user does not explicitly say "internal", "private", "repo note", or similar, prefer a published site note over an internal file in `notes/`.

### Naming and organization

- For published site notes, add a new entry to the current monthly file in `src/content/notes/`, for example `src/content/notes/2026-03.yml`.
- Prefer lowercase kebab-case filenames.
- For durable reference notes, use a plain descriptive name like `uri-schemes-quick-reference.md`.
- For dated research or time-bound notes, prefix with `YYYY-MM-DD-`, for example `2026-03-12-api-observations.md`.
- Keep notes small and scannable. A note is usually a quick reference, checklist, research summary, or scratchpad that can be turned into something better later.

### Note content rules

- Use Markdown.
- Use ASCII punctuation only, same as blog posts and skills.
- Prefer short sections and bullets over long prose unless the note is clearly narrative.
- Keep claims grounded. If something is uncertain, label it as an assumption or open question.
- Include source links when the note summarizes external references.
- Do not invent a heavy schema for every note. Only add structure that helps the next read.

### Tags and metadata

- Notes do not need blog-style frontmatter by default.
- If lightweight categorization helps, add a short `Tags:` line near the top instead of YAML frontmatter.
- Keep tags sparse and practical, for example: `Tags: reference, uri, links`.
- Do not add unsupported metadata or turn notes into pseudo-database records.
- Published site notes in `src/content/notes/*.yml` should include a short opaque `permalink` value for the direct note URL.
- Treat note permalinks as stable identifiers. Do not derive them from the title.
- Published site notes should also include `id`, `title`, `summary`, `body`, `tags`, `published`, and optional `context` and `links`.

### Limits and scope

- Ignore deprecated, obscure, or browser-internal details unless they help explain a practical decision.
- Prefer the useful subset over exhaustive coverage.
- If a note starts becoming a real article, move that work into the blog workflow instead of expanding the note indefinitely.

### Finish state for note tasks

- When note work is complete, check `git status`.
- For note-only changes, the default finish state is to commit and push unless the user says not to.
- Use a clear commit message that says what note was added or updated.
- If a site note was added under `src/content/notes/`, verify it has a direct `/notes/<permalink>` URL before finishing.

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
* Include at least one "scar" in substantive posts: **failure mode -> change made -> new rule of thumb**.
* Don't blame users for confusion. Treat it as UX/product feedback.
* No swear words. Humor is allowed but **very light and infrequent**.

### Cadence (avoid "LinkedIn" style)

Avoid posts that feel like a stream of punchy one-liners. If the post is narrative, make it a narrative.

Rules:

* No repeated single-sentence paragraphs that are written for impact.
* Do not put phrases like "That worked until it didn't." on their own line.
* For narrative posts (case studies, stories, manifestos): aim for 2-5 sentences per paragraph and use natural transitions (because/so/that meant/next).
* For technical posts (how-to, pattern guides): bullets and checklists are fine, but each section still needs connective prose so it reads like an article, not a spec.

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

## ASCII-only punctuation (hard rule)
- Use ASCII only in blog posts, skills, and notes.
- Do not use em dashes or en dashes. Use `-` instead.
- Do not use smart quotes/apostrophes. Use `"` and `'` instead.
- If you are unsure whether a file contains non-ASCII punctuation, run:
  - `pwsh scripts/check-ascii.ps1`
- To normalize existing Markdown punctuation to ASCII, run:
  - `pwsh scripts/normalize-punctuation.ps1`

### Preferred phrasing

Use:

* "The constraint was X, so we did Y."
* "We tried X because Y. It worked until Z."
* "Here's what we learned the hard way."
* "This looked fine in a demo. Production disagreed."
* "If you only remember one thing: ..."
* "I'm not sure yet, but my current bet is ..."
* "Both are valid, but I prefer X because ..."
* "Rule of thumb: ..."

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

### Transcript cleanup mode

When the user explicitly says the input is a transcript, dictation, voice memo, rough spoken draft, or asks for "cleanup only":

- Treat the transcript as the user's authored words and perspective.
- Default to light-touch editing only: paragraphing, punctuation, obvious grammar fixes, removing filler words, and minor reordering for clarity.
- Preserve the user's phrasing, opinions, examples, and structure unless the user asks for a rewrite.
- Do not add new claims, metrics, anecdotes, or examples that were not in the transcript.
- Do not normalize the voice into polished "AI blog" prose. Keep some natural texture and spoken cadence where it still reads cleanly.
- If facts seem missing or uncertain, mark them as open questions instead of inventing details.
- If the user wants heavier rewriting, confirm that they want expansion or restructuring beyond cleanup.

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

## Avoid AI writing tells

Use these as smell tests, not a detector.

Red flags to rewrite:
* inflated significance without concrete facts ("pivotal", "enduring legacy", "reflects broader trends")
* promotional tone ("renowned", "groundbreaking", "commitment to")
* weasel wording ("experts argue", "industry reports") without named sources
* copula avoidance ("serves as", "stands as") when "is/are/has" is enough
* assistant-chat phrasing ("Certainly!", "I hope this helps")
* filler wrap-ups ("challenges and future outlook") that add no new facts
* placeholders or tool artifacts (`[ADD: ...]`, `oaicite`, `turn0search0`, `utm_source=chatgpt.com`)

Detailed checklist and rewrite playbook:
* `notes/ai-writing-tells.md`

---

## Quick "Voice Preamble" for prompts

When starting any drafting task, internally apply:

* Direct, practical, no fluff.
* TL;DR first.
* Simple words, short sentences.
* One scar per post.
* No hype, no invented metrics.
* Light humor allowed, rarely.
