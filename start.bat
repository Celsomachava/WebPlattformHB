@echo off
echo Starting Heduschka Service Platform...

echo Starting Backend Server...
start "Backend" cmd /k "cd Backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend" cmd /k "npm run dev"

echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
pause