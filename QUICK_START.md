# Quick Start: Push to GitHub

## 🚀 Quick Steps

### 1. Stage All Changes
```bash
git add .
```

### 2. Commit Changes
```bash
git commit -m "Update: Professional therapist persona, NIMHANS helpline, and improved UX"
```

### 3. Push to GitHub
```bash
git push origin main
```

That's it! Your code is now on GitHub at: `https://github.com/DakshithaK/chill-sessions-bot-main`

## ⚠️ Important Notes

1. **Never commit `.env` files** - They contain your API keys!
2. **Database files are excluded** - They won't be pushed to GitHub
3. **Your repository is already connected** to GitHub

## 📦 Next Steps: Deploy

See `GITHUB_SETUP.md` for detailed hosting instructions:
- **Vercel** (easiest, recommended)
- **Render** (good for full-stack)
- **Railway** (simple deployment)
- **GitHub Pages** (frontend only)

## 🔐 Environment Variables

When deploying, you'll need to set these in your hosting platform:

**Backend:**
- `GROQ_API_KEY`
- `AI_PROVIDER=groq`
- `FRONTEND_URL` (your frontend URL)
- `PORT=3001`

**Frontend:**
- `VITE_API_URL` (your backend API URL)

---

For detailed deployment instructions, see `GITHUB_SETUP.md`

