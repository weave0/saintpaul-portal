# Historical Data Sources for Accurate 3D Reconstruction

## Primary Public Data Sources

### 1. **Minnesota Historical Society (MNHS)**
- **URL**: https://www.mnhs.org/
- **Resources**:
  - Architectural drawings and blueprints
  - Historical photographs with detailed views
  - Land survey records
  - Building permits and construction records
  - Oral histories with spatial descriptions

### 2. **Sanborn Fire Insurance Maps**
- **URL**: https://www.loc.gov/collections/sanborn-maps/ (Library of Congress)
- **Coverage**: 1884-1950s for Saint Paul
- **Detail Level**: Building footprints, materials, heights, stories, windows, doors
- **Accuracy**: VERY HIGH - Created for insurance purposes, extremely detailed
- **Access**: Available through Library of Congress, many libraries, MNHS

### 3. **Ramsey County Historical Society**
- **URL**: https://www.rchs.com/
- **Resources**:
  - Local photographs and postcards
  - Property records and deeds
  - Neighborhood histories
  - Architectural surveys

### 4. **City of Saint Paul Open Data Portal**
- **URL**: https://information.stpaul.gov/
- **Resources**:
  - Modern GIS building footprints
  - Street centerlines and infrastructure
  - Zoning maps
  - Historic district boundaries
  - Property information

### 5. **Ramsey County GIS**
- **URL**: https://www.ramseycounty.us/your-government/open-government/research-data
- **Resources**:
  - Parcel data with historical records
  - Building footprints
  - Elevation data (LiDAR)
  - Infrastructure locations

### 6. **Minnesota Historical Aerial Photographs Online (MHAPO)**
- **URL**: https://www.lib.umn.edu/apps/mhapo/
- **Coverage**: 1937-present
- **Detail**: High-resolution aerial photos showing buildings, streets, land use
- **Accuracy**: VERY HIGH for 1940s onward

### 7. **National Register of Historic Places**
- **URL**: https://www.nps.gov/subjects/nationalregister/
- **Resources**:
  - Detailed nomination forms with architectural descriptions
  - Measured drawings
  - Historical context
  - Photographs

### 8. **University of Minnesota Libraries - Borchert Map Library**
- **URL**: https://www.lib.umn.edu/borchert
- **Resources**:
  - Historical city plat maps
  - Panoramic city views (bird's-eye maps)
  - Topographic maps
  - Transit maps

### 9. **Cass Gilbert Society**
- **Resources for State Capitol and other Gilbert buildings**:
  - Original architectural drawings
  - Construction photographs
  - Specifications and materials lists

### 10. **USGS Historical Topographic Map Collection**
- **URL**: https://www.usgs.gov/programs/national-geospatial-program
- **Coverage**: 1884-present
- **Detail**: Elevation, street layout, major buildings

## Methodology for Accurate Reconstruction

### Building Dimensions & Locations
1. **Primary**: Sanborn maps (footprints, materials, stories)
2. **Secondary**: Architectural drawings when available
3. **Tertiary**: Aerial photography for verification
4. **Modern**: GIS parcel data as baseline

### Street Layout & Width
1. **Primary**: Historical plat maps and engineering drawings
2. **Secondary**: Sanborn maps showing street widths
3. **Verification**: Aerial photography
4. **Modern**: GIS street centerline data

### Heights & Elevations
1. **Primary**: Architectural drawings and specifications
2. **Secondary**: Historical photographs (photogrammetry possible)
3. **Tertiary**: Building permits and construction records
4. **Modern**: LiDAR elevation data for existing structures

### Materials & Colors
1. **Primary**: Sanborn maps (materials coded by color)
2. **Secondary**: Architectural specifications
3. **Tertiary**: Historical color photographs (1930s onward)
4. **Quaternary**: Historical descriptions and newspaper accounts

### Timeline Accuracy
- **1841-1890**: Medium confidence - Based on historical accounts, early maps, scattered photographs
- **1890-1920**: High confidence - Sanborn maps, extensive photography, architectural drawings
- **1920-1950**: Very high confidence - Detailed maps, aerial photography, architectural records
- **1950-present**: Extremely high confidence - Aerial photography, satellite imagery, GIS data, extensive documentation

## Specific Datasets to Acquire

### For Downtown Saint Paul Walk-Through:

1. **Sanborn Map Series for Saint Paul**
   - 1884, 1892, 1903, 1917, 1951 editions
   - Available: Library of Congress, MNHS

2. **Bird's Eye View Maps**
   - 1853, 1874, 1888 panoramic views
   - Show relative building heights and spatial relationships
   - Available: Library of Congress, MNHS

3. **City Engineer's Plat Maps**
   - 1850s-present official street surveys
   - Precise measurements and lot dimensions
   - Available: City of Saint Paul archives

4. **Building Permit Records**
   - Construction dates, dimensions, materials
   - Available: City of Saint Paul (partial historical records)

5. **Historical Photograph Collections**
   - MNHS photo collection (100,000+ images)
   - Ramsey County Historical Society
   - Individual building archives

6. **WPA Architecture Survey (1930s)**
   - Detailed architectural surveys from Great Depression
   - Available: MNHS, National Archives

## Technical Implementation Approach

### Phase 1: Base Layer (Street Grid & Parcels)
- Acquire historical plat maps for each time period
- Digitize street centerlines and parcels
- Validate against Sanborn maps

### Phase 2: Building Footprints
- Extract from Sanborn maps (most accurate)
- Cross-reference with aerial photography
- Create 2D polygon layers for each time period

### Phase 3: Height & Volume
- Use Sanborn "stories" data (multiply by ~3.5-4m per floor)
- Architectural drawings for major buildings (exact heights)
- Photogrammetry from historical photos where possible

### Phase 4: Materials & Textures
- Sanborn color codes for materials
- Historical photos for texture references
- Period-appropriate material libraries

### Phase 5: Details & Features
- Windows, doors, architectural elements from photos
- Street furniture from historical images
- Signage from photograph collections

## Accuracy Levels Achievable

**Spatial Accuracy (X, Y coordinates)**:
- 1841-1870: ±10-20 meters
- 1870-1890: ±5-10 meters
- 1890-1950: ±2-5 meters (Sanborn maps)
- 1950-present: ±0.5-1 meter (aerial/GIS)

**Height Accuracy (Z coordinate)**:
- 1841-1890: ±1-2 stories (3-6 meters)
- 1890-1950: ±1 story (3-4 meters) for Sanborn-mapped buildings
- Major landmarks: ±1-2 meters (architectural drawings)
- 1950-present: ±1 meter (aerial surveys, LiDAR)

**Temporal Accuracy**:
- Construction/demolition dates: ±1-5 years for most buildings
- Major landmarks: Exact dates available

## Next Steps

1. Contact MNHS for digital Sanborn map access
2. Request GIS data from Ramsey County and City of Saint Paul
3. Identify key buildings for each time period
4. Create data schema for time-period building database
5. Begin digitization with highest-confidence period (1905-1950)
6. Develop 3D visualization pipeline (Three.js or similar)
7. Create timeline UI for period navigation

## Estimated Effort

- **Data acquisition**: 2-4 weeks (requesting, downloading, organizing)
- **Digitization per time period**: 4-8 weeks (depending on area size)
- **3D model creation**: 2-4 weeks per period
- **Visualization development**: 6-8 weeks
- **Total for 5 time periods, downtown core (1 sq mile)**: 6-9 months

This is absolutely achievable with systematic effort! The data exists and is publicly accessible.
