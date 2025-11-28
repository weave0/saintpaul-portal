# Data Collection Strategy — Comprehensive Content Gathering

> **Goal**: Build the world's most detailed civic history database by systematically harvesting public archives, images, stories, and references.

---

## 🎯 Content Collection Priorities

### **Tier 1: Foundation (Weeks 1-4)**
- Geographic footprint (buildings, streets, parcels)
- Timeline backbone (major events, dates)
- Core provenance (sources for every claim)

### **Tier 2: Depth (Weeks 5-12)**
- Historical photographs (10,000+ images)
- Newspaper archives (stories, ads, notices)
- Oral histories (personal narratives)
- Cultural events (concerts, festivals, protests)

### **Tier 3: Richness (Weeks 13-24)**
- Building biographies (construction, occupants, changes)
- Neighborhood narratives (evolution, demographics)
- Personal stories (user contributions)
- Multimedia (audio tours, video interviews)

---

## 📚 Public Data Sources (API-Accessible)

### **1. Library of Congress**
**APIs**: https://www.loc.gov/apis/

#### A. Sanborn Fire Insurance Maps
- **Collection**: https://www.loc.gov/collections/sanborn-maps/
- **Coverage**: Saint Paul 1884-1950s
- **Detail**: Building footprints, materials, heights, door/window locations
- **Format**: TIFF images, georeferenced

**Harvest Script**: `backend/scripts/gatherLibraryOfCongress.js` (enhance)

#### B. Photographs & Prints
- **Collection**: https://www.loc.gov/pictures/
- **Search**: "Saint Paul Minnesota" historical photos
- **Format**: JPEG/TIFF with metadata (date, photographer, description)

#### C. Chronicling America (Newspapers)
- **API**: https://chroniclingamerica.loc.gov/about/api/
- **Coverage**: 1836-1922 digitized newspapers
- **Search**: Saint Paul newspapers (Pioneer Press, Daily Globe, etc.)
- **Format**: OCR text + page images

---

### **2. Digital Public Library of America (DPLA)**
**API**: https://pro.dp.la/developers/api-documentation

- **Coverage**: Aggregates 4,000+ institutions
- **Minnesota Content**: MNHS, UMN libraries, local historical societies
- **Search**: `q=Saint Paul Minnesota&filter=type:image`
- **Format**: JSON metadata + links to high-res images

**Harvest Script**: Create `gatherDPLA.js`

---

### **3. Minnesota Historical Society (MNHS)**
**Collections**: https://www.mnhs.org/collections

#### A. Gale Family Library Catalog
- **URL**: https://mnhs.ent.sirsi.net/client/en_US/gale/
- **Content**: Photos, maps, manuscripts, oral histories
- **Access**: Many items digitized with Creative Commons licenses

#### B. Minnesota Reflections
- **URL**: http://reflections.mndigital.org/
- **Coverage**: 250,000+ historical photos, documents, maps
- **Search API**: Available via OAI-PMH protocol
- **Format**: High-res images with metadata

**Harvest Script**: `backend/scripts/gatherMNHS.js` (enhance)

---

### **4. University of Minnesota Libraries**

#### A. Digital Conservancy
- **URL**: https://conservancy.umn.edu/
- **Content**: Academic papers, historical photos, oral histories
- **API**: OAI-PMH for metadata harvesting

#### B. Minnesota Historical Aerial Photographs Online (MHAPO)
- **URL**: https://www.lib.umn.edu/apps/mhapo/
- **Coverage**: 1937-present aerial photos
- **Detail**: High-resolution (can identify individual buildings)
- **Access**: Interactive map viewer + download

**Harvest Script**: Create `gatherUMNAerial.js`

---

### **5. National Archives (NARA)**
**API**: https://catalog.archives.gov/api/v1/

- **Search**: "Saint Paul Minnesota" census, military, WPA projects
- **Content**: Census records, architectural surveys, federal projects
- **Format**: PDF, TIFF, metadata JSON

**Harvest Script**: Create `gatherNARA.js`

---

### **6. Wikimedia Commons**
**API**: https://commons.wikimedia.org/w/api.php

- **Search**: `Category:Saint Paul, Minnesota`
- **Content**: 5,000+ historical/modern photos (CC-licensed)
- **Format**: Full resolution + structured metadata
- **Bonus**: User-contributed, often tagged with dates/locations

**Harvest Script**: Create `gatherWikimedia.js`

---

### **7. Internet Archive**
**API**: https://archive.org/services/docs/api/

#### A. Historical Books & Documents
- **Search**: "Saint Paul Minnesota history"
- **Content**: Out-of-copyright books, city directories, yearbooks
- **Format**: PDF, text (OCR), EPUB

#### B. Moving Images & Audio
- **Search**: Newsreels, oral histories, radio broadcasts
- **Format**: MP4, MP3 with metadata

**Harvest Script**: Create `gatherInternetArchive.js`

---

### **8. OpenStreetMap (OSM)**
**API**: https://wiki.openstreetmap.org/wiki/API

- **Current Data**: Building footprints, streets, POIs
- **Historical Tags**: Some buildings tagged with `start_date`, `architect`, `heritage`
- **Format**: GeoJSON, XML

**Harvest Script**: `backend/scripts/gatherOpenStreetMap.js` (exists, enhance)

---

### **9. Newspapers.com / Chronicling America**

#### Chronicling America (Free)
- **API**: https://chroniclingamerica.loc.gov/about/api/
- **Coverage**: 1836-1922
- **Content**: Saint Paul Pioneer Press, Daily Globe, etc.
- **Format**: OCR text + page images (JPEG)

#### Newspapers.com (Subscription)
- **Coverage**: 1900s-1990s
- **Search**: Obituaries, society news, real estate ads, event listings
- **Export**: Article text + metadata

**Harvest Script**: Create `gatherChroniclingAmerica.js`

---

### **10. City of Saint Paul Open Data**
**Portal**: https://information.stpaul.gov/

- **Building Permits**: Historical construction records
- **Zoning Maps**: Changes over time
- **Historic Districts**: NRHP boundaries, local designations
- **Format**: CSV, GeoJSON, Shapefile

**Harvest Script**: Create `gatherCityOpenData.js`

---

## 🛠️ Data Collection Architecture

### **Harvest Pipeline**
```
1. Discover → 2. Download → 3. Extract → 4. Transform → 5. Validate → 6. Store → 7. Link
```

#### 1. **Discover** (API Query)
- Search by keywords: "Saint Paul Minnesota"
- Filter by date range: 1850-2025
- Filter by type: image, text, audio, video

#### 2. **Download** (Throttled)
- Respect rate limits (1-5 req/sec)
- Handle pagination (cursor-based or offset)
- Retry with exponential backoff
- Store raw files in `data/collected/{source}/{year}/`

#### 3. **Extract** (Metadata)
- Parse JSON/XML metadata
- Extract: title, description, date, creator, location, rights
- OCR text from images (Tesseract) if not provided
- EXIF data from photos (GPS, date, camera)

#### 4. **Transform** (Normalize)
- Geocode addresses → lat/lng
- Parse dates → ISO 8601
- Standardize place names (e.g., "St. Paul" → "Saint Paul")
- Extract entities (people, buildings, events) with NER

#### 5. **Validate** (Quality Check)
- Schema validation (Zod)
- Duplicate detection (fuzzy match titles, perceptual hash images)
- Provenance scoring (source quality, citation completeness)
- Flag for manual review if confidence <70%

#### 6. **Store** (MongoDB + S3)
- Metadata → MongoDB collections
- Images/PDFs → S3/Cloudflare R2 (with CDN)
- Full-text search → Elasticsearch (optional)
- Graph relationships → Neo4j (optional, for "people knew people" networks)

#### 7. **Link** (Cross-Reference)
- Match photos to locations (geocoding + computer vision)
- Link newspaper articles to events
- Connect people to buildings (city directories, census)
- Build citation graph (source → entity)

---

## 📊 Target Data Volumes (6 Months)

| Content Type | Target Count | Current | Source Priority |
|--------------|--------------|---------|-----------------|
| **Locations** | 10,000+ | ~500 | Sanborn, OSM, GIS |
| **Historical Events** | 5,000+ | ~200 | Newspapers, MNHS |
| **Photographs** | 20,000+ | ~50 | LOC, DPLA, Wikimedia |
| **Building Specs** | 2,000+ | ~100 | Sanborn, NRHP |
| **Newspaper Articles** | 50,000+ | 0 | Chronicling America |
| **Oral Histories** | 500+ | 0 | MNHS, UMN |
| **Maps** | 1,000+ | ~20 | Sanborn, MHAPO |
| **3D Models** | 100+ | ~10 | Generate from specs |

---

## 🚀 Implementation Plan

### **Phase 1: Image Harvesting (Weeks 1-4)**

#### Week 1: Library of Congress
```bash
# Enhance gatherLibraryOfCongress.js
node backend/scripts/gatherLibraryOfCongress.js --collection sanborn --location "Saint Paul"
node backend/scripts/gatherLibraryOfCongress.js --collection photos --keywords "Saint Paul Minnesota" --date-range 1850-1950
```

**Expected Output**: 1,000+ Sanborn map sheets, 5,000+ historical photos

#### Week 2: DPLA & Wikimedia
```bash
# Create new scripts
node backend/scripts/gatherDPLA.js --query "Saint Paul Minnesota" --type image --limit 10000
node backend/scripts/gatherWikimedia.js --category "Saint Paul, Minnesota" --include-subcategories
```

**Expected Output**: 10,000+ images from regional archives

#### Week 3: MNHS & UMN
```bash
node backend/scripts/gatherMNHS.js --collection reflections --limit 20000
node backend/scripts/gatherUMNAerial.js --year-range 1937-2025 --bounds "44.9,-93.1,45.0,-93.0"
```

**Expected Output**: 20,000+ photos, 500+ aerial images

#### Week 4: Quality Control
- Deduplicate images (perceptual hashing)
- Geocode photo locations (GPT-4 Vision for landmark identification)
- Validate metadata completeness
- Flag duplicates/low-quality for review

---

### **Phase 2: Text Harvesting (Weeks 5-8)**

#### Week 5-6: Newspaper Archives
```bash
# Chronicling America API
node backend/scripts/gatherChroniclingAmerica.js \
  --newspapers "sn83025234,sn83025236" \
  --date-range 1850-1922 \
  --keywords "Saint Paul" \
  --extract-articles
```

**Expected Output**: 50,000+ newspaper articles with OCR text

#### Week 7: Books & Documents
```bash
# Internet Archive
node backend/scripts/gatherInternetArchive.js \
  --query "Saint Paul Minnesota history" \
  --mediatype "texts" \
  --limit 1000
```

**Expected Output**: 1,000+ historical books, city directories, reports

#### Week 8: Structured Data
```bash
# City Open Data + Census
node backend/scripts/gatherCityOpenData.js --datasets "building-permits,historic-districts,zoning"
node backend/scripts/gatherNARA.js --query "Saint Paul Minnesota census" --years "1880,1900,1920,1940"
```

**Expected Output**: 100,000+ building permits, 50,000+ census records

---

### **Phase 3: Enrichment & Linking (Weeks 9-12)**

#### Week 9-10: Entity Extraction
```javascript
// Use GPT-4 or Claude to extract structured data from unstructured text
// Example: Newspaper article → Event + People + Location
const extractEntities = async (articleText) => {
  const prompt = `Extract structured data from this historical article:
  
${articleText}

Return JSON:
{
  "events": [{ "date": "1920-05-15", "description": "...", "location": "..." }],
  "people": [{ "name": "...", "role": "..." }],
  "buildings": [{ "name": "...", "address": "..." }],
  "sources": "Article title, newspaper, date"
}`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
  });
  
  return JSON.parse(response.choices[0].message.content);
};
```

#### Week 11: Cross-Linking
- Match photos to locations (GPS, landmarks, street names)
- Link newspaper articles to events
- Connect people to buildings (city directories)
- Build citation graph

#### Week 12: Provenance Scoring
- Assign confidence scores based on source count
- Cross-reference claims across sources
- Flag conflicts for manual review
- Generate permalinks + archive hashes

---

## 🎨 Advanced Techniques

### **1. Computer Vision for Photos**

#### Landmark Identification
```python
# Use GPT-4 Vision to identify buildings in historical photos
import openai

def identify_landmark(image_url, historical_context):
    response = openai.ChatCompletion.create(
        model="gpt-4-vision-preview",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": f"This is a historical photo from Saint Paul, MN circa {historical_context['year']}. Identify landmarks, street names, or buildings visible. Provide coordinates if recognizable."},
                {"type": "image_url", "image_url": image_url}
            ]
        }]
    )
    return response.choices[0].message.content
```

#### Photo Dating (if not in metadata)
- Analyze: Clothing styles, car models, signage, architecture
- Use GPT-4 Vision: "Estimate the decade this photo was taken based on visible details."

---

### **2. OCR + NER for Text Extraction**

#### Tesseract OCR for Images
```bash
# Extract text from non-OCR'd historical documents
tesseract historical_document.jpg output --oem 3 --psm 6 -l eng
```

#### spaCy NER for Entity Extraction
```python
import spacy
nlp = spacy.load("en_core_web_lg")

def extract_entities(text):
    doc = nlp(text)
    return {
        "people": [ent.text for ent in doc.ents if ent.label_ == "PERSON"],
        "places": [ent.text for ent in doc.ents if ent.label_ == "GPE"],
        "dates": [ent.text for ent in doc.ents if ent.label_ == "DATE"],
        "organizations": [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    }
```

---

### **3. Geolocation Extraction**

#### From Text (Addresses)
```javascript
const geocodeAddress = async (addressText) => {
  // Use Mapbox Geocoding API (handles historical addresses better than Google)
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressText + ', Saint Paul, MN')}.json?access_token=${MAPBOX_TOKEN}`
  );
  const data = await response.json();
  return data.features[0]?.center; // [lng, lat]
};
```

#### From Images (EXIF GPS)
```javascript
const ExifParser = require('exif-parser');

const extractGPS = (imageBuffer) => {
  const parser = ExifParser.create(imageBuffer);
  const result = parser.parse();
  if (result.tags.GPSLatitude && result.tags.GPSLongitude) {
    return {
      lat: result.tags.GPSLatitude,
      lng: result.tags.GPSLongitude,
    };
  }
  return null;
};
```

---

## 📁 File Organization

```
data/
  collected/
    loc/                    # Library of Congress
      sanborn/
        1884/
        1912/
        1950/
      photos/
        metadata.json
        images/
    dpla/                   # Digital Public Library of America
      images/
      metadata.json
    mnhs/                   # Minnesota Historical Society
      reflections/
      oral-histories/
    umn/                    # University of Minnesota
      aerial-photos/
    wikimedia/
      images/
    chronicling-america/    # Newspapers
      articles/
      page-images/
    internet-archive/
      books/
      audio/
  processed/
    locations.json          # Geocoded, validated locations
    events.json             # Extracted events
    photos.json             # Image metadata with locations
    articles.json           # Newspaper articles
  reports/
    harvest-summary.json    # Stats per source
    quality-report.json     # Validation results
```

---

## ✅ Quality Assurance

### **Validation Rules**
1. **Every item has provenance**: Source URL, access date, license
2. **Dates are validated**: Parse to ISO 8601, flag ambiguous (e.g., "circa 1920s")
3. **Locations are geocoded**: Fallback to neighborhood/district if exact address unavailable
4. **Duplicates are flagged**: Perceptual hash for images, fuzzy title match for text
5. **Rights are tracked**: CC0, CC-BY, Public Domain, Fair Use—never assume

### **Manual Review Queue**
- Items with confidence <70%
- Conflicting dates/locations across sources
- Sensitive content (trauma, displacement, discrimination)
- High-value items (unique photos, primary sources)

---

## 🔧 Sample Scripts to Create

### **1. gatherDPLA.js**
```javascript
// Harvest from Digital Public Library of America
const axios = require('axios');
const fs = require('fs');

const DPLA_API_KEY = process.env.DPLA_API_KEY;

async function harvestDPLA(query, limit = 500) {
  const items = [];
  let page = 1;
  
  while (items.length < limit) {
    const response = await axios.get('https://api.dp.la/v2/items', {
      params: {
        api_key: DPLA_API_KEY,
        q: query,
        filter: 'sourceResource.spatial.name:"Saint Paul" OR sourceResource.spatial.state:"Minnesota"',
        page_size: 100,
        page,
      },
    });
    
    items.push(...response.data.docs);
    if (!response.data.docs.length) break;
    page++;
    await sleep(1000); // Rate limiting
  }
  
  fs.writeFileSync('data/collected/dpla/metadata.json', JSON.stringify(items, null, 2));
  console.log(`Harvested ${items.length} items from DPLA`);
}

harvestDPLA('Saint Paul Minnesota', 10000);
```

### **2. gatherChroniclingAmerica.js**
```javascript
// Harvest newspaper articles from Chronicling America
const axios = require('axios');

async function harvestNewspapers(lccn, dateRange, keywords) {
  const articles = [];
  
  for (let year = dateRange.start; year <= dateRange.end; year++) {
    const response = await axios.get(`https://chroniclingamerica.loc.gov/search/pages/results/`, {
      params: {
        lccn,
        dateFilterType: 'yearRange',
        date1: year,
        date2: year,
        andtext: keywords,
        format: 'json',
        rows: 100,
      },
    });
    
    for (const item of response.data.items) {
      // Download OCR text
      const ocrUrl = item.ocr_url || item.pdf_url;
      const ocrText = await axios.get(ocrUrl).then(r => r.data);
      
      articles.push({
        title: item.title,
        date: item.date,
        page: item.page,
        ocrText,
        url: item.url,
        newspaper: item.title,
      });
    }
    
    await sleep(2000); // Be kind to LOC servers
  }
  
  return articles;
}
```

### **3. gatherWikimedia.js**
```javascript
// Harvest from Wikimedia Commons
const axios = require('axios');

async function harvestWikimedia(category, limit = 1000) {
  const images = [];
  let continueToken = null;
  
  while (images.length < limit) {
    const response = await axios.get('https://commons.wikimedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'categorymembers',
        cmtitle: `Category:${category}`,
        cmlimit: 500,
        cmtype: 'file',
        format: 'json',
        ...(continueToken && { cmcontinue: continueToken }),
      },
    });
    
    for (const item of response.data.query.categorymembers) {
      // Get image metadata
      const metaResponse = await axios.get('https://commons.wikimedia.org/w/api.php', {
        params: {
          action: 'query',
          prop: 'imageinfo',
          iiprop: 'url|size|mime|extmetadata',
          titles: item.title,
          format: 'json',
        },
      });
      
      const page = Object.values(metaResponse.data.query.pages)[0];
      images.push({
        title: item.title,
        url: page.imageinfo[0].url,
        metadata: page.imageinfo[0].extmetadata,
      });
    }
    
    continueToken = response.data.continue?.cmcontinue;
    if (!continueToken) break;
  }
  
  return images;
}
```

---

## 🎯 Success Metrics

| Week | Milestone | Target Count |
|------|-----------|--------------|
| 4 | Images harvested | 20,000+ |
| 8 | Newspaper articles extracted | 50,000+ |
| 12 | Locations with photos | 5,000+ |
| 12 | Events with provenance | 3,000+ |
| 12 | Quality score (avg) | >85% |

---

## 🚀 Next Steps

1. **Set up API keys**: LOC, DPLA, Mapbox, OpenAI (for GPT-4 Vision)
2. **Create harvest scripts**: Start with `gatherDPLA.js`, `gatherChroniclingAmerica.js`
3. **Run pilot harvest**: 1,000 items to test pipeline
4. **Validate & iterate**: Check quality, fix issues, scale up
5. **Automate**: Cron jobs to run weekly, catch new digitized content

---

Ready to harvest the world's historical data! 🌍📸
