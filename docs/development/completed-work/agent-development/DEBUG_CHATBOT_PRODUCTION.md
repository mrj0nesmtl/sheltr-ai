# 🐛 Public Chatbot Production Issue - Diagnosis & Fix

## 📊 **Issue Summary**

**Symptoms:**
- ✅ **Localhost**: Chatbot works correctly but slow
- ❌ **Production (sheltr-ai.web.app)**: Chatbot returns same fallback response twice
- Both correctly identify user as public/not logged in

## 🔍 **Root Cause Analysis**

### **What's Happening:**

1. **Frontend Code** (`PublicChatbot.tsx` line 197-198):
   ```typescript
   // Production calls backend directly
   'https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public'
   ```

2. **Backend Fallback** (`public_chatbot.py` lines 361-384):
   ```python
   except Exception as e:
       logger.error(f"Public chatbot error: {str(e)}")
       
       # Friendly fallback response
       fallback_responses = [
           "Hi! I'm the SHELTR AI Assistant...",
           "Welcome to SHELTR!...",
           "Thanks for visiting SHELTR!...",
           "Hello! SHELTR uses blockchain..."
       ]
       fallback_message = random.choice(fallback_responses)
   ```

3. **The orchestrator is throwing an exception**, triggering the fallback response

### **Why Localhost Works:**
- All environment variables are loaded from local `.env`
- OpenAI API key is available
- RAG orchestrator can access knowledge base
- Firestore connection is local

### **Why Production Fails:**
❌ **Missing environment variables** on Cloud Run deployment:
- `OPENAI_API_KEY` might not be set
- `FIREBASE_CREDENTIALS` might not be configured
- Knowledge base connection may be failing

---

## 🛠️ **Solution Options**

### **Option 1: Fix Cloud Run Environment Variables** (RECOMMENDED)

#### **Check Current Environment:**
```bash
gcloud run services describe sheltr-api \
  --region=us-central1 \
  --format='value(spec.template.spec.containers[0].env)'
```

#### **Set Required Variables:**
```bash
# Set OpenAI API Key
gcloud run services update sheltr-api \
  --region=us-central1 \
  --update-env-vars OPENAI_API_KEY="your-openai-key-here"

# Set Firebase credentials (if using service account)
gcloud run services update sheltr-api \
  --region=us-central1 \
  --update-env-vars GOOGLE_APPLICATION_CREDENTIALS="/app/service-account-key.json"

# Enable Firebase connection
gcloud run services update sheltr-api \
  --region=us-central1 \
  --update-env-vars FIREBASE_PROJECT_ID="sheltr-ai"
```

---

### **Option 2: Add Better Error Logging**

Update `public_chatbot.py` to provide detailed error information:

```python
except Exception as e:
    logger.error(f"Public chatbot error: {str(e)}")
    logger.error(f"Error type: {type(e).__name__}")
    logger.error(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No details'}")
    
    # Check specific error types
    if "openai" in str(e).lower():
        error_hint = "OpenAI API connection issue - check OPENAI_API_KEY"
    elif "firebase" in str(e).lower():
        error_hint = "Firebase connection issue - check credentials"
    elif "rag" in str(e).lower():
        error_hint = "RAG orchestrator issue - check knowledge base"
    else:
        error_hint = "Unknown error - check logs"
    
    logger.error(f"💡 Error hint: {error_hint}")
```

---

### **Option 3: Use Next.js API Route as Proxy** (QUICKEST FIX)

Instead of calling Cloud Run directly, use the Next.js API route:

**Update `PublicChatbot.tsx` line 194-198:**

```typescript
// BEFORE (Production calls Cloud Run directly):
const apiUrl = isDevelopment 
  ? (isAuthenticated ? '/api/chatbot/authenticated' : '/api/chatbot/public')
  : (isAuthenticated 
      ? 'https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/authenticated'
      : 'https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public');

// AFTER (Always use Next.js API route):
const apiUrl = isAuthenticated 
  ? '/api/chatbot/authenticated' 
  : '/api/chatbot/public';
```

**Then update request body** (line 201-228):

```typescript
// Remove the isDevelopment conditional
const requestBody = {
  message: userMessage.text,
  sessionId: getSessionId(),
  userRole: userRole,
  context: {
    page: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    authenticated: isAuthenticated,
    userId: user?.uid,
    email: user?.email,
    firstName: firstName
  }
};
```

**Benefits:**
- ✅ Next.js API route has proper environment variables from Vercel/Firebase
- ✅ Consistent behavior across dev/prod
- ✅ Easier debugging with Next.js logs
- ✅ Better CORS handling

---

## 🔥 **Quick Fix Implementation**

### **Step 1: Update Frontend** (5 minutes)

File: `apps/web/src/components/PublicChatbot.tsx`

```typescript
const sendMessage = async () => {
  if (!inputValue.trim() || isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputValue.trim(),
    isUser: true,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsLoading(true);

  try {
    // SIMPLIFIED: Always use Next.js API route (no direct Cloud Run calls)
    const apiUrl = isAuthenticated 
      ? '/api/chatbot/authenticated' 
      : '/api/chatbot/public';
    
    const requestBody = {
      message: userMessage.text,
      sessionId: getSessionId(),
      userRole: userRole,
      context: {
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        authenticated: isAuthenticated,
        userId: user?.uid,
        email: user?.email,
        firstName: firstName
      }
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      
      const responseText = data.response || data.message || "I'm here to help! Could you please rephrase your question?";
      const actions = data.actions || [];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        actions: actions,
        mcpToolUsed: data.mcp_tool_used,
        roleRestricted: data.role_restricted || false
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      throw new Error('Failed to get response');
    }
  } catch (error) {
    console.error('Chat error:', error);
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "I'm having trouble connecting right now. You can always contact us directly or explore our help sections!",
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

### **Step 2: Verify Next.js API Route** (Already exists)

File: `apps/web/src/app/api/chatbot/public/route.ts` - Already correctly configured!

### **Step 3: Deploy & Test**

```bash
cd apps/web
npm run build
firebase deploy --only hosting
```

---

## 🎯 **Expected Results After Fix**

### **Before:**
```
User: "Hello - This is another test! Who are you?"
Bot: "I'm here to help you learn about SHELTR's platform..."
User: "Please tell me about the SmartFund that governs donations."
Bot: "I'm here to help you learn about SHELTR's platform..." ❌ (Same response)
```

### **After:**
```
User: "Hello - This is another test! Who are you?"
Bot: "I'm the SHELTR AI Assistant! I can help you learn about our platform for transparent charitable giving..."
User: "Please tell me about the SmartFund that governs donations."
Bot: "The SmartFund system ensures donations are managed transparently through blockchain..." ✅ (Different, contextual response)
```

---

## 📊 **Debugging Steps**

### **1. Check Cloud Run Logs:**
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sheltr-api" \
  --limit 50 \
  --format json
```

### **2. Test Backend Directly:**
```bash
curl -X POST https://sheltr-api-714964620823.us-central1.run.app/api/v1/chatbot/public \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, test message",
    "user_id": "test-session-123",
    "user_role": "public",
    "conversation_context": {
      "page": "/",
      "session_type": "public",
      "anonymous": true
    }
  }'
```

### **3. Check Environment Variables:**
```bash
gcloud run services describe sheltr-api \
  --region=us-central1 \
  --format="table(spec.template.spec.containers[0].env)"
```

---

## ✅ **Recommended Action Plan**

1. **IMMEDIATE FIX** (10 minutes):
   - Update `PublicChatbot.tsx` to always use Next.js API route
   - Removes direct Cloud Run dependency
   - Deploy to production

2. **VERIFY** (5 minutes):
   - Test on sheltr-ai.web.app
   - Confirm different responses for different questions
   - Check browser console for errors

3. **LONG-TERM** (Optional):
   - Set up proper Cloud Run environment variables
   - Add comprehensive error logging
   - Monitor with Cloud Logging

---

## 🚀 **Implementation Now?**

Would you like me to implement the **Quick Fix** (Option 3) right now? This will:
- ✅ Fix the duplicate response issue
- ✅ Provide consistent behavior across dev/prod
- ✅ Take ~5 minutes to implement and deploy

Let me know and I'll make the changes!

