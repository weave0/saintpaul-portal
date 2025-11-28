/**
 * usePrefetchMap - Prefetches map resources when user shows intent to visit map page
 * 
 * Triggers on hover/focus of map links to warm the browser cache before navigation.
 * This reduces perceived load time for the map page.
 */
import { useCallback, useRef } from 'react';

// Carto tile endpoints to prefetch (Saint Paul area, zoom 14)
const PREFETCH_TILES = [
  // Dark matter style (primary)
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  // Key tiles around downtown Saint Paul (lat: 44.9445, lon: -93.0933, zoom: 14)
  'https://a.basemaps.cartocdn.com/dark_all/14/4689/6114.png',
  'https://b.basemaps.cartocdn.com/dark_all/14/4690/6114.png',
  'https://c.basemaps.cartocdn.com/dark_all/14/4689/6115.png',
  'https://d.basemaps.cartocdn.com/dark_all/14/4690/6115.png',
];

// MapLibre GL JS chunks to prefetch
const PREFETCH_SCRIPTS = [
  // The vendor-map chunk will be loaded, triggering maplibre-gl
];

export const usePrefetchMap = () => {
  const prefetched = useRef(false);

  const prefetch = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;

    // Prefetch style JSON
    PREFETCH_TILES.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = url.endsWith('.json') ? 'fetch' : 'image';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload the map chunk
    const mapChunk = document.querySelector('link[href*="vendor-map"]');
    if (!mapChunk) {
      // Find and preload the map vendor chunk
      const scripts = document.querySelectorAll('script[src*="vendor-map"]');
      if (scripts.length === 0) {
        // Dynamic import to warm the chunk
        import('react-map-gl/maplibre').catch(() => {});
      }
    }
  }, []);

  return { prefetch };
};

export default usePrefetchMap;
