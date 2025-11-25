# Quick Start: Testing Your Enhanced Map

## 🚀 Immediate Next Steps

### 1. Set Up Mapbox Token (5 minutes)

If you don't have one yet:
1. Go to https://www.mapbox.com/
2. Sign up (free tier is fine)
3. Get your access token
4. Add to `frontend/.env.local`:

```env
VITE_MAPBOX_TOKEN=pk.your_actual_token_here
```

### 2. Start the Application

```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 3. Test the Enhanced Map

Navigate to http://localhost:5173/map

**What to look for:**
- ✅ Sidebar with filters loads
- ✅ Year slider (1850-2025)
- ✅ Category checkboxes (7 categories)
- ✅ Search box
- ✅ "Explore in 3D" button (top-right)
- ✅ Stats panel (bottom-right)
- ✅ Filter toggle button (top-left)

**Try these interactions:**
1. Drag the year slider → locations filter by era
2. Uncheck categories → markers disappear
3. Search for "Capitol" → results filter
4. Click "Explore in 3D" → navigates to 3D viewer
5. Toggle "Show 3D Buildings" → map tilts, buildings extrude
6. Click a marker → popup with details appears
7. Click location in sidebar → map flies to location

---

## 🎨 What Changed

### Map.jsx Enhancements
- **Data Sources:** Now pulling from `/api/locations` and `/api/building-specs`
- **Filtering:** Year range, categories, search
- **3D Buildings:** Native Mapbox extrusions (no Three.js)
- **Navigation:** Prominent button to 3D viewer
- **UI:** Collapsible sidebar, rich popups, stats dashboard

### Home.jsx Updates
- **Map Priority:** "Start Here" badge on map card
- **Positioning:** Map emphasized as primary feature

### Header Navigation
- **3D Viewer:** Still accessible but de-emphasized
- **Map:** Primary navigation item

---

## 🐛 Troubleshooting

### "Map not loading / gray screen"
- Check Mapbox token in `.env.local`
- Restart dev server after adding token
- Check browser console for errors

### "No locations showing"
- Verify backend is running on port 5000
- Check `/api/locations` endpoint returns data
- Check browser network tab for API calls

### "3D Buildings not appearing"
- Zoom in closer (need zoom level 14+)
- Check "Show 3D Buildings" is enabled
- Ensure Mapbox token has 3D features enabled (it should by default)

### "Year filter not working"
- Check `/api/building-specs` accepts `yearMin` and `yearMax` params
- Verify backend route handles year filtering
- Check browser console for API errors

---

## 📦 What's Included Now

### Features ✅
- Real-time data from MongoDB
- Advanced filtering (year, category, search)
- 3D building extrusions
- Rich location popups
- Seamless 3D viewer integration
- Mobile-responsive sidebar
- Performance stats

### Not Included Yet (Future Phases)
- Historical map overlays
- Guided tours
- Deck.gl visualizations
- Audio/video content
- User contributions

---

## 🎯 Current Focus

**2D Map = 90% of effort going forward**
- Polish the filtering
- Add more data sources
- Create guided tours
- Improve mobile UX

**3D Viewer = 10% (maintenance only)**
- Bug fixes only
- No new features
- Keep as power user option

---

## 📊 Quick Health Check

Run this to verify everything is connected:

```powershell
# Check backend health
curl http://localhost:5000/api/health

# Check locations endpoint
curl http://localhost:5000/api/locations

# Check building specs
curl "http://localhost:5000/api/building-specs?limit=10"
```

**Expected:** JSON responses with data

---

## 🚢 When Ready to Deploy

1. **Build Frontend:**
   ```powershell
   cd frontend
   npm run build
   ```

2. **Test Production Build:**
   ```powershell
   npm run preview
   ```

3. **Deploy:**
   - Frontend: Vercel, Netlify, or Azure Static Web Apps
   - Backend: Azure App Service, Railway, or Heroku
   - Database: MongoDB Atlas (cloud)

4. **Environment Variables:**
   - Set `VITE_MAPBOX_TOKEN` in deployment platform
   - Set `MONGODB_URI` for backend
   - Set `NODE_ENV=production`

---

## ✨ You're Ready!

The decision is made. The code is written. Now **test it, iterate on it, and ship it.**

No more pivoting. No more second-guessing. This is the path: **2D hero, 3D optional.**

**Go make St. Paul's history accessible to the world.** 🗺️
