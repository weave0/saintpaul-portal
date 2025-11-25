import React from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import { getMysticalTheme, getGlobalMysticalStyles } from '../theme/mysticalTheme';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ExploreIcon from '@mui/icons-material/Explore';
import TimelineIcon from '@mui/icons-material/Timeline';

const About = () => {
  const theme = getMysticalTheme(2025);
  const styles = getGlobalMysticalStyles(theme);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `${theme.backgroundGradient}, radial-gradient(circle at 20% 20%, ${theme.glow} 0%, transparent 50%)`,
      py: 8,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              ...styles.glowText,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
            }}
          >
            THE MYSTICAL PORTAL
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.textSecondary,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontWeight: 300,
            }}
          >
            Journey Through Saint Paul's Layered Histories
          </Typography>
        </Box>

        <Paper sx={{ ...styles.mysticalCard, p: 5, mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AutoStoriesIcon sx={{ fontSize: 40, color: theme.primary, filter: `drop-shadow(0 0 8px ${theme.glow})` }} />
            <Typography variant="h4" sx={{ color: theme.primary, fontWeight: 700 }}>
              Our Vision
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ color: theme.textColor, fontSize: '1.1rem', lineHeight: 1.8 }}>
            This is not merely a digital archive—it is a **mystical portal** through time itself.
            We've woven together five distinct eras of Saint Paul's history, each with its own
            visual identity, atmosphere, and soul. From the sepia-toned Pioneer Era to the
            cyan-lit Contemporary age, you can literally *see* and *feel* how the city transformed.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.textColor, fontSize: '1.1rem', lineHeight: 1.8 }}>
            Our mission transcends traditional historical preservation. We're creating an
            **immersive temporal experience**—combining 3D visualization, interactive maps,
            atmospheric effects, and narrative storytelling to make Saint Paul's past pulse
            with life in ways no textbook ever could.
          </Typography>
        </Paper>

        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ ...styles.mysticalCard, p: 4, height: '100%', textAlign: 'center' }}>
              <ExploreIcon sx={{ 
                fontSize: 60, 
                color: theme.primary,
                filter: `drop-shadow(0 0 15px ${theme.glow})`,
                mb: 2,
              }} />
              <Typography variant="h5" gutterBottom sx={{ color: theme.primary, fontWeight: 700, mb: 2 }}>
                FIVE ERAS
              </Typography>
              <Typography variant="body1" sx={{ color: theme.textColor, lineHeight: 1.7 }}>
                Pioneer (1850-1880) • Gilded Age (1880-1920) • Art Deco (1920-1950) • 
                Modern (1950-1980) • Contemporary (1980-2025)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ ...styles.mysticalCard, p: 4, height: '100%', textAlign: 'center' }}>
              <TimelineIcon sx={{ 
                fontSize: 60, 
                color: theme.primary,
                filter: `drop-shadow(0 0 15px ${theme.glow})`,
                mb: 2,
              }} />
              <Typography variant="h5" gutterBottom sx={{ color: theme.primary, fontWeight: 700, mb: 2 }}>
                TEMPORAL NAVIGATION
              </Typography>
              <Typography variant="body1" sx={{ color: theme.textColor, lineHeight: 1.7 }}>
                Slide through 175 years of history. Watch buildings rise and fall, neighborhoods
                transform, and stories unfold across generations.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ ...styles.mysticalCard, p: 4, height: '100%', textAlign: 'center' }}>
              <AutoStoriesIcon sx={{ 
                fontSize: 60, 
                color: theme.primary,
                filter: `drop-shadow(0 0 15px ${theme.glow})`,
                mb: 2,
              }} />
              <Typography variant="h5" gutterBottom sx={{ color: theme.primary, fontWeight: 700, mb: 2 }}>
                LIVING NARRATIVES
              </Typography>
              <Typography variant="body1" sx={{ color: theme.textColor, lineHeight: 1.7 }}>
                Ghost stories, music history, famous residents, cultural events—all woven into
                an interconnected web of stories that bring the city to life.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ ...styles.mysticalCard, p: 5 }}>
          <Typography variant="h4" gutterBottom sx={{ color: theme.primary, fontWeight: 700, mb: 3 }}>
            The Portal Experience
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.textColor, fontSize: '1.1rem', lineHeight: 1.8 }}>
            **Interactive 2D/3D Maps** • Navigate Saint Paul in both traditional map view and
            immersive 3D reconstruction. See 3D buildings rise from the ground, explore neighborhoods
            from street level, and discover hidden historical gems.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.textColor, fontSize: '1.1rem', lineHeight: 1.8 }}>
            **Atmospheric Effects** • Night sky overlays, era-specific color grading, ambient glows,
            and mystical transitions make each era feel distinct and alive.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.textColor, fontSize: '1.1rem', lineHeight: 1.8 }}>
            **Building Specifications** • Dive deep into architectural details—blueprints, construction
            dates, architects, styles, and the stories behind each structure.
          </Typography>
          <Typography variant="body1" sx={{ color: theme.textColor, fontSize: '1.1rem', lineHeight: 1.8 }}>
            **Cultural Layers** • Music venues, food heritage, famous residents, ghost stories, and
            major events—all discoverable as you explore the temporal landscape.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
