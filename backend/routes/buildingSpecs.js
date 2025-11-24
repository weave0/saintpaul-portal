const express = require('express');
const router = express.Router();
const BuildingSpec = require('../models/BuildingSpec');
const mongoose = require('mongoose');
const { writeLimiter } = require('../middleware/rateLimiter');

/**
 * @typedef {import('../types').BuildingSpec} BuildingSpec
 * @typedef {import('../types').BuildingSpecQueryParams} BuildingSpecQueryParams
 * @typedef {import('../types').PaginatedBuildingSpecResponse} PaginatedBuildingSpecResponse
 */

// GET all / filtered building specs with pagination, sorting, and field selection
router.get('/', async (req, res) => {
  try {
    const {
      beforeYear, status, style, architect, name, nearLat, nearLon, radiusMeters, bbox,
      page = 1, limit = 50, sort = 'yearCompleted,name', fields, yearMin, yearMax,
      stories, materialType, roofType
    } = req.query;

    // Build filter query
    const query = {};
    if (status) query.status = status;
    if (style) query.architecturalStyle = { $regex: style, $options: 'i' };
    if (architect) query.architect = { $regex: architect, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };
    if (materialType) query['materials.material'] = { $regex: materialType, $options: 'i' };
    if (roofType) query['roof'] = { $regex: roofType, $options: 'i' };
    if (stories) query['height.stories'] = Number(stories);

    // Year range filter (supersedes deprecated beforeYear)
    if (yearMin || yearMax || beforeYear) {
      const minY = yearMin ? Number(yearMin) : undefined;
      const maxY = (yearMax || beforeYear) ? Number(yearMax || beforeYear) : undefined;
      if (minY != null && maxY != null) {
        query.$or = [
          { yearCompleted: { $gte: minY, $lte: maxY } },
          { yearConstructed: { $gte: minY, $lte: maxY } }
        ];
      } else if (minY != null) {
        query.$or = [
          { yearCompleted: { $gte: minY } },
          { yearConstructed: { $gte: minY } }
        ];
      } else if (maxY != null) {
        query.$or = [
          { yearCompleted: { $lte: maxY } },
          { yearConstructed: { $lte: maxY } }
        ];
      }
    }

    // Proximity filter (approximate bounding box)
    if (nearLat && nearLon && radiusMeters) {
      const rDeg = Number(radiusMeters) / 111320; // approx meters->degrees
      query['centroid.lat'] = { $gte: Number(nearLat) - rDeg, $lte: Number(nearLat) + rDeg };
      query['centroid.lon'] = { $gte: Number(nearLon) - rDeg, $lte: Number(nearLon) + rDeg };
    }

    // Bounding box spatial query (overrides proximity if provided)
    if (bbox) {
      const parts = bbox.split(',').map(Number);
      if (parts.length === 4) {
        const [minLon, minLat, maxLon, maxLat] = parts;
        query.footprintGeo = {
          $geoIntersects: {
            $geometry: {
              type: 'Polygon',
              coordinates: [[
                [minLon, minLat],
                [maxLon, minLat],
                [maxLon, maxLat],
                [minLon, maxLat],
                [minLon, minLat]
              ]]
            }
          }
        };
      }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10))); // cap at 500
    const skip = (pageNum - 1) * limitNum;

    // Parse sort parameter (comma-separated fields, prefix - for descending)
    const sortObj = {};
    sort.split(',').forEach(field => {
      const trimmed = field.trim();
      if (trimmed.startsWith('-')) {
        sortObj[trimmed.substring(1)] = -1;
      } else {
        sortObj[trimmed] = 1;
      }
    });

    // Field projection (comma-separated)
    const projection = fields ? fields.split(',').reduce((acc, f) => {
      acc[f.trim()] = 1;
      return acc;
    }, {}) : null;

    // Execute query with count for pagination metadata
    const [specs, totalCount] = await Promise.all([
      BuildingSpec.find(query, projection)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      BuildingSpec.countDocuments(query)
    ]);

    res.json({
      data: specs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single spec
router.get('/:id', async (req, res) => {
  try {
    const spec = await BuildingSpec.findById(req.params.id).populate('locationRef');
    if (!spec) return res.status(404).json({ error: 'BuildingSpec not found' });
    res.json(spec);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create spec
router.post('/', async (req, res) => {
  try {
    const spec = new BuildingSpec(req.body);
    await spec.save();
    res.status(201).json(spec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update spec
router.put('/:id', writeLimiter, async (req, res) => {
  try {
    const spec = await BuildingSpec.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!spec) return res.status(404).json({ error: 'BuildingSpec not found' });
    res.json(spec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', writeLimiter, async (req, res) => {
  try {
    const spec = await BuildingSpec.findByIdAndDelete(req.params.id);
    if (!spec) return res.status(404).json({ error: 'BuildingSpec not found' });
    res.json({ message: 'BuildingSpec deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// Quality dashboard endpoint (aggregation)
router.get('/__quality/dashboard', async (req, res) => {
  try {
    const total = await BuildingSpec.countDocuments();
    const styleMissing = await BuildingSpec.countDocuments({ architecturalStyle: { $in: [null, ''] } });
    const heightMissing = await BuildingSpec.countDocuments({ $or: [ { 'height.roofHeight_m': { $exists: false } }, { 'height.roofHeight_m': null } ] });
    const avgCompleteness = await BuildingSpec.aggregate([
      { $match: { 'dataQuality.completenessPercent': { $gte: 0 } } },
      { $group: { _id: null, avg: { $avg: '$dataQuality.completenessPercent' } } }
    ]);
    const confidenceCounts = await BuildingSpec.aggregate([
      { $unwind: '$sources' },
      { $group: { _id: '$sources.confidence', count: { $sum: 1 } } }
    ]);
    res.json({
      total,
      fieldsMissing: {
        architecturalStyle: styleMissing,
        roofHeight: heightMissing
      },
      avgCompleteness: avgCompleteness[0]?.avg ?? null,
      sourceConfidenceDistribution: confidenceCounts.reduce((acc, c) => { acc[c._id || 'unknown'] = c.count; return acc; }, {})
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CSV export endpoint (supports same filters as list route + fields selection)
router.get('/__export/csv', async (req, res) => {
  try {
    const {
      beforeYear, status, style, architect, name,
      nearLat, nearLon, radiusMeters, bbox,
      yearMin, yearMax, stories, materialType, roofType,
      fields = 'name,centroid.lat,centroid.lon,architecturalStyle,yearConstructed,yearCompleted,status'
    } = req.query;

    // Build query identical to main listing route
    const query = {};
    if (status) query.status = status;
    if (style) query.architecturalStyle = { $regex: style, $options: 'i' };
    if (architect) query.architect = { $regex: architect, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };
    if (materialType) query['materials.material'] = { $regex: materialType, $options: 'i' };
    if (roofType) query['roof'] = { $regex: roofType, $options: 'i' };
    if (stories) query['height.stories'] = Number(stories);

    // Year range filter (same semantics as main listing)
    if (yearMin || yearMax || beforeYear) {
      const minY = yearMin ? Number(yearMin) : undefined;
      const maxY = (yearMax || beforeYear) ? Number(yearMax || beforeYear) : undefined;
      if (minY != null && maxY != null) {
        query.$or = [
          { yearCompleted: { $gte: minY, $lte: maxY } },
          { yearConstructed: { $gte: minY, $lte: maxY } }
        ];
      } else if (minY != null) {
        query.$or = [
          { yearCompleted: { $gte: minY } },
          { yearConstructed: { $gte: minY } }
        ];
      } else if (maxY != null) {
        query.$or = [
          { yearCompleted: { $lte: maxY } },
          { yearConstructed: { $lte: maxY } }
        ];
      }
    }

    if (nearLat && nearLon && radiusMeters) {
      const rDeg = Number(radiusMeters) / 111320;
      query['centroid.lat'] = { $gte: Number(nearLat) - rDeg, $lte: Number(nearLat) + rDeg };
      query['centroid.lon'] = { $gte: Number(nearLon) - rDeg, $lte: Number(nearLon) + rDeg };
    }

    // Parse requested fields
    const fieldList = fields.split(',').map(f => f.trim()).filter(Boolean);
    const projection = {};
    fieldList.forEach(f => { projection[f] = 1; });

    let mongoQuery = BuildingSpec.find(query, projection).sort({ yearCompleted: 1, name: 1 });

    if (bbox) {
      const parts = bbox.split(',').map(Number);
      if (parts.length === 4) {
        const [minLon, minLat, maxLon, maxLat] = parts;
        query.footprintGeo = {
          $geoIntersects: {
            $geometry: {
              type: 'Polygon',
              coordinates: [[
                [minLon, minLat],
                [maxLon, minLat],
                [maxLon, maxLat],
                [minLon, maxLat],
                [minLon, minLat]
              ]]
            }
          }
        };
      }
    }

    mongoQuery = BuildingSpec.find(query, projection).sort({ yearCompleted: 1, name: 1 });

    const specs = await mongoQuery.lean();

    const header = fieldList.join(',');
    const rows = specs.map(spec => {
      return fieldList.map(f => {
        const parts = f.split('.');
        let val = spec;
        for (const p of parts) {
          if (val == null) break;
          val = val[p];
        }
        if (val === null || val === undefined) return '';
        if (Array.isArray(val)) {
          val = val.map(v => typeof v === 'object' ? JSON.stringify(v) : v).join('|');
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        const s = String(val).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      }).join(',');
    });

    const csv = [header, ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="building-specs.csv"');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
