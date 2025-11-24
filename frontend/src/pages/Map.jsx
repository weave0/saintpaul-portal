import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Drawer, List, ListItem, ListItemText, Chip } from '@mui/material';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';

// Note: You'll need to add your Mapbox token to .env.local
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 44.9537,
    longitude: -93.0900,
    zoom: 12,
  });
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch locations from API
    // For now, using sample data
    setLocations([
      {
        id: 1,
        name: 'Minnesota State Capitol',
        latitude: 44.9550,
        longitude: -93.1022,
        category: 'landmark',
        description: 'The Minnesota State Capitol is the seat of government for the U.S. state of Minnesota.',
        yearEstablished: 1905,
      },
      {
        id: 2,
        name: 'Cathedral of Saint Paul',
        latitude: 44.9465,
        longitude: -93.1119,
        category: 'cultural',
        description: 'A historic Roman Catholic cathedral and one of Saint Paul\'s most iconic landmarks.',
        yearEstablished: 1915,
      },
      {
        id: 3,
        name: 'Science Museum of Minnesota',
        latitude: 44.9432,
        longitude: -93.0982,
        category: 'educational',
        description: 'A premier science museum featuring hands-on exhibits and an Omnitheater.',
        yearEstablished: 1907,
      },
    ]);
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      landmark: '#1a4d7d',
      cultural: '#c8102e',
      educational: '#4a7ba7',
      historical: '#8b0000',
      recreational: '#2e8b57',
    };
    return colors[category] || '#666';
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 320,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
            top: 64,
            height: 'calc(100% - 64px)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Historical Locations
          </Typography>
          <List>
            {locations.map((location) => (
              <ListItem
                button
                key={location.id}
                onClick={() => {
                  setSelectedLocation(location);
                  setViewport({
                    ...viewport,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    zoom: 15,
                  });
                }}
              >
                <ListItemText
                  primary={location.name}
                  secondary={
                    <>
                      <Chip
                        label={location.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(location.category),
                          color: 'white',
                          mt: 0.5,
                        }}
                      />
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onMove={(evt) => setViewport(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              latitude={location.latitude}
              longitude={location.longitude}
              anchor="bottom"
            >
              <RoomIcon
                sx={{
                  fontSize: 40,
                  color: getCategoryColor(location.category),
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.2)',
                  },
                }}
                onClick={() => setSelectedLocation(location)}
              />
            </Marker>
          ))}

          {selectedLocation && (
            <Popup
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              anchor="top"
              onClose={() => setSelectedLocation(null)}
              closeOnClick={false}
            >
              <Box sx={{ p: 1, maxWidth: 300 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedLocation.name}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedLocation.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Established: {selectedLocation.yearEstablished}
                </Typography>
              </Box>
            </Popup>
          )}
        </ReactMapGL>
      </Box>
    </Box>
  );
};

export default Map;
