# 🔄 Gemini API Key Rotation Guide

**Date**: November 24, 2025, 6:10 AM EST  
**Estimated Time**: 5 minutes  
**Difficulty**: Easy

---

## 🎯 **Quick Summary**

Your Gemini API key was flagged as leaked by Google. Follow these steps to rotate it and update all systems.

---

## ✅ **Step-by-Step Instructions**

### **Step 1: Rotate the Key in Google AI Studio** (1 minute)

1. You're already on the right page! ✅
2. Click **"Rotate key"** button
3. **Copy the new key immediately** (you won't see it again!)
4. Save it temporarily in a secure note

**Why Rotate vs Generate New?**
- ✅ Automatically invalidates the old (leaked) key
- ✅ One-click process
- ✅ Maintains security audit trail

---

### **Step 2: Update Google Cloud Secret Manager** (2 minutes)

Run this script (it will prompt you for the new key):

```bash
/tmp/update-gemini-key.sh
```

**What it does**:
1. Adds new version to Secret Manager
2. Updates Cloud Run service to use latest version
3. Triggers automatic redeployment

**Expected output**:
```
🔑 Updating GEMINI_API_KEY in Secret Manager...
Please paste your NEW Gemini API key:
[paste key here]
✅ Secret updated successfully!
✅ Cloud Run service updated!
🎉 All done! The new key is now active in production.
```

---

### **Step 3: Update Local Development Environment** (1 minute)

Run this script (it will prompt you for the new key):

```bash
/tmp/update-local-env.sh
```

**What it does**:
1. Updates `apps/api/.env` with new key
2. Verifies `.env` is in `.gitignore`
3. Creates backup of old `.env`

**Expected output**:
```
🔧 Updating local environment files...
Please paste your NEW Gemini API key:
[paste key here]
✅ Updated apps/api/.env
🎉 Local environment updated!
```

---

### **Step 4: Verify Everything Works** (1 minute)

#### **Test Production**

1. Go to: https://sheltr-ai.web.app
2. Open the chatbot widget
3. Ask: **"Can you summarize our roadmap high-level over the next 60 to 90 days?"**
4. ✅ Should get accurate roadmap data (not generic answer)

#### **Test Dashboard**

1. Go to: https://sheltr-ai.web.app/dashboard/chatbots
2. Select **Gemini 2.5 Flash** model
3. Ask: **"What is our MSB registration process?"**
4. ✅ Should get detailed MSB information

#### **Check Logs**

```bash
gcloud run services logs read sheltr-api \
  --region us-central1 \
  --limit 50 \
  --project=sheltr-ai | grep -i gemini
```

**Good signs**:
- ✅ `Gemini service initialized successfully`
- ✅ `Gemini (gemini-2.5-flash) response generated successfully`

**Bad signs**:
- ❌ `Your API key was reported as leaked`
- ❌ `403 POST https://generativelanguage.googleapis.com`
- ❌ `Falling back to OpenAI due to Gemini error`

---

## 🔒 **Security Best Practices**

### **After Rotation**

1. **Verify Old Key is Disabled**
   - Go back to Google AI Studio
   - Old key should show as "Inactive" or "Rotated"

2. **Check Git History**
   - Ensure no keys are committed:
     ```bash
     git log --all --full-history --source --pretty=format: \
       -S "AIzaSy" | sort -u
     ```

3. **Update .gitignore**
   - Verify `.env` files are ignored:
     ```bash
     grep -n "\.env" .gitignore
     ```
   - If not found, add:
     ```
     # Environment files with secrets
     .env
     .env.local
     .env.production
     **/.env
     ```

4. **Set API Key Restrictions**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click on your Gemini API key
   - Add restrictions:
     - **API restrictions**: Generative Language API only
     - **Application restrictions**: HTTP referrers (websites)
       - `https://sheltr-ai.web.app/*`
       - `https://sheltr-api-*.run.app/*`

---

## 🐛 **Troubleshooting**

### **"Secret not found" error**

If Secret Manager doesn't have `GEMINI_API_KEY` yet:

```bash
# Create new secret
echo "YOUR_NEW_KEY" | gcloud secrets create GEMINI_API_KEY \
  --data-file=- \
  --replication-policy="automatic" \
  --project=sheltr-ai

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:714964620823-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=sheltr-ai

# Update Cloud Run
gcloud run services update sheltr-api \
  --update-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --region=us-central1 \
  --project=sheltr-ai
```

### **"Permission denied" error**

Authenticate with Google Cloud:

```bash
gcloud auth login
gcloud config set project sheltr-ai
```

### **"Service not found" error**

Verify Cloud Run service name:

```bash
gcloud run services list --region=us-central1 --project=sheltr-ai
```

### **Chatbot still giving generic answers**

1. Check if Gemini is actually being used:
   ```bash
   gcloud run services logs read sheltr-api \
     --region us-central1 \
     --limit 20 \
     --project=sheltr-ai | grep "Using.*provider"
   ```

2. Should see:
   ```
   🤖 Using gemini provider with model: gemini-2.5-flash
   ```

3. If seeing:
   ```
   🤖 Using openai provider with model: gpt-4o-mini
   ```
   Then Gemini is still failing - check logs for errors.

---

## 📊 **Expected Results**

### **Before Rotation**
- ❌ Gemini: Disabled (key leaked)
- ⚠️ Fallback: OpenAI (no RAG context)
- 😞 Answers: Generic, not from knowledge base
- 💸 Cost: ~$5-10/day

### **After Rotation**
- ✅ Gemini: Active and working
- ✅ RAG: Providing knowledge context
- ✅ Answers: Accurate, from knowledge base
- 💰 Cost: ~$0.50-1/day

**Savings**: $4-9/day = **$120-270/month**

---

## 📋 **Checklist**

- [ ] Rotated key in Google AI Studio
- [ ] Copied new key to secure note
- [ ] Ran `/tmp/update-gemini-key.sh`
- [ ] Verified Secret Manager updated
- [ ] Verified Cloud Run updated
- [ ] Ran `/tmp/update-local-env.sh`
- [ ] Verified local `.env` updated
- [ ] Tested production chatbot
- [ ] Tested dashboard chatbot
- [ ] Checked logs for success messages
- [ ] Verified old key is inactive
- [ ] Added API key restrictions
- [ ] Verified `.env` in `.gitignore`

---

## 🎉 **Success Indicators**

You'll know it's working when:

1. **Dashboard chatbot** gives accurate roadmap summaries
2. **Public chatbot** uses RAG for complex questions
3. **Logs show**: `✅ Gemini service initialized successfully`
4. **No errors** about leaked keys or 403 responses
5. **Cost drops** significantly (check Google Cloud billing)

---

## 📚 **Related Documentation**

- `docs/issues/GEMINI-API-KEY-LEAKED.md` - Incident analysis
- `docs/deployment/API-KEYS-PRODUCTION-SETUP.md` - Full setup guide
- `docs/setup/GEMINI-API-KEY-SETUP-GUIDE.md` - Initial setup
- `GEMINI-FIX-STATUS.md` - Previous fixes

---

## 🆘 **Need Help?**

If you encounter issues:

1. Check logs: `gcloud run services logs read sheltr-api --region us-central1 --limit 100`
2. Verify secret: `gcloud secrets versions list GEMINI_API_KEY --project=sheltr-ai`
3. Check service: `gcloud run services describe sheltr-api --region=us-central1 --format=yaml | grep -A 5 secrets`

---

**Created By**: AI Assistant  
**Date**: November 24, 2025, 6:10 AM EST  
**Estimated Time**: 5 minutes total  
**Difficulty**: Easy (just follow the steps!)

