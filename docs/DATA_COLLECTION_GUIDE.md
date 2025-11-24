# Data Collection Guide for Saint Paul Historical 3D Viewer

This guide provides step-by-step instructions for collecting and processing historical data from credible public sources.

## 📚 Primary Data Sources

### 1. Sanborn Fire Insurance Maps (HIGHEST PRIORITY)
**URL:** https://www.loc.gov/collections/sanborn-maps/
**What:** Detailed building-by-building maps from 1884-1950s
**Access:** Free digital access via Library of Congress

**How to Access:**
1. Visit: https://www.loc.gov/collections/sanborn-maps/
2. Search for "Saint Paul, Minnesota"
3. Available years for Saint Paul: 1884, 1885, 1897, 1904, 1912, 1917, 1926, 1950
4. Download high-resolution TIFFs (public domain!)

**What You Get:**
- Exact building footprints (dimensions in feet)
- Construction materials (wood, brick, stone, etc.)
- Number of stories
- Roof types (flat, gable, hip, mansard, dome)
- Window and door locations
- Street widths
- Lot boundaries

**Accuracy:** ±0.5-2 meters (extremely high precision!)

---

### 2. Ramsey County GIS Open Data
**URL:** https://www.ramseycounty.us/residents/property/maps-data/gis-data-datasets
**What:** Modern building footprints, parcels, streets, historical boundaries
**Access:** Free download (shapefile, GeoJSON, KML)

**Available Datasets:**
- Building outlines (current, but can backdate using construction year)
- Parcel data (includes year built from tax assessor)
- Street centerlines
- Historical boundaries
- Zoning maps

**How to Use:**
```bash
# Download GeoJSON format
# Filter buildings by construction year
# Cross-reference with Sanborn Maps for validation
```

---

### 3. Minnesota Historical Society (MNHS)
**URL:** https://www.mnhs.org/collections
**What:** Photographs, architectural drawings, city directories
**Access:** Free research, some materials require appointment

**Key Collections:**
- Northwest Architectural Archives (building plans)
- St. Paul City Directories (1849-present)
- Photograph collections (street views, construction photos)
- Tax assessor records

**Contact:** collections@mnhs.org

---

### 4. University of Minnesota Digital Collections
**URL:** https://www.lib.umn.edu/borchert/historical-maps
**What:** Historical maps, aerial photography, urban planning documents

**Aerial Photography Collection:**
- 1937-present (complete coverage of Saint Paul)
- Can identify demolished buildings
- Verify Sanborn Map accuracy

---

### 5. City of Saint Paul Planning & Economic Development
**URL:** https://www.stpaul.gov/departments/planning-economic-development
**What:** Current GIS data, zoning maps, historical preservation records

**Contact:** ped@ci.stpaul.mn.us for historical building data

---

### 6. Saint Paul Heritage Preservation Commission
**URL:** https://www.stpaul.gov/departments/planning-economic-development/heritage-preservation
**What:** Landmark designations, historic district surveys, preservation studies

**Available Data:**
- Complete surveys of historic districts
- Individual landmark research files
- Architectural significance statements

---

## 🔧 Data Processing Workflow

### Step 1: Download Sanborn Maps
```bash
# For each historical year (1884, 1897, 1904, 1912, 1917, 1926, 1950)
# Download all sheets covering downtown Saint Paul
# Typically 20-50 sheets per year
```

### Step 2: Georeference Sanborn Maps
Use QGIS (free) to align historical maps to modern coordinates:

```bash
# Install QGIS
# Open Sanborn Map TIFF
# Add OpenStreetMap basemap
# Use Georeferencer plugin
# Match 10-20 control points (street corners)
# Export as GeoTIFF
```

**Accuracy achieved:** ±2-5 meters after georeferencing

### Step 3: Digitize Building Footprints
```bash
# In QGIS, create new vector layer
# Trace building outlines from georeferenced Sanborn Map
# Add attributes:
#   - name
#   - year_built
#   - material (from Sanborn color codes)
#   - stories (from Sanborn numbers)
#   - dimensions (measure in QGIS)
# Export as GeoJSON
```

### Step 4: Process with Python Script
```python
python processHistoricalData.py
```

### Step 5: Import to 3D Viewer
```bash
# Copy processed JSON to data/historical-snapshots.json
# Restart frontend
# Navigate to /3d-viewer
```

\n### Step 6: Normalize to BuildingSpec Schema
Use the sample format in `data/building-specs-sample.json` and persist each record via the API:

```bash
curl -X POST http://localhost:5000/api/building-specs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minnesota State Capitol",
    "centroid": {"lat": 44.9551, "lon": -93.1022},
    "footprint": [[-93.10245, 44.95525], [-93.10200, 44.95525], [-93.10200, 44.95495], [-93.10245, 44.95495], [-93.10245, 44.95525]],
    "dimensions": {"length_m": 90, "width_m": 75, "area_m2": 6750},
    "height": {"stories": 4, "roofHeight_m": 70, "eaveHeight_m": 28},
    "materials": [{"material": "marble", "percentage": 70}],
    "roof": {"type": "dome"},
    "architecturalStyle": "Beaux-Arts",
    "yearCompleted": 1905,
    "sources": [{"name": "Sanborn Fire Insurance Map", "year": 1905, "type": "map", "confidence": "high"}]
  }'
```

\n### Step 7: Automate Source Ingestion
Two helper scripts are provided:

| Script | Purpose | Output |
|--------|---------|--------|
| `node scripts/ingest_sanborn.js sanborn-index.json` | Fetch Sanborn map item metadata from LOC API | `sanborn-index.json` |
| `node scripts/ingest_nrhp.js nrhp-building-specs.json` | Scrape NRHP listings for Saint Paul & extract style/year | `nrhp-building-specs.json` |

Pipeline suggestion:

1. Run Sanborn ingestion to identify sheets for target year.
2. Download & georeference priority sheets.
3. Digitize footprints → intermediate GeoJSON.
4. Run NRHP ingestion for architectural style / year cross-check.
5. Merge NRHP attributes into digitized footprints (join on name or address heuristic).
6. Export unified specs → POST to `/api/building-specs` or bulk insert script.

\n### Confidence & Versioning
The `BuildingSpec` model includes `sources[]` with per-source confidence and a `revision.version`. Update `revision.notes` whenever geometry or attribution changes. Use `dataQuality.completenessPercent` for tracking progress.


---

## 📊 Data Quality & Confidence Levels

| Source | Time Period | Accuracy | Confidence |
|--------|-------------|----------|------------|
| Sanborn Maps | 1884-1950 | ±2-5m | Very High (90-95%) |
| Ramsey County GIS | 2000-present | ±0.5m | Very High (95%+) |
| Aerial Photos | 1937-present | ±5-10m | High (80-90%) |
| Historical Photos | 1850-present | ±10-50m | Medium (60-80%) |
| City Directories | 1849-present | ±50-100m | Medium-Low (50-70%) |

---

## 🎯 Recommended Priorities

\n### Phase 1: Core Downtown (2-3 months)
**Area:** Wabasha St to Robert St, 4th St to 11th St  
**Years:** 1905, 1950, 2000  
**Buildings:** ~200 major structures  
**Estimated effort:** 80-120 hours

\n### Phase 2: Expanded Downtown (3-4 months)
**Area:** Entire downtown peninsula  
**Years:** 1858, 1895, 1925, 1975  
**Buildings:** ~500 structures  
**Estimated effort:** 150-200 hours

\n### Phase 3: Complete Historical Coverage (6-9 months)
**Area:** All of Saint Paul  
**Years:** All available Sanborn years  
**Buildings:** ~2,000+ structures  
**Estimated effort:** 300-500 hours

---

## 🚀 Quick Start (Pilot Project)

\n### Goal: Create one complete historical snapshot (1905)
**Time Required:** 1-2 weeks  
**Buildings:** 20-30 major landmarks  

**Steps:**
1. Download 1905 Sanborn Maps for downtown (5 hours)
2. Georeference in QGIS (8 hours)
3. Digitize 30 major buildings (15 hours)
4. Process with Python script (2 hours)
5. Test in 3D viewer (2 hours)

Total effort: ~32 hours for complete proof-of-concept.

---

## 📝 Data Standards

\n### Building Record Format
\n```json
{
  "name": "Minnesota State Capitol",
  "location": {
    "type": "Point",
    "coordinates": [-93.1044, 44.9550]
  },
  "built": 1905,
  "material": "limestone",
  "stories": 4,
  "dimensions": {
    "length": 110,
    "width": 67
  },
  "height": 70,
  "roofType": "dome",
  "dataSource": {
    "name": "Sanborn Fire Insurance Map",
    "year": 1905,
    "confidence": "very_high",
    "url": "https://loc.gov/..."
  }
}
```

\n### Coordinate System
**Standard:** WGS 84 (EPSG:4326)  
**Format:** [longitude, latitude]  
**Example:** [-93.1044, 44.9550]

---

## 🤝 Community Contributions

Want to help build this historical database?

**Volunteer Opportunities:**
\n- Digitize buildings from Sanborn Maps (no GIS experience needed!)
- Research building histories
- Validate data accuracy
- Write building descriptions
- Find historical photographs

**Contact:** [Add your contact info]

---

## 📖 Additional Resources

**Books:**
\n- "Saint Paul: The First 150 Years" (excellent building histories)
- "Lost Twin Cities" (identifies demolished structures)

**Online:**
\n- HPC Preservation Awards (well-researched landmark studies)
- Minnesota Digital Library (historical photos)
- Newspapers.com (historical news about buildings)

**Tools:**
\n- QGIS (free GIS software)
- Python + GeoPandas (data processing)
- Mapbox Studio (historical map overlays)

---

## ✅ Achievable Goal

**Yes, you can build a 100% accurate historical 3D viewer!**

The data exists, it's public, it's detailed, and it's achievable. With Sanborn Maps providing building-level precision and modern GIS for validation, you can create the most accurate historical visualization of Saint Paul ever made.

**Next Step:** Download your first Sanborn Map and start the pilot project! 🏛️
