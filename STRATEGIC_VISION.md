# Saint Paul Historical Portal — Strategic Vision & Excellence Roadmap

> **"What is this?"** A living, world-class civic-historical exploration platform that makes Saint Paul's past and present searchable, explorable, and emotionally resonant—with scholarly rigor and exceptional craft.

> **"How could this be better?"** By leading the world in how cities tell their stories through technology.

---

## 🎯 The Moonshot

**Purpose**: Transform how people explore urban history by creating the definitive reference implementation—a beautiful, fast, trustworthy portal combining geospatial data, 3D reconstructions, cultural narratives, and scholarly provenance. Build it for Saint Paul. Make it replicable for any city.

**North Star**: The best open city-history experience on the internet. Think "Google Earth meets Smithsonian meets civic pride"—but faster, more accessible, and community-driven.

**Positioning**: Set the global standard for digital civic heritage. When another city wants to do this, they clone our repo and follow our playbook.

---

## 📊 Success Metrics & KPIs

### Adoption & Engagement
- **Monthly Active Users (MAU)**: Target 10K within 6 months of launch
- **Session Duration**: Avg 8+ minutes (deep engagement)
- **Return Rate**: 40% monthly returning users
- **Engagement Depth**: Avg 5+ interactions per session (map zoom, timeline scrub, layer toggle, location click)

### Content Quality & Completeness
- **Validated Locations**: 5,000+ locations with full metadata (coordinates, dates, sources)
- **Historical Events**: 2,000+ events with rich narratives and citations
- **3D Reconstructions**: 50+ buildings with high-fidelity models
- **Citation Coverage**: 95%+ of content includes source attribution
- **Data Quality Score**: 90%+ schema validation pass rate across all collections

### Trust & Provenance
- **Source Attribution**: Every artifact links to primary/secondary sources
- **Provenance Tracking**: Full edit history and contributor attribution
- **Citation Completeness**: BibTeX/APA/Chicago export available for all scholarly content
- **Community Trust Score**: 4.5+ star rating from academic/researcher community

### Performance (World-Class Benchmarks)
- **P95 TTFB (Time to First Byte)**: <200ms
- **P95 LCP (Largest Contentful Paint)**: <2.0s
- **P95 API Latency**: <150ms for all endpoints
- **Map Interaction FPS**: Consistent 60fps on desktop, 30fps on mobile
- **3D Scene Load Time**: <3s for initial render, <1s for transitions

### Accessibility & Inclusivity
- **WCAG 2.2 AA Compliance**: 100% coverage across all pages
- **Keyboard Navigation**: Full site navigable without mouse
- **Screen Reader Pass Rate**: Zero critical issues in axe/pa11y audits
- **Multi-Language Support**: English + 3 additional languages by year 1
- **Low-Bandwidth Mode**: Functional experience on <1Mbps connections

### Contribution & Community
- **Community Submissions**: 100+ verified contributions in first year
- **Moderation SLA**: <48hr review for all submissions
- **Contributor Retention**: 60% of contributors make 2+ submissions
- **Educational Partnerships**: 10+ local schools/institutions using platform

### Reliability & Uptime
- **API Uptime**: 99.9% SLA (43min/month downtime budget)
- **Error Rate**: <0.1% of all requests
- **Alert Response Time**: <15min for critical issues
- **Disaster Recovery**: <1hr RPO (Recovery Point Objective)

---

## 🗺️ Key User Journeys (The "Wow" Moments)

### 1. **The Explorer** — "Show me my neighborhood in 1908 vs today"
**Flow:**
1. Land on homepage → auto-detect location or use search
2. Address lookup reveals block-level historical data
3. Timeline scrubber smoothly transitions between decades (1880 → 1920 → 1950 → 2025)
4. Layer toggles: Fire insurance maps, aerial photos, crime data, cultural events
5. 3D flythrough of reconstructed buildings with "street view" mode
6. Click building → see historical photos, original blueprints, Sanborn map excerpts

**Key Features:**
- Fast, fluid timeline scrubbing (CSS transitions + progressive image loading)
- Layered map overlays with opacity controls
- Deep-linkable: Share exact view (year, layers, zoom, location) via URL
- Mobile-optimized: Touch gestures, simplified UI, progressive enhancement

---

### 2. **The Researcher** — "Cite this fire insurance map segment in my thesis"
**Flow:**
1. Navigate to map → select region of interest
2. Toggle "Provenance Lens" to see source overlays with confidence badges
3. Click "View Original" → high-res scan with metadata modal
4. Export citation: BibTeX, APA, Chicago formats with permalink + archive hash
5. Download annotated PDF with embedded citations for offline work

**Key Features:**
- Inline source attribution with DOI-like permalinks
- Citation generator (BibTeX/APA/Chicago/MLA)
- Archive.org/DPLA integration for long-term preservation
- Scholar-mode: Enhanced metadata, export options, version history

---

### 3. **The Educator** — "Build a 10-stop walking tour for my class"
**Flow:**
1. Click "Create Tour" → drag-drop map markers or search locations
2. Add narrative, upload audio, or auto-generate captions
3. Reorder stops, add quiz questions, embed historical photos
4. Preview tour in immersive mode (audio + visuals sync'd)
5. Publish → get QR code, printable PDF, and shareable link
6. Students access tour on phones, tablets, or desktop (offline-capable)

**Key Features:**
- Tour Builder UI: Drag-drop, rich text editor, media uploads
- Audio Narration: Upload MP3 or auto-transcript from text (TTS)
- QR Code Generation: Print-friendly with embedded tour data
- Lesson Mode: Quiz overlays, discussion prompts, accessibility hints
- Offline Packs: Pre-bundle neighborhood tours for field trips

---

### 4. **The City Planner** — "Understand zoning evolution for this district"
**Flow:**
1. Search by district or parcel ID
2. View zoning timeline: 1900 → 2025 with regulatory milestones
3. Layer overlays: NRHP boundaries, demolition records, permit data
4. Impact analysis: See correlation between zoning changes and demographic shifts
5. Export report: PDF with maps, charts, and regulatory citations

**Key Features:**
- Regulatory Timeline: Visual timeline with ordinance links
- Layered GIS Data: Parcels, zoning codes, historic designations
- Impact Narratives: AI-assisted summaries (fact-checked by schema validation)
- Export Tools: PDF, CSV, GeoJSON for ArcGIS/QGIS import

---

### 5. **The Resident** — "What happened on my street?"
**Flow:**
1. Enter address → instant results: historical photos, events, building history
2. Neighborhood narrative: Auto-generated summary with citations
3. Photo comparison slider: Then vs Now with high-res historical images
4. Community Stories: Read/add personal memories (moderated)
5. Save location → receive updates when new data is added

**Key Features:**
- Address Autocomplete: Geocoded search with historical name support
- Photo Slider: Smooth drag-to-compare interface
- Community Contributions: Moderation queue with provenance scoring
- Notifications: Opt-in alerts for new content about saved places

---

### 6. **The Contributor** — "Add a corrected date with sources"
**Flow:**
1. Navigate to location/event → click "Suggest Edit"
2. Guided form: Pre-filled data + validation hints (Zod schema enforcement)
3. Add sources: URL, book citation, photo upload, or archive link
4. Provenance scoring: Real-time feedback on citation quality
5. Submit → enters moderation queue with automated quality checks
6. Approved → contributor badge, attribution on item, changelog entry

**Key Features:**
- Contribution Studio: Form wizard with inline validation
- Provenance Scoring: "Silver/Gold/Platinum" badges based on source quality
- Moderation Panel: Admin review with diff view + rollback
- Changelog: Public audit trail for all edits

---

## 🔍 What the Best Programmer Would Say

### **Obvious Gaps (Low-Hanging Fruit)**

1. **No Unified Design System**
   - **Issue**: MUI theme + custom `theme.js` but no cohesive component library. Inconsistent spacing, colors, motion.
   - **Fix**: Adopt Radix UI primitives + shadcn/ui patterns. Build `frontend/src/components/ui/` library with design tokens (`tokens.ts`). Document in Storybook.

2. **Observability is Incomplete**
   - **Issue**: OpenTelemetry is present but not fully wired. No dashboards, SLOs, or synthetic monitoring.
   - **Fix**: Add structured logging (Pino everywhere), tracing to all backend routes, frontend RUM (Real User Monitoring) via Datadog/Sentry. Define SLOs and alert thresholds.

3. **Accessibility Audit Missing**
   - **Issue**: No automated a11y checks in CI. Keyboard nav and screen reader support not validated.
   - **Fix**: Add `pa11y-ci` to GitHub Actions, enforce WCAG 2.2 AA. Audit all interactive components with axe DevTools. Fix landmarks, focus states, ARIA labels.

4. **Data Provenance Not Surfaced**
   - **Issue**: Backend has citations but frontend doesn't display them prominently. Users can't verify sources.
   - **Fix**: Add "Provenance Lens" UI mode (toggle in header). Show inline badges, citation modals, export options. Build `CitationCard.jsx` component.

5. **No Performance Budget**
   - **Issue**: No Lighthouse CI, bundle analysis, or image optimization pipeline.
   - **Fix**: Add `@unlighthouse/ci` to workflows. Set budgets (LCP <2.5s, bundle <200KB initial). Optimize images with Sharp, lazy-load 3D scenes.

6. **Contribution Workflow Doesn't Exist**
   - **Issue**: No public-facing way to submit edits, corrections, or new data.
   - **Fix**: Build Contribution Studio (`pages/Contribute.jsx`) with Zod-validated forms, preflight checks, moderation queue (`backend/routes/contributions.js`).

---

### **Less-Obvious Opportunities (The Magic)**

1. **Narrative Engine (Ethical AI)**
   - **What**: Generate location summaries using LLMs *strictly constrained* by our Zod schemas and provenance data.
   - **How**: Prompt template includes all validated facts + citations. Output is fact-checked against schema before display. Every AI-generated sentence links to source.
   - **Why**: Scale storytelling without sacrificing truth. "This block had 12 fires between 1890-1920 [source]" auto-generated from validated data.

2. **Personal Timelines (User-Centric History)**
   - **What**: Users can save places + add family stories, creating a private timeline layered over the public data.
   - **How**: User accounts (optional), private collections, export as PDF "Family History Book."
   - **Why**: Make history personal. "My grandparents lived here in 1945" + official records = powerful narrative.

3. **City Time Machine (Seamless Temporal Navigation)**
   - **What**: Scrub through decades with graceful degradation—3D where available, 2D maps/photos elsewhere.
   - **How**: Preload adjacent year layers. Use CSS Houdini for smooth opacity transitions. Fallback to static Sanborn maps if 3D not available.
   - **Why**: Core "wow" moment. Feels like time travel.

4. **Tour-as-Story (Embeddable Experiences)**
   - **What**: A single URL renders an interactive tour with audio, transcripts, maps, and accessibility hints—embeddable in any site.
   - **How**: Tours are JSON manifests. Renderer is a standalone React component. Use iframe embed or Web Components.
   - **Why**: Schools, museums, tourism sites can embed Saint Paul history. Viral distribution.

5. **Ethical AI Transparency (Model Cards & Bias Flags)**
   - **What**: Every AI-generated summary includes a "Model Card" (which model, temperature, prompt) and bias warnings.
   - **How**: Store provenance: `{ generator: 'gpt-4o-mini', temp: 0.3, prompt: '...', sources: [...] }`. Flag sensitive topics (race, crime, displacement) with editorial notes.
   - **Why**: Trust and transparency. Acknowledge historical bias in source material.

6. **Open Standard (Civic History Schema)**
   - **What**: Publish our Zod schemas as a portable standard. Provide starter kit: `npx create-city-portal`.
   - **How**: Extract schemas to `@saintpaul/civic-schema` npm package. Document in OpenAPI. Publish to Schema.org.
   - **Why**: Amplify impact. Other cities adopt the standard. We become the reference implementation.

---

## 🏗️ Flagship Features (What Sets Us Apart)

### 1. **3D Reconstructions v2 (WebGPU + LOD)**
**Current**: Basic Three.js scenes, performance varies.
**Upgrade**:
- WebGPU rendering pipeline (10x faster, smoother shadows/reflections)
- Level-of-Detail (LOD): High-poly models when close, low-poly at distance
- Temporal Transitions: Morph buildings through time (1880 → 1920 → 2025)
- Mobile Fallback: Detect GPU capability, gracefully degrade to 2D or low-poly
- Offline Support: Pre-cached GLB models for tours

**Tech**: Three.js + WebGPU backend, Basis Universal textures, lazy loading via `@react-three/drei`

---

### 2. **Layer Composer (Power User Mode)**
**What**: Drag-drop UI to compose custom map layers. Save views as shareable links.
**Layers**:
- Fire insurance maps (1880-1950)
- Aerial photos (1937, 1953, 1991, 2015, 2025)
- Crime data (historical + modern)
- Cultural events (concerts, protests, festivals)
- Zoning/parcels (regulatory overlays)
- Community stories (user-submitted narratives)

**UX**: Sidebar with opacity sliders, layer reordering, saved presets ("1920s Jazz District", "Rondo Displacement", "Modern Development")

**Tech**: MapLibre GL + Deck.gl for performant overlays. URL-encoded state for shareable links.

---

### 3. **Provenance Lens (Trust Badge)**
**What**: Toggle to see inline source overlays with confidence scores.
**UI**:
- Badge colors: 🥉 Bronze (1 source), 🥈 Silver (2-3 sources), 🥇 Gold (4+ sources + cross-referenced)
- Click badge → modal with full citations, links to originals, edit history
- "View Original" opens high-res scan with metadata

**Data Model**:
```typescript
interface Provenance {
  sources: Citation[];
  confidence: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastVerified: Date;
  contributors: string[];
  editHistory: ChangeLog[];
}
```

**Tech**: Zod schemas enforce provenance requirements. Backend routes return provenance in every response.

---

### 4. **Tour Builder (Lesson Mode)**
**What**: No-code tool to create walking tours with audio, quizzes, and accessibility hints.
**Features**:
- Drag-drop map markers
- Rich text editor (TipTap) for narratives
- Audio upload or TTS generation
- Auto-captioning (Whisper API)
- Quiz overlays ("What year was this building completed?")
- QR code generation for field trips
- Offline packs (Service Worker caches tour data)

**Export Formats**:
- Web (shareable URL)
- PDF (print-friendly with maps)
- GeoJSON (for ArcGIS)
- Audio podcast feed (RSS)

**Tech**: React Flow for UI builder, TipTap for editor, Service Worker for offline. Backend: `routes/tours.js` with CRUD + publish.

---

### 5. **Cite & Export (Scholar Mode)**
**What**: Export any location/event as academic citation with permalink and archive hash.
**Formats**:
- BibTeX
- APA 7th
- Chicago 17th
- MLA 9th

**Features**:
- Permalink: `saintpaul.history/cite/loc-12345` (never changes)
- Archive Hash: SHA-256 of content + timestamp (tamper-proof)
- DOI Registration: Apply for DOI via Zenodo/Crossref
- Export PDF: Annotated with inline citations

**Tech**: Citation.js library for format conversion. Backend generates permalink + hash. Frontend renders modal with copy buttons.

---

### 6. **Contribution Studio (Community Pipeline)**
**What**: Guided submission flow with preflight validation and moderation queue.
**Flow**:
1. User clicks "Suggest Edit" on any location/event
2. Form pre-filled with current data + validation hints (Zod schema)
3. Add sources (URL, photo, book citation)
4. Real-time provenance scoring: "Add 1 more source for Silver badge!"
5. Submit → automated checks (duplicate detection, geocoding validation)
6. Moderation queue: Admin sees diff view, rollback option, contributor history
7. Approve → changelog entry, contributor badge, notification to submitter

**Moderation Tools**:
- Diff view (show what changed)
- Bulk approve/reject
- Block/flag contributors
- Provenance audit log

**Tech**: `backend/routes/contributions.js` with CRUD. Frontend: `pages/Contribute.jsx` with react-hook-form + Zod. Admin panel: `pages/Admin.jsx` with table/diff views.

---

### 7. **Offline Packs (Low-Connectivity Mode)**
**What**: Pre-bundled neighborhood packs (maps, photos, tours) for slow connections.
**How**:
- User selects neighborhood → downloads pack (~10-50MB)
- Service Worker caches all assets
- Offline-first: App works without internet, syncs when online

**Packs**:
- Downtown (1880-2025)
- Rondo Neighborhood
- Summit Avenue Mansions
- Mississippi Riverfront

**Tech**: Service Worker + IndexedDB. Backend: `routes/offline-packs.js` generates zip archives with manifest.

---

### 8. **Accessibility First (WCAG 2.2 AA)**
**Commitments**:
- Keyboard-perfect: Full site navigable via Tab, Enter, Esc, Arrow keys
- High-contrast themes: 7:1 contrast ratios for all text
- Screen reader landmarks: Semantic HTML, ARIA labels, skip links
- Transcripts: All audio/video content has text alternative
- Focus indicators: Visible, high-contrast outlines
- Error messages: Clear, actionable, linked to form fields

**Testing**:
- `pa11y-ci` in GitHub Actions (fail on WCAG AA violations)
- Manual audits: NVDA, JAWS, VoiceOver
- User testing: Partner with local accessibility advocacy groups

---

## 🏛️ Architecture Upgrades (World-Class Infrastructure)

### **Frontend (React + TypeScript + Design System)**

#### Current State
- React 18 ✅
- MUI components ✅
- Custom `theme.js` ✅
- Vite build ✅
- TanStack Query (some routes) ⚠️
- TypeScript (partial) ⚠️

#### Upgrades Needed

1. **Strict TypeScript Everywhere**
   - Enable `strict: true` in `tsconfig.json`
   - Convert all `.jsx` to `.tsx`
   - Add type definitions for API responses (from Zod schemas)
   - Use `tsc --noEmit` in CI to enforce

2. **Component Library (Radix + shadcn/ui)**
   - Replace ad-hoc MUI usage with consistent primitives
   - Build `frontend/src/components/ui/` library:
     - `Button.tsx`, `Card.tsx`, `Dialog.tsx`, `Tooltip.tsx`, etc.
   - Extract design tokens to `tokens.ts`:
     ```typescript
     export const tokens = {
       colors: { primary: '#1e88e5', secondary: '#d4af37', ... },
       spacing: { xs: '4px', sm: '8px', md: '16px', ... },
       typography: { heading: 'Playfair Display', body: 'Inter', ... },
       animation: { fast: '150ms', normal: '300ms', slow: '500ms' }
     };
     ```
   - Document in Storybook (or VitePress)

3. **Map/3D Stack Optimization**
   - **MapLibre GL** (drop Mapbox to avoid licensing)
   - **Deck.gl** for performant layer rendering (heatmaps, arcs, 3D buildings)
   - **WebGPU** fallback for Three.js (detect capability, degrade gracefully)
   - Progressive enhancement: 2D → 2.5D → 3D based on device

4. **State Management**
   - TanStack Query for all API calls (replace axios directly in components)
   - URL-driven state for map (zoom, center, layers, year) → shareable links
   - Zustand for global UI state (sidebar open, theme, user prefs)
   - SSR/SSG for SEO (Vite SSR plugin or migrate to Next.js if needed)

5. **Performance Budget**
   - Initial bundle: <200KB gzipped
   - LCP: <2.0s on 3G
   - Code splitting: Route-based + heavy components (3D viewer, timeline)
   - Image optimization: WebP/AVIF, lazy loading, responsive srcset
   - Font subsetting: Only load needed glyphs for Playfair/Inter

---

### **Backend (Node.js + Express + MongoDB)**

#### Current State
- Express ✅
- MongoDB + Mongoose ✅
- Zod validation (some routes) ✅
- Rate limiting ✅
- Helmet security headers ✅
- OpenTelemetry (partial) ⚠️
- API tests (Jest) ✅

#### Upgrades Needed

1. **Zod Validation Everywhere**
   - Extend `middleware/validate.js` to all routes
   - Define output schemas (not just input):
     ```typescript
     // schemas/zodSchemas.js
     export const LocationResponseSchema = z.object({
       _id: z.string(),
       name: z.string(),
       coordinates: z.tuple([z.number(), z.number()]),
       provenance: ProvenanceSchema,
       ...
     });
     ```
   - Validate responses in tests: `expect(response.body).toMatchSchema(LocationResponseSchema)`

2. **Pagination + Caching**
   - Already implemented ✅
   - Add ETag headers for conditional requests
   - Redis caching for expensive queries (optional, but recommended for <150ms P95)

3. **Provenance Collection**
   - New MongoDB collection: `provenances`
     ```typescript
     {
       entityId: ObjectId,
       entityType: 'location' | 'event' | 'building',
       sources: [{ type: 'book', citation: '...' }, { type: 'url', link: '...' }],
       confidence: 'bronze' | 'silver' | 'gold',
       contributors: ['user123'],
       editHistory: [{ timestamp, user, changes }]
     }
     ```
   - Link to every Location/Event/BuildingSpec document

4. **Observability (Production-Grade)**
   - **Tracing**: OpenTelemetry to all routes (already wired, enable by default)
   - **Logging**: Pino structured logs everywhere
     ```javascript
     logger.info({ userId, locationId, latency }, 'Location fetched');
     ```
   - **Metrics**: Prometheus exporter (`prom-client`)
     - Request rate, latency histogram, error rate
     - Custom: `data_quality_score`, `citation_coverage`
   - **Dashboards**: Grafana (or Datadog/New Relic) with SLO panels
   - **Alerts**: PagerDuty/Opsgenie when P95 latency >300ms or error rate >1%

5. **Security Hardening**
   - CSRF protection (double-submit cookie pattern)
   - Input sanitization (already via Zod, but add DOMPurify for HTML)
   - Rate limits per route (tighter for write endpoints)
   - WAF rules (Cloudflare or AWS WAF) for DDoS protection

6. **Index Optimization**
   - Use `scripts/evaluateIndexes.js` outputs
   - Add compound indexes for common queries:
     ```javascript
     // Locations: geospatial + year range
     db.locations.createIndex({ coordinates: '2dsphere', yearCompleted: 1 });
     // Events: date range + category
     db.events.createIndex({ date: 1, category: 1 });
     ```
   - Monitor with `explain()` in tests

---

### **CI/CD (GitHub Actions + Preview Deploys)**

#### Current State
- `ci.yml`: Backend tests, frontend build ✅
- `deploy-frontend.yml`: Production deploy ✅
- `backend-tests.yml`: Dedicated backend testing ✅

#### Upgrades Needed

1. **Comprehensive Test Matrix**
   ```yaml
   - Lint (ESLint, Prettier)
   - TypeScript check (`tsc --noEmit`)
   - Unit tests (Jest/Vitest) with coverage thresholds
   - Integration tests (API routes with in-memory MongoDB)
   - E2E tests (Playwright: critical user flows)
   - Bundle analysis (fail if >200KB initial)
   - Lighthouse CI (fail if LCP >2.5s or accessibility <90)
   - pa11y-ci (fail on WCAG AA violations)
   - Security scan (npm audit, Snyk)
   ```

2. **Preview Deployments (Per PR)**
   - Vercel/Netlify/Cloudflare Pages: Auto-deploy frontend per PR
   - Railway/Render: Ephemeral backend per PR (or mock API)
   - Comment on PR with preview URL

3. **Synthetic Monitoring**
   - Pingdom/UptimeRobot: Check production /health every 60s
   - Synthetic user flows (Playwright scheduled runs): "Search → view location → export citation"

4. **Feature Flags**
   - LaunchDarkly or simple env vars: `ENABLE_TOUR_BUILDER=false`
   - Deploy features behind flags, enable incrementally

---

### **Docs & Knowledge Management**

1. **Architecture Decision Records (ADRs)**
   - `docs/adr/001-choose-maplibre-over-mapbox.md`
   - Document every major tech choice with rationale

2. **Data Cards (Dataset Provenance)**
   - `data/collected/sanborn-maps/DATACARD.md`
     - Source, collection date, known biases, license, update frequency

3. **Contributor Guide**
   - `CONTRIBUTING.md`: How to submit edits, run tests, coding standards
   - `docs/DATA_COLLECTION_GUIDE.md` ✅ (already exists, expand)

4. **API Reference (OpenAPI)**
   - Already exists ✅ (`backend/openapi.yaml`)
   - Publish to docs site (Swagger UI or Redoc)

---

## 🛣️ Phased Implementation Roadmap

### **Phase 0: Guardrails & Foundations** (Weeks 1-4)
*Goal: Production-ready infrastructure*

#### Week 1-2: Quality Gates
- [ ] **CI Enhancements**
  - Add `pa11y-ci` for accessibility
  - Add Lighthouse CI with budgets (LCP <2.0s, accessibility >90)
  - Add bundle size check (<200KB initial)
  - Enforce TypeScript `strict: true`
  - Add Playwright E2E tests (3 critical flows)

- [ ] **Observability**
  - Enable OpenTelemetry tracing by default
  - Add Pino structured logging to all routes
  - Set up Prometheus exporter + Grafana dashboards
  - Define SLOs: 99.9% uptime, P95 latency <150ms, error rate <0.1%

#### Week 3-4: Design System & Accessibility
- [ ] **Component Library**
  - Extract design tokens to `tokens.ts`
  - Build 10 core components (Button, Card, Dialog, Input, Badge, Tooltip, etc.)
  - Document in Storybook (optional) or VitePress
  - Audit existing pages, replace MUI components incrementally

- [ ] **Accessibility Baseline**
  - Fix all existing WCAG AA violations (run pa11y, axe DevTools)
  - Add keyboard shortcuts guide (`/keyboard`)
  - Test with NVDA, JAWS, VoiceOver
  - Add skip links, landmarks, focus indicators

- [ ] **Provenance Models**
  - Create `backend/models/Provenance.js` Mongoose schema
  - Extend Location/Event/BuildingSpec schemas to include `provenanceId`
  - Seed sample provenance data for 100 locations

---

### **Phase 1: Flagship Experiences** (Weeks 5-12)
*Goal: Deliver "wow" moments*

#### Week 5-7: Layer Composer + Timeline
- [ ] **Layer Composer UI**
  - Build sidebar with layer toggles (fire maps, aerials, crime, culture, zoning)
  - Opacity sliders, reorder layers, save presets
  - URL-encoded state for shareable links
  - Mobile-responsive (bottom sheet on mobile)

- [ ] **City Time Machine**
  - Timeline scrubber component (1880-2025)
  - Preload adjacent year layers for smooth transitions
  - Graceful degradation: 3D → 2D maps → static Sanborn maps
  - Add "decade jump" buttons for quick navigation

- [ ] **Provenance Lens (Beta)**
  - Toggle in header to show/hide provenance badges
  - Badge colors based on source count (bronze/silver/gold)
  - Click badge → modal with full citations
  - "View Original" link to high-res scans

#### Week 8-10: Tour Builder + Cite & Export
- [ ] **Tour Builder MVP**
  - Drag-drop map markers (React Flow or MapLibre Draw)
  - Rich text editor (TipTap) for narratives
  - Audio upload (S3 or Cloudflare R2)
  - Save/publish tours (`backend/routes/tours.js`)
  - Public gallery of featured tours

- [ ] **Cite & Export**
  - Citation.js integration (BibTeX, APA, Chicago, MLA)
  - Permalink generation: `saintpaul.history/cite/loc-12345`
  - Archive hash (SHA-256 + timestamp)
  - Export PDF with inline citations

#### Week 11-12: Performance Tuning
- [ ] **Lighthouse CI Optimization**
  - Image optimization: WebP/AVIF, lazy loading, responsive srcset
  - Code splitting: Route-based + heavy components (3D viewer)
  - Font subsetting: Playfair + Inter (only Latin glyphs)
  - Preload critical assets, defer non-critical scripts

- [ ] **API Optimization**
  - Add Redis caching for expensive queries (building specs, spatial queries)
  - Optimize MongoDB indexes (use `evaluateIndexes.js` outputs)
  - Add ETag headers for conditional requests
  - Tune rate limits per route

---

### **Phase 2: Contribution Pipeline** (Weeks 13-18)
*Goal: Community-powered content*

#### Week 13-15: Contribution Studio
- [ ] **Submission Flow**
  - Build `pages/Contribute.jsx` with react-hook-form + Zod
  - Preflight validation (geocoding check, duplicate detection)
  - Provenance scoring UI (real-time feedback)
  - Photo upload with EXIF extraction

- [ ] **Moderation Queue**
  - Build `pages/Admin.jsx` admin panel
  - Diff view (show what changed)
  - Bulk approve/reject, rollback
  - Contributor reputation scoring

- [ ] **Backend Routes**
  - `POST /api/contributions` (submit)
  - `GET /api/contributions` (list pending, admin-only)
  - `PATCH /api/contributions/:id/approve` (admin)
  - `DELETE /api/contributions/:id/reject` (admin)

#### Week 16-18: Community Launch
- [ ] **Contributor Onboarding**
  - Create video tutorial ("How to add a correction")
  - Sample contribution workflow walkthrough
  - Partner with local historical societies (MNHS, Ramsey County)

- [ ] **Community Campaigns**
  - "Fill the Map": Target underrepresented neighborhoods
  - "Citation Challenge": Add sources to 500 locations
  - Leaderboard with badges (top contributors)

---

### **Phase 3: Performance Excellence** (Weeks 19-24)
*Goal: World-class speed & smoothness*

#### Week 19-21: 3D Reconstructions v2
- [ ] **WebGPU Pipeline**
  - Migrate Three.js to WebGPU backend
  - LOD (Level of Detail): High-poly near, low-poly far
  - Temporal transitions: Morph buildings through time (vertex shaders)
  - Mobile fallback: Detect GPU, degrade to 2D or low-poly

- [ ] **Model Optimization**
  - Compress textures (Basis Universal)
  - Generate LOD meshes (Meshoptimizer)
  - Lazy load GLB models (load only visible buildings)
  - Pre-cache for tours

#### Week 22-24: RUM + Synthetic Monitoring
- [ ] **Real User Monitoring**
  - Add Datadog RUM or Sentry Performance
  - Track Core Web Vitals (LCP, FID, CLS) per page
  - Error tracking with source maps

- [ ] **Synthetic Checks**
  - Playwright scheduled runs (every 15min)
    - Flow 1: Search → view location → export citation
    - Flow 2: Timeline scrub → layer toggle → 3D view
    - Flow 3: Create tour → add stops → publish
  - Alert on failure (PagerDuty)

---

### **Phase 4: Ecosystem & Replication** (Weeks 25-30)
*Goal: Become the reference implementation*

#### Week 25-27: Civic History Schema
- [ ] **Schema Package**
  - Extract Zod schemas to `@saintpaul/civic-schema` npm package
  - Publish to npm with MIT license
  - Document in OpenAPI + JSON Schema
  - Submit to Schema.org (civic history vocabulary)

- [ ] **Starter Kit**
  - Create `create-city-portal` CLI tool (`npx create-city-portal my-city`)
  - Scaffold: Frontend, backend, sample data, deployment configs
  - Include 3 sample datasets (locations, events, buildings)
  - README with customization guide

#### Week 28-30: Documentation & Outreach
- [ ] **Public Launch**
  - Press release: Local media (Pioneer Press, MPR)
  - Academic outreach: MNHS, University of Minnesota
  - Developer community: Post to Hacker News, Reddit r/webdev, r/dataisbeautiful

- [ ] **Documentation Site**
  - Deploy docs to `docs.saintpaul.history` (VitePress or Docusaurus)
  - Sections: User Guide, API Reference, Contributor Guide, Schema Docs
  - Video tutorials, interactive demos

- [ ] **Partnerships**
  - Reach out to other cities: Minneapolis, Duluth, Rochester
  - Offer consulting/setup assistance
  - Co-marketing: "Powered by Saint Paul Portal technology"

---

## 🚀 Immediate Quick Wins (Next 2 Weeks)

### **Week 1: CI + Accessibility**
1. **Add Lighthouse CI**
   ```yaml
   # .github/workflows/lighthouse.yml
   - name: Lighthouse CI
     run: |
       npm install -g @lhci/cli
       lhci autorun --collect.url=http://localhost:3000
   ```
   Set budgets: LCP <2.0s, accessibility >90, performance >85

2. **Add pa11y-ci**
   ```bash
   cd frontend
   npm install --save-dev pa11y-ci
   # Add to package.json
   "test:a11y": "pa11y-ci --sitemap http://localhost:3000/sitemap.xml"
   ```
   Add to GitHub Actions, fail on WCAG AA violations

3. **Fix Keyboard Navigation**
   - Audit all interactive elements (buttons, links, form inputs)
   - Add visible focus indicators (`:focus-visible` styles)
   - Test: Can you navigate entire site with Tab, Enter, Esc, Arrow keys?

### **Week 2: Provenance + Design Tokens**
1. **Build CitationCard Component**
   ```tsx
   // frontend/src/components/ui/CitationCard.tsx
   export const CitationCard = ({ provenance }: { provenance: Provenance }) => (
     <Card>
       <Badge color={provenance.confidence}>{provenance.confidence}</Badge>
       {provenance.sources.map(source => (
         <cite key={source.id}>{source.citation}</cite>
       ))}
       <Button variant="link">View Original</Button>
     </Card>
   );
   ```

2. **Extract Design Tokens**
   ```typescript
   // frontend/src/theme/tokens.ts
   export const tokens = {
     colors: {
       primary: { 500: '#1e88e5', 600: '#1976d2', ... },
       secondary: { 500: '#d4af37', 600: '#c19b2b', ... },
     },
     spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
     typography: {
       heading: 'Playfair Display, Georgia, serif',
       body: 'Inter, Segoe UI, sans-serif',
     },
   };
   ```
   Use in all components, replace magic values

3. **Enable OpenTelemetry by Default**
   ```bash
   # backend/.env
   OTEL_ENABLED=true
   OTEL_SERVICE_NAME=saintpaul-api
   OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318  # Local OTEL collector
   ```
   Set up Grafana dashboard (or use Datadog/Honeycomb free tier)

---

## 📈 What Success Looks Like (6 Months)

- **Adoption**: 10K MAU, 8min avg session, 40% return rate
- **Content**: 5K+ locations, 2K+ events, 50+ 3D models, 95%+ citation coverage
- **Performance**: P95 <2.0s LCP, <150ms API latency, 60fps map interactions
- **Accessibility**: 100% WCAG 2.2 AA, zero critical issues
- **Community**: 100+ verified contributions, 10+ educational partnerships
- **Trust**: 4.5+ star rating from researchers, cited in 5+ academic papers
- **Ecosystem**: 3+ other cities using our starter kit

---

## 💡 Guiding Principles

1. **Truth First**: Never sacrifice accuracy for aesthetics. Every claim cites a source.
2. **Inclusive by Design**: Accessibility and low-bandwidth support are not afterthoughts.
3. **Open by Default**: Publish schemas, release code, share learnings.
4. **Community-Powered**: Residents and researchers co-create the knowledge base.
5. **Performance is UX**: Fast sites are usable sites. Budget every byte, optimize every frame.
6. **Ethical AI**: Transparency, bias acknowledgment, human oversight for generated content.
7. **Build to Last**: Permalinks, archive hashes, standards-based APIs. Future-proof everything.

---

## 🤝 How to Execute (Next Steps)

**Option A: Full Stack Blitz** (Recommended)
1. Set up CI checks (Lighthouse, pa11y, bundle analyzer) — **Week 1**
2. Build design system scaffold (tokens, 10 components) — **Week 1-2**
3. Add provenance models + CitationCard UI — **Week 2**
4. Build Layer Composer + Timeline — **Week 3-4**
5. Launch Contribution Studio (MVP) — **Week 5-6**
6. Optimize performance (3D, caching, images) — **Week 7-8**
7. Document + public launch — **Week 9-10**

**Option B: Incremental (Lower Risk)**
- Tackle Phases 0-1 over 12 weeks (one phase per month)
- Get stakeholder feedback after each phase
- Adjust roadmap based on usage data

**Option C: Community-First**
- Focus on Contribution Studio + moderation pipeline first
- Partner with MNHS/Ramsey County to seed content
- Build flagship features (3D, timeline) in parallel with community growth

---

## 🎤 Final Thought

**What would the best programmer say?**

> "This is already good. The architecture is sound, the data is rich, and the vision is clear. But to lead the world, you need three things: ruthless performance optimization, obsessive accessibility, and transparent provenance. Fix those, and this becomes the reference implementation every other city will clone. That's how you win."

**Let's make it happen.** 🚀

---

*Document Version: 1.0*  
*Last Updated: November 26, 2025*  
*Owner: Saint Paul Historical Portal Team*  
*Next Review: December 10, 2025*
