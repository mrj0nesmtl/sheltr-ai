# 🤝 Contributing to SHELTR-AI

Thank you for your interest in contributing to SHELTR-AI! This document provides guidelines and information for contributors.

---

## 🎯 Mission Alignment

Before contributing, please understand our core mission: **Hacking homelessness through technology.** Every contribution should advance our goal of creating transparent, efficient, and impactful charitable giving.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git and GitHub account
- Firebase CLI
- Python 3.11+ (for backend development)
- Basic understanding of TypeScript, React, and Firebase

### Development Setup
1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/sheltr-ai.git
   cd sheltr-ai
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Configure Firebase, OpenAI, and blockchain settings
   ```

3. **Install Dependencies**
   ```bash
   npm install
   cd apps/api && pip install -r requirements.txt
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

**→ [Complete Setup Guide](04-development/environment-setup.md)**

---

## 📋 Contribution Types

### 🐛 Bug Fixes
- Use the [Bug Report Template](10-resources/templates/bug-report-template.md)
- Include reproduction steps and environment details
- Test your fix thoroughly before submitting

### ✨ New Features
- Use the [Feature Request Template](10-resources/templates/feature-request-template.md)
- Discuss large features in GitHub Discussions first
- Follow our four-role system (SuperAdmin, Admin, Participant, Donor)

### 📚 Documentation
- Keep documentation up-to-date with code changes
- Use clear, inclusive language
- Include code examples and diagrams where helpful

### 🧪 Testing
- Write tests for new features
- Maintain test coverage above 80%
- Include unit, integration, and e2e tests

---

## 🔄 Development Workflow

### Branch Naming
```
feature/short-description
bugfix/issue-description
docs/section-being-updated
refactor/component-name
```

### Commit Messages
Follow conventional commits:
```
feat: add participant QR code generation
fix: resolve donation processing timeout
docs: update API authentication guide
refactor: improve multi-tenant routing
test: add QR scanner integration tests
```

### Pull Request Process
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Follow [coding standards](04-development/coding-standards.md)
   - Write/update tests
   - Update documentation

3. **Test Thoroughly**
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

4. **Submit Pull Request**
   - Use the [PR Template](10-resources/templates/pr-template.md)
   - Link related issues
   - Request appropriate reviewers

---

## 📏 Code Standards

### TypeScript/JavaScript
```typescript
// ✅ Good: Clear, typed, documented
interface ParticipantData {
  id: string;
  qrCodeHash: string;
  walletAddress: string;
  associatedShelter?: string;
}

/**
 * Generates a new QR code for participant donations
 * @param participantId - Unique participant identifier
 * @returns QR code data with embedded donation information
 */
const generateParticipantQR = async (
  participantId: string
): Promise<QRCodeData> => {
  // Implementation
};
```

### Python (FastAPI)
```python
# ✅ Good: Type hints, docstrings, error handling
from typing import Optional
from pydantic import BaseModel

class ParticipantCreate(BaseModel):
    name: str
    shelter_id: Optional[str] = None
    verification_status: bool = False

@app.post("/participants/", response_model=Participant)
async def create_participant(
    participant: ParticipantCreate,
    current_user: User = Depends(get_current_user)
) -> Participant:
    """
    Create a new participant with QR code generation.
    
    Args:
        participant: Participant creation data
        current_user: Authenticated user making the request
        
    Returns:
        Created participant with QR code information
    """
    # Implementation with error handling
```

### Component Structure
```typescript
// ✅ Good: Organized, typed, accessible
interface ParticipantCardProps {
  participant: Participant;
  onQRScan: (participantId: string) => void;
  className?: string;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  onQRScan,
  className
}) => {
  return (
    <Card className={cn("participant-card", className)}>
      {/* Accessible, semantic markup */}
    </Card>
  );
};
```

### Database Operations (Firestore)
```typescript
// ✅ Good: Tenant-aware, error handling
const getTenantCollection = (tenantId: string, collection: string) => {
  return `tenants/${tenantId}/${collection}`;
};

const createParticipant = async (
  tenantId: string,
  participantData: ParticipantCreate
): Promise<Participant> => {
  try {
    const collectionPath = getTenantCollection(tenantId, 'participants');
    const docRef = await db.collection(collectionPath).add(participantData);
    return { id: docRef.id, ...participantData };
  } catch (error) {
    console.error('Failed to create participant:', error);
    throw new Error('Participant creation failed');
  }
};
```

**→ [Complete Coding Standards](04-development/coding-standards.md)**

---

## 🧪 Testing Guidelines

### Test Structure
```typescript
// Unit tests
describe('ParticipantService', () => {
  describe('createParticipant', () => {
    it('should create participant with QR code', async () => {
      // Arrange
      const participantData = { name: 'John Doe' };
      
      // Act
      const result = await participantService.create(participantData);
      
      // Assert
      expect(result.qrCodeHash).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });
});

// Integration tests
describe('Donation Flow', () => {
  it('should complete end-to-end donation process', async () => {
    // Test full donation flow from QR scan to blockchain transaction
  });
});
```

### Required Tests
- **Unit Tests**: All utility functions and services
- **Component Tests**: React components with user interactions
- **API Tests**: All FastAPI endpoints
- **Integration Tests**: Multi-component workflows
- **E2E Tests**: Critical user journeys

---

## 🔐 Security Guidelines

### Sensitive Data
- Never commit API keys, secrets, or private keys
- Use environment variables for configuration
- Follow principle of least privilege

### Multi-Tenant Security
```typescript
// ✅ Always validate tenant access
const validateTenantAccess = async (
  userId: string,
  tenantId: string
): Promise<boolean> => {
  const userTenant = await getUserTenant(userId);
  return userTenant === tenantId;
};

// ✅ Use tenant-aware queries
const getParticipants = async (tenantId: string, userId: string) => {
  if (!await validateTenantAccess(userId, tenantId)) {
    throw new Error('Unauthorized tenant access');
  }
  
  return await db
    .collection(getTenantCollection(tenantId, 'participants'))
    .get();
};
```

### Blockchain Security
- Always validate smart contract interactions
- Use secure wallet integration patterns
- Implement proper gas estimation

---

## 📱 Mobile Development

### Expo/React Native Guidelines
```typescript
// ✅ Platform-specific adaptations
import { Platform } from 'react-native';
import { QRCodeScanner } from './QRCodeScanner';

const QRScannerScreen = () => {
  const scanQR = useCallback(async (data: string) => {
    try {
      await processQRDonation(data);
    } catch (error) {
      // Handle platform-specific error display
      if (Platform.OS === 'ios') {
        // iOS-specific error handling
      } else {
        // Android-specific error handling
      }
    }
  }, []);

  return <QRCodeScanner onScan={scanQR} />;
};
```

---

## 📚 Documentation Standards

### Code Documentation
- Use TSDoc for TypeScript
- Include examples in docstrings
- Document complex business logic

### User Documentation
- Write for your audience (developer vs end-user)
- Include screenshots for UI features
- Provide troubleshooting sections

### API Documentation
- Auto-generate from FastAPI OpenAPI
- Include request/response examples
- Document error scenarios

---

## 🎨 Design System

### UI Components
- Use Shadcn/UI as base components
- Follow accessibility guidelines (WCAG 2.1 AA)
- Maintain design consistency across platforms

### Color Palette
```css
/* Primary brand colors */
--primary: #1976d2;      /* SHELTR Blue */
--secondary: #388e3c;    /* Success Green */
--accent: #f57c00;       /* Warning Orange */
--destructive: #d32f2f;  /* Error Red */

/* Neutral colors */
--background: #ffffff;
--surface: #f5f5f5;
--text: #333333;
--text-muted: #666666;
```

---

## 🌍 Accessibility

### Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper color contrast ratios

### Implementation
```typescript
// ✅ Accessible component example
const DonationButton = ({ onDonate, amount }: DonationButtonProps) => {
  return (
    <Button
      onClick={onDonate}
      aria-label={`Donate $${amount} to participant`}
      className="donation-button"
    >
      Donate ${amount}
    </Button>
  );
};
```

---

## 🚀 Performance Guidelines

### Frontend Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Code splitting for large bundles

### Backend Performance
- Cache frequently accessed data
- Use database indexing appropriately
- Implement request rate limiting
- Monitor API response times

### Mobile Performance
- Minimize app size with tree shaking
- Use lazy loading for non-critical screens
- Optimize image loading and caching
- Implement offline capabilities where appropriate

---

## 🔍 Review Process

### Code Review Checklist
- [ ] Follows coding standards
- [ ] Includes appropriate tests
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Multi-tenant compliance
- [ ] Mobile compatibility (if applicable)

### Review Criteria
- **Functionality**: Does it work as intended?
- **Security**: Are there any security vulnerabilities?
- **Performance**: Does it meet performance standards?
- **Maintainability**: Is the code clean and well-documented?
- **Accessibility**: Is it accessible to all users?

---

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Annual contributor acknowledgments
- Special recognition for milestone contributions

---

## 📞 Getting Help

### For Contributors
- 💬 **Discord**: [SHELTR Development Community](https://discord.gg/sheltr-dev)
- 📧 **Email**: dev@sheltr.ai
- 📖 **Documentation**: You're reading it!
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/sheltr-ai/issues)

### Mentorship Program
New contributors can request mentorship for:
- First-time contributions
- Complex feature development
- Architecture understanding
- Career development advice

---

## 📄 License

By contributing to SHELTR-AI, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping us hack homelessness through technology! Every contribution, no matter how small, makes a difference in someone's life.** 🏠✨ 