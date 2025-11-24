# Saint Paul Historical Library & Map

A comprehensive, visually engaging, and user-friendly web experience for exploring the rich history, culture, and geography of Saint Paul, Minnesota.

## 🏛️ Features

- **Interactive Map**: Explore historical landmarks, cultural sites, and points of interest with Mapbox integration
- **Historical Timeline**: Journey through pivotal events that shaped Saint Paul's history
- **Digital Library**: Access photographs, documents, and archives from Saint Paul's past
- **Beautiful UI/UX**: Modern, responsive design built with React and Material UI
- **RESTful API**: Comprehensive backend with rate limiting, caching, and robust validation
- **Advanced Filtering**: Pagination, sorting, field projection, and spatial queries
- **Data Quality**: Schema validation, completeness tracking, and source attribution

## 📁 Project Structure

```text
backend/          - Node.js/Express API server
├── config/       - Database and configuration files
├── models/       - MongoDB schemas (Location, HistoricalEvent, BuildingSpec)
├── routes/       - API routes with pagination & filtering
├── tests/        - Jest test suite (health, diff, auto-generate, pagination)
└── server.js     - Main server file

frontend/         - React application
├── src/
│   ├── components/  - Reusable UI components (BuildingSpecExplorer, etc.)
│   ├── pages/       - Page components (Home, Map, Timeline, Library, About)
│   ├── services/    - API service layer with typed endpoints
│   ├── utils/       - Query builder utilities
│   └── main.jsx     - Application entry point
└── vite.config.js   - Vite configuration

data/             - Sample historical data (JSON files)
docs/             - Documentation (pagination guide, data collection)
maps/             - Map configuration and resources
```

## 📚 Documentation

- **[Pagination & Filtering Guide](docs/PAGINATION_GUIDE.md)** - Comprehensive API query reference
- **[Data Sources](docs/DATA_SOURCES.md)** - Information about data provenance
- **[Data Collection Guide](docs/DATA_COLLECTION_GUIDE.md)** - Adding new historical data

## 🚀 Getting Started

This project provides a high‑fidelity architectural metadata API (`/api/building-specs`) alongside historical locations and events.

### Backend Setup

Install dependencies:

```powershell
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```powershell
Copy-Item .env.example .env
```

Update `.env` with your MongoDB URI and other settings (e.g. `MONGODB_URI=mongodb://localhost:27017/saintpaul`).

(Optional) Import sample locations/events:

```powershell
node scripts/importData.js
```

(Optional) Import BuildingSpec samples:

```powershell
node scripts/importBuildingSpecs.js ../data/building-specs-sample.json
```

Start the backend server:

```powershell
npm run dev
```

Backend runs at `http://localhost:5000`.

### BuildingSpec Route Filters & Pagination

#### Pagination Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 50 | Results per page (max 500) |
| `sort` | string | `yearCompleted,name` | Comma-separated fields; prefix `-` for descending (e.g., `-yearCompleted,name`) |
| `fields` | string | *(all)* | Comma-separated field projection (e.g., `name,yearCompleted,architecturalStyle`) |

#### Filter Parameters

| Param | Description | Example |
|-------|-------------|---------|
| `status` | Exact status match | `status=existing` |
| `style` | Case-insensitive architectural style | `style=Beaux-Arts` |
| `architect` | Architect regex match | `architect=Cass+Gilbert` |
| `name` | Building name regex | `name=Cathedral` |
| `yearMin` / `yearMax` | Year range (constructed/completed) | `yearMin=1890&yearMax=1920` |
| `beforeYear` | *Deprecated*; use `yearMax` | `beforeYear=1920` |
| `stories` | Exact story count | `stories=5` |
| `materialType` | Material regex (in `materials` array) | `materialType=limestone` |
| `roofType` | Roof type regex | `roofType=gable` |
| `nearLat,nearLon,radiusMeters` | Approximate proximity filter | `nearLat=44.95&nearLon=-93.10&radiusMeters=500` |
| `bbox` | GeoJSON bounding box (minLon,minLat,maxLon,maxLat) | `bbox=-93.11,44.94,-93.09,44.96` |

#### Response Structure

```json
{
  "data": [ /* array of BuildingSpec documents */ ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 243,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Examples

Paginated query with filters:

```powershell
curl "http://localhost:5000/api/building-specs?page=2&limit=25&yearMin=1890&yearMax=1920&style=Romanesque&sort=-yearCompleted"
```

Field projection (names and coordinates only):

```powershell
curl "http://localhost:5000/api/building-specs?fields=name,centroid.lat,centroid.lon&limit=100"

### BuildingSpec Additional Endpoints

CSV export (supports same filters + custom field list):

```powershell
curl "http://localhost:5000/api/building-specs/__export/csv?fields=name,centroid.lat,centroid.lon,architecturalStyle,yearConstructed,yearCompleted,status" -o specs.csv
```

Quality dashboard metrics:

```powershell
curl http://localhost:5000/api/building-specs/__quality/dashboard
```

The `fields` query parameter accepts comma‑separated Mongo dot paths (e.g. `height.roofHeight_m`, `sources`). Arrays and objects are JSON‑serialized; arrays are pipe‑joined when simple values.

### Frontend Setup

Install dependencies:

```powershell
cd frontend
npm install
```

Create a `.env.local` file (copy from `.env.example`):

```powershell
Copy-Item .env.example .env.local
```

Add your Mapbox token to `.env.local`:

```text
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Start the development server:

```powershell
npm run dev
```

Frontend runs at `http://localhost:3000`.

## 🗄️ Database Setup

### Import Sample Data

Sample data is provided in the `data/` directory:

- `sample-locations.json` - Historical locations in Saint Paul
- `sample-events.json` - Historical events and timeline data

To import this data into MongoDB, you can use `mongoimport` or create a custom import script.

## 🎨 Tech Stack

### Frontend

- **React 18** - UI library
- **Material UI** - Component library
- **Mapbox GL JS** - Interactive maps
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend

- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **Express Rate Limit** - API protection (3-tier strategy)
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging
- **Jest** - Testing framework
- **mongodb-memory-server** - In-memory MongoDB for integration tests
- **Supertest** - HTTP assertions
- **ESLint** - Code quality and consistency

**Testing Strategy**: Two-layer approach

| Layer | Purpose | DB | Files |
|-------|---------|----|-------|
| Unit/Mock | Fast verification of route logic & diff generation | Mocked Mongoose methods | `autoGenerate.test.js`, `pagination.test.js` |
| Integration | Real query semantics, indexes, filters, validation | `mongodb-memory-server` in‑memory | `tests/integration/*.integration.test.js` |

**Key Test Coverage**:

1. `diff.integration.test.js` – Diff endpoint with real DB, cache behavior, error cases
2. `buildingSpecs.integration.test.js` – Pagination, filters, spatial queries
3. `autoGenerate.test.js` – Snapshot auto-generation validation
4. `pagination.test.js` – Metadata, sorting, field projection
5. `health.test.js` – API health check

**Run tests**:

```bash
cd backend
npm test              # All tests
npm run test:coverage # With coverage report
npm run lint          # Check code quality
```

**CI/CD**: GitHub Actions runs lint + tests on all PRs and pushes to main.

## 📊 API Endpoints

### Locations

- `GET /api/locations` - Get all locations (with optional filters)
- `GET /api/locations/:id` - Get location by ID
- `POST /api/locations` - Create new location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Historical Events

- `GET /api/history` - Get all events (with optional filters)
- `GET /api/history/timeline` - Get timeline view
- `GET /api/history/:id` - Get event by ID
- `POST /api/history` - Create new event
- `PUT /api/history/:id` - Update event
- `DELETE /api/history/:id` - Delete event

### Reconstruction Snapshots & Diff

Reconstruction snapshots represent curated sets of `BuildingSpec` IDs for a point in time.

Endpoints:

- `GET /api/reconstructions` – List snapshots
- `GET /api/reconstructions/:id` – Get snapshot (with `specRefs` populated)
- `POST /api/reconstructions` – Create snapshot manually
- `PUT /api/reconstructions/:id` – Update snapshot
- `DELETE /api/reconstructions/:id` – Remove snapshot
- `GET /api/reconstructions/diff?from=<id>&to=<id>` – Compare membership and field-level changes (style, height, status)
- `POST /api/reconstructions/auto-generate?year=YYYY&beforeYear=YYYY&style=Romanesque` – Auto‑generate snapshot from filters

Diff response shape (simplified):

```json
{
  "from": { "id": "...", "year": 1885, "count": 120 },
  "to": { "id": "...", "year": 1905, "count": 156 },
  "summary": { "added": 45, "removed": 9, "unchanged": 111, "changed": 12 },
  "addedSpecs": [ { "_id": "...", "name": "New Bank", "yearConstructed": 1902 } ],
  "removedSpecs": [ { "_id": "...", "name": "Old Warehouse" } ],
  "changedSpecs": [ { "id": "...", "name": "Capitol", "changes": { "architecturalStyle": { "from": "Romanesque", "to": "Beaux-Arts" } } } ]
}
```

### BuildingSpec Quality & Export

- `GET /api/building-specs/__quality/dashboard` – Summary metrics (counts, completeness average, confidence distribution)
- `GET /api/building-specs/__export/csv?fields=...` – CSV export with filter params identical to list endpoint

### Sanborn Acquisition Stub

Script: `node backend/scripts/downloadSanbornSheets.js [outputDir]`

Creates:

- `sanborn_raw/manifest.json` – Placeholder sheet manifest
- `sanborn_raw/control-points.json` – Example GCP structures

Next implementation steps (not yet coded): image downloading, georeferencing (GDAL), footprint extraction, source linkage to `BuildingSpec.sources`.

## 🤝 Contributing

Contributions are welcome! This is a community project dedicated to preserving Saint Paul's history.

## 📝 License

MIT License - feel free to use this project for educational or community purposes.

## 🙏 Acknowledgments

- Minnesota Historical Society
- City of Saint Paul
- Community contributors and historians

---

### Built with ❤️ for Saint Paul, Minnesota
