# Deploy backend to Railway with CORS fix
Write-Host "🚂 Deploying St. Paul API to Railway..." -ForegroundColor Cyan

# Ensure we're logged in
railway whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Railway. Run 'railway login' first." -ForegroundColor Red
    exit 1
}

# Link to project if not already linked
railway link

# Deploy
Write-Host "📦 Deploying backend..." -ForegroundColor Yellow
railway up

Write-Host "✅ Deployment initiated! Check Railway dashboard for status." -ForegroundColor Green
Write-Host "🌐 Your API should be live at: https://saintpaul-api.railway.app" -ForegroundColor Cyan
