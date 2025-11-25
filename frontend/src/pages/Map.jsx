import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Skeleton,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Slider,
  Divider,
  Stack,
  Tooltip,
  Badge,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import ReactMapGL, { Marker, Popup, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import TimelineIcon from '@mui/icons-material/Timeline';
import LayersIcon from '@mui/icons-material/Layers';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { apiGet } from '../services/apiClient';
import NightSkyOverlay from '../components/NightSkyOverlay';
import StPaulStoriesPanel from '../components/StPaulStoriesPanel';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

const DOWNTOWN_STPAUL = {
  latitude: 44.9445,
  longitude: -93.0933,
  zoom: 14,
};

const CATEGORY_CONFIG = {
  landmark: { color: '#1a4d7d', label: 'Landmarks', icon: '🏛️' },
  cultural: { color: '#c8102e', label: 'Cultural', icon: '🎭' },
  educational: { color: '#4a7ba7', label: 'Educational', icon: '🎓' },
  historical: { color: '#8b0000', label: 'Historical', icon: '📜' },
  recreational: { color: '#2e8b57', label: 'Recreational', icon: '🌳' },
  commercial: { color: '#ff8c00', label: 'Commercial', icon: '🏪' },
  residential: { color: '#9370db', label: 'Residential', icon: '🏠' },
  music: { color: '#9f00ff', label: 'Music Venues', icon: '🎵' },
  food: { color: '#ff1493', label: 'Food Heritage', icon: '🍽️' },
  ghost: { color: '#4b0082', label: 'Ghost Stories', icon: '👻' },
  famous: { color: '#ffd700', label: 'Famous People', icon: '⭐' },
  event: { color: '#ff4500', label: 'Historic Events', icon: '⚡' },
};

const Map = () => {
  const navigate = useNavigate();
  const [viewport, setViewport] = useState(DOWNTOWN_STPAUL);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(Object.keys(CATEGORY_CONFIG));
  const [yearRange, setYearRange] = useState([1850, 2025]);
  const [showFilters, setShowFilters] = useState(true);
  const [show3DBuildings, setShow3DBuildings] = useState(true);
  const [mapStyle, setMapStyle] = useState('dark'); // dark, light, satellite, mystical
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [atmosphericEffects, setAtmosphericEffects] = useState(true);
  const [storyMode, setStoryMode] = useState(false); // Show narrative connections
  const [showHistoricalEvents, setShowHistoricalEvents] = useState(true);
  const [showStoriesPanel, setShowStoriesPanel] = useState(false); // Show narrative connections
  
  // Fetch real data from backend
  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => apiGet('/api/locations'),
    staleTime: 300000,
  });

  const { data: buildingSpecsData, isLoading: buildingSpecsLoading } = useQuery({
    queryKey: ['building-specs-map', yearRange],
    queryFn: () => apiGet(`/api/building-specs?yearMin=${yearRange[0]}&yearMax=${yearRange[1]}&limit=500`),
    staleTime: 300000,
  });

  // Fetch historical events for timeline storytelling
  const { data: historicalEventsData } = useQuery({
    queryKey: ['historical-events', yearRange],
    queryFn: () => apiGet(`/api/history?yearMin=${yearRange[0]}&yearMax=${yearRange[1]}&limit=100`),
    staleTime: 300000,
  });

  const locations = locationsData || [];
  const historicalEvents = historicalEventsData || [];

  // Building specs as GeoJSON
  const buildingSpecs = useMemo(() => {
    const specs = buildingSpecsData?.data || [];
    return specs
      .filter(spec => spec.centroid?.lat && spec.centroid?.lon)
      .map(spec => ({
        ...spec,
        latitude: spec.centroid.lat,
        longitude: spec.centroid.lon,
        category: 'historical',
        yearEstablished: spec.yearCompleted || spec.yearConstructed,
      }));
  }, [buildingSpecsData]);

  // Filter locations
  const filteredLocations = useMemo(() => {
    return [...locations, ...buildingSpecs].filter(loc => {
      // Category filter
      if (!selectedCategories.includes(loc.category)) return false;
      
      // Year filter
      const year = loc.yearEstablished || loc.established;
      if (year && (year < yearRange[0] || year > yearRange[1])) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = loc.name?.toLowerCase().includes(query);
        const matchesDescription = loc.description?.toLowerCase().includes(query);
        const matchesArchitect = loc.architect?.toLowerCase().includes(query);
        return matchesName || matchesDescription || matchesArchitect;
      }
      
      return true;
    });
  }, [locations, buildingSpecs, selectedCategories, yearRange, searchQuery]);

  const getCategoryColor = (category) => {
    return CATEGORY_CONFIG[category]?.color || '#666';
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLaunch3DViewer = () => {
    setIsTransitioning(true);
    setTimeout(() => navigate('/3d-viewer'), 800);
  };

  const getMapStyle = () => {
    const styles = {
      dark: 'mapbox://styles/mapbox/dark-v11',
      light: 'mapbox://styles/mapbox/light-v11',
      satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
      mystical: 'mapbox://styles/mapbox/dark-v11', // We'll enhance this with layers
    };
    return styles[mapStyle] || styles.dark;
  };

  const getEraTheme = () => {
    const currentYear = yearRange[1];
    if (currentYear <= 1880) return { 
      color: '#8b7355', // Sepia/Pioneer accent
      glow: 'rgba(139, 115, 85, 0.6)',
      name: 'Pioneer Era',
      textColor: '#f5e6d3', // Warm light text
      backgroundColor: 'rgba(59, 47, 37, 0.85)', // Dark brown background
      isDark: true
    };
    if (currentYear <= 1920) return { 
      color: '#d4af37', // Golden Age accent
      glow: 'rgba(212, 175, 55, 0.6)',
      name: 'Gilded Age',
      textColor: '#fff9e6', // Cream text
      backgroundColor: 'rgba(40, 35, 20, 0.85)', // Dark gold background
      isDark: true
    };
    if (currentYear <= 1950) return { 
      color: '#4169e1', // Art Deco Blue accent
      glow: 'rgba(65, 105, 225, 0.6)',
      name: 'Art Deco Era',
      textColor: '#e6f0ff', // Light blue text
      backgroundColor: 'rgba(20, 30, 50, 0.85)', // Deep blue background
      isDark: true
    };
    if (currentYear <= 1980) return { 
      color: '#32cd32', // Mid-century lime green
      glow: 'rgba(50, 205, 50, 0.6)',
      name: 'Modern Era',
      textColor: '#f0fff0', // Honeydew text
      backgroundColor: 'rgba(25, 40, 25, 0.85)', // Dark green background
      isDark: true
    };
    return { 
      color: '#00ffff', // Contemporary Cyan accent
      glow: 'rgba(0, 255, 255, 0.6)',
      name: 'Contemporary',
      textColor: '#e6ffff', // Light cyan text
      backgroundColor: 'rgba(10, 25, 35, 0.85)', // Dark teal background
      isDark: true
    };
  };

  const eraTheme = getEraTheme();

  const isLoading = locationsLoading || buildingSpecsLoading;

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)', 
      position: 'relative',
      overflow: 'hidden',
      background: mapStyle === 'dark' || mapStyle === 'mystical' 
        ? 'linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%)'
        : 'linear-gradient(180deg, #e0f2ff 0%, #ffffff 100%)',
    }}>
      {/* Mystical Portal Transition Overlay */}
      {isTransitioning && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: `radial-gradient(circle, ${eraTheme.glow} 0%, rgba(0,0,0,0.95) 70%)`,
            animation: 'portalPulse 0.8s ease-in-out',
            '@keyframes portalPulse': {
              '0%': { opacity: 0, transform: 'scale(0.5)' },
              '50%': { opacity: 1, transform: 'scale(1.2)' },
              '100%': { opacity: 0, transform: 'scale(2)' },
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              color: eraTheme.color,
              textShadow: `0 0 20px ${eraTheme.glow}, 0 0 40px ${eraTheme.glow}`,
              fontWeight: 300,
              letterSpacing: 8,
            }}
          >
            ENTERING THE PORTAL...
          </Typography>
        </Box>
      )}

      {/* Atmospheric Background Effects */}
      {atmosphericEffects && mapStyle === 'dark' && (
        <>
          <NightSkyOverlay visible={true} intensity={0.7} />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1,
              opacity: 0.3,
              background: `
                radial-gradient(circle at 20% 20%, ${eraTheme.glow} 0%, transparent 50%),
                radial-gradient(circle at 80% 60%, rgba(138, 43, 226, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)
              `,
              animation: 'atmosphericGlow 8s ease-in-out infinite',
              '@keyframes atmosphericGlow': {
                '0%, 100%': { opacity: 0.2 },
                '50%': { opacity: 0.4 },
              },
            }}
          />
        </>
      )}

      {/* Toggle Stories Panel Button */}
      <Tooltip title={showStoriesPanel ? "Hide Stories" : "Show St. Paul Stories"}>
        <IconButton
          onClick={() => setShowStoriesPanel(!showStoriesPanel)}
          sx={{
            position: 'absolute',
            bottom: 24,
            left: showStoriesPanel ? 460 : 24,
            zIndex: 1001,
            bgcolor: `${eraTheme.color}33`,
            border: `2px solid ${eraTheme.color}`,
            boxShadow: `0 0 20px ${eraTheme.glow}`,
            color: eraTheme.color,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'none', // Hide for now to reduce clutter
            '&:hover': {
              bgcolor: `${eraTheme.color}55`,
              transform: 'scale(1.1)',
              boxShadow: `0 0 30px ${eraTheme.glow}`,
            },
          }}
        >
          <AutoStoriesIcon />
        </IconButton>
      </Tooltip>

      {/* St. Paul Stories Panel */}
      <StPaulStoriesPanel
        open={showStoriesPanel}
        onClose={() => setShowStoriesPanel(false)}
        yearRange={yearRange}
        selectedCategory={selectedCategories}
        eraTheme={eraTheme}
        historicalEvents={historicalEvents}
        selectedLocation={selectedLocation}
      />

      {/* Era Badge Overlay */}
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          top: 80,
          right: 16,
          zIndex: 1000,
          px: 3,
          py: 1.5,
          background: `linear-gradient(135deg, ${eraTheme.color}22 0%, rgba(0,0,0,0.8) 100%)`,
          backdropFilter: 'blur(20px)',
          border: `2px solid ${eraTheme.color}`,
          boxShadow: `0 0 30px ${eraTheme.glow}, inset 0 0 20px ${eraTheme.glow}`,
          animation: 'eraGlow 2s ease-in-out infinite',
          '@keyframes eraGlow': {
            '0%, 100%': { boxShadow: `0 0 20px ${eraTheme.glow}, inset 0 0 10px ${eraTheme.glow}` },
            '50%': { boxShadow: `0 0 40px ${eraTheme.glow}, inset 0 0 20px ${eraTheme.glow}` },
          },
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: eraTheme.color,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textShadow: `0 0 10px ${eraTheme.glow}`,
          }}
        >
          {eraTheme.name}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            display: 'block',
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          {yearRange[0]} — {yearRange[1]}
        </Typography>
      </Paper>
      {/* Sidebar with filters and locations */}
      <Drawer
        variant="permanent"
        sx={{
          width: showFilters ? 380 : 0,
          flexShrink: 0,
          transition: 'width 0.3s',
          '& .MuiDrawer-paper': {
            width: 380,
            boxSizing: 'border-box',
            top: 64,
            height: 'calc(100% - 64px)',
            transform: showFilters ? 'translateX(0)' : 'translateX(-380px)',
            transition: 'all 0.5s ease',
            background: eraTheme.backgroundColor,
            backdropFilter: 'blur(20px)',
            borderRight: `2px solid ${eraTheme.color}`,
            boxShadow: `inset 0 0 30px ${eraTheme.glow}`,
            color: eraTheme.textColor,
            '& .MuiTypography-root': {
              color: eraTheme.textColor,
            },
            '& .MuiFormControlLabel-label': {
              color: eraTheme.textColor,
            },
            '& .MuiCheckbox-root': {
              color: `${eraTheme.color}99`,
              '&.Mui-checked': {
                color: eraTheme.color,
              },
            },
          },
        }}
      >
        <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
          {/* Portal Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: eraTheme.color,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
                textShadow: `0 0 15px ${eraTheme.glow}`,
                mb: 0.5,
              }}
            >
              Time Portal
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: `${eraTheme.textColor}99`,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Navigate St. Paul's History
            </Typography>
          </Box>
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search across time and space..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: eraTheme.color }} />,
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: eraTheme.textColor,
                '& fieldset': {
                  borderColor: `${eraTheme.color}66`,
                },
                '&:hover fieldset': {
                  borderColor: eraTheme.color,
                  boxShadow: `0 0 10px ${eraTheme.glow}`,
                },
                '&.Mui-focused fieldset': {
                  borderColor: eraTheme.color,
                  boxShadow: `0 0 15px ${eraTheme.glow}`,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: `${eraTheme.textColor}99`,
                opacity: 0.7,
              },
            }}
          />

          {/* Year Range Slider */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: eraTheme.textColor,
            }}>
              <TimelineIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
              Temporal Portal: {yearRange[0]} - {yearRange[1]}
            </Typography>
            <Slider
              value={yearRange}
              onChange={(_, newValue) => setYearRange(newValue)}
              valueLabelDisplay="auto"
              min={1850}
              max={2025}
              marks={[
                { value: 1850, label: '1850' },
                { value: 1900, label: '1900' },
                { value: 1950, label: '1950' },
                { value: 2000, label: '2000' },
                { value: 2025, label: 'Now' },
              ]}
              sx={{ 
                mt: 1,
                color: eraTheme.color,
                '& .MuiSlider-markLabel': {
                  color: eraTheme.textColor,
                  opacity: 0.7,
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: eraTheme.color,
                  color: eraTheme.isDark ? '#000' : '#fff',
                },
                '& .MuiSlider-thumb': {
                  background: `linear-gradient(135deg, ${eraTheme.color} 0%, ${eraTheme.textColor} 100%)`,
                  boxShadow: `0 0 15px ${eraTheme.glow}`,
                  '&:hover': {
                    boxShadow: `0 0 25px ${eraTheme.glow}`,
                  },
                },
                '& .MuiSlider-track': {
                  background: `linear-gradient(90deg, #8b7355 0%, ${eraTheme.color} 100%)`,
                  border: 'none',
                  height: 6,
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                  background: 'rgba(255,255,255,0.2)',
                },
              }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Category Filters */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: eraTheme.textColor,
            }}>
              <LayersIcon sx={{ fontSize: 16, mr: 0.5, color: eraTheme.color }} />
              Categories ({selectedCategories.length}/{Object.keys(CATEGORY_CONFIG).length})
            </Typography>
            <FormGroup>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(key)}
                      onChange={() => toggleCategory(key)}
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{config.icon}</span>
                      <Typography variant="body2" sx={{ color: eraTheme.textColor }}>{config.label}</Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Map Style Selector */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: eraTheme.textColor }}>
              Visual Theme
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {['dark', 'light', 'satellite', 'mystical'].map((style) => (
                <Chip
                  key={style}
                  label={style.charAt(0).toUpperCase() + style.slice(1)}
                  onClick={() => setMapStyle(style)}
                  variant={mapStyle === style ? 'filled' : 'outlined'}
                  color={mapStyle === style ? 'primary' : 'default'}
                  sx={{
                    textTransform: 'capitalize',
                    ...(style === 'mystical' && {
                      background: mapStyle === 'mystical' 
                        ? `linear-gradient(135deg, ${eraTheme.color} 0%, #4a148c 100%)`
                        : 'transparent',
                      color: mapStyle === 'mystical' ? '#fff' : 'inherit',
                      borderColor: eraTheme.color,
                    }),
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Atmospheric Effects Toggle */}
          <FormControlLabel
            control={
              <Checkbox
                checked={atmosphericEffects}
                onChange={(e) => setAtmosphericEffects(e.target.checked)}
                size="small"
              />
            }
            label="Atmospheric Effects"
            sx={{ mb: 1 }}
          />

          {/* 3D Buildings Toggle */}
          <FormControlLabel
            control={
              <Checkbox
                checked={show3DBuildings}
                onChange={(e) => setShow3DBuildings(e.target.checked)}
                size="small"
              />
            }
            label="Show 3D Buildings"
            sx={{ mb: 2 }}
          />

          <Divider sx={{ mb: 2 }} />

          {/* Locations List */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography 
              variant="h6"
              sx={{
                color: eraTheme.color,
                textShadow: `0 0 10px ${eraTheme.glow}`,
              }}
            >
              Discovered Sites
            </Typography>
            <Chip 
              label={filteredLocations.length} 
              size="small" 
              sx={{
                bgcolor: eraTheme.color,
                color: '#000',
                fontWeight: 700,
                boxShadow: `0 0 15px ${eraTheme.glow}`,
              }}
            />
          </Box>

          <List sx={{ pt: 0 }}>
            {isLoading && (
              [...Array(5)].map((_, i) => (
                <ListItem key={`sk-${i}`}>
                  <ListItemText primary={<Skeleton width={180} />} secondary={<Skeleton width={80} />} />
                </ListItem>
              ))
            )}
            {!isLoading && filteredLocations.map((location) => (
              <ListItemButton
                key={location._id || location.id}
                onClick={() => {
                  setSelectedLocation(location);
                  setViewport({
                    ...viewport,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    zoom: 17,
                  });
                }}
                selected={selectedLocation?._id === location._id}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  border: selectedLocation?._id === location._id 
                    ? `2px solid ${eraTheme.color}` 
                    : '2px solid transparent',
                  bgcolor: selectedLocation?._id === location._id 
                    ? `${eraTheme.color}22`
                    : 'transparent',
                  boxShadow: selectedLocation?._id === location._id 
                    ? `0 0 20px ${eraTheme.glow}`
                    : 'none',
                  '&:hover': {
                    bgcolor: `${eraTheme.color}11`,
                    border: `2px solid ${eraTheme.color}66`,
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: eraTheme.textColor,
                      }}
                    >
                      {location.name}
                    </Typography>
                  }
                  secondary={
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                      <Chip
                        label={CATEGORY_CONFIG[location.category]?.label || location.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(location.category),
                          color: 'white',
                          height: 20,
                          fontSize: '0.7rem',
                          boxShadow: `0 0 8px ${getCategoryColor(location.category)}66`,
                        }}
                      />
                      {location.yearEstablished && (
                        <Chip
                          label={location.yearEstablished}
                          size="small"
                          sx={{ 
                            height: 20, 
                            fontSize: '0.7rem',
                            bgcolor: `${eraTheme.color}33`,
                            color: eraTheme.color,
                            border: `1px solid ${eraTheme.color}`,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Map Container */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Filter Toggle Button */}
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            position: 'absolute',
            top: 16,
            left: showFilters ? 396 : 16,
            zIndex: 1000,
            bgcolor: 'background.paper',
            boxShadow: 2,
            transition: 'left 0.3s',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <FilterListIcon />
        </IconButton>

        {/* 3D Viewer Launch Button */}
        <Tooltip title="Enter the mystical 3D portal to walk through history">
          <Button
            variant="contained"
            startIcon={<ViewInArIcon />}
            onClick={handleLaunch3DViewer}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1000,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${eraTheme.color} 0%, #1a4d7d 100%)`,
              boxShadow: `0 8px 32px ${eraTheme.glow}`,
              border: `2px solid ${eraTheme.color}`,
              color: '#fff',
              px: 3,
              py: 1.5,
              fontSize: '1rem',
              letterSpacing: 1,
              '&:hover': {
                background: `linear-gradient(135deg, ${eraTheme.color} 0%, #0d3a5f 100%)`,
                transform: 'translateY(-4px) scale(1.05)',
                boxShadow: `0 12px 48px ${eraTheme.glow}, inset 0 0 20px ${eraTheme.glow}`,
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'portalPulse 3s ease-in-out infinite',
              '@keyframes portalPulse': {
                '0%, 100%': { 
                  boxShadow: `0 8px 32px ${eraTheme.glow}`,
                },
                '50%': { 
                  boxShadow: `0 8px 48px ${eraTheme.glow}, 0 0 20px ${eraTheme.color}`,
                },
              },
            }}
          >
            Enter 3D Portal
          </Button>
        </Tooltip>

        {/* Stats Badge */}
        {!isLoading && (
          <Paper
            elevation={6}
            sx={{
              position: 'absolute',
              bottom: 80,
              right: 16,
              zIndex: 1000,
              p: 2,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${eraTheme.color}`,
              boxShadow: `0 0 20px ${eraTheme.glow}`,
            }}
          >
            <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: eraTheme.color, opacity: 0.3 }} />}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: eraTheme.color,
                    fontWeight: 700,
                    textShadow: `0 0 10px ${eraTheme.glow}`,
                  }}
                >
                  {filteredLocations.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Sites
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: eraTheme.color,
                    fontWeight: 700,
                    textShadow: `0 0 10px ${eraTheme.glow}`,
                  }}
                >
                  {buildingSpecs.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Buildings
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: eraTheme.color,
                    fontWeight: 700,
                    textShadow: `0 0 10px ${eraTheme.glow}`,
                  }}
                >
                  {yearRange[1] - yearRange[0]}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Years
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        <ReactMapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle={getMapStyle()}
          onMove={(evt) => setViewport(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          pitch={show3DBuildings ? 50 : 0}
          bearing={show3DBuildings ? -20 : 0}
          fog={{
            range: [0.5, 10],
            color: mapStyle === 'dark' ? '#0a0e27' : '#e0f2ff',
            'horizon-blend': 0.1,
          }}
        >
          {/* 3D Buildings Layer */}
          {show3DBuildings && (
            <Source
              id="composite"
              type="vector"
              url="mapbox://mapbox.mapbox-streets-v8"
            >
              <Layer
                id="3d-buildings"
                source="composite"
                source-layer="building"
                filter={['==', 'extrude', 'true']}
                type="fill-extrusion"
                minzoom={14}
                paint={{
                  'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'height'],
                    0, eraTheme.color,
                    50, '#666',
                    100, '#999',
                  ],
                  'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height'],
                  ],
                  'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height'],
                  ],
                  'fill-extrusion-opacity': mapStyle === 'dark' ? 0.8 : 0.6,
                  'fill-extrusion-vertical-gradient': true,
                }}
              />
            </Source>
          )}

          {/* Location Markers */}
          {filteredLocations.map((location) => (
            <Marker
              key={location._id || location.id}
              latitude={location.latitude}
              longitude={location.longitude}
              anchor="bottom"
            >
              <Box
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  transform: selectedLocation?._id === location._id ? 'scale(1.4)' : 'scale(1)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.3)',
                  },
                }}
                onClick={() => setSelectedLocation(location)}
              >
                {/* Pulsing Glow Effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${getCategoryColor(location.category)}66 0%, transparent 70%)`,
                    animation: 'markerPulse 2s ease-in-out infinite',
                    '@keyframes markerPulse': {
                      '0%, 100%': { 
                        transform: 'translate(-50%, -50%) scale(0.8)',
                        opacity: 0.6,
                      },
                      '50%': { 
                        transform: 'translate(-50%, -50%) scale(1.2)',
                        opacity: 0.3,
                      },
                    },
                  }}
                />
                <RoomIcon
                  sx={{
                    fontSize: 40,
                    color: getCategoryColor(location.category),
                    filter: `drop-shadow(0 0 ${selectedLocation?._id === location._id ? '12px' : '6px'} ${getCategoryColor(location.category)})`,
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </Box>
            </Marker>
          ))}

          {/* Location Popup */}
          {selectedLocation && (
            <Popup
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              anchor="top"
              onClose={() => setSelectedLocation(null)}
              closeOnClick={false}
              maxWidth="420px"
            >
              <Card 
                elevation={0} 
                sx={{ 
                  maxWidth: 420,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,26,46,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${eraTheme.color}`,
                  boxShadow: `0 0 30px ${eraTheme.glow}`,
                }}
              >
                {selectedLocation.imageUrl && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={selectedLocation.imageUrl}
                    alt={selectedLocation.name}
                    sx={{
                      borderBottom: `2px solid ${eraTheme.color}`,
                      filter: 'sepia(0.3) contrast(1.1)',
                    }}
                  />
                )}
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700, 
                      color: eraTheme.color,
                      textShadow: `0 0 10px ${eraTheme.glow}`,
                      letterSpacing: 1,
                    }}
                  >
                    {selectedLocation.name}
                  </Typography>
                  
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2 }} flexWrap="wrap" gap={0.5}>
                    <Chip
                      label={CATEGORY_CONFIG[selectedLocation.category]?.label || selectedLocation.category}
                      size="small"
                      sx={{
                        bgcolor: getCategoryColor(selectedLocation.category),
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: `0 0 10px ${getCategoryColor(selectedLocation.category)}`,
                      }}
                    />
                    {selectedLocation.yearEstablished && (
                      <Chip
                        label={`Est. ${selectedLocation.yearEstablished}`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.1)',
                          color: eraTheme.color,
                          border: `1px solid ${eraTheme.color}`,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>

                  <Typography 
                    variant="body2" 
                    paragraph 
                    sx={{ 
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedLocation.description || selectedLocation.notes}
                  </Typography>

                  {/* Building Spec Details */}
                  <Divider sx={{ my: 1.5, borderColor: eraTheme.color, opacity: 0.3 }} />
                  <Stack spacing={0.8}>
                    {selectedLocation.architect && (
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <Box component="span" sx={{ color: eraTheme.color, fontWeight: 700 }}>Architect:</Box> {selectedLocation.architect}
                      </Typography>
                    )}
                    {selectedLocation.architecturalStyle && (
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <Box component="span" sx={{ color: eraTheme.color, fontWeight: 700 }}>Style:</Box> {selectedLocation.architecturalStyle}
                      </Typography>
                    )}
                    {selectedLocation.height?.stories && (
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <Box component="span" sx={{ color: eraTheme.color, fontWeight: 700 }}>Stories:</Box> {selectedLocation.height.stories}
                      </Typography>
                    )}
                    {selectedLocation.status && (
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                        <Box component="span" sx={{ color: eraTheme.color, fontWeight: 700 }}>Status:</Box> {selectedLocation.status}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Popup>
          )}
        </ReactMapGL>
      </Box>
    </Box>
  );
};

export default Map;
