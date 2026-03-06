@echo off
echo ============================================
echo Creating Distribution ZIP
echo ============================================
echo.

cd /d "%~dp0"

REM Set the output ZIP filename
set "OUTPUT_ZIP=playwright-test-framework.zip"

echo Creating ZIP file (excluding node_modules, test-results, etc.)...

REM Use PowerShell to create ZIP with exclusions
powershell -Command "& { Get-ChildItem -Path '.' -Recurse | Where-Object { $_.FullName -notmatch '(node_modules|test-results|playwright-report|\\.git)' } | Compress-Archive -DestinationPath '%OUTPUT_ZIP%' -Update }"

echo.
echo ============================================
echo ZIP Created Successfully!
echo ============================================
echo.
echo File: %OUTPUT_ZIP%
echo Location: %cd%
echo.
echo You can now share this ZIP file.
echo Recipients should:
echo   1. Extract the ZIP
echo   2. Run SETUP-FIRST-TIME.bat
echo   3. Use RUN-SPECIFIC-TEST.bat to run tests
echo.
pause
