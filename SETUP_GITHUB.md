# Setup GitHub Repository - Step by Step

## Option 1: Create New Repository on GitHub (Recommended)

### Step 1: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Repository name: `mindspace-ai` (or any name you prefer)
4. Description: "AI-powered mental health support platform for Gen Z"
5. Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README" (we already have files)
7. Click **Create repository**

### Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you setup instructions. Use these commands:

```bash
# Make sure you're in the project directory
cd /Users/dakshitha.k/Downloads/chill-sessions-bot-main

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mindspace-ai.git

# Verify it's added
git remote -v
```

### Step 3: Push Your Code

```bash
# Stage all changes
git add .

# Commit
git commit -m "Initial commit: MindSpace AI therapy bot"

# Push to GitHub
git push -u origin main
```

If you get authentication errors, see **Authentication Setup** below.

---

## Option 2: Use Existing Repository Name

If you want to use `chill-sessions-bot-main`:

```bash
# Add remote with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/chill-sessions-bot-main.git

# Push
git push -u origin main
```

---

## Authentication Setup

### If you get authentication errors:

**Option A: Use Personal Access Token (Recommended)**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Name: `mindspace-ai-deploy`
4. Select scopes: `repo` (full control)
5. Click **Generate token**
6. Copy the token (you won't see it again!)

When pushing, use:
```bash
git push -u origin main
# Username: YOUR_GITHUB_USERNAME
# Password: PASTE_YOUR_TOKEN_HERE
```

**Option B: Use SSH (More Secure)**

1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Add SSH key to GitHub:
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
```

3. Go to GitHub → Settings → SSH and GPG keys → New SSH key
4. Paste the key and save

5. Update remote to use SSH:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/mindspace-ai.git
git push -u origin main
```

**Option C: Use GitHub CLI**

```bash
# Install GitHub CLI
brew install gh

# Login
gh auth login

# Push
git push -u origin main
```

---

## Quick Commands Summary

```bash
# 1. Create repo on GitHub first (via web interface)

# 2. Add remote (replace with your details)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 3. Verify
git remote -v

# 4. Stage and commit
git add .
git commit -m "Initial commit: MindSpace AI"

# 5. Push
git push -u origin main
```

---

## Troubleshooting

### "Repository not found"
- Make sure the repository exists on GitHub
- Check your username/repo name is correct
- Verify you have access to the repository

### "Authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys
- Or use GitHub CLI

### "Permission denied"
- Check you're logged into GitHub
- Verify repository name matches exactly
- Make sure you have write access to the repo

---

## Need Help?

1. Check your GitHub username: Look at your GitHub profile URL
2. Verify repository exists: Go to `https://github.com/YOUR_USERNAME/REPO_NAME`
3. Check authentication: Try `gh auth status` if using GitHub CLI

