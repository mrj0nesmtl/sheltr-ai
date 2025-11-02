# 🔥 SHELTR-AI Firestore Data Transfer Optimization Guide

**CRITICAL FINDING**: Gemini Cloud Assist identified Firestore data egress as the PRIMARY cost driver

## Executive Summary

| Metric | Value |
|--------|-------|
| **October Firestore Egress** | $57.08 CAD |
| **Increase vs September** | 588% (5.8x) |
| **Percentage of Total Bill** | 58% of $98.66 |
| **Root Cause** | Knowledge Base + RAG system data transfers |
| **Optimization Potential** | 50-70% reduction ($28-40/month savings) |

---

## 🚨 The Real Problem (Revealed by Gemini)

### What We Initially Thought
- App Engine charges: $89.48
- Artifact Registry storage: $42.87
- Cloud Build costs: $12.08

### What Gemini Actually Found
```
App Engine: $75.58
  └─ SKU: Cloud Firestore Internet Data Transfer Out
     └─ Cost: $57.08 (588% increase!)
     └─ Region: northamerica-northeast1 → Americas
```

**Translation**: The "App Engine" charge is actually **Firestore data egress** being classified under App Engine SKU.

---

## 📊 Actual October 2025 Cost Breakdown

| Service | Cost | % of Total | Issue |
|---------|------|------------|-------|
| **Firestore Data Transfer** | $57.08 | **58%** | 🔴 **PRIMARY ISSUE** |
| **Other App Engine** | $18.50 | 19% | Secondary |
| **Artifact Registry** | $12.68 | 13% | Old images |
| **Cloud Build** | $6.13 | 6% | Build machine size |
| **Secret Manager** | $3.59 | 4% | API key versions |
| **Cloud Run** | $1.58 | 2% | Runtime (minimal) |
| **Other** | $0.68 | <1% | Negligible |
| **TOTAL** | **$98.66** | 100% | |

---

## 🔍 Why Firestore Data Transfer Spiked in October

### Root Cause Analysis

**October Activities:**
1. ✅ Built Knowledge Base system with 13 documents
2. ✅ Implemented RAG (Retrieval Augmented Generation) for chatbot
3. ✅ Generated OpenAI embeddings for all documents
4. ✅ AI chatbot queries documents on every user interaction
5. ✅ Testing and development with frequent document retrievals

**Data Transfer Pattern:**
```
User Query → Chatbot → Firestore (fetch documents) → OpenAI (embeddings) → Response
     ↓
Each query transfers:
- Document content (text)
- Embeddings (vector data)
- Metadata
- Related documents
```

**Estimated Transfer Volume:**
- 13 documents × ~50KB each = 650KB per full retrieval
- If queried 1000 times/month = 650MB
- Firestore egress pricing: ~$0.12/GB (Americas → Americas)
- But $57.08 suggests **much higher volume** (475GB!)

---

## 💡 Optimization Strategy

### Phase 1: Immediate Wins (This Week)

#### 1.1 Implement Response Caching (HIGH IMPACT)

**Problem**: Every chatbot query fetches documents from Firestore
**Solution**: Cache frequently accessed documents

**Backend Implementation** (`apps/api/services/knowledge_base_service.py`):

```python
from functools import lru_cache
from datetime import datetime, timedelta
import hashlib

# In-memory cache with TTL
_cache = {}
_cache_ttl = {}
CACHE_DURATION = 3600  # 1 hour

def get_cached_document(doc_id: str):
    """Get document from cache or Firestore"""
    now = datetime.now()
    
    # Check if cached and not expired
    if doc_id in _cache and doc_id in _cache_ttl:
        if now < _cache_ttl[doc_id]:
            print(f"✅ Cache HIT: {doc_id}")
            return _cache[doc_id]
    
    # Cache miss - fetch from Firestore
    print(f"❌ Cache MISS: {doc_id} - Fetching from Firestore")
    doc = fetch_from_firestore(doc_id)
    
    # Store in cache
    _cache[doc_id] = doc
    _cache_ttl[doc_id] = now + timedelta(seconds=CACHE_DURATION)
    
    return doc

def fetch_from_firestore(doc_id: str):
    """Actual Firestore fetch"""
    from firebase_admin import firestore
    db = firestore.client()
    doc_ref = db.collection('knowledge_base').document(doc_id)
    return doc_ref.get().to_dict()
```

**Expected Savings**: 60-80% reduction in Firestore reads = **-$34-45/month**

---

#### 1.2 Add HTTP Caching Headers (MEDIUM IMPACT)

**Problem**: Frontend re-fetches same data repeatedly
**Solution**: Add cache-control headers to API responses

**Update Cloud Run Deployment** (`deploy.sh` around line 122):

```bash
gcloud run deploy sheltr-api \
  --image gcr.io/sheltr-ai/sheltr-api:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --min-instances 0 \
  --timeout 300 \
  --service-account firebase-adminsdk-fbsvc@sheltr-ai.iam.gserviceaccount.com \
  --set-env-vars="CACHE_CONTROL_MAX_AGE=3600" \  # ADD THIS
  # ... rest of config
```

**Backend Implementation** (`apps/api/main.py`):

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os

app = FastAPI()

CACHE_MAX_AGE = int(os.getenv("CACHE_CONTROL_MAX_AGE", "3600"))

@app.middleware("http")
async def add_cache_headers(request, call_next):
    response = await call_next(request)
    
    # Add caching for knowledge base endpoints
    if "/api/knowledge-base" in request.url.path:
        response.headers["Cache-Control"] = f"public, max-age={CACHE_MAX_AGE}"
        response.headers["Vary"] = "Accept-Encoding"
    
    return response
```

**Expected Savings**: 20-30% reduction = **-$11-17/month**

---

#### 1.3 Compress Firestore Responses (MEDIUM IMPACT)

**Problem**: Sending uncompressed JSON over the wire
**Solution**: Enable gzip compression

**Backend Implementation** (`apps/api/main.py`):

```python
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()

# Add gzip compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)  # Compress responses > 1KB
```

**Expected Savings**: 30-40% reduction in transfer size = **-$17-23/month**

---

#### 1.4 Batch Document Queries (HIGH IMPACT)

**Problem**: Fetching documents one-by-one
**Solution**: Batch queries to reduce round trips

**Before** (Inefficient):
```python
async def get_related_documents(query: str):
    results = []
    for doc_id in related_doc_ids:
        doc = db.collection('knowledge_base').document(doc_id).get()
        results.append(doc.to_dict())
    return results
```

**After** (Optimized):
```python
async def get_related_documents(query: str):
    # Batch get (single Firestore call)
    doc_refs = [
        db.collection('knowledge_base').document(doc_id) 
        for doc_id in related_doc_ids
    ]
    docs = db.get_all(doc_refs)  # Single batch request
    return [doc.to_dict() for doc in docs]
```

**Expected Savings**: 40-50% reduction in queries = **-$23-28/month**

---

### Phase 2: Strategic Optimization (Next Week)

#### 2.1 Implement Redis Cache Layer

**Problem**: In-memory cache doesn't persist across Cloud Run instances
**Solution**: Use Redis (Google Cloud Memorystore)

**Setup Redis**:
```bash
# Create Redis instance
gcloud redis instances create sheltr-cache \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=basic

# Get connection info
gcloud redis instances describe sheltr-cache --region=us-central1
```

**Backend Implementation**:
```python
import redis
import json
import os

# Connect to Redis
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST'),
    port=6379,
    decode_responses=True
)

def get_document_cached(doc_id: str):
    """Get from Redis cache or Firestore"""
    # Try Redis first
    cached = redis_client.get(f"doc:{doc_id}")
    if cached:
        print(f"✅ Redis HIT: {doc_id}")
        return json.loads(cached)
    
    # Fetch from Firestore
    print(f"❌ Redis MISS: {doc_id}")
    doc = fetch_from_firestore(doc_id)
    
    # Store in Redis (1 hour TTL)
    redis_client.setex(
        f"doc:{doc_id}",
        3600,
        json.dumps(doc)
    )
    
    return doc
```

**Cost**: Redis Basic 1GB = ~$35/month
**Savings**: -$40-50/month in Firestore egress
**Net Savings**: -$5-15/month (plus better performance)

---

#### 2.2 Optimize RAG Query Strategy

**Problem**: Fetching entire documents for every query
**Solution**: Store embeddings separately, fetch only relevant chunks

**Current Architecture**:
```
User Query → Fetch ALL 13 documents → Generate embeddings → Find matches → Return
```

**Optimized Architecture**:
```
User Query → Query pre-computed embeddings → Fetch ONLY matched chunks → Return
```

**Implementation**:

1. **Store embeddings in separate collection**:
```python
# Structure
knowledge_base_embeddings/
  └─ {doc_id}/
     └─ chunks/
        ├─ chunk_0: {text, embedding, metadata}
        ├─ chunk_1: {text, embedding, metadata}
        └─ chunk_2: {text, embedding, metadata}
```

2. **Query only relevant chunks**:
```python
async def query_knowledge_base(user_query: str, top_k: int = 3):
    # Generate query embedding (OpenAI)
    query_embedding = await get_embedding(user_query)
    
    # Find similar chunks (vector search)
    # Only fetch top 3 chunks instead of all 13 documents
    similar_chunks = await vector_search(query_embedding, top_k=top_k)
    
    return similar_chunks  # Much smaller data transfer!
```

**Expected Savings**: 70-80% reduction = **-$40-45/month**

---

#### 2.3 Implement Document Pagination

**Problem**: Loading all documents at once in admin interfaces
**Solution**: Paginate document lists

**Before**:
```typescript
// Frontend: apps/web/src/app/portal/founders-only/page.tsx
const loadDynamicDocuments = async () => {
  const snapshot = await getDocs(
    query(collection(db, 'knowledge_base'))
  );
  // Loads ALL documents
};
```

**After**:
```typescript
const loadDynamicDocuments = async (pageSize = 10) => {
  const snapshot = await getDocs(
    query(
      collection(db, 'knowledge_base'),
      limit(pageSize)  // Only load 10 at a time
    )
  );
};
```

**Expected Savings**: 50% reduction in admin panel loads = **-$5-8/month**

---

### Phase 3: Advanced Optimization (Week 3+)

#### 3.1 Implement CDN for Static Documents

**Problem**: Serving documents directly from Firestore
**Solution**: Export static documents to Cloud Storage + CDN

**Setup**:
```bash
# Create Cloud Storage bucket
gsutil mb -l us-central1 gs://sheltr-knowledge-base-cdn/

# Enable CDN
gcloud compute backend-buckets create sheltr-kb-cdn \
  --gcs-bucket-name=sheltr-knowledge-base-cdn \
  --enable-cdn
```

**Export Script**:
```python
# scripts/export-kb-to-cdn.py
from firebase_admin import firestore
from google.cloud import storage
import json

db = firestore.client()
storage_client = storage.Client()
bucket = storage_client.bucket('sheltr-knowledge-base-cdn')

# Export all documents
docs = db.collection('knowledge_base').stream()
for doc in docs:
    data = doc.to_dict()
    
    # Upload to Cloud Storage
    blob = bucket.blob(f'documents/{doc.id}.json')
    blob.upload_from_string(
        json.dumps(data),
        content_type='application/json'
    )
    blob.cache_control = 'public, max-age=3600'
    
    print(f"✅ Exported: {doc.id}")
```

**Expected Savings**: 80-90% reduction for public docs = **-$15-20/month**

---

#### 3.2 Optimize Embedding Storage

**Problem**: Storing large embedding vectors in Firestore
**Solution**: Use Cloud Storage for embeddings

**Current**: Embeddings in Firestore (expensive egress)
**Optimized**: Embeddings in Cloud Storage (cheaper egress)

**Migration**:
```python
# Store embeddings in Cloud Storage
def store_embedding(doc_id: str, embedding: list):
    storage_client = storage.Client()
    bucket = storage_client.bucket('sheltr-embeddings')
    
    blob = bucket.blob(f'embeddings/{doc_id}.json')
    blob.upload_from_string(json.dumps(embedding))
    
    # Store only reference in Firestore
    db.collection('knowledge_base').document(doc_id).update({
        'embedding_url': f'gs://sheltr-embeddings/embeddings/{doc_id}.json'
    })
```

**Cost Comparison**:
- Firestore egress: $0.12/GB (Americas → Americas)
- Cloud Storage egress: $0.01/GB (same region)
- **Savings**: 92% cheaper = **-$20-25/month**

---

## 📊 Expected Savings Summary

| Phase | Optimization | Effort | Savings | Timeline |
|-------|-------------|--------|---------|----------|
| **Phase 1** | Response caching | LOW | -$34-45 | This week |
| **Phase 1** | HTTP cache headers | LOW | -$11-17 | This week |
| **Phase 1** | Gzip compression | LOW | -$17-23 | This week |
| **Phase 1** | Batch queries | MEDIUM | -$23-28 | This week |
| **Phase 2** | Redis cache | MEDIUM | -$5-15 | Week 2 |
| **Phase 2** | RAG optimization | HIGH | -$40-45 | Week 2-3 |
| **Phase 2** | Pagination | LOW | -$5-8 | Week 2 |
| **Phase 3** | CDN for static docs | MEDIUM | -$15-20 | Week 3+ |
| **Phase 3** | Embedding storage | HIGH | -$20-25 | Week 3+ |
| **TOTAL** | | | **-$170-226** | 3 weeks |

**Realistic Target**: -$50-70/month (60-80% reduction in Firestore costs)

---

## 🚀 Implementation Roadmap

### Week 1: Quick Wins (Days 1-7)

**Monday-Tuesday**:
- [ ] Implement in-memory caching (`knowledge_base_service.py`)
- [ ] Add HTTP cache headers (`main.py`)
- [ ] Enable gzip compression (`main.py`)
- [ ] Test caching locally

**Wednesday-Thursday**:
- [ ] Implement batch queries
- [ ] Update RAG system to use cache
- [ ] Deploy to production
- [ ] Monitor cache hit rates

**Friday**:
- [ ] Review logs and metrics
- [ ] Adjust cache TTL if needed
- [ ] Document changes

**Expected Impact**: -$60-80/month (Phase 1 complete)

---

### Week 2: Strategic Optimization (Days 8-14)

**Monday-Tuesday**:
- [ ] Set up Redis (Cloud Memorystore)
- [ ] Migrate caching to Redis
- [ ] Test Redis performance

**Wednesday-Friday**:
- [ ] Optimize RAG query strategy
- [ ] Implement document pagination
- [ ] Deploy and monitor

**Expected Impact**: Additional -$50-70/month (Phase 2 complete)

---

### Week 3+: Advanced Optimization (Days 15+)

**As needed**:
- [ ] Set up CDN for static documents
- [ ] Migrate embeddings to Cloud Storage
- [ ] Implement vector database (Pinecone/Weaviate)
- [ ] Fine-tune caching strategies

**Expected Impact**: Additional -$35-45/month (Phase 3 complete)

---

## 📈 Monitoring & Verification

### Key Metrics to Track

**Firestore Console** (https://console.firebase.google.com/project/sheltr-ai/firestore):
- Document reads per day
- Data egress (GB/day)
- Query patterns

**Cloud Billing** (https://console.cloud.google.com/billing):
- App Engine costs (Firestore egress)
- Daily spending trends
- Cost anomalies

**Application Logs**:
```python
# Add logging to track cache performance
import logging

logger = logging.getLogger(__name__)

def get_cached_document(doc_id: str):
    if doc_id in _cache:
        logger.info(f"Cache HIT: {doc_id}")
        # Track cache hit rate
    else:
        logger.info(f"Cache MISS: {doc_id}")
        # Track cache miss rate
```

**Target Metrics**:
- Cache hit rate: >80%
- Firestore reads: <1000/day (down from ~5000/day)
- Data egress: <10GB/month (down from ~475GB/month)
- November bill: <$50 CAD (down from $98.66)

---

## 🔧 Code Implementation Examples

### Complete Caching Service

Create: `apps/api/services/cache_service.py`

```python
"""
SHELTR-AI Caching Service
Reduces Firestore data transfer costs by caching frequently accessed documents
"""

from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from functools import wraps
import hashlib
import json
import logging

logger = logging.getLogger(__name__)

class CacheService:
    """In-memory cache with TTL for Firestore documents"""
    
    def __init__(self, default_ttl: int = 3600):
        self._cache: Dict[str, Any] = {}
        self._cache_ttl: Dict[str, datetime] = {}
        self._default_ttl = default_ttl
        self._hits = 0
        self._misses = 0
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        now = datetime.now()
        
        # Check if cached and not expired
        if key in self._cache and key in self._cache_ttl:
            if now < self._cache_ttl[key]:
                self._hits += 1
                logger.info(f"✅ Cache HIT: {key} (hit rate: {self.hit_rate:.1%})")
                return self._cache[key]
            else:
                # Expired - remove from cache
                del self._cache[key]
                del self._cache_ttl[key]
        
        self._misses += 1
        logger.info(f"❌ Cache MISS: {key} (hit rate: {self.hit_rate:.1%})")
        return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """Set value in cache with TTL"""
        ttl = ttl or self._default_ttl
        self._cache[key] = value
        self._cache_ttl[key] = datetime.now() + timedelta(seconds=ttl)
        logger.debug(f"📦 Cached: {key} (TTL: {ttl}s)")
    
    def invalidate(self, key: str):
        """Remove key from cache"""
        if key in self._cache:
            del self._cache[key]
            del self._cache_ttl[key]
            logger.info(f"🗑️  Invalidated: {key}")
    
    def clear(self):
        """Clear entire cache"""
        self._cache.clear()
        self._cache_ttl.clear()
        self._hits = 0
        self._misses = 0
        logger.info("🧹 Cache cleared")
    
    @property
    def hit_rate(self) -> float:
        """Calculate cache hit rate"""
        total = self._hits + self._misses
        return self._hits / total if total > 0 else 0.0
    
    @property
    def stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return {
            'hits': self._hits,
            'misses': self._misses,
            'hit_rate': self.hit_rate,
            'size': len(self._cache),
            'keys': list(self._cache.keys())
        }

# Global cache instance
cache = CacheService(default_ttl=3600)  # 1 hour default

def cached(ttl: int = 3600, key_prefix: str = ""):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{hashlib.md5(str(args).encode() + str(kwargs).encode()).hexdigest()}"
            
            # Try cache first
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            # Cache miss - call function
            result = await func(*args, **kwargs)
            
            # Store in cache
            cache.set(cache_key, result, ttl=ttl)
            
            return result
        return wrapper
    return decorator
```

### Updated Knowledge Base Service

Update: `apps/api/services/knowledge_base_service.py`

```python
from firebase_admin import firestore
from .cache_service import cache, cached
import logging

logger = logging.getLogger(__name__)
db = firestore.client()

@cached(ttl=3600, key_prefix="kb")
async def get_document(doc_id: str):
    """Get document from Firestore (with caching)"""
    logger.info(f"Fetching document from Firestore: {doc_id}")
    doc_ref = db.collection('knowledge_base').document(doc_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        return None
    
    return doc.to_dict()

@cached(ttl=1800, key_prefix="kb_search")
async def search_documents(query: str, limit: int = 10):
    """Search documents (with caching)"""
    logger.info(f"Searching documents: {query}")
    
    # Perform search
    results = db.collection('knowledge_base')\
        .where('published', '==', True)\
        .limit(limit)\
        .stream()
    
    return [doc.to_dict() for doc in results]

async def get_documents_batch(doc_ids: list):
    """Get multiple documents in a single batch request"""
    # Check cache first
    cached_docs = {}
    uncached_ids = []
    
    for doc_id in doc_ids:
        cached = cache.get(f"kb:get_document:{doc_id}")
        if cached:
            cached_docs[doc_id] = cached
        else:
            uncached_ids.append(doc_id)
    
    # Fetch uncached documents in batch
    if uncached_ids:
        logger.info(f"Batch fetching {len(uncached_ids)} documents from Firestore")
        doc_refs = [
            db.collection('knowledge_base').document(doc_id)
            for doc_id in uncached_ids
        ]
        docs = db.get_all(doc_refs)
        
        # Cache fetched documents
        for doc in docs:
            if doc.exists:
                data = doc.to_dict()
                cache.set(f"kb:get_document:{doc.id}", data, ttl=3600)
                cached_docs[doc.id] = data
    
    return cached_docs

def invalidate_document_cache(doc_id: str):
    """Invalidate cache when document is updated"""
    cache.invalidate(f"kb:get_document:{doc_id}")
    logger.info(f"Invalidated cache for document: {doc_id}")
```

### Cache Statistics Endpoint

Add to: `apps/api/routers/admin.py`

```python
from fastapi import APIRouter, Depends
from ..services.cache_service import cache
from ..middleware.auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/cache/stats")
async def get_cache_stats(current_user = Depends(require_admin)):
    """Get cache statistics (admin only)"""
    return cache.stats

@router.post("/cache/clear")
async def clear_cache(current_user = Depends(require_admin)):
    """Clear cache (admin only)"""
    cache.clear()
    return {"message": "Cache cleared successfully"}
```

---

## 🎯 Success Criteria

### Phase 1 Complete When:
- [ ] Cache hit rate >70%
- [ ] Firestore reads reduced by 50%
- [ ] Gzip compression enabled
- [ ] November bill shows <$70 CAD

### Phase 2 Complete When:
- [ ] Redis cache operational
- [ ] Cache hit rate >85%
- [ ] RAG system optimized
- [ ] November bill shows <$55 CAD

### Phase 3 Complete When:
- [ ] CDN serving static documents
- [ ] Embeddings in Cloud Storage
- [ ] Firestore egress <$20/month
- [ ] December bill shows <$45 CAD

---

## 📚 Additional Resources

### Firestore Best Practices
- [Firestore Pricing](https://firebase.google.com/docs/firestore/pricing)
- [Optimize Firestore Costs](https://firebase.google.com/docs/firestore/best-practices)
- [Firestore Data Transfer](https://cloud.google.com/firestore/pricing#data-transfer)

### Caching Strategies
- [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [FastAPI Caching](https://fastapi.tiangolo.com/advanced/custom-response/)

### Related Documentation
- [GCP Cost Optimization Guide](./gcp-cost-optimization.md)
- [Quick Start Guide](./GEMINI-COST-ANALYSIS-QUICKSTART.md)
- [Cloud Run Documentation](./google-cloud-run.md)

---

**Document Owner**: SHELTR DevOps Team
**Last Updated**: November 2, 2025
**Next Review**: November 15, 2025 (after Phase 1 implementation)
**Status**: 🔴 CRITICAL - Implement Phase 1 immediately

