/**
 * Digital Public Library of America (DPLA) Harvester
 * Aggregates content from 4,000+ cultural institutions
 * Focus: Saint Paul, Minnesota historical content
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// API Configuration
const DPLA_API_KEY = process.env.DPLA_API_KEY || ''; // Get free key at https://pro.dp.la/developers/api-codex
const BASE_URL = 'https://api.dp.la/v2';
const OUTPUT_DIR = path.join(__dirname, '../../data/collected/dpla');
const RATE_LIMIT_MS = 1000; // 1 request per second (be respectful)

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Sleep utility for rate limiting
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate unique hash for deduplication
 */
const generateHash = (item) => {
  const hash = crypto.createHash('md5');
  const key = `${item.sourceResource?.title || ''}-${item.sourceResource?.date?.begin || ''}`;
  return hash.update(key).digest('hex');
};

/**
 * Harvest items from DPLA API
 */
async function harvestDPLA(options = {}) {
  const {
    query = 'Saint Paul Minnesota',
    spatialFilter = 'Saint Paul',
    dateRange = { begin: 1850, end: 2025 },
    mediaTypes = ['image', 'text', 'sound', 'moving image'],
    limit = 10000,
    saveImages = true,
  } = options;

  if (!DPLA_API_KEY) {
    console.error('❌ DPLA_API_KEY not set. Get one at: https://pro.dp.la/developers/api-codex');
    process.exit(1);
  }

  console.log('🏛️  DPLA Harvester Started');
  console.log(`   Query: "${query}"`);
  console.log(`   Spatial: "${spatialFilter}"`);
  console.log(`   Date Range: ${dateRange.begin}-${dateRange.end}`);
  console.log(`   Limit: ${limit} items\n`);

  const results = {
    timestamp: new Date().toISOString(),
    query,
    items: [],
    stats: {
      total: 0,
      byType: {},
      byProvider: {},
      withImages: 0,
      withDates: 0,
      withLocations: 0,
    },
  };

  let page = 1;
  const pageSize = 100; // Max allowed by DPLA

  try {
    while (results.items.length < limit) {
      console.log(`📥 Fetching page ${page}...`);

      const response = await axios.get(`${BASE_URL}/items`, {
        params: {
          api_key: DPLA_API_KEY,
          q: query,
          'sourceResource.spatial.name': spatialFilter,
          'sourceResource.date.after': dateRange.begin,
          'sourceResource.date.before': dateRange.end,
          page_size: pageSize,
          page,
        },
        timeout: 30000,
      });

      if (!response.data || !response.data.docs || response.data.docs.length === 0) {
        console.log('   ℹ️  No more results');
        break;
      }

      for (const item of response.data.docs) {
        // Transform to our schema
        const transformedItem = transformItem(item);
        
        // Skip duplicates
        if (results.items.some(i => i.hash === transformedItem.hash)) {
          continue;
        }

        results.items.push(transformedItem);

        // Update stats
        const type = transformedItem.type || 'unknown';
        results.stats.byType[type] = (results.stats.byType[type] || 0) + 1;
        
        const provider = transformedItem.provider || 'unknown';
        results.stats.byProvider[provider] = (results.stats.byProvider[provider] || 0) + 1;

        if (transformedItem.imageUrl) results.stats.withImages++;
        if (transformedItem.date) results.stats.withDates++;
        if (transformedItem.location) results.stats.withLocations++;

        // Download image if requested
        if (saveImages && transformedItem.imageUrl) {
          await downloadImage(transformedItem);
        }
      }

      results.stats.total = results.items.length;
      console.log(`   ✅ Page ${page}: ${results.items.length}/${limit} items collected`);

      page++;
      await sleep(RATE_LIMIT_MS);
    }

    // Save metadata
    const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(results, null, 2));

    // Save summary
    console.log('\n📊 Harvest Summary:');
    console.log(`   Total Items: ${results.stats.total}`);
    console.log(`   By Type:`, results.stats.byType);
    console.log(`   By Provider:`, Object.keys(results.stats.byProvider).slice(0, 5));
    console.log(`   With Images: ${results.stats.withImages}`);
    console.log(`   With Dates: ${results.stats.withDates}`);
    console.log(`   With Locations: ${results.stats.withLocations}`);
    console.log(`\n✅ Metadata saved to: ${metadataPath}`);

    return results;

  } catch (error) {
    console.error('❌ Error harvesting DPLA:', error.message);
    throw error;
  }
}

/**
 * Transform DPLA item to our schema
 */
function transformItem(item) {
  const sourceResource = item.sourceResource || {};
  
  return {
    hash: generateHash(item),
    dplaId: item.id,
    title: sourceResource.title || sourceResource.description?.[0] || 'Untitled',
    description: Array.isArray(sourceResource.description) 
      ? sourceResource.description.join(' ') 
      : sourceResource.description,
    type: sourceResource.type || sourceResource.format?.[0],
    
    // Dates
    date: sourceResource.date?.displayDate || sourceResource.date?.begin,
    dateBegin: sourceResource.date?.begin,
    dateEnd: sourceResource.date?.end,
    
    // Location
    location: sourceResource.spatial?.map(s => s.name || s).join(', '),
    coordinates: extractCoordinates(sourceResource.spatial),
    
    // Creator/Contributor
    creator: sourceResource.creator?.[0],
    contributor: sourceResource.contributor?.[0],
    publisher: sourceResource.publisher?.[0],
    
    // Media
    imageUrl: item.object || sourceResource.identifier?.[0],
    thumbnailUrl: item.object, // DPLA provides thumbnails
    
    // Rights
    rights: sourceResource.rights?.[0],
    rightsUri: item.rights?.[0],
    
    // Source
    provider: item.provider?.name,
    dataProvider: item.dataProvider,
    isShownAt: item.isShownAt,
    
    // Metadata
    subjects: sourceResource.subject?.map(s => typeof s === 'string' ? s : s.name),
    language: sourceResource.language?.map(l => l.name || l),
    
    // Provenance
    ingestDate: new Date().toISOString(),
    source: 'dpla',
    sourceUrl: `https://dp.la/item/${item.id}`,
  };
}

/**
 * Extract coordinates from spatial data
 */
function extractCoordinates(spatial) {
  if (!spatial) return null;
  
  for (const location of spatial) {
    if (location.coordinates) {
      return {
        lat: parseFloat(location.coordinates.split(',')[0]),
        lng: parseFloat(location.coordinates.split(',')[1]),
      };
    }
  }
  
  return null;
}

/**
 * Download image to local storage
 */
async function downloadImage(item) {
  if (!item.imageUrl) return;

  try {
    const response = await axios.get(item.imageUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
    });

    const ext = item.imageUrl.split('.').pop().split('?')[0] || 'jpg';
    const filename = `${item.hash}.${ext}`;
    const imagePath = path.join(OUTPUT_DIR, 'images', filename);

    if (!fs.existsSync(path.join(OUTPUT_DIR, 'images'))) {
      fs.mkdirSync(path.join(OUTPUT_DIR, 'images'), { recursive: true });
    }

    fs.writeFileSync(imagePath, response.data);
    item.localImagePath = imagePath;

  } catch (error) {
    console.warn(`   ⚠️  Failed to download image for ${item.title}: ${error.message}`);
  }
}

/**
 * CLI Interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    query: args.find(a => a.startsWith('--query='))?.split('=')[1] || 'Saint Paul Minnesota',
    limit: parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 10000,
    saveImages: !args.includes('--no-images'),
  };

  harvestDPLA(options)
    .then(() => {
      console.log('\n✅ DPLA harvest complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Harvest failed:', error);
      process.exit(1);
    });
}

module.exports = { harvestDPLA };
