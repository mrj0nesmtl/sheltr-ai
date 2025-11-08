# Conversation Sharing & Export Guide

**Version:** 1.0.0  
**Date:** October 18, 2025  
**Status:** Production Ready ✅

---

## Overview

The SHELTR chatbot dashboard now includes powerful features for sharing conversations and exporting them to the knowledge base. This guide covers how to use these features and their technical implementation.

---

## 🔗 Feature 1: Share Conversation

### What It Does

Creates a **read-only, shareable link** to a conversation snapshot. Perfect for:
- 📊 Sharing analysis with team members
- 💡 Distributing insights from Claude
- 📝 Creating reference materials
- 🎓 Training new team members

### How to Use

**Step 1: Navigate to Chatbot Dashboard**
```
/dashboard/chatbots
```

**Step 2: Find Your Conversation**
- Locate the chat session you want to share
- Click the three-dot menu (•••) next to the session

**Step 3: Click "Share"**
- A unique link will be generated
- Link is automatically copied to clipboard
- Green success message confirms

**Step 4: Share the Link**
```
https://sheltr-ai.web.app/shared?id=abc-123-def-456
```

Anyone with this link can view the conversation!

### What Recipients See

```
┌─────────────────────────────────────────┐
│  Shared Conversation (Read-Only)        │
│  ────────────────────────────────────   │
│                                          │
│  💬 POD Deployment Strategy              │
│  🤖 Agent: Business Analyst              │
│  🧠 Model: Claude 3.5 Sonnet             │
│  📅 Created: Oct 18, 2025                │
│  👁️ Views: 7                             │
│                                          │
│  ─── Conversation ───                    │
│                                          │
│  👤 User:                                │
│  "What's the optimal POD deployment..."  │
│                                          │
│  🤖 Assistant:                           │
│  "Based on SHELTR's model, here's..."   │
│                                          │
│  [Full conversation history...]          │
│                                          │
│  ─────────────────────────────────────   │
│  Shared by: admin@sheltr.org             │
│  Shared on: Oct 18, 2025 at 2:30 PM     │
└─────────────────────────────────────────┘
```

### Key Features

✅ **Read-Only Access** - Viewers cannot modify or continue
✅ **Snapshot in Time** - Frozen at moment of sharing
✅ **No Authentication Required** - Anyone with link can view
✅ **View Tracking** - See how many times link was opened
✅ **Shareable Metadata** - Agent, model, date all visible
✅ **Full Message History** - All messages included

### Important Notes

⚠️ **Static Snapshot:** Link does NOT update if you add more messages
⚠️ **Public Access:** Anyone with link can view - share carefully
⚠️ **Permanent:** Links don't expire (future feature)
⚠️ **No Editing:** Recipients cannot interact with AI

### Use Cases

**Internal Team Sharing:**
```
"Hey team, here's the donor engagement strategy I 
worked out with Claude yesterday:"
https://sheltr-ai.web.app/shared?id=xyz-789
```

**External Stakeholder:**
```
"Board members: Check out this POD cost analysis:"
https://sheltr-ai.web.app/shared?id=abc-456
```

**Documentation:**
```
"FAQ: How we calculated deployment timelines:"
https://sheltr-ai.web.app/shared?id=def-123
```

---

## 📚 Feature 2: Export to Knowledge Base

### What It Does

Converts a conversation into a **formatted markdown document** and saves it to the knowledge base. This makes it:
- 🔍 Searchable by all AI agents
- 📖 Available to authenticated chatbot
- 💾 Permanently stored for reference
- ♻️ Reusable across platform

### How to Use

**Step 1: Navigate to Chatbot Dashboard**
```
/dashboard/chatbots
```

**Step 2: Select Conversation**
- Find the valuable conversation
- Click three-dot menu (•••)

**Step 3: Click "Export to KB"**
- Confirmation dialog appears
- Click "Export" to confirm

**Step 4: Verify Export**
- Green success message confirms
- Document saved to knowledge base
- Now searchable by AI agents

### What Gets Created

**Markdown Document Format:**
```markdown
# [Conversation Title]

**Agent:** business-analyst
**Model:** claude-3-5-sonnet-20241022
**Date:** 2025-10-18

---

**User:**

What's the optimal POD deployment strategy for a city 
with 5,000 homeless participants?

**Assistant:**

Based on SHELTR's SmartFund model and POD specifications, 
here's the optimal strategy:

1. **Phase 1: Pilot Deployment (100 PODs)**
   - Target: 100 highest-need individuals
   - Cost: $500,000 (100 × $5,000)
   - Timeline: 3 months...

[Full conversation continues...]

---

*Exported from chat session abc-123-def on Oct 18, 2025*
*Exported by: admin@sheltr.org*
```

### Database Structure

**Collection:** `knowledge_documents`

```javascript
{
  id: "chat-export-abc-123-def",
  title: "POD Deployment Strategy - 5K Participants",
  content: "[Full markdown content...]",
  category: "platform-info",
  source: "chat-export",
  source_session_id: "abc-123-def",
  created_by: "user-123",
  created_at: "2025-10-18T14:30:00Z",
  updated_at: "2025-10-18T14:30:00Z",
  word_count: 1247,
  status: "active"
}
```

### Where It Goes

**1. Firestore Collection**
```
knowledge_documents/
  └── chat-export-{session_id}
```

**2. Used By:**
- ✅ Authenticated Chatbot (all 5 agents)
- ✅ RAG Orchestrator
- ✅ Knowledge Base Search
- ❌ Public chatbot (uses FAQ only)

**3. Available In:**
- Knowledge Base Dashboard (`/dashboard/knowledge`)
- Semantic search for admin queries
- Agent context building

### Use Cases

**Preserve Valuable Analysis:**
```
You: "Explain SHELTR's tokenomics"
Claude: [Detailed 2000-word explanation]
→ Export to KB for future reference
```

**Build Internal Documentation:**
```
Multiple conversations about POD deployment
→ Export each to KB
→ Agents learn from accumulated knowledge
```

**Create Training Material:**
```
Exemplary donor support conversation
→ Export to KB
→ Train new admins on best practices
```

**Document Decisions:**
```
Strategic planning conversation with Business Analyst
→ Export to KB
→ Permanent record of reasoning
```

---

## 🔄 Workflow: Share vs Export

### Decision Matrix

| Goal | Use | Result |
|------|-----|--------|
| **Show teammate** | 🔗 Share | Link they can view |
| **Get feedback** | 🔗 Share | Read-only access |
| **Make searchable** | 📚 Export | KB document |
| **Reference later** | 📚 Export | Permanent archive |
| **Train AI** | 📚 Export | Agent learns from it |
| **External stakeholder** | 🔗 Share | Public link |
| **Document decision** | 📚 Export | Stored knowledge |

### Recommended: Do Both!

For important conversations:
1. 🔗 **Share** → Get immediate feedback from team
2. 📚 **Export** → Preserve knowledge permanently
3. ✅ Best of both worlds!

---

## 🛠️ Technical Implementation

### Backend Routes

**1. Share Conversation**
```python
POST /api/v1/chatbot-dashboard/sessions/{session_id}/share

Response:
{
  "success": true,
  "data": {
    "share_id": "abc-123-def-456",
    "share_url": "/shared?id=abc-123-def-456",
    "created_at": "2025-10-18T14:30:00Z"
  }
}
```

**2. Get Shared Conversation**
```python
GET /api/v1/chatbot-dashboard/shared/{share_id}

Response:
{
  "success": true,
  "data": {
    "session": {
      "title": "POD Deployment Strategy",
      "agent_type": "business-analyst",
      "model": "claude-3-5-sonnet-20241022",
      "created_at": "2025-10-18T14:00:00Z"
    },
    "messages": [
      {
        "role": "user",
        "content": "...",
        "timestamp": "..."
      },
      // ...
    ],
    "share_info": {
      "created_by": "admin@sheltr.org",
      "created_at": "2025-10-18T14:30:00Z",
      "view_count": 7
    }
  }
}
```

**3. Export to Knowledge Base**
```python
POST /api/v1/chatbot-dashboard/sessions/{session_id}/export-to-kb
Content-Type: multipart/form-data

Form Data:
  title: "Optional custom title"
  category: "platform-info"  # or "chat-exports"

Response:
{
  "success": true,
  "data": {
    "document_id": "chat-export-abc-123",
    "title": "POD Deployment Strategy",
    "category": "platform-info",
    "word_count": 1247,
    "created_at": "2025-10-18T14:30:00Z"
  },
  "message": "Conversation exported to knowledge base successfully"
}
```

### Frontend Services

**File:** `apps/web/src/services/chatbotDashboardService.ts`

```typescript
// Share conversation
async generateShareLink(sessionId: string): Promise<ShareLinkResponse> {
  const token = await getCurrentToken();
  const response = await fetch(
    `${API_BASE}/chatbot-dashboard/sessions/${sessionId}/share`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.json();
}

// Get shared conversation (no auth required)
async getSharedConversation(shareId: string): Promise<SharedConversationResponse> {
  const response = await fetch(
    `${API_BASE}/chatbot-dashboard/shared/${shareId}`,
    { method: 'GET' }
  );
  return response.json();
}

// Export to knowledge base
async exportToKnowledgeBase(
  sessionId: string,
  title?: string,
  category: string = 'platform-info'
): Promise<ExportResponse> {
  const token = await getCurrentToken();
  const formData = new FormData();
  if (title) formData.append('title', title);
  formData.append('category', category);
  
  const response = await fetch(
    `${API_BASE}/chatbot-dashboard/sessions/${sessionId}/export-to-kb`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    }
  );
  return response.json();
}
```

### Database Collections

**1. shared_conversations**
```javascript
{
  id: "uuid-generated-share-id",
  session_id: "original-session-id",
  created_by: "user-uid",
  created_at: Timestamp,
  view_count: 0,
  last_viewed_at: Timestamp | null
}
```

**2. knowledge_documents** (exports)
```javascript
{
  id: "chat-export-{session_id}",
  title: "Conversation title",
  content: "Full markdown content",
  category: "platform-info",
  source: "chat-export",
  source_session_id: "original-session-id",
  created_by: "user-uid",
  created_at: Timestamp,
  updated_at: Timestamp,
  word_count: 1247,
  status: "active"
}
```

---

## 🔒 Security & Privacy

### Share Link Security

✅ **UUID-based** - Not guessable (abc-123-def-456)
✅ **No sensitive data in URL** - Session data server-side
✅ **View tracking** - Know who accessed (by count)
❌ **Not password protected** - Anyone with link can view
❌ **No expiration** - Links work indefinitely (Phase 2)

**Best Practices:**
- ⚠️ Share only non-sensitive conversations
- ⚠️ Use internal Slack/Teams for distribution
- ⚠️ Don't share links publicly unless intended
- ✅ Owner can see view count

### Export Security

✅ **Authentication required** - Must be logged in
✅ **Owner verification** - Only session owner can export
✅ **Audit trail** - Created_by field tracks who
✅ **Firebase rules** - Only admins can read KB documents

---

## 📊 Analytics & Monitoring

### Track Share Usage

**View Count:**
- Increments each time link is opened
- Visible to original sharer
- No user identification (privacy)

**Usage Metrics:**
```javascript
// Query most-shared conversations
db.collection('shared_conversations')
  .orderBy('view_count', 'desc')
  .limit(10)
```

### Track Export Usage

**Export Metrics:**
```javascript
// Query recent exports
db.collection('knowledge_documents')
  .where('source', '==', 'chat-export')
  .orderBy('created_at', 'desc')
  .limit(10)

// Count by user
db.collection('knowledge_documents')
  .where('created_by', '==', userId)
  .where('source', '==', 'chat-export')
  .count()
```

---

## 🐛 Troubleshooting

### Share Link Not Working

**Issue:** "Share failed" error

**Solutions:**
1. Check authentication token
2. Verify session exists
3. Confirm you own the session
4. Check network connectivity
5. Verify backend is running

**Issue:** Shared link shows 404

**Solutions:**
1. Check share_id in URL is correct
2. Verify backend route is deployed
3. Check Firebase collection exists
4. Confirm CORS settings

### Export Not Working

**Issue:** "Export failed" error

**Solutions:**
1. Check authentication
2. Verify session has messages
3. Confirm Firebase write permissions
4. Check backend logs for details

**Issue:** Exported doc not appearing in KB

**Solutions:**
1. Check `knowledge_documents` collection
2. Verify document ID format
3. Check `source: 'chat-export'` filter
4. Refresh KB dashboard

---

## 🚀 Future Enhancements (Phase 2 & 3)

See [Conversation Sharing Roadmap](./CONVERSATION-SHARING-ROADMAP.md) for:

- **Fork Conversations** - Copy and continue shared chats
- **Live/Dynamic Links** - Updates as conversation grows
- **Expiring Links** - Auto-delete after X days
- **Password Protection** - Secure sensitive shares
- **Collaborative Rooms** - Real-time multi-user chats
- **Threading** - Reply to specific messages
- **Reactions** - Add emoji reactions to messages

---

## 📚 Related Documentation

- [SHELTR Agent Architecture](./SHELTR-AGENT-ARCHITECTURE.md)
- [Conversation Sharing Roadmap](./CONVERSATION-SHARING-ROADMAP.md)
- [Knowledge Base Guide](./knowledge-base-guide.md)
- [Chatbot Dashboard Guide](./CHATBOT-DASHBOARD-GUIDE.md)

---

## 🎯 Quick Reference

### User Actions

| Action | Location | Result |
|--------|----------|--------|
| Share conversation | Session menu → Share | Shareable link copied |
| View shared link | Anyone opens URL | Read-only conversation |
| Export to KB | Session menu → Export | KB document created |
| Find export | `/dashboard/knowledge` | Search for exported doc |

### Admin Actions

| Action | Purpose | Tool |
|--------|---------|------|
| Monitor shares | Track popular content | Firestore queries |
| Bulk export | Archive conversations | Script (Phase 2) |
| Delete share | Remove public access | Manual (Phase 2) |
| Manage KB | Review exports | KB Dashboard |

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** October 18, 2025  
**Deployed:** Production

🎉 **Both features are live and ready to use!**

