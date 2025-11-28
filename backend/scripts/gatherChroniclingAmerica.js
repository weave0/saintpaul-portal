/**
 * Chronicling America (Library of Congress) Newspaper Harvester
 * Historical newspapers 1836-1922
 * Focus: Saint Paul newspapers
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://chroniclingamerica.loc.gov';
const OUTPUT_DIR = path.join(__dirname, '../../data/collected/chronicling-america');
const RATE_LIMIT_MS = 2000; // 2 seconds (be very respectful to LOC)

// Saint Paul newspapers in Chronicling America
const SAINT_PAUL_NEWSPAPERS = [
  { lccn: 'sn83025234', title: 'Saint Paul Globe' },
  { lccn: 'sn83025244', title: 'Daily Pioneer' },
  { lccn: 'sn90059522', title: 'Minnesota Pioneer' },
  { lccn: 'sn84026956', title: 'Western Democrat' },
];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search Chronicling America for articles
 */
async function searchChroniclingAmerica(options = {}) {
  const {
    keywords = 'Saint Paul',
    dateRange = { start: 1850, end: 1922 },
    newspapers = SAINT_PAUL_NEWSPAPERS,
    extractOCR = true,
    limit = 50000,
  } = options;

  console.log('📰 Chronicling America Harvester Started');
  console.log(`   Keywords: "${keywords}"`);
  console.log(`   Date Range: ${dateRange.start}-${dateRange.end}`);
  console.log(`   Newspapers: ${newspapers.length}`);
  console.log(`   Limit: ${limit} pages\n`);

  const results = {
    timestamp: new Date().toISOString(),
    keywords,
    articles: [],
    stats: {
      total: 0,
      byNewspaper: {},
      byYear: {},
      withOCR: 0,
    },
  };

  for (const newspaper of newspapers) {
    console.log(`\n📰 Processing: ${newspaper.title} (${newspaper.lccn})`);
    
    let page = 1;
    let totalForNewspaper = 0;

    while (results.articles.length < limit) {
      try {
        console.log(`   Searching page ${page}...`);

        const response = await axios.get(`${BASE_URL}/search/pages/results/`, {
          params: {
            lccn: newspaper.lccn,
            dateFilterType: 'yearRange',
            date1: dateRange.start,
            date2: dateRange.end,
            andtext: keywords,
            format: 'json',
            page,
          },
          timeout: 30000,
        });

        if (!response.data || !response.data.items || response.data.items.length === 0) {
          console.log('   ℹ️  No more results for this newspaper');
          break;
        }

        for (const item of response.data.items) {
          const article = await processPage(item, newspaper, extractOCR);
          results.articles.push(article);

          // Update stats
          totalForNewspaper++;
          const year = new Date(article.date).getFullYear();
          results.stats.byYear[year] = (results.stats.byYear[year] || 0) + 1;
          if (article.ocrText) results.stats.withOCR++;

          // Rate limiting
          if (extractOCR) {
            await sleep(RATE_LIMIT_MS);
          }
        }

        results.stats.byNewspaper[newspaper.title] = totalForNewspaper;
        results.stats.total = results.articles.length;

        console.log(`   ✅ Page ${page}: ${totalForNewspaper} articles from ${newspaper.title}`);

        // Check if we have more pages
        if (!response.data.next) {
          console.log('   ℹ️  Reached last page');
          break;
        }

        page++;
        await sleep(RATE_LIMIT_MS);

      } catch (error) {
        console.error(`   ❌ Error on page ${page}: ${error.message}`);
        break;
      }
    }
  }

  // Save results
  const metadataPath = path.join(OUTPUT_DIR, 'articles-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(results, null, 2));

  // Save summary
  console.log('\n📊 Harvest Summary:');
  console.log(`   Total Articles: ${results.stats.total}`);
  console.log(`   By Newspaper:`, results.stats.byNewspaper);
  console.log(`   With OCR Text: ${results.stats.withOCR}`);
  console.log(`\n✅ Results saved to: ${metadataPath}`);

  return results;
}

/**
 * Process individual newspaper page
 */
async function processPage(item, newspaper, extractOCR) {
  const article = {
    id: item.id,
    title: item.title,
    newspaper: newspaper.title,
    lccn: newspaper.lccn,
    date: item.date,
    edition: item.edition,
    sequence: item.sequence,
    pageUrl: item.url,
    imageUrl: `${item.url.replace('.json', '')}.jp2`, // High-res JPEG2000
    thumbnailUrl: item.thumb,
    pdfUrl: item.pdf,
    ocrUrl: item.ocr_url,
    ocrText: null,
  };

  // Extract OCR text if requested
  if (extractOCR && item.ocr_url) {
    try {
      const ocrResponse = await axios.get(item.ocr_url, { timeout: 15000 });
      article.ocrText = ocrResponse.data;

      // Save OCR text to file for full-text search later
      const ocrDir = path.join(OUTPUT_DIR, 'ocr-text');
      if (!fs.existsSync(ocrDir)) {
        fs.mkdirSync(ocrDir, { recursive: true });
      }
      
      const ocrPath = path.join(ocrDir, `${article.id}.txt`);
      fs.writeFileSync(ocrPath, article.ocrText);

    } catch (error) {
      console.warn(`   ⚠️  Failed to fetch OCR for ${item.id}: ${error.message}`);
    }
  }

  return article;
}

/**
 * Extract entities from OCR text using basic NER
 */
function extractEntities(ocrText) {
  if (!ocrText) return {};

  // Simple regex-based extraction (can be enhanced with spaCy/GPT-4)
  const entities = {
    dates: [],
    people: [],
    places: [],
    organizations: [],
  };

  // Extract dates (e.g., "January 15, 1920")
  const dateRegex = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/g;
  entities.dates = [...new Set(ocrText.match(dateRegex) || [])];

  // Extract capitalized names (likely people or places)
  const nameRegex = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g;
  const names = ocrText.match(nameRegex) || [];
  entities.people = [...new Set(names.filter(n => !n.match(/^(Saint|St\.?|Paul|Minnesota)/)))];

  // Extract addresses (e.g., "123 Main Street")
  const addressRegex = /\b\d+\s+[A-Z][a-z]+\s+(?:Street|Avenue|Road|Boulevard|Drive)\b/g;
  entities.places = [...new Set(ocrText.match(addressRegex) || [])];

  return entities;
}

/**
 * Search for specific topics
 */
async function searchByTopic(topic, dateRange) {
  console.log(`\n🔍 Searching for topic: "${topic}"`);
  
  const topicKeywords = {
    fires: 'fire OR burned OR flames',
    crime: 'murder OR theft OR robbery OR arrest',
    celebrations: 'celebration OR festival OR parade',
    construction: 'construction OR building OR erected',
    politics: 'election OR mayor OR council OR vote',
    disasters: 'disaster OR flood OR tornado OR tragedy',
  };

  const keywords = topicKeywords[topic] || topic;
  
  return await searchChroniclingAmerica({
    keywords,
    dateRange,
    limit: 1000,
  });
}

/**
 * CLI Interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    keywords: args.find(a => a.startsWith('--keywords='))?.split('=')[1] || 'Saint Paul',
    dateRange: {
      start: parseInt(args.find(a => a.startsWith('--start='))?.split('=')[1]) || 1850,
      end: parseInt(args.find(a => a.startsWith('--end='))?.split('=')[1]) || 1922,
    },
    limit: parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 50000,
    extractOCR: !args.includes('--no-ocr'),
  };

  searchChroniclingAmerica(options)
    .then(() => {
      console.log('\n✅ Chronicling America harvest complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Harvest failed:', error);
      process.exit(1);
    });
}

module.exports = { searchChroniclingAmerica, searchByTopic };
