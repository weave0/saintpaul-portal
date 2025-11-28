const CACHE_NAME = 'saintpaul-v2';
const TILE_CACHE_NAME = 'saintpaul-tiles-v1';
const FONT_CACHE_NAME = 'saintpaul-fonts-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/data/historical-snapshots.json'
];

// Tile domains to cache (Carto, OpenStreetMap, MapTiler)
const TILE_DOMAINS = [
  'basemaps.cartocdn.com',
  'tiles.stadiamaps.com',
  'api.maptiler.com',
  'tile.openstreetmap.org',
  'a.tile.openstreetmap.org',
  'b.tile.openstreetmap.org',
  'c.tile.openstreetmap.org'
];

// Font domains to cache
const FONT_DOMAINS = [
  'fonts.gstatic.com',
  'fonts.googleapis.com'
];

const MAX_TILE_CACHE_SIZE = 500; // Max cached tiles
const MAX_TILE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => ![CACHE_NAME, TILE_CACHE_NAME, FONT_CACHE_NAME].includes(k))
        .map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Trim tile cache to prevent unbounded growth
async function trimTileCache() {
  const cache = await caches.open(TILE_CACHE_NAME);
  const keys = await cache.keys();
  if (keys.length > MAX_TILE_CACHE_SIZE) {
    // Delete oldest entries (FIFO)
    const toDelete = keys.slice(0, keys.length - MAX_TILE_CACHE_SIZE);
    await Promise.all(toDelete.map(req => cache.delete(req)));
  }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle tile requests - stale-while-revalidate for fast loads
  if (TILE_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        
        // Fetch in background regardless
        const fetchPromise = fetch(event.request).then(response => {
          if (response.ok) {
            cache.put(event.request, response.clone());
            trimTileCache(); // Async cleanup
          }
          return response;
        }).catch(() => cached); // Fallback to cache on network error
        
        // Return cached immediately if available, else wait for fetch
        return cached || fetchPromise;
      })
    );
    return;
  }
  
  // Handle font requests - cache-first, long-lived
  if (FONT_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        
        const response = await fetch(event.request);
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      })
    );
    return;
  }
  
  // Cache-first for local assets
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
        if (resp.ok && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return resp;
      }))
    );
  }
});