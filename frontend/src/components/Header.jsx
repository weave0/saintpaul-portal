import React, { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../store/themeMode';
import usePrefetchMap from '../hooks/usePrefetchMap';
import MapIcon from '@mui/icons-material/Map';
import TimelineIcon from '@mui/icons-material/Timeline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InfoIcon from '@mui/icons-material/Info';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefetchMap = usePrefetchMap();

  // Routes that use map resources
  const mapRoutes = ['/map', '/3d-viewer'];

  const menuItems = [
    { text: 'Home', path: '/', icon: null },
    { text: 'Stories', path: '/stories', icon: <AutoStoriesIcon /> },
    { text: 'Interactive Map', path: '/map', icon: <MapIcon /> },
    { text: '3D Viewer', path: '/3d-viewer', icon: <ViewInArIcon /> },
    { text: 'Timeline', path: '/timeline', icon: <TimelineIcon /> },
    { text: 'Library', path: '/library', icon: <LibraryBooksIcon /> },
    { text: 'About', path: '/about', icon: <InfoIcon /> },
  ];

  // Create prefetch handler for map routes
  const getPrefetchHandlers = useCallback((path) => {
    if (mapRoutes.includes(path)) {
      return { onMouseEnter: prefetchMap, onFocus: prefetchMap };
    }
    return {};
  }, [prefetchMap]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const { mode, toggleMode } = useThemeMode();

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            Saint Paul Historical Library
          </Typography>

          <IconButton color="inherit" aria-label="toggle theme mode" onClick={toggleMode} sx={{ mr: 1 }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          {isMobile ? (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="open navigation menu"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{ ml: 2 }}
                  {...getPrefetchHandlers(item.path)}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={RouterLink}
                to={item.path}
                {...getPrefetchHandlers(item.path)}
              >
                {item.icon}
                <ListItemText primary={item.text} sx={{ ml: item.icon ? 2 : 0 }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
