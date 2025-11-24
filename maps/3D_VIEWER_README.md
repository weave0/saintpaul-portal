# 3D Historical Walk-Through Viewer

## Overview

The 3D Historical Walk-Through Viewer is an interactive, time-traveling visualization of downtown Saint Paul, Minnesota. Users can explore the city's architecture and urban development across different historical periods with **building-level accuracy** based on authoritative historical sources.

## Features

### ✨ Core Capabilities
- **Time Travel:** Navigate through 5+ historical snapshots (1841-2000+)
- **3D Buildings:** Accurate 3D representations with correct materials, heights, and dimensions
- **Interactive Controls:** Rotate, zoom, pan to explore from any angle
- **Historical Timeline:** Slider control to smoothly transition between time periods
- **Building Details:** Click any building to see construction date, materials, architect, and historical significance
- **Data-Driven:** Every building backed by credible historical sources (Sanborn Maps, GIS data, architectural records)

### 🎯 Accuracy Levels
- **1890-1950:** ±2-5 meters (based on Sanborn Fire Insurance Maps)
- **1937-present:** ±0.5-2 meters (based on aerial photography + GIS)
- **Pre-1890:** ±10-50 meters (based on historical photographs and descriptions)
- **2000-present:** ±0.5 meters (based on modern GIS data)

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Deck.gl** - Geospatial data visualization
- **Material UI** - Component library
- **Mapbox GL JS** - Base mapping (optional overlay)

### Data Sources
- **Sanborn Fire Insurance Maps (1884-1950)** - Building footprints, materials, construction details
- **Ramsey County GIS** - Modern building data, parcels, streets
- **Minnesota Historical Society** - Photographs, architectural drawings, records
- **University of Minnesota** - Historical aerial photography, maps
- **City of Saint Paul** - Planning documents, preservation records

## Data Structure

### Historical Snapshot Format
```json
{
  "year": 1905,
  "era": "Gilded Age Peak",
  "description": "Saint Paul at the height of railroad prosperity",
  "population": 197000,
  "buildings": [
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
      "architect": "Cass Gilbert",
      "status": "completed",
      "dataSource": {
        "name": "Sanborn Fire Insurance Map",
        "year": 1905,
        "confidence": "very_high"
      }
    }
  ],
  "streets": [
    {
      "name": "Wabasha Street",
      "coordinates": [[-93.0955, 44.9450], [-93.0955, 44.9550]],
      "width": 12,
      "surface": "cobblestone",
      "established": 1849
    }
  ]
}
```

## Usage

### Starting the Viewer
1. Navigate to `/3d-viewer` in the application
2. Use the timeline slider at the bottom to select a year
3. Click and drag to rotate the view
4. Scroll to zoom in/out
5. Right-click and drag to pan
6. Click any building to see details

### Timeline Controls
- **Slider:** Drag to change years smoothly
- **Quick Jump Chips:** Click any year chip for instant navigation
- **Era Labels:** Shows the historical period name

### Camera Controls
| Action | Control |
|--------|---------|
| Rotate | Left Click + Drag |
| Pan | Right Click + Drag |
| Zoom | Scroll Wheel |
| Reset | Double-click |

### Building Information
Click any building to display:
- **Name:** Official or historical name
- **Built:** Construction year
- **Material:** Primary construction material
- **Stories:** Number of floors
- **Height:** Approximate height in meters
- **Architect:** If known
- **Data Source:** Where the information came from
- **Confidence Level:** Accuracy rating

## Adding New Historical Data

### From Sanborn Maps
1. Download georeferenced Sanborn Map from Library of Congress
2. Digitize building footprints in QGIS
3. Extract attributes (material, stories, dimensions)
4. Run processing script:
```python
python backend/scripts/processHistoricalData.py
```
5. Output goes to `data/historical-snapshots.json`

### From GIS Data
1. Download building data from Ramsey County Open Data
2. Filter by construction year
3. Process with script (includes automated validation)
4. Merge with existing snapshots

### Manual Entry
Edit `data/historical-snapshots.json` directly:
```json
{
  "buildings": [
    {
      "name": "Your Building Name",
      "location": {"type": "Point", "coordinates": [-93.0XX, 44.9XX]},
      "built": 1895,
      "material": "brick",
      "stories": 3,
      "dimensions": {"length": 30, "width": 20},
      "height": 12
    }
  ]
}
```

## Data Quality Guidelines

### Confidence Levels
- **Very High (90-95%):** Sanborn Maps, architectural drawings, modern GIS
- **High (80-90%):** Aerial photography, tax assessor records
- **Medium (60-80%):** Historical photographs, city directories
- **Low (40-60%):** Newspaper descriptions, personal accounts
- **Estimated (<40%):** Educated guesses based on context

### Required vs Optional Fields
**Required:**
- `name`
- `location.coordinates`
- `built` (or `established`)
- `dataSource.name`

**Recommended:**
- `material`
- `stories`
- `dimensions`
- `dataSource.confidence`

**Optional:**
- `architect`
- `roofType`
- `status`
- `significance`

## Performance Optimization

### For Large Datasets
- Use Level of Detail (LOD) system
- Render only visible buildings
- Simplify distant building geometry
- Lazy-load historical snapshots

### Current Limits
- **Buildings per snapshot:** 500-1000 (smooth performance)
- **Total snapshots:** 10-20 (reasonable memory usage)
- **Polygon complexity:** <100 vertices per building

## Future Enhancements

### Planned Features
- [ ] Streetcar/transit line overlays
- [ ] Historical photograph integration (click building → see historic photos)
- [ ] Animated transitions between time periods
- [ ] Walking tour paths with narration
- [ ] Demolished building visualization (ghosted/transparent)
- [ ] Comparison view (side-by-side time periods)
- [ ] VR mode support
- [ ] Mobile AR view (stand on actual location, see historical overlay)

### Data Expansion
- [ ] Complete Sanborn Map coverage (all years)
- [ ] Full downtown area (500+ buildings)
- [ ] Neighborhood expansions
- [ ] Interior building details for major landmarks
- [ ] Seasonal variations (winter vs summer)

## Credits & Data Sources

### Primary Sources
- **Library of Congress** - Sanborn Fire Insurance Maps
- **Ramsey County** - Modern GIS data
- **Minnesota Historical Society** - Photographs and records
- **University of Minnesota** - Historical maps and aerial photography
- **City of Saint Paul** - Planning and preservation records

### Technology
- Built with React, Three.js, and open-source tools
- Hosted on [your hosting platform]
- Map data © OpenStreetMap contributors

## License

**Code:** MIT License  
**Historical Data:** Public domain (see individual sources)  
**Modern GIS Data:** Check Ramsey County terms of use

## Contributing

We welcome contributions! See `docs/DATA_COLLECTION_GUIDE.md` for how to help digitize historical buildings.

**Ways to Contribute:**
1. Digitize buildings from Sanborn Maps
2. Research building histories
3. Validate data accuracy
4. Submit historical photographs
5. Improve 3D models

## Support

**Questions?** Open an issue on GitHub  
**Data questions?** See `docs/DATA_SOURCES.md`  
**Technical issues?** Check the main README.md

---

**This is more than a map—it's a time machine.** 🏛️⏰
