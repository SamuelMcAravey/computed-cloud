---
name: normalize-frontmatter
description: Normalize frontmatter keys, ordering, and formatting for blog posts while keeping draft status unless told. Use when frontmatter is inconsistent or missing required fields.
---

# Normalize Frontmatter

## What it does
Normalizes frontmatter keys, ordering, and formatting for blog posts.

## When to use it
Use when frontmatter is inconsistent or missing required fields.

## Inputs
- Markdown post path (required)
- Publish intent (optional; default keep or set draft true)

## Steps
1) Read frontmatter and remove unsupported keys.
2) Enforce key order: title, description, pubDate, updatedDate (optional), tags, draft, heroImage (optional).
3) Ensure `pubDate` is present. If missing, insert `pubDate: "YYYY-MM-DD"` and report it as missing.
4) Ensure `draft` exists. If missing, set `draft: true` unless explicitly told to publish.
5) Format strings with double quotes and tags as a double-quoted array.

## Output contract
- Updated frontmatter with only supported keys and consistent ordering.
- A short report listing any placeholders added for missing required fields.

## Guardrails
- Do not edit the Markdown body.
- Do not invent real dates or metrics.
- Do not flip `draft` to `false` unless instructed.

## Example invocation
"Normalize Frontmatter for `src/content/blog/2026-01-05-why-content-collections.md`."

## Example output outline
- Frontmatter normalized and ordered
- Report: missing `pubDate` filled with placeholder if needed
