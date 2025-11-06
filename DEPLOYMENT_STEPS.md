# TAI Platform - Complete Deployment Guide

## Current Status

✅ All code committed to Git  
✅ Backend enhanced with ChatGPT-like AI features  
✅ Frontend transformed with advanced UI features  
✅ DigitalOcean deployment spec ready (.do/app.yaml)  
⏳ Need to deploy to DigitalOcean  
⏳ Need to update Vercel frontend  

---

## Step 1: Create GitHub Repository (If Not Done)

1. Go to <https://github.com/new>
2. Create a new repository named `TAI`
3. Keep it public or private (your choice)
4. **DO NOT** initialize with README, .gitignore, or license
5. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/TAI.git`)

Then run in PowerShell:

```powershell
cd d:\projects\TAI
git remote remove origin  # Remove if exists
git remote add origin https://github.com/YOUR_USERNAME/TAI.git
git push -u origin master
```

---

## Step 2: Deploy Backend to DigitalOcean App Platform

### Option A: Web Console (Recommended - Easiest)

1. **Login to DigitalOcean**
   - Go to <https://cloud.digitalocean.com>
   - Login with your account

2. **Create New App**
   - Click green "Create" button → Select "Apps"
   - Choose "GitHub" as source
   - Click "Manage Access" and connect your GitHub account
   - Select the `TAI` repository
   - Select `master` branch
   - Click "Next"

3. **Configure Resources**
   - **Edit Plan**: Select "Basic" → "$5/mo - Basic XXS" (512MB RAM)
   - **Environment Variables**: Click "Edit" and add:

     ```
     SECRET_KEY = <generate-random-key-here>
     AI_PROVIDER = digitalocean
     DIGITALOCEAN_API_KEY = sk-do-rm5p4ChxhK80oTytq2zMfbmymFQ98lASYcekdFR35NJqei31QcFTjfbA6t
     ALLOWED_ORIGINS = *
     DEBUG = false
     ```

   - **Run Command**: `gunicorn main:app --bind 0.0.0.0:$PORT --worker-class uvicorn.workers.UvicornWorker --workers 2`
   - **HTTP Port**: `8000`

4. **Add Database**
   - Click "Add Resource" → "Database"
   - Select "PostgreSQL 15"
   - Choose "Dev Database" ($0) or "Basic" ($15/mo)
   - Database will auto-configure `DATABASE_URL`

5. **Review & Deploy**
   - App Name: `tai-platform-api` (or your choice)
   - Region: Select closest to you (e.g., `NYC3`, `SFO3`)
   - Click "Create Resources"
   - Wait 5-10 minutes for deployment

6. **Get Backend URL**
   - Once deployed, copy your app URL
   - Format: `https://tai-platform-api-xxxxx.ondigitalocean.app`
   - Test: Visit the URL in browser (should see FastAPI response)

### Option B: Using CLI (Advanced)

```powershell
# Install DigitalOcean CLI
choco install doctl

# Authenticate
doctl auth init
# Paste your API token when prompted

# Update .do/app.yaml with your GitHub username
# Then deploy:
cd d:\projects\TAI
doctl apps create --spec .do/app.yaml

# Monitor deployment
doctl apps list
doctl apps logs <app-id> --type run
```

---

## Step 3: Update Frontend to Use Production Backend

1. **Update API Endpoint in Frontend**

Edit `frontend/src/app/chat/page.tsx` (around line 353):

```typescript
// BEFORE:
const response = await fetch('http://localhost:8000/api/chat/general', {

// AFTER (replace with your actual DigitalOcean URL):
const response = await fetch('https://tai-platform-api-xxxxx.ondigitalocean.app/api/chat/general', {
```

Or better yet, create environment variable:

Create `frontend/.env.production`:

```
NEXT_PUBLIC_API_URL=https://tai-platform-api-xxxxx.ondigitalocean.app
```

Then update code to:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const response = await fetch(`${API_URL}/api/chat/general`, {
```

2. **Commit Changes**

```powershell
cd d:\projects\TAI
git add .
git commit -m "feat: Connect frontend to production DigitalOcean backend"
git push origin master
```

---

## Step 4: Deploy Frontend to Vercel

### Option A: Automatic Deployment (If Already Connected)

If your Vercel is already connected to GitHub:

- Just push to GitHub (done in Step 3)
- Vercel will auto-deploy
- Go to <https://vercel.com/dashboard> to monitor

### Option B: Manual Deployment

1. **Install Vercel CLI** (if not installed):

```powershell
npm install -g vercel
```

2. **Login to Vercel**:

```powershell
vercel login
```

3. **Deploy Frontend**:

```powershell
cd d:\projects\TAI\frontend
vercel --prod
```

4. **Follow Prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **Y** (if you have one) or **N**
   - Project name? `tai-platform`
   - Directory? `./` (current)
   - Override settings? **N**

5. **Get Frontend URL**:
   - Vercel will output: `https://tai-platform-xxxxx.vercel.app`
   - Or your custom domain if configured

### Option C: Connect to Vercel via GitHub

1. Go to <https://vercel.com/new>
2. Import your `TAI` repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
4. Add Environment Variables:

   ```
   NEXT_PUBLIC_API_URL = https://tai-platform-api-xxxxx.ondigitalocean.app
   ```

5. Click "Deploy"

---

## Step 5: Update CORS Settings (If Needed)

If you get CORS errors, update backend config:

Edit `app/config.py`:

```python
ALLOWED_ORIGINS = [
    "https://tai-platform-xxxxx.vercel.app",  # Your Vercel URL
    "http://localhost:3000",  # Local development
]
```

Then commit and DigitalOcean will auto-redeploy:

```powershell
git add .
git commit -m "fix: Update CORS for production frontend"
git push origin master
```

---

## Step 6: Final Testing

1. **Test Backend Directly**:

```powershell
curl https://tai-platform-api-xxxxx.ondigitalocean.app/
```

2. **Test Frontend**:
   - Visit your Vercel URL: `https://tai-platform-xxxxx.vercel.app`
   - Go to `/chat` page
   - Test all features:
     - ✅ Theme toggle (dark/light)
     - ✅ Voice input (mic button)
     - ✅ Send message to AI
     - ✅ Message reactions (like/dislike)
     - ✅ Message actions (copy, share, pin, delete)
     - ✅ Quick actions (Blog, Email, Summary, Translate)
     - ✅ Settings modal
     - ✅ Export conversation
     - ✅ Keyboard shortcuts (Cmd+K, Cmd+B)

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for errors
   - Verify API calls are going to production URL

---

## Deployment URLs

After completion, you'll have:

| Service | URL | Status |
|---------|-----|--------|
| **Backend API** | `https://tai-platform-api-xxxxx.ondigitalocean.app` | ⏳ To Deploy |
| **Frontend** | `https://tai-platform-xxxxx.vercel.app` | ✅ Live (needs update) |
| **Database** | Managed by DigitalOcean | ⏳ To Create |

---

## Cost Breakdown

| Service | Tier | Cost/Month |
|---------|------|------------|
| DigitalOcean App (Backend) | Basic XXS | $5 |
| PostgreSQL Database | Basic | $15 |
| Vercel (Frontend) | Hobby | $0 |
| **Total** | | **$20/mo** |

---

## Troubleshooting

### Backend Issues

```powershell
# View logs
doctl apps logs <app-id> --type run

# Check app status
doctl apps get <app-id>
```

### Frontend Issues

```powershell
# Check Vercel logs
vercel logs <deployment-url>

# Redeploy
cd frontend
vercel --prod --force
```

### Database Connection Issues

- Verify `DATABASE_URL` is auto-set in DigitalOcean
- Check database is in same region as app
- Ensure app has database component linked

---

## Quick Reference Commands

```powershell
# Commit and push changes
git add .
git commit -m "Your message"
git push origin master

# Deploy frontend
cd frontend
vercel --prod

# Check DigitalOcean apps
doctl apps list

# View logs
doctl apps logs <app-id> --type run
```

---

## Next Steps After Deployment

1. ✅ Test all features end-to-end
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring and alerts
4. ✅ Set up automated backups for database
5. ✅ Add API rate limiting
6. ✅ Implement user authentication
7. ✅ Add analytics (Google Analytics, Plausible, etc.)

---

## Support

- **DigitalOcean Docs**: <https://docs.digitalocean.com/products/app-platform/>
- **Vercel Docs**: <https://vercel.com/docs>
- **FastAPI Docs**: <https://fastapi.tiangolo.com/>
- **Next.js Docs**: <https://nextjs.org/docs>

---

**Note**: Replace all `xxxxx` placeholders with your actual deployment URLs and credentials.
