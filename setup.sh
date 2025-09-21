#!/bin/bash

echo "🚀 Setting up Chill Sessions Bot - AI Therapy for Gen Z"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create environment files
echo "⚙️  Setting up environment files..."

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file"
    echo "📝 Please edit backend/.env to configure your AI provider"
else
    echo "✅ Backend .env already exists"
fi

# Frontend .env
if [ ! -f .env ]; then
    cat > .env << EOF
VITE_API_URL=http://localhost:3001/api
EOF
    echo "✅ Created frontend .env file"
else
    echo "✅ Frontend .env already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🆓 FREE AI Options (choose one):"
echo "1. Ollama (Recommended - 100% Free):"
echo "   curl -fsSL https://ollama.ai/install.sh | sh"
echo "   ollama pull llama3.2:3b"
echo "   ollama serve"
echo ""
echo "2. Hugging Face (Free tier):"
echo "   - Get token from: https://huggingface.co/settings/tokens"
echo "   - Set HUGGINGFACE_API_KEY in backend/.env"
echo "   - Set AI_PROVIDER=huggingface in backend/.env"
echo ""
echo "3. Groq (Free tier):"
echo "   - Get API key from: https://console.groq.com/"
echo "   - Set GROQ_API_KEY in backend/.env"
echo "   - Set AI_PROVIDER=groq in backend/.env"
echo ""
echo "🚀 To start the application:"
echo "1. Start backend: cd backend && npm run dev"
echo "2. Start frontend: npm run dev"
echo ""
echo "📖 For detailed setup instructions, see backend/README.md"
