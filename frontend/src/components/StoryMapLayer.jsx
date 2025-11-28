import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Fade,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import { Close, ArrowForward, AutoStories } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion.create(Paper);

// Category styling configuration
const STORY_CATEGORIES = {
  ghost: { 
    color: '#9F00FF', 
    icon: '👻', 
    name: 'Haunted History',
    glow: 'rgba(159, 0, 255, 0.4)'
  },
  legend: { 
    color: '#D4AF37', 
    icon: '📜', 
    name: 'Legends & Lore',
    glow: 'rgba(212, 175, 55, 0.4)'
  },
  sacred: { 
    color: '#4A7BA7', 
    icon: '⛪', 
    name: 'Sacred Ground',
    glow: 'rgba(74, 123, 167, 0.4)'
  },
  crime: { 
    color: '#8B0000', 
    icon: '🔪', 
    name: 'Criminal Underworld',
    glow: 'rgba(139, 0, 0, 0.4)'
  },
  culture: { 
    color: '#FF1493', 
    icon: '🎭', 
    name: 'Cultural Spirits',
    glow: 'rgba(255, 20, 147, 0.4)'
  },
};

// Single story marker component
const StoryMarker = ({ story, onClick, isSelected }) => {
  const category = STORY_CATEGORIES[story.category] || STORY_CATEGORIES.ghost;
  
  return (
    <Box
      onClick={() => onClick(story)}
      sx={{
        position: 'absolute',
        cursor: 'pointer',
        transform: 'translate(-50%, -100%)',
        transition: 'all 0.3s ease',
        zIndex: isSelected ? 1000 : 1,
        '&:hover': {
          transform: 'translate(-50%, -100%) scale(1.2)',
          zIndex: 999,
        },
      }}
    >
      {/* Pulsing glow effect */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${category.glow} 0%, transparent 70%)`,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.6, transform: 'translateX(-50%) scale(1)' },
            '50%': { opacity: 1, transform: 'translateX(-50%) scale(1.3)' },
          },
        }}
      />
      
      {/* Marker pin */}
      <Box
        sx={{
          position: 'relative',
          width: 36,
          height: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Icon container */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: category.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: `0 0 15px ${category.glow}, 0 4px 8px rgba(0,0,0,0.5)`,
            border: isSelected ? '2px solid white' : 'none',
          }}
        >
          {category.icon}
        </Box>
        
        {/* Pin point */}
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `12px solid ${category.color}`,
            filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.5))`,
          }}
        />
      </Box>
    </Box>
  );
};

// Story preview popup
const StoryPreview = ({ story, onClose, onReadMore }) => {
  const category = STORY_CATEGORIES[story.category] || STORY_CATEGORIES.ghost;
  
  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      sx={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 320,
        mb: 2,
        background: `linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(40, 40, 60, 0.95) 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${category.color}40`,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${category.glow}`,
      }}
    >
      {/* Header with category accent */}
      <Box
        sx={{
          background: `linear-gradient(90deg, ${category.color}40 0%, transparent 100%)`,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
            {category.icon}
          </Typography>
          <Chip
            label={category.name}
            size="small"
            sx={{
              backgroundColor: `${category.color}30`,
              color: category.color,
              fontSize: '0.7rem',
              height: 20,
            }}
          />
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'white', opacity: 0.7, '&:hover': { opacity: 1 } }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          {story.title}
        </Typography>
        
        {story.subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: category.color,
              fontStyle: 'italic',
              mb: 1,
              fontSize: '0.8rem',
            }}
          >
            {story.subtitle}
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.75)',
            mb: 2,
            fontSize: '0.85rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {story.teaser}
        </Typography>

        {/* Location info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            📍 {story.location?.name || 'St. Paul, MN'}
          </Typography>
          {story.era && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              • {story.era}
            </Typography>
          )}
        </Box>

        {/* Read more button */}
        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForward />}
          onClick={onReadMore}
          sx={{
            borderColor: category.color,
            color: category.color,
            '&:hover': {
              borderColor: category.color,
              backgroundColor: `${category.color}20`,
            },
          }}
        >
          Read the Full Story
        </Button>
      </Box>
    </MotionPaper>
  );
};

// Main story map layer component
const StoryMapLayer = ({ map, visible = true, onStorySelect }) => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Load stories data
  useEffect(() => {
    const loadStories = async () => {
      try {
        const response = await fetch('/data/mystical-stories.json');
        const data = await response.json();
        setStories(data.stories || []);
      } catch (error) {
        console.error('Error loading stories:', error);
      }
    };
    loadStories();
  }, []);

  // Update marker positions when map moves
  useEffect(() => {
    if (!map || !stories.length || !visible) return;

    const updateMarkers = () => {
      const newMarkers = stories
        .filter(story => story.location?.coordinates)
        .map(story => {
          const [lng, lat] = story.location.coordinates;
          const point = map.project([lng, lat]);
          return {
            ...story,
            x: point.x,
            y: point.y,
            visible: point.x >= 0 && point.x <= map.getCanvas().width &&
                     point.y >= 0 && point.y <= map.getCanvas().height,
          };
        });
      setMarkers(newMarkers);
    };

    updateMarkers();
    map.on('move', updateMarkers);
    map.on('zoom', updateMarkers);
    
    return () => {
      map.off('move', updateMarkers);
      map.off('zoom', updateMarkers);
    };
  }, [map, stories, visible]);

  const handleMarkerClick = (story) => {
    setSelectedStory(story);
    if (onStorySelect) onStorySelect(story);
  };

  const handleReadMore = () => {
    if (selectedStory) {
      navigate(`/stories?story=${selectedStory.id}`);
    }
  };

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {markers.filter(m => m.visible).map((marker) => (
        <Box
          key={marker.id}
          sx={{
            position: 'absolute',
            left: marker.x,
            top: marker.y,
            pointerEvents: 'auto',
          }}
        >
          <StoryMarker
            story={marker}
            onClick={handleMarkerClick}
            isSelected={selectedStory?.id === marker.id}
          />
          
          <AnimatePresence>
            {selectedStory?.id === marker.id && (
              <StoryPreview
                story={marker}
                onClose={() => setSelectedStory(null)}
                onReadMore={handleReadMore}
              />
            )}
          </AnimatePresence>
        </Box>
      ))}
    </Box>
  );
};

export default StoryMapLayer;
