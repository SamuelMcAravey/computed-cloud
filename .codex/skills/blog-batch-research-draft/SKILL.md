---
name: blog-batch-research-draft
description: "Backlog-driven batch: reads notes/blog-backlog.yml and produces deep research dossiers + full drafts for the next N items (default 3), with footnote citations and placeholders."
---

# Blog Batch: Research + Draft (Backlog-Driven)

## What it does
Reads `notes/blog-backlog.yml`, selects the next N items with `status: todo`, and for each item produces:
- `notes/research/<YYYY-MM-DD>-<id>.md`
- `src/content/blog/<id>.md`

Also updates the backlog item with:
- `status` transitions (`todo` -> `drafting` -> `drafted`)
- `draft_path` and `research_path` when complete

## When to use it
Use when you want to churn out multiple posts in one sitting with consistent structure and deep research.

## Inputs
Optional:
- N (default 3)
- Filter by `shape`
- Filter by `sensitivity`

## Defaults (locked)
- Parallelism cap: 3 items at a time.
- Research depth: deep.
- Citations: footnote style with `## References`.
- Redaction: medium (allow common tech names; redact customers/internal names unless explicitly provided).
- Seed links: optional (use when present).

## Hard requirements (repo rules)
- Follow voice + structure rules in `AGENTS.md`.
- Do not invent facts, metrics, dates, or confidential details.
- Use placeholders and list them under "Open questions / assumptions".
- Draft frontmatter must match `src/content/config.ts`.
- Follow `LLM_Natural_Writing_Guide.md` to avoid AI writing tells in drafts.
- Avoid common AI writing tells from `notes/ai-writing-tells.md` (puffery, promo tone, weasel wording, assistant-chat phrasing, filler wrap-ups).
- ASCII-only punctuation: no em/en dashes, no smart quotes/apostrophes.

## Steps
1) Parse backlog
   - Load `notes/blog-backlog.yml`.
   - Select next N items with `status: todo`.
   - Immediately set selected items to `status: drafting` and write the file (prevents duplicate drafting on rerun).

2) For each selected item (max 3 concurrently)
   - Use sub-agents to parallelize legwork for that item:
     - `researcher`: produces the research dossier (sources/claims/definitions/failure modes).
     - `skeptic`: flags weak claims, missing primary sources, and risky phrasing.
     - `outliner`: proposes 2-3 angles; recommends one; produces an outline.
     - `drafter`: writes the full draft with footnotes and placeholders.
   - Merge outputs into:
     - `notes/research/<YYYY-MM-DD>-<id>.md`
     - `src/content/blog/<id>.md`

3) Run finishing passes per draft
   - Run, in order:
     - `normalize-frontmatter`
     - `refresh-toc` (only if medium/long)
     - `refresh-metadata-sections`
     - `markdown-lint`
     - `link-reference-check` (report issues; do not edit unless told)

4) Update backlog status
   - On success:
     - set `status: drafted`
     - write `draft_path` and `research_path`
   - If blocked by missing critical input:
     - keep `status: todo`
     - add `blockers:` with concrete missing fields/questions

## Output contract
- Updated `notes/blog-backlog.yml`
- New research and draft files for each completed item
- A short report:
  - drafted items
  - blocked items + blockers
  - any link/reference issues found

## Example invocation
"Run blog-batch-research-draft with N=3."
