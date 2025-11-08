# 🚀 Gemini Cloud Assist & Cost Analysis - Quick Start Guide

**Goal:** Activate Gemini Cloud Assist and reduce SHELTR's November bill by 30-50% (from $113.43 to ~$60 CAD)

---

## 📊 Cost Problem Summary

| Metric | Value |
|--------|-------|
| October Bill | **$98.66 CAD** ⚠️ |
| September Bill | $31.51 CAD |
| Increase | **3.1x (252%)** |
| Billing Cycle | Full month (Oct 1-31) |

### 🚨 CRITICAL FINDING (From Gemini Cloud Assist)

**The "App Engine" charge is actually FIRESTORE DATA TRANSFER!**

### Top Cost Drivers (ACTUAL)
1. **🔴 Firestore Data Egress**: $57.08 (58%) - **PRIMARY ISSUE** (588% increase!)
2. **App Engine (Other)**: $18.50 (19%) - Secondary
3. **Artifact Registry**: $12.68 (13%) - Old Docker images
4. **Cloud Build**: $6.13 (6%) - Docker builds
5. **Secret Manager**: $3.59 (4%) - API key storage
6. **Cloud Run**: $1.58 (2%) - API deployment (minimal)

**Root Cause**: Knowledge Base + RAG system transferring 475GB+ of data from Firestore in October!

---

## ⚡ 5-Minute Setup

### Phase 1: Enable Gemini API (2 minutes)

**Option A: Using Google Cloud Console (Easiest)**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Make sure you're in project: **`sheltr-ai`**
3. Click **APIs & Services** > **Library**
4. Search: `"Gemini Cloud Assist"`
5. Click the result
6. Click **ENABLE** 
7. Wait 1-2 minutes for activation

**Option B: Using CLI (Faster)**

```bash
# Set project
gcloud config set project sheltr-ai

# Enable Gemini Cloud Assist API
gcloud services enable cloudaicompanion.googleapis.com

# Verify it's enabled
gcloud services list --enabled | grep cloudaicompanion
```

### Phase 2: Grant IAM Permissions (2 minutes)

**Using CLI (Recommended)**

```bash
# Replace with your email
YOUR_EMAIL="your.email@gmail.com"

# Grant Gemini role
gcloud projects add-iam-policy-binding sheltr-ai \
  --member=user:$YOUR_EMAIL \
  --role=roles/cloudaicompanion.user

# Grant Billing role
gcloud projects add-iam-policy-binding sheltr-ai \
  --member=user:$YOUR_EMAIL \
  --role=roles/billing.user
```

**Verify it worked:**
```bash
gcloud projects get-iam-policy sheltr-ai \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$YOUR_EMAIL"
```

Expected output should show:
- ✅ `roles/cloudaicompanion.user`
- ✅ `roles/billing.user`

### Phase 3: Access Gemini Cost Insights (1 minute)

**Navigate to:**
- https://console.cloud.google.com/finops-hub
- **OR**
- https://console.cloud.google.com/billing

Look for "Gemini in Cloud Console" or "Gemini AI Companion" button

---

## 🔍 Using Gemini for Cost Analysis

### Essential Prompts

Copy & paste these into Gemini:

**Prompt 1: Understand the Spike**
```
Analyze my October 2025 Google Cloud billing data.
My costs increased from $31.51 in September to $113.43 in October.
What are the top cost drivers and why did they spike?
```

**Prompt 2: Deep Dive App Engine**
```
I see $89.48 in App Engine charges for October.
However, I don't run App Engine - I run:
- FastAPI backend on Cloud Run
- Next.js frontend on Firebase Hosting
- Firestore database

Why is App Engine showing charges?
Is this actually Cloud Build or Container Registry charges misaligned?
```

**Prompt 3: Artifact Registry Costs**
```
My Artifact Registry shows $42.87 in costs.
I store FastAPI Docker images for deployment.
How much storage am I using?
How many images do I have?
What's the monthly cost per GB?
```

**Prompt 4: Get Recommendations**
```
I'm running on Google Cloud with:
- FastAPI backend (Cloud Run: 2 vCPU, 2GB RAM, 0-10 instances)
- Next.js frontend (Firebase Hosting)
- Firestore database
- ~13 documents with AI embeddings
- October bill: $113.43

What are your top 5 cost optimization recommendations
that could reduce my bill by 30-50%?
```

**Prompt 5: Secret Manager Optimization**
```
My Secret Manager shows $17.11 in costs.
I only have 2 secrets: OPENAI_API_KEY and ANTHROPIC_API_KEY.
Why are my costs so high?
Should I move to Environment Variables instead?
```

---

## 🛠️ Automatic Investigation Script

Run this to automatically collect cost data:

```bash
# Full analysis (generates report)
./scripts/gcp-cost-analysis.sh full

# Or individual investigations
./scripts/gcp-cost-analysis.sh enable-api
./scripts/gcp-cost-analysis.sh iam
./scripts/gcp-cost-analysis.sh app-engine
./scripts/gcp-cost-analysis.sh artifact
./scripts/gcp-cost-analysis.sh builds
./scripts/gcp-cost-analysis.sh secrets
./scripts/gcp-cost-analysis.sh run
./scripts/gcp-cost-analysis.sh report
```

---

## 💡 Quick Wins (Immediate Action Items)

### 🔴 PRIORITY #1: Implement Firestore Caching (30 minutes)

**Current:** Every chatbot query fetches documents from Firestore → **Cost: ~$57/month**
**Target:** Cache frequently accessed documents → **Cost: ~$15/month**
**Savings:** **70% = ~$42/month** ⭐ **HIGHEST IMPACT**

See detailed guide: [Firestore Data Transfer Optimization](./FIRESTORE-DATA-TRANSFER-OPTIMIZATION.md)

**Quick Implementation:**
```bash
# 1. Add caching service to backend
cd apps/api/services
# Copy cache_service.py from the Firestore optimization guide

# 2. Update knowledge_base_service.py to use caching
# See examples in the guide

# 3. Enable gzip compression in main.py
# Add: app.add_middleware(GZipMiddleware, minimum_size=1000)

# 4. Deploy
cd ../../..
./deploy.sh  # Select option 2 (Backend only)
```

---

### Win #2: Downsize Cloud Build Machine (5 minutes)

**Current:** `E2_HIGHCPU_8` (8 vCPU) → **Cost: ~$6/month**
**Target:** `E2_STANDARD_4` (4 vCPU) → **Cost: ~$3/month**
**Savings:** **50% = ~$3/month**

```bash
# Edit cloudbuild.yaml
nano cloudbuild.yaml

# Find line 22:
# machineType: 'E2_HIGHCPU_8'
# Change to:
# machineType: 'E2_STANDARD_4'

# Then commit and push
git add cloudbuild.yaml
git commit -m "opt: reduce cloud build machine cost"
git push
```

### Win #3: Delete Old Docker Images (10 minutes)

**Current:** Multiple old images → **Cost: ~$13/month**
**Target:** Keep only recent images → **Cost: ~$6/month**
**Savings:** **50% = ~$7/month**

```bash
# Preview what will be deleted (safe)
./scripts/cleanup-docker-images.sh --dry-run

# Delete images older than 30 days
./scripts/cleanup-docker-images.sh

# Or delete images older than 7 days
./scripts/cleanup-docker-images.sh --days=7
```

### Win #4: Optimize Cloud Run Config (10 minutes) - OPTIONAL

**Current:** 2 vCPU, 2GB RAM, 10 max instances → **Cost: ~$1.58/month**
**Target:** 1 vCPU, 1GB RAM, 5 max instances → **Cost: ~$0.80/month**
**Savings:** **50% = ~$0.80/month** (LOW PRIORITY - minimal impact)

```bash
# Edit deploy.sh
nano deploy.sh

# Find the Cloud Run deployment section (around line 122)
# Change these lines:
# FROM: --memory 2Gi --cpu 2 --max-instances 10
# TO:   --memory 1Gi --cpu 1 --max-instances 5

# Then redeploy
./deploy.sh
# Select option 2 (Backend only)
```

**Note**: Cloud Run costs are minimal ($1.58/month). Focus on Firestore caching first!

---

## 📋 Implementation Checklist

### 🔴 CRITICAL (This Week) - Firestore Optimization
- [ ] Read [Firestore Data Transfer Optimization Guide](./FIRESTORE-DATA-TRANSFER-OPTIMIZATION.md)
- [ ] Implement caching service (`cache_service.py`)
- [ ] Update Knowledge Base service to use caching
- [ ] Enable gzip compression in FastAPI
- [ ] Deploy backend with caching
- [ ] Monitor cache hit rate (target: >70%)
- [ ] Verify Firestore reads reduced by 50%+

### ✅ Setup Complete
- [x] Enable Gemini Cloud Assist API
- [x] Grant IAM permissions
- [x] Run cost analysis script
- [x] Identify root cause (Firestore data egress)

### 🟡 Secondary Optimizations (Next Week)
- [ ] Update `cloudbuild.yaml` (machine type downsize)
- [ ] Delete old Docker images
- [ ] Implement batch queries for Firestore
- [ ] Add HTTP cache headers
- [ ] Test changes in production
- [ ] Commit and push changes

### 📊 Monitoring (Ongoing)
- [ ] Set up billing budget alert ($50 CAD)
- [ ] Enable 50%, 90%, 100% threshold alerts
- [ ] Monitor November bill (target: <$60 CAD)
- [ ] Track cache hit rate daily
- [ ] Review Gemini recommendations monthly

---

## 🎯 Expected Outcome

### Cost Projection (UPDATED with Firestore Finding)

| Change | Impact | November Bill |
|--------|--------|-----------------|
| Current run rate | — | $98.66 |
| **🔴 Firestore caching** | **-$42** | **$56.66** ⭐ |
| Build optimization | -$3 | $53.66 |
| Image cleanup | -$7 | $46.66 |
| Cloud Run config | -$0.80 | **$45.86** |
| **Combined (Phase 1)** | **-$52.80** | **~$46** |
| Additional optimizations (Phase 2) | -$10-15 | **~$31-36** |

**Target for November: $46 CAD (53% reduction)**

**Key Insight**: Firestore caching alone saves more than all other optimizations combined!

---

## 🚨 Critical Notes

1. **Don't delete `latest` tag images** - Only delete old tagged versions
2. **Test Cloud Run changes** - Verify API still works after resource reduction
3. **Keep at least 2-3 recent images** - For rollback capability
4. **Monitor after changes** - First 24 hours are critical

---

## 📞 Support & Troubleshooting

### Common Issues

**Q: "API not found" when trying to enable Gemini**
- Make sure you're logged into gcloud: `gcloud auth login`
- Make sure you're in the right project: `gcloud config set project sheltr-ai`

**Q: "Permission denied" when listing images**
- Make sure you have billing.user role: `gcloud projects get-iam-policy sheltr-ai`

**Q: Cloud Run won't start with 1 vCPU**
- Revert to 2 vCPU temporarily
- Check Cloud Run logs: `gcloud run services describe sheltr-api --region=us-central1`

---

## 📚 Full Documentation

For complete details on each optimization:
- 📖 [Full GCP Cost Optimization Guide](./gcp-cost-optimization.md)
- 🏗️ [Google Cloud Run Documentation](./google-cloud-run.md)
- 📊 [Monitoring & Alerts Setup](./monitoring.md)

---

## ⏱️ Time Estimate

| Task | Duration | Impact |
|------|----------|--------|
| Enable API & IAM | 5 min | Setup for analysis |
| Run analysis | 10 min | Generate recommendations |
| Build optimization | 5 min | -$6/month |
| Image cleanup | 10 min | -$21/month |
| Cloud Run optimization | 15 min | -$3/month |
| Test & validate | 20 min | Ensure stability |
| **Total** | **~65 min** | **-$30/month (26%)** |

---

## 🎯 Success Criteria

✅ **You'll know this worked when:**
1. Gemini Cloud Assist is accessible in Google Cloud Console
2. You can see cost recommendations from Gemini
3. Cloud Build uses smaller machine type
4. Old Docker images are cleaned up (fewer in Artifact Registry)
5. Cloud Run uses 1 vCPU/1GB RAM configuration
6. November bill is under $80 CAD
7. API/website still works perfectly

---

**Last Updated:** November 2025
**Status:** Ready for immediate implementation
**Expected Completion:** Within 1 week
**Owner:** SHELTR Finance/DevOps Team
