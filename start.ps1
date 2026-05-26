# MASCOT mHealth - Startup Script
# Usage: .\start.ps1

$Root    = $PSScriptRoot
$Backend = Join-Path $Root "backend"
$Web     = Join-Path $Root "web"
$Python  = Join-Path $Backend "venv\Scripts\python.exe"
$Pip     = Join-Path $Backend "venv\Scripts\pip.exe"
$EnvFile = Join-Path $Backend ".env"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  MASCOT mHealth - Starting Up        " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Python venv
if (-not (Test-Path $Python)) {
    Write-Host "[ERROR] Python venv not found at: $Python" -ForegroundColor Red
    Write-Host "Fix: cd backend; python -m venv venv; venv\Scripts\pip install -r requirements.txt" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK]  Python venv found." -ForegroundColor Green

# 2. Fix DATABASE_URL to SQLite if needed
if (Test-Path $EnvFile) {
    $content = Get-Content $EnvFile -Raw
    if ($content -match "DATABASE_URL=postgresql") {
        Write-Host "[ENV] Switching DATABASE_URL to SQLite..." -ForegroundColor Yellow
        $content = $content -replace "DATABASE_URL=postgresql[^\r\n]*", "DATABASE_URL=sqlite:///./mascot.db"
        Set-Content -Path $EnvFile -Value $content -Encoding utf8
        Write-Host "[ENV] Done." -ForegroundColor Green
    }
}

# 3. Install/update packages
Write-Host "[BACKEND] Checking packages..." -ForegroundColor Cyan
$req = Join-Path $Backend "requirements_minimal.txt"
if (-not (Test-Path $req)) { $req = Join-Path $Backend "requirements.txt" }
& $Pip install -q -r $req --no-warn-script-location 2>&1 | Out-Null
Write-Host "[BACKEND] Packages OK." -ForegroundColor Green

# 4. Start backend in new window
Write-Host "[BACKEND] Starting FastAPI on http://localhost:8000 ..." -ForegroundColor Cyan
$cmd = "Set-Location '$Backend'; Write-Host 'MASCOT Backend starting...' -ForegroundColor Cyan; & '$Python' main.py"
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $cmd

Start-Sleep -Seconds 2

# 5. Start web app
$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($null -eq $npm) {
    Write-Host "[WEB]  npm not found - skipping web app." -ForegroundColor Yellow
    Write-Host "       Install Node.js: https://nodejs.org" -ForegroundColor Yellow
} else {
    Write-Host "[WEB]  Starting React app on http://localhost:3000 ..." -ForegroundColor Cyan
    $webCmd = "Set-Location '$Web'; Write-Host 'MASCOT Web App starting...' -ForegroundColor Cyan; npm run dev"
    Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $webCmd
    Write-Host "[WEB]  Window opened." -ForegroundColor Green
}

# 6. Summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "  All services started!               " -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend API  ->  http://localhost:8000"      -ForegroundColor White
Write-Host "  API Docs     ->  http://localhost:8000/docs" -ForegroundColor White
if ($null -ne $npm) {
    Write-Host "  Web App      ->  http://localhost:3000"  -ForegroundColor White
}
Write-Host ""
Write-Host "  Close the opened windows to stop the servers." -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to close this window"
