import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Map from './pages/Map';
import Timeline from './pages/Timeline';
import Library from './pages/Library';
import About from './pages/About';
import HistoricalViewer from './pages/HistoricalViewer';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/library" element={<Library />} />
          <Route path="/about" element={<About />} />
          <Route path="/3d-viewer" element={<HistoricalViewer />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
