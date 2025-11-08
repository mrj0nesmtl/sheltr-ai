# 🐛 SHELTR Chatbot Complete Debug & Fix Session Plan

**Created:** 2025-10-14  
**Session Type:** Comprehensive Debug & Rebuild  
**Priority:** CRITICAL  
**Estimated Time:** 2-4 hours  

---

## 🚨 Critical Issues Identified from Logs

### **Issue #1: RAG Orchestrator Failure** (Line 86)
```
ERROR:services.chatbot.rag_orchestrator:RAG response generation failed: DONATION
```
- RAG is partially working (embeddings + search succeeded)
- Failing during response generation
- Cryptic error: `DONATION` (likely enum or category issue)

### **Issue #2: Context Object Type Error** (Line 87)
```
ERROR:services.chatbot.orchestrator:AI response generation failed: 'dict' object has no attribute 'message_history'
```
- ConversationContext being passed as dict instead of object
- Fallback chain working but shouldn't need to
- Indicates architectural mismatch between routers

### **Issue #3: Fallback Working But Slow** (Line 92)
```
WARNING:main:Slow request: POST http://localhost:8000/api/v1/chatbot/public took 26.47s
```
- 26 second response time (unacceptable)
- RAG attempt → failure → OpenAI fallback → success
- Users will abandon before response

### **Issue #4: Analytics Tracking Broken** (Line 91)
```
WARNING:routers.public_chatbot:Analytics tracking failed for public chat: track_event() got an unexpected keyword argument 'data'
```
- Analytics service API mismatch
- Not critical but losing tracking data

### **Issue #5: Missing Health Endpoint** (Lines 71, 94)
```
INFO: 127.0.0.1:59582 - "GET /api/v1/chatbot/health HTTP/1.1" 404 Not Found
```
- Health check endpoint deleted with chatbot.py
- Frontend likely checking this endpoint
- May be causing frontend to think chatbot is offline

---

## 🎯 Root Cause Analysis

### **Primary Issue: ConversationContext Type Mismatch**

**What's Happening:**
```python
# public_chatbot.py passes dict
conversation_context = {
    "session_type": "public",
    "anonymous": True,
    ...
}

orchestrator.process_message(
    message=message,
    user_id=session_id, 
    user_role="public",
    conversation_context=conversation_context  # ← Dict
)

# orchestrator.py expects ConversationContext object
async def process_message(
    self,
    message: str,
    user_id: str,
    user_role: str,
    conversation_context: Optional[Dict] = None  # ← Optional[Dict] but creates object
) -> ChatResponse:
    context = await self._get_conversation_context(user_id, user_role)
    # Returns ConversationContext object
    
    # But RAG orchestrator tries to access:
    context.message_history  # ← AttributeError if dict was passed through
```

**Solution:** Ensure consistent ConversationContext object usage throughout.

---

## 📋 Complete Debug Session Plan

### **PHASE 1: Pre-Session Preparation** (You do this before starting)

1. **Stop All Running Services**
   ```bash
   cd /Users/mrjones/Github/Projects/sheltr-ai
   ./stop-dev.sh
   pkill -f uvicorn
   pkill -f next
   ```

2. **Pull Latest Code**
   ```bash
   git pull origin main
   git status  # Ensure clean state
   ```

3. **Verify Python Environment**
   ```bash
   cd apps/api
   source .venv/bin/activate
   python --version  # Should be 3.9+
   pip list | grep openai  # Verify OpenAI installed
   ```

4. **Check Environment Variables**
   ```bash
   # Verify these are set:
   echo $OPENAI_API_KEY
   echo $GOOGLE_CLOUD_PROJECT
   ```

5. **Have These URLs Ready**
   - Local Backend: http://localhost:8000
   - Local Frontend: http://localhost:3000
   - Production: https://sheltr-ai.web.app
   - API Docs: http://localhost:8000/docs

---

### **PHASE 2: Systematic Debug** (We do this together)

#### **Step 1: Fix ConversationContext Type Mismatch** (30 min)

**Files to Check:**
- `apps/api/routers/public_chatbot.py` (lines 220-250)
- `apps/api/routers/authenticated_chatbot.py` (lines 210-225)
- `apps/api/services/chatbot/orchestrator.py` (lines 311-434)
- `apps/api/services/chatbot/rag_orchestrator.py` (lines 85-138)

**Actions:**
1. Audit all `conversation_context` parameter passing
2. Ensure dict → ConversationContext conversion
3. Fix RAG orchestrator to handle both dict and object
4. Add type hints and validation
5. Add defensive null checks

**Expected Outcome:**
- No more `'dict' object has no attribute 'message_history'` errors
- ConversationContext properly initialized

---

#### **Step 2: Fix RAG Orchestrator** (45 min)

**Problem:** Line 86 error `DONATION` suggests enum/category issue

**Debug Steps:**
1. Add comprehensive error logging
2. Find where `DONATION` error originates
3. Check IntentCategory enum usage
4. Verify knowledge base structure
5. Test embedding generation
6. Test knowledge search

**Files to Check:**
- `apps/api/services/chatbot/rag_orchestrator.py` (full file)
- `apps/api/services/chatbot/orchestrator.py` (IntentCategory enum)
- `apps/api/services/embeddings_service.py`
- `apps/api/services/knowledge_service.py`

**Actions:**
1. Wrap all RAG code in try-except with detailed logging
2. Add step-by-step debug prints
3. Test each RAG component individually
4. Fix enum/category handling
5. Add fallback at each step

**Expected Outcome:**
- RAG works OR fails gracefully with clear error message
- Response time < 5 seconds

---

#### **Step 3: Add Missing Health Endpoint** (15 min)

**Problem:** `/api/v1/chatbot/health` returns 404

**Solution:**
Add health check to `public_chatbot.py`:

```python
@router.get(
    "/health",
    summary="Chatbot system health check"
)
async def chatbot_health():
    """Check overall chatbot system health"""
    return {
        "status": "healthy",
        "public_endpoint": "operational",
        "authenticated_endpoint": "operational",
        "rag_available": openai_service.is_available(),
        "timestamp": time.time()
    }
```

**Expected Outcome:**
- Health check returns 200 OK
- Frontend can verify chatbot availability

---

#### **Step 4: Fix Analytics Tracking** (15 min)

**Problem:** `track_event() got an unexpected keyword argument 'data'`

**Files to Check:**
- `apps/api/routers/public_chatbot.py` (line ~400)
- `apps/api/services/analytics_service.py` (track_event method)

**Actions:**
1. Check analytics_service.track_event() signature
2. Update public_chatbot.py to match
3. Add error handling for analytics failures
4. Make analytics non-blocking (wrap in try-except)

**Expected Outcome:**
- Analytics tracking works OR fails silently
- No warnings in logs

---

#### **Step 5: Optimize Response Time** (30 min)

**Problem:** 26 second response time

**Optimization Strategy:**
1. **Remove unnecessary RAG calls**: Cache results
2. **Parallel processing**: Run embedding + search simultaneously
3. **Timeout handling**: 5 second timeout for RAG, then fallback
4. **Caching**: Cache frequent queries (FAQ)
5. **Streaming**: Consider streaming responses

**Actions:**
1. Add timeout wrapper around RAG
2. Implement simple in-memory cache
3. Pre-compute embeddings for FAQ
4. Add performance logging

**Expected Outcome:**
- Response time < 5 seconds for RAG
- Response time < 2 seconds for fallback

---

#### **Step 6: Test All Chatbot Flows** (45 min)

**Test Matrix:**

| User Type | Endpoint | Test Message | Expected Agent | Pass/Fail |
|-----------|----------|--------------|----------------|-----------|
| Public | `/chatbot/public` | "What is SHELTR?" | public_information | ⏳ |
| Public | `/chatbot/public` | "I am homeless" | participant_support | ⏳ |
| Public | `/chatbot/public` | "How do I donate?" | donor_relations | ⏳ |
| Public | `/chatbot/public` | "What are PODs?" | public_information | ⏳ |
| Super Admin | `/chatbot/authenticated` | "Tell me our solutions" | super_admin_assistant | ⏳ |
| Super Admin | `/chatbot/authenticated` | "Show analytics" | MCP: impact_report | ⏳ |
| Super Admin | `/chatbot/authenticated` | "Platform status" | MCP: platform_data | ⏳ |
| Dashboard | `/chatbot-dashboard/...` | Session management | chatbot_dashboard | ⏳ |

**For Each Test:**
1. Send request
2. Check response time (< 5 seconds)
3. Verify correct agent routing
4. Check response quality
5. Verify no errors in logs

---

### **PHASE 3: Create Comprehensive FAQ** (1 hour)

Once chatbot is stable, populate knowledge base:

**Categories:**
1. **SHELTR Basics** (20 questions)
   - What is SHELTR?
   - How does it work?
   - Who can use it?
   - Is it free?

2. **SmartFund Model** (15 questions)
   - What is SmartFund?
   - How does 80-15-5 work?
   - Where does my donation go?
   - Can I track my donation?

3. **POD Information** (10 questions)
   - What are PODs?
   - How do I get a POD?
   - Where are PODs located?
   - How much do PODs cost?

4. **Participant Guide** (15 questions)
   - How do I sign up?
   - Do I need a shelter?
   - How do I receive donations?
   - How does the QR code work?

5. **Donor Guide** (15 questions)
   - How do I donate?
   - Is it tax deductible?
   - Can I donate anonymously?
   - How do I track impact?

6. **Shelter Partnership** (10 questions)
   - How do shelters join?
   - Is there a cost?
   - What features do shelters get?
   - How is data protected?

**Format:**
```markdown
## Question: What is SHELTR?

**Category:** basics  
**Keywords:** sheltr, platform, what, about, purpose

**Answer:**
SHELTR is a blockchain-powered platform that creates transparent, direct pathways out of homelessness...

**Actions:**
- [Learn More](/about)
- [View Solutions](/solutions)
- [Start Donating](/scan-give)
```

---

### **PHASE 4: Production Deployment** (30 min)

After local testing passes:

1. **Final Local Verification**
   ```bash
   # Test all endpoints
   curl http://localhost:8000/health
   curl http://localhost:8000/api/v1/chatbot/health
   curl -X POST http://localhost:8000/api/v1/chatbot/public \
     -H "Content-Type: application/json" \
     -d '{"message":"What is SHELTR?","user_id":"test","user_role":"public"}'
   ```

2. **Commit All Fixes**
   ```bash
   git add -A
   git commit -m "fix: Complete chatbot debug - RAG, context, health, analytics"
   git push origin main
   ```

3. **Deploy Backend**
   ```bash
   ./deploy.sh
   # Select option 2 (Backend only)
   ```

4. **Verify Production**
   - Test public chat: https://sheltr-ai.web.app
   - Test authenticated chat: https://sheltr-ai.web.app/dashboard
   - Check logs: https://console.cloud.google.com/run

---

## 🛠️ Tools & Commands You'll Need

### **Backend Logs (Real-time)**
```bash
cd /Users/mrjones/Github/Projects/sheltr-ai
tail -f logs/backend.log
```

### **Test Public Chat**
```bash
curl -X POST http://localhost:8000/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is SHELTR?",
    "user_id": "test_user_123",
    "user_role": "public",
    "conversation_context": {
      "session_type": "public",
      "anonymous": true
    }
  }' | jq
```

### **Test Authenticated Chat**
```bash
# You'll need a valid Firebase token
curl -X POST http://localhost:8000/api/v1/chatbot/authenticated \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIREBASE_TOKEN" \
  -d '{
    "message": "Show me platform status",
    "user_id": "joel_super_admin",
    "user_role": "super_admin"
  }' | jq
```

### **Check Health**
```bash
curl http://localhost:8000/health | jq
curl http://localhost:8000/api/v1/chatbot/health | jq
```

### **Check RAG Service**
```bash
curl http://localhost:8000/api/v1/knowledge/status | jq
```

---

## 📊 Success Criteria

At the end of the session, we should have:

- ✅ **Public Chatbot**
  - Response time < 5 seconds
  - No errors in logs
  - Correct agent routing
  - Helpful responses

- ✅ **Authenticated Chatbot**
  - Working with MCP tools
  - Role-based permissions enforced
  - Knowledge base access
  - Response time < 5 seconds

- ✅ **RAG System**
  - Working OR properly disabled with fallback
  - No cryptic errors
  - Logs show clear debug info

- ✅ **Infrastructure**
  - Health check endpoint working
  - Analytics tracking working
  - No warnings in logs
  - Production deployment successful

- ✅ **Documentation**
  - FAQ document created
  - Knowledge base populated
  - Architecture diagram updated

---

## 💾 Backup Current State

Before starting tomorrow's session:

```bash
cd /Users/mrjones/Github/Projects/sheltr-ai

# Create backup branch
git checkout -b backup-before-chatbot-debug-2025-10-15
git push origin backup-before-chatbot-debug-2025-10-15

# Return to main
git checkout main

# Create backup of logs
cp logs/backend.log logs/backend-backup-2025-10-15.log
```

---

## 🚀 Session Start Prompt

**Use this prompt to start tomorrow's session:**

```
I need to completely debug the SHELTR chatbot implementation. Here's the situation:

CURRENT STATE:
- Route conflict fixed (chatbot.py removed)
- Public chatbot partially working but slow (26 sec responses)
- Authenticated chatbot untested/possibly broken
- RAG orchestrator failing with errors
- ConversationContext type mismatch
- Missing health endpoint
- Analytics tracking broken

KEY ERRORS FROM LOGS:
1. "RAG response generation failed: DONATION"
2. "'dict' object has no attribute 'message_history'"
3. "track_event() got an unexpected keyword argument 'data'"
4. "GET /api/v1/chatbot/health HTTP/1.1" 404 Not Found
5. Response time: 26.47 seconds (unacceptable)

REFERENCE DOCUMENTS:
- docs/04-development/CHATBOT-ARCHITECTURE-ANALYSIS.md
- docs/04-development/CHATBOT-DEBUG-SESSION-PLAN.md

GOAL:
Fix all chatbot issues systematically following the debug plan. Start with Phase 2, Step 1: Fix ConversationContext Type Mismatch.

Let's begin by examining the context object handling in:
1. apps/api/routers/public_chatbot.py
2. apps/api/services/chatbot/orchestrator.py  
3. apps/api/services/chatbot/rag_orchestrator.py

Show me the current code and let's identify the exact type mismatch.
```

---

## 📝 Notes & Observations

### **What's Working:**
- ✅ Route conflict resolved (no more 404s on main endpoints)
- ✅ Embeddings service working (OpenAI API responding)
- ✅ Knowledge search returning results
- ✅ Fallback chain working (responses eventually succeed)
- ✅ Intent classification working
- ✅ Role detection working

### **What's Broken:**
- ❌ RAG response generation (cryptic DONATION error)
- ❌ ConversationContext object handling
- ❌ Response time (26 seconds)
- ❌ Health endpoint missing
- ❌ Analytics tracking

### **What's Unknown:**
- ❓ Authenticated chat functionality (not tested)
- ❓ MCP tool execution (not tested)
- ❓ Knowledge base content (possibly empty)
- ❓ Dashboard chat (not tested recently)

---

## 🎯 Priority Order

If we run out of time, focus on these in order:

1. **CRITICAL**: Fix ConversationContext (blocks everything)
2. **CRITICAL**: Fix RAG or disable gracefully
3. **HIGH**: Add health endpoint
4. **HIGH**: Optimize response time
5. **MEDIUM**: Fix analytics tracking
6. **MEDIUM**: Test authenticated chat
7. **LOW**: Create FAQ document
8. **LOW**: Populate knowledge base

---

**END OF DEBUG SESSION PLAN**

*Save this document and reference it when starting tomorrow's debug session.*

