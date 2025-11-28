import React, { useState, lazy, Suspense } from 'react';
import StatusPanel from '../components/StatusPanel';
import SEO from '../components/SEO';
import LazySection from '../components/LazySection';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Collapse,
} from '@mui/material';
import { DeferredMotionBox, DeferredMotionCard } from '../components/DeferredMotion';
// Critical icons loaded eagerly (visible above the fold)
import MapIcon from '@mui/icons-material/Map';
import TimelineIcon from '@mui/icons-material/Timeline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Deferred icons (loaded after initial paint)
const AutoStoriesIcon = lazy(() => import('@mui/icons-material/AutoStories'));
const LocationOnIcon = lazy(() => import('@mui/icons-material/LocationOn'));
const MusicNoteIcon = lazy(() => import('@mui/icons-material/MusicNote'));
const RestaurantIcon = lazy(() => import('@mui/icons-material/Restaurant'));
const StarIcon = lazy(() => import('@mui/icons-material/Star'));
const CloseIcon = lazy(() => import('@mui/icons-material/Close'));

// Fallback for lazy icons
const IconFallback = () => <Box sx={{ width: 24, height: 24 }} />;
import { getMysticalTheme, getGlobalMysticalStyles } from '../theme/mysticalTheme';

// Use deferred motion components to reduce initial bundle
const MotionBox = DeferredMotionBox;
const MotionCard = DeferredMotionCard;

const Home = () => {
  const navigate = useNavigate();
  const theme = getMysticalTheme(2025);
  const styles = getGlobalMysticalStyles(theme);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showEraShowcase, setShowEraShowcase] = useState(false);

  const features = [
    {
      id: 'stories',
      title: 'Shadows of Saint Paul',
      subtitle: 'MYSTICAL TALES',
      description: 'Ghost stories, legendary figures, sacred ground, and dark history—immersive narratives that bring the past to life.',
      icon: <Suspense fallback={<IconFallback />}><AutoStoriesIcon sx={{ fontSize: 70 }} /></Suspense>,
      link: '/stories',
      gradient: 'linear-gradient(135deg, #9f00ff 0%, #d4af37 100%)',
      badge: 'START HERE',
      details: {
        features: [
          'Haunted locations: Forepaugh\'s, Wabasha Caves, Hill House',
          'F. Scott Fitzgerald\'s Saint Paul legacy',
          '2,000-year-old sacred Indigenous burial mounds',
          '1930s gangster hideouts and speakeasies',
          'Immersive chapter-by-chapter narratives'
        ],
        stats: { stories: '50+', locations: '25', eras: '2000 years' }
      }
    },
    {
      id: 'map',
      title: 'Interactive Map',
      subtitle: 'TIME PORTAL',
      description: 'Navigate through 175 years of history with our mystical temporal map.',
      icon: <MapIcon sx={{ fontSize: 70 }} />,
      link: '/map',
      gradient: 'linear-gradient(135deg, #00ffff 0%, #4169e1 100%)',
      details: {
        features: [
          'Slide through 5 distinct eras (1850-2025)',
          'Filter by categories: landmarks, cultural sites, ghost stories',
          'Click any location for rich historical context',
          'Atmospheric effects & night sky overlay'
        ],
        stats: { locations: '500+', buildings: '1,500+', years: 175 }
      }
    },
    {
      id: '3d',
      title: '3D Historical Viewer',
      subtitle: 'IMMERSIVE PORTAL',
      description: 'Walk through reconstructed historical Saint Paul in full 3D.',
      icon: <ViewInArIcon sx={{ fontSize: 70 }} />,
      link: '/3d-viewer',
      gradient: 'linear-gradient(135deg, #32cd32 0%, #00ffff 100%)',
      badge: 'NEW',
      details: {
        features: [
          'First-person navigation through historical downtown',
          'Accurate building reconstructions from blueprints',
          'Time-shift between eras and see buildings transform',
          'Discover hidden ghost story locations',
          'Immersive ambient sound design'
        ],
        stats: { buildings: '200+', 'sq blocks': 12, resolution: '4K' }
      }
    },
    {
      id: 'timeline',
      title: 'Historical Timeline',
      subtitle: 'CHRONICLES',
      description: 'Key events, cultural moments, and untold stories across generations.',
      icon: <TimelineIcon sx={{ fontSize: 70 }} />,
      link: '/timeline',
      gradient: 'linear-gradient(135deg, #d4af37 0%, #c8102e 100%)',
      details: {
        features: [
          'Major political & infrastructure milestones',
          'Cultural events: music, food, famous people',
          'Crime history & prohibition era stories',
          'Filter by category, decade, or search',
          'Rich multimedia: photos, documents, audio'
        ],
        stats: { events: '1,000+', photos: '500+', decades: 18 }
      }
    },
    {
      id: 'library',
      title: 'Archives of Time',
      subtitle: 'DIGITAL LIBRARY',
      description: 'Photographs, documents, blueprints, oral histories, and more.',
      icon: <LibraryBooksIcon sx={{ fontSize: 70 }} />,
      link: '/library',
      gradient: 'linear-gradient(135deg, #8b7355 0%, #4169e1 100%)',
      details: {
        features: [
          'Building Specifications: 1,500+ architectural blueprints',
          'Historic Photographs: 5,000+ images documenting evolution',
          'Maps & Atlases: 500+ historic maps showing city growth',
          'Documents & Records: 10,000+ city records & newspapers',
          'Oral Histories: 200+ personal accounts & stories'
        ],
        stats: { items: '17,000+', collections: 7, 'oldest': 1849 }
      }
    },
  ];

  const eras = [
    { name: 'Pioneer Era', years: '1850-1880', color: '#8b7355', keywords: 'frontier, settlement' },
    { name: 'Gilded Age', years: '1880-1920', color: '#d4af37', keywords: 'prosperity, industrial' },
    { name: 'Art Deco', years: '1920-1950', color: '#4169e1', keywords: 'jazz, prohibition' },
    { name: 'Modern Era', years: '1950-1980', color: '#32cd32', keywords: 'suburbia, highways' },
    { name: 'Contemporary', years: '1980-2025', color: '#00ffff', keywords: 'technology, diversity' },
  ];

  const hiddenTreasures = [
    { icon: <Suspense fallback={<IconFallback />}><AutoStoriesIcon /></Suspense>, title: 'Ghost Stories', count: '12+ haunted locations', color: '#9f00ff', link: '/stories?category=ghost' },
    { icon: <Suspense fallback={<IconFallback />}><StarIcon /></Suspense>, title: 'Legends & Lore', count: 'Myths that shaped the city', color: '#d4af37', link: '/stories?category=legend' },
    { icon: <Suspense fallback={<IconFallback />}><MusicNoteIcon /></Suspense>, title: 'Sacred Ground', count: 'Spiritual sites & secrets', color: '#4a7ba7', link: '/stories?category=sacred' },
    { icon: <Suspense fallback={<IconFallback />}><RestaurantIcon /></Suspense>, title: 'Dark History', count: 'Gangsters & Prohibition', color: '#8b0000', link: '/stories?category=crime' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `${theme.backgroundGradient}, 
        radial-gradient(circle at 20% 20%, ${theme.glow} 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.2) 0%, transparent 50%)`,
      pb: 8,
    }}>
      <SEO title="Shadows of Saint Paul | Mystical Portal" description="Discover ghost stories, legendary figures, and 175 years of hidden history through immersive narratives and atmospheric storytelling." canonical={window.location.href} />
      
      {/* Hero Section */}
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', pt: 12, pb: 8 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              ...styles.glowText,
              fontSize: { xs: '3rem', md: '5rem' },
              mb: 2,
              animation: 'portalPulse 3s ease-in-out infinite',
              '@keyframes portalPulse': {
                '0%, 100%': { textShadow: `0 0 20px ${theme.glow}` },
                '50%': { textShadow: `0 0 40px ${theme.glow}, 0 0 60px ${theme.primary}` },
              },
            }}
          >
            THE MYSTICAL PORTAL
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: theme.textSecondary,
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontWeight: 300,
              mb: 4,
            }}
          >
            175 Years • 5 Eras • Infinite Stories
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              color: theme.textColor,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.8,
              mb: 6,
              fontSize: '1.2rem',
            }}
          >
            Step through time itself. Explore Saint Paul's layered histories through an
            immersive blend of interactive maps, 3D reconstruction, and hidden narratives.
            From the sepia-toned Pioneer Era to the cyan-lit Contemporary age—each moment
            has its own visual soul.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={() => navigate('/map')}
              variant="contained"
              size="large"
              sx={{
                ...styles.portalButton,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              ENTER THE PORTAL
            </Button>
            <Button
              onClick={() => setShowEraShowcase(!showEraShowcase)}
              variant="outlined"
              size="large"
              sx={{
                color: theme.primary,
                borderColor: theme.primary,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: theme.primary,
                  bgcolor: `${theme.primary}22`,
                  boxShadow: `0 0 20px ${theme.glow}`,
                },
              }}
            >
              EXPLORE ERAS
            </Button>
          </Box>

          {/* Era Showcase */}
          <Collapse in={showEraShowcase}>
            <Box sx={{ mt: 6, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {eras.map((era, i) => (
                <Chip
                  key={i}
                  label={`${era.name} (${era.years})`}
                  sx={{
                    bgcolor: `${era.color}33`,
                    color: era.color,
                    border: `2px solid ${era.color}`,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 2.5,
                    px: 1,
                    boxShadow: `0 0 15px ${era.color}66`,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 0 25px ${era.color}`,
                    },
                  }}
                  onClick={() => navigate('/map')}
                />
              ))}
            </Box>
          </Collapse>
        </MotionBox>

        {/* Feature Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={feature.id}>
              <MotionCard
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                onClick={() => setSelectedFeature(feature)}
                sx={{
                  ...styles.mysticalCard,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '200px',
                    background: feature.gradient,
                    opacity: 0.3,
                    transition: 'opacity 0.3s',
                  },
                  '&:hover::before': {
                    opacity: 0.5,
                  },
                }}
              >
                {feature.badge && (
                  <Chip
                    label={feature.badge}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 2,
                      bgcolor: theme.primary,
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      boxShadow: `0 0 15px ${theme.glow}`,
                    }}
                  />
                )}
                <Box sx={{ 
                  height: 200, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                  gap: 1,
                }}>
                  <Box sx={{ 
                    color: theme.primary,
                    filter: `drop-shadow(0 0 20px ${theme.glow})`,
                    transition: 'all 0.3s',
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: theme.textSecondary,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {feature.subtitle}
                  </Typography>
                </Box>
                <CardContent>
                  <Typography 
                    variant="h4" 
                    sx={{
                      color: theme.primary,
                      fontWeight: 700,
                      letterSpacing: 1,
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.textColor, 
                      lineHeight: 1.8,
                      mb: 3,
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {Object.entries(feature.details.stats).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${value} ${key}`}
                        size="small"
                        sx={{
                          bgcolor: `${theme.primary}22`,
                          color: theme.primary,
                          border: `1px solid ${theme.primary}66`,
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 3,
                      color: theme.primary,
                      '&:hover': {
                        bgcolor: `${theme.primary}22`,
                      },
                    }}
                  >
                    Learn More & Enter
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Hidden Treasures Section - Lazy loaded when scrolled into view */}
        <LazySection minHeight={300} rootMargin="200px">
          <Box sx={{ ...styles.mysticalCard, p: 6, mb: 8, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{
                ...styles.glowText,
                mb: 2,
              }}
            >
              HIDDEN TREASURES
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: theme.textSecondary,
                letterSpacing: 2,
                textTransform: 'uppercase',
                mb: 4,
              }}
            >
              Discover the secrets scattered across Saint Paul
            </Typography>
            <Grid container spacing={3}>
              {hiddenTreasures.map((treasure, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Box
                    onClick={() => navigate(treasure.link)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: `${treasure.color}22`,
                      border: `2px solid ${treasure.color}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 8px 30px ${treasure.color}66`,
                      },
                    }}
                  >
                    <Box sx={{ color: treasure.color, mb: 1, filter: `drop-shadow(0 0 10px ${treasure.color})` }}>
                      {React.cloneElement(treasure.icon, { sx: { fontSize: 50 } })}
                    </Box>
                    <Typography component="h3" variant="h6" sx={{ color: treasure.color, fontWeight: 700, mb: 0.5 }}>
                      {treasure.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                      {treasure.count}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.textColor,
                mt: 4,
                fontStyle: 'italic',
              }}
            >
              👻 Pro tip: Ghost stories are hidden throughout the map—find them all to unlock
              the complete haunted history of Saint Paul!
            </Typography>
          </Box>
        </LazySection>

        {/* Call to Action - Lazy loaded */}
        <LazySection minHeight={200} rootMargin="150px">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: theme.primary,
                fontWeight: 700,
                mb: 3,
              }}
            >
              Begin Your Journey
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.textColor,
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              Whether you're a longtime resident, curious visitor, or history enthusiast,
              the mystical portal awaits. Step through and experience Saint Paul as you've
              never seen it before.
            </Typography>
            <Button
              onClick={() => navigate('/map')}
              variant="contained"
              size="large"
              sx={{
                ...styles.portalButton,
                px: 6,
                py: 2,
                fontSize: '1.2rem',
              }}
            >
              OPEN THE PORTAL NOW
            </Button>
          </Box>
        </LazySection>
      </Container>

      {/* Feature Detail Dialog */}
      <Dialog
        open={Boolean(selectedFeature)}
        onClose={() => setSelectedFeature(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            ...styles.mysticalCard,
            m: 2,
          },
        }}
      >
        {selectedFeature && (
          <>
            <DialogTitle sx={{ 
              background: selectedFeature.gradient,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {selectedFeature.icon}
                <Box>
                  <Typography component="h2" variant="h4" sx={{ fontWeight: 700 }}>
                    {selectedFeature.title}
                  </Typography>
                  <Typography variant="caption" sx={{ letterSpacing: 2, textTransform: 'uppercase' }}>
                    {selectedFeature.subtitle}
                  </Typography>
                </Box>
              </Box>
              <IconButton aria-label="close feature details" onClick={() => setSelectedFeature(null)} sx={{ color: '#fff' }}>
                <Suspense fallback={<IconFallback />}><CloseIcon /></Suspense>
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Typography component="h3" variant="h6" sx={{ color: theme.primary, fontWeight: 700, mb: 2 }}>
                Key Features:
              </Typography>
              <List>
                {selectedFeature.details.features.map((feat, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <Suspense fallback={<IconFallback />}><LocationOnIcon sx={{ color: theme.primary }} /></Suspense>
                    </ListItemIcon>
                    <ListItemText
                      primary={feat}
                      primaryTypographyProps={{
                        sx: { color: theme.textColor },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate(selectedFeature.link)}
                sx={{
                  ...styles.portalButton,
                  mt: 3,
                }}
              >
                ENTER {selectedFeature.title.toUpperCase()}
              </Button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Home;