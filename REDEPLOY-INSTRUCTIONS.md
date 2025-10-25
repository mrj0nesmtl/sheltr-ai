# 🚀 Full Redeploy Instructions

## Changes Made Today (October 25, 2025)

1. ✅ **OG Image Metadata** - Dynamic hero images for landing, docs, tokenomics
2. ✅ **Documentation Hub** - Added to gallery hero image selector
3. ✅ **Storage Rules** - Added `blog-images/` path for blog uploads
4. ✅ **Blog Service Fix** - Fixed document reference handling in backend
5. ✅ **Docs Page** - Dynamic hero image support

---

## 🎯 What Needs to be Deployed

### **Frontend (Firebase Hosting)**
- OG image metadata changes
- Docs page hero image support
- Gallery selector updates

### **Backend (Cloud Run)**
- Blog service fix for post creation
- Updated storage rules (already deployed ✅)

---

## 📋 Deployment Steps

### **Option 1: Use Deploy Script (Recommended)**

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
./deploy.sh
```

**Select options:**
1. First, deploy **Backend (API)** - Option 2
2. Then, deploy **Frontend (Web)** - Option 3

### **Option 2: Manual Deployment**

#### **Step 1: Deploy Backend to Cloud Run**

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api

# Deploy to Cloud Run
gcloud run deploy sheltr-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project sheltr-ai
```

#### **Step 2: Deploy Frontend to Firebase Hosting**

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/web

# Build production frontend
npm run build

# Deploy to Firebase Hosting
cd ../..
firebase deploy --only hosting
```

---

## ⏱️ Deployment Time Estimates

- **Backend (Cloud Run)**: 3-5 minutes
- **Frontend (Firebase)**: 2-3 minutes
- **Total**: ~5-8 minutes

---

## ✅ Post-Deployment Verification

### **1. Verify Backend**

**Health Check:**
```
https://sheltr-api-714964620823.us-central1.run.app/health
```

Expected:
```json
{
  "success": true,
  "message": "SHELTR-AI API is running",
  "version": "2.0.0",
  "status": "healthy"
}
```

### **2. Verify Frontend**

**Clear browser cache:**
- Press `Ctrl+Shift+R` (Windows/Linux)
- Press `Cmd+Shift+R` (Mac)

**Test pages:**
- Landing: https://sheltr-ai.web.app/
- Docs: https://sheltr-ai.web.app/docs
- Tokenomics: https://sheltr-ai.web.app/tokenomics
- Blog Management: https://sheltr-ai.web.app/dashboard/blog

### **3. Test Blog Post Creation**

1. Go to https://sheltr-ai.web.app/dashboard/blog
2. Click "Create Post"
3. Fill in all fields:
   - Title: "Test Blog Post"
   - Category: "Community Updates"
   - Excerpt: "Testing blog creation"
   - Content: "This is a test post"
   - Upload a featured image
   - Add tags: "test"
4. Click "Create Post"
5. ✅ Should succeed without errors!

### **4. Verify OG Images**

**Test social media sharing:**
1. Share these URLs in iMessage/WhatsApp:
   - https://sheltr-ai.web.app/
   - https://sheltr-ai.web.app/docs
   - https://sheltr-ai.web.app/tokenomics

2. Verify hero images appear correctly

**Clear social media caches:**
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator

---

## 🐛 Troubleshooting

### **Backend Deployment Fails**

**Error: "Permission denied"**
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project sheltr-ai
```

**Error: "Service not found"**
```bash
# Create the service first
gcloud run services create sheltr-api \
  --region us-central1 \
  --platform managed
```

### **Frontend Build Fails**

**Error: "Out of memory"**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Error: "Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Blog Creation Still Fails After Deploy**

1. **Check Cloud Run logs:**
   ```bash
   gcloud run logs read sheltr-api --region us-central1 --limit 50
   ```

2. **Check browser console** for specific error

3. **Verify deployment completed:**
   ```bash
   gcloud run services describe sheltr-api --region us-central1
   ```

---

## 📊 Deployment Checklist

Before deploying:
- [x] All changes committed to git
- [x] All changes pushed to main branch
- [x] Backend fix applied
- [x] Storage rules deployed

During deployment:
- [ ] Backend deployed to Cloud Run
- [ ] Frontend built successfully
- [ ] Frontend deployed to Firebase Hosting

After deployment:
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Blog post creation works
- [ ] OG images display correctly
- [ ] Browser cache cleared

---

## 🎯 Quick Deploy Commands

```bash
# Full deployment (from project root)
cd /Users/mrjones/Github/Projects/sheltr-ai

# 1. Deploy backend
cd apps/api
gcloud run deploy sheltr-api --source . --region us-central1

# 2. Deploy frontend
cd ../web
npm run build
cd ../..
firebase deploy --only hosting

# 3. Verify
curl https://sheltr-api-714964620823.us-central1.run.app/health
open https://sheltr-ai.web.app/dashboard/blog
```

---

## ✨ Summary

All code changes are complete and pushed to GitHub. Now you just need to:

1. **Deploy backend** to Cloud Run (fixes blog creation)
2. **Deploy frontend** to Firebase Hosting (OG images, docs page)
3. **Test** blog post creation in production
4. **Celebrate** 🎉

**Estimated time: 5-8 minutes**

