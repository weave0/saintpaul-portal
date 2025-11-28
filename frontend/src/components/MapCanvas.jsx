/**
 * MapCanvas - Now using MapLibre GL (open source, ~30% smaller than Mapbox GL)
 * 
 * This eliminates the need for a Mapbox API token for basic map functionality.
 * Uses free tile providers: Carto, Stadia, and OpenStreetMap.
 */
import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import ReactMapGL, { Marker, Popup, Layer, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// Free map styles - no API key required
export const MAP_STYLES = {
  // Carto (free, high quality)
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  
  // For satellite, we use a raster layer (can be enhanced with vector overlay)
  satellite: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // Fallback to voyager
  
  // Mystical uses dark as base
  mystical: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};

const MapCanvas = forwardRef(({ viewport, setViewport, children, style = MAP_STYLES.dark, onMapLoad }, ref) => {
  const mapRef = useRef(null);
  
  // Resolve style name to URL if needed
  const resolvedStyle = MAP_STYLES[style] || style;
  
  // Expose the map instance to parent via ref
  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current?.getMap?.()
  }));
  
  const handleLoad = useCallback((evt) => {
    if (onMapLoad) {
      onMapLoad(evt.target);
    }
  }, [onMapLoad]);
  
  return (
    <ReactMapGL
      ref={mapRef}
      mapStyle={resolvedStyle}
      {...viewport}
      onMove={evt => setViewport(evt.viewState)}
      onLoad={handleLoad}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </ReactMapGL>
  );
});

MapCanvas.displayName = 'MapCanvas';

export default MapCanvas;