import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Paper, Typography, Box, Chip, Tooltip } from '@mui/material';

const StatusPanel = ({ compact = false }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['readiness-status'],
    queryFn: async () => {
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const r = await fetch(`${base}/api/readiness`);
      if (!r.ok) throw new Error('Readiness fetch failed');
      return r.json();
    },
    refetchInterval: 15000
  });

  const statusColor = (s) => {
    switch (s) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'disconnected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3, display: 'flex', flexDirection: compact ? 'row' : 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant={compact ? 'body2' : 'subtitle1'} sx={{ fontWeight: 600 }}>Backend Status</Typography>
        {isLoading && <Chip label="Loading" size={compact ? 'small' : 'medium'} />}
        {error && <Chip label="Error" color="error" size={compact ? 'small' : 'medium'} />}
        {data && (
          <Tooltip title={`Ready: ${data.ready}`}> 
            <Chip label={data.status} color={statusColor(data.status)} size={compact ? 'small' : 'medium'} />
          </Tooltip>
        )}
      </Box>
      {!compact && data && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Updated {new Date(data.timestamp).toLocaleTimeString()} • Auto-refresh 15s
        </Typography>
      )}
    </Paper>
  );
};

export default StatusPanel;