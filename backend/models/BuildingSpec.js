const mongoose = require('mongoose');

/**
 * BuildingSpec
 * Extended architectural & historical blueprint-level metadata for a structure.
 * Separates high fidelity physical attributes from general `Location` model.
 * Data is designed to be source-attributed, versioned, and confidence-scored.
 */
const BuildingSpecSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 300 },
  locationRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  // WGS84 centroid of footprint
  centroid: {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lon: { type: Number, required: true, min: -180, max: 180 }
  },
  // Raw footprint polygon (array of [lon, lat]) retained for legacy/simple operations
  footprint: {
    type: [[Number]],
    validate: {
      validator: v => Array.isArray(v) && v.length >= 4,
      message: 'Footprint must have at least 4 coordinate pairs (closed polygon)'
    }
  },
  // GeoJSON footprint (Polygon) for spatial queries (coordinates: [ [ [lon,lat], ... ] ])
  footprintGeo: {
    type: {
      type: String,
      enum: ['Polygon']
    },
    coordinates: {
      type: [[[Number]]],
      validate: v => Array.isArray(v) && v.length > 0
    }
  },
  // Primary physical characteristics
  dimensions: {
    length_m: { type: Number, min: 0.1, max: 500 }, // principal axis
    width_m: { type: Number, min: 0.1, max: 500 },  // secondary axis
    area_m2: { type: Number, min: 0, max: 250000 },
    footprintAccuracy_m: { type: Number, min: 0, max: 100 } // estimated positional accuracy radius
  },
  height: {
    roofHeight_m: { type: Number, min: 0, max: 200 }, // highest architectural point
    eaveHeight_m: { type: Number, min: 0, max: 150 }, // typical wall/eave height
    stories: { type: Number, min: 0, max: 50, validate: { validator: Number.isInteger, message: 'Stories must be an integer' } },
    storyHeight_m: { type: Number, default: 3.5, min: 2.0, max: 8.0 }
  },
  materials: [{
    material: { type: String, trim: true, maxlength: 100 }, // e.g. limestone, brick, sandstone, steel, glass
    percentage: { type: Number, min: 0, max: 100 } // optional proportion 0-100
  }],
  roof: {
    type: { type: String, enum: ['flat', 'gable', 'hip', 'mansard', 'dome', 'spire', 'shed', 'gambrel', 'other', ''] },
    material: { type: String, trim: true, maxlength: 100 },
    geometryNotes: { type: String, maxlength: 500 }
  },
  architecturalStyle: { type: String, trim: true, maxlength: 150 }, // e.g. Beaux-Arts, Gothic Revival
  architect: { type: String, trim: true, maxlength: 200 },
  engineer: { type: String, trim: true, maxlength: 200 },
  builder: { type: String, trim: true, maxlength: 200 },
  yearDesigned: { type: Number, min: 1600, max: 2100 },
  yearConstructed: { type: Number, min: 1600, max: 2100 },
  yearCompleted: { type: Number, min: 1600, max: 2100 },
  alterations: [{
    year: { type: Number, min: 1600, max: 2100 },
    description: { type: String, maxlength: 1000 },
    type: { type: String, enum: ['addition', 'renovation', 'restoration', 'partial-demolition', 'other', ''] }
  }],
  status: { type: String, enum: ['existing', 'demolished', 'under_construction', 'planned'], default: 'existing', required: true },
  // Source attribution & provenance
  sources: [{
    name: { type: String, trim: true, maxlength: 200 }, // e.g. 'Sanborn Fire Insurance Map'
    year: { type: Number, min: 1600, max: 2100 },
    url: { type: String, maxlength: 500 },
    type: { type: String, enum: ['map', 'photograph', 'drawing', 'survey', 'permit', 'narrative', 'other', ''], required: true },
    rawReference: { type: String, maxlength: 300 }, // sheet number, plate id, etc.
    confidence: { type: String, enum: ['very_high', 'high', 'medium', 'low', 'estimated'], default: 'medium' }
  }],
  dataQuality: {
    completenessPercent: { type: Number, min: 0, max: 100 }, // 0-100 subjective evaluation
    lastVerified: { type: Date, default: Date.now },
    verifiedBy: { type: String, maxlength: 200 }
  },
  // Versioning for blueprint evolution
  revision: {
    version: { type: Number, default: 1, min: 1 },
    notes: { type: String, maxlength: 1000 }
  }
}, { timestamps: true });

BuildingSpecSchema.index({ 'centroid.lat': 1, 'centroid.lon': 1 });
BuildingSpecSchema.index({ name: 1 });
// 2dsphere index on GeoJSON footprint for spatial queries
BuildingSpecSchema.index({ footprintGeo: '2dsphere' });

module.exports = mongoose.model('BuildingSpec', BuildingSpecSchema);
