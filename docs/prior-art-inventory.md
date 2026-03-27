# Prior Art Inventory

This repo contains a hidden but published prior-art page at `/prior-art`.

Its job is simple:

- keep a public-safe ownership and chronology record
- keep private evidence snapshots local
- make it easy to update the public page without exposing repository paths, remotes, or internal notes

## Public vs private

There are two separate data surfaces. Keep them separate.

Public inventory:

- File: `src/data/prior-art.inventory.json`
- Used by: `src/pages/prior-art.astro`
- Safe to commit and publish
- Contains only curated, high-level descriptions, public links, public evidence, tags, and rough chronology

Private evidence:

- Default outputs:
  - `src/data/prior-art.evidence.generated.json`
  - `src/data/prior-art.evidence.generated.md`
- Produced by: `scripts/Export-PriorArtEvidence.ps1`
- Local only
- Ignored by git
- May contain local paths, remote URLs, commit hashes, branch names, and other evidence details

Rule of thumb: the public page must never import or render the generated evidence files.

## Editing the public inventory

Add or update entries in `src/data/prior-art.inventory.json`.

Each entry supports:

- `id`
- `title`
- `slug`
- `parentId`
- `kind`
- `status`
- `visibility`
- `ownerLabel`
- `started`
- `startedPrecision`
- `ended`
- `endedPrecision`
- `publicSummary`
- `notesPublic`
- `tags`
- `domains`
- `publicLinks`
- `evidencePublic`
- `relatedIds`
- `group`

Guidelines:

- Use `parentId` when an umbrella item should contain child items.
- Use `group` for portfolio-style grouping across related records.
- If a date is not confirmed, keep it `null` and use `unknown`, or use an approximate value with `approximate`.
- Do not invent precision.
- Keep summaries high level and public safe.

Do not put any of the following into the public inventory:

- local file paths
- private repository URLs
- commit hashes
- internal folder names
- confidential notes
- copied raw evidence output

## Exporting private evidence

Run the export with one or more local roots:

```powershell
npm run prior-art:evidence -- -Roots C:\src C:\work -Recurse
```

You can also call the script directly:

```powershell
pwsh -File scripts/Export-PriorArtEvidence.ps1 `
  -Roots C:\src,C:\work `
  -OutJson src/data/prior-art.evidence.generated.json `
  -OutMarkdown src/data/prior-art.evidence.generated.md `
  -Recurse
```

Optional flags:

- `-ConfigFile` to add manual non-repo entries
- `-UseGhCli` to resolve GitHub visibility when `gh` is installed and authenticated

The script collects, when available:

- local repo or folder name
- local path
- remote URLs
- default branch
- earliest and latest commit hashes and dates
- current HEAD and branch
- dirty worktree state
- README heading and preview
- repo visibility from `gh`

## Manual config entries

Use a local config file when you want to track domains, abandoned projects, local-only folders, or older work that is not in an active git repository.

Recommended local file:

- `src/data/prior-art.evidence.config.local.json`

That file is ignored by git.

Example shape:

```json
{
  "manualEntries": [
    {
      "name": "Example archived site",
      "path": "C:\\placeholder\\example-archived-site",
      "kind": "website",
      "summary": "Local-only placeholder example.",
      "notes": "Local-only placeholder example.",
      "urls": ["https://example.com"],
      "domains": ["example.com"],
      "sortDate": "2014-01-01"
    }
  ]
}
```

Use placeholders in docs and examples. Do not commit real private paths or remotes.

## Recommended workflow

1. Scan local roots with `scripts/Export-PriorArtEvidence.ps1`.
2. Review the generated JSON and Markdown locally.
3. Curate or update high-level entries in `src/data/prior-art.inventory.json`.
4. Build and publish the site.
5. Keep local copies of evidence snapshots outside the public workflow if you want dated archives.

## Safety checks

Before publishing:

- confirm `src/pages/prior-art.astro` imports only the public inventory helpers
- confirm the generated evidence files are still ignored
- confirm no local paths or private remotes were copied into `prior-art.inventory.json`
- confirm `/prior-art` still has `noindex,nofollow`
- confirm `/prior-art` stays out of sitemap and site search
