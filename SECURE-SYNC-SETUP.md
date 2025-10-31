# 🔧 Secure Document Sync - Setup Instructions

## ❌ Current Issue

The secure document sync is failing because:
1. Node.js script can't find Firebase credentials
2. Missing `dotenv` and `firebase-admin` npm packages

---

## ✅ Quick Fix (2 Steps)

### **Step 1: Install Required Packages**

```bash
# Fix npm permissions (if needed)
sudo chown -R $(whoami) ~/.npm

# Install dependencies
npm install dotenv firebase-admin --save
```

### **Step 2: Verify Firebase Credentials**

Your backend is working, so credentials exist. Check which method you're using:

**Option A: Environment Variables** (most likely)
- Check `.env.local` has Firebase credentials
- Should include: `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`

**Option B: Service Account File**
- Or create `service-account-key.json` at project root
- Download from Firebase Console → Project Settings → Service Accounts

---

## 🧪 Test the Sync

After installing packages, test manually:

```bash
node scripts/sync-secure-documents.js
```

You should see:
```
✅ Using environment variables for Firebase auth
🚀 Starting secure document sync...
📁 Syncing founders/ (4 files, 4 excluded)...
```

---

## 🚀 Then Try UI Button Again

1. Restart backend (if it was running)
2. Refresh Knowledge Base page
3. Click "🔥 Sync Secure Documents" button
4. Should work! 🎉

---

## 📊 Expected Result

```
✨ Created: 13
✅ Updated: 0
❌ Errors: 0

📁 Syncing founders/ (4 files)
📁 Syncing payment-rails/ (3 files)
📁 Syncing platform-admin/ (2 files)
📁 Syncing shelter-research/ (4 files)
```

---

## 🆘 Still Not Working?

If sync still fails, run this to see the exact error:

```bash
node scripts/sync-secure-documents.js 2>&1 | tee sync-debug.log
```

Send me `sync-debug.log` and I'll help debug!

---

**Status:** Waiting for `npm install`  
**Next:** Run the 2 commands above and try sync button again

