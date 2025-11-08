# 💰 SHELTR-AI GCP Cost Optimization & Gemini Cloud Assist Setup

## Cost Spike Context (October 2025)

| Month | Amount (CAD) | Increase |
|-------|-------------|----------|
| September | $31.51 | — |
| October | $113.43 | **+3.6x** |

### Current Breakdown
- **App Engine**: $89.48 (78.8%)
- **Artifact Registry**: $42.87 (37.8%)
- **Secret Manager**: $17.11 (15.1%)
- **Cloud Build**: $12.08 (10.6%)
- **Cloud Run**: $6.57 (5.8%)
- **Other**: $1.41 (1.2%)

---

## Phase 1: Enable Gemini Cloud Assist API

### Step 1: Determine Which Project to Enable API In

**CRITICAL**: You need to enable the Gemini Cloud Assist API in your **billing project**, NOT your Firebase/App project.

Your setup:
- **Firebase Project**: `sheltr-ai` (contains frontend, Firestore, Functions)
- **GCP Project**: `sheltr-ai` (contains Cloud Run, App Engine, Artifact Registry, Cloud Build)

For cost analysis, enable the API in: **`sheltr-ai` GCP project**

### Step 2: Enable the Gemini Cloud Assist API

#### Option A: Using Google Cloud Console (GUI)

1. Navigate to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: **`sheltr-ai`**
3. Go to **APIs & Services** > **Library**
4. Search for: `"Gemini Cloud Assist for Business Applications"`
5. Click the result
6. Click **ENABLE** button
7. Wait for activation to complete (may take 1-2 minutes)

#### Option B: Using gcloud CLI

```bash
# Set the project
gcloud config set project sheltr-ai

# Enable Gemini Cloud Assist API
gcloud services enable cloudaicompanion.googleapis.com

# Verify it's enabled
gcloud services list --enabled | grep cloudaicompanion
```

### Step 3: Grant Required IAM Roles

You need these roles to use Gemini Cloud Assist for billing analysis:

**Required Roles:**
1. `roles/billing.user` - View billing data
2. `roles/cloudaicompanion.user` - Use Gemini Cloud Assist
3. `roles/compute.admin` - View resource usage (optional but helpful)

#### Grant Roles via Console

1. Go to [IAM & Admin](https://console.cloud.google.com/iam-admin/iam)
2. Click **GRANT ACCESS**
3. Enter your email address
4. Add roles:
   - `Cloud AI Companion User` (cloudaicompanion.user)
   - `Billing User` (billing.user)
5. Click **SAVE**

#### Grant Roles via CLI

```bash
# Replace YOUR-EMAIL with your actual Google account email
YOUR_EMAIL="your.email@gmail.com"

# Grant Gemini Cloud Assist role
gcloud projects add-iam-policy-binding sheltr-ai \
  --member=user:$YOUR_EMAIL \
  --role=roles/cloudaicompanion.user

# Grant Billing User role
gcloud projects add-iam-policy-binding sheltr-ai \
  --member=user:$YOUR_EMAIL \
  --role=roles/billing.user

# Verify roles were added
gcloud projects get-iam-policy sheltr-ai \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$YOUR_EMAIL"
```

### Step 4: Verify Gemini Cloud Assist is Active

```bash
# Check if API is enabled
gcloud services list --enabled --filter="name:cloudaicompanion"

# Check your roles
gcloud projects get-iam-policy sheltr-ai \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$YOUR_EMAIL"
```

Expected output should show:
- `roles/cloudaicompanion.user` ✅
- `roles/billing.user` ✅

---

## Phase 2: Access Gemini Cloud Assist FinOps Hub

### Access Points

#### 1. **Cloud Console (Recommended for Cost Analysis)**
- URL: https://console.cloud.google.com/finops-hub
- Select project: `sheltr-ai`
- Click on "Gemini in Cloud Console" or "Gemini AI Companion"

#### 2. **BigQuery (Advanced Analytics)**
- Create dataset in BigQuery
- Enable billing export to BigQuery
- Query cost data with Gemini

#### 3. **Cloud Billing Console**
- URL: https://console.cloud.google.com/billing
- Look for "Gemini Cost Insights" or "FinOps Hub" tab

### Common Gemini Prompts for Cost Analysis

```
# Understand the spike
"Analyze my October 2025 Google Cloud billing. 
My costs increased from $31.51 in September to $113.43 in October.
What are the top cost drivers?"

# Deep dive into App Engine
"Why did my App Engine costs reach $89.48 in October?
I'm running a FastAPI backend on Cloud Run, not App Engine.
What service might be incorrectly labeled or billed?"

# Artifact Registry investigation
"My Artifact Registry costs are $42.87.
I store Docker images for a FastAPI application.
How much storage am I using and what's the cost breakdown?"

# Cost optimization
"Given that I'm running:
- FastAPI backend on Cloud Run (2 vCPU, 2GB RAM, 0-10 instances)
- Next.js frontend on Firebase Hosting
- Firestore database
- ~13 documents with embeddings

What are 5 ways to reduce my GCP costs by 30-50%?"

# Secret Manager question
"Why are my Secret Manager costs $17.11?
I'm storing: OPENAI_API_KEY and ANTHROPIC_API_KEY
Do I need to optimize API key management?"
```

---

## Phase 3: Investigate Cost Drivers

### 🔴 CRITICAL: App Engine $89.48 Charge

**Your setup doesn't use App Engine, so this charge needs investigation:**

#### Possible Causes:
1. **Cloud Build charges labeled as App Engine** (Most likely)
   - Building Docker images
   - Compute time during builds
   
2. **Container Registry (legacy) vs Artifact Registry** 
   - Old images not cleaned up
   - Both services incurring costs

3. **App Engine flex environment** 
   - If accidentally enabled

#### Investigation Steps:

```bash
# 1. List all App Engine services
gcloud app services list

# 2. Check App Engine traffic/usage
gcloud app operations list --limit=10

# 3. Check Artifact Registry (where images actually go)
gcloud artifacts repositories list --location=us

# 4. List all Docker images
gcloud artifacts docker images list gcr.io/sheltr-ai

# 5. Check Cloud Build history (THIS IS LIKELY THE CULPRIT)
gcloud builds list --limit=20

# 6. Analyze build costs
gcloud builds list --limit=50 --format="table(
  id,
  createTime,
  status,
  images,
  substitutions.BUILD_ID
)"
```

### 🟡 INVESTIGATION: Artifact Registry $42.87

```bash
# Get detailed breakdown
gcloud artifacts repositories describe sheltr-api \
  --location=us-central1 \
  --format=json

# Check image sizes
gcloud artifacts docker images list gcr.io/sheltr-ai \
  --include-tags \
  --sort-by=~update_time \
  --limit=30

# Get storage usage
gsutil ls -L -h -r gs://artifacts.sheltr-ai.appspot.com/
```

### 🟡 INVESTIGATION: Secret Manager $17.11

```bash
# List all secrets
gcloud secrets list --format=json

# Get access history
gcloud secrets versions list OPENAI_API_KEY \
  --limit=100 \
  --format="table(name, created, state)"

# Check if overly accessed
gcloud logging read "resource.type=secretmanager.googleapis.com" \
  --limit=1000 \
  --format=json | jq '.[] | {timestamp, method_name, principal_email}' | head -50
```

---

## Phase 4: Cost Cleanup & Optimization

### 4.1: Clean Up Old Docker Images

```bash
# List all images with their creation dates
gcloud artifacts docker images list gcr.io/sheltr-ai \
  --include-tags \
  --sort-by=~update_time

# Delete old/unused images (older than 30 days)
gcloud artifacts docker images delete gcr.io/sheltr-ai/sheltr-api:OLD_TAG \
  --delete-tags

# Bulk delete old images (example)
for image in $(gcloud artifacts docker images list gcr.io/sheltr-ai \
  --include-tags \
  --format='value(image)' \
  --limit=999); do
  gcloud artifacts docker images delete $image --quiet 2>/dev/null || true
done
```

### 4.2: Optimize Cloud Build Configuration

**Your current cloudbuild.yaml (lines 22):**
```yaml
machineType: 'E2_HIGHCPU_8'  # ⚠️ HIGH COST - 8 vCPU
```

**Optimization:**

```yaml
# Recommended: E2_STANDARD_4 (4 vCPU - 50% cheaper)
machineType: 'E2_STANDARD_4'

# Best for most builds: N1_STANDARD_4
machineType: 'N1_STANDARD_4'

# For ultra-small: E2_HIGHCPU_4
machineType: 'E2_HIGHCPU_4'
```

**Update your cloudbuild.yaml:**

```bash
# Edit the file
nano cloudbuild.yaml

# Change line 22 from:
# machineType: 'E2_HIGHCPU_8'
# To:
# machineType: 'E2_STANDARD_4'
```

### 4.3: Enable Build Caching

Add to `cloudbuild.yaml`:

```yaml
images:
  - 'gcr.io/$PROJECT_ID/sheltr-api:$BUILD_ID'
  - 'gcr.io/$PROJECT_ID/sheltr-api:latest'

# Add caching
options:
  logging: CLOUD_LOGGING_ONLY
  machineType: 'E2_STANDARD_4'
  
# Cache Docker layers
cache:
  - name: 'gcr.io/$PROJECT_ID/sheltr-api:latest'
    volumes:
      - name: 'docker_cache'
        path: '/root/.docker/cache'
```

### 4.4: Optimize Docker Image Size

Your current `Dockerfile.api` (optimal already):
- ✅ Uses `python:3.11-slim` (good)
- ✅ Multi-stage build possible (consider)
- ⚠️ No layer caching optimization

**Enhanced Dockerfile.api:**

```dockerfile
# Dockerfile for SHELTR FastAPI Backend - Optimized
FROM python:3.11-slim as builder

# Build stage
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt .
RUN pip install --user --no-cache-dir --upgrade pip && \
    pip install --user --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.11-slim

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /root/.local /root/.local
COPY apps/api/ .

ENV PATH=/root/.local/bin:$PATH \
    PYTHONPATH=/app \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health', timeout=5)" || exit 1

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
```

### 4.5: Reduce Cloud Run Idle Costs

Your current config (from deploy.sh):
```bash
--min-instances 0   # ✅ GOOD - scales to zero
--max-instances 10  # ⚠️ May be high
--memory 2Gi        # ⚠️ Consider reducing to 1Gi
--cpu 2             # ⚠️ Consider reducing to 1 (for I/O bound FastAPI)
```

**Recommendation:**
```bash
# For I/O-bound FastAPI with Firestore queries
--min-instances 0
--max-instances 5        # Reduced from 10
--memory 1Gi             # Reduced from 2Gi (for most workloads)
--cpu 1                  # Reduced from 2 (FastAPI is I/O bound)
--cpu-throttling        # Add this to save costs
```

---

## Phase 5: Cost Monitoring & Alerts

### 5.1: Set Up Budget Alerts

```bash
# Create a budget for your project
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="SHELTR-AI Monthly Budget" \
  --budget-amount=50 \
  --threshold-rule=percent=50,percent=90,percent=100

# Find your billing account ID
gcloud billing accounts list
```

### 5.2: Enable Billing Alerts in Console

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Select billing account
3. **Budgets and alerts**
4. **CREATE BUDGET**
   - Budget name: "SHELTR Production"
   - Set monthly budget: $50 CAD
   - Threshold alerts: 50%, 90%, 100%

### 5.3: Enable Cost Optimization Recommendations

```bash
# Enable Recommender API
gcloud services enable recommender.googleapis.com

# View recommendations
gcloud recommenders list-recommendations \
  --recommender=google.compute.commitment.UsageCommitmentRecommender \
  --location=us-central1
```

### 5.4: Monitor with BigQuery Exports

```bash
# Enable billing export to BigQuery
# Go to Billing > Billing export > BigQuery export

# Create analysis queries:
bq query --use_legacy_sql=false '
SELECT
  service.description,
  SUM(CAST(cost AS FLOAT64)) as total_cost,
  usage_month
FROM `sheltr-ai.billing_export.gcp_billing_export_v1_*`
WHERE _TABLE_SUFFIX BETWEEN "202510" AND "202510"
GROUP BY service.description, usage_month
ORDER BY total_cost DESC
'
```

---

## Phase 6: Expected Savings

### Based on Optimizations:

| Optimization | Current Cost | New Cost | Savings |
|--------------|-------------|----------|---------|
| Build machine downsizing | $12.08 | $6.04 | **50%** |
| Docker image cleanup | $42.87 | $21.44 | **50%** |
| Cloud Run config | $6.57 | $3.29 | **50%** |
| Unused services | $17.11 | $0 | **100%** |
| **Total** | **$113.43** | **~$60** | **~47%** |

**Expected November Cost: ~$60 CAD (vs $113.43 in October)**

---

## Implementation Checklist

### Week 1: Analysis & Cleanup
- [ ] Enable Gemini Cloud Assist API
- [ ] Grant IAM permissions
- [ ] Access FinOps Hub
- [ ] Run Gemini cost analysis
- [ ] Delete old Docker images
- [ ] Review build history

### Week 2: Optimization
- [ ] Update cloudbuild.yaml (machine type)
- [ ] Optimize Dockerfile (multi-stage)
- [ ] Update deploy.sh (Cloud Run config)
- [ ] Enable build caching
- [ ] Test deployment

### Week 3: Monitoring
- [ ] Set up billing budgets
- [ ] Enable cost alerts
- [ ] Configure BigQuery exports
- [ ] Set up monitoring dashboard
- [ ] Document new baselines

### Verification
- [ ] [ ] Deploy changes and verify functionality
- [ ] [ ] Monitor November bill (target: <$70 CAD)
- [ ] [ ] Review Gemini recommendations monthly
- [ ] [ ] Adjust thresholds based on actual usage

---

## Reference

### Related Documentation
- [Google Cloud Run Deployment](./google-cloud-run.md)
- [Firebase Hosting](./firebase-hosting.md)
- [Monitoring Setup](./monitoring.md)
- [Security Hardening](./security.md)

### Useful Links
- [GCP Cost Optimization](https://cloud.google.com/architecture/best-practices-for-running-cost-effective-kubernetes-applications-on-gke)
- [Cloud Build Pricing](https://cloud.google.com/build/pricing)
- [Artifact Registry Pricing](https://cloud.google.com/artifact-registry/pricing)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Gemini Cloud Assist Docs](https://cloud.google.com/gemini/docs/cloud-assist/overview)
