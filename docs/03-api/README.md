# 🔌 SHELTR-AI API Documentation

**FastAPI Multi-Tenant Backend for Charitable Giving Platform**

*Base URL: `https://api.sheltr.ai/v2`*  
*Authentication: Bearer JWT tokens with custom claims*  
*Multi-Tenant: X-Tenant-ID header required*

---

## 🚀 Quick Start

### Authentication

All API requests require authentication via Firebase JWT tokens with custom claims:

```bash
# Example authenticated request
curl -X GET \
  'https://api.sheltr.ai/v2/participants/' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'X-Tenant-ID: shelter-abc123' \
  -H 'Content-Type: application/json'
```

### API Response Format

```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2025-07-22T12:00:00Z",
  "tenant_id": "shelter-abc123"
}
```

---

## 🏗️ Multi-Tenant Architecture

### Tenant Types & Access

| Tenant Type | ID Format | Purpose | API Access |
|-------------|-----------|---------|------------|
| **Platform** | `platform` | SHELTR administration | All endpoints |
| **Shelter** | `shelter-{uuid}` | Individual shelter management | Shelter-specific data |
| **Participant Network** | `participant-network` | Independent participants | Participant data |
| **Donor Network** | `donor-network` | Donor community | Donation tracking |

### Tenant Header

```http
X-Tenant-ID: shelter-abc123
```

Required for all requests. Determines data isolation and access permissions.

---

## 🎯 Four-Role System

### Role-Based Endpoints

| Role | Permissions | Accessible Endpoints |
|------|-------------|---------------------|
| **SuperAdmin** | Full system access | `/admin/*`, `/analytics/global/*`, `/system/*` |
| **Admin** | Shelter management | `/shelter/*`, `/participants/*`, `/analytics/shelter/*` |
| **Participant** | Personal data | `/participant/profile/*`, `/participant/donations/*` |
| **Donor** | Donation tracking | `/donor/*`, `/donations/history/*`, `/impact/*` |

---

## 📚 API Endpoints Overview

### 🔐 Authentication
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `GET /auth/verify` - Token verification

### 👥 User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `POST /users/register` - User registration
- `DELETE /users/account` - Account deletion

### 🏠 Tenant Management
- `GET /tenants/` - List accessible tenants
- `GET /tenants/{tenant_id}` - Get tenant details
- `PUT /tenants/{tenant_id}` - Update tenant settings
- `POST /tenants/` - Create new tenant (SuperAdmin only)

### 👤 Participant Management
- `GET /participants/` - List participants
- `POST /participants/` - Register new participant
- `GET /participants/{participant_id}` - Get participant details
- `PUT /participants/{participant_id}` - Update participant
- `POST /participants/{participant_id}/qr` - Generate QR code
- `POST /participants/{participant_id}/verify` - Verify participant

### 💰 Donation System
- `POST /donations/` - Process new donation
- `GET /donations/` - List donations
- `GET /donations/{donation_id}` - Get donation details
- `POST /donations/verify` - Verify QR code donation
- `GET /donations/participant/{participant_id}` - Participant donation history

### 📱 QR Code Management
- `POST /qr/generate` - Generate QR code
- `POST /qr/verify` - Verify QR code
- `GET /qr/{qr_id}` - Get QR code details
- `PUT /qr/{qr_id}` - Update QR code

### ⛓️ Blockchain Integration
- `POST /blockchain/process` - Process blockchain transaction
- `GET /blockchain/status/{tx_hash}` - Check transaction status
- `GET /blockchain/wallet/{address}` - Get wallet information
- `POST /blockchain/wallet/create` - Create new wallet

### 📊 Analytics & Reporting
- `GET /analytics/overview` - Platform overview
- `GET /analytics/donations` - Donation analytics
- `GET /analytics/impact` - Impact metrics
- `GET /analytics/participants` - Participant statistics
- `POST /analytics/report` - Generate custom report

### 🤖 AI & Insights
- `POST /ai/analyze` - Generate AI insights
- `GET /ai/predictions` - Get donation predictions
- `POST /ai/report` - Generate AI-powered impact report

---

## 🔒 Authentication & Security

### JWT Token Structure

```json
{
  "sub": "user_uuid",
  "role": "admin",
  "tenant_id": "shelter-abc123",
  "permissions": ["read:participants", "write:donations"],
  "shelter_id": "abc123",
  "verified": true,
  "iat": 1690000000,
  "exp": 1690086400
}
```

### Permission System

Permissions follow the pattern: `action:resource`

```typescript
// Example permissions
const permissions = [
  'read:participants',
  'write:participants', 
  'delete:participants',
  'read:donations',
  'write:donations',
  'admin:system'
];
```

### Rate Limiting

| Endpoint Category | Rate Limit | Window |
|------------------|------------|--------|
| **Authentication** | 5 requests | 1 minute |
| **General API** | 100 requests | 1 minute |
| **Donations** | 50 requests | 1 minute |
| **Analytics** | 20 requests | 1 minute |
| **AI/ML** | 10 requests | 1 minute |

---

## 🏥 Health & Status

### Health Check

```http
GET /health
```

```json
{
  "status": "healthy",
  "version": "2.0.0",
  "timestamp": "2025-07-22T12:00:00Z",
  "services": {
    "database": "healthy",
    "blockchain": "healthy",
    "ai": "healthy",
    "cache": "healthy"
  }
}
```

### System Status

```http
GET /status
```

```json
{
  "platform": {
    "version": "2.0.0",
    "uptime": "15d 4h 23m",
    "total_participants": 1250,
    "total_donations": 8945,
    "total_amount": "$125,430.50"
  },
  "blockchain": {
    "network": "ethereum",
    "last_block": 18234567,
    "contract_address": "0x742d35cc6638c532532e3783d6f1e2f1a9a4f8c7"
  }
}
```

---

## 📝 Request/Response Examples

### Register New Participant

```http
POST /participants/
X-Tenant-ID: shelter-abc123
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "name": "John Doe",
  "age": 34,
  "shelter_affiliation": "abc123",
  "verification_documents": ["id_scan.jpg"],
  "needs": ["food", "shelter", "medical"],
  "bio": "Seeking support to get back on my feet"
}
```

```json
{
  "success": true,
  "data": {
    "id": "part_123456",
    "name": "John Doe",
    "qr_code": {
      "id": "qr_789012",
      "hash": "sha256:abcd1234...",
      "url": "https://api.sheltr.ai/qr/qr_789012",
      "image_url": "https://cdn.sheltr.ai/qr/qr_789012.png"
    },
    "wallet": {
      "address": "0x1234567890abcdef...",
      "network": "ethereum",
      "balance": "0.00"
    },
    "created_at": "2025-07-22T12:00:00Z",
    "status": "pending_verification"
  }
}
```

### Process Donation

```http
POST /donations/
X-Tenant-ID: donor-network
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "participant_id": "part_123456",
  "amount": "25.00",
  "currency": "USD",
  "purpose": "food",
  "message": "Hope this helps!",
  "payment_method": "blockchain",
  "donor_wallet": "0x987654321fedcba..."
}
```

```json
{
  "success": true,
  "data": {
    "donation_id": "don_345678",
    "status": "processing",
    "blockchain_tx": "0xabcdef123456...",
    "distribution": {
      "to_participant": "20.00",
      "to_housing_fund": "3.75", 
      "to_operations": "1.25"
    },
    "estimated_confirmation": "2025-07-22T12:05:00Z"
  }
}
```

---

## 🚨 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "PARTICIPANT_NOT_FOUND",
    "message": "Participant with ID part_123456 not found",
    "details": {
      "participant_id": "part_123456",
      "tenant_id": "shelter-abc123"
    }
  },
  "timestamp": "2025-07-22T12:00:00Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_TOKEN` | 401 | JWT token invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `TENANT_ACCESS_DENIED` | 403 | User cannot access specified tenant |
| `PARTICIPANT_NOT_FOUND` | 404 | Participant does not exist |
| `DONATION_FAILED` | 400 | Donation processing failed |
| `BLOCKCHAIN_ERROR` | 503 | Blockchain network issue |
| `RATE_LIMIT_EXCEEDED` | 429 | API rate limit exceeded |

---

## 📊 Pagination

### Request Parameters

```http
GET /participants/?page=2&limit=50&sort=created_at&order=desc
```

### Response Format

```json
{
  "success": true,
  "data": {
    "items": [ /* Array of participants */ ],
    "pagination": {
      "page": 2,
      "limit": 50,
      "total_items": 1250,
      "total_pages": 25,
      "has_next": true,
      "has_prev": true
    }
  }
}
```

---

## 🔍 Filtering & Search

### Query Parameters

```http
GET /participants/?status=verified&shelter_id=abc123&search=john&created_after=2025-01-01
```

### Available Filters

| Resource | Filters | Example |
|----------|---------|---------|
| **Participants** | `status`, `shelter_id`, `verified`, `created_after`, `search` | `?status=verified&search=john` |
| **Donations** | `amount_min`, `amount_max`, `purpose`, `status`, `date_range` | `?amount_min=10&purpose=food` |
| **QR Codes** | `active`, `created_after`, `participant_id` | `?active=true` |

---

## 🚀 WebSocket Real-Time Updates

### Connection

```javascript
const ws = new WebSocket('wss://api.sheltr.ai/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'JWT_TOKEN',
  tenant_id: 'shelter-abc123'
}));
```

### Event Types

```javascript
// Donation received
{
  "type": "donation_received",
  "data": {
    "donation_id": "don_123456",
    "participant_id": "part_789012",
    "amount": "25.00",
    "status": "confirmed"
  }
}

// Participant registered
{
  "type": "participant_registered", 
  "data": {
    "participant_id": "part_345678",
    "shelter_id": "abc123"
  }
}
```

---

## 📚 Additional Resources

### Detailed Endpoint Documentation
- [Authentication](authentication.md) - Complete auth flow and security
- [User Management](user-management.md) - User CRUD operations
- [Tenant Management](tenant-management.md) - Multi-tenant operations
- [Donation System](donation-system.md) - Donation processing and tracking
- [QR Management](qr-management.md) - QR code generation and verification
- [Blockchain API](blockchain-api.md) - Smart contract integration
- [Analytics API](analytics-api.md) - Reporting and insights
- [Webhooks](webhooks.md) - External system integration

### Code Examples
- [cURL Examples](examples/curl-examples.md)
- [JavaScript SDK](examples/sdk-examples.md)
- [Postman Collection](examples/postman-collection.json)

### Tools & Testing
- **Interactive API Docs**: `https://api.sheltr.ai/docs`
- **OpenAPI Spec**: `https://api.sheltr.ai/openapi.json`
- **Postman Collection**: [Download](examples/postman-collection.json)

---

**This API powers the next generation of charitable giving - transparent, efficient, and globally scalable.** 🚀✨ 