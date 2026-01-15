$files = Get-ChildItem -Path $PSScriptRoot -Filter *.md -File -Recurse

foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw
  $normalized = $text `
    -replace "[\u2018\u2019]", "'" `
    -replace "[\u201C\u201D]", '"' `
    -replace "[\u2014\u2013]", "-" `
    -replace "[‘’]", "'" `
    -replace "[“”]", '"' `
    -replace "[—–]", "-"

  if ($normalized -ne $text) {
    Set-Content -LiteralPath $file.FullName -Value $normalized -NoNewline -Encoding UTF8
  }
}
