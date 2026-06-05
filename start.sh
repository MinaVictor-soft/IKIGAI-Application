#!/bin/bash

# IKIGAI Quest Replit Start Script
# Starts all services at once

set -e

echo "🚀 IKIGAI Quest - Starting Services"
echo "===================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Change to project root
cd "$(dirname "$0")"

# Start Backend
echo -e "${BLUE}🔌 Starting Backend API (port 3000)...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
sleep 5

# Start Web App in background
echo -e "${BLUE}🌐 Starting Web App (port 5174)...${NC}"
cd ../web-app
npm run dev &
WEB_PID=$!
echo -e "${GREEN}✅ Web App started (PID: $WEB_PID)${NC}"

# Start Admin Dashboard in background
echo -e "${BLUE}🛠️  Starting Admin Dashboard (port 5173)...${NC}"
cd ../admin-dashboard
npm run dev &
ADMIN_PID=$!
echo -e "${GREEN}✅ Admin Dashboard started (PID: $ADMIN_PID)${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ All Services Running!${NC}"
echo "=========================================="
echo ""
echo "📱 Access URLs:"
echo "   🌐 Web App: http://localhost:5174"
echo "   🛠️  Admin Dashboard: http://localhost:5173"
echo "   🔌 Backend API: http://localhost:3000"
echo "   📚 API Docs: http://localhost:3000/api-docs"
echo ""
echo "🔑 Default Credentials:"
echo "   Email: admin@example.com"
echo "   Password: password123"
echo ""
echo "📋 Service PIDs:"
echo "   Backend: $BACKEND_PID"
echo "   Web App: $WEB_PID"
echo "   Admin: $ADMIN_PID"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all processes
wait
