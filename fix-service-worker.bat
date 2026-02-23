@echo off
echo ========================================
echo  Fixing Service Worker and Cache Issues
echo ========================================
echo.

echo 1. Open browser and go to: http://localhost:3000/clear-cache.html
echo 2. Click "Clear All Cache"
echo 3. Open Developer Tools (F12)
echo 4. Go to Application tab
echo 5. Click "Service Workers" 
echo 6. Click "Unregister" for any service workers
echo 7. Go to Storage tab
echo 8. Click "Clear storage"
echo 9. Refresh the page
echo.

echo Manual steps to fix:
echo - Clear browser cache (Ctrl+Shift+Del)
echo - Disable service worker temporarily
echo - Use correct API port (3002 not 3001)
echo.

echo Starting backend on correct port 3002...
cd /d "%~dp0Backend"
npm start