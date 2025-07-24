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
    echo "4) Development build (no deployment)"
    
    read -p "Enter your choice (1-4): " choice
    echo ""
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "${BLUE}🌐 Deploying Frontend to Firebase Hosting...${NC}"
    
    # Navigate to frontend directory
    cd $FRONTEND_DIR
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install > ../logs/deploy-frontend-install.log 2>&1
    check_status "Frontend dependency installation"
    
    # Build the application
    echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
    npm run build > ../logs/deploy-frontend-build.log 2>&1
    check_status "Frontend build"
    
    # Deploy to Firebase Hosting
    echo -e "${YELLOW}🔥 Deploying to Firebase Hosting...${NC}"
    cd ../..
    firebase deploy --only hosting > logs/deploy-frontend.log 2>&1
    check_status "Frontend deployment"
    
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
    echo -e "${BLUE}🌐 Live URL: https://sheltr-ai.web.app${NC}"
}

# Function to deploy backend
deploy_backend() {
    echo -e "${BLUE}🔌 Deploying Backend to Firebase Functions...${NC}"
    
    # Navigate to backend directory
    cd $BACKEND_DIR
    
    # Create requirements.txt for functions if it doesn't exist
    if [ ! -f "requirements.txt" ]; then
        echo -e "${YELLOW}📝 Creating requirements.txt for deployment...${NC}"
        pip freeze > requirements.txt
    fi
    
    # Navigate back to project root
    cd ../..
    
    # Deploy Firebase Functions
    echo -e "${YELLOW}🔥 Deploying to Firebase Functions...${NC}"
    firebase deploy --only functions > logs/deploy-backend.log 2>&1
    check_status "Backend deployment"
    
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    echo -e "${BLUE}🔌 API URL: https://your-region-sheltr-ai.cloudfunctions.net/api${NC}"
}

# Function to run development build
dev_build() {
    echo -e "${BLUE}🛠️  Running development build (no deployment)...${NC}"
    
    # Build frontend
    echo -e "${YELLOW}🌐 Building frontend...${NC}"
    cd $FRONTEND_DIR
    npm run build > ../logs/dev-build-frontend.log 2>&1
    check_status "Frontend development build"
    
    # Test backend
    echo -e "${YELLOW}🔌 Testing backend...${NC}"
    cd ../$BACKEND_DIR
    
    # Activate virtual environment and run tests
    source .venv/bin/activate
    python -m pytest --version > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        python -m pytest > ../logs/dev-build-backend.log 2>&1
        check_status "Backend tests"
    else
        echo -e "${YELLOW}⚠️  No pytest found, skipping tests${NC}"
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
    
    # Update environment
    update_environment
    
    echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
}

# Function to post-deployment verification
post_deployment_verification() {
    echo -e "${BLUE}🔍 Running post-deployment verification...${NC}"
    
    # Test frontend
    if curl -s https://sheltr-ai.web.app > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend health check failed${NC}"
    fi
    
    # Test backend (if deployed)
    # Note: This would need to be updated with actual function URL
    
    echo -e "${GREEN}✅ Post-deployment verification completed${NC}"
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
    fi
    
    if [ $choice -eq 2 ] || [ $choice -eq 3 ]; then
        echo -e "${BLUE}🔌 Backend:${NC} Check Firebase Console for function URL"
    fi
    
    echo -e "${BLUE}📊 Firebase Console:${NC} https://console.firebase.google.com/project/sheltr-ai"
    echo ""
    
    # Run post-deployment verification
    if [ $choice -ne 4 ]; then
        post_deployment_verification
    fi
    
    echo -e "${GREEN}✨ Deployment pipeline completed successfully!${NC}"
}

# Run main function
main 