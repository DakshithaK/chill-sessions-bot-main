# GitHub Hosting Guide

This guide will help you push your project to GitHub and set up hosting.

## 📋 Prerequisites

- Git installed on your machine
- GitHub account
- Your code is ready to push

## 🚀 Step 1: Prepare Your Repository

### 1.1 Check Current Status

```bash
# Check if git is initialized
git status

# Check remote repository (you already have one configured)
git remote -v
```

### 1.2 Ensure Sensitive Files Are Ignored

**IMPORTANT**: Never commit `.env` files or API keys to GitHub!

The `.gitignore` file has been updated to exclude:
- `.env` files
- Database files (`*.db`)
- `node_modules`
- Build outputs

Verify your `.env` files are not tracked:
```bash
git status
# Make sure you don't see backend/.env in the output
```

If `.env` files are tracked, remove them:
```bash
git rm --cached backend/.env
git rm --cached .env
```

## 📤 Step 2: Push to GitHub

### 2.1 Stage Your Changes

```bash
# Add all files (respecting .gitignore)
git add .

# Check what will be committed
git status
```

### 2.2 Commit Your Changes

```bash
git commit -m "Initial commit: MindSpace AI therapy bot"
```

### 2.3 Push to GitHub

```bash
# Push to main branch
git push -u origin main

# If you get an error, try:
git push -u origin main --force
```

## 🌐 Step 3: Hosting Options

### Option A: GitHub Pages (Frontend Only - Static)

GitHub Pages can host your frontend, but you'll need a separate backend host.

**Setup:**
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

5. Add `VITE_API_URL` as a GitHub Secret:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `VITE_API_URL`
   - Value: Your backend API URL (e.g., `https://your-backend.herokuapp.com/api`)

### Option B: Vercel (Recommended - Full Stack)

Vercel can host both frontend and backend easily.

**Setup:**
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
# Deploy frontend
vercel

# Deploy backend
cd backend
vercel
```

4. Set environment variables in Vercel dashboard:
   - `GROQ_API_KEY`
   - `AI_PROVIDER`
   - `FRONTEND_URL`
   - etc.

### Option C: Render (Full Stack)

**Backend Setup:**
1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install && npm run build`
5. Set start command: `cd backend && npm start`
6. Add environment variables in dashboard

**Frontend Setup:**
1. Create new **Static Site**
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL` = your backend URL

### Option D: Railway (Full Stack)

**Setup:**
1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Railway will auto-detect your project
5. Add environment variables in dashboard
6. Deploy!

## 🔐 Step 4: Set Up Environment Variables

**Never commit `.env` files!** Instead, set them in your hosting platform:

### Required Environment Variables:

**Backend:**
- `GROQ_API_KEY` - Your Groq API key
- `AI_PROVIDER` - `groq` (or `ollama`, `openai`, `huggingface`)
- `PORT` - `3001` (or let platform assign)
- `NODE_ENV` - `production`
- `FRONTEND_URL` - Your frontend URL
- `DATABASE_PATH` - `./data/conversations.db`
- `JWT_SECRET` - Random secret string

**Frontend:**
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.railway.app/api`)

## 📝 Step 5: Update README

Update your README.md with:
- Live demo link
- Setup instructions
- Environment variable requirements
- Deployment instructions

## ✅ Step 6: Verify Deployment

1. Check your frontend is accessible
2. Test API endpoints
3. Verify environment variables are set correctly
4. Test the chat functionality

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure `FRONTEND_URL` in backend matches your frontend URL exactly

2. **API Not Found**
   - Check `VITE_API_URL` is set correctly in frontend
   - Verify backend is running and accessible

3. **Environment Variables Not Working**
   - Restart your services after adding env vars
   - Check variable names match exactly (case-sensitive)

4. **Build Failures**
   - Check Node.js version (needs >= 18)
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

## 📚 Additional Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)

---

**Remember**: Never commit API keys or `.env` files to GitHub!

