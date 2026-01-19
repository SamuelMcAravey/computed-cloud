$ErrorActionPreference = "Stop"

param(
  [string]$Path = "src/content/blog"
)

$imagePattern = '!\[(?<alt>[^\]]*)\]\((?<url>[^)\s]+)(?:\s+"(?<title>[^"]*)")?\)'
$missing = New-Object System.Collections.Generic.List[string]
$files = Get-ChildItem -Path $Path -Filter "*.md" -Recurse

foreach ($file in $files) {
  $lines = Get-Content -Path $file.FullName
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line -notmatch "!\[") { continue }
    $matches = [regex]::Matches($line, $imagePattern)
    foreach ($match in $matches) {
      $alt = $match.Groups["alt"].Value
      $title = $match.Groups["title"].Value
      if ([string]::IsNullOrWhiteSpace($alt)) {
        $missing.Add("$($file.FullName):$($i + 1) missing alt text")
      }
      if ([string]::IsNullOrWhiteSpace($title)) {
        $missing.Add("$($file.FullName):$($i + 1) missing image caption (title)")
      }
    }
  }
}

if ($missing.Count -gt 0) {
  Write-Host "Accessibility checks failed:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" }
  exit 1
}

Write-Host "Accessibility checks passed." -ForegroundColor Green
