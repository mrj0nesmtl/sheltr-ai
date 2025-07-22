# 🔄 Migration from Supabase to Firebase

**Complete Guide for Migrating Legacy SHELTR to SHELTR-AI**

*Target: Supabase → Firebase/FastAPI Multi-Tenant Architecture*  
*Timeline: 4 weeks recommended*  
*Status: Ready for implementation*

---

## 📋 Migration Overview

### Why We're Migrating

The original SHELTR platform was built on Supabase with a single-tenant architecture. We're migrating to Firebase/FastAPI for several critical reasons:

1. **Database Loss**: Original Supabase database became inaccessible due to account issues
2. **Multi-Tenant Requirements**: Need to support unlimited shelters with data isolation
3. **Scalability**: Global deployment with auto-scaling capabilities  
4. **Mobile-First**: Native iOS/Android apps with offline capabilities
5. **Blockchain Integration**: Full token system with smart contracts
6. **Enterprise Features**: Advanced security, monitoring, and analytics

### Migration Benefits

| Aspect | Legacy SHELTR (Supabase) | SHELTR-AI (Firebase/FastAPI) |
|--------|--------------------------|-------------------------------|
| **Architecture** | Single-tenant monolith | Multi-tenant SaaS |
| **Database** | PostgreSQL (Supabase) | Firestore (real-time, NoSQL) |
| **Backend** | Supabase Edge Functions | FastAPI + Python 3.11 |
| **Authentication** | Supabase Auth | Firebase Auth + custom claims |
| **Storage** | Supabase Storage | Firebase Storage + Cloud Storage |
| **Deployment** | Vercel + Supabase | Google Cloud Run + Firebase Hosting |
| **Mobile** | Responsive web only | Native iOS/Android apps |
| **Blockchain** | Basic integration | Full token system |
| **Scalability** | Limited | Unlimited global scale |

---

## 🗂️ Data Migration Strategy

### Data Loss Assessment

Since the original Supabase database is inaccessible, we're implementing a **fresh start strategy** with improved data architecture:

#### Lost Data (Cannot Migrate)
- User accounts and profiles
- Donation history and transactions  
- QR code assignments
- Shelter registrations
- Analytics and reporting data

#### Preserved Assets (Can Migrate)
- Application code structure
- UI/UX design patterns
- Business logic and workflows
- Documentation and specifications
- Learned requirements and feedback

### New Data Architecture

#### Firestore Multi-Tenant Structure
```
Firebase Project: sheltr-ai-production
├── tenants/
│   ├── platform/                    # SHELTR platform administration
│   │   ├── users/                   # SuperAdmin users
│   │   ├── system_settings/         # Global configuration
│   │   └── analytics/              # Platform-wide metrics
│   │
│   ├── shelter-{id}/                # Individual shelter tenants
│   │   ├── users/                   # Shelter staff (Admin role)
│   │   ├── participants/            # Donation recipients
│   │   ├── donations/               # Shelter-specific donations
│   │   ├── qr_codes/               # QR code management
│   │   └── analytics/              # Shelter metrics
│   │
│   ├── participant-network/         # Independent participants
│   │   ├── users/                   # Non-shelter participants
│   │   ├── qr_codes/               # Personal QR codes
│   │   ├── donations_received/      # Direct donations
│   │   └── verification/           # Identity verification
│   │
│   └── donor-network/              # Donor community
│       ├── users/                  # Donor profiles
│       ├── donation_history/       # Cross-platform donations
│       ├── impact_tracking/        # Personal impact metrics
│       └── social_features/        # Community engagement
│
└── public/                         # Cross-tenant public data
    ├── shelter_directory/          # Public shelter listings
    ├── impact_metrics/             # Public impact data
    └── qr_verification/            # QR code validation
```

---

## 🏗️ Architecture Migration

### Backend Migration

#### From: Supabase Edge Functions
```typescript
// Legacy Supabase Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )
  
  // Single-tenant queries
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    
  return new Response(JSON.stringify({ data }))
})
```

#### To: FastAPI Multi-Tenant
```python
# New FastAPI multi-tenant backend
from fastapi import FastAPI, Depends, Header
from services.tenant_service import TenantService
from services.auth_service import AuthService

app = FastAPI(title="SHELTR-AI API", version="2.0.0")

@app.get("/participants/")
async def get_participants(
    tenant_id: str = Header(alias="X-Tenant-ID"),
    current_user: User = Depends(get_current_user),
    tenant_service: TenantService = Depends()
):
    # Multi-tenant data isolation
    collection_path = tenant_service.get_collection_path(tenant_id, "participants")
    participants = await get_participants_from_firestore(collection_path)
    return {"success": True, "data": participants}
```

### Database Migration

#### Schema Transformation

**Supabase SQL → Firestore NoSQL**

```sql
-- Legacy Supabase schema
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    qr_code_hash VARCHAR UNIQUE,
    shelter_id UUID REFERENCES shelters(id),
    created_at TIMESTAMP DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES participants(id),
    donor_id UUID REFERENCES auth.users(id),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

```typescript
// New Firestore structure
interface Participant {
  id: string;
  name: string;
  qrCodeHash: string;
  shelterId?: string;  // Optional for independent participants
  tenantId: string;    // Multi-tenant isolation
  walletAddress: string; // Blockchain wallet
  verified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Donation {
  id: string;
  participantId: string;
  donorId: string;
  amount: number;
  currency: string;
  blockchainTx?: string;  // Blockchain transaction hash
  distribution: {
    toParticipant: number;   // 80%
    toHousingFund: number;   // 15%  
    toOperations: number;    // 5%
  };
  tenantId: string;
  createdAt: Timestamp;
}
```

### Authentication Migration

#### From: Supabase Auth
```typescript
// Legacy Supabase authentication
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// Basic authentication
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Simple role checking
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()
```

#### To: Firebase Auth + Custom Claims
```typescript
// New Firebase authentication with multi-tenant RBAC
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

// Authentication with custom claims
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

// Get custom claims for role/tenant validation
const idTokenResult = await user.getIdTokenResult();
const customClaims = idTokenResult.claims;

// Multi-tenant role validation
if (customClaims.role && customClaims.tenant_id) {
  // User has proper access
  setCurrentUser({
    ...user,
    role: customClaims.role,
    tenantId: customClaims.tenant_id,
    permissions: customClaims.permissions
  });
}
```

---

## 📱 Frontend Migration

### React Component Updates

#### From: Supabase Realtime
```typescript
// Legacy real-time subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('donations')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'donations'
    }, (payload) => {
      setDonations(prev => [...prev, payload.new]);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

#### To: Firestore Real-time + Multi-Tenant
```typescript
// New Firestore real-time with tenant isolation
import { onSnapshot, collection } from 'firebase/firestore';
import { useTenant } from '../contexts/TenantContext';

const { tenantId } = useTenant();

useEffect(() => {
  const collectionPath = `tenants/${tenantId}/donations`;
  const unsubscribe = onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const donations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(donations);
    }
  );

  return unsubscribe;
}, [tenantId]);
```

### State Management Migration

#### From: Simple State
```typescript
// Legacy state management
const [user, setUser] = useState(null);
const [donations, setDonations] = useState([]);
const [participants, setParticipants] = useState([]);
```

#### To: Zustand + Multi-Tenant
```typescript
// New Zustand store with tenant context
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SheltrStore {
  user: User | null;
  tenantId: string;
  tenantConfig: TenantConfig | null;
  donations: Donation[];
  participants: Participant[];
  
  setUser: (user: User) => void;
  setTenantId: (tenantId: string) => void;
  switchTenant: (tenantId: string) => Promise<void>;
  addDonation: (donation: Donation) => void;
}

export const useSheltrStore = create<SheltrStore>()(
  persist(
    (set, get) => ({
      user: null,
      tenantId: 'platform',
      tenantConfig: null,
      donations: [],
      participants: [],
      
      switchTenant: async (newTenantId: string) => {
        const config = await fetchTenantConfig(newTenantId);
        set({ 
          tenantId: newTenantId, 
          tenantConfig: config,
          donations: [],  // Clear tenant-specific data
          participants: []
        });
      },
      // ... other actions
    }),
    {
      name: 'sheltr-store',
      partialize: (state) => ({ 
        user: state.user, 
        tenantId: state.tenantId 
      })
    }
  )
);
```

---

## 🔐 Security Migration

### From: Row Level Security (RLS)
```sql
-- Legacy Supabase RLS policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Shelter admins can manage participants" ON participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM shelter_admins 
      WHERE user_id = auth.uid() 
      AND shelter_id = participants.shelter_id
    )
  );
```

### To: Firestore Security Rules + Multi-Tenant
```javascript
// New Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Multi-tenant data access
    match /tenants/{tenantId}/{collection}/{document=**} {
      allow read, write: if request.auth != null
        && request.auth.token.tenant_id == tenantId
        && hasValidRole(tenantId, request.auth.token.role);
    }

    // Platform admin access
    match /system/{document=**} {
      allow read, write: if request.auth != null
        && request.auth.token.role == 'super_admin'
        && request.auth.token.tenant_id == 'platform';
    }

    function hasValidRole(tenantId, role) {
      return role in ['super_admin', 'admin', 'participant', 'donor']
        && exists(/databases/$(database)/documents/tenants/$(tenantId)/users/$(request.auth.uid));
    }
  }
}
```

---

## 🚀 Deployment Migration

### From: Vercel + Supabase
```yaml
# Legacy deployment
frontend:
  platform: Vercel
  framework: Next.js
  database: Supabase (PostgreSQL)
  auth: Supabase Auth
  storage: Supabase Storage
  
backend:
  platform: Supabase Edge Functions
  runtime: Deno
  database: Direct Supabase connection
```

### To: Google Cloud + Firebase
```yaml
# New deployment architecture
frontend_web:
  platform: Firebase Hosting
  framework: Next.js 15
  database: Firestore
  auth: Firebase Auth
  storage: Firebase Storage
  
frontend_mobile:
  platform: Expo Application Services (EAS)
  framework: React Native + Expo
  stores: Apple App Store + Google Play Store
  
backend:
  platform: Google Cloud Run
  framework: FastAPI + Python 3.11
  container: Docker
  scaling: 0-100 instances
  database: Firestore
  
blockchain:
  network: Ethereum/Polygon
  contracts: Verified smart contracts
  wallets: Multi-signature support
```

---

## ⏱️ Migration Timeline

### Phase 1: Infrastructure Setup (Week 1)
```
Days 1-2: Firebase Project Setup
- [ ] Create Firebase project
- [ ] Configure Firestore database
- [ ] Set up authentication
- [ ] Configure security rules

Days 3-4: FastAPI Backend Setup  
- [ ] Initialize FastAPI project
- [ ] Implement multi-tenant routing
- [ ] Set up authentication middleware
- [ ] Create basic API endpoints

Days 5-7: Development Environment
- [ ] Set up local development
- [ ] Configure CI/CD pipelines
- [ ] Set up testing framework
- [ ] Documentation setup
```

### Phase 2: Core Migration (Week 2)
```
Days 8-10: User System Migration
- [ ] Implement 4-role RBAC system
- [ ] Migrate user management logic
- [ ] Set up tenant provisioning
- [ ] Test authentication flows

Days 11-14: Data Models Migration
- [ ] Design Firestore collections
- [ ] Implement participant management
- [ ] Set up donation processing
- [ ] Create QR code system
```

### Phase 3: Feature Migration (Week 3)
```
Days 15-17: Frontend Migration
- [ ] Update React components
- [ ] Implement tenant context
- [ ] Migrate state management
- [ ] Update API integration

Days 18-21: Dashboard Migration
- [ ] SuperAdmin dashboard
- [ ] Shelter admin dashboard  
- [ ] Participant dashboard
- [ ] Donor dashboard
```

### Phase 4: Testing & Launch (Week 4)
```
Days 22-24: Testing & QA
- [ ] Unit testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Performance testing

Days 25-28: Production Launch
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] User onboarding
- [ ] Launch announcement
```

---

## 🔄 Data Re-creation Strategy

Since we cannot migrate existing data, we'll implement a **structured re-creation approach**:

### User Re-onboarding

#### 1. SuperAdmin Setup
```typescript
// Initialize platform admin
const setupPlatformAdmin = async () => {
  const adminUser = await createFirebaseUser({
    email: 'admin@sheltr.ai',
    password: 'secure_password',
    customClaims: {
      role: 'super_admin',
      tenant_id: 'platform',
      permissions: ['admin:system']
    }
  });
  
  await createUserProfile(adminUser.uid, {
    name: 'SHELTR Platform Admin',
    role: 'super_admin',
    tenant_id: 'platform'
  });
};
```

#### 2. Shelter Partner Re-enrollment
```typescript
// Re-onboard shelter partners
const createShelterTenant = async (shelterData: ShelterCreate) => {
  const tenantId = `shelter-${generateId()}`;
  
  // Create tenant configuration
  await createTenantConfig(tenantId, {
    name: shelterData.name,
    location: shelterData.location,
    contact: shelterData.contact,
    settings: defaultShelterSettings
  });
  
  // Create shelter admin user
  const adminUser = await createFirebaseUser({
    email: shelterData.adminEmail,
    customClaims: {
      role: 'admin',
      tenant_id: tenantId,
      shelter_id: tenantId
    }
  });
  
  return { tenantId, adminUser };
};
```

#### 3. Participant Re-registration
```typescript
// Streamlined participant onboarding
const registerParticipant = async (
  participantData: ParticipantCreate,
  tenantId: string
) => {
  // Create user account
  const user = await createFirebaseUser({
    email: participantData.email,
    customClaims: {
      role: 'participant',
      tenant_id: tenantId
    }
  });
  
  // Generate QR code and blockchain wallet
  const qrCode = await generateQRCode(user.uid);
  const wallet = await createBlockchainWallet(user.uid);
  
  // Store participant data
  await createParticipant(tenantId, {
    ...participantData,
    userId: user.uid,
    qrCodeHash: qrCode.hash,
    walletAddress: wallet.address
  });
  
  return { user, qrCode, wallet };
};
```

### Enhanced Onboarding Experience

#### Simplified Registration Flow
1. **Reduced Friction**: Minimal required information
2. **Progressive Disclosure**: Collect details over time
3. **Mobile-First**: Optimized for phone registration
4. **Verification Support**: Partner shelter assistance available
5. **Immediate Value**: QR code available upon approval

#### Improved User Experience
- **Better UI/UX**: Modern, accessible design
- **Real-time Updates**: Instant feedback on actions
- **Mobile Apps**: Native iOS/Android experience
- **Offline Support**: Works without internet
- **Multi-language**: Localized for different communities

---

## 🧪 Testing Strategy

### Migration Testing Checklist

#### Unit Tests
- [ ] Authentication flow testing
- [ ] Multi-tenant data isolation
- [ ] API endpoint functionality
- [ ] Blockchain integration
- [ ] QR code generation/verification

#### Integration Tests
- [ ] End-to-end donation flow
- [ ] Cross-tenant security
- [ ] Real-time updates
- [ ] Mobile app integration
- [ ] Payment processing

#### User Acceptance Testing
- [ ] SuperAdmin workflows
- [ ] Shelter admin tasks
- [ ] Participant registration
- [ ] Donor experience
- [ ] Mobile app usability

#### Performance Testing
- [ ] API response times < 50ms
- [ ] Database query optimization
- [ ] Mobile app load times
- [ ] Concurrent user handling
- [ ] Blockchain transaction speed

---

## 🚨 Risk Mitigation

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Firebase limitations** | High | Medium | Monitor quotas, implement caching |
| **Data loss during migration** | High | Low | Fresh start strategy, no legacy data |
| **Authentication issues** | Medium | Medium | Comprehensive testing, backup auth |
| **Performance degradation** | Medium | Low | Load testing, optimization |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **User adoption resistance** | High | Medium | Better UX, training, support |
| **Shelter partner concerns** | Medium | Medium | Communication, migration support |
| **Donor confusion** | Low | Medium | Clear communication, documentation |

### Rollback Plan

If critical issues arise:

1. **Immediate**: Switch DNS back to legacy system (if available)
2. **Short-term**: Deploy fix to new system
3. **Long-term**: Complete migration with lessons learned

---

## 📞 Migration Support

### Support Team
- **Technical Lead**: Migration architecture and implementation
- **Product Manager**: Feature parity and user experience
- **QA Manager**: Testing strategy and execution
- **DevOps**: Infrastructure and deployment
- **Community Manager**: User communication and support

### Support Channels
- **Developer Slack**: Real-time technical discussion
- **Migration Email**: migration-support@sheltr.ai
- **Documentation**: Updated throughout migration
- **Office Hours**: Daily check-ins during migration

---

## ✅ Post-Migration Checklist

### Week 1 After Launch
- [ ] Monitor system performance and uptime
- [ ] Track user registration and adoption
- [ ] Collect feedback from early users
- [ ] Address any critical issues
- [ ] Update documentation based on learnings

### Month 1 After Launch
- [ ] Analyze platform usage metrics
- [ ] Conduct user satisfaction surveys
- [ ] Optimize performance based on real usage
- [ ] Plan additional features based on feedback
- [ ] Celebrate migration success! 🎉

---

**This migration transforms SHELTR from a promising prototype into a globally scalable platform that can truly hack homelessness through technology.** 🏠✨

*For migration support, contact: migration-support@sheltr.ai* 