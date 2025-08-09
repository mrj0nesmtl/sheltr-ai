# 🍎 MacBook Local Environment Setup Guide

> **Critical**: Your MacBook needs these additional files that aren't in Git due to security/privacy

## 🚨 **Files Missing from Git (Security/Privacy)**

### **1. Environment Variables** 
```bash
# You'll need to create these files on your MacBook:

# Root project: .env.local
GOOGLE_CLIENT_ID=714964620823-6rj15f8bld70ma9gje813g7voc2saqpr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_SCOPES=https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly
GOOGLE_CREDENTIALS_PATH=./google-credentials.json
MCP_SERVER_PORT=3420

# Frontend: apps/web/.env.local  
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyACPNPm_MUGbwyPR7aaxrUpdYkBMWzhwL4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sheltr-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sheltr-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sheltr-ai.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=714964620823
NEXT_PUBLIC_FIREBASE_APP_ID=1:714964620823:web:24b6c7d2f8dfa2a2cb6e52
FIREBASE_PROJECT_ID=sheltr-ai
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
SKIP_LINT=true
```

### **2. Firebase Service Account Key**
```bash
# File: apps/api/service-account-key.json
# This is your Firebase Admin SDK private key
# Download fresh copy from Firebase Console > Project Settings > Service Accounts
```

### **3. Google OAuth Credentials**
```bash
# File: google-credentials.json (project root)
# This is your Google Calendar API OAuth credentials
# Download from Google Cloud Console > APIs & Services > Credentials
```

### **4. Google OAuth Client Secret**
```bash
# File: apps/api/client_secret_714964620823-6rj15f8bld70ma9gje813g7voc2saqpr.apps.googleusercontent.com.json
# This is the detailed OAuth client configuration
# Download from Google Cloud Console
```

### **5. Cursor MCP Configuration**
```bash
# File: .cursor/mcp.json
# This configures the Google Calendar MCP in Cursor IDE
# Contains OAuth credentials for MCP server
```

## 📋 **MacBook Setup Checklist**

### **Step 1: Sync Repository**
```bash
cd ~/path/to/sheltr-ai
./sync-macbook.sh
```

### **Step 2: Create Environment Files**
```bash
# Create root .env.local
cat > .env.local << 'EOF'
GOOGLE_CLIENT_ID=714964620823-6rj15f8bld70ma9gje813g7voc2saqpr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_SCOPES=https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly
GOOGLE_CREDENTIALS_PATH=./google-credentials.json
MCP_SERVER_PORT=3420
EOF

# Create frontend .env.local
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyACPNPm_MUGbwyPR7aaxrUpdYkBMWzhwL4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sheltr-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sheltr-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sheltr-ai.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=714964620823
NEXT_PUBLIC_FIREBASE_APP_ID=1:714964620823:web:24b6c7d2f8dfa2a2cb6e52
FIREBASE_PROJECT_ID=sheltr-ai
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
SKIP_LINT=true
EOF
```

### **Step 3: Get Firebase Service Account Key**

**Option A: From Mac Mini (Easiest)**
```bash
# Copy from your Mac Mini if accessible
scp mac-mini:/path/to/sheltr-ai/apps/api/service-account-key.json apps/api/
```

**Option B: Download Fresh (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com/project/sheltr-ai)
2. Project Settings > Service Accounts
3. Generate new private key
4. Save as `apps/api/service-account-key.json`

### **Step 4: Get Google OAuth Credentials**

**Option A: From Mac Mini**
```bash
# Copy OAuth files from Mac Mini
scp mac-mini:/path/to/sheltr-ai/google-credentials.json .
scp mac-mini:/path/to/sheltr-ai/apps/api/client_secret_*.json apps/api/
```

**Option B: Download Fresh**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 client ID
3. Download JSON
4. Save as `google-credentials.json` and in `apps/api/`

### **Step 5: Firebase CLI Authentication**
```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Verify project access
firebase projects:list
firebase use sheltr-ai
```

### **Step 6: Verify Everything Works**
```bash
# Test frontend build
cd apps/web && npm run build && cd ../..

# Test backend
python apps/api/test_setup.py

# Test Firebase connection
firebase functions:list

# Test local development
npm run start-dev  # or whatever your dev script is
```

## 🔧 **Development Tools Setup**

### **Required Tools**
```bash
# Node.js (v18+)
node --version

# Python (3.11+)  
python3 --version

# Firebase CLI
firebase --version

# Git (obviously)
git --version
```

### **IDE Setup (Cursor)**
If using Cursor IDE, you may need:
```bash
# Create .cursor directory if it doesn't exist
mkdir -p .cursor

# MCP configuration for Google Calendar integration
# (You'll need OAuth credentials in this file)
```

## ⚠️ **Security Notes**

### **Never Commit These Files:**
- ❌ `.env.local` (any environment variables)
- ❌ `service-account-key.json` (Firebase admin key)
- ❌ `google-credentials.json` (OAuth credentials)
- ❌ `client_secret_*.json` (Google client secrets)
- ❌ `.cursor/mcp.json` (if it contains credentials)

### **These Are Already in .gitignore:**
- ✅ All `.env*` files
- ✅ All credential/secret files
- ✅ `.cursor/mcp.json`
- ✅ `**/client_secret_*.json`

## 🎯 **Verification Commands**

### **Test Full Stack**
```bash
# Frontend development server
cd apps/web && npm run dev

# Backend API (separate terminal)
cd apps/api && python main.py

# Firebase emulators (if needed)
firebase emulators:start
```

### **Test Production Build**
```bash
# Build for production
npm run build --prefix apps/web

# Test Firebase deployment (dry run)
firebase deploy --only hosting --dry-run
```

## 🆘 **Common Issues**

### **"Firebase project not found"**
```bash
firebase login
firebase use sheltr-ai
```

### **"Google Calendar API not enabled"**
- Enable Calendar API in Google Cloud Console
- Verify OAuth scopes in credentials

### **"Module not found" errors**
```bash
# Reinstall dependencies
rm -rf node_modules apps/web/node_modules
npm install
cd apps/web && npm install && cd ../..
```

### **Environment variable issues**
- Double-check `.env.local` files exist in correct locations
- Verify all values are correct (no quotes needed in .env files)
- Restart development server after env changes

## 📞 **Getting Help**

If you run into issues:
1. **Check logs**: Look for specific error messages
2. **Verify files**: Ensure all credential files exist and are valid
3. **Test incrementally**: Start with frontend, then backend, then integrations
4. **Compare with Mac Mini**: Use working environment as reference

---

**Created**: January 27, 2025  
**For**: MacBook environment sync after weeks of Mac Mini development  
**Status**: Complete setup guide for local development environment 