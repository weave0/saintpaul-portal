/**
 * Minnesota Historical Society Collections Scraper
 * Gathers St. Paul historical data from MNHS digital collections
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sources = [
  {
    name: 'MNHS Collections API',
    url: 'https://collections.mnhs.org/api/search',
    params: {
      q: 'Saint Paul Minnesota',
      limit: 100,
      offset: 0
    }
  },
  {
    name: 'Minnesota Reflections (Digital Library)',
    url: 'https://reflections.mndigital.org/catalog.json',
    params: {
      q: 'Saint Paul',
      per_page: 100
    }
  },
  {
    name: 'Gale Family Library Catalog',
    url: 'https://librarysearch.mnhs.org/primo-explore/search',
    params: {
      query: 'any,contains,Saint Paul Minnesota history',
      tab: 'default_tab',
      search_scope: 'default_scope',
      vid: 'MNHS'
    }
  }
];

async function gatherMNHSData() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: [],
    totalRecords: 0
  };

  console.log('🏛️  Minnesota Historical Society Data Mining Started...\n');

  // Try MNHS Collections API
  try {
    console.log('📚 Fetching MNHS Collections...');
    const response = await axios.get('https://collections.mnhs.org/api/search', {
      params: {
        q: 'Saint Paul',
        limit: 100
      },
      timeout: 15000
    });
    
    const filename = 'mnhs_collections_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = Array.isArray(response.data) ? response.data.length : (response.data.results?.length || 0);
    console.log(`   ✅ ${count} items from MNHS Collections`);
    
    results.sources.push({
      name: 'MNHS Collections',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;
  } catch (error) {
    console.log(`   ❌ MNHS Collections failed: ${error.message}`);
    results.sources.push({
      name: 'MNHS Collections',
      status: 'failed',
      error: error.message
    });
  }

  // Minnesota Reflections Digital Library
  try {
    console.log('📸 Fetching Minnesota Reflections...');
    const response = await axios.get('https://reflections.mndigital.org/catalog.json', {
      params: {
        'f[contributing_organization_name_ssi][]': 'Minnesota Historical Society',
        'q': 'Saint Paul',
        'per_page': 100
      },
      timeout: 15000
    });
    
    const filename = 'mn_reflections_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.response?.docs?.length || 0;
    console.log(`   ✅ ${count} items from Minnesota Reflections`);
    
    results.sources.push({
      name: 'Minnesota Reflections',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;
  } catch (error) {
    console.log(`   ❌ Minnesota Reflections failed: ${error.message}`);
    results.sources.push({
      name: 'Minnesota Reflections',
      status: 'failed',
      error: error.message
    });
  }

  // Try direct PALS (library catalog) search
  try {
    console.log('📖 Fetching MNHS Library Catalog...');
    const response = await axios.get('https://librarysearch.mnhs.org/primo_library/libweb/webservices/rest/pub/pnxs', {
      params: {
        blendFacetsSeparately: false,
        getDelivery: false,
        inst: 'MNHS',
        lang: 'eng',
        limit: 50,
        newspapersActive: false,
        newspapersSearch: false,
        offset: 0,
        pcAvailability: false,
        q: 'any,contains,Saint Paul Minnesota history',
        qExclude: '',
        qInclude: '',
        rapido: false,
        refEntryActive: false,
        rtaLinks: true,
        scope: 'default_scope',
        searchString: 'Saint Paul Minnesota history',
        skipDelivery: 'Y',
        sort: 'rank',
        tab: 'default_tab',
        vid: 'MNHS'
      },
      timeout: 15000
    });
    
    const filename = 'mnhs_library_catalog.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.docs?.length || 0;
    console.log(`   ✅ ${count} catalog items`);
    
    results.sources.push({
      name: 'MNHS Library Catalog',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;
  } catch (error) {
    console.log(`   ❌ MNHS Library failed: ${error.message}`);
    results.sources.push({
      name: 'MNHS Library Catalog',
      status: 'failed',
      error: error.message
    });
  }

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, '_mnhs_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 MNHS Mining Complete: ${results.totalRecords} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherMNHSData().catch(console.error);
