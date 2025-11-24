# St. Paul Historical Knowledge Portal - Data Collection Roadmap

## Vision
A comprehensive digital portal capturing the complete history and culture of St. Paul, Minnesota - from its founding to 2025, celebrating the artistic community and preserving knowledge for future generations.

## Comprehensive Data Sources (2025)

### 🏛️ Historical Archives & Libraries

#### Minnesota Historical Society (MNHS)
- **Gale Family Library**: Manuscripts, photographs, maps
- **Collections Online**: https://www.mnhs.org/collections
- **Digital Archives**: Searchable databases of historical documents
- **Oral Histories**: Audio/video recordings
- **Photograph Collections**: 500,000+ images

#### Ramsey County Historical Society
- **Research Center**: Local history collections
- **Digital Collections**: https://www.rchs.com
- **Publications**: Minnesota History magazine
- **Architectural surveys**
- **Cemetery records**

#### St. Paul Public Library - History Department
- **Special Collections**: Local history materials
- **City Directories**: 1850s-present
- **Newspaper archives**
- **Genealogy resources**

### 📰 Newspapers & Publications

#### Digital Newspaper Archives
- **Minnesota Digital Newspaper Hub**: Historic papers (1849-1922)
- **St. Paul Pioneer Press**: Historical archives
- **Minnesota Daily** (University of Minnesota)
- **Hmong Times**: Contemporary community news
- **Twin Cities Daily Planet**: Local journalism

#### Chronicling America
- Library of Congress digital newspaper collection
- Minnesota papers 1836-1922

### 🗺️ Maps & Geographic Data

#### Sanborn Fire Insurance Maps
- **Status**: Already implementing (see ingest_sanborn.js)
- **Coverage**: 1880s-1960s
- **Detail**: Building-by-building information

#### Modern GIS Data
- **Ramsey County GIS**: https://www.ramseycounty.us/your-government/open-data
- **City of St. Paul Open Data**: https://information.stpaul.gov
- **MetroGIS**: Regional data portal
- **Minnesota Geospatial Commons**

#### Historical Maps
- **David Rumsey Map Collection**
- **University of Minnesota Libraries Map Collection**
- **Plat maps & subdivision records**

### 🏗️ Architectural & Building Data

#### National Register of Historic Places (NRHP)
- **Status**: Implementing (see ingest_nrhp.js)
- **Data**: Architectural details, historical significance
- **Coverage**: 200+ St. Paul properties

#### State Historic Preservation Office
- **Surveys**: Architectural inventories
- **Nomination forms**
- **Preservation plans**

#### City of St. Paul Heritage Preservation
- **Local landmarks database**
- **Historic districts information**
- **Building permits (historical)**

### 📊 Census & Demographics

#### U.S. Census Data
- **Decennial Census**: 1850-2020
- **American Community Survey (ACS)**: 2005-present
- **IPUMS**: Integrated historical census microdata
- **Social Explorer**: Mapping census data

#### Minnesota Population Center
- **NHGIS**: Historical geographic data
- **IPUMS USA**: Census microdata

### 🎨 Arts & Culture

#### Walker Art Center & Minneapolis Institute of Art
- **Collections databases**
- **St. Paul artist connections**

#### Ordway Center for the Performing Arts
- **Performance archives**
- **Digital programs**

#### Minnesota Museum of American Art
- **Regional artist database**
- **Exhibition histories**

#### Public Art St. Paul
- **Sculpture & mural database**
- **Artist registry**
- **Forecast Public Art**: Contemporary projects

### 🏘️ Neighborhood & Community

#### District Councils (17 districts)
- Summit Hill, Highland Park, Macalester-Groveland, etc.
- **Meeting minutes**
- **Community plans**
- **Event calendars**

#### Community Organizations
- **Hmong cultural organizations**
- **African American cultural centers**
- **Latino/Latinx organizations**
- **Native American organizations**

### 🏢 Government & Municipal

#### City of St. Paul
- **City Council minutes**: 1850s-present
- **Mayor's office archives**
- **Department records**
- **Building permits & inspections**

#### Ramsey County
- **Property records**
- **Court records**
- **Tax assessor data**

### 🎓 Academic Resources

#### University of Minnesota
- **Immigration History Research Center Archives**
- **Upper Midwest Literary Archives**
- **Labor history collections**

#### Macalester College
- **DeWitt Wallace Library Special Collections**
- **Local history research**

#### Hamline University & St. Thomas
- **Minnesota Legal History Project**
- **Archives & special collections**

### 🚂 Transportation & Infrastructure

#### Minnesota Department of Transportation (MnDOT)
- **Historical engineering records**
- **Bridge & highway documentation**

#### Metropolitan Council
- **Transit history**
- **Regional planning archives**

#### Railroad Museums & Archives
- **Minnesota Transportation Museum**
- **Great Northern Railway records**

### 📖 Digital Libraries & Repositories

#### Digital Public Library of America (DPLA)
- Minnesota partners content

#### HathiTrust Digital Library
- Minnesota published materials

#### Internet Archive
- Books, maps, media about St. Paul

## Data Collection Automation Strategy

### Phase 1: API-Accessible Sources (Weeks 1-4)
```javascript
// Priority APIs to integrate:
- Ramsey County Open Data Portal API
- Minnesota Geospatial Commons API
- Census Bureau API
- Library of Congress API (Chronicling America)
- NRHP API
- OpenStreetMap API (historical data)
```

### Phase 2: Structured Data Scraping (Weeks 5-8)
- MNHS Collections Online (with permission)
- Digital newspaper archives
- City directories
- Public art databases

### Phase 3: OCR & Document Processing (Weeks 9-12)
- Historical document digitization
- Handwritten records (using modern AI OCR)
- Photograph metadata extraction
- Map georeferencing

### Phase 4: Community Crowdsourcing (Ongoing)
- Oral history collection portal
- Photo tagging & identification
- Story submission platform
- Fact verification system

## Technical Implementation

### Data Storage Architecture
```
MongoDB Collections:
- historical_events (timeline data)
- locations (geocoded places)
- buildings (architectural data)
- people (biographical data)
- organizations (institutions)
- artifacts (cultural objects)
- documents (primary sources)
- media (photos, videos, audio)
```

### API Endpoints to Build
```
GET /api/timeline?start=1850&end=2025
GET /api/locations?bounds=[bbox]&year=1920
GET /api/buildings/:id/history
GET /api/search?q=query&filters={}
GET /api/neighborhoods/:name/data
GET /api/people?occupation=architect
```

### Web Scraping Scripts to Create
```python
scripts/
  scrape_mnhs_collections.py
  scrape_newspapers.py
  scrape_city_directories.py
  scrape_rchs_archives.py
  process_census_data.py
```

## UX/UI Design Principles (Downtown St. Paul Artistic Vision)

### Design Inspiration
- **Art Deco elements**: Historic St. Paul architecture
- **Mississippi River**: Flowing, organic shapes
- **Northern Lights**: Color palette inspiration
- **Indigenous patterns**: Respect for Dakota heritage
- **Victorian ornamentation**: Historical detail

### Modern Cutting-Edge Features

#### 3D Visualization
- ✅ Already implementing: Building3D.jsx with Three.js
- WebGL-based city reconstruction
- Time-travel through historical periods
- Augmented reality (AR) view for mobile

#### Interactive Timeline
- ✅ Already implementing: TimelineSlider component
- Multi-layered temporal navigation
- Event clustering & filtering
- Personal timeline creation

#### AI-Powered Features
- Natural language search: "Show me breweries in the 1890s"
- Image recognition for historical photos
- Chatbot historical guide
- Predictive reconstruction suggestions

#### Immersive Storytelling
- Narrative paths through history
- Character-based tours (e.g., "Follow F. Scott Fitzgerald")
- Audio landscapes (historical soundscapes)
- 360° panoramic views

### Accessibility & Inclusion
- Multi-language support (English, Hmong, Spanish, Somali, Dakota)
- Screen reader optimization
- High contrast modes
- Community contribution platform

## Deployment Strategy

### Recommended Platform: **Azure** (Microsoft)
**Reasons:**
- Minnesota tech community presence
- Excellent non-profit/educational pricing
- Strong AI/ML services for future features
- Compliance with government data standards

### Architecture
```
Frontend: Azure Static Web Apps
  - React/Vite application
  - Global CDN
  - Custom domain: stpaulhistory.org (suggested)

Backend: Azure App Service
  - Node.js/Express API
  - Auto-scaling
  - Easy integration with databases

Database: Azure Cosmos DB (MongoDB API)
  - Global distribution
  - High availability
  - Geospatial queries built-in

Storage: Azure Blob Storage
  - Historical images
  - PDF documents
  - Large datasets

AI Services:
  - Azure Cognitive Services (OCR, translation)
  - Azure OpenAI (chatbot, search)

CDN: Azure CDN
  - Fast global delivery
  - Image optimization
```

### Alternative: Vercel + MongoDB Atlas
- Simpler setup for MVP
- Excellent developer experience
- Free tier for initial launch

## Next Steps

### Immediate Actions
1. ✅ Initialize Git repository
2. ✅ Set up .gitignore
3. 🔄 Create deployment configuration files
4. 📝 Document API structure
5. 🎨 Design system & component library
6. 🗄️ Set up production database

### Week 1 Goals
- [ ] Deploy MVP to Azure/Vercel
- [ ] Implement first 5 data source integrations
- [ ] Create data ingestion pipeline
- [ ] Launch beta website

### Community Engagement
- Partner with Ramsey County Historical Society
- Engage with district councils
- Reach out to artist community
- Plan public launch event (Spring 2026?)

## Resources & Links

### Development Tools
- Three.js: https://threejs.org
- Mapbox GL: https://www.mapbox.com
- D3.js: https://d3js.org
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber

### St. Paul Resources
- Visit Saint Paul: https://www.visitsaintpaul.com
- City of St. Paul: https://www.stpaul.gov
- Ramsey County: https://www.ramseycounty.us

---

**Created:** November 23, 2025  
**Project:** St. Paul Historical Knowledge Portal  
**Developer:** Weave0 (Brett L. Weaver)  
**Location:** Downtown St. Paul, MN
