@echo off
echo Killing all Node.js processes...

taskkill /F /IM node.exe 2>nul

if %errorlevel% equ 0 (
    echo [OK] All Node.js processes killed
) else (
    echo [!] No Node.js processes found
)

timeout /t 2 /nobreak > nul
echo Ready to start fresh!
