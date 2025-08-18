# SESSION 11.6 - OPENAI API INTEGRATION
**Date**: August 16, 2025  
**Session Type**: Mini-Session (Post-Session 11.5)  
**Objective**: Integrate OpenAI API for intelligent chatbot responses and enhanced AI capabilities  

---

## 🎯 **SESSION OBJECTIVES**

### **Primary Goals**
1. **🔑 OpenAI API Setup** - Secure API key configuration and service initialization
2. **🤖 LLM Integration** - Replace pattern-based responses with GPT-4 powered intelligence
3. **🧠 Context Enhancement** - Implement context-aware conversation management
4. **🔄 Fallback Systems** - Ensure graceful degradation when AI unavailable

### **Success Criteria**
- ✅ OpenAI API successfully integrated and responding
- ✅ All chatbot agents use LLM for response generation
- ✅ Context-aware conversations with memory
- ✅ Robust error handling and fallback mechanisms
- ✅ Performance within acceptable limits (< 3 seconds response time)

---

## 🛠️ **TECHNICAL IMPLEMENTATION PLAN**

### **🔧 Infrastructure Setup**

#### **1. Environment Configuration**
```bash
# .env additions (apps/api/.env)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini  # Cost-effective for production
OPENAI_MAX_TOKENS=150     # Concise responses
OPENAI_TEMPERATURE=0.7    # Balanced creativity
OPENAI_TIMEOUT=30         # API timeout in seconds

# Optional advanced settings
OPENAI_FALLBACK_MODEL=gpt-3.5-turbo
OPENAI_MAX_CONTEXT_TOKENS=4000
OPENAI_RATE_LIMIT_PER_MINUTE=60
```

#### **2. Dependencies**
```python
# requirements.txt additions
openai>=1.0.0
tiktoken>=0.5.0  # Token counting
tenacity>=8.0.0  # Retry logic
```

### **🏗️ OpenAI Service Architecture**

#### **Core Service Implementation**
```python
# apps/api/services/openai_service.py

import openai
from typing import Dict, List, Optional, Any
from tenacity import retry, stop_after_attempt, wait_exponential
import tiktoken
import logging

class OpenAIService:
    """OpenAI integration service for SHELTR-AI chatbot"""
    
    def __init__(self):
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            timeout=float(os.getenv("OPENAI_TIMEOUT", 30))
        )
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.fallback_model = os.getenv("OPENAI_FALLBACK_MODEL", "gpt-3.5-turbo")
        self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", 150))
        self.temperature = float(os.getenv("OPENAI_TEMPERATURE", 0.7))
        
        # Initialize token encoder
        self.encoding = tiktoken.encoding_for_model(self.model)
        
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_response(
        self, 
        message: str, 
        context: Dict[str, Any],
        system_prompt: str = None
    ) -> str:
        """Generate AI response with context awareness"""
        
    async def classify_intent(
        self, 
        message: str, 
        user_role: str, 
        conversation_history: List[Dict] = None
    ) -> Dict[str, Any]:
        """Use LLM for intent classification"""
        
    async def summarize_conversation(
        self, 
        conversation_history: List[Dict], 
        max_summary_tokens: int = 100
    ) -> str:
        """Generate conversation summary for context management"""
        
    def count_tokens(self, text: str) -> int:
        """Count tokens in text for context management"""
        return len(self.encoding.encode(text))
```

### **🎭 Enhanced Agent System**

#### **Role-Specific System Prompts**
```python
# apps/api/services/chatbot/prompts.py

SYSTEM_PROMPTS = {
    "emergency": """
    You are SHELTR's Emergency Response Agent. You help people in crisis situations.
    
    CRITICAL INSTRUCTIONS:
    - If someone mentions suicide, self-harm, or immediate danger, provide crisis resources
    - Always prioritize safety and human life
    - Be empathetic but direct
    - Escalate to human support when needed
    
    Available resources:
    - 911 for immediate emergencies
    - Crisis Text Line: Text HOME to 741741
    - National Suicide Prevention Lifeline: 988
    """,
    
    "participant_support": """
    You are SHELTR's Participant Support Agent. You help homeless individuals access services.
    
    Your role:
    - Help book shelter services (meals, beds, showers, counseling)
    - Provide information about local resources
    - Assist with SHELTR platform navigation
    - Be respectful and non-judgmental
    
    Available services you can help book:
    - Emergency shelter beds
    - Meal services
    - Shower facilities
    - Counseling sessions
    - Medical appointments
    - Job training programs
    """,
    
    "donor_relations": """
    You are SHELTR's Donor Relations Agent. You help donors understand their impact.
    
    Your role:
    - Explain how donations work through SHELTR's SmartFund (80/15/5 distribution)
    - Provide impact tracking and reports
    - Help with tax documentation
    - Answer questions about transparency and blockchain verification
    
    Key information:
    - 80% goes directly to participants
    - 15% goes to housing fund with 6-8% APY
    - 5% supports shelter operations
    - All transactions are blockchain-verified
    """,
    
    "shelter_operations": """
    You are SHELTR's Shelter Operations Agent. You help shelter administrators.
    
    Your role:
    - Assist with participant management
    - Help generate reports and analytics
    - Support resource allocation decisions
    - Provide platform administration guidance
    
    You can help with:
    - Adding new participants to the system
    - Viewing shelter capacity and utilization
    - Generating donation and impact reports
    - Managing shelter services and schedules
    """,
    
    "technical_support": """
    You are SHELTR's Technical Support Agent. You help users with platform issues.
    
    Your role:
    - Troubleshoot login and access problems
    - Guide users through platform features
    - Collect bug reports and feedback
    - Escalate complex technical issues
    
    Common issues you can help with:
    - Password reset and login problems
    - QR code generation and scanning
    - Dashboard navigation
    - Mobile app functionality
    """
}
```

### **🔄 Enhanced Orchestrator Integration**

#### **Modified ChatbotOrchestrator**
```python
# apps/api/services/chatbot/orchestrator.py (enhancements)

from services.openai_service import OpenAIService
from services.chatbot.prompts import SYSTEM_PROMPTS

class ChatbotOrchestrator:
    def __init__(self):
        self.intent_classifier = IntentClassifier()
        self.agent_router = AgentRouter()
        self.openai_service = OpenAIService()  # NEW
        self.active_conversations = {}
        
    async def _generate_response(
        self, 
        intent: Intent, 
        context: ConversationContext, 
        agent: str
    ) -> ChatResponse:
        """Enhanced response generation with OpenAI"""
        try:
            # Get agent-specific system prompt
            system_prompt = SYSTEM_PROMPTS.get(agent, SYSTEM_PROMPTS["technical_support"])
            
            # Prepare context for AI
            ai_context = {
                "user_role": context.user_role,
                "intent_category": intent.category.value,
                "intent_subcategory": intent.subcategory,
                "conversation_history": context.get_recent_context(3),
                "urgency_level": intent.urgency.value
            }
            
            # Generate AI response
            ai_response = await self.openai_service.generate_response(
                message=context.message_history[-1]["user_message"] if context.message_history else "",
                context=ai_context,
                system_prompt=system_prompt
            )
            
            # Generate contextual actions based on agent and intent
            actions = await self._generate_contextual_actions(intent, context, agent)
            
            return ChatResponse(
                message=ai_response,
                actions=actions,
                agent_used=f"{agent}_ai",
                follow_up=await self._generate_follow_up(intent, ai_context)
            )
            
        except Exception as e:
            logger.error(f"AI response generation failed: {str(e)}")
            # Fallback to pattern-based responses
            return await self._generate_fallback_response(intent, context, agent)
```

---

## 🧪 **TESTING & VALIDATION FRAMEWORK**

### **🔍 OpenAI Integration Tests**

#### **1. Basic API Connectivity**
```python
# tests/test_openai_integration.py

import pytest
from services.openai_service import OpenAIService

@pytest.mark.asyncio
async def test_openai_connection():
    """Test basic OpenAI API connectivity"""
    service = OpenAIService()
    response = await service.generate_response(
        message="Hello, test message",
        context={"user_role": "participant"}
    )
    assert isinstance(response, str)
    assert len(response) > 0

@pytest.mark.asyncio
async def test_intent_classification():
    """Test AI-powered intent classification"""
    service = OpenAIService()
    intent = await service.classify_intent(
        message="I need help booking a meal",
        user_role="participant"
    )
    assert intent["category"] == "action"
    assert "meal" in intent["entities"]
```

#### **2. Performance Testing**
```python
@pytest.mark.asyncio
async def test_response_time():
    """Ensure AI responses are within acceptable limits"""
    import time
    service = OpenAIService()
    
    start_time = time.time()
    response = await service.generate_response(
        message="What services are available?",
        context={"user_role": "participant"}
    )
    end_time = time.time()
    
    assert (end_time - start_time) < 3.0  # Must respond within 3 seconds
```

#### **3. Role-Based Response Testing**
```python
# Test scenarios for each role
TEST_SCENARIOS = [
    {
        "role": "participant",
        "message": "I need a place to sleep tonight",
        "expected_keywords": ["shelter", "bed", "tonight", "available"]
    },
    {
        "role": "donor", 
        "message": "How is my donation being used?",
        "expected_keywords": ["SmartFund", "80%", "participant", "impact"]
    },
    {
        "role": "admin",
        "message": "How do I add a new participant?",
        "expected_keywords": ["participant", "add", "register", "profile"]
    }
]
```

### **🔧 Error Handling & Fallback Tests**

#### **1. API Failure Scenarios**
```python
@pytest.mark.asyncio
async def test_api_failure_fallback():
    """Test fallback when OpenAI API is unavailable"""
    # Mock API failure
    with patch('openai.AsyncOpenAI') as mock_openai:
        mock_openai.side_effect = Exception("API Error")
        
        orchestrator = ChatbotOrchestrator()
        response = await orchestrator.process_message(
            message="Help me",
            user_id="test_user",
            user_role="participant"
        )
        
        # Should fallback to pattern-based response
        assert response.message is not None
        assert "error" not in response.message.lower()
```

#### **2. Rate Limiting Tests**
```python
@pytest.mark.asyncio
async def test_rate_limiting():
    """Test behavior under rate limits"""
    service = OpenAIService()
    
    # Simulate rapid requests
    tasks = [
        service.generate_response(f"Message {i}", {"user_role": "participant"})
        for i in range(10)
    ]
    
    responses = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Should handle gracefully without crashing
    assert all(isinstance(r, (str, Exception)) for r in responses)
```

---

## 📊 **MONITORING & ANALYTICS**

### **🔍 AI Performance Metrics**

#### **Response Quality Tracking**
```python
# Enhanced analytics for AI responses
ANALYTICS_EVENTS = {
    "ai_response_generated": {
        "model_used": str,
        "response_time": float,
        "token_count": int,
        "user_role": str,
        "agent_type": str
    },
    "ai_fallback_triggered": {
        "error_type": str,
        "fallback_method": str,
        "user_role": str
    },
    "conversation_quality": {
        "conversation_length": int,
        "user_satisfaction": float,  # From feedback
        "escalation_rate": float
    }
}
```

#### **Cost Monitoring**
```python
# Token usage and cost tracking
class AIUsageTracker:
    async def track_usage(
        self,
        user_id: str,
        tokens_used: int,
        model: str,
        endpoint: str
    ):
        """Track OpenAI API usage for cost control"""
        
        cost_per_token = {
            "gpt-4o-mini": 0.00015 / 1000,  # Per token
            "gpt-3.5-turbo": 0.0015 / 1000
        }
        
        estimated_cost = tokens_used * cost_per_token.get(model, 0)
        
        await analytics_service.track_event(
            "ai_api_usage",
            user_id,
            {
                "tokens_used": tokens_used,
                "model": model,
                "estimated_cost": estimated_cost,
                "endpoint": endpoint
            }
        )
```

---

## 🔒 **SECURITY & COMPLIANCE**

### **🛡️ API Security Measures**

#### **1. API Key Protection**
```python
# Secure API key management
class SecureConfigManager:
    @staticmethod
    def get_openai_key() -> str:
        """Securely retrieve OpenAI API key"""
        key = os.getenv("OPENAI_API_KEY")
        if not key or not key.startswith("sk-"):
            raise ValueError("Invalid OpenAI API key configuration")
        return key
        
    @staticmethod
    def validate_api_key(key: str) -> bool:
        """Validate API key format"""
        return key.startswith("sk-") and len(key) > 20
```

#### **2. Input Sanitization**
```python
class InputSanitizer:
    @staticmethod
    def sanitize_user_input(message: str) -> str:
        """Sanitize user input to prevent prompt injection"""
        # Remove potential prompt injection attempts
        dangerous_patterns = [
            r"ignore\s+previous\s+instructions",
            r"forget\s+everything",
            r"new\s+instructions:",
            r"system\s*:",
            r"assistant\s*:",
        ]
        
        for pattern in dangerous_patterns:
            message = re.sub(pattern, "[FILTERED]", message, flags=re.IGNORECASE)
        
        # Limit message length
        return message[:1000]
```

#### **3. Rate Limiting**
```python
# User-based rate limiting
class RateLimiter:
    def __init__(self):
        self.user_requests = {}
        
    async def check_rate_limit(self, user_id: str) -> bool:
        """Check if user is within rate limits"""
        now = time.time()
        hour_ago = now - 3600
        
        # Clean old requests
        if user_id in self.user_requests:
            self.user_requests[user_id] = [
                req_time for req_time in self.user_requests[user_id]
                if req_time > hour_ago
            ]
        else:
            self.user_requests[user_id] = []
        
        # Check limit (100 requests per hour per user)
        if len(self.user_requests[user_id]) >= 100:
            return False
        
        # Add current request
        self.user_requests[user_id].append(now)
        return True
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Core Integration (Day 1)**
- [ ] **Install Dependencies** - OpenAI, tiktoken, tenacity
- [ ] **Environment Setup** - API keys and configuration
- [ ] **Basic Service** - OpenAIService class implementation
- [ ] **Simple Integration** - Replace one agent response with AI
- [ ] **Basic Testing** - API connectivity and response validation

### **Phase 2: Enhanced Features (Day 2)**
- [ ] **All Agents** - Implement AI responses for all agent types
- [ ] **Context Management** - Conversation history integration
- [ ] **Intent Classification** - Replace regex with LLM classification
- [ ] **Error Handling** - Fallback mechanisms and graceful degradation
- [ ] **Performance Testing** - Response time and reliability validation

### **Phase 3: Production Readiness (Day 3)**
- [ ] **Security Implementation** - Input sanitization and rate limiting
- [ ] **Monitoring Setup** - Usage tracking and cost monitoring
- [ ] **Advanced Features** - Conversation summarization
- [ ] **Documentation Update** - API docs and usage guides
- [ ] **End-to-End Testing** - Complete workflow validation

---

## 🚨 **CRITICAL SUCCESS FACTORS**

### **🎯 Performance Requirements**
- **Response Time**: < 3 seconds for 95% of requests
- **Availability**: 99.5% uptime for AI features
- **Fallback Time**: < 500ms when switching to pattern-based responses
- **Cost Control**: < $100/month for moderate usage

### **🔍 Quality Standards**
- **Response Relevance**: > 90% appropriate responses
- **Role Adherence**: Responses match agent role and user context
- **Safety**: 100% proper handling of emergency situations
- **Consistency**: Coherent multi-turn conversations

### **🛡️ Security Requirements**
- **API Key Security**: No key exposure in logs or errors
- **Input Validation**: All user inputs sanitized
- **Rate Limiting**: Prevent abuse and cost overrun
- **Audit Trail**: Complete logging of AI interactions

---

**🔄 Next Steps**: Complete OpenAI integration testing, then proceed to Session 11.7 for knowledge base implementation.
