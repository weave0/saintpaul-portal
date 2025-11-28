/**
 * MapCanvasLite - A lighter alternative using MapLibre GL
 * 
 * Benefits over Mapbox GL:
 * - Open source, no API key required for basic usage
 * - Smaller bundle size (~30% lighter)
 * - Compatible with Mapbox styles via self-hosted tiles
 * - Better for projects that don't need Mapbox-specific features
 * 
 * Trade-offs:
 * - Some Mapbox-specific features not available
 * - Need to use alternative tile sources or self-host
 * - Mapbox tokens won't work for Mapbox-hosted styles/tiles
 * 
 * Usage: Drop-in replacement for MapCanvas when you want lighter bundles
 * and are using OpenStreetMap, Carto, or self-hosted tiles.
 */
import React from 'react';
import ReactMapGL from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// Free tile sources (no API key required)
export const FREE_STYLES = {
  // Carto styles (free, no signup)
  cartoDark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  cartoLight: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  cartoVoyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  
  // OpenStreetMap styles via MapTiler (generous free tier)
  osmBright: 'https://api.maptiler.com/maps/bright/style.json',
  osmStreets: 'https://api.maptiler.com/maps/streets/style.json',
  
  // Stadia Maps (free tier available)
  stadiaAlidadeDark: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
  stadiaAlidadeLight: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
};

const MapCanvasLite = ({ 
  viewport, 
  setViewport, 
  children, 
  style = FREE_STYLES.cartoDark,
  ...props 
}) => {
  return (
    <ReactMapGL
      mapStyle={style}
      {...viewport}
      onMove={evt => setViewport(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      {...props}
    >
      {children}
    </ReactMapGL>
  );
};

export default MapCanvasLite;
