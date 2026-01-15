---
name: markdown-lint
description: Apply minimal, safe Markdown cleanup for headings, code fences, and whitespace. Use when a post needs formatting fixes.
---

# Markdown Lint and Clean

## What it does
Applies safe, minimal Markdown cleanup for consistency and readability.

## When to use it
Use when formatting is messy or there are obvious Markdown errors.

## Inputs
- Markdown post path (required)

## Steps
1) Normalize heading levels where a simple one-level promotion fixes a skipped level.
2) Ensure all code fences are closed.
3) Add a language identifier to code fences when missing (use `text` if unknown).
4) Trim trailing whitespace on all lines.

## Output contract
- Updated Markdown post with minimal, safe formatting fixes.
- No content rewrites beyond formatting.

## Guardrails
- Do not change wording or meaning.
- Avoid large structural changes.
- Do not invent code or examples.

## Example invocation
"Markdown Lint and Clean `src/content/blog/2026-01-05-why-content-collections.md`."

## Example output outline
- Fixed heading levels
- Closed code fences
- Added missing fence languages
- Removed trailing whitespace
