$ErrorActionPreference = "Stop"

$env:A11Y_BASE_URL = "http://localhost:4321"
Write-Host "Using A11Y_BASE_URL=$($env:A11Y_BASE_URL)"

npm run a11y
