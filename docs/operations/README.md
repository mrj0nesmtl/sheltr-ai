# ⚙️ Operations Documentation

> **Production deployment, monitoring, and maintenance guides**  
> Everything you need to deploy, monitor, and maintain SHELTR in production.

[![Production](https://img.shields.io/badge/production-operational-success.svg)](https://sheltr-ai.web.app)
[![Uptime](https://img.shields.io/badge/uptime-99.9%25-brightgreen.svg)]()

---

## 🎯 Overview

Comprehensive operations documentation covering deployment strategies, monitoring, security procedures, and system maintenance for the SHELTR platform.

---

## 📂 Documentation Files

### 🚀 [Firebase Hosting](firebase-hosting.md)
**Frontend deployment on Firebase**
- Configuration setup
- Build and deploy process
- Custom domains
- SSL certificates
- Performance optimization

### ☁️ [Google Cloud Run](google-cloud-run.md)
**Backend API deployment**
- Container setup
- Cloud Run configuration
- Environment variables
- Auto-scaling
- Cost optimization

### 📊 [Monitoring](monitoring.md)
**System health and performance**
- Uptime monitoring
- Performance metrics
- Error tracking
- Log aggregation
- Alerting setup

### 🔒 [Security](security.md)
**Security procedures and compliance**
- Security best practices
- Compliance requirements
- Incident response
- Regular audits
- Backup procedures

---

## 🚀 Quick Start

### Deploy to Production

```bash
# Frontend deployment
cd apps/web
npm run build
firebase deploy --only hosting

# Backend deployment
cd apps/api
gcloud run deploy sheltr-api --source .
```

**See**: Full deployment guides in respective documents

---

## 📊 System Status

| Component | Status | Uptime |
|-----------|--------|--------|
| **Web App** | ✅ Operational | 99.9% |
| **API** | ✅ Operational | 99.8% |
| **Database** | ✅ Operational | 99.99% |
| **Storage** | ✅ Operational | 99.95% |

---

## 🔗 External Resources

- 🌐 [Firebase Console](https://console.firebase.google.com/project/sheltr-ai)
- ☁️ [Google Cloud Console](https://console.cloud.google.com)
- 📊 [Monitoring Dashboard](https://monitoring.sheltr-ai.com)

---

**Last Updated**: October 30, 2025  
**Status**: ✅ Production Ready
