# Security Policy

## Supported Versions

SHELTR is committed to maintaining security across our platform. We currently support security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| 0.9.x   | :white_check_mark: |
| 0.8.x   | :x:                |
| < 0.8   | :x:                |

## Security Standards

### Platform Security
- **Authentication**: Firebase Auth with multi-factor authentication support
- **Authorization**: Role-based access control (RBAC) with custom claims (5 roles + 8-tier secure docs)
- **Data Protection**: End-to-end encryption for sensitive participant data
- **API Security**: JWT token validation and rate limiting
- **Blockchain**: Smart contract security audits for donation processing
- **🆕 Secure Documents**: 8-tier role-based access (dataroom, fintec, founders, leadership, operations, platform-admin, vault)
- **🆕 AI Access Control**: Chatbot access filtered by user role and document confidentiality
- **🆕 API Key Management**: Gemini API key with website/API restrictions in Secret Manager

### Supported Environments
- **Production**: `https://sheltr-ai.web.app` - Full security hardening
- **Development**: `http://localhost:3000` - Local development only

## Reporting a Vulnerability

**🚨 CRITICAL: Do not report security vulnerabilities through public GitHub issues.**

### For Security Vulnerabilities
1. **Email**: Send details to `joel@arcanaconcept.com`

### What to Include
- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact on users and platform
- **Reproduction**: Step-by-step reproduction instructions
- **Environment**: Affected versions and environments
- **Evidence**: Screenshots, logs, or proof-of-concept (if safe)

### Response Timeline
- **Initial Response**: Within 24 hours
- **Triage**: Within 72 hours
- **Status Updates**: Weekly until resolution
- **Fix Deployment**: Critical issues within 7 days, others within 30 days

## Security Features

### Automated Security
- **Dependabot**: Automated dependency vulnerability scanning
- **CodeQL**: Static application security testing (SAST)
- **Secret Scanning**: Prevents accidental secret commits
- **Container Security**: Docker image vulnerability scanning
- **Supply Chain**: Software composition analysis

### Manual Reviews
- **Code Review**: Security-focused peer review process
- **Penetration Testing**: Quarterly third-party security assessments
- **Compliance**: SOC 2 Type II and GDPR compliance monitoring

## Responsible Disclosure

We believe in responsible disclosure and will:

1. **Acknowledge** your report within 24 hours
2. **Investigate** and validate the vulnerability
3. **Develop** and test a fix
4. **Deploy** the fix to production
5. **Credit** you in our security acknowledgments (if desired)

### Bug Bounty Program
- **Scope**: Production environment (`sheltr-ai.web.app`)
- **Rewards**: $100 - $5,000 based on severity
- **Platform**: HackerOne program (launching Q4 2025)

## Security Contact

- **Security Team**: mrjonesmtl@icloud.com
- **Emergency**: mrjonesmtl@icloud.com

## Security Acknowledgments

We thank the following researchers for responsibly disclosing security issues:

<!-- Will be updated as reports are received and resolved -->

## Additional Resources

- [SHELTR Privacy Policy](https://sheltr-ai.web.app/privacy/)
- [SHELTR Terms of Service](https://sheltr-ai.web.app/terms/)

---

**Last Updated**: December 11, 2025 (Session 27 - Security Remediation Complete) ✅  
**Next Review**: March 2026

> 🔒 Security is fundamental to SHELTR's mission of safely serving vulnerable populations. We take all security reports seriously and appreciate the security community's help in keeping our platform safe.

## 🎉 Recent Security Achievements (Session 27)

### **Zero Vulnerabilities Status** ✅
- **Dependabot Alerts**: 0 active (down from 10) - 100% resolved
- **Code Scanning (CodeQL)**: 4 alerts pending GitHub re-scan (fixes merged)
- **npm audit**: 0 vulnerabilities in all workspaces
- **Secret Scanning**: 30 historical (no active secrets)

### **Session 27 Security Remediation (Dec 11, 2025)**
- ✅ Fixed all XSS vulnerabilities with comprehensive sanitization
- ✅ Removed sensitive logging from Python backend
- ✅ Updated all dependency vulnerabilities (20 PRs merged)
- ✅ Improved security workflow reliability
- ✅ Production builds passing with zero security issues
