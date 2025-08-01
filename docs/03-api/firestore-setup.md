# Firestore Database Setup for AI Intelligence

## Overview
This guide provides step-by-step instructions for implementing the AI-optimized database structure in Firebase Firestore.

## Setup Instructions

### 1. Firebase Firestore Configuration

#### Update Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Multi-tenant security - all access must include tenantId
    match /{collection}/{document} {
      allow read, write: if request.auth != null 
        && request.auth.token.tenant_id is string
        && resource.data.tenantId == request.auth.token.tenant_id;
    }
    
    // Organizations - accessible by admins within tenant
    match /organizations/{orgId} {
      allow read, write: if request.auth != null 
        && request.auth.token.tenant_id == resource.data.tenantId
        && (request.auth.token.role == 'super_admin' || 
            request.auth.token.role == 'admin');
    }
    
    // Participants - protected health data
    match /participants/{participantId} {
      allow read: if request.auth != null 
        && request.auth.token.tenant_id == resource.data.tenantId
        && (request.auth.token.role in ['super_admin', 'admin', 'case_worker']);
      
      allow write: if request.auth != null 
        && request.auth.token.tenant_id == resource.data.tenantId
        && request.auth.token.role in ['super_admin', 'admin', 'case_worker']
        && request.auth.token.organization_id == resource.data.organizationId;
    }
    
    // Services - public read for participants
    match /services/{serviceId} {
      allow read: if request.auth != null 
        && request.auth.token.tenant_id == resource.data.tenantId;
      
      allow write: if request.auth != null 
        && request.auth.token.tenant_id == resource.data.tenantId
        && request.auth.token.role in ['super_admin', 'admin'];
    }
    
    // AI Insights - admin access only
    match /ai_insights/{insightId} {
      allow read, write: if request.auth != null 
        && request.auth.token.tenant_id == resource.data.tenantId
        && request.auth.token.role in ['super_admin', 'admin'];
    }
  }
}
```

#### Firestore Indexes
```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "participants",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "tenantId", "order": "ASCENDING"},
        {"fieldPath": "organizationId", "order": "ASCENDING"},
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "riskFactors.riskLevel", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "participants",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "tenantId", "order": "ASCENDING"},
        {"fieldPath": "demographics.ageRange", "order": "ASCENDING"},
        {"fieldPath": "outcomes.exitType", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "services",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "tenantId", "order": "ASCENDING"},
        {"fieldPath": "category", "order": "ASCENDING"},
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "outcomeMetrics.effectivenessRating", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "tenantId", "order": "ASCENDING"},
        {"fieldPath": "organizationId", "order": "ASCENDING"},
        {"fieldPath": "scheduledDate", "order": "ASCENDING"},
        {"fieldPath": "status", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "resources",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "tenantId", "order": "ASCENDING"},
        {"fieldPath": "organizationId", "order": "ASCENDING"},
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "usage.predictedExhaustionDate", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "ai_insights",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "tenantId", "order": "ASCENDING"},
        {"fieldPath": "type", "order": "ASCENDING"},
        {"fieldPath": "priority", "order": "DESCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 2. TypeScript Interfaces

Create the type definitions for your application:

```typescript
// types/database.ts
import { Timestamp } from 'firebase/firestore';

// Base interface for all documents
interface BaseDocument {
  id: string;
  tenantId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Re-export all interfaces from schema
export interface Organization extends BaseDocument {
  name: string;
  slug: string;
  type: 'shelter' | 'outreach' | 'support_center';
  status: 'active' | 'inactive' | 'pending';
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  // ... rest of Organization interface
}

export interface Participant extends BaseDocument {
  organizationId: string;
  personalInfo: {
    firstName: string;  // Should be encrypted in production
    lastName: string;   // Should be encrypted in production
    dateOfBirth: string; // Should be encrypted in production
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
    pronouns?: string;
  };
  // ... rest of Participant interface
}

// Add other interfaces...
```

### 3. Data Access Layer

Create service classes for database operations:

```typescript
// services/database/OrganizationService.ts
import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Organization } from '@/types/database';

export class OrganizationService {
  private collectionName = 'organizations';

  async getByTenant(tenantId: string): Promise<Organization[]> {
    const q = query(
      collection(db, this.collectionName),
      where('tenantId', '==', tenantId),
      where('status', '==', 'active'),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Organization));
  }

  async getById(id: string): Promise<Organization | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Organization;
    }
    return null;
  }

  async create(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, this.collectionName), docData);
    return docRef.id;
  }

  async update(id: string, data: Partial<Organization>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // AI-specific queries
  async getForAIAnalysis(tenantId: string): Promise<Organization[]> {
    const q = query(
      collection(db, this.collectionName),
      where('tenantId', '==', tenantId),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Organization));
  }
}
```

### 4. AI Data Pipeline

Set up data processing for AI consumption:

```typescript
// services/ai/DataProcessor.ts
export class AIDataProcessor {
  
  // Anonymize participant data for AI analysis
  static anonymizeParticipant(participant: Participant) {
    return {
      id: participant.id,
      tenantId: participant.tenantId,
      organizationId: participant.organizationId,
      demographics: participant.demographics,
      status: participant.status,
      riskFactors: participant.riskFactors,
      engagement: participant.engagement,
      outcomes: participant.outcomes,
      // Remove all personally identifiable information
      checkInDate: participant.checkInDate,
      estimatedCheckOut: participant.estimatedCheckOut
    };
  }

  // Prepare occupancy data for forecasting
  static prepareOccupancyData(participants: Participant[], timeRange: number = 90) {
    const now = new Date();
    const startDate = new Date(now.getTime() - (timeRange * 24 * 60 * 60 * 1000));
    
    return participants
      .filter(p => p.checkInDate.toDate() >= startDate)
      .map(p => ({
        checkInDate: p.checkInDate.toDate(),
        ageRange: p.demographics.ageRange,
        hasChildren: p.demographics.hasChildren,
        riskLevel: p.riskFactors.riskLevel,
        stayDuration: p.estimatedCheckOut ? 
          (p.estimatedCheckOut.toDate().getTime() - p.checkInDate.toDate().getTime()) / (1000 * 60 * 60 * 24) : 
          null
      }));
  }

  // Extract service patterns for optimization
  static analyzeServicePatterns(appointments: Appointment[]) {
    const patterns = {
      byCategory: {} as Record<string, number>,
      byDayOfWeek: Array(7).fill(0),
      byTimeOfDay: Array(24).fill(0),
      completionRates: {} as Record<string, number>
    };

    appointments.forEach(apt => {
      const date = apt.scheduledDate.toDate();
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      
      patterns.byDayOfWeek[dayOfWeek]++;
      patterns.byTimeOfDay[hour]++;
      
      // Add category analysis logic
      // Add completion rate logic
    });

    return patterns;
  }
}
```

### 5. Real-time AI Insights

Set up Cloud Functions for real-time AI processing:

```typescript
// functions/src/ai-insights.ts
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';

export const generateParticipantInsights = onDocumentWritten(
  'participants/{participantId}',
  async (event) => {
    const participantData = event.data?.after?.data();
    if (!participantData) return;

    const db = getFirestore();
    
    // Generate risk assessment
    const riskScore = calculateRiskScore(participantData);
    
    // Create AI insight
    const insight = {
      tenantId: participantData.tenantId,
      organizationId: participantData.organizationId,
      type: 'participant_risk',
      category: 'participant_care',
      priority: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
      insight: {
        title: `Risk Assessment for Participant ${event.params.participantId}`,
        description: `AI analysis indicates ${riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low'} risk level`,
        confidence: 85,
        dataPoints: ['attendance_rate', 'service_engagement', 'health_factors'],
        methodology: 'gradient_boosting_classifier'
      },
      recommendations: generateRecommendations(participantData, riskScore),
      relatedEntities: {
        participants: [event.params.participantId]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('ai_insights').add(insight);
  }
);

function calculateRiskScore(participant: any): number {
  // Implement your AI risk calculation logic
  let score = 0;
  
  // Attendance factor
  if (participant.engagement?.attendanceRate < 70) score += 0.3;
  
  // Health factors
  if (participant.health?.mentalHealthSupport) score += 0.2;
  if (participant.health?.substanceAbuseHistory) score += 0.3;
  
  // Demographics
  if (participant.demographics?.ageRange === '18-25') score += 0.1;
  
  return Math.min(score, 1.0);
}

function generateRecommendations(participant: any, riskScore: number) {
  const recommendations = [];
  
  if (riskScore > 0.7) {
    recommendations.push({
      action: 'Schedule immediate case worker meeting',
      impact: 'high',
      effort: 'low',
      timeframe: 'immediate',
      expectedOutcome: 'Assess immediate needs and safety'
    });
  }
  
  if (participant.engagement?.attendanceRate < 50) {
    recommendations.push({
      action: 'Implement engagement intervention',
      impact: 'medium',
      effort: 'medium',
      timeframe: 'short-term',
      expectedOutcome: 'Improve program participation'
    });
  }
  
  return recommendations;
}
```

### 6. Data Migration Script

Create a script to migrate existing data:

```typescript
// scripts/migrate-to-ai-schema.ts
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function migrateData() {
  const db = getFirestore();
  
  // Migrate users to participants
  const usersSnapshot = await db.collection('users')
    .where('role', '==', 'participant')
    .get();
  
  const batch = db.batch();
  
  usersSnapshot.docs.forEach(doc => {
    const userData = doc.data();
    
    // Transform user data to participant schema
    const participantData = {
      tenantId: userData.tenantId || 'default',
      organizationId: userData.shelterId || 'default-shelter',
      personalInfo: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth || '1990-01-01',
        gender: userData.gender || 'prefer-not-to-say'
      },
      status: 'active',
      checkInDate: userData.createdAt,
      demographics: {
        ageRange: calculateAgeRange(userData.dateOfBirth),
        hasChildren: false,
        isVeteran: false,
        hasDisability: false,
        primaryLanguage: 'en'
      },
      health: {
        hasAllergies: false,
        hasMedicalConditions: false,
        needsMedication: false,
        mentalHealthSupport: false,
        substanceAbuseHistory: false
      },
      services: {
        enrolled: [],
        completed: [],
        requested: []
      },
      riskFactors: {
        riskLevel: 'low',
        factors: [],
        interventions: [],
        lastAssessment: new Date(),
        aiConfidence: 0
      },
      engagement: {
        lastActivity: new Date(),
        attendanceRate: 100,
        programParticipation: 0,
        communicationPreference: 'email'
      },
      consent: {
        dataSharing: true,
        aiAnalysis: true,
        followUpContact: true,
        grantedAt: new Date()
      },
      createdAt: userData.createdAt,
      updatedAt: new Date(),
      createdBy: userData.createdBy || 'system'
    };
    
    const newParticipantRef = db.collection('participants').doc();
    batch.set(newParticipantRef, participantData);
  });
  
  await batch.commit();
  console.log(`Migrated ${usersSnapshot.size} participants`);
}

function calculateAgeRange(dateOfBirth: string): string {
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  if (age < 26) return '18-25';
  if (age < 36) return '26-35';
  if (age < 51) return '36-50';
  if (age < 66) return '51-65';
  return '65+';
}

// Run migration
migrateData().catch(console.error);
```

## Next Steps

1. **Deploy Firestore Rules**: Update your Firebase console with the new security rules
2. **Create Indexes**: Apply the composite indexes for optimal AI query performance
3. **Implement Services**: Add the data access layer services to your application
4. **Set up Cloud Functions**: Deploy AI processing functions for real-time insights
5. **Migrate Data**: Run the migration script to transform existing data
6. **Test AI Queries**: Verify that AI-optimized queries work correctly

This structure provides a solid foundation for AI-powered insights while maintaining security and privacy compliance. 