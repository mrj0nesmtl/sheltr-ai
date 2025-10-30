# 🔌 API Documentation

> **Complete RESTful API documentation for the SHELTR platform**  
> FastAPI backend with Firestore database, comprehensive schemas, and integration guides.

[![Status](https://img.shields.io/badge/status-production-success.svg)](https://sheltr-ai.web.app/docs/api)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-blue.svg)](https://fastapi.tiangolo.com/)
[![Firestore](https://img.shields.io/badge/Firebase-Firestore-orange.svg)](https://firebase.google.com/docs/firestore)

---

## 📚 What's Here

Complete API documentation including:
- RESTful endpoint specifications
- Request/response schemas
- Database structure and collections
- Authentication and authorization
- Integration examples and guides

---

## 📂 Documentation Files

### Core API Documentation

#### [Database Schema](database-schema.md) 🗄️
**Complete Firestore database structure**
- All collections and subcollections
- Document field specifications
- Relationships and references
- Indexing strategy
- Data validation rules

**Key Collections**:
- `users` - User accounts and profiles
- `shelters` - Shelter locations and management
- `participants` - Service recipients
- `donations` - Transaction records
- `notifications` - Real-time notifications
- `blog_posts` - Content management
- `knowledge_base` - Document repository

#### [Firestore Setup](firestore-setup.md) 🔥
**Firebase configuration and initialization**
- Firebase project setup
- Firestore security rules
- Collection initialization
- Indexing configuration
- Local emulator setup
- Production deployment

#### [Blog Schema](blog-schema.md) 📝
**Blog system API specification**
- Blog post creation endpoints
- Content management operations
- SEO metadata structure
- Image upload and management
- Public/admin endpoints
- Markdown rendering support

---

## 🚀 Quick Start

### API Base URL

**Production**:
```
https://sheltr-ai.web.app/api
```

**Local Development**:
```
http://localhost:8000/api
```

### Authentication

All protected endpoints require authentication:

```bash
curl -X GET "https://sheltr-ai.web.app/api/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example Request

```python
import requests

# Get current user
response = requests.get(
    "https://sheltr-ai.web.app/api/users/me",
    headers={"Authorization": f"Bearer {token}"}
)

user_data = response.json()
print(f"Hello, {user_data['name']}!")
```

---

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/` - List users (admin)
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update current user
- `DELETE /api/users/{id}` - Delete user (admin)

### Shelters
- `GET /api/shelters/` - List shelters
- `POST /api/shelters/` - Create shelter (admin)
- `GET /api/shelters/{id}` - Get shelter details
- `PATCH /api/shelters/{id}` - Update shelter
- `DELETE /api/shelters/{id}` - Delete shelter

### Donations
- `POST /api/donations/` - Create donation
- `GET /api/donations/` - List donations
- `GET /api/donations/{id}` - Get donation details
- `GET /api/donations/stats` - Donation statistics

### Blog
- `GET /api/blog/posts/` - List published posts
- `GET /api/blog/posts/{slug}` - Get post by slug
- `POST /api/admin/blog/posts/` - Create post (admin)
- `PATCH /api/admin/blog/posts/{id}` - Update post (admin)
- `DELETE /api/admin/blog/posts/{id}` - Delete post (admin)

### Knowledge Base
- `GET /api/knowledge/documents/` - List documents
- `POST /api/knowledge/documents/` - Upload document (admin)
- `GET /api/knowledge/search` - Search documents
- `DELETE /api/knowledge/documents/{id}` - Delete document (admin)

See [API Reference](../reference/api-reference.md) for complete endpoint documentation.

---

## 🔐 Authentication & Authorization

### Role-Based Access Control (RBAC)

**User Roles**:
- `donor` - Can make donations, view receipts
- `participant` - Can access services, view profile
- `shelter_admin` - Manage shelter operations
- `platform_admin` - Full platform management
- `super_admin` - System administration

**Permission Levels**:
```python
# Example: Check user permissions
@require_role("shelter_admin")
async def manage_shelter(request):
    # Only shelter admins can access
    pass

@require_any_role(["platform_admin", "super_admin"])
async def admin_function(request):
    # Platform or super admins can access
    pass
```

---

## 📊 Database Structure

### Collections Overview

```
firestore/
├── users/                    # User accounts
│   └── {userId}/
│       └── profile/          # User profile data
├── shelters/                 # Shelter locations
│   └── {shelterId}/
│       ├── participants/     # Shelter participants
│       └── staff/            # Shelter staff
├── donations/                # Transaction records
├── participants/             # Service recipients
├── notifications/            # Real-time notifications
│   └── {userId}/
│       └── items/            # User notifications
├── blog_posts/               # Content management
└── knowledge_base/           # Document repository
    └── documents/            # Knowledge documents
```

See [Database Schema](database-schema.md) for complete structure.

---

## 🔧 Development Setup

### Prerequisites

```bash
# Install dependencies
pip install fastapi uvicorn firebase-admin python-jose

# Or use requirements.txt
pip install -r requirements.txt
```

### Local Development

```bash
# Start FastAPI server
cd apps/api
uvicorn main:app --reload --port 8000

# API docs available at:
# http://localhost:8000/docs
```

### Environment Variables

```env
# .env file
FIREBASE_PROJECT_ID=sheltr-ai
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
JWT_SECRET=your-secret-key
ENVIRONMENT=development
```

---

## 📝 Request/Response Examples

### Create Donation

**Request**:
```json
POST /api/donations/
{
  "amount": 50.00,
  "currency": "USD",
  "donor_id": "user_123",
  "shelter_id": "shelter_456",
  "message": "Hope this helps!"
}
```

**Response**:
```json
{
  "id": "donation_789",
  "amount": 50.00,
  "currency": "USD",
  "status": "completed",
  "created_at": "2025-10-30T12:00:00Z",
  "receipt_url": "https://..."
}
```

### Create Blog Post

**Request**:
```json
POST /api/admin/blog/posts/
{
  "title": "New Feature Launch",
  "slug": "new-feature-launch",
  "content": "## Great news...",
  "excerpt": "Exciting new feature",
  "author_id": "admin_123",
  "published": true,
  "tags": ["features", "announcement"]
}
```

**Response**:
```json
{
  "id": "post_456",
  "slug": "new-feature-launch",
  "status": "published",
  "url": "https://sheltr-ai.web.app/blog/new-feature-launch",
  "created_at": "2025-10-30T12:00:00Z"
}
```

---

## 🛠️ Integration Guides

### Firebase Integration
See [Firebase Integration](../integrations/firebase-integration.md) for complete setup.

### Authentication Flow
1. User logs in with Firebase Auth
2. Backend verifies Firebase token
3. Creates session with JWT
4. Returns access token
5. Client includes token in API requests

### Real-time Updates
```python
# Subscribe to Firestore changes
def on_snapshot(doc_snapshot, changes, read_time):
    for change in changes:
        if change.type.name == 'ADDED':
            print(f'New: {change.document.id}')

# Watch collection
docs_ref = db.collection('notifications').where('user_id', '==', user_id)
docs_watch = docs_ref.on_snapshot(on_snapshot)
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all API tests
pytest tests/api/

# Run specific test file
pytest tests/api/test_donations.py

# Run with coverage
pytest --cov=apps/api tests/
```

### Test Coverage

- Authentication: 95%
- Users: 92%
- Donations: 90%
- Shelters: 88%
- Blog: 85%
- Knowledge Base: 82%

---

## 📚 Related Documentation

### Technical
- [Database Schema](database-schema.md) - Complete Firestore structure
- [Firestore Setup](firestore-setup.md) - Firebase configuration
- [API Reference](../reference/api-reference.md) - Complete endpoint docs

### Features
- [Blog System](../features/blog-system/) - Content management
- [Knowledge Base](../features/knowledge-base/) - Document management
- [Notifications](../features/notifications/) - Real-time notifications

### Architecture
- [System Design](../architecture/technical/system-design.md) - Overall architecture
- [Payment Rails](../architecture/payment-rails/) - Payment processing

---

## 🔗 External Resources

- 🌐 [Live API Docs](https://sheltr-ai.web.app/docs/api)
- 📊 [Knowledge Base Dashboard](https://sheltr-ai.web.app/dashboard/knowledge)
- 📚 [FastAPI Documentation](https://fastapi.tiangolo.com/)
- 🔥 [Firebase Documentation](https://firebase.google.com/docs)

---

## 📞 API Support

**Need help with the API?**

- 📧 **Email**: joel@arcanaconcept.com
- 💬 **Internal**: SHELTR Chatbot
- 📖 **Docs**: [Complete API Reference](../reference/api-reference.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/mrj0nesmtl/sheltr-ai/issues)

---

## 🎯 Best Practices

### Error Handling
```python
try:
    response = api_client.create_donation(data)
except APIError as e:
    print(f"Error: {e.message}")
    print(f"Status: {e.status_code}")
```

### Rate Limiting
- **Authenticated**: 1000 requests/hour
- **Unauthenticated**: 100 requests/hour
- **Admin**: 5000 requests/hour

### Pagination
```python
# Get paginated results
response = api_client.get_donations(
    page=1,
    page_size=20,
    sort_by="created_at",
    order="desc"
)
```

---

**Last Updated**: October 30, 2025  
**API Version**: 1.0  
**Status**: ✅ Production Ready

---

<p align="center">
  <strong>RESTful, secure, well-documented API</strong><br>
  <em>Powering the SHELTR platform</em>
</p>
