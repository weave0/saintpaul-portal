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
  Chip,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import MapIcon from '@mui/icons-material/Map';
import DescriptionIcon from '@mui/icons-material/Description';
import ApartmentIcon from '@mui/icons-material/Apartment';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import PublicIcon from '@mui/icons-material/Public';
import BuildingSpecExplorer from '../components/BuildingSpecExplorer';
import { getMysticalTheme, getGlobalMysticalStyles } from '../theme/mysticalTheme';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const theme = getMysticalTheme(2025);
  const styles = getGlobalMysticalStyles(theme);

  const collections = [
    {
      title: 'Historic Photographs',
      description: 'Browse thousands of historic photographs documenting Saint Paul\'s evolution.',
      icon: <PhotoLibraryIcon sx={{ fontSize: 60 }} />,
      count: '5,000+ items',
      gradient: 'linear-gradient(135deg, #8b7355 0%, #d4a574 100%)',
    },
    {
      title: 'Maps & Atlases',
      description: 'Explore historic maps showing the growth and development of the city.',
      icon: <MapIcon sx={{ fontSize: 60 }} />,
      count: '500+ items',
      gradient: 'linear-gradient(135deg, #d4af37 0%, #f0c14b 100%)',
    },
    {
      title: 'Documents & Records',
      description: 'Access city records, newspapers, and official documents from throughout history.',
      icon: <DescriptionIcon sx={{ fontSize: 60 }} />,
      count: '10,000+ items',
      gradient: 'linear-gradient(135deg, #4169e1 0%, #6495ed 100%)',
    },
    {
      title: 'Building Specifications',
      description: 'Explore detailed architectural specifications and blueprints.',
      icon: <ApartmentIcon sx={{ fontSize: 60 }} />,
      count: '1,500+ specs',
      gradient: 'linear-gradient(135deg, #32cd32 0%, #7fff00 100%)',
    },
    {
      title: 'Oral Histories',
      description: 'Listen to personal accounts and stories from Saint Paul residents past and present.',
      icon: <RecordVoiceOverIcon sx={{ fontSize: 60 }} />,
      count: '200+ recordings',
      gradient: 'linear-gradient(135deg, #00ffff 0%, #5dfdfd 100%)',
    },
    {
      title: 'Architecture',
      description: 'Study the architectural heritage of Saint Paul\'s buildings and neighborhoods.',
      icon: <ArchitectureIcon sx={{ fontSize: 60 }} />,
      count: '1,000+ items',
      gradient: 'linear-gradient(135deg, #8b7355 0%, #b8923a 100%)',
    },
    {
      title: 'Cultural Heritage',
      description: 'Discover the diverse cultural communities that have shaped Saint Paul.',
      icon: <PublicIcon sx={{ fontSize: 60 }} />,
      count: '2,000+ items',
      gradient: 'linear-gradient(135deg, #d4af37 0%, #4169e1 100%)',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `${theme.backgroundGradient}, radial-gradient(circle at 80% 20%, ${theme.glow} 0%, transparent 50%)`,
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
            ARCHIVES OF TIME
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.textSecondary,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontWeight: 300,
              mb: 4,
            }}
          >
            Explore our comprehensive collection of historical resources
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search across time and space..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              maxWidth: 700, 
              '& .MuiOutlinedInput-root': {
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
                color: theme.textColor,
                border: `2px solid ${theme.borderColor}66`,
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover': {
                  border: `2px solid ${theme.primary}`,
                  boxShadow: `0 0 20px ${theme.glow}`,
                },
                '&.Mui-focused': {
                  border: `2px solid ${theme.primary}`,
                  boxShadow: `0 0 30px ${theme.glow}`,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: theme.textSecondary,
                opacity: 0.7,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.primary, filter: `drop-shadow(0 0 8px ${theme.glow})` }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ borderBottom: `2px solid ${theme.borderColor}33`, mb: 6 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
            sx={{
              '& .MuiTab-root': {
                color: theme.textSecondary,
                fontWeight: 600,
                letterSpacing: 1.5,
                fontSize: '0.9rem',
                transition: 'all 0.3s',
                '&:hover': {
                  color: theme.primary,
                  textShadow: `0 0 10px ${theme.glow}`,
                },
                '&.Mui-selected': {
                  color: theme.primary,
                  textShadow: `0 0 15px ${theme.glow}`,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.primary,
                height: 3,
                boxShadow: `0 0 15px ${theme.glow}`,
              },
            }}
          >
            <Tab label="ALL COLLECTIONS" />
            <Tab label="BUILDING SPECS" />
            <Tab label="PHOTOS" />
            <Tab label="DOCUMENTS" />
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
                    ...styles.mysticalCard,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '180px',
                      background: collection.gradient,
                      opacity: 0.3,
                      transition: 'opacity 0.3s',
                    },
                    '&:hover::before': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <Box sx={{ 
                    height: 180, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <Box sx={{ 
                      color: theme.primary,
                      filter: `drop-shadow(0 0 15px ${theme.glow})`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        filter: `drop-shadow(0 0 25px ${theme.glow})`,
                      },
                    }}>
                      {collection.icon}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2"
                      sx={{
                        color: theme.primary,
                        fontWeight: 700,
                        letterSpacing: 1,
                        mb: 2,
                      }}
                    >
                      {collection.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      paragraph
                      sx={{ color: theme.textColor, lineHeight: 1.7, mb: 2 }}
                    >
                      {collection.description}
                    </Typography>
                    <Chip
                      label={collection.count}
                      sx={{
                        bgcolor: `${theme.primary}22`,
                        color: theme.primary,
                        border: `1px solid ${theme.primary}`,
                        fontWeight: 700,
                        boxShadow: `0 0 10px ${theme.glow}`,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Library;
