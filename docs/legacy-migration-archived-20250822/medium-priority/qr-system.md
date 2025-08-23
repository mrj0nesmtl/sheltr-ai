# 📱 SHELTR QR System
*Version: 0.6.4 - January 20, 2024*
*Status: STABLE* 🟢

## System Overview
The SHELTR QR system enables secure, trackable connections between donors, shelters, and participants through dynamically generated QR codes. Each code is uniquely linked to either a shelter or participant, enabling immediate donations and tracking upon scanning.

### Key Features
- Automatic QR generation for new shelters
- Participant-specific QR codes upon registration
- Real-time tracking and analytics
- Blockchain verification integration
- Security monitoring and threat detection
- AI-assisted verification

## QR Code Structure
```typescript
interface QRCode {
  id: string;              // Unique identifier
  type: 'SHELTER' | 'PARTICIPANT'; // Code type
  entityId: string;        // Linked shelter/participant
  status: QRStatus;        // Current code status
  metadata: QRMetadata;    // Additional information
  createdAt: Date;        // Generation timestamp
  expiresAt?: Date;       // Optional expiration
  securityHash: string;   // Verification hash
  aiVerified: boolean;    // AI verification status
}

type QRStatus = 
  | 'active'      // Code is valid and usable
  | 'suspended'   // Temporarily disabled
  | 'expired'     // Past expiration date
  | 'revoked';    // Permanently disabled

interface QRMetadata {
  location?: GeolocationData;  // Generation location
  device: string;             // Creating device
  scanCount: number;          // Times scanned
  lastScan?: Date;           // Last scan timestamp
  entityInfo: {              // Embedded entity data
    id: string;             // Anonymized ID
    type: 'SHELTER' | 'PARTICIPANT';
    name?: string;          // Optional display name
    programIds?: string[];  // Active programs
    securityLevel: number;  // Security clearance
    aiRiskScore?: number;   // AI-calculated risk
  }
}
```

## Generation System
```typescript
interface QRGenerator {
  // Shelter QR Generation
  generateForShelter: (
    shelterId: string,
    options?: ShelterQROptions
  ) => Promise<QRCode>;
  
  // Participant QR Generation
  generateForParticipant: (
    participantId: string,
    shelterId: string,
    options?: ParticipantQROptions
  ) => Promise<QRCode>;
  
  // Batch Generation
  generateBatch: (
    type: 'SHELTER' | 'PARTICIPANT',
    ids: string[],
    options?: BatchOptions
  ) => Promise<QRCode[]>;
}

interface ShelterQROptions {
  expiration?: Date;
  securityLevel?: number;
  customMetadata?: Record<string, unknown>;
  aiVerification?: boolean;
}

interface ParticipantQROptions extends ShelterQROptions {
  programIds?: string[];
  displayName?: string;
  restrictions?: string[];
}
```

## Automatic Generation Triggers
```typescript
interface QRTriggers {
  // Shelter Creation Trigger
  onShelterCreated: (
    shelter: Shelter
  ) => Promise<QRCode>;

  // Participant Registration Trigger
  onParticipantRegistered: (
    participant: Participant,
    shelter: Shelter
  ) => Promise<QRCode>;

  // Renewal Triggers
  onQRExpiring: (
    qrCode: QRCode
  ) => Promise<QRCode>;
}
```

## Security Features
```typescript
interface SecurityMeasures {
  encryption: {
    algorithm: 'AES-256-GCM';
    keyRotation: boolean;
    saltRounds: number;
  };
  validation: {
    checksums: boolean;
    timeBasedTokens: boolean;
    geoFencing?: boolean;
    aiVerification: boolean;
  };
  rateLimit: {
    scanLimit: number;
    timeWindow: number;
    cooldown: number;
  }
}
```

## Database Schema
```typescript
interface QRDatabase {
  tables: {
    qr_codes: {
      id: string;
      type: 'SHELTER' | 'PARTICIPANT';
      entity_id: string;
      status: QRStatus;
      metadata: JsonB;
      security_hash: string;
      ai_verified: boolean;
      created_at: Timestamp;
      expires_at?: Timestamp;
    };
    qr_scans: {
      id: string;
      qr_code_id: string;
      scanner_id?: string;
      timestamp: Timestamp;
      location?: GeolocationData;
      resulted_in_donation: boolean;
      security_check: boolean;
      ai_risk_score: number;
    }
  }
}
```

## Implementation Status
1. Core QR Generation (✅ IMPLEMENTED)
   - Shelter code generation
   - Participant code generation
   - Batch generation
   - Security features

2. Automatic Triggers (✅ IMPLEMENTED)
   - Shelter creation hooks
   - Participant registration
   - Expiration handling
   - Security monitoring

3. Security Features (✅ IMPLEMENTED)
   - Encryption
   - Validation
   - Rate limiting
   - AI verification

4. Database Integration (✅ IMPLEMENTED)
   - Schema implementation
   - Trigger functions
   - Security logging
   - Performance tracking

## Next Steps
1. Enhance AI verification
2. Implement predictive analytics
3. Add real-time monitoring
4. Expand security features
5. Optimize performance
6. Add blockchain verification

---
*For implementation details, see [implementation-guide.md](../guides/implementation-guide.md)*
