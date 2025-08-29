#!/bin/bash

# 🍎 MacBook Sync Script for SHELTR-AI
# Run this script to sync your MacBook with all Mac Mini development
echo "🍎 Starting MacBook sync for SHELTR-AI..."
echo "📅 Mac Mini has been primary development environment for months"
echo "🚀 Syncing Sessions 02-13.2 progress + Multi-Tenant Platform + Contact System..."
echo "⚠️ WARNING: You are 21 days behind (last sync: August 8, 2025)"

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
    echo "❌ Missing: apps/web/.env.local (Firebase config + API URL)"
    missing_files=$((missing_files + 1))
else
    echo "✅ Found: apps/web/.env.local"
fi

if [ ! -f "apps/web/.env.production" ]; then
    echo "⚠️ Optional: apps/web/.env.production (Production config template)"
else
    echo "✅ Found: apps/web/.env.production"
fi

if [ ! -f "apps/api/.env.demo" ]; then
    echo "⚠️ Optional: apps/api/.env.demo (Adyen demo config)"
else
    echo "✅ Found: apps/api/.env.demo"
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
echo "📁 Major additions since August 8, 2025 sync:"
echo "   🏢 Multi-tenant database structure with real data connectivity"
echo "   👤 Michael Rodriguez demo participant with live donations"
echo "   👥 Platform Administrator system (4 active admins)"
echo "   📞 Professional contact page with inquiry management"
echo "   🎯 User-awareness navigation across all 6 public pages"
echo "   💰 'My Giving' sidebar for Super Admin and Platform Admin"
echo "   🔧 Unified donation metrics service"
echo "   📊 Contact inquiries dashboard for Super Admin"
echo "   🚀 Session 14 planning and kickoff materials"

echo ""
echo "🎯 What Mac Mini accomplished (Sessions 02-13.2):"
echo "   ✅ Live website: https://sheltr-ai.web.app (98+ pages)"
echo "   ✅ Firebase Authentication + RBAC + multi-tenant data"
echo "   ✅ Complete multi-role dashboard system (all 4 roles)"
echo "   ✅ AI chatbot + OpenAI integration + knowledge base"
echo "   ✅ Apple Liquid Glass mobile navigation"
echo "   ✅ QR donation demo with Adyen + unified metrics"
echo "   ✅ Michael Rodriguez live participant with real donations"
echo "   ✅ Professional contact system with inquiry management"
echo "   ✅ User-awareness navigation revolution"
echo "   ✅ Platform Administrator expansion (4 active admins)"
echo "   ✅ Dark mode default + polished UI across all pages"
echo "   ✅ Production-ready multi-tenant architecture"

echo ""
echo "📋 Next steps (Session 14+ planned):"
echo "   🚀 Beta launch preparation and final polish"
echo "   💳 Payment integration completion + blockchain implementation"
echo "   📱 Mobile app development consideration"
echo "   🤝 Stakeholder demonstrations and partnership onboarding"
echo "   🌐 Public beta launch preparation"

echo ""
if [ $missing_files -gt 0 ]; then
    echo "⚠️ MacBook sync INCOMPLETE - missing environment files!"
    echo "🔧 Complete setup: Follow MACBOOK-SETUP-GUIDE.md"
else
    echo "🎉 MacBook sync complete!"
    echo "🍎 Your MacBook is now up to date with 21 days of Mac Mini development"
    echo "🚀 Ready for Session 14+ coordination or development work"
    echo "📊 You now have access to the complete multi-tenant platform!"
fi

# Check final status
echo ""
echo "📊 Final repository status:"
git status --short

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "🚨 NEXT STEPS REQUIRED:"
    echo "   1. Read: cat docs/04-development/MACBOOK-SETUP-GUIDE.md"
    echo "   2. Setup environment files"
    echo "   3. Test: npm run build --prefix apps/web"
    echo "   4. Test: python apps/api/test_setup.py"
    echo "   5. Optional: Setup Adyen demo (apps/api/.env.demo)"
    exit 1
fi 