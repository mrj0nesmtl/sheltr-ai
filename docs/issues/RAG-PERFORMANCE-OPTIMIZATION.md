# 🐌 RAG Performance Optimization - Semantic Search Bottleneck

**Date**: November 24, 2025, 5:45 AM EST  
**Priority**: HIGH  
**Status**: IDENTIFIED

---

## 📊 **Current Performance**

### **Successful RAG Query Timing (Nov 24, 10:44)**

| Step | Duration | Status | Details |
|------|----------|--------|---------|
| **Embeddings Generation** | 2s | ✅ Good | OpenAI API |
| **🐌 Semantic Search** | **41s** | ❌ TOO SLOW | Firestore + in-memory comparison |
| **Gemini Generation** | 5s | ✅ Good | Gemini 2.5 Flash |
| **Total** | **48.76s** | ❌ Too Long | User experience poor |

### **Target Performance**

| Step | Current | Target | Improvement Needed |
|------|---------|--------|-------------------|
| Embeddings | 2s | 2s | ✅ OK |
| **Semantic Search** | **41s** | **5-10s** | **4-8x faster** |
| Gemini | 5s | 5s | ✅ OK |
| **Total** | **48s** | **12-17s** | **3-4x faster** |

---

## 🔍 **Root Cause Analysis**

### **The Bottleneck: Semantic Search**

**File**: `apps/api/services/embeddings_service.py`  
**Function**: `semantic_search()` (lines 241-315)

**Current Process**:
```python
# Line 268: Get ALL chunks (up to 500)
chunks = chunks_query.limit(500).stream()

# Line 272-302: For EACH chunk (in memory, synchronously)
for chunk_doc in chunks:
    # 1. Get chunk data
    # 2. Check document access permissions (Firestore query)
    # 3. Get document category (another Firestore query)
    # 4. Calculate cosine similarity (CPU intensive)
    # 5. Filter by similarity threshold
```

**Problems**:
1. **Fetching 500 chunks** from Firestore (slow)
2. **Synchronous iteration** through all chunks
3. **Multiple Firestore queries** per chunk (access checks)
4. **In-memory similarity calculation** for all 500 chunks
5. **No caching** of document metadata

**Result**: 41 seconds to process 500 chunks

---

## 🚀 **Optimization Strategies**

### **Strategy 1: Vector Database (Best Long-Term)**
**Approach**: Use Vertex AI Vector Search or Pinecone
- Store embeddings in vector database
- Native similarity search (milliseconds)
- Automatic indexing and optimization

**Pros**:
- ✅ 100x faster (41s → 0.4s)
- ✅ Scales to millions of documents
- ✅ Built-in nearest neighbor search

**Cons**:
- ⚠️ Requires migration
- ⚠️ Additional service cost
- ⚠️ More complex setup

**Estimated Time**: 2-4 hours implementation

---

### **Strategy 2: Cache Document Metadata (Quick Win)**
**Approach**: Cache access levels and categories
- Cache document metadata in memory/Redis
- Avoid repeated Firestore queries
- Only fetch chunks for accessible documents

**Pros**:
- ✅ 2-3x faster (41s → 15-20s)
- ✅ Easy to implement (1 hour)
- ✅ No new dependencies

**Cons**:
- ⚠️ Still processes all chunks
- ⚠️ Memory usage increases

**Estimated Time**: 1 hour implementation

---

### **Strategy 3: Parallel Processing (Medium Win)**
**Approach**: Process chunks in parallel
- Use asyncio.gather() for concurrent processing
- Parallel Firestore queries
- Parallel similarity calculations

**Pros**:
- ✅ 3-4x faster (41s → 10-15s)
- ✅ Moderate effort (2-3 hours)
- ✅ Works with current architecture

**Cons**:
- ⚠️ More complex code
- ⚠️ Higher CPU usage

**Estimated Time**: 2-3 hours implementation

---

### **Strategy 4: Reduce Chunk Limit (Immediate Fix)**
**Approach**: Limit to 100 most recent chunks instead of 500
- Faster Firestore query
- Fewer similarity calculations
- Lower quality but much faster

**Pros**:
- ✅ 5x faster (41s → 8s)
- ✅ 5-minute fix
- ✅ Immediate improvement

**Cons**:
- ⚠️ May miss relevant older documents
- ⚠️ Lower search quality

**Estimated Time**: 5 minutes implementation

---

## 🎨 **UX Improvement: "Thinking" Indicator**

### **User Request**
> "Maybe in the widget the moment the orchestrator figures out that it's a RAG question we could add a thinking icon or notification in the conversation somewhere so that the user knows that it's thinking hard"

### **Implementation**

**Frontend Changes** (`apps/web/src/components/chatbot/PublicChatbot.tsx`):

```typescript
// 1. Add thinking state
const [isThinking, setIsThinking] = useState(false);
const [thinkingStage, setThinkingStage] = useState<string | null>(null);

// 2. Show thinking indicator
{isThinking && (
  <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span>{thinkingStage || "Thinking..."}</span>
  </div>
)}

// 3. Update stages
- "Analyzing your question..." (0-2s)
- "Searching knowledge base..." (2-43s) ← THE LONG ONE
- "Generating response..." (43-48s)
```

**Backend Changes** (Optional - Server-Sent Events):
- Stream progress updates to frontend
- "Searching knowledge base... (found 2 results)"
- "Generating detailed response..."

---

## 📋 **Recommended Implementation Plan**

### **Phase 1: Immediate (Tonight)** ✅
1. ✅ **Add "Thinking" Indicator** (15 minutes)
   - Show "Searching knowledge base..." message
   - Animate while waiting
   - User sees progress

### **Phase 2: Quick Win (Tomorrow)**
2. **Implement Strategy 2: Cache Metadata** (1 hour)
   - Cache document access levels
   - Reduce Firestore queries
   - 2-3x speed improvement (41s → 15-20s)

3. **Implement Strategy 4: Reduce Chunk Limit** (5 minutes)
   - Change limit from 500 → 200 chunks
   - Another 2x improvement (15-20s → 7-10s)
   - **Total: 41s → 7-10s (4x faster)**

### **Phase 3: Long-Term (Next Week)**
4. **Evaluate Vector Database** (research)
   - Vertex AI Vector Search vs Pinecone
   - Cost analysis
   - Migration plan
   - **Target: 41s → 0.5s (80x faster)**

---

## 🎯 **Expected Results**

### **With Phase 1 Only** (Tonight)
- Duration: Still 48s
- UX: ✅ Much better (user knows it's thinking)
- Cost: $0
- Time: 15 minutes

### **With Phase 1 + 2 + 3** (Tomorrow)
- Duration: ✅ 12-17s (3x faster)
- UX: ✅ Great with thinking indicator
- Cost: $0
- Time: 1 hour 15 minutes

### **With All Phases** (Next Week)
- Duration: ✅ 2-7s (7x faster)
- UX: ✅ Excellent
- Cost: ~$10-20/month (vector DB)
- Time: 2-4 hours

---

## 📝 **Technical Details**

### **Current Code Location**
```
apps/api/services/embeddings_service.py
Lines 241-315: semantic_search()
```

### **Slow Section**
```python
# Line 268-302: This loop takes 41 seconds
chunks = chunks_query.limit(500).stream()
for chunk_doc in chunks:
    chunk_data = chunk_doc.to_dict()
    document_id = chunk_data['document_id']
    
    # SLOW: Firestore query for each chunk
    if not await self._check_access_permission(document_id, user_role, shelter_id):
        continue
    
    # SLOW: Another Firestore query
    if categories:
        doc_category = await self._get_document_category(document_id)
        if doc_category not in categories:
            continue
    
    # SLOW: CPU-intensive similarity calculation
    similarity = self._cosine_similarity(
        query_embedding, 
        chunk_data['embedding']
    )
```

### **Optimization Targets**
1. **Reduce Firestore queries**: Cache document metadata
2. **Reduce chunk processing**: Lower limit or better indexing
3. **Parallel processing**: Use asyncio.gather()
4. **Vector database**: Native similarity search

---

## ✅ **Action Items**

- [ ] **Tonight**: Add "thinking" indicator to frontend
- [ ] **Tomorrow**: Implement metadata caching
- [ ] **Tomorrow**: Reduce chunk limit to 200
- [ ] **Next Week**: Research vector database options
- [ ] **Next Week**: Performance testing and benchmarking

---

**Created By**: AI Assistant  
**Date**: November 24, 2025, 5:45 AM EST  
**Priority**: HIGH  
**Estimated ROI**: High (better UX + faster responses)

