/**
 * Comprehensive St. Paul Historical Data Gatherer
 * Pulls from multiple public APIs and data sources
 */
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../../data/collected');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Data Sources Configuration
const SOURCES = {
  // Ramsey County Open Data Portal
  ramseyCounty: {
    name: 'Ramsey County GIS',
    endpoints: [
      {
        name: 'Historic Sites',
        url: 'https://gis.co.ramsey.mn.us/arcgis/rest/services/HistoricPreservation/MapServer/0/query',
        params: { where: '1=1', outFields: '*', f: 'json' }
      },
      {
        name: 'Building Footprints',
        url: 'https://gis.co.ramsey.mn.us/arcgis/rest/services/Building_Footprints/MapServer/0/query',
        params: { where: "MUNI_NAME='SAINT PAUL'", outFields: '*', f: 'json', resultRecordCount: 1000 }
      }
    ]
  },

  // Minnesota Geospatial Commons
  mnGeo: {
    name: 'Minnesota Geospatial',
    endpoints: [
      {
        name: 'Historic Places',
        url: 'https://gisdata.mn.gov/api/3/action/datastore_search',
        params: { resource_id: 'historic-places', limit: 1000 }
      }
    ]
  },

  // St. Paul Open Data
  stPaulOpen: {
    name: 'St. Paul Open Data',
    endpoints: [
      {
        name: 'Historic Districts',
        url: 'https://information.stpaul.gov/resource/pzhs-q7zu.json',
        params: { $limit: 10000 }
      },
      {
        name: 'Heritage Preservation Sites',
        url: 'https://information.stpaul.gov/resource/fyqq-2yz4.json',
        params: { $limit: 10000 }
      },
      {
        name: 'Building Permits Historical',
        url: 'https://information.stpaul.gov/resource/rq8q-3z2s.json',
        params: { $limit: 5000, $where: 'issued_date < "2000-01-01"' }
      }
    ]
  },

  // Census Data (via Census API - requires free API key)
  census: {
    name: 'US Census Bureau',
    endpoints: [
      {
        name: 'St. Paul Population 1990-2020',
        url: 'https://api.census.gov/data/2020/dec/pl',
        params: { 
          get: 'NAME,P1_001N',
          for: 'place:58000', // St. Paul FIPS code
          in: 'state:27' // Minnesota
        }
      }
    ]
  }
};

async function fetchData(endpoint, source) {
  try {
    console.log(`📥 Fetching: ${source} - ${endpoint.name}`);
    
    const config = {
      method: endpoint.method || 'GET',
      url: endpoint.url,
      params: endpoint.params,
      timeout: 30000,
      headers: {
        'User-Agent': 'StPaul-History-Research-Bot/1.0',
        'Accept': 'application/json'
      }
    };

    const response = await axios(config);
    
    console.log(`✅ Success: ${source} - ${endpoint.name} (${response.data?.features?.length || response.data?.length || 'unknown'} items)`);
    
    return {
      source,
      endpoint: endpoint.name,
      timestamp: new Date().toISOString(),
      data: response.data,
      count: response.data?.features?.length || response.data?.length || 0
    };
    
  } catch (error) {
    console.error(`❌ Error: ${source} - ${endpoint.name}:`, error.message);
    return {
      source,
      endpoint: endpoint.name,
      timestamp: new Date().toISOString(),
      error: error.message,
      data: null
    };
  }
}

async function gatherAllData() {
  console.log('🏛️  Starting St. Paul Historical Data Collection...\n');
  
  const results = {
    metadata: {
      collectionDate: new Date().toISOString(),
      location: 'St. Paul, Minnesota',
      purpose: 'Historical Knowledge Portal Data Gathering'
    },
    sources: {}
  };

  for (const [sourceKey, sourceConfig] of Object.entries(SOURCES)) {
    console.log(`\n📚 Source: ${sourceConfig.name}`);
    results.sources[sourceKey] = [];

    for (const endpoint of sourceConfig.endpoints) {
      const result = await fetchData(endpoint, sourceConfig.name);
      results.sources[sourceKey].push(result);
      
      // Save individual endpoint data
      const filename = `${sourceKey}_${endpoint.name.toLowerCase().replace(/\s+/g, '_')}.json`;
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
      
      // Rate limiting - be respectful to APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Save summary
  const summaryPath = path.join(OUTPUT_DIR, '_collection_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));

  // Generate report
  console.log('\n\n📊 COLLECTION SUMMARY');
  console.log('='.repeat(60));
  
  let totalSuccess = 0;
  let totalFailed = 0;
  let totalRecords = 0;

  for (const [sourceKey, sourceResults] of Object.entries(results.sources)) {
    console.log(`\n${sourceKey.toUpperCase()}:`);
    sourceResults.forEach(r => {
      if (r.data) {
        totalSuccess++;
        totalRecords += r.count || 0;
        console.log(`  ✅ ${r.endpoint}: ${r.count || 0} records`);
      } else {
        totalFailed++;
        console.log(`  ❌ ${r.endpoint}: ${r.error}`);
      }
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Total Successful: ${totalSuccess}`);
  console.log(`Total Failed: ${totalFailed}`);
  console.log(`Total Records: ${totalRecords}`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));

  return results;
}

// Additional: Wikipedia data scraping
async function fetchWikipediaData() {
  console.log('\n📖 Fetching Wikipedia Data for St. Paul...');
  
  const topics = [
    'Saint_Paul,_Minnesota',
    'History_of_Saint_Paul,_Minnesota',
    'List_of_neighborhoods_in_Saint_Paul,_Minnesota',
    'Architecture_of_Saint_Paul,_Minnesota'
  ];

  const wikiData = [];

  for (const topic of topics) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`;
      const response = await axios.get(url);
      
      wikiData.push({
        title: response.data.title,
        extract: response.data.extract,
        url: response.data.content_urls.desktop.page,
        timestamp: new Date().toISOString()
      });
      
      console.log(`  ✅ ${response.data.title}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`  ❌ ${topic}:`, error.message);
    }
  }

  const wikiPath = path.join(OUTPUT_DIR, 'wikipedia_summaries.json');
  fs.writeFileSync(wikiPath, JSON.stringify(wikiData, null, 2));
  
  return wikiData;
}

// Run the collection
(async () => {
  try {
    await gatherAllData();
    await fetchWikipediaData();
    
    console.log('\n✨ Data collection complete!');
    console.log('Next steps:');
    console.log('  1. Review collected data in:', OUTPUT_DIR);
    console.log('  2. Import to MongoDB: node importData.js');
    console.log('  3. Verify in API: http://localhost:3000/api/locations');
    
  } catch (error) {
    console.error('Fatal error during collection:', error);
    process.exit(1);
  }
})();
