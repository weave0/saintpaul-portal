/**
 * @file JSDoc type definitions for SaintPaul API
 * Phase 1 of TYPE_SAFETY_PLAN.md - provides type hints without runtime overhead
 */

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * @typedef {Object} GeoLocation
 * @property {number} lat - Latitude (-90 to 90)
 * @property {number} lon - Longitude (-180 to 180)
 */

/**
 * @typedef {Object} Dimensions
 * @property {number} [length_m] - Length in meters
 * @property {number} [width_m] - Width in meters
 * @property {number} [area_m2] - Area in square meters
 */

/**
 * @typedef {Object} Height
 * @property {number} [roofHeight_m] - Roof height in meters
 * @property {number} [stories] - Number of stories
 */

/**
 * @typedef {Object} Roof
 * @property {string} [type] - Roof type (e.g., 'Gable', 'Hip', 'Flat')
 * @property {string} [material] - Roof material (e.g., 'Slate', 'Tile', 'Metal')
 */

/**
 * @typedef {Object} Material
 * @property {string} material - Material name
 * @property {number} percentage - Percentage of total (0-100)
 */

/**
 * @typedef {Object} HistoricalNote
 * @property {Date} date
 * @property {string} note
 * @property {string} [source]
 */

/**
 * BuildingSpec Document
 * @typedef {Object} BuildingSpec
 * @property {string} _id - MongoDB ObjectId
 * @property {string} name - Building name
 * @property {GeoLocation} location - Geographic coordinates
 * @property {number} [yearConstructed] - Construction start year
 * @property {number} [yearCompleted] - Construction completion year
 * @property {string} [architecturalStyle] - Architectural style
 * @property {Dimensions} dimensions - Building dimensions
 * @property {Height} height - Height information
 * @property {Roof} roof - Roof details
 * @property {string} [architect] - Architect name
 * @property {Material[]} materials - Building materials
 * @property {'extant'|'demolished'|'altered'|'unknown'} status - Current status
 * @property {HistoricalNote[]} historicalNotes - Historical notes
 * @property {string[]} dataSources - Source identifiers
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * ReconstructionSnapshot Document
 * @typedef {Object} ReconstructionSnapshot
 * @property {string} _id - MongoDB ObjectId
 * @property {number} year - Snapshot year
 * @property {string} label - Human-readable label
 * @property {BuildingSpec[]|string[]} specRefs - BuildingSpec references
 * @property {number} [completeness] - Completeness percentage (0-100)
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Pagination metadata
 * @typedef {Object} PaginationMeta
 * @property {number} total - Total matching documents
 * @property {number} page - Current page number
 * @property {number} limit - Documents per page
 * @property {number} pages - Total pages
 */

/**
 * BuildingSpec query parameters
 * @typedef {Object} BuildingSpecQueryParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=50] - Results per page
 * @property {string} [style] - Architectural style filter
 * @property {number} [yearMin] - Minimum year
 * @property {number} [yearMax] - Maximum year
 * @property {number} [stories] - Number of stories
 * @property {string} [materialType] - Material type
 * @property {string} [roofType] - Roof type
 * @property {string} [architect] - Architect name
 * @property {'extant'|'demolished'|'altered'|'unknown'} [status] - Status filter
 * @property {string} [sort='name'] - Sort field
 * @property {string} [fields] - Comma-separated fields to include
 */

/**
 * Paginated BuildingSpec response
 * @typedef {Object} PaginatedBuildingSpecResponse
 * @property {BuildingSpec[]} data
 * @property {PaginationMeta} meta
 */

/**
 * Diff summary stats
 * @typedef {Object} DiffSummary
 * @property {number} added - Added buildings count
 * @property {number} removed - Removed buildings count
 * @property {number} unchanged - Unchanged buildings count
 * @property {number} changed - Changed buildings count
 */

/**
 * Field change detail
 * @typedef {Object} FieldChange
 * @property {*} from - Original value
 * @property {*} to - New value
 */

/**
 * Material change detail
 * @typedef {Object} MaterialChange
 * @property {string} material - Material name
 * @property {number|null} from - Original percentage
 * @property {number|null} to - New percentage
 */

/**
 * Changed building specification
 * @typedef {Object} ChangedSpec
 * @property {string} id - BuildingSpec ID
 * @property {string} name - Building name
 * @property {Object.<string, FieldChange>} changes - Field changes
 * @property {MaterialChange[]} [changes.materials] - Material changes
 */

/**
 * Snapshot diff response
 * @typedef {Object} DiffResponse
 * @property {Object} from - Source snapshot info
 * @property {string} from.id
 * @property {number} from.year
 * @property {string} from.label
 * @property {number} from.count
 * @property {Object} to - Target snapshot info
 * @property {string} to.id
 * @property {number} to.year
 * @property {string} to.label
 * @property {number} to.count
 * @property {DiffSummary} summary
 * @property {BuildingSpec[]} addedSpecs
 * @property {BuildingSpec[]} removedSpecs
 * @property {ChangedSpec[]} changedSpecs
 * @property {boolean} cached - Whether result was from cache
 */

/**
 * Auto-generate query parameters
 * @typedef {Object} AutoGenerateParams
 * @property {number} year - Target year
 * @property {string} [style] - Optional style filter
 */

/**
 * Metrics response
 * @typedef {Object} MetricsResponse
 * @property {Object} counts
 * @property {number} counts.buildingSpecs
 * @property {number} counts.snapshots
 * @property {Object} diffCache
 * @property {number} diffCache.size
 * @property {number} diffCache.maxSize
 * @property {number} diffCache.hitRate
 * @property {Object} system
 * @property {number} system.uptimeSeconds
 * @property {number} system.memoryUsageMB
 * @property {string} system.nodeVersion
 */

// ============================================================================
// Error Types
// ============================================================================

/**
 * Standard API error response
 * @typedef {Object} ErrorResponse
 * @property {string} error - Error message
 * @property {string} [details] - Additional error details
 * @property {number} [code] - Error code
 */

/**
 * Rate limit error response (429)
 * @typedef {Object} RateLimitError
 * @property {string} error - "Rate limit exceeded"
 * @property {number} retryAfter - Seconds until retry allowed
 */

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Express request with pagination
 * @typedef {Object} PaginatedRequest
 * @property {BuildingSpecQueryParams} query
 */

/**
 * Express response helper
 * @typedef {Object} JsonResponse
 * @property {Function} json - Send JSON response
 * @property {Function} status - Set status code
 * @property {Function} setHeader - Set response header
 */

module.exports = {}; // Export placeholder for IDE autocomplete
