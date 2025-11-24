const mongoose = require('mongoose');

/**
 * BuildingSpec
 * Extended architectural & historical blueprint-level metadata for a structure.
 * Separates high fidelity physical attributes from general `Location` model.
 * Data is designed to be source-attributed, versioned, and confidence-scored.
 */
const BuildingSpecSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  locationRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  // WGS84 centroid of footprint
  centroid: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  // Raw footprint polygon (array of [lon, lat]) retained for legacy/simple operations
  footprint: {
    type: [[Number]],
    validate: v => Array.isArray(v) && v.length >= 4
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
    length_m: Number, // principal axis
    width_m: Number,  // secondary axis
    area_m2: Number,
    footprintAccuracy_m: Number // estimated positional accuracy radius
  },
  height: {
    roofHeight_m: Number, // highest architectural point
    eaveHeight_m: Number, // typical wall/eave height
    stories: Number,
    storyHeight_m: { type: Number, default: 3.5 }
  },
  materials: [{
    material: String, // e.g. limestone, brick, sandstone, steel, glass
    percentage: Number // optional proportion 0-100
  }],
  roof: {
    type: String, // flat, gable, hip, mansard, dome, spire
    material: String,
    geometryNotes: String
  },
  architecturalStyle: String, // e.g. Beaux-Arts, Gothic Revival
  architect: String,
  engineer: String,
  builder: String,
  yearDesigned: Number,
  yearConstructed: Number,
  yearCompleted: Number,
  alterations: [{
    year: Number,
    description: String,
    type: { type: String, enum: ['addition', 'renovation', 'restoration', 'partial-demolition', 'other'] }
  }],
  status: { type: String, enum: ['existing', 'demolished', 'under_construction', 'planned'], default: 'existing' },
  // Source attribution & provenance
  sources: [{
    name: String, // e.g. 'Sanborn Fire Insurance Map'
    year: Number,
    url: String,
    type: { type: String, enum: ['map', 'photograph', 'drawing', 'survey', 'permit', 'narrative', 'other'] },
    rawReference: String, // sheet number, plate id, etc.
    confidence: { type: String, enum: ['very_high', 'high', 'medium', 'low', 'estimated'], default: 'medium' }
  }],
  dataQuality: {
    completenessPercent: Number, // 0-100 subjective evaluation
    lastVerified: { type: Date, default: Date.now },
    verifiedBy: String
  },
  // Versioning for blueprint evolution
  revision: {
    version: { type: Number, default: 1 },
    notes: String
  }
}, { timestamps: true });

BuildingSpecSchema.index({ 'centroid.lat': 1, 'centroid.lon': 1 });
BuildingSpecSchema.index({ name: 1 });
// 2dsphere index on GeoJSON footprint for spatial queries
BuildingSpecSchema.index({ footprintGeo: '2dsphere' });

module.exports = mongoose.model('BuildingSpec', BuildingSpecSchema);
