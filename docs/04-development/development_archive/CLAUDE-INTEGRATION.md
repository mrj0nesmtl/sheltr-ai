# Claude AI Integration Guide

**Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Status:** ✅ Active

## Overview

SHELTR has integrated Anthropic's Claude AI as a premium LLM option for authenticated administrators. This provides access to Claude's advanced reasoning capabilities while maintaining OpenAI as the default provider.

## Architecture

### Multi-Provider Design

```
┌─────────────────────────────────────────────────────────┐
│           Chatbot Dashboard Service                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │ OpenAI       │    │ Anthropic    │                   │
│  │ Service      │    │ Service      │                   │
│  └──────────────┘    └──────────────┘                   │
│         │                    │                           │
│         └────────┬───────────┘                           │
│                  │                                       │
│         Provider Selection Logic                        │
│         (Based on model name)                           │
│                  │                                       │
│         ┌────────▼────────┐                             │
│         │ Agent Config    │                             │
│         │ - model         │                             │
│         │ - instructions  │                             │
│         └─────────────────┘                             │
└─────────────────────────────────────────────────────────┘
```

## Available Models

### Claude Models (Anthropic)

| Model ID | Name | Best For | Context Window |
|----------|------|----------|----------------|
| `claude-3-5-sonnet-20241022` | Claude 3.5 Sonnet | Complex reasoning, analysis, deep technical questions | 200K tokens |
| `claude-3-5-haiku-20241022` | Claude 3.5 Haiku | Fast responses, simple tasks, quick queries | 200K tokens |

### OpenAI Models (Default)

| Model ID | Name | Best For | Context Window |
|----------|------|----------|----------------|
| `gpt-4o-mini` | GPT-4o Mini | General purpose, cost-effective | 128K tokens |
| `gpt-4o` | GPT-4o | Advanced reasoning, complex tasks | 128K tokens |

## Configuration

### Environment Variables

Add to `apps/api/.env`:

```bash
# Anthropic Claude Configuration (Admin-only)
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Google Cloud Secret Manager

For production deployment, store the API key in Google Secret Manager:

```bash
# Create the secret
echo -n "sk-ant-api03-..." | gcloud secrets create anthropic-api-key \
    --data-file=- \
    --replication-policy="automatic"

# Grant access to Cloud Run service account
gcloud secrets add-iam-policy-binding anthropic-api-key \
    --member="serviceAccount:firebase-adminsdk-fbsvc@sheltr-ai.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

## Usage

### 1. Agent Configuration

To use Claude, configure an agent with a Claude model in the Chatbot Dashboard:

```typescript
{
  "id": "technical-expert",
  "name": "Technical Expert",
  "model": "claude-3-5-sonnet-20241022",  // Claude model
  "instructions": "You are a technical expert...",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### 2. Automatic Provider Selection

The system automatically detects the provider based on the model name:

```python
def _get_provider_from_model(self, model: str) -> str:
    """Determine LLM provider from model name"""
    if model.startswith("claude"):
        return "anthropic"
    else:
        return "openai"
```

### 3. Fallback Mechanism

If Claude is unavailable or fails, the system automatically falls back to OpenAI:

```python
async def _generate_anthropic_response(...) -> str:
    try:
        if not self.anthropic_service.is_available():
            logger.warning("⚠️ Anthropic service not available, falling back to OpenAI")
            return await self.openai_service.generate_response(...)
        
        # Try Claude
        response = await self.anthropic_service.generate_chat_completion(...)
        return response
        
    except Exception as e:
        logger.error(f"❌ Anthropic generation failed: {str(e)}")
        # Fallback to OpenAI
        return await self.openai_service.generate_response(...)
```

## Implementation Details

### Service Layer

**File:** `apps/api/services/anthropic_service.py`

Key features:
- Async client initialization
- Message format conversion (OpenAI → Anthropic)
- Streaming support
- Error handling
- Availability checking

### Dashboard Service Integration

**File:** `apps/api/services/chatbot_dashboard_service.py`

Key changes:
- Import `anthropic_service`
- Provider detection logic
- Dual-provider response generation
- Metadata tracking (includes `provider` field)

## Testing

### Local Testing

1. **Start the backend with Claude enabled:**
   ```bash
   cd apps/api
   source venv/bin/activate  # If using venv
   uvicorn main:app --reload --port 8000
   ```

2. **Test via Chatbot Dashboard:**
   - Navigate to `/dashboard/chatbots`
   - Create/select an agent with a Claude model
   - Send a test message
   - Check terminal logs for provider confirmation

3. **Verify logs:**
   ```
   🤖 Using anthropic provider with model: claude-3-5-sonnet-20241022
   ✅ Claude response generated successfully
   ```

### Testing Fallback

1. **Temporarily disable Claude:**
   - Remove `ANTHROPIC_API_KEY` from `.env`
   - Restart backend

2. **Send message with Claude model:**
   - System should automatically fall back to OpenAI
   - Check logs for fallback message:
     ```
     ⚠️ Anthropic service not available, falling back to OpenAI
     ```

## Cost Comparison

### Anthropic Claude Pricing (as of Oct 2025)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Claude 3.5 Sonnet | $3.00 | $15.00 |
| Claude 3.5 Haiku | $0.80 | $4.00 |

### OpenAI Pricing (as of Oct 2025)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| GPT-4o Mini | $0.15 | $0.60 |
| GPT-4o | $5.00 | $15.00 |

### Recommendations

- **General queries:** Use `gpt-4o-mini` (most cost-effective)
- **Complex analysis:** Use `claude-3-5-sonnet-20241022` (best reasoning)
- **Fast responses:** Use `claude-3-5-haiku-20241022` (balance of speed/cost)
- **Advanced reasoning:** Use `gpt-4o` or `claude-3-5-sonnet-20241022`

## Monitoring

### Key Metrics to Track

1. **Provider Usage:**
   - Requests per provider
   - Cost per provider
   - Response times

2. **Fallback Rate:**
   - How often Claude fails
   - Fallback success rate

3. **Quality Metrics:**
   - User satisfaction by provider
   - Response completeness
   - Error rates

### Logging

All Claude interactions are logged with structured metadata:

```python
logger.info(f"🤖 Using {provider} provider with model: {model}")
logger.info(f"✅ Claude response generated: {len(text)} chars, {input_tokens} input, {output_tokens} output")
```

## Production Deployment

### Prerequisites

1. **Create Google Secret Manager secret:**
   ```bash
   echo -n "YOUR_ANTHROPIC_API_KEY" | gcloud secrets create anthropic-api-key \
       --data-file=- \
       --replication-policy="automatic"
   ```

2. **Update deploy.sh:**
   - Already configured to include `ANTHROPIC_API_KEY` secret
   - Verify line 134 in `deploy.sh`:
     ```bash
     --update-secrets="OPENAI_API_KEY=openai-api-key:latest,ANTHROPIC_API_KEY=anthropic-api-key:latest"
     ```

3. **Deploy:**
   ```bash
   ./deploy.sh
   # Select option 3 (Full deployment)
   ```

### Verification

1. **Check Cloud Run environment:**
   ```bash
   gcloud run services describe sheltr-api --region us-central1
   ```

2. **Test in production:**
   - Navigate to `https://sheltr-ai.web.app/dashboard/chatbots`
   - Create agent with Claude model
   - Send test message
   - Verify response

## Security Considerations

### API Key Protection

1. **Never commit API keys to Git**
   - Use `.env` files (already in `.gitignore`)
   - Use Google Secret Manager for production

2. **Rotate keys regularly**
   - Anthropic Console: https://console.anthropic.com/
   - Update both local `.env` and Google Secret Manager

3. **Monitor usage**
   - Set up billing alerts in Anthropic Console
   - Track usage via Anthropic API dashboard

### Access Control

- Claude models are **admin-only** by design
- Public chatbot uses OpenAI exclusively
- Agent configuration requires authentication
- Role-based access controls in place

## Troubleshooting

### Common Issues

#### 1. "Anthropic service not configured"

**Cause:** Missing `ANTHROPIC_API_KEY`

**Solution:**
```bash
# Check .env file
cat apps/api/.env | grep ANTHROPIC_API_KEY

# If missing, add it
echo "ANTHROPIC_API_KEY=sk-ant-api03-..." >> apps/api/.env
```

#### 2. "API key not valid"

**Cause:** Invalid or expired API key

**Solution:**
1. Generate new key at https://console.anthropic.com/
2. Update `.env` file
3. Restart backend

#### 3. "Rate limit exceeded"

**Cause:** Too many requests to Anthropic API

**Solution:**
1. Check usage in Anthropic Console
2. Implement request throttling
3. Consider upgrading Anthropic plan

#### 4. Fallback always triggering

**Cause:** Claude service not initializing properly

**Solution:**
1. Check logs for initialization errors
2. Verify API key format (should start with `sk-ant-api03-`)
3. Test API key with curl:
   ```bash
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: YOUR_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
   ```

## Future Enhancements

### Planned Features

1. **Streaming Responses**
   - Real-time token streaming for better UX
   - Already implemented in `anthropic_service.py`
   - Need frontend integration

2. **Cost Tracking**
   - Per-user cost tracking
   - Budget alerts
   - Provider cost comparison

3. **A/B Testing**
   - Compare Claude vs OpenAI responses
   - Quality metrics
   - User preference tracking

4. **Smart Provider Selection**
   - Auto-select provider based on query complexity
   - Cost optimization
   - Performance optimization

5. **Vision Support**
   - Claude supports image analysis
   - Integrate with gallery upload feature
   - Document analysis capabilities

## References

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Models Overview](https://docs.anthropic.com/en/docs/models-overview)
- [Anthropic Python SDK](https://github.com/anthropics/anthropic-sdk-python)
- [SHELTR Agent Architecture](./SHELTR-AGENT-ARCHITECTURE.md)
- [Chatbot Dashboard Guide](./CHATBOT-DASHBOARD-GUIDE.md)

## Support

For issues or questions:
1. Check logs in `apps/api/` directory
2. Review Anthropic Console for API status
3. Consult [SHELTR Agent Architecture](./SHELTR-AGENT-ARCHITECTURE.md)
4. Contact platform administrators

---

**Last Updated:** October 17, 2025  
**Maintained By:** SHELTR Development Team  
**Version:** 1.0.0

