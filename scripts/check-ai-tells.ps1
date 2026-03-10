param(
  [string[]]$Paths = @(
    "src/content/blog"
  ),
  [string[]]$Extensions = @(".md", ".mdx"),
  [switch]$FailOnMatch
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

# Warning-only checks for common "AI writing tells".
# These are smell tests, not a classifier. Matches should trigger review, not auto-deletion.
$groups = @(
  @{
    Name = "AI vocab (watch list)"
    Pattern = "(?i)\b(additionally|align with|boasts|bolstered|crucial|delve|emphasizing|enduring|enhance|fostering|garner|highlight|interplay|intricate|meticulous|pivotal|showcase|tapestry|testament|underscore|valuable|vibrant)\b"
  },
  @{
    Name = "Inflated significance / puffery"
    Pattern = "(?i)\b(serves as|stands as|a testament to|pivotal moment|reflects broader|setting the stage|indelible mark|key turning point|evolving landscape)\b"
  },
  @{
    Name = "Promotional tone"
    Pattern = "(?i)\b(nestled|breathtaking|renowned|groundbreaking|in the heart of|diverse array|commitment to)\b"
  },
  @{
    Name = "Weasel wording"
    Pattern = "(?i)\b(industry reports|experts argue|observers (have )?cited|some critics argue|several sources|described in scholarship)\b"
  },
  @{
    Name = "Filler wrap-ups"
    Pattern = "(?i)\b(despite these challenges|future outlook|challenges and legacy|in conclusion|in summary|overall)\b"
  },
  @{
    Name = "Assistant chat phrasing"
    Pattern = "(?i)\b(i hope this helps|of course!|certainly!|you[' ]re absolutely right|would you like|let me know|is there anything else)\b"
  },
  @{
    Name = "Knowledge cutoff / source speculation"
    Pattern = "(?i)\b(as of my last|knowledge cutoff|based on available information|not widely documented|limited in (the )?(provided|available) (sources|search results)|may vary)\b"
  },
  @{
    Name = "Placeholders"
    Pattern = "(?i)(\[(ADD|TODO|TBD)\b|TODO\b|TBD\b|FIXME\b|INSERT_[A-Z0-9_]+|PASTE_[A-Z0-9_]+|20[0-9]{2}-XX-XX|XX-XX)"
  },
  @{
    Name = "Tool artifacts / tracking"
    Pattern = "(?i)\b(turn0(search|image|news|file)[0-9]+|oaicite|oai_citation|contentReference|attributableIndex|grok_card|attached_file)\b|utm_source=chatgpt\.com"
  }
)

$targets = Get-TargetFiles -TargetPaths $Paths -Exts $Extensions
$allMatches = @()

foreach ($file in $targets) {
  $lines = Get-Content -LiteralPath $file.FullName

  $inFence = $false
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    # Skip fenced code blocks (```lang ... ```). Most of these checks are about prose.
    if ($line -match '^\s*```') {
      $inFence = -not $inFence
      continue
    }
    if ($inFence) { continue }

    foreach ($g in $groups) {
      if ($line -match $g.Pattern) {
        $allMatches += [pscustomobject]@{
          Group = $g.Name
          File  = $file.FullName
          Line  = $i + 1
          Text  = $line.TrimEnd()
        }
      }
    }
  }
}

if ($allMatches.Count -eq 0) {
  Write-Host "OK: no AI-tell patterns found (warning-only check)."
  exit 0
}

Write-Host ("WARN: {0} potential AI-tell matches found (warning-only check)." -f $allMatches.Count)

$allMatches |
  Group-Object Group |
  Sort-Object Name |
  ForEach-Object {
    Write-Host ""
    Write-Host ("== {0} ==" -f $_.Name)
    $_.Group |
      Sort-Object File, Line |
      ForEach-Object {
        Write-Host ("{0}:{1}: {2}" -f $_.File, $_.Line, $_.Text)
      }
  }

if ($FailOnMatch) {
  exit 1
}

exit 0

