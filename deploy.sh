#!/bin/bash

# Deployment Helper Script for Chill Sessions Bot
# This script helps you deploy to Vercel

set -e

echo "🚀 Chill Sessions Bot - Deployment Helper"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel. Please login:${NC}"
    vercel login
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "=============================="
echo ""

# Check for backend .env file
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found${NC}"
    echo "Creating from env.example..."
    cp backend/env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env - Please edit it with your API keys!${NC}"
else
    echo -e "${GREEN}✅ backend/.env exists${NC}"
fi

# Check for GROQ_API_KEY
if grep -q "GROQ_API_KEY_REPLACED\|your_groq_api_key" backend/.env 2>/dev/null; then
    echo -e "${RED}⚠️  WARNING: GROQ_API_KEY not set in backend/.env${NC}"
    echo "   You'll need to set this in Vercel dashboard after deployment"
else
    echo -e "${GREEN}✅ GROQ_API_KEY appears to be set${NC}"
fi

echo ""
echo "📦 Deployment Steps:"
echo "==================="
echo ""
echo "1. First, deploy the BACKEND:"
echo "   cd backend"
echo "   vercel"
echo ""
echo "2. Note the backend URL (e.g., https://your-backend.vercel.app)"
echo ""
echo "3. Then, deploy the FRONTEND:"
echo "   cd .."
echo "   vercel"
echo ""
echo "4. Note the frontend URL (e.g., https://your-frontend.vercel.app)"
echo ""
echo "5. Set environment variables in Vercel Dashboard:"
echo ""
echo "   BACKEND Environment Variables:"
echo "   - GROQ_API_KEY=your_groq_api_key"
echo "   - AI_PROVIDER=groq"
echo "   - FRONTEND_URL=https://your-frontend-url.vercel.app"
echo "   - NODE_ENV=production"
echo "   - PORT=3001"
echo "   - DATABASE_PATH=./data/conversations.db"
echo ""
echo "   FRONTEND Environment Variables:"
echo "   - VITE_API_URL=https://your-backend-url.vercel.app/api"
echo ""
echo "6. Redeploy both services after setting environment variables"
echo ""

read -p "Press Enter to start backend deployment, or Ctrl+C to cancel..."

# Deploy backend
echo ""
echo -e "${GREEN}🚀 Deploying BACKEND...${NC}"
cd backend
vercel --yes

echo ""
echo -e "${GREEN}✅ Backend deployed!${NC}"
echo ""
read -p "Enter your backend URL (e.g., https://your-backend.vercel.app): " BACKEND_URL

# Go back to root
cd ..

# Deploy frontend
echo ""
echo -e "${GREEN}🚀 Deploying FRONTEND...${NC}"
vercel --yes

echo ""
echo -e "${GREEN}✅ Frontend deployed!${NC}"
echo ""
read -p "Enter your frontend URL (e.g., https://your-frontend.vercel.app): " FRONTEND_URL

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "2. For BACKEND project, add these environment variables:"
echo "   - GROQ_API_KEY=your_groq_api_key"
echo "   - AI_PROVIDER=groq"
echo "   - FRONTEND_URL=$FRONTEND_URL"
echo "   - NODE_ENV=production"
echo ""
echo "3. For FRONTEND project, add this environment variable:"
echo "   - VITE_API_URL=$BACKEND_URL/api"
echo ""
echo "4. Redeploy both projects after adding environment variables"
echo ""
echo "5. Your app will be live at: $FRONTEND_URL"
echo ""
echo -e "${GREEN}🎉 Happy deploying!${NC}"

