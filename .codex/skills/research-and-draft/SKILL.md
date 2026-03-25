---
name: research-and-draft
description: Deep research dossier + full Computed Cloud draft for a single idea, with footnote-style citations and placeholders for missing facts.
---

# Research and Draft (Single Item)

## What it does
For one idea/brief, produces:
- A deep research dossier: `notes/research/<YYYY-MM-DD>-<id>.md`
- A full blog draft: `src/content/blog/<id>.md`

## When to use it
Use when you want "99% there" output for one post: sources, outline, and a full draft with placeholders.

## Inputs (required unless marked optional)
- `id`: slug-safe identifier used for file names
- Topic/brief (can be pasted, or use the template in `notes/blog-brief-template.md`)
- Shape: manifesto | case-study | pattern-guide | project-deep-dive | how-to

Optional:
- Seed links (1-3+)
- Tags hint
- Target `pubDate`
- Redaction strictness override: low | medium | high (default medium)

## Hard requirements (repo rules)
- Follow voice + structure rules in `AGENTS.md`.
- Do not invent facts, metrics, dates, or company/customer details.
- Use placeholders like `[ADD: ...]` and list them under "Open questions / assumptions".
- Draft frontmatter must match `src/content/config.ts` schema.
- Follow `LLM_Natural_Writing_Guide.md` to avoid AI writing tells in the draft.
- Avoid common AI writing tells from `notes/ai-writing-tells.md` (puffery, promo tone, weasel wording, assistant-chat phrasing, filler wrap-ups).
- ASCII-only punctuation: no em/en dashes, no smart quotes/apostrophes.

## Steps
1) Gather brief
   - If the input is messy, normalize it into: constraint, decision, outcome, scar, tradeoffs.
   - If anything critical is missing, keep going with placeholders.

2) Deep research (produce a dossier first)
   - Prefer primary sources (RFCs, official docs, standards, vendor docs).
   - Capture 10-20 references when feasible; if fewer, explain why.
   - Output file: `notes/research/<YYYY-MM-DD>-<id>.md` with sections:
     - Claims we plan to make (each mapped to a reference id)
     - Glossary / definitions
     - Failure modes and gotchas
     - Competing viewpoints / context-dependent choices
     - Suggested diagrams (mermaid candidates)
     - Questions only Samuel can answer

3) Outline (2-3 angles)
   - Propose 2-3 distinct angles (narratives).
   - Recommend one and explain in 1-2 sentences.
   - Produce a concrete outline matching the default post structure in `AGENTS.md`.

4) Draft the post with footnotes
   - Write `src/content/blog/<id>.md`.
   - Start with `## TL;DR` (3-5 bullets) that states: decision + constraint + outcome.
   - Include at least one scar: failure mode -> change -> rule of thumb.
   - Make tradeoffs explicit.
   - For factual/technical claims that are not common knowledge, add footnotes:
     - Use `[^1]` markers in text.
     - Include `## References` with `[^1]: ...` entries (title, org, url, accessed date).
   - If medium/long, add a mini "On this page" list after TL;DR.
   - End with:
     - `## Assets needed`
     - `## Open questions / assumptions`
     - `## Fact check list`

5) Finishing passes (use existing skills)
   - Run, in order:
     - `normalize-frontmatter` (keeps `draft: true` unless told otherwise)
     - `refresh-toc` (only if medium/long)
     - `refresh-metadata-sections`
     - `markdown-lint`
     - `link-reference-check` (report issues; only fix if explicitly instructed)

## Output contract
- Write both files to disk.
- Print the two paths and a short "what to review first" checklist.

## Example invocation
"Use research-and-draft for id `background-jobs-idempotency` with this brief: <paste brief>"
