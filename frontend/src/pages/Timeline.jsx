import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch events from API
    // For now, using sample data
    setEvents([
      {
        id: 1,
        year: 1849,
        title: 'Minnesota Territory Created',
        description: 'Saint Paul becomes the capital of the newly created Minnesota Territory.',
        category: 'political',
      },
      {
        id: 2,
        year: 1854,
        title: 'City of Saint Paul Incorporated',
        description: 'Saint Paul officially becomes an incorporated city.',
        category: 'political',
      },
      {
        id: 3,
        year: 1862,
        title: 'First Railroad Arrives',
        description: 'The first railroad reaches Saint Paul, transforming it into a major transportation hub.',
        category: 'infrastructure',
      },
      {
        id: 4,
        year: 1905,
        title: 'State Capitol Completed',
        description: 'The current Minnesota State Capitol building is completed after four years of construction.',
        category: 'infrastructure',
      },
      {
        id: 5,
        year: 1926,
        title: 'F. Scott Fitzgerald Publishes The Great Gatsby',
        description: 'Saint Paul native F. Scott Fitzgerald publishes his masterpiece.',
        category: 'cultural',
      },
      {
        id: 6,
        year: 1959,
        title: 'Science Museum Founded',
        description: 'The Science Museum of Minnesota opens its doors to the public.',
        category: 'cultural',
      },
    ]);
  }, []);

  const categories = ['all', 'political', 'cultural', 'economic', 'social', 'infrastructure'];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter);

  const getCategoryColor = (category) => {
    const colors = {
      political: '#1a4d7d',
      cultural: '#c8102e',
      economic: '#4a7ba7',
      social: '#2e8b57',
      infrastructure: '#8b4513',
    };
    return colors[category] || '#666';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Historical Timeline
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Explore the key moments that shaped Saint Paul's history
        </Typography>

        <TextField
          select
          label="Filter by Category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 200, mt: 2 }}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {/* Timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: 'primary.main',
            transform: 'translateX(-50%)',
            display: { xs: 'none', md: 'block' },
          }}
        />

        {filteredEvents.map((event, index) => (
          <MotionCard
            key={event.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            sx={{
              mb: 4,
              ml: { xs: 0, md: index % 2 === 0 ? 0 : 'auto' },
              mr: { xs: 0, md: index % 2 === 0 ? 'auto' : 0 },
              width: { xs: '100%', md: '45%' },
              position: 'relative',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  [index % 2 === 0 ? 'right' : 'left']: { xs: 'auto', md: -60 },
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: getCategoryColor(event.category),
                  color: 'white',
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {event.year}
              </Box>
              
              <Chip
                label={event.category}
                size="small"
                sx={{
                  bgcolor: getCategoryColor(event.category),
                  color: 'white',
                  mb: 1,
                }}
              />
              
              <Typography variant="h5" gutterBottom sx={{ display: { xs: 'block', md: 'none' } }}>
                {event.year}
              </Typography>
              
              <Typography variant="h5" gutterBottom>
                {event.title}
              </Typography>
              
              <Typography variant="body1" color="text.secondary">
                {event.description}
              </Typography>
            </CardContent>
          </MotionCard>
        ))}
      </Box>
    </Container>
  );
};

export default Timeline;
