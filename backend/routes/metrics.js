const express = require('express');
const router = express.Router();
const BuildingSpec = require('../models/BuildingSpec');
const ReconstructionSnapshot = require('../models/ReconstructionSnapshot');
const diffCache = require('../utils/diffCache');

// Basic metrics & health aggregation
router.get('/basic', async (req, res, next) => {
  try {
    const [specCount, snapshotCount] = await Promise.all([
      BuildingSpec.countDocuments(),
      ReconstructionSnapshot.countDocuments()
    ]);

    const diffStats = diffCache.getStats();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      counts: {
        buildingSpecs: specCount,
        reconstructionSnapshots: snapshotCount
      },
      diffCache: diffStats,
      memory: process.memoryUsage()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
