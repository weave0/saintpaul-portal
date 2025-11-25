const request = require('supertest');
const app = require('../server');

describe('Readiness endpoint', () => {
  it('returns readiness status structure', async () => {
    const res = await request(app).get('/api/readiness');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('ready');
    expect(typeof res.body.ready).toBe('boolean');
    expect(res.body).toHaveProperty('timestamp');
  });
});
