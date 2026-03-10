param(
  [string[]]$Paths = @(
    "src/content/blog",
    "notes",
    ".codex/skills",
    "AGENTS.md",
    "LLM_Natural_Writing_Guide.md"
  ),
  [string[]]$Extensions = @(".md", ".mdx", ".yml", ".yaml", ".ps1")
)

$ErrorActionPreference = "Stop"

function Get-TargetFiles {
  param(
    [string[]]$TargetPaths,
    [string[]]$Exts
  )

  $files = @()
  foreach ($p in $TargetPaths) {
    if (-not (Test-Path -LiteralPath $p)) { continue }
    $item = Get-Item -LiteralPath $p
    if ($item.PSIsContainer) {
      $files += Get-ChildItem -LiteralPath $p -File -Recurse
    } else {
      $files += $item
    }
  }

  $files | Where-Object { $Exts -contains $_.Extension } | Sort-Object FullName -Unique
}

$targets = Get-TargetFiles -TargetPaths $Paths -Exts $Extensions
$violations = @()

foreach ($file in $targets) {
  $text = Get-Content -LiteralPath $file.FullName -Raw
  if ($text -match "[^\x00-\x7F]") {
    $violations += $file.FullName
  }
}

if ($violations.Count -gt 0) {
  Write-Host "Non-ASCII characters found in the following files:"
  $violations | Sort-Object -Unique | ForEach-Object { Write-Host " - $_" }
  exit 1
}

Write-Host "OK: no non-ASCII characters found in scanned files."
