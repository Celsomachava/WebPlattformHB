@echo off
echo ========================================
echo  Database-Only Authentication Test
echo ========================================
echo.

cd /d "%~dp0Backend"

echo 1. Setting up database...
node setup-database.js

echo.
echo 2. Testing authentication...
echo.
echo Testing login endpoints:
echo - ADMIN_001 / admin123
echo - KUNDE_001 / demo123
echo - Invalid credentials
echo.

curl -X POST http://localhost:3002/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"ADMIN_001\",\"password\":\"admin123\"}" 2>nul

if %errorlevel% neq 0 (
  echo Backend server not running. Starting server...
  echo.
  echo Please test manually:
  echo 1. Open http://localhost:3000
  echo 2. Try login with ADMIN_001 / admin123
  echo 3. Try login with KUNDE_001 / demo123
  echo 4. Try invalid credentials - should fail
  echo.
  echo Press Ctrl+C to stop server
  npm start
) else (
  echo ✅ Backend server is running
  echo.
  echo Manual test steps:
  echo 1. Open http://localhost:3000
  echo 2. Login with ADMIN_001 / admin123 ✅
  echo 3. Login with KUNDE_001 / demo123 ✅
  echo 4. Try invalid credentials ❌ (should fail)
  echo.
)