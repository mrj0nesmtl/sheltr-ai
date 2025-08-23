# 🗄️ Database Schema Reference

Complete Firestore database schema and collection structure for SHELTR-AI.

## 📊 Collection Overview

### Core Collections

| Collection | Purpose | Access Control |
|------------|---------|----------------|
| `users` | User profiles and authentication data | User-specific |
| `shelters` | Shelter information and management | Public read, admin write |
| `donations` | Donation records and tracking | Donor/admin access |
| `participants` | Participant profiles and services | Participant/admin access |
| `services` | Available shelter services | Public read, admin write |
| `appointments` | Service bookings and scheduling | User-specific |

### System Collections

| Collection | Purpose | Access Control |
|------------|---------|----------------|
| `knowledge_documents` | AI chatbot knowledge base | Admin only |
| `knowledge_chunks` | Document embeddings for RAG | System only |
| `newsletter_signups` | Marketing email subscriptions | Admin only |
| `analytics_events` | Platform usage analytics | System only |

## 🏗️ Schema Definitions

### Users Collection (`users/{userId}`)

```typescript
interface User {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User email address
  displayName?: string;           // Display name
  photoURL?: string;              // Profile photo URL
  role: 'participant' | 'donor' | 'shelter_admin' | 'super_admin';
  
  // Profile Information
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: Timestamp;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  
  // Role-specific Data
  shelterIds?: string[];          // For shelter admins
  preferredShelters?: string[];   // For participants
  donationPreferences?: {         // For donors
    monthlyLimit?: number;
    preferredCauses?: string[];
    anonymousDonations?: boolean;
  };
  
  // System Fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  isActive: boolean;
}
```

### Shelters Collection (`shelters/{shelterId}`)

```typescript
interface Shelter {
  id: string;
  name: string;
  description: string;
  
  // Location Information
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Contact Information
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  
  // Capacity and Services
  capacity: {
    total: number;
    available: number;
    emergency: number;
  };
  services: string[];             // Service IDs
  amenities: string[];
  
  // Administrative
  adminIds: string[];             // User IDs of shelter admins
  status: 'active' | 'inactive' | 'maintenance';
  
  // Metrics
  totalDonations: number;
  participantCount: number;
  rating: number;
  
  // System Fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
  joinDate: Timestamp;
}
```

### Donations Collection (`donations/{donationId}`)

```typescript
interface Donation {
  id: string;
  
  // Donor Information
  donorId: string;                // User ID
  donorName?: string;             // For anonymous tracking
  isAnonymous: boolean;
  
  // Donation Details
  amount: number;                 // In cents
  currency: string;               // ISO currency code
  type: 'one_time' | 'recurring';
  
  // Allocation
  shelterId?: string;             // Specific shelter
  participantId?: string;         // Specific participant
  allocation: {
    shelter: number;              // Percentage to shelter (80%)
    participant: number;          // Percentage to participant (15%)
    platform: number;             // Percentage to platform (5%)
  };
  
  // Payment Information
  paymentMethod: 'card' | 'bank' | 'crypto';
  paymentId: string;              // External payment ID
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Metadata
  source: 'web' | 'mobile' | 'qr_code';
  campaign?: string;
  notes?: string;
  
  // System Fields
  createdAt: Timestamp;
  processedAt?: Timestamp;
  updatedAt: Timestamp;
}
```

### Services Collection (`services/{serviceId}`)

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  category: 'housing' | 'meals' | 'healthcare' | 'counseling' | 'education' | 'employment';
  
  // Availability
  shelterId: string;
  isActive: boolean;
  capacity: number;
  duration: number;               // In minutes
  
  // Scheduling
  schedule: {
    dayOfWeek: number;            // 0-6 (Sunday-Saturday)
    startTime: string;            // HH:MM format
    endTime: string;              // HH:MM format
  }[];
  
  // Requirements
  requirements?: string[];
  eligibilityCriteria?: string[];
  
  // System Fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔍 Indexes

### Composite Indexes

```javascript
// Required Firestore indexes
[
  // Donations by shelter and date
  {
    collection: 'donations',
    fields: [
      { field: 'shelterId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },
  
  // Services by shelter and category
  {
    collection: 'services',
    fields: [
      { field: 'shelterId', order: 'ASCENDING' },
      { field: 'category', order: 'ASCENDING' },
      { field: 'isActive', order: 'ASCENDING' }
    ]
  },
  
  // Appointments by user and date
  {
    collection: 'appointments',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'scheduledTime', order: 'ASCENDING' }
    ]
  }
]
```

## 🔒 Security Rules

### Basic Security Patterns

```javascript
// User data access
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Shelter data access
match /shelters/{shelterId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
    (resource.data.adminIds.hasAny([request.auth.uid]) ||
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
}

// Donation access
match /donations/{donationId} {
  allow read: if request.auth != null && 
    (request.auth.uid == resource.data.donorId ||
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['shelter_admin', 'super_admin']);
  allow create: if request.auth != null && request.auth.uid == request.resource.data.donorId;
}
```

## 🔗 Related Documentation

- [API Reference](./api-reference.md)
- [Firestore Setup Guide](../03-api/firestore-setup.md)
- [Security Configuration](../05-deployment/security.md)
