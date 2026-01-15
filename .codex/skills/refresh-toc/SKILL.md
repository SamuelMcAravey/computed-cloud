---
name: refresh-toc
description: Generate or refresh a mini "On this page" list after TL;DR based on existing headings. Use for medium or long posts that need navigation.
---

# Generate or Refresh Mini ToC

## What it does
Adds or updates a short "On this page" list after TL;DR for medium or long posts.

## When to use it
Use when the post is medium/long and needs quick navigation.

## Inputs
- Markdown post path (required)
- Length threshold (optional; default: add if 6+ H2 sections)

## Steps
1) Parse headings and decide if the post is medium/long.
2) Build a bullet list of links that match existing H2 headings.
3) Insert or refresh the "On this page" list right after TL;DR.
4) If the post is short, remove any existing mini ToC and report why.

## Output contract
- Updated Markdown post with a correct mini ToC when applicable.
- No heading text changes.

## Guardrails
- Do not add new headings.
- Do not change heading wording; links must match current headings.
- Do not move TL;DR from the top.

## Example invocation
"Generate or Refresh Mini ToC for `src/content/blog/2026-01-14-site-capabilities-demo.md`."

## Example output outline
- TL;DR
- On this page
  - Context
  - Decision
  - Implementation
  - Tradeoffs
