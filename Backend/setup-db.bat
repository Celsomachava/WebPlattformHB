@echo off
echo ========================================
echo Database Setup - Heduschka Platform
echo ========================================
echo.

echo This script will:
echo 1. Create database 'heduschka_service'
echo 2. Create tables from schema.sql
echo 3. Insert demo data from seed.sql
echo.

set /p mysql_user="Enter MySQL username (default: root): "
if "%mysql_user%"=="" set mysql_user=root

echo.
echo Creating database and tables...
mysql -u %mysql_user% -p < database\schema.sql

if %errorlevel% neq 0 (
    echo [ERROR] Failed to create database schema
    pause
    exit /b 1
)

echo [OK] Database schema created
echo.

echo Inserting demo data...
mysql -u %mysql_user% -p heduschka_service < database\seed.sql

if %errorlevel% neq 0 (
    echo [ERROR] Failed to insert seed data
    pause
    exit /b 1
)

echo [OK] Demo data inserted
echo.

echo ========================================
echo Database Setup Complete!
echo ========================================
echo.
echo Demo Accounts:
echo - Customer: KUNDE_001 / demo123
echo - Admin:    ADMIN_001 / admin123
echo.
echo Next: Configure Backend/.env and run 'npm start'
echo.
pause
