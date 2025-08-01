# SHELTR-AI Database Schema for AI Intelligence

## Overview
This document outlines the comprehensive database structure designed to enable AI-powered insights, recommendations, and intelligent automation for the SHELTR-AI platform.

## Core Design Principles

### 1. AI-First Architecture
- **Structured for Machine Learning**: All data points are designed for easy AI consumption
- **Vectorized Search**: Enable semantic search across all content
- **Pattern Recognition**: Structure supports trend analysis and predictive modeling
- **Real-time Analytics**: Optimized for live AI-driven insights

### 2. Multi-Tenant Security
- **Tenant Isolation**: All data scoped by `tenantId` for security
- **Role-Based Access**: Granular permissions per user type
- **Data Privacy**: GDPR/HIPAA compliant structure

---

## Collections Structure

### 1. **Organizations** (`organizations`)
Root-level shelter organizations and their configurations.

```typescript
interface Organization {
  // Core Identification
  id: string;                    // Auto-generated document ID
  tenantId: string;             // Multi-tenant isolation key
  
  // Basic Information
  name: string;                 // "Downtown Hope Shelter"
  slug: string;                 // "downtown-hope" (URL-friendly)
  type: 'shelter' | 'outreach' | 'support_center';
  status: 'active' | 'inactive' | 'pending';
  
  // Location & Contact
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
  contact: {
    phone: string;
    email: string;
    website?: string;
    emergencyPhone?: string;
  };
  
  // Operational Details
  capacity: {
    totalBeds: number;
    emergencyBeds: number;
    familyRooms: number;
    accessibleBeds: number;
  };
  hours: {
    checkIn: string;            // "20:00"
    checkOut: string;           // "07:00"
    officeHours: {
      open: string;
      close: string;
    };
    isAlwaysOpen: boolean;
  };
  
  // AI-Optimized Data
  description: string;          // Full description for AI context
  mission: string;             // Mission statement
  services: string[];          // Array of service IDs
  tags: string[];              // For AI categorization
  aiSummary?: string;          // AI-generated summary
  
  // Public Page Configuration
  publicPage: {
    isEnabled: boolean;
    customUrl?: string;         // Custom domain
    qrCode: string;            // Generated QR code URL
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    photos: Array<{
      id: string;
      url: string;
      caption: string;
      isPublic: boolean;
      aiDescription?: string;    // AI-generated image description
    }>;
  };
  
  // Analytics & AI Insights
  metrics: {
    averageStay: number;        // Days
    occupancyRate: number;      // 0-100
    successRate: number;        // 0-100 (positive outcomes)
    satisfactionScore: number;  // 1-5
  };
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;           // User ID
}
```

### 2. **Participants** (`participants`)
Individual people receiving shelter services.

```typescript
interface Participant {
  // Core Identity (PRIVACY PROTECTED)
  id: string;
  tenantId: string;
  organizationId: string;       // Which shelter
  
  // Personal Information (ENCRYPTED)
  personalInfo: {
    firstName: string;          // Encrypted
    lastName: string;           // Encrypted
    dateOfBirth: string;        // Encrypted (YYYY-MM-DD)
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
    pronouns?: string;
    emergencyContact?: {        // Encrypted
      name: string;
      phone: string;
      relationship: string;
    };
  };
  
  // Shelter Status
  status: 'active' | 'transitioning' | 'completed' | 'inactive';
  checkInDate: Timestamp;
  estimatedCheckOut?: Timestamp;
  bedAssignment?: {
    bedNumber: string;
    roomType: 'dormitory' | 'private' | 'family' | 'accessible';
    assignedDate: Timestamp;
  };
  
  // AI-Optimized Demographics (ANONYMIZED)
  demographics: {
    ageRange: '18-25' | '26-35' | '36-50' | '51-65' | '65+';
    hasChildren: boolean;
    isVeteran: boolean;
    hasDisability: boolean;
    primaryLanguage: string;
    educationLevel?: string;
    employmentStatus?: string;
  };
  
  // Health & Wellness (PROTECTED)
  health: {
    hasAllergies: boolean;
    hasMedicalConditions: boolean;
    needsMedication: boolean;
    mobilityNeeds?: string;
    dietaryRestrictions?: string[];
    mentalHealthSupport: boolean;
    substanceAbuseHistory: boolean;
    // Note: Specific details stored in separate protected collection
  };
  
  // Service History & AI Insights
  services: {
    enrolled: string[];         // Service IDs currently enrolled
    completed: string[];        // Service IDs completed
    requested: string[];        // Service IDs requested/waitlisted
  };
  progress: {
    housingSearchStatus: 'not-started' | 'active' | 'pending-approval' | 'completed';
    employmentStatus: 'unemployed' | 'job-searching' | 'part-time' | 'full-time';
    goals: Array<{
      id: string;
      description: string;
      status: 'active' | 'completed' | 'paused';
      targetDate?: Timestamp;
      progress: number;         // 0-100
    }>;
  };
  
  // AI Risk Assessment
  riskFactors: {
    riskLevel: 'low' | 'medium' | 'high';
    factors: string[];          // AI-identified risk factors
    interventions: string[];    // Recommended interventions
    lastAssessment: Timestamp;
    aiConfidence: number;       // 0-100
  };
  
  // Activity & Engagement
  engagement: {
    lastActivity: Timestamp;
    attendanceRate: number;     // 0-100
    programParticipation: number; // 0-100
    communicationPreference: 'email' | 'sms' | 'phone' | 'in-person';
  };
  
  // Outcome Tracking
  outcomes: {
    exitType?: 'permanent-housing' | 'transitional-housing' | 'family-reunification' | 'treatment-program' | 'other';
    exitDate?: Timestamp;
    followUpStatus?: 'stable' | 'at-risk' | 'returned' | 'unknown';
    successMetrics?: {
      housing: boolean;
      employment: boolean;
      healthcare: boolean;
      stability: number;        // 1-10 scale
    };
  };
  
  // Privacy & Compliance
  consent: {
    dataSharing: boolean;
    aiAnalysis: boolean;
    followUpContact: boolean;
    grantedAt: Timestamp;
  };
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

### 3. **Services** (`services`)
Available programs and support services.

```typescript
interface Service {
  id: string;
  tenantId: string;
  organizationId: string;
  
  // Service Definition
  name: string;                 // "Mental Health Counseling"
  category: 'healthcare' | 'mental-health' | 'employment' | 'housing' | 'legal' | 'education' | 'financial' | 'basic-needs';
  subcategory?: string;         // "Individual Therapy"
  description: string;
  
  // Delivery Details
  deliveryMethod: 'in-person' | 'virtual' | 'hybrid' | 'group' | 'one-on-one';
  duration: {
    typical: number;            // Minutes per session
    total?: number;             // Total program length in days
  };
  capacity: {
    maxParticipants: number;
    currentEnrolled: number;
    waitlistCount: number;
  };
  
  // Scheduling
  schedule: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'as-needed';
    daysOfWeek: number[];       // [0,1,2,3,4,5,6] Sunday=0
    timeSlots: Array<{
      start: string;            // "09:00"
      end: string;              // "10:00"
      maxParticipants: number;
    }>;
  };
  
  // Requirements & Eligibility
  requirements: {
    ageMin?: number;
    ageMax?: number;
    genderRestriction?: string;
    prerequisites?: string[];
    documentation?: string[];
  };
  
  // Provider Information
  providers: Array<{
    id: string;
    name: string;
    role: string;
    credentials?: string[];
    contactInfo?: {
      email: string;
      phone?: string;
    };
  }>;
  
  // AI Optimization
  aiTags: string[];             // For AI matching
  outcomeMetrics: {
    completionRate: number;     // 0-100
    satisfactionScore: number;  // 1-5
    effectivenessRating: number; // 1-10
  };
  
  // Status & Availability
  status: 'active' | 'paused' | 'full' | 'cancelled';
  isPublic: boolean;           // Show on public page
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4. **Appointments** (`appointments`)
Scheduled service appointments and sessions.

```typescript
interface Appointment {
  id: string;
  tenantId: string;
  organizationId: string;
  
  // Core Appointment Data
  participantId: string;
  serviceId: string;
  providerId?: string;
  
  // Scheduling
  scheduledDate: Timestamp;
  duration: number;             // Minutes
  location: {
    type: 'on-site' | 'off-site' | 'virtual';
    room?: string;
    address?: string;
    virtualLink?: string;
  };
  
  // Status Tracking
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  attendanceStatus?: 'present' | 'late' | 'absent' | 'excused';
  
  // Session Details
  sessionData?: {
    notes: string;              // Provider notes
    objectives: string[];       // Session goals
    outcomes: string[];         // Achieved outcomes
    nextSteps: string[];        // Action items
    participantFeedback?: {
      rating: number;           // 1-5
      comments?: string;
    };
    providerAssessment?: {
      progress: number;         // 1-10
      engagement: number;       // 1-10
      recommendations: string[];
    };
  };
  
  // AI Insights
  aiAnalysis?: {
    sentimentScore: number;     // -1 to 1
    riskIndicators: string[];
    progressPrediction: number; // 0-100
    recommendedActions: string[];
  };
  
  // Follow-up
  followUp?: {
    required: boolean;
    scheduledDate?: Timestamp;
    type: 'phone' | 'in-person' | 'check-in';
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

### 5. **Resources** (`resources`)
Inventory and resource management.

```typescript
interface Resource {
  id: string;
  tenantId: string;
  organizationId: string;
  
  // Resource Identification
  name: string;                 // "Bed Linens"
  category: 'bedding' | 'food' | 'clothing' | 'hygiene' | 'medical' | 'cleaning' | 'office' | 'other';
  subcategory?: string;         // "Sheets & Pillowcases"
  sku?: string;                // Internal tracking code
  
  // Inventory Management
  inventory: {
    currentStock: number;
    targetStock: number;
    minimumStock: number;
    unit: string;               // "pieces", "boxes", "kg"
    location?: string;          // Storage location
  };
  
  // Financial Tracking
  cost: {
    unitCost: number;           // Cost per unit
    totalValue: number;         // Current inventory value
    currency: string;           // "CAD"
    lastUpdated: Timestamp;
  };
  
  // Supply Chain
  supplier: {
    name?: string;
    contact?: string;
    type: 'donation' | 'purchase' | 'government' | 'community';
    lastOrderDate?: Timestamp;
    leadTime?: number;          // Days
  };
  
  // Usage Analytics
  usage: {
    monthlyConsumption: number;
    seasonalVariation?: number; // Multiplier for seasonal needs
    lastRestocked: Timestamp;
    predictedExhaustionDate?: Timestamp;
  };
  
  // AI Optimization
  aiInsights: {
    demandForecast: number[];   // Next 12 months
    optimalOrderQuantity: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  };
  
  // Status
  status: 'available' | 'low-stock' | 'out-of-stock' | 'discontinued';
  isEssential: boolean;         // Critical for operations
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 6. **Donations** (`donations`)
Financial and in-kind donation tracking.

```typescript
interface Donation {
  id: string;
  tenantId: string;
  organizationId: string;
  
  // Donor Information (May be anonymous)
  donor: {
    type: 'individual' | 'organization' | 'government' | 'foundation' | 'anonymous';
    name?: string;
    email?: string;
    phone?: string;
    address?: Address;
    isRecurring: boolean;
    donorId?: string;           // Reference to donor profile
  };
  
  // Donation Details
  donation: {
    type: 'monetary' | 'goods' | 'services' | 'time';
    amount?: number;            // For monetary donations
    currency?: string;
    items?: Array<{            // For in-kind donations
      description: string;
      quantity: number;
      estimatedValue: number;
      category: string;
    }>;
    services?: Array<{         // For service donations
      description: string;
      hours: number;
      valuePerHour: number;
    }>;
  };
  
  // Processing & Allocation
  processing: {
    status: 'received' | 'processing' | 'allocated' | 'completed';
    receivedDate: Timestamp;
    processedDate?: Timestamp;
    allocation: {
      operations: number;       // Percentage
      programs: number;
      administration: number;
      reserve: number;
    };
  };
  
  // Tax & Compliance
  tax: {
    isReceiptRequested: boolean;
    receiptIssued?: boolean;
    receiptNumber?: string;
    taxDeductibleAmount: number;
  };
  
  // AI Analytics
  aiInsights: {
    donorRetentionProbability: number; // 0-100
    suggestedFollowUpDate?: Timestamp;
    donorSegment: string;
    valueScore: number;         // 1-10
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 7. **AI_Insights** (`ai_insights`)
AI-generated insights and recommendations.

```typescript
interface AIInsight {
  id: string;
  tenantId: string;
  organizationId: string;
  
  // Insight Classification
  type: 'occupancy_prediction' | 'resource_alert' | 'participant_risk' | 'service_optimization' | 'donation_opportunity';
  category: 'operational' | 'financial' | 'participant_care' | 'strategic';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // AI Analysis
  insight: {
    title: string;
    description: string;
    confidence: number;         // 0-100
    dataPoints: string[];       // Source data references
    methodology: string;        // AI model used
  };
  
  // Recommendations
  recommendations: Array<{
    action: string;
    impact: 'low' | 'medium' | 'high';
    effort: 'low' | 'medium' | 'high';
    timeframe: 'immediate' | 'short-term' | 'long-term';
    expectedOutcome: string;
  }>;
  
  // Implementation Tracking
  implementation: {
    status: 'new' | 'reviewed' | 'in-progress' | 'completed' | 'dismissed';
    assignedTo?: string;
    startDate?: Timestamp;
    completionDate?: Timestamp;
    notes?: string;
  };
  
  // Validation & Learning
  validation: {
    wasAccurate?: boolean;
    actualOutcome?: string;
    feedback?: string;
    modelImprovement?: string;
  };
  
  // Context & References
  relatedEntities: {
    participants?: string[];
    services?: string[];
    resources?: string[];
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt?: Timestamp;        // Auto-cleanup old insights
}
```

---

## AI Indexing Strategy

### 1. **Search Indexes**
```typescript
// Composite indexes for AI queries
const searchIndexes = [
  // Participant insights
  ['tenantId', 'organizationId', 'status', 'riskLevel'],
  ['tenantId', 'demographics.ageRange', 'outcomes.exitType'],
  
  // Service optimization
  ['tenantId', 'category', 'status', 'outcomeMetrics.effectivenessRating'],
  ['organizationId', 'schedule.daysOfWeek', 'capacity.currentEnrolled'],
  
  // Resource management
  ['tenantId', 'category', 'status', 'inventory.currentStock'],
  ['organizationId', 'usage.predictedExhaustionDate'],
  
  // AI insights
  ['tenantId', 'type', 'priority', 'implementation.status'],
  ['organizationId', 'category', 'createdAt']
];
```

### 2. **AI Query Patterns**
```typescript
// Common AI queries for intelligent recommendations
const aiQueryPatterns = {
  // Predictive Analytics
  occupancyForecast: {
    collections: ['participants', 'appointments', 'ai_insights'],
    timeRange: '90_days',
    factors: ['historical_occupancy', 'seasonal_trends', 'service_demand']
  },
  
  // Risk Assessment
  participantRisk: {
    collections: ['participants', 'appointments', 'services'],
    indicators: ['attendance_rate', 'service_engagement', 'health_factors'],
    updateFrequency: 'daily'
  },
  
  // Resource Optimization
  inventoryOptimization: {
    collections: ['resources', 'participants', 'donations'],
    factors: ['usage_patterns', 'occupancy_trends', 'seasonal_demand'],
    alertThresholds: { low: 0.2, critical: 0.1 }
  }
};
```

---

## Data Privacy & Security

### 1. **Encryption Levels**
- **Level 1 (Public)**: Organization info, services, resources
- **Level 2 (Protected)**: Participant demographics (anonymized)
- **Level 3 (Encrypted)**: Personal information, health data
- **Level 4 (Vault)**: Sensitive documents, emergency contacts

### 2. **AI Ethics Framework**
- **Bias Detection**: Regular audits of AI recommendations
- **Transparency**: All AI decisions must be explainable
- **Consent Management**: Granular opt-in/opt-out for AI analysis
- **Data Minimization**: Only collect data necessary for AI insights

---

## Implementation Recommendations

### 1. **Phase 1: Core Collections**
- Organizations, Participants, Services, Appointments
- Basic AI insights for occupancy and resource management

### 2. **Phase 2: Advanced Analytics**
- Resource optimization and donation tracking
- Predictive models for participant outcomes

### 3. **Phase 3: Full AI Integration**
- Real-time recommendations and automated insights
- Cross-organizational pattern recognition
- Predictive intervention suggestions

This schema enables powerful AI capabilities while maintaining strict privacy and security standards. The AI can analyze patterns, predict needs, and recommend interventions while keeping personal data protected. 