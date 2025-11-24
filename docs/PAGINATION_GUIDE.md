# BuildingSpec API Pagination & Filtering Guide

## Quick Reference

### Basic Pagination

```bash
# Get first page (20 results)
curl "http://localhost:5000/api/building-specs?page=1&limit=20"

# Get second page
curl "http://localhost:5000/api/building-specs?page=2&limit=20"

# Get 100 results per page
curl "http://localhost:5000/api/building-specs?limit=100"
```

### Response Format

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Cathedral of Saint Paul",
      "architecturalStyle": "Beaux-Arts",
      "yearCompleted": 1915,
      "centroid": { "lat": 44.9463, "lon": -93.1099 },
      "height": { "stories": 5, "roofHeight_m": 61 },
      "status": "existing"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 243,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering Examples

### By Year Range

```bash
# Buildings from 1890-1920
curl "http://localhost:5000/api/building-specs?yearMin=1890&yearMax=1920"

# Buildings before 1900 (deprecated, use yearMax)
curl "http://localhost:5000/api/building-specs?beforeYear=1900"
```

### By Architectural Style

```bash
# Case-insensitive regex match
curl "http://localhost:5000/api/building-specs?style=gothic"
curl "http://localhost:5000/api/building-specs?style=beaux-arts"
```

### By Status

```bash
# Only existing buildings
curl "http://localhost:5000/api/building-specs?status=existing"

# Only demolished buildings
curl "http://localhost:5000/api/building-specs?status=demolished"
```

### By Physical Characteristics

```bash
# 5-story buildings
curl "http://localhost:5000/api/building-specs?stories=5"

# Buildings with limestone
curl "http://localhost:5000/api/building-specs?materialType=limestone"

# Buildings with gable roofs
curl "http://localhost:5000/api/building-specs?roofType=gable"
```

### By Architect or Name

```bash
# Find buildings by architect
curl "http://localhost:5000/api/building-specs?architect=Cass+Gilbert"

# Search building names
curl "http://localhost:5000/api/building-specs?name=Cathedral"
```

### Combined Filters

```bash
# Complex query: Beaux-Arts buildings from 1900-1920, existing only, 5+ stories
curl "http://localhost:5000/api/building-specs?style=beaux-arts&yearMin=1900&yearMax=1920&status=existing&page=1&limit=50"
```

## Spatial Queries

### Proximity Filter

```bash
# Buildings within 500m of a point (lat, lon)
curl "http://localhost:5000/api/building-specs?nearLat=44.9537&nearLon=-93.0900&radiusMeters=500"
```

### Bounding Box

```bash
# Buildings within a rectangle (minLon,minLat,maxLon,maxLat)
curl "http://localhost:5000/api/building-specs?bbox=-93.11,44.94,-93.09,44.96"
```

## Sorting

```bash
# Sort by year ascending, then name
curl "http://localhost:5000/api/building-specs?sort=yearCompleted,name"

# Sort by year descending (newest first)
curl "http://localhost:5000/api/building-specs?sort=-yearCompleted,name"

# Sort by stories descending
curl "http://localhost:5000/api/building-specs?sort=-height.stories,name"

# Multiple sort criteria
curl "http://localhost:5000/api/building-specs?sort=status,-yearCompleted,name"
```

## Field Projection

```bash
# Get only name and coordinates (reduces bandwidth)
curl "http://localhost:5000/api/building-specs?fields=name,centroid.lat,centroid.lon"

# Get subset of fields
curl "http://localhost:5000/api/building-specs?fields=name,architecturalStyle,yearCompleted,status,height.stories"
```

## Performance Tips

1. **Use pagination** - Always specify `page` and `limit` for large datasets
2. **Limit at 500** - Maximum limit is capped at 500 items per request
3. **Project fields** - Use `fields` parameter to fetch only needed data
4. **Combine filters** - Apply multiple filters in one request
5. **Cache results** - Pagination metadata includes `totalPages` for caching

## Frontend Integration

### React Example (using axios)

```javascript
import { buildingSpecsAPI } from './services/api';

const fetchBuildings = async () => {
  try {
    const response = await buildingSpecsAPI.getAll({
      page: 1,
      limit: 50,
      yearMin: 1890,
      yearMax: 1920,
      style: 'Beaux-Arts',
      sort: '-yearCompleted',
      fields: 'name,yearCompleted,architecturalStyle,centroid'
    });
    
    console.log(response.data.data); // Array of buildings
    console.log(response.data.pagination); // Pagination metadata
  } catch (error) {
    console.error('Failed to fetch buildings:', error);
  }
};
```

### Pagination Navigation

```javascript
const handlePageChange = (newPage) => {
  buildingSpecsAPI.getAll({
    ...currentFilters,
    page: newPage
  }).then(response => {
    setBuildings(response.data.data);
    setPagination(response.data.pagination);
  });
};
```

## CSV Export

All filters apply to CSV export as well:

```bash
# Export filtered data with custom fields
curl "http://localhost:5000/api/building-specs/__export/csv?yearMin=1900&yearMax=1920&fields=name,centroid.lat,centroid.lon,architecturalStyle,yearConstructed,yearCompleted,status" -o buildings.csv
```

## Filter Precedence

- `bbox` overrides `nearLat/nearLon/radiusMeters` (spatial)
- `yearMax` is aliased by deprecated `beforeYear`
- Empty/null filter values are ignored

## Validation Rules

- `page`: minimum 1 (auto-corrected)
- `limit`: minimum 1, maximum 500 (auto-capped)
- `yearMin`, `yearMax`: numeric values
- `stories`: exact integer match
- Text filters (`style`, `architect`, `name`, `materialType`, `roofType`): case-insensitive regex

## Testing

Run pagination tests:

```bash
cd backend
npm test -- pagination.test.js
```

Coverage includes:
- Pagination metadata accuracy
- Filter combinations
- Sort parsing (ascending/descending)
- Field projection
- Spatial queries
- Boundary conditions (max limit, page overflow)
