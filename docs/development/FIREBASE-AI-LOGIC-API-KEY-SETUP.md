# 🔑 Firebase AI Logic API Key Setup

**Date**: November 24, 2025  
**Status**: Action Required

---

## 🚨 **Issue Discovered**

When testing Gemini 2.5 Flash connection, we encountered:

```
Error: API key not valid. Please pass a valid API key.
AI/fetch-error from firebasevertexai.googleapis.com
```

---

## 📋 **Root Cause**

Firebase AI Logic supports two backends:

### **1. GoogleAIBackend** (Gemini Developer API)
- ✅ **Pros**: Simple, client-side, no backend needed
- ❌ **Cons**: Requires separate Gemini API key (not Firebase API key)
- 🔑 **Requires**: API key from [Google AI Studio](https://aistudio.google.com/apikey)
- 💰 **Pricing**: Pay-as-you-go, free tier available
- 🌐 **Use case**: Client-side web apps, mobile apps

### **2. VertexAIBackend** (Vertex AI)
- ✅ **Pros**: Enterprise-grade, better security, uses Firebase Auth
- ❌ **Cons**: Requires backend/server-side setup
- 🔑 **Requires**: Firebase project with Vertex AI enabled
- 💰 **Pricing**: Enterprise pricing, requires billing account
- 🌐 **Use case**: Server-side, Cloud Functions, backend APIs

---

## 🎯 **Recommended Solution for SHELTR**

### **Option A: Use GoogleAIBackend (Simplest)** ⭐ RECOMMENDED

**Steps**:

1. **Get Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Click "Get API Key"
   - Create a new API key for SHELTR project
   - Copy the key (starts with `AIza...`)

2. **Add to Environment Variables**
   ```bash
   # apps/web/.env.local
   NEXT_PUBLIC_GEMINI_API_KEY=AIza...your-key-here
   ```

   ```bash
   # apps/web/.env.production
   NEXT_PUBLIC_GEMINI_API_KEY=AIza...your-key-here
   ```

3. **Update Gemini Service**
   ```typescript
   // apps/web/src/services/geminiService.ts
   
   // Initialize with API key
   const ai = getAI(firebaseApp, { 
     backend: new GoogleAIBackend({ 
       apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY 
     }) 
   });
   ```

4. **Secure the API Key**
   - Add to Firebase Hosting environment config
   - Use Firebase Remote Config for dynamic updates
   - Rotate keys regularly

**Pros**:
- ✅ Quick setup (5 minutes)
- ✅ Works client-side
- ✅ Free tier available
- ✅ No backend changes needed

**Cons**:
- ⚠️ API key exposed in client (mitigate with App Check)
- ⚠️ Separate billing from Firebase

---

### **Option B: Use VertexAIBackend (Enterprise)**

**Steps**:

1. **Enable Vertex AI in Google Cloud**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

2. **Update Gemini Service**
   ```typescript
   // apps/web/src/services/geminiService.ts
   import { VertexAIBackend } from 'firebase/ai';
   
   const ai = getAI(firebaseApp, { 
     backend: new VertexAIBackend({
       location: 'us-central1'
     }) 
   });
   ```

3. **Configure Authentication**
   - Uses Firebase Auth automatically
   - Requires user to be signed in
   - Better security, no exposed keys

**Pros**:
- ✅ Better security (no exposed keys)
- ✅ Uses Firebase Auth
- ✅ Enterprise-grade
- ✅ Single billing (Google Cloud)

**Cons**:
- ❌ More complex setup
- ❌ Requires backend configuration
- ❌ Higher cost (no free tier)

---

## 🚀 **Next Steps**

### **Immediate Action** (Choose One):

#### **Path A: GoogleAIBackend** ⭐ FASTEST
1. Get Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Add to `.env.local` and `.env.production`
3. Update `geminiService.ts` to use API key
4. Test connection
5. Deploy

**Time**: ~10 minutes

#### **Path B: VertexAIBackend** (More Secure)
1. Enable Vertex AI in Google Cloud Console
2. Update `geminiService.ts` to use VertexAIBackend
3. Configure Firebase Auth integration
4. Test connection
5. Deploy

**Time**: ~30 minutes

---

## 📊 **Security Considerations**

### **For GoogleAIBackend (API Key)**:

1. **Use Firebase App Check** ✅ (Already enabled!)
   - Protects API key from abuse
   - Limits requests to verified apps
   - Already configured for SHELTR

2. **Use Firebase Remote Config**
   - Store API key in Remote Config
   - Rotate keys without redeployment
   - Monitor usage

3. **Set Up Quotas**
   - Limit requests per day
   - Set spending alerts
   - Monitor usage in Google AI Studio

4. **Rotate Keys Regularly**
   - Monthly rotation recommended
   - Keep old keys for 24h during transition
   - Update all environments

### **For VertexAIBackend**:

1. **Use Firebase Auth** ✅
   - No exposed keys
   - User-level authentication
   - Better audit trail

2. **Set Up IAM Roles**
   - Limit access to Vertex AI
   - Use service accounts
   - Follow principle of least privilege

---

## 💰 **Cost Comparison**

### **GoogleAIBackend (Gemini Developer API)**
- Free tier: 15 requests/minute, 1,500 requests/day
- Paid: $0.075/1M tokens (Gemini 2.5 Flash)
- **Estimated for SHELTR**: $3-5/month

### **VertexAIBackend (Vertex AI)**
- No free tier
- $0.075/1M tokens (same model)
- Additional Vertex AI infrastructure costs
- **Estimated for SHELTR**: $10-15/month

---

## ✅ **Recommendation**

**Start with GoogleAIBackend (Option A)**:
- Fastest to implement
- Free tier covers development
- App Check provides security
- Can migrate to VertexAIBackend later if needed

**Migration Path**:
1. Use GoogleAIBackend now (10 min setup)
2. Test and validate integration
3. Monitor usage and costs
4. Migrate to VertexAIBackend if:
   - Exceeding free tier regularly
   - Need enterprise features
   - Want unified billing

---

## 📝 **Action Items**

- [ ] Choose backend (GoogleAIBackend recommended)
- [ ] Get Gemini API key from Google AI Studio
- [ ] Add to environment variables
- [ ] Update `geminiService.ts`
- [ ] Test connection
- [ ] Deploy to production
- [ ] Set up monitoring and quotas
- [ ] Document API key rotation process

---

## 🔗 **Resources**

- [Google AI Studio](https://aistudio.google.com/apikey)
- [Firebase AI Logic Docs](https://firebase.google.com/docs/ai-logic)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)

---

**Next**: Get API key and update service to enable Gemini integration! 🚀

