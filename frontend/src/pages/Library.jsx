import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BuildingSpecExplorer from '../components/BuildingSpecExplorer';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const collections = [
    {
      title: 'Historic Photographs',
      description: 'Browse thousands of historic photographs documenting Saint Paul\'s evolution.',
      image: 'https://via.placeholder.com/400x300?text=Historic+Photos',
      count: '5,000+ items',
    },
    {
      title: 'Maps & Atlases',
      description: 'Explore historic maps showing the growth and development of the city.',
      image: 'https://via.placeholder.com/400x300?text=Historic+Maps',
      count: '500+ items',
    },
    {
      title: 'Documents & Records',
      description: 'Access city records, newspapers, and official documents from throughout history.',
      image: 'https://via.placeholder.com/400x300?text=Documents',
      count: '10,000+ items',
    },
    {
      title: 'Building Specifications',
      description: 'Explore detailed architectural specifications and blueprints.',
      image: 'https://via.placeholder.com/400x300?text=Buildings',
      count: '1,500+ specs',
    },
    {
      title: 'Oral Histories',
      description: 'Listen to personal accounts and stories from Saint Paul residents past and present.',
      image: 'https://via.placeholder.com/400x300?text=Oral+Histories',
      count: '200+ recordings',
    },
    {
      title: 'Architecture',
      description: 'Study the architectural heritage of Saint Paul\'s buildings and neighborhoods.',
      image: 'https://via.placeholder.com/400x300?text=Architecture',
      count: '1,000+ items',
    },
    {
      title: 'Cultural Heritage',
      description: 'Discover the diverse cultural communities that have shaped Saint Paul.',
      image: 'https://via.placeholder.com/400x300?text=Cultural+Heritage',
      count: '2,000+ items',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Digital Library
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Explore our comprehensive collection of historical resources
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search the library..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 600, mt: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="All Collections" />
          <Tab label="Building Specs" />
          <Tab label="Photos" />
          <Tab label="Documents" />
        </Tabs>
      </Box>

      {activeTab === 1 ? (
        <BuildingSpecExplorer />
      ) : (
        <Grid container spacing={4}>
          {collections.map((collection, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    cursor: 'pointer',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={collection.image}
                  alt={collection.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {collection.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {collection.description}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    {collection.count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      </Grid>
    </Container>
  );
};

export default Library;
