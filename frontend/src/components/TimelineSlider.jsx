import React from 'react';
import { Box, Slider, Typography, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: '#1a4d7d',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 12,
    width: 2,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
  '& .MuiSlider-markLabel': {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#333',
  },
}));

const TimelineSlider = ({ value, onChange, snapshots }) => {
  const years = snapshots.map(s => s.year);
  const min = Math.min(...years);
  const max = Math.max(...years);
  
  const marks = snapshots.map(snapshot => ({
    value: snapshot.year,
    label: `${snapshot.year}`
  }));

  const currentSnapshot = snapshots.find(s => s.year === value) || snapshots[0];

  const handleChange = (event, newValue) => {
    // Snap to nearest year in snapshots
    const nearest = years.reduce((prev, curr) => 
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
    );
    onChange(nearest);
  };

  return (
    <Paper 
      elevation={4}
      sx={{ 
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 900,
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        zIndex: 1000
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a4d7d' }}>
          Historical Timeline
        </Typography>
        <Chip 
          label={currentSnapshot.era}
          color="primary"
          sx={{ fontWeight: 600 }}
        />
      </Box>
      
      <Typography variant="body2" sx={{ mb: 3, color: '#666', minHeight: 40 }}>
        <strong>{value}:</strong> {currentSnapshot.description}
      </Typography>

      <Box sx={{ px: 2 }}>
        <StyledSlider
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={null}
          marks={marks}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => val}
        />
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: '#666', mr: 1 }}>
          Quick Jump:
        </Typography>
        {snapshots.map(snapshot => (
          <Chip
            key={snapshot.year}
            label={snapshot.year}
            size="small"
            onClick={() => onChange(snapshot.year)}
            variant={value === snapshot.year ? "filled" : "outlined"}
            color={value === snapshot.year ? "primary" : "default"}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default TimelineSlider;
