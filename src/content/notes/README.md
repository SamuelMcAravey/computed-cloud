# Notes Authoring

This folder holds short notes for the site.

The goal is to capture useful thoughts that are too small for a full blog post but
still worth keeping public.

## Voice

- Write these like notes, not mini essays.
- First person is good. "I keep seeing...", "I used to think...", "What changed for me..."
- A little rough is better than over-polished.
- A note can be slightly messy if it still has one clear center of gravity.
- Mixed thoughts are fine. It does not need to march in a straight line.
- Notes should feel closer to "I had this thought and wrote it down while it was still fresh"
  than "I prepared a tidy article."
- One clear point per note is enough.
- Keep the language direct and plain.
- Include one concrete detail when you can.
- It is fine if some notes end a little open instead of landing on a neat lesson.
- Sounding natural matters more than sounding polished.
- If a note starts sounding like a miniature blog post, cut it down.
- If a sentence sounds too smooth or generic, rewrite it in a more human way.

## What to avoid

- Do not sound like a consultant memo.
- Do not use TL;DRs, formal sectioning, or heavy scaffolding inside a note.
- Do not pad the note just to make it feel complete.
- Do not turn every thought into a universal lesson.
- Do not sand off all personality. Some opinion is good if it is grounded.
- If the title sounds like a conference talk or strategy deck, rewrite it.

## Format

- Add notes in monthly YAML files such as `2026-03.yml`.
- Each file has a `month` field and an `entries` array.
- Keep notes short. Most should land somewhere around 100-400 words.

## Fields

- `id`: stable anchor for the note on `/notes`
- `title`: short, specific, and spoken-sounding
- `summary`: the one-paragraph version
- `body`: 1-3 short paragraphs
- `tags`: small controlled vocabulary, not hashtags
- `context`: where or when the note belongs, for example `Pearl Bakery, 2020-2023`
- `published`: when the note was added to the site
- `links`: optional related links
- Keep links short and cap them at two per note

## Dates

Use `published` for when the note lands on the site.

Use `context` for when the work actually happened.

That lets historical notes be honest without making the archive look like every
important thing happened on the same day.

## Suggested tags

- `ai`
- `architecture`
- `bakery`
- `dotnet`
- `erp`
- `integrations`
- `operations`
- `payments`
- `reliability`
- `support`
- `tooling`

## Note prompts

Use one of these patterns when you are not sure where to start.

### Pattern 1

- What was the problem?
- Why was it harder than it looked?
- What changed?

### Pattern 2

- I used to think X.
- In production, Y happened.
- Now my rule of thumb is Z.

### Pattern 3

- System or context
- One thing that kept going wrong
- The fix or the lesson

## Useful openers

- "I keep seeing..."
- "The thing that surprised me was..."
- "I used to think..."
- "The scar here was..."
- "What changed for me was..."
- "I still come back to..."

## Title smell test

- If it sounds like something you would not actually say out loud, rewrite it.
- Prefer plain statements over concept-heavy phrasing.
- Avoid title shapes like "when X becomes Y", "the shape of", or "X as a first-class Y".
