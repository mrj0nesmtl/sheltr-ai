# ⛓️ SHELTR Blockchain Architecture
*Version: 1.0.0 - July 22, 2025*
*Status: In development* ✅

## Overview
SHELTR implements a comprehensive dual-token blockchain architecture on Base network (Coinbase L2) that combines transaction verification with full token economy integration. Our system provides transparent, immutable records of all donations, token distributions, and marketplace transactions while supporting both stable value preservation and community governance.

## Dual-Token Architecture
### SHELTR-S (Stable Utility Token)
- **Network**: Base (Coinbase L2)
- **Standard**: ERC-20
- **Backing**: USDC Reserve Pool
- **Purpose**: Participant stability and daily transactions

### SHELTR (Community Governance Token)
- **Network**: Base (Coinbase L2) 
- **Standard**: ERC-20
- **Mechanism**: Deflationary with staking rewards
- **Purpose**: Governance, community engagement, and platform growth

## Transaction Verification System

### Core Verification Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SHELTRVerification {
    // Transaction Types
    enum TransactionType {
        DONATION,
        SPLIT,
        DISBURSEMENT,
        REFUND
    }
    
    // Transaction Record
    struct Transaction {
        string transactionId;      // Internal SHELTR ID
        TransactionType txType;    // Transaction type
        uint256 amount;           // Amount in cents
        string donorId;           // Anonymized donor reference
        string shelterId;         // Shelter identifier
        string[] participantIds;  // Beneficiary references
        uint256 timestamp;        // Transaction timestamp
        string paymentReference;  // Payment system reference
    }
    
    // Verification Events
    event TransactionVerified(
        string indexed transactionId,
        TransactionType txType,
        uint256 timestamp
    );
    
    event DisbursementVerified(
        string indexed transactionId,
        string shelterId,
        uint256 amount
    );
    
    // Storage
    mapping(string => Transaction) public verifiedTransactions;
    mapping(string => uint256) public shelterTotalReceived;
    mapping(string => uint256) public shelterTotalDisbursed;
}
```

### Verification Functions
```solidity
interface IVerification {
    function verifyTransaction(
        string memory transactionId,
        TransactionType txType,
        uint256 amount,
        string memory donorId,
        string memory shelterId,
        string[] memory participantIds,
        string memory paymentReference
    ) external returns (bool);
    
    function verifyDisbursement(
        string memory disbursementId,
        string memory shelterId,
        string[] memory participantIds,
        uint256 amount,
        string memory paymentReference
    ) external returns (bool);
    
    function getTransactionDetails(
        string memory transactionId
    ) external view returns (Transaction memory);
}
```

### Audit Trail System
```solidity
contract SHELTRAudit {
    struct AuditTrail {
        string[] transactionIds;
        uint256 totalAmount;
        uint256 verifiedDisbursements;
        uint256 lastUpdated;
    }
    
    mapping(string => AuditTrail) public shelterAudits;
    
    function generateAuditReport(
        string memory shelterId,
        uint256 startTime,
        uint256 endTime
    ) external view returns (AuditTrail memory);
    
    function verifyAuditTrail(
        string memory shelterId,
        string[] memory transactionIds
    ) external view returns (bool);
}
```

## Implementation Guidelines

### Transaction Flow
1. Payment Processing
   - Standard payment processed through traditional rails
   - Transaction details captured
   - Unique transaction ID generated

2. Blockchain Verification
   - Transaction details hashed
   - Verification record created
   - Event emitted
   - Audit trail updated

3. Disbursement Verification
   - Disbursement details captured
   - Verification record created
   - Audit trail updated
   - Event emitted

### Security Measures
1. Data Privacy
   - All personal information anonymized
   - Only reference IDs stored on-chain
   - Sensitive data handled off-chain
   - Compliance with privacy regulations

2. Access Control
   - Admin-only verification functions
   - Multi-sig requirements for critical operations
   - Rate limiting
   - Emergency pause functionality

### Integration Points
```typescript
interface BlockchainVerification {
    verifyDonation: (
        transactionData: TransactionData
    ) => Promise<VerificationResult>;
    
    verifyDisbursement: (
        disbursementData: DisbursementData
    ) => Promise<VerificationResult>;
    
    getAuditTrail: (
        shelterId: string,
        dateRange: DateRange
    ) => Promise<AuditTrail>;
}
```

## Base Network Integration

### Network Configuration
```typescript
const BASE_CONFIG = {
    network: 'base-mainnet',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    contracts: {
        sheltrStable: '0x...', // SHELTR-S Token
        sheltrCommunity: '0x...', // SHELTR Token
        smartFund: '0x...', // Distribution Contract
        governance: '0x...', // Governance Contract
        treasury: '0x...' // Multi-sig Treasury
    },
    integration: {
        coinbaseConnect: true,
        visaMcp: true,
        usdcReserve: '0x...'
    }
} as const;
```

### Transaction Monitoring
```typescript
interface TransactionMonitor {
    watchTransaction: (txHash: string) => Promise<TransactionStatus>;
    verifyReceipt: (txHash: string) => Promise<VerificationResult>;
    getBlockConfirmations: (txHash: string) => Promise<number>;
}
```

## Public Data Access

### API Endpoints
```typescript
interface VerificationAPI {
    endpoints: {
        getTransaction: '/api/v1/verification/transaction/:id',
        getShelterAudit: '/api/v1/verification/audit/:shelterId',
        verifyDisbursement: '/api/v1/verification/disbursement/:id'
    };
    
    methods: {
        verifyTransaction: 'POST',
        getAuditReport: 'GET',
        verifyAuditTrail: 'GET'
    }
}
```

## Implementation Status
1. Core Verification (✅ IMPLEMENTED)
   - Transaction verification
   - Disbursement tracking
   - Audit trail generation
   - Event logging

2. Integration (🟡 IN PROGRESS)
   - Polygon deployment
   - API endpoints
   - Monitoring system
   - Data indexing

3. Public Access (🔵 PLANNED)
   - Public audit portal
   - Verification explorer
   - API documentation
   - Analytics dashboard

---
*For implementation details, see [implementation-guide.md](../guides/implementation-guide.md)*
