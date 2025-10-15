# 🚨 CRITICAL: RAG/AI Fallback Crash Issue

**Date:** October 15, 2025 (Evening)  
**Status:** 🔴 CRITICAL - RAG queries crashing in production  
**Priority:** HIGH - Fix before Session 23

---

## 🐛 Issue Description

**Symptoms:**
- FAQ queries work perfectly (<1s response)
- Complex RAG/AI queries return error: "I'm having trouble connecting right now"
- No graceful degradation to OpenAI fallback

**Test Cases That Failed:**
```
✅ PASS: "when does sheltr launch?" - FAQ works
✅ PASS: "what is the sheltr ecosystem?" - FAQ works
✅ PASS: "why should i donate through sheltr?" - FAQ works
❌ FAIL: "explain how the blockchain verifies my donation" - RAG crashes
❌ FAIL: "compare sheltr to traditional homeless charities" - RAG crashes
```

**Error Message:**
```
"I'm having trouble connecting right now. You can always contact us 
directly or explore our help sections!"
```

---

## 🔍 Root Cause Analysis

**Likely Issues:**

1. **RAG Orchestrator Timeout** (Most Likely)
   - RAG call exceeds 8-second timeout
   - Error handling returns generic message instead of falling back to OpenAI
   - Knowledge base search may be slow or failing

2. **OpenAI API Issues**
   - API key not available in production
   - Rate limiting hit
   - Connection timeout

3. **Knowledge Base Not Loaded**
   - Embeddings not available
   - Firestore knowledge base empty or inaccessible
   - Vector search failing

4. **Exception Handling Too Broad**
   - Catching all exceptions and returning generic error
   - Not attempting OpenAI fallback when RAG fails

---

## 📁 Files to Check

### **Priority 1 - Immediate Check:**

```python
# apps/api/services/chatbot/orchestrator.py
# Lines ~506-553 - RAG timeout and fallback logic

except (asyncio.TimeoutError, Exception) as error:
    # This is where RAG failures are caught
    # Need to verify OpenAI fallback is actually being called
    
    # Check if this is returning the error message instead of falling back
```

### **Priority 2 - API Configuration:**

```python
# apps/api/services/openai_service.py
# Verify OpenAI API key is loaded in production
# Check if service is actually available

def is_available(self):
    # This should return True if API key exists
    # Check production environment variables
```

### **Priority 3 - RAG Orchestrator:**

```python
# apps/api/services/chatbot/rag_orchestrator.py
# Line ~200-300 - Knowledge base search
# Line ~400-500 - Response generation
# Line ~592-609 - Fallback logic

# Check if knowledge base is accessible
# Check if embeddings are loaded
# Verify fallback to standard AI is working
```

---

## 🔧 Quick Diagnostic Commands

### **Check Backend Logs:**
```bash
# Check for errors when RAG query is made
tail -f /Users/mrjones/Github/Projects/sheltr-ai/logs/backend.log | grep -E "RAG|OpenAI|ERROR|timeout"

# Look for:
# - "RAG response timeout"
# - "RAG response failed"
# - "OpenAI API"
# - Any exceptions
```

### **Test OpenAI Service:**
```bash
# Check if OpenAI service is available
curl -X GET http://localhost:8000/api/v1/chatbot/health

# Look for:
# "openai_service": "available" or "unavailable"
```

### **Test RAG Directly:**
```bash
# Try a RAG query and watch logs
curl -X POST http://localhost:8000/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{"message": "explain blockchain verification", "user_id": "test_rag", "context": {}}'
  
# Check response time and logs
```

---

## 🛠️ Likely Fixes

### **Fix 1: Ensure OpenAI Fallback Works**

```python
# apps/api/services/chatbot/orchestrator.py
# Around line 506-553

except (asyncio.TimeoutError, Exception) as error:
    if isinstance(error, asyncio.TimeoutError):
        logger.warning(f"⏱️ RAG response timeout (>8s), falling back to standard AI")
    else:
        logger.warning(f"❌ RAG response failed, falling back to standard AI: {str(error)}")
    
    # VERIFY THIS BLOCK IS EXECUTING AND RETURNING ChatResponse
    # NOT returning error message string
    
    # Check if openai_service.is_available() returns True
    if not openai_service.is_available():
        logger.error("❌ OpenAI service not available - cannot fallback")
        # This might be where the error message comes from
        return ChatResponse(
            message="I'm having trouble connecting right now. You can always contact us directly or explore our help sections!",
            actions=[...],
            agent_used="error",
            ...
        )
```

### **Fix 2: Check OpenAI API Key in Production**

```python
# apps/api/services/openai_service.py

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            logger.error("❌ OPENAI_API_KEY not found in environment")
            # This would cause is_available() to return False
        
    def is_available(self) -> bool:
        return bool(self.api_key)
```

**Check Production Environment:**
```bash
# On production server or in .env file
echo $OPENAI_API_KEY

# Should return: sk-...
# If empty, RAG fallback will fail
```

### **Fix 3: Increase RAG Timeout**

```python
# apps/api/services/chatbot/orchestrator.py
# Line ~495

# Current timeout: 8 seconds
# Try increasing to 15 seconds for complex queries
rag_response = await asyncio.wait_for(
    rag_orchestrator.handle_message(...),
    timeout=15.0  # Increased from 8.0
)
```

### **Fix 4: Better Error Messages**

```python
# apps/api/routers/public_chatbot.py
# Add better error handling

try:
    response = await chatbot_orchestrator.process_message(...)
except Exception as e:
    logger.error(f"❌ Chatbot error: {str(e)}")
    logger.error(f"❌ Exception type: {type(e)}")
    logger.error(f"❌ Stack trace: ", exc_info=True)
    
    # Return helpful error instead of generic message
    return PublicChatResponse(
        success=False,
        response=f"Error processing query: {str(e)}",
        ...
    )
```

---

## 🧪 Testing Plan

### **Step 1: Check Backend Health**
```bash
curl http://localhost:8000/api/v1/chatbot/health
```
**Expected:** All services "operational" or "available"

### **Step 2: Test FAQ (Should Work)**
```bash
curl -X POST http://localhost:8000/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{"message": "when does sheltr launch?", "user_id": "test1", "context": {}}'
```
**Expected:** <1s response with FAQ answer

### **Step 3: Test Simple RAG (Currently Failing)**
```bash
curl -X POST http://localhost:8000/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{"message": "tell me more about blockchain verification", "user_id": "test2", "context": {}}'
```
**Expected:** 2-8s response with detailed answer
**Actual:** Error message

### **Step 4: Check Logs During Failure**
```bash
tail -f logs/backend.log
# Make RAG query
# Look for error messages, timeouts, or API issues
```

---

## 📊 Debug Checklist

### **Environment Variables:**
- [ ] `OPENAI_API_KEY` set in production
- [ ] `FIREBASE_PROJECT_ID` set correctly
- [ ] `FIREBASE_CREDENTIALS` available
- [ ] All environment variables loaded

### **Service Availability:**
- [ ] OpenAI service initialized correctly
- [ ] Knowledge base accessible
- [ ] Embeddings loaded
- [ ] RAG orchestrator available

### **Error Handling:**
- [ ] RAG timeout logic working
- [ ] OpenAI fallback executing
- [ ] Error messages logged properly
- [ ] ChatResponse always returned (never string)

### **Performance:**
- [ ] RAG queries within timeout (8-15s)
- [ ] OpenAI API responding
- [ ] No rate limiting issues
- [ ] Network connectivity stable

---

## 🚀 Immediate Action Items

### **Before Session 23 (Wednesday):**

1. **Check Production Environment Variables** (5 min)
   - Verify OPENAI_API_KEY exists
   - Check all required environment variables
   - Restart backend if keys were missing

2. **Review Error Handling** (15 min)
   - Check orchestrator.py fallback logic
   - Verify ChatResponse always returned
   - Add better error logging

3. **Test RAG Queries** (10 min)
   - Test 5-10 complex queries
   - Verify OpenAI fallback works
   - Check response times

4. **Update Documentation** (10 min)
   - Document the fix
   - Update testing guide
   - Add to Session 23 checklist

### **During Session 23:**

1. **Start with RAG Fix** (30 min)
   - Before testing FAQs
   - Fix RAG fallback issue
   - Verify complex queries work

2. **Then Test FAQ System** (30 min)
   - After RAG is working
   - Test all FAQ queries
   - Collect performance metrics

3. **Then Move to Notifications** (Remaining time)
   - With chatbot fully working
   - Focus on notification system

---

## 💡 Most Likely Solution

**Based on the symptoms, this is probably:**

```python
# The issue is likely in apps/api/services/openai_service.py

# OpenAI API key not available in production environment
# When RAG fails and tries to fallback to OpenAI:

if not openai_service.is_available():
    # This returns the generic error message
    return "I'm having trouble connecting right now..."
    
# FIX: Ensure OPENAI_API_KEY is set in production
# OR: Improve fallback to provide a better response even without OpenAI
```

**Quick Fix Command:**
```bash
# On production server or .env file
export OPENAI_API_KEY="sk-your-key-here"

# Restart backend
pkill -f uvicorn
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > logs/backend.log 2>&1 &
```

---

## 📝 Update Session 23 Kickoff

**Add to beginning of Phase 1:**

```markdown
### **Phase 0: Fix RAG Fallback Issue (30 min) - DO THIS FIRST**

Before testing FAQs, fix the RAG/OpenAI fallback:

1. Check OpenAI API key in environment
2. Verify openai_service.is_available() returns True
3. Test RAG fallback with complex query
4. Verify error handling returns ChatResponse, not string
5. Document the fix

**Only proceed to FAQ testing after RAG is working!**
```

---

## 🎯 Success Criteria

**RAG/AI Fallback Fixed When:**

- ✅ Complex queries return detailed answers (not error)
- ✅ Response time 2-8 seconds (acceptable)
- ✅ OpenAI fallback working when RAG times out
- ✅ Graceful degradation (no crashes)
- ✅ Helpful error messages (if any errors occur)
- ✅ Logs show proper fallback chain: FAQ → RAG → OpenAI

---

## 📚 Related Documents

- [FAQ Expansion Complete](FAQ-EXPANSION-COMPLETE.md)
- [Chatbot Architecture Analysis](CHATBOT-ARCHITECTURE-ANALYSIS.md)
- [Chatbot Debug Results](CHATBOT-DEBUG-RESULTS.md)
- [Session 23 Kickoff](SESSION-23-KICKOFF-NOTIFICATION-DEBUG.md)

---

**PRIORITY: Fix this before Session 23 Wednesday afternoon!** 🚨

The FAQ system is working beautifully (200x faster!), but we need the RAG/OpenAI fallback working for complex queries to make the chatbot truly complete.

---

**Status:** 🔴 CRITICAL - Needs immediate attention  
**Impact:** High - Affects all complex/nuanced queries  
**Difficulty:** Low-Medium - Likely environment variable or error handling  
**Time to Fix:** 30-60 minutes

**This should be the FIRST thing we fix in Session 23!** 🎯

