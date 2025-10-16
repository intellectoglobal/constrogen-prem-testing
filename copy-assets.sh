#!/bin/bash

# Script to copy assets from mobile app to web app
# Run this from the project root directory

echo "📦 Copying assets from mobile to web..."

# Create public directory if it doesn't exist
mkdir -p constrogen_web/public

# Check if mobile assets exist
if [ ! -d "constrogen_mobile/assets" ]; then
    echo "❌ Error: constrogen_mobile/assets directory not found!"
    echo "Make sure you're running this script from the project root."
    exit 1
fi

# Copy assets
echo "Copying logo.png..."
if [ -f "constrogen_mobile/assets/logo.png" ]; then
    cp constrogen_mobile/assets/logo.png constrogen_web/public/
    echo "✅ logo.png copied"
else
    echo "⚠️  Warning: logo.png not found"
fi

echo "Copying hook128.png..."
if [ -f "constrogen_mobile/assets/hook128.png" ]; then
    cp constrogen_mobile/assets/hook128.png constrogen_web/public/
    echo "✅ hook128.png copied"
else
    echo "⚠️  Warning: hook128.png not found"
fi

echo "Copying construction-bg.jpeg..."
if [ -f "constrogen_mobile/assets/construction-bg.jpeg" ]; then
    cp constrogen_mobile/assets/construction-bg.jpeg constrogen_web/public/
    echo "✅ construction-bg.jpeg copied"
else
    echo "⚠️  Warning: construction-bg.jpeg not found"
fi

echo ""
echo "✨ Asset copying complete!"
echo ""
echo "Next steps:"
echo "1. cd constrogen_web"
echo "2. npm install"
echo "3. npm run dev"
echo ""

