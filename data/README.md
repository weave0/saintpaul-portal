# Data Directory

This directory contains sample historical data for the Saint Paul Historical Library & Map project.

## Files

- `sample-locations.json` - Historical locations, landmarks, and points of interest in Saint Paul
- `sample-events.json` - Timeline of historical events that shaped Saint Paul

## Importing Data

To import the sample data into your MongoDB database:

```powershell
cd backend
node scripts/importData.js
```

This will:
1. Clear existing data
2. Import all locations from `sample-locations.json`
3. Import all events from `sample-events.json`

## Data Structure

### Locations
Each location includes:
- Name and description
- Geographic coordinates (latitude/longitude)
- Category (landmark, historical, cultural, etc.)
- Year established
- Address information
- Related images and historical events
- Metadata (source, verification status)

### Historical Events
Each event includes:
- Title and description
- Date (and optional end date)
- Category (political, cultural, economic, etc.)
- Related locations
- Images and sources
- Significance level
- Tags for categorization

## Contributing Data

To contribute additional historical data:
1. Follow the JSON schema structure
2. Verify historical accuracy
3. Include sources where possible
4. Add relevant tags and categories
