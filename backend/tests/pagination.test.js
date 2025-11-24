const request = require('supertest');
const app = require('../server');
const BuildingSpec = require('../models/BuildingSpec');

jest.mock('../models/BuildingSpec');

describe('BuildingSpec Pagination & Filters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/building-specs - pagination', () => {
    it('should return paginated results with metadata', async () => {
      const mockSpecs = [
        { _id: '1', name: 'Building A', yearCompleted: 1900 },
        { _id: '2', name: 'Building B', yearCompleted: 1905 }
      ];

      BuildingSpec.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSpecs)
      });
      BuildingSpec.countDocuments = jest.fn().mockResolvedValue(25);

      const res = await request(app)
        .get('/api/building-specs?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockSpecs);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: false
      });
    });

    it('should enforce maximum limit of 500', async () => {
      BuildingSpec.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });
      BuildingSpec.countDocuments = jest.fn().mockResolvedValue(0);

      await request(app)
        .get('/api/building-specs?limit=1000');

      const limitCall = BuildingSpec.find().limit;
      expect(limitCall).toHaveBeenCalledWith(500);
    });

    it('should handle page boundaries correctly', async () => {
      BuildingSpec.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });
      BuildingSpec.countDocuments = jest.fn().mockResolvedValue(100);

      const res = await request(app)
        .get('/api/building-specs?page=5&limit=20');

      expect(res.status).toBe(200);
      expect(res.body.pagination).toMatchObject({
        page: 5,
        limit: 20,
        total: 100,
        totalPages: 5,
        hasNext: false,
        hasPrev: true
      });
      expect(BuildingSpec.find().skip).toHaveBeenCalledWith(80);
    });
  });

  describe('GET /api/building-specs - filtering', () => {
    beforeEach(() => {
      BuildingSpec.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });
      BuildingSpec.countDocuments = jest.fn().mockResolvedValue(0);
    });

    it('should apply year range filter (yearMin and yearMax)', async () => {
      await request(app)
        .get('/api/building-specs?yearMin=1890&yearMax=1920');

      const query = BuildingSpec.find.mock.calls[0][0];
      expect(query.$or).toBeDefined();
      expect(query.$or.some(q => q.yearCompleted?.$gte === 1890)).toBe(true);
      expect(query.$or.some(q => q.yearCompleted?.$lte === 1920)).toBe(true);
    });

    it('should filter by architectural style (case-insensitive)', async () => {
      await request(app)
        .get('/api/building-specs?style=gothic');

      const query = BuildingSpec.find.mock.calls[0][0];
      expect(query.architecturalStyle).toMatchObject({ $regex: 'gothic', $options: 'i' });
    });

    it('should filter by material type', async () => {
      await request(app)
        .get('/api/building-specs?materialType=limestone');

      const query = BuildingSpec.find.mock.calls[0][0];
      expect(query['materials.material']).toMatchObject({ $regex: 'limestone', $options: 'i' });
    });

    it('should filter by roof type', async () => {
      await request(app)
        .get('/api/building-specs?roofType=gable');

      const query = BuildingSpec.find.mock.calls[0][0];
      // Schema updated: roof is now a simple string field
      expect(query.roof).toMatchObject({ $regex: 'gable', $options: 'i' });
    });

    it('should filter by story count', async () => {
      await request(app)
        .get('/api/building-specs?stories=3');

      const query = BuildingSpec.find.mock.calls[0][0];
      expect(query['height.stories']).toBe(3);
    });

    it('should combine multiple filters', async () => {
      await request(app)
        .get('/api/building-specs?status=existing&style=beaux-arts&stories=5&yearMin=1900');

      const query = BuildingSpec.find.mock.calls[0][0];
      expect(query.status).toBe('existing');
      expect(query.architecturalStyle.$regex).toBe('beaux-arts');
      expect(query['height.stories']).toBe(5);
      expect(query.$or).toBeDefined();
    });
  });

  describe('GET /api/building-specs - sorting', () => {
    beforeEach(() => {
      BuildingSpec.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });
      BuildingSpec.countDocuments = jest.fn().mockResolvedValue(0);
    });

    it('should parse ascending sort fields', async () => {
      await request(app)
        .get('/api/building-specs?sort=yearCompleted,name');

      const sortCall = BuildingSpec.find().sort;
      expect(sortCall).toHaveBeenCalledWith({ yearCompleted: 1, name: 1 });
    });

    it('should parse descending sort fields (- prefix)', async () => {
      await request(app)
        .get('/api/building-specs?sort=-yearCompleted,name');

      const sortCall = BuildingSpec.find().sort;
      expect(sortCall).toHaveBeenCalledWith({ yearCompleted: -1, name: 1 });
    });

    it('should handle mixed sort directions', async () => {
      await request(app)
        .get('/api/building-specs?sort=status,-yearCompleted,name');

      const sortCall = BuildingSpec.find().sort;
      expect(sortCall).toHaveBeenCalledWith({ status: 1, yearCompleted: -1, name: 1 });
    });
  });

  describe('GET /api/building-specs - field projection', () => {
    beforeEach(() => {
      BuildingSpec.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });
      BuildingSpec.countDocuments = jest.fn().mockResolvedValue(0);
    });

    it('should project only requested fields', async () => {
      await request(app)
        .get('/api/building-specs?fields=name,yearCompleted,architecturalStyle');

      const projection = BuildingSpec.find.mock.calls[0][1];
      expect(projection).toMatchObject({
        name: 1,
        yearCompleted: 1,
        architecturalStyle: 1
      });
    });

    it('should return all fields when fields param omitted', async () => {
      await request(app)
        .get('/api/building-specs');

      const projection = BuildingSpec.find.mock.calls[0][1];
      expect(projection).toBeNull();
    });
  });

  describe('GET /api/building-specs - spatial queries', () => {
    beforeEach(() => {
      BuildingSpec.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });
      BuildingSpec.countDocuments = jest.fn().mockResolvedValue(0);
    });

    it('should build proximity filter with coordinates and radius', async () => {
      await request(app)
        .get('/api/building-specs?nearLat=44.9537&nearLon=-93.0900&radiusMeters=500');

      const query = BuildingSpec.find.mock.calls[0][0];
      expect(query['centroid.lat']).toBeDefined();
      expect(query['centroid.lon']).toBeDefined();
      expect(query['centroid.lat'].$gte).toBeDefined();
      expect(query['centroid.lat'].$lte).toBeDefined();
    });

    it('should build bounding box geoIntersects query', async () => {
      await request(app)
        .get('/api/building-specs?bbox=-93.1,44.9,-93.0,45.0');

      const query = BuildingSpec.find.mock.calls[0][0];
      expect(query.footprintGeo).toBeDefined();
      expect(query.footprintGeo.$geoIntersects).toBeDefined();
      expect(query.footprintGeo.$geoIntersects.$geometry.type).toBe('Polygon');
      expect(query.footprintGeo.$geoIntersects.$geometry.coordinates[0]).toHaveLength(5);
    });
  });
});
