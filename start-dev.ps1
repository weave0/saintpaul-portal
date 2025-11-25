# Saint Paul Mystical Portal - Development Server
# Owner: Brett Weaver
# Created: November 24, 2025

Write-Host "🌌 Starting St. Paul Mystical Portal..." -ForegroundColor Cyan
Write-Host "   Where history glows ✨" -ForegroundColor Magenta
Write-Host ""

# Check if Mapbox token is configured
$frontendEnv = "z:\SaintPaul\frontend\.env.local"
if (Test-Path $frontendEnv) {
    $tokenCheck = Select-String -Path $frontendEnv -Pattern "VITE_MAPBOX_TOKEN=pk\."
    if (-not $tokenCheck) {
        Write-Host "⚠️  WARNING: Mapbox token not configured!" -ForegroundColor Red
        Write-Host "   Get your token from: https://account.mapbox.com/" -ForegroundColor Yellow
        Write-Host "   Then update: frontend\.env.local" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Start backend on port 3000
Write-Host "📡 Starting backend API server (port 3000)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd z:\SaintPaul\backend; npm run dev" -WindowStyle Normal

# Wait for backend to initialize
Write-Host "   Waiting for MongoDB connection..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Start frontend on port 5173 (Vite default)
Write-Host "🎨 Starting frontend dev server (port 5173)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd z:\SaintPaul\frontend; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✨ Development servers launched!" -ForegroundColor Green
Write-Host ""
Write-Host "🌍 Frontend: http://localhost:5173/map" -ForegroundColor Cyan
Write-Host "📊 Backend:  http://localhost:3000/api/locations" -ForegroundColor Cyan
Write-Host "🗄️  Database: MongoDB Atlas (saint-paul)" -ForegroundColor Cyan
Write-Host ""
Write-Host "👁️  Open your browser to: http://localhost:5173/map" -ForegroundColor Green
Write-Host ""
Write-Host "🛑 To stop: Press Ctrl+C in each terminal window" -ForegroundColor Gray
