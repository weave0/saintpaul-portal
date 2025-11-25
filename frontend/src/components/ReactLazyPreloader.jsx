import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const ReactLazyPreloader = ({ label = 'Loading...' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
    <CircularProgress size={48} sx={{ mb: 2 }} />
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
  </Box>
);

export default ReactLazyPreloader;