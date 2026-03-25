---
name: link-reference-check
description: Perform static checks for asset paths, malformed links, and missing code fence languages in a post. Use before publishing to catch obvious issues.
---

# Link and Reference Check

## What it does
Performs static checks for common link and reference issues in a post.

## When to use it
Use before publishing to catch obvious path and formatting problems.

## Inputs
- Markdown post path (required)

## Steps
1) Scan image links and ensure internal paths start with `/assets/`.
2) Flag likely broken external links (missing scheme or malformed URL).
3) Flag code fences missing language identifiers.
4) Report issues with file and line references.

## Output contract
- A report listing issues with path and line references.
- No file changes unless explicitly requested.

## Guardrails
- Do not attempt network access.
- Do not fix issues unless told to apply changes.
- Do not invent replacement URLs or assets.

## Example invocation
"Link and Reference Check `src/content/blog/2026-01-14-site-capabilities-demo.md`."

## Example output outline
- Issue list with file paths and line numbers
- Suggested fixes when obvious
