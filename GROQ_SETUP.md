# 🚀 Groq Setup Guide - Free AI for Your Therapy Bot

This guide will help you set up Groq as your AI provider - it's fast, free, and doesn't require keeping your local machine running!

## 🆓 Why Groq?

- **100% Free Tier**: Generous free usage limits
- **Lightning Fast**: Ultra-fast inference speeds
- **No Local Setup**: Runs in the cloud, no local machine needed
- **Reliable**: Professional-grade API with good uptime
- **Latest Models**: Access to Llama 3.1 and other cutting-edge models

## 📋 Step 1: Get Your Groq API Key

1. **Go to Groq Console**: Visit [https://console.groq.com/](https://console.groq.com/)

2. **Sign Up**: Create a free account
   - Use your email or GitHub account
   - No credit card required for free tier

3. **Generate API Key**:
   - Once logged in, go to "API Keys" in the sidebar
   - Click "Create API Key"
   - Give it a name like "Chill Sessions Bot"
   - Copy the key (it starts with `gsk_...`)

4. **Note the Free Limits**:
   - 14,400 requests per day
   - 30 requests per minute
   - Perfect for a therapy bot!

## ⚙️ Step 2: Configure Your Backend

1. **Create Environment File**:
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Edit the .env file**:
   ```env
   # AI Provider Configuration
   AI_PROVIDER=groq
   
   # Groq Configuration
   GROQ_API_KEY=GROQ_API_KEY_REPLACED
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_PATH=./data/conversations.db
   
   # Security
   JWT_SECRET=your_jwt_secret_here
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:8080
   ```

3. **Replace `GROQ_API_KEY_REPLACED`** with your real Groq API key

## 🚀 Step 3: Start Your Application

1. **Install Dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ..
   npm install
   ```

2. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   You should see:
   ```
   🚀 Server running on port 3001
   📱 Frontend URL: http://localhost:8080
   🌍 Environment: development
   ✅ Database initialized successfully
   ```

3. **Start Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
   You should see:
   ```
   Local:   http://localhost:8080/
   Network: use --host to expose
   ```

4. **Test the Connection**:
   - Open http://localhost:8080
   - You should see your therapy bot interface
   - Try sending a message to test the AI

## 🧪 Step 4: Test Your Setup

1. **Health Check**:
   ```bash
   curl http://localhost:3001/api/health/ai
   ```
   
   Expected response:
   ```json
   {
     "status": "healthy",
     "aiProvider": "groq",
     "testResponse": "Hey! I'm here to listen and support you..."
   }
   ```

2. **Test Chat**:
   - Go to http://localhost:8080
   - Type a message like "I'm feeling stressed about school"
   - You should get a Gen Z-friendly response from the AI

## 🔧 Troubleshooting

### Common Issues:

1. **"Groq API key not configured"**
   - Check your `.env` file has `GROQ_API_KEY=your_key`
   - Make sure there are no spaces around the `=`
   - Restart the backend server

2. **"Invalid API key"**
   - Double-check your API key from Groq console
   - Make sure it starts with `gsk_`
   - Try generating a new API key

3. **"Rate limit exceeded"**
   - You've hit the free tier limits
   - Wait a few minutes and try again
   - Consider upgrading to paid tier for higher limits

4. **CORS errors**
   - Make sure `FRONTEND_URL=http://localhost:8080` in your `.env`
   - Restart both frontend and backend

### Debug Mode:

Add this to your backend `.env` to see detailed logs:
```env
NODE_ENV=development
DEBUG=*
```

## 📊 Monitoring Usage

1. **Check Your Usage**:
   - Go to [Groq Console](https://console.groq.com/)
   - Click on "Usage" in the sidebar
   - Monitor your daily requests

2. **Rate Limiting**:
   - Free tier: 30 requests per minute
   - If you hit limits, the bot will show a friendly error message
   - Users can try again in a few seconds

## 🚀 Production Deployment

When you're ready to deploy:

1. **Update Environment Variables**:
   ```env
   NODE_ENV=production
   FRONTEND_URL=https://your-domain.com
   ```

2. **Deploy to Railway/Render/Vercel**:
   - Add your `GROQ_API_KEY` to the platform's environment variables
   - Deploy your backend
   - Update frontend to point to your backend URL

## 💡 Pro Tips

1. **Optimize Prompts**: Shorter prompts = faster responses
2. **Cache Responses**: Implement caching for common questions
3. **Monitor Usage**: Keep an eye on your daily limits
4. **Error Handling**: The bot gracefully handles API errors

## 🆘 Need Help?

If you run into issues:

1. Check the backend logs for error messages
2. Verify your API key is correct
3. Test the Groq API directly: https://console.groq.com/playground
4. Check your internet connection
5. Review this guide step by step

## 🎉 You're All Set!

Your AI therapy bot is now powered by Groq's lightning-fast AI! The bot will:
- Respond quickly to user messages
- Use Gen Z appropriate language
- Provide empathetic therapy support
- Work 24/7 without your local machine running

Happy coding! 🚀
