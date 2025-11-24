const express = require('express');
const router = express.Router();
const LocationInsight = require('../models/LocationInsight');

/**
 * GET /api/insights
 * Query location insights with filtering, spatial queries, and pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      // Pagination
      page = 1,
      limit = 50,
      
      // Spatial queries
      near_lon,
      near_lat,
      max_distance = 500, // meters
      bbox, // west,south,east,north
      
      // Filters
      category,
      min_year,
      max_year,
      min_walkability,
      zoning,
      nrhp_listed,
      
      // Search
      search,
      
      // Sorting
      sort = '-building.yearBuilt'
    } = req.query;
    
    const query = {};
    
    // Spatial query: nearby search
    if (near_lon && near_lat) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(near_lon), parseFloat(near_lat)]
          },
          $maxDistance: parseInt(max_distance)
        }
      };
    }
    
    // Spatial query: bounding box
    if (bbox) {
      const [west, south, east, north] = bbox.split(',').map(Number);
      query.location = {
        $geoWithin: {
          $box: [[west, south], [east, north]]
        }
      };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Year range filter
    if (min_year || max_year) {
      query['building.yearBuilt'] = {};
      if (min_year) query['building.yearBuilt'].$gte = parseInt(min_year);
      if (max_year) query['building.yearBuilt'].$lte = parseInt(max_year);
    }
    
    // Walkability filter
    if (min_walkability) {
      query['metrics.walkability'] = { $gte: parseInt(min_walkability) };
    }
    
    // Zoning filter
    if (zoning) {
      query['property.zoning'] = new RegExp(zoning, 'i');
    }
    
    // Historic listing filter
    if (nrhp_listed !== undefined) {
      query['historical.nrhpListed'] = nrhp_listed === 'true';
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const insights = await LocationInsight.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('historical.events', 'title year description');
    
    const total = await LocationInsight.countDocuments(query);
    
    res.json({
      insights,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Insights query error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/insights/:id
 * Get detailed information for a single location
 */
router.get('/:id', async (req, res) => {
  try {
    const insight = await LocationInsight.findById(req.params.id)
      .populate('historical.events', 'title year description category significance');
    
    if (!insight) {
      return res.status(404).json({ error: 'Location insight not found' });
    }
    
    res.json(insight);
    
  } catch (error) {
    console.error('Insight fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/insights/coordinates/:lon/:lat
 * Get insight by exact coordinates or nearest location
 */
router.get('/coordinates/:lon/:lat', async (req, res) => {
  try {
    const lon = parseFloat(req.params.lon);
    const lat = parseFloat(req.params.lat);
    const tolerance = parseFloat(req.query.tolerance) || 10; // meters
    
    // Try exact match first
    let insight = await LocationInsight.findOne({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lon, lat] },
          $maxDistance: tolerance
        }
      }
    }).populate('historical.events');
    
    if (!insight) {
      return res.status(404).json({ error: 'No location found at coordinates' });
    }
    
    // Calculate actual distance
    const distance = insight.distanceTo(lon, lat);
    
    res.json({
      ...insight.toObject(),
      _meta: {
        distance,
        queryCoordinates: [lon, lat]
      }
    });
    
  } catch (error) {
    console.error('Coordinate lookup error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/insights/heatmap/:metric
 * Get aggregated data for heatmap visualizations
 */
router.get('/heatmap/:metric', async (req, res) => {
  try {
    const { metric } = req.params;
    const { bbox, resolution = 0.005 } = req.query; // resolution in degrees
    
    // Validate metric
    const validMetrics = [
      'demographics.population',
      'demographics.medianIncome',
      'metrics.walkability',
      'metrics.transitScore',
      'environmental.treeCanopy.percentCoverage',
      'environmental.airQuality.aqi',
      'property.marketValue'
    ];
    
    if (!validMetrics.includes(metric)) {
      return res.status(400).json({ 
        error: 'Invalid metric',
        validMetrics 
      });
    }
    
    // Parse bounding box
    let bounds = {};
    if (bbox) {
      const [west, south, east, north] = bbox.split(',').map(Number);
      bounds = {
        location: {
          $geoWithin: {
            $box: [[west, south], [east, north]]
          }
        }
      };
    }
    
    // Aggregate data into grid cells
    const data = await LocationInsight.aggregate([
      { $match: bounds },
      {
        $group: {
          _id: {
            lon: {
              $floor: {
                $divide: [
                  { $arrayElemAt: ['$location.coordinates', 0] },
                  parseFloat(resolution)
                ]
              }
            },
            lat: {
              $floor: {
                $divide: [
                  { $arrayElemAt: ['$location.coordinates', 1] },
                  parseFloat(resolution)
                ]
              }
            }
          },
          value: { $avg: `$${metric}` },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          lon: { $multiply: ['$_id.lon', parseFloat(resolution)] },
          lat: { $multiply: ['$_id.lat', parseFloat(resolution)] },
          value: 1,
          count: 1
        }
      }
    ]);
    
    res.json({
      metric,
      resolution: parseFloat(resolution),
      points: data.length,
      data
    });
    
  } catch (error) {
    console.error('Heatmap error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/insights/nearby/:lon/:lat
 * Find points of interest near coordinates
 */
router.get('/nearby/:lon/:lat', async (req, res) => {
  try {
    const lon = parseFloat(req.params.lon);
    const lat = parseFloat(req.params.lat);
    const {
      max_distance = 500,
      category,
      limit = 20
    } = req.query;
    
    const query = {
      category,
      limit: parseInt(limit),
      maxDistance: parseInt(max_distance)
    };
    
    const nearby = await LocationInsight.findNearby(lon, lat, query.maxDistance, query.category);
    
    // Add distances and sort
    const results = nearby.slice(0, query.limit).map(location => {
      const distance = location.distanceTo(lon, lat);
      return {
        ...location.toObject(),
        _distance: distance
      };
    }).sort((a, b) => a._distance - b._distance);
    
    res.json({
      center: [lon, lat],
      radius: query.maxDistance,
      count: results.length,
      locations: results
    });
    
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/insights/statistics/summary
 * Get citywide statistics
 */
router.get('/statistics/summary', async (req, res) => {
  try {
    const stats = await LocationInsight.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          byDecade: [
            {
              $group: {
                _id: {
                  $multiply: [
                    { $floor: { $divide: ['$building.yearBuilt', 10] } },
                    10
                  ]
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],
          
          walkabilityAvg: [
            {
              $group: {
                _id: null,
                average: { $avg: '$metrics.walkability' },
                min: { $min: '$metrics.walkability' },
                max: { $max: '$metrics.walkability' }
              }
            }
          ],
          
          propertyValues: [
            {
              $group: {
                _id: null,
                median: { $median: { input: '$property.marketValue', method: 'approximate' } },
                average: { $avg: '$property.marketValue' }
              }
            }
          ]
        }
      }
    ]);
    
    res.json({
      total: stats[0].total[0]?.count || 0,
      byCategory: stats[0].byCategory,
      byDecade: stats[0].byDecade,
      walkability: stats[0].walkabilityAvg[0] || {},
      propertyValues: stats[0].propertyValues[0] || {}
    });
    
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
