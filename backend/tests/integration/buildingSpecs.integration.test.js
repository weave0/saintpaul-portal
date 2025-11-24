const request = require('supertest');
const { connect, close } = require('../helpers/memoryServer');
const BuildingSpec = require('../../models/BuildingSpec');
const app = require('../../server');

async function seed() {
  const docs = [
    {
      name: 'Cathedral of Saint Paul',
      centroid: { lat: 44.9463, lon: -93.1099 },
      architecturalStyle: 'Beaux-Arts',
      yearConstructed: 1906,
      yearCompleted: 1915,
      height: { stories: 5, roofHeight_m: 61 },
      materials: [{ material: 'limestone', percentage: 70 }],
      roof: 'dome',
      footprint: [[-93.11,44.94],[-93.11,44.95],[-93.10,44.95],[-93.10,44.94]],
      status: 'existing'
    },
    {
      name: 'Minnesota State Capitol',
      centroid: { lat: 44.9551, lon: -93.1022 },
      architecturalStyle: 'Beaux-Arts',
      yearConstructed: 1896,
      yearCompleted: 1905,
      height: { stories: 4, roofHeight_m: 54 },
      materials: [{ material: 'marble', percentage: 80 }],
      roof: 'dome',
      footprint: [[-93.102,44.954],[-93.102,44.956],[-93.101,44.956],[-93.101,44.954]],
      status: 'existing'
    },
    {
      name: 'Landmark Center',
      centroid: { lat: 44.9447, lon: -93.0993 },
      architecturalStyle: 'Romanesque Revival',
      yearConstructed: 1892,
      yearCompleted: 1902,
      height: { stories: 5, roofHeight_m: 45 },
      materials: [{ material: 'sandstone', percentage: 60 }],
      roof: 'hip',
      footprint: [[-93.100,44.944],[-93.100,44.945],[-93.099,44.945],[-93.099,44.944]],
      status: 'existing'
    },
    {
      name: 'West Publishing Building',
      centroid: { lat: 44.9469, lon: -93.0984 },
      architecturalStyle: 'Art Deco',
      yearConstructed: 1938,
      yearCompleted: 1940,
      height: { stories: 8, roofHeight_m: 40 },
      materials: [{ material: 'brick', percentage: 50 }],
      roof: 'flat',
      footprint: [[-93.099,44.946],[-93.099,44.947],[-93.098,44.947],[-93.098,44.946]],
      status: 'demolished'
    },
    {
      name: 'Hotel St. Paul',
      centroid: { lat: 44.9474, lon: -93.1015 },
      architecturalStyle: 'Gothic Revival',
      yearConstructed: 1885,
      yearCompleted: 1887,
      height: { stories: 6, roofHeight_m: 38 },
      materials: [{ material: 'brick', percentage: 65 }],
      roof: 'gable',
      footprint: [[-93.102,44.947],[-93.102,44.948],[-93.101,44.948],[-93.101,44.947]],
      status: 'demolished'
    }
  ];
  await BuildingSpec.insertMany(docs);
}

describe('Integration: /api/building-specs pagination & filters', () => {
  beforeAll(async () => {
    await connect();
    await seed();
  });

  afterAll(async () => {
    await close();
  });

  test('returns paginated results with metadata', async () => {
    const res = await request(app).get('/api/building-specs?page=1&limit=2&sort=name');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(5);
    expect(res.body.pagination.totalPages).toBeGreaterThanOrEqual(3);
  });

  test('filters by architectural style (case-insensitive)', async () => {
    const res = await request(app).get('/api/building-specs?style=beaux-arts');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    res.body.data.forEach(d => expect(d.architecturalStyle.toLowerCase()).toContain('beaux-arts'));
  });

  test('year range filter reduces set', async () => {
    const resAll = await request(app).get('/api/building-specs');
    const resRange = await request(app).get('/api/building-specs?yearMin=1930&yearMax=1950');
    expect(resRange.status).toBe(200);
    expect(resRange.body.data.length).toBeLessThan(resAll.body.data.length);
    resRange.body.data.forEach(d => {
      const c = d.yearCompleted || d.yearConstructed;
      expect(c).toBeGreaterThanOrEqual(1930);
      expect(c).toBeLessThanOrEqual(1950);
    });
  });

  test('material and roof filters', async () => {
    const res = await request(app).get('/api/building-specs?materialType=brick&roofType=flat');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    const b = res.body.data[0];
    expect(b.materials.some(m => /brick/i.test(m.material))).toBe(true);
    expect(/flat/i.test(b.roof)).toBe(true);
  });

  test('status + stories + style combined', async () => {
    const res = await request(app).get('/api/building-specs?status=existing&stories=5&style=beaux-arts');
    expect(res.status).toBe(200);
    res.body.data.forEach(d => {
      expect(d.status).toBe('existing');
      expect(d.height?.stories).toBe(5);
      expect(/beaux-arts/i.test(d.architecturalStyle)).toBe(true);
    });
  });
});
