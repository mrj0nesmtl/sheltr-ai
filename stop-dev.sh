#!/bin/bash

# 🛑 SHELTR-AI Development Stop Script
# Cleanly stops both frontend and backend services

echo "🛑 Stopping SHELTR-AI Development Environment..."
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Stop services by PID if available
if [ -f logs/backend.pid ]; then
    echo -e "${BLUE}🔥 Stopping FastAPI Backend...${NC}"
    kill $(cat logs/backend.pid) 2>/dev/null || true
    rm logs/backend.pid
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo -e "${YELLOW}⚠️  No backend PID file found${NC}"
fi

if [ -f logs/frontend.pid ]; then
    echo -e "${BLUE}⚛️  Stopping Next.js Frontend...${NC}"
    kill $(cat logs/frontend.pid) 2>/dev/null || true
    rm logs/frontend.pid
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo -e "${YELLOW}⚠️  No frontend PID file found${NC}"
fi

# Kill any remaining processes on our ports
echo -e "${BLUE}🔍 Checking for remaining processes...${NC}"

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}🔨 Killing remaining processes on port 3000...${NC}"
    kill $(lsof -ti:3000) 2>/dev/null || true
fi

if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}🔨 Killing remaining processes on port 8000...${NC}"
    kill $(lsof -ti:8000) 2>/dev/null || true
fi

# Clean up log directory if it exists
if [ -d logs ]; then
    echo -e "${BLUE}🧹 Cleaning up log files...${NC}"
    rm -f logs/*.pid
fi

echo ""
echo -e "${GREEN}✅ All SHELTR-AI services stopped successfully!${NC}"
echo -e "${BLUE}💡 Run ./start-dev.sh to restart the development environment${NC}" 