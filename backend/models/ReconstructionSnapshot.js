const mongoose = require('mongoose');

/**
 * ReconstructionSnapshot
 * Represents a curated set of BuildingSpec references for a given year (or range)
 * enabling time-versioned reconstruction queries.
 */
const ReconstructionSnapshotSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  label: String, // e.g. "Gilded Age Peak"
  description: String,
  specRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BuildingSpec' }],
  sources: [{
    name: String,
    url: String,
    year: Number,
    note: String
  }],
  completenessPercent: Number,
  methodology: String
}, { timestamps: true });

ReconstructionSnapshotSchema.index({ year: 1 });

module.exports = mongoose.model('ReconstructionSnapshot', ReconstructionSnapshotSchema);
