# St. Paul History Portal - Quick Deploy Script
# Choose your deployment option below

Write-Host "🏛️ St. Paul Historical Knowledge Portal - Deployment Options" -ForegroundColor Cyan
Write-Host ""

Write-Host "Your project is ready to deploy! Choose an option:" -ForegroundColor Green
Write-Host ""

Write-Host "Option 1: Deploy to Vercel (Fastest - 5 minutes)" -ForegroundColor Yellow
Write-Host "  1. Install: npm install -g vercel"
Write-Host "  2. Login:   vercel login"
Write-Host "  3. Deploy:  vercel --prod"
Write-Host ""

Write-Host "Option 2: Deploy to Azure (Full-featured)" -ForegroundColor Yellow
Write-Host "  1. Install: winget install Microsoft.AzureCLI"
Write-Host "  2. Login:   az login"
Write-Host "  3. See DEPLOYMENT_GUIDE.md for complete steps"
Write-Host ""

Write-Host "Option 3: Push to GitHub first" -ForegroundColor Yellow
Write-Host "  1. Install GitHub CLI: winget install GitHub.cli"
Write-Host "  2. Create repo: gh repo create SaintPaul --public --source=. --push"
Write-Host ""

Write-Host "Choose your preferred option (1, 2, or 3):" -ForegroundColor Cyan
$choice = Read-Host

switch ($choice) {
    "1" {
        Write-Host "`n🚀 Starting Vercel deployment..." -ForegroundColor Green
        
        # Check if Vercel is installed
        if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
            Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        Write-Host "`nNow run: vercel login" -ForegroundColor Cyan
        Write-Host "Then run: vercel --prod" -ForegroundColor Cyan
        Write-Host "`nYou'll need a MongoDB connection string. Get one free at:" -ForegroundColor Yellow
        Write-Host "https://www.mongodb.com/cloud/atlas" -ForegroundColor Blue
    }
    
    "2" {
        Write-Host "`n☁️ Starting Azure deployment..." -ForegroundColor Green
        
        # Check if Azure CLI is installed
        if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
            Write-Host "Installing Azure CLI..." -ForegroundColor Yellow
            winget install Microsoft.AzureCLI
        }
        
        Write-Host "`nNow run: az login" -ForegroundColor Cyan
        Write-Host "Then see DEPLOYMENT_GUIDE.md for complete steps" -ForegroundColor Cyan
        
        # Open deployment guide
        Start-Process "DEPLOYMENT_GUIDE.md"
    }
    
    "3" {
        Write-Host "`n🐙 Pushing to GitHub..." -ForegroundColor Green
        
        # Check if GitHub CLI is installed
        if (Get-Command gh -ErrorAction SilentlyContinue) {
            Write-Host "Creating GitHub repository..." -ForegroundColor Yellow
            gh repo create SaintPaul --public --source=. --remote=origin --push
            Write-Host "`n✅ Repository created and pushed!" -ForegroundColor Green
        } else {
            Write-Host "GitHub CLI not found. Manual steps:" -ForegroundColor Yellow
            Write-Host "1. Go to https://github.com/new" -ForegroundColor Cyan
            Write-Host "2. Create repository named 'SaintPaul'" -ForegroundColor Cyan
            Write-Host "3. Run these commands:" -ForegroundColor Cyan
            Write-Host "   git remote add origin https://github.com/Weave0/SaintPaul.git"
            Write-Host "   git push -u origin main"
        }
    }
    
    default {
        Write-Host "`nInvalid choice. Please run this script again and choose 1, 2, or 3." -ForegroundColor Red
    }
}

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - DEPLOYMENT_GUIDE.md - Complete deployment instructions"
Write-Host "  - DATA_COLLECTION_ROADMAP.md - Comprehensive data sources"
Write-Host "  - PROJECT_DEPLOYMENT_SUMMARY.md - Full project overview"
Write-Host ""
Write-Host "🎨 Ready to share St. Paul's history with the world!" -ForegroundColor Green
