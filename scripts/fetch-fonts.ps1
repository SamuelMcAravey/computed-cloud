param(
  [Parameter(Mandatory = $true)]
  [string]$Family,
  [string[]]$Weights = @("400", "600"),
  [switch]$Italics,
  [string]$OutDir = "public/fonts"
)

$ErrorActionPreference = "Stop"

function Get-Slug([string]$value) {
  $slug = $value.ToLowerInvariant()
  $slug = $slug -replace "\s+", "-"
  $slug = $slug -replace "[^a-z0-9\-]", ""
  return $slug
}

$familyParam = $Family -replace "\s+", "+"
$weights = $Weights | Where-Object { $_ -match "^\d+$" } | Select-Object -Unique

if ($weights.Count -eq 0) {
  throw "No valid weights provided."
}

if ($Italics) {
  $pairs = @()
  foreach ($weight in $weights) {
    $pairs += "0,$weight"
    $pairs += "1,$weight"
  }
  $axis = "ital,wght@" + ($pairs -join ";")
} else {
  $axis = "wght@" + ($weights -join ";")
}

$cssUrl = "https://fonts.googleapis.com/css2?family=$($familyParam):$($axis)&display=swap"
Write-Host "Fetching CSS from $cssUrl"

$userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
$css = (Invoke-WebRequest -Uri $cssUrl -UseBasicParsing -UserAgent $userAgent).Content

$blocks = [regex]::Matches($css, "@font-face\s*\{[^}]+\}")
if ($blocks.Count -eq 0) {
  throw "No @font-face blocks found. Check the family name."
}

$familySlug = Get-Slug $Family
$targetDir = Join-Path $OutDir $familySlug
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

$fontEntries = @()
$preloadEntries = @()

foreach ($match in $blocks) {
  $block = $match.Value
  $styleMatch = [regex]::Match($block, "font-style:\s*([^;]+);")
  $weightMatch = [regex]::Match($block, "font-weight:\s*([^;]+);")
  $urlMatches = [regex]::Matches($block, "url\(([^)]+)\)")
  if ($urlMatches.Count -eq 0) {
    continue
  }

  $urls = $urlMatches | ForEach-Object { $_.Groups[1].Value.Trim("'""") }
  $fontUrl = $urls | Where-Object { $_ -match "\.woff2($|\?)" } | Select-Object -First 1
  if (-not $fontUrl) {
    continue
  }

  $style = if ($styleMatch.Success) { $styleMatch.Groups[1].Value.Trim() } else { "normal" }
  $weight = if ($weightMatch.Success) { $weightMatch.Groups[1].Value.Trim() } else { "400" }
  $fileName = "$familySlug-$weight-$style.woff2"
  $outPath = Join-Path $targetDir $fileName

  if (-not (Test-Path $outPath)) {
    Write-Host "Downloading $fontUrl"
    Invoke-WebRequest -Uri $fontUrl -UseBasicParsing -UserAgent $userAgent -OutFile $outPath
  }

  $webRoot = $targetDir -replace "^[Pp]ublic[\\/]", ""
  $relativePath = "/$($webRoot.Replace('\', '/'))/$fileName"
  $fontEntries += [pscustomobject]@{
    family = $Family
    weight = $weight
    style = $style
    url = $relativePath
  }
  $preloadEntries += $relativePath
}

if ($fontEntries.Count -eq 0) {
  throw "No woff2 files were downloaded."
}

Write-Host ""
Write-Host "Paste the following into site.theme:"
Write-Host ""
Write-Host "fonts: ["
foreach ($entry in $fontEntries) {
  Write-Host "  {"
  Write-Host "    family: `"$($entry.family)`","
  Write-Host "    src: [{ url: `"$($entry.url)`", format: `"woff2`" }],"
  Write-Host "    weight: `"$($entry.weight)`","
  Write-Host "    style: `"$($entry.style)`","
  Write-Host "    display: `"swap`","
  Write-Host "  },"
}
Write-Host "],"
Write-Host "preloadFonts: ["
foreach ($entry in ($preloadEntries | Select-Object -Unique)) {
  Write-Host "  `"$entry`","
}
Write-Host "],"
Write-Host ""
Write-Host "Optional typography update:"
Write-Host "typography: {"
Write-Host "  body: `"$Family, ui-sans-serif, system-ui, sans-serif`","
Write-Host "  heading: `"$Family, ui-serif, serif`","
Write-Host "}"
