---
name: add-tags
description: Add one or more tags to a blog post frontmatter without changing body content. Use when tags need to be added.
---

# Add Tags to Post

## What it does
Adds one or more tags to a post's frontmatter without touching the body.

## When to use it
Use when tags are missing or you want to expand tag coverage.

## Inputs
- Markdown post path (required)
- Tags to add (required; list)

## Steps
1) Load frontmatter and read the current `tags` list.
2) Add new tags that are not already present.
3) Keep existing tag order and append new tags in the input order.
4) Write frontmatter back; do not change the body.

## Output contract
- Updated frontmatter with merged, unique tags.
- Body content unchanged.

## Guardrails
- Do not edit any non-frontmatter content.
- Do not invent new tags beyond the input list.

## Example invocation
"Add Tags to Post for `src/content/blog/2026-01-14-site-capabilities-demo.md` with tags: ["astro", "content-collections"]"

## Example output outline
- Frontmatter `tags` updated to include the new entries
