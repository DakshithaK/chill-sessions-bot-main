# 🚀 Quick Deployment Guide

This guide will help you deploy your Chill Sessions Bot in minutes!

## ⚡ Choose Your Platform

### Option 1: Railway (Recommended for Backend) ⭐

**Why Railway?** 
- Better for SQLite databases (persistent storage)
- Simple one-click deployment
- Free $5 credit/month

**Steps:**

1. **Sign up at [railway.app](https://railway.app)** (use GitHub login)

2. **Deploy Backend:**
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Click "Add Service" → "GitHub Repo"
   - Select the `backend` folder
   - Railway auto-detects Node.js
   - Add environment variables:
     ```
     GROQ_API_KEY=your_groq_api_key
     AI_PROVIDER=groq
     NODE_ENV=production
     PORT=3001
     DATABASE_PATH=./data/conversations.db
     FRONTEND_URL=https://your-frontend-url.com (set after frontend deploys)
     ```
   - Click "Deploy"

3. **Deploy Frontend:**
   - Add another service → Select root folder
   - Set build command: `npm install && npm run build`
   - Set start command: `npx serve -s dist -l 8080`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```
   - Click "Deploy"

4. **Update Backend:**
   - Go back to backend service
   - Update `FRONTEND_URL` with your frontend URL
   - Redeploy

---

### Option 2: Render (Good Alternative)

**Steps:**

1. **Sign up at [render.com](https://render.com)**

2. **Deploy Backend:**
   - New → Web Service
   - Connect GitHub repo
   - Name: `chill-sessions-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     GROQ_API_KEY=your_groq_api_key
     AI_PROVIDER=groq
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-url.onrender.com
     ```
   - Click "Create Web Service"

3. **Deploy Frontend:**
   - New → Static Site
   - Connect GitHub repo
   - Name: `chill-sessions-frontend`
   - Root Directory: `/` (root)
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variable:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Click "Create Static Site"

---

### Option 3: Vercel (Frontend) + Railway (Backend) ⭐ Best Performance

**Why this combo?**
- Vercel excels at frontend hosting
- Railway handles backend with database better

**Steps:**

1. **Deploy Backend to Railway** (follow Option 1, step 2)

2. **Deploy Frontend to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Deploy (from project root)
   vercel
   ```
   - Follow prompts
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```

3. **Update Backend:**
   - Update `FRONTEND_URL` in Railway with your Vercel URL
   - Redeploy backend

---

## 🔑 Getting Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up/login
3. Go to API Keys section
4. Create a new API key
5. Copy it (you won't see it again!)

## 🔒 IMPORTANT: Where to Add API Keys

**⚠️ NEVER commit API keys to GitHub!**

Instead, add them as **Environment Variables** in your hosting platform's dashboard:

### Railway:
1. Deploy your code (without keys)
2. Click your service → **"Variables"** tab
3. Click **"New Variable"**
4. Add: `GROQ_API_KEY` = `your_key_here`
5. Click **"Add"** (Railway auto-redeploys)

### Render:
1. Deploy your code
2. Click your service → **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add: `GROQ_API_KEY` = `your_key_here`
5. Click **"Save Changes"** → Manual Deploy

### Vercel:
1. Deploy your code
2. Go to project → **"Settings"** → **"Environment Variables"**
3. Add: `GROQ_API_KEY` = `your_key_here`
4. Click **"Save"** → Redeploy

**✅ Your keys stay secure in the platform, NOT in GitHub!**

📖 See [SECURE_DEPLOYMENT.md](./SECURE_DEPLOYMENT.md) for detailed security guide.

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is running and accessible
- [ ] Environment variables are set correctly
- [ ] `FRONTEND_URL` in backend matches frontend URL exactly
- [ ] `VITE_API_URL` in frontend includes `/api` at the end
- [ ] Test chat functionality
- [ ] Check backend logs for errors

---

## 🆘 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your frontend URL **exactly**
- Include `https://` and **no trailing slash**

### API Not Found
- Check `VITE_API_URL` includes `/api` at the end
- Verify backend is running (check health endpoint: `https://your-backend-url/api/health`)

### Database Errors
- Railway/Render handle persistent storage automatically
- If using Vercel for backend, consider migrating to Railway (Vercel is stateless)

---

## 📝 Quick Commands

```bash
# Test backend locally
cd backend
npm run dev

# Test frontend locally
npm run dev

# Build for production
npm run build
cd backend && npm run build
```

---

**Need help?** Check the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for more details!

