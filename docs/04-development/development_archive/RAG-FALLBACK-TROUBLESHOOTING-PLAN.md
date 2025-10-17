# 🔍 RAG Fallback Troubleshooting Plan - If Deployment Doesn't Fix It

**Date:** October 15, 2025 (Evening)  
**Current Status:** 🟡 Deployment in progress (revision sheltr-api-00127-778)  
**Issue:** RAG queries failing in production (FAQ queries work perfectly)

---

## ✅ What We Know So Far

**Working:**
- ✅ API is healthy: https://sheltr-api-714964620823.us-central1.run.app/
- ✅ FAQ queries: <1s response time
- ✅ Localhost: Both FAQ and RAG working
- ✅ OpenAI API key exists in Secret Manager (since August 20, 2025)
- ✅ Secret exposed as `OPENAI_API_KEY` environment variable
- ✅ New revision deploying: `sheltr-api-00127-778`

**Not Working:**
- ❌ Production RAG queries: Generic error message
- ❌ Complex questions fail: "I'm having trouble connecting right now"

---

## 🧪 Step 1: Test After Deployment (5 minutes)

### **Test 1A: Check Health Endpoint**

```bash
curl https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/health
```

**What to Look For:**
```json
{
  "status": "healthy",
  "openai_service": "available",  // KEY: Should be "available"
  "services": {
    "orchestrator": "operational",
    "rag_orchestrator": "operational",
    "faq_service": "operational"
  }
}
```

**If `openai_service` is still "unavailable":**
→ Go to Step 2 (Check Environment Variable)

**If `openai_service` is "available":**
→ Continue to Test 1B

---

### **Test 1B: Test FAQ Query (Should Still Work)**

Go to: https://sheltr-ai.web.app

Ask: `"when does sheltr launch?"`

**Expected:** FAQ answer in <1 second ✅

---

### **Test 1C: Test RAG Query (The Critical Test)**

Ask: `"explain how the blockchain verifies my donation and what smart contracts are involved?"`

**Expected:** Detailed answer in 2-8 seconds

**If it works:** 🎉 **PROBLEM SOLVED!** Document the fix and move on.

**If it still fails:** → Continue to Step 2

---

## 🔍 Step 2: Verify Environment Variable (10 minutes)

### **Check 2A: Is the Variable Actually Set?**

```bash
# Get current revision details
gcloud run revisions describe sheltr-api-00127-778 \
  --region=us-central1 \
  --format="yaml(spec.containers[0].env)"
```

**Look for:**
```yaml
env:
- name: OPENAI_API_KEY
  valueFrom:
    secretKeyRef:
      key: latest
      name: openai-api-key
```

**If missing:** → Go to Step 3 (Manual Fix)

---

### **Check 2B: Check Cloud Run Logs**

```bash
# Check recent logs
gcloud run services logs read sheltr-api \
  --region=us-central1 \
  --limit=100 \
  --format="table(timestamp,message)"
```

**Look for these error patterns:**

1. **"OPENAI_API_KEY not found"**
   → Secret not loading properly

2. **"OpenAI service not available"**
   → API key invalid or OpenAI API down

3. **"RAG response timeout"**
   → RAG taking too long (>8 seconds)

4. **"401 Unauthorized" or "API key invalid"**
   → Wrong API key or expired key

5. **"Rate limit exceeded"**
   → OpenAI rate limiting (need to upgrade plan)

---

### **Check 2C: Test OpenAI API Key Directly**

```bash
# Test the API key from Secret Manager
# First, get the secret value
gcloud secrets versions access latest --secret=openai-api-key

# Then test it with OpenAI API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR-KEY-FROM-ABOVE"
```

**Expected:** List of models (gpt-4, gpt-3.5-turbo, etc.)

**If error:**
- "Invalid API key" → Key is wrong or expired
- "Rate limit exceeded" → Upgrade OpenAI plan
- No response → Network/connectivity issue

---

## 🛠️ Step 3: Manual Fixes Based on Findings

### **Fix 3A: Secret Not Loading (Most Likely)**

**Problem:** Cloud Run can't access the secret

**Solution:**

```bash
# Grant Cloud Run service account access to secret
gcloud secrets add-iam-policy-binding openai-api-key \
  --member="serviceAccount:714964620823-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Redeploy
gcloud run services update sheltr-api \
  --region=us-central1 \
  --update-secrets=OPENAI_API_KEY=openai-api-key:latest
```

---

### **Fix 3B: Wrong or Expired API Key**

**Problem:** Key in Secret Manager is wrong/expired

**Solution:**

1. Get correct key from local `.env`:
   ```bash
   cat apps/api/.env | grep OPENAI_API_KEY
   ```

2. Update secret:
   ```bash
   echo -n "YOUR-CORRECT-KEY" | \
     gcloud secrets versions add openai-api-key --data-file=-
   ```

3. Redeploy Cloud Run (it will use new "latest" version)

---

### **Fix 3C: Use Environment Variable Instead of Secret**

**Problem:** Secret Manager integration not working

**Solution:** Switch to direct environment variable

```bash
gcloud run services update sheltr-api \
  --region=us-central1 \
  --set-env-vars="OPENAI_API_KEY=YOUR-ACTUAL-KEY" \
  --remove-secrets=OPENAI_API_KEY
```

**Note:** Less secure but will work immediately

---

### **Fix 3D: Increase RAG Timeout**

**Problem:** RAG queries timing out before completion

**Solution:** Modify code to increase timeout

In `apps/api/services/chatbot/orchestrator.py` line ~495:

```python
# Change from 8 seconds to 15 seconds
rag_response = await asyncio.wait_for(
    rag_orchestrator.handle_message(...),
    timeout=15.0  # Increased from 8.0
)
```

Then redeploy:
```bash
gcloud run deploy sheltr-api \
  --source apps/api \
  --region=us-central1
```

---

## 🔍 Step 4: Deep Diagnostic (30 minutes)

If none of the above works, we need to dig deeper:

### **Diagnostic 4A: Enable Debug Logging**

Add to Cloud Run environment variables:
```bash
LOG_LEVEL=DEBUG
OPENAI_DEBUG=true
```

Then check logs for detailed error messages.

---

### **Diagnostic 4B: Test Backend Directly**

```bash
# SSH into Cloud Run container (if enabled)
# Or test API endpoint directly with verbose output

curl -v -X POST https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{"message": "explain blockchain", "user_id": "debug_test", "context": {}}'
```

Look for error codes in response headers.

---

### **Diagnostic 4C: Compare Localhost vs Production**

**Check these differences:**

| Aspect | Localhost | Production |
|--------|-----------|------------|
| OpenAI Key | From .env file | From Secret Manager |
| Python Version | ? | ? |
| Firestore Access | Service account | Compute service account |
| Network | Direct | Through Cloud Run |
| Timeout | None | 300s (Cloud Run) |

---

## 🚀 Step 5: Alternative Solutions

If we can't get Secret Manager working:

### **Option 5A: Use Firebase Functions Instead**

Deploy API as Firebase Functions which has better secret integration:

```bash
cd apps/api
firebase functions:secrets:set OPENAI_API_KEY
firebase deploy --only functions
```

---

### **Option 5B: Use Cloud Run Environment Variables**

Direct environment variables (less secure but guaranteed to work):

```bash
gcloud run services update sheltr-api \
  --region=us-central1 \
  --set-env-vars="OPENAI_API_KEY=$(cat apps/api/.env | grep OPENAI_API_KEY | cut -d= -f2)"
```

---

### **Option 5C: Pre-build Docker Image**

Build container locally with env vars baked in:

```dockerfile
# Dockerfile
FROM python:3.11
COPY apps/api /app
WORKDIR /app
ENV OPENAI_API_KEY=your-key-here
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and deploy:
```bash
docker build -t gcr.io/sheltr-ai/sheltr-api .
docker push gcr.io/sheltr-ai/sheltr-api
gcloud run deploy sheltr-api --image gcr.io/sheltr-ai/sheltr-api
```

---

## 📊 Step 6: Verify Root Cause

Once it's working, identify what fixed it:

### **Was it:**

- [ ] Just needed fresh deployment?
- [ ] IAM permissions on secret?
- [ ] Wrong/expired API key?
- [ ] Timeout issue?
- [ ] Network/connectivity?
- [ ] Something else?

**Document the fix** so we don't face this again!

---

## 🎯 Success Criteria Checklist

✅ **Working When:**

- [ ] Health endpoint shows `"openai_service": "available"`
- [ ] FAQ queries work (<1s response)
- [ ] RAG queries return detailed answers (2-8s)
- [ ] No "trouble connecting" errors
- [ ] Production matches localhost behavior
- [ ] All test questions answered correctly

---

## 💡 Prevention for Future

### **Add to Deployment Scripts:**

```bash
# In deploy.sh or CI/CD pipeline
# Verify secret exists before deploying
if gcloud secrets describe openai-api-key &>/dev/null; then
  echo "✅ OpenAI secret exists"
else
  echo "❌ OpenAI secret missing - deployment will fail!"
  exit 1
fi

# Verify IAM permissions
gcloud secrets get-iam-policy openai-api-key --format=json | \
  grep "714964620823-compute@developer.gserviceaccount.com" || \
  echo "⚠️ Warning: Service account may not have secret access"
```

---

## 📞 Emergency Rollback

If the new revision breaks everything:

```bash
# Rollback to previous working revision
gcloud run services update-traffic sheltr-api \
  --region=us-central1 \
  --to-revisions=sheltr-api-00126-669=100

# Or use Cloud Console:
# 1. Go to Revisions tab
# 2. Click previous revision (sheltr-api-00126-669)
# 3. Click "Manage Traffic"
# 4. Set to 100%
```

---

## 🎓 Key Learnings

**What We Learned:**

1. **Secret Manager != Automatic Access**
   - Need IAM permissions configured
   - Service account must have secretAccessor role

2. **Localhost != Production**
   - Different auth mechanisms
   - Different environment variable sources
   - Different network configurations

3. **Cloud Run Secrets Are Tricky**
   - Need proper setup in deployment
   - Must reference "latest" version
   - Environment variable name must match code

4. **Testing Is Critical**
   - Always test after deployment
   - Health endpoints are essential
   - Direct API testing needed

---

## 📝 Next Steps After Fix

Once RAG is working in production:

1. **Document the fix** in this file
2. **Update deployment docs**
3. **Add health checks** to monitoring
4. **Create deployment checklist**
5. **Test all FAQ categories**
6. **Move to Session 23** - Notification system debug

---

**Current Status:** ⏳ Waiting for deployment to complete  
**Next Action:** Test health endpoint and RAG queries  
**Estimated Time to Fix:** 5-30 minutes depending on issue

---

**We'll get this working! The infrastructure is all there - just need to find the right configuration.** 🚀

