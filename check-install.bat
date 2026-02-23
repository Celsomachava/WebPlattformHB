@echo off
echo ========================================
echo Heduschka Platform - Installation Check
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js not found! Please install from https://nodejs.org/
    goto :error
) else (
    node --version
    echo [OK] Node.js installed
)
echo.

echo [2/5] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] npm not found!
    goto :error
) else (
    npm --version
    echo [OK] npm installed
)
echo.

echo [3/5] Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] MySQL not found in PATH
    echo     Please ensure MySQL is installed and running
) else (
    mysql --version
    echo [OK] MySQL installed
)
echo.

echo [4/5] Checking Frontend dependencies...
if exist "node_modules\" (
    echo [OK] Frontend dependencies installed
) else (
    echo [!] Frontend dependencies not installed
    echo     Run: npm install
)
echo.

echo [5/5] Checking Backend dependencies...
if exist "Backend\node_modules\" (
    echo [OK] Backend dependencies installed
) else (
    echo [!] Backend dependencies not installed
    echo     Run: cd Backend && npm install
)
echo.

echo ========================================
echo Installation Check Complete
echo ========================================
echo.
echo Next Steps:
echo 1. Setup database: mysql -u root -p ^< Backend/database/schema.sql
echo 2. Configure Backend: cd Backend && cp .env.example .env
echo 3. Start servers: start-all.bat
echo.
goto :end

:error
echo.
echo Installation incomplete. Please install missing components.
echo.

:end
pause
