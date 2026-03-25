$files = Get-ChildItem -Path $PSScriptRoot -Filter *.md -File -Recurse

foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw
  $normalized = $text
  $normalized = $normalized.Replace([char]0x2018, "'").Replace([char]0x2019, "'")
  $normalized = $normalized.Replace([char]0x201C, '"').Replace([char]0x201D, '"')
  $normalized = $normalized.Replace([char]0x2013, "-").Replace([char]0x2014, "-")
  $normalized = $normalized.Replace([string][char]0x2026, "...")
  $normalized = $normalized.Replace([string][char]0x2192, "->")

  if ($normalized -ne $text) {
    Set-Content -LiteralPath $file.FullName -Value $normalized -NoNewline -Encoding UTF8
  }
}
