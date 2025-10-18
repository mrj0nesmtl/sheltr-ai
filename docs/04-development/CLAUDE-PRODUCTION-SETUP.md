# Claude AI Production Setup Guide

**Version:** 1.0.0  
**Date:** October 17, 2025  
**Status:** Ready for Deployment

## Quick Start

This guide walks you through setting up Claude AI in production for SHELTR.

## Prerequisites

- ✅ Google Cloud CLI installed and authenticated
- ✅ Access to SHELTR Google Cloud project (`sheltr-ai`)
- ✅ Anthropic API key (from https://console.anthropic.com/)
- ✅ Code already pushed to GitHub (v2.54.0)

## Step 1: Create Google Secret Manager Secret

```bash
# Navigate to project root
cd /Users/mrjones/Github/Projects/sheltr-ai

# Set your Anthropic API key (replace with your actual key)
export ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY_HERE"

# Create the secret in Google Secret Manager
echo -n "$ANTHROPIC_API_KEY" | gcloud secrets create anthropic-api-key \
    --data-file=- \
    --replication-policy="automatic" \
    --project=sheltr-ai

# Verify the secret was created
gcloud secrets describe anthropic-api-key --project=sheltr-ai
```

## Step 2: Grant Access to Cloud Run Service Account

```bash
# Grant the Cloud Run service account access to read the secret
gcloud secrets add-iam-policy-binding anthropic-api-key \
    --member="serviceAccount:firebase-adminsdk-fbsvc@sheltr-ai.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --project=sheltr-ai

# Verify the IAM policy
gcloud secrets get-iam-policy anthropic-api-key --project=sheltr-ai
```

Expected output should show:
```yaml
bindings:
- members:
  - serviceAccount:firebase-adminsdk-fbsvc@sheltr-ai.iam.gserviceaccount.com
  role: roles/secretmanager.secretAccessor
```

## Step 3: Deploy to Production

```bash
# Run the deployment script
./deploy.sh

# Select option 3 (Full deployment)
# This will:
# 1. Build and deploy frontend to Firebase Hosting
# 2. Build Docker image for backend
# 3. Deploy to Cloud Run with ANTHROPIC_API_KEY secret
```

The `deploy.sh` script is already configured to include the Claude secret (line 134):
```bash
--update-secrets="OPENAI_API_KEY=openai-api-key:latest,ANTHROPIC_API_KEY=anthropic-api-key:latest"
```

## Step 4: Verify Deployment

### Check Cloud Run Configuration

```bash
# Describe the Cloud Run service
gcloud run services describe sheltr-api \
    --region us-central1 \
    --project=sheltr-ai

# Look for the secrets section in the output
```

You should see:
```yaml
spec:
  template:
    spec:
      containers:
      - env:
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              key: latest
              name: anthropic-api-key
```

### Test the API Health Endpoint

```bash
# Check API health
curl https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "openai": "✅ operational",
    "anthropic": "✅ operational",
    "rag": "✅ operational",
    "faq": "✅ operational"
  }
}
```

## Step 5: Configure Agent with Claude Model

1. **Navigate to Chatbot Dashboard:**
   - Go to https://sheltr-ai.web.app/dashboard/chatbots
   - Sign in as Super Admin or Platform Admin

2. **Create/Edit Agent:**
   - Click on an existing agent or create new
   - Set model to: `claude-3-5-sonnet-20241022` or `claude-3-5-haiku-20241022`
   - Save configuration

3. **Test the Agent:**
   - Start a new chat session
   - Send a test message
   - Verify response is from Claude

## Step 6: Monitor Usage

### Check Cloud Run Logs

```bash
# View recent logs
gcloud run services logs read sheltr-api \
    --region us-central1 \
    --project=sheltr-ai \
    --limit=50

# Filter for Claude-specific logs
gcloud run services logs read sheltr-api \
    --region us-central1 \
    --project=sheltr-ai \
    --filter="textPayload:anthropic OR textPayload:Claude" \
    --limit=50
```

Look for log entries like:
```
🤖 Using anthropic provider with model: claude-3-5-sonnet-20241022
✅ Claude response generated successfully
```

### Monitor in Anthropic Console

1. Go to https://console.anthropic.com/
2. Navigate to "Usage" section
3. Monitor:
   - API calls per day
   - Token usage
   - Cost tracking
   - Error rates

## Troubleshooting

### Issue 1: Secret Not Found

**Error:** `Secret "anthropic-api-key" not found`

**Solution:**
```bash
# List all secrets
gcloud secrets list --project=sheltr-ai

# If missing, create it (see Step 1)
```

### Issue 2: Permission Denied

**Error:** `Permission denied when accessing secret`

**Solution:**
```bash
# Re-grant access
gcloud secrets add-iam-policy-binding anthropic-api-key \
    --member="serviceAccount:firebase-adminsdk-fbsvc@sheltr-ai.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --project=sheltr-ai
```

### Issue 3: Fallback to OpenAI

**Symptom:** All requests use OpenAI even with Claude model selected

**Check logs:**
```bash
gcloud run services logs read sheltr-api \
    --region us-central1 \
    --project=sheltr-ai \
    --filter="textPayload:Anthropic" \
    --limit=20
```

**Common causes:**
1. API key not loaded (check secret configuration)
2. Invalid API key (rotate key in Anthropic Console)
3. Rate limit exceeded (check Anthropic Console usage)

### Issue 4: API Key Invalid

**Error:** `Authentication failed`

**Solution:**
1. Generate new API key at https://console.anthropic.com/
2. Update the secret:
   ```bash
   echo -n "NEW_API_KEY" | gcloud secrets versions add anthropic-api-key \
       --data-file=- \
       --project=sheltr-ai
   ```
3. Redeploy:
   ```bash
   ./deploy.sh
   # Select option 2 (Backend only)
   ```

## Cost Management

### Set Up Billing Alerts

1. **In Anthropic Console:**
   - Go to Settings → Billing
   - Set monthly budget limit
   - Enable email alerts at 50%, 80%, 100%

2. **In Google Cloud Console:**
   - Go to Billing → Budgets & alerts
   - Create budget for Cloud Run
   - Set alert thresholds

### Monitor Costs

**Anthropic Pricing (Oct 2025):**
- Claude 3.5 Sonnet: $3.00 input / $15.00 output per 1M tokens
- Claude 3.5 Haiku: $0.80 input / $4.00 output per 1M tokens

**Estimated Monthly Costs (based on usage):**
- Light usage (1K requests/month): ~$5-10
- Medium usage (10K requests/month): ~$50-100
- Heavy usage (100K requests/month): ~$500-1000

### Cost Optimization Tips

1. **Use Haiku for simple queries:**
   - 4x cheaper than Sonnet
   - Still very capable
   - 200K context window

2. **Implement caching:**
   - Cache common responses
   - Reduce redundant API calls

3. **Set max_tokens appropriately:**
   - Don't use 2000 tokens for simple queries
   - Adjust per agent type

4. **Monitor and adjust:**
   - Review usage weekly
   - Identify high-cost patterns
   - Optimize prompts

## Security Best Practices

### 1. API Key Rotation

Rotate API keys quarterly:

```bash
# 1. Generate new key in Anthropic Console
# 2. Update secret
echo -n "NEW_KEY" | gcloud secrets versions add anthropic-api-key \
    --data-file=- \
    --project=sheltr-ai

# 3. Redeploy
./deploy.sh  # Option 2

# 4. Delete old key in Anthropic Console
```

### 2. Access Control

- ✅ Claude models are admin-only
- ✅ Public chatbot uses OpenAI only
- ✅ Role-based access controls in place
- ✅ API key stored in Secret Manager (not code)

### 3. Monitoring

Set up alerts for:
- Unusual API usage spikes
- High error rates
- Cost anomalies
- Failed authentication attempts

## Rollback Plan

If issues arise, rollback to OpenAI-only:

```bash
# 1. Remove Claude models from agent configurations
# (via dashboard UI or Firestore)

# 2. Optional: Remove secret from Cloud Run
gcloud run services update sheltr-api \
    --region us-central1 \
    --clear-secrets \
    --project=sheltr-ai

# 3. Redeploy
./deploy.sh  # Option 2
```

## Success Criteria

✅ **Deployment Successful When:**
1. Secret created in Google Secret Manager
2. Cloud Run service has access to secret
3. Health endpoint shows Anthropic as operational
4. Test message with Claude model succeeds
5. Logs show "Using anthropic provider"
6. No errors in Cloud Run logs
7. Anthropic Console shows API usage

## Next Steps

After successful deployment:

1. **Update Documentation:**
   - Add Claude to user guides
   - Update agent configuration docs
   - Document model selection guidelines

2. **Train Administrators:**
   - When to use Claude vs OpenAI
   - Cost implications
   - Best practices

3. **Monitor Performance:**
   - Response quality
   - Response times
   - Cost per request
   - User satisfaction

4. **Optimize:**
   - Fine-tune prompts
   - Adjust model selection
   - Implement caching
   - Review usage patterns

## Support Resources

- **Anthropic Documentation:** https://docs.anthropic.com/
- **Claude Models:** https://docs.anthropic.com/en/docs/models-overview
- **SHELTR Claude Integration Guide:** [CLAUDE-INTEGRATION.md](./CLAUDE-INTEGRATION.md)
- **SHELTR Agent Architecture:** [SHELTR-AGENT-ARCHITECTURE.md](./SHELTR-AGENT-ARCHITECTURE.md)

## Contact

For deployment issues:
1. Check Cloud Run logs
2. Review Anthropic Console
3. Consult this guide
4. Contact SHELTR DevOps team

---

**Last Updated:** October 17, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for Production

