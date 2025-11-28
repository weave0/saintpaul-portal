# Saint Paul Historical Portal — World-Class Excellence Roadmap

> **"What is this?"**  
> The most technically sophisticated, visually stunning, and academically rigorous civic history platform ever built. A blueprint for how cities should tell their stories in the digital age.

> **"What could this become?"**  
> The **global reference implementation** for digital civic heritage — open source, replicable, and setting the standard for performance, accessibility, provenance tracking, and community engagement.

---

## 🎯 Executive Summary

**Current State**: Strong foundation with React 18, MapLibre GL, Deck.gl, Three.js frontend; Node.js/Express backend with MongoDB; 66,000+ historical items ready to harvest from public archives.

**Vision**: Transform this into the **world's best civic history platform** — fast enough to wow, accessible enough to serve everyone, trustworthy enough for academic citation, beautiful enough to inspire pride.

**Timeline**: 30 weeks from "solid project" to "world-leading platform"

**Investment**: Primarily time + attention to craft. Cloud costs minimal (<$50/mo). Open source dependencies.

---

## 🚨 Critical Gaps (Fix These First)

### 1. **Performance: Not Fast Enough to Lead**
**Current State:**
- No bundle size monitoring
- No Lighthouse CI in workflows
- No image optimization pipeline
- 3D scenes load synchronously (blocking)
- MapLibre + Deck.gl + Three.js = heavy initial payload

**World-Class Standard:**
- LCP (Largest Contentful Paint): <2.0s (currently likely 4-6s)
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1
- Bundle size: <200KB initial (code-split aggressive)
- 3D scene loads: <3s to interactive

**How to Fix:**
1. **Lighthouse CI** - Add to `.github/workflows/` with budgets
2. **Bundle Analysis** - `vite-bundle-visualizer`, split routes with React.lazy
3. **Image CDN** - Cloudflare Images or ImageKit for auto-WebP/AVIF
4. **3D Lazy Loading** - Suspend Three.js until viewport intersection
5. **Map Progressive Enhancement** - Load static map tiles first, deck.gl layers after

**Effort**: 3 weeks  
**Impact**: 🔥🔥🔥🔥🔥 (Makes or breaks first impressions)

---

### 2. **Accessibility: Failing Millions of Users**
**Current State:**
- No automated a11y testing
- Unknown WCAG compliance level
- Likely issues: keyboard nav, screen readers, color contrast, focus management
- No `aria-live` regions for dynamic map updates
- 3D viewer probably inaccessible to screen readers

**World-Class Standard:**
- WCAG 2.2 AA: 100% compliance (validated monthly)
- Keyboard nav: Every feature works without mouse
- Screen reader: Full narrative experience with spatial audio cues
- Reduced motion: Respect `prefers-reduced-motion`
- High contrast themes: Auto-switch for low vision

**How to Fix:**
1. **pa11y CI** - Zero critical errors in pipeline
2. **Keyboard Audit** - Tab through entire app, fix focus traps
3. **ARIA Audit** - Add landmarks, labels, live regions
4. **Screen Reader Testing** - NVDA/JAWS scripts for complex interactions
5. **Inclusive 3D** - Audio descriptions for reconstructions
6. **Motion Controls** - Toggle animations globally

**Effort**: 4 weeks  
**Impact**: 🔥🔥🔥🔥🔥 (Legal compliance + ethical obligation + TAM expansion)

---

### 3. **Provenance: Trust is Invisible**
**Current State:**
- Backend has citation tracking (`Provenance.js` model exists!)
- Frontend doesn't surface sources in UI
- No way for users to verify claims
- Academic researchers can't cite with confidence

**World-Class Standard:**
- Every artifact shows source badge (Bronze/Silver/Gold/Platinum)
- One-click citation export (BibTeX, APA, Chicago, MLA)
- Provenance Lens mode: Toggle to see all sources as map overlays
- Permalink + archive hash for long-term citation stability
- Community moderation with transparent edit history

**How to Fix:**
1. **CitationCard Component** - Display sources with confidence scoring
2. **Provenance API** - `/api/locations/:id/provenance` endpoint
3. **Export Modal** - Citation generator with permalink + QR code
4. **Provenance Lens UI** - Map overlay showing source quality heatmap
5. **Edit History Panel** - Public changelog with diffs + rollback

**Effort**: 2 weeks  
**Impact**: 🔥🔥🔥🔥 (Unlocks academic use cases + builds trust)

---

### 4. **Observability: Flying Blind**
**Current State:**
- OpenTelemetry SDK added but not configured
- Pino logging exists, but no centralized aggregation
- No dashboards, SLOs, or alerts
- Can't answer: "What's slow? What's breaking? Who's using it?"

**World-Class Standard:**
- Real-time dashboards: P95 latency, error rates, uptime
- Distributed tracing: API → MongoDB → external APIs
- SLOs defined: 99.9% uptime, <150ms API latency
- Alerts: PagerDuty/Slack for critical issues
- Frontend RUM: Track user flows, rage clicks, performance

**How to Fix:**
1. **OpenTelemetry Config** - Auto-instrument all Express routes
2. **Telemetry Sink** - Honeycomb.io (generous free tier) or Grafana Cloud
3. **Frontend RUM** - Sentry Performance Monitoring
4. **SLO Dashboard** - Grafana with MongoDB metrics + API latency
5. **Alert Rules** - >5% error rate = page, >200ms P95 = warning

**Effort**: 2 weeks  
**Impact**: 🔥🔥🔥🔥 (Essential for production reliability)

---

### 5. **Design System: Inconsistent & Unscalable**
**Current State:**
- `theme.js` exists with good color palette
- But no component library, leading to:
  - Inconsistent spacing (magic numbers everywhere)
  - Re-implemented patterns (buttons, cards, modals)
  - Hard to maintain, impossible to theme consistently

**World-Class Standard:**
- Design tokens: `tokens.ts` with semantic naming (`color.brand.primary`, `spacing.xl`)
- Component library: 30+ composable UI primitives (Button, Card, Modal, etc.)
- Storybook: Visual testing + documentation
- Theme switching: Light/dark/high-contrast with CSS vars
- Motion design: Consistent easing curves + duration

**How to Fix:**
1. **Extract Tokens** - `theme/tokens.ts` with exhaustive design vars
2. **Build UI Library** - `components/ui/` with Radix primitives
3. **Storybook Setup** - Document all components with examples
4. **Theme Provider** - CSS vars + context for runtime switching
5. **Motion System** - Framer Motion presets for all animations

**Effort**: 3 weeks  
**Impact**: 🔥🔥🔥🔥 (Unlocks rapid feature development)

---

### 6. **Community Contribution: Missing Entirely**
**Current State:**
- No way for public to submit corrections, photos, stories
- Expertise locked out (local historians, genealogists, residents)
- Data becomes stale over time

**World-Class Standard:**
- Contribution Studio: Guided forms for adding/editing content
- Real-time validation: Zod schemas with helpful error messages
- Moderation queue: Review → Approve → Publish with attribution
- Contributor profiles: Badges, leaderboards, thank-you wall
- Provenance scoring: Auto-score submissions (encourages quality)

**How to Fix:**
1. **Contribute Page** - `/contribute` with form wizard
2. **Contribution API** - POST `/api/contributions` with moderation status
3. **Moderation Panel** - `/admin/moderate` with diff viewer + approve/reject
4. **Email Notifications** - Notify on submission/approval via SendGrid
5. **Public Changelog** - `/changelog` showing all approved edits

**Effort**: 4 weeks  
**Impact**: 🔥🔥🔥🔥🔥 (Turns users into co-creators, data stays fresh)

---

## 🌟 Flagship Features (The "Wow" Moments)

### 1. **3D Time Machine** (Reconstructions v2.0)
**What It Is:**
Flythrough of Saint Paul at any decade (1850 → 2025) with photorealistic buildings, street-level POV, and ambient audio (horse hooves in 1890, trolley bells in 1920, cars in 1960).

**Technical Approach:**
- Three.js + React Three Fiber for 3D engine
- Procedural generation for missing buildings (style-matched)
- LoD (Level of Detail) system: Low-poly distant, high-poly close
- Audio spatialization: Howler.js with positional audio
- Timeline scrubber: Smooth transitions with CSS + WebGL shaders

**Data Requirements:**
- 500+ building models (50 handcrafted, 450 procedural)
- Historical audio clips (public domain)
- Year-by-year building inventory from Sanborn maps

**Timeline**: 8 weeks  
**Impact**: 🔥🔥🔥🔥🔥 (Viral potential, press coverage, educational gold)

---

### 2. **Layer Composer** (GIS for Everyone)
**What It Is:**
Photoshop-style layer panel for stacking historical maps, zoning data, demographic changes, crime records, cultural events. Drag to reorder, slider for opacity, toggle visibility. Export as shareable "layer recipes."

**Technical Approach:**
- MapLibre GL custom controls
- Layer config stored as JSON (shareable URLs)
- Deck.gl for vector overlays (GeoJSON → WebGL)
- Export: PNG, GeoTIFF, PDF with legend
- Saved layer sets: User accounts with cloud sync

**Data Requirements:**
- 20+ layer types: Sanborn maps, aerial photos, NRHP boundaries, zoning, parcels, crime heatmaps
- Historical basemaps: Georeferenced TIFFs for each decade

**Timeline**: 4 weeks  
**Impact**: 🔥🔥🔥🔥 (Power users love it, planners use it, educators assign it)

---

### 3. **Provenance Lens** (Trust Visualized)
**What It Is:**
Toggle to see source quality as a heatmap. Green = platinum sources (archives, peer-reviewed), yellow = silver (newspapers, books), red = bronze (unverified). Click any area to see citations, download originals, verify claims.

**Technical Approach:**
- Source confidence: Calculated backend (algorithm in `Provenance.js`)
- Heatmap rendering: Deck.gl HexagonLayer with color scale
- Citation modal: React Portal with BibTeX/APA export
- Archive integration: Link to Archive.org/DPLA originals
- Permalink generation: SHA-256 hash for citation stability

**Data Requirements:**
- Provenance records: Link every location/event to sources
- Citation metadata: Author, year, publisher, DOI/URL
- Archive snapshots: Store PDFs/images for posterity

**Timeline**: 2 weeks  
**Impact**: 🔥🔥🔥🔥🔥 (Academics will cite this forever)

---

### 4. **Tour Builder** (Educator's Dream)
**What It Is:**
Drag-drop map markers to create walking/driving tours. Add narratives, upload audio, embed photos/videos, insert quiz questions. Publish with QR code for on-site use. Students follow on phones with GPS-triggered content.

**Technical Approach:**
- Tour editor: React DnD + Mapbox draw controls
- Rich text: TipTap editor with markdown export
- Audio recording: MediaRecorder API or TTS (Eleven Labs)
- QR codes: `qrcode.react` with embedded tour JSON
- GPS triggers: Geofence alerts via Geolocation API
- Offline mode: Service Worker caches tour assets

**Data Requirements:**
- Tour schema: Stops (coordinates + content + media)
- Audio files: MP3 storage (S3/R2)
- Quiz questions: Multiple choice + free response

**Timeline**: 5 weeks  
**Impact**: 🔥🔥🔥🔥🔥 (Schools adopt en masse, tourism boost)

---

### 5. **Cite & Export** (Academic Integration)
**What It Is:**
One-click export of any view (map region, timeline segment, building set) as publication-ready assets: citation-included PDFs, CSV datasets, GeoJSON for ArcGIS, BibTeX for LaTeX.

**Technical Approach:**
- Export modal: Format selector (PDF, CSV, GeoJSON, BibTeX)
- PDF generation: Puppeteer renders view + metadata
- Citation embed: QR code + permalink in footer
- Archive hash: SHA-256 of data for long-term stability
- API endpoint: `/api/export?type=pdf&view=...`

**Data Requirements:**
- Metadata completeness: 95%+ coverage for citations
- Permalink service: Short URLs with redirect

**Timeline**: 2 weeks  
**Impact**: 🔥🔥🔥🔥 (Drives academic adoption + SEO)

---

### 6. **Contribution Studio** (Crowdsourced Excellence)
**What It Is:**
Public form wizard for submitting corrections, new photos, stories, building details. Real-time validation with Zod. Provenance scoring shows quality before submission. Moderation queue with diff view for admins.

**Technical Approach:**
- Form wizard: Multi-step with progress bar
- Validation: Zod schemas with helpful error messages
- Media upload: Direct to S3/R2 with presigned URLs
- Provenance scoring: Real-time feedback (bronze → platinum)
- Moderation panel: Approve/reject with diff highlighting
- Email notifications: SendGrid on submission/approval

**Data Requirements:**
- Contribution schema: `backend/models/Contribution.js`
- User accounts: OAuth (Google/GitHub) for attribution
- Moderation logs: Audit trail for transparency

**Timeline**: 4 weeks  
**Impact**: 🔥🔥🔥🔥🔥 (Turns passive users into active contributors)

---

## 🏗️ Architecture Upgrades (Under the Hood)

### 1. **Edge-Native Infrastructure**
**Current**: Traditional server-client architecture  
**Upgrade**: Deploy to Cloudflare Workers (backend) + Pages (frontend)

**Benefits:**
- <50ms latency worldwide (vs 200ms+ single-region)
- Auto-scaling to millions of requests
- DDoS protection included
- $0 egress costs

**Migration:**
- Backend: Refactor to Hono.js (lightweight Express alternative for Workers)
- Database: Add Cloudflare D1 (SQLite) for metadata caching
- MongoDB: Keep as primary, D1 as read replica
- Images: Cloudflare Images ($5/month for transforms)

**Timeline**: 3 weeks  
**Cost**: ~$20/month (vs ~$100+ traditional cloud)

---

### 2. **Real-Time Collaboration**
**Current**: Static data, no live updates  
**Upgrade**: WebSocket connections for live editing, chat, tour co-creation

**Features:**
- Live cursors: See other users exploring the map
- Collaborative tours: Build together in real-time
- Chat overlay: Ask questions, share discoveries
- Presence indicators: Show active users on timeline

**Technical Stack:**
- Cloudflare Durable Objects or Pusher for WebSockets
- Optimistic updates: Y.js for CRDT-based collaboration
- Conflict resolution: Last-write-wins with undo buffer

**Timeline**: 4 weeks  
**Impact**: 🔥🔥🔥 (Social = viral growth)

---

### 3. **AI-Powered Enrichment**
**Current**: Manual data entry, limited entity extraction  
**Upgrade**: GPT-4 Vision + Claude for auto-tagging, OCR improvement, narrative generation

**Use Cases:**
- Photo analysis: "Identify buildings/people/events in this 1920 photo"
- OCR enhancement: Fix Chronicling America text errors
- Auto-summaries: Generate neighborhood narratives from events
- Entity linking: Connect mentions across documents

**Technical Approach:**
- Batch processing: Queue jobs via BullMQ
- Cost control: $0.01/image for GPT-4V, $50/month budget
- Human verification: Flag low-confidence results for review
- Provenance: Mark AI-generated content explicitly

**Timeline**: 3 weeks  
**Cost**: ~$50/month for 5,000 images

---

### 4. **Search That Doesn't Suck**
**Current**: MongoDB text search (basic, slow)  
**Upgrade**: Typesense or MeiliSearch for instant, typo-tolerant, faceted search

**Features:**
- <50ms search latency
- Typo tolerance: "catherdral" → "cathedral"
- Faceted filters: Year ranges, building styles, neighborhoods
- Geo-search: "Find buildings within 1 mile of Summit Ave"
- Voice search: Whisper API for accessibility

**Technical Stack:**
- Typesense Cloud ($0.03/hour = ~$22/month)
- Sync from MongoDB: Change streams → Typesense indexer
- Frontend: InstantSearch.js or custom React hooks

**Timeline**: 2 weeks  
**Cost**: ~$22/month

---

### 5. **Offline-First PWA**
**Current**: Requires internet connection  
**Upgrade**: Service Worker caching for offline map tiles, pre-downloaded tours

**Features:**
- Offline map: Cache tiles for selected neighborhoods
- Downloaded tours: Pre-bundle audio + images
- Sync on reconnect: Queue edits, sync when online
- Installation: Add to home screen (iOS/Android)

**Technical Approach:**
- Workbox: Service Worker generation
- IndexedDB: Local storage for map tiles + metadata
- Background sync: Queue API calls for later
- App manifest: PWA installation prompts

**Timeline**: 2 weeks  
**Impact**: 🔥🔥🔥 (Field trips, tourists in low-signal areas)

---

## 📊 Success Metrics (KPIs That Matter)

### **Adoption & Engagement**
- **Monthly Active Users**: 10K by Month 6, 50K by Month 12
- **Session Duration**: >8 minutes (vs <3 min typical)
- **Return Rate**: 40% monthly (vs 15% industry avg)
- **Engagement Depth**: 5+ interactions/session (map zoom, timeline scrub, layer toggle)

### **Performance (Core Web Vitals)**
- **LCP**: <2.0s (currently ~5s)
- **FID**: <100ms
- **CLS**: <0.1
- **TTFB**: <200ms (edge caching)
- **3D Load**: <3s to first render

### **Accessibility**
- **WCAG 2.2 AA**: 100% compliance
- **Keyboard nav**: Every feature accessible
- **Screen reader**: Zero critical axe/pa11y issues
- **High contrast**: Readable at 7:1 contrast ratio

### **Trust & Provenance**
- **Citation Coverage**: 95%+ of content
- **Source Quality**: 60% silver+, 20% gold+, 5% platinum
- **Academic Citations**: Track via Google Scholar
- **Edit Transparency**: Public changelog with diffs

### **Community**
- **Contributions**: 100 verified edits in Year 1
- **Contributors**: 50 active (2+ submissions)
- **Moderation SLA**: <48hr review time
- **Contributor Retention**: 60% make 2+ edits

### **Technical Health**
- **Uptime**: 99.9% SLA
- **Error Rate**: <0.1% of requests
- **API Latency**: <150ms P95
- **Build Time**: <5min (CI/CD)
- **Deployment Frequency**: Daily (automated)

---

## 🗓️ 30-Week Implementation Roadmap

### **Phase 0: Guardrails (Weeks 1-4)**
*Prevent future technical debt*

- **Week 1-2: Performance Infrastructure**
  - Add Lighthouse CI with budgets (LCP <2.5s, bundle <300KB)
  - Bundle analyzer in CI
  - Vite config: Code splitting, tree shaking
  - Image optimization pipeline (Sharp + WebP)

- **Week 3-4: Accessibility Foundation**
  - pa11y-ci in GitHub Actions (zero critical errors)
  - Keyboard navigation audit + fixes
  - ARIA landmarks + labels
  - Color contrast audit (WCAG AA)

**Deliverables:** CI passes, no accessibility blockers, <3s LCP

---

### **Phase 1: Flagship Features (Weeks 5-14)**
*The "wow" that drives adoption*

- **Week 5-7: Provenance Lens**
  - CitationCard component
  - Provenance API endpoint
  - Heatmap overlay (Deck.gl)
  - Citation export (BibTeX/APA)

- **Week 8-10: Layer Composer**
  - Layer panel UI
  - MapLibre custom controls
  - Deck.gl layer management
  - Export to PNG/GeoTIFF

- **Week 11-14: Tour Builder**
  - Tour editor with DnD
  - Audio recording/upload
  - GPS triggers
  - QR code generation
  - Offline caching

**Deliverables:** 3 flagship features shipped, user testing complete

---

### **Phase 2: Community Contribution (Weeks 15-19)**
*Turn users into co-creators*

- **Week 15-16: Contribution Forms**
  - Multi-step wizard
  - Zod validation with helpful errors
  - Image/document upload (S3/R2)

- **Week 17-18: Moderation System**
  - Admin panel with diff viewer
  - Approve/reject workflow
  - Email notifications (SendGrid)

- **Week 19: Public Changelog**
  - Edit history timeline
  - Diff highlighting
  - Contributor attribution

**Deliverables:** First 10 community contributions approved

---

### **Phase 3: Architecture Upgrades (Weeks 20-25)**
*World-class infrastructure*

- **Week 20-21: Edge Deployment**
  - Migrate to Cloudflare Workers + Pages
  - D1 caching layer
  - Cloudflare Images

- **Week 22-23: Search Overhaul**
  - Typesense integration
  - MongoDB → Typesense sync
  - InstantSearch UI

- **Week 24-25: Observability**
  - OpenTelemetry full config
  - Honeycomb dashboards
  - SLOs + alerts
  - Sentry RUM

**Deliverables:** <50ms search, 99.9% uptime, full observability

---

### **Phase 4: AI & Scale (Weeks 26-30)**
*Future-proof the platform*

- **Week 26-27: AI Enrichment**
  - GPT-4V photo analysis pipeline
  - OCR enhancement batch jobs
  - Auto-generated summaries

- **Week 28-29: 3D Time Machine**
  - Procedural building generation
  - Timeline flythrough
  - Ambient audio system

- **Week 30: Polish & Launch**
  - Bug bash
  - Performance tuning
  - Press kit
  - Public beta

**Deliverables:** World-class platform, ready for global launch

---

## 🎨 Design Philosophy (Leading with Craft)

### **Motion Design**
- Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)` (Material Design standard)
- Duration: 150ms (micro), 300ms (standard), 600ms (emphasis)
- Respect `prefers-reduced-motion`
- Purposeful animation: Guide attention, provide feedback, delight

### **Color Psychology**
- **Primary (Mississippi Blue)**: Trust, history, depth
- **Secondary (Art Deco Gold)**: Excellence, heritage, warmth
- **Accent (Aurora)**: Discovery, insight, future
- **Historic (Sepia)**: Authenticity, nostalgia, context

### **Typography Hierarchy**
- **Headings**: Playfair Display (editorial, timeless)
- **Body**: Inter (readable, modern)
- **Mono**: JetBrains Mono (code, data)
- **Historic Quotes**: Crimson Text (period-appropriate)

### **Spatial Design**
- 8px grid system (consistent spacing)
- Golden ratio (1.618) for major layout divisions
- Z-axis layering: Content → Controls → Modals → Tooltips
- Negative space: Breathe, don't cram

---

## 🚀 Go-to-Market Strategy

### **Target Audiences**
1. **Educators** (K-12, college): Pre-built lesson plans, tour templates
2. **Researchers** (historians, genealogists): Citation tools, export features
3. **City Planners** (NRHP, zoning): GIS data, impact analysis
4. **Residents** (neighborhood pride): "My street" feature, stories
5. **Tourists** (visitors): Walking tours, QR codes at landmarks

### **Launch Plan**
1. **Beta (Month 1)**: 100 invited users, feedback loops
2. **Soft Launch (Month 2)**: Local press, neighborhood associations
3. **Public Launch (Month 3)**: National press, HN front page, Product Hunt
4. **Partnerships (Month 4-6)**: MNHS, UMN, Saint Paul Public Library

### **Growth Tactics**
- **SEO**: Rich snippets, schema.org markup, sitemap
- **Social Proof**: Testimonials from historians, educators
- **Content Marketing**: Blog posts on data collection, historic finds
- **Community Events**: Monthly "History Hack Nights" (virtual)

---

## 💰 Cost Model (Surprisingly Cheap)

### **Infrastructure** (~$50/month)
- Cloudflare Workers: $5/month (1M requests)
- Cloudflare Images: $5/month (100K transforms)
- MongoDB Atlas: $0 (free tier, 512MB)
- Typesense Cloud: $22/month
- Domain + DNS: $12/year
- Backups: $10/month (B2)

### **AI & APIs** (~$50/month)
- GPT-4 Vision: $50/month (5K images)
- SendGrid: $0 (free tier, 100 emails/day)
- Mapbox: $0 (free tier, 50K views)

### **Development Tools** (Free)
- GitHub Actions: 2,000 min/month (free)
- Vercel Preview: Unlimited (OSS)
- Sentry: Free tier (5K events)

**Total**: ~$100/month for world-class platform

---

## 🏆 What Success Looks Like

**6 Months:**
- 10K monthly users
- 500+ community contributions
- Featured in local press (Star Tribune, MPR)
- Adopted by 5+ schools

**12 Months:**
- 50K monthly users
- 5,000+ community contributions
- Academic citations in published papers
- National press (NYT, Smithsonian Mag)
- Cloned by 3+ other cities

**24 Months:**
- 200K monthly users
- GitHub repo: 5K+ stars
- Conference talks (NICAR, Museums & Web)
- Grant funding (NEH, Knight Foundation)
- De facto standard for civic digital archives

---

## 🎯 Next 48 Hours (Action Items)

1. **Add Lighthouse CI** (2 hours)
   ```yaml
   # .github/workflows/lighthouse.yml
   - run: npm run build
   - uses: treosh/lighthouse-ci-action@v9
     with:
       budgets: '{"performance": 90, "accessibility": 100}'
   ```

2. **Add pa11y-ci** (2 hours)
   ```yaml
   # .github/workflows/accessibility.yml
   - run: npx pa11y-ci --threshold 0
   ```

3. **Create Design Tokens** (4 hours)
   ```typescript
   // frontend/src/theme/tokens.ts
   export const tokens = {
     color: {
       brand: { primary: '#1a4d7d', secondary: '#c8102e' },
       semantic: { success: '#4caf50', error: '#f44336' }
     },
     spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }
   }
   ```

4. **Build CitationCard Component** (4 hours)
   ```jsx
   // frontend/src/components/ui/CitationCard.jsx
   export function CitationCard({ source, confidence }) {
     return (
       <Card>
         <ConfidenceBadge level={confidence} />
         <SourceLink href={source.url} />
         <ExportButton formats={['bibtex', 'apa']} />
       </Card>
     )
   }
   ```

5. **Add Bundle Size Check** (1 hour)
   ```yaml
   # .github/workflows/bundle-size.yml
   - run: npm run build
   - uses: andresz1/size-limit-action@v1
   ```

---

## 🌍 Vision Statement

**We're not just building a website.**

We're creating a **time machine** that lets you walk Saint Paul's streets in 1890.  
We're building a **trust engine** that makes history verifiable and citable.  
We're designing an **education platform** that makes learning irresistible.  
We're architecting a **community tool** that lets everyone contribute their expertise.

**And we're doing it with such craft that it becomes the blueprint for every city on Earth.**

This is how you lead the world. 🚀

---

**Document Version**: 1.0  
**Date**: November 26, 2025  
**Status**: Ready for execution  
**Next Review**: Weekly sprint planning

