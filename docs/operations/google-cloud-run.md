# ☁️ Google Cloud Run Deployment

Complete guide for deploying the SHELTR-AI backend API to Google Cloud Run.

## 📋 Prerequisites

- Google Cloud SDK installed and configured
- Docker installed
- Google Cloud project set up
- Service account with appropriate permissions

## 🚀 Deployment Process

### 1. Build Docker Image

```bash
cd apps/api

# Build the Docker image
docker build -t gcr.io/PROJECT_ID/sheltr-api:latest .

# Push to Google Container Registry
docker push gcr.io/PROJECT_ID/sheltr-api:latest
```

### 2. Deploy to Cloud Run

```bash
# Deploy using gcloud CLI
gcloud run deploy sheltr-api \
  --image gcr.io/PROJECT_ID/sheltr-api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="ENVIRONMENT=production" \
  --memory=2Gi \
  --cpu=2 \
  --max-instances=100
```

### 3. Environment Variables

Set production environment variables:

```bash
gcloud run services update sheltr-api \
  --set-env-vars="OPENAI_API_KEY=your-key,FIREBASE_PROJECT_ID=sheltr-ai" \
  --region us-central1
```

## 🔧 Configuration

### Service Configuration

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/sheltr-api:$COMMIT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/sheltr-api:$COMMIT_SHA']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'sheltr-api'
      - '--image'
      - 'gcr.io/$PROJECT_ID/sheltr-api:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
```

### Security Configuration

- Enable IAM authentication for sensitive endpoints
- Configure VPC connector for private resources
- Set up Cloud Armor for DDoS protection
- Enable audit logging

### Monitoring Setup

- Configure Cloud Monitoring alerts
- Set up error reporting
- Enable performance monitoring
- Configure log aggregation

## 🔗 Related Documentation

- [Firebase Hosting Deployment](./firebase-hosting.md)
- [Monitoring Setup](./monitoring.md)
- [Security Hardening](./security.md)
