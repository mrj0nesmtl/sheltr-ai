# 🔥 Firebase Integration Guide

Complete setup and integration guide for Firebase services in SHELTR-AI.

## 🎯 Firebase Services Used

### Core Services
- **Authentication**: User authentication and authorization
- **Firestore**: NoSQL database for application data
- **Storage**: File storage for documents and media
- **Hosting**: Frontend application hosting
- **Functions**: Serverless backend functions

### Analytics & Monitoring
- **Analytics**: User behavior and engagement tracking
- **Performance Monitoring**: Frontend performance metrics
- **Crashlytics**: Error reporting and crash analytics

## 🚀 Initial Setup

### 1. Firebase Project Creation

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init
```

### 2. Project Configuration

```javascript
// apps/web/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
```

## 🔐 Authentication Setup

### Google OAuth Configuration

```javascript
// apps/web/contexts/AuthContext.tsx
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};
```

### Custom Claims for RBAC

```javascript
// Backend: Set custom claims
const admin = require('firebase-admin');

async function setUserRole(uid, role) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`Role ${role} set for user ${uid}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}
```

## 🗄️ Firestore Integration

### Database Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Shelter data access control
    match /shelters/{shelterId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource.data.adminIds.hasAny([request.auth.uid]) ||
         request.auth.token.role == 'super_admin');
    }
    
    // Donation access control
    match /donations/{donationId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.donorId ||
         request.auth.token.role in ['shelter_admin', 'super_admin']);
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.donorId;
    }
  }
}
```

### Firestore Indexes

```json
{
  "indexes": [
    {
      "collectionGroup": "donations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "shelterId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "services",
      "queryScope": "COLLECTION", 
      "fields": [
        { "fieldPath": "shelterId", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    }
  ]
}
```

## 📁 Storage Configuration

### Storage Rules

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile images
    match /profiles/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Knowledge base documents (admin only)
    match /knowledge-base/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'super_admin';
    }
    
    // Shelter documents
    match /shelters/{shelterId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'super_admin' ||
         request.auth.uid in resource.metadata.adminIds);
    }
  }
}
```

### File Upload Implementation

```typescript
// apps/web/services/storageService.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function uploadFile(
  file: File, 
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
```

## 🌐 Hosting Configuration

### Firebase Hosting Setup

```json
{
  "hosting": {
    "public": "apps/web/out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|ico|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## 📊 Analytics Integration

### Event Tracking

```typescript
// apps/web/lib/analytics.ts
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

export const trackEvent = (eventName: string, parameters?: any) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};

// Usage examples
trackEvent('donation_completed', {
  amount: 50,
  currency: 'CAD',
  shelter_id: 'shelter-123'
});

trackEvent('shelter_viewed', {
  shelter_id: 'shelter-123',
  user_role: 'participant'
});
```

## 🔗 Related Documentation

- [Google Cloud Integration](./google-cloud-integration.md)
- [Database Schema](../07-reference/database-schema.md)
- [Security Configuration](../05-deployment/security.md)
