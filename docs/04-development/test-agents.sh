#!/bin/bash

# AI Agent Personality Test Script
# Tests all 5 agents with the same question to verify distinct responses

API_URL="http://localhost:8000"
TEST_QUESTION="How should SHELTR handle participant privacy?"

echo "🧪 AI AGENT PERSONALITY TEST"
echo "=============================="
echo ""
echo "Testing all 5 agents with question:"
echo "\"$TEST_QUESTION\""
echo ""
echo "This will take ~45 seconds (9s per agent)"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test an agent
test_agent() {
    local agent_id=$1
    local agent_name=$2
    local model=$3
    local temperature=$4
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🤖 Testing: $agent_name${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Agent ID: $agent_id"
    echo "Model: $model"
    echo "Temperature: $temperature"
    echo ""
    echo -e "${YELLOW}Response:${NC}"
    echo "---"
    
    # Make the API call (simplified - adjust based on your actual endpoint)
    # This is a placeholder - you'll need to adapt to your actual API structure
    
    echo "[MANUAL TEST REQUIRED]"
    echo "1. Go to http://localhost:3000/dashboard/chatbots"
    echo "2. Select agent: $agent_name"
    echo "3. Create new session"
    echo "4. Ask: \"$TEST_QUESTION\""
    echo "5. Copy response to AGENT-PERSONALITY-TEST.md"
    echo ""
    read -p "Press Enter when you've completed this test..."
    echo ""
}

# Test all 5 agents
test_agent "general" "General Assistant" "gpt-4o-mini" "0.7"
test_agent "sheltr_support" "SHELTR Support" "gpt-4o" "0.5"
test_agent "technical_expert" "Technical Expert" "gpt-4o" "0.3"
test_agent "business_analyst" "Business Analyst" "gpt-4o-mini" "0.6"
test_agent "creative_writer" "Creative Writer" "gpt-4o" "0.8"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All agent tests complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📝 Next Steps:"
echo "1. Review responses in docs/04-development/AGENT-PERSONALITY-TEST.md"
echo "2. Analyze personality differences"
echo "3. Document findings"
echo ""
echo "Expected Differences:"
echo "  • General Assistant → Warm, accessible, dignity-focused"
echo "  • SHELTR Support → Platform features, technical processes"
echo "  • Technical Expert → Security implementation, code references"
echo "  • Business Analyst → Metrics, ROI, stakeholder impact"
echo "  • Creative Writer → Storytelling, emotional narrative"
echo ""

