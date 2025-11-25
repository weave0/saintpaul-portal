# St. Paul Mystical Portal - Production Deployment
# Deploy to: saintpaul.globaldeets.com
# Owner: Brett Weaver

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Frontend Only)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd z:\SaintPaul
vercel --prod

# Set custom domain in Vercel dashboard:
# saintpaul.globaldeets.com
# stpaul.globaldeets.com
```

**After deployment:**
1. Go to Vercel dashboard → Settings → Domains
2. Add: `saintpaul.globaldeets.com`
3. Add: `stpaul.globaldeets.com`
4. Vercel will provide DNS records

### Option 2: Cloudflare Pages (Full Control)
```bash
# Install Wrangler CLI
npm i -g wrangler

# Login to Cloudflare
wrangler login

# Build frontend
cd frontend
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=saintpaul-portal
```

**Configure custom domain:**
1. Cloudflare Dashboard → Pages → saintpaul-portal
2. Custom domains → Add: `saintpaul.globaldeets.com`
3. Since you own globaldeets.com, DNS auto-configures!

### Option 3: Railway (Full Stack - Backend + Frontend)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd z:\SaintPaul
railway init

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up
```

---

## 📡 Backend Deployment (Separate)

Your backend needs to be hosted separately since it's Node.js + MongoDB.

### Railway (Recommended for Backend)
```bash
cd z:\SaintPaul\backend
railway init --name saintpaul-api
railway up

# Railway will auto-detect Node.js and MongoDB
# Your MongoDB Atlas connection will work as-is
```

**Set environment variables in Railway:**
- `MONGODB_URI` - Already in your .env
- `PORT` - Railway auto-assigns
- `CORS_ORIGIN` - Set to https://saintpaul.globaldeets.com

### Render (Alternative)
```bash
# Create render.yaml in backend/
```

---

## 🌐 DNS Configuration for globaldeets.com

Since you own globaldeets.com on Cloudflare:

### Cloudflare DNS Records

**For Vercel:**
```
Type: CNAME
Name: saintpaul
Target: cname.vercel-dns.com
Proxied: Yes (orange cloud)

Type: CNAME
Name: stpaul
Target: cname.vercel-dns.com
Proxied: Yes
```

**For Cloudflare Pages (easier):**
```
# No manual DNS needed!
# Pages auto-configures when you add custom domain
```

**For Railway Backend:**
```
Type: CNAME
Name: api.saintpaul (or saintpaul-api)
Target: <your-railway-app>.railway.app
Proxied: Yes
```

---

## 🔧 Environment Variables for Production

### Frontend (.env.production)
```env
VITE_MAPBOX_TOKEN=pk.your_production_token
VITE_API_BASE_URL=https://saintpaul-api.globaldeets.com
```

### Backend (Railway/Render)
```env
MONGODB_URI=mongodb+srv://weave0:***@cluster0.lnhkagb.mongodb.net/saint-paul?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://saintpaul.globaldeets.com,https://stpaul.globaldeets.com
```

---

## 📦 Build Commands

### Frontend Build
```bash
cd frontend
npm install
npm run build
# Output: dist/
```

### Backend (No build needed)
```bash
cd backend
npm install
node server.js
```

---

## 🎯 Recommended Stack

**Frontend:** Cloudflare Pages
- Free tier: Unlimited bandwidth
- Auto SSL
- Global CDN
- Custom domains (saintpaul.globaldeets.com) - FREE since you own domain!
- Deploy time: ~1 minute

**Backend:** Railway
- Free tier: $5/month credit
- MongoDB Atlas compatible
- Auto SSL
- Custom domain support
- Environment variables
- Auto-deploy from Git

**Database:** MongoDB Atlas (Current)
- Already configured ✅
- No changes needed

---

## 🚀 Quick Deploy (Cloudflare Pages)

```powershell
# 1. Build frontend
cd z:\SaintPaul\frontend
npm run build

# 2. Install Wrangler
npm i -g wrangler

# 3. Login to Cloudflare
wrangler login

# 4. Deploy
cd dist
npx wrangler pages deploy . --project-name=saintpaul

# 5. Add custom domain in Cloudflare dashboard
# Pages → saintpaul → Custom domains → Add saintpaul.globaldeets.com
```

---

## 🔐 SSL/TLS

All platforms provide free SSL:
- Cloudflare: Auto SSL (Let's Encrypt)
- Vercel: Auto SSL
- Railway: Auto SSL

Your site will be `https://saintpaul.globaldeets.com` ✅

---

## 📊 Post-Deployment Checklist

- [ ] Frontend deployed to saintpaul.globaldeets.com
- [ ] Backend deployed (Railway/Render)
- [ ] DNS records configured in Cloudflare
- [ ] Environment variables set (Mapbox token, API URL)
- [ ] SSL certificate active (https://)
- [ ] CORS configured for production domain
- [ ] MongoDB Atlas IP whitelist updated (0.0.0.0/0 for cloud)
- [ ] Test: Open https://saintpaul.globaldeets.com/map
- [ ] Test: API calls work
- [ ] Test: Map renders with Mapbox token

---

## 🎬 FASTEST PATH (5 Minutes)

```powershell
# Terminal 1 - Deploy Frontend to Cloudflare Pages
cd z:\SaintPaul\frontend
npm run build
npx wrangler pages deploy dist --project-name=saintpaul

# Terminal 2 - Deploy Backend to Railway
cd z:\SaintPaul\backend
railway init --name saintpaul-api
railway up

# Cloudflare Dashboard
# 1. Pages → saintpaul → Custom domains → Add saintpaul.globaldeets.com
# 2. DNS auto-configures (you own the domain!)

# Railway Dashboard
# 1. Copy your backend URL: https://saintpaul-api-production-xxxx.railway.app
# 2. Set CORS_ORIGIN to your Cloudflare domain

# Update frontend/.env.production
VITE_API_BASE_URL=https://saintpaul-api-production-xxxx.railway.app
```

**Done! Your portal is live at https://saintpaul.globaldeets.com** ✨

---

## 💡 Why This Stack?

- **Cloudflare Pages:** You already use Cloudflare for globaldeets.com
- **Railway:** Best Node.js hosting, MongoDB Atlas friendly
- **MongoDB Atlas:** Already configured, no migration needed
- **Custom Domain:** FREE (you own it)
- **SSL:** FREE (auto-configured)
- **CDN:** FREE (Cloudflare global network)
- **Deploy Time:** <5 minutes

Ready to make history glow globally? 🌍✨
