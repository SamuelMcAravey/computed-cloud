---
name: promote-draft
description: Tighten and complete an existing Computed Cloud draft while preserving facts and voice, without flipping draft status unless told. Use when a draft needs to be publish-ready.
---

# Promote Draft to Publish-Ready

## What it does
Tightens an existing draft while preserving facts and voice, and makes it ready to publish.

## When to use it
Use when a draft exists but needs clearer structure, stronger TL;DR, and gaps filled.

## Inputs
- Markdown post path (required)
- Any known missing facts or edits (optional)
- Publish intent (optional; default keep draft true)

## Steps
1) Read the full draft and identify weak sections or missing structure.
2) Strengthen TL;DR to include decision, constraint, and outcome.
3) Tighten prose, improve headings, and make tradeoffs explicit.
4) Add at least one scar if relevant to the topic.
5) Refresh Assets needed, Open questions / assumptions, and Fact check list.

## Output contract
- Updated Markdown post at the same path.
- Draft stays `true` unless explicitly told to publish.
- Assets/Open questions/Fact check sections are present and updated.

## Guardrails
- Do not invent facts, metrics, or dates.
- Do not change the slug or file path.
- Do not flip `draft: true` to `false` unless instructed.

## Example invocation
"Promote Draft to Publish-Ready for `src/content/blog/2026-01-10-building-tools-that-last.md`."

## Example output outline
- Updated Markdown file with a stronger TL;DR
- Improved headings and tighter prose
- Explicit tradeoffs and a scar
- Refreshed Assets/Open questions/Fact check sections
