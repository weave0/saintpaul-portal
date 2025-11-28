# Data Harvesting Scripts — Complete Guide

> **Systematically collect 50,000+ historical images, articles, and documents from public archives**

---

## 🎯 Quick Start

### **1. Get API Keys** (Free)

```bash
# DPLA (Digital Public Library of America)
# Visit: https://pro.dp.la/developers/api-codex
# Register, get API key

# Add to .env
echo "DPLA_API_KEY=your_key_here" >> backend/.env
```

### **2. Run Test Harvest** (500 items, ~5 minutes)

```bash
cd backend

# Test all sources with small limits
node scripts/runMasterHarvest.js --lightweight

# Or test individual sources
node scripts/gatherDPLA.js --limit=100
node scripts/gatherWikimedia.js --limit=100
node scripts/gatherChroniclingAmerica.js --limit=100 --keywords="Saint Paul fire"
```

### **3. Run Full Harvest** (50,000+ items, 2-4 hours)

```bash
# Complete harvest (all sources)
node scripts/runMasterHarvest.js

# Or run sources individually for control
node scripts/gatherDPLA.js --limit=10000
node scripts/gatherChroniclingAmerica.js --limit=50000
node scripts/gatherWikimedia.js --limit=5000
node scripts/gatherInternetArchive.js --limit=1000
```

---

## 📂 Available Harvesters

### **1. gatherDPLA.js** — Digital Public Library of America
**What it does**: Aggregates content from 4,000+ institutions (museums, libraries, archives)

**Content**: Historical photos, maps, documents, audio from MNHS, UMN, local historical societies

**Usage:**
```bash
# Basic usage
node scripts/gatherDPLA.js

# With options
node scripts/gatherDPLA.js \
  --query="Saint Paul Minnesota architecture" \
  --limit=10000 \
  --no-images  # Skip image downloads (metadata only)
```

**Expected Output**: 10,000+ items, including:
- 5,000+ historical photos
- 2,000+ maps
- 1,000+ documents
- Metadata saved to `data/collected/dpla/metadata.json`
- Images saved to `data/collected/dpla/images/`

---

### **2. gatherChroniclingAmerica.js** — Historical Newspapers
**What it does**: Searches digitized newspapers (1836-1922) from Library of Congress

**Content**: Saint Paul Pioneer Press, Daily Globe, Minnesota Pioneer articles with OCR text

**Usage:**
```bash
# Search all Saint Paul newspapers
node scripts/gatherChroniclingAmerica.js

# Search specific topic
node scripts/gatherChroniclingAmerica.js \
  --keywords="fire OR disaster" \
  --start=1880 \
  --end=1920 \
  --limit=10000

# Skip OCR extraction (faster, metadata only)
node scripts/gatherChroniclingAmerica.js --no-ocr
```

**Expected Output**: 50,000+ newspaper pages:
- Full OCR text for searchable articles
- Page images (JPEG)
- Metadata: date, newspaper, page number
- Saved to `data/collected/chronicling-america/`

---

### **3. gatherWikimedia.js** — Wikimedia Commons Images
**What it does**: Harvests CC-licensed/public domain historical photos

**Content**: 5,000+ images from categories like "Saint Paul, Minnesota", "History of Saint Paul"

**Usage:**
```bash
# Category browsing (default)
node scripts/gatherWikimedia.js --limit=5000

# Keyword search
node scripts/gatherWikimedia.js \
  --search \
  --keywords="Saint Paul Cathedral 1920s" \
  --limit=1000

# Metadata only (no downloads)
node scripts/gatherWikimedia.js --no-download
```

**Expected Output**: 5,000+ images:
- High-resolution photos (up to 4000x3000px)
- Complete metadata: date, photographer, license, GPS coords
- Saved to `data/collected/wikimedia/`

---

### **4. gatherInternetArchive.js** — Books, Audio, Video
**What it does**: Searches Internet Archive for historical books, oral histories, newsreels

**Content**: Out-of-copyright books, city directories, audio interviews, historical films

**Usage:**
```bash
# Search all media types
node scripts/gatherInternetArchive.js \
  --query="Saint Paul Minnesota history" \
  --types=texts,audio,movies \
  --limit=1000

# Download files (PDFs, MP3s, MP4s)
node scripts/gatherInternetArchive.js --download

# Search specific collection
node scripts/gatherInternetArchive.js \
  --collection=americana \
  --limit=500
```

**Expected Output**: 1,000+ items:
- PDFs of historical books
- MP3 oral histories
- MP4 newsreels/documentaries
- Saved to `data/collected/internet-archive/`

---

### **5. runMasterHarvest.js** — Run All in Sequence
**What it does**: Orchestrates all harvesters with error handling and reporting

**Usage:**
```bash
# Full harvest (all sources)
node scripts/runMasterHarvest.js

# Lightweight test mode
node scripts/runMasterHarvest.js --lightweight

# Skip specific sources
node scripts/runMasterHarvest.js --skip-newspapers --skip-internet-archive

# Incremental update (for cron jobs)
node scripts/runMasterHarvest.js --incremental
```

**Expected Output**: 
- Complete harvest report: `data/collected/harvest-report.json`
- Totals: 60,000+ items (images, articles, documents)
- Duration: 2-4 hours

---

## 📊 Output Structure

```
data/collected/
├── harvest-report.json          # Master report with stats
├── dpla/
│   ├── metadata.json            # 10,000 items
│   └── images/                  # Downloaded images
├── chronicling-america/
│   ├── articles-metadata.json   # 50,000 newspaper pages
│   └── ocr-text/                # Full text (for search)
├── wikimedia/
│   ├── metadata.json            # 5,000 images
│   └── images/                  # High-res photos
└── internet-archive/
    ├── metadata.json            # 1,000 items
    ├── texts/                   # PDFs
    ├── audio/                   # MP3s
    └── movies/                  # MP4s
```

---

## 🔧 Advanced Features

### **Deduplication**
All scripts auto-detect duplicates using:
- **Images**: Perceptual hashing (pHash)
- **Text**: Fuzzy title matching
- **IDs**: Cross-reference source IDs

### **Metadata Extraction**
```javascript
// Example: Extract structured data from OCR text
const article = {
  title: "Fire Destroys Summit Avenue Mansion",
  date: "1920-05-15",
  entities: {
    people: ["Mayor Smith", "Fire Chief Johnson"],
    places: ["123 Summit Avenue", "Cathedral Hill"],
    events: ["Three-alarm fire"],
  },
  provenance: {
    source: "Saint Paul Globe",
    page: 1,
    confidence: "high",
  },
};
```

### **Geocoding**
```javascript
// Auto-geocode addresses from text
const location = await geocodeAddress("123 Summit Avenue, Saint Paul");
// => { lat: 44.9441, lng: -93.1282 }
```

### **Computer Vision**
```javascript
// Identify landmarks in historical photos (GPT-4 Vision)
const analysis = await identifyLandmark(imageUrl, { year: 1920 });
// => "Minnesota State Capitol, view from southeast, circa 1920"
```

---

## 📅 Recommended Schedule

### **Initial Harvest** (One-Time)
```bash
# Week 1: Images
node scripts/gatherDPLA.js --limit=10000
node scripts/gatherWikimedia.js --limit=5000

# Week 2: Text
node scripts/gatherChroniclingAmerica.js --limit=50000
node scripts/gatherInternetArchive.js --limit=1000

# Week 3: Processing
# - Deduplicate
# - Geocode locations
# - Extract entities
# - Validate provenance
```

### **Incremental Updates** (Weekly Cron)
```bash
# Add to crontab
0 2 * * 0 cd /path/to/backend && node scripts/runMasterHarvest.js --incremental
```

---

## 🎯 Success Metrics

| Source | Target | Timeline | Quality |
|--------|--------|----------|---------|
| **DPLA** | 10,000 items | 2 hours | High (curated institutions) |
| **Chronicling America** | 50,000 pages | 4 hours | High (LOC digitization) |
| **Wikimedia** | 5,000 images | 1 hour | Very High (CC-licensed) |
| **Internet Archive** | 1,000 items | 30 min | Medium-High (varied sources) |
| **Total** | **66,000+ items** | **~8 hours** | **Avg 90%** |

---

## 🚨 Troubleshooting

### **Rate Limiting Errors**
```javascript
// Increase RATE_LIMIT_MS in script
const RATE_LIMIT_MS = 2000; // 2 seconds between requests
```

### **Timeout Errors**
```javascript
// Increase timeout in axios config
axios.get(url, { timeout: 60000 }); // 60 seconds
```

### **Disk Space Issues**
```bash
# Check space before harvest
df -h

# Skip image downloads if low on space
node scripts/gatherDPLA.js --no-images
```

### **API Key Issues**
```bash
# Verify key is set
echo $DPLA_API_KEY

# Test API directly
curl "https://api.dp.la/v2/items?api_key=$DPLA_API_KEY&q=test"
```

---

## 📖 Next Steps After Harvest

1. **Deduplicate**: Remove duplicate images/articles
2. **Validate**: Check metadata completeness (dates, locations, sources)
3. **Geocode**: Convert addresses to lat/lng
4. **Extract Entities**: Pull people, places, events from text (GPT-4/spaCy)
5. **Link**: Connect photos to locations, articles to events
6. **Import**: Load into MongoDB with provenance tracking
7. **Index**: Add to search (Elasticsearch/MeiliSearch)

---

## 🤝 Contributing

Add new sources by creating `gather{SourceName}.js`:

```javascript
async function harvest{SourceName}(options) {
  // 1. Search API
  // 2. Transform to our schema
  // 3. Download media
  // 4. Save metadata
  // 5. Return stats
}

module.exports = { harvest{SourceName} };
```

---

## 📚 Resources

- **DPLA API Docs**: https://pro.dp.la/developers/api-codex
- **Chronicling America API**: https://chroniclingamerica.loc.gov/about/api/
- **Wikimedia API**: https://www.mediawiki.org/wiki/API:Main_page
- **Internet Archive API**: https://archive.org/services/docs/api/

---

**Ready to harvest the world's historical data! 🌍📸**
