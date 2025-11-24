import React from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          About This Project
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Our mission to preserve and share Saint Paul's rich history
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          The Saint Paul Historical Library & Map project is dedicated to creating the most
          comprehensive, accessible, and engaging digital resource for exploring the history,
          culture, and development of Saint Paul, Minnesota.
        </Typography>
        <Typography variant="body1" paragraph>
          We believe that understanding our past is essential to building a better future.
          Through this platform, we aim to make Saint Paul's rich heritage accessible to
          everyone—from students and researchers to longtime residents and curious visitors.
        </Typography>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              What We Offer
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li>Interactive map of historical locations</li>
                <li>Comprehensive timeline of key events</li>
                <li>Digital archive of photos, documents, and media</li>
                <li>Curated collections and exhibitions</li>
                <li>Educational resources for all ages</li>
              </ul>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Get Involved
            </Typography>
            <Typography variant="body1" paragraph>
              This is a community project, and we welcome contributions from everyone.
              Whether you have historic photos to share, stories to tell, or research
              to contribute, your input helps make this resource richer and more complete.
            </Typography>
            <Typography variant="body1">
              Contact us to learn how you can contribute to preserving Saint Paul's history.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Saint Paul
        </Typography>
        <Typography variant="body1" paragraph>
          Saint Paul, the capital of Minnesota, was founded in 1854 and has grown from a
          small frontier settlement into a vibrant metropolitan city. Located along the
          Mississippi River, the city has played a crucial role in American history as a
          center of commerce, transportation, and culture.
        </Typography>
        <Typography variant="body1" paragraph>
          The city is known for its well-preserved Victorian architecture, diverse neighborhoods,
          and rich cultural heritage. From its Native American roots through waves of European,
          African, Asian, and Latino immigration, Saint Paul has been shaped by the contributions
          of people from around the world.
        </Typography>
        <Typography variant="body1">
          Today, Saint Paul continues to honor its past while building for the future, maintaining
          a unique identity that sets it apart from its twin city, Minneapolis, just across the river.
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
