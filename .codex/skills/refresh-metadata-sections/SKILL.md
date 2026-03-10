---
name: refresh-metadata-sections
description: Ensure Assets needed, Open questions / assumptions, and Fact check list sections exist and are updated. Use when these sections are missing or stale.
---

# Refresh Assets/Open Questions/Fact Check Sections

## What it does
Ensures the post has "Assets needed", "Open questions / assumptions", and "Fact check list" sections, and refreshes their content.

## When to use it
Use when these sections are missing, stale, or inconsistent.

## Inputs
- Markdown post path (required)
- Known assets or questions (optional)

## Steps
1) Locate or add the three sections near the end of the post.
2) Ensure each section uses a short bullet list.
3) Add placeholders for missing information.
4) If data is missing, list it under Open questions / assumptions.

## Output contract
- Updated Markdown post with all three sections present.
- Placeholder bullets added when inputs are missing.

## Guardrails
- Do not invent facts, metrics, or assets.
- Do not remove existing valid items.
- Keep headings consistent: "## Assets needed", "## Open questions / assumptions", "## Fact check list".

## Example invocation
"Refresh Assets/Open Questions/Fact Check sections for `src/content/blog/2026-01-01-hello-world.md`."

## Example output outline
- ## Assets needed
  - Placeholder: <asset>
- ## Open questions / assumptions
  - Placeholder: <missing detail>
- ## Fact check list
  - Placeholder: <claim to verify>
