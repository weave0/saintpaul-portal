import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Locations API
export const locationsAPI = {
  getAll: (params) => api.get('/locations', { params }),
  getById: (id) => api.get(`/locations/${id}`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

// Historical Events API
export const historyAPI = {
  getAll: (params) => api.get('/history', { params }),
  getTimeline: () => api.get('/history/timeline'),
  getById: (id) => api.get(`/history/${id}`),
  create: (data) => api.post('/history', data),
  update: (id, data) => api.put(`/history/${id}`, data),
  delete: (id) => api.delete(`/history/${id}`),
};

// BuildingSpecs API (with pagination & filtering)
export const buildingSpecsAPI = {
  /**
   * Get paginated and filtered building specs
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (1-indexed)
   * @param {number} params.limit - Results per page (max 500)
   * @param {string} params.sort - Comma-separated fields (prefix - for desc)
   * @param {string} params.fields - Comma-separated field projection
   * @param {string} params.status - Filter by status (existing, demolished, etc.)
   * @param {string} params.style - Architectural style regex
   * @param {string} params.architect - Architect name regex
   * @param {string} params.name - Building name regex
   * @param {number} params.yearMin - Minimum year (constructed/completed)
   * @param {number} params.yearMax - Maximum year (constructed/completed)
   * @param {number} params.stories - Exact story count
   * @param {string} params.materialType - Material regex
   * @param {string} params.roofType - Roof type regex
   * @param {number} params.nearLat - Latitude for proximity filter
   * @param {number} params.nearLon - Longitude for proximity filter
   * @param {number} params.radiusMeters - Radius in meters (used with nearLat/nearLon)
   * @param {string} params.bbox - Bounding box: minLon,minLat,maxLon,maxLat
   * @returns {Promise<{data: Array, pagination: Object}>}
   */
  getAll: (params) => api.get('/building-specs', { params }),
  getById: (id) => api.get(`/building-specs/${id}`),
  create: (data) => api.post('/building-specs', data),
  update: (id, data) => api.put(`/building-specs/${id}`, data),
  delete: (id) => api.delete(`/building-specs/${id}`),
  exportCSV: (params) => api.get('/building-specs/__export/csv', { params, responseType: 'blob' }),
  getQualityDashboard: () => api.get('/building-specs/__quality/dashboard'),
};

// Reconstruction Snapshots API
export const reconstructionsAPI = {
  getAll: (params) => api.get('/reconstructions', { params }),
  getById: (id) => api.get(`/reconstructions/${id}`),
  create: (data) => api.post('/reconstructions', data),
  update: (id, data) => api.put(`/reconstructions/${id}`, data),
  delete: (id) => api.delete(`/reconstructions/${id}`),
  getDiff: (fromId, toId) => api.get(`/reconstructions/diff?from=${fromId}&to=${toId}`),
  autoGenerate: (params) => api.post('/reconstructions/auto-generate', null, { params }),
};

export default api;
