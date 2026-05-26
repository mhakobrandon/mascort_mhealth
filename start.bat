@echo off
title MASCOT mHealth Launcher
color 0B

echo.
echo  ======================================
echo    MASCOT mHealth - Starting Up
echo  ======================================
echo.

set BACKDIR=%~dp0backend
set WEBDIR=%~dp0web
set PYTHON=%BACKDIR%\venv\Scripts\python.exe
set ENVFILE=%BACKDIR%\.env

:: Check Python venv
if not exist "%PYTHON%" (
    echo  [ERROR]  Python venv not found at:
    echo           %BACKDIR%\venv\Scripts\python.exe
    echo.
    echo  Run this once to fix it:
    echo    cd %BACKDIR%
    echo    python -m venv venv
    echo    venv\Scripts\pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)
echo  [OK]  Python venv found.

:: Switch DATABASE_URL to SQLite if still set to PostgreSQL
if exist "%ENVFILE%" (
    findstr /C:"postgresql" "%ENVFILE%" >nul 2>&1
    if not errorlevel 1 (
        echo  [ENV]  Switching DATABASE_URL to SQLite for local dev...
        powershell -NoProfile -Command "(Get-Content '%ENVFILE%') -replace 'DATABASE_URL=postgresql[^\r\n]*','DATABASE_URL=sqlite:///./mascot.db' | Set-Content '%ENVFILE%'"
        echo  [ENV]  Done.
    )
)

:: Write backend helper script
echo @echo off > "%BACKDIR%\_run_backend.bat"
echo title MASCOT Backend - http://localhost:8000 >> "%BACKDIR%\_run_backend.bat"
echo cd /d "%BACKDIR%" >> "%BACKDIR%\_run_backend.bat"
echo echo. >> "%BACKDIR%\_run_backend.bat"
echo echo  Starting MASCOT Backend on http://localhost:8000 >> "%BACKDIR%\_run_backend.bat"
echo echo  API Docs at  http://localhost:8000/docs >> "%BACKDIR%\_run_backend.bat"
echo echo. >> "%BACKDIR%\_run_backend.bat"
echo venv\Scripts\python.exe main.py >> "%BACKDIR%\_run_backend.bat"
echo pause >> "%BACKDIR%\_run_backend.bat"

echo  [BACKEND]  Opening backend window...
start "MASCOT Backend" "%BACKDIR%\_run_backend.bat"
timeout /t 3 /nobreak >nul

:: Web app
where npm >nul 2>&1
if %errorlevel% == 0 (
    echo @echo off > "%WEBDIR%\_run_web.bat"
    echo title MASCOT Web App - http://localhost:3000 >> "%WEBDIR%\_run_web.bat"
    echo cd /d "%WEBDIR%" >> "%WEBDIR%\_run_web.bat"
    echo echo. >> "%WEBDIR%\_run_web.bat"
    echo echo  Starting MASCOT Web App on http://localhost:3000 >> "%WEBDIR%\_run_web.bat"
    echo echo. >> "%WEBDIR%\_run_web.bat"
    echo npm run dev >> "%WEBDIR%\_run_web.bat"
    echo pause >> "%WEBDIR%\_run_web.bat"

    echo  [WEB]    Opening web app window...
    start "MASCOT Web App" "%WEBDIR%\_run_web.bat"
) else (
    echo  [WEB]    npm not found - web app skipped.
    echo           Get Node.js from https://nodejs.org
)

echo.
echo  ======================================
echo    All services started!
echo  ======================================
echo.
echo    Backend API  --^>  http://localhost:8000
echo    API Docs     --^>  http://localhost:8000/docs
echo    Web App      --^>  http://localhost:3000
echo.
echo  Close the other windows to stop the servers.
echo.
pause
