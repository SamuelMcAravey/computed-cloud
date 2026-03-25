param(
  [string[]]$Paths = @(
    "src/content/blog",
    "notes",
    ".codex/skills",
    "AGENTS.md"
  ),
  [string[]]$Extensions = @(".md", ".mdx", ".yml", ".yaml")
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

function Normalize-AsciiPunctuation {
  param([string]$Text)

  # Replace common non-ASCII punctuation with ASCII equivalents.
  # Use direct char replacement to avoid regex edge cases.
  $Text = $Text.Replace([char]0x2018, "'").Replace([char]0x2019, "'")
  $Text = $Text.Replace([char]0x201C, '"').Replace([char]0x201D, '"')
  $Text = $Text.Replace([char]0x2013, "-").Replace([char]0x2014, "-")
  $Text = $Text.Replace([string][char]0x2026, "...")
  $Text = $Text.Replace([string][char]0x2192, "->")
  $Text
}

$targets = Get-TargetFiles -TargetPaths $Paths -Exts $Extensions

foreach ($file in $targets) {
  $text = Get-Content -LiteralPath $file.FullName -Raw
  $normalized = Normalize-AsciiPunctuation -Text $text

  if ($normalized -ne $text) {
    # Keep encoding stable and content-only changes.
    Set-Content -LiteralPath $file.FullName -Value $normalized -NoNewline -Encoding UTF8
  }
}
