# Prior Art Inventory Pipeline

This repo has a hidden but published prior-art page at `/prior-art`.

The page is public. The source data pipeline is split so private evidence stays local.

## Data surfaces

Keep these surfaces separate:

- `artifacts/prior-art/master-prior-art.json`
  - Private master inventory
  - Local only
  - Not imported by Astro
  - Can include repo names, orgs, history evidence, project units, and review flags

- `artifacts/prior-art/public-candidate-view.json`
  - Filtered public-safe view derived from the master
  - Used for review before promotion
  - Safe to inspect locally

- `artifacts/prior-art/pdf-candidate-view.json`
  - Broader filtered view for a future PDF exhibit or excluded-prior-art schedule
  - Local review artifact

- `artifacts/prior-art/review-summary.md`
  - Human review report
  - Local only

- `src/data/prior-art.inventory.json`
  - Public site inventory
  - Used by `src/pages/prior-art.astro`
  - Safe to commit and publish

- `src/data/prior-art.repositories.json`
  - Public repository catalog used by the page
  - Repo names and metadata only
  - Forks are excluded
  - Uses commit-history dates when local evidence is available
  - Safe to commit and publish

Rule of thumb: the public page should only read committed public-safe data. It must never import the private master or the generated evidence snapshots.

## What the pipeline is for

The master inventory is the source of truth for three downstream views:

1. The public page
2. The PDF exhibit staging view
3. The private evidence register

The master is meant to be exhaustive enough to support later filtering. The derived views are meant to be narrower and easier to review.

## What belongs where

Use the public site files for curated, public-safe entries:

- public project names
- rough chronology
- public links
- public evidence links
- high-level summaries

Use the master inventory for:

- all accessible GitHub orgs and repos relevant to prior work
- private and public repo metadata
- local clone evidence
- project and package discovery
- review flags and classification fields
- notes that should not be published

Do not put these in the public site files:

- local file paths
- private remote URLs
- commit hashes
- pushed dates
- branch names
- confidential notes
- copied source code
- raw evidence output

## How to run the inventory script

The new master inventory script is expected at:

- `scripts/prior-art/inventory-github.ps1`

Typical run:

```powershell
npm run prior-art:inventory -- `
  -Roots C:\src `
  -Recurse `
  -UseGhCli `
  -OutMaster artifacts/prior-art/master-prior-art.json `
  -OutPublic artifacts/prior-art/public-candidate-view.json `
  -OutPdf artifacts/prior-art/pdf-candidate-view.json `
  -OutSummary artifacts/prior-art/review-summary.md
```

If you have manual non-repo items, pass a local supplement file:

```powershell
npm run prior-art:inventory -- `
  -Roots C:\src `
  -Recurse `
  -UseGhCli `
  -ConfigFile scripts/prior-art/manual-supplement.example.json `
  -OutMaster artifacts/prior-art/master-prior-art.json `
  -OutPublic artifacts/prior-art/public-candidate-view.json `
  -OutPdf artifacts/prior-art/pdf-candidate-view.json `
  -OutSummary artifacts/prior-art/review-summary.md
```

The script should:

- query `gh` for identity, org memberships, and accessible repos
- scan local roots for git repositories and project units
- build the private master inventory
- emit the public candidate view and PDF candidate view
- write a review summary instead of failing hard on partial discovery

## Manual supplement

Use a local supplement when you want to add non-repo prior art:

- domains and websites
- abandoned projects
- old venture code
- prototypes that are not in an active repo
- local-only folders

Recommended template:

- `scripts/prior-art/manual-supplement.example.json`

Keep the local supplement private if it contains anything sensitive. Use placeholders in the example file.

## What is safe to commit

Safe to commit:

- `src/data/prior-art.inventory.json`
- `src/data/prior-art.repositories.json`
- `scripts/prior-art/inventory-github.ps1`
- `scripts/prior-art/manual-supplement.example.json`
- docs that explain the workflow

Keep local unless you intentionally want to promote them:

- `artifacts/prior-art/master-prior-art.json`
- `artifacts/prior-art/pdf-candidate-view.json`
- `artifacts/prior-art/review-summary.md`
- any local supplement file with private details

Treat `artifacts/prior-art/public-candidate-view.json` as a review artifact. It can be committed only after you decide it is safe and useful to keep in history.

## Existing local evidence export

The older repo-root evidence snapshot script still exists:

- `scripts/Export-PriorArtEvidence.ps1`

That script is for local evidence capture from roots and optional manual entries. It is useful when you want a simple local snapshot without the full GitHub inventory pass.

## Recommended workflow

1. Run the GitHub inventory script against the local roots you care about.
2. Review `artifacts/prior-art/review-summary.md`.
3. Review the master JSON locally.
4. Promote approved records into the public candidate view.
5. Copy the reviewed public data into the site files if you want the page updated.
6. Keep the private master and evidence outputs local.
7. If you need a PDF exhibit, generate it from the PDF candidate view, not from the raw master.

## Safety checks

Before publishing:

- confirm `src/pages/prior-art.astro` only imports public-safe site data
- confirm the private master stays outside `src/`
- confirm no private paths, remotes, or commit hashes were copied into the public site files
- confirm `/prior-art` still has `noindex,nofollow`
- confirm `/prior-art` stays out of sitemap and site search
