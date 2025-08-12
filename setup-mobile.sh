#!/bin/bash

# Salat Companion Mobile Setup Script

echo "🕌 Setting up Salat Companion for mobile development..."

# Build the web app
echo "📦 Building web app..."
npm run build

# Check if platforms already exist
if [ ! -d "android" ] && [ ! -d "ios" ]; then
    echo "📱 Adding mobile platforms..."
    
    # Add Android platform
    if command -v npx &> /dev/null; then
        echo "  Adding Android platform..."
        npx cap add android
        
        # Add iOS platform (if on macOS)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "  Adding iOS platform..."
            npx cap add ios
        else
            echo "  ⚠️  iOS platform not added (requires macOS)"
        fi
    else
        echo "❌ npx not found. Please install Node.js and npm."
        exit 1
    fi
else
    echo "📱 Mobile platforms already exist, syncing..."
fi

# Sync the web build with mobile platforms
echo "🔄 Syncing with mobile platforms..."
npx cap sync

echo ""
echo "✅ Mobile setup complete!"
echo ""
echo "Next steps:"
echo "  📱 PWA: Your app is now installable from mobile browsers"
echo "  🤖 Android: Run 'npx cap open android' to open Android Studio"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  🍎 iOS: Run 'npx cap open ios' to open Xcode"
fi
echo ""
echo "For more details, see mobile-setup.md"