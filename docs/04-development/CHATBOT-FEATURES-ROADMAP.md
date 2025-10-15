# Chatbot Control Panel Features Roadmap

**Date:** October 15, 2025  
**Status:** Phase 1 Complete (UI Cleanup)

---

## 🎯 **Current State (Phase 1 ✅)**

### **Working Features:**
- ✅ Text messaging with AI agents
- ✅ 5 specialized agents with color-coded badges
- ✅ Auto-generated session titles
- ✅ Chat history persistence
- ✅ Message count accuracy
- ✅ Agent consistency per session
- ✅ RAG knowledge enhancement
- ✅ 86 FAQ instant responses

### **UI Cleanup Complete:**
- ✅ Removed dead buttons (History, Settings, Analytics, Voice)
- ✅ Simplified input area (only Send button)
- ✅ Clear labels for planned features (Gallery, Knowledge, Web Search)
- ✅ Tooltips for user expectations

---

## 🚀 **Phase 2: Gallery (Image Upload + Vision AI)**

### **Priority:** HIGH  
**Timeline:** SOON  
**Status:** 🟡 Planned

### **Features:**

#### **2.1 Image Upload to Gallery**
- **Storage:** Firebase Storage
- **Organization:** Per user, per session
- **Supported Formats:** JPEG, PNG, WebP, GIF
- **Max Size:** 10MB per image
- **Gallery View:** Grid view of uploaded images in session

**Implementation:**
```typescript
// Upload to Firebase Storage
const uploadImage = async (file: File) => {
  const storageRef = storage.ref(`chatbot-gallery/${userId}/${sessionId}/${file.name}`);
  await storageRef.put(file);
  const url = await storageRef.getDownloadURL();
  return url;
};
```

#### **2.2 Vision AI Analysis**
- **Provider:** OpenAI Vision API (gpt-4-vision-preview)
- **Features:**
  - Image description
  - Text extraction (OCR)
  - Object detection
  - Scene understanding
  - Answer questions about images

**Use Cases:**
- "What's in this photo?"
- "Extract text from this document"
- "Describe this shelter layout"
- "Analyze this POD design"

**Cost:** ~$0.01 per image analysis

---

## 📚 **Phase 3: Knowledge Base (File Upload)**

### **Priority:** HIGH  
**Timeline:** SOON  
**Status:** 🟡 Planned

### **Features:**

#### **3.1 File Upload & Parsing**
- **Supported Formats:**
  - PDF documents
  - Word docs (.docx)
  - Text files (.txt, .md)
  - Excel spreadsheets (.xlsx)
  - PowerPoint (.pptx)

**Implementation:**
```python
# Backend processing
async def process_document(file_path: str, user_id: str):
    # Parse document
    text = extract_text(file_path)
    
    # Chunk into sections
    chunks = chunk_text(text, max_tokens=500)
    
    # Generate embeddings
    embeddings = await generate_embeddings(chunks)
    
    # Store in vector database
    await store_knowledge(embeddings, metadata={
        'user_id': user_id,
        'filename': filename,
        'upload_date': datetime.now()
    })
```

#### **3.2 Knowledge Base Management**
- **View:** List of uploaded documents
- **Search:** Search within documents
- **Delete:** Remove documents from KB
- **Access Control:** User-specific or org-wide

**Use Cases:**
- Upload shelter policies
- Add operational procedures
- Store compliance documents
- Reference manuals
- Training materials

---

## 🌐 **Phase 4: Web Search Integration**

### **Priority:** MEDIUM  
**Timeline:** LATER  
**Status:** 🟡 Planned

### **Features:**

#### **4.1 Real-Time Web Search**
- **Provider:** Perplexity AI or Tavily API
- **Features:**
  - Current events
  - News articles
  - Statistics
  - Real-time data
  - Source citations

**Implementation:**
```python
# Backend web search
async def search_web(query: str):
    response = await perplexity_api.search(
        query=query,
        search_domain_filter=["news", "government", "nonprofit"]
    )
    
    return {
        'answer': response.answer,
        'sources': response.sources,
        'citations': response.citations
    }
```

#### **4.2 When to Use Web Search**
**Automatic triggers:**
- Questions about recent events
- "What's the latest...?"
- "Current statistics on..."
- Date-specific queries

**Manual trigger:**
- User clicks "Web Search" button
- Agent determines need for current data

**Use Cases:**
- "Latest homelessness statistics"
- "Recent housing policy changes"
- "Current shelter capacity in [city]"
- "News about affordable housing"

**Cost:** ~$5/1000 queries

---

## 🎤 **Phase 5: Voice Input (Future)**

### **Priority:** LOW  
**Timeline:** FUTURE  
**Status:** ⚪ Backlog

### **Features:**

#### **5.1 Speech-to-Text**
- **Provider:** OpenAI Whisper API or Web Speech API
- **Languages:** Multi-language support
- **Real-time:** Streaming transcription

**Use Cases:**
- Hands-free messaging
- Mobile users
- Accessibility
- Note-taking

**Implementation:**
```typescript
// Browser Web Speech API (free)
const recognition = new webkitSpeechRecognition();
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setNewMessage(transcript);
};
```

---

## 📊 **Phase 6: Analytics & History (Future)**

### **Priority:** MEDIUM  
**Timeline:** FUTURE  
**Status:** ⚪ Backlog

### **Features:**

#### **6.1 Conversation History**
- **Search:** Full-text search across all messages
- **Filter:** By date, agent, keywords
- **Export:** Download conversation as PDF/JSON
- **Archive:** Move old conversations to archive

#### **6.2 Usage Analytics**
- **Metrics:**
  - Messages per day/week/month
  - Most used agents
  - Average response time
  - Token usage & costs
  - Session duration
  
- **Visualizations:**
  - Charts & graphs
  - Usage trends
  - Agent performance
  - Cost tracking

---

## 🎨 **Phase 7: Advanced Features (Future)**

### **Priority:** LOW  
**Timeline:** FUTURE  
**Status:** ⚪ Backlog

### **7.1 Multi-Modal Conversations**
- Images + Text in same message
- File attachments with questions
- Voice + Text hybrid

### **7.2 Collaboration**
- Share sessions with team
- Real-time co-chatting
- Session permissions

### **7.3 Custom Agents**
- User-created agents
- Custom instructions
- Fine-tuned models
- Agent templates

### **7.4 Integrations**
- Slack notifications
- Email summaries
- Calendar integration
- CRM sync

---

## 💰 **Cost Estimates**

### **Current Costs (Phase 1):**
- **OpenAI API:** ~$0.10/session (text only)
- **Firebase Storage:** Free tier (1GB)
- **Firestore:** Free tier (50k reads/day)

### **Phase 2 (Gallery + Vision):**
- **Vision API:** +$0.01 per image
- **Storage:** +$0.026/GB after free tier

### **Phase 3 (Knowledge Base):**
- **Embeddings:** ~$0.0001 per 1k tokens
- **Vector DB:** ~$10-50/month (Pinecone/Weaviate)

### **Phase 4 (Web Search):**
- **Perplexity API:** ~$5/1000 queries
- **Or Tavily:** ~$0.01 per search

### **Monthly Estimates:**
- **Current:** ~$20-50 (light usage)
- **With Gallery:** +$5-20
- **With KB:** +$10-50
- **With Web Search:** +$10-30
- **Total (All features):** ~$50-150/month

---

## 🛠️ **Implementation Priority Matrix**

| Feature | Impact | Effort | Priority | Timeline |
|---------|--------|--------|----------|----------|
| **Gallery Upload** | HIGH | MEDIUM | HIGH | SOON |
| **Vision AI** | HIGH | LOW | HIGH | SOON |
| **File Upload** | HIGH | MEDIUM | HIGH | SOON |
| **KB Processing** | HIGH | HIGH | MEDIUM | LATER |
| **Web Search** | MEDIUM | LOW | MEDIUM | LATER |
| **Voice Input** | LOW | MEDIUM | LOW | FUTURE |
| **Analytics** | MEDIUM | HIGH | MEDIUM | FUTURE |
| **History Search** | MEDIUM | MEDIUM | MEDIUM | FUTURE |

---

## 📋 **Next Session Tasks**

### **Immediate (This Week):**
1. ✅ UI cleanup (DONE)
2. 🔜 Gallery button: Add file input
3. 🔜 Gallery: Upload to Firebase Storage
4. 🔜 Gallery: Display uploaded images
5. 🔜 Vision AI: Integrate gpt-4-vision

### **Soon (Next Week):**
6. 🔜 Knowledge button: Add file input
7. 🔜 Knowledge: Parse PDF/DOCX
8. 🔜 Knowledge: Generate embeddings
9. 🔜 Knowledge: Store in vector DB
10. 🔜 Web Search: Integrate API

---

## 🎯 **Success Criteria**

### **Phase 2 (Gallery):**
- ✅ Users can upload images
- ✅ Images stored in Firebase Storage
- ✅ AI can "see" and describe images
- ✅ Images persist in session history

### **Phase 3 (Knowledge Base):**
- ✅ Users can upload documents
- ✅ Text extracted and processed
- ✅ AI can reference uploaded docs
- ✅ Search works across documents

### **Phase 4 (Web Search):**
- ✅ Real-time web data retrieved
- ✅ Sources cited in responses
- ✅ Accurate current information
- ✅ Cost-effective implementation

---

**Last Updated:** October 15, 2025  
**Next Review:** After Phase 2 Implementation

