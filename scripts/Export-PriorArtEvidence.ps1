[CmdletBinding()]
param(
  [Parameter()]
  [string[]]$Roots = @(),

  [Parameter()]
  [string]$OutJson = "src/data/prior-art.evidence.generated.json",

  [Parameter()]
  [string]$OutMarkdown = "src/data/prior-art.evidence.generated.md",

  [Parameter()]
  [string]$ConfigFile,

  [Parameter()]
  [switch]$Recurse,

  [Parameter()]
  [switch]$UseGhCli
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-FullPath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [switch]$AllowMissing
  )

  if ([string]::IsNullOrWhiteSpace($Path)) {
    throw "Path value is required."
  }

  if (Test-Path -LiteralPath $Path) {
    return (Resolve-Path -LiteralPath $Path).Path
  }

  if ($AllowMissing) {
    if ([System.IO.Path]::IsPathRooted($Path)) {
      return [System.IO.Path]::GetFullPath($Path)
    }

    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Path))
  }

  throw "Path not found: $Path"
}

function Ensure-ParentDirectory {
  param([Parameter(Mandatory = $true)][string]$Path)

  $parent = Split-Path -Parent $Path
  if (-not [string]::IsNullOrWhiteSpace($parent) -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }
}

function Get-OptionalPropertyValue {
  param(
    [Parameter(Mandatory = $true)][object]$Object,
    [Parameter(Mandatory = $true)][string]$Name
  )

  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property) {
    return $null
  }

  return $property.Value
}

function Get-InputValue {
  param(
    [AllowNull()][object]$InputObject,
    [Parameter(Mandatory = $true)][string]$Name
  )

  if ($null -eq $InputObject) {
    return $null
  }

  if ($InputObject -is [System.Collections.IDictionary]) {
    if ($InputObject.Contains($Name)) {
      return $InputObject[$Name]
    }

    return $null
  }

  return Get-OptionalPropertyValue -Object $InputObject -Name $Name
}

function Convert-ToArray {
  param([AllowNull()][object]$Value)

  if ($null -eq $Value) {
    return @()
  }

  if ($Value -is [System.Collections.IDictionary]) {
    return @($Value)
  }

  if ($Value -is [System.Collections.IEnumerable] -and -not ($Value -is [string])) {
    return @(
      $Value | Where-Object {
        $null -ne $_ -and (
          ($_ -is [string] -and -not [string]::IsNullOrWhiteSpace($_)) -or
          ($_ -isnot [string])
        )
      }
    )
  }

  if ($Value -is [string] -and [string]::IsNullOrWhiteSpace($Value)) {
    return @()
  }

  return @($Value)
}

function Sanitize-RemoteUrl {
  param([AllowNull()][string]$Url)

  if ([string]::IsNullOrWhiteSpace($Url)) {
    return $null
  }

  try {
    $uri = [Uri]$Url
    if ($uri.IsAbsoluteUri) {
      $builder = [System.UriBuilder]::new($uri)
      $builder.UserName = ""
      $builder.Password = ""
      return $builder.Uri.AbsoluteUri.TrimEnd("/")
    }
  } catch {
    # Fall through to the raw string when the remote is not a standard URI.
  }

  if ($Url -match "^(?<scheme>https?://)(?<userinfo>[^@/]+@)(?<rest>.+)$") {
    return "$($Matches.scheme)$($Matches.rest)"
  }

  return $Url
}

function Read-ConfigData {
  param([string]$Path)

  if ([string]::IsNullOrWhiteSpace($Path)) {
    return [pscustomobject]@{
      roots = @()
      manualEntries = @()
    }
  }

  $resolved = Resolve-FullPath -Path $Path
  $raw = Get-Content -LiteralPath $resolved -Raw
  $config = $raw | ConvertFrom-Json -Depth 20
  $manualEntries = Get-OptionalPropertyValue -Object $config -Name "manualEntries"
  if ($null -eq $manualEntries) {
    $manualEntries = Get-OptionalPropertyValue -Object $config -Name "entries"
  }

  return [pscustomobject]@{
    roots = Convert-ToArray -Value (Get-OptionalPropertyValue -Object $config -Name "roots")
    manualEntries = Convert-ToArray -Value $manualEntries
  }
}

function Test-IsGitRepository {
  param([Parameter(Mandatory = $true)][string]$Path)

  return Test-Path -LiteralPath (Join-Path $Path ".git")
}

function Get-GitRepositoryPaths {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root,
    [switch]$IncludeDescendants
  )

  $paths = @{}

  if (Test-IsGitRepository -Path $Root) {
    $paths[$Root] = $true
  }

  if (-not $IncludeDescendants) {
    foreach ($directory in Get-ChildItem -LiteralPath $Root -Directory -Force -ErrorAction SilentlyContinue) {
      if (Test-IsGitRepository -Path $directory.FullName) {
        $paths[$directory.FullName] = $true
      }
    }

    return @($paths.Keys) | Sort-Object
  }

  $gitDirectories = Get-ChildItem -LiteralPath $Root -Directory -Force -Recurse -Filter ".git" -ErrorAction SilentlyContinue |
    Where-Object {
      $_.FullName -notmatch "[\\/](node_modules|dist|\.astro|\.wrangler)[\\/]"
    }

  foreach ($gitDirectory in $gitDirectories) {
    $paths[(Split-Path -Parent $gitDirectory.FullName)] = $true
  }

  return @($paths.Keys) | Sort-Object
}

function Invoke-GitCapture {
  param(
    [Parameter(Mandatory = $true)][string]$RepositoryPath,
    [Parameter(Mandatory = $true)][string[]]$Arguments
  )

  $tempFile = [System.IO.Path]::GetTempFileName()
  try {
    $output = & git -C $RepositoryPath @Arguments 2> $tempFile
    $exitCode = $LASTEXITCODE
    $errorText = ""
    if (Test-Path -LiteralPath $tempFile) {
      $rawError = Get-Content -LiteralPath $tempFile -Raw -ErrorAction SilentlyContinue
      if ($null -ne $rawError) {
        $errorText = $rawError.Trim()
      }
    }

    $normalizedOutput = if ($null -eq $output) {
      @()
    } else {
      @($output | Where-Object {
        $null -ne $_ -and -not [string]::IsNullOrWhiteSpace([string]$_)
      })
    }

    return [pscustomobject]@{
      Success = ($exitCode -eq 0)
      Output = [string[]]$normalizedOutput
      Error = $errorText
    }
  } finally {
    Remove-Item -LiteralPath $tempFile -ErrorAction SilentlyContinue
  }
}

function Get-FirstOutputLine {
  param([pscustomobject]$Result)

  if ($null -eq $Result -or -not $Result.Success) {
    return $null
  }

  $output = @($Result.Output)
  $line = $output | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) } | Select-Object -First 1
  if ($null -eq $line) {
    return $null
  }

  return ([string]$line).Trim()
}

function Get-RemoteUrls {
  param([Parameter(Mandatory = $true)][string]$RepositoryPath)

  $remotes = Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments @("remote")
  if (-not $remotes.Success) {
    return @()
  }

  $results = @()
  foreach ($remoteName in $remotes.Output) {
    if ([string]::IsNullOrWhiteSpace($remoteName)) {
      continue
    }

    $trimmedRemoteName = $remoteName.Trim()
    $urlResult = Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments @("config", "--get", ("remote.{0}.url" -f $trimmedRemoteName))
    $url = Sanitize-RemoteUrl -Url (Get-FirstOutputLine -Result $urlResult)
    if ($url) {
      $results += [pscustomobject]@{
        name = $trimmedRemoteName
        url = $url
      }
    }
  }

  return $results
}

function Get-GithubRepoSlug {
  param([string]$RemoteUrl)

  if ([string]::IsNullOrWhiteSpace($RemoteUrl)) {
    return $null
  }

  if ($RemoteUrl -match "github\.com[:/](?<owner>[^/]+)/(?<repo>[^/.]+)(\.git)?$") {
    return "{0}/{1}" -f $Matches.owner, $Matches.repo
  }

  return $null
}

function Get-RepoVisibility {
  param(
    [AllowNull()][object[]]$RemoteUrls,
    [switch]$AllowGhCli
  )

  if (-not $AllowGhCli) {
    return $null
  }

  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    return $null
  }

  if ($null -eq $RemoteUrls -or $RemoteUrls.Count -eq 0) {
    return $null
  }

  foreach ($remote in $RemoteUrls) {
    $slug = Get-GithubRepoSlug -RemoteUrl $remote.url
    if (-not $slug) {
      continue
    }

    $tempFile = [System.IO.Path]::GetTempFileName()
    try {
      $json = & gh repo view $slug --json visibility 2> $tempFile
      if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace(($json -join ""))) {
        continue
      }

      $data = ($json -join [Environment]::NewLine) | ConvertFrom-Json
      if ($data.visibility) {
        return $data.visibility
      }
    } catch {
      continue
    } finally {
      Remove-Item -LiteralPath $tempFile -ErrorAction SilentlyContinue
    }
  }

  return $null
}

function Get-ReadmeMetadata {
  param([Parameter(Mandatory = $true)][string]$RepositoryPath)

  $readme = Get-ChildItem -LiteralPath $RepositoryPath -File -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "^README(\.[^.]+)?$" } |
    Sort-Object Name |
    Select-Object -First 1

  if (-not $readme) {
    return [pscustomobject]@{
      title = $null
      preview = $null
    }
  }

  $lines = Get-Content -LiteralPath $readme.FullName -ErrorAction SilentlyContinue
  $title = $null
  $preview = $null
  $paragraphBuffer = New-Object System.Collections.Generic.List[string]

  foreach ($line in $lines) {
    $trimmed = $line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
      if (-not $preview -and $paragraphBuffer.Count -gt 0) {
        $preview = ($paragraphBuffer -join " ").Trim()
        break
      }
      continue
    }

    if (-not $title -and $trimmed.StartsWith("#")) {
      $title = $trimmed.TrimStart("#").Trim()
      continue
    }

    if ($trimmed.StartsWith("#")) {
      continue
    }

    if (-not $preview) {
      $paragraphBuffer.Add($trimmed)
    }
  }

  if (-not $preview -and $paragraphBuffer.Count -gt 0) {
    $preview = ($paragraphBuffer -join " ").Trim()
  }

  return [pscustomobject]@{
    title = $title
    preview = $preview
  }
}

function Get-RepositoryEvidence {
  param(
    [Parameter(Mandatory = $true)][string]$RepositoryPath,
    [switch]$AllowGhCli
  )

  $repoName = Split-Path -Leaf $RepositoryPath
  $remoteUrls = Get-RemoteUrls -RepositoryPath $RepositoryPath
  $defaultBranchResult = Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments @("symbolic-ref", "--short", "refs/remotes/origin/HEAD")
  $defaultBranch = Get-FirstOutputLine -Result $defaultBranchResult
  if ($defaultBranch -and $defaultBranch.Contains("/")) {
    $defaultBranch = ($defaultBranch -split "/", 2)[1]
  }

  $earliestCommit = Get-FirstOutputLine -Result (
    Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments @("log", "--all", "--reverse", "--format=%H|%cI", "--max-count=1")
  )
  $latestCommit = Get-FirstOutputLine -Result (
    Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments @("log", "--all", "-1", "--format=%H|%cI")
  )
  $headCommit = Get-FirstOutputLine -Result (
    Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments @("show", "-s", "--format=%H|%cI", "HEAD")
  )
  $currentBranch = Get-FirstOutputLine -Result (
    Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments @("branch", "--show-current")
  )
  if ([string]::IsNullOrWhiteSpace($defaultBranch)) {
    $defaultBranch = $currentBranch
  }
  $dirty = Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments @("status", "--porcelain")
  $readme = Get-ReadmeMetadata -RepositoryPath $RepositoryPath
  $visibility = Get-RepoVisibility -RemoteUrls $remoteUrls -AllowGhCli:$AllowGhCli

  $earliestCommitHash = $null
  $earliestCommitDate = $null
  if ($earliestCommit -and $earliestCommit.Contains("|")) {
    $parts = $earliestCommit -split "\|", 2
    $earliestCommitHash = $parts[0]
    $earliestCommitDate = $parts[1]
  }

  $latestCommitHash = $null
  $latestCommitDate = $null
  if ($latestCommit -and $latestCommit.Contains("|")) {
    $parts = $latestCommit -split "\|", 2
    $latestCommitHash = $parts[0]
    $latestCommitDate = $parts[1]
  }

  $headHash = $null
  $headDate = $null
  if ($headCommit -and $headCommit.Contains("|")) {
    $parts = $headCommit -split "\|", 2
    $headHash = $parts[0]
    $headDate = $parts[1]
  }

  return [pscustomobject]@{
    entryType = "git-repo"
    title = $readme.title
    name = $repoName
    localName = $repoName
    path = $RepositoryPath
    localPath = $RepositoryPath
    remoteUrls = @($remoteUrls | ForEach-Object {
      [ordered]@{
        name = $_.name
        url = $_.url
      }
    })
    defaultBranch = $defaultBranch
    earliestCommitDate = $earliestCommitDate
    earliestCommitHash = $earliestCommitHash
    latestCommitDate = $latestCommitDate
    latestCommitHash = $latestCommitHash
    headCommit = $headHash
    headCommitDate = $headDate
    currentBranch = $currentBranch
    hasUncommittedChanges = [bool]($dirty.Success -and (@($dirty.Output) | Measure-Object).Count -gt 0)
    readmeTitle = $readme.title
    readmePreview = $readme.preview
    repoVisibility = $visibility
    sortDate = $earliestCommitDate
  }
}

function Normalize-ManualEntry {
  param([Parameter(Mandatory = $true)][pscustomobject]$Entry)

  $title = Get-OptionalPropertyValue -Object $Entry -Name "title"
  if ([string]::IsNullOrWhiteSpace([string]$title)) {
    $title = Get-OptionalPropertyValue -Object $Entry -Name "name"
  }

  $localName = Get-OptionalPropertyValue -Object $Entry -Name "localName"
  if ([string]::IsNullOrWhiteSpace([string]$localName)) {
    $localName = $title
  }

  $localPath = Get-OptionalPropertyValue -Object $Entry -Name "localPath"
  if ([string]::IsNullOrWhiteSpace([string]$localPath)) {
    $localPath = Get-OptionalPropertyValue -Object $Entry -Name "path"
  }

  $started = Get-OptionalPropertyValue -Object $Entry -Name "started"
  $ended = Get-OptionalPropertyValue -Object $Entry -Name "ended"
  $sortDate = Get-OptionalPropertyValue -Object $Entry -Name "sortDate"
  if ([string]::IsNullOrWhiteSpace([string]$sortDate)) {
    $sortDate = if ($started) { $started } elseif ($ended) { $ended } else { $null }
  }

  $publicLinks = Get-OptionalPropertyValue -Object $Entry -Name "publicLinks"
  if ($null -eq $publicLinks) {
    $publicLinks = Get-OptionalPropertyValue -Object $Entry -Name "links"
  }

  $evidence = Get-OptionalPropertyValue -Object $Entry -Name "evidence"
  if ($null -eq $evidence) {
    $evidence = Get-OptionalPropertyValue -Object $Entry -Name "evidenceLinks"
  }
  if ($null -eq $evidence) {
    $evidence = Get-OptionalPropertyValue -Object $Entry -Name "evidencePublic"
  }

  return [pscustomobject]@{
    entryType = "manual"
    title = if ($title) { $title } else { $localName }
    name = if ($title) { $title } else { $localName }
    localName = $localName
    path = $localPath
    localPath = $localPath
    kind = Get-OptionalPropertyValue -Object $Entry -Name "kind"
    status = Get-OptionalPropertyValue -Object $Entry -Name "status"
    visibility = Get-OptionalPropertyValue -Object $Entry -Name "visibility"
    ownerLabel = Get-OptionalPropertyValue -Object $Entry -Name "ownerLabel"
    started = $started
    startedPrecision = Get-OptionalPropertyValue -Object $Entry -Name "startedPrecision"
    ended = $ended
    endedPrecision = Get-OptionalPropertyValue -Object $Entry -Name "endedPrecision"
    publicSummary = Get-OptionalPropertyValue -Object $Entry -Name "publicSummary"
    summary = Get-OptionalPropertyValue -Object $Entry -Name "summary"
    notesPublic = Get-OptionalPropertyValue -Object $Entry -Name "notesPublic"
    notes = Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Entry -Name "notes")
    tags = Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Entry -Name "tags")
    domains = Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Entry -Name "domains")
    publicLinks = Convert-ToArray -Value $publicLinks
    evidence = Convert-ToArray -Value $evidence
    relatedIds = Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Entry -Name "relatedIds")
    group = Get-OptionalPropertyValue -Object $Entry -Name "group"
    urls = Convert-ToArray -Value $publicLinks
    sortDate = $sortDate
  }
}

function Format-MarkdownValue {
  param([AllowNull()][object]$Value)

  if ($null -eq $Value -or [string]::IsNullOrWhiteSpace([string]$Value)) {
    return "n/a"
  }

  return [string]$Value
}

function Write-MarkdownSummary {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string[]]$ResolvedRoots,
    [Parameter(Mandatory = $true)][object[]]$Entries,
    [Parameter(Mandatory = $true)][string]$GeneratedAt
  )

  $lines = New-Object System.Collections.Generic.List[string]
  $lines.Add("# Prior Art Evidence Snapshot")
  $lines.Add("")
  $lines.Add(("Generated: {0}" -f $GeneratedAt))
  $lines.Add("")
  $lines.Add("## Roots")
  $lines.Add("")

  foreach ($root in $ResolvedRoots) {
    $lines.Add(("- {0}" -f $root))
  }

  $lines.Add("")
  $lines.Add("## Entries")
  $lines.Add("")

  foreach ($entry in $Entries) {
    $displayName = Get-InputValue -InputObject $entry -Name "title"
    if ([string]::IsNullOrWhiteSpace([string]$displayName)) {
      $displayName = Get-InputValue -InputObject $entry -Name "name"
    }
    if ([string]::IsNullOrWhiteSpace([string]$displayName)) {
      $displayName = Get-InputValue -InputObject $entry -Name "localName"
    }
    if ([string]::IsNullOrWhiteSpace([string]$displayName)) {
      $displayName = "Unnamed entry"
    }

    $entryType = Get-InputValue -InputObject $entry -Name "entryType"
    $localPath = Get-InputValue -InputObject $entry -Name "localPath"
    if ([string]::IsNullOrWhiteSpace([string]$localPath)) {
      $localPath = Get-InputValue -InputObject $entry -Name "path"
    }

    $sortDate = Get-InputValue -InputObject $entry -Name "sortDate"
    $kind = Get-InputValue -InputObject $entry -Name "kind"
    $status = Get-InputValue -InputObject $entry -Name "status"
    $visibility = Get-InputValue -InputObject $entry -Name "visibility"
    $ownerLabel = Get-InputValue -InputObject $entry -Name "ownerLabel"
    $group = Get-InputValue -InputObject $entry -Name "group"
    $started = Get-InputValue -InputObject $entry -Name "started"
    $startedPrecision = Get-InputValue -InputObject $entry -Name "startedPrecision"
    $ended = Get-InputValue -InputObject $entry -Name "ended"
    $endedPrecision = Get-InputValue -InputObject $entry -Name "endedPrecision"
    $summary = Get-InputValue -InputObject $entry -Name "publicSummary"
    if ([string]::IsNullOrWhiteSpace([string]$summary)) {
      $summary = Get-InputValue -InputObject $entry -Name "summary"
    }
    $notesPublic = Get-InputValue -InputObject $entry -Name "notesPublic"
    $notes = @(Convert-ToArray -Value (Get-InputValue -InputObject $entry -Name "notes"))
    $tags = @(Convert-ToArray -Value (Get-InputValue -InputObject $entry -Name "tags"))
    $domains = @(Convert-ToArray -Value (Get-InputValue -InputObject $entry -Name "domains"))
    $publicLinks = @(Convert-ToArray -Value (Get-InputValue -InputObject $entry -Name "publicLinks"))
    $evidence = @(Convert-ToArray -Value (Get-InputValue -InputObject $entry -Name "evidence"))
    $relatedIds = @(Convert-ToArray -Value (Get-InputValue -InputObject $entry -Name "relatedIds"))
    $remoteUrls = @(Convert-ToArray -Value (Get-InputValue -InputObject $entry -Name "remoteUrls"))
    $readmeTitle = Get-InputValue -InputObject $entry -Name "readmeTitle"
    $readmePreview = Get-InputValue -InputObject $entry -Name "readmePreview"
    $defaultBranch = Get-InputValue -InputObject $entry -Name "defaultBranch"
    $currentBranch = Get-InputValue -InputObject $entry -Name "currentBranch"
    $headCommit = Get-InputValue -InputObject $entry -Name "headCommit"
    $headCommitDate = Get-InputValue -InputObject $entry -Name "headCommitDate"
    $earliestCommitDate = Get-InputValue -InputObject $entry -Name "earliestCommitDate"
    $earliestCommitHash = Get-InputValue -InputObject $entry -Name "earliestCommitHash"
    $latestCommitDate = Get-InputValue -InputObject $entry -Name "latestCommitDate"
    $latestCommitHash = Get-InputValue -InputObject $entry -Name "latestCommitHash"
    $repoVisibility = Get-InputValue -InputObject $entry -Name "repoVisibility"
    $hasUncommittedChanges = Get-InputValue -InputObject $entry -Name "hasUncommittedChanges"

    $lines.Add(("### {0}" -f (Format-MarkdownValue -Value $displayName)))
    $lines.Add("")
    $lines.Add(("- Type: {0}" -f (Format-MarkdownValue -Value $entryType)))
    $lines.Add(("- Local path: {0}" -f (Format-MarkdownValue -Value $localPath)))
    $lines.Add(("- Sort date: {0}" -f (Format-MarkdownValue -Value $sortDate)))

    if ($kind) {
      $lines.Add(("- Kind: {0}" -f (Format-MarkdownValue -Value $kind)))
    }

    if ($status) {
      $lines.Add(("- Status: {0}" -f (Format-MarkdownValue -Value $status)))
    }

    if ($visibility) {
      $lines.Add(("- Visibility: {0}" -f (Format-MarkdownValue -Value $visibility)))
    }

    if ($ownerLabel) {
      $lines.Add(("- Owner label: {0}" -f (Format-MarkdownValue -Value $ownerLabel)))
    }

    if ($group) {
      $lines.Add(("- Group: {0}" -f (Format-MarkdownValue -Value $group)))
    }

    if ($started) {
      $lines.Add(("- Started: {0}" -f (Format-MarkdownValue -Value $started)))
    }

    if ($startedPrecision) {
      $lines.Add(("- Started precision: {0}" -f (Format-MarkdownValue -Value $startedPrecision)))
    }

    if ($ended) {
      $lines.Add(("- Ended: {0}" -f (Format-MarkdownValue -Value $ended)))
    }

    if ($endedPrecision) {
      $lines.Add(("- Ended precision: {0}" -f (Format-MarkdownValue -Value $endedPrecision)))
    }

    if ($summary) {
      $lines.Add(("- Summary: {0}" -f (Format-MarkdownValue -Value $summary)))
    }

    if ($notesPublic) {
      $lines.Add(("- Notes public: {0}" -f (Format-MarkdownValue -Value $notesPublic)))
    }

    if ($entryType -eq "git-repo") {
      $lines.Add(("- Default branch: {0}" -f (Format-MarkdownValue -Value $defaultBranch)))
      $lines.Add(("- Current branch: {0}" -f (Format-MarkdownValue -Value $currentBranch)))
      $lines.Add(("- HEAD commit: {0}" -f (Format-MarkdownValue -Value $headCommit)))
      if ($headCommitDate) {
        $lines.Add(("- HEAD commit date: {0}" -f (Format-MarkdownValue -Value $headCommitDate)))
      }
      $lines.Add("- Earliest commit: $(Format-MarkdownValue -Value $earliestCommitDate) ($(Format-MarkdownValue -Value $earliestCommitHash))")
      $lines.Add("- Latest commit: $(Format-MarkdownValue -Value $latestCommitDate) ($(Format-MarkdownValue -Value $latestCommitHash))")
      $lines.Add(("- Uncommitted changes: {0}" -f $hasUncommittedChanges))
      $lines.Add(("- README title: {0}" -f (Format-MarkdownValue -Value $readmeTitle)))
      $lines.Add(("- README preview: {0}" -f (Format-MarkdownValue -Value $readmePreview)))
      $lines.Add(("- Repo visibility: {0}" -f (Format-MarkdownValue -Value $repoVisibility)))
    }

    if (@($notes).Count -gt 0) {
      $lines.Add("- Notes:")
      foreach ($note in @($notes)) {
        $lines.Add(("  - {0}" -f $note))
      }
    }

    if (@($tags).Count -gt 0) {
      $lines.Add("- Tags:")
      foreach ($tag in @($tags)) {
        $lines.Add(("  - {0}" -f $tag))
      }
    }

    if (@($domains).Count -gt 0) {
      $lines.Add("- Domains:")
      foreach ($domain in @($domains)) {
        $lines.Add(("  - {0}" -f $domain))
      }
    }

    if (@($publicLinks).Count -gt 0) {
      $lines.Add("- Public links:")
      foreach ($link in @($publicLinks)) {
        $label = Get-InputValue -InputObject $link -Name "label"
        $url = Get-InputValue -InputObject $link -Name "url"
        $linkType = Get-InputValue -InputObject $link -Name "type"
        $note = Get-InputValue -InputObject $link -Name "note"

        if ([string]::IsNullOrWhiteSpace([string]$label)) {
          $label = $url
        }

        $suffix = @()
        if ($linkType) {
          $suffix += "type=$linkType"
        }
        if ($note) {
          $suffix += $note
        }

        if (@($suffix).Count -gt 0) {
          $lines.Add(("  - {0}: {1} ({2})" -f (Format-MarkdownValue -Value $label), (Format-MarkdownValue -Value $url), ($suffix -join "; ")))
        }
        else {
          $lines.Add(("  - {0}: {1}" -f (Format-MarkdownValue -Value $label), (Format-MarkdownValue -Value $url)))
        }
      }
    }

    if (@($evidence).Count -gt 0) {
      $lines.Add("- Evidence links:")
      foreach ($link in @($evidence)) {
        $label = Get-InputValue -InputObject $link -Name "label"
        $url = Get-InputValue -InputObject $link -Name "url"
        $linkType = Get-InputValue -InputObject $link -Name "type"
        $note = Get-InputValue -InputObject $link -Name "note"

        if ([string]::IsNullOrWhiteSpace([string]$label)) {
          $label = $url
        }

        $suffix = @()
        if ($linkType) {
          $suffix += "type=$linkType"
        }
        if ($note) {
          $suffix += $note
        }

        if (@($suffix).Count -gt 0) {
          $lines.Add(("  - {0}: {1} ({2})" -f (Format-MarkdownValue -Value $label), (Format-MarkdownValue -Value $url), ($suffix -join "; ")))
        }
        else {
          $lines.Add(("  - {0}: {1}" -f (Format-MarkdownValue -Value $label), (Format-MarkdownValue -Value $url)))
        }
      }
    }

    if (@($relatedIds).Count -gt 0) {
      $lines.Add("- Related items:")
      foreach ($relatedId in @($relatedIds)) {
        $lines.Add(("  - {0}" -f $relatedId))
      }
    }

    if ($entryType -eq "git-repo" -and @($remoteUrls).Count -gt 0) {
      $lines.Add("- Remotes:")
      foreach ($remote in @($remoteUrls)) {
        $lines.Add(("  - {0}: {1}" -f $remote.name, $remote.url))
      }
    }

    $lines.Add("")
  }

  Set-Content -LiteralPath $Path -Value $lines -Encoding utf8
}

$config = Read-ConfigData -Path $ConfigFile
$resolvedRoots = New-Object System.Collections.Generic.List[string]

foreach ($root in @($Roots) + @($config.roots)) {
  if ([string]::IsNullOrWhiteSpace([string]$root)) {
    continue
  }

  $resolvedRoot = Resolve-FullPath -Path ([string]$root)
  if (-not $resolvedRoots.Contains($resolvedRoot)) {
    $resolvedRoots.Add($resolvedRoot)
  }
}

if ($resolvedRoots.Count -eq 0) {
  $resolvedRoots.Add((Get-Location).Path)
}

$repoPaths = @{}
foreach ($resolvedRoot in $resolvedRoots) {
  foreach ($repoPath in Get-GitRepositoryPaths -Root $resolvedRoot -IncludeDescendants:$Recurse) {
    $repoPaths[$repoPath] = $true
  }
}

$entries = New-Object System.Collections.Generic.List[object]

foreach ($repoPath in (@($repoPaths.Keys) | Sort-Object)) {
  $entries.Add((Get-RepositoryEvidence -RepositoryPath $repoPath -AllowGhCli:$UseGhCli))
}

foreach ($manualEntry in (Convert-ToArray -Value $config.manualEntries)) {
  $entries.Add((Normalize-ManualEntry -Entry $manualEntry))
}

$sortedEntries = @($entries.ToArray()) | Sort-Object `
  @{ Expression = { if ($_.sortDate) { $_.sortDate } else { "9999-12-31T23:59:59Z" } } }, `
  @{ Expression = { $_.name } }

$generatedAt = [DateTimeOffset]::UtcNow.ToString("o")
$jsonPath = Resolve-FullPath -Path $OutJson -AllowMissing
$markdownPath = Resolve-FullPath -Path $OutMarkdown -AllowMissing

Ensure-ParentDirectory -Path $jsonPath
Ensure-ParentDirectory -Path $markdownPath

$document = [ordered]@{
  generatedAt = $generatedAt
  roots = @($resolvedRoots)
  recurse = [bool]$Recurse
  usedGhCli = [bool]$UseGhCli
  entries = @($sortedEntries)
}

$document | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $jsonPath -Encoding utf8
Write-MarkdownSummary -Path $markdownPath -ResolvedRoots @($resolvedRoots) -Entries $sortedEntries -GeneratedAt $generatedAt

Write-Host ("Wrote {0}" -f $jsonPath)
Write-Host ("Wrote {0}" -f $markdownPath)
