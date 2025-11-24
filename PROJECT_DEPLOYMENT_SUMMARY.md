# 🏛️ St. Paul Historical Knowledge Portal - Project Summary

## Project Vision
A cutting-edge, comprehensive digital portal celebrating St. Paul, Minnesota's rich history and vibrant artistic community. This platform aims to gather, preserve, and present all known historical resources about St. Paul from its founding to 2025, utilizing modern UX/UI design inspired by downtown St. Paul's artistic character.

## ✅ Current Status (November 23, 2025)

### Completed Infrastructure
- ✅ **Git Repository**: Initialized and configured
  - User: Weave0 (brett.l.weaver@gmail.com)
  - Branch: main
  - All current work committed

- ✅ **Project Structure**: Full-stack application
  - Frontend: React + Vite + Material UI + Three.js
  - Backend: Node.js + Express + MongoDB
  - Testing: Jest test suites
  - Documentation: Comprehensive guides

- ✅ **Core Features Implemented**:
  - 3D building viewer (Building3D.jsx)
  - Interactive timeline with historical events
  - Building specifications explorer
  - Insight panels and heatmap overlays
  - RESTful API with pagination and filtering
  - Multiple data ingestion scripts (Sanborn maps, NRHP, modern data)

### New Deployment-Ready Files Created Today

1. **`.gitignore`**: Comprehensive exclusions for Node.js/React/Python
2. **`vercel.json`**: Vercel deployment configuration
3. **`staticwebapp.config.json`**: Azure Static Web Apps configuration
4. **`DEPLOYMENT_GUIDE.md`**: Complete deployment instructions for Azure & Vercel
5. **`DATA_COLLECTION_ROADMAP.md`**: Comprehensive resource gathering plan
6. **`package.json`**: Root workspace configuration with deployment scripts
7. **`frontend/src/theme.js`**: Design system inspired by St. Paul's artistic character
8. **`frontend/src/muiTheme.js`**: Material UI theme integration

## 🎨 Design Philosophy

### Visual Identity
- **Mississippi River Blues**: Primary color palette
- **Art Deco Gold**: Secondary accent (historic St. Paul buildings)
- **Northern Lights**: Aurora-inspired accent colors
- **Typography**: Classic Playfair Display for headings, modern Inter for body
- **Shadows**: Soft, layered depth with Art Deco influences

### UX Principles
- Immersive 3D visualization of historical buildings
- Fluid, artistic transitions and animations
- Multi-sensory storytelling (visual, audio, narrative)
- Accessible to all (multi-language support planned)
- Community-driven content platform

## 📊 Data Collection Strategy

### Immediate Sources (Already Implementing)
1. **Sanborn Fire Insurance Maps** (1880s-1960s)
2. **National Register of Historic Places** (NRHP)
3. **Modern St. Paul building data**

### Comprehensive Sources (Documented in DATA_COLLECTION_ROADMAP.md)

#### Archives & Libraries
- Minnesota Historical Society (500,000+ images)
- Ramsey County Historical Society
- St. Paul Public Library History Department

#### Digital Resources
- Minnesota Digital Newspaper Hub (1849-1922)
- Census data (1850-2020)
- Ramsey County GIS / City Open Data

#### Cultural Institutions
- Minnesota Museum of American Art
- Ordway Center for Performing Arts
- Public Art St. Paul

#### Community Organizations
- 17 District Councils
- Hmong, African American, Latino/Latinx, Native American cultural centers

### Automation Plan (4-Phase Approach)
1. **Phase 1**: API integrations (Weeks 1-4)
2. **Phase 2**: Structured web scraping (Weeks 5-8)
3. **Phase 3**: OCR & document processing (Weeks 9-12)
4. **Phase 4**: Community crowdsourcing (Ongoing)

## 🚀 Deployment Options

### Recommended: Azure Static Web Apps
**Why Azure:**
- Minnesota tech community presence
- Non-profit/educational pricing
- AI/ML services for future features
- Government data compliance

**Architecture:**
```
Frontend: Azure Static Web Apps (React/Vite)
Backend: Azure App Service (Node.js/Express)
Database: Azure Cosmos DB (MongoDB API)
Storage: Azure Blob Storage (images, PDFs)
AI: Azure Cognitive Services (OCR, translation)
```

**Estimated Cost:**
- Free tier initially ($0/month)
- Small scale: $26-114/month
- Scales with traffic

### Alternative: Vercel + MongoDB Atlas
**For Quick MVP:**
- Vercel: Free tier available
- MongoDB Atlas: Free M0 cluster
- Total: $0/month to start
- Fastest deployment path

## 📁 Key Files & Directories

### Configuration
- `package.json` - Root workspace with deployment scripts
- `vercel.json` - Vercel deployment config
- `staticwebapp.config.json` - Azure config
- `.gitignore` - Comprehensive exclusions

### Documentation
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment
- `DATA_COLLECTION_ROADMAP.md` - Comprehensive data sources
- `PAGINATION_GUIDE.md` - API usage guide
- `3D_VIEWER_CHECKLIST.md` - 3D viewer features
- `QUICK_REFERENCE.md` - API quick reference

### Backend (`/backend`)
- `server.js` - Express API server
- `models/` - MongoDB schemas (BuildingSpec, Location, HistoricalEvent, LocationInsight)
- `routes/` - API endpoints (buildingSpecs, locations, history, insights, reconstructions)
- `scripts/` - Data ingestion (Sanborn, NRHP, modern data)

### Frontend (`/frontend`)
- `src/App.jsx` - Main application
- `src/theme.js` - Design system
- `src/muiTheme.js` - Material UI integration
- `src/components/` - Building3D, InsightPanel, HeatmapOverlay, etc.
- `src/pages/` - Home, Map, Timeline, Library, About, HistoricalViewer

### Data (`/data`)
- Sample historical events, locations, building specs
- Enhanced data with insights

## 🎯 Next Steps to Deploy

### Option A: Quick Deploy to Vercel (15 minutes)
```powershell
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variable
vercel env add MONGODB_URI
```

### Option B: Full Azure Deployment (1 hour)
```powershell
# 1. Install Azure CLI
winget install Microsoft.AzureCLI

# 2. Login
az login

# 3. Create resource group
az group create --name stpaul-history-rg --location centralus

# 4. Deploy (see DEPLOYMENT_GUIDE.md for complete steps)
az staticwebapp create --name stpaul-history-portal ...
```

### Option C: Push to GitHub First
```powershell
# Create GitHub repository
gh repo create SaintPaul --public --source=. --remote=origin --push

# Or manually add remote
git remote add origin https://github.com/Weave0/SaintPaul.git
git push -u origin main
```

## 🌟 Cutting-Edge Features

### Already Implemented
- ✅ 3D building visualization with Three.js
- ✅ Interactive timeline slider
- ✅ Building specification explorer with detailed metadata
- ✅ Insight panels with historical analysis
- ✅ Heatmap overlays for data visualization
- ✅ Comprehensive API with pagination, filtering, sorting
- ✅ Multiple data source ingestion pipelines

### Planned Enhancements
- 🔄 Natural language search ("Show me breweries in the 1890s")
- 🔄 AI-powered chatbot historical guide
- 🔄 Augmented reality (AR) mobile view
- 🔄 Multi-language support (Hmong, Spanish, Somali, Dakota)
- 🔄 Community contribution platform
- 🔄 Audio landscapes (historical soundscapes)
- 🔄 360° panoramic historical views
- 🔄 Character-based narrative tours (e.g., F. Scott Fitzgerald)

## 🏙️ St. Paul Context

### Location
Downtown St. Paul, Minnesota - vibrant artistic community

### Project Goal
Create a comprehensive digital archive and interactive portal that:
1. Preserves St. Paul's complete history (founding to 2025)
2. Celebrates the artistic and cultural community
3. Makes history accessible and engaging through modern technology
4. Enables community participation in preservation
5. Serves as educational resource for future generations

### Timeline
- **Today (Nov 23, 2025)**: Git setup, deployment configs, design system
- **Week 1**: Deploy MVP, integrate first 5 data sources
- **Weeks 2-12**: Implement comprehensive data collection
- **Spring 2026**: Public launch event (target)

## 💡 Technical Highlights

### Modern Stack
- **Frontend**: React 18, Vite, Material UI 5, Three.js, React Router
- **Backend**: Node.js 18+, Express, MongoDB, Mongoose
- **Testing**: Jest, React Testing Library
- **Build**: Vite for fast dev and optimized production builds
- **Deployment**: Azure Static Web Apps or Vercel
- **Version Control**: Git with comprehensive .gitignore

### Performance
- Lazy loading of 3D models
- Image optimization and CDN delivery
- API pagination and caching
- Rate limiting for API protection
- Efficient database indexing

### Accessibility
- WCAG 2.1 AA compliance planned
- Screen reader support
- Keyboard navigation
- High contrast modes
- Multi-language support

## 📞 Contact & Contribution

**Developer**: Brett L. Weaver (Weave0)  
**Email**: brett.l.weaver@gmail.com  
**Location**: Downtown St. Paul, MN

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Submit pull request
4. Join community discussions

### Partners (Potential)
- Minnesota Historical Society
- Ramsey County Historical Society
- St. Paul District Councils
- Local artist community
- Educational institutions

## 📜 License
MIT License (open for community collaboration)

---

**Ready to share St. Paul's history with the world! 🎨🏛️📚**

*Last Updated: November 23, 2025*
