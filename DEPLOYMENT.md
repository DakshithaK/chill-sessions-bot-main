# 🚀 Deployment Guide - Chill Sessions Bot

This guide will help you deploy your AI-powered Gen Z therapy bot with **free AI options**.

## 🆓 Free AI Provider Setup

### Option 1: Ollama (Recommended - 100% Free)

**Pros**: Completely free, runs locally, no API limits, privacy-focused
**Cons**: Requires local setup, needs decent hardware

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a lightweight model (3B parameters)
ollama pull llama3.2:3b

# Start Ollama server
ollama serve
```

**Configuration**:
```env
AI_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
```

### Option 2: Hugging Face (Free Tier)

**Pros**: Easy setup, good free tier, no local hardware needed
**Cons**: Rate limits, requires internet

1. Go to [Hugging Face Tokens](https://huggingface.co/settings/tokens)
2. Create account and generate a token
3. Configure:

```env
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=your_token_here
```

### Option 3: Groq (Free Tier)

**Pros**: Very fast responses, good free tier
**Cons**: Rate limits, requires internet

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up and get API key
3. Configure:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_api_key_here
```

### Option 4: OpenAI (Free Credit)

**Pros**: High quality responses, reliable
**Cons**: Costs money after free credit

1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Configure:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
```

## 🛠️ Local Development Setup

### Quick Start

```bash
# Clone and setup
git clone <your-repo>
cd chill-sessions-bot-main

# Run setup script
./setup.sh

# Choose your AI provider and configure backend/.env

# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
npm run dev
```

### Manual Setup

```bash
# Frontend
npm install
cp .env.example .env

# Backend
cd backend
npm install
cp env.example .env
# Edit .env with your AI provider settings

# Start both servers
npm run dev  # Frontend on :8080
cd backend && npm run dev  # Backend on :3001
```

## 🌐 Production Deployment

### Option 1: Railway (Recommended)

**Pros**: Easy deployment, automatic HTTPS, database included
**Cons**: Costs money for production use

1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically

**Environment Variables**:
```
AI_PROVIDER=groq
GROQ_API_KEY=your_key
NODE_ENV=production
FRONTEND_URL=https://your-app.railway.app
```

### Option 2: Render

**Pros**: Free tier available, easy setup
**Cons**: Free tier has limitations

1. Connect GitHub repo to Render
2. Create Web Service for backend
3. Create Static Site for frontend
4. Configure environment variables

### Option 3: Vercel + Railway

**Pros**: Best performance, free tiers
**Cons**: More complex setup

1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Update frontend environment variables

### Option 4: Self-Hosted (VPS)

**Pros**: Full control, can use Ollama
**Cons**: Requires server management

```bash
# On your VPS
git clone <your-repo>
cd chill-sessions-bot-main

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2:3b

# Setup application
./setup.sh

# Configure for production
# Edit backend/.env:
# NODE_ENV=production
# AI_PROVIDER=ollama
# OLLAMA_URL=http://localhost:11434

# Build and start
cd backend && npm run build && npm start
cd .. && npm run build

# Serve frontend with nginx or similar
```

## 🐳 Docker Deployment

### Backend Only

```bash
cd backend
docker build -t chill-sessions-backend .
docker run -p 3001:3001 --env-file .env chill-sessions-backend
```

### Full Stack with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - AI_PROVIDER=ollama
      - OLLAMA_URL=http://ollama:11434
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

  frontend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - VITE_API_URL=http://localhost:3001/api

volumes:
  ollama_data:
```

```bash
docker-compose up -d
```

## 🔧 Environment Configuration

### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=production

# AI Provider (choose one)
AI_PROVIDER=ollama  # ollama, huggingface, groq, openai

# Ollama (free)
OLLAMA_URL=http://localhost:11434

# Hugging Face (free tier)
HUGGINGFACE_API_KEY=your_token

# Groq (free tier)
GROQ_API_KEY=your_key

# OpenAI (paid)
OPENAI_API_KEY=your_key

# Database
DATABASE_PATH=./data/conversations.db

# Security
JWT_SECRET=your_secret_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `GET /api/health`
- AI Service: `GET /api/health/ai`

### Logs
```bash
# Backend logs
cd backend && npm run dev

# Production logs (if using PM2)
pm2 logs chill-sessions-backend
```

### Database Backup
```bash
# SQLite backup
cp backend/data/conversations.db backup-$(date +%Y%m%d).db
```

## 🚨 Troubleshooting

### Common Issues

1. **AI Service Not Responding**
   - Check API keys are correct
   - Verify AI provider is running (for Ollama)
   - Check rate limits (for cloud providers)

2. **CORS Errors**
   - Update FRONTEND_URL in backend/.env
   - Ensure frontend URL matches exactly

3. **Database Errors**
   - Check DATABASE_PATH is writable
   - Ensure data directory exists

4. **Rate Limiting**
   - Increase RATE_LIMIT_MAX_REQUESTS
   - Implement user authentication for higher limits

### Performance Optimization

1. **For Ollama**:
   - Use smaller models (3B instead of 7B+)
   - Increase server RAM if possible
   - Use GPU acceleration if available

2. **For Cloud APIs**:
   - Implement response caching
   - Use connection pooling
   - Monitor API usage

## 🔒 Security Considerations

1. **Environment Variables**: Never commit API keys
2. **Rate Limiting**: Configure appropriate limits
3. **CORS**: Restrict to your domain only
4. **HTTPS**: Always use in production
5. **Input Validation**: Already implemented in backend

## 📈 Scaling

### For High Traffic

1. **Database**: Migrate to PostgreSQL
2. **Caching**: Add Redis for session storage
3. **Load Balancing**: Use multiple backend instances
4. **CDN**: Serve frontend from CDN
5. **Monitoring**: Add application monitoring

### Cost Optimization

1. **Use Ollama**: For self-hosted, completely free
2. **Optimize Prompts**: Shorter prompts = lower costs
3. **Cache Responses**: Reduce API calls
4. **Rate Limiting**: Prevent abuse

## 🆘 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify environment variables
3. Test AI provider connectivity
4. Check network connectivity
5. Review this deployment guide

For additional help, check the backend README.md for detailed setup instructions.
