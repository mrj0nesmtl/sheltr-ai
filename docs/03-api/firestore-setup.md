# Firestore Database Setup - Current Implementation & Fixes

## Overview
This guide provides step-by-step instructions for the **current Firestore implementation** as of August 22, 2024, including identified issues and the comprehensive fix plan for Session 13.

**🎯 Last Updated**: August 22, 2024  
**📊 Current Status**: Production with data inconsistencies requiring audit  
**🔗 Data Connectivity**: Partially working with frontend 404 errors  
**🚨 Critical Issues**: Database audit required for Session 12

## 🚨 Current Issues (August 22, 2024)

### **Critical Problems Identified**
1. **Data Discrepancies**: Local vs production environments show different data
2. **Missing Collections**: Some documented collections don't exist in production
3. **Incorrect Indexes**: Firestore indexes don't match current queries
4. **Storage Structure Mismatches**: Firebase Storage organization inconsistent
5. **Frontend 404 Errors**: Dashboard resources failing to load
6. **Real-time Sync Issues**: Donations not updating across components

### **Immediate Action Required**
- **Session 12 Priority**: Comprehensive database audit
- **Data Consistency**: Align local and production environments
- **Collection Standardization**: Ensure all documented collections exist
- **Index Optimization**: Fix Firestore query performance
- **Storage Cleanup**: Organize Firebase Storage structure

---

## 🏗️ Current Firestore Collections (Real Implementation)

### **Collections That Actually Exist**

#### 1. **Shelters** (`shelters/{shelter-id}`)
**Status**: ✅ **EXISTS** - 10 Montreal shelters migrated

```typescript
interface Shelter {
  id: string;                    // "old-brewery-mission"
  name: string;                  // "Old Brewery Mission"
  address: string;               // "902 Saint-Laurent Blvd"
  city: string;                  // "Montreal"
  province: string;              // "Quebec"
  capacity: number;              // 300
  status: 'active' | 'pending' | 'inactive';
  
  // Admin Management
  primary_admin?: {
    user_id: string;
    email: string;
    name: string;
    assigned_at: Timestamp;
    assigned_by: string;
  };
  
  // Contact Information
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  
  // Metadata
  created_at: Timestamp;
  updated_at: Timestamp;
  verification_status: 'verified' | 'pending' | 'unverified';
}
```

#### 2. **Users** (`users/{user-id}`)
**Status**: ✅ **EXISTS** - Universal user management

```typescript
interface User {
  id: string;                   // Firebase Auth UID
  email: string;                // "participant@example.com"
  firstName: string;            // "Michael"
  lastName: string;             // "Rodriguez"
  role: 'super_admin' | 'admin' | 'participant' | 'donor';
  
  // Shelter Association
  shelter_id?: string;          // "old-brewery-mission"
  tenant_id?: string;           // "shelter-old-brewery-mission"
  
  // Status & Activity
  status: 'active' | 'inactive' | 'pending' | 'new' | 'transitioning';
  last_active?: Timestamp;
  
  // Metadata
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

#### 3. **Services** (`services/{service-id}`)
**Status**: ✅ **EXISTS** - Service management

```typescript
interface Service {
  id: string;
  name: string;                 // "Mental Health Counseling"
  description?: string;
  category: string;             // "Healthcare", "Employment", "Housing"
  shelter_id: string;           // "old-brewery-mission"
  tenant_id: string;            // "shelter-old-brewery-mission"
  provider?: string;
  location?: string;
  duration?: number;
  isActive: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

#### 4. **Demo Donations** (`demo_donations/{donation-id}`)
**Status**: ✅ **EXISTS** - Real donation tracking

```typescript
interface DemoDonation {
  id: string;
  participant_id: string;       // "demo-participant-001"
  amount: {
    total: number;              // 100.00
    currency: string;           // "USD"
  };
  status: 'pending' | 'completed' | 'failed';
  donor_info?: {
    name?: string;
    email?: string;
  };
  payment_session_id?: string;  // Adyen session ID
  created_at: Timestamp;
  updated_at: Timestamp;
  completed_at?: Timestamp;
}
```

### **Legacy Collections (Need Migration)**

#### 5. **Tenants** (`tenants/{tenant-id}`)
**Status**: ⚠️ **LEGACY** - Contains old nested structure

```typescript
// OLD STRUCTURE (needs cleanup)
interface LegacyTenant {
  id: string;                   // "Vc48fjy0cajJrstbLQRr"
  platform: {
    shelters: {
      data: {
        [shelterId: string]: ShelterData;  // Nested shelter data
      }
    }
  }
}
```

#### 6. **Demo Participants** (`demo_participants/{participant-id}`)
**Status**: ⚠️ **PARTIAL** - Some data exists, inconsistent

```typescript
interface DemoParticipant {
  id: string;                   // "demo-participant-001"
  firstName: string;            // "Michael"
  lastName: string;             // "Rodriguez"
  age: number;                  // 32
  story: string;                // Participant bio
  shelter_id: string;           // "demo-shelter-001"
  total_received: number;       // 2450.00
  donation_count: number;       // 47
  status: 'active' | 'inactive';
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

---

## 🔧 Current Firestore Rules (Needs Fixing)

### **Current Rules** (Too Permissive)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Basic authentication required
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Issues with Current Rules**
1. **Too Permissive**: All authenticated users can read/write all data
2. **No Role-Based Access**: No shelter-specific data isolation
3. **No Tenant Isolation**: Users can access data from other shelters
4. **Security Risk**: Participants can modify admin data

### **Required Security Rules** (Session 13 Implementation)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Shelter-specific data isolation
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId
        || request.auth.token.role == 'super_admin'
        || (request.auth.token.role == 'admin' 
            && request.auth.token.shelter_id == resource.data.shelter_id);
    }
    
    // Shelter data isolation
    match /shelters/{shelterId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'super_admin'
        || (request.auth.token.role == 'admin' 
            && request.auth.token.shelter_id == shelterId);
    }
    
    // Service data isolation
    match /services/{serviceId} {
      allow read: if request.auth != null
        && request.auth.token.shelter_id == resource.data.shelter_id;
      allow write: if request.auth.token.role in ['super_admin', 'admin']
        && request.auth.token.shelter_id == resource.data.shelter_id;
    }
    
    // Demo donations - participants can read their own
    match /demo_donations/{donationId} {
      allow read: if request.auth != null
        && (request.auth.token.role == 'super_admin'
            || request.auth.token.role == 'admin'
            || resource.data.participant_id == request.auth.uid);
      allow write: if request.auth.token.role in ['super_admin', 'admin'];
    }
    
    // Legacy tenants - read-only for migration
    match /tenants/{tenantId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'super_admin';
    }
  }
}
```

---

## 📊 Current Firestore Indexes (Needs Optimization)

### **Current Indexes** (Incomplete)
```javascript
// firestore.indexes.json (Current State)
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "role", "order": "ASCENDING"},
        {"fieldPath": "shelter_id", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "services",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "shelter_id", "order": "ASCENDING"},
        {"fieldPath": "isActive", "order": "ASCENDING"}
      ]
    }
  ],
  "fieldOverrides": []
}
```

### **Required Indexes** (Session 13 Implementation)
```javascript
// firestore.indexes.json (Complete Implementation)
{
  "indexes": [
    // Users collection indexes
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "role", "order": "ASCENDING"},
        {"fieldPath": "shelter_id", "order": "ASCENDING"},
        {"fieldPath": "status", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "shelter_id", "order": "ASCENDING"},
        {"fieldPath": "role", "order": "ASCENDING"},
        {"fieldPath": "last_active", "order": "DESCENDING"}
      ]
    },
    
    // Services collection indexes
    {
      "collectionGroup": "services",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "shelter_id", "order": "ASCENDING"},
        {"fieldPath": "category", "order": "ASCENDING"},
        {"fieldPath": "isActive", "order": "ASCENDING"}
      ]
    },
    
    // Demo donations collection indexes
    {
      "collectionGroup": "demo_donations",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "participant_id", "order": "ASCENDING"},
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "created_at", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "demo_donations",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "created_at", "order": "DESCENDING"}
      ]
    },
    
    // Shelters collection indexes
    {
      "collectionGroup": "shelters",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "city", "order": "ASCENDING"}
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 🗄️ Firebase Storage Structure (Current State)

### **Storage Bucket**: `sheltr-ai.firebasestorage.app`

#### **Current Organization** (Needs Standardization)
```
📁 Knowledge Base Documents
├── 📄 SmartFund-documentation.pdf
├── 📄 shelter-operations-guide.pdf
└── 📄 participant-support-materials.pdf

📁 Blog Media
├── 🖼️ blog-hero-images/
├── 📄 markdown-posts/
└── 🎥 embedded-media/

📁 User Uploads
├── 📄 participant-documents/
├── 🖼️ profile-photos/
└── 📄 admin-reports/

📁 System Files
├── 📄 service-account-keys/
├── 📄 backup-data/
└── 📄 migration-scripts/
```

### **Storage Issues Identified**
1. **Inconsistent Naming**: Mixed naming conventions
2. **Missing Security Rules**: No proper access control
3. **Unorganized Structure**: Files scattered across buckets
4. **No Version Control**: No backup or versioning system

### **Required Storage Rules** (Session 13 Implementation)
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Knowledge base documents - admin access only
    match /knowledge-base/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role in ['super_admin', 'admin'];
    }
    
    // Blog media - public read, admin write
    match /blog/{document=**} {
      allow read: if true;  // Public read access
      allow write: if request.auth.token.role in ['super_admin', 'admin'];
    }
    
    // User uploads - user-specific access
    match /user-uploads/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId
        || request.auth.token.role in ['super_admin', 'admin'];
    }
    
    // System files - super admin only
    match /system/{document=**} {
      allow read, write: if request.auth.token.role == 'super_admin';
    }
  }
}
```

---

## 🔍 Database Audit Script (Session 13)

### **Audit Script** (`apps/api/scripts/database_audit.py`)
```python
#!/usr/bin/env python3
"""
SHELTR-AI Database Audit Script
Emergency audit and fix for database connectivity issues
"""

import firebase_admin
from firebase_admin import firestore, credentials
from google.cloud import storage
import json
import logging
from typing import Dict, List, Any
import os

class DatabaseAuditor:
    """Comprehensive database audit and fix tool"""
    
    def __init__(self):
        """Initialize Firebase and Storage clients"""
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate('path/to/serviceAccountKey.json')
                firebase_admin.initialize_app(cred)
            
            self.db = firestore.client()
            self.storage_client = storage.Client()
            self.bucket = self.storage_client.bucket('sheltr-ai.firebasestorage.app')
            
            logging.info("✅ Database auditor initialized successfully")
        except Exception as e:
            logging.error(f"❌ Failed to initialize database auditor: {e}")
            raise
    
    def audit_collections(self):
        """Audit all Firestore collections"""
        collections = ['shelters', 'users', 'services', 'demo_donations', 'tenants', 'demo_participants']
        
        for collection_name in collections:
            try:
                docs = self.db.collection(collection_name).stream()
                doc_count = len(list(docs))
                logging.info(f"📊 Collection '{collection_name}': {doc_count} documents")
            except Exception as e:
                logging.error(f"❌ Error auditing collection '{collection_name}': {e}")
    
    def audit_storage_structure(self):
        """Audit Firebase Storage structure"""
        blobs = self.bucket.list_blobs()
        storage_structure = {}
        
        for blob in blobs:
            path_parts = blob.name.split('/')
            if path_parts[0] not in storage_structure:
                storage_structure[path_parts[0]] = []
            storage_structure[path_parts[0]].append(blob.name)
        
        logging.info(f"📁 Storage structure: {json.dumps(storage_structure, indent=2)}")
    
    def create_missing_collections(self):
        """Create missing collections with proper structure"""
        # Implementation for creating missing collections
        pass
    
    def standardize_data_structures(self):
        """Standardize data structures across collections"""
        # Implementation for data standardization
        pass
    
    def run_complete_audit(self):
        """Run complete database audit"""
        logging.info("🔍 Starting comprehensive database audit...")
        
        self.audit_collections()
        self.audit_storage_structure()
        self.create_missing_collections()
        self.standardize_data_structures()
        
        logging.info("✅ Database audit completed")

if __name__ == "__main__":
    auditor = DatabaseAuditor()
    auditor.run_complete_audit()
```

---

## 🚀 Setup Instructions (Session 13 Implementation)

### **1. Update Firestore Rules**
```bash
# Deploy updated security rules
firebase deploy --only firestore:rules
```

### **2. Update Firestore Indexes**
```bash
# Deploy updated indexes
firebase deploy --only firestore:indexes
```

### **3. Update Storage Rules**
```bash
# Deploy updated storage rules
firebase deploy --only storage
```

### **4. Run Database Audit**
```bash
# Run comprehensive audit
cd apps/api
python scripts/database_audit.py --audit-collections
python scripts/database_audit.py --migrate-data
python scripts/database_audit.py --validate-system
```

### **5. Verify Data Consistency**
```bash
# Test all collections exist
firebase firestore:collections

# Test queries work
firebase firestore:indexes
```

---

## 📋 Session 12 Priorities

### **Immediate Actions** (Next Session)
1. **Run Database Audit**: Execute comprehensive audit script
2. **Fix Data Discrepancies**: Align local and production environments
3. **Create Missing Collections**: Ensure all documented collections exist
4. **Standardize Data**: Fix inconsistent field names and types
5. **Update Security Rules**: Implement proper role-based access control
6. **Organize Storage**: Clean up Firebase Storage structure
7. **Fix Frontend 404s**: Resolve dashboard resource loading issues
8. **Test Real-time Updates**: Verify donation data syncs correctly

### **Success Criteria**
- ✅ **All Collections Exist**: Every documented collection is created
- ✅ **Data Consistency**: Local and production environments match
- ✅ **No Frontend 404s**: All dashboard resources load correctly
- ✅ **Real-time Updates**: Donations update across all components
- ✅ **Security Compliance**: Proper role-based access control
- ✅ **Performance**: All queries execute efficiently

---

## 📊 Current Status Summary

**🎯 Database Health**: **70%** (Requires Session 13 Audit)
- ✅ **Core Collections**: Shelters, Users, Services, Demo Donations exist
- ⚠️ **Data Consistency**: Local vs production discrepancies
- ❌ **Security Rules**: Too permissive, need role-based access
- ❌ **Storage Organization**: Inconsistent structure
- ❌ **Frontend Integration**: 404 errors on dashboard resources
- ❌ **Real-time Updates**: Donation data not syncing properly

**🔄 Session 13 Focus**: **Database Audit & Cleanup**
- **Primary Goal**: Resolve all data inconsistencies
- **Secondary Goal**: Implement proper security rules
- **Tertiary Goal**: Optimize performance and real-time updates

---

**This Firestore setup requires immediate attention in Session 13 to resolve critical data inconsistencies and ensure proper system functionality.** 🚨🔧 