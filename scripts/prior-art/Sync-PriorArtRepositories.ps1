[CmdletBinding()]
param(
  [Parameter()]
  [string]$Root = "C:\src"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$env:GIT_LFS_SKIP_SMUDGE = "1"

function Ensure-ParentDirectory {
  param([Parameter(Mandatory = $true)][string]$Path)

  $parent = Split-Path -Parent $Path
  if (-not [string]::IsNullOrWhiteSpace($parent) -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }
}

function Test-IsGitRepository {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    return $false
  }

  & git -C $Path rev-parse --is-inside-work-tree *> $null
  return ($LASTEXITCODE -eq 0)
}

function Get-RepositoryRows {
  $rows = & gh api /user/repos --paginate --jq '.[] | [.full_name, .clone_url] | @tsv'
  if ($LASTEXITCODE -ne 0) {
    throw "gh api /user/repos failed with exit code $LASTEXITCODE"
  }

  return @($rows)
}

$rows = Get-RepositoryRows
$stats = [ordered]@{
  total = $rows.Count
  cloned = 0
  fetched = 0
  cleaned = 0
  skipped = 0
  failed = 0
}
$failures = New-Object System.Collections.Generic.List[object]

foreach ($row in $rows) {
  if ([string]::IsNullOrWhiteSpace([string]$row)) {
    continue
  }

  $parts = $row -split "`t", 2
  if ($parts.Count -lt 2) {
    continue
  }

  $fullName = $parts[0]
  $cloneUrl = $parts[1]
  $nameParts = $fullName.Split("/", 2)
  if ($nameParts.Count -lt 2) {
    continue
  }

  $owner = $nameParts[0]
  $name = $nameParts[1]
  $target = Join-Path (Join-Path $Root $owner) $name

  try {
    if (Test-IsGitRepository -Path $target) {
      Write-Host ("[fetch] {0}" -f $fullName)
      & git -C $target fetch --all --tags --prune --quiet
      if ($LASTEXITCODE -ne 0) {
        throw "git fetch failed with exit code $LASTEXITCODE"
      }

      $stats.fetched += 1
      continue
    }

    if (Test-Path -LiteralPath $target) {
      $existingItems = @(Get-ChildItem -LiteralPath $target -Force -ErrorAction SilentlyContinue)
      if ($existingItems.Count -eq 0) {
        Write-Host ("[clean] {0}" -f $target)
        Remove-Item -LiteralPath $target -Force -ErrorAction SilentlyContinue
        $stats.cleaned += 1
      }
      else {
        Write-Warning ("[skip] existing non-git path: {0}" -f $target)
        $stats.skipped += 1
        continue
      }
    }

    Ensure-ParentDirectory -Path $target
    Write-Host ("[clone] {0}" -f $fullName)
    & git clone --quiet $cloneUrl $target
    if ($LASTEXITCODE -ne 0) {
      throw "git clone failed with exit code $LASTEXITCODE"
    }

    $stats.cloned += 1
  }
  catch {
    $stats.failed += 1
    $failures.Add([ordered]@{
      repo = $fullName
      target = $target
      cloneUrl = $cloneUrl
      message = $_.Exception.Message
    })
    Write-Warning ("[fail] {0}: {1}" -f $fullName, $_.Exception.Message)
  }
}

Write-Host ("Done. cloned={0} fetched={1} cleaned={2} skipped={3} failed={4} total={5}" -f $stats.cloned, $stats.fetched, $stats.cleaned, $stats.skipped, $stats.failed, $stats.total)

if ($failures.Count -gt 0) {
  Write-Host ($failures | ConvertTo-Json -Depth 5)
  exit 1
}
