## Quick Start Guide - Immediate Wins (Next 2 Weeks)

> **Goal**: Ship 5 high-impact improvements in 10 days that elevate quality, trust, and performance.

---

## Week 1: Quality Gates & Observability

### Day 1-2: Add CI Quality Checks

**Goal**: Catch issues before they reach production.

#### 1. Enable Lighthouse CI
```bash
# Install dependencies
npm install --save-dev @lhci/cli

# Run locally to test
cd frontend
npm run build
npx lhci autorun --collect.url=http://localhost:3000
```

**What it does**: Enforces performance budgets (LCP <2.0s), accessibility >90, SEO >90.

**Files created**:
- `.github/workflows/lighthouse.yml` ✅ (already created)

**Success metric**: All PRs show Lighthouse scores; fail if LCP >2.5s or accessibility <90.

---

#### 2. Enable pa11y Accessibility Testing
```bash
# Install pa11y-ci
npm install --save-dev pa11y-ci

# Create config file
cat > .pa11yci.json << 'EOF'
{
  "defaults": {
    "standard": "WCAG2AA",
    "threshold": 0,
    "timeout": 30000,
    "wait": 1000
  },
  "urls": [
    "http://localhost:3000",
    "http://localhost:3000/map",
    "http://localhost:3000/timeline",
    "http://localhost:3000/library",
    "http://localhost:3000/about"
  ]
}
EOF

# Test locally
cd frontend
npm run build
npx vite preview --port 3000 &
sleep 5
pa11y-ci --config ../.pa11yci.json
```

**What it does**: Scans pages for WCAG 2.2 AA violations (missing alt text, low contrast, broken landmarks).

**Files created**:
- `.github/workflows/accessibility.yml` ✅
- `.pa11yci.json` (create this)

**Success metric**: Zero WCAG AA violations on key pages.

---

#### 3. Add Bundle Size Check
```bash
# Add to frontend/package.json scripts
"analyze": "vite-bundle-visualizer"

# Install visualizer
npm install --save-dev vite-bundle-visualizer

# Run locally
cd frontend
npm run build
npm run analyze
```

**What it does**: Fails CI if initial JS bundle >200KB (gzipped).

**Files created**:
- `.github/workflows/bundle-size.yml` ✅

**Success metric**: Initial bundle <200KB; clear visualization of what's bloating the bundle.

---

### Day 3-4: Enable OpenTelemetry Tracing

**Goal**: See exactly where time is spent in API requests.

#### Backend Setup
```bash
cd backend

# Enable telemetry (already installed)
# Update .env
echo "OTEL_ENABLED=true" >> .env
echo "OTEL_SERVICE_NAME=saintpaul-api" >> .env
echo "OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318" >> .env

# Start local OTEL collector (optional for dev)
docker run -d --name otel-collector \
  -p 4318:4318 \
  otel/opentelemetry-collector:latest

# OR: Use cloud provider (Datadog, Honeycomb, New Relic free tier)
# Set OTEL_EXPORTER_OTLP_ENDPOINT to their endpoint
```

#### Add Structured Logging
```javascript
// backend/utils/logger.js (create this)
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
```

Update routes to use structured logging:
```javascript
const logger = require('../utils/logger');

// In route handlers
logger.info({ locationId, userId, latency: Date.now() - start }, 'Location fetched');
logger.error({ err, locationId }, 'Failed to fetch location');
```

**What it does**: Every request is traced; P95 latency visible in dashboards.

**Files to update**:
- `backend/.env`
- `backend/utils/logger.js` (create)
- All routes: Add structured logging

**Success metric**: Can view trace waterfall for any slow request; identify bottlenecks.

---

### Day 5: Accessibility Quick Fixes

**Goal**: Fix top 10 accessibility issues found by pa11y.

#### Common Fixes
1. **Missing alt text on images**
   ```jsx
   // Bad
   <img src="map.jpg" />
   
   // Good
   <img src="map.jpg" alt="1908 fire insurance map of downtown Saint Paul" />
   ```

2. **Low contrast text**
   ```css
   /* Bad */
   color: #999; /* on white background = 2.8:1 ratio */
   
   /* Good */
   color: #666; /* on white background = 5.7:1 ratio (WCAG AA pass) */
   ```

3. **Missing landmarks**
   ```jsx
   // Bad
   <div className="nav">...</div>
   
   // Good
   <nav aria-label="Main navigation">...</nav>
   ```

4. **No skip link**
   ```jsx
   // Add to Header.jsx
   <a href="#main-content" className="skip-link">
     Skip to main content
   </a>
   
   // CSS
   .skip-link {
     position: absolute;
     top: -40px;
     left: 0;
     background: #000;
     color: #fff;
     padding: 8px;
     z-index: 100;
   }
   .skip-link:focus {
     top: 0;
   }
   ```

5. **Keyboard navigation**
   - Ensure all interactive elements have `:focus-visible` styles
   - Test: Can you Tab through entire site and activate everything with Enter?

**Files to update**:
- All components with images, buttons, form inputs
- `frontend/src/index.css` (add skip-link styles)

**Success metric**: pa11y-ci passes with 0 errors.

---

## Week 2: Provenance & Design Tokens

### Day 6-7: Integrate Provenance Models

**Goal**: Surface citation data in the UI.

#### Backend: Link Provenance to Locations
```javascript
// backend/routes/locations.js
const Provenance = require('../models/Provenance');

// GET /api/locations/:id - Include provenance
router.get('/:id', async (req, res) => {
  const location = await Location.findById(req.params.id);
  const provenance = await Provenance.findByEntity(location._id, 'location');
  
  res.json({
    ...location.toObject(),
    provenance: provenance || null,
  });
});
```

#### Frontend: Display CitationCard
```tsx
// pages/Map.jsx (or wherever location details are shown)
import { CitationCard } from '../components/ui/CitationCard';

function LocationDetails({ location }) {
  return (
    <div>
      <h2>{location.name}</h2>
      {location.provenance && (
        <CitationCard
          provenance={location.provenance}
          onViewOriginal={(source) => window.open(source.link, '_blank')}
        />
      )}
    </div>
  );
}
```

**What it does**: Every location shows source attribution; users can verify claims.

**Files to update**:
- `backend/routes/locations.js`
- `frontend/src/pages/Map.jsx` (or relevant detail view)

**Success metric**: 100+ locations have provenance data; visible in UI.

---

### Day 8-9: Migrate to Design Tokens

**Goal**: Replace all magic values with `tokens.ts` constants.

#### Example Refactor
```tsx
// Before
<button style={{ padding: '12px 24px', backgroundColor: '#1e88e5' }}>
  Click me
</button>

// After
import { tokens } from '../theme/tokens';

<button style={{
  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
  backgroundColor: tokens.colors.primary[500],
}}>
  Click me
</button>
```

#### Batch Replace Common Values
```bash
# Find all hardcoded colors
grep -r "#1e88e5" frontend/src/

# Find all hardcoded spacing
grep -r "16px\|24px\|32px" frontend/src/
```

**Files to update**:
- All `.jsx`/`.tsx` files with inline styles
- `frontend/src/index.css` (use CSS custom properties)

**Success metric**: 90%+ of components use tokens; no hardcoded hex colors or pixel values.

---

### Day 10: Create Citation Export Modal

**Goal**: Users can export citations in multiple formats.

#### Component Scaffold
```tsx
// frontend/src/components/ui/CitationExportModal.tsx
import React, { useState } from 'react';
import { tokens } from '../../theme/tokens';

interface CitationExportModalProps {
  location: any;
  provenance: any;
  onClose: () => void;
}

export const CitationExportModal: React.FC<CitationExportModalProps> = ({
  location,
  provenance,
  onClose,
}) => {
  const [format, setFormat] = useState<'bibtex' | 'apa' | 'chicago' | 'mla'>('apa');

  const generateCitation = () => {
    // TODO: Use citation.js library for format conversion
    const baseData = {
      title: location.name,
      url: provenance.permalink,
      accessed: new Date().toISOString().split('T')[0],
    };

    // Placeholder formatting
    switch (format) {
      case 'apa':
        return `Saint Paul Historical Portal. (n.d.). ${baseData.title}. Retrieved ${baseData.accessed}, from ${baseData.url}`;
      case 'bibtex':
        return `@misc{saintpaul${location._id},\n  title={${baseData.title}},\n  url={${baseData.url}},\n  note={Accessed: ${baseData.accessed}}\n}`;
      // ... more formats
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: tokens.zIndex.modal,
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: tokens.spacing.xl,
        borderRadius: tokens.borders.radius.lg,
        maxWidth: '600px',
        width: '90%',
      }}>
        <h3>Export Citation</h3>
        
        <select value={format} onChange={(e) => setFormat(e.target.value as any)}>
          <option value="apa">APA 7th</option>
          <option value="bibtex">BibTeX</option>
          <option value="chicago">Chicago 17th</option>
          <option value="mla">MLA 9th</option>
        </select>

        <pre style={{
          backgroundColor: tokens.colors.neutral[100],
          padding: tokens.spacing.md,
          borderRadius: tokens.borders.radius.sm,
          fontFamily: tokens.typography.fonts.mono,
          fontSize: tokens.typography.sizes.sm,
          overflow: 'auto',
        }}>
          {generateCitation()}
        </pre>

        <button onClick={() => navigator.clipboard.writeText(generateCitation())}>
          Copy to Clipboard
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

**What it does**: Click "Cite" → modal with formatted citation → copy to clipboard.

**Files to create**:
- `frontend/src/components/ui/CitationExportModal.tsx`

**Success metric**: Users can export 4 citation formats; clipboard copy works.

---

## Validation Checklist (End of Week 2)

Run these commands to verify success:

```bash
# 1. All CI checks pass
git push origin feature-branch
# Wait for GitHub Actions → all green

# 2. Lighthouse scores meet targets
cd frontend
npm run build
npx lhci autorun --collect.url=http://localhost:3000
# LCP <2.0s, Accessibility >90, Performance >85

# 3. pa11y passes
pa11y-ci --config .pa11yci.json
# 0 errors

# 4. Bundle size under budget
npm run build
du -sh dist/assets/*.js | awk '{sum+=$1} END {print sum}'
# <200KB

# 5. OpenTelemetry traces visible
# Check OTEL collector dashboard or cloud provider
# Confirm spans for all API routes

# 6. Provenance data shows in UI
# Visit /map, click location → see CitationCard with sources

# 7. Design tokens in use
grep -r "tokens\." frontend/src/ | wc -l
# >100 usages

# 8. Citation export works
# Click "Cite" button → modal opens → copy BibTeX/APA/Chicago/MLA
```

---

## Success Metrics (2-Week Review)

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Lighthouse LCP | ~3.5s | <2.0s | <2.0s |
| Lighthouse Accessibility | 75 | 90+ | 90+ |
| WCAG AA Violations | 15+ | 0 | 0 |
| Bundle Size | 250KB | <200KB | <200KB |
| API P95 Latency | Unknown | <150ms | <150ms |
| Locations with Provenance | 0 | 100+ | 100+ |
| Components using Tokens | 0% | 90%+ | 90%+ |

---

## Next Steps (Week 3+)

Once Week 1-2 foundations are solid:

1. **Phase 1**: Build Layer Composer + Timeline scrubber (flagship UX)
2. **Phase 2**: Tour Builder MVP + Contribution Studio
3. **Phase 3**: 3D Reconstructions v2 (WebGPU + LOD)
4. **Phase 4**: Publish Civic History Schema + starter kit

---

## Questions? Start Here

```bash
# Run full dev environment
pwsh -File .\start-dev.ps1

# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Check for errors
npm run lint
npm run typecheck
```

🚀 **Let's ship world-class quality, one commit at a time!**
