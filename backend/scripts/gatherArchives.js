/**
 * Digital Archives & Special Collections Miner
 * Internet Archive, Digital Public Library of America, academic archives
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function gatherArchiveData() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: [],
    totalRecords: 0
  };

  console.log('📦 Digital Archives Mining Started...\n');

  // Internet Archive
  try {
    console.log('🌐 Fetching Internet Archive...');
    
    const response = await axios.get('https://archive.org/advancedsearch.php', {
      params: {
        q: 'Saint Paul Minnesota AND (mediatype:texts OR mediatype:image OR mediatype:movies)',
        'fl[]': ['identifier', 'title', 'creator', 'year', 'subject', 'description', 'mediatype'],
        output: 'json',
        rows: 100,
        page: 1
      },
      timeout: 20000
    });
    
    const filename = 'internet_archive_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.response?.docs?.length || 0;
    console.log(`   ✅ ${count} items from Internet Archive`);
    
    results.sources.push({
      name: 'Internet Archive',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ Internet Archive failed: ${error.message}`);
    results.sources.push({
      name: 'Internet Archive',
      status: 'failed',
      error: error.message
    });
  }

  // Digital Public Library of America (DPLA)
  try {
    console.log('📚 Fetching DPLA...');
    
    const response = await axios.get('https://api.dp.la/v2/items', {
      params: {
        q: 'Saint Paul Minnesota',
        page_size: 100,
        api_key: 'your_api_key_here' // DPLA requires free API key
      },
      timeout: 20000,
      validateStatus: (status) => status < 500 // Accept 401/403 as valid
    });
    
    if (response.status === 200) {
      const filename = 'dpla_stpaul.json';
      fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
      
      const count = response.data.docs?.length || 0;
      console.log(`   ✅ ${count} items from DPLA`);
      
      results.sources.push({
        name: 'Digital Public Library of America',
        count: count,
        file: filename,
        status: 'success'
      });
      results.totalRecords += count;
    } else {
      throw new Error('API key required - get free key at pro.dp.la');
    }

  } catch (error) {
    console.log(`   ⚠️  DPLA requires API key: ${error.message}`);
    console.log('      Get free key at: https://pro.dp.la/developers/api-key-registration');
    results.sources.push({
      name: 'Digital Public Library of America',
      status: 'requires_api_key',
      error: error.message,
      note: 'Get free API key at https://pro.dp.la/developers/api-key-registration'
    });
  }

  // HathiTrust Digital Library
  try {
    console.log('📖 Fetching HathiTrust...');
    
    const response = await axios.get('https://catalog.hathitrust.org/api/volumes/brief/json/', {
      params: {
        q: 'Saint Paul Minnesota history'
      },
      timeout: 15000
    });
    
    const filename = 'hathitrust_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = Object.keys(response.data.items || {}).length;
    console.log(`   ✅ ${count} volumes from HathiTrust`);
    
    results.sources.push({
      name: 'HathiTrust Digital Library',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ HathiTrust failed: ${error.message}`);
    results.sources.push({
      name: 'HathiTrust Digital Library',
      status: 'failed',
      error: error.message
    });
  }

  // University of Minnesota Digital Collections
  try {
    console.log('🎓 Fetching UMN Digital Collections...');
    
    const response = await axios.get('https://umedia.lib.umn.edu/catalog.json', {
      params: {
        q: 'Saint Paul',
        per_page: 100
      },
      timeout: 15000
    });
    
    const filename = 'umn_digital_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.response?.docs?.length || 0;
    console.log(`   ✅ ${count} items from UMN Digital Collections`);
    
    results.sources.push({
      name: 'University of Minnesota Digital',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ UMN Digital failed: ${error.message}`);
    results.sources.push({
      name: 'University of Minnesota Digital',
      status: 'failed',
      error: error.message
    });
  }

  // Flickr Commons (for historical photos)
  try {
    console.log('📷 Fetching Flickr Commons...');
    
    // Note: Flickr API requires API key
    const response = await axios.get('https://api.flickr.com/services/rest/', {
      params: {
        method: 'flickr.photos.search',
        api_key: 'your_flickr_api_key',
        text: 'Saint Paul Minnesota historical',
        is_commons: 1,
        per_page: 100,
        format: 'json',
        nojsoncallback: 1
      },
      timeout: 15000,
      validateStatus: (status) => status < 500
    });
    
    if (response.status === 200 && !response.data.code) {
      const filename = 'flickr_commons_stpaul.json';
      fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
      
      const count = response.data.photos?.photo?.length || 0;
      console.log(`   ✅ ${count} historical photos from Flickr Commons`);
      
      results.sources.push({
        name: 'Flickr Commons',
        count: count,
        file: filename,
        status: 'success'
      });
      results.totalRecords += count;
    } else {
      throw new Error('API key required');
    }

  } catch (error) {
    console.log(`   ⚠️  Flickr requires API key: ${error.message}`);
    console.log('      Get free key at: https://www.flickr.com/services/api/misc.api_keys.html');
    results.sources.push({
      name: 'Flickr Commons',
      status: 'requires_api_key',
      error: error.message,
      note: 'Get free API key at https://www.flickr.com/services/api/'
    });
  }

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, '_archives_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Digital Archives Mining Complete: ${results.totalRecords} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherArchiveData().catch(console.error);
