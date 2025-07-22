# 🏗️ SHELTR-AI System Design

**Multi-Tenant SaaS Architecture for Scalable Charitable Giving Platform**

*Based on: Battle-tested Firebase/FastAPI Multi-Tenant Architecture*  
*Date: July 2025*  
*Status: Implementation Ready*

---

## 📋 Architecture Overview

SHELTR-AI is built on a proven multi-tenant SaaS architecture that successfully combines modern web technologies with enterprise-grade scalability. This design has been battle-tested through 56+ development sessions and is currently serving multiple tenants in production.

### Core Design Principles

1. **Multi-Tenant by Design**: Complete data isolation for unlimited scalability
2. **Mobile-First**: Native iOS/Android apps with shared backend APIs
3. **Blockchain Native**: Full token integration with smart contract automation
4. **AI-Powered**: OpenAI + LangChain for advanced analytics and insights
5. **Real-Time**: Live updates across all platforms and users
6. **Security First**: Enterprise-grade security with Firebase Auth + custom claims

---

## 🏢 Multi-Tenant Architecture

### High-Level System Diagram

```mermaid
graph TD
    A[Next.js Frontend<br/>Web Application] -->|X-Tenant-ID Header| B[FastAPI Gateway<br/>Python Backend]
    C[Expo Mobile App<br/>iOS/Android] -->|Same API| B
    B -->|Tenant Routing| D[TenantService<br/>Data Isolation]
    D -->|Multi-Tenant Collections| E[Firebase Firestore<br/>Database]

    E -->|tenants/platform/*| F[Platform Tenant<br/>SuperAdmin]
    E -->|tenants/shelter-{id}/*| G[Shelter Tenants<br/>Individual Shelters]
    E -->|tenants/participant-network/*| H[Participant Network<br/>Independent Users]
    E -->|tenants/donor-network/*| I[Donor Community<br/>Contributors]

    J[Firebase Auth<br/>OAuth + Custom Claims] -->|JWT Tokens| B
    K[Google Cloud Run<br/>Containerized APIs] -->|Auto-scaling| B
    L[Firebase Hosting<br/>Static Web App] -->|CDN Distribution| A

    M[OpenAI + LangChain<br/>AI Analytics] -->|Insights| B
    N[Blockchain Network<br/>Ethereum/Polygon] -->|Smart Contracts| B
    O[SHELTR Token System<br/>USDC/SHLTR/Hybrid] -->|Automated Distribution| N

    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    style C fill:#fff3e0,stroke:#f57c00,stroke-width:3px
    style B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    style E fill:#e8f5e8,stroke:#388e3c,stroke-width:3px
    style N fill:#fce4ec,stroke:#c2185b,stroke-width:3px
```

### Tenant Isolation Strategy

#### Data Structure
```
Firebase Project: sheltr-ai-production
├── tenants/
│   ├── platform/                    # SHELTR platform administration
│   │   ├── users/                   # Platform admins (SuperAdmin)
│   │   ├── analytics/               # Global platform metrics
│   │   ├── system_settings/         # Platform configuration
│   │   └── blockchain_settings/     # Token & smart contract config
│   │
│   ├── shelter-{id}/                # Individual shelter tenants
│   │   ├── users/                   # Shelter staff, volunteers (Admins)
│   │   ├── participants/            # Shelter-affiliated participants
│   │   ├── donations/               # Shelter-specific donations
│   │   ├── qr_codes/               # Shelter QR code management
│   │   ├── token_distributions/     # Shelter token allocations
│   │   └── analytics/              # Shelter-specific metrics
│   │
│   ├── participant-network/         # Independent participants
│   │   ├── users/                   # Individual participants (non-shelter)
│   │   ├── qr_codes/               # Personal QR codes
│   │   ├── donations_received/      # Direct donations to participants
│   │   ├── verification/            # Identity & needs verification
│   │   └── token_wallets/          # Participant blockchain wallets
│   │
│   └── donor-network/              # Donor community tenant
│       ├── users/                  # Donor profiles
│       ├── donation_history/       # Cross-shelter donations
│       ├── impact_tracking/        # Donor impact analytics
│       ├── token_transactions/     # Blockchain transaction history
│       └── social_features/        # Donor engagement
│
├── public/                         # Non-tenant specific data
│   ├── shelter_directory/          # Public shelter listings
│   ├── participant_directory/      # Verified participant profiles
│   ├── impact_metrics/             # Public impact data
│   ├── qr_verification/            # QR code validation
│   └── blockchain_explorer/        # Public transaction explorer
│
└── system/                         # System-level configuration
    ├── tenant_configs/             # Tenant-specific settings
    ├── global_settings/            # Platform-wide configuration
    └── migration_logs/             # System upgrade tracking
```

#### Tenant Routing Implementation

```typescript
// Multi-tenant service pattern
export class TenantService {
  getCollectionPath(tenantId: string, collection: string): string {
    const collectionMapping = {
      'users': 'users',
      'participants': 'participants',
      'donations': 'donations',
      'qr_codes': 'qr_codes',
      'analytics': 'analytics'
    };
    
    const mappedCollection = collectionMapping[collection] || collection;
    return `tenants/${tenantId}/${mappedCollection}`;
  }

  getTenantFromRequest(request: Request): string {
    const tenantHeader = request.headers.get('X-Tenant-ID');
    if (!tenantHeader) {
      throw new Error('Tenant ID required');
    }
    return tenantHeader;
  }

  async validateTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    // Validate user has access to specified tenant
    const userDoc = await this.getUserTenant(userId);
    return userDoc.allowedTenants.includes(tenantId);
  }
}
```

---

## 🎯 Four-Role User System

### Role-Based Access Control (RBAC)

| Role | Description | Permissions | Tenant Access |
|------|-------------|-------------|---------------|
| **SuperAdmin** | SHELTR Founders & Platform Operators | Full system control, global analytics, tenant management | `tenants/platform/` |
| **Admin** | Shelter Operators & Staff | Shelter management, participant onboarding, local analytics | `tenants/shelter-{id}/` |
| **Participant** | Donation Recipients | QR code management, donation tracking, profile updates | `tenants/shelter-{id}/participants/` OR `tenants/participant-network/` |
| **Donor** | People Making Donations | Donation history, impact tracking, social features | `tenants/donor-network/` |

### Firebase Authentication + Custom Claims

```typescript
// Custom claims structure for multi-tenant RBAC
interface SheltrUserClaims {
  role: 'super_admin' | 'admin' | 'participant' | 'donor';
  tenant_id: string;
  permissions: string[];
  shelter_id?: string;  // For shelter-specific users
  verified: boolean;
}

// JWT token validation middleware
export const validateToken = async (request: Request): Promise<DecodedToken> => {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authorization.replace('Bearer ', '');
  const decodedToken = await admin.auth().verifyIdToken(token);
  
  // Validate custom claims
  if (!decodedToken.role || !decodedToken.tenant_id) {
    throw new Error('Invalid user claims');
  }

  return decodedToken;
};
```

---

## 🔌 Backend Architecture

### FastAPI Multi-Tenant Gateway

```python
# FastAPI application structure
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from services.tenant_service import TenantService
from services.auth_service import AuthService

app = FastAPI(
    title="SHELTR-AI API",
    version="2.0.0",
    description="Multi-tenant charitable giving platform"
)

# Multi-tenant middleware
@app.middleware("http")
async def add_tenant_context(request: Request, call_next):
    tenant_id = request.headers.get("X-Tenant-ID", "platform")
    request.state.tenant_id = tenant_id
    request.state.tenant_service = TenantService()
    response = await call_next(request)
    return response

# Authentication dependency
async def get_current_user(
    authorization: str = Header(alias="Authorization"),
    tenant_id: str = Header(alias="X-Tenant-ID")
) -> User:
    auth_service = AuthService()
    user = await auth_service.verify_token(authorization)
    
    # Validate tenant access
    if not await auth_service.validate_tenant_access(user.id, tenant_id):
        raise HTTPException(status_code=403, detail="Tenant access denied")
    
    return user

# Tenant-aware routing
@app.get("/participants/")
async def get_participants(
    tenant_id: str = Header(alias="X-Tenant-ID"),
    current_user: User = Depends(get_current_user),
    tenant_service: TenantService = Depends()
):
    collection_path = tenant_service.get_collection_path(tenant_id, "participants")
    return await get_participants_from_path(collection_path)
```

### API Service Architecture

```python
# Service layer with tenant awareness
class ParticipantService:
    def __init__(self, tenant_service: TenantService):
        self.tenant_service = tenant_service
        self.db = firestore.client()

    async def create_participant(
        self, 
        tenant_id: str, 
        participant_data: ParticipantCreate
    ) -> Participant:
        # Generate QR code
        qr_code = await self.generate_qr_code(participant_data)
        
        # Create blockchain wallet
        wallet = await self.create_wallet(participant_data)
        
        # Store in tenant-specific collection
        collection_path = self.tenant_service.get_collection_path(
            tenant_id, 
            "participants"
        )
        
        doc_data = {
            **participant_data.dict(),
            "qr_code_hash": qr_code.hash,
            "wallet_address": wallet.address,
            "created_at": firestore.SERVER_TIMESTAMP,
            "verified": False
        }
        
        doc_ref = self.db.collection(collection_path).add(doc_data)
        return Participant(id=doc_ref.id, **doc_data)

    async def generate_qr_code(self, participant_data: ParticipantCreate) -> QRCode:
        # QR code generation logic with donation routing
        qr_data = {
            "type": "sheltr_participant",
            "participant_id": participant_data.id,
            "version": "2.0",
            "created_at": datetime.utcnow().isoformat()
        }
        return QRCodeGenerator.create(qr_data)
```

---

## 📱 Frontend Architecture

### Next.js Web Application

```typescript
// Multi-tenant context provider
interface TenantContextValue {
  tenantId: string;
  tenantConfig: TenantConfig;
  switchTenant: (tenantId: string) => void;
}

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [tenantId, setTenantId] = useState<string>('platform');
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);

  const switchTenant = useCallback(async (newTenantId: string) => {
    const config = await fetchTenantConfig(newTenantId);
    setTenantId(newTenantId);
    setTenantConfig(config);
  }, []);

  return (
    <TenantContext.Provider value={{ tenantId, tenantConfig, switchTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

// Tenant-aware API client
export class ApiClient {
  constructor(private tenantId: string, private authToken: string) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'X-Tenant-ID': this.tenantId,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}
```

### Mobile Application (Expo)

```typescript
// React Native navigation with tenant context
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const App: React.FC = () => {
  return (
    <TenantProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthFlow} />
            <Stack.Screen name="Dashboard" component={DashboardFlow} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="DonationFlow" component={DonationFlow} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </TenantProvider>
  );
};

// QR scanner with donation processing
export const QRScannerScreen: React.FC = () => {
  const { tenantId } = useTenant();
  const { user } = useAuth();

  const handleQRScan = useCallback(async (data: string) => {
    try {
      const qrData = JSON.parse(data);
      
      if (qrData.type === 'sheltr_participant') {
        // Navigate to donation flow
        navigation.navigate('DonationFlow', {
          participantId: qrData.participant_id,
          tenantId: tenantId
        });
      }
    } catch (error) {
      // Handle scan error
      Alert.alert('Invalid QR Code', 'Please scan a valid SHELTR QR code');
    }
  }, [tenantId, navigation]);

  return (
    <QRCodeScanner
      onRead={handleQRScan}
      showMarker={true}
      markerStyle={{ borderColor: '#1976d2' }}
    />
  );
};
```

---

## 🪙 Blockchain Architecture

### SHELTR Token System

```solidity
// SHELTR Smart Contract Architecture
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SHELTRDonations is ReentrancyGuard, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SHELTER_ROLE = keccak256("SHELTER_ROLE");

    struct Participant {
        address walletAddress;
        string qrCodeHash;
        bool verified;
        uint256 totalReceived;
        address associatedShelter;
        uint256 registeredAt;
    }

    struct Donation {
        address donor;
        address participant;
        uint256 amount;
        uint256 timestamp;
        string purpose;
        bool processed;
    }

    mapping(address => Participant) public participants;
    mapping(bytes32 => Donation) public donations;
    
    address public housingFund;
    address public operationsFund;
    uint256 public totalDonations;

    event DonationProcessed(
        bytes32 indexed donationId,
        address indexed donor,
        address indexed participant,
        uint256 amount,
        uint256 toParticipant,
        uint256 toHousing,
        uint256 toOperations
    );

    // SmartFund™ Distribution (80/15/5)
    function processDonation(
        address participant,
        uint256 amount,
        string memory purpose
    ) external payable nonReentrant {
        require(participants[participant].verified, "Participant not verified");
        require(msg.value == amount, "Incorrect payment amount");

        // Calculate distribution
        uint256 toParticipant = (amount * 80) / 100;
        uint256 toHousing = (amount * 15) / 100;
        uint256 toOperations = (amount * 5) / 100;

        // Execute transfers
        payable(participant).transfer(toParticipant);
        payable(housingFund).transfer(toHousing);
        payable(operationsFund).transfer(toOperations);

        // Record donation
        bytes32 donationId = keccak256(
            abi.encodePacked(msg.sender, participant, block.timestamp)
        );
        
        donations[donationId] = Donation({
            donor: msg.sender,
            participant: participant,
            amount: amount,
            timestamp: block.timestamp,
            purpose: purpose,
            processed: true
        });

        participants[participant].totalReceived += toParticipant;
        totalDonations += amount;

        emit DonationProcessed(
            donationId,
            msg.sender,
            participant,
            amount,
            toParticipant,
            toHousing,
            toOperations
        );
    }

    function registerParticipant(
        address participantWallet,
        string memory qrCodeHash
    ) external onlyRole(ADMIN_ROLE) {
        participants[participantWallet] = Participant({
            walletAddress: participantWallet,
            qrCodeHash: qrCodeHash,
            verified: false,
            totalReceived: 0,
            associatedShelter: msg.sender,
            registeredAt: block.timestamp
        });
    }
}
```

### Token Integration Service

```typescript
// Blockchain service for SHELTR token operations
export class BlockchainService {
  private contract: ethers.Contract;
  private provider: ethers.providers.Provider;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL
    );
    this.contract = new ethers.Contract(
      process.env.SHELTR_CONTRACT_ADDRESS,
      SHELTR_ABI,
      this.provider
    );
  }

  async processDonation(
    donorWallet: string,
    participantWallet: string,
    amount: string,
    purpose: string
  ): Promise<TransactionReceipt> {
    const signer = this.provider.getSigner(donorWallet);
    const contractWithSigner = this.contract.connect(signer);

    const tx = await contractWithSigner.processDonation(
      participantWallet,
      ethers.utils.parseEther(amount),
      purpose,
      {
        value: ethers.utils.parseEther(amount),
        gasLimit: 300000
      }
    );

    return await tx.wait();
  }

  async getParticipantStats(
    participantWallet: string
  ): Promise<ParticipantStats> {
    const participant = await this.contract.participants(participantWallet);
    
    return {
      totalReceived: ethers.utils.formatEther(participant.totalReceived),
      verified: participant.verified,
      registeredAt: new Date(participant.registeredAt.toNumber() * 1000),
      donationCount: await this.getDonationCount(participantWallet)
    };
  }
}
```

---

## 🤖 AI Integration Architecture

### OpenAI + LangChain Analytics

```python
# AI service for impact analytics and insights
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

class ImpactAnalyticsService:
    def __init__(self):
        self.llm = OpenAI(
            temperature=0.3,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )

    async def generate_impact_report(
        self, 
        tenant_id: str, 
        time_period: str
    ) -> ImpactReport:
        # Fetch donation data
        donations = await self.get_donation_data(tenant_id, time_period)
        participants = await self.get_participant_data(tenant_id, time_period)
        
        # Create prompt template
        prompt_template = PromptTemplate(
            input_variables=["donation_data", "participant_data", "time_period"],
            template="""
            Analyze the following charitable giving data for {time_period}:
            
            Donations: {donation_data}
            Participants: {participant_data}
            
            Generate insights about:
            1. Impact effectiveness
            2. Donation patterns
            3. Participant outcomes
            4. Recommendations for improvement
            
            Format as a structured report with actionable insights.
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt_template)
        
        result = await chain.arun(
            donation_data=donations,
            participant_data=participants,
            time_period=time_period
        )
        
        return ImpactReport.parse(result)

    async def predict_donation_trends(
        self, 
        tenant_id: str
    ) -> PredictionResult:
        # Use AI to predict donation patterns and suggest optimizations
        historical_data = await self.get_historical_data(tenant_id)
        
        prediction_prompt = PromptTemplate(
            input_variables=["historical_data"],
            template="""
            Based on this historical donation data: {historical_data}
            
            Predict:
            1. Next month's donation volume
            2. Optimal timing for campaigns
            3. Participant needs forecast
            4. Suggested action items
            
            Provide specific, actionable predictions.
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=prediction_prompt)
        return await chain.arun(historical_data=historical_data)
```

---

## 🔒 Security Architecture

### Multi-Layer Security

1. **Firebase Authentication**
   - OAuth providers (Google, Apple, GitHub)
   - Custom claims for role-based access
   - JWT token validation

2. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Tenant-specific data access
       match /tenants/{tenantId}/{collection}/{document=**} {
         allow read, write: if request.auth != null
           && request.auth.token.tenant_id == tenantId
           && isValidTenantUser(tenantId);
       }

       function isValidTenantUser(tenantId) {
         return exists(/databases/$(database)/documents/tenants/$(tenantId)/users/$(request.auth.uid));
       }
     }
   }
   ```

3. **API Gateway Security**
   - Rate limiting per tenant
   - Request validation
   - SQL injection prevention
   - XSS protection

4. **Blockchain Security**
   - Smart contract audits
   - Multi-signature wallets
   - Gas optimization
   - Reentrancy protection

---

## 📊 Performance & Scalability

### Performance Targets

| Metric | Target | Monitoring |
|--------|--------|------------|
| **API Response Time** | < 50ms | Google Cloud Monitoring |
| **Database Queries** | < 100ms | Firestore metrics |
| **Mobile App Load** | < 3 seconds | Expo analytics |
| **Web App Load** | < 2 seconds | Lighthouse CI |
| **Blockchain Tx** | < 15 seconds | Custom monitoring |

### Scalability Features

- **Auto-scaling**: Google Cloud Run automatically scales based on demand
- **Global CDN**: Firebase hosting with worldwide edge locations
- **Database Sharding**: Firestore automatically handles scaling
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Google Cloud Load Balancer for high availability

---

## 🌍 Deployment Architecture

### Production Environment

```yaml
# Production deployment configuration
production:
  web_app:
    platform: Firebase Hosting
    domain: app.sheltr.ai
    cdn: Global CDN with edge caching
    
  api:
    platform: Google Cloud Run
    url: api.sheltr.ai
    scaling: 0-100 instances
    resources:
      cpu: 2 vCPU
      memory: 4GB
      
  database:
    platform: Firebase Firestore
    region: Multi-region
    backup: Daily automated backups
    
  blockchain:
    network: Ethereum Mainnet
    backup_network: Polygon
    contracts: Verified and audited
    
  monitoring:
    platform: Google Cloud Monitoring + Sentry
    alerts: PagerDuty integration
    logs: Cloud Logging
```

---

**This system design provides the foundation for a globally scalable, secure, and innovative charitable giving platform that can serve millions of users while maintaining the personal touch that makes SHELTR-AI special.** 🏠✨ 