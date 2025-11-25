import React from 'react';
import StatusPanel from '../components/StatusPanel';
import SEO from '../components/SEO';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import MapIcon from '@mui/icons-material/Map';
import TimelineIcon from '@mui/icons-material/Timeline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Home = () => {
  const features = [
    {
      title: 'Interactive Map',
      description: 'Explore Saint Paul through an interactive map showcasing historical landmarks, cultural sites, and points of interest. Filter by era, category, and discover hidden stories.',
      icon: <MapIcon sx={{ fontSize: 60 }} />,
      link: '/map',
      color: '#1a4d7d',
      badge: 'Start Here',
    },
    {
      title: 'Historical Timeline',
      description: 'Journey through time and discover the pivotal events that shaped Saint Paul into the vibrant city it is today.',
      icon: <TimelineIcon sx={{ fontSize: 60 }} />,
      link: '/timeline',
      color: '#c8102e',
    },
    {
      title: 'Digital Library',
      description: 'Access a comprehensive collection of historical documents, photographs, stories, and archives.',
      icon: <LibraryBooksIcon sx={{ fontSize: 60 }} />,
      link: '/library',
      color: '#4a7ba7',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <SEO title="Saint Paul Historical Library" description="Explore Saint Paul's rich history: interactive map, timeline, 3D viewer, and digital archives." canonical={window.location.href} />
      <StatusPanel />
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ textAlign: 'center', mb: 8 }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: 'primary.main' }}
        >
          Discover Saint Paul
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Experience the rich history, vibrant culture, and enduring legacy of Minnesota's capital city
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/map"
            variant="contained"
            size="large"
            sx={{ mr: 2 }}
          >
            Explore Map
          </Button>
          <Button
            component={RouterLink}
            to="/timeline"
            variant="outlined"
            size="large"
          >
            View Timeline
          </Button>
        </Box>
      </MotionBox>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  bgcolor: feature.color,
                  color: 'white',
                  position: 'relative',
                }}
              >
                {feature.icon}
                {feature.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      color: feature.color,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      boxShadow: 2,
                    }}
                  >
                    {feature.badge}
                  </Box>
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to={feature.link}
                  size="small"
                  color="primary"
                >
                  Learn More
                </Button>
              </CardActions>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          About Saint Paul
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Founded in 1854, Saint Paul is the capital and second-largest city of Minnesota.
          Rich in history and culture, the city has been a crossroads of commerce, innovation,
          and community for over 150 years. From its Native American heritage to its role
          as a major transportation hub, Saint Paul's story is one of resilience, diversity,
          and continuous growth.
        </Typography>
        <Button
          component={RouterLink}
          to="/about"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Read More About Our Mission
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
