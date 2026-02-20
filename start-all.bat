@echo off
echo Killing all Node.js processes and cleaning ports...
echo.

taskkill /F /IM node.exe 2>nul

if %errorlevel% equ 0 (
    echo [OK] All Node.js processes killed
) else (
    echo [!] No Node.js processes found
)

echo.
echo Waiting for ports to be released...
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo Starting Heduschka Platform
echo ========================================
echo.

REM Check dependencies
if not exist "Backend\node_modules\" (
    echo Installing Backend dependencies...
    cd Backend
    call npm install
    cd ..
)

if not exist "node_modules\" (
    echo Installing Frontend dependencies...
    call npm install
)

echo Starting Backend (Port 3002)...
start "Heduschka Backend" cmd /k "cd Backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend (Port 3000)...
start "Heduschka Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo Backend API:  http://localhost:3002
echo Frontend PWA: http://localhost:3000
echo Health Check: http://localhost:3002/health
echo ========================================
echo.
echo Press any key to exit...
pause > nul
