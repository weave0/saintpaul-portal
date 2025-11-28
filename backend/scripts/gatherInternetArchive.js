/**
 * Internet Archive Harvester
 * Books, documents, audio, video
 * Focus: Saint Paul, Minnesota historical content
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://archive.org';
const OUTPUT_DIR = path.join(__dirname, '../../data/collected/internet-archive');
const RATE_LIMIT_MS = 1000;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search Internet Archive
 */
async function searchInternetArchive(options = {}) {
  const {
    query = 'Saint Paul Minnesota history',
    mediaTypes = ['texts', 'audio', 'movies'],
    limit = 1000,
    downloadFiles = false,
  } = options;

  console.log('📚 Internet Archive Harvester Started');
  console.log(`   Query: "${query}"`);
  console.log(`   Media Types: ${mediaTypes.join(', ')}`);
  console.log(`   Limit: ${limit} items\n`);

  const results = {
    timestamp: new Date().toISOString(),
    query,
    items: [],
    stats: {
      total: 0,
      byMediaType: {},
      byYear: {},
    },
  };

  for (const mediaType of mediaTypes) {
    console.log(`\n📁 Searching ${mediaType}...`);
    
    const items = await searchByMediaType(query, mediaType, limit);
    
    for (const item of items) {
      const metadata = await fetchItemMetadata(item.identifier);
      
      if (metadata) {
        results.items.push(metadata);
        
        // Update stats
        results.stats.byMediaType[mediaType] = (results.stats.byMediaType[mediaType] || 0) + 1;
        
        if (metadata.year) {
          results.stats.byYear[metadata.year] = (results.stats.byYear[metadata.year] || 0) + 1;
        }

        // Download files if requested
        if (downloadFiles) {
          await downloadItem(metadata);
        }
      }

      await sleep(RATE_LIMIT_MS);
    }

    results.stats.total = results.items.length;
    console.log(`   ✅ Found ${results.stats.byMediaType[mediaType]} ${mediaType}`);
  }

  // Save metadata
  const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(results, null, 2));

  console.log('\n📊 Harvest Summary:');
  console.log(`   Total Items: ${results.stats.total}`);
  console.log(`   By Media Type:`, results.stats.byMediaType);
  console.log(`\n✅ Metadata saved to: ${metadataPath}`);

  return results;
}

/**
 * Search by media type
 */
async function searchByMediaType(query, mediaType, limit) {
  const items = [];
  let page = 1;

  while (items.length < limit) {
    try {
      const response = await axios.get(`${BASE_URL}/advancedsearch.php`, {
        params: {
          q: query,
          'fl[]': ['identifier', 'title', 'description', 'date', 'creator'],
          rows: 100,
          page,
          output: 'json',
          mediatype: mediaType,
        },
        timeout: 30000,
      });

      if (!response.data?.response?.docs || response.data.response.docs.length === 0) {
        break;
      }

      items.push(...response.data.response.docs);
      
      if (items.length >= response.data.response.numFound) {
        break;
      }

      page++;
      await sleep(RATE_LIMIT_MS);

    } catch (error) {
      console.error(`   ❌ Error on page ${page}: ${error.message}`);
      break;
    }
  }

  return items.slice(0, limit);
}

/**
 * Fetch detailed metadata for an item
 */
async function fetchItemMetadata(identifier) {
  try {
    const response = await axios.get(`${BASE_URL}/metadata/${identifier}`, {
      timeout: 15000,
    });

    const metadata = response.data.metadata;
    const files = response.data.files || [];

    return {
      identifier,
      title: metadata.title,
      description: metadata.description,
      creator: Array.isArray(metadata.creator) ? metadata.creator : [metadata.creator],
      date: metadata.date,
      year: metadata.year,
      
      // Subjects
      subject: Array.isArray(metadata.subject) ? metadata.subject : [metadata.subject],
      
      // Media info
      mediaType: metadata.mediatype,
      collection: metadata.collection,
      
      // Files
      files: files.map(f => ({
        name: f.name,
        format: f.format,
        size: f.size,
        url: `${BASE_URL}/download/${identifier}/${f.name}`,
      })),
      
      // URLs
      detailsUrl: `${BASE_URL}/details/${identifier}`,
      downloadUrl: `${BASE_URL}/download/${identifier}`,
      
      // Rights
      licenseUrl: metadata.licenseurl,
      rights: metadata.rights,
      
      // Source
      source: 'internet-archive',
      ingestDate: new Date().toISOString(),
    };

  } catch (error) {
    console.warn(`   ⚠️  Failed to fetch metadata for ${identifier}: ${error.message}`);
    return null;
  }
}

/**
 * Download item files
 */
async function downloadItem(metadata) {
  const itemDir = path.join(OUTPUT_DIR, metadata.mediaType, metadata.identifier);
  if (!fs.existsSync(itemDir)) {
    fs.mkdirSync(itemDir, { recursive: true });
  }

  // Download primary file (PDF, MP3, MP4, etc.)
  const primaryFile = metadata.files.find(f => 
    ['PDF', 'MP3', 'MP4', 'Text'].includes(f.format)
  );

  if (primaryFile) {
    try {
      console.log(`   📥 Downloading ${primaryFile.name}...`);
      
      const response = await axios.get(primaryFile.url, {
        responseType: 'arraybuffer',
        timeout: 60000,
      });

      const filePath = path.join(itemDir, primaryFile.name);
      fs.writeFileSync(filePath, response.data);
      
      metadata.localPath = filePath;
      console.log(`   ✅ Downloaded to ${filePath}`);

    } catch (error) {
      console.warn(`   ⚠️  Failed to download ${primaryFile.name}: ${error.message}`);
    }
  }
}

/**
 * Search for specific collections
 */
async function searchCollection(collectionId, limit = 500) {
  console.log(`\n📚 Searching collection: ${collectionId}`);
  
  const items = [];
  let page = 1;

  while (items.length < limit) {
    try {
      const response = await axios.get(`${BASE_URL}/advancedsearch.php`, {
        params: {
          q: `collection:${collectionId}`,
          'fl[]': ['identifier', 'title', 'mediatype'],
          rows: 100,
          page,
          output: 'json',
        },
        timeout: 30000,
      });

      if (!response.data?.response?.docs || response.data.response.docs.length === 0) {
        break;
      }

      items.push(...response.data.response.docs);
      
      if (items.length >= response.data.response.numFound) {
        break;
      }

      page++;
      await sleep(RATE_LIMIT_MS);

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      break;
    }
  }

  console.log(`   ✅ Found ${items.length} items in collection`);
  return items;
}

/**
 * CLI Interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const collectionMode = args.find(a => a.startsWith('--collection='));
  
  if (collectionMode) {
    const collectionId = collectionMode.split('=')[1];
    const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 500;
    
    searchCollection(collectionId, limit)
      .then(() => {
        console.log('\n✅ Collection search complete!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ Search failed:', error);
        process.exit(1);
      });
  } else {
    const options = {
      query: args.find(a => a.startsWith('--query='))?.split('=')[1] || 'Saint Paul Minnesota history',
      mediaTypes: args.find(a => a.startsWith('--types='))?.split('=')[1].split(',') || ['texts', 'audio', 'movies'],
      limit: parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 1000,
      downloadFiles: args.includes('--download'),
    };

    searchInternetArchive(options)
      .then(() => {
        console.log('\n✅ Internet Archive harvest complete!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ Harvest failed:', error);
        process.exit(1);
      });
  }
}

module.exports = { searchInternetArchive, searchCollection };
