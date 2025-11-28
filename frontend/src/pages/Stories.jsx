import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Fade,
  Collapse,
  Grid,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Place,
  Schedule,
  AutoStories,
  Visibility,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

// Atmospheric background effects
const AtmosphericBackground = ({ mood, category }) => {
  const moodColors = {
    ghost: ['rgba(159, 0, 255, 0.1)', 'rgba(45, 27, 78, 0.8)'],
    legend: ['rgba(212, 175, 55, 0.1)', 'rgba(26, 77, 125, 0.8)'],
    sacred: ['rgba(74, 123, 167, 0.1)', 'rgba(45, 27, 78, 0.6)'],
    crime: ['rgba(139, 0, 0, 0.1)', 'rgba(26, 26, 46, 0.9)'],
    culture: ['rgba(255, 20, 147, 0.1)', 'rgba(45, 27, 78, 0.7)'],
  };

  const colors = moodColors[category] || moodColors.ghost;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: `
          radial-gradient(ellipse at 20% 20%, ${colors[0]} 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, ${colors[0]} 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0f 0%, ${colors[1]} 50%, #0a0a0f 100%)
        `,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          opacity: 0.03,
          pointerEvents: 'none',
        },
      }}
    />
  );
};

// Floating particles effect
const FloatingParticles = ({ category }) => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  const particleColors = {
    ghost: 'rgba(159, 0, 255, 0.3)',
    legend: 'rgba(212, 175, 55, 0.3)',
    sacred: 'rgba(74, 123, 167, 0.3)',
    crime: 'rgba(139, 0, 0, 0.3)',
    culture: 'rgba(255, 20, 147, 0.3)',
  };

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: particleColors[category] || particleColors.ghost,
            boxShadow: `0 0 ${p.size * 2}px ${particleColors[category] || particleColors.ghost}`,
            animation: `float-${p.id} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            '@keyframes': {
              [`float-${p.id}`]: {
                '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: 0.3 },
                '50%': { transform: `translateY(-30px) translateX(${Math.random() > 0.5 ? 20 : -20}px)`, opacity: 0.7 },
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

// Story card for list view
const StoryCard = ({ story, onClick }) => {
  const categoryData = storiesData.categories[story.category] || {};
  
  return (
    <MotionBox
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
    >
      <Card
        sx={{
          background: 'rgba(20, 20, 30, 0.8)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${categoryData.color || '#9f00ff'}40`,
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: categoryData.color || '#9f00ff',
            boxShadow: `0 0 30px ${categoryData.color || '#9f00ff'}30`,
          },
        }}
      >
        <Box
          sx={{
            height: 8,
            background: `linear-gradient(90deg, ${categoryData.color || '#9f00ff'}, transparent)`,
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: '1.5rem' }}>{categoryData.icon || '👻'}</Typography>
            <Chip
              label={categoryData.name || story.category}
              size="small"
              sx={{
                backgroundColor: `${categoryData.color || '#9f00ff'}20`,
                color: categoryData.color || '#9f00ff',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                letterSpacing: 1,
              }}
            />
            <Chip
              label={story.era}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
            />
          </Box>
          
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(135deg, #fff 0%, ${categoryData.color || '#9f00ff'} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {story.title}
          </Typography>
          
          <Typography
            variant="subtitle1"
            sx={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', mb: 2 }}
          >
            {story.subtitle}
          </Typography>
          
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.8,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {story.narrative.hook}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'rgba(255,255,255,0.5)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Place sx={{ fontSize: 16 }} />
              <Typography variant="caption">{story.location.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AutoStories sx={{ fontSize: 16 }} />
              <Typography variant="caption">{story.narrative.chapters.length} chapters</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </MotionBox>
  );
};

// Full story view
const StoryReader = ({ story, onBack }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showManifestations, setShowManifestations] = useState(false);
  const categoryData = storiesData.categories[story.category] || {};
  const chapter = story.narrative.chapters[currentChapter];

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 64,
          zIndex: 10,
          py: 2,
          px: 3,
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={onBack}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Back to Stories
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Chapter {currentChapter + 1} of {story.narrative.chapters.length}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pt: 6 }}>
        {/* Story header */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Chip
              icon={<span>{categoryData.icon}</span>}
              label={categoryData.name}
              sx={{
                backgroundColor: `${categoryData.color}20`,
                color: categoryData.color,
                fontWeight: 600,
              }}
            />
            <Chip
              label={story.era}
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
            />
          </Box>
          
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3.5rem' },
              mb: 2,
              background: `linear-gradient(135deg, #fff 0%, ${categoryData.color} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 0 60px ${categoryData.color}40`,
            }}
          >
            {story.title}
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontStyle: 'italic',
              fontWeight: 300,
              mb: 4,
            }}
          >
            {story.subtitle}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
            <Place sx={{ color: categoryData.color }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {story.location.name} • {story.location.address}
            </Typography>
          </Box>
        </MotionBox>

        {/* Hook quote */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          sx={{
            mb: 8,
            p: 4,
            borderLeft: `4px solid ${categoryData.color}`,
            background: 'rgba(20, 20, 30, 0.5)',
            borderRadius: '0 16px 16px 0',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.8,
            }}
          >
            "{story.narrative.hook}"
          </Typography>
        </MotionBox>

        {/* Chapter content */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentChapter}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            sx={{ mb: 6 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: categoryData.color,
                letterSpacing: 3,
                display: 'block',
                mb: 1,
              }}
            >
              Chapter {currentChapter + 1}
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: '#fff',
              }}
            >
              {chapter.title}
            </Typography>
            
            <Typography
              sx={{
                fontSize: '1.2rem',
                lineHeight: 2,
                color: 'rgba(255,255,255,0.85)',
                textAlign: 'justify',
                '&::first-letter': {
                  fontSize: '4rem',
                  float: 'left',
                  lineHeight: 1,
                  fontWeight: 700,
                  color: categoryData.color,
                  marginRight: '0.5rem',
                },
              }}
            >
              {chapter.content}
            </Typography>
          </MotionBox>
        </AnimatePresence>

        {/* Chapter navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => setCurrentChapter((c) => Math.max(0, c - 1))}
            disabled={currentChapter === 0}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Previous
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {story.narrative.chapters.map((_, i) => (
              <Box
                key={i}
                onClick={() => setCurrentChapter(i)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: i === currentChapter ? categoryData.color : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { backgroundColor: categoryData.color },
                }}
              />
            ))}
          </Box>
          
          <Button
            endIcon={<ArrowForward />}
            onClick={() => setCurrentChapter((c) => Math.min(story.narrative.chapters.length - 1, c + 1))}
            disabled={currentChapter === story.narrative.chapters.length - 1}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Next
          </Button>
        </Box>

        {/* Epilogue - show after last chapter */}
        {currentChapter === story.narrative.chapters.length - 1 && (
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            sx={{
              mb: 8,
              p: 4,
              background: `linear-gradient(135deg, ${categoryData.color}10, transparent)`,
              border: `1px solid ${categoryData.color}30`,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: categoryData.color, letterSpacing: 3, display: 'block', mb: 2 }}
            >
              Epilogue
            </Typography>
            <Typography
              sx={{
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.9,
              }}
            >
              {story.narrative.epilogue}
            </Typography>
          </MotionBox>
        )}

        {/* Manifestations / Evidence */}
        {story.manifestations && (
          <Box sx={{ mb: 6 }}>
            <Button
              onClick={() => setShowManifestations(!showManifestations)}
              startIcon={<Visibility />}
              sx={{
                color: categoryData.color,
                borderColor: categoryData.color,
                mb: 2,
              }}
              variant="outlined"
            >
              {showManifestations ? 'Hide' : 'Show'} Reported Phenomena
            </Button>
            
            <Collapse in={showManifestations}>
              <Grid container spacing={2}>
                {story.manifestations.map((m, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box
                      sx={{
                        p: 2,
                        background: 'rgba(20, 20, 30, 0.6)',
                        borderRadius: 2,
                        borderLeft: `3px solid ${categoryData.color}`,
                      }}
                    >
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{m}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          </Box>
        )}

        {/* Visit info */}
        {story.visit_info && (
          <Box
            sx={{
              p: 4,
              background: 'rgba(20, 20, 30, 0.8)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
              📍 Visit This Location
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Status</Typography>
                <Typography sx={{ color: '#fff' }}>{story.visit_info.status}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Type</Typography>
                <Typography sx={{ color: '#fff' }}>{story.visit_info.type}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Ghost Tours</Typography>
                <Typography sx={{ color: '#fff' }}>{story.visit_info.ghost_tours ? 'Yes' : 'No'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Best Time</Typography>
                <Typography sx={{ color: '#fff' }}>{story.visit_info.best_time}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Insider Tip</Typography>
                <Typography sx={{ color: categoryData.color, fontStyle: 'italic' }}>
                  💡 {story.visit_info.tip}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

// Main Stories page
const Stories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [storiesData, setStoriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { category: routeCategory } = useParams();
  const [searchParams] = useSearchParams();
  
  // Get category from URL params or query string
  const urlCategory = routeCategory || searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'all');
  
  // Load stories data
  useEffect(() => {
    fetch('/data/mystical-stories.json')
      .then(r => r.json())
      .then(data => {
        setStoriesData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stories:', err);
        setLoading(false);
      });
  }, []);
  
  // Update category when URL changes
  useEffect(() => {
    const newCategory = routeCategory || searchParams.get('category');
    if (newCategory && newCategory !== activeCategory) {
      setActiveCategory(newCategory);
    }
  }, [location, routeCategory, searchParams]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <CircularProgress sx={{ color: '#9f00ff' }} />
      </Box>
    );
  }

  if (!storiesData) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <Typography sx={{ color: '#fff' }}>Failed to load stories</Typography>
      </Box>
    );
  }

  const stories = storiesData.featured_stories;
  const categories = storiesData.categories;

  const filteredStories = activeCategory === 'all' 
    ? stories 
    : stories.filter(s => s.category === activeCategory);

  if (selectedStory) {
    return (
      <>
        <AtmosphericBackground category={selectedStory.category} />
        <FloatingParticles category={selectedStory.category} />
        <StoryReader 
          story={selectedStory} 
          onBack={() => setSelectedStory(null)} 
        />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Shadows of Saint Paul | Mystical Stories" 
        description="Discover the haunted history, mysterious legends, and untold stories of Saint Paul, Minnesota."
      />
      <AtmosphericBackground category="ghost" />
      <FloatingParticles category="ghost" />
      
      <Box sx={{ minHeight: '100vh', py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center', mb: 8 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: '#9f00ff',
                letterSpacing: 6,
                fontSize: '0.9rem',
                display: 'block',
                mb: 2,
              }}
            >
              Enter the Shadows
            </Typography>
            
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                background: 'linear-gradient(135deg, #fff 0%, #9f00ff 50%, #d4af37 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {storiesData.meta.title}
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontStyle: 'italic',
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              {storiesData.meta.subtitle}
            </Typography>
          </MotionBox>

          {/* Category filters */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 6 }}>
            <Chip
              label="All Stories"
              onClick={() => setActiveCategory('all')}
              sx={{
                backgroundColor: activeCategory === 'all' ? 'rgba(159, 0, 255, 0.3)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 600,
                '&:hover': { backgroundColor: 'rgba(159, 0, 255, 0.4)' },
              }}
            />
            {Object.entries(categories).map(([key, cat]) => (
              <Chip
                key={key}
                icon={<span>{cat.icon}</span>}
                label={cat.name}
                onClick={() => setActiveCategory(key)}
                sx={{
                  backgroundColor: activeCategory === key ? `${cat.color}40` : 'rgba(255,255,255,0.1)',
                  color: activeCategory === key ? cat.color : '#fff',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: `${cat.color}30` },
                }}
              />
            ))}
          </Box>

          {/* Stories grid */}
          <Grid container spacing={4}>
            {filteredStories.map((story, index) => (
              <Grid item xs={12} md={6} key={story.id}>
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <StoryCard 
                    story={story} 
                    onClick={() => setSelectedStory(story)}
                  />
                </MotionBox>
              </Grid>
            ))}
          </Grid>

          {/* Coming soon teaser */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            sx={{
              mt: 8,
              p: 4,
              textAlign: 'center',
              background: 'rgba(20, 20, 30, 0.5)',
              borderRadius: 3,
              border: '1px solid rgba(159, 0, 255, 0.3)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#9f00ff', mb: 1 }}>
              🔮 More Stories Coming Soon
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
              The gangster era of Saint Paul • Music legends of the Twin Cities • 
              Famous residents and their secrets • Sacred Dakota sites • 
              Prohibition nightlife • And mysteries yet untold...
            </Typography>
          </MotionBox>
        </Container>
      </Box>
    </>
  );
};

export default Stories;
