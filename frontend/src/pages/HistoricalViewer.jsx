import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sky, Grid } from '@react-three/drei';
import { Box, CircularProgress, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { Info, Visibility, VisibilityOff, Layers } from '@mui/icons-material';
import Building3D from '../components/Building3D';
import TimelineSlider from '../components/TimelineSlider';

const HistoricalViewer = () => {
  const [selectedYear, setSelectedYear] = useState(1905);
  const [snapshots, setSnapshots] = useState([]);
  const [currentSnapshot, setCurrentSnapshot] = useState(null);
  const [buildingSpecs, setBuildingSpecs] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reconSnapshots, setReconSnapshots] = useState([]);
  const [selectedReconSnapshotId, setSelectedReconSnapshotId] = useState(null);
  const [diffFromId, setDiffFromId] = useState(null);
  const [diffToId, setDiffToId] = useState(null);
  const [diffData, setDiffData] = useState(null);

  useEffect(() => {
    // Load static historical snapshots
    fetch('/data/historical-snapshots.json')
      .then(res => res.json())
      .then(data => setSnapshots(data.snapshots))
      .catch(err => console.error('Error loading snapshots:', err))
      .finally(() => setLoading(false));

    // Load reconstruction snapshots from API
    fetch('/api/reconstructions')
      .then(r => r.json())
      .then(data => setReconSnapshots(data))
      .catch(err => console.warn('Recon snapshot fetch error', err));
  }, []);

  useEffect(() => {
    if (snapshots.length > 0) {
      const snapshot = snapshots.find(s => s.year === selectedYear);
      setCurrentSnapshot(snapshot);
      fetch(`/api/building-specs?beforeYear=${selectedYear}`)
        .then(r => r.json())
        .then(data => setBuildingSpecs(data))
        .catch(err => console.warn('Spec fetch error', err));
    }
  }, [selectedYear, snapshots]);

  const selectedReconSnapshot = reconSnapshots.find(r => r._id === selectedReconSnapshotId);
  const reconSpecIdSet = new Set(selectedReconSnapshot?.specRefs?.map(s => s._id));

  // Fetch diff when both ids chosen
  useEffect(() => {
    if (diffFromId && diffToId && diffFromId !== diffToId) {
      fetch(`/api/reconstructions/diff?from=${diffFromId}&to=${diffToId}`)
        .then(r => r.json())
        .then(d => setDiffData(d))
        .catch(err => {
          console.warn('Diff fetch error', err);
          setDiffData(null);
        });
    } else {
      setDiffData(null);
    }
  }, [diffFromId, diffToId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#87ceeb' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [100, 80, 100], fov: 60 }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[50, 100, 50]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-50, 50, -50]} intensity={0.5} />

          {/* Sky */}
          <Sky
            distance={450000}
            sunPosition={[100, 20, 100]}
            inclination={0.6}
            azimuth={0.25}
          />

          {/* Ground Grid */}
          {showGrid && (
            <Grid
              args={[500, 500]}
              cellSize={10}
              cellThickness={0.5}
              cellColor="#6f6f6f"
              sectionSize={50}
              sectionThickness={1}
              sectionColor="#1a4d7d"
              fadeDistance={400}
              fadeStrength={1}
              followCamera={false}
            />
          )}

          {/* Snapshot Buildings (coarse) */}
          {currentSnapshot && currentSnapshot.buildings.map((building, index) => (
            <Building3D
              key={`snap-${building.name}-${index}`}
              building={building}
              isHighlighted={selectedBuilding?.name === building.name}
              onClick={() => setSelectedBuilding(building)}
            />
          ))}

          {/* High-fidelity BuildingSpecs (overlay) */}
          {buildingSpecs.map((spec, index) => {
            const enriched = {
              name: spec.name,
              location: { coordinates: [spec.centroid.lon, spec.centroid.lat] },
              dimensions: { length: spec.dimensions.length_m || 10, width: spec.dimensions.width_m || 10 },
              material: spec.materials?.[0]?.material || 'stone',
              stories: spec.height?.stories || Math.round((spec.height?.eaveHeight_m || 12) / 3.5),
              height: spec.height?.roofHeight_m || (spec.height?.stories ? spec.height.stories * 4 : 15),
              roofType: spec.roof?.type,
              status: spec.status,
              dataSource: { name: spec.sources?.[0]?.name }
            };
            return (
              <Building3D
                key={`spec-${spec._id || spec.name}-${index}`}
                building={enriched}
                isHighlighted={selectedBuilding?.name === spec.name}
                inSnapshot={reconSpecIdSet.has(spec._id)}
                onClick={() => setSelectedBuilding(enriched)}
              />
            );
          })}

          {/* Streets (simplified as lines) */}
          {currentSnapshot && currentSnapshot.streets.map((street, index) => {
            const x1 = (street.coordinates[0][0] - (-93.1)) * 10000;
            const z1 = (street.coordinates[0][1] - 44.95) * 10000;
            const x2 = (street.coordinates[1][0] - (-93.1)) * 10000;
            const z2 = (street.coordinates[1][1] - 44.95) * 10000;
            
            return (
              <line key={`street-${index}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([x1, 0.1, z1, x2, 0.1, z2])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#4a4a4a" linewidth={street.width / 5} />
              </line>
            );
          })}

          {/* Environment */}
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={20}
            maxDistance={500}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>

      {/* Timeline Slider */}
      {snapshots.length > 0 && (
        <TimelineSlider
          value={selectedYear}
          onChange={setSelectedYear}
          snapshots={snapshots}
        />
      )}

      {/* Info Panel */}
      {currentSnapshot && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            p: 2,
            maxWidth: 320,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a4d7d', mb: 1 }}>
            {currentSnapshot.era}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Year:</strong> {currentSnapshot.year}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Population:</strong> {currentSnapshot.population.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Buildings:</strong> {currentSnapshot.buildings.length}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Snapshot Streets:</strong> {currentSnapshot.streets.length}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Spec Overlays:</strong> {buildingSpecs.length}
          </Typography>
          
          {selectedBuilding && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#c8102e', mt: 2, mb: 1 }}>
                Selected Building:
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>{selectedBuilding.name}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Built: {selectedBuilding.built || selectedBuilding.established}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Material: {selectedBuilding.material}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Stories: {selectedBuilding.stories}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', fontStyle: 'italic', mt: 1 }}>
                Source: {selectedBuilding.dataSource?.name || 'Historical records'}
              </Typography>
            </>
          )}
        </Paper>
      )}

      {/* Controls */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Tooltip title="Toggle Grid">
          <IconButton
            onClick={() => setShowGrid(!showGrid)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            {showGrid ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Layers">
          <IconButton
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            <Layers />
          </IconButton>
        </Tooltip>
        {/* Reconstruction Snapshot Selector */}
        {reconSnapshots.length > 0 && (
          <Paper sx={{ p: 1, backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>Reconstruction Snapshot</Typography>
            <select
              style={{ width: '100%', marginTop: 4 }}
              value={selectedReconSnapshotId || ''}
              onChange={e => setSelectedReconSnapshotId(e.target.value || null)}
            >
              <option value="">(none)</option>
              {reconSnapshots.map(s => (
                <option key={s._id} value={s._id}>{s.year} – {s.label || 'Snapshot'} ({s.specRefs.length})</option>
              ))}
            </select>
            {selectedReconSnapshot && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Highlighting {selectedReconSnapshot.specRefs.length} specs
              </Typography>
            )}
            {/* Diff selection */}
            <Typography variant="caption" sx={{ fontWeight: 700, mt: 1 }}>Diff Compare</Typography>
            <select
              style={{ width: '100%', marginTop: 4 }}
              value={diffFromId || ''}
              onChange={e => setDiffFromId(e.target.value || null)}
            >
              <option value="">from (snapshot)</option>
              {reconSnapshots.map(s => (
                <option key={`from-${s._id}`} value={s._id}>{s.year} – {s.label || 'Snapshot'}</option>
              ))}
            </select>
            <select
              style={{ width: '100%', marginTop: 4 }}
              value={diffToId || ''}
              onChange={e => setDiffToId(e.target.value || null)}
            >
              <option value="">to (snapshot)</option>
              {reconSnapshots.map(s => (
                <option key={`to-${s._id}`} value={s._id}>{s.year} – {s.label || 'Snapshot'}</option>
              ))}
            </select>
            {diffData && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Δ added {diffData.summary.added}, removed {diffData.summary.removed}, changed {diffData.summary.changed}
              </Typography>
            )}
          </Paper>
        )}
      </Box>

      {/* Instructions */}
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          bottom: 180,
          left: 20,
          p: 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          maxWidth: 250,
        }}
      >
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Controls:</strong>
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
          • Left Click + Drag: Rotate<br />
          • Right Click + Drag: Pan<br />
          • Scroll: Zoom<br />
          • Click Building: Select
        </Typography>
      </Paper>
    </Box>
  );
};

export default HistoricalViewer;
