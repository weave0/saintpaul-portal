const mongoose = require('mongoose');

const HistoricalEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  endDate: Date,
  category: {
    type: String,
    enum: ['political', 'cultural', 'economic', 'social', 'infrastructure', 'other'],
    default: 'other'
  },
  relatedLocations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  images: [{
    url: String,
    caption: String,
    credit: String
  }],
  sources: [{
    title: String,
    url: String,
    author: String,
    year: Number
  }],
  significance: {
    type: String,
    enum: ['local', 'regional', 'national', 'international'],
    default: 'local'
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for timeline queries
HistoricalEventSchema.index({ date: 1 });
HistoricalEventSchema.index({ category: 1 });

module.exports = mongoose.model('HistoricalEvent', HistoricalEventSchema);
