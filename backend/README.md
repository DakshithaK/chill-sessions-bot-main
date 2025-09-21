# Chill Sessions Bot - Backend

AI-powered Gen Z therapy bot backend with multiple free AI provider options.

## 🆓 Free AI Options

This backend supports multiple AI providers, including several **completely free** options:

### 1. Ollama (Recommended - 100% Free)
- **Cost**: Completely free
- **Setup**: Run locally on your machine
- **Models**: Llama 3.2, Mistral, and more
- **Privacy**: All data stays on your machine

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (3B model is lightweight and fast)
ollama pull llama3.2:3b

# Start Ollama server
ollama serve
```

### 2. Hugging Face (Free Tier)
- **Cost**: Free tier with generous limits
- **Setup**: Get free API token
- **Models**: Various open-source models
- **Limits**: 1000 requests/month free

### 3. Groq (Free Tier)
- **Cost**: Free tier available
- **Setup**: Get free API key
- **Models**: Fast inference with Llama models
- **Speed**: Very fast responses

### 4. OpenAI (Free Credit)
- **Cost**: $5 free credit to start
- **Setup**: Get API key
- **Models**: GPT-3.5-turbo (cheaper than GPT-4)

## 🚀 Quick Start

### Option 1: Using Ollama (Recommended for Free Setup)

1. **Install Ollama**:
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ollama pull llama3.2:3b
   ollama serve
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env and set AI_PROVIDER=ollama
   npm run dev
   ```

### Option 2: Using Hugging Face (Free API)

1. **Get Hugging Face Token**:
   - Go to https://huggingface.co/settings/tokens
   - Create a free account and generate a token

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env and set:
   # AI_PROVIDER=huggingface
   # HUGGINGFACE_API_KEY=your_token_here
   npm run dev
   ```

### Option 3: Using Groq (Free Tier)

1. **Get Groq API Key**:
   - Go to https://console.groq.com/
   - Sign up for free and get API key

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env and set:
   # AI_PROVIDER=groq
   # GROQ_API_KEY=your_key_here
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── database/          # Database setup and models
│   ├── middleware/        # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # AI service providers
│   └── server.ts         # Main server file
├── data/                 # SQLite database files
├── dist/                 # Compiled TypeScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Choose your AI provider
AI_PROVIDER=ollama  # ollama, huggingface, groq, openai

# Ollama (free)
OLLAMA_URL=http://localhost:11434

# Hugging Face (free tier)
HUGGINGFACE_API_KEY=your_token

# Groq (free tier)
GROQ_API_KEY=your_key

# OpenAI (paid, but has free credit)
OPENAI_API_KEY=your_key

# Server config
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health
- `GET /api/health/ai` - AI service health

### Chat
- `POST /api/chat/sessions` - Create new session
- `GET /api/chat/sessions/:id` - Get session details
- `GET /api/chat/sessions/:id/messages` - Get messages
- `POST /api/chat/sessions/:id/messages` - Send message
- `GET /api/chat/sessions` - Get recent sessions

## 🐳 Docker Deployment

```bash
# Build and run with Docker
docker build -t chill-sessions-backend .
docker run -p 3001:3001 --env-file .env chill-sessions-backend
```

## 🔒 Security Features

- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with Joi
- Error handling middleware
- SQL injection protection

## 💾 Database

Uses SQLite for simplicity:
- No external database setup required
- Automatic migrations
- Conversation history storage
- Session management

## 🚀 Production Deployment

### Vercel/Netlify
The backend can be deployed to serverless platforms with some modifications for the database layer.

### Railway/Render
Perfect for full-stack deployment with persistent storage.

### Self-hosted
Use Docker or direct Node.js deployment with PM2.

## 📊 Monitoring

The backend includes:
- Request logging with Morgan
- Error tracking
- Health check endpoints
- Performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use for your projects!
