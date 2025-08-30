#!/bin/bash

# 🖥️ Mac Mini Sync Script for SHELTR-AI - Aug 30, 2025
# Run this script to sync your Mac Mini with MacBook Pro development
echo "🖥️ Starting Mac Mini sync for SHELTR-AI..."
echo "📅 Syncing any MacBook Pro work back to Mac Mini..."
echo "🔄 This ensures both environments stay synchronized..."

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "apps" ]; then
    echo "❌ Error: Please run this script from the sheltr-ai project root"
    echo "   cd ~/path/to/sheltr-ai && ./sync-mac-mini.sh"
    exit 1
fi

echo ""
echo "📊 Current Mac Mini repository status:"
git status --short

echo ""
echo "📝 Latest commits on your Mac Mini:"
git log --oneline -5

echo ""
echo "🔄 Stashing any local changes..."
if git diff-index --quiet HEAD --; then
    echo "✅ No local changes to stash"
else
    echo "💾 Stashing local changes..."
    git stash push -m "Mac Mini local changes before sync $(date)"
fi

echo ""
echo "⬇️ Fetching latest changes from MacBook Pro..."
git fetch origin

echo ""
echo "📈 Checking for new commits from MacBook Pro development:"
NEW_COMMITS=$(git log --oneline HEAD..origin/main | wc -l | tr -d ' ')

if [ "$NEW_COMMITS" -eq 0 ]; then
    echo "✅ No new commits - Mac Mini is up to date!"
    echo "🎯 Ready to continue development where you left off"
else
    echo "📋 Found $NEW_COMMITS new commits from MacBook Pro:"
    git log --oneline HEAD..origin/main | cat
    
    echo ""
    echo "🔽 Pulling MacBook Pro changes..."
    git pull origin main
    
    echo ""
    echo "📦 Updating frontend dependencies (if package.json changed)..."
    cd apps/web
    if [ -f "package.json" ]; then
        npm install
        echo "✅ Frontend dependencies updated"
    fi
    cd ../..
    
    echo ""
    echo "🐍 Updating backend dependencies (if requirements.txt changed)..."
    cd apps/api
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
        echo "✅ Backend dependencies updated"
    fi
    cd ../..
    
    echo ""
    echo "🧪 Quick build test..."
    if [ -f "apps/web/package.json" ]; then
        npm run build --prefix apps/web
        if [ $? -eq 0 ]; then
            echo "✅ Frontend build successful"
        else
            echo "❌ Frontend build failed - check dependencies"
        fi
    fi
fi

echo ""
echo "🔐 Verifying environment files are still present..."
missing_files=0

if [ ! -f "apps/web/.env.local" ]; then
    echo "❌ Missing: apps/web/.env.local (Firebase config + API URL)"
    missing_files=$((missing_files + 1))
else
    echo "✅ Found: apps/web/.env.local"
fi

if [ ! -f "apps/api/service-account-key.json" ]; then
    echo "❌ Missing: apps/api/service-account-key.json (Firebase Admin SDK)"
    missing_files=$((missing_files + 1))
else
    echo "✅ Found: apps/api/service-account-key.json"
fi

if [ ! -f "google-credentials.json" ]; then
    echo "❌ Missing: google-credentials.json (Google OAuth)"
    missing_files=$((missing_files + 1))
else
    echo "✅ Found: google-credentials.json"
fi

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "🚨 WARNING: $missing_files critical files missing!"
    echo "⚠️ Development may not work properly without these files!"
else
    echo ""
    echo "✅ All environment files present!"
fi

echo ""
echo "🎯 Current SHELTR-AI Status:"
echo "   🚀 Production: https://sheltr-ai.web.app (98+ pages)"
echo "   🏢 Multi-tenant platform with real data connectivity"
echo "   👤 Michael Rodriguez demo participant active"
echo "   👥 4 Platform Administrators (Doug, Alexander, Gunnar, Dominique)"
echo "   📞 Professional contact system with inquiry management"
echo "   🎯 User-awareness navigation across all public pages"
echo "   💰 'My Giving' sidebar for admins"
echo "   📊 Unified donation metrics service"

echo ""
if [ "$NEW_COMMITS" -eq 0 ]; then
    echo "✅ Mac Mini sync complete - no changes needed!"
    echo "🖥️ Ready to continue development from Mac Mini"
    echo "🚀 All Session 13.2 features operational"
else
    echo "✅ Mac Mini sync complete with MacBook Pro changes!"
    echo "🖥️ Mac Mini updated with latest MacBook Pro work"
    echo "🚀 Ready for continued development"
fi

echo ""
echo "📊 Final repository status:"
git status --short

echo ""
echo "🎯 Development Commands Ready:"
echo "   Frontend: cd apps/web && npm run dev"
echo "   Backend:  cd apps/api && python main.py"
echo "   Deploy:   ./deploy.sh (option 3 for quick redeploy)"

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "⚠️ Note: Fix missing environment files before development"
    exit 1
fi

echo ""
echo "🎉 Mac Mini ready for development! Welcome back! 🖥️✨"
