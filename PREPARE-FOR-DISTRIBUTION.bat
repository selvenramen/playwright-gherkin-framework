@echo off
echo ============================================
echo Creating Distribution Package
echo ============================================
echo.

cd /d "%~dp0"

echo Cleaning up unnecessary files...
if exist node_modules rmdir /s /q node_modules
if exist test-results rmdir /s /q test-results
if exist playwright-report rmdir /s /q playwright-report
if exist .git rmdir /s /q .git
if exist cucumber-report.html del /q cucumber-report.html

echo.
echo ============================================
echo Ready for Distribution!
echo ============================================
echo.
echo Next steps:
echo 1. Zip this folder OR
echo 2. Create self-extracting EXE with 7-Zip OR
echo 3. Upload to cloud storage
echo.
echo The package is now clean and ready to share.
echo.
pause
