# Hybrid Strategy: 2D Hero + 3D Power Feature

**Decision Made:** November 24, 2025  
**Approach:** Stop thrashing. Ship what works. Focus forward.

---

## ✅ What We're Keeping

### 3D Historical Viewer (Freeze & Polish)
- **Status:** ✅ Built and functional (507 lines)
- **Features:**
  - First-person WASD navigation with collision detection
  - Orbit camera controls
  - Timeline integration with year slider
  - Building specs rendering (instanced)
  - Heatmap overlays
  - Reconstruction snapshot comparison
  - Diff visualization between time periods
  - Keyboard shortcuts (G/F/H)
  
- **Action:** FREEZE SCOPE
  - ❌ No new 3D features
  - ✅ Bug fixes only
  - ✅ Keep as "power user" feature
  - ✅ Accessible via header navigation and map button

---

## 🎯 What We're Focusing On (90% Effort)

### Enhanced 2D Map Experience (Primary Portal)

#### Just Implemented ✅
1. **Rich Data Integration**
   - Connected to `/api/locations` endpoint
   - Connected to `/api/building-specs` with pagination
   - Real-time filtering and display

2. **Advanced Filtering**
   - Year range slider (1850-2025)
   - Category checkboxes (7 categories)
   - Full-text search across names, architects, descriptions
   - Filter counts and badges

3. **Mapbox 3D Buildings Layer**
   - Native Mapbox extrusions (no Three.js needed)
   - 45° pitch for depth perception
   - Toggle on/off for performance

4. **3D Viewer Launch Button**
   - Prominent "Explore in 3D" button on map
   - Gradient styling, hover effects
   - Seamless navigation between 2D/3D modes

5. **Enhanced UI/UX**
   - Collapsible sidebar with filter toggle
   - Location list with real-time counts
   - Rich popups with images, architect info, specs
   - Stats dashboard (locations, buildings, year span)
   - Category color coding and icons

6. **Home Page Priority**
   - Map feature now has "Start Here" badge
   - Emphasized as primary experience
   - Timeline and Library remain accessible

---

## 🚀 Next Steps (Ship & Iterate)

### Phase 1: Test & Deploy Current State (Week 1)
- [ ] Test map with real Mapbox token
- [ ] Verify all API endpoints working
- [ ] Test on mobile devices
- [ ] Fix any critical bugs
- [ ] Deploy to staging

### Phase 2: Data Enrichment (Weeks 2-3)
- [ ] Import all collected historical data
  - Famous people locations
  - Music venues through time
  - Food history (restaurants, breweries)
  - Cultural events
  - Ghost stories locations
  - Sports landmarks
- [ ] Add historical photos to locations
- [ ] Create category icons/markers

### Phase 3: Storytelling Features (Weeks 4-5)
- [ ] Guided tours system
  - Architecture tour
  - Music history tour
  - Food & drink tour
  - Haunted St. Paul tour
- [ ] Narrative overlays
- [ ] Before/after photo sliders
- [ ] Audio clips integration

### Phase 4: Advanced Map Features (Weeks 6-8)
- [ ] Historical map overlays (Sanborn maps)
- [ ] Comparison mode (side-by-side eras)
- [ ] Deck.gl visualizations
  - Heatmaps (demographics, events)
  - Arc layers (migration patterns)
  - Hexagon aggregation
- [ ] Custom map styles (vintage, modern, satellite)

### Phase 5: Polish & Launch (Weeks 9-10)
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile PWA features
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Public launch

---

## 📊 Success Metrics

### Short Term (3 Months)
- Map page is most visited (>60% of traffic)
- Average session >8 minutes
- <3s load time on 4G
- 3D viewer used by 15-25% of users (power feature)

### Long Term (12 Months)
- 10,000+ unique visitors
- 5+ institutional partnerships
- Featured in local media
- Used in school curricula
- Community contributions (photos, stories)

---

## 💡 Why This Works

1. **Stops Decision Paralysis**
   - Clear primary focus (2D map)
   - 3D preserved, not discarded
   - Forward momentum

2. **Plays to Strengths**
   - Extensive data collection is showcased
   - Mapbox native features reduce complexity
   - Performance optimized for mobile

3. **User Value First**
   - Accessible to everyone (2D)
   - Advanced option for enthusiasts (3D)
   - Progressive enhancement model

4. **Sustainable Development**
   - Clear scope boundaries
   - Incremental shipping
   - Feedback-driven iteration

---

## 🛠️ Technical Stack (Finalized)

### Frontend
```
Core: React 18 + Vite
Mapping: Mapbox GL JS + react-map-gl
3D (frozen): Three.js + React Three Fiber
Visualization: Deck.gl + Recharts + D3
State: Zustand + TanStack Query
UI: Material-UI + Framer Motion
```

### Backend (Existing)
```
API: Node.js + Express
Database: MongoDB
Validation: Zod schemas
Caching: Built-in query cache
```

### Bundle Size Impact
- **Before:** ~3.5MB (heavy 3D dependencies)
- **After:** ~1.2MB (2D-first, 3D lazy-loaded)
- **Savings:** 66% reduction in initial bundle

---

## 📝 Communication Guidelines

### To Users
- "Explore St. Paul's history through our interactive map"
- "Launch the 3D viewer for an immersive experience" (optional feature)
- Focus on content, data, stories - not technology

### To Contributors
- Map development = open for PRs
- 3D viewer = maintenance only, no new features
- Data contributions always welcome

### To Stakeholders
- Primary deliverable: Comprehensive 2D historical map
- Differentiator: 3D viewer as premium feature
- Measurable: Analytics on map engagement

---

## ✨ The Vision (Unchanged)

Create the **definitive digital portal to St. Paul's history**, where:
- Every building tells a story
- Every era comes alive
- Every visitor discovers something new
- The depth of research shines through
- Technology serves the content, not vice versa

**By focusing on 2D mastery, we deliver this vision faster, better, and more sustainably.**

---

*Strategy locked: November 24, 2025*  
*Next review: After Phase 1 deployment*  
*Guiding principle: Ship. Learn. Iterate.*
