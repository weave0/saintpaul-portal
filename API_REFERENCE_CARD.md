# SaintPaul API - Quick Reference Card v2.0

**Last Updated**: November 23, 2025  
**API Version**: 1.0.0  
**Status**: Production Ready ✅

---

## 🚀 Quick Start

```bash
# Backend setup & testing
cd backend && npm install && npm test

# Development mode (auto-reload)
npm run dev

# Frontend setup
cd frontend && npm install && npm run dev
```

**URLs**:
- Backend API: `http://localhost:3001/api`
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:3001/api/docs`

---

## 📡 Core API Endpoints

### 1️⃣ Building Specs (Paginated & Filtered)

```http
GET /api/building-specs
  ?page=1
  &limit=50
  &style=Gothic
  &yearMin=1890
  &yearMax=1920
  &status=extant
  &stories=3
  &sort=-yearCompleted,name
  &fields=name,yearCompleted,architecturalStyle
```

**Headers**: None  
**Rate Limit**: 100/15min  
**Cache**: `X-Diff-Cache` header (HIT/MISS)

**Response**:
```json
{
  "data": [
    {
      "_id": "...",
      "name": "Historic Building",
      "architecturalStyle": "Gothic Revival",
      "yearCompleted": 1905
    }
  ],
  "meta": {
    "total": 1234,
    "page": 1,
    "limit": 50,
    "pages": 25
  }
}
```

---

### 2️⃣ Snapshot Diff (Cached)

```http
GET /api/reconstructions/diff?from=abc123&to=def456
```

**Rate Limit**: 10/15min (compute-heavy)  
**Cache Header**: `X-Diff-Cache: HIT|MISS`

**Response**:
```json
{
  "from": { "id": "abc", "year": 1905, "count": 120 },
  "to": { "id": "def", "year": 1920, "count": 135 },
  "summary": {
    "added": 20,
    "removed": 5,
    "unchanged": 100,
    "changed": 15
  },
  "changedSpecs": [
    {
      "id": "xyz",
      "name": "Example Building",
      "changes": {
        "roof.type": { "from": "Gable", "to": "Hip" },
        "height.stories": { "from": 3, "to": 4 },
        "materials": [
          { "material": "Brick", "from": 60, "to": 40 }
        ]
      }
    }
  ],
  "cached": true
}
```

---

### 3️⃣ Auto-Generate Snapshot

```http
POST /api/reconstructions/auto-generate?year=1905&style=Beaux-Arts
```

**Rate Limit**: 10/15min  
**Response**: `201 Created` with snapshot document

---

### 4️⃣ System Metrics

```http
GET /api/metrics/basic
```

**Response**:
```json
{
  "status": "ok",
  "counts": {
    "buildingSpecs": 1234,
    "reconstructionSnapshots": 56
  },
  "diffCache": {
    "size": 42,
    "maxSize": 100,
    "hitRate": 0.73
  },
  "system": {
    "uptimeSeconds": 86400,
    "memoryUsageMB": 128.5,
    "nodeVersion": "v20.x.x"
  }
}
```

---

## 🛡️ Rate Limits

| Tier | Limit | Endpoints |
|------|-------|-----------|
| General | 100/15min | Most GET endpoints |
| Write | 20/15min | POST, PUT, PATCH, DELETE |
| Heavy | 10/15min | `/diff`, `/auto-generate` |

**429 Response**:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 300
}
```

**Headers**:
- `Retry-After`: Seconds to wait
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Requests left

---

## 🧪 Testing Commands

```bash
# Run all tests (28 active, 4 skipped)
npm test

# With coverage report
npm run test:coverage

# Enforce 70% threshold
npm run test:threshold

# Specific suite
npm test -- tests/pagination.test.js

# Verbose output
npm test -- --verbose
```

**Test Results**:
```
Test Suites: 5 passed, 2 skipped
Tests:       28 passed, 4 skipped
Time:        ~2.6s
```

---

## 🔧 Development Tools

### Linting
```bash
npm run lint          # Check
npm run lint:fix      # Auto-fix
```

### Index Analysis
```bash
node backend/scripts/evaluateIndexes.js
```

**Output**:
- ✅ Index usage stats
- ⚠️ Unused indexes
- 💡 Recommendations
- 📊 Size ratios

---

## 📝 Type Definitions (42 Types)

```javascript
/** @typedef {import('./types').BuildingSpec} BuildingSpec */
/** @typedef {import('./types').DiffResponse} DiffResponse */

/**
 * Fetch building by ID
 * @param {string} id
 * @returns {Promise<BuildingSpec>}
 */
async function getBuilding(id) {
  // Full IDE autocomplete for BuildingSpec properties
}
```

**Key Types**:
- `BuildingSpec`, `ReconstructionSnapshot`
- `DiffResponse`, `MetricsResponse`
- `ErrorResponse`, `RateLimitError`, `ValidationError`
- `PaginatedBuildingSpecResponse`

---

## 🔍 Error Handling

### Standard Errors

```json
// 400 Bad Request
{
  "error": "Validation failed",
  "details": "Year must be between 1600 and 2025",
  "code": 400
}

// 404 Not Found
{
  "error": "Resource not found",
  "details": "Snapshot with id '...' does not exist"
}

// 500 Internal Server Error
{
  "error": "Internal server error",
  "details": "Database connection failed"
}
```

**OpenAPI Spec**: All errors documented in `backend/openapi.yaml`

---

## 🎯 Common Tasks

### 1. Add New Filter
```javascript
// 1. Route (buildingSpecs.js)
const { newFilter } = req.query;
if (newFilter) query.newField = newFilter;

// 2. Test (pagination.test.js)
const res = await request(app).get('/api/building-specs?newFilter=value');

// 3. Type (types.js)
* @property {string} [newFilter] - New filter description

// 4. OpenAPI (openapi.yaml)
- in: query
  name: newFilter
  schema: { type: string }
```

### 2. Update Diff Fields
```javascript
// reconstructions.js
const fieldsToCheck = [
  'architecturalStyle',
  'newField',  // Add here
  // ...
];
```

### 3. Run Data Import
```bash
node backend/scripts/importBuildingSpecs.js
node backend/scripts/importData.js
```

---

## 🔐 Security Headers (Helmet)

- `Content-Security-Policy`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` (HTTPS only)
- `X-XSS-Protection: 0` (modern browsers use CSP)

**CORS**: `http://localhost:3000` (dev), update for production

---

## 📊 Cache Performance

### X-Diff-Cache Header

```http
GET /api/reconstructions/diff?from=abc&to=def

# First request
X-Diff-Cache: MISS
Response Time: ~250ms

# Subsequent requests
X-Diff-Cache: HIT
Response Time: ~8ms
```

**Cache Stats**: Available at `/api/metrics/basic`

---

## 🚦 CI/CD Pipeline

**GitHub Actions**: `.github/workflows/ci.yml`

**Workflow**:
```
Push/PR → Install → Lint → Test → Coverage (70%) → ✅
```

**Thresholds**:
- Lines: 70%
- Functions: 70%
- Branches: 60%
- Statements: 70%

---

## 🐛 Troubleshooting

### Tests Failing
```bash
# Clear cache
npm test -- --clearCache

# Verbose mode
npm test -- --verbose

# Single file
npm test -- tests/health.test.js
```

### Rate Limited
- Wait 15 minutes
- Or restart server (resets limits)

### Cache Issues
- Check `NODE_ENV` (cache disabled in test mode)
- Verify `diffCache` initialization

### Lint Errors
```bash
npm run lint:fix  # Auto-fix
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `ENHANCEMENT_SUMMARY.md` | All follow-up enhancements |
| `DEVELOPMENT_SUMMARY_2025-11-23.md` | Original dev summary |
| `TYPE_SAFETY_PLAN.md` | TypeScript migration plan |
| `PAGINATION_GUIDE.md` | Pagination usage details |
| `backend/openapi.yaml` | OpenAPI 3.1.0 spec |
| `backend/types.js` | JSDoc type definitions |

---

## ✅ Deployment Checklist

**Pre-Flight**:
- [ ] `npm test` passes
- [ ] `npm run lint` clean
- [ ] `npm run test:threshold` passes
- [ ] Indexes created (run `evaluateIndexes.js`)

**Configuration**:
- [ ] `NODE_ENV=production`
- [ ] MongoDB URI configured
- [ ] CORS origin updated
- [ ] HTTPS enabled
- [ ] Logging destination set

**Post-Deployment**:
- [ ] Health check: `GET /api/health`
- [ ] Metrics check: `GET /api/metrics/basic`
- [ ] Monitor diff cache hit rate (target >70%)
- [ ] Review rate limit triggers

---

## 🎓 Best Practices

### Query Optimization
✅ Use field projection (`?fields=name,year`)  
✅ Add indexes for common filters  
✅ Limit page size (max 500)  
✅ Monitor with `evaluateIndexes.js`

### Error Handling
✅ Return structured errors  
✅ Include `Retry-After` for 429s  
✅ Log with pino (structured JSON)  
✅ Use appropriate HTTP codes

### Testing
✅ Write integration tests with real DB  
✅ Test error cases (400/404/429/500)  
✅ Maintain >70% coverage  
✅ Skip brittle mocked tests

### Performance
✅ Leverage diff cache  
✅ Use compound indexes  
✅ Monitor cache hit rates  
✅ Set pagination limits

---

## 🔗 Quick Links

- **Swagger UI**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **Health**: [http://localhost:3001/api/health](http://localhost:3001/api/health)
- **Metrics**: [http://localhost:3001/api/metrics/basic](http://localhost:3001/api/metrics/basic)
- **Frontend**: [http://localhost:3000](http://localhost:3000)

---

## 📞 API Response Examples

### Success (200)
```json
{ "data": [...], "meta": {...} }
```

### Created (201)
```json
{ "_id": "...", "year": 1905, "label": "..." }
```

### Bad Request (400)
```json
{ "error": "...", "details": "..." }
```

### Not Found (404)
```json
{ "error": "Resource not found" }
```

### Rate Limited (429)
```json
{ "error": "Rate limit exceeded", "retryAfter": 300 }
```

---

**v2.0** | November 23, 2025 | ✅ Production Ready
