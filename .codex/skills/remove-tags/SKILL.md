---
name: remove-tags
description: Remove one or more tags from a blog post frontmatter without changing body content. Use when tags should be deleted.
---

# Remove Tags from Post

## What it does
Removes one or more tags from a post's frontmatter without touching the body.

## When to use it
Use when tags are wrong, obsolete, or too noisy.

## Inputs
- Markdown post path (required)
- Tags to remove (required; list)

## Steps
1) Load frontmatter and read the current `tags` list.
2) Remove tags that match the input list.
3) Keep the order of the remaining tags.
4) Write frontmatter back; do not change the body.

## Output contract
- Updated frontmatter with the tags removed.
- Body content unchanged.

## Guardrails
- Do not edit any non-frontmatter content.
- Do not remove tags that are not listed in the input.

## Example invocation
"Remove Tags from Post for `src/content/blog/2026-01-10-building-tools-that-last.md` with tags: ["wip", "draft"]"

## Example output outline
- Frontmatter `tags` updated with specified tags removed
