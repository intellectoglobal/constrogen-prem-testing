@echo off
REM Script to copy assets from mobile app to web app (Windows)
REM Run this from the project root directory

echo 📦 Copying assets from mobile to web...
echo.

REM Create public directory if it doesn't exist
if not exist "constrogen_web\public" mkdir constrogen_web\public

REM Check if mobile assets exist
if not exist "constrogen_mobile\assets" (
    echo ❌ Error: constrogen_mobile\assets directory not found!
    echo Make sure you're running this script from the project root.
    exit /b 1
)

REM Copy assets
echo Copying logo.png...
if exist "constrogen_mobile\assets\logo.png" (
    copy "constrogen_mobile\assets\logo.png" "constrogen_web\public\" >nul
    echo ✅ logo.png copied
) else (
    echo ⚠️  Warning: logo.png not found
)

echo Copying hook128.png...
if exist "constrogen_mobile\assets\hook128.png" (
    copy "constrogen_mobile\assets\hook128.png" "constrogen_web\public\" >nul
    echo ✅ hook128.png copied
) else (
    echo ⚠️  Warning: hook128.png not found
)

echo Copying construction-bg.jpeg...
if exist "constrogen_mobile\assets\construction-bg.jpeg" (
    copy "constrogen_mobile\assets\construction-bg.jpeg" "constrogen_web\public\" >nul
    echo ✅ construction-bg.jpeg copied
) else (
    echo ⚠️  Warning: construction-bg.jpeg not found
)

echo.
echo ✨ Asset copying complete!
echo.
echo Next steps:
echo 1. cd constrogen_web
echo 2. npm install
echo 3. npm run dev
echo.

pause

