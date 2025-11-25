# 🧪 St. Paul Mystical Portal - Testing Checklist

**Build Status:** ✅ **PASSED** (773KB main bundle)  
**Date:** November 24, 2025  
**Verification:** All files compile with zero errors

---

## ✅ **Code Quality Verification (COMPLETED)**

### Files Created
- ✅ `NightSkyOverlay.jsx` - 156 lines, zero errors
- ✅ `StPaulStoriesPanel.jsx` - 370 lines, zero errors  
- ✅ `Map.jsx` - 1040 lines, zero errors

### Build Test
```powershell
npm run build
# ✅ Success: 13.91s
# ✅ Main bundle: 773KB (gzipped: 248KB)
# ✅ Mapbox bundle: 1663KB (expected large size)
# ✅ 3D Viewer: 1081KB (lazy-loaded)
```

### Dependencies Verified
- ✅ React 18.2.0
- ✅ @mui/material 5.14.20
- ✅ react-map-gl 7.1.9
- ✅ mapbox-gl 3.0.1
- ✅ @tanstack/react-query 5.20.0
- ✅ framer-motion 10.16.16

---

## 🎯 **Manual Testing Checklist**

### 1️⃣ **Environment Setup**
```powershell
# Backend .env
MONGODB_URI=mongodb://localhost:27017/saintpaul
PORT=3001

# Frontend .env.local
VITE_MAPBOX_TOKEN=pk.your_actual_mapbox_token_here
VITE_API_BASE_URL=http://localhost:3001
```

- [ ] MongoDB running on port 27017
- [ ] Backend `.env` configured
- [ ] Frontend `.env.local` has Mapbox token
- [ ] Ports 3001 (backend) and 5173 (frontend) available

---

### 2️⃣ **Start Services**

**Terminal 1 - Backend:**
```powershell
cd z:\SaintPaul\backend
npm run dev
# Expected: "Server running on port 3001"
```

**Terminal 2 - Frontend:**
```powershell
cd z:\SaintPaul\frontend
npm run dev
# Expected: "Local: http://localhost:5173"
```

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] No console errors in terminal

---

### 3️⃣ **Visual Features Testing**

#### **Night Sky Overlay**
- [ ] Navigate to `http://localhost:5173/map`
- [ ] Stars are visible and twinkling
- [ ] Wait 30 seconds for shooting star (0.2% chance/frame)
- [ ] Stars have subtle glow effects
- [ ] Animation is smooth (60fps)

#### **Era Theming**
- [ ] Move year slider from 1850 → 2025
- [ ] UI colors change for each era:
  - 1850-1880: Brown/sepia tones
  - 1880-1920: Gold (Gilded Age)
  - 1920-1945: Art Deco blues
  - 1945-1980: Mid-century greens
  - 1980-2025: Cyan/modern
- [ ] Building colors on map change with era
- [ ] Panel shadows/borders update
- [ ] Smooth transitions between themes

#### **Stories Panel**
- [ ] Click "Stories" button (book icon)
- [ ] Panel slides in from right
- [ ] Stories update when year slider moves
- [ ] Different stories for different eras:
  - 1850s: Pioneer Days
  - 1890s: F. Scott Fitzgerald
  - 1920s: Gangster Era, Jazz Age
  - 1970s: Prince's Minneapolis Sound
  - 2020s: Modern Renaissance
- [ ] Icons display correctly
- [ ] Close button works

#### **Location Markers**
- [ ] Markers appear on map (if data exists)
- [ ] Markers pulse every 2 seconds
- [ ] Hover shows scale + glow effect
- [ ] Click opens popup with details
- [ ] Category colors are distinct

#### **3D Buildings**
- [ ] Toggle "3D Buildings" button
- [ ] Buildings rise from ground
- [ ] 50° pitch applied
- [ ] Fog effect visible
- [ ] Building colors match era theme

#### **Portal Transition**
- [ ] Click marker to open popup
- [ ] Click "Explore in 3D Portal" button
- [ ] Radial explosion animation appears
- [ ] "ENTERING THE PORTAL..." text glows
- [ ] Transition lasts 0.8s
- [ ] Navigates to 3D viewer

---

### 4️⃣ **API Integration Testing**

#### **Locations API**
```powershell
# Test endpoint
curl http://localhost:3001/api/locations?limit=5
```
- [ ] Returns JSON array
- [ ] Markers appear on map
- [ ] TanStack Query caches (5min)

#### **Building Specs API**
```powershell
# Test endpoint
curl "http://localhost:3001/api/building-specs?yearMin=1890&yearMax=1920&limit=10"
```
- [ ] Returns buildings in year range
- [ ] Popups show building details
- [ ] Year filter works

#### **Historical Events API**
```powershell
# Test endpoint
curl "http://localhost:3001/api/history?yearMin=1900&yearMax=1950&limit=5"
```
- [ ] Returns events in range
- [ ] Stories panel shows events (if implemented)

---

### 5️⃣ **Performance Testing**

- [ ] Map loads in <2 seconds
- [ ] Animations are smooth (60fps)
- [ ] No console errors in browser DevTools
- [ ] No memory leaks (check DevTools Performance tab)
- [ ] Zoom/pan is responsive
- [ ] Year slider updates instantly

---

### 6️⃣ **Search & Filtering**

- [ ] Search box filters markers
- [ ] Category checkboxes toggle markers
- [ ] Year range slider filters buildings
- [ ] Stats dashboard shows correct counts
- [ ] Memoization prevents re-renders

---

### 7️⃣ **Responsive Design**

- [ ] Open DevTools, toggle device emulation
- [ ] Test on iPhone SE (375px width)
- [ ] Test on iPad (768px width)
- [ ] Drawer collapses on mobile
- [ ] Stories panel is full-width on mobile
- [ ] Touch gestures work (pinch zoom, pan)

---

## 🐛 **Known Issues to Watch For**

### Potential Problems
1. **No Mapbox token** → Map won't load (blank screen)
2. **Backend not running** → "Failed to fetch" errors
3. **No MongoDB data** → Empty map (expected if DB is empty)
4. **Large bundle size** → Slow initial load (expected for Mapbox)

### Expected Warnings (Safe to Ignore)
- ⚠️ Rollup annotation warnings (react-helmet-async)
- ⚠️ Chunk size warnings (Mapbox is large)

---

## 📸 **What Success Looks Like**

### Visual Indicators
1. **Stars twinkling** in background
2. **UI colors change** when moving year slider
3. **Stories panel** shows era-specific content
4. **Markers pulse** with glowing halos
5. **3D buildings** rise when toggled
6. **Portal animation** when entering 3D viewer

### Console Output (Good)
```
✅ No errors
✅ TanStack Query cache logs
✅ Mapbox GL JS version logs
```

### Console Output (Bad)
```
❌ 404 errors (API not running)
❌ "Invalid Mapbox token" (need real token)
❌ React rendering errors (component issue)
```

---

## 🎭 **St. Paul-Specific Content to Verify**

### Stories Should Include:
- ✅ F. Scott Fitzgerald (born 1896, 481 Laurel Ave)
- ✅ Gangster era / O'Connor System
- ✅ Rondo neighborhood jazz clubs
- ✅ Summit Avenue mansions
- ✅ Cathedral & State Capitol
- ✅ Hmong cultural heritage

### Categories Should Work:
- 🏛️ Historic Building
- 🏪 Business
- 🎨 Cultural Site
- 👻 Ghost Story
- 🎵 Music Venue
- 🍽️ Food Heritage
- ⭐ Famous Person
- ⚡ Event

---

## 🚀 **Deployment Readiness**

- [ ] All manual tests pass
- [ ] No console errors
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables documented
- [ ] API endpoints validated
- [ ] Performance acceptable (<3s load)

---

## 📝 **Next Steps After Testing**

1. **If tests pass:**
   - Add real St. Paul data (music venues, ghost stories, famous people)
   - Add historic photos to popups
   - Enhance stories with more detail
   - Deploy to production

2. **If tests fail:**
   - Document exact error messages
   - Check browser console
   - Verify all dependencies installed
   - Confirm MongoDB is running

---

## 🎯 **Testing Command Reference**

```powershell
# Install dependencies (if needed)
cd z:\SaintPaul\backend; npm install
cd z:\SaintPaul\frontend; npm install

# Start backend
cd z:\SaintPaul\backend; npm run dev

# Start frontend (new terminal)
cd z:\SaintPaul\frontend; npm run dev

# Build frontend
cd z:\SaintPaul\frontend; npm run build

# Test API endpoints
curl http://localhost:3001/api/locations?limit=5
curl http://localhost:3001/api/building-specs?yearMin=1900&yearMax=1950
curl http://localhost:3001/api/history?yearMin=1920&yearMax=1940
```

---

**Ready to test the magic! ✨**
