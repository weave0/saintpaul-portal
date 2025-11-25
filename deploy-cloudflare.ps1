# St. Paul Mystical Portal - Deploy to Cloudflare Pages
# Deploy to: saintpaul.globaldeets.com
# Owner: Brett Weaver

Write-Host "🌌 Deploying St. Paul Mystical Portal to Cloudflare Pages..." -ForegroundColor Cyan
Write-Host "   Domain: saintpaul.globaldeets.com" -ForegroundColor Magenta
Write-Host ""

# Check if wrangler is installed
$wranglerInstalled = Get-Command wrangler -ErrorAction SilentlyContinue
if (-not $wranglerInstalled) {
    Write-Host "📦 Installing Wrangler CLI..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Build frontend
Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
cd z:\SaintPaul\frontend
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Check if logged in to Cloudflare
Write-Host "🔐 Checking Cloudflare authentication..." -ForegroundColor Yellow
$loginCheck = wrangler whoami 2>&1
if ($loginCheck -match "not authenticated") {
    Write-Host "🔑 Please login to Cloudflare..." -ForegroundColor Yellow
    wrangler login
}

# Deploy to Cloudflare Pages
Write-Host "🚀 Deploying to Cloudflare Pages..." -ForegroundColor Yellow
Write-Host ""
cd dist
wrangler pages deploy . --project-name=saintpaul-portal --branch=main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Add custom domain in Cloudflare Dashboard:" -ForegroundColor White
Write-Host "   → Pages → saintpaul-portal → Custom domains" -ForegroundColor Gray
Write-Host "   → Add: saintpaul.globaldeets.com" -ForegroundColor Gray
Write-Host "   → Add: stpaul.globaldeets.com (alias)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Set environment variables:" -ForegroundColor White
Write-Host "   → VITE_MAPBOX_TOKEN = your_mapbox_token" -ForegroundColor Gray
Write-Host "   → VITE_API_BASE_URL = https://your-backend-url.railway.app" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy backend to Railway:" -ForegroundColor White
Write-Host "   → cd z:\SaintPaul\backend" -ForegroundColor Gray
Write-Host "   → railway init --name saintpaul-api" -ForegroundColor Gray
Write-Host "   → railway up" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Visit your portal:" -ForegroundColor White
Write-Host "   🌍 https://saintpaul.globaldeets.com/map" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Where history glows - now globally!" -ForegroundColor Magenta
