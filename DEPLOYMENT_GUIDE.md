# Deployment Guide: Making Your App Live

## 🎯 Understanding Hosting vs GitHub

- **GitHub** = Code storage (like a filing cabinet)
- **Hosting Platform** = Where your app actually runs (like a restaurant)

To make your app accessible to users, you need to deploy it to a hosting platform.

---

## 🚀 Recommended Hosting Options

### Option 1: Vercel (Easiest - Recommended) ⭐

**Best for:** Quick deployment, free tier, automatic deployments

**Steps:**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy Frontend:**
```bash
# In project root
vercel
```
   - Follow prompts
   - Set build command: `npm run build`
   - Set output directory: `dist`

4. **Deploy Backend:**
```bash
cd backend
vercel
```
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

5. **Set Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `GROQ_API_KEY` = your Groq API key
     - `AI_PROVIDER` = `groq`
     - `FRONTEND_URL` = your frontend URL (from step 3)
     - `VITE_API_URL` = your backend URL (from step 4)

**Free Tier:** ✅ Yes, generous limits

---

### Option 2: Render (Good for Full-Stack)

**Best for:** Full-stack apps, easy setup

**Steps:**

1. Go to [render.com](https://render.com) and sign up

2. **Deploy Backend:**
   - Click **New** → **Web Service**
   - Connect your GitHub repository
   - Name: `mindspace-ai-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `GROQ_API_KEY`
     - `AI_PROVIDER=groq`
     - `FRONTEND_URL` (set after frontend deploys)
     - `NODE_ENV=production`

3. **Deploy Frontend:**
   - Click **New** → **Static Site**
   - Connect your GitHub repository
   - Name: `mindspace-ai-frontend`
   - Root Directory: `/` (root)
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL` = your backend URL from step 2

4. **Update Backend:**
   - Go back to backend settings
   - Update `FRONTEND_URL` = your frontend URL

**Free Tier:** ✅ Yes, with limitations

---

### Option 3: Railway (Simplest)

**Best for:** One-click deployment

**Steps:**

1. Go to [railway.app](https://railway.app) and sign up with GitHub

2. **Deploy Backend:**
   - Click **New Project** → **Deploy from GitHub**
   - Select your repository
   - Add service → Select `backend` folder
   - Railway auto-detects Node.js
   - Add environment variables:
     - `GROQ_API_KEY`
     - `AI_PROVIDER=groq`
     - `FRONTEND_URL` (set after frontend deploys)

3. **Deploy Frontend:**
   - Add another service → Select root folder
   - Set build command: `npm install && npm run build`
   - Set start command: `npm run preview` (or use static hosting)
   - Add environment variable:
     - `VITE_API_URL` = your backend URL

**Free Tier:** ✅ $5 credit/month

---

### Option 4: Netlify (Frontend) + Railway/Render (Backend)

**Best for:** Frontend on Netlify, backend separately

**Steps:**

1. **Frontend on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL` = your backend URL

2. **Backend on Railway/Render:**
   - Follow Option 2 or 3 above
   - Set `FRONTEND_URL` = your Netlify URL

---

## 📋 Environment Variables Checklist

### Backend (Required):
```
GROQ_API_KEY=your_groq_api_key_here
AI_PROVIDER=groq
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=3001
DATABASE_PATH=./data/conversations.db
```

### Frontend (Required):
```
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🔗 After Deployment

Once deployed, you'll get URLs like:
- Frontend: `https://mindspace-ai.vercel.app`
- Backend: `https://mindspace-ai-backend.vercel.app`

Share the **frontend URL** with users!

---

## 🆘 Common Issues

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
- Include `https://` and no trailing slash

### API Not Found
- Check `VITE_API_URL` includes `/api` at the end
- Verify backend is running and accessible

### Environment Variables Not Working
- Restart services after adding variables
- Check variable names match exactly (case-sensitive)

---

## 💡 Quick Start Recommendation

**For fastest deployment, use Vercel:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy frontend
vercel

# 4. Deploy backend
cd backend
vercel

# 5. Set environment variables in Vercel dashboard
# 6. Update FRONTEND_URL and VITE_API_URL
# 7. Redeploy if needed
```

---

## 📊 Comparison

| Platform | Free Tier | Ease | Best For |
|----------|-----------|------|----------|
| **Vercel** | ✅ Excellent | ⭐⭐⭐⭐⭐ | Quick deployment |
| **Render** | ✅ Good | ⭐⭐⭐⭐ | Full-stack apps |
| **Railway** | ✅ $5/month | ⭐⭐⭐⭐⭐ | Simple setup |
| **Netlify** | ✅ Good | ⭐⭐⭐⭐ | Frontend hosting |

---

**Remember:** GitHub stores your code, but hosting platforms make it accessible to users!

