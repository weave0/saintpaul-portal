/**
 * Wikimedia Commons Image Harvester
 * Public domain and CC-licensed historical photos
 * Focus: Saint Paul, Minnesota
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_URL = 'https://commons.wikimedia.org/w/api.php';
const OUTPUT_DIR = path.join(__dirname, '../../data/collected/wikimedia');
const RATE_LIMIT_MS = 500; // Be respectful to Wikimedia

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Harvest images from Wikimedia Commons
 */
async function harvestWikimedia(options = {}) {
  const {
    categories = [
      'Saint Paul, Minnesota',
      'History of Saint Paul, Minnesota',
      'Buildings in Saint Paul, Minnesota',
      'Churches in Saint Paul, Minnesota',
    ],
    includeSubcategories = true,
    downloadImages = true,
    limit = 5000,
  } = options;

  console.log('🖼️  Wikimedia Commons Harvester Started');
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Include Subcategories: ${includeSubcategories}`);
  console.log(`   Limit: ${limit} images\n`);

  const results = {
    timestamp: new Date().toISOString(),
    images: [],
    stats: {
      total: 0,
      byCategory: {},
      byLicense: {},
      byDecade: {},
      downloaded: 0,
    },
  };

  for (const category of categories) {
    console.log(`\n📂 Processing category: ${category}`);
    
    const categoryImages = await fetchCategoryImages(category, limit - results.images.length);
    
    for (const image of categoryImages) {
      // Fetch detailed metadata
      const metadata = await fetchImageMetadata(image.title);
      
      if (metadata) {
        results.images.push(metadata);
        
        // Update stats
        results.stats.byCategory[category] = (results.stats.byCategory[category] || 0) + 1;
        
        const license = metadata.license || 'unknown';
        results.stats.byLicense[license] = (results.stats.byLicense[license] || 0) + 1;
        
        if (metadata.dateCreated) {
          const decade = Math.floor(new Date(metadata.dateCreated).getFullYear() / 10) * 10;
          results.stats.byDecade[decade] = (results.stats.byDecade[decade] || 0) + 1;
        }

        // Download image
        if (downloadImages) {
          await downloadImage(metadata);
          results.stats.downloaded++;
        }
      }

      await sleep(RATE_LIMIT_MS);
    }

    results.stats.total = results.images.length;
    console.log(`   ✅ Collected ${results.images.length} images so far`);
  }

  // Save metadata
  const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(results, null, 2));

  console.log('\n📊 Harvest Summary:');
  console.log(`   Total Images: ${results.stats.total}`);
  console.log(`   By Category:`, results.stats.byCategory);
  console.log(`   By License:`, results.stats.byLicense);
  console.log(`   Downloaded: ${results.stats.downloaded}`);
  console.log(`\n✅ Metadata saved to: ${metadataPath}`);

  return results;
}

/**
 * Fetch images from a category
 */
async function fetchCategoryImages(category, limit = 1000) {
  const images = [];
  let continueToken = null;

  while (images.length < limit) {
    try {
      const params = {
        action: 'query',
        list: 'categorymembers',
        cmtitle: `Category:${category}`,
        cmlimit: 500,
        cmtype: 'file',
        format: 'json',
      };

      if (continueToken) {
        params.cmcontinue = continueToken;
      }

      const response = await axios.get(BASE_URL, { params, timeout: 15000 });

      if (!response.data?.query?.categorymembers) break;

      images.push(...response.data.query.categorymembers);

      continueToken = response.data.continue?.cmcontinue;
      if (!continueToken) break;

      await sleep(RATE_LIMIT_MS);

    } catch (error) {
      console.error(`   ❌ Error fetching category ${category}: ${error.message}`);
      break;
    }
  }

  return images;
}

/**
 * Fetch detailed metadata for an image
 */
async function fetchImageMetadata(title) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: 'query',
        prop: 'imageinfo',
        iiprop: 'url|size|mime|extmetadata|commonmetadata',
        titles: title,
        format: 'json',
      },
      timeout: 15000,
    });

    const page = Object.values(response.data.query.pages)[0];
    if (!page.imageinfo) return null;

    const info = page.imageinfo[0];
    const extmeta = info.extmetadata || {};

    return {
      title: page.title,
      filename: title.replace('File:', ''),
      pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
      
      // Media URLs
      imageUrl: info.url,
      thumbnailUrl: info.thumburl || info.url,
      
      // Dimensions
      width: info.width,
      height: info.height,
      size: info.size,
      mime: info.mime,
      
      // Metadata
      description: extmeta.ImageDescription?.value,
      dateCreated: extmeta.DateTimeOriginal?.value || extmeta.DateTime?.value,
      artist: extmeta.Artist?.value,
      credit: extmeta.Credit?.value,
      
      // Location
      location: extmeta.ObjectName?.value,
      gpsLatitude: info.commonmetadata?.find(m => m.name === 'GPSLatitude')?.value,
      gpsLongitude: info.commonmetadata?.find(m => m.name === 'GPSLongitude')?.value,
      
      // Rights
      license: extmeta.LicenseShortName?.value,
      licenseUrl: extmeta.LicenseUrl?.value,
      usageTerms: extmeta.UsageTerms?.value,
      copyrighted: extmeta.Copyrighted?.value,
      
      // Source
      source: 'wikimedia',
      ingestDate: new Date().toISOString(),
    };

  } catch (error) {
    console.warn(`   ⚠️  Failed to fetch metadata for ${title}: ${error.message}`);
    return null;
  }
}

/**
 * Download image to local storage
 */
async function downloadImage(metadata) {
  try {
    const response = await axios.get(metadata.imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    const hash = crypto.createHash('md5').update(metadata.filename).digest('hex');
    const ext = metadata.mime.split('/')[1] || 'jpg';
    const filename = `${hash}.${ext}`;
    
    const imageDir = path.join(OUTPUT_DIR, 'images');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    const imagePath = path.join(imageDir, filename);
    fs.writeFileSync(imagePath, response.data);
    
    metadata.localPath = imagePath;

  } catch (error) {
    console.warn(`   ⚠️  Failed to download ${metadata.filename}: ${error.message}`);
  }
}

/**
 * Search by keywords (alternative to category browsing)
 */
async function searchWikimedia(keywords, limit = 1000) {
  console.log(`\n🔍 Searching Wikimedia Commons: "${keywords}"`);
  
  const images = [];
  let continueToken = null;

  while (images.length < limit) {
    try {
      const params = {
        action: 'query',
        list: 'search',
        srsearch: keywords,
        srnamespace: 6, // File namespace
        srlimit: 500,
        format: 'json',
      };

      if (continueToken) {
        params.sroffset = continueToken;
      }

      const response = await axios.get(BASE_URL, { params, timeout: 15000 });

      if (!response.data?.query?.search) break;

      for (const result of response.data.query.search) {
        const metadata = await fetchImageMetadata(result.title);
        if (metadata) {
          images.push(metadata);
        }
        await sleep(RATE_LIMIT_MS);
      }

      continueToken = response.data.continue?.sroffset;
      if (!continueToken) break;

    } catch (error) {
      console.error(`   ❌ Search error: ${error.message}`);
      break;
    }
  }

  console.log(`   ✅ Found ${images.length} images`);
  return images;
}

/**
 * CLI Interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const searchMode = args.includes('--search');
  
  if (searchMode) {
    const keywords = args.find(a => a.startsWith('--keywords='))?.split('=')[1] || 'Saint Paul Minnesota';
    const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 1000;
    
    searchWikimedia(keywords, limit)
      .then(() => {
        console.log('\n✅ Wikimedia search complete!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ Search failed:', error);
        process.exit(1);
      });
  } else {
    const options = {
      limit: parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 5000,
      downloadImages: !args.includes('--no-download'),
    };

    harvestWikimedia(options)
      .then(() => {
        console.log('\n✅ Wikimedia harvest complete!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ Harvest failed:', error);
        process.exit(1);
      });
  }
}

module.exports = { harvestWikimedia, searchWikimedia };
