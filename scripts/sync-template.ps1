param(
  [Parameter(Mandatory = $true)]
  [string]$TemplateRoot,
  [Parameter(Mandatory = $true)]
  [string]$TargetRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Normalize-Path {
  param([string]$Path)
  return ([IO.Path]::GetFullPath($Path)).TrimEnd([IO.Path]::DirectorySeparatorChar)
}

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path -Path $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Is-Excluded {
  param(
    [string]$FullPath,
    [string]$TemplateRootNormalized
  )

  $relative = [IO.Path]::GetRelativePath($TemplateRootNormalized, $FullPath)
  $relativeNormalized = $relative.Replace("/", "\").ToLowerInvariant()

  $excludedDirs = @(
    ".git",
    "node_modules",
    "dist",
    ".astro",
    ".vscode",
    ".idea",
    "public"
  )

  foreach ($dir in $excludedDirs) {
    if ($relativeNormalized -eq $dir.ToLowerInvariant()) { return $true }
    if ($relativeNormalized.StartsWith($dir.ToLowerInvariant() + "\")) { return $true }
  }

  if ($relativeNormalized -match "^src\\data\\site(\..+)?\.ts$") { return $true }

  return $false
}

$templateRootNormalized = Normalize-Path $TemplateRoot
$targetRootNormalized = Normalize-Path $TargetRoot

if (-not (Test-Path -Path $templateRootNormalized)) {
  throw "Template root not found: $templateRootNormalized"
}
if (-not (Test-Path -Path $targetRootNormalized)) {
  throw "Target root not found: $targetRootNormalized"
}

Write-Host "Syncing template files..." -ForegroundColor Cyan
Write-Host "Template: $templateRootNormalized"
Write-Host "Target:   $targetRootNormalized"

$files = Get-ChildItem -Path $templateRootNormalized -Recurse -File -Force
foreach ($file in $files) {
  if (Is-Excluded -FullPath $file.FullName -TemplateRootNormalized $templateRootNormalized) {
    continue
  }

  $relative = [IO.Path]::GetRelativePath($templateRootNormalized, $file.FullName)
  $destination = Join-Path $targetRootNormalized $relative
  Ensure-Directory (Split-Path -Path $destination)
  Copy-Item -Path $file.FullName -Destination $destination -Force
}

Write-Host "Sync complete." -ForegroundColor Green
