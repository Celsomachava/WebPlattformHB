@echo off
echo ========================================
echo Heduschka Platform - Complete Setup
echo ========================================
echo.

REM Step 1: Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js not found! Install from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js installed
echo.

REM Step 2: Install Frontend Dependencies
echo [2/6] Installing Frontend dependencies...
if not exist "node_modules\" (
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Frontend installation failed
        pause
        exit /b 1
    )
)
echo [OK] Frontend dependencies ready
echo.

REM Step 3: Install Backend Dependencies
echo [3/6] Installing Backend dependencies...
cd Backend
if not exist "node_modules\" (
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Backend installation failed
        pause
        exit /b 1
    )
)
echo [OK] Backend dependencies ready
echo.

REM Step 4: Setup Environment
echo [4/6] Setting up environment...
if not exist ".env" (
    copy .env.example .env
    echo [!] Please edit Backend\.env with your database credentials
    echo     Press any key after editing .env...
    pause > nul
)
echo [OK] Environment configured
cd ..
echo.

REM Step 5: Database Setup
echo [5/6] Database setup...
echo Do you want to setup the database now? (Y/N)
set /p setup_db=
if /i "%setup_db%"=="Y" (
    cd Backend
    call setup-db.bat
    cd ..
) else (
    echo [!] Skipped. Run Backend\setup-db.bat manually later
)
echo.

REM Step 6: Ready to Start
echo [6/6] Setup Complete!
echo.
echo ========================================
echo Ready to Start!
echo ========================================
echo.
echo Run: npm start
echo.
echo Or use: start-all.bat
echo.
echo Access:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:3001
echo.
echo Demo Login:
echo - Customer: KUNDE_001 / demo123
echo - Admin:    ADMIN_001 / admin123
echo.
pause
