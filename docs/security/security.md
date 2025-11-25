# 🔒 Security Hardening Guide

Production security configuration and hardening procedures for SHELTR-AI.

## 🛡️ Security Checklist

### Authentication & Authorization

- [ ] Firebase Authentication properly configured
- [ ] Role-based access control (RBAC) implemented
- [ ] JWT token validation on all protected endpoints
- [ ] Session management and timeout policies
- [ ] Multi-factor authentication for admin accounts

### API Security

- [ ] HTTPS enforced on all endpoints
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] SQL injection protection
- [ ] XSS protection headers

### Infrastructure Security

- [ ] Firewall rules configured
- [ ] VPC network isolation
- [ ] Service account permissions minimized
- [ ] Secrets management (Google Secret Manager)
- [ ] Container image scanning
- [ ] Regular security updates

## 🔧 Security Configuration

### HTTPS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Shelter admins can manage their shelter data
    match /shelters/{shelterId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource.data.admin_ids.hasAny([request.auth.uid]);
    }
    
    // 🆕 Knowledge documents - Role-based access (Session 25)
    match /knowledge_documents/{docId} {
      // Read: All authenticated users (backend filters by role/confidentiality)
      allow read: if request.auth != null;
      
      // Write: Super Admin only
      allow write: if request.auth != null && 
        request.auth.token.role == 'super_admin';
    }
    
    // 🆕 Recurring gifts - Donor access (Session 25)
    match /recurring_gifts/{giftId} {
      // Donors can manage their own recurring gifts
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.donor_id;
      
      // Admins have full access
      allow read, write: if request.auth != null && 
        (request.auth.token.role == 'super_admin' || 
         request.auth.token.role == 'platform_admin');
    }
  }
}
```

### Environment Variables Security

```bash
# Use Google Secret Manager
gcloud secrets create openai-api-key --data-file=openai-key.txt

# Reference in Cloud Run
gcloud run services update sheltr-api \
  --set-env-vars="OPENAI_API_KEY=projects/PROJECT_ID/secrets/openai-api-key/versions/latest"
```

## 🔍 Security Monitoring

### Audit Logging

```python
# apps/api/utils/secure_logging.py
import logging
from datetime import datetime

def log_security_event(event_type: str, user_id: str, details: dict):
    """Log security-related events for audit purposes"""
    logger = logging.getLogger("security")
    logger.info({
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "user_id": user_id,
        "details": details
    })
```

### Intrusion Detection

- Monitor for unusual access patterns
- Alert on failed authentication attempts
- Track privilege escalation attempts
- Monitor for data exfiltration patterns

## 🚨 Incident Response

### Security Incident Playbook

1. **Detection**: Automated alerts or manual discovery
2. **Assessment**: Determine scope and impact
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove threat and vulnerabilities
5. **Recovery**: Restore systems to normal operation
6. **Lessons Learned**: Document and improve processes

### Emergency Contacts

- Security Team: security@sheltr.ai
- On-call Engineer: +1-XXX-XXX-XXXX
- Legal Team: legal@sheltr.ai

## 🆕 Session 25 Security Features

### Secure Documents System
- **8-tier role-based access control**
- **Firebase Storage integration** with granular permissions
- **AI chatbot access filtering** by user role and document confidentiality
- **Folders**: dataroom, fintec, founders, leadership, operations, platform-admin, vault
- **Excluded from sync**: local, drafts, development (local-only)

### Gemini AI Integration
- **API key rotation** with website and API restrictions
- **Stored in Secret Manager** for production security
- **Cost-effective chat** (56% reduction vs OpenAI)
- **Hybrid system**: Gemini for public, OpenAI for authenticated users

### Tax Receipt Generation
- **CRA-compliant PDF receipts** with SHELTR branding
- **Donor information protection** with secure data handling
- **SmartFund transparency** (95-5 for shelters, 80-15-5 for participants)

---

## 🔗 Related Documentation

- [Google Cloud Run Deployment](../operations/google-cloud-run.md)
- [Monitoring Setup](../operations/monitoring.md)
- [Firebase Integration](../integrations/firebase-integration.md)
- [Knowledge Base Architecture](../features/knowledge-base/knowledge-architechture.md)
