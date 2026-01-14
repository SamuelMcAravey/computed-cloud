param(
  [Parameter(Mandatory = $true)]
  [string]$TemplateRoot,
  [string[]]$Targets,
  [string]$TargetsFile
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Read-TargetsFile {
  param([string]$Path)
  if (-not (Test-Path -Path $Path)) {
    throw "Targets file not found: $Path"
  }
  $lines = Get-Content -Path $Path
  return $lines |
    ForEach-Object { $_.Trim() } |
    Where-Object { $_ -ne "" -and -not $_.StartsWith("#") }
}

$targetList = @()
if ($Targets) {
  $targetList += $Targets
}
if ($TargetsFile) {
  $targetList += Read-TargetsFile -Path $TargetsFile
}

if (-not $targetList -or $targetList.Count -eq 0) {
  throw "No targets provided. Use -Targets or -TargetsFile."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$syncScript = Join-Path $scriptDir "sync-template.ps1"
if (-not (Test-Path -Path $syncScript)) {
  throw "sync-template.ps1 not found at $syncScript"
}

foreach ($target in $targetList) {
  Write-Host ""
  Write-Host "Syncing $target..." -ForegroundColor Cyan
  & $syncScript -TemplateRoot $TemplateRoot -TargetRoot $target
}

Write-Host ""
Write-Host "All targets synced." -ForegroundColor Green
