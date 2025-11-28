const mongoose = require('mongoose');

/**
 * Provenance Schema - Tracks sources, citations, and edit history
 * for Locations, Events, and BuildingSpecs
 */
const ProvenanceSchema = new mongoose.Schema({
  // Reference to the entity this provenance belongs to
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  entityType: {
    type: String,
    required: true,
    enum: ['location', 'event', 'buildingspec', 'reconstruction'],
    index: true,
  },

  // Citation sources
  sources: [{
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['book', 'url', 'archive', 'document', 'photo', 'newspaper', 'map', 'oral-history'],
    },
    citation: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    link: {
      type: String,
      validate: {
        validator: (v) => !v || /^https?:\/\//.test(v),
        message: 'Link must be a valid URL',
      },
    },
    archiveId: String, // e.g., Archive.org ID, DPLA ID
    confidence: {
      type: String,
      enum: ['low', 'medium', 'high', 'verified'],
      default: 'medium',
    },
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],

  // Confidence level (calculated from source count/quality)
  confidence: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
    index: true,
  },

  // Verification metadata
  lastVerified: {
    type: Date,
    default: Date.now,
  },
  verifiedBy: String,

  // Contributor tracking
  contributors: [{
    userId: String,
    username: String,
    contributionType: {
      type: String,
      enum: ['original', 'edit', 'source-added', 'verification'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],

  // Edit history (append-only log)
  editHistory: [{
    timestamp: {
      type: Date,
      default: Date.now,
    },
    userId: String,
    username: String,
    action: {
      type: String,
      enum: ['created', 'updated', 'source-added', 'source-removed', 'verified'],
    },
    changes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    notes: String,
  }],

  // Permalink & archive hash for immutability
  permalink: {
    type: String,
    unique: true,
    sparse: true,
  },
  archiveHash: String, // SHA-256 of content + timestamp

  // Quality metrics
  completenessScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  citationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },

}, {
  timestamps: true,
  collection: 'provenances',
});

// ========== INDEXES ==========
ProvenanceSchema.index({ entityId: 1, entityType: 1 }, { unique: true });
ProvenanceSchema.index({ confidence: 1, lastVerified: -1 });
ProvenanceSchema.index({ 'contributors.userId': 1 });
ProvenanceSchema.index({ permalink: 1 });

// ========== METHODS ==========

/**
 * Calculate confidence level based on source count and quality
 */
ProvenanceSchema.methods.calculateConfidence = function() {
  const sourceCount = this.sources.length;
  const verifiedCount = this.sources.filter(s => s.confidence === 'verified').length;

  if (sourceCount >= 5 && verifiedCount >= 2) return 'platinum';
  if (sourceCount >= 4 || verifiedCount >= 1) return 'gold';
  if (sourceCount >= 2) return 'silver';
  return 'bronze';
};

/**
 * Generate permalink (call once on creation)
 */
ProvenanceSchema.methods.generatePermalink = function() {
  const baseUrl = process.env.BASE_URL || 'https://saintpaul.history';
  const entityShort = this.entityType.substring(0, 3);
  this.permalink = `${baseUrl}/cite/${entityShort}-${this.entityId}`;
  return this.permalink;
};

/**
 * Generate archive hash (SHA-256 of content + timestamp)
 */
ProvenanceSchema.methods.generateArchiveHash = async function() {
  const crypto = require('crypto');
  const content = JSON.stringify({
    entityId: this.entityId,
    sources: this.sources,
    timestamp: new Date().toISOString(),
  });
  this.archiveHash = crypto.createHash('sha256').update(content).digest('hex');
  return this.archiveHash;
};

/**
 * Add a new source with provenance tracking
 */
ProvenanceSchema.methods.addSource = async function(sourceData, userId, username) {
  this.sources.push({
    ...sourceData,
    id: new mongoose.Types.ObjectId().toString(),
    addedBy: username,
    addedAt: new Date(),
  });

  this.contributors.push({
    userId,
    username,
    contributionType: 'source-added',
  });

  this.editHistory.push({
    userId,
    username,
    action: 'source-added',
    changes: new Map([['source', sourceData.citation]]),
  });

  this.confidence = this.calculateConfidence();
  await this.generateArchiveHash();
  await this.save();
  
  return this;
};

/**
 * Calculate completeness score (0-100) based on metadata coverage
 */
ProvenanceSchema.methods.calculateCompletenessScore = function() {
  let score = 0;
  
  // Base points for having sources
  if (this.sources.length > 0) score += 30;
  if (this.sources.length >= 2) score += 20;
  if (this.sources.length >= 4) score += 10;
  
  // Points for source quality
  const highConfidenceSources = this.sources.filter(s => 
    s.confidence === 'high' || s.confidence === 'verified'
  ).length;
  score += Math.min(highConfidenceSources * 10, 20);
  
  // Points for metadata completeness
  if (this.verifiedBy) score += 10;
  if (this.permalink) score += 5;
  if (this.archiveHash) score += 5;
  
  this.completenessScore = Math.min(score, 100);
  return this.completenessScore;
};

// ========== STATIC METHODS ==========

/**
 * Find provenance by entity
 */
ProvenanceSchema.statics.findByEntity = async function(entityId, entityType) {
  return await this.findOne({ entityId, entityType });
};

/**
 * Get quality statistics
 */
ProvenanceSchema.statics.getQualityStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$confidence',
        count: { $sum: 1 },
        avgSources: { $avg: { $size: '$sources' } },
        avgCompletenessScore: { $avg: '$completenessScore' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

// ========== PRE-SAVE HOOKS ==========

ProvenanceSchema.pre('save', async function(next) {
  // Recalculate scores on save
  this.confidence = this.calculateConfidence();
  this.calculateCompletenessScore();
  
  // Generate permalink if not exists
  if (!this.permalink) {
    this.generatePermalink();
  }
  
  next();
});

module.exports = mongoose.model('Provenance', ProvenanceSchema);
