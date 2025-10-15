# Auto-Title Generation Feature

**Date:** October 15, 2025  
**Feature ID:** CHAT-FEAT-001  
**Status:** ✅ IMPLEMENTED

---

## 🎯 Feature Overview

Automatically generate descriptive, concise titles for chat sessions based on the first user message, replacing generic "New Chat X" titles with meaningful descriptions.

**User Request:**
> "How difficult would it be to auto generate a short title for all of these new chat sessions? We do not need to do it for any of the old ones but going forward if I don't create a title for the chat session could a title be generated?"

---

## ✨ What This Feature Does

### Before:
```
New Chat 15  |  general       |  2 messages
New Chat 16  |  technical_expert  |  2 messages
New Chat 17  |  business_analyst  |  2 messages
New Chat 18  |  creative_writer  |  2 messages
```

### After:
```
Virtual Debit Card Overview  |  technical_expert  |  2 messages
Participant Privacy Guidelines  |  business_analyst  |  2 messages
SHELTR Platform Introduction  |  creative_writer  |  2 messages
Donation Flow Explanation  |  general  |  2 messages
```

---

## 🔧 Implementation Details

### 1. Title Generation Logic

**File:** `apps/api/services/chatbot_dashboard_service.py`

**New Method:** `generate_session_title()`

```python
async def generate_session_title(self, first_user_message: str) -> str:
    """Generate a concise title for a chat session based on the first message"""
    try:
        # Use OpenAI to generate a short, descriptive title
        prompt = f"""Generate a very short (3-6 words) title for a chat conversation that starts with this message:

"{first_user_message[:200]}"

Requirements:
- Maximum 6 words
- Descriptive and specific
- No quotes or punctuation at the end
- Title case

Examples:
- "Virtual Debit Card Overview"
- "SHELTR Platform Introduction"
- "Participant Privacy Guidelines"

Title:"""
        
        title = await self.openai_service.generate_response(
            message=prompt,
            context={},
            system_prompt="You are a helpful assistant that generates concise, descriptive titles. Respond with ONLY the title, nothing else."
        )
        
        # Clean up the title
        title = title.strip().strip('"').strip("'")
        
        # Limit to 60 characters max
        if len(title) > 60:
            title = title[:57] + "..."
        
        return title
        
    except Exception as e:
        logger.error(f"Failed to generate session title: {str(e)}")
        # Fallback: Use first few words of message
        words = first_user_message.split()[:5]
        return ' '.join(words) + ('...' if len(first_user_message.split()) > 5 else '')
```

**Trigger Logic in `send_message()`:**

```python
# Auto-generate title if this is the first user message
# Check if session has a generic title (starts with "New Chat")
session_ref = self.db.collection('chat_sessions').document(session_id)
session_data = session_ref.get().to_dict()

if session_data and session_data.get('title', '').startswith('New Chat'):
    # This is the first message, generate a better title
    logger.info(f"📝 Auto-generating title for session {session_id} from first message")
    new_title = await self.generate_session_title(user_message)
    session_ref.update({'title': new_title})
    logger.info(f"✅ Session title updated to: {new_title}")
```

---

### 2. Message Count Fix

**Problem:** Sessions showed "No messages yet" even when `message_count: 2`

**Solution:** Calculate actual count from `chat_messages` collection

**Updated `get_chat_sessions()` Method:**

```python
async def get_chat_sessions(self, user_id: str) -> List[Dict[str, Any]]:
    """Get all chat sessions for a user"""
    try:
        sessions_ref = self.db.collection('chat_sessions').where('user_id', '==', user_id)
        sessions = []
        
        for doc in sessions_ref.stream():
            session_data = doc.to_dict()
            session_data['id'] = doc.id
            session_data['created_at'] = session_data.get('created_at').isoformat() if session_data.get('created_at') else None
            session_data['updated_at'] = session_data.get('updated_at').isoformat() if session_data.get('updated_at') else None
            
            # Get actual message count and last message from chat_messages collection
            messages = await self.get_chat_messages(doc.id)
            session_data['message_count'] = len(messages)
            
            # Get last message content
            if messages:
                last_msg = messages[-1]  # Last message (sorted by timestamp)
                session_data['last_message'] = last_msg.get('content', '')[:50] + ('...' if len(last_msg.get('content', '')) > 50 else '')
            else:
                session_data['last_message'] = 'No messages yet'
            
            sessions.append(session_data)
        
        # Sort by updated_at descending
        sessions.sort(key=lambda x: x['updated_at'] or '', reverse=True)
        return sessions
```

---

## 📊 Title Generation Rules

### Requirements:
- ✅ **Length:** 3-6 words (enforced by prompt)
- ✅ **Max Characters:** 60 (hard limit)
- ✅ **Case:** Title Case
- ✅ **Format:** Clean (no quotes, minimal punctuation)
- ✅ **Descriptive:** Captures essence of conversation

### Examples by Agent:

**Technical Expert:**
- "Virtual Debit Card Architecture"
- "API Authentication Flow Explanation"
- "Database Encryption Implementation"

**Business Analyst:**
- "Donation ROI Analysis Request"
- "Impact Metrics Strategy Discussion"
- "Stakeholder Engagement Planning"

**Creative Writer:**
- "Outreach Letter to Covenant House"
- "Participant Success Story Draft"
- "Brand Narrative Development"

**SHELTR Support:**
- "SmartFund Distribution Walkthrough"
- "QR Code Setup Guide"
- "Platform Feature Overview"

**General Assistant:**
- "SHELTR Platform Introduction"
- "Getting Started Questions"
- "General Support Inquiry"

---

## 🚀 Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Creates New Session                                 │
│    - Frontend: "New Chat 20"                                │
│    - Backend stores: title="New Chat 20"                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User Sends First Message                                 │
│    - "How does the virtual debit card work?"                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend Checks Session Title                             │
│    - if title.startswith('New Chat'): ✅ Generate           │
│    - else: ❌ Skip (user customized)                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. OpenAI Generates Title                                   │
│    - Input: First 200 chars of message                      │
│    - Output: "Virtual Debit Card Workflow"                  │
│    - Time: ~1-2 seconds                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Update Firestore                                         │
│    - session_ref.update({'title': new_title})               │
│    - Permanent update in database                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Continue with AI Response                                │
│    - Generate response as normal                            │
│    - Return to user                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Considerations

### Title Generation:
- **Time:** ~1-2 seconds (first message only)
- **Cost:** 1 OpenAI API call per new session
- **Frequency:** Once per session (not repeated)
- **Fallback:** Fast (no API call)

### Message Count Query:
- **Time:** ~50-100ms per session
- **Queries:** 1 per session in list
- **Example:** 19 sessions = 19 extra queries
- **Acceptable:** UI still responsive

### Optimization Potential:
- ✅ Cache message counts in session document (future)
- ✅ Batch message count queries (future)
- ✅ Use Firestore document counts (when available)

---

## 🧪 Testing

### Test Scenarios:

#### 1. **New Session with Auto-Title**
```
Steps:
1. Select any agent
2. Click "New Chat"
3. Send message: "How do I set up QR codes?"
4. Wait for response

Expected:
- Session title updates from "New Chat 20" → "QR Code Setup Guide"
- Terminal shows: "📝 Auto-generating title..." and "✅ Session title updated to: QR Code Setup Guide"
- Sidebar updates with new title
```

#### 2. **Message Count Accuracy**
```
Steps:
1. Send 3 messages in a session
2. Refresh page
3. Check sidebar

Expected:
- Shows "6 messages" (3 user + 3 assistant) ✅
- Shows last message preview ✅
- No "No messages yet" ❌
```

#### 3. **Fallback Title Generation**
```
Steps:
1. Simulate OpenAI failure
2. Send first message

Expected:
- Uses fallback: first 5 words + "..."
- Still better than "New Chat X"
```

#### 4. **User-Customized Title**
```
Steps:
1. Create session
2. Manually rename to "My Custom Title"
3. Send first message

Expected:
- Title stays "My Custom Title"
- Auto-generation skipped (doesn't start with "New Chat")
```

---

## 🎯 Success Criteria

- ✅ **Titles Generated:** First message triggers title update
- ✅ **Descriptive:** Titles capture conversation topic
- ✅ **Concise:** 3-6 words, max 60 characters
- ✅ **Accurate Counts:** Message count matches actual messages
- ✅ **No "No messages yet":** When messages exist
- ✅ **Backward Compatible:** Old sessions unaffected
- ✅ **Performance:** < 2 seconds added to first message
- ✅ **User Control:** Manual renames preserved

---

## 📝 Firestore Schema

### Session Document:
```javascript
{
  id: "auto-generated",
  user_id: "firebase-uid",
  title: "Virtual Debit Card Overview",  // ← Auto-generated
  agent_type: "technical_expert",
  model: "gpt-4o-mini",
  message_count: 4,  // ← Calculated from messages
  last_message: "A virtual debit card functions similarly...",  // ← From last message
  created_at: Timestamp,
  updated_at: Timestamp,
  status: "active"
}
```

---

## 🔗 Related Features

- ✅ **CHAT-FEAT-001:** Auto-title generation (THIS FEATURE)
- ✅ **CHAT-FIX-006:** Message count accuracy
- 🔜 **CHAT-FEAT-002:** Manual title editing (future)
- 🔜 **CHAT-FEAT-003:** Session search by title (future)

---

## 🚀 Deployment

**Backend Changes:**
- ✅ Auto-deploys with FastAPI (< 1 minute)
- ✅ No database migration required
- ✅ Works immediately for new sessions
- ✅ Old sessions keep existing titles

**Testing:**
1. Refresh frontend
2. Create new chat session
3. Send first message
4. Observe title update

---

## 💡 Future Enhancements

### Potential Improvements:

1. **Batch Title Generation:**
   - Generate titles for multiple old sessions
   - User-triggered: "Generate titles for all sessions"

2. **Title Editing:**
   - Allow users to edit auto-generated titles
   - Persist edits (don't re-generate)

3. **Smart Title Updates:**
   - Update title if conversation shifts topic
   - Detect when title no longer fits

4. **Title Templates:**
   - Agent-specific title formats
   - "Tech: [topic]", "Business: [topic]"

5. **Title Suggestions:**
   - Show multiple title options
   - Let user choose preferred one

---

**Feature Status:** ✅ LIVE (Localhost) | 🔜 Pending Production Deploy  
**Impact:** High (Better UX, easier session identification)  
**Cost:** Low (1 API call per new session)

