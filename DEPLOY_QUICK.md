# 🚀 Quick Deploy - St. Paul Mystical Portal

**Deploy to:** saintpaul.globaldeets.com  
**Owner:** Brett Weaver  
**Date:** November 24, 2025

---

## ⚡ ONE-COMMAND DEPLOY

```powershell
z:\SaintPaul\deploy-cloudflare.ps1
```

This script will:
1. ✅ Build your frontend
2. ✅ Deploy to Cloudflare Pages
3. ✅ Give you next steps

---

## 🌐 Cloudflare Dashboard Setup

After running the deploy script:

### 1. Add Custom Domain
1. Go to: https://dash.cloudflare.com/
2. Pages → saintpaul-portal → Custom domains
3. Click "Set up a custom domain"
4. Enter: `saintpaul.globaldeets.com`
5. Click "Add domain"
6. **DNS auto-configures** (you own globaldeets.com!)
7. Repeat for: `stpaul.globaldeets.com`

### 2. Set Environment Variables
1. Pages → saintpaul-portal → Settings → Environment variables
2. Production tab → Add variable:
   - Name: `VITE_MAPBOX_TOKEN`
   - Value: `pk.your_mapbox_token_here`
3. Add variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://saintpaul-api.railway.app` (after deploying backend)

### 3. Redeploy
After setting env vars:
1. Pages → saintpaul-portal → Deployments
2. Click "..." on latest deployment
3. Click "Retry deployment"

---

## 📡 Backend Deployment (Railway)

Your backend needs separate hosting:

```powershell
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd z:\SaintPaul\backend
railway init
railway up
```

**Set environment variables in Railway dashboard:**
- `MONGODB_URI` → (copy from backend/.env)
- `PORT` → 3000
- `NODE_ENV` → production
- `CORS_ORIGIN` → https://saintpaul.globaldeets.com

**Copy your Railway URL:**
- Example: `https://saintpaul-api-production-xxxx.railway.app`
- Add this to Cloudflare Pages env vars as `VITE_API_BASE_URL`

---

## 🎯 Deployment Checklist

### Frontend (Cloudflare Pages)
- [ ] Run `deploy-cloudflare.ps1`
- [ ] Add custom domains (saintpaul.globaldeets.com, stpaul.globaldeets.com)
- [ ] Set VITE_MAPBOX_TOKEN in env vars
- [ ] Set VITE_API_BASE_URL in env vars
- [ ] Redeploy after env vars set
- [ ] Test: https://saintpaul.globaldeets.com/map

### Backend (Railway)
- [ ] Install Railway CLI
- [ ] Login to Railway
- [ ] Deploy backend (`railway up`)
- [ ] Set environment variables
- [ ] Copy Railway URL
- [ ] Update frontend VITE_API_BASE_URL
- [ ] Test API: https://your-backend.railway.app/api/locations

### MongoDB Atlas
- [ ] Whitelist 0.0.0.0/0 (allow from anywhere) for Railway
- [ ] Or add Railway's IP addresses
- [ ] Connection string already in backend/.env ✅

---

## 🔧 Cloudflare DNS Records

**Automatically created when you add custom domain:**

```
Type: CNAME
Name: saintpaul
Target: saintpaul-portal.pages.dev
Proxy: Enabled (🟠)

Type: CNAME
Name: stpaul  
Target: saintpaul-portal.pages.dev
Proxy: Enabled (🟠)
```

**No manual DNS configuration needed!** 🎉

---

## 🌟 Why Cloudflare Pages?

- ✅ You already own globaldeets.com on Cloudflare
- ✅ FREE custom domains
- ✅ FREE SSL certificates
- ✅ Global CDN (ultra-fast)
- ✅ Unlimited bandwidth
- ✅ Auto-deploys from Git (if you push to GitHub)
- ✅ Preview deployments
- ✅ DNS auto-configures

---

## 📊 After Deployment

**Your live URLs:**
- 🌍 https://saintpaul.globaldeets.com/map
- 🌍 https://stpaul.globaldeets.com/map (alias)
- 📡 https://your-backend.railway.app/api (backend)

**Test checklist:**
- [ ] Map loads and renders
- [ ] Stars are twinkling
- [ ] Year slider changes UI colors
- [ ] Text is readable (contrast fixed!)
- [ ] Search works
- [ ] Stories panel opens
- [ ] 3D buildings toggle
- [ ] Portal transition works
- [ ] API calls return data

---

## 🎭 Demo It!

Once live, show off:
1. Move year slider → Watch entire UI transform colors
2. Open stories panel → Read F. Scott Fitzgerald tales
3. Toggle 3D buildings → Watch downtown rise
4. Search for locations
5. Click portal button → Mystical transition

**Share the magic:** https://saintpaul.globaldeets.com/map ✨

---

## 🆘 Troubleshooting

**Problem: "Invalid Mapbox token"**
→ Add VITE_MAPBOX_TOKEN in Cloudflare Pages env vars

**Problem: "Failed to fetch" API errors**
→ Backend not deployed or VITE_API_BASE_URL incorrect

**Problem: CORS errors**
→ Add frontend URL to backend CORS_ORIGIN env var

**Problem: DNS not resolving**
→ Wait 5-10 minutes for DNS propagation

**Problem: Blank page**
→ Check Cloudflare Pages deployment logs

---

## 💰 Cost

**Cloudflare Pages:** FREE  
**Railway Backend:** $5/month credit (FREE tier)  
**MongoDB Atlas:** FREE tier (512MB)  
**Custom Domain:** FREE (you own it!)  
**SSL Certificates:** FREE  

**Total:** $0/month with free tiers! 🎉

---

## 🚀 Ready to Go Global?

```powershell
# Deploy frontend
z:\SaintPaul\deploy-cloudflare.ps1

# Deploy backend
cd z:\SaintPaul\backend
railway up

# Add custom domains in Cloudflare dashboard
# Set environment variables
# Test: https://saintpaul.globaldeets.com/map
```

**St. Paul's history is about to glow globally!** ✨🌍
