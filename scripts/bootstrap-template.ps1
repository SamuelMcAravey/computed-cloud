param(
  [string]$SourceRoot = (Resolve-Path ".").Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Read-Input {
  param(
    [string]$Prompt,
    [string]$Default = ""
  )
  if ([string]::IsNullOrWhiteSpace($Default)) {
    $value = Read-Host $Prompt
  } else {
    $value = Read-Host "$Prompt [$Default]"
    if ([string]::IsNullOrWhiteSpace($value)) {
      $value = $Default
    }
  }
  return $value
}

function Resolve-TargetRoot {
  param([string]$InputPath)
  if ([string]::IsNullOrWhiteSpace($InputPath)) {
    return $SourceRoot
  }
  if (Test-Path -Path $InputPath) {
    return (Resolve-Path -Path $InputPath -ErrorAction Stop).Path
  }
  return $InputPath
}

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path -Path $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Copy-Template {
  param(
    [string]$From,
    [string]$To
  )
  Ensure-Directory $To
  $exclude = @("node_modules", ".git", "dist", ".astro", ".vercel", ".netlify", ".DS_Store")
  $items = Get-ChildItem -Path $From -Force
  foreach ($item in $items) {
    if ($exclude -contains $item.Name) { continue }
    $dest = Join-Path $To $item.Name
    Copy-Item -Path $item.FullName -Destination $dest -Recurse -Force
  }
}

function Update-TextProperty {
  param(
    [string]$Path,
    [string]$Key,
    [string]$Value
  )
  if ([string]::IsNullOrWhiteSpace($Value)) { return }
  $escaped = $Value.Replace('"', '\"')
  $pattern = "$Key\s*:\s*`".*?`""
  $replacement = "$($Key): `"$escaped`""
  $content = Get-Content -Path $Path -Raw
  if ($content -match $pattern) {
    $content = [regex]::Replace($content, $pattern, $replacement)
    Set-Content -Path $Path -Value $content
  }
}

function Update-ArrayProperty {
  param(
    [string]$Path,
    [string]$Key,
    [string[]]$Values
  )
  if (-not $Values -or $Values.Count -eq 0) { return }
  $escapedValues = $Values | ForEach-Object { '"' + ($_.Replace('"', '\"')) + '"' }
  $arrayLiteral = "[" + ($escapedValues -join ", ") + "]"
  $pattern = "$Key\s*:\s*\[[^\]]*\]"
  $replacement = "$($Key): $arrayLiteral"
  $content = Get-Content -Path $Path -Raw
  if ($content -match $pattern) {
    $content = [regex]::Replace($content, $pattern, $replacement)
    Set-Content -Path $Path -Value $content
  }
}

function Ensure-BrandLogo {
  param(
    [string]$Path,
    [string]$Light,
    [string]$Dark,
    [string]$Icon
  )
  if ([string]::IsNullOrWhiteSpace($Light) -and [string]::IsNullOrWhiteSpace($Dark) -and [string]::IsNullOrWhiteSpace($Icon)) {
    return
  }

  $content = Get-Content -Path $Path -Raw
  $logoEntries = @()
  if (-not [string]::IsNullOrWhiteSpace($Light)) { $logoEntries += "light: `"$Light`"" }
  if (-not [string]::IsNullOrWhiteSpace($Dark)) { $logoEntries += "dark: `"$Dark`"" }
  if (-not [string]::IsNullOrWhiteSpace($Icon)) { $logoEntries += "icon: `"$Icon`"" }
  $logoBlock = "logo: { " + ($logoEntries -join ", ") + " },"

  if ($content -match "brand:\s*{") {
    if ($content -match "logo\s*:") {
      $content = [regex]::Replace($content, "logo\s*:\s*{[^}]*}", "logo: { " + ($logoEntries -join ", ") + " }")
    } else {
      $content = [regex]::Replace($content, "(brand:\s*{)", "`$1`n    $logoBlock")
    }
    Set-Content -Path $Path -Value $content
  }
}

function Copy-Asset {
  param(
    [string]$Source,
    [string]$Destination
  )
  if ([string]::IsNullOrWhiteSpace($Source)) { return }
  if (-not (Test-Path -Path $Source)) { return }
  Ensure-Directory (Split-Path -Path $Destination)
  Copy-Item -Path $Source -Destination $Destination -Force
}

Write-Host "Template bootstrap" -ForegroundColor Cyan
Write-Host ""

$targetInput = Read-Host "Target directory (blank = edit in place)"
$targetRoot = Resolve-TargetRoot $targetInput

if ($targetRoot -ne $SourceRoot) {
  Write-Host "Copying template to $targetRoot..." -ForegroundColor Cyan
  Copy-Template -From $SourceRoot -To $targetRoot
}

$sitePath = Join-Path $targetRoot "src\data\site.ts"
$templates = @("agency", "saas", "consulting", "trades", "retail", "fintech")
$templateChoice = Read-Input "Template ($($templates -join ", "))" "retail"
if ($templates -contains $templateChoice) {
  $templateFile = Join-Path $targetRoot ("src\data\site.{0}.ts" -f $templateChoice)
  if (Test-Path -Path $templateFile) {
    Copy-Item -Path $templateFile -Destination $sitePath -Force
  }
}

$themePresets = @{
  "vendorhub" = "vendorHubTheme"
  "rixian" = "rixianTheme"
  "pearl" = "pearlBakeryTheme"
  "incursa" = "incursaTheme"
  "trades" = "tradesTheme"
  "medical" = "medicalTheme"
  "law" = "lawFirmTheme"
  "studio" = "studioTheme"
}
$themeChoice = Read-Input "Theme preset (vendorhub, rixian, pearl, incursa, trades, medical, law, studio)" "pearl"
if ($themePresets.ContainsKey($themeChoice)) {
  $themeImport = $themePresets[$themeChoice]
  $content = Get-Content -Path $sitePath -Raw
  if ($content -notmatch "from ""\./themes""") {
    $content = $content -replace "import type {([^}]+)} from ""../templates/types"";", "import type {`$1} from ""../templates/types"";`nimport { $themeImport } from ""./themes"";"
  } else {
    if ($content -notmatch $themeImport) {
      $content = $content -replace "import {([^}]+)} from ""\./themes"";", "import { `$1, $themeImport } from ""./themes"";"
    }
  }
  $content = [regex]::Replace($content, "theme:\s*[^,]+,", "theme: $themeImport,")
  Set-Content -Path $sitePath -Value $content
}

Write-Host ""
Write-Host "Business info (blank keeps placeholders)" -ForegroundColor Cyan
$businessName = Read-Host "Business name"
$tagline = Read-Host "Tagline"
$description = Read-Host "Short description"
$phone = Read-Host "Phone"
$email = Read-Host "Email"
$addressLine = Read-Host "Address line"
$cityStateZip = Read-Host "City, State ZIP"
$serviceArea = Read-Host "Service area"
$hoursText = Read-Host "Hours (comma-separated)"

Update-TextProperty -Path $sitePath -Key "businessName" -Value $businessName
Update-TextProperty -Path $sitePath -Key "tagline" -Value $tagline
Update-TextProperty -Path $sitePath -Key "shortDescription" -Value $description
Update-TextProperty -Path $sitePath -Key "phone" -Value $phone
Update-TextProperty -Path $sitePath -Key "email" -Value $email
Update-TextProperty -Path $sitePath -Key "addressLine" -Value $addressLine
Update-TextProperty -Path $sitePath -Key "cityStateZip" -Value $cityStateZip
Update-TextProperty -Path $sitePath -Key "serviceArea" -Value $serviceArea
if (-not [string]::IsNullOrWhiteSpace($hoursText)) {
  $hoursArray = $hoursText.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
  Update-ArrayProperty -Path $sitePath -Key "hoursText" -Values $hoursArray
}

Write-Host ""
Write-Host "Brand assets (optional)" -ForegroundColor Cyan
$logoLight = Read-Host "Path to light logo (optional)"
$logoDark = Read-Host "Path to dark logo (optional)"
$logoIcon = Read-Host "Path to icon logo (optional)"
$faviconIco = Read-Host "Path to favicon.ico (optional)"
$faviconSvg = Read-Host "Path to favicon.svg (optional)"
$appleTouch = Read-Host "Path to apple-touch-icon.png (optional)"

$brandDir = Join-Path $targetRoot "public\images\brand"
$lightExt = if ($logoLight) { [IO.Path]::GetExtension($logoLight) } else { "" }
$darkExt = if ($logoDark) { [IO.Path]::GetExtension($logoDark) } else { "" }
$iconExt = if ($logoIcon) { [IO.Path]::GetExtension($logoIcon) } else { "" }

$lightName = if ($logoLight) { "logo-light$lightExt" } else { "" }
$darkName = if ($logoDark) { "logo-dark$darkExt" } else { "" }
$iconName = if ($logoIcon) { "logo-icon$iconExt" } else { "" }

Copy-Asset -Source $logoLight -Destination (Join-Path $brandDir $lightName)
Copy-Asset -Source $logoDark -Destination (Join-Path $brandDir $darkName)
Copy-Asset -Source $logoIcon -Destination (Join-Path $brandDir $iconName)

$lightPath = if ($logoLight) { "/images/brand/$lightName" } else { "" }
$darkPath = if ($logoDark) { "/images/brand/$darkName" } else { "" }
$iconPath = if ($logoIcon) { "/images/brand/$iconName" } else { "" }
Ensure-BrandLogo -Path $sitePath -Light $lightPath -Dark $darkPath -Icon $iconPath

Copy-Asset -Source $faviconIco -Destination (Join-Path $targetRoot "public\favicon.ico")
Copy-Asset -Source $faviconSvg -Destination (Join-Path $targetRoot "public\favicon.svg")
Copy-Asset -Source $appleTouch -Destination (Join-Path $targetRoot "public\apple-touch-icon.png")

Write-Host ""
Write-Host "Bootstrap complete." -ForegroundColor Green
Write-Host "Site root: $targetRoot"
