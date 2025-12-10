#!/bin/bash

echo "🚀 Setting up Chill Sessions Bot with Groq AI"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install && cd ..

# Create backend .env file
echo "⚙️  Setting up Groq configuration..."
if [ ! -f backend/.env ]; then
    cat > backend/.env << 'EOF'
# Server Configuration
PORT=3001
NODE_ENV=development

# AI Provider Configuration (using Groq)
AI_PROVIDER=groq

# Groq Configuration (FREE tier)
GROQ_API_KEY=your_groq_api_key_here

# Database Configuration
DATABASE_PATH=./data/conversations.db

# Security
JWT_SECRET=chill-sessions-bot-secret-key-2024
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=http://localhost:8080
EOF
    echo "✅ Created backend/.env file"
else
    echo "✅ Backend .env already exists"
fi

# Create frontend .env file
if [ ! -f .env ]; then
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:3001/api
EOF
    echo "✅ Created frontend .env file"
else
    echo "✅ Frontend .env already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🔑 NEXT STEPS - Get your Groq API Key:"
echo "1. Go to: https://console.groq.com/"
echo "2. Sign up for free (no credit card required)"
echo "3. Go to 'API Keys' and create a new key"
echo "4. Copy the key (starts with 'gsk_...')"
echo "5. Edit backend/.env and replace 'your_groq_api_key_here' with your actual key"
echo ""
echo "🚀 To start the application:"
echo "1. Start backend: cd backend && npm run dev"
echo "2. Start frontend: npm run dev"
echo ""
echo "📖 For detailed instructions, see GROQ_SETUP.md"
echo ""
echo "🆓 Groq Free Tier Limits:"
echo "   - 14,400 requests per day"
echo "   - 30 requests per minute"
echo "   - Perfect for a therapy bot!"
