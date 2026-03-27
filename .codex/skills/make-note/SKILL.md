---
name: make-note
description: Draft and append short Computed Cloud notes from rough input using the repo's published notes format.
---

# Make Note

## What it does
Turns rough input into a short, spoken note and appends it to the current monthly notes file.

## When to use it
Use when the user wants a quick public note, a scratchpad-style thought, or a small reminder that should live under `src/content/notes/`.

## Inputs
- Rough notes, transcript, or bullet dump
- Optional `context`
- Optional `links`
- Optional `tags_hint`
- Optional `mode`:
  - `shape-for-note` (default)
  - `cleanup-only`

## Default behavior
- Default to a published site note unless the user explicitly says internal/private.
- Keep the output short, direct, and spoken.
- Use the existing note vocabulary first. Do not invent tags unless nothing fits.
- Avoid TL;DRs, blog scaffolding, and polished essay structure.
- Keep body content to 1-3 short paragraphs.

## Workflow
1. Read the rough input and the note capture template in `notes/note-brief-template.md`.
2. Pick the cleanest single idea.
3. Shape the note without over-polishing it.
4. Produce a normalized note entry with:
   - `id`
   - `permalink`
   - `title`
   - `summary`
   - `body`
   - `tags`
   - `published`
   - optional `context`
   - optional `links`
5. Pass the normalized entry to `scripts/new-note.mjs` so the helper can validate and append it.
6. If the user asked for an internal/private note, do not append to the monthly YAML file. Keep it as a plain markdown scratchpad under `notes/` instead.

## Recommended wrapper settings
- If you spawn a dedicated local agent for this skill, use `gpt-5.4` with high reasoning.
- Keep the agent thin. Policy lives in this skill and the helper, not in a one-off prompt.

## Guardrails
- Do not turn the note into a mini blog post.
- Do not add facts, dates, metrics, or examples that were not provided.
- Keep tags sparse and practical.
- Keep links to two or fewer.
- Use ASCII punctuation only.

## Output contract
Return a normalized note entry or the path and URL of the written note:
- `id`
- `permalink`
- `title`
- `summary`
- `body`
- `tags`
- `published`
- optional `context`
- optional `links`
- target file path
- direct `/notes/<permalink>` URL

## Example input shape
```json
{
  "title": "One big machine can take you pretty far",
  "summary": "I keep coming back to this because complexity turns into a staffing bill fast.",
  "body": [
    "A simple machine is not a moral stance. It is a tradeoff against the debugging cost of too many moving parts.",
    "I have watched teams pay that cost later, usually when nobody has time to trace all the pieces."
  ],
  "tags": ["architecture", "operations"],
  "context": "Architecture and operations",
  "published": "2026-03-26"
}
```
