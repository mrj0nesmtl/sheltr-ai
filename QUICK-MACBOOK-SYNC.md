# 🍎 Quick MacBook Sync Reference

## 🚨 **Missing Files (Not in Git)**

Your MacBook needs these files that contain secrets/credentials:

### **1. Environment Variables**
```bash
# Root: .env.local
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
# ... (plus Firebase Admin SDK vars)
```

### **2. Credential Files**
- `apps/api/service-account-key.json` - Firebase Admin SDK
- `google-credentials.json` - Google OAuth credentials  
- `apps/api/client_secret_714964620823-*.json` - Google OAuth client

## ⚡ **Quick Copy Commands (If Mac Mini Accessible)**

```bash
# Copy all environment files
scp mac-mini:/path/to/sheltr-ai/.env.local .
scp mac-mini:/path/to/sheltr-ai/apps/web/.env.local apps/web/

# Copy credential files
scp mac-mini:/path/to/sheltr-ai/apps/api/service-account-key.json apps/api/
scp mac-mini:/path/to/sheltr-ai/google-credentials.json .
scp mac-mini:/path/to/sheltr-ai/apps/api/client_secret_*.json apps/api/
```

## 🔄 **Sync Steps**

1. **Git sync**: `./sync-macbook.sh`
2. **Setup files**: Copy or create environment files above
3. **Test**: `npm run build --prefix apps/web`
4. **Verify**: `python apps/api/test_setup.py`

## 📖 **Full Guide**

Read `MACBOOK-SETUP-GUIDE.md` for complete step-by-step instructions. 