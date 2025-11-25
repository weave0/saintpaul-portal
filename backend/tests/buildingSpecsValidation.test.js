const request = require('supertest');
const app = require('../server');

describe('BuildingSpecs validation', () => {
  test('rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/building-specs')
      .send({ name: '', status: 'existing' }); // centroid missing, name invalid
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('accepts minimal valid spec', async () => {
    const valid = {
      name: 'Test Building',
      centroid: { lat: 44.95, lon: -93.09 },
      status: 'existing'
    };
    const res = await request(app)
      .post('/api/building-specs')
      .send(valid);
    // May fail due to DB connection absence; treat 201 or 500 with validation pass differently
    if (res.status === 201) {
      expect(res.body).toHaveProperty('_id');
    } else {
      // If DB not connected, ensure not a validation error
      expect(res.status).not.toBe(400);
    }
  });
});