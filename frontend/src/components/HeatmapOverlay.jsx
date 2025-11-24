import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Paper, Switch, FormControlLabel } from '@mui/material';

/**
 * HeatmapOverlay: Renders a 3D grid of colored tiles based on insight metrics
 * Fetches data from /api/insights/heatmap/:metric and displays it as height-mapped tiles
 */
const HeatmapOverlay = ({ metric = 'population', gridSize = 50, visible = true }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(metric);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    
    setLoading(true);
    fetch(`/api/insights/heatmap/${selectedMetric}?gridSize=${gridSize}`)
      .then(r => r.json())
      .then(data => {
        setHeatmapData(data.grid || []);
      })
      .catch(err => {
        console.warn('Heatmap fetch error:', err);
        setHeatmapData([]);
      })
      .finally(() => setLoading(false));
  }, [selectedMetric, gridSize, visible]);

  if (!visible || loading || heatmapData.length === 0) return null;

  // Normalize values to 0-1 range for color mapping
  const values = heatmapData.map(cell => cell.value);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  // Color interpolation: blue (low) -> yellow -> red (high)
  const getColor = (normalized) => {
    if (normalized < 0.5) {
      // Blue to yellow
      const t = normalized * 2;
      return `rgb(${Math.round(t * 255)}, ${Math.round(t * 255)}, ${Math.round((1 - t) * 255)})`;
    } else {
      // Yellow to red
      const t = (normalized - 0.5) * 2;
      return `rgb(255, ${Math.round((1 - t) * 255)}, 0)`;
    }
  };

  return (
    <group>
      {heatmapData.map((cell, idx) => {
        const normalized = (cell.value - minValue) / range;
        const color = getColor(normalized);
        const height = normalized * 20; // Height reflects intensity
        
        // Convert geo coordinates to 3D scene coordinates
        const x = (cell.center[0] - (-93.1)) * 10000;
        const z = (cell.center[1] - 44.95) * 10000;
        
        return (
          <mesh
            key={`heatcell-${idx}`}
            position={[x, height / 2, z]}
            receiveShadow
          >
            <boxGeometry args={[gridSize * 0.8, height || 0.5, gridSize * 0.8]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.6}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * HeatmapControls: UI panel to toggle heatmap and select metric
 */
export const HeatmapControls = ({ visible, onVisibleChange, metric, onMetricChange }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: 220,
        right: 20,
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        minWidth: 200,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Insight Heatmap
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={visible}
            onChange={(e) => onVisibleChange(e.target.checked)}
            size="small"
          />
        }
        label="Show Heatmap"
      />
      {visible && (
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Metric</InputLabel>
          <Select
            value={metric}
            label="Metric"
            onChange={(e) => onMetricChange(e.target.value)}
          >
            <MenuItem value="population">Population Density</MenuItem>
            <MenuItem value="propertyValue">Property Value</MenuItem>
            <MenuItem value="buildingAge">Building Age</MenuItem>
            <MenuItem value="walkScore">Walk Score</MenuItem>
            <MenuItem value="poiDensity">POI Density</MenuItem>
          </Select>
        </FormControl>
      )}
      <Typography variant="caption" sx={{ display: 'block', mt: 1, fontSize: '0.7rem', fontStyle: 'italic' }}>
        Blue (low) → Yellow → Red (high)
      </Typography>
    </Paper>
  );
};

export default HeatmapOverlay;
