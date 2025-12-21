# 🔑 Gemini API Key Setup Guide

**For**: SHELTR Platform  
**Date**: November 24, 2025  
**Purpose**: Set up Google Gemini API key with proper restrictions for production use

---

## 🎯 **Overview**

SHELTR uses Google's Gemini 2.5 Flash models for chatbot conversations. This guide will help you create a secure API key with appropriate restrictions.

---

## 📋 **Prerequisites**

- Google Account (you have this)
- Access to Google AI Studio
- Access to SHELTR backend `.env` file

---

## 🚀 **Step 1: Get Your Gemini API Key**

### **Option A: Google AI Studio (Recommended for Testing)**

1. **Go to Google AI Studio**:
   - URL: https://aistudio.google.com/apikey
   - Sign in with your Google account

2. **Create API Key**:
   - Click **"Create API Key"**
   - Choose **"Create API key in new project"** (or select existing project)
   - Copy the generated key (starts with `AIza...`)

3. **Save the Key**:
   - Store it securely (you'll need it in Step 3)
   - **Important**: This key is shown only once!

---

### **Option B: Google Cloud Console (Recommended for Production)**

1. **Go to Google Cloud Console**:
   - URL: https://console.cloud.google.com/
   - Select your Firebase project: `sheltr-ai`

2. **Enable Gemini API**:
   - Go to **APIs & Services** → **Library**
   - Search for **"Generative Language API"**
   - Click **"Enable"**

3. **Create API Key**:
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"API Key"**
   - Copy the generated key

4. **Restrict the API Key** (CRITICAL for production):
   - Click on the newly created key
   - Under **"API restrictions"**:
     - Select **"Restrict key"**
     - Check **"Generative Language API"**
   - Under **"Application restrictions"**:
     - Select **"IP addresses"**
     - Add your server's IP address
     - Or select **"HTTP referrers"** and add `sheltr-ai.web.app`
   - Click **"Save"**

---

## 🔒 **Step 2: Recommended API Key Restrictions**

### **For Development (Localhost)**
```
Application Restrictions: None
API Restrictions: Generative Language API only
```

### **For Production (sheltr-ai.web.app)**
```
Application Restrictions:
  - HTTP referrers: sheltr-ai.web.app, *.sheltr-ai.web.app
  OR
  - IP addresses: [Your server IP]

API Restrictions:
  - Generative Language API
  
Rate Limiting:
  - Set quota limits to prevent abuse
  - Recommended: 1000 requests/day for testing
  - Adjust based on usage
```

---

## 🛠️ **Step 3: Add API Key to Backend**

### **1. Open Backend Environment File**
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai/apps/api
nano .env
```

### **2. Add Gemini API Key**
Add this line to your `.env` file:

```bash
# Google Gemini Configuration
GEMINI_API_KEY=AIza...your-key-here
```

**Example**:
```bash
# Google Gemini Configuration
GEMINI_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### **3. Save and Exit**
- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

---

## 🔄 **Step 4: Restart Backend**

### **Stop Current Backend**
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
./stop-dev.sh
```

### **Start Backend with New Key**
```bash
./start-dev.sh
```

### **Verify Backend Started**
```bash
# Check backend logs
tail -f logs/backend.log

# Look for:
# ✅ Gemini service initialized
# ✅ Backend running on http://localhost:8000
```

---

## ✅ **Step 5: Verify Gemini is Working**

### **Test 1: Backend Health Check**
```bash
curl http://localhost:8000/api/v1/chatbot/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "gemini_available": true,
  "openai_available": true,
  "anthropic_available": true
}
```

### **Test 2: Dashboard Test**
1. Go to `http://localhost:3000/dashboard/chatbots`
2. Click **"New Chat"**
3. Select **"Gemini 2.5 Flash ⚡"**
4. Ask: **"What is SHELTR?"**
5. ✅ **Expected**: Response in <1 second (with FAQ fix)

### **Test 3: Check Backend Logs**
```bash
tail -f logs/backend.log
```

**Look for**:
```
INFO: 🤖 Using gemini provider with model: gemini-2.5-flash
INFO: ✅ Gemini response generated successfully
```

**Should NOT see**:
```
WARNING: ⚠️ Gemini service not available, falling back to OpenAI
```

---

## 🐛 **Troubleshooting**

### **Issue 1: "Gemini service not available"**

**Symptom**: Backend logs show fallback to OpenAI

**Causes**:
1. API key not added to `.env`
2. API key is invalid
3. Backend not restarted after adding key

**Fix**:
```bash
# 1. Verify key is in .env
cat apps/api/.env | grep GEMINI_API_KEY

# 2. Restart backend
./stop-dev.sh && sleep 2 && ./start-dev.sh

# 3. Check logs
tail -f logs/backend.log
```

---

### **Issue 2: "API key not valid"**

**Symptom**: Error message about invalid API key

**Causes**:
1. Key copied incorrectly (extra spaces, newlines)
2. Key restrictions too strict
3. API not enabled in Google Cloud

**Fix**:
```bash
# 1. Re-copy key (no spaces!)
# 2. Check Google Cloud Console:
#    - Is "Generative Language API" enabled?
#    - Are restrictions too strict?
# 3. Try creating a new unrestricted key for testing
```

---

### **Issue 3: "Quota exceeded"**

**Symptom**: Error about rate limits

**Causes**:
1. Too many requests
2. Quota limits too low

**Fix**:
1. Go to Google Cloud Console
2. APIs & Services → Quotas
3. Increase limits for "Generative Language API"

---

## 💰 **Cost Considerations**

### **Gemini 2.5 Flash Pricing** (as of Nov 2024)
- **Input**: $0.075 per 1M tokens
- **Output**: $0.30 per 1M tokens
- **Context**: 1M tokens (8x larger than GPT-4o Mini)

### **Cost Comparison**
| Model | Input (1M tokens) | Output (1M tokens) | Context |
|-------|-------------------|-------------------|---------|
| Gemini 2.5 Flash | $0.075 | $0.30 | 1M |
| GPT-4o Mini | $0.15 | $0.60 | 128K |
| Claude 3.5 Haiku | $0.80 | $4.00 | 200K |

**Gemini is 50% cheaper than GPT-4o Mini!**

### **Estimated Monthly Cost** (SHELTR)
- **Assumption**: 10,000 chatbot conversations/month
- **Avg tokens**: 500 input, 300 output per conversation
- **Gemini Cost**: ~$4.50/month
- **GPT-4o Mini Cost**: ~$9.00/month
- **Savings**: ~$4.50/month (50%)

---

## 🔐 **Security Best Practices**

### **DO**:
- ✅ Restrict API key to specific APIs (Generative Language API only)
- ✅ Use IP restrictions for production
- ✅ Set quota limits to prevent abuse
- ✅ Rotate keys every 90 days
- ✅ Monitor usage in Google Cloud Console
- ✅ Keep keys in `.env` (never commit to Git)

### **DON'T**:
- ❌ Use unrestricted keys in production
- ❌ Commit API keys to Git
- ❌ Share keys publicly
- ❌ Use same key for dev and production
- ❌ Forget to set quota limits

---

## 📊 **Monitoring Usage**

### **Google Cloud Console**
1. Go to **APIs & Services** → **Dashboard**
2. Select **"Generative Language API"**
3. View:
   - Requests per day
   - Errors
   - Latency
   - Quota usage

### **Set Up Alerts**
1. Go to **Monitoring** → **Alerting**
2. Create alert for:
   - High error rate
   - Quota approaching limit
   - Unusual traffic patterns

---

## 🎉 **Success Checklist**

- [ ] API key created in Google AI Studio or Cloud Console
- [ ] API key added to `apps/api/.env`
- [ ] Backend restarted
- [ ] Health check shows `gemini_available: true`
- [ ] Dashboard test works with Gemini model
- [ ] Backend logs show Gemini responses (no fallback)
- [ ] FAQ fix verified (response <1s)
- [ ] (Production) API key restrictions configured
- [ ] (Production) Quota limits set
- [ ] (Production) Monitoring alerts configured

---

## 📝 **Next Steps**

After setting up the API key:

1. **Test FAQ Performance**:
   - Re-test "What is SHELTR?" (should be <1s now)
   - Test all 30 FAQ/RAG questions
   - Verify FAQ hit rate >90%

2. **Test Public Chatbot**:
   - Anonymous user test
   - Authenticated user test
   - Role recognition test

3. **Monitor Performance**:
   - Response times
   - Error rates
   - Cost per conversation

4. **Optimize**:
   - Add more FAQ entries for common questions
   - Reduce RAG usage (expensive, slow)
   - Fine-tune prompts for better responses

---

## 🆘 **Need Help?**

### **Google AI Studio Support**
- Docs: https://ai.google.dev/docs
- Community: https://discuss.ai.google.dev/

### **SHELTR Support**
- Check backend logs: `tail -f logs/backend.log`
- Review test results: `docs/testing/PHASE-1-DASHBOARD-GEMINI-TEST-RESULTS.md`
- Contact: Joel Yaffe (Super Admin)

---

**Last Updated**: November 24, 2025  
**Version**: 1.0  
**Status**: Ready for Implementation

