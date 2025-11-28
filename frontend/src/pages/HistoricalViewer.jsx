import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFrame, useThree } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { Box, CircularProgress, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { DirectionsWalk, Layers, Visibility, VisibilityOff } from '@mui/icons-material';
import { Vector3 } from 'three';

import Building3D from '../components/Building3D';
import InstancedBuildings from '../components/InstancedBuildings';
import TimelineSlider from '../components/TimelineSlider';
import HeatmapOverlay, { HeatmapControls } from '../components/HeatmapOverlay';
import { useUIStore } from '../store/uiStore';
import { apiGet } from '../services/apiClient';
const HistoricalViewerEngine = React.lazy(() => import('../components/HistoricalViewerEngine'));

const ShortcutHandler = ({ onGrid, onFirstPerson, onHeatmap }) => {
  useEffect(() => {
    const handler = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(activeTag)) return;
      if (e.key.toLowerCase() === 'g') onGrid();
      if (e.key.toLowerCase() === 'f') onFirstPerson();
      if (e.key.toLowerCase() === 'h') onHeatmap();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onGrid, onFirstPerson, onHeatmap]);

  return null;
};

const FirstPersonController = ({ enabled, speed = 30, sprintMultiplier = 2.5, buildings = [] }) => {
  const { camera } = useThree();
  const keys = useRef({});
  const velocity = useRef(new Vector3());
  const targetSpeed = useRef(speed);

  useEffect(() => {
    if (!enabled) return undefined;
    const onKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled]);

  useEffect(() => {
    if (enabled && camera.position.y > 40) camera.position.y = 12;
  }, [enabled, camera]);

  const collides = (nextPos) => {
    const playerRadius = 3;
    for (const building of buildings) {
      if (!building?.location?.coordinates) continue;
      const [lon, lat] = building.location.coordinates;
      const bx = (lon - (-93.1)) * 10000;
      const bz = (lat - 44.95) * 10000;
      const bw = (building.dimensions?.width || 10) / 2;
      const bl = (building.dimensions?.length || 10) / 2;
      if (
        nextPos.x + playerRadius > bx - bw &&
        nextPos.x - playerRadius < bx + bw &&
        nextPos.z + playerRadius > bz - bl &&
        nextPos.z - playerRadius < bz + bl
      ) {
        return true;
      }
    }
    return false;
  };

  useFrame((_, delta) => {
    if (!enabled) return;

    const isSprinting = keys.current['shift'];
    targetSpeed.current = isSprinting ? speed * sprintMultiplier : speed;

    const forward = new Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new Vector3()
      .crossVectors(forward, new Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(-1);

    let move = new Vector3();
    if (keys.current['w']) move.add(forward);
    if (keys.current['s']) move.add(forward.clone().multiplyScalar(-1));
    if (keys.current['a']) move.add(right.clone().multiplyScalar(-1));
    if (keys.current['d']) move.add(right);

    if (move.lengthSq() > 0) {
      move.normalize();
      velocity.current.lerp(move.multiplyScalar(targetSpeed.current), 0.15);
      const potential = velocity.current.clone().multiplyScalar(delta);
      const nextPos = camera.position.clone().add(potential);
      if (!collides(nextPos)) {
        camera.position.copy(nextPos);
      } else {
        velocity.current.multiplyScalar(0.5);
      }
    } else {
      velocity.current.lerp(new Vector3(), 0.1);
    }

    if (camera.position.y < 5) camera.position.y = 5;
  });

  return null;
};

const HistoricalViewer = () => {
  const [selectedYear, setSelectedYear] = useState(1905);
  const [snapshots, setSnapshots] = useState([]);
  const [currentSnapshot, setCurrentSnapshot] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [reconSnapshots, setReconSnapshots] = useState([]);
  const [selectedReconSnapshotId, setSelectedReconSnapshotId] = useState(null);
  const [diffFromId, setDiffFromId] = useState(null);
  const [diffToId, setDiffToId] = useState(null);
  const [diffData, setDiffData] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    showGrid,
    toggleGrid,
    firstPerson,
    toggleFirstPerson,
    heatmapVisible,
    toggleHeatmap,
    heatmapMetric,
    setHeatmapMetric
  } = useUIStore();

  const snapshotsQuery = useQuery({
    queryKey: ['historical-snapshots'],
    queryFn: () => apiGet('/data/historical-snapshots.json').then((d) => d.snapshots || [])
  });

  const reconQuery = useQuery({
    queryKey: ['reconstructions'],
    queryFn: () => apiGet('/api/reconstructions')
  });

  useEffect(() => {
    if (snapshotsQuery.data) {
      setSnapshots(snapshotsQuery.data);
      setLoading(false);
    }
  }, [snapshotsQuery.data]);

  useEffect(() => {
    if (reconQuery.data) setReconSnapshots(reconQuery.data);
  }, [reconQuery.data]);

  useEffect(() => {
    if (snapshots.length > 0) {
      const snapshot = snapshots.find((s) => s.year === selectedYear);
      setCurrentSnapshot(snapshot || null);
    }
  }, [selectedYear, snapshots]);

  const buildingSpecsQuery = useQuery({
    queryKey: ['building-specs', selectedYear],
    queryFn: () => apiGet(`/api/building-specs?beforeYear=${selectedYear}`),
    staleTime: 120000,
    enabled: snapshots.length > 0
  });

  const diffQuery = useQuery({
    queryKey: ['recon-diff', diffFromId, diffToId],
    queryFn: () => apiGet(`/api/reconstructions/diff?from=${diffFromId}&to=${diffToId}`),
    enabled: Boolean(diffFromId && diffToId && diffFromId !== diffToId)
  });

  useEffect(() => {
    if (diffQuery.data) setDiffData(diffQuery.data);
    else if (!diffQuery.isFetching) setDiffData(null);
  }, [diffQuery.data, diffQuery.isFetching]);

  const buildingSpecs = buildingSpecsQuery.data?.data || [];
  const selectedReconSnapshot = reconSnapshots.find((r) => r._id === selectedReconSnapshotId);
  const reconSpecIdSet = useMemo(
    () => new Set(selectedReconSnapshot?.specRefs?.map((s) => s._id)),
    [selectedReconSnapshot]
  );

  const enrichedSpecs = useMemo(
    () =>
      buildingSpecs.map((spec) => ({
        _id: spec._id,
        name: spec.name,
        location: { coordinates: [spec.centroid?.lon, spec.centroid?.lat] },
        dimensions: {
          length: spec.dimensions?.length_m || 10,
          width: spec.dimensions?.width_m || 10
        },
        material: spec.materials?.[0]?.material || 'stone',
        stories: spec.height?.stories || Math.round((spec.height?.eaveHeight_m || 12) / 3.5),
        height: spec.height?.roofHeight_m || (spec.height?.stories ? spec.height.stories * 4 : 15),
        roofType: spec.roof?.type,
        status: spec.status,
        dataSource: { name: spec.sources?.[0]?.name },
        inSnapshot: reconSpecIdSet.has(spec._id)
      })),
    [buildingSpecs, reconSpecIdSet]
  );

  const collisionBuildings = useMemo(
    () => [...(currentSnapshot?.buildings || []), ...enrichedSpecs],
    [currentSnapshot?.buildings, enrichedSpecs]
  );

  if (loading || snapshotsQuery.isLoading || reconQuery.isLoading || buildingSpecsQuery.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#87ceeb' }}>
      <ShortcutHandler onGrid={toggleGrid} onFirstPerson={toggleFirstPerson} onHeatmap={toggleHeatmap} />
      <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>}>
        <HistoricalViewerEngine
          cameraProps={{ position: [100, 80, 100], fov: 60 }}
          showOrbitControls={!firstPerson}
          enablePerf={import.meta.env.VITE_ENABLE_PERF === 'true'}
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[50, 100, 50]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-50, 50, -50]} intensity={0.5} />
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
          {(currentSnapshot?.buildings || []).map((building, index) => (
            <Building3D
              key={`snap-${building.name}-${index}`}
              building={building}
              isHighlighted={selectedBuilding?.name === building.name}
              onClick={() => setSelectedBuilding(building)}
            />
          ))}
          <InstancedBuildings
            buildings={enrichedSpecs}
            selectedBuilding={selectedBuilding}
            onSelect={setSelectedBuilding}
          />
          {(currentSnapshot?.streets || [])
            .filter((street) => Array.isArray(street.coordinates) && street.coordinates.length >= 2)
            .map((street, index) => {
              const [lon1, lat1] = street.coordinates[0] || [];
              const [lon2, lat2] = street.coordinates[1] || [];
              if (lon1 == null || lat1 == null || lon2 == null || lat2 == null) return null;
              const x1 = (lon1 - (-93.1)) * 10000;
              const z1 = (lat1 - 44.95) * 10000;
              const x2 = (lon2 - (-93.1)) * 10000;
              const z2 = (lat2 - 44.95) * 10000;
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
                  <lineBasicMaterial color="#4a4a4a" linewidth={(street.width || street.widthMeters || 10) / 5} />
                </line>
              );
            })}
          <HeatmapOverlay metric={heatmapMetric} gridSize={50} visible={heatmapVisible} />
          {firstPerson && <FirstPersonController enabled buildings={collisionBuildings} />}
        </HistoricalViewerEngine>
      </Suspense>
      {snapshots.length > 0 && (
        <TimelineSlider value={selectedYear} onChange={setSelectedYear} snapshots={snapshots} />
      )}
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
            backdropFilter: 'blur(10px)'
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
            <strong>Spec Overlays:</strong> {enrichedSpecs.length}
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
                Built: {selectedBuilding.built || selectedBuilding.established || 'Unknown'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Material: {selectedBuilding.material}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Stories: {selectedBuilding.stories || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', fontStyle: 'italic', mt: 1 }}>
                Source: {selectedBuilding.dataSource?.name || 'Historical records'}
              </Typography>
            </>
          )}
        </Paper>
      )}
      <Paper
        elevation={3}
        sx={{ position: 'absolute', top: 20, left: 20, p: 1, display: 'flex', flexDirection: 'row', gap: 1 }}
        aria-label="Viewer controls"
      >
        <Tooltip title={showGrid ? 'Hide grid (G)' : 'Show grid (G)'}>
          <IconButton aria-label="toggle grid" size="small" onClick={toggleGrid}>
            {showGrid ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
        <Tooltip title={firstPerson ? 'Switch to Orbit (F)' : 'Switch to First-Person (F)'}>
          <IconButton aria-label="toggle camera mode" size="small" onClick={toggleFirstPerson}>
            <DirectionsWalk />
          </IconButton>
        </Tooltip>
        <Tooltip title={heatmapVisible ? 'Hide heatmap (H)' : 'Show heatmap (H)'}>
          <IconButton aria-label="toggle heatmap" size="small" onClick={toggleHeatmap}>
            <Layers />
          </IconButton>
        </Tooltip>
      </Paper>
      <span aria-hidden="true" style={{ position: 'absolute', left: -9999, top: -9999 }}>
        Shortcuts: G grid, F camera, H heatmap
      </span>
      {reconSnapshots.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: 80,
            left: 20,
            p: 1,
            backgroundColor: 'rgba(255,255,255,0.95)',
            maxWidth: 260
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            Reconstruction Snapshot
          </Typography>
          <select
            style={{ width: '100%', marginTop: 4 }}
            value={selectedReconSnapshotId || ''}
            onChange={(e) => setSelectedReconSnapshotId(e.target.value || null)}
          >
            <option value="">(none)</option>
            {reconSnapshots.map((s) => (
              <option key={s._id} value={s._id}>
                {s.year} – {s.label || 'Snapshot'} ({s.specRefs.length})
              </option>
            ))}
          </select>
          {selectedReconSnapshot && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Highlighting {selectedReconSnapshot.specRefs.length} specs
            </Typography>
          )}
          <Typography variant="caption" sx={{ fontWeight: 700, mt: 1 }}>
            Diff Compare
          </Typography>
          <select
            style={{ width: '100%', marginTop: 4 }}
            value={diffFromId || ''}
            onChange={(e) => setDiffFromId(e.target.value || null)}
          >
            <option value="">from (snapshot)</option>
            {reconSnapshots.map((s) => (
              <option key={`from-${s._id}`} value={s._id}>
                {s.year} – {s.label || 'Snapshot'}
              </option>
            ))}
          </select>
          <select
            style={{ width: '100%', marginTop: 4 }}
            value={diffToId || ''}
            onChange={(e) => setDiffToId(e.target.value || null)}
          >
            <option value="">to (snapshot)</option>
            {reconSnapshots.map((s) => (
              <option key={`to-${s._id}`} value={s._id}>
                {s.year} – {s.label || 'Snapshot'}
              </option>
            ))}
          </select>
          {diffData && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Δ added {diffData.summary.added}, removed {diffData.summary.removed}, changed {diffData.summary.changed}
            </Typography>
          )}
        </Paper>
      )}
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          bottom: 180,
          left: 20,
          p: 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          maxWidth: 250
        }}
      >
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Controls:</strong>
        </Typography>
        {!firstPerson && (
          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
            • Left Click + Drag: Rotate
            <br />• Right Click + Drag: Pan
            <br />• Scroll: Zoom
            <br />• Click Building: Select
            <br />• Toggle FP (Walk icon)
          </Typography>
        )}
        {firstPerson && (
          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
            • Click canvas: Lock mouse
            <br />• ESC: Release mouse
            <br />• Mouse Move: Look
            <br />• W/A/S/D: Move
            <br />• Shift: Sprint
            <br />• Toggle Orbit (Walk icon)
          </Typography>
        )}
      </Paper>
      <HeatmapControls
        visible={heatmapVisible}
        onVisibleChange={(nextVisible) => {
          if (nextVisible !== heatmapVisible) toggleHeatmap();
        }}
        metric={heatmapMetric}
        onMetricChange={setHeatmapMetric}
      />
    </Box>
  );
};

export default HistoricalViewer;
