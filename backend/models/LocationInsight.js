const mongoose = require('mongoose');

/**
 * LocationInsight Schema
 * Enriched modern data for buildings and locations in Saint Paul
 * Integrates GIS, census, environmental, and cultural data
 */
const locationInsightSchema = new mongoose.Schema({
  // Core Geospatial Data
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },

  // Building/Location Identity
  address: {
    street: String,
    city: { type: String, default: 'Saint Paul' },
    state: { type: String, default: 'MN' },
    zip: String
  },
  
  parcelId: String, // Ramsey County parcel identifier
  buildingId: String, // City GIS building footprint ID
  
  category: {
    type: String,
    enum: [
      'Residential',
      'Commercial',
      'Industrial',
      'Mixed-Use',
      'Institutional',
      'Park',
      'Transit',
      'Historic',
      'Infrastructure',
      'Vacant',
      'Other'
    ],
    required: true
  },

  // Building Details (from City GIS + Assessor)
  building: {
    name: String,
    currentUse: String,
    yearBuilt: Number,
    yearRenovated: Number,
    stories: Number,
    heightMeters: Number, // LiDAR-derived
    squareFeet: Number,
    architect: String,
    architecturalStyle: String,
    
    // Energy & Sustainability
    energyRating: {
      type: String,
      enum: ['LEED Platinum', 'LEED Gold', 'LEED Silver', 'LEED Certified', 'Energy Star', 'None', 'Unknown']
    },
    solarPanels: Boolean,
    greenRoof: Boolean,
    
    // Accessibility
    accessibility: {
      adaCompliant: Boolean,
      elevator: Boolean,
      rampAccess: Boolean
    },
    
    // Current Tenants/Uses
    tenants: [String],
    businesses: [{
      name: String,
      type: String,
      website: String
    }]
  },

  // Property Data (Ramsey County Assessor)
  property: {
    assessedValue: Number,
    marketValue: Number,
    taxYear: Number,
    owner: String,
    ownerType: {
      type: String,
      enum: ['Private', 'Public', 'Non-Profit', 'Religious', 'Government', 'Unknown']
    },
    landUse: String,
    zoning: String
  },

  // Neighborhood Metrics (calculated/aggregated)
  metrics: {
    walkability: {
      type: Number,
      min: 0,
      max: 100,
      description: 'Walk Score (0-100)'
    },
    transitScore: {
      type: Number,
      min: 0,
      max: 100,
      description: 'Transit accessibility score'
    },
    bikeScore: {
      type: Number,
      min: 0,
      max: 100
    },
    greenSpace: {
      acresWithinHalfMile: Number,
      percentCanopy: Number,
      nearestParkMeters: Number
    },
    crimeRate: {
      score: Number, // Incidents per 1000 residents
      category: {
        type: String,
        enum: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
      },
      year: Number
    },
    noiseLevelDb: Number // EPA acoustic modeling
  },

  // Demographics (Census block group)
  demographics: {
    blockGroup: String, // FIPS code
    population: Number,
    households: Number,
    medianIncome: Number,
    medianAge: Number,
    diversityIndex: Number, // 0-1, Simpson's diversity
    race: {
      white: Number,
      black: Number,
      asian: Number,
      hispanic: Number,
      nativeAmerican: Number,
      other: Number
    },
    education: {
      highSchool: Number, // % completion
      bachelors: Number,
      graduate: Number
    },
    censusYear: Number
  },

  // Environmental Data
  environmental: {
    airQuality: {
      aqi: Number, // EPA Air Quality Index
      pm25: Number, // PM2.5 concentration
      category: {
        type: String,
        enum: ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous']
      },
      lastUpdated: Date
    },
    treeCanopy: {
      percentCoverage: Number,
      treeCount: Number,
      dominantSpecies: [String]
    },
    floodRisk: {
      zone: String, // FEMA flood zone
      riskLevel: {
        type: String,
        enum: ['Minimal', 'Moderate', 'High', 'Very High']
      },
      baseFloodElevation: Number
    },
    heatIsland: Number // Temperature differential vs. rural areas (°C)
  },

  // Transit Accessibility
  transit: {
    nearestStops: [{
      name: String,
      route: String,
      type: { type: String, enum: ['Bus', 'Light Rail', 'Commuter Rail'] },
      distanceMeters: Number
    }],
    isochrones: {
      walk5min: Object, // GeoJSON polygon
      walk10min: Object,
      walk15min: Object
    }
  },

  // Historical Context (linking to existing data)
  historical: {
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HistoricalEvent'
    }],
    landmarks: [String],
    significance: String,
    nrhpListed: Boolean, // National Register of Historic Places
    nrhpNumber: String,
    heritageDesignation: String,
    indigenousHistory: {
      dakotaPlacename: String,
      culturalSignificance: String,
      sacredSite: Boolean
    }
  },

  // 3D Visualization Data
  visualization: {
    footprintGeoJSON: Object, // Building outline polygon
    roofType: {
      type: String,
      enum: ['Flat', 'Gabled', 'Hipped', 'Mansard', 'Gambrel', 'Complex', 'Unknown']
    },
    dominantMaterial: {
      type: String,
      enum: ['Brick', 'Wood', 'Concrete', 'Glass', 'Steel', 'Stone', 'Mixed', 'Unknown']
    },
    texturePalette: [String], // Hex colors for procedural generation
    lodLevels: {
      low: String, // Simplified geometry reference
      medium: String,
      high: String
    }
  },

  // Data Provenance
  dataSources: [{
    source: String, // 'City GIS', 'Ramsey County Assessor', 'Census ACS', etc.
    lastUpdated: Date,
    accuracy: String,
    url: String
  }],

  // Metadata
  verified: {
    type: Boolean,
    default: false,
    description: 'Community or expert verification'
  },
  lastVerified: Date,
  verifiedBy: String,
  
  notes: String,
  tags: [String]

}, {
  timestamps: true,
  collection: 'locationinsights'
});

// Geospatial index for location queries
locationInsightSchema.index({ location: '2dsphere' });

// Common query indexes
locationInsightSchema.index({ category: 1 });
locationInsightSchema.index({ 'building.yearBuilt': 1 });
locationInsightSchema.index({ 'property.zoning': 1 });
locationInsightSchema.index({ 'historical.nrhpListed': 1 });
locationInsightSchema.index({ parcelId: 1 });
locationInsightSchema.index({ buildingId: 1 });

// Text search index
locationInsightSchema.index({
  'building.name': 'text',
  'address.street': 'text',
  'building.tenants': 'text',
  'historical.significance': 'text'
});

// Virtual for full address
locationInsightSchema.virtual('fullAddress').get(function() {
  if (!this.address.street) return '';
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zip}`;
});

// Method to calculate distance to a point
locationInsightSchema.methods.distanceTo = function(longitude, latitude) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = this.location.coordinates[1] * Math.PI / 180;
  const φ2 = latitude * Math.PI / 180;
  const Δφ = (latitude - this.location.coordinates[1]) * Math.PI / 180;
  const Δλ = (longitude - this.location.coordinates[0]) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Static method for nearby search
locationInsightSchema.statics.findNearby = async function(longitude, latitude, maxDistanceMeters = 500, category = null) {
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistanceMeters
      }
    }
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query);
};

// Static method for bounding box queries
locationInsightSchema.statics.findInBounds = async function(west, south, east, north, filters = {}) {
  const query = {
    location: {
      $geoWithin: {
        $box: [[west, south], [east, north]]
      }
    },
    ...filters
  };
  
  return this.find(query);
};

const LocationInsight = mongoose.model('LocationInsight', locationInsightSchema);

module.exports = LocationInsight;
