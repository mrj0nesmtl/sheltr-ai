#!/bin/bash

# 🍎 MacBook Sync Script for SHELTR-AI
# Run this script to sync your MacBook with all Mac Mini development
echo "🍎 Starting MacBook sync for SHELTR-AI..."
echo "📅 Mac Mini has been primary development environment for weeks"
echo "🚀 Syncing Sessions 02-05 progress..."

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "apps" ]; then
    echo "❌ Error: Please run this script from the sheltr-ai project root"
    echo "   cd ~/path/to/sheltr-ai && ./sync-macbook.sh"
    exit 1
fi

echo ""
echo "📊 Current MacBook repository status:"
git status --short

echo ""
echo "📝 Latest commits on your MacBook:"
git log --oneline -5

echo ""
echo "🔄 Stashing any local changes..."
if git diff-index --quiet HEAD --; then
    echo "✅ No local changes to stash"
else
    echo "💾 Stashing local changes..."
    git stash push -m "MacBook local changes before sync $(date)"
fi

echo ""
echo "⬇️ Fetching latest changes from Mac Mini..."
git fetch origin

echo ""
echo "📈 Commits you're missing from Mac Mini development:"
git log --oneline HEAD..origin/main

echo ""
echo "🔽 Pulling all changes..."
git pull origin main

echo ""
echo "📦 Updating frontend dependencies..."
cd apps/web
if [ -f "package.json" ]; then
    npm install
    echo "✅ Frontend dependencies updated"
else
    echo "⚠️ No package.json found - this is normal if frontend wasn't created in Session 01"
fi
cd ../..

echo ""
echo "🐍 Updating backend dependencies..."
cd apps/api
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    echo "✅ Backend dependencies updated"
else
    echo "⚠️ No requirements.txt found"
fi
cd ../..

echo ""
echo "🧪 Testing frontend build..."
if [ -f "apps/web/package.json" ]; then
    npm run build --prefix apps/web
    if [ $? -eq 0 ]; then
        echo "✅ Frontend build successful"
    else
        echo "❌ Frontend build failed - check dependencies"
    fi
else
    echo "⚠️ Frontend not set up yet"
fi

echo ""
echo "🧪 Testing backend setup..."
if [ -f "apps/api/test_setup.py" ]; then
    python apps/api/test_setup.py
    if [ $? -eq 0 ]; then
        echo "✅ Backend setup verified"
    else
        echo "❌ Backend setup issues - check Python environment"
    fi
else
    echo "⚠️ Backend test not found"
fi

echo ""
echo "🔐 CRITICAL: Checking for missing environment files..."
echo "   These files are NOT in Git due to security (contain secrets)"

# Check for environment files
missing_files=0

if [ ! -f ".env.local" ]; then
    echo "❌ Missing: .env.local (Google Calendar MCP config)"
    missing_files=$((missing_files + 1))
else
    echo "✅ Found: .env.local"
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo "❌ Missing: apps/web/.env.local (Firebase config)"
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

if [ ! -f "apps/api/client_secret_714964620823"* ]; then
    echo "❌ Missing: apps/api/client_secret_*.json (Google OAuth client)"
    missing_files=$((missing_files + 1))
else
    echo "✅ Found: Google OAuth client secret"
fi

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "🚨 SETUP REQUIRED: $missing_files critical files missing!"
    echo "📖 Read MACBOOK-SETUP-GUIDE.md for detailed instructions"
    echo ""
    echo "🔧 Quick setup options:"
    echo "   1. Copy from Mac Mini: scp mac-mini:/path/to/sheltr-ai/.env.local ."
    echo "   2. Download fresh from Firebase/Google Cloud Console"
    echo "   3. Follow MACBOOK-SETUP-GUIDE.md for step-by-step instructions"
    echo ""
    echo "⚠️ Development will NOT work without these files!"
else
    echo ""
    echo "✅ All environment files present!"
fi

echo ""
echo "📁 New files/directories added since Session 01:"
echo "   📂 apps/web/ - Complete Next.js 15 application"
echo "   📂 functions/ - Firebase Cloud Functions"
echo "   📄 firebase.json - Firebase configuration"
echo "   📄 firestore.rules - Database security rules"
echo "   📂 scripts/ - Database migration tools"
echo "   📚 Multiple new docs in docs/04-development/"

echo ""
echo "🎯 What Mac Mini accomplished (Sessions 02-05):"
echo "   ✅ Live website: https://sheltr-ai.web.app"
echo "   ✅ Firebase Authentication + RBAC"
echo "   ✅ Super Admin dashboard with maps"
echo "   ✅ Investor Relations portal"
echo "   ✅ Mobile navigation + theme system"
echo "   ✅ Legal pages + documentation"
echo "   ✅ Database migration completed"

echo ""
echo "📋 Next steps (Session 06 planned):"
echo "   🏗️ Multi-dashboard development"
echo "   ⛓️ Base blockchain integration"
echo "   👥 Participant onboarding system"
echo "   📱 QR code architecture"

echo ""
if [ $missing_files -gt 0 ]; then
    echo "⚠️ MacBook sync INCOMPLETE - missing environment files!"
    echo "🔧 Complete setup: Follow MACBOOK-SETUP-GUIDE.md"
else
    echo "🎉 MacBook sync complete!"
    echo "🍎 Your MacBook is now up to date with Mac Mini development"
    echo "🚀 Ready for Session 06 coordination or development work"
fi

# Check final status
echo ""
echo "📊 Final repository status:"
git status --short

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "🚨 NEXT STEPS REQUIRED:"
    echo "   1. Read: cat MACBOOK-SETUP-GUIDE.md"
    echo "   2. Setup environment files"
    echo "   3. Test: npm run build --prefix apps/web"
    echo "   4. Test: python apps/api/test_setup.py"
    exit 1
fi 