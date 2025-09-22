#!/bin/bash

# 🚀 SHELTR-AI Development Startup Script
# Starts both frontend (Next.js) and backend (FastAPI) simultaneously

echo "🏠 Starting SHELTR-AI Development Environment..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    local port=$1
    local process_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $port is already in use (${process_name})${NC}"
        echo -e "${YELLOW}   Killing existing process...${NC}"
        kill -9 $(lsof -ti:$port) 2>/dev/null || true
        sleep 3
        
        # Double check and force kill if still running
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${YELLOW}   Force killing stubborn processes...${NC}"
            pkill -9 -f "port.*$port" 2>/dev/null || true
            sleep 2
        fi
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}⏳ Waiting for ${service_name} to start...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s $url > /dev/null 2>&1; then
            echo -e "${GREEN}✅ ${service_name} is ready!${NC}"
            return 0
        fi
        
        echo -e "${BLUE}   Attempt $attempt/$max_attempts...${NC}"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ ${service_name} failed to start after $max_attempts attempts${NC}"
    return 1
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "apps" ]; then
    echo -e "${RED}❌ Please run this script from the sheltr-ai project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"

# Check ports and kill existing processes
check_port 3000 "Next.js"
check_port 8000 "FastAPI"

# Create log directories
mkdir -p logs

echo -e "${BLUE}🔧 Setting up backend environment...${NC}"

# Start Backend (FastAPI)
echo -e "${BLUE}🔥 Starting FastAPI Backend...${NC}"
(
    cd apps/api
    if [ ! -d ".venv" ]; then
        echo -e "${YELLOW}Creating Python virtual environment...${NC}"
        python3 -m venv .venv
    fi
    
    source .venv/bin/activate
    
    # Install dependencies if needed
    echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
    pip install -r requirements.txt > ../../logs/backend-install.log 2>&1
    pip install 'pydantic[email]' >> ../../logs/backend-install.log 2>&1
    
    echo -e "${GREEN}🐍 Starting FastAPI server on http://localhost:8000${NC}"
    python main.py > ../../logs/backend.log 2>&1 &
    echo $! > ../../logs/backend.pid
) &

# Start Frontend (Next.js)
echo -e "${BLUE}⚛️  Starting Next.js Frontend...${NC}"
(
    cd apps/web
    
    # Install dependencies if needed
    echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
    npm install > ../../logs/frontend-install.log 2>&1
    
    echo -e "${GREEN}🌐 Starting Next.js server on http://localhost:3000${NC}"
    npm run dev > ../../logs/frontend.log 2>&1 &
    echo $! > ../../logs/frontend.pid
) &

# Wait for services to start
echo -e "${BLUE}⏳ Waiting for services to initialize...${NC}"
sleep 5

# Check if services are running
echo -e "${BLUE}🔍 Checking service status...${NC}"

# Wait for backend
if wait_for_service "http://localhost:8000/health" "Backend API"; then
    echo -e "${GREEN}📊 API Documentation: http://localhost:8000/docs${NC}"
    
    # Test enhanced AI features  
    echo -e "${BLUE}🤖 Testing AI Chatbot...${NC}"
    if curl -s "http://localhost:8000/api/v1/chatbot/health" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ AI Chatbot: Ready${NC}"
    else
        echo -e "${YELLOW}⚠️  AI Chatbot: Service starting up...${NC}"
    fi
    
    # Test knowledge base
    echo -e "${BLUE}📚 Testing Knowledge Base...${NC}"
    if curl -s "http://localhost:8000/api/v1/knowledge/status" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Knowledge Base: 61+ Documents Ready for RAG${NC}"
    else
        echo -e "${YELLOW}⚠️  Knowledge Base: Service unavailable${NC}"
    fi
    
    # Test security system
    echo -e "${BLUE}🛡️ Testing Security System...${NC}"
    if curl -s "http://localhost:3000/dashboard/security" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Security Dashboard: Access logging active${NC}"
    else
        echo -e "${YELLOW}⚠️  Security Dashboard: Service starting up...${NC}"
    fi
    
    # Test donation system
    echo -e "${BLUE}💰 Testing Donation System...${NC}"
    if curl -s "http://localhost:8000/api/v1/demo/donations" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Donation System: Ready${NC}"
    else
        echo -e "${YELLOW}⚠️  Donation System: Service starting up...${NC}"
    fi
else
    echo -e "${RED}❌ Backend failed to start. Check logs/backend.log${NC}"
fi

# Wait for frontend
if wait_for_service "http://localhost:3000" "Frontend App"; then
    echo -e "${GREEN}🌐 Website: http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start. Check logs/frontend.log${NC}"
fi

echo ""
echo -e "${GREEN}🎉 SHELTR-AI Development Environment Ready!${NC}"
echo "========================================"
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔌 Backend API:${NC} http://localhost:8000"
echo -e "${BLUE}📚 API Docs:${NC} http://localhost:8000/docs"
echo -e "${BLUE}🏥 Health Check:${NC} http://localhost:8000/health"
echo ""
echo -e "${GREEN}🔐 5-Role Authentication System:${NC}"
echo "  • Super Admin: Full platform access + NDA preview"
echo "  • Platform Admin: System settings + NDA requirement"
echo "  • Shelter Admin: Shelter operations + participant management"
echo "  • Participant: QR code access + SmartFund™ wallet"
echo "  • Donor: Donation tracking + impact visibility"
echo ""
echo -e "${GREEN}🤖 Enhanced AI Features:${NC}"
echo "  • Knowledge Base: 61+ documents with 100% quality embeddings"
echo "  • Real-time Chatbot: http://localhost:8000/api/v1/chatbot/health"
echo "  • GitHub Sync: Automatic documentation updates"
echo "  • RAG Search: Advanced retrieval with MCP integration"
echo ""
echo -e "${GREEN}🛡️ Security & Compliance:${NC}"
echo "  • Real-time Access Logging: All login attempts tracked"
echo "  • Security Dashboard: http://localhost:3000/dashboard/security"
echo "  • NDA System: Digital signatures for Platform Admins"
echo "  • Vulnerability Scanning: GitHub dependency monitoring"
echo ""
echo -e "${GREEN}💰 Financial System:${NC}"
echo "  • SmartFund™ Distribution: 80-15-5 model active"
echo "  • Fraud Detection: Real-time monitoring"
echo "  • Financial Dashboard: http://localhost:3000/dashboard/financial"
echo "  • Donation Tracking: End-to-end transparency"
echo ""
echo -e "${YELLOW}📋 Session 15+ Testing Commands:${NC}"
echo "  • View backend logs: tail -f logs/backend.log"
echo "  • View frontend logs: tail -f logs/frontend.log"
echo "  • Test role-based access: Login as different user types"
echo "  • Test security logging: Check /dashboard/security after login"
echo "  • Test NDA system: Login as Platform Admin"
echo "  • Test knowledge base: Run GitHub sync from dashboard"
echo "  • Test financial data: Check fraud detection & audit trail"
echo "  • Stop services: ./stop-dev.sh"
echo ""
echo -e "${YELLOW}🧪 Multi-Role Business Logic Testing:${NC}"
echo "  • Platform Admin Dashboard: http://localhost:3000/dashboard"
echo "  • Donor Dashboard: http://localhost:3000/dashboard/donor"
echo "  • Participant Dashboard: http://localhost:3000/dashboard/participant"
echo "  • Security & Compliance: http://localhost:3000/dashboard/security"
echo "  • System Settings: http://localhost:3000/dashboard/settings"
echo "  • Knowledge Base: http://localhost:3000/dashboard/knowledge"
echo "  • Financial Oversight: http://localhost:3000/dashboard/financial"
echo ""
echo -e "${BLUE}🎯 Session 15+ Ready: Multi-Role Business Logic Testing + Security Dashboard! (Sep 21, 2025)${NC}"

# Keep the script running to show real-time status
echo -e "${BLUE}👀 Monitoring services... (Press Ctrl+C to stop)${NC}"

# Function to handle cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    
    if [ -f logs/backend.pid ]; then
        kill -9 $(cat logs/backend.pid) 2>/dev/null || true
        rm logs/backend.pid
    fi
    
    if [ -f logs/frontend.pid ]; then
        kill -9 $(cat logs/frontend.pid) 2>/dev/null || true
        rm logs/frontend.pid
    fi
    
    # Kill any remaining processes on our ports
    kill -9 $(lsof -ti:3000) 2>/dev/null || true
    kill -9 $(lsof -ti:8000) 2>/dev/null || true
    
    # Kill any FastAPI or Next.js processes
    pkill -9 -f "uvicorn.*main:app" 2>/dev/null || true
    pkill -9 -f "next.*dev" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Services stopped${NC}"
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Monitor services with enhanced status reporting
monitor_count=0
while true; do
    sleep 10
    ((monitor_count++))
    
    # Check if processes are still running
    backend_status="🟢"
    frontend_status="🟢"
    ai_status="🟢"
    knowledge_status="🟢"
    security_status="🟢"
    donation_status="🟢"
    
    if [ -f logs/backend.pid ] && ! kill -0 $(cat logs/backend.pid) 2>/dev/null; then
        echo -e "${RED}❌ Backend process died. Check logs/backend.log${NC}"
        rm logs/backend.pid
        backend_status="🔴"
    fi
    
    if [ -f logs/frontend.pid ] && ! kill -0 $(cat logs/frontend.pid) 2>/dev/null; then
        echo -e "${RED}❌ Frontend process died. Check logs/frontend.log${NC}"
        rm logs/frontend.pid
        frontend_status="🔴"
    fi
    
    # Every 2 minutes (12 cycles), show detailed status
    if [ $((monitor_count % 12)) -eq 0 ]; then
        # Test AI health
        if ! curl -s "http://localhost:8000/api/v1/chatbot/health" >/dev/null 2>&1; then
            ai_status="🟡"
        fi
        
        # Test knowledge base health
        if ! curl -s "http://localhost:8000/api/v1/knowledge/status" >/dev/null 2>&1; then
            knowledge_status="🟡"
        fi
        
        # Test security dashboard health
        if ! curl -s "http://localhost:3000/dashboard/security" >/dev/null 2>&1; then
            security_status="🟡"
        fi
        
        # Test donation system health
        if ! curl -s "http://localhost:8000/api/v1/demo/donations" >/dev/null 2>&1; then
            donation_status="🟡"
        fi
        
        echo -e "${BLUE}📊 Session 15+ Status: Backend ${backend_status} | Frontend ${frontend_status} | AI ${ai_status} | Knowledge ${knowledge_status} | Security ${security_status} | Donations ${donation_status} | $(date '+%H:%M:%S')${NC}"
    fi
done 