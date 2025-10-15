# 🔧 Production RAG Fix - Step-by-Step Guide

**Date:** October 15, 2025 (Evening)  
**Issue:** OpenAI API key missing from Cloud Run production environment  
**Status:** 🟡 IN PROGRESS

---

## ✅ What We Know

**Localhost Status:**
- ✅ FAQ queries working (<1s)
- ✅ RAG queries working (2-8s)
- ✅ OpenAI API key present in `.env` file

**Production Status:**
- ✅ FAQ queries working (<1s)
- ❌ RAG queries failing (generic error)
- ❌ OpenAI API key NOT in Cloud Run environment

**Backend Location:**
- Cloud Run service: `sheltr-api-714964620823.us-central1.run.app`
- Region: `us-central1`
- Project: `sheltr-ai`

---

## 🔑 Your OpenAI API Key

```
OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE
```

**Note:** Get your actual key from `apps/api/.env` file (never commit the real key!)

---

## 🚀 Fix Method 1: Using Google Cloud Console (Easiest)

### **Step 1: Open Cloud Run Service**

1. Go to: https://console.cloud.google.com/run
2. Select project: `sheltr-ai`
3. Click on service: `sheltr-api` (or similar name)

### **Step 2: Add Environment Variable**

1. Click **"EDIT & DEPLOY NEW REVISION"** button at top
2. Scroll to **"Container" section**
3. Click **"VARIABLES & SECRETS"** tab
4. Click **"+ ADD VARIABLE"**
5. Enter:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `[YOUR-ACTUAL-OPENAI-API-KEY]` (get from apps/api/.env)
6. Click **"DEPLOY"** at bottom

### **Step 3: Wait for Deployment**

- Deployment takes 2-5 minutes
- Watch the status indicator
- When it shows ✅ green checkmark, it's ready

### **Step 4: Test**

Go to your production site: https://sheltr-ai.web.app

Open chatbot and test:
```
"explain how the blockchain verifies my donation and what smart contracts are involved?"
```

**Expected:** Detailed answer about blockchain verification (should work now!)

---

## 🚀 Fix Method 2: Using gcloud CLI (For Terminal Lovers)

### **Step 1: Login to Google Cloud**

```bash
gcloud auth login
```

### **Step 2: Set Project**

```bash
gcloud config set project sheltr-ai
```

### **Step 3: Update Cloud Run Service**

```bash
# Get the service name first
gcloud run services list --region=us-central1

# Update with environment variable (replace SERVICE_NAME and YOUR-KEY)
gcloud run services update SERVICE_NAME \
  --region=us-central1 \
  --set-env-vars="OPENAI_API_KEY=YOUR-ACTUAL-OPENAI-API-KEY"
```

### **Step 4: Verify**

```bash
# Check if environment variable is set
gcloud run services describe SERVICE_NAME \
  --region=us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

### **Step 5: Test**

Test the production chatbot with a RAG query.

---

## 🚀 Fix Method 3: Using Firebase Functions Secrets (If Using Firebase Functions)

If your API is deployed as Firebase Functions instead of Cloud Run:

### **Step 1: Set Secret**

```bash
firebase functions:secrets:set OPENAI_API_KEY
# When prompted, paste your actual OpenAI API key from apps/api/.env
```

### **Step 2: Deploy Functions**

```bash
firebase deploy --only functions
```

---

## ✅ Verification Steps

After deploying with the API key:

### **Test 1: Health Check**

```bash
curl https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/health
```

**Look for:**
```json
{
  "openai_service": "available"  // Should say "available" not "unavailable"
}
```

### **Test 2: FAQ Query (Should Still Work)**

```bash
curl -X POST https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{"message": "when does sheltr launch?", "user_id": "test", "context": {}}'
```

**Expected:** FAQ answer in <1 second

### **Test 3: RAG Query (Should Work Now!)**

```bash
curl -X POST https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{"message": "explain blockchain verification", "user_id": "test", "context": {}}'
```

**Expected:** Detailed answer in 2-8 seconds (NOT error message)

### **Test 4: Production Website**

Go to: https://sheltr-ai.web.app

Open chatbot and test complex queries:
- "explain how the blockchain verifies my donation"
- "compare sheltr to traditional charities"
- "walk me through getting a pod from start to finish"

**All should work now!**

---

## 📊 Success Criteria

**✅ Fix is Complete When:**

1. Health endpoint shows `"openai_service": "available"`
2. FAQ queries still work (<1s)
3. RAG queries return detailed answers (2-8s)
4. No more "I'm having trouble connecting" errors
5. Production website chatbot handles all question types

---

## 🐛 If It Still Doesn't Work

### **Check 1: Is the Service Running?**

```bash
gcloud run services describe SERVICE_NAME --region=us-central1
```

Look for: `status: Ready`

### **Check 2: Are Logs Showing Errors?**

```bash
gcloud logs read --service=SERVICE_NAME --region=us-central1 --limit=50
```

Look for:
- "OPENAI_API_KEY not found"
- "OpenAI service not available"
- Any Python exceptions

### **Check 3: Is the Variable Actually Set?**

Go to Cloud Run console → Click service → "VARIABLES & SECRETS" tab

Should see: `OPENAI_API_KEY` with value starting with `sk-proj-...`

### **Check 4: Clear Cache**

Sometimes the frontend caches the old error. Clear browser cache or use incognito mode.

---

## 💡 Why This Happened

**Root Cause:**

Your local environment (`.env` file) has the OpenAI API key, so localhost works perfectly. But when you deployed to Cloud Run, the environment variables from `.env` don't automatically transfer.

**Cloud Run requires:**
- Explicitly setting environment variables in the Cloud Run service configuration
- OR using Google Secret Manager
- OR setting them during deployment

**Going Forward:**

When you redeploy the backend to Cloud Run, the environment variable will persist. You only need to set it once (unless you delete and recreate the service).

---

## 📝 Update Deployment Scripts

To prevent this in the future, update your deployment script:

### **Option 1: Update deploy.sh**

Add environment variables to deployment:

```bash
# In deploy.sh, when deploying to Cloud Run
gcloud run deploy sheltr-api \
  --source . \
  --region=us-central1 \
  --set-env-vars="OPENAI_API_KEY=${OPENAI_API_KEY}" \
  --allow-unauthenticated
```

### **Option 2: Use .env.yaml**

Create `apps/api/.env.yaml`:

```yaml
OPENAI_API_KEY: YOUR-ACTUAL-OPENAI-API-KEY
FIREBASE_PROJECT_ID: sheltr-ai
# Add other environment variables
```

Then deploy with:

```bash
gcloud run deploy sheltr-api \
  --source . \
  --region=us-central1 \
  --env-vars-file=.env.yaml \
  --allow-unauthenticated
```

### **Option 3: Use Google Secret Manager (Most Secure)**

```bash
# Store secret (replace YOUR-KEY with actual key)
echo -n "YOUR-ACTUAL-OPENAI-API-KEY" | \
  gcloud secrets create openai-api-key --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding openai-api-key \
  --member=serviceAccount:SERVICE_ACCOUNT@sheltr-ai.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Deploy with secret
gcloud run deploy sheltr-api \
  --source . \
  --region=us-central1 \
  --set-secrets="OPENAI_API_KEY=openai-api-key:latest" \
  --allow-unauthenticated
```

---

## 🎯 Summary

**The Fix:**
1. Add `OPENAI_API_KEY` environment variable to Cloud Run service
2. Redeploy the service
3. Test production chatbot

**Estimated Time:** 5-10 minutes

**Why Localhost Works:** `.env` file has the key locally

**Why Production Doesn't:** Cloud Run doesn't have the key yet

**After Fix:** Both FAQ and RAG queries will work in production! 🚀

---

**Let's get this fixed and make your production chatbot complete!** 💪

