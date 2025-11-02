# 📄 Feature: Publish to Public Docs Hub

**Feature Name**: Public Documentation Publisher  
**Date**: October 30, 2025  
**Status**: Planning  
**Priority**: High  
**Estimated Time**: 3-4 hours  

---

## 🎯 **GOAL:**

Enable Knowledge Base admins to **publish documents directly to the public docs hub** with a single toggle, automatically generating:
- Public document card on `/docs`
- Individual document page at `/docs/[slug]`
- Auto-generated metadata and formatting

---

## 📊 **CURRENT STATE:**

### **Public Docs Hub** (`/docs`)
- **Location**: `apps/web/src/app/docs/page.tsx`
- **Documents**: 15 manually created entries
- **Structure**: Hardcoded `coreDocuments` array
- **Manual Process**: 
  1. Add entry to `coreDocuments` array
  2. Create individual page component
  3. Update GitHub links
  4. Deploy

**Problem**: Time-consuming, error-prone, requires developer intervention

### **Knowledge Base**
- **Location**: `apps/web/src/app/dashboard/knowledge`
- **Documents**: 100+ documents in Firestore
- **Current Fields**:
  - `title`, `content`, `category`, `tags`
  - `status`, `is_live`, `confidentiality_level`
  - `sharing_level`, `access_roles`
- **Edit Page**: `apps/web/src/app/dashboard/knowledge/edit/page.tsx`

---

## 🎨 **PROPOSED SOLUTION:**

### **1. Add "Publish to Public Docs Hub" Toggle**

**Location**: Knowledge Base Edit Page (`/dashboard/knowledge/edit`)

**New Field in Form**:
```typescript
publish_to_docs_hub: boolean
```

**UI Element**:
```tsx
<div className="flex items-center justify-between">
  <div>
    <Label>Publish to Public Docs Hub</Label>
    <p className="text-sm text-muted-foreground">
      Make this document visible on the public documentation page
    </p>
  </div>
  <Switch 
    checked={formData.publish_to_docs_hub}
    onCheckedChange={(checked) => 
      setFormData({...formData, publish_to_docs_hub: checked})
    }
  />
</div>
```

---

### **2. Auto-Generate Public Document Metadata**

**New Firestore Collection**: `public_docs_hub`

**Document Structure**:
```typescript
interface PublicDocHubDocument {
  id: string;
  knowledge_base_id: string;  // Link to KB document
  
  // Display Data
  title: string;
  description: string;  // Auto-generated from first 150 chars
  slug: string;  // Auto-generated from title
  icon: string;  // Auto-detect from category
  badge: string;
  badgeColor: string;
  category: string;  // platform, architecture, features, technical, development, guides
  
  // Content
  content: string;  // Markdown content
  audience: string;  // Auto-generated or manual
  topics: string[];  // Auto-generated from tags/content
  
  // Links
  link: string;  // /docs/[slug]
  github_path?: string;  // If synced from GitHub
  downloadLink?: string;  // GitHub raw URL
  
  // Metadata
  lastUpdated: string;
  published_at: string;
  published_by: string;
  view_count: number;
  
  // Status
  is_active: boolean;
  sort_order: number;
}
```

---

### **3. Auto-Generate Individual Doc Page**

**Dynamic Route**: `apps/web/src/app/docs/[slug]/page.tsx`

**Behavior**:
- Fetch document from `public_docs_hub` by slug
- Render markdown content
- Display metadata (audience, topics, updated date)
- Show GitHub link (if available)
- Track views

---

## 🏗️ **IMPLEMENTATION PLAN:**

### **Phase 1: Backend (1-1.5 hours)**

#### **A. Update Knowledge Base Service**

**File**: `apps/api/services/knowledge_dashboard_service.py`

```python
async def publish_to_docs_hub(self, document_id: str, user_id: str) -> Dict[str, Any]:
    """Publish a knowledge base document to public docs hub"""
    
    # 1. Get KB document
    kb_doc = await self.get_knowledge_document(document_id)
    
    # 2. Generate slug
    slug = generate_slug(kb_doc['title'])
    
    # 3. Auto-generate metadata
    description = extract_description(kb_doc['content'])  # First 150 chars
    audience = auto_detect_audience(kb_doc['category'], kb_doc['tags'])
    topics = auto_extract_topics(kb_doc['content'], kb_doc['tags'])
    icon_name = auto_select_icon(kb_doc['category'])
    badge_info = auto_generate_badge(kb_doc['category'], kb_doc['status'])
    
    # 4. Create public doc hub entry
    public_doc = {
        'knowledge_base_id': document_id,
        'title': kb_doc['title'],
        'description': description,
        'slug': slug,
        'icon': icon_name,
        'badge': badge_info['label'],
        'badgeColor': badge_info['color'],
        'category': map_category_to_public(kb_doc['category']),
        'content': kb_doc['content'],
        'audience': audience,
        'topics': topics[:5],  # Top 5 topics
        'link': f'/docs/{slug}',
        'github_path': kb_doc.get('github_path'),
        'downloadLink': generate_github_link(kb_doc.get('github_path')),
        'lastUpdated': kb_doc.get('updated_at'),
        'published_at': datetime.utcnow(),
        'published_by': user_id,
        'view_count': 0,
        'is_active': True,
        'sort_order': 999  # Add to end
    }
    
    # 5. Save to public_docs_hub collection
    doc_ref = self.db.collection('public_docs_hub').document(slug)
    await doc_ref.set(public_doc)
    
    # 6. Update KB document
    await self.update_knowledge_document(document_id, {
        'publish_to_docs_hub': True,
        'public_doc_slug': slug
    })
    
    return {'success': True, 'slug': slug, 'link': f'/docs/{slug}'}

async def unpublish_from_docs_hub(self, document_id: str) -> Dict[str, Any]:
    """Remove document from public docs hub"""
    
    kb_doc = await self.get_knowledge_document(document_id)
    slug = kb_doc.get('public_doc_slug')
    
    if slug:
        # Remove from public collection
        await self.db.collection('public_docs_hub').document(slug).delete()
        
        # Update KB document
        await self.update_knowledge_document(document_id, {
            'publish_to_docs_hub': False,
            'public_doc_slug': None
        })
    
    return {'success': True}
```

**Helper Functions**:
```python
def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    return slug

def extract_description(content: str, max_length: int = 150) -> str:
    """Extract first paragraph as description"""
    # Remove markdown formatting
    text = re.sub(r'[#*`\[\]]', '', content)
    # Get first 150 chars
    desc = text[:max_length].rsplit(' ', 1)[0]
    return desc + '...' if len(text) > max_length else desc

def auto_detect_audience(category: str, tags: List[str]) -> str:
    """Auto-detect target audience based on category/tags"""
    audience_map = {
        'Platform': 'Executives • Impact Investors • Community Partners',
        'Architecture': 'Developers • System Architects • Technical Teams',
        'API': 'Developers • System Integrators • Technical Partners',
        'Features': 'Product Managers • UX Designers • Stakeholders',
        'Development': 'Developers • DevOps Engineers • Technical Teams',
        'Guides': 'End Users • Administrators • Support Staff'
    }
    return audience_map.get(category, 'General Audience')

def auto_extract_topics(content: str, tags: List[str]) -> List[str]:
    """Extract key topics from content and tags"""
    # Use tags as starting point
    topics = list(tags)[:3]
    
    # Extract from headings
    headings = re.findall(r'##\s+(.+)', content)
    topics.extend(headings[:2])
    
    return topics[:5]

def auto_select_icon(category: str) -> str:
    """Map category to Lucide icon name"""
    icon_map = {
        'Platform': 'Users',
        'Architecture': 'Building',
        'API': 'Code',
        'Features': 'Rocket',
        'Development': 'TreePine',
        'Guides': 'BookOpen',
        'Technical': 'Shield'
    }
    return icon_map.get(category, 'FileText')

def auto_generate_badge(category: str, status: str) -> Dict[str, str]:
    """Generate badge label and color"""
    if status == 'published':
        return {'label': 'Published', 'color': 'border-emerald-400 text-emerald-400'}
    
    badge_map = {
        'Platform': {'label': 'Strategic Vision', 'color': 'border-purple-400 text-purple-400'},
        'Architecture': {'label': 'Architecture', 'color': 'border-blue-400 text-blue-400'},
        'API': {'label': 'Technical', 'color': 'border-orange-400 text-orange-400'},
        'Features': {'label': 'Features', 'color': 'border-amber-400 text-amber-400'}
    }
    return badge_map.get(category, {'label': 'Documentation', 'color': 'border-gray-400 text-gray-400'})

def map_category_to_public(kb_category: str) -> str:
    """Map KB category to public docs hub category"""
    category_map = {
        'Platform': 'platform',
        'Architecture': 'architecture',
        'API': 'technical',
        'Development': 'development',
        'Features': 'features',
        'Documentation': 'guides'
    }
    return category_map.get(kb_category, 'platform')

def generate_github_link(github_path: str) -> str:
    """Generate GitHub raw file URL"""
    if not github_path:
        return None
    base_url = 'https://github.com/mrj0nesmtl/sheltr-ai/blob/main'
    return f'{base_url}/{github_path}'
```

---

#### **B. Add API Endpoints**

**File**: `apps/api/routers/knowledge_dashboard.py`

```python
@router.post("/documents/{document_id}/publish-to-docs-hub")
async def publish_to_docs_hub(
    document_id: str,
    current_user: Dict[str, Any] = Depends(require_admin_or_super())
):
    """Publish knowledge base document to public docs hub"""
    try:
        kb_service = KnowledgeDashboardService()
        result = await kb_service.publish_to_docs_hub(
            document_id=document_id,
            user_id=current_user.get('uid')
        )
        
        return {
            'success': True,
            'data': result,
            'message': f'Document published to /docs/{result["slug"]}'
        }
    except Exception as e:
        logger.error(f"Failed to publish document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/documents/{document_id}/unpublish-from-docs-hub")
async def unpublish_from_docs_hub(
    document_id: str,
    current_user: Dict[str, Any] = Depends(require_admin_or_super())
):
    """Remove document from public docs hub"""
    try:
        kb_service = KnowledgeDashboardService()
        result = await kb_service.unpublish_from_docs_hub(document_id)
        
        return {
            'success': True,
            'data': result,
            'message': 'Document removed from public docs hub'
        }
    except Exception as e:
        logger.error(f"Failed to unpublish document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/public-docs-hub")
async def get_public_docs_hub_documents():
    """Get all active public docs hub documents"""
    try:
        kb_service = KnowledgeDashboardService()
        docs = kb_service.db.collection('public_docs_hub')\
            .where('is_active', '==', True)\
            .order_by('sort_order')\
            .stream()
        
        documents = []
        for doc in docs:
            doc_data = doc.to_dict()
            doc_data['id'] = doc.id
            documents.append(doc_data)
        
        return {
            'success': True,
            'data': {'documents': documents, 'total': len(documents)}
        }
    except Exception as e:
        logger.error(f"Failed to get public docs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

---

### **Phase 2: Frontend - Edit Page (30 minutes)**

**File**: `apps/web/src/app/dashboard/knowledge/edit/page.tsx`

**Add to Form State**:
```typescript
const [formData, setFormData] = useState({
  // ... existing fields ...
  publish_to_docs_hub: false,
  public_doc_slug: '',
});
```

**Add to Form UI** (after `is_live` toggle):
```tsx
{/* Publish to Public Docs Hub */}
<div className="space-y-4 p-4 border rounded-lg bg-card">
  <div className="flex items-center justify-between">
    <div className="space-y-1">
      <Label htmlFor="publish_to_docs_hub" className="text-base font-semibold flex items-center gap-2">
        <Globe className="h-5 w-5 text-blue-500" />
        Publish to Public Docs Hub
      </Label>
      <p className="text-sm text-muted-foreground">
        Make this document visible on the public documentation page at{' '}
        <code className="text-xs bg-muted px-1 py-0.5 rounded">/docs</code>
      </p>
    </div>
    <Switch
      id="publish_to_docs_hub"
      checked={formData.publish_to_docs_hub}
      onCheckedChange={async (checked) => {
        if (checked) {
          // Publish to docs hub
          const response = await fetch(
            `/api/v1/knowledge-dashboard/documents/${documentId}/publish-to-docs-hub`,
            { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }
          );
          const data = await response.json();
          
          if (data.success) {
            setFormData({
              ...formData,
              publish_to_docs_hub: true,
              public_doc_slug: data.data.slug
            });
            toast.success(`Published to /docs/${data.data.slug}`);
          }
        } else {
          // Unpublish
          await fetch(
            `/api/v1/knowledge-dashboard/documents/${documentId}/unpublish-from-docs-hub`,
            { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }
          );
          setFormData({...formData, publish_to_docs_hub: false, public_doc_slug: ''});
          toast.success('Removed from public docs hub');
        }
      }}
    />
  </div>
  
  {/* Show link if published */}
  {formData.publish_to_docs_hub && formData.public_doc_slug && (
    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
      <CheckCircle className="h-4 w-4 text-blue-600" />
      <span className="text-sm text-blue-900 dark:text-blue-100">
        Published at:
      </span>
      <a
        href={`/docs/${formData.public_doc_slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-mono text-blue-600 hover:underline"
      >
        /docs/{formData.public_doc_slug}
      </a>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.open(`/docs/${formData.public_doc_slug}`, '_blank')}
      >
        <ExternalLink className="h-3 w-3" />
      </Button>
    </div>
  )}
</div>
```

---

### **Phase 3: Frontend - Public Docs Hub (1 hour)**

#### **A. Update Main Docs Page**

**File**: `apps/web/src/app/docs/page.tsx`

**Replace Hardcoded Array with API Fetch**:
```typescript
'use client';

import { useState, useEffect } from 'react';
// ... existing imports ...

export default function DocsHubPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadPublicDocs();
  }, []);
  
  const loadPublicDocs = async () => {
    try {
      const response = await fetch('/api/v1/knowledge-dashboard/public-docs-hub');
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data.documents);
      }
    } catch (error) {
      console.error('Error loading public docs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of component ...
  // Replace coreDocuments with documents state
}
```

---

#### **B. Create Dynamic Document Page**

**File**: `apps/web/src/app/docs/[slug]/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Download, ArrowLeft, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PublicDocPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDocument();
  }, [slug]);
  
  const loadDocument = async () => {
    try {
      const response = await fetch(`/api/v1/knowledge-dashboard/public-docs-hub`);
      const data = await response.json();
      
      if (data.success) {
        const doc = data.data.documents.find((d: any) => d.slug === slug);
        setDocument(doc);
        
        // Increment view count
        if (doc) {
          await fetch(`/api/v1/knowledge-dashboard/documents/${doc.knowledge_base_id}/increment-views`, {
            method: 'POST'
          });
        }
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;
  }
  
  if (!document) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
        <Link href="/docs">
          <Button>Back to Docs Hub</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <Link href="/docs">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documentation
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{document.title}</h1>
                <Badge className={document.badgeColor}>{document.badge}</Badge>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-3xl">
                {document.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{document.audience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {document.lastUpdated}</span>
                </div>
              </div>
              
              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {document.topics.map((topic: string, i: number) => (
                  <Badge key={i} variant="outline">{topic}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              {document.downloadLink && (
                <Link href={document.downloadLink} target="_blank">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {document.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
```

---

### **Phase 4: Polish & Enhancement (30 minutes)**

#### **A. Add Bulk Actions to Knowledge Base Dashboard**

**Option to publish multiple documents at once**:
```tsx
<Button onClick={handleBulkPublish}>
  <Globe className="h-4 w-4 mr-2" />
  Publish Selected to Docs Hub
</Button>
```

#### **B. Add Preview Mode**

**In edit page, add preview button**:
```tsx
<Button variant="outline" onClick={() => setShowPreview(true)}>
  <Eye className="h-4 w-4 mr-2" />
  Preview Public Page
</Button>
```

#### **C. Add Sort/Reorder Feature**

**Allow admins to reorder docs on public hub**:
- Drag & drop interface
- Update `sort_order` field

---

## 📊 **BENEFITS:**

| Before | After |
|--------|-------|
| Manual code changes | One-click publish |
| Developer required | Self-service for admins |
| ~30 minutes per doc | ~30 seconds per doc |
| Error-prone | Automated & consistent |
| Static metadata | Auto-generated |
| Deploy required | Instant live |

---

## ✅ **SUCCESS CRITERIA:**

1. ✅ Admin can toggle "Publish to Docs Hub" in KB edit page
2. ✅ Document appears on `/docs` within seconds
3. ✅ Individual page created at `/docs/[slug]`
4. ✅ Metadata auto-generated correctly
5. ✅ Can unpublish and remove from docs hub
6. ✅ View tracking works
7. ✅ Search/filters work on public hub

---

## 🧪 **TESTING PLAN:**

1. Publish new document from KB
2. Verify card appears on `/docs`
3. Click card, verify page loads
4. Check metadata accuracy
5. Unpublish, verify removal
6. Re-publish, verify slug persistence
7. Test search/filter with new docs

---

## 🚀 **FUTURE ENHANCEMENTS:**

### **Phase 5: Advanced Features**
- Custom metadata editor (override auto-generated)
- Schedule publishing (publish at specific time)
- Version history (track changes to published docs)
- Analytics dashboard (views, engagement)
- Related documents (auto-suggest)
- SEO optimization (meta tags, OG images)

### **Phase 6: AI-Powered**
- AI-generated descriptions
- AI-suggested topics/tags
- AI-detected audience
- AI content summarization

---

## 📝 **NOTES:**

- Uses Firestore `public_docs_hub` collection
- Maintains link to original KB document
- Can sync updates automatically
- Preserves GitHub links if synced
- Works with existing permission system

---

*Ready to implement! This will save hours of manual work and make the docs hub dynamic and maintainable!* 🎉

