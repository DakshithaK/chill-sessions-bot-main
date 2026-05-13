# 🔒 Secure Deployment Guide - API Keys

## ⚠️ IMPORTANT: Never Commit API Keys to GitHub!

Your API keys should **NEVER** be committed to GitHub. Instead, you'll set them as **environment variables** in your hosting platform's dashboard.

---

## ✅ How It Works

1. **Your code stays on GitHub** (without API keys)
2. **API keys are stored securely** in your hosting platform (Railway, Vercel, Render, etc.)
3. **The platform injects them** at runtime

---

## 🚀 Setting Environment Variables in Hosting Platforms

### Railway (Recommended)

1. **Deploy your code** (without API keys)
2. **Go to your service** → Click on it
3. **Click "Variables" tab**
4. **Click "New Variable"**
5. **Add each variable:**
   - Name: `GROQ_API_KEY`
   - Value: `your_actual_api_key_here`
   - Click "Add"
6. **Repeat for all variables:**
   ```
   GROQ_API_KEY=your_key_here
   AI_PROVIDER=groq
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.com
   ```
7. **Redeploy** (Railway auto-redeploys when you add variables)

**✅ Your API key is now secure and NOT in GitHub!**

---

### Render

1. **Deploy your code**
2. **Go to your service** → Click on it
3. **Click "Environment" tab**
4. **Click "Add Environment Variable"**
5. **Add each variable:**
   - Key: `GROQ_API_KEY`
   - Value: `your_actual_api_key_here`
   - Click "Save Changes"
6. **Repeat for all variables**
7. **Manual Deploy** → Click "Manual Deploy" → "Deploy latest commit"

---

### Vercel

1. **Deploy your code**
2. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
3. **Click your project**
4. **Go to "Settings"** → "Environment Variables"
5. **Add each variable:**
   - Name: `GROQ_API_KEY`
   - Value: `your_actual_api_key_here`
   - Environment: Select "Production", "Preview", "Development" (or all)
   - Click "Save"
6. **Redeploy** → Go to "Deployments" → Click "..." → "Redeploy"

---

## 📋 Complete Environment Variables Checklist

### Backend Environment Variables (Set in Railway/Render/Vercel Dashboard):

```
GROQ_API_KEY=your_groq_api_key_here
AI_PROVIDER=groq
NODE_ENV=production
PORT=3001
DATABASE_PATH=./data/conversations.db
FRONTEND_URL=https://your-frontend-url.com
JWT_SECRET=any_random_string_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables:

```
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🔍 Verify Your .gitignore

Your `.gitignore` should already exclude `.env` files. Check it includes:

```
.env
.env.local
.env.production
backend/.env
backend/.env.local
```

**✅ Your `.gitignore` is already configured correctly!**

---

## 🧪 Testing Locally (Safe)

For local development, you can use `.env` files (they're gitignored):

1. **Copy the example:**
   ```bash
   cp backend/env.example backend/.env
   ```

2. **Edit `backend/.env`** with your actual keys (this file stays local)

3. **Never commit `.env` files** - they're already in `.gitignore`

---

## ✅ Security Checklist

- [ ] ✅ `.env` files are in `.gitignore` (already done)
- [ ] ✅ Never commit API keys to GitHub
- [ ] ✅ Set environment variables in hosting platform dashboard
- [ ] ✅ Use different keys for development and production
- [ ] ✅ Rotate keys if accidentally exposed

---

## 🆘 What If I Accidentally Committed an API Key?

1. **Immediately revoke the key** in Groq console
2. **Generate a new key**
3. **Remove it from git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push** (if you're the only contributor):
   ```bash
   git push origin --force --all
   ```
5. **Set the new key** in your hosting platform

---

## 💡 Pro Tips

1. **Use different API keys** for development and production
2. **Set up environment-specific variables** in your hosting platform
3. **Never share API keys** in screenshots, emails, or chat
4. **Use platform secrets management** - they're encrypted and secure

---

**Remember:** Your code goes to GitHub. Your secrets stay in your hosting platform! 🔒

