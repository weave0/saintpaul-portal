# 3D Historical Viewer - Launch Checklist

Use this checklist to get your 3D Historical Viewer running for the first time.

## ✅ Prerequisites (One-Time Setup)

### System Requirements
- [ ] Node.js 16+ installed
- [ ] MongoDB installed (local) OR MongoDB Atlas account (cloud)
- [ ] PowerShell or terminal access
- [ ] Modern web browser (Chrome, Firefox, Edge, Safari)

### Optional (for 2D map features)
- [ ] Mapbox account (free tier available)
- [ ] Mapbox API token

---

## 🚀 Quick Launch (First Time)

### Step 1: Install Dependencies (5 minutes)
```powershell
# Backend
cd backend
npm install

# Frontend
cd ..\frontend
npm install
```

**Expected result:**
- Backend: ~102 packages installed
- Frontend: ~202 packages installed
- 0 vulnerabilities

---

### Step 2: Configure MongoDB (2 minutes)

**Option A: Local MongoDB**
```powershell
# Edit backend\.env
MONGODB_URI=mongodb://localhost:27017/saintpaul
PORT=5000
NODE_ENV=development
```

**Option B: MongoDB Atlas (Cloud)**
```powershell
# Edit backend\.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saintpaul
PORT=5000
NODE_ENV=development
```

- [ ] MongoDB configuration added to `backend/.env`

---

### Step 3: Configure Mapbox (Optional, 1 minute)

For 2D map features only (3D viewer works without this):

```powershell
# Edit frontend\.env.local
VITE_MAPBOX_TOKEN=pk.your_token_here
VITE_API_URL=http://localhost:5000/api
```

- [ ] Mapbox token added (optional)

---

### Step 4: Start Backend Server (1 minute)

```powershell
cd backend
npm run dev
```

**Expected output:**
```
Server running on port 5000
Connected to MongoDB
```

**Leave this terminal running!**

- [ ] Backend server running on http://localhost:5000
- [ ] MongoDB connected successfully

---

### Step 5: Start Frontend Server (1 minute)

**Open a NEW terminal:**

```powershell
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Leave this terminal running!**

- [ ] Frontend server running on http://localhost:3000

---

### Step 6: Open the 3D Viewer (30 seconds)

Open your browser and visit:

**http://localhost:3000/3d-viewer**

**You should see:**
- 3D view with sky background
- Timeline slider at the bottom
- Info panel on the right
- Controls panel on the left
- Buildings from the selected time period

- [ ] 3D viewer loads successfully
- [ ] Timeline slider visible
- [ ] Buildings render in 3D

---

### Step 7: Test the Viewer (2 minutes)

**Timeline Navigation:**
- [ ] Click different years (1841, 1858, 1905, 1950, 2000)
- [ ] Buildings change when switching years
- [ ] Era description updates

**Camera Controls:**
- [ ] Left click + drag rotates view
- [ ] Right click + drag pans view
- [ ] Scroll wheel zooms in/out
- [ ] Double-click resets camera

**Building Interaction:**
- [ ] Click a building to select it
- [ ] Info panel shows building details
- [ ] Selected building highlights

**UI Controls:**
- [ ] Grid toggle button works
- [ ] Quick jump chips work
- [ ] Responsive to window resize

---

## 🎉 Success!

If all checkboxes are checked, your 3D Historical Viewer is working!

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `MongoNetworkError: failed to connect to server`

**Solution:**
- Make sure MongoDB is running (local)
- OR check MongoDB Atlas connection string (cloud)
- Verify `MONGODB_URI` in `backend/.env`

---

**Error:** `Port 5000 already in use`

**Solution:**
```powershell
# Change port in backend\.env
PORT=5001

# Also update frontend\.env.local
VITE_API_URL=http://localhost:5001/api
```

---

### Frontend won't start

**Error:** `Port 3000 already in use`

**Solution:**
- Vite will automatically prompt for a different port
- Press 'y' to use the suggested port

---

**Error:** `Module not found` or `Cannot find module`

**Solution:**
```powershell
cd frontend
rm -r node_modules
rm package-lock.json
npm install
```

---

### 3D Viewer shows blank screen

**Check browser console (F12):**

**Error:** `Cannot find module 'three'`

**Solution:**
```powershell
cd frontend
npm install --legacy-peer-deps three @react-three/fiber @react-three/drei
```

---

**Error:** `fetch failed` or `CORS error`

**Solution:**
- Make sure backend is running on http://localhost:5000
- Check `VITE_API_URL` in `frontend/.env.local`
- Restart frontend server after .env changes

---

### Buildings not showing

**Check:**
- [ ] `data/historical-snapshots.json` exists
- [ ] File is valid JSON (no syntax errors)
- [ ] Browser console shows no errors
- [ ] Selected year has buildings in the data

**Quick test:**
```powershell
# Check if data file exists
Test-Path data\historical-snapshots.json

# View first few lines
Get-Content data\historical-snapshots.json -Head 20
```

---

## 📦 Optional: Import Sample Data to MongoDB

This adds locations and events to the database (for 2D map and timeline):

```powershell
cd backend
node scripts/importData.js
```

**Expected output:**
```
Locations imported: 12
Historical events imported: 25
```

- [ ] Sample data imported successfully

---

## 🔄 Daily Startup (After First Time)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Browser:**
http://localhost:3000/3d-viewer

---

## 🎯 What's Next?

Now that the 3D viewer is working:

1. **Explore the existing data** - Switch between time periods
2. **Read the documentation:**
   - `docs/DATA_COLLECTION_GUIDE.md` - How to add real historical data
   - `maps/3D_VIEWER_README.md` - Complete feature documentation
   - `docs/DATA_SOURCES.md` - Public data sources

3. **Start adding data:**
   - Download Sanborn Maps from Library of Congress
   - Follow the data collection guide
   - Build the most accurate historical visualization of Saint Paul!

---

## ✅ All Systems Go!

Once this checklist is complete, you have a fully functional 3D Historical Walk-Through Viewer. Time to explore Saint Paul's history! 🏛️✨

---

**Need help?** Check the full documentation in the project README files.

**Ready to add data?** See `docs/DATA_COLLECTION_GUIDE.md`

**Want to customize?** See `maps/3D_VIEWER_README.md`
