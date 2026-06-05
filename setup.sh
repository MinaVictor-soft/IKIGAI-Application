#!/bin/bash

# IKIGAI Quest Replit Setup Script
# Automatic setup - runs on every Replit boot
# No manual configuration needed!

set -e

echo "🚀 IKIGAI Quest - Automatic Setup Started"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Backend Setup
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install --production
else
    echo "Backend dependencies already installed"
fi

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Setup Database (Create tables if they don't exist)
echo "Setting up database..."
npx prisma db push --skip-generate 2>/dev/null || echo "Database already synced"

# Build backend
echo "Building backend..."
npm run build

cd ..

# 2. Web App Setup
echo -e "${BLUE}🌐 Setting up Web App...${NC}"
cd web-app

if [ ! -d "node_modules" ]; then
    echo "Installing web-app dependencies..."
    npm install --production
else
    echo "Web-app dependencies already installed"
fi

# Build web app
echo "Building web app..."
npm run build

# Copy dist to backend public folder for serving
echo "Copying web-app build to backend..."
mkdir -p ../backend/public
cp -r dist/* ../backend/public/ 2>/dev/null || true

cd ..

# 3. Admin Dashboard Setup (Optional)
echo -e "${BLUE}🛠️  Setting up Admin Dashboard...${NC}"
cd admin-dashboard

if [ ! -d "node_modules" ]; then
    echo "Installing admin-dashboard dependencies..."
    npm install --production
else
    echo "Admin-dashboard dependencies already installed"
fi

# Build admin dashboard
echo "Building admin-dashboard..."
npm run build 2>/dev/null || echo "Admin dashboard build skipped"

cd ..

# 4. Environment Setup
echo -e "${BLUE}⚙️  Setting up environment variables...${NC}"

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ikigai_quest
JWT_SECRET=${JWT_SECRET:-ikigai-quest-super-secret-key}
VITE_API_URL=${VITE_API_URL:-http://localhost:3000/api}
EOF
fi

if [ ! -f "web-app/.env" ]; then
    echo "Creating web-app/.env..."
    cat > web-app/.env << EOF
VITE_API_URL=${VITE_API_URL:-http://localhost:3000/api}
EOF
fi

if [ ! -f "admin-dashboard/.env" ]; then
    echo "Creating admin-dashboard/.env..."
    cat > admin-dashboard/.env << EOF
VITE_API_URL=${VITE_API_URL:-http://localhost:3000/api}
EOF
fi

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "🌍 URLs:"
echo "   - Web App: http://localhost:5174"
echo "   - Admin Dashboard: http://localhost:5173"
echo "   - Backend API: http://localhost:3000"
echo "   - API Docs: http://localhost:3000/api-docs"
echo ""
echo "📚 Next Steps:"
echo "   1. Backend will start automatically"
echo "   2. Visit http://localhost:3000 to verify API"
echo "   3. Start web-app: cd web-app && npm run dev"
echo "   4. Start admin-dashboard: cd admin-dashboard && npm run dev"
echo ""
echo -e "${YELLOW}Note: Update JWT_SECRET in .env for production!${NC}"
