@echo off
echo Testing Backend Connection...
echo.

echo 1. Testing if backend is running on port 3002...
curl -s http://localhost:3002/health
if %errorlevel% neq 0 (
    echo ❌ Backend not running on port 3002
    echo.
    echo Starting backend server...
    cd /d "%~dp0Backend"
    echo Make sure MySQL is running first!
    echo Then try login with: ADMIN_001 / admin123
    npm start
) else (
    echo ✅ Backend is running
    echo.
    echo 2. Testing login endpoint...
    curl -X POST http://localhost:3002/api/auth/login ^
      -H "Content-Type: application/json" ^
      -d "{\"userId\":\"ADMIN_001\",\"password\":\"admin123\"}"
    echo.
    echo.
    echo If login fails, check MySQL database setup
)