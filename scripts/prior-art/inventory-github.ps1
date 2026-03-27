[CmdletBinding()]
param(
  [Parameter()]
  [string[]]$Roots = @(),

  [Parameter()]
  [string]$ConfigFile,

  [Parameter()]
  [switch]$Recurse,

  [Parameter()]
  [switch]$UseGhCli,

  [Parameter()]
  [string]$OutMaster = "artifacts/prior-art/master-prior-art.json",

  [Parameter()]
  [string]$OutPublic = "artifacts/prior-art/public-candidate-view.json",

  [Parameter()]
  [string]$OutPdf = "artifacts/prior-art/pdf-candidate-view.json",

  [Parameter()]
  [string]$OutSummary = "artifacts/prior-art/review-summary.md",

  [Parameter()]
  [string]$OutRepoCatalog = "src/data/prior-art.repositories.json"
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

function Write-JsonFile {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][object]$InputObject,
    [int]$Depth = 30
  )

  Ensure-ParentDirectory -Path $Path
  $json = $InputObject | ConvertTo-Json -Depth $Depth
  Set-Content -LiteralPath $Path -Value $json -Encoding utf8
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

function New-Slug {
  param([AllowNull()][string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return "unknown"
  }

  return ($Value.ToLowerInvariant() -replace "[^a-z0-9]+", "-").Trim("-")
}

function Get-OptionalPropertyValue {
  param(
    [AllowNull()][object]$Object,
    [Parameter(Mandatory = $true)][string]$Name
  )

  if ($null -eq $Object) {
    return $null
  }

  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property) {
    return $null
  }

  return $property.Value
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
      success = ($exitCode -eq 0)
      output = [string[]]$normalizedOutput
      error = $errorText
    }
  }
  finally {
    Remove-Item -LiteralPath $tempFile -ErrorAction SilentlyContinue
  }
}

function Get-FirstOutputLine {
  param([pscustomobject]$Result)

  if ($null -eq $Result -or -not $Result.success) {
    return $null
  }

  $line = @($Result.output) | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) } | Select-Object -First 1
  if ($null -eq $line) {
    return $null
  }

  return ([string]$line).Trim()
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
  }
  catch {
    # Fall through.
  }

  if ($Url -match "^(?<scheme>https?://)(?<userinfo>[^@/]+@)(?<rest>.+)$") {
    return "$($Matches.scheme)$($Matches.rest)"
  }

  return $Url
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

function Invoke-GhCommand {
  param([Parameter(Mandatory = $true)][string[]]$Arguments)

  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI (`gh`) is required but not installed."
  }

  $tempFile = [System.IO.Path]::GetTempFileName()
  try {
    $output = & gh @Arguments 2> $tempFile
    $exitCode = $LASTEXITCODE
    $errorText = ""
    if (Test-Path -LiteralPath $tempFile) {
      $rawError = Get-Content -LiteralPath $tempFile -Raw -ErrorAction SilentlyContinue
      if ($null -ne $rawError) {
        $errorText = $rawError.Trim()
      }
    }

    return [pscustomobject]@{
      success = ($exitCode -eq 0)
      output = @($output)
      error = $errorText
    }
  }
  finally {
    Remove-Item -LiteralPath $tempFile -ErrorAction SilentlyContinue
  }
}

function Invoke-GhJsonPaged {
  param(
    [Parameter(Mandatory = $true)][string]$Endpoint,
    [hashtable]$Query = @{},
    [switch]$ArrayResult
  )

  $allResults = New-Object System.Collections.Generic.List[object]
  $page = 1

  while ($true) {
    $args = @("api", "--method", "GET", $Endpoint, "-f", "per_page=100", "-f", "page=$page")
    foreach ($key in $Query.Keys) {
      $args += @("-f", ("{0}={1}" -f $key, $Query[$key]))
    }

    $result = Invoke-GhCommand -Arguments $args
    if (-not $result.success) {
      if ($ArrayResult) {
        return @()
      }

      throw "gh api failed for ${Endpoint}: $($result.error)"
    }

    $payload = ($result.output -join [Environment]::NewLine).Trim()
    if ([string]::IsNullOrWhiteSpace($payload)) {
      break
    }

    $parsed = $payload | ConvertFrom-Json -Depth 50
    $count = 0

    if ($ArrayResult) {
      $items = Convert-ToArray -Value $parsed
      $count = @($items).Count
      foreach ($item in $items) {
        $allResults.Add($item)
      }
    }
    else {
      $allResults.Add($parsed)
      $count = 1
    }

    if ($count -lt 100) {
      break
    }

    $page += 1
  }

  if ($ArrayResult) {
    return @($allResults.ToArray())
  }

  if ($allResults.Count -gt 0) {
    return $allResults[0]
  }

  return $null
}

function Read-JsonFile {
  param([Parameter(Mandatory = $true)][string]$Path)

  $resolved = Resolve-FullPath -Path $Path
  return (Get-Content -LiteralPath $resolved -Raw) | ConvertFrom-Json -Depth 50
}

function Read-ManualSupplement {
  param([string]$Path)

  if ([string]::IsNullOrWhiteSpace($Path)) {
    return @()
  }

  if (-not (Test-Path -LiteralPath $Path)) {
    return @()
  }

  $config = Read-JsonFile -Path $Path
  $manualEntries = Get-OptionalPropertyValue -Object $config -Name "manualEntries"
  if ($null -eq $manualEntries) {
    $manualEntries = Get-OptionalPropertyValue -Object $config -Name "entries"
  }

  return Convert-ToArray -Value $manualEntries
}

function Get-GithubIdentity {
  $identity = Invoke-GhJsonPaged -Endpoint "/user"
  if ($null -eq $identity) {
    return $null
  }

  return [ordered]@{
    login = $identity.login
    name = $identity.name
    id = $identity.id
    node_id = $identity.node_id
    html_url = $identity.html_url
    avatar_url = $identity.avatar_url
    type = $identity.type
  }
}

function Get-GithubOrganizations {
  $memberships = Invoke-GhJsonPaged -Endpoint "/user/memberships/orgs" -ArrayResult
  $organizations = New-Object System.Collections.Generic.List[object]

  foreach ($membership in $memberships) {
    $org = $membership.organization
    if ($null -eq $org) {
      continue
    }

    $organizations.Add([ordered]@{
      login = $org.login
      id = $org.id
      node_id = $org.node_id
      name = Get-OptionalPropertyValue -Object $org -Name "name"
      description = $org.description
      html_url = if (-not [string]::IsNullOrWhiteSpace([string]$org.login)) { "https://github.com/{0}" -f $org.login } else { $null }
      role = $membership.role
      state = $membership.state
      visibility = Get-OptionalPropertyValue -Object $org -Name "visibility"
    })
  }

  return @($organizations.ToArray() | Sort-Object login)
}

function Get-GithubRepositories {
  $repositories = Invoke-GhJsonPaged -Endpoint "/user/repos" -Query @{ affiliation = "owner,collaborator,organization_member" } -ArrayResult
  $filtered = New-Object System.Collections.Generic.List[object]

  foreach ($repository in $repositories) {
    if ($repository.full_name -match "^(?i)PayeWaive/") {
      continue
    }

    $filtered.Add([ordered]@{
      id = $repository.id
      node_id = $repository.node_id
      name = $repository.name
      full_name = $repository.full_name
      owner = $repository.owner.login
      owner_type = $repository.owner.type
      private = [bool]$repository.private
      visibility = $repository.visibility
      description = $repository.description
      html_url = $repository.html_url
      homepage = $repository.homepage
      archived = [bool]$repository.archived
      fork = [bool]$repository.fork
      default_branch = $repository.default_branch
      created_at = $repository.created_at
      updated_at = $repository.updated_at
      pushed_at = $repository.pushed_at
      language = $repository.language
      size = $repository.size
      topics = @($repository.topics)
      license = $repository.license
    })
  }

  return @($filtered.ToArray() | Sort-Object full_name)
}

function Read-ConfigData {
  param([string]$Path)

  if ([string]::IsNullOrWhiteSpace($Path)) {
    return [pscustomobject]@{
      roots = @()
      manualEntries = @()
    }
  }

  if (-not (Test-Path -LiteralPath $Path)) {
    return [pscustomobject]@{
      roots = @()
      manualEntries = @()
    }
  }

  $config = Read-JsonFile -Path $Path
  $manualEntries = Get-OptionalPropertyValue -Object $config -Name "manualEntries"
  if ($null -eq $manualEntries) {
    $manualEntries = Get-OptionalPropertyValue -Object $config -Name "entries"
  }

  return [pscustomobject]@{
    roots = Convert-ToArray -Value (Get-OptionalPropertyValue -Object $config -Name "roots")
    manualEntries = Convert-ToArray -Value $manualEntries
  }
}

function Invoke-LocalEvidenceExport {
  param(
    [string[]]$Roots,
    [string]$ConfigFile,
    [switch]$Recurse,
    [switch]$UseGhCli
  )

  $exportScript = Resolve-FullPath -Path (Join-Path $PSScriptRoot "..\Export-PriorArtEvidence.ps1")
  $tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("prior-art-inventory-{0}" -f ([Guid]::NewGuid().ToString("n")))
  $tempJson = Join-Path $tempRoot "local-evidence.json"
  $tempMarkdown = Join-Path $tempRoot "local-evidence.md"
  New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null

  try {
    $arguments = @("-File", $exportScript, "-OutJson", $tempJson, "-OutMarkdown", $tempMarkdown)

    foreach ($root in @($Roots)) {
      if (-not [string]::IsNullOrWhiteSpace([string]$root)) {
        $arguments += @("-Roots", [string]$root)
      }
    }

    if (-not [string]::IsNullOrWhiteSpace($ConfigFile)) {
      $arguments += @("-ConfigFile", $ConfigFile)
    }

    if ($Recurse) {
      $arguments += "-Recurse"
    }

    if ($UseGhCli) {
      $arguments += "-UseGhCli"
    }

    $result = & pwsh @arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
      return [pscustomobject]@{
        success = $false
        document = $null
        error = ($result -join [Environment]::NewLine)
        tempRoot = $tempRoot
      }
    }

    if (-not (Test-Path -LiteralPath $tempJson)) {
      return [pscustomobject]@{
        success = $false
        document = $null
        error = "Local evidence export completed without writing $tempJson."
        tempRoot = $tempRoot
      }
    }

    return [pscustomobject]@{
      success = $true
      document = Read-JsonFile -Path $tempJson
      error = $null
      tempRoot = $tempRoot
    }
  }
  finally {
    if (Test-Path -LiteralPath $tempRoot) {
      Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
}

function Get-LocalEvidenceIndexes {
  param([Parameter(Mandatory = $true)][object]$Document)

  $bySlug = @{}
  $byPath = @{}
  $gitEntries = New-Object System.Collections.Generic.List[object]
  $manualEntries = New-Object System.Collections.Generic.List[object]

  foreach ($entry in @($Document.entries)) {
    if ($null -eq $entry) {
      continue
    }

    $entryType = Get-OptionalPropertyValue -Object $entry -Name "entryType"
    if ($entryType -eq "git-repo") {
      $gitEntries.Add($entry)

      $localPath = Get-OptionalPropertyValue -Object $entry -Name "localPath"
      if (-not [string]::IsNullOrWhiteSpace([string]$localPath)) {
        try {
          $byPath[[System.IO.Path]::GetFullPath([string]$localPath)] = $entry
        }
        catch {
          $byPath[[string]$localPath] = $entry
        }
      }

      foreach ($remote in @($entry.remoteUrls)) {
        $slug = Get-GithubRepoSlug -RemoteUrl (Get-OptionalPropertyValue -Object $remote -Name "url")
        if ($slug) {
          $bySlug[$slug.ToLowerInvariant()] = $entry
          break
        }
      }
      continue
    }

    $manualEntries.Add($entry)
  }

  return [pscustomobject]@{
    bySlug = $bySlug
    byPath = $byPath
    gitEntries = @($gitEntries.ToArray())
    manualEntries = @($manualEntries.ToArray())
  }
}

function Resolve-OwnerLabel {
  param(
    [Parameter(Mandatory = $true)][string]$OwnerLogin,
    [AllowNull()][object[]]$Organizations,
    [AllowNull()][object]$Identity
  )

  $organization = @($Organizations) | Where-Object { $_.login -eq $OwnerLogin } | Select-Object -First 1
  if ($organization -and -not [string]::IsNullOrWhiteSpace([string]$organization.name)) {
    return [string]$organization.name
  }

  if ($Identity -and $Identity.login -eq $OwnerLogin -and -not [string]::IsNullOrWhiteSpace([string]$Identity.name)) {
    return [string]$Identity.name
  }

  return $OwnerLogin
}

function Get-OwnershipRelationship {
  param(
    [Parameter(Mandatory = $true)][object]$Repository,
    [AllowNull()][object]$Identity,
    [AllowNull()][object[]]$Organizations
  )

  if ($null -ne $Identity -and $Repository.owner -eq $Identity.login) {
    return "personal"
  }

  if ($Repository.owner_type -eq "Organization") {
    $org = @($Organizations) | Where-Object { $_.login -eq $Repository.owner } | Select-Object -First 1
    if ($null -ne $org) {
      return "org-controlled"
    }
  }

  if ($Repository.owner_type -eq "User") {
    return "collaborator"
  }

  return "unknown"
}

function Get-RepositoryKind {
  param(
    [Parameter(Mandatory = $true)][object]$Repository,
    [AllowNull()][string]$ReadmeTitle,
    [AllowNull()][string]$ReadmePreview
  )

  $text = @(
    $Repository.name,
    $Repository.full_name,
    $Repository.description,
    $ReadmeTitle,
    $ReadmePreview
  ) -join " "
  $lower = $text.ToLowerInvariant()

  if ($lower -match "integration|adapter|connector|postmark|workos|cloudflare|electronic notary|notary") {
    return "integration"
  }

  if ($lower -match "www|website|site|marketing|landing") {
    return "website"
  }

  if ($lower -match "library|sdk|types|shared|common|generator|template") {
    return "library"
  }

  if ($lower -match "prototype|demo|lab|experiment|sample") {
    return "prototype"
  }

  if ($lower -match "venture|startup|company|brand") {
    return "venture"
  }

  if ($lower -match "platform|infra|infrastructure|system|engine|monitor|govern|relay|proxy|forward|app|cli|console|tool") {
    return "internal-system"
  }

  if ($lower -match "legacy|old|archive|history") {
    return "legacy-code"
  }

  if ($Repository.private -eq $false) {
    return "product"
  }

  return "other"
}

function Get-ReuseIndicators {
  param([AllowNull()][string]$Text)

  if ([string]::IsNullOrWhiteSpace($Text)) {
    return @()
  }

  $lower = $Text.ToLowerInvariant()
  $indicators = New-Object System.Collections.Generic.List[string]

  if ($lower -match "integration|adapter|connector|workos|postmark|cloudflare|notary") {
    $indicators.Add("integration-adapter")
  }

  if ($lower -match "relay|request") {
    $indicators.Add("request-routing")
  }

  if ($lower -match "proxy|quic|forward") {
    $indicators.Add("network-forwarding")
  }

  if ($lower -match "platform|infra|system|engine|monitor") {
    $indicators.Add("platform-primitive")
  }

  if ($lower -match "library|sdk|types|package|shared|common") {
    $indicators.Add("shared-component")
  }

  if ($lower -match "template|generator") {
    $indicators.Add("template-or-generator")
  }

  if ($lower -match "www|site|marketing|domain") {
    $indicators.Add("web-property")
  }

  return @($indicators.ToArray() | Select-Object -Unique)
}

function Get-TechnologyIndicators {
  param(
    [Parameter(Mandatory = $true)][object]$Repository,
    [AllowNull()][string]$ManifestPath
  )

  $indicators = New-Object System.Collections.Generic.List[string]

  if (-not [string]::IsNullOrWhiteSpace([string]$Repository.language)) {
    $indicators.Add([string]$Repository.language)
  }

  if ($ManifestPath) {
    switch -Regex ([System.IO.Path]::GetExtension($ManifestPath).ToLowerInvariant()) {
      "\.sln" { $indicators.Add(".NET solution") }
      "\.csproj|\.fsproj|\.vbproj" { $indicators.Add(".NET") }
      "\.json" { $indicators.Add("JavaScript/TypeScript") }
      "\.ya?ml" { $indicators.Add("configuration") }
      default { }
    }
  }

  if ($Repository.name -match "astro" -or $Repository.language -eq "Astro") {
    $indicators.Add("Astro")
  }

  return @($indicators.ToArray() | Select-Object -Unique)
}

function Get-RelativePath {
  param(
    [Parameter(Mandatory = $true)][string]$BasePath,
    [Parameter(Mandatory = $true)][string]$Path
  )

  $base = Resolve-FullPath -Path $BasePath
  $full = Resolve-FullPath -Path $Path -AllowMissing
  $relative = [System.IO.Path]::GetRelativePath($base, $full)

  if ([string]::IsNullOrWhiteSpace($relative)) {
    return "."
  }

  return $relative.Replace("\", "/")
}

function Get-DatePrecision {
  param([AllowNull()][string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return "unknown"
  }

  if ($Value -match "^\d{4}-\d{2}-\d{2}") {
    return "exact"
  }

  if ($Value -match "^\d{4}-\d{2}$") {
    return "month"
  }

  if ($Value -match "^\d{4}$") {
    return "year"
  }

  return "approximate"
}

function Find-RepositoryManifestFiles {
  param([Parameter(Mandatory = $true)][string]$RepositoryPath)

  if (-not (Test-Path -LiteralPath $RepositoryPath)) {
    return @()
  }

  $patterns = @(
    "*.sln",
    "*.csproj",
    "*.fsproj",
    "*.vbproj",
    "package.json",
    "pnpm-workspace.yaml",
    "pnpm-workspace.yml",
    "astro.config.*"
  )

  $results = New-Object System.Collections.Generic.List[object]
  foreach ($pattern in $patterns) {
    $matches = Get-ChildItem -LiteralPath $RepositoryPath -File -Recurse -Force -Filter $pattern -ErrorAction SilentlyContinue |
      Where-Object {
        $_.FullName -notmatch "[\\/](node_modules|dist|build|coverage|bin|obj|\.git|\.astro|\.wrangler|artifacts|vendor)[\\/]"
      }

    foreach ($match in $matches) {
      $results.Add($match)
    }
  }

  return @($results.ToArray() | Sort-Object FullName -Unique)
}

function Get-FirstCommitForPath {
  param(
    [Parameter(Mandatory = $true)][string]$RepositoryPath,
    [AllowNull()][string]$RelativePath
  )

  if ([string]::IsNullOrWhiteSpace($RelativePath) -or $RelativePath -eq ".") {
    $command = @("log", "--all", "--reverse", "--format=%H|%cI", "--max-count=1")
  }
  else {
    $command = @("log", "--follow", "--reverse", "--format=%H|%cI", "--max-count=1", "--", $RelativePath)
  }

  $result = Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments $command
  $line = Get-FirstOutputLine -Result $result
  if ([string]::IsNullOrWhiteSpace($line) -or -not $line.Contains("|")) {
    return $null
  }

  $parts = $line -split "\|", 2
  return [pscustomobject]@{
    hash = $parts[0]
    date = $parts[1]
  }
}

function Get-LatestCommitForPath {
  param(
    [Parameter(Mandatory = $true)][string]$RepositoryPath,
    [AllowNull()][string]$RelativePath
  )

  if ([string]::IsNullOrWhiteSpace($RelativePath) -or $RelativePath -eq ".") {
    $command = @("log", "-1", "--format=%H|%cI")
  }
  else {
    $command = @("log", "-1", "--format=%H|%cI", "--", $RelativePath)
  }

  $result = Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments $command
  $line = Get-FirstOutputLine -Result $result
  if ([string]::IsNullOrWhiteSpace($line) -or -not $line.Contains("|")) {
    return $null
  }

  $parts = $line -split "\|", 2
  return [pscustomobject]@{
    hash = $parts[0]
    date = $parts[1]
  }
}

function Get-CommitCountForPath {
  param(
    [Parameter(Mandatory = $true)][string]$RepositoryPath,
    [AllowNull()][string]$RelativePath
  )

  if ([string]::IsNullOrWhiteSpace($RelativePath) -or $RelativePath -eq ".") {
    $command = @("rev-list", "--count", "HEAD")
  }
  else {
    $command = @("rev-list", "--count", "HEAD", "--", $RelativePath)
  }

  $result = Invoke-GitCapture -RepositoryPath $RepositoryPath -Arguments $command
  $line = Get-FirstOutputLine -Result $result
  if ([string]::IsNullOrWhiteSpace($line)) {
    return $null
  }

  $count = 0
  if ([int]::TryParse($line, [ref]$count)) {
    return $count
  }

  return $null
}

function Get-ObjectPropertyNames {
  param([AllowNull()][object]$Object)

  if ($null -eq $Object) {
    return @()
  }

  return @($Object.PSObject.Properties | ForEach-Object { $_.Name })
}

function Get-TextKind {
  param(
    [AllowNull()][string]$Text,
    [string]$Fallback = "other"
  )

  if ([string]::IsNullOrWhiteSpace($Text)) {
    return $Fallback
  }

  $lower = $Text.ToLowerInvariant()

  if ($lower -match "integration|adapter|connector|postmark|workos|cloudflare|notary") {
    return "integration"
  }

  if ($lower -match "www|website|site|marketing|landing|domain") {
    return "website"
  }

  if ($lower -match "library|sdk|types|shared|common|package|nuget|template") {
    return "library"
  }

  if ($lower -match "prototype|demo|lab|experiment|sample") {
    return "prototype"
  }

  if ($lower -match "venture|startup|company|brand") {
    return "venture"
  }

  if ($lower -match "platform|infra|infrastructure|system|engine|monitor|govern|relay|proxy|forward|app|cli|console|tool") {
    return "internal-system"
  }

  if ($lower -match "legacy|old|archive|history") {
    return "legacy-code"
  }

  return $Fallback
}

function Get-ManifestType {
  param([Parameter(Mandatory = $true)][string]$ManifestPath)

  $name = [System.IO.Path]::GetFileName($ManifestPath).ToLowerInvariant()
  switch -Regex ($name) {
    "^package\.json$" { return "package" }
    "^pnpm-workspace\.ya?ml$" { return "workspace" }
    "^astro\.config\." { return "configuration" }
    "\.sln$" { return "solution" }
    "\.(csproj|fsproj|vbproj)$" { return "project" }
    default { return "project" }
  }
}

function Get-ManifestSummary {
  param(
    [Parameter(Mandatory = $true)][string]$ManifestPath,
    [Parameter(Mandatory = $true)][string]$RepositoryPath
  )

  $fileName = [System.IO.Path]::GetFileName($ManifestPath)
  $folder = Get-RelativePath -BasePath $RepositoryPath -Path (Split-Path -Parent $ManifestPath)
  if ([string]::IsNullOrWhiteSpace($folder)) {
    $folder = "."
  }

  switch -Regex ($fileName.ToLowerInvariant()) {
    "^package\.json$" {
      try {
        $package = Read-JsonFile -Path $ManifestPath
        $description = Get-OptionalPropertyValue -Object $package -Name "description"
        $name = Get-OptionalPropertyValue -Object $package -Name "name"
        if (-not [string]::IsNullOrWhiteSpace([string]$description)) {
          return [string]$description
        }
        if (-not [string]::IsNullOrWhiteSpace([string]$name)) {
          return ("{0} package" -f [string]$name)
        }
      }
      catch {
        # Fall through to the generic summary.
      }

      return ("JavaScript/TypeScript package in {0}" -f $folder)
    }
    "^pnpm-workspace\.ya?ml$" {
      return ("Workspace definition for packages under {0}" -f $folder)
    }
    "^astro\.config\." {
      return ("Astro configuration for {0}" -f $folder)
    }
    "\.sln$" {
      return ("Solution file grouping projects under {0}" -f $folder)
    }
    "\.(csproj|fsproj|vbproj)$" {
      return ("Project file for {0}" -f $folder)
    }
    default {
      return ("Project file in {0}" -f $folder)
    }
  }
}

function Get-ManifestTechnologyIndicators {
  param(
    [Parameter(Mandatory = $true)][string]$ManifestPath,
    [Parameter(Mandatory = $true)][object]$Repository
  )

  $indicators = New-Object System.Collections.Generic.List[string]
  $name = [System.IO.Path]::GetFileName($ManifestPath).ToLowerInvariant()
  $folder = [System.IO.Path]::GetDirectoryName($ManifestPath)

  if ($Repository.language) {
    $indicators.Add([string]$Repository.language)
  }

  switch -Regex ($name) {
    "^package\.json$" {
      $indicators.Add("JavaScript/TypeScript")
      try {
        $package = Read-JsonFile -Path $ManifestPath
        $packageName = Get-OptionalPropertyValue -Object $package -Name "name"
        $description = Get-OptionalPropertyValue -Object $package -Name "description"
        $fieldText = @($packageName, $description) -join " "
        if ($fieldText -match "astro") { $indicators.Add("Astro") }
        if ($fieldText -match "react") { $indicators.Add("React") }
        if ($fieldText -match "tailwind") { $indicators.Add("Tailwind CSS") }
        if ($fieldText -match "vite") { $indicators.Add("Vite") }
        if ($fieldText -match "next") { $indicators.Add("Next.js") }
        if ($fieldText -match "nuxt") { $indicators.Add("Nuxt") }
      }
      catch {
        # Ignore package.json parse failures.
      }
    }
    "^pnpm-workspace\.ya?ml$" { $indicators.Add("pnpm") }
    "^astro\.config\." { $indicators.Add("Astro") }
    "\.sln$" { $indicators.Add(".NET solution") }
    "\.(csproj|fsproj|vbproj)$" { $indicators.Add(".NET") }
  }

  if ($folder -match "react") { $indicators.Add("React") }
  if ($folder -match "astro") { $indicators.Add("Astro") }
  if ($folder -match "tailwind") { $indicators.Add("Tailwind CSS") }
  if ($folder -match "dotnet|csharp|\.net") { $indicators.Add(".NET") }

  return @($indicators.ToArray() | Select-Object -Unique)
}

function Get-ManifestKind {
  param(
    [Parameter(Mandatory = $true)][string]$ManifestPath,
    [Parameter(Mandatory = $true)][object]$Repository
  )

  $text = @(
    [System.IO.Path]::GetFileNameWithoutExtension($ManifestPath),
    [System.IO.Path]::GetDirectoryName($ManifestPath),
    $Repository.name,
    $Repository.description
  ) -join " "

  $lower = $text.ToLowerInvariant()
  if ($lower -match "integration|adapter|connector|workos|postmark|cloudflare|notary") {
    return "integration"
  }

  if ($lower -match "www|website|site|marketing|landing") {
    return "website"
  }

  if ($lower -match "library|sdk|types|shared|common|package|template") {
    return "library"
  }

  if ($lower -match "prototype|demo|lab|experiment|sample") {
    return "prototype"
  }

  if ($lower -match "venture|startup|company|brand") {
    return "venture"
  }

  if ($lower -match "platform|infra|infrastructure|system|engine|monitor|govern|relay|proxy|forward|app|cli|console|tool") {
    return "internal-system"
  }

  return (Get-RepositoryKind -Repository $Repository)
}

function Get-ManifestUnitName {
  param([Parameter(Mandatory = $true)][string]$ManifestPath)

  $fileName = [System.IO.Path]::GetFileName($ManifestPath)
  switch -Regex ($fileName.ToLowerInvariant()) {
    "^package\.json$" {
      try {
        $package = Read-JsonFile -Path $ManifestPath
        $name = Get-OptionalPropertyValue -Object $package -Name "name"
        if (-not [string]::IsNullOrWhiteSpace([string]$name)) {
          return [string]$name
        }
      }
      catch {
        # Ignore and fall back.
      }

      return (Split-Path -Leaf (Split-Path -Parent $ManifestPath))
    }
    "^pnpm-workspace\.ya?ml$" {
      return "pnpm workspace"
    }
    "^astro\.config\." {
      return "Astro config"
    }
    default {
      return [System.IO.Path]::GetFileNameWithoutExtension($ManifestPath)
    }
  }
}

function Get-RepositoryRootSummary {
  param([Parameter(Mandatory = $true)][object]$Repository)

  $description = Get-OptionalPropertyValue -Object $Repository -Name "description"
  if (-not [string]::IsNullOrWhiteSpace([string]$description)) {
    return [string]$description
  }

  $readmeTitle = Get-OptionalPropertyValue -Object $Repository -Name "readmeTitle"
  if (-not [string]::IsNullOrWhiteSpace([string]$readmeTitle)) {
    return [string]$readmeTitle
  }

  $readmePreview = Get-OptionalPropertyValue -Object $Repository -Name "readmePreview"
  if (-not [string]::IsNullOrWhiteSpace([string]$readmePreview)) {
    return [string]$readmePreview
  }

  return ("Repository for {0}" -f (Get-OptionalPropertyValue -Object $Repository -Name "full_name"))
}

function Get-ClassificationDefaults {
  param(
    [Parameter(Mandatory = $true)][string]$Visibility,
    [Parameter(Mandatory = $true)][string]$Kind,
    [switch]$HasLocalEvidence,
    [switch]$Manual
  )

  $sensitivity = switch ($Visibility) {
    "public" { "low" }
    "internal" { "medium" }
    "private" { "medium" }
    default { "unknown" }
  }

  if ($Kind -eq "legacy-code" -or $Kind -eq "venture") {
    $sensitivity = if ($sensitivity -eq "low") { "medium" } else { $sensitivity }
  }

  if (-not $HasLocalEvidence) {
    $sensitivity = if ($sensitivity -eq "low") { "medium" } else { $sensitivity }
  }

  $mentionStrategy = if ($Manual) { "generalized_family" } else { "exact_name" }

  return [pscustomobject]@{
    include_in_public_page = $true
    include_in_pdf_exhibit = $true
    mention_strategy = $mentionStrategy
    sensitivity_level = $sensitivity
    confidence_label = if ($HasLocalEvidence) { "high" } else { "medium" }
    manual_review_required = [bool](-not $HasLocalEvidence -or $Manual)
  }
}

function Get-RepositoryStatus {
  param(
    [Parameter(Mandatory = $true)][object]$Repository,
    [AllowNull()][object]$LocalEvidence
  )

  if ($Repository.archived) {
    return "archived"
  }

  $referenceDate = $null
  if ($LocalEvidence -and -not [string]::IsNullOrWhiteSpace([string]$LocalEvidence.latestCommitDate)) {
    $referenceDate = [string]$LocalEvidence.latestCommitDate
  }
  elseif (-not [string]::IsNullOrWhiteSpace([string]$Repository.pushed_at)) {
    $referenceDate = [string]$Repository.pushed_at
  }

  if ([string]::IsNullOrWhiteSpace($referenceDate)) {
    return "dormant"
  }

  try {
    $parsed = [DateTimeOffset]::Parse($referenceDate)
    $age = [DateTimeOffset]::UtcNow - $parsed.ToUniversalTime()
    if ($age.TotalDays -lt 90) {
      return "active"
    }

    if ($age.TotalDays -lt 365) {
      return "dormant"
    }

    return "historical"
  }
  catch {
    return "unknown"
  }
}

function Build-RepositoryRecord {
  param(
    [Parameter(Mandatory = $true)][object]$Repository,
    [AllowNull()][object]$LocalEvidence,
    [AllowNull()][object]$Identity,
    [AllowNull()][object[]]$Organizations
  )

  $kind = Get-RepositoryKind -Repository $Repository -ReadmeTitle (Get-OptionalPropertyValue -Object $LocalEvidence -Name "readmeTitle") -ReadmePreview (Get-OptionalPropertyValue -Object $LocalEvidence -Name "readmePreview")
  $classification = Get-ClassificationDefaults -Visibility $Repository.visibility -Kind $kind -HasLocalEvidence:($null -ne $LocalEvidence)
  $ownerLabel = Resolve-OwnerLabel -OwnerLogin $Repository.owner -Organizations $Organizations -Identity $Identity
  $relationship = Get-OwnershipRelationship -Repository $Repository -Identity $Identity -Organizations $Organizations
  $status = Get-RepositoryStatus -Repository $Repository -LocalEvidence $LocalEvidence
  $localPath = Get-OptionalPropertyValue -Object $LocalEvidence -Name "localPath"
  $localName = Get-OptionalPropertyValue -Object $LocalEvidence -Name "localName"
  $defaultBranchResolved = Get-OptionalPropertyValue -Object $LocalEvidence -Name "defaultBranch"
  $currentBranch = Get-OptionalPropertyValue -Object $LocalEvidence -Name "currentBranch"
  $headCommit = Get-OptionalPropertyValue -Object $LocalEvidence -Name "headCommit"
  $headCommitDate = Get-OptionalPropertyValue -Object $LocalEvidence -Name "headCommitDate"
  $earliestCommitDate = Get-OptionalPropertyValue -Object $LocalEvidence -Name "earliestCommitDate"
  $earliestCommitHash = Get-OptionalPropertyValue -Object $LocalEvidence -Name "earliestCommitHash"
  $latestCommitDate = Get-OptionalPropertyValue -Object $LocalEvidence -Name "latestCommitDate"
  $latestCommitHash = Get-OptionalPropertyValue -Object $LocalEvidence -Name "latestCommitHash"
  $hasUncommittedChanges = Get-OptionalPropertyValue -Object $LocalEvidence -Name "hasUncommittedChanges"
  $readmeTitle = Get-OptionalPropertyValue -Object $LocalEvidence -Name "readmeTitle"
  $readmePreview = Get-OptionalPropertyValue -Object $LocalEvidence -Name "readmePreview"
  $commitCount = $null

  if ($LocalEvidence -and -not [string]::IsNullOrWhiteSpace([string]$localPath) -and (Test-Path -LiteralPath $localPath)) {
    $commitCount = Get-CommitCountForPath -RepositoryPath $localPath -RelativePath "."
  }

  $repoKindText = @(
    $Repository.name,
    $Repository.description,
    $readmeTitle,
    $readmePreview
  ) -join " "
  $reuseIndicators = Get-ReuseIndicators -Text $repoKindText

  $publicUrl = $null
  if ($Repository.visibility -eq "public") {
    $publicUrl = $Repository.html_url
  }

  $notes = New-Object System.Collections.Generic.List[string]
  if (-not $LocalEvidence) {
    $notes.Add("No local checkout matched this repository under the configured roots.")
  }

  if ($Repository.archived) {
    $notes.Add("Repository is archived in GitHub.")
  }

  return [ordered]@{
    id = ("repo:{0}" -f $Repository.full_name)
    slug = $Repository.full_name
    name = $Repository.name
    full_name = $Repository.full_name
    owner = $Repository.owner
    owner_type = $Repository.owner_type
    owner_label = $ownerLabel
    relationship = $relationship
    portfolio = $ownerLabel
    visibility = $Repository.visibility
    private = [bool]$Repository.private
    archived = [bool]$Repository.archived
    fork = [bool]$Repository.fork
    kind = $kind
    status = $status
    description = $Repository.description
    homepage = $Repository.homepage
    html_url = $publicUrl
    public_url = $publicUrl
    default_branch = $Repository.default_branch
    created_at = $Repository.created_at
    updated_at = $Repository.updated_at
    pushed_at = $Repository.pushed_at
    language = $Repository.language
    size = $Repository.size
    topics = @($Repository.topics)
    license = $Repository.license
    local_path = $localPath
    local_name = $localName
    has_local_evidence = [bool]$LocalEvidence
    default_branch_resolved = $defaultBranchResolved
    current_branch = $currentBranch
    head_commit = $headCommit
    head_commit_date = $headCommitDate
    earliest_commit_date = $earliestCommitDate
    earliest_commit_hash = $earliestCommitHash
    latest_commit_date = $latestCommitDate
    latest_commit_hash = $latestCommitHash
    commit_count = $commitCount
    has_uncommitted_changes = $hasUncommittedChanges
    readme_title = $readmeTitle
    readme_preview = $readmePreview
    technology_indicators = @(Get-TechnologyIndicators -Repository $Repository)
    reuse_indicators = @($reuseIndicators)
    include_in_public_page = [bool]$classification.include_in_public_page
    include_in_pdf_exhibit = [bool]$classification.include_in_pdf_exhibit
    mention_strategy = [string]$classification.mention_strategy
    sensitivity_level = [string]$classification.sensitivity_level
    confidence_label = [string]$classification.confidence_label
    manual_review_required = [bool]$classification.manual_review_required
    rationale = if ($LocalEvidence) {
      "Repository metadata matched local checkout evidence."
    }
    else {
      "Repository metadata came from GitHub only; no local checkout was found under the configured roots."
    }
    notes = @($notes.ToArray())
    project_unit_ids = @()
  }
}

function New-PathIdentity {
  param(
    [Parameter(Mandatory = $true)][string]$RepositoryFullName,
    [AllowNull()][string]$RelativePath
  )

  if ([string]::IsNullOrWhiteSpace($RelativePath) -or $RelativePath -eq ".") {
    return ("unit:{0}:root" -f ($RepositoryFullName -replace "[^A-Za-z0-9]+", "-").Trim("-"))
  }

  $slug = ($RelativePath -replace "[^A-Za-z0-9]+", "-").Trim("-")
  if ([string]::IsNullOrWhiteSpace($slug)) {
    $slug = "path"
  }

  return ("unit:{0}:{1}" -f ($RepositoryFullName -replace "[^A-Za-z0-9]+", "-").Trim("-"), $slug)
}

function Build-RepositoryRootUnit {
  param(
    [Parameter(Mandatory = $true)][object]$RepositoryRecord
  )

  $started = if ($RepositoryRecord.earliest_commit_date) {
    $RepositoryRecord.earliest_commit_date
  }
  else {
    $RepositoryRecord.created_at
  }

  $startedPrecision = Get-DatePrecision -Value $started
  $latest = if ($RepositoryRecord.latest_commit_date) { $RepositoryRecord.latest_commit_date } else { $RepositoryRecord.pushed_at }
  $ended = $null
  $endedPrecision = "ongoing"
  if ($RepositoryRecord.archived -and $latest) {
    $ended = $latest
    $endedPrecision = Get-DatePrecision -Value $latest
  }

  $publicLinks = @()
  if (-not [string]::IsNullOrWhiteSpace([string]$RepositoryRecord.public_url)) {
    $publicLinks = @(
      [ordered]@{
        label = "GitHub repository"
        url = $RepositoryRecord.public_url
        type = "repository"
      }
    )
  }

  return [ordered]@{
    id = (New-PathIdentity -RepositoryFullName $RepositoryRecord.full_name -RelativePath ".")
    repositoryId = $RepositoryRecord.id
    repositorySlug = $RepositoryRecord.full_name
    repositoryFullName = $RepositoryRecord.full_name
    repositoryOwner = $RepositoryRecord.owner
    repositoryVisibility = $RepositoryRecord.visibility
    repositoryRelationship = $RepositoryRecord.relationship
    repositoryKind = $RepositoryRecord.kind
    sourceType = "repo-root"
    parentUnitId = $null
    name = if ($RepositoryRecord.readme_title) { $RepositoryRecord.readme_title } else { $RepositoryRecord.name }
    path = "."
    type = "repository"
    kind = $RepositoryRecord.kind
    status = $RepositoryRecord.status
    summary = Get-RepositoryRootSummary -Repository $RepositoryRecord
    technologyIndicators = @($RepositoryRecord.technology_indicators)
    reuseIndicators = @($RepositoryRecord.reuse_indicators)
    portfolio = $RepositoryRecord.portfolio
    group = $RepositoryRecord.portfolio
    started = $started
    startedPrecision = $startedPrecision
    ended = $ended
    endedPrecision = $endedPrecision
    commitCount = $RepositoryRecord.commit_count
    earliestCommitDate = $RepositoryRecord.earliest_commit_date
    earliestCommitHash = $RepositoryRecord.earliest_commit_hash
    latestCommitDate = $RepositoryRecord.latest_commit_date
    latestCommitHash = $RepositoryRecord.latest_commit_hash
    currentBranch = $RepositoryRecord.current_branch
    headCommit = $RepositoryRecord.head_commit
    headCommitDate = $RepositoryRecord.head_commit_date
    publicLinks = $publicLinks
    evidencePublic = @()
    relatedIds = @()
    include_in_public_page = [bool]$RepositoryRecord.include_in_public_page
    include_in_pdf_exhibit = [bool]$RepositoryRecord.include_in_pdf_exhibit
    mention_strategy = [string]$RepositoryRecord.mention_strategy
    sensitivity_level = [string]$RepositoryRecord.sensitivity_level
    confidence_label = [string]$RepositoryRecord.confidence_label
    manual_review_required = [bool]$RepositoryRecord.manual_review_required
    publicVisibilityRecommendation = [string]$RepositoryRecord.mention_strategy
    pdfInclusionRecommendation = if ($RepositoryRecord.include_in_pdf_exhibit) { "include" } else { "exclude" }
    rationale = $RepositoryRecord.rationale
    notes = @($RepositoryRecord.notes)
  }
}

function Build-ManifestUnit {
  param(
    [Parameter(Mandatory = $true)][object]$RepositoryRecord,
    [Parameter(Mandatory = $true)][string]$RepositoryPath,
    [Parameter(Mandatory = $true)][System.IO.FileInfo]$ManifestFile,
    [Parameter(Mandatory = $true)][string]$ParentUnitId
  )

  $relativePath = Get-RelativePath -BasePath $RepositoryPath -Path $ManifestFile.FullName
  $manifestType = Get-ManifestType -ManifestPath $ManifestFile.FullName
  $unitName = Get-ManifestUnitName -ManifestPath $ManifestFile.FullName
  $summary = Get-ManifestSummary -ManifestPath $ManifestFile.FullName -RepositoryPath $RepositoryPath
  $kind = Get-ManifestKind -ManifestPath $ManifestFile.FullName -Repository $RepositoryRecord
  $technologyIndicators = Get-ManifestTechnologyIndicators -ManifestPath $ManifestFile.FullName -Repository $RepositoryRecord
  $reuseIndicators = Get-ReuseIndicators -Text (@($unitName, $summary, $relativePath) -join " ")
  $startedEvidence = Get-FirstCommitForPath -RepositoryPath $RepositoryPath -RelativePath $relativePath
  $latestEvidence = Get-LatestCommitForPath -RepositoryPath $RepositoryPath -RelativePath $relativePath
  $commitCount = Get-CommitCountForPath -RepositoryPath $RepositoryPath -RelativePath $relativePath

  $started = if ($startedEvidence) { $startedEvidence.date } elseif ($RepositoryRecord.earliest_commit_date) { $RepositoryRecord.earliest_commit_date } else { $RepositoryRecord.created_at }
  $startedPrecision = Get-DatePrecision -Value $started
  $ended = $null
  $endedPrecision = "ongoing"
  if ($RepositoryRecord.archived -and $latestEvidence) {
    $ended = $latestEvidence.date
    $endedPrecision = Get-DatePrecision -Value $latestEvidence.date
  }

  $publicLinks = @()
  if (-not [string]::IsNullOrWhiteSpace([string]$RepositoryRecord.public_url)) {
    $publicLinks = @(
      [ordered]@{
        label = "GitHub repository"
        url = $RepositoryRecord.public_url
        type = "repository"
      }
    )
  }

  return [ordered]@{
    id = (New-PathIdentity -RepositoryFullName $RepositoryRecord.full_name -RelativePath $relativePath)
    repositoryId = $RepositoryRecord.id
    repositorySlug = $RepositoryRecord.full_name
    repositoryFullName = $RepositoryRecord.full_name
    repositoryOwner = $RepositoryRecord.owner
    repositoryVisibility = $RepositoryRecord.visibility
    repositoryRelationship = $RepositoryRecord.relationship
    sourceType = "manifest"
    parentUnitId = $ParentUnitId
    name = $unitName
    path = $relativePath
    fileName = $ManifestFile.Name
    type = $manifestType
    kind = $kind
    status = $RepositoryRecord.status
    summary = $summary
    technologyIndicators = @($technologyIndicators)
    reuseIndicators = @($reuseIndicators)
    portfolio = $RepositoryRecord.portfolio
    group = $RepositoryRecord.portfolio
    started = $started
    startedPrecision = $startedPrecision
    ended = $ended
    endedPrecision = $endedPrecision
    commitCount = $commitCount
    earliestCommitDate = if ($startedEvidence) { $startedEvidence.date } else { $RepositoryRecord.earliest_commit_date }
    earliestCommitHash = if ($startedEvidence) { $startedEvidence.hash } else { $RepositoryRecord.earliest_commit_hash }
    latestCommitDate = if ($latestEvidence) { $latestEvidence.date } else { $RepositoryRecord.latest_commit_date }
    latestCommitHash = if ($latestEvidence) { $latestEvidence.hash } else { $RepositoryRecord.latest_commit_hash }
    publicLinks = $publicLinks
    evidencePublic = @()
    relatedIds = @($ParentUnitId)
    include_in_public_page = [bool]$RepositoryRecord.include_in_public_page
    include_in_pdf_exhibit = [bool]$RepositoryRecord.include_in_pdf_exhibit
    mention_strategy = [string]$RepositoryRecord.mention_strategy
    sensitivity_level = [string]$RepositoryRecord.sensitivity_level
    confidence_label = if ($startedEvidence -or $latestEvidence) { "high" } else { "medium" }
    manual_review_required = [bool](-not $startedEvidence -or -not $latestEvidence)
    publicVisibilityRecommendation = [string]$RepositoryRecord.mention_strategy
    pdfInclusionRecommendation = if ($RepositoryRecord.include_in_pdf_exhibit) { "include" } else { "exclude" }
    rationale = "Manifest discovered from the local checkout and linked to the repository root unit."
    notes = @()
  }
}

function Build-ManualUnit {
  param([Parameter(Mandatory = $true)][object]$ManualEntry)

  $title = Get-OptionalPropertyValue -Object $ManualEntry -Name "title"
  if ([string]::IsNullOrWhiteSpace([string]$title)) {
    $title = Get-OptionalPropertyValue -Object $ManualEntry -Name "name"
  }

  $localPath = Get-OptionalPropertyValue -Object $ManualEntry -Name "localPath"
  if ([string]::IsNullOrWhiteSpace([string]$localPath)) {
    $localPath = Get-OptionalPropertyValue -Object $ManualEntry -Name "path"
  }

  $summary = Get-OptionalPropertyValue -Object $ManualEntry -Name "summary"
  if ([string]::IsNullOrWhiteSpace([string]$summary)) {
    $summary = Get-OptionalPropertyValue -Object $ManualEntry -Name "publicSummary"
  }

  $started = Get-OptionalPropertyValue -Object $ManualEntry -Name "started"
  $ended = Get-OptionalPropertyValue -Object $ManualEntry -Name "ended"
  $sortDate = Get-OptionalPropertyValue -Object $ManualEntry -Name "sortDate"
  if ([string]::IsNullOrWhiteSpace([string]$started)) {
    $started = $sortDate
  }

  $publicLinks = New-Object System.Collections.Generic.List[object]
  foreach ($url in @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $ManualEntry -Name "urls"))) {
    if ([string]::IsNullOrWhiteSpace([string]$url)) {
      continue
    }

    $publicLinks.Add([ordered]@{
      label = $url
      url = $url
      type = "url"
    })
  }

  foreach ($link in @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $ManualEntry -Name "publicLinks"))) {
    $publicLinks.Add($link)
  }

  $notes = Convert-ToArray -Value (Get-OptionalPropertyValue -Object $ManualEntry -Name "notes")
  $domains = Convert-ToArray -Value (Get-OptionalPropertyValue -Object $ManualEntry -Name "domains")
  $kind = Get-OptionalPropertyValue -Object $ManualEntry -Name "kind"
  if ([string]::IsNullOrWhiteSpace([string]$kind)) {
    $kind = Get-TextKind -Text (@($title, $summary, ($domains -join " ")) -join " ")
  }

  $classification = [pscustomobject]@{
    include_in_public_page = if ($null -ne (Get-OptionalPropertyValue -Object $ManualEntry -Name "include_in_public_page")) { [bool](Get-OptionalPropertyValue -Object $ManualEntry -Name "include_in_public_page") } else { $true }
    include_in_pdf_exhibit = if ($null -ne (Get-OptionalPropertyValue -Object $ManualEntry -Name "include_in_pdf_exhibit")) { [bool](Get-OptionalPropertyValue -Object $ManualEntry -Name "include_in_pdf_exhibit") } else { $true }
    mention_strategy = if (-not [string]::IsNullOrWhiteSpace([string](Get-OptionalPropertyValue -Object $ManualEntry -Name "mention_strategy"))) { [string](Get-OptionalPropertyValue -Object $ManualEntry -Name "mention_strategy") } else { "generalized_family" }
    sensitivity_level = if (-not [string]::IsNullOrWhiteSpace([string](Get-OptionalPropertyValue -Object $ManualEntry -Name "sensitivity_level"))) { [string](Get-OptionalPropertyValue -Object $ManualEntry -Name "sensitivity_level") } else { "medium" }
    confidence_label = "medium"
    manual_review_required = if ($null -ne (Get-OptionalPropertyValue -Object $ManualEntry -Name "manual_review_required")) { [bool](Get-OptionalPropertyValue -Object $ManualEntry -Name "manual_review_required") } else { $true }
  }

  return [ordered]@{
    id = if (-not [string]::IsNullOrWhiteSpace([string](Get-OptionalPropertyValue -Object $ManualEntry -Name "id"))) { [string](Get-OptionalPropertyValue -Object $ManualEntry -Name "id") } else { ("manual:{0}" -f (New-Slug -Value $title)) }
    repositoryId = $null
    repositorySlug = $null
    repositoryFullName = $null
    repositoryOwner = $null
    repositoryVisibility = $null
    repositoryRelationship = "manual"
    sourceType = "manual"
    parentUnitId = $null
    name = if ($title) { [string]$title } else { "Manual prior-art item" }
    path = $localPath
    fileName = $null
    type = "manual"
    kind = $kind
    status = Get-OptionalPropertyValue -Object $ManualEntry -Name "status"
    summary = $summary
    technologyIndicators = @()
    reuseIndicators = @(Get-ReuseIndicators -Text (@($title, $summary, ($domains -join " ")) -join " "))
    portfolio = Get-OptionalPropertyValue -Object $ManualEntry -Name "portfolio"
    group = Get-OptionalPropertyValue -Object $ManualEntry -Name "group"
    started = $started
    startedPrecision = Get-DatePrecision -Value $started
    ended = $ended
    endedPrecision = if (-not [string]::IsNullOrWhiteSpace([string]$ended)) { Get-DatePrecision -Value $ended } else { "unknown" }
    commitCount = $null
    earliestCommitDate = $null
    earliestCommitHash = $null
    latestCommitDate = $null
    latestCommitHash = $null
    publicLinks = @($publicLinks.ToArray())
    evidencePublic = @()
    relatedIds = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $ManualEntry -Name "relatedIds"))
    include_in_public_page = [bool]$classification.include_in_public_page
    include_in_pdf_exhibit = [bool]$classification.include_in_pdf_exhibit
    mention_strategy = [string]$classification.mention_strategy
    sensitivity_level = [string]$classification.sensitivity_level
    confidence_label = [string]$classification.confidence_label
    manual_review_required = [bool]$classification.manual_review_required
    publicVisibilityRecommendation = [string]$classification.mention_strategy
    pdfInclusionRecommendation = if ($classification.include_in_pdf_exhibit) { "include" } else { "exclude" }
    rationale = "Manual supplement entry."
    notes = @($notes)
    domains = @($domains)
  }
}

function Convert-ToRepositoryCatalogRecord {
  param([Parameter(Mandatory = $true)][object]$RepositoryRecord)

  $publicHtmlUrl = $null
  $publicHomepage = $null
  if ($RepositoryRecord.visibility -eq "public") {
    $publicHtmlUrl = $RepositoryRecord.html_url
    $publicHomepage = $RepositoryRecord.homepage
  }

  return [ordered]@{
    archived = [bool]$RepositoryRecord.archived
    created_at = $RepositoryRecord.created_at
    default_branch = $RepositoryRecord.default_branch
    description = $RepositoryRecord.description
    fork = [bool]$RepositoryRecord.fork
    full_name = $RepositoryRecord.full_name
    homepage = $publicHomepage
    html_url = $publicHtmlUrl
    language = $RepositoryRecord.language
    name = $RepositoryRecord.name
    private = [bool]$RepositoryRecord.private
    pushed_at = $RepositoryRecord.pushed_at
    topics = @($RepositoryRecord.topics)
    updated_at = $RepositoryRecord.updated_at
    visibility = $RepositoryRecord.visibility
  }
}

function Convert-ToPublicCandidateRepository {
  param([Parameter(Mandatory = $true)][object]$RepositoryRecord)

  return [ordered]@{
    id = $RepositoryRecord.id
    slug = $RepositoryRecord.slug
    name = $RepositoryRecord.name
    full_name = $RepositoryRecord.full_name
    owner = $RepositoryRecord.owner
    owner_label = $RepositoryRecord.owner_label
    relationship = $RepositoryRecord.relationship
    portfolio = $RepositoryRecord.portfolio
    visibility = $RepositoryRecord.visibility
    private = [bool]$RepositoryRecord.private
    archived = [bool]$RepositoryRecord.archived
    fork = [bool]$RepositoryRecord.fork
    kind = $RepositoryRecord.kind
    status = $RepositoryRecord.status
    description = $RepositoryRecord.description
    homepage = if ($RepositoryRecord.visibility -eq "public") { $RepositoryRecord.homepage } else { $null }
    html_url = $RepositoryRecord.public_url
    public_url = $RepositoryRecord.public_url
    default_branch = $RepositoryRecord.default_branch
    created_at = $RepositoryRecord.created_at
    updated_at = $RepositoryRecord.updated_at
    pushed_at = $RepositoryRecord.pushed_at
    language = $RepositoryRecord.language
    size = $RepositoryRecord.size
    topics = @($RepositoryRecord.topics)
    license = $RepositoryRecord.license
    has_local_evidence = [bool]$RepositoryRecord.has_local_evidence
    commit_count = $RepositoryRecord.commit_count
    earliest_commit_date = $RepositoryRecord.earliest_commit_date
    latest_commit_date = $RepositoryRecord.latest_commit_date
    readme_title = $RepositoryRecord.readme_title
    readme_preview = $RepositoryRecord.readme_preview
    include_in_public_page = [bool]$RepositoryRecord.include_in_public_page
    include_in_pdf_exhibit = [bool]$RepositoryRecord.include_in_pdf_exhibit
    mention_strategy = [string]$RepositoryRecord.mention_strategy
    sensitivity_level = [string]$RepositoryRecord.sensitivity_level
    confidence_label = [string]$RepositoryRecord.confidence_label
    manual_review_required = [bool]$RepositoryRecord.manual_review_required
    rationale = $RepositoryRecord.rationale
    project_unit_ids = @($RepositoryRecord.project_unit_ids)
    notes = @($RepositoryRecord.notes)
  }
}

function Convert-ToPdfCandidateRepository {
  param([Parameter(Mandatory = $true)][object]$RepositoryRecord)

  return [ordered]@{
    id = $RepositoryRecord.id
    slug = $RepositoryRecord.slug
    name = $RepositoryRecord.name
    full_name = $RepositoryRecord.full_name
    owner = $RepositoryRecord.owner
    owner_label = $RepositoryRecord.owner_label
    relationship = $RepositoryRecord.relationship
    portfolio = $RepositoryRecord.portfolio
    visibility = $RepositoryRecord.visibility
    private = [bool]$RepositoryRecord.private
    archived = [bool]$RepositoryRecord.archived
    fork = [bool]$RepositoryRecord.fork
    kind = $RepositoryRecord.kind
    status = $RepositoryRecord.status
    description = $RepositoryRecord.description
    homepage = if ($RepositoryRecord.visibility -eq "public") { $RepositoryRecord.homepage } else { $null }
    html_url = $RepositoryRecord.public_url
    public_url = $RepositoryRecord.public_url
    default_branch = $RepositoryRecord.default_branch
    created_at = $RepositoryRecord.created_at
    updated_at = $RepositoryRecord.updated_at
    pushed_at = $RepositoryRecord.pushed_at
    language = $RepositoryRecord.language
    size = $RepositoryRecord.size
    topics = @($RepositoryRecord.topics)
    license = $RepositoryRecord.license
    has_local_evidence = [bool]$RepositoryRecord.has_local_evidence
    current_branch = $RepositoryRecord.current_branch
    head_commit = $RepositoryRecord.head_commit
    head_commit_date = $RepositoryRecord.head_commit_date
    commit_count = $RepositoryRecord.commit_count
    earliest_commit_date = $RepositoryRecord.earliest_commit_date
    earliest_commit_hash = $RepositoryRecord.earliest_commit_hash
    latest_commit_date = $RepositoryRecord.latest_commit_date
    latest_commit_hash = $RepositoryRecord.latest_commit_hash
    readme_title = $RepositoryRecord.readme_title
    readme_preview = $RepositoryRecord.readme_preview
    include_in_public_page = [bool]$RepositoryRecord.include_in_public_page
    include_in_pdf_exhibit = [bool]$RepositoryRecord.include_in_pdf_exhibit
    mention_strategy = [string]$RepositoryRecord.mention_strategy
    sensitivity_level = [string]$RepositoryRecord.sensitivity_level
    confidence_label = [string]$RepositoryRecord.confidence_label
    manual_review_required = [bool]$RepositoryRecord.manual_review_required
    rationale = $RepositoryRecord.rationale
    project_unit_ids = @($RepositoryRecord.project_unit_ids)
    notes = @($RepositoryRecord.notes)
  }
}

function Convert-ToPublicCandidateUnit {
  param([Parameter(Mandatory = $true)][object]$Unit)

  return [ordered]@{
    id = $Unit.id
    repositoryId = $Unit.repositoryId
    repositorySlug = $Unit.repositorySlug
    repositoryFullName = $Unit.repositoryFullName
    repositoryOwner = $Unit.repositoryOwner
    repositoryVisibility = $Unit.repositoryVisibility
    repositoryRelationship = $Unit.repositoryRelationship
    sourceType = $Unit.sourceType
    parentUnitId = $Unit.parentUnitId
    name = $Unit.name
    path = $Unit.path
    fileName = Get-OptionalPropertyValue -Object $Unit -Name "fileName"
    type = $Unit.type
    kind = $Unit.kind
    status = $Unit.status
    summary = $Unit.summary
    technologyIndicators = @($Unit.technologyIndicators)
    reuseIndicators = @($Unit.reuseIndicators)
    portfolio = $Unit.portfolio
    group = $Unit.group
    started = $Unit.started
    startedPrecision = $Unit.startedPrecision
    ended = $Unit.ended
    endedPrecision = $Unit.endedPrecision
    commitCount = $Unit.commitCount
    earliestCommitDate = $Unit.earliestCommitDate
    latestCommitDate = $Unit.latestCommitDate
    include_in_public_page = [bool]$Unit.include_in_public_page
    include_in_pdf_exhibit = [bool]$Unit.include_in_pdf_exhibit
    mention_strategy = [string]$Unit.mention_strategy
    sensitivity_level = [string]$Unit.sensitivity_level
    confidence_label = [string]$Unit.confidence_label
    manual_review_required = [bool]$Unit.manual_review_required
    publicVisibilityRecommendation = $Unit.publicVisibilityRecommendation
    pdfInclusionRecommendation = $Unit.pdfInclusionRecommendation
    rationale = $Unit.rationale
    publicLinks = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "publicLinks"))
    evidencePublic = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "evidencePublic"))
    relatedIds = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "relatedIds"))
    notes = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "notes"))
    domains = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "domains"))
  }
}

function Convert-ToPdfCandidateUnit {
  param([Parameter(Mandatory = $true)][object]$Unit)

  return [ordered]@{
    id = $Unit.id
    repositoryId = $Unit.repositoryId
    repositorySlug = $Unit.repositorySlug
    repositoryFullName = $Unit.repositoryFullName
    repositoryOwner = $Unit.repositoryOwner
    repositoryVisibility = $Unit.repositoryVisibility
    repositoryRelationship = $Unit.repositoryRelationship
    sourceType = $Unit.sourceType
    parentUnitId = $Unit.parentUnitId
    name = $Unit.name
    path = $Unit.path
    fileName = Get-OptionalPropertyValue -Object $Unit -Name "fileName"
    type = $Unit.type
    kind = $Unit.kind
    status = $Unit.status
    summary = $Unit.summary
    technologyIndicators = @($Unit.technologyIndicators)
    reuseIndicators = @($Unit.reuseIndicators)
    portfolio = $Unit.portfolio
    group = $Unit.group
    started = $Unit.started
    startedPrecision = $Unit.startedPrecision
    ended = $Unit.ended
    endedPrecision = $Unit.endedPrecision
    commitCount = $Unit.commitCount
    earliestCommitDate = $Unit.earliestCommitDate
    earliestCommitHash = Get-OptionalPropertyValue -Object $Unit -Name "earliestCommitHash"
    latestCommitDate = $Unit.latestCommitDate
    latestCommitHash = Get-OptionalPropertyValue -Object $Unit -Name "latestCommitHash"
    currentBranch = Get-OptionalPropertyValue -Object $Unit -Name "currentBranch"
    headCommit = Get-OptionalPropertyValue -Object $Unit -Name "headCommit"
    headCommitDate = Get-OptionalPropertyValue -Object $Unit -Name "headCommitDate"
    include_in_public_page = [bool]$Unit.include_in_public_page
    include_in_pdf_exhibit = [bool]$Unit.include_in_pdf_exhibit
    mention_strategy = [string]$Unit.mention_strategy
    sensitivity_level = [string]$Unit.sensitivity_level
    confidence_label = [string]$Unit.confidence_label
    manual_review_required = [bool]$Unit.manual_review_required
    publicVisibilityRecommendation = $Unit.publicVisibilityRecommendation
    pdfInclusionRecommendation = $Unit.pdfInclusionRecommendation
    rationale = $Unit.rationale
    publicLinks = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "publicLinks"))
    evidencePublic = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "evidencePublic"))
    relatedIds = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "relatedIds"))
    notes = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "notes"))
    domains = @(Convert-ToArray -Value (Get-OptionalPropertyValue -Object $Unit -Name "domains"))
  }
}

function Write-ReviewSummaryMarkdown {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][object]$MasterDocument
  )

  $repositoryCount = @($MasterDocument.repositories).Count
  $projectUnitCount = @($MasterDocument.projectUnits).Count
  $orgCount = @($MasterDocument.organizations).Count
  $publicCount = @($MasterDocument.repositories | Where-Object { $_.visibility -eq "public" }).Count
  $privateCount = @($MasterDocument.repositories | Where-Object { $_.visibility -eq "private" }).Count
  $internalCount = @($MasterDocument.repositories | Where-Object { $_.visibility -eq "internal" }).Count
  $manualReviewCount = @($MasterDocument.reviewFlags | Where-Object { $_.severity -in @("medium", "high") }).Count

  $kindTotals = @{}
  foreach ($unit in @($MasterDocument.projectUnits)) {
    $kind = if ([string]::IsNullOrWhiteSpace([string]$unit.kind)) { "unknown" } else { [string]$unit.kind }
    if (-not $kindTotals.ContainsKey($kind)) {
      $kindTotals[$kind] = 0
    }
    $kindTotals[$kind] += 1
  }

  $lines = New-Object System.Collections.Generic.List[string]
  $lines.Add("# Prior Art Inventory Review Summary")
  $lines.Add("")
  $lines.Add(("Generated: {0}" -f $MasterDocument.generatedAt))
  $lines.Add("")
  $lines.Add("## Snapshot")
  $lines.Add("")
  $lines.Add(("- Organizations found: {0}" -f $orgCount))
  $lines.Add(("- Repositories found: {0}" -f $repositoryCount))
  $lines.Add(("- Public repositories: {0}" -f $publicCount))
  $lines.Add(("- Private repositories: {0}" -f $privateCount))
  $lines.Add(("- Internal repositories: {0}" -f $internalCount))
  $lines.Add(("- Project units discovered: {0}" -f $projectUnitCount))
  $lines.Add(("- Review flags: {0}" -f @($MasterDocument.reviewFlags).Count))
  $lines.Add(("- Items needing manual review: {0}" -f $manualReviewCount))
  $lines.Add("")

  $lines.Add("## Top Categories")
  $lines.Add("")
  foreach ($pair in ($kindTotals.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10)) {
    $lines.Add(("- {0}: {1}" -f $pair.Key, $pair.Value))
  }

  $lines.Add("")
  $lines.Add("## Repositories Needing Review")
  $lines.Add("")

  $flaggedRepos = @($MasterDocument.reviewFlags | Where-Object { $_.targetType -eq "repository" } | Select-Object -First 20)
  if ($flaggedRepos.Count -eq 0) {
    $lines.Add("- None.")
  }
  else {
    foreach ($flag in $flaggedRepos) {
      $lines.Add(("- {0}: {1}" -f $flag.targetId, $flag.message))
    }
  }

  $lines.Add("")
  $lines.Add("## Project Units Needing Review")
  $lines.Add("")

  $flaggedUnits = @($MasterDocument.reviewFlags | Where-Object { $_.targetType -eq "projectUnit" } | Select-Object -First 20)
  if ($flaggedUnits.Count -eq 0) {
    $lines.Add("- None.")
  }
  else {
    foreach ($flag in $flaggedUnits) {
      $lines.Add(("- {0}: {1}" -f $flag.targetId, $flag.message))
    }
  }

  $lines.Add("")
  $lines.Add("## Notes")
  $lines.Add("")
  foreach ($note in @($MasterDocument.generationNotes)) {
    $lines.Add(("- {0}" -f $note))
  }

  Set-Content -LiteralPath $Path -Value $lines -Encoding utf8
}

function Write-RepositoryCatalogDocument {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$GeneratedAt,
    [AllowNull()][object[]]$Repositories
  )

  $document = [ordered]@{
    version = 1
    updated = $GeneratedAt.Substring(0, 10)
    repositories = @(@($Repositories) | ForEach-Object { Convert-ToRepositoryCatalogRecord -RepositoryRecord $_ })
  }

  Write-JsonFile -Path $Path -InputObject $document -Depth 20
}

function Write-InventoryOutputs {
  param(
    [Parameter(Mandatory = $true)][object]$MasterDocument,
    [Parameter(Mandatory = $true)][string]$OutMaster,
    [Parameter(Mandatory = $true)][string]$OutPublic,
    [Parameter(Mandatory = $true)][string]$OutPdf,
    [Parameter(Mandatory = $true)][string]$OutSummary,
    [Parameter(Mandatory = $true)][string]$OutRepoCatalog
  )

  $publicRepositories = @($MasterDocument.repositories | Where-Object { $_.include_in_public_page })
  $pdfRepositories = @($MasterDocument.repositories | Where-Object { $_.include_in_pdf_exhibit })
  $publicUnits = @($MasterDocument.projectUnits | Where-Object { $_.include_in_public_page })
  $pdfUnits = @($MasterDocument.projectUnits | Where-Object { $_.include_in_pdf_exhibit })

  $publicDocument = [ordered]@{
    version = $MasterDocument.version
    generatedAt = $MasterDocument.generatedAt
    generatedBy = $MasterDocument.generatedBy
    repositories = @($publicRepositories | ForEach-Object { Convert-ToPublicCandidateRepository -RepositoryRecord $_ })
    projectUnits = @($publicUnits | ForEach-Object { Convert-ToPublicCandidateUnit -Unit $_ })
    timelineNotes = @($MasterDocument.timelineNotes)
    generationNotes = @($MasterDocument.generationNotes)
  }

  $pdfDocument = [ordered]@{
    version = $MasterDocument.version
    generatedAt = $MasterDocument.generatedAt
    generatedBy = $MasterDocument.generatedBy
    repositories = @($pdfRepositories | ForEach-Object { Convert-ToPdfCandidateRepository -RepositoryRecord $_ })
    projectUnits = @($pdfUnits | ForEach-Object { Convert-ToPdfCandidateUnit -Unit $_ })
    timelineNotes = @($MasterDocument.timelineNotes)
    generationNotes = @($MasterDocument.generationNotes)
  }

  Write-JsonFile -Path $OutMaster -InputObject $MasterDocument -Depth 30
  Write-JsonFile -Path $OutPublic -InputObject $publicDocument -Depth 25
  Write-JsonFile -Path $OutPdf -InputObject $pdfDocument -Depth 25
  Write-ReviewSummaryMarkdown -Path $OutSummary -MasterDocument $MasterDocument
  Write-RepositoryCatalogDocument -Path $OutRepoCatalog -GeneratedAt $MasterDocument.generatedAt -Repositories @($MasterDocument.repositories)
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

$generationNotes = New-Object System.Collections.Generic.List[string]
$reviewFlags = New-Object System.Collections.Generic.List[object]
$failures = New-Object System.Collections.Generic.List[object]

$localEvidenceResult = Invoke-LocalEvidenceExport -Roots @($resolvedRoots) -ConfigFile $ConfigFile -Recurse:$Recurse -UseGhCli:$UseGhCli
$localEvidenceDocument = $localEvidenceResult.document
if (-not $localEvidenceResult.success) {
  $generationNotes.Add(("Local evidence export did not complete cleanly: {0}" -f $localEvidenceResult.error))
  $failures.Add([ordered]@{
    stage = "local-evidence-export"
    message = $localEvidenceResult.error
  })
  $localEvidenceDocument = [pscustomobject]@{
    entries = @()
    roots = @($resolvedRoots)
    generatedAt = [DateTimeOffset]::UtcNow.ToString("o")
  }
}

$localEvidenceIndexes = Get-LocalEvidenceIndexes -Document $localEvidenceDocument

$githubIdentity = $null
try {
  $githubIdentity = Get-GithubIdentity
}
catch {
  $failures.Add([ordered]@{
    stage = "github-identity"
    message = $_.Exception.Message
  })
}

$githubOrganizations = @()
try {
  $githubOrganizations = @(Get-GithubOrganizations)
}
catch {
  $failures.Add([ordered]@{
    stage = "github-organizations"
    message = $_.Exception.Message
  })
}

$githubRepositories = @()
try {
  $githubRepositories = @(Get-GithubRepositories)
}
catch {
  $failures.Add([ordered]@{
    stage = "github-repositories"
    message = $_.Exception.Message
  })
}

$repositoryRecords = New-Object System.Collections.Generic.List[object]
$repositoryBySlug = @{}
$repositoryById = @{}
$projectUnits = New-Object System.Collections.Generic.List[object]
$rootUnitIdsBySlug = @{}
$childUnitIdsByRootId = @{}
$inspectedRepositorySlugs = New-Object System.Collections.Generic.HashSet[string]

foreach ($repository in $githubRepositories) {
  $slug = [string]$repository.full_name
  $localEvidence = $localEvidenceIndexes.bySlug[$slug.ToLowerInvariant()]
  $record = Build-RepositoryRecord -Repository $repository -LocalEvidence $localEvidence -Identity $githubIdentity -Organizations $githubOrganizations
  $repositoryRecords.Add($record)
  $repositoryBySlug[$slug.ToLowerInvariant()] = $record
  $repositoryById[$record.id] = $record

  $rootUnit = Build-RepositoryRootUnit -RepositoryRecord $record
  $projectUnits.Add($rootUnit)
  $record.project_unit_ids = @($record.project_unit_ids + $rootUnit.id)
  $rootUnitIdsBySlug[$slug.ToLowerInvariant()] = $rootUnit.id
  $childUnitIdsByRootId[$rootUnit.id] = New-Object System.Collections.Generic.List[string]

  if ($record.has_local_evidence -and -not [string]::IsNullOrWhiteSpace([string]$record.local_path) -and (Test-Path -LiteralPath $record.local_path)) {
    $inspectedRepositorySlugs.Add($slug.ToLowerInvariant()) | Out-Null
    $manifestFiles = Find-RepositoryManifestFiles -RepositoryPath $record.local_path
    foreach ($manifestFile in $manifestFiles) {
      if ($null -eq $manifestFile) {
        continue
      }

      $unit = Build-ManifestUnit -RepositoryRecord $record -RepositoryPath $record.local_path -ManifestFile $manifestFile -ParentUnitId $rootUnit.id
      $projectUnits.Add($unit)
      $record.project_unit_ids = @($record.project_unit_ids + $unit.id)
      $childUnitIdsByRootId[$rootUnit.id].Add($unit.id)

      if ($unit.manual_review_required) {
        $reviewFlags.Add([ordered]@{
          id = ("review:{0}" -f $unit.id)
          targetId = $unit.id
          targetType = "projectUnit"
          severity = "medium"
          message = "Manifest history could not be resolved completely."
        })
      }
    }
  }
  else {
    $reviewFlags.Add([ordered]@{
      id = ("review:{0}" -f $record.id)
      targetId = $record.id
      targetType = "repository"
      severity = "medium"
      message = "No local checkout matched this repository under the configured roots."
    })
  }

  if ($record.manual_review_required) {
    $reviewFlags.Add([ordered]@{
      id = ("review:{0}:classification" -f $record.id)
      targetId = $record.id
      targetType = "repository"
      severity = "low"
      message = "Repository classification is based on heuristic inference and should be reviewed."
    })
  }
}

foreach ($manualEntry in $localEvidenceIndexes.manualEntries) {
  $unit = Build-ManualUnit -ManualEntry $manualEntry
  $projectUnits.Add($unit)

  if ($unit.manual_review_required) {
    $reviewFlags.Add([ordered]@{
      id = ("review:{0}" -f $unit.id)
      targetId = $unit.id
      targetType = "projectUnit"
      severity = "medium"
      message = "Manual supplement entry should be reviewed before publication."
    })
  }
}

foreach ($rootUnitId in @($childUnitIdsByRootId.Keys)) {
  $childIds = @($childUnitIdsByRootId[$rootUnitId])
  $rootUnit = $projectUnits | Where-Object { $_.id -eq $rootUnitId } | Select-Object -First 1
  if ($null -ne $rootUnit) {
    $rootUnit.relatedIds = @($childIds)
  }
}

$repositoryVisibilityCounts = @{
  public = 0
  private = 0
  internal = 0
}
foreach ($repository in $repositoryRecords) {
  if ($repositoryVisibilityCounts.ContainsKey($repository.visibility)) {
    $repositoryVisibilityCounts[$repository.visibility] += 1
  }
}

$kindCounts = @{}
foreach ($unit in $projectUnits) {
  $kind = if ([string]::IsNullOrWhiteSpace([string]$unit.kind)) { "unknown" } else { [string]$unit.kind }
  if (-not $kindCounts.ContainsKey($kind)) {
    $kindCounts[$kind] = 0
  }
  $kindCounts[$kind] += 1
}

$timelineNotes = @(
  "Earliest dates come from local git history when a checkout exists; otherwise GitHub repository creation and push dates are used.",
  "Manifest units use file-level commit history when available so the timeline can be reconstructed from the discovered project files.",
  "Public candidate and PDF candidate views omit local filesystem paths and private repository remotes."
)

$generationNotes.Add(("Excluded {0} PayeWaive repositories from the GitHub inventory by request." -f (@($githubRepositories | Where-Object { $_.full_name -match '^(?i)PayeWaive/' }).Count)))
if ($localEvidenceResult.success) {
  $generationNotes.Add("Local evidence export completed successfully and was merged into the master inventory.")
}

$resolvedRootArray = @($resolvedRoots.ToArray())
$githubOrganizationArray = @($githubOrganizations)
$repositoryRecordArray = @($repositoryRecords.ToArray())
$projectUnitArray = @($projectUnits.ToArray())
$reviewFlagArray = @($reviewFlags.ToArray())
$generationNoteArray = @($generationNotes.ToArray())
$failureArray = @($failures.ToArray())
$timelineNoteArray = @($timelineNotes)

$masterDocument = [ordered]@{
  version = 1
  generatedAt = [DateTimeOffset]::UtcNow.ToString("o")
  generatedBy = [ordered]@{
    script = "scripts/prior-art/inventory-github.ps1"
    roots = $resolvedRootArray
    configFile = $ConfigFile
    recurse = [bool]$Recurse
    useGhCli = [bool]$UseGhCli
  }
  sourceRoots = $resolvedRootArray
  githubIdentity = $githubIdentity
  organizations = $githubOrganizationArray
  repositories = $repositoryRecordArray
  projectUnits = $projectUnitArray
  timelineNotes = $timelineNoteArray
  reviewFlags = $reviewFlagArray
  generationNotes = $generationNoteArray
  failures = $failureArray
  repositoryVisibilityCounts = $repositoryVisibilityCounts
  kindCounts = $kindCounts
}

$outMasterPath = Resolve-FullPath -Path $OutMaster -AllowMissing
$outPublicPath = Resolve-FullPath -Path $OutPublic -AllowMissing
$outPdfPath = Resolve-FullPath -Path $OutPdf -AllowMissing
$outSummaryPath = Resolve-FullPath -Path $OutSummary -AllowMissing
$outRepoCatalogPath = Resolve-FullPath -Path $OutRepoCatalog -AllowMissing

Ensure-ParentDirectory -Path $outMasterPath
Ensure-ParentDirectory -Path $outPublicPath
Ensure-ParentDirectory -Path $outPdfPath
Ensure-ParentDirectory -Path $outSummaryPath
Ensure-ParentDirectory -Path $outRepoCatalogPath

Write-InventoryOutputs -MasterDocument $masterDocument -OutMaster $outMasterPath -OutPublic $outPublicPath -OutPdf $outPdfPath -OutSummary $outSummaryPath -OutRepoCatalog $outRepoCatalogPath

Write-Host ("Wrote {0}" -f $outMasterPath)
Write-Host ("Wrote {0}" -f $outPublicPath)
Write-Host ("Wrote {0}" -f $outPdfPath)
Write-Host ("Wrote {0}" -f $outSummaryPath)
Write-Host ("Wrote {0}" -f $outRepoCatalogPath)
