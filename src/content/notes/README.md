# Notes Authoring

This folder holds short notes for the site.

The goal is to capture useful thoughts that are too small for a full blog post but
still worth keeping public.

## Format

- Add notes in monthly YAML files such as `2026-03.yml`.
- Each file has a `month` field and an `entries` array.
- Keep notes short. Most should land somewhere around 100-400 words.

## Fields

- `id`: stable anchor for the note on `/notes`
- `title`: short and specific
- `summary`: the one-paragraph version
- `body`: 1-3 short paragraphs
- `tags`: small controlled vocabulary, not hashtags
- `context`: where or when the note belongs, for example `Pearl Bakery, 2020-2023`
- `published`: when the note was added to the site
- `links`: optional related links

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
