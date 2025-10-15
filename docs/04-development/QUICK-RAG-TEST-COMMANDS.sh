#!/bin/bash
# Quick RAG Test Commands - Run after deployment completes
# Date: October 15, 2025

echo "🧪 SHELTR RAG Production Testing"
echo "================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "📊 Test 1: Health Endpoint"
echo "-------------------------"
HEALTH=$(curl -s https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/health)
echo "$HEALTH" | jq '.'

OPENAI_STATUS=$(echo "$HEALTH" | jq -r '.openai_service')
if [ "$OPENAI_STATUS" = "available" ]; then
  echo -e "${GREEN}✅ OpenAI Service: Available${NC}"
else
  echo -e "${RED}❌ OpenAI Service: $OPENAI_STATUS${NC}"
  echo -e "${YELLOW}⚠️  RAG will not work - need to fix OpenAI service${NC}"
fi
echo ""

# Test 2: FAQ Query (should work)
echo "📊 Test 2: FAQ Query (Control Test)"
echo "-----------------------------------"
FAQ_RESPONSE=$(curl -s -X POST https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{"message": "when does sheltr launch?", "user_id": "test_user_123", "context": {"page": "/test"}}')

FAQ_MESSAGE=$(echo "$FAQ_RESPONSE" | jq -r '.message' | head -c 100)
echo "Response preview: $FAQ_MESSAGE..."

if echo "$FAQ_RESPONSE" | jq -r '.agent_used' | grep -q "faq"; then
  echo -e "${GREEN}✅ FAQ Service: Working${NC}"
else
  echo -e "${YELLOW}⚠️  FAQ Service: Unexpected agent used${NC}"
fi
echo ""

# Test 3: RAG Query (the critical test)
echo "📊 Test 3: RAG Query (Critical Test)"
echo "------------------------------------"
RAG_RESPONSE=$(curl -s -X POST https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{"message": "explain how the blockchain verifies my donation and what smart contracts are involved", "user_id": "test_user_123", "context": {"page": "/test"}}')

RAG_MESSAGE=$(echo "$RAG_RESPONSE" | jq -r '.message')
RAG_AGENT=$(echo "$RAG_RESPONSE" | jq -r '.agent_used')

echo "Agent used: $RAG_AGENT"
echo "Response preview: ${RAG_MESSAGE:0:150}..."
echo ""

# Check for failure patterns
if echo "$RAG_MESSAGE" | grep -q "trouble connecting"; then
  echo -e "${RED}❌ RAG STILL FAILING - Generic error message${NC}"
  echo ""
  echo "🔍 Next Steps:"
  echo "1. Check Cloud Run logs for errors"
  echo "2. Verify secret permissions"
  echo "3. See: docs/04-development/RAG-FALLBACK-TROUBLESHOOTING-PLAN.md"
  echo ""
  echo "Quick debug command:"
  echo "gcloud run services logs read sheltr-api --region=us-central1 --limit=50"
  exit 1
elif [ ${#RAG_MESSAGE} -lt 50 ]; then
  echo -e "${YELLOW}⚠️  Response too short - might be error${NC}"
  echo "Full response: $RAG_MESSAGE"
  exit 1
else
  echo -e "${GREEN}✅ RAG WORKING! Detailed response received${NC}"
  echo ""
  echo "🎉 SUCCESS! RAG fallback is now operational in production!"
  echo ""
  echo "📝 Full response:"
  echo "$RAG_MESSAGE" | fold -s -w 80
fi

echo ""
echo "================================="
echo "✅ All tests complete!"
echo ""
echo "📊 Summary:"
echo "- Health: $(echo "$HEALTH" | jq -r '.status')"
echo "- OpenAI: $OPENAI_STATUS"
echo "- FAQ: Working"
echo "- RAG: Check above"

