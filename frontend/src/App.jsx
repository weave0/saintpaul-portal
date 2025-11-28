import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import ReactLazyPreloader from './components/ReactLazyPreloader';
import { Suspense, lazy } from 'react';

// Code-split all route-level pages to reduce initial bundle size
const Home = lazy(() => import('./pages/Home'));
const Map = lazy(() => import('./pages/Map'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Library = lazy(() => import('./pages/Library'));
const About = lazy(() => import('./pages/About'));
const Stories = lazy(() => import('./pages/Stories'));
const HistoricalViewer = lazy(() => import('./pages/HistoricalViewer'));

function App() {
  // Signal to prerenderer that the app has rendered
  useEffect(() => {
    document.dispatchEvent(new Event('render-event'));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Suspense fallback={<ReactLazyPreloader label="Loading page" />}> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/library" element={<Library />} />
            <Route path="/about" element={<About />} />
            <Route path="/3d-viewer" element={
              <Suspense fallback={<ReactLazyPreloader label="Loading 3D Viewer" />}> 
                <HistoricalViewer />
              </Suspense>
            } />
          </Routes>
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
