const { z } = require('zod');

// Common primitives
const id = z.string().min(1).optional();
const year = z.number().int().min(1600).max(2100).optional();
const percent0to100 = z.number().min(0).max(100).optional();

// BuildingSpec schema (subset for create/update)
const buildingSpecSchema = z.object({
  name: z.string().min(1).max(300),
  centroid: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180)
  }),
  dimensions: z.object({
    length_m: z.number().min(0.1).max(500).optional(),
    width_m: z.number().min(0.1).max(500).optional()
  }).partial().optional(),
  height: z.object({
    roofHeight_m: z.number().min(0).max(200).optional(),
    eaveHeight_m: z.number().min(0).max(150).optional(),
    stories: z.number().int().min(0).max(50).optional()
  }).partial().optional(),
  materials: z.array(z.object({
    material: z.string().max(100),
    percentage: percent0to100
  })).optional(),
  roof: z.object({
    type: z.enum(['flat','gable','hip','mansard','dome','spire','shed','gambrel','other','']).optional(),
    material: z.string().max(100).optional(),
    geometryNotes: z.string().max(500).optional()
  }).partial().optional(),
  architecturalStyle: z.string().max(150).optional(),
  yearConstructed: year,
  status: z.enum(['existing','demolished','under_construction','planned']),
  sources: z.array(z.object({
    name: z.string().max(200).optional(),
    year: year,
    url: z.string().url().max(500).optional(),
    type: z.enum(['map','photograph','drawing','survey','permit','narrative','other','']),
    rawReference: z.string().max(300).optional(),
    confidence: z.enum(['very_high','high','medium','low','estimated']).optional()
  })).optional()
});

// Location schema
const locationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }),
  category: z.enum(['landmark','historical','cultural','recreational','educational','other']).optional(),
  yearEstablished: z.number().int().min(1600).max(2100).optional()
});

// HistoricalEvent schema
const historicalEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  category: z.enum(['political','cultural','economic','social','infrastructure','other']).optional(),
  significance: z.enum(['local','regional','national','international']).optional(),
  tags: z.array(z.string()).optional()
});

module.exports = {
  buildingSpecSchema,
  locationSchema,
  historicalEventSchema
};