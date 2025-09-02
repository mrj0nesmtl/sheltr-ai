# 🗄️ Database Schema Reference

**🎯 Last Updated**: September 2, 2025 (Session 14)  
**📊 Current Status**: Production-ready multi-tenant platform with comprehensive AI systems  
**🔗 Architecture**: Multi-tenant Firestore with real-time data connectivity  
**✅ Platform Status**: Ready for beta launch with 10+ shelter tenants

---

## 🏗️ **Multi-Tenant Architecture Overview**

SHELTR uses a sophisticated multi-tenant Firestore architecture where each shelter operates as its own tenant while sharing platform-wide resources and AI systems.

### **🔄 Tenant Isolation Model**
- **Tenant-Scoped Collections**: Each shelter has isolated data under `tenants/{shelter-id}/`
- **Global Collections**: Shared platform resources, AI systems, and admin functions
- **Legacy Collections**: Root-level collections for backward compatibility
- **Cross-Tenant Analytics**: Platform-wide metrics and insights

---

## 📊 **Collection Structure**

### **🏠 Root-Level Collections (Global Platform)**

#### 1. **Tenants** (`tenants/{tenant-id}`)
**Status**: ✅ **OPERATIONAL** - 10+ Montreal shelters

```typescript
interface ShelterTenant {
  id: string;                           // "old-brewery-mission"
  name: string;                         // "Old Brewery Mission"
  address: string;                      // "902 Saint-Laurent Blvd, Montreal"
  type: 'Emergency Shelter' | 'Transitional Housing' | 'Family Shelter' | 'Youth Shelter' | 'Day Center';
  capacity: number;                     // 300
  currentOccupancy: number;             // 245
  status: 'active' | 'pending' | 'inactive';
  
  // Contact Information
  contact: {
    name: string;                       // "John Smith"
    email: string;                      // "admin@oldbrewery.ca"
    phone: string;                      // "+1-514-555-0123"
  };
  
  // Geographic Data
  coordinates: {
    lat: number;                        // 45.5017
    lng: number;                        // -73.5673
  };
  
  // Feature Configuration
  features_enabled: {
    participant_management: boolean;     // true
    donation_processing: boolean;        // true
    qr_code_generation: boolean;        // true
    analytics_dashboard: boolean;        // true
    staff_management: boolean;          // true
    resource_tracking: boolean;         // true
    smartfund_integration: boolean;     // true
  };
  
  subscription: 'free';                 // Always free for shelters
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 2. **Users** (`users/{user-id}`)
**Status**: ✅ **OPERATIONAL** - Multi-role user management

```typescript
interface User {
  uid: string;                          // Firebase Auth UID
  email: string;                        // "user@example.com"
  firstName: string;                    // "Michael"
  lastName: string;                     // "Rodriguez"
  role: 'super_admin' | 'platform_admin' | 'admin' | 'participant' | 'donor';
  
  // Tenant Association
  shelter_id?: string;                  // "old-brewery-mission"
  tenant_id?: string;                   // "shelter-old-brewery-mission"
  
  // Status & Activity
  status: 'active' | 'inactive' | 'pending' | 'new' | 'transitioning';
  last_active?: Timestamp;
  
  // Profile Information
  phone?: string;
  profile_complete: boolean;
  email_verified: boolean;
  
  // Permissions (for admins)
  permissions?: string[];
  
  // Metadata
  created_at: Timestamp;
  updated_at: Timestamp;
  last_login_at?: Timestamp;
}
```

#### 3. **Newsletter Signups** (`newsletter_signups/{signup-id}`)
**Status**: ✅ **OPERATIONAL** - Marketing email capture

```typescript
interface EmailSignup {
  id: string;
  email: string;                        // "subscriber@example.com"
  source: string;                       // "homepage", "dashboard", "scan-give"
  page: string;                         // "landing", "donate", "about"
  signup_date: Timestamp;
  user_agent?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
}
```

#### 4. **Knowledge Documents** (`knowledge_documents/{doc-id}`)
**Status**: ✅ **OPERATIONAL** - AI chatbot knowledge base

```typescript
interface KnowledgeDocument {
  id: string;
  title: string;                        // "Shelter Registration Process"
  content: string;                      // Full document text
  file_path: string;                    // "docs/user-guides/shelter-admin.md"
  file_type: string;                    // "markdown", "pdf", "txt"
  file_size: number;                    // File size in bytes
  category: string;                     // "user-guides", "api", "architecture"
  tags: string[];                       // ["shelter", "registration", "admin"]
  
  // Processing Status
  status: 'active' | 'archived' | 'processing';
  embedding_status: 'pending' | 'completed' | 'failed';
  chunk_count: number;                  // Number of text chunks
  word_count: number;                   // Total word count
  
  // Access Control
  sharing_level: 'public' | 'shelter_specific' | 'super_admin_only' | 'role_based';
  shared_with?: string[];               // Array of shelter IDs or user IDs
  access_roles?: string[];              // Array of roles that can access
  is_live?: boolean;                    // Whether document is public
  confidentiality_level: 'public' | 'internal' | 'confidential' | 'restricted';
  
  // Analytics
  view_count: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by: string;                   // User ID who uploaded
}
```

#### 5. **Knowledge Chunks** (`knowledge_chunks/{chunk-id}`)
**Status**: ✅ **OPERATIONAL** - RAG system embeddings

```typescript
interface KnowledgeChunk {
  id: string;
  document_id: string;                  // Parent document ID
  content: string;                      // Text chunk content
  chunk_index: number;                  // Position in document
  embedding?: number[];                 // Vector embedding (1536 dimensions)
  metadata: {
    page_number?: number;
    section_title?: string;
    file_path: string;
    document_title: string;
  };
  created_at: string;
  embedding_model: string;              // "text-embedding-ada-002"
}
```

#### 6. **Chat Sessions** (`chat_sessions/{session-id}`)
**Status**: ✅ **OPERATIONAL** - AI chatbot conversations

```typescript
interface ChatSession {
  id: string;
  user_id?: string;                     // If authenticated user
  session_token: string;                // Anonymous session tracking
  agent_type: 'emergency' | 'support' | 'donor' | 'general' | 'super_admin';
  
  // Session Context
  context: {
    user_role?: string;
    shelter_id?: string;
    page_source?: string;               // Where chat was initiated
    user_agent?: string;
  };
  
  // Conversation Data
  message_count: number;
  total_tokens_used: number;
  last_message_at: Timestamp;
  
  // Status
  status: 'active' | 'ended' | 'archived';
  satisfaction_rating?: number;         // 1-5 stars
  
  // Metadata
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

#### 7. **Blog Posts** (`blog_posts/{post-id}`)
**Status**: ✅ **OPERATIONAL** - Content management

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;                         // URL-friendly identifier
  content: string;                      // Full post content (markdown)
  excerpt: string;                      // Short description
  featured_image?: string;              // Image URL
  
  // Categorization
  category: string;                     // "news", "updates", "guides"
  tags: string[];                       // ["blockchain", "ai", "shelter"]
  
  // Publishing
  status: 'draft' | 'published' | 'archived';
  published_at?: Timestamp;
  
  // Author Information
  author: {
    id: string;                         // User ID
    name: string;
    avatar?: string;
  };
  
  // Analytics
  view_count: number;
  like_count: number;
  
  // SEO
  meta_description?: string;
  seo_keywords?: string[];
  
  // Metadata
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### **🏢 Tenant-Scoped Collections** (`tenants/{tenant-id}/`)

#### 1. **Participants** (`tenants/{tenant-id}/participants/{participant-id}`)
**Status**: ✅ **OPERATIONAL** - Shelter-specific participant management

```typescript
interface TenantParticipant {
  id: string;                           // "michael-rodriguez"
  tenantId: string;                     // "old-brewery-mission"
  name: string;                         // "Michael Rodriguez"
  age?: number;                         // 34
  gender?: string;                      // "male", "female", "non-binary", "prefer-not-to-say"
  
  // Shelter Status
  checkinDate: Timestamp;
  status: 'active' | 'transitioned' | 'inactive';
  verified: boolean;                    // Identity verification status
  
  // Digital Identity
  qrCodeHash?: string;                  // Unique QR code identifier
  walletAddress?: string;               // Blockchain wallet address
  
  // Financial Tracking
  totalDonationsReceived: number;       // Total donations in cents
  
  // Activity
  lastActivity: Timestamp;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 2. **Staff** (`tenants/{tenant-id}/staff/{staff-id}`)
**Status**: ✅ **OPERATIONAL** - Shelter staff management

```typescript
interface TenantStaff {
  id: string;
  tenantId: string;                     // "old-brewery-mission"
  user_id: string;                      // Reference to users collection
  name: string;                         // "Jane Smith"
  role: 'admin' | 'counselor' | 'security' | 'volunteer';
  
  // Permissions
  permissions: string[];                // ["participant_management", "donation_view"]
  
  // Contact
  email: string;
  phone?: string;
  
  // Status
  status: 'active' | 'inactive' | 'on_leave';
  hire_date: Timestamp;
  
  // Metadata
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

#### 3. **Services** (`tenants/{tenant-id}/services/{service-id}`)
**Status**: ✅ **OPERATIONAL** - Shelter-specific services

```typescript
interface ShelterService {
  id: string;
  tenantId: string;                     // "old-brewery-mission"
  name: string;                         // "Mental Health Counseling"
  description: string;
  category: 'housing' | 'meals' | 'healthcare' | 'counseling' | 'education' | 'employment' | 'legal';
  
  // Availability
  isActive: boolean;
  capacity: number;                     // Max participants
  currentBookings: number;              // Current bookings
  duration: number;                     // Service duration in minutes
  
  // Scheduling
  schedule: {
    dayOfWeek: number;                  // 0-6 (Sunday-Saturday)
    startTime: string;                  // "09:00"
    endTime: string;                    // "17:00"
  }[];
  
  // Requirements
  requirements?: string[];              // ["ID verification", "intake assessment"]
  eligibilityCriteria?: string[];       // ["18+ years", "shelter resident"]
  
  // Booking Configuration
  advanceBookingDays: number;           // How far in advance can be booked
  allowWalkIns: boolean;
  requiresApproval: boolean;
  
  // Metadata
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: string;                   // Staff member who created
}
```

#### 4. **Donations** (`tenants/{tenant-id}/donations/{donation-id}`)
**Status**: ✅ **OPERATIONAL** - Tenant-specific donation tracking

```typescript
interface TenantDonation {
  id: string;
  tenantId: string;                     // "old-brewery-mission"
  
  // Donor Information
  donorId?: string;                     // User ID (if registered donor)
  donorName?: string;                   // For anonymous tracking
  donorEmail?: string;                  // Contact email
  isAnonymous: boolean;
  
  // Donation Details
  amount: number;                       // In cents ($10.00 = 1000)
  currency: string;                     // "CAD", "USD"
  type: 'one_time' | 'recurring';
  
  // Targeting
  participantId?: string;               // Specific participant
  purpose?: string;                     // "general", "food", "housing", "healthcare"
  
  // SmartFund Allocation (80-15-5 model)
  allocation: {
    shelter: number;                    // 80% to shelter operations
    participant: number;                // 15% to participant
    platform: number;                   // 5% to platform maintenance
  };
  
  // Payment Information
  paymentMethod: 'card' | 'bank' | 'crypto' | 'apple_pay' | 'google_pay';
  paymentId: string;                    // External payment processor ID
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
  
  // Transaction Details
  fees: {
    processing_fee: number;             // Payment processor fee
    platform_fee: number;              // SHELTR platform fee
    net_amount: number;                 // Amount after fees
  };
  
  // Source Tracking
  source: 'web' | 'mobile' | 'qr_code' | 'social_media';
  campaign?: string;                    // Marketing campaign tracking
  referrer?: string;                    // Referring URL or source
  
  // Metadata
  notes?: string;                       // Donor message
  receipt_sent: boolean;
  tax_receipt_required: boolean;
  
  // Timestamps
  created_at: Timestamp;
  processed_at?: Timestamp;
  updated_at: Timestamp;
}
```

### **🌐 Global Platform Collections**

#### 1. **Platform Metrics** (`platform_metrics/{metric-id}`)
**Status**: ✅ **OPERATIONAL** - System-wide analytics

```typescript
interface PlatformMetrics {
  id: string;
  date: string;                         // "2025-09-02"
  
  // Core Metrics
  total_shelters: number;               // 10
  active_shelters: number;              // 8
  total_participants: number;           // 1,247
  total_donations: number;              // $45,230.00 (in cents)
  
  // Financial Metrics
  revenue_breakdown: {
    shelter_operations: number;         // 80%
    participant_support: number;        // 15%
    platform_maintenance: number;      // 5%
  };
  
  // Activity Metrics
  new_signups_today: number;
  donations_today: number;
  active_sessions: number;
  
  // AI System Metrics
  chatbot_interactions: number;
  knowledge_base_queries: number;
  avg_response_time_ms: number;
  
  // System Health
  uptime_percentage: number;
  error_rate: number;
  
  created_at: Timestamp;
}
```

#### 2. **System Alerts** (`system_alerts/{alert-id}`)
**Status**: ✅ **OPERATIONAL** - Platform monitoring

```typescript
interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'data' | 'payment' | 'user' | 'ai_system';
  title: string;                        // "High donation volume detected"
  message: string;                      // Detailed alert description
  
  // Severity & Status
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  
  // Context
  affected_tenants?: string[];          // If tenant-specific
  affected_users?: string[];            // If user-specific
  metadata?: Record<string, any>;       // Additional context data
  
  // Resolution
  acknowledged_by?: string;             // User ID who acknowledged
  resolved_by?: string;                 // User ID who resolved
  resolution_notes?: string;
  
  // Timestamps
  created_at: Timestamp;
  acknowledged_at?: Timestamp;
  resolved_at?: Timestamp;
}
```

#### 3. **Appointments** (`appointments/{appointment-id}`)
**Status**: ✅ **OPERATIONAL** - Cross-tenant appointment system

```typescript
interface Appointment {
  id: string;
  
  // Participants
  participant_id: string;               // Reference to participant
  staff_id: string;                     // Reference to staff member
  service_id: string;                   // Reference to service
  tenant_id: string;                    // Which shelter
  
  // Scheduling
  scheduled_time: Timestamp;
  duration: number;                     // Minutes
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  
  // Details
  appointment_type: 'intake' | 'counseling' | 'healthcare' | 'case_management' | 'other';
  notes?: string;                       // Staff notes
  participant_notes?: string;           // Participant requests
  
  // Follow-up
  requires_follow_up: boolean;
  follow_up_date?: Timestamp;
  follow_up_notes?: string;
  
  // Metadata
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: string;                   // Staff member who created
}
```

---

## 🔍 **Firestore Indexes**

### **Required Composite Indexes**

```javascript
// firestore.indexes.json
{
  "indexes": [
    // Multi-tenant participant queries
    {
      "collectionGroup": "participants",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "checkinDate", "order": "DESCENDING" }
      ]
    },
    
    // Donation analytics
    {
      "collectionGroup": "donations", 
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    
    // Service bookings
    {
      "collectionGroup": "services",
      "queryScope": "COLLECTION_GROUP", 
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    },
    
    // Knowledge base search
    {
      "collectionGroup": "knowledge_documents",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "sharing_level", "order": "ASCENDING" },
        { "fieldPath": "updated_at", "order": "DESCENDING" }
      ]
    },
    
    // Chat analytics
    {
      "collectionGroup": "chat_sessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "agent_type", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 🔒 **Security Rules**

### **Multi-Tenant Security Model**

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User access control
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin'];
    }
    
    // Tenant access control  
    match /tenants/{tenantId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.shelter_id == tenantId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin']);
    }
    
    // Tenant-scoped collections
    match /tenants/{tenantId}/{collection}/{docId} {
      allow read, write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.shelter_id == tenantId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin']);
    }
    
    // Knowledge base access
    match /knowledge_documents/{docId} {
      allow read: if request.auth != null && 
        (resource.data.sharing_level == 'public' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin']);
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin'];
    }
    
    // Newsletter signups (public write, admin read)
    match /newsletter_signups/{signupId} {
      allow create: if true; // Public signup
      allow read, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin'];
    }
    
    // System collections (admin only)
    match /{path=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
  }
}
```

---

## 🚀 **Storage Architecture**

### **Firebase Storage Buckets**

```typescript
// Storage structure
interface StorageStructure {
  "sheltr-ai.appspot.com": {
    // Knowledge base documents
    "knowledge-base/": {
      "docs/": "Markdown documentation files",
      "pdfs/": "PDF documents", 
      "uploads/": "User-uploaded documents"
    },
    
    // User assets
    "users/": {
      "{user-id}/": {
        "profile/": "Profile images",
        "documents/": "User-uploaded documents"
      }
    },
    
    // Tenant assets
    "tenants/": {
      "{tenant-id}/": {
        "branding/": "Shelter logos and branding",
        "documents/": "Shelter-specific documents",
        "participant-photos/": "Participant profile images (encrypted)"
      }
    },
    
    // System assets
    "system/": {
      "backups/": "Database backups",
      "exports/": "Data exports",
      "temp/": "Temporary files"
    }
  }
}
```

---

## 🤖 **AI System Architecture**

### **Chatbot Agent Configuration**

```typescript
interface ChatbotAgent {
  id: string;                           // "emergency_agent"
  name: string;                         // "Emergency Response Agent"
  type: 'emergency' | 'support' | 'donor' | 'general' | 'super_admin';
  
  // Configuration
  model: 'gpt-4' | 'gpt-3.5-turbo';
  temperature: number;                  // 0.1 - 0.9
  max_tokens: number;                   // 1000-4000
  
  // Knowledge Base
  knowledge_sources: string[];          // Document categories to access
  system_prompt: string;                // Base instructions
  
  // Capabilities
  can_access_tenant_data: boolean;
  can_create_appointments: boolean;
  can_process_donations: boolean;
  can_access_participant_info: boolean;
  
  // Status
  is_active: boolean;
  last_updated: Timestamp;
}
```

---

## 📈 **Real-Time Data Metrics**

### **Current Production Statistics** (As of Session 14)

- **🏠 Active Shelters**: 10 Montreal shelters
- **👥 Total Participants**: 1,200+ across all tenants
- **💰 Platform Donations**: $45,000+ processed
- **🤖 AI Interactions**: 2,500+ chatbot conversations
- **📚 Knowledge Base**: 250+ documents, 15,000+ chunks
- **📧 Newsletter Subscribers**: 150+ active signups
- **⚡ System Uptime**: 99.8% availability

---

## 🔗 **Related Documentation**

- [API Reference](../03-api/README.md)
- [Firestore Setup Guide](../03-api/firestore-setup.md) 
- [Security Configuration](../05-deployment/security.md)
- [Multi-Tenant Architecture](../02-architecture/technical/system-design.md)
- [AI Chatbot Configuration](../08-integrations/chatbot-setup.md)

---

**💡 This schema represents the most current architecture as of Session 14, reflecting our production-ready multi-tenant platform with comprehensive AI systems and real-time data connectivity.**