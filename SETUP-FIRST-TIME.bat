@echo off
echo ============================================
echo First-Time Setup
echo ============================================
echo.
echo This will install all required dependencies.
echo This only needs to be run once.
echo.
pause

cd /d "%~dp0"

echo.
echo Step 1/2: Installing Node.js packages...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed!
    echo Make sure Node.js is installed from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Step 2/2: Installing Playwright browsers...
call npm run install-browsers

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Browser installation failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo Setup Complete! ✓
echo ============================================
echo.
echo You can now run tests using:
echo - RUN-MY-TESTS.bat (run all tests)
echo - RUN-SPECIFIC-TEST.bat your-test.feature (run one test)
echo.
pause
