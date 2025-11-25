# 🚀 St. Paul Mystical Portal - Launch Guide
**Owner:** Brett Weaver  
**Date:** November 24, 2025

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ **Get Your Mapbox Token** (1 minute)

Your Mapbox username appears to be `brettweaver`. If you already have a token:

1. Visit: https://account.mapbox.com/access-tokens/
2. Copy your **default public token** (starts with `pk.`)
3. Paste it in `frontend/.env.local`:

```env
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiYnJldHR3ZWF2ZXIiLCJhIjoiY20zdTRxdWd1MDNmcTJycjNmdWs2Nmg4ZCJ9.YOUR_ACTUAL_TOKEN
```

**If you don't have a Mapbox account:**
1. Sign up at https://account.mapbox.com/auth/signup/ (free tier)
2. Copy the token from your dashboard
3. Update `.env.local`

---

### 2️⃣ **Start Backend** (Terminal 1)

```powershell
cd z:\SaintPaul\backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: cluster0.lnhkagb.mongodb.net
📊 Database: saint-paul
🚀 Server running on http://localhost:3000
```

**Your MongoDB Atlas is already configured:**
- Database: `saint-paul`
- Cluster: `cluster0.lnhkagb.mongodb.net`
- User: `weave0`

---

### 3️⃣ **Start Frontend** (Terminal 2)

```powershell
cd z:\SaintPaul\frontend
npm run dev
```

**Expected output:**
```
VITE v5.4.21  ready in 432 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Then open:** http://localhost:5173/map

---

## 🌟 What You'll See

### **Immediate Visual Magic:**
1. **Twinkling stars** across the night sky
2. **Pulsing location markers** on the map
3. **Era selector** (1850-2025) that changes UI colors
4. **Stories panel** with St. Paul history

### **Interactive Features:**
- Move year slider → Watch UI transform through 5 eras
- Click markers → See building details
- Toggle 3D buildings → Downtown rises
- Click "Explore in 3D Portal" → Mystical transition
- Open Stories panel → Read F. Scott Fitzgerald, gangster era tales

---

## 📊 Current Data Status

**Your MongoDB Atlas database (`saint-paul`) should contain:**

Check what's there:
```powershell
# Terminal 3 - Test API
curl http://localhost:3000/api/locations?limit=5
curl http://localhost:3000/api/building-specs?limit=5
curl http://localhost:3000/api/history?limit=5
```

**If empty:** The map will load but show no markers (expected). You can:
1. Run data gathering scripts in `backend/scripts/`
2. Add sample data from `data/` folder
3. Manually create locations

---

## 🛠️ Troubleshooting

### **Problem: Map shows "Invalid Mapbox token"**
**Fix:** Update `frontend/.env.local` with real token from https://account.mapbox.com/

### **Problem: "Failed to fetch" errors in browser console**
**Fix:** Backend isn't running. Start it in Terminal 1.

### **Problem: Backend says "MongoDB Connection Error"**
**Check:**
- Your IP is whitelisted in MongoDB Atlas (https://cloud.mongodb.com/v2/PROJECT_ID#/security/network/accessList)
- Password in `backend/.env` is correct

### **Problem: No markers on map**
**Expected:** Database might be empty. Run data scripts:
```powershell
cd z:\SaintPaul\backend\scripts
node gatherData.js
```

---

## 🎯 Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 3000 | http://localhost:3000 |
| MongoDB Atlas | (cloud) | cluster0.lnhkagb.mongodb.net |

---

## 📁 Your Environment Files

### **Backend (z:\SaintPaul\backend\.env)**
```env
PORT=3000
MONGODB_URI=mongodb+srv://weave0:b4HrhEbcoQXxhxTV@cluster0.lnhkagb.mongodb.net/saint-paul?retryWrites=true&w=majority
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173
```
✅ **Already configured**

### **Frontend (z:\SaintPaul\frontend\.env.local)**
```env
VITE_MAPBOX_TOKEN=pk.YOUR_TOKEN_HERE
VITE_API_BASE_URL=http://localhost:3000
```
⚠️ **Need to add Mapbox token**

---

## 🔥 One-Command Launch (After Mapbox token is set)

**Option 1: PowerShell Script** (recommended)
```powershell
z:\SaintPaul\start-dev.ps1
```

**Option 2: Manual (2 terminals)**
```powershell
# Terminal 1
cd z:\SaintPaul\backend; npm run dev

# Terminal 2 (new window)
cd z:\SaintPaul\frontend; npm run dev
```

---

## 🌌 Brett's St. Paul Portal Features

### **Historical Eras:**
- 🌾 Pioneer Days (1850-1880) - Brown/sepia tones
- 💰 Gilded Age (1880-1920) - Gold, F. Scott Fitzgerald
- 🎷 Art Deco (1920-1945) - Blue, gangster era, jazz clubs
- 🏙️ Mid-Century (1945-1980) - Green, urban renewal
- ✨ Contemporary (1980-2025) - Cyan, modern renaissance

### **Story Categories:**
- ⭐ Famous People (F. Scott Fitzgerald, Charles Schulz)
- 🎵 Music History (Prince, Rondo jazz clubs)
- 🍽️ Food Heritage (Historic restaurants, Hmong cuisine)
- 👻 Ghost Stories (Wabasha Street Caves, etc.)
- 🏛️ Historic Buildings (Cathedral, State Capitol)

### **Visual Effects:**
- 200 twinkling stars with rare shooting stars
- Pulsing location markers (60px glows)
- Era-themed building colors
- Portal explosion transition to 3D viewer
- Smooth 60fps animations

---

## 📸 Screenshot Checklist

Once running, verify you see:
- [ ] Stars twinkling in background
- [ ] Map centered on downtown St. Paul
- [ ] Year slider (1850-2025)
- [ ] Categories sidebar
- [ ] Stats dashboard (showing counts)
- [ ] Stories button (book icon)

---

## 🎬 Next Steps After Launch

1. **Test basic functionality** (15 min)
   - Move year slider
   - Toggle categories
   - Open stories panel
   - Enable 3D buildings

2. **Populate real data** (1-2 hours)
   - Run `backend/scripts/gatherData.js`
   - Add St. Paul-specific locations
   - Include famous people birthplaces

3. **Add rich content** (ongoing)
   - Historic photos for popups
   - Detailed building histories
   - Ghost story narratives
   - Music venue timelines

4. **Deploy to production** (when ready)
   - Vercel for frontend
   - Railway/Render for backend
   - Keep MongoDB Atlas

---

## 🚀 Ready to Launch?

**All you need is that Mapbox token, Brett.**

Get it from https://account.mapbox.com/ and paste it in `frontend/.env.local`.

Then:
```powershell
z:\SaintPaul\start-dev.ps1
```

**The St. Paul Mystical Portal awaits.** ✨
