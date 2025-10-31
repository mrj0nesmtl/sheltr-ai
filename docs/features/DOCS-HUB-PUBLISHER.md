# 📚 Docs Hub Publisher Feature

## Overview

The **Docs Hub Publisher** is a comprehensive feature that allows administrators to dynamically publish Knowledge Base documents to the public documentation hub at `sheltr-ai.web.app/docs`. This eliminates the need for hardcoded document data and provides a seamless workflow for managing public documentation.

## Architecture

### Backend (Python/FastAPI)

#### Models (`apps/api/models/docs_hub.py`)
- **DocsHubSettings**: Configuration for publishing documents
- **DocsHubCard**: Card representation for docs hub listing
- **DocsHubDocument**: Full document with content for individual pages
- **PublishToHubRequest**: API request model
- Utility functions for slug generation, description extraction, and metadata parsing

####  API Endpoints (`apps/api/routers/knowledge_docs_hub.py`)
- `GET /api/knowledge/docs-hub` - List all published documents
- `GET /api/knowledge/docs-hub/{slug}` - Get document by slug
- `POST /api/knowledge/{id}/publish-to-hub` - Publish/unpublish document
- `GET /api/knowledge/docs-hub/check-slug/{slug}` - Check slug availability

### Frontend (Next.js/React/TypeScript)

#### Components
- **DocsHubPublisher** (`components/knowledge/DocsHubPublisher.tsx`)
  - UI for publishing documents from Knowledge Base
  - Slug validation and auto-generation
  - Badge, category, and order configuration
  - Permission checks and warnings

#### Services
- **docsHubService** (`services/docsHubService.ts`)
  - Type-safe API client for docs hub endpoints
  - Handles all HTTP communication with backend

#### Pages
- **Docs Hub** (`app/docs/page.tsx`)
  - Dynamic document listing
  - Search and category filtering
  - Loading and error states
  - Fetches from API instead of hardcoded data

- **Individual Doc Pages** (`app/docs/[slug]/page.tsx`)
  - Dynamic slug-based routing
  - Beautiful markdown rendering with syntax highlighting
  - View count tracking
  - GitHub integration
  - 404 error handling

## Features

### 1. Dynamic Publishing
- Toggle documents from private/internal to public via Knowledge Base edit panel
- Auto-generate URL-friendly slugs from document titles
- Slug collision detection and resolution

### 2. Metadata Management
- **Badge Types**: Strategic Vision, Architecture, Technical, Enterprise, etc.
- **Categories**: Core Documentation, Additional Resources
- **Display Order**: Control sort order on docs hub
- **Custom Descriptions**: Override auto-generated descriptions
- **Audience Tags**: Define target audience (e.g., "Developers", "CFOs")
- **Topic Tags**: Key topics covered in the document

### 3. Permission Integration
- Documents must have "Public" permission level to be published
- Automatic permission validation
- Warning alerts if document is not public

### 4. Real-time Updates
- Documents appear immediately after publishing
- Changes sync in real-time
- Can unpublish anytime
- View count tracked automatically

### 5. Search & Filtering
- Client-side search across titles, descriptions, badges, audience, and topics
- Category filtering (All, Core, Additional)
- Active filter indicators
- Empty state handling

### 6. SEO & Analytics
- View count tracking per document
- Last updated timestamps
- GitHub integration for edit links
- Breadcrumb navigation
- Responsive design

## User Workflow

### Publishing a Document

1. **Navigate to Knowledge Base**
   ```
   http://localhost:3000/dashboard/knowledge
   ```

2. **Open Document for Editing**
   - Click on any document card
   - Or use "Edit" button

3. **Set Permission to Public**
   - In the "Document Permissions" section
   - Select "Public" permission level
   - Save changes

4. **Configure Docs Hub Settings**
   - Scroll to "Public Documentation Hub" section
   - Toggle "Publish to Docs Hub" ON
   - Configure settings:
     * **URL Slug**: Auto-generated, can be customized
     * **Badge**: Select badge type (e.g., "Technical")
     * **Category**: Choose core or additional
     * **Display Order**: Lower numbers appear first (default: 999)
     * **Custom Description** (Optional): Override auto-generated text

5. **Save & Publish**
   - Click "Save & Publish" button
   - Document is immediately available

6. **View Published Document**
   - Click "View Live" button to see published page
   - Or navigate to: `http://localhost:3000/docs/{slug}`

### Unpublishing a Document

1. Open the document in Knowledge Base edit panel
2. In the "Public Documentation Hub" section
3. Toggle "Publish to Docs Hub" OFF
4. Click "Save Settings"
5. Document is removed from public docs hub

## Database Schema

### Firestore `knowledge_documents` Collection

New fields added for docs hub feature:

```typescript
{
  // Existing fields...
  
  // Docs Hub fields
  published_to_hub: boolean;
  hub_category: 'core' | 'additional';
  hub_badge: string;
  hub_order: number;
  hub_slug: string;
  hub_description?: string;
  hub_audience?: string[];
  hub_topics?: string[];
  hub_icon?: string;
  hub_updated_at?: Date;
}
```

## API Reference

### Get Published Documents

```http
GET /api/knowledge/docs-hub
```

**Response:**
```json
[
  {
    "id": "doc123",
    "title": "API Documentation",
    "description": "Comprehensive API reference...",
    "category": "core",
    "badge": "Technical",
    "link": "/docs/api-documentation",
    "github_link": "https://github.com/...",
    "updated": "October 31, 2025",
    "audience": ["Developers", "System Integrators"],
    "topics": ["REST API", "Authentication", "Rate Limiting"],
    "icon": "🔌",
    "order": 1
  }
]
```

### Get Document by Slug

```http
GET /api/knowledge/docs-hub/{slug}
```

**Response:**
```json
{
  "id": "doc123",
  "title": "API Documentation",
  "content": "# API Documentation\n\n...",
  "category": "core",
  "badge": "Technical",
  "slug": "api-documentation",
  "github_path": "docs/api/README.md",
  "updated_at": "2025-10-31T10:00:00Z",
  "audience": ["Developers"],
  "topics": ["REST API"],
  "view_count": 42
}
```

### Publish Document

```http
POST /api/knowledge/{document_id}/publish-to-hub
Content-Type: application/json

{
  "published_to_hub": true,
  "hub_category": "core",
  "hub_badge": "Technical",
  "hub_order": 1,
  "hub_slug": "api-documentation",
  "hub_description": "Custom description (optional)",
  "hub_audience": ["Developers", "Engineers"],
  "hub_topics": ["API", "Integration"],
  "hub_icon": "🔌"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document published to docs hub successfully",
  "data": {
    "document_id": "doc123",
    "slug": "api-documentation",
    "published": true,
    "link": "/docs/api-documentation"
  }
}
```

### Check Slug Availability

```http
GET /api/knowledge/docs-hub/check-slug/{slug}
```

**Response:**
```json
{
  "success": true,
  "slug": "api-documentation",
  "available": false,
  "message": "Slug is already in use"
}
```

## UI Components

### DocsHubPublisher Component

**Props:**
```typescript
interface DocsHubPublisherProps {
  documentId?: string;
  documentTitle: string;
  currentSettings: DocsHubSettings;
  permissionLevel: string;
  onSave: (settings: DocsHubSettings) => Promise<void>;
  isLoading?: boolean;
}
```

**Usage:**
```tsx
<DocsHubPublisher
  documentId={documentId}
  documentTitle={formData.title}
  currentSettings={docsHubSettings}
  permissionLevel={permissionSettings.permission_level}
  onSave={async (settings) => {
    await docsHubService.publishDocument(documentId, settings);
    setDocsHubSettings(settings);
  }}
  isLoading={loading || saving}
/>
```

## Utility Functions

### Slug Generation

```python
def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    # Convert to lowercase
    # Remove special characters
    # Replace spaces with hyphens
    # Limit to 100 characters
    return slug
```

### Description Extraction

```python
def extract_description(content: str, max_length: int = 200) -> str:
    """Extract description from document content"""
    # Find first non-heading paragraph
    # Clean markdown formatting
    # Truncate to max length
    return description
```

### Audience Extraction

```python
def extract_audience_from_content(content: str) -> List[str]:
    """Extract target audience from content"""
    # Look for audience section
    # Parse bullet points
    # Fallback to common roles
    return audience
```

## Security Considerations

1. **Permission Validation**: Documents must be "Public" to publish
2. **Slug Collision**: Automatic detection and resolution
3. **Input Validation**: Slug pattern enforcement (lowercase, alphanumeric, hyphens)
4. **Content Sanitization**: Markdown rendering with security
5. **Rate Limiting**: Applied to public endpoints (future enhancement)

## Performance Optimizations

1. **Client-side Filtering**: Search and category filters don't hit API
2. **Lazy Loading**: Individual documents loaded on-demand
3. **View Count Caching**: Incremented on view, not real-time
4. **Static Generation**: Can be pre-rendered at build time (future)

## Testing

### Manual Testing Checklist

- [ ] Publish document with auto-generated slug
- [ ] Publish document with custom slug
- [ ] Verify slug collision detection
- [ ] Test unpublishing document
- [ ] Search functionality on docs hub
- [ ] Category filtering
- [ ] View individual document page
- [ ] Test 404 for non-existent slug
- [ ] Verify GitHub links
- [ ] Test mobile responsiveness
- [ ] Verify permission warnings
- [ ] Test "View Live" button

### Unit Tests (Future)

- Slug generation
- Description extraction
- Audience parsing
- API endpoint responses
- Component rendering

## Future Enhancements

1. **Versioning**: Track document versions
2. **Draft Mode**: Preview before publishing
3. **Scheduled Publishing**: Set publish/unpublish dates
4. **Analytics Dashboard**: Track views, popular docs
5. **Related Documents**: Suggest related content
6. **Table of Contents**: Auto-generate TOC for long docs
7. **Comments**: Allow user feedback
8. **Translations**: Multi-language support
9. **Export**: PDF/DOCX export functionality
10. **Search Indexing**: Full-text search with Algolia/Elasticsearch

## Troubleshooting

### Document not appearing after publishing
- Verify permission level is "Public"
- Check `published_to_hub` is `true` in Firestore
- Clear browser cache
- Check browser console for errors

### Slug collision error
- Use a more unique slug
- System will auto-append document ID if needed

### 404 on individual doc page
- Verify slug matches exactly (case-sensitive in URL, but slugs are lowercase)
- Check document is published
- Verify API endpoint is accessible

### Build errors
- Ensure all dependencies are installed
- Check `process.env.NEXT_PUBLIC_API_BASE_URL` is set
- Verify Python backend is running

## Related Documentation

- [Knowledge Base Architecture](../architecture/knowledge-base.md)
- [Permission System](../features/permissions.md)
- [API Documentation](../api/README.md)
- [Frontend Components](../development/frontend-components.md)

## Contributors

- Lead Developer: Claude (AI Assistant)
- Product Owner: mrj0nesmtl
- Date Created: October 31, 2025
- Last Updated: October 31, 2025

## License

Part of the SHELTR AI platform. All rights reserved.

