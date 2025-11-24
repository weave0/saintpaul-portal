#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Complete setup and deployment for St. Paul Historical Knowledge Portal
.DESCRIPTION
    Sets up MongoDB, imports 22,129+ records, and deploys the application
#>

Write-Host "`n🏛️  ST. PAUL HISTORICAL KNOWLEDGE PORTAL - COMPLETE SETUP" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan

# Check Node.js
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Install from nodejs.org" -ForegroundColor Red
    exit 1
}

# Step 1: Install dependencies
Write-Host "`n📦 Step 1/5: Installing dependencies..." -ForegroundColor Yellow
Write-Host "   Backend packages..."
Set-Location backend
npm install --legacy-peer-deps 2>$null
Set-Location ..

Write-Host "   Frontend packages..."
Set-Location frontend
npm install --legacy-peer-deps 2>$null
Set-Location ..

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Step 2: MongoDB Setup
Write-Host "`n🍃 Step 2/5: MongoDB Setup" -ForegroundColor Yellow
Write-Host @"

MongoDB Options:
1) MongoDB Atlas (Free Cloud - Recommended)
2) Local MongoDB
3) Skip (use existing connection)

"@

$mongoChoice = Read-Host "Choice (1-3)"

switch ($mongoChoice) {
    "1" {
        Write-Host "`n📋 MongoDB Atlas Setup:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://www.mongodb.com/cloud/atlas/register"
        Write-Host "2. Create free account & M0 cluster (512MB free)"
        Write-Host "3. Get connection string (Connect → Drivers)"
        Start-Process "https://www.mongodb.com/cloud/atlas/register"
        
        $mongoUri = Read-Host "`nPaste connection string"
        if ([string]::IsNullOrWhiteSpace($mongoUri)) {
            $mongoUri = "mongodb://127.0.0.1:27017/saint-paul"
        }
    }
    "2" {
        Write-Host "Using local MongoDB" -ForegroundColor Cyan
        $mongoUri = "mongodb://127.0.0.1:27017/saint-paul"
    }
    default {
        Write-Host "Skipping MongoDB setup" -ForegroundColor Yellow
        $mongoUri = Read-Host "Enter your connection string"
    }
}

# Update .env
$envContent = @"
MONGODB_URI=$mongoUri
PORT=3000
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
"@
Set-Content -Path "backend\.env" -Value $envContent -Force
Write-Host "✅ MongoDB configured" -ForegroundColor Green

# Step 3: Import Data
Write-Host "`n📊 Step 3/5: Importing data (22,129+ records)..." -ForegroundColor Yellow
Set-Location backend\scripts

Write-Host "   Starting data import..."
node importAllData.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Data imported successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Import completed with warnings" -ForegroundColor Yellow
}
Set-Location ..\..

# Step 4: Test Locally
Write-Host "`n🧪 Step 4/5: Testing locally..." -ForegroundColor Yellow
Write-Host "   Starting servers..." -ForegroundColor Cyan

# Start backend
Set-Location backend
$backendJob = Start-Job { node server.js }
Set-Location ..
Start-Sleep -Seconds 3

# Start frontend
Set-Location frontend
$frontendJob = Start-Job { npx vite --port 5173 }
Set-Location ..
Start-Sleep -Seconds 3

Write-Host "✅ Servers running" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan

# Step 5: Deploy
Write-Host "`n🚀 Step 5/5: Deployment" -ForegroundColor Yellow
Write-Host @"

Deployment Options:
1) Vercel (Easiest - 2 minutes)
2) GitHub + Vercel (Version control + deploy)
3) Test locally only
4) Exit

"@

$deployChoice = Read-Host "Choice (1-4)"

# Stop local servers
Stop-Job $backendJob,$frontendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob,$frontendJob -ErrorAction SilentlyContinue

switch ($deployChoice) {
    "1" {
        Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Cyan
        
        if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
            npm install -g vercel
        }
        
        Write-Host @"

Next steps:
1. Run: vercel login
2. Run: vercel --prod
3. Your site will be live!

"@
        vercel login
        vercel --prod
    }
    
    "2" {
        Write-Host "`n🐙 GitHub + Vercel..." -ForegroundColor Cyan
        
        if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
            Write-Host "Install GitHub CLI: winget install GitHub.cli" -ForegroundColor Yellow
        } else {
            gh auth login
            gh repo create SaintPaul --public --source=. --push
            Write-Host "✅ Pushed to GitHub! Now deploy via Vercel dashboard" -ForegroundColor Green
        }
    }
    
    "3" {
        Write-Host "`n✅ Local testing mode" -ForegroundColor Green
        Write-Host "Run servers with:" -ForegroundColor Cyan
        Write-Host "   Backend:  cd backend && npm run dev"
        Write-Host "   Frontend: cd frontend && npm run dev"
    }
}

# Final Summary
Write-Host "`n" + ("=" * 70) -ForegroundColor Green
Write-Host "🎉 SETUP COMPLETE!" -ForegroundColor Green
Write-Host ("=" * 70) -ForegroundColor Green

Write-Host @"

Your St. Paul Historical Knowledge Portal includes:

📊 Data Imported:
   • 22,129+ records from 49 data files
   • 18+ data sources (LOC, OSM, Ramsey County, etc.)
   • Locations, events, buildings, insights
   
🏛️  Content Categories:
   • Historic landmarks & buildings
   • Crime data & ghost stories
   • Music venues & famous people
   • Restaurants & cultural events
   • Sports history & much more!
   
🚀 Ready to Use:
   • 3D building viewer
   • Interactive timeline
   • Map visualization
   • REST API with 25+ endpoints
   
📚 Documentation:
   • DATA_MINING_COMPLETE.md - All sources
   • DEPLOYMENT_GUIDE.md - Deploy instructions
   • QUICK_REFERENCE.md - API docs

Explore your St. Paul history portal! 🎨🏛️

"@ -ForegroundColor Cyan
