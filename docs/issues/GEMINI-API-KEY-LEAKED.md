# 🚨 CRITICAL: Gemini API Key Leaked

**Date**: November 24, 2025, 6:02 AM EST  
**Priority**: CRITICAL  
**Status**: REQUIRES IMMEDIATE ACTION

---

## 🔥 **Issue**

Google has flagged the Gemini API key as **leaked** and disabled it:

```
ERROR: 403 POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
Your API key was reported as leaked. Please use another API key.
```

**Impact**:
- ❌ Gemini chatbot responses failing in dashboard
- ⚠️ System falling back to OpenAI WITHOUT RAG context
- 😞 Users getting generic answers instead of knowledge-based responses
- 💸 Increased costs (OpenAI fallback instead of cheaper Gemini)

---

## 📊 **Evidence**

### **Log Entry** (Nov 24, 10:56:42 AM)

```
2025-11-24 10:56:42 INFO:services.embeddings_service:Semantic search for 'Can you summarize our roadmap high-level over the next 60 to 90 days?' returned 2 results
2025-11-24 10:56:42 INFO:services.chatbot.rag_orchestrator:Knowledge search returned 2 results
2025-11-24 10:56:42 INFO:services.chatbot_dashboard_service:🤖 Using gemini provider with model: gemini-2.5-flash
2025-11-24 10:56:42 ERROR:services.gemini_service:❌ Gemini generation error: 403 POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?%24alt=json%3Benum-encoding%3Dint: Your API key was reported as leaked. Please use another API key.
2025-11-24 10:56:42 ERROR:services.chatbot_dashboard_service:❌ Gemini generation failed: Gemini generation failed: 403 POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?%24alt=json%3Benum-encoding%3Dint: Your API key was reported as leaked. Please use another API key.
2025-11-24 10:56:42 INFO:services.chatbot_dashboard_service:⚠️ Falling back to OpenAI due to Gemini error
```

### **User Impact Example**

**Query**: "Can you summarize our roadmap high-level over the next 60 to 90 days?"

**Expected Behavior**:
1. ✅ RAG finds roadmap document chunks (2 results found)
2. ✅ Gemini generates response using roadmap data
3. ✅ User gets accurate roadmap summary

**Actual Behavior**:
1. ✅ RAG finds roadmap document chunks (2 results found)
2. ❌ Gemini fails with 403 error
3. ⚠️ Falls back to OpenAI WITHOUT RAG context
4. 😞 User gets generic "Phase 1: Foundation" answer (not from actual roadmap)

---

## 🔍 **Root Cause**

The Gemini API key (`AIzaSyA84d2CfHzYDSFGcNEZ8aX5I419DtYePr4`) was likely exposed in:

1. **GitHub Repository** (most likely)
   - Committed to `.env` files
   - Visible in commit history
   - Public or accessible to scanners

2. **Documentation Files**
   - Mentioned in setup guides
   - Included in example configurations

3. **Logs**
   - Printed in error messages
   - Visible in Cloud Run logs

4. **Browser DevTools**
   - Exposed in frontend code
   - Visible in network requests

**Google's automated scanners detected the key and disabled it for security.**

---

## ✅ **Immediate Action Required**

### **Step 1: Generate New API Key** (5 minutes)

1. Go to **Google AI Studio**: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select your project: `sheltr-ai`
4. **Copy the new key immediately** (you won't see it again)
5. **DO NOT commit this key to GitHub**

### **Step 2: Update Backend Environment** (5 minutes)

**Option A: Google Cloud Secret Manager** (Recommended)

```bash
# Create/update secret
gcloud secrets create GEMINI_API_KEY \
  --data-file=- \
  --replication-policy="automatic" \
  --project=sheltr-ai

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:714964620823-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=sheltr-ai

# Update Cloud Run service
gcloud run services update sheltr-api \
  --update-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --region=us-central1 \
  --project=sheltr-ai
```

**Option B: Direct Environment Variable** (Quick Fix)

```bash
# Update Cloud Run service directly
gcloud run services update sheltr-api \
  --set-env-vars="GEMINI_API_KEY=YOUR_NEW_KEY_HERE" \
  --region=us-central1 \
  --project=sheltr-ai
```

### **Step 3: Update Local Development** (2 minutes)

```bash
# Update apps/api/.env (DO NOT COMMIT)
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api
echo "GEMINI_API_KEY=YOUR_NEW_KEY_HERE" >> .env

# Verify .env is in .gitignore
grep "\.env" ../../.gitignore
```

### **Step 4: Verify Fix** (2 minutes)

```bash
# Restart backend
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api
source venv/bin/activate
uvicorn main:app --reload --port 8001

# Test Gemini service
curl -X POST http://localhost:8001/api/v1/health/gemini
```

### **Step 5: Clean Up Exposed Keys** (10 minutes)

1. **Remove from Git History**:
   ```bash
   # Use BFG Repo-Cleaner or git-filter-repo
   git filter-repo --path apps/api/.env --invert-paths
   ```

2. **Update Documentation**:
   - Remove any hardcoded keys from docs
   - Use placeholders: `GEMINI_API_KEY=your_key_here`

3. **Add to .gitignore**:
   ```
   # API Keys
   .env
   .env.local
   .env.production
   **/GEMINI_API_KEY*
   ```

---

## 🛡️ **Prevention Strategies**

### **1. Use Secret Manager** (Recommended)

Store all API keys in Google Cloud Secret Manager:
- ✅ Never exposed in code
- ✅ Automatic rotation
- ✅ Access logging
- ✅ IAM-based access control

### **2. Environment Variables Only**

Never hardcode keys:
```python
# ❌ BAD
GEMINI_API_KEY = "AIzaSyA84d2CfHzYDSFGcNEZ8aX5I419DtYePr4"

# ✅ GOOD
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
```

### **3. Git Hooks**

Add pre-commit hook to detect secrets:
```bash
# Install gitleaks
brew install gitleaks

# Add to .git/hooks/pre-commit
gitleaks protect --staged
```

### **4. API Key Restrictions**

In Google Cloud Console, restrict API keys:
- ✅ Limit to specific APIs (Generative Language API only)
- ✅ Limit to specific IP addresses (your Cloud Run service)
- ✅ Set usage quotas
- ✅ Enable alerts for unusual activity

### **5. Regular Rotation**

Rotate API keys every 90 days:
- Set calendar reminder
- Generate new key
- Update Secret Manager
- Delete old key

---

## 🐛 **Secondary Bug: Fallback Doesn't Include RAG Context**

### **Issue**

When Gemini fails, the system falls back to OpenAI, but **loses the RAG knowledge context**:

```python
# apps/api/services/chatbot_dashboard_service.py
# Line ~180-200

try:
    # Gemini generation with RAG context
    response = await gemini_service.generate_chat_completion(...)
except Exception as e:
    logger.error(f"❌ Gemini generation failed: {str(e)}")
    logger.info("⚠️ Falling back to OpenAI due to Gemini error")
    
    # ❌ BUG: This fallback doesn't include RAG context!
    response = await self.openai_service.generate_response(
        message=user_message,  # Just the raw message
        context=conversation_context,  # No RAG knowledge!
        system_prompt=system_prompt
    )
```

### **Fix Required**

Preserve RAG context in fallback:

```python
try:
    # Gemini generation with RAG context
    response = await gemini_service.generate_chat_completion(...)
except Exception as e:
    logger.error(f"❌ Gemini generation failed: {str(e)}")
    logger.info("⚠️ Falling back to OpenAI with RAG context")
    
    # ✅ FIX: Pass RAG context to OpenAI fallback
    if rag_response:
        # Use the RAG-enhanced prompt
        response = await self.openai_service.generate_response(
            message=rag_response.get('enhanced_prompt', user_message),
            context={
                **conversation_context,
                'knowledge_sources': rag_response.get('knowledge_sources', [])
            },
            system_prompt=system_prompt
        )
    else:
        # Standard fallback
        response = await self.openai_service.generate_response(
            message=user_message,
            context=conversation_context,
            system_prompt=system_prompt
        )
```

---

## 📋 **Action Checklist**

### **Immediate (Next 30 Minutes)**
- [ ] Generate new Gemini API key
- [ ] Update Google Cloud Secret Manager
- [ ] Update Cloud Run environment variables
- [ ] Restart backend service
- [ ] Test Gemini service health
- [ ] Verify chatbot responses use RAG context

### **Today**
- [ ] Fix fallback to preserve RAG context
- [ ] Add API key restrictions in Google Cloud Console
- [ ] Update local `.env` files
- [ ] Verify `.env` is in `.gitignore`
- [ ] Test end-to-end chatbot with new key

### **This Week**
- [ ] Remove old key from Git history
- [ ] Install gitleaks pre-commit hook
- [ ] Document secret management process
- [ ] Set up API key rotation schedule
- [ ] Add monitoring alerts for API failures

---

## 📊 **Testing Checklist**

After fixing, test these scenarios:

### **Dashboard Chatbot**
1. ✅ Ask roadmap question → Should get actual roadmap data
2. ✅ Ask MSB question → Should get accurate MSB info
3. ✅ Ask technical question → Should use technical agent

### **Public Chatbot**
1. ✅ Ask "What is SHELTR?" → Should use FAQ (instant)
2. ✅ Ask blockchain question → Should use RAG (with knowledge)
3. ✅ Ask donation question → Should use FAQ (instant)

### **Error Handling**
1. ✅ Verify Gemini errors are logged
2. ✅ Verify fallback includes RAG context
3. ✅ Verify users don't see error messages

---

## 💰 **Cost Impact**

### **With Leaked Key** (Current)
- Gemini: $0 (disabled)
- OpenAI Fallback: ~$0.02 per request
- **Daily Cost**: ~$5-10 (all OpenAI)

### **With New Key** (Expected)
- Gemini: ~$0.001 per request
- OpenAI Fallback: ~$0.02 per request (rare)
- **Daily Cost**: ~$0.50-1.00 (mostly Gemini)

**Savings**: $4-9 per day = **$120-270 per month**

---

## 📚 **Related Documentation**

- `docs/deployment/API-KEYS-PRODUCTION-SETUP.md`
- `docs/setup/GEMINI-API-KEY-SETUP-GUIDE.md`
- `GEMINI-FIX-STATUS.md`

---

**Created By**: AI Assistant  
**Date**: November 24, 2025, 6:02 AM EST  
**Priority**: CRITICAL  
**Estimated Time to Fix**: 30 minutes  
**Impact**: HIGH (chatbot quality, costs, user experience)

