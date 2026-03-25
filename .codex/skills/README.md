# Blog Skills

These skills live under `.codex/skills/` and are intended for repeatable blog management tasks.

## How to invoke
Use the skill name and provide required inputs. Example:

"Use Draft New Blog Post with these notes: <notes>"

If the request matches one of these skills, prefer using it over ad-hoc prompting.

## Skills in this repo
- `draft-new-post`: Draft a new post from notes using the output contract in `AGENTS.md`.
- `promote-draft`: Tighten an existing draft without inventing facts.
- `normalize-frontmatter`: Normalize supported frontmatter keys/order for `src/content/blog/*`.
- `refresh-toc`: Add/refresh a mini "On this page" list (when medium/long).
- `refresh-metadata-sections`: Ensure Assets/Open questions/Fact check sections exist.
- `markdown-lint`: Minimal safe Markdown cleanup.
- `link-reference-check`: Static checks for assets/links/fences (no edits unless told).

## Batch drafting (research + draft)
- `research-and-draft`: Deep research dossier + full draft for a single idea (writes both files).
- `blog-batch-research-draft`: Reads `notes/blog-backlog.yml` and produces N items per run (default 3).
