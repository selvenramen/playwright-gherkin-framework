@echo off
setlocal

echo ============================================
echo Running Specific Test File
echo ============================================
echo.

if "%~1"=="" (
    echo ERROR: Please provide a test file name!
    echo.
    echo Usage: RUN-SPECIFIC-TEST.bat your-test-file.feature
    echo Example: RUN-SPECIFIC-TEST.bat my-login-test.feature
    echo.
    pause
    exit /b 1
)

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

echo Generating step definitions from test file...
REM Temporarily copy external file for scanning if it exists
if exist "%~1" (
    if not exist "temp-features" mkdir temp-features
    copy "%~1" "temp-features\" >nul 2>&1
)
call npm run generate-steps >nul 2>&1
if exist "temp-features" rmdir /s /q "temp-features" 2>&1

echo Running test: %~1
echo.

REM Check if it's an absolute path or exists as-is
if exist "%~1" (
    set TEST_FILE=%~1
    goto :run_test
)

REM Check if file exists in user-scenarios folder
if exist "user-scenarios\%~1" (
    set TEST_FILE=user-scenarios/%~1
    goto :run_test
)

REM Check if file exists in features folder
if exist "features\%~1" (
    set TEST_FILE=features/%~1
    goto :run_test
)

REM File not found in any location
echo ERROR: Test file not found!
echo.
echo Looked for:
echo - %~1 (as provided)
echo - user-scenarios\%~1
echo - features\%~1
echo.
echo Please make sure your test file exists.
echo.
pause
exit /b 1

:run_test
echo Found: %TEST_FILE%
echo.

set HEADLESS=false
call npx cucumber-js "%TEST_FILE%" --format progress --format html:cucumber-report.html --format json:cucumber.json

echo.
echo Report files updated:
echo - cucumber-report.html
echo - cucumber.json

echo.
echo ============================================
echo Test Completed!
echo ============================================
echo.
pause
