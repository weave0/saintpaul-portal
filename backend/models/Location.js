const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  category: {
    type: String,
    enum: ['landmark', 'historical', 'cultural', 'recreational', 'educational', 'other'],
    default: 'other'
  },
  yearEstablished: Number,
  images: [{
    url: String,
    caption: String,
    year: Number
  }],
  historicalEvents: [{
    date: Date,
    title: String,
    description: String
  }],
  address: {
    street: String,
    city: { type: String, default: 'Saint Paul' },
    state: { type: String, default: 'Minnesota' },
    zip: String
  },
  metadata: {
    source: String,
    verified: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Index for geospatial queries
LocationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

module.exports = mongoose.model('Location', LocationSchema);
