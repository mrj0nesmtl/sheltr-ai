# 🔍 Session 23 Final Status - RAG Production Issue

**Date:** Wednesday, October 15, 2025 - Evening  
**Session:** Chatbot Production RAG Debugging  
**Status:** 🟡 IN PROGRESS - Network connectivity fix deployed  

---

## 📊 **What We Discovered**

### ✅ **What's Working:**
1. **API Health:** Backend is healthy and running
2. **API Key:** OpenAI API key is correctly configured in Secret Manager
3. **Secret Exposure:** Environment variable `OPENAI_API_KEY` properly exposed
4. **FAQ Service:** Working perfectly (<1s responses)
5. **Localhost:** Everything works on local machine

### ❌ **What's Broken:**
1. **OpenAI Connection:** Production cannot connect to `api.openai.com`
2. **Error:** `Connection error` when making OpenAI API calls
3. **Symptoms:** Retries, timeouts, fallback to generic responses

---

## 🎯 **Root Cause**

**NOT an API key issue** - The problem is **network connectivity**!

Cloud Run containers are experiencing connection errors when trying to reach OpenAI's API endpoints:

```
ERROR:services.openai_service:OpenAI API error: Connection error.
INFO:openai._base_client:Retrying request to /chat/completions
ERROR:services.embeddings_service:Query embedding generation failed: Connection error.
```

**Timeline:**
- Request comes in → Chatbot processes → Calls OpenAI
- OpenAI connection attempt → Network timeout/failure
- Retry 3 times → All fail
- Falls back to generic response
- Total time: ~21 seconds (way too slow)

---

## 🛠️ **Fixes Deployed**

### **Commit: 44fef7e8**
"fix: Improve OpenAI network connectivity for Cloud Run"

**Changes Made:**

1. **Enhanced HTTP Client** (`openai_service.py`):
   ```python
   http_client = httpx.AsyncClient(
       timeout=httpx.Timeout(30.0, connect=15.0),  # Longer connect timeout
       limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
       follow_redirects=True
   )
   
   self.client = openai.AsyncOpenAI(
       api_key=api_key,
       timeout=30,
       max_retries=3,  # Explicit retries
       http_client=http_client  # Custom HTTP client
   )
   ```

2. **Network Debug Endpoint** (`main.py`):
   - New endpoint: `/debug/network-test`
   - Tests DNS resolution
   - Tests HTTPS to Google (control)
   - Tests HTTPS to OpenAI
   - Tests OpenAI API with authentication
   - Returns detailed diagnostics

---

## 🧪 **Next Steps for Testing**

### **Step 1: Wait for Deployment** (5-10 minutes)

Cloud Run will automatically pull and deploy the new commit from main branch.

Check status:
```bash
gcloud run services describe sheltr-api \
  --region=us-central1 \
  --format="value(status.url)"
```

---

### **Step 2: Test Network Connectivity**

Once deployed, run the network test:

```bash
curl https://sheltr-api-714964620823.us-central1.run.app/debug/network-test | jq '.'
```

**Expected Output:**
```json
{
  "tests": {
    "dns_openai": {"success": true, "ip": "..."},
    "https_google": {"success": true, "status": 200},
    "https_openai": {"success": true, "status": 200},
    "openai_api_auth": {"success": true, "status": 200}
  },
  "summary": {
    "total_tests": 4,
    "passed": 4,
    "failed": 0
  }
}
```

---

### **Step 3: Test RAG Chatbot**

If network test passes, test the chatbot:

```bash
./docs/04-development/QUICK-RAG-TEST-COMMANDS.sh
```

Or manually test on site: https://sheltr-ai.web.app

Ask: "explain how the blockchain verifies my donation and what smart contracts are involved"

---

## 📋 **If It Still Doesn't Work**

### **Option A: Network Configuration Issue**

If network test shows failures, the issue is GCP network configuration:

**Potential Solutions:**
1. Enable VPC connector for outbound traffic
2. Check firewall rules (should allow HTTPS egress)
3. Verify Cloud Run service account has network permissions

See: `docs/04-development/PRODUCTION-OPENAI-CONNECTION-ERROR.md` for detailed steps

---

### **Option B: OpenAI API Issues**

If network test passes but chatbot still fails:

1. Check OpenAI Dashboard for:
   - API key status
   - Usage limits
   - Rate limiting
   - Service status

2. Verify the API key in Secret Manager is correct:
   ```bash
   gcloud secrets versions access latest --secret=openai-api-key
   # Compare with local .env file
   ```

---

### **Option C: Timeout Still Too Short**

If calls are slow but working:

1. Increase timeout in openai_service.py
2. Increase Cloud Run request timeout:
   ```bash
   gcloud run services update sheltr-api \
     --region=us-central1 \
     --timeout=300  # 5 minutes max
   ```

---

## 📖 **Reference Documents Created**

1. **`PRODUCTION-RAG-FIX-STEPS.md`**
   - Step-by-step guide to add OpenAI API key
   - Multiple methods (Console, CLI, Secret Manager)

2. **`PRODUCTION-OPENAI-CONNECTION-ERROR.md`**
   - Deep dive into connection error issue
   - Root cause analysis
   - Multiple solution paths
   - Diagnostic procedures

3. **`RAG-FALLBACK-TROUBLESHOOTING-PLAN.md`**
   - Comprehensive troubleshooting guide
   - 6-step escalation process
   - Quick fixes and nuclear options
   - Emergency rollback procedures

4. **`QUICK-RAG-TEST-COMMANDS.sh`**
   - Automated testing script
   - Tests health, FAQ, and RAG
   - Color-coded output
   - Clear pass/fail indicators

---

## 💾 **Key Learnings**

### **What We Thought:**
- Missing API key ❌
- Wrong secret configuration ❌
- IAM permissions issue ❌

### **What It Actually Was:**
- Network connectivity problem ✅
- Connection timeouts ✅
- Need better HTTP client configuration ✅

### **Lesson:**
When `health_check` says "available" but actual calls fail:
- It's NOT the API key
- It's NOT the environment variable
- It's probably NETWORK connectivity

Always check the logs for "Connection error" vs "401 Unauthorized"!

---

## 🎯 **Success Criteria**

The issue is resolved when:

- [ ] Network test shows all 4 tests passing
- [ ] RAG queries return detailed answers (not generic responses)
- [ ] Response time < 8 seconds
- [ ] No "Connection error" in logs
- [ ] Production behavior matches localhost

---

## 📞 **Current Action Items**

### **For You (Joel):**

1. ⏳ Wait 5-10 minutes for deployment
2. 🧪 Run network test: `curl .../debug/network-test`
3. ✅ If pass: Test chatbot on site
4. ❌ If fail: Check `PRODUCTION-OPENAI-CONNECTION-ERROR.md`

### **For Next Session:**

If this is resolved:
- ✅ Test all FAQ categories
- ✅ Test authenticated chatbot
- 🚀 Move to notification system debugging (Session 23 main goal)

If not resolved:
- 🔍 Deep dive into GCP network configuration
- 📞 Consider opening Google Cloud support ticket
- 🔄 Temporary workaround: Switch to Firebase Functions

---

## 📦 **Commits Made This Session**

1. **`2374a9d6`** - docs: Add production RAG fix guide (safe, no API keys)
2. **`44fef7e8`** - fix: Improve OpenAI network connectivity for Cloud Run

**Total Files Changed:** 8  
**Total Lines Added:** 1,142  
**Documentation Created:** 4 comprehensive guides  

---

## 🎓 **Technical Summary**

**Problem:** Cloud Run → OpenAI API connection failures  
**Diagnosis Tool:** Network debug endpoint  
**Fix Applied:** Enhanced HTTP client with better timeouts and retries  
**Monitoring:** Cloud Run logs + network test endpoint  
**Fallback Plan:** Multiple documented solutions if this doesn't work  

---

**Status:** Waiting for deployment to complete and network test results.

**Last Update:** October 15, 2025 - 5:25 PM PST  
**Next Update:** After deployment and testing  

---

## 🚀 **Quick Commands Reference**

```bash
# Check deployment status
gcloud run revisions list --service=sheltr-api --region=us-central1 --limit=5

# Test network connectivity
curl https://sheltr-api-714964620823.us-central1.run.app/debug/network-test | jq '.'

# Test chatbot
./docs/04-development/QUICK-RAG-TEST-COMMANDS.sh

# Check logs
gcloud run services logs read sheltr-api --region=us-central1 --limit=50

# Rollback if needed
gcloud run services update-traffic sheltr-api \
  --region=us-central1 \
  --to-revisions=sheltr-api-00126-669=100
```

---

**We're getting close! The infrastructure is solid - just need to solve this network connectivity puzzle.** 🧩

