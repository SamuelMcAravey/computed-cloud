$ErrorActionPreference = "Stop"

Write-Host "Building site..."
npm run build

Write-Host "Starting Cloudflare Pages preview..."
npx wrangler pages dev dist
