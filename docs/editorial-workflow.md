# Editorial workflow

This repo keeps the writing system close to the published output. The goal is not a perfect CMS. The goal is a small, understandable workflow that turns real notes into publishable posts.

## Source of truth

- `notes/blog-backlog.yml`
  Per-post specs, status, constraints, scars, and required sections
- `notes/plan.md`
  High-level roadmap and publishing order
- `notes/how-to.md`
  Drafting workflow and prompt guidance
- `notes/ai-writing-tells.md`
  Rewrite checklist for common AI-generated habits

## Post states

### 1. Idea or planned post

Capture the post in `notes/blog-backlog.yml` with:

- a stable `id`
- audience
- constraint
- decision
- scar
- required sections or artifacts

### 2. Outline or research

Use `notes/outlines/` and `notes/research/` for supporting material when a post needs more shape before drafting.

### 3. Collection-backed draft

Create the post under `src/content/blog/` with:

- valid Astro frontmatter
- `draft: true`
- a complete body, even if some sections carry explicit placeholders

These drafts stay out of the public site unless you explicitly preview them locally:

```powershell
$env:PUBLIC_SHOW_DRAFTS = "true"
npm run dev
```

### 4. Repo-only work in progress

If a post is too rough for the main content collection, keep it under `src/content_inprogress/`. This keeps the file in git without making it part of Astro's content system.

### 5. Published

Publishing is intentionally small:

1. move the post into `src/content/blog/` if needed
2. remove placeholders
3. verify assets and links
4. set `draft: false`
5. build the site

## Content checks

Useful local checks:

- `pwsh scripts/check-ascii.ps1`
- `pwsh scripts/normalize-punctuation.ps1`
- `pwsh scripts/check-ai-tells.ps1`
- `pwsh scripts/check-blog-accessibility.ps1`
- `npm run build`
- `npm run a11y`

## Codex-specific workflow

The repo includes reusable Codex skills under `.codex/skills/` for:

- drafting a new post
- promoting a draft
- refreshing mini ToCs
- normalizing frontmatter
- adding or removing tags
- checking links and metadata sections
- capturing short published notes from rough input

Those skills exist to reduce churn, not to replace judgment. Facts still need to be verified. Claims still need to be earned.

For routine note capture, use `.codex/skills/make-note` and the `scripts/new-note.mjs` helper instead of the blog backlog. That keeps the note flow separate from post planning and avoids hand-editing monthly YAML.

## Rule of thumb

Keep unfinished work in git if it helps the workflow, but keep the publish boundary explicit. In this repo, the publish boundary is the Astro content collection plus the `draft` flag.
