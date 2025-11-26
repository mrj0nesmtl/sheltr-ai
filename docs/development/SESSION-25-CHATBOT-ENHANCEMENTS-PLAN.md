# 🤖 Session 25 - Chatbot Dashboard Enhancements Plan

**Date**: November 25, 2025  
**Status**: 🚧 In Progress  
**Priority**: High

---

## 🎯 **Objectives**

Enhance the chatbot dashboard with advanced features for better knowledge base integration and collaboration.

---

## ✨ **Features to Implement**

### **1. Knowledge Base Access Badge** ⭐ **PRIORITY 1**

**Description**: Show the number of KB documents and FAQs the chatbot can access based on user role.

**Location**: Next to agent badge in chat header

**Design**:
```
┌─────────────────────────────────────────────────────┐
│  MSB Registration Process                            │
│  [Business Analyst] [gpt-4o-mini] [15 messages]    │
│  [📚 62 Docs] [💡 86 FAQs]                          │
└─────────────────────────────────────────────────────┘
```

**Implementation**:
- Fetch document count from `knowledge_service` based on user role
- Display as badges with BookOpen and Lightbulb icons
- Update on agent/session change
- Cache for performance

**Files to Modify**:
- `apps/web/src/app/dashboard/chatbots/page.tsx`
- `apps/api/services/knowledge_service.py` (add count endpoint)

---

### **2. Connect KB Document Button** ⭐ **PRIORITY 2**

**Description**: Allow users to attach specific KB documents to chat context for focused queries.

**Location**: Quick actions bar below message input

**Design**:
```
┌─────────────────────────────────────────────────────┐
│  [📎 Photo] [📚 Connect KB Doc] [🔍 Web Search]    │
└─────────────────────────────────────────────────────┘
```

**Flow**:
1. Click "Connect KB Doc" button
2. Modal opens with searchable document list
3. User selects one or more documents
4. Documents attached to chat context
5. Chips displayed above input showing attached docs
6. Backend receives document IDs for focused RAG

**Components to Create**:
- `KBDocumentPickerModal.tsx`
- `AttachedDocumentChip.tsx`

**Features**:
- Search/filter documents
- Multi-select with checkboxes
- Preview document content
- Remove attached documents
- Persist attachments for session

---

### **3. `/kb` Slash Command** ⭐ **PRIORITY 3**

**Description**: Quick command to attach KB documents without opening modal.

**Usage**:
```
User types: "/kb msb registration"
↓
Autocomplete dropdown appears:
  📄 MSB Registration Process
  📄 MSB Compliance Guide
  📄 MSB Application Checklist
↓
User selects document
↓
Document attached to context
```

**Implementation**:
- Detect `/kb` in textarea
- Show autocomplete dropdown (Combobox)
- Fuzzy search documents by title/content
- Arrow keys + Enter to select
- ESC to cancel
- Insert document reference

**Similar to**:
- Slack's `/` commands
- Discord's slash commands
- GitHub's `#` issue references

---

### **4. @ Mention System** ⭐ **PRIORITY 4**

**Description**: Tag users in chat for collaboration (similar to messaging dashboard).

**Usage**:
```
User types: "@joel can you review the MSB docs?"
↓
Autocomplete dropdown appears:
  👤 Joel Yaffe (Super Admin)
  👤 Joel Smith (Platform Admin)
↓
User selects Joel Yaffe
↓
Mention inserted: "@Joel Yaffe can you review the MSB docs?"
```

**Implementation**:
- Detect `@` in textarea
- Fetch users from `users` collection
- Show dropdown with user list
- Filter by name/email
- Insert mention with user ID
- Highlight mentions in chat
- (Future) Send notifications to mentioned users

**Components to Create**:
- `UserMentionDropdown.tsx`
- `MentionHighlight.tsx` (for displaying mentions)

---

## 🗄️ **Database Schema Updates**

### **Chat Messages Collection**

Add new fields to `chat_messages`:

```typescript
{
  // Existing fields...
  content: string;
  role: 'user' | 'assistant';
  
  // NEW: Attached KB Documents
  attached_documents?: string[];  // Array of document IDs
  
  // NEW: User Mentions
  mentioned_users?: {
    user_id: string;
    user_name: string;
    user_email: string;
  }[];
  
  // NEW: Command metadata
  command_used?: '/kb' | '/search' | null;
}
```

### **Chat Sessions Collection**

Add context tracking:

```typescript
{
  // Existing fields...
  title: string;
  agent_type: string;
  
  // NEW: Session context
  attached_documents: string[];  // Persistent document attachments
  context_metadata: {
    total_documents_attached: number;
    total_users_mentioned: number;
    commands_used: string[];
  };
}
```

---

## 🎨 **UI Components**

### **1. KBDocumentPickerModal**

```tsx
<KBDocumentPickerModal
  isOpen={showKBPicker}
  onClose={() => setShowKBPicker(false)}
  onSelect={(docs) => attachDocuments(docs)}
  userRole={user.role}
  selectedDocuments={attachedDocs}
/>
```

**Features**:
- Search bar with real-time filtering
- Document list with checkboxes
- Document preview pane
- Selected count badge
- "Attach" button
- "Clear All" button

### **2. AttachedDocumentChip**

```tsx
<AttachedDocumentChip
  document={doc}
  onRemove={() => removeDocument(doc.id)}
/>
```

**Design**:
```
[📄 MSB Registration Process ✕]
```

### **3. SlashCommandDropdown**

```tsx
<SlashCommandDropdown
  isOpen={showSlashDropdown}
  query={slashQuery}
  onSelect={(doc) => attachDocument(doc)}
  position={cursorPosition}
/>
```

**Features**:
- Positioned near cursor
- Keyboard navigation
- Fuzzy search
- Document icons
- Escape to close

### **4. UserMentionDropdown**

```tsx
<UserMentionDropdown
  isOpen={showMentionDropdown}
  query={mentionQuery}
  onSelect={(user) => insertMention(user)}
  position={cursorPosition}
/>
```

**Features**:
- User avatars
- Role badges
- Online status (future)
- Keyboard navigation

---

## 🔧 **Backend API Updates**

### **New Endpoints**

#### **1. Get KB Document Count**
```
GET /api/v1/knowledge/count?user_role=super_admin
Response: { documents: 62, faqs: 86 }
```

#### **2. Search KB Documents**
```
GET /api/v1/knowledge/search?q=msb&user_role=super_admin&limit=10
Response: [{ id, title, excerpt, source_type }]
```

#### **3. Get Document Context**
```
POST /api/v1/knowledge/context
Body: { document_ids: ['doc1', 'doc2'] }
Response: [{ id, title, content, chunks }]
```

#### **4. Search Users for Mentions**
```
GET /api/v1/users/search?q=joel&limit=10
Response: [{ id, name, email, role, avatar }]
```

---

## 📊 **Implementation Phases**

### **Phase 1: Foundation** (Session 25 - Tonight)
- [x] Create implementation plan document
- [ ] Add KB document count badge
- [ ] Create KBDocumentPickerModal component
- [ ] Add "Connect KB Doc" button

### **Phase 2: Commands** (Next Session)
- [ ] Implement `/kb` slash command detection
- [ ] Create SlashCommandDropdown component
- [ ] Add fuzzy search for documents
- [ ] Keyboard navigation

### **Phase 3: Mentions** (Next Session)
- [ ] Implement `@` mention detection
- [ ] Create UserMentionDropdown component
- [ ] Add user search endpoint
- [ ] Highlight mentions in chat

### **Phase 4: Context Integration** (Next Session)
- [ ] Pass attached documents to backend
- [ ] Update RAG to use document context
- [ ] Display attached docs in chat
- [ ] Persist attachments in session

### **Phase 5: Polish** (Next Session)
- [ ] Add animations
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Loading states
- [ ] Keyboard shortcuts

---

## 🧪 **Testing Scenarios**

### **Scenario 1: MSB Registration Query**
1. Login as Super Admin
2. Start new chat with Business Analyst agent
3. Verify badge shows "📚 62 Docs" (or appropriate count)
4. Click "Connect KB Doc"
5. Search for "MSB registration"
6. Attach "MSB Registration Process" document
7. Ask: "What are the steps for MSB registration?"
8. Verify response uses attached document context

### **Scenario 2: Slash Command**
1. Type "/kb msb"
2. Verify dropdown appears with MSB-related docs
3. Use arrow keys to navigate
4. Press Enter to select
5. Verify document attached
6. Ask question about MSB
7. Verify focused response

### **Scenario 3: User Mention**
1. Type "@joel"
2. Verify dropdown shows Joel Yaffe
3. Select user
4. Verify mention inserted
5. Verify mention highlighted in chat
6. (Future) Verify Joel receives notification

---

## 🎯 **Success Criteria**

- ✅ KB document count badge displays correctly based on user role
- ✅ Users can attach KB documents to chat context
- ✅ `/kb` command provides quick document attachment
- ✅ `@` mentions work for user collaboration
- ✅ Attached documents shown as chips
- ✅ Backend receives document context for focused RAG
- ✅ MSB registration query returns accurate, focused response
- ✅ UI is intuitive and responsive
- ✅ Keyboard shortcuts work smoothly

---

## 📝 **Notes**

- **Performance**: Cache document lists and user lists
- **Security**: Respect role-based access for documents
- **UX**: Provide clear visual feedback for all actions
- **Mobile**: Ensure dropdowns work on touch devices
- **Accessibility**: Keyboard navigation for all features

---

**Status**: Ready to implement Phase 1 tonight, continue in next session.

