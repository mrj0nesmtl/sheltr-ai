# 🔥 Firebase Hosting Deployment

Complete guide for deploying the SHELTR-AI frontend to Firebase Hosting.

## 📋 Prerequisites

- Firebase CLI installed and configured
- Firebase project set up (`sheltr-ai`)
- Node.js and npm installed
- Build artifacts ready

## 🚀 Deployment Process

### 1. Build the Frontend

```bash
cd apps/web
npm run build
```

### 2. Firebase Configuration

Ensure `firebase.json` is properly configured:

```json
{
  "hosting": {
    "public": "apps/web/out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 3. Deploy to Firebase

```bash
# Deploy to production
firebase deploy --only hosting

# Deploy to preview channel
firebase hosting:channel:deploy preview
```

### 4. Environment Variables

Ensure production environment variables are set:

```bash
# In apps/web/.env.production
NEXT_PUBLIC_API_BASE_URL=https://sheltr-api-production-url
NEXT_PUBLIC_FIREBASE_CONFIG=production-config
```

## 🔧 Configuration

### Custom Domain Setup

1. Add custom domain in Firebase Console
2. Verify domain ownership
3. Configure DNS records
4. Enable SSL certificate

### Performance Optimization

- Enable compression
- Configure caching headers
- Optimize images and assets
- Enable CDN distribution

## 🔗 Related Documentation

- [Google Cloud Run Deployment](./google-cloud-run.md)
- [Architecture Overview](../02-architecture/README.md)
- [Development Guide](../04-development/README.md)
