const mongoose = require('mongoose');

/**
 * ReconstructionSnapshot
 * Represents a curated set of BuildingSpec references for a given year (or range)
 * enabling time-versioned reconstruction queries.
 */
const ReconstructionSnapshotSchema = new mongoose.Schema({
  year: { type: Number, required: true, min: 1600, max: 2100 },
  label: { type: String, trim: true, maxlength: 200 }, // e.g. "Gilded Age Peak"
  description: { type: String, maxlength: 2000 },
  specRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BuildingSpec' }],
  sources: [{
    name: { type: String, trim: true, maxlength: 200 },
    url: { type: String, maxlength: 500 },
    year: { type: Number, min: 1600, max: 2100 },
    note: { type: String, maxlength: 1000 }
  }],
  completenessPercent: { type: Number, min: 0, max: 100 },
  methodology: { type: String, maxlength: 2000 }
}, { timestamps: true });

ReconstructionSnapshotSchema.index({ year: 1 });
ReconstructionSnapshotSchema.index({ year: 1, label: 1 });
ReconstructionSnapshotSchema.index({ createdAt: 1 });

module.exports = mongoose.model('ReconstructionSnapshot', ReconstructionSnapshotSchema);
