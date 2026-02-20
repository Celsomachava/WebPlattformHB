@echo off
echo ========================================
echo  Heduschka Customer Management Test
echo ========================================
echo.

cd /d "%~dp0Backend"

echo 1. Testing database connection...
node test-db-connection.js

echo.
echo 2. Setting up database (if needed)...
node setup-database.js

echo.
echo 3. Starting backend server...
echo Backend will start on http://localhost:3002
echo.
echo To test customer management:
echo 1. Open http://localhost:3000 in browser
echo 2. Login as ADMIN_001 / admin123
echo 3. Navigate to "Kundenverwaltung" in sidebar
echo 4. You should see customers from database
echo.
echo Press Ctrl+C to stop the server
echo.

npm start