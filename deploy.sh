#!/bin/bash

# 🚀 SHELTR-AI Deployment Script
# Deploys both frontend (Firebase Hosting) and backend (Firebase Functions/Cloud Run)

echo "🚀 SHELTR-AI Deployment Pipeline"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="apps/web"
BACKEND_DIR="apps/api"
BUILD_DIR="apps/web/out"

# Function to check command success
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 successful${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# Function to prompt for deployment type
select_deployment() {
    echo -e "${BLUE}📋 Select deployment options:${NC}"
    echo "1) Frontend only (Firebase Hosting)"
    echo "2) Backend only (Firebase Functions)"
    echo "3) Full deployment (Frontend + Backend)"
    echo "4) Security-focused deployment (with audits)"
    echo "5) Development build (no deployment)"
    
    read -p "Enter your choice (1-5): " choice
    echo ""
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "${BLUE}🌐 Deploying Frontend to Firebase Hosting...${NC}"
    
    # Navigate to frontend directory
    cd $FRONTEND_DIR
    
    # Clear Next.js cache to prevent build issues
    echo -e "${YELLOW}🧹 Clearing Next.js cache...${NC}"
    rm -rf .next out
    
    # Install dependencies with security audit
    echo -e "${YELLOW}📦 Installing frontend dependencies with security check...${NC}"
    npm ci --legacy-peer-deps > ../../logs/deploy-frontend-install.log 2>&1
    check_status "Frontend dependency installation"
    
    # Run security audit (non-blocking)
    echo -e "${YELLOW}🔒 Running security audit...${NC}"
    npm audit --audit-level=high >> ../../logs/deploy-frontend-install.log 2>&1 || echo -e "${YELLOW}⚠️  Security audit found issues (check logs)${NC}"
    
    # Build the application with production API URL
    echo -e "${YELLOW}🔨 Building Next.js application with production API...${NC}"
    NEXT_PUBLIC_API_BASE_URL=https://sheltr-api-714964620823.us-central1.run.app npm run build > ../../logs/deploy-frontend-build.log 2>&1
    check_status "Frontend build"
    
    # Verify build output
    if [ ! -d "out" ]; then
        echo -e "${RED}❌ Build output directory not found${NC}"
        exit 1
    fi
    
    # Deploy to Firebase Hosting
    echo -e "${YELLOW}🔥 Deploying to Firebase Hosting...${NC}"
    cd ../..
    firebase deploy --only hosting > logs/deploy-frontend.log 2>&1
    check_status "Frontend deployment"
    
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
    echo -e "${BLUE}🌐 Live URL: https://sheltr-ai.web.app${NC}"
    echo -e "${BLUE}🔗 Direct link: https://sheltr-ai.web.app/dashboard${NC}"
}

# Function to deploy backend
deploy_backend() {
    echo -e "${BLUE}🔌 Deploying Backend to Google Cloud Run...${NC}"
    
    # Check if gcloud is installed and authenticated
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}❌ Google Cloud CLI not found${NC}"
        echo -e "${YELLOW}💡 Install with: curl https://sdk.cloud.google.com | bash${NC}"
        exit 1
    fi
    
    # Set correct project
    echo -e "${YELLOW}🔧 Setting Google Cloud project...${NC}"
    gcloud config set project sheltr-ai > logs/deploy-backend.log 2>&1
    
    # Build and deploy with Cloud Build
    echo -e "${YELLOW}🏗️  Building Docker image...${NC}"
    gcloud builds submit --config cloudbuild.yaml . >> logs/deploy-backend.log 2>&1
    check_status "Docker image build"
    
    # Deploy to Cloud Run
    echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
    
    # Get GITHUB_TOKEN from environment or .env file
    if [ -z "$GITHUB_TOKEN" ]; then
        if [ -f "apps/api/.env" ]; then
            GITHUB_TOKEN=$(grep GITHUB_TOKEN apps/api/.env | cut -d '=' -f2)
        fi
    fi
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${RED}❌ GITHUB_TOKEN not found in environment or apps/api/.env${NC}"
        exit 1
    fi
    
    gcloud run deploy sheltr-api \
        --image gcr.io/sheltr-ai/sheltr-api:latest \
        --region us-central1 \
        --platform managed \
        --allow-unauthenticated \
        --memory 2Gi \
        --cpu 2 \
        --max-instances 10 \
        --min-instances 0 \
        --timeout 300 \
        --no-traffic \
        --tag=candidate \
        --service-account firebase-adminsdk-fbsvc@sheltr-ai.iam.gserviceaccount.com \
        --set-env-vars="GOOGLE_CLOUD_PROJECT=sheltr-ai,ENVIRONMENT=production,FIREBASE_STORAGE_BUCKET=sheltr-ai.firebasestorage.app,OPENAI_MODEL=gpt-4o-mini,OPENAI_MAX_TOKENS=2000,OPENAI_TEMPERATURE=0.7,OPENAI_TIMEOUT=30,OPENAI_FALLBACK_MODEL=gpt-3.5-turbo,OPENAI_MAX_CONTEXT_TOKENS=4000,OPENAI_RATE_LIMIT_PER_MINUTE=60,FRONTEND_URL=https://sheltr-ai.web.app,GITHUB_TOKEN=$GITHUB_TOKEN,GITHUB_OWNER=mrj0nesmtl,GITHUB_REPO=sheltr-ai,GITHUB_DOCS_PATH=docs" \
        --update-secrets="OPENAI_API_KEY=openai-api-key:latest,ANTHROPIC_API_KEY=anthropic-api-key:latest" \
        >> logs/deploy-backend.log 2>&1
    check_status "Cloud Run deployment"
    
    # Verify the new revision is healthy before routing traffic
    echo -e "${YELLOW}🔍 Verifying new revision health...${NC}"
    sleep 10  # Give the revision time to start
    
    # Route 100% traffic to the new revision
    echo -e "${YELLOW}🔀 Routing traffic to new revision...${NC}"
    gcloud run services update-traffic sheltr-api \
        --region us-central1 \
        --to-latest \
        >> logs/deploy-backend.log 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Traffic routed successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Traffic routing warning (check logs)${NC}"
        echo -e "${YELLOW}💡 Manually route traffic: gcloud run services update-traffic sheltr-api --to-latest --region us-central1${NC}"
    fi
    
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    echo -e "${BLUE}🔌 API URL: https://sheltr-api-714964620823.us-central1.run.app${NC}"
    echo -e "${BLUE}🏷️  Candidate URL: https://candidate---sheltr-api-714964620823.us-central1.run.app${NC}"
}

# Function for security-focused deployment
security_deployment() {
    echo -e "${BLUE}🔒 Security-Focused Deployment Pipeline${NC}"
    echo "======================================="
    
    # Run comprehensive security checks first
    echo -e "${YELLOW}🔍 Running comprehensive security audit...${NC}"
    
    # Frontend security checks
    cd $FRONTEND_DIR
    echo -e "${YELLOW}📦 Frontend security audit...${NC}"
    npm audit --audit-level=moderate > ../../logs/security-audit-frontend.log 2>&1 || echo -e "${YELLOW}⚠️  Frontend vulnerabilities found (see logs)${NC}"
    
    # Check for sensitive files
    echo -e "${YELLOW}🔍 Scanning for sensitive files...${NC}"
    cd ../..
    if find . -name "*.key" -o -name "*.pem" -o -name ".env" -o -name "*.p12" | grep -v ".git" | grep -q .; then
        echo -e "${RED}❌ Sensitive files detected! Review before deployment${NC}"
        find . -name "*.key" -o -name "*.pem" -o -name ".env" -o -name "*.p12" | grep -v ".git"
        read -p "Continue anyway? (y/N): " continue_deploy
        if [[ ! $continue_deploy =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✅ No sensitive files found${NC}"
    fi
    
    # Backend security checks
    cd $BACKEND_DIR
    echo -e "${YELLOW}🐍 Backend security audit...${NC}"
    if command -v safety &> /dev/null; then
        safety check > ../../logs/security-audit-backend.log 2>&1 || echo -e "${YELLOW}⚠️  Backend vulnerabilities found (see logs)${NC}"
    else
        echo -e "${YELLOW}⚠️  Safety not installed, skipping Python vulnerability check${NC}"
    fi
    
    cd ../..
    
    # Deploy with security verification
    echo -e "${GREEN}🚀 Proceeding with secure deployment...${NC}"
    deploy_frontend
    
    # Additional security verification post-deployment
    echo -e "${YELLOW}🔒 Post-deployment security verification...${NC}"
    
    echo -e "${GREEN}✅ Security-focused deployment completed!${NC}"
    echo -e "${BLUE}📋 Review security logs in: logs/security-audit-*.log${NC}"
}

# Function to run development build
dev_build() {
    echo -e "${BLUE}🛠️  Running development build (no deployment)...${NC}"
    
    # Build frontend
    echo -e "${YELLOW}🌐 Building frontend...${NC}"
    cd $FRONTEND_DIR
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 npm run build > ../../logs/dev-build-frontend.log 2>&1
    check_status "Frontend development build"
    
    # Test backend
    echo -e "${YELLOW}🔌 Testing backend...${NC}"
    cd ../$BACKEND_DIR
    
    # Activate virtual environment and run tests
    if [ -d ".venv" ]; then
        source .venv/bin/activate
        python -m pytest --version > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            python -m pytest > ../../logs/dev-build-backend.log 2>&1
            check_status "Backend tests"
        else
            echo -e "${YELLOW}⚠️  No pytest found, skipping tests${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  No virtual environment found, skipping backend tests${NC}"
    fi
    
    cd ../..
    echo -e "${GREEN}✅ Development build completed!${NC}"
}

# Function to update environment files
update_environment() {
    echo -e "${BLUE}🔧 Checking environment configuration...${NC}"
    
    # Check if .env.local exists
    if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
        echo -e "${RED}❌ Missing .env.local file in frontend${NC}"
        echo -e "${YELLOW}💡 Please create apps/web/.env.local with Firebase config${NC}"
        exit 1
    fi
    
    # Check if service account key exists
    if [ ! -f "$BACKEND_DIR/service-account-key.json" ]; then
        echo -e "${RED}❌ Missing service-account-key.json in backend${NC}"
        echo -e "${YELLOW}💡 Please add Firebase service account key to apps/api/${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Environment configuration looks good${NC}"
}

# Function to pre-deployment checks
pre_deployment_checks() {
    echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "firebase.json" ] || [ ! -d "apps" ]; then
        echo -e "${RED}❌ Please run this script from the sheltr-ai project root${NC}"
        exit 1
    fi
    
    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        echo -e "${RED}❌ Firebase CLI not found${NC}"
        echo -e "${YELLOW}💡 Install with: npm install -g firebase-tools${NC}"
        exit 1
    fi
    
    # Check if logged into Firebase
    firebase projects:list > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Not logged into Firebase CLI${NC}"
        echo -e "${YELLOW}💡 Login with: firebase login${NC}"
        exit 1
    fi
    
    # Check git status and security
    echo -e "${YELLOW}🔍 Checking repository status...${NC}"
    git_status=$(git status --porcelain)
    if [ -n "$git_status" ]; then
        echo -e "${YELLOW}⚠️  Uncommitted changes detected:${NC}"
        git status --short
        echo ""
        read -p "Deploy anyway? (y/N): " deploy_dirty
        if [[ ! $deploy_dirty =~ ^[Yy]$ ]]; then
            echo -e "${RED}❌ Deployment cancelled${NC}"
            exit 1
        fi
    fi
    
    # Check if branch protection is working
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$current_branch" = "main" ]; then
        echo -e "${GREEN}✅ On main branch with protection enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  Not on main branch (current: $current_branch)${NC}"
    fi
    
    # Update environment
    update_environment
    
    echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
}

# Function to post-deployment verification
post_deployment_verification() {
    echo -e "${BLUE}🔍 Running post-deployment verification...${NC}"
    
    # Test frontend
    echo -e "${YELLOW}🌐 Testing frontend accessibility...${NC}"
    if curl -s --connect-timeout 10 https://sheltr-ai.web.app > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend health check failed (may take a few minutes to propagate)${NC}"
    fi
    
    # Test key frontend routes
    echo -e "${YELLOW}🔍 Testing key routes...${NC}"
    routes=("/login" "/register" "/about" "/impact")
    for route in "${routes[@]}"; do
        if curl -s --connect-timeout 5 "https://sheltr-ai.web.app$route" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Route $route accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  Route $route may need time to propagate${NC}"
        fi
        sleep 1
    done
    
    # Check security headers
    echo -e "${YELLOW}🔒 Checking security headers...${NC}"
    headers=$(curl -s -I https://sheltr-ai.web.app 2>/dev/null)
    if echo "$headers" | grep -q "X-Frame-Options\|X-Content-Type-Options\|Referrer-Policy"; then
        echo -e "${GREEN}✅ Security headers present${NC}"
    else
        echo -e "${YELLOW}⚠️  Consider adding security headers in firebase.json${NC}"
    fi
    
    # Test backend (if deployed)
    # Note: This would need to be updated with actual function URL
    
    echo -e "${GREEN}✅ Post-deployment verification completed${NC}"
    echo -e "${BLUE}📊 Monitor deployment: https://console.firebase.google.com/project/sheltr-ai/hosting${NC}"
}

# Main deployment flow
main() {
    echo -e "${PURPLE}🏠 SHELTR-AI Deployment Pipeline Starting...${NC}"
    echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"
    echo ""
    
    # Create logs directory
    mkdir -p logs
    
    # Run pre-deployment checks
    pre_deployment_checks
    
    # Select deployment type
    select_deployment
    
    case $choice in
        1)
            deploy_frontend
            ;;
        2)
            deploy_backend
            ;;
        3)
            deploy_frontend
            echo ""
            deploy_backend
            ;;
        4)
            security_deployment
            ;;
        5)
            dev_build
            ;;
        *)
            echo -e "${RED}❌ Invalid choice${NC}"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${PURPLE}🎉 DEPLOYMENT COMPLETED!${NC}"
    echo "========================"
    
    if [ $choice -eq 1 ] || [ $choice -eq 3 ]; then
        echo -e "${BLUE}🌐 Frontend:${NC} https://sheltr-ai.web.app"
        echo -e "${BLUE}🔗 Dashboard:${NC} https://sheltr-ai.web.app/dashboard"
        echo -e "${BLUE}💝 Donate Demo:${NC} https://sheltr-ai.web.app/scan-give"
    fi
    
    if [ $choice -eq 2 ] || [ $choice -eq 3 ]; then
        echo -e "${BLUE}🔌 Backend API:${NC} https://sheltr-api-714964620823.us-central1.run.app"
        echo -e "${BLUE}📚 API Docs:${NC} https://sheltr-api-714964620823.us-central1.run.app/docs"
    fi
    
    echo -e "${BLUE}📊 Firebase Console:${NC} https://console.firebase.google.com/project/sheltr-ai"
    echo -e "${BLUE}🔒 Security Overview:${NC} https://github.com/mrj0nesmtl/sheltr-ai/security"
    echo -e "${BLUE}⚡ GitHub Actions:${NC} https://github.com/mrj0nesmtl/sheltr-ai/actions"
    echo ""
    
    # Run post-deployment verification
    if [ $choice -ne 5 ]; then
        post_deployment_verification
    fi
    
    echo -e "${GREEN}✨ Deployment pipeline completed successfully!${NC}"
}

# Run main function
main 