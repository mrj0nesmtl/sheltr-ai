# 🔥 CRITICAL: OpenAI Connection Error in Production

**Date:** October 15, 2025 - 5:21 PM  
**Status:** 🔴 ACTIVE ISSUE  
**Severity:** HIGH  

---

## 🚨 **Problem Statement**

Production chatbot is experiencing **connection errors** when trying to reach OpenAI API.

### **Symptoms:**
- ✅ Health check reports `"openai_service": "available"` (API key is present)
- ❌ Actual API calls fail with `Connection error`
- ✅ Localhost works perfectly
- ❌ Production consistently fails with network errors

### **Error Logs:**
```
ERROR:services.openai_service:OpenAI API error: Connection error.
INFO:openai._base_client:Retrying request to /chat/completions
ERROR:services.embeddings_service:Query embedding generation failed: Connection error.
WARNING:services.chatbot.orchestrator:⏱️ RAG response timeout (>8s), falling back to standard AI
ERROR:services.chatbot.orchestrator:AI response generation failed: Connection error.
```

---

## 🔍 **Root Cause Analysis**

**NOT an API key issue** - The problem is **network connectivity** between Cloud Run and `api.openai.com`.

### **What's Happening:**
1. Cloud Run container starts successfully ✅
2. Environment variables loaded (including OPENAI_API_KEY) ✅  
3. Code attempts to call OpenAI API ✅
4. **Network request to api.openai.com FAILS** ❌
5. OpenAI client retries multiple times
6. Eventually times out after 8 seconds
7. Falls back to generic response

### **Why This Happens:**
Possible causes:
1. **Cloud Run network configuration** - Outbound traffic might be restricted
2. **OpenAI API rate limiting** - Though this would show different error
3. **DNS resolution issues** - Can't resolve api.openai.com
4. **Firewall rules** - GCP project firewall blocking outbound HTTPS
5. **OpenAI service degradation** - Their API might be having issues

---

## 🧪 **Diagnostic Tests**

### **Test 1: Verify OpenAI API is Working** ✅

```bash
# From localhost
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR-API-KEY"
```

**Result:** OpenAI API is up and working

---

### **Test 2: Check Cloud Run Can Reach External APIs**

We need to test if Cloud Run can make ANY external HTTPS requests:

```bash
# Add a test endpoint to the API
# In apps/api/main.py:

@app.get("/debug/test-external-connection")
async def test_external_connection():
    import httpx
    results = {}
    
    # Test 1: Google (should work)
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get("https://www.google.com", timeout=5.0)
            results["google"] = {"status": r.status_code, "success": True}
    except Exception as e:
        results["google"] = {"error": str(e), "success": False}
    
    # Test 2: OpenAI API
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get("https://api.openai.com", timeout=5.0)
            results["openai"] = {"status": r.status_code, "success": True}
    except Exception as e:
        results["openai"] = {"error": str(e), "success": False}
    
    # Test 3: DNS Resolution
    import socket
    try:
        ip = socket.gethostbyname("api.openai.com")
        results["dns"] = {"ip": ip, "success": True}
    except Exception as e:
        results["dns"] = {"error": str(e), "success": False}
    
    return results
```

Then test:
```bash
curl https://sheltr-api-714964620823.us-central1.run.app/debug/test-external-connection
```

---

## 🛠️ **Potential Solutions**

### **Solution 1: Check Google Cloud Egress Settings** (Most Likely)

Cloud Run should allow all outbound traffic by default, but let's verify:

```bash
# Check current egress setting
gcloud run services describe sheltr-api \
  --region=us-central1 \
  --format="value(spec.template.metadata.annotations['run.googleapis.com/vpc-access-egress'])"

# Should be empty or "all-traffic"
# If it shows something else, fix it:
gcloud run services update sheltr-api \
  --region=us-central1\
  --clear-vpc-connector
```

---

### **Solution 2: Enable VPC Access for Outbound Calls**

If Cloud Run needs explicit VPC access:

```bash
# Create VPC connector
gcloud compute networks vpc-access connectors create sheltr-connector \
  --region=us-central1 \
  --network=default \
  --range=10.8.0.0/28

# Update Cloud Run to use it
gcloud run services update sheltr-api \
  --region=us-central1 \
  --vpc-connector=sheltr-connector \
  --vpc-egress=all-traffic
```

---

### **Solution 3: Check Firewall Rules**

```bash
# List firewall rules
gcloud compute firewall-rules list --filter="direction=EGRESS" \
  --format="table(name,direction,priority,sourceRanges,allowed[].map().firewall_rule())"

# If there are deny rules blocking HTTPS (port 443), we need to add allow rule:
gcloud compute firewall-rules create allow-https-egress \
  --direction=EGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:443 \
  --destination-ranges=0.0.0.0/0
```

---

### **Solution 4: Increase Timeout & Retry Logic**

Modify OpenAI service configuration in `apps/api/services/openai_service.py`:

```python
# Increase timeout
self.client = AsyncOpenAI(
    api_key=self.api_key,
    timeout=httpx.Timeout(30.0, connect=10.0),  # Increased from default
    max_retries=3
)
```

---

### **Solution 5: Use Proxy or Relay Service**

If direct connection is blocked, use a proxy:

1. Set up Cloud Run service in a different project/region
2. Use it as proxy for OpenAI calls
3. Or use a third-party OpenAI proxy service

---

## 🎯 **Quick Fix: Test with Different OpenAI Configuration**

Let's try modifying the OpenAI client initialization to be more resilient:

<function_calls>
<invoke name="read_file">
<parameter name="target_file">/Users/mrjones/Github/Projects/sheltr-ai/apps/api/services/openai_service.py
