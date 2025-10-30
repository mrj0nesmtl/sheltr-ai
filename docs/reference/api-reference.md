# 🔌 API Reference

Complete API endpoint documentation for the SHELTR-AI FastAPI backend.

## 🌐 Base URLs

- **Development**: `http://localhost:8000`
- **Production**: `https://api.sheltr.ai`

## 🔐 Authentication

All protected endpoints require a Firebase JWT token in the Authorization header:

```http
Authorization: Bearer <firebase-jwt-token>
```

## 📋 API Endpoints

### Authentication (`/api/v1/auth`)

#### POST `/api/v1/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "John Doe",
  "role": "participant"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "participant"
  }
}
```

#### GET `/api/v1/auth/profile`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "role": "participant"
  }
}
```

### Shelters (`/api/v1/shelters`)

#### GET `/api/v1/shelters`
Get list of all shelters.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `city` (optional): Filter by city
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "shelters": [
    {
      "id": "shelter-id",
      "name": "Downtown Shelter",
      "address": {
        "street": "123 Main St",
        "city": "Montreal",
        "state": "QC",
        "zipCode": "H1A 1A1"
      },
      "capacity": {
        "total": 100,
        "available": 25
      },
      "services": ["meals", "housing", "counseling"]
    }
  ],
  "total": 10,
  "hasMore": false
}
```

#### GET `/api/v1/shelters/{shelter_id}`
Get detailed information about a specific shelter.

**Response:**
```json
{
  "success": true,
  "shelter": {
    "id": "shelter-id",
    "name": "Downtown Shelter",
    "description": "Comprehensive shelter services...",
    "contact": {
      "phone": "+1-514-555-0123",
      "email": "info@downtownshelter.org"
    },
    "services": [
      {
        "id": "service-1",
        "name": "Emergency Housing",
        "category": "housing",
        "available": true
      }
    ]
  }
}
```

### Donations (`/api/v1/donations`)

#### POST `/api/v1/donations`
Create a new donation.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "CAD",
  "shelterId": "shelter-id",
  "participantId": "participant-id",
  "paymentMethod": "card",
  "isAnonymous": false
}
```

**Response:**
```json
{
  "success": true,
  "donation": {
    "id": "donation-id",
    "amount": 5000,
    "status": "pending",
    "paymentUrl": "https://payment-processor.com/pay/token"
  }
}
```

#### GET `/api/v1/donations/history`
Get donation history for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "donations": [
    {
      "id": "donation-id",
      "amount": 5000,
      "currency": "CAD",
      "status": "completed",
      "shelter": {
        "id": "shelter-id",
        "name": "Downtown Shelter"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Services (`/api/v1/services`)

#### GET `/api/v1/services`
Get available services.

**Query Parameters:**
- `shelterId` (optional): Filter by shelter
- `category` (optional): Filter by service category
- `available` (optional): Filter by availability

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "id": "service-id",
      "name": "Emergency Housing",
      "category": "housing",
      "shelterId": "shelter-id",
      "capacity": 50,
      "available": 25,
      "schedule": [
        {
          "dayOfWeek": 1,
          "startTime": "18:00",
          "endTime": "08:00"
        }
      ]
    }
  ]
}
```

#### POST `/api/v1/services/{service_id}/book`
Book a service appointment.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "scheduledTime": "2024-01-20T19:00:00Z",
  "notes": "First time booking"
}
```

### Chatbot (`/api/v1/chatbot`)

#### POST `/api/v1/chatbot/message`
Send a message to the AI chatbot.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "I need help finding a shelter",
  "conversationId": "optional-conversation-id",
  "context": {
    "location": "Montreal, QC"
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "I can help you find shelter in Montreal. Here are some options...",
  "actions": [
    {
      "type": "view_shelters",
      "label": "View Nearby Shelters",
      "data": {
        "city": "Montreal"
      }
    }
  ],
  "conversationId": "conversation-uuid",
  "agentUsed": "participant_support"
}
```

#### GET `/api/v1/chatbot/health`
Check chatbot system health.

**Response:**
```json
{
  "success": true,
  "status": "operational",
  "features": {
    "intelligentResponses": true,
    "contextAwareness": true,
    "roleBasedAgents": true
  }
}
```

### Analytics (`/api/v1/analytics`)

#### GET `/api/v1/analytics/platform-metrics`
Get platform-wide metrics (admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "metrics": {
    "totalUsers": 1250,
    "totalDonations": 125000,
    "totalShelters": 10,
    "activeParticipants": 450,
    "monthlyGrowth": 15.5
  }
}
```

## 🚨 Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Invalid or missing authentication | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Invalid request data | 400 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

## 🔗 Related Documentation

- [Database Schema](./database-schema.md)
- [Authentication Guide](../04-development/authentication.md)
- [API Development](../04-development/README.md)
