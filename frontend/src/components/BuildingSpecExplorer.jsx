import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Pagination,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { buildingSpecsAPI } from '../services/api';

const BuildingSpecExplorer = () => {
  const [specs, setSpecs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    name: '',
    style: '',
    status: '',
    yearMin: '',
    yearMax: '',
    stories: '',
    materialType: '',
    roofType: '',
    architect: '',
    sort: '-yearCompleted,name',
  });

  const loadSpecs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Build query params, omitting empty values
      const params = { page, limit: pagination.limit };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await buildingSpecsAPI.getAll(params);
      setSpecs(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load building specs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecs(1);
  }, []); // Initial load

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleApplyFilters = () => {
    loadSpecs(1);
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      style: '',
      status: '',
      yearMin: '',
      yearMax: '',
      stories: '',
      materialType: '',
      roofType: '',
      architect: '',
      sort: '-yearCompleted,name',
    });
    loadSpecs(1);
  };

  const handlePageChange = (event, value) => {
    loadSpecs(value);
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, val]) => val && key !== 'sort'
  ).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Building Specifications Explorer
      </Typography>

      {/* Filters Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Building Name"
                size="small"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Architectural Style"
                size="small"
                value={filters.style}
                onChange={(e) => handleFilterChange('style', e.target.value)}
                placeholder="e.g., Beaux-Arts, Gothic"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Architect"
                size="small"
                value={filters.architect}
                onChange={(e) => handleFilterChange('architect', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="existing">Existing</MenuItem>
                  <MenuItem value="demolished">Demolished</MenuItem>
                  <MenuItem value="under_construction">Under Construction</MenuItem>
                  <MenuItem value="planned">Planned</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Year Min"
                size="small"
                type="number"
                value={filters.yearMin}
                onChange={(e) => handleFilterChange('yearMin', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Year Max"
                size="small"
                type="number"
                value={filters.yearMax}
                onChange={(e) => handleFilterChange('yearMax', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Stories"
                size="small"
                type="number"
                value={filters.stories}
                onChange={(e) => handleFilterChange('stories', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Material Type"
                size="small"
                value={filters.materialType}
                onChange={(e) => handleFilterChange('materialType', e.target.value)}
                placeholder="e.g., limestone, brick"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Roof Type"
                size="small"
                value={filters.roofType}
                onChange={(e) => handleFilterChange('roofType', e.target.value)}
                placeholder="e.g., gable, flat"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sort}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <MenuItem value="yearCompleted,name">Year ↑, Name ↑</MenuItem>
                  <MenuItem value="-yearCompleted,name">Year ↓, Name ↑</MenuItem>
                  <MenuItem value="name">Name ↑</MenuItem>
                  <MenuItem value="-name">Name ↓</MenuItem>
                  <MenuItem value="architecturalStyle,name">Style ↑, Name ↑</MenuItem>
                  <MenuItem value="-height.stories,name">Stories ↓, Name ↑</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
                <Button variant="outlined" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Results Summary */}
      {!loading && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {specs.length} of {pagination.total} buildings (Page {pagination.page} of{' '}
            {pagination.totalPages})
          </Typography>
          <Stack direction="row" spacing={1}>
            {pagination.hasPrev && <Chip label="← Prev" size="small" color="primary" />}
            {pagination.hasNext && <Chip label="Next →" size="small" color="primary" />}
          </Stack>
        </Box>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Results Grid */}
      {!loading && (
        <>
          <Grid container spacing={2}>
            {specs.map((spec) => (
              <Grid item xs={12} md={6} lg={4} key={spec._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {spec.name}
                    </Typography>
                    <Stack spacing={1}>
                      {spec.architecturalStyle && (
                        <Chip label={spec.architecturalStyle} size="small" color="primary" />
                      )}
                      {spec.status && (
                        <Chip
                          label={spec.status}
                          size="small"
                          color={spec.status === 'existing' ? 'success' : 'default'}
                        />
                      )}
                      {spec.yearCompleted && (
                        <Typography variant="body2">Built: {spec.yearCompleted}</Typography>
                      )}
                      {spec.architect && (
                        <Typography variant="body2" color="text.secondary">
                          Architect: {spec.architect}
                        </Typography>
                      )}
                      {spec.height?.stories && (
                        <Typography variant="body2">{spec.height.stories} stories</Typography>
                      )}
                      {spec.centroid && (
                        <Typography variant="caption" color="text.secondary">
                          {spec.centroid.lat.toFixed(4)}, {spec.centroid.lon.toFixed(4)}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default BuildingSpecExplorer;
