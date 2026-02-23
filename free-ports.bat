@echo off
echo ========================================
echo Port Management - Heduschka Platform
echo ========================================
echo.

echo Checking ports 3000, 3001, 3002...
echo.

REM Check port 3000
netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo [!] Port 3000 is in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        echo     Killing PID: %%a
        taskkill /F /PID %%a 2>nul
    )
) else (
    echo [OK] Port 3000 is free
)

REM Check port 3001
netstat -ano | findstr :3001 > nul
if %errorlevel% equ 0 (
    echo [!] Port 3001 is in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        echo     Killing PID: %%a
        taskkill /F /PID %%a 2>nul
    )
) else (
    echo [OK] Port 3001 is free
)

REM Check port 3002
netstat -ano | findstr :3002 > nul
if %errorlevel% equ 0 (
    echo [!] Port 3002 is in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
        echo     Killing PID: %%a
        taskkill /F /PID %%a 2>nul
    )
) else (
    echo [OK] Port 3002 is free
)

echo.
echo Waiting for ports to be released...
timeout /t 2 /nobreak > nul

echo.
echo [OK] All ports are now free
echo.
pause
