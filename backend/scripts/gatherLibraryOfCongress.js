/**
 * Library of Congress Collections Scraper
 * Photos, maps, documents about St. Paul, Minnesota
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function gatherLOCData() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: [],
    totalRecords: 0
  };

  console.log('📸 Library of Congress Mining Started...\n');

  // LOC Photos & Prints
  try {
    console.log('🖼️  Fetching LOC Photos & Prints...');
    
    const response = await axios.get('https://www.loc.gov/photos/', {
      params: {
        q: 'Saint Paul Minnesota',
        fo: 'json',
        c: 100,
        sp: 1
      },
      headers: {
        'Accept': 'application/json'
      },
      timeout: 20000
    });
    
    const filename = 'loc_photos_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.results?.length || 0;
    console.log(`   ✅ ${count} photos/prints from LOC`);
    
    results.sources.push({
      name: 'LOC Photos & Prints',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ LOC Photos failed: ${error.message}`);
    results.sources.push({
      name: 'LOC Photos & Prints',
      status: 'failed',
      error: error.message
    });
  }

  // LOC Maps
  try {
    console.log('🗺️  Fetching LOC Historic Maps...');
    
    const response = await axios.get('https://www.loc.gov/maps/', {
      params: {
        q: 'Saint Paul Minnesota',
        fo: 'json',
        c: 100,
        sp: 1
      },
      headers: {
        'Accept': 'application/json'
      },
      timeout: 20000
    });
    
    const filename = 'loc_maps_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.results?.length || 0;
    console.log(`   ✅ ${count} historic maps from LOC`);
    
    results.sources.push({
      name: 'LOC Historic Maps',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ LOC Maps failed: ${error.message}`);
    results.sources.push({
      name: 'LOC Historic Maps',
      status: 'failed',
      error: error.message
    });
  }

  // LOC American Memory - Panoramic Maps
  try {
    console.log('🏙️  Fetching LOC Panoramic Maps...');
    
    const response = await axios.get('https://www.loc.gov/collections/panoramic-maps/', {
      params: {
        q: 'Saint Paul Minnesota',
        fo: 'json',
        c: 50,
        sp: 1
      },
      headers: {
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    const filename = 'loc_panoramic_maps.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.results?.length || 0;
    console.log(`   ✅ ${count} panoramic maps`);
    
    results.sources.push({
      name: 'LOC Panoramic Maps',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ LOC Panoramic Maps failed: ${error.message}`);
    results.sources.push({
      name: 'LOC Panoramic Maps',
      status: 'failed',
      error: error.message
    });
  }

  // LOC Built in America (Historic American Buildings Survey)
  try {
    console.log('🏛️  Fetching HABS (Historic American Buildings Survey)...');
    
    const response = await axios.get('https://www.loc.gov/collections/historic-american-buildings-landscapes-and-engineering-records/', {
      params: {
        q: 'Saint Paul Minnesota',
        fo: 'json',
        c: 100,
        sp: 1
      },
      headers: {
        'Accept': 'application/json'
      },
      timeout: 20000
    });
    
    const filename = 'loc_habs_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.results?.length || 0;
    console.log(`   ✅ ${count} HABS building records`);
    
    results.sources.push({
      name: 'HABS Buildings',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ HABS failed: ${error.message}`);
    results.sources.push({
      name: 'HABS Buildings',
      status: 'failed',
      error: error.message
    });
  }

  // LOC General Search (books, manuscripts, etc)
  try {
    console.log('📚 Fetching LOC General Collections...');
    
    const response = await axios.get('https://www.loc.gov/search/', {
      params: {
        q: 'Saint Paul Minnesota history',
        fo: 'json',
        c: 100,
        sp: 1
      },
      headers: {
        'Accept': 'application/json'
      },
      timeout: 20000
    });
    
    const filename = 'loc_general_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.results?.length || 0;
    console.log(`   ✅ ${count} general collection items`);
    
    results.sources.push({
      name: 'LOC General Collections',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ LOC General failed: ${error.message}`);
    results.sources.push({
      name: 'LOC General Collections',
      status: 'failed',
      error: error.message
    });
  }

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, '_loc_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Library of Congress Mining Complete: ${results.totalRecords} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherLOCData().catch(console.error);
