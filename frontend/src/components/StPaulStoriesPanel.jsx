import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Divider,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

/**
 * St. Paul Stories Panel - Shows rich historical narratives, 
 * famous people connections, music history, food heritage, and ghost stories
 * as users explore different time periods and locations
 */
const StPaulStoriesPanel = ({ 
  open, 
  onClose, 
  yearRange, 
  selectedCategory,
  eraTheme,
  historicalEvents = [],
  selectedLocation = null,
}) => {
  // Generate contextual stories based on year range and location
  const getContextualStories = () => {
    const currentYear = yearRange[1];
    const stories = [];

    // Era-specific narratives
    if (currentYear <= 1880) {
      stories.push({
        type: 'history',
        icon: <HistoryIcon />,
        title: 'Pioneer Days',
        subtitle: '1850s-1880s',
        content: 'St. Paul emerged as a crucial Mississippi River port. Steamboats brought settlers, merchants, and dreamers. The city was Minnesota\'s capital and gateway to the frontier.',
        color: '#8b7355',
      });
    } else if (currentYear <= 1920) {
      stories.push({
        type: 'history',
        icon: <HistoryIcon />,
        title: 'Gilded Age Splendor',
        subtitle: '1880s-1920s',
        content: 'Railroad barons built mansions on Summit Avenue. F. Scott Fitzgerald was born here in 1896. The Cathedral and State Capitol rose as monuments to ambition.',
        color: '#d4af37',
      });
      stories.push({
        type: 'famous',
        icon: <AutoStoriesIcon />,
        title: 'F. Scott Fitzgerald',
        subtitle: 'Born 1896, 481 Laurel Ave',
        content: 'The Great Gatsby author grew up in St. Paul, drawing inspiration from Summit Avenue\'s mansions for his tales of wealth and longing.',
        color: '#ffd700',
      });
    } else if (currentYear <= 1950) {
      stories.push({
        type: 'history',
        icon: <HistoryIcon />,
        title: 'Gangster Era',
        subtitle: '1920s-1930s',
        content: 'During Prohibition, St. Paul became a sanctuary for gangsters under the "O\'Connor System" - criminals could operate freely if they didn\'t commit crimes in the city.',
        color: '#4169e1',
      });
      stories.push({
        type: 'music',
        icon: <MusicNoteIcon />,
        title: 'Jazz Age',
        subtitle: '1920s-1940s',
        content: 'Historic Rondo neighborhood was the heart of Black cultural life. Jazz clubs thrived. The area was tragically destroyed for I-94 construction in the 1960s.',
        color: '#9f00ff',
      });
    } else if (currentYear <= 1980) {
      stories.push({
        type: 'music',
        icon: <MusicNoteIcon />,
        title: 'Prince\'s Minneapolis Sound',
        subtitle: '1970s-1980s',
        content: 'While Prince was from Minneapolis, his sound was shaped by the Twin Cities scene. First Avenue and local studios became legendary.',
        color: '#9f00ff',
      });
    } else {
      stories.push({
        type: 'history',
        icon: <HistoryIcon />,
        title: 'Modern Renaissance',
        subtitle: '1980s-Present',
        content: 'St. Paul reinvented itself - Science Museum, Ordway Theater, Xcel Energy Center. Downtown transformed while preserving historic character.',
        color: '#00ffff',
      });
    }

    // Add food heritage stories
    if (currentYear >= 1950) {
      stories.push({
        type: 'food',
        icon: <RestaurantIcon />,
        title: 'Hmong Food Heritage',
        subtitle: '1970s-Present',
        content: 'St. Paul has the largest urban Hmong population in the world. The farmers markets and restaurants showcase incredible Southeast Asian flavors.',
        color: '#ff1493',
      });
    }

    // Add location-specific stories if a location is selected
    if (selectedLocation) {
      if (selectedLocation.category === 'ghost') {
        stories.unshift({
          type: 'ghost',
          icon: <AutoStoriesIcon />,
          title: selectedLocation.name,
          subtitle: 'Haunted Location',
          content: selectedLocation.description || 'Local legends speak of mysterious occurrences at this historic site...',
          color: '#4b0082',
        });
      }
    }

    return stories;
  };

  const stories = getContextualStories();

  if (!open) return null;

  return (
    <Paper
      elevation={12}
      sx={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        width: 420,
        maxHeight: '60vh',
        overflowY: 'auto',
        zIndex: 1000,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,26,46,0.95) 100%)',
        backdropFilter: 'blur(30px)',
        border: `2px solid ${eraTheme?.color || '#00ffff'}`,
        boxShadow: `
          0 0 40px ${eraTheme?.glow || 'rgba(0,255,255,0.6)'},
          inset 0 0 30px ${eraTheme?.glow || 'rgba(0,255,255,0.3)'}
        `,
        animation: 'storyPanelGlow 3s ease-in-out infinite',
        '@keyframes storyPanelGlow': {
          '0%, 100%': { 
            boxShadow: `
              0 0 30px ${eraTheme?.glow || 'rgba(0,255,255,0.6)'},
              inset 0 0 20px ${eraTheme?.glow || 'rgba(0,255,255,0.3)'}
            ` 
          },
          '50%': { 
            boxShadow: `
              0 0 60px ${eraTheme?.glow || 'rgba(0,255,255,0.8)'},
              inset 0 0 40px ${eraTheme?.glow || 'rgba(0,255,255,0.4)'}
            ` 
          },
        },
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.3)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: eraTheme?.color || '#00ffff',
          borderRadius: 4,
          boxShadow: `0 0 10px ${eraTheme?.glow || 'rgba(0,255,255,0.6)'}`,
        },
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2.5, 
          borderBottom: `1px solid ${eraTheme?.color || '#00ffff'}`,
          background: `linear-gradient(90deg, ${eraTheme?.glow || 'rgba(0,255,255,0.2)'} 0%, transparent 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <AutoStoriesIcon 
              sx={{ 
                color: eraTheme?.color || '#00ffff',
                fontSize: 32,
                filter: `drop-shadow(0 0 8px ${eraTheme?.glow || 'rgba(0,255,255,0.8)'})`,
              }} 
            />
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: eraTheme?.color || '#00ffff',
                  fontWeight: 700,
                  letterSpacing: 1,
                  textShadow: `0 0 10px ${eraTheme?.glow || 'rgba(0,255,255,0.8)'}`,
                }}
              >
                St. Paul Stories
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: 0.5,
                }}
              >
                {yearRange[0]} - {yearRange[1]}
              </Typography>
            </Box>
          </Stack>
          <IconButton 
            aria-label="close stories panel"
            size="small" 
            onClick={onClose}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                color: eraTheme?.color || '#00ffff',
                background: `${eraTheme?.glow || 'rgba(0,255,255,0.2)'}`,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Stories */}
      <Stack spacing={2} sx={{ p: 2 }}>
        {stories.map((story, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2.5,
              background: `linear-gradient(135deg, ${story.color}15 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1px solid ${story.color}`,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: `linear-gradient(135deg, ${story.color}25 0%, rgba(0,0,0,0.4) 100%)`,
                boxShadow: `0 0 20px ${story.color}66`,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                sx={{
                  bgcolor: `${story.color}33`,
                  border: `2px solid ${story.color}`,
                  boxShadow: `0 0 15px ${story.color}66`,
                  color: story.color,
                }}
              >
                {story.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: story.color,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    {story.title}
                  </Typography>
                  <Chip
                    label={story.type}
                    size="small"
                    sx={{
                      bgcolor: `${story.color}33`,
                      color: story.color,
                      border: `1px solid ${story.color}`,
                      fontSize: '0.7rem',
                      height: 20,
                      fontWeight: 600,
                    }}
                  />
                </Stack>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.5)',
                    display: 'block',
                    mb: 1.5,
                    fontStyle: 'italic',
                  }}
                >
                  {story.subtitle}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.7,
                  }}
                >
                  {story.content}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}

        {historicalEvents.length > 0 && (
          <>
            <Divider sx={{ borderColor: eraTheme?.color, opacity: 0.3, my: 1 }} />
            <Typography 
              variant="overline" 
              sx={{ 
                color: eraTheme?.color,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              Events in This Period
            </Typography>
            {historicalEvents.slice(0, 3).map((event, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 2,
                  background: 'rgba(0,0,0,0.3)',
                  border: `1px solid ${eraTheme?.color}66`,
                  borderRadius: 1,
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: eraTheme?.color,
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  {event.year || event.date}: {event.title || event.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.5,
                  }}
                >
                  {event.description?.substring(0, 150)}...
                </Typography>
              </Paper>
            ))}
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default StPaulStoriesPanel;
