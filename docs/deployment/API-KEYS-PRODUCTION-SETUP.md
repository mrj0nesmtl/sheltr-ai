# 🔐 Production API Keys Configuration

**Date**: November 24, 2025  
**Status**: ✅ **CONFIGURED**

---

## 📋 **Overview**

This document details how API keys are configured in production for the SHELTR-AI platform. All sensitive keys are stored in **Google Cloud Secret Manager** and injected into Cloud Run as environment variables.

---

## 🔑 **Current Production API Keys**

### **1. OpenAI API Key** ✅
- **Secret Name**: `openai-api-key`
- **Environment Variable**: `OPENAI_API_KEY`
- **Source**: Secret Manager (`secretKeyRef`)
- **Used For**: 
  - Embeddings generation (semantic search)
  - Fallback AI responses
  - Dashboard chatbot (authenticated users)

### **2. Anthropic API Key** ✅
- **Secret Name**: `anthropic-api-key`
- **Environment Variable**: `ANTHROPIC_API_KEY`
- **Source**: Secret Manager (`secretKeyRef`)
- **Used For**: 
  - Claude models in dashboard
  - Alternative AI provider

### **3. Gemini API Key** ✅ **NEWLY ADDED**
- **Secret Name**: `gemini-api-key`
- **Environment Variable**: `GEMINI_API_KEY`
- **Source**: Secret Manager (`secretKeyRef`)
- **Value**: ``
- **Used For**: 
  - Public chatbot (primary AI model)
  - RAG responses for public users
  - Cost-effective AI generation (70% savings)

---

## 🏗️ **Architecture**

### **Secret Manager → Cloud Run Flow**

```
┌─────────────────────────────────────┐
│   Google Cloud Secret Manager      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ openai-api-key    (latest)  │   │
│  ├─────────────────────────────┤   │
│  │ anthropic-api-key (latest)  │   │
│  ├─────────────────────────────┤   │
│  │ gemini-api-key    (latest)  │◄──┼── Created: Nov 24, 2025
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               │ Injected as env vars
               ▼
┌─────────────────────────────────────┐
│      Cloud Run: sheltr-api          │
│                                     │
│  Environment Variables:             │
│  - OPENAI_API_KEY                   │
│  - ANTHROPIC_API_KEY                │
│  - GEMINI_API_KEY                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Backend Services          │   │
│  │  - OpenAI Service           │   │
│  │  - Anthropic Service        │   │
│  │  - Gemini Service           │   │
│  │  - Chatbot Orchestrator     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔧 **Setup Commands**

### **Create Secret in Secret Manager**
```bash
# Create Gemini API key secret
echo "AIzaSyA84d2CfHzYDSFGcNEZ8aX5I419DtYePr4" | \
  gcloud secrets create gemini-api-key \
  --data-file=- \
  --project=sheltr-ai
```

**Output**:
```
Created version [1] of the secret [gemini-api-key].
```

### **Configure Cloud Run to Use Secret**
```bash
# Update Cloud Run service to inject secret as env var
gcloud run services update sheltr-api \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --project=sheltr-ai
```

**Output**:
```
Deploying...
Creating Revision...done
Routing traffic.....done
Service [sheltr-api] revision [sheltr-api-00215-l92] has been deployed
Service URL: https://sheltr-api-714964620823.us-central1.run.app
```

---

## ✅ **Verification**

### **1. Check Environment Variables**
```bash
gcloud run services describe sheltr-api \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)" \
  | grep GEMINI
```

**Expected Output**:
```
{'name': 'GEMINI_API_KEY', 'valueFrom': {'secretKeyRef': {'key': 'latest', 'name': 'gemini-api-key'}}}
```

### **2. Check Service Initialization Logs**
```bash
gcloud run services logs read sheltr-api \
  --region us-central1 \
  --limit 50 \
  | grep "Gemini service initialized"
```

**Expected Output**:
```
INFO:services.gemini_service:✅ Gemini service initialized successfully
```

### **3. Test Gemini Service Health**
```bash
curl https://sheltr-api-714964620823.us-central1.run.app/api/v1/health
```

**Expected**: Service should report Gemini as available

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "GEMINI_API_KEY not found in environment"**

**Symptoms**:
```
WARNING:services.gemini_service:⚠️ GEMINI_API_KEY not found in environment
```

**Cause**: Secret not configured in Cloud Run

**Solution**:
```bash
gcloud run services update sheltr-api \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

---

### **Issue 2: Environment Variable Lost After Container Restart**

**Symptoms**: 
- Gemini works initially
- After container restart, "GEMINI_API_KEY not found"

**Cause**: Environment variable set with `--update-env-vars` (not persistent)

**Solution**: Use Secret Manager (persistent across restarts)
```bash
# DON'T USE THIS (not persistent):
gcloud run services update sheltr-api --update-env-vars GEMINI_API_KEY=xxx

# USE THIS INSTEAD (persistent):
gcloud run services update sheltr-api --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

---

### **Issue 3: "Gemini generation error: 'role'"**

**Symptoms**:
```
ERROR:services.gemini_service:❌ Gemini generation error: 'role'
```

**Cause**: Conversation history format mismatch

**Solution**: Fixed in commit `a118a807` - Gemini service now handles multiple conversation history formats

---

## 📊 **Production Environment Variables (Complete List)**

### **AI Services**
| Variable | Source | Purpose |
|----------|--------|---------|
| `OPENAI_API_KEY` | Secret Manager | OpenAI API access |
| `ANTHROPIC_API_KEY` | Secret Manager | Anthropic API access |
| `GEMINI_API_KEY` | Secret Manager | Gemini API access |

### **OpenAI Configuration**
| Variable | Value | Purpose |
|----------|-------|---------|
| `OPENAI_MODEL` | `gpt-4o-mini` | Default model |
| `OPENAI_MAX_TOKENS` | `2000` | Max response length |
| `OPENAI_TEMPERATURE` | `0.7` | Creativity level |
| `OPENAI_TIMEOUT` | `30` | Request timeout |
| `OPENAI_FALLBACK_MODEL` | `gpt-3.5-turbo` | Fallback model |
| `OPENAI_MAX_CONTEXT_TOKENS` | `4000` | Max context size |
| `OPENAI_RATE_LIMIT_PER_MINUTE` | `60` | Rate limit |

### **Firebase Configuration**
| Variable | Value | Purpose |
|----------|-------|---------|
| `GOOGLE_CLOUD_PROJECT` | `sheltr-ai` | GCP project ID |
| `FIREBASE_STORAGE_BUCKET` | `sheltr-ai.firebasestorage.app` | Storage bucket |

### **GitHub Integration**
| Variable | Value | Purpose |
|----------|-------|---------|
| `GITHUB_TOKEN` | (secret) | GitHub API access |
| `GITHUB_OWNER` | `mrj0nesmtl` | Repository owner |
| `GITHUB_REPO` | `sheltr-ai` | Repository name |
| `GITHUB_DOCS_PATH` | `docs` | Docs directory |

### **General Configuration**
| Variable | Value | Purpose |
|----------|-------|---------|
| `ENVIRONMENT` | `production` | Environment name |
| `FRONTEND_URL` | `https://sheltr-ai.web.app` | Frontend URL |

---

## 🔄 **Deployment Workflow**

### **When Deploying Backend**

1. **Code Changes**: Push code to GitHub
2. **Build**: Cloud Build creates Docker image
3. **Deploy**: Cloud Run deploys new revision
4. **Secrets**: Automatically injected from Secret Manager
5. **Verify**: Check logs for service initialization

### **No Manual Steps Required**

Once secrets are configured in Secret Manager and linked to Cloud Run, they persist across:
- ✅ Code deployments
- ✅ Container restarts
- ✅ Auto-scaling events
- ✅ Manual restarts

---

## 🔐 **Security Best Practices**

### **✅ Current Implementation**
- ✅ Secrets stored in Google Cloud Secret Manager
- ✅ Secrets injected as environment variables (not in code)
- ✅ Secrets versioned (can rollback if needed)
- ✅ Access controlled via IAM permissions
- ✅ Secrets never committed to Git

### **🚫 Avoid**
- ❌ Hardcoding API keys in source code
- ❌ Committing `.env` files to Git
- ❌ Using `--update-env-vars` for sensitive data
- ❌ Sharing API keys in documentation
- ❌ Storing secrets in plain text files

---

## 📚 **Related Documentation**

- **Secret Manager**: https://cloud.google.com/secret-manager/docs
- **Cloud Run Secrets**: https://cloud.google.com/run/docs/configuring/secrets
- **Gemini API**: https://ai.google.dev/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Anthropic API**: https://docs.anthropic.com/

---

## ✅ **Current Status**

### **Production Configuration: COMPLETE** ✅

| Service | Status | Details |
|---------|--------|---------|
| **OpenAI** | ✅ Configured | Secret Manager |
| **Anthropic** | ✅ Configured | Secret Manager |
| **Gemini** | ✅ Configured | Secret Manager (Nov 24, 2025) |
| **Cloud Run** | ✅ Updated | Revision: sheltr-api-00215-l92 |
| **Verification** | ✅ Passed | All services initialized |

---

**Last Updated**: November 24, 2025, 4:45 AM EST  
**Revision**: sheltr-api-00215-l92  
**Status**: ✅ **PRODUCTION READY**

