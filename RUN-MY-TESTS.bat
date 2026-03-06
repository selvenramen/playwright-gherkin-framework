@echo off
setlocal

echo ============================================
echo Running Your Test Scenarios
echo ============================================
echo.

REM Change to the batch file's directory
cd /d "%~dp0"

REM Verify we're in the right directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from inside the framework folder.
    echo.
    pause
    exit /b 1
)

echo Generating step definitions...
call npm run generate-steps

echo Starting tests with browser visible...
echo.

set HEADLESS=false
call npx cucumber-js user-scenarios/**/*.feature --require-module ts-node/register --require steps/**/*.ts --format progress

echo.
echo ============================================
echo Tests Completed!
echo ============================================
echo.
pause
