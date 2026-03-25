---
name: draft-new-post
description: Draft new Computed Cloud blog posts from notes or outlines using the required voice and output contract. Use when the user asks for a new blog post draft.
---

# Draft New Blog Post

## What it does
Drafts a new Computed Cloud blog post from notes or an outline using the required voice and structure.

## When to use it
Use when you need a fresh post created from a prompt, notes, or a rough outline.

## Inputs
- Topic or notes (required)
- Target audience (optional)
- Constraints or requirements (optional)
- Desired publish date (optional)

## Steps
1) Read the input notes and list missing inputs as placeholders.
2) Load and apply writing guardrails:
   - `AGENTS.md` (voice and structure)
   - `LLM_Natural_Writing_Guide.md` (natural writing, anti AI tells)
   - `notes/ai-writing-tells.md` (common tells and rewrite playbook)
3) Propose 2-3 angles and recommend one with a short reason.
4) Draft the post using the default structure in `AGENTS.md` with TL;DR first.
5) Include a clear scar and explicit tradeoffs.
6) Produce all items in the output contract.
7) Self-check (warning-only):
   - run `pwsh scripts/check-ascii.ps1`
   - run `pwsh scripts/check-ai-tells.ps1`
   - revise matches by making prose more specific and less template-like

## Output contract
Return all of the following, in order:
1) Title options (3-5)
2) Recommended title + why
3) Tags (string array suggestions)
4) Frontmatter (Astro Content Collections format)
5) Full Markdown body (complete, publishable)
6) Assets needed (bulleted list; assume `public/assets/`)
7) Open questions / assumptions (bulleted list)
8) Fact check list (bulleted list of claims to verify)

## Guardrails
- Do not invent facts, metrics, dates, or repo-specific details.
- Keep TL;DR first and use short, direct sentences.
- Avoid banned phrases from `AGENTS.md`.
- Follow `LLM_Natural_Writing_Guide.md` to avoid AI writing tells (puffery, promo tone, weasel wording, filler wrap-ups, assistant-chat phrasing).
- Avoid common AI writing tells from `notes/ai-writing-tells.md` (puffery, promo tone, weasel wording, assistant-chat phrasing, filler wrap-ups).
- ASCII-only punctuation: no em/en dashes, no smart quotes/apostrophes.
- Use placeholders for missing inputs and list them under Open questions / assumptions.

## Example invocation
"Use Draft New Blog Post to turn these notes into a post: <notes>"

## Example output outline
- Title options
- Recommended title + why
- Tags: ["..."]
- Frontmatter
- Full Markdown body
- Assets needed
- Open questions / assumptions
- Fact check list
