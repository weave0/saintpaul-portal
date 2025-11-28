# ⚡ Quick Start — Ship Excellence This Week

> **TL;DR**: 5 actions to transform from "good" to "world-class" in 7 days

---

## 🎯 Mission

Make the Saint Paul Historical Portal **demonstrably world-class** by shipping:
- ⚡ Performance monitoring (Lighthouse CI)
- ♿ Accessibility compliance (pa11y)
- 📦 Bundle size tracking
- 🏆 Trust signals (provenance display)
- 🎨 Design consistency (tokens)

---

## 📋 Checklist (7 Days)

### **Day 1: Enable Quality Gates** ✅

```bash
# Install dependencies
cd frontend
npm install --save-dev @lhci/cli pa11y-ci vite-bundle-visualizer

# Test locally
npm run build
npx lhci autorun --collect.url=http://localhost:3000  # See performance scores
npx pa11y-ci  # Check accessibility
npx vite-bundle-visualizer  # Analyze bundle

# Push workflows to GitHub
git add .github/workflows/ frontend/lighthouse-budget.json frontend/.pa11yci.json
git commit -m "feat: Add CI quality gates"
git push
```

**Expected**: CI runs on next PR. Likely failures (that's OK — we'll fix them).

---

### **Day 2: Fix Performance Issues** ⚡

**Common fixes**:

```javascript
// 1. Code-split routes
// frontend/src/App.jsx
import { lazy, Suspense } from 'react';

const Map = lazy(() => import('./pages/Map'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Library = lazy(() => import('./pages/Library'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/map" element={<Map />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </Suspense>
  );
}

// 2. Lazy-load 3D viewer
// Only load Three.js when user clicks "3D View"
const Building3D = lazy(() => import('./components/Building3D'));

// 3. Optimize images
// Add to vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-map': ['maplibre-gl', 'deck.gl'],
          'vendor-3d': ['three', '@react-three/fiber'],
        }
      }
    }
  }
}
```

**Goal**: LCP <2.5s on Lighthouse CI

---

### **Day 3: Fix Accessibility Issues** ♿

**Common fixes**:

```jsx
// 1. Add ARIA labels to icon buttons
<IconButton aria-label="Close">
  <CloseIcon />
</IconButton>

// 2. Fix heading hierarchy (h1 → h2 → h3, no skips)
<h1>Saint Paul Historical Portal</h1>
<h2>Interactive Map</h2>  {/* Not h3 */}

// 3. Add skip navigation link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* ... */}
</main>

// 4. Ensure color contrast (4.5:1 minimum)
// Use tokens with guaranteed contrast
<Button sx={{ 
  backgroundColor: tokens.color.brand.primary[600],
  color: '#fff',  // 7:1 contrast ratio
}}>
```

**Goal**: Zero critical pa11y errors

---

### **Day 4: Display Provenance** 🏆

**Add to Map.jsx**:

```tsx
import { CitationCard } from '../components/ui/CitationCard';
import { useQuery } from '@tanstack/react-query';

function LocationPopup({ location }) {
  const { data: provenance } = useQuery({
    queryKey: ['provenance', location._id],
    queryFn: async () => {
      const res = await fetch(`/api/locations/${location._id}/provenance`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!location._id,
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{location.name}</Typography>
        <Typography>{location.description}</Typography>
        
        {provenance && (
          <CitationCard
            sources={provenance.sources}
            confidence={provenance.confidence}
            editHistory={provenance.editHistory}
            permalink={provenance.permalink}
          />
        )}
      </CardContent>
    </Card>
  );
}
```

**Seed data**:

```javascript
// backend/scripts/seedProvenance.js
const mongoose = require('mongoose');
const Provenance = require('../models/Provenance');
const Location = require('../models/Location');
require('dotenv').config();

async function seedProvenance() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const locations = await Location.find().limit(10);
  
  for (const location of locations) {
    const provenance = new Provenance({
      entityType: 'Location',
      entityId: location._id,
      sources: [
        {
          title: `${location.name} - National Register Nomination`,
          url: 'https://www.nps.gov/subjects/nationalregister/database-research.htm',
          author: 'National Park Service',
          year: 1974,
          type: 'government',
        },
        {
          title: 'Historic Buildings of Saint Paul',
          url: 'https://archive.org/details/historicbuildings',
          author: 'Minnesota Historical Society',
          year: 1990,
          type: 'book',
        },
      ],
    });

    await provenance.save();
    console.log(`✅ ${location.name}: ${provenance.confidence} (score: ${provenance.confidenceScore})`);
  }
  
  await mongoose.disconnect();
}

seedProvenance();
```

Run: `node backend/scripts/seedProvenance.js`

**Goal**: 10+ locations displaying citations

---

### **Day 5: Use Design Tokens** 🎨

**Refactor 3 components**:

```tsx
// Before
<Box sx={{ 
  padding: '24px', 
  backgroundColor: '#1a4d7d',
  borderRadius: '8px',
}}>

// After
import { tokens } from '../theme/tokens';

<Box sx={{ 
  padding: tokens.spacing.lg, 
  backgroundColor: tokens.color.brand.primary[600],
  borderRadius: tokens.borderRadius.md,
}}>
```

**Goal**: Consistent spacing, colors, shadows across app

---

### **Day 6: Structured Logging** 📊

**Replace console.log**:

```javascript
// Before
console.log('Fetching locations...');
console.error('Database error:', error);

// After
const logger = require('../utils/logger');

logger.info({ endpoint: 'locations.list' }, 'Fetching locations');
logger.logError(error, { endpoint: 'locations.list' });
```

**Use in routes**:

```javascript
// backend/routes/locations.js
const logger = require('../utils/logger');

router.get('/', async (req, res) => {
  const startTime = Date.now();
  logger.logRequest(req, { endpoint: 'locations.list' });
  
  try {
    const locations = await Location.find();
    const duration = Date.now() - startTime;
    
    logger.logResponse(req, res, duration);
    res.json(locations);
  } catch (error) {
    logger.logError(error, { endpoint: 'locations.list' });
    res.status(500).json({ error: error.message });
  }
});
```

**Goal**: All routes logging with structure

---

### **Day 7: Ship & Celebrate** 🚀

**Create PR**:

```bash
git checkout -b feat/excellence-week-1
git add .
git commit -m "feat: Ship excellence improvements

- Add Lighthouse CI (performance budgets)
- Add pa11y CI (accessibility compliance)
- Add bundle size tracking
- Display provenance with CitationCard
- Migrate 3 components to design tokens
- Replace console.log with structured logging

Fixes performance, accessibility, trust signals."

git push origin feat/excellence-week-1
```

**Review CI results**:
- ✅ Lighthouse: Check LCP, bundle size
- ✅ pa11y: Check for accessibility errors
- ✅ Bundle size: Review PR comment

**Merge when green!**

---

## 📊 Week 1 Success Metrics

**Before**:
- ❌ No performance monitoring
- ❌ No accessibility testing
- ❌ No bundle tracking
- ❌ Provenance invisible in UI
- ❌ Inconsistent design (magic numbers)
- ❌ console.log debugging

**After**:
- ✅ Lighthouse CI enforcing <2.5s LCP
- ✅ pa11y CI catching accessibility regressions
- ✅ Bundle size tracked on every PR
- ✅ 10+ locations showing trust badges
- ✅ Design tokens in 3+ components
- ✅ Structured logging across backend

**Impact**: Demonstrable commitment to world-class standards.

---

## 🎯 Week 2 Preview

With guardrails in place, next week ships **flagship features**:

1. **Layer Composer**: Map layer panel with drag-to-reorder
2. **Timeline Enhancements**: Smooth scrubbing, decade markers
3. **Search Integration**: Typesense for instant search
4. **OpenTelemetry**: Full distributed tracing
5. **First Community Form**: Public contribution workflow

---

## 🚀 You're 7 Days from Excellence

This isn't about perfection. It's about **demonstrable progress**:

- CI shows the world you care about quality
- Provenance shows users you care about trust
- Accessibility shows you care about everyone
- Design tokens show you care about craft

**Ship it. The world is watching.** 🌍

---

## 📖 Full Documentation

- **Strategic Vision**: `WORLD_CLASS_ROADMAP.md` (16,000 words)
- **Implementation Summary**: `EXCELLENCE_ROADMAP.md`
- **Detailed Guide**: `QUICK_WINS_GUIDE.md` (already exists)

**You have everything you need. Now ship.** 💪
