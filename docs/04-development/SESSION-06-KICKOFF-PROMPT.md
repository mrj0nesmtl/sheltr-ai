# SESSION 06: Multi-Dashboard Development Kickoff

## 🚀 **Session Overview**
**Focus**: Shelter Admin, Donor, and Participant Dashboard Development with Base Blockchain Onboarding

**Duration**: Extended Development Session  
**Complexity**: High (Blockchain Integration + Multi-Role System)  
**Priority**: Critical Path - Core Platform Functionality

---

## 🎯 **Session Goals**

### **Primary Deliverables**
1. **Three Complete Dashboards**
   - Shelter Admin Dashboard (`/dashboard/shelter-admin`)
   - Donor Dashboard (`/dashboard/donor`)
   - Participant Dashboard (`/dashboard/participant`)

2. **Dual Onboarding System**
   - Shelter-assisted participant onboarding
   - Self-registration portal for independent users

3. **Base Blockchain Integration**
   - Smart wallet creation using OnchainKit
   - SHELTR token distribution system
   - QR code generation for each participant

4. **Advanced Features**
   - Role-based access control
   - Real-time data synchronization
   - Mobile-responsive design
   - Comprehensive user experience flows

---

## 🏗️ **Technical Stack**

### **Frontend Technologies**
- **Next.js 15.4+** - App Router with TypeScript
- **Shadcn/UI** - Component library for consistent design
- **Lucide Icons** - Icon system
- **OnchainKit** - Base blockchain integration
- **React Hook Form** - Form management
- **Tailwind CSS** - Styling framework

### **Blockchain Integration**
- **Base L2 Network** - Ethereum Layer 2 solution
- **OnchainKit** - Coinbase's React blockchain toolkit
- **Smart Wallets** - ERC-4337 Account Abstraction
- **Token Standards**: ERC-20 (SHELTR-S stable, SHELTR utility)

### **Backend Services**
- **Firebase Firestore** - Database with real-time updates
- **Firebase Auth** - Authentication with role management
- **Firebase Functions** - API endpoints
- **Firebase Storage** - Image and document storage

### **Key Libraries**
```bash
# Blockchain Integration
npm install @coinbase/onchainkit viem

# QR Code System
npm install qrcode jsqr react-qr-code

# Camera/Photo Capture
npm install react-webcam

# Encryption & Security
npm install crypto-js

# Form Management
npm install react-hook-form @hookform/resolvers zod
```

---

## 📊 **Dashboard Specifications**

### **🏠 Shelter Admin Dashboard**
**Primary Users**: Shelter administrators and staff  
**Core Purpose**: Manage participants, resources, and services

#### **Key Features**
- **Participant Management**: View, add, edit participant profiles
- **Resource Tracking**: Bed availability, meals, programs
- **Service Coordination**: Schedule appointments, track completion
- **Token Distribution**: Distribute SHELTR-S tokens for services
- **Analytics**: Occupancy rates, service metrics, financial reports
- **Onboarding Portal**: Initiate participant registration

#### **UI Components Needed**
- Participant data table with search/filter
- Resource availability widgets
- Service scheduling calendar
- Token distribution interface
- Real-time analytics charts
- Onboarding workflow stepper

### **💝 Donor Dashboard**
**Primary Users**: Individual and institutional donors  
**Core Purpose**: Track donations, view impact, manage portfolio

#### **Key Features**
- **Donation Management**: One-time and recurring gifts
- **Impact Visualization**: Real-time fund allocation tracking
- **Portfolio Overview**: SHELTR token holdings and performance
- **Tax Documentation**: Automated receipt generation
- **Community Engagement**: Anonymous participant messaging
- **Investment Tracking**: Token staking and governance

#### **UI Components Needed**
- Donation history timeline
- Interactive impact charts and maps
- Token portfolio dashboard
- Tax document generator
- Messaging interface
- Investment performance tracker

### **👤 Participant Dashboard**
**Primary Users**: Shelter participants and program users  
**Core Purpose**: Access services, manage profile, use crypto wallet

#### **Key Features**
- **Profile Management**: Personal info, photos, goals
- **Service Access**: Browse available services, book appointments
- **Wallet Interface**: SHELTR-S balance, transaction history
- **QR Code Display**: Personal QR for payments and identification
- **Support Network**: Case worker communication, peer groups
- **Progress Tracking**: Goal achievement, milestone rewards

#### **UI Components Needed**
- Profile editor with photo upload
- Service catalog and booking system
- Crypto wallet interface
- QR code display/scanner
- Communication tools
- Progress visualization

---

## 🎪 **Onboarding System Design**

### **🏠 Shelter-Assisted Onboarding**
**Initiator**: Shelter Admin  
**Target**: New participants entering shelter system

#### **Flow Steps**
1. **Admin Portal Access**
   - Shelter admin logs into dashboard
   - Accesses "Add New Participant" interface
   - Begins guided onboarding process

2. **Participant Information Collection**
   - Basic demographics form
   - Photo capture using device camera
   - Identity document upload
   - Emergency contact information

3. **Verification & Validation**
   - Admin reviews entered information
   - Validates identity documents
   - Confirms participant consent
   - Approves account creation

4. **Blockchain Account Creation**
   - Generate Base blockchain wallet
   - Create unique participant ID
   - Distribute welcome SHELTR-S tokens (100 tokens)
   - Generate encrypted QR code

5. **Orientation & Tutorial**
   - Platform walkthrough
   - Wallet usage demonstration
   - QR code explanation
   - Service directory introduction

### **👤 Self-Registration Flow**
**Initiator**: Individual seeking services  
**Target**: Self-directed participants

#### **Flow Steps**
1. **Public Portal Access**
   - Visit registration landing page
   - Choose "Register Yourself" option
   - Review terms and conditions
   - Begin verification process

2. **Identity Verification**
   - Phone number verification via SMS
   - Email address confirmation
   - Identity document upload
   - Address verification

3. **Profile Creation**
   - Personal information form
   - Service needs assessment
   - Preferred shelter selection
   - Emergency contact setup

4. **Account Activation**
   - Automated blockchain wallet creation
   - Welcome token distribution
   - QR code generation
   - Security setup (PIN, recovery phrase)

5. **Platform Introduction**
   - Interactive tutorial
   - Feature demonstrations
   - Help resource overview
   - First service booking

---

## 🔗 **Base Blockchain Integration**

### **Smart Wallet Architecture**
Using Base L2 network with OnchainKit for seamless integration:

```typescript
// Wallet creation example
import { createAccount } from '@coinbase/onchainkit/wallet';

interface ParticipantWallet {
  address: string;           // Smart contract wallet address
  privateKey: string;        // Encrypted and stored securely
  tokens: {
    sheltrS: bigint;        // Stable token balance (welcome: 100)
    sheltr: bigint;         // Utility token balance (earned)
  };
  qrCode: string;           // Unique QR identifier
  recovery: {
    phrase: string;         // Encrypted recovery phrase
    backupContacts: string[]; // Emergency recovery contacts
  };
}
```

### **Token Distribution Logic**
```typescript
interface TokenRewards {
  welcome: 100;                    // SHELTR-S on registration
  dailyCheckIn: 5;                // Daily shelter check-in
  serviceCompletion: 25;          // Completing scheduled service
  goalAchievement: 100;           // Reaching personal milestones
  peerSupport: 10;               // Helping other participants
  emergencyAllowance: 500;       // Maximum emergency distribution
}
```

### **QR Code System**
```typescript
interface ParticipantQR {
  participantId: string;          // Unique participant identifier
  walletAddress: string;          // Blockchain wallet address
  encryptedData: {
    personalInfo: string;         // Encrypted personal details
    permissions: string[];        // Access permissions
    timestamp: number;            // Generation timestamp
  };
  features: {
    payments: boolean;            // Enable payment receiving
    identification: boolean;      // Use for ID verification
    serviceAccess: boolean;       // Grant service access
  };
}
```

---

## 🗂️ **Implementation Strategy**

### **Phase 1: Foundation (Day 1)**
1. **Setup & Architecture**
   - Install required dependencies
   - Configure Base blockchain connection
   - Setup OnchainKit provider
   - Create basic routing structure

2. **Dashboard Layouts**
   - Create responsive dashboard shells
   - Implement role-based navigation
   - Setup shared components
   - Test authentication flows

### **Phase 2: Core Features (Day 2-3)**
1. **Shelter Admin Dashboard**
   - Participant management interface
   - Resource tracking components
   - Basic analytics display
   - Onboarding initiation

2. **Blockchain Integration**
   - Wallet creation service
   - Token distribution system
   - QR code generation
   - Transaction handling

### **Phase 3: User Dashboards (Day 4-5)**
1. **Donor Dashboard**
   - Donation management
   - Impact visualization
   - Portfolio tracking
   - Tax documentation

2. **Participant Dashboard**
   - Profile management
   - Service access
   - Wallet interface
   - QR code display

### **Phase 4: Onboarding Flows (Day 6-7)**
1. **Shelter-Assisted Flow**
   - Multi-step form creation
   - Photo capture integration
   - Verification workflow
   - Admin approval process

2. **Self-Registration Flow**
   - Public portal creation
   - Identity verification
   - Automated account creation
   - Tutorial system

### **Phase 5: Integration & Testing (Day 8)**
1. **System Integration**
   - Connect all components
   - Real-time data flows
   - Error handling
   - Performance optimization

2. **Testing & Validation**
   - End-to-end testing
   - Security validation
   - Mobile responsiveness
   - Accessibility compliance

---

## 🎛️ **Key Repository Directories**

### **Frontend Structure**
```
apps/web/src/
├── app/
│   ├── dashboard/
│   │   ├── shelter-admin/          # Shelter management interface
│   │   ├── donor/                  # Donor portal
│   │   └── participant/            # Participant dashboard
│   ├── onboarding/
│   │   ├── shelter-assisted/       # Admin-initiated onboarding
│   │   └── self-registration/      # Public registration portal
│   └── api/
│       ├── onboarding/             # Onboarding API endpoints
│       ├── wallet/                 # Blockchain wallet management
│       └── qr/                     # QR code generation/validation
├── components/
│   ├── dashboards/                 # Dashboard-specific components
│   ├── onboarding/                 # Onboarding flow components
│   ├── blockchain/                 # Wallet and transaction components
│   └── qr/                         # QR code components
├── services/
│   ├── blockchainService.ts        # Base blockchain integration
│   ├── walletService.ts            # Wallet management
│   ├── onboardingService.ts        # User onboarding logic
│   └── qrService.ts                # QR code generation/validation
└── hooks/
    ├── useWallet.ts                # Blockchain wallet hook
    ├── useOnboarding.ts            # Onboarding state management
    └── useQRCode.ts                # QR code handling
```

### **Key Configuration Files**
- `apps/web/next.config.ts` - OnchainKit configuration
- `apps/web/src/lib/blockchain.ts` - Base network setup
- `firestore.rules` - Database security rules
- `.env.local` - Environment variables (API keys, RPC URLs)

---

## 📋 **Session Checklist**

### **Pre-Session Setup** ✅
- [ ] Review Base blockchain documentation
- [ ] Install OnchainKit and dependencies
- [ ] Configure Base Sepolia testnet
- [ ] Setup development wallet with test ETH
- [ ] Test QR code libraries

### **Dashboard Development** 🎯
- [ ] Create shelter admin dashboard structure
- [ ] Build donor dashboard interface
- [ ] Implement participant dashboard
- [ ] Setup role-based routing
- [ ] Integrate real-time data updates

### **Blockchain Integration** ⛓️
- [ ] Setup Base network connection
- [ ] Implement smart wallet creation
- [ ] Build token distribution system
- [ ] Create QR code generation
- [ ] Test transaction handling

### **Onboarding System** 🎪
- [ ] Build shelter-assisted flow
- [ ] Create self-registration portal
- [ ] Implement identity verification
- [ ] Setup photo capture
- [ ] Create progress tracking

### **Testing & Deployment** 🧪
- [ ] End-to-end testing
- [ ] Security validation
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Production deployment

---

## 🚀 **Success Criteria**

### **Technical Metrics**
- All three dashboards fully functional
- Onboarding flows complete successfully
- Blockchain wallet creation working
- QR code system operational
- Mobile responsive design
- Load times under 2 seconds

### **User Experience Metrics**
- Intuitive navigation across all dashboards
- Smooth onboarding experience
- Clear wallet management interface
- Accessible design for all users
- Error handling and recovery

### **Security & Compliance**
- Secure blockchain integration
- Encrypted data handling
- Proper authentication flows
- GDPR/privacy compliance
- Audit-ready security measures

---

## 🎯 **Ready to Begin Session 6!**

**This session will establish the core user experience for all SHELTR-AI participants. We're building the foundation for a blockchain-powered social impact platform that enables direct participant empowerment through crypto wallets and QR-based identification.**

**Let's create something amazing! 🚀** 