/**
 * Ramsey County & St. Paul Government Data Scraper
 * Property records, building permits, zoning, historical records
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function gatherRamseyCountyData() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: [],
    totalRecords: 0
  };

  console.log('🏢 Ramsey County Government Data Mining Started...\n');

  // Ramsey County Open Data Portal (Socrata)
  try {
    console.log('📋 Fetching Ramsey County Open Data...');
    
    const response = await axios.get('https://data.ramseycounty.us/resource/9n5x-vnmp.json', {
      params: {
        $limit: 1000,
        $where: 'city="SAINT PAUL"'
      },
      timeout: 20000
    });
    
    const filename = 'ramsey_county_properties.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} property records`);
    
    results.sources.push({
      name: 'Ramsey County Property Data',
      count: response.data.length,
      file: filename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Ramsey County properties failed: ${error.message}`);
    results.sources.push({
      name: 'Ramsey County Property Data',
      status: 'failed',
      error: error.message
    });
  }

  // St. Paul Building Permits
  try {
    console.log('🏗️  Fetching St. Paul Building Permits...');
    
    const response = await axios.get('https://information.stpaul.gov/resource/vkeq-h66h.json', {
      params: {
        $limit: 1000,
        $order: 'issue_date DESC'
      },
      timeout: 20000
    });
    
    const filename = 'stpaul_building_permits.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} building permits`);
    
    results.sources.push({
      name: 'St. Paul Building Permits',
      count: response.data.length,
      file: filename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Building permits failed: ${error.message}`);
    results.sources.push({
      name: 'St. Paul Building Permits',
      status: 'failed',
      error: error.message
    });
  }

  // St. Paul Historic Districts
  try {
    console.log('🏛️  Fetching St. Paul Historic Districts...');
    
    const response = await axios.get('https://information.stpaul.gov/resource/r72u-hv8p.json', {
      params: {
        $limit: 500
      },
      timeout: 15000
    });
    
    const filename = 'stpaul_historic_districts_v2.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} historic district records`);
    
    results.sources.push({
      name: 'St. Paul Historic Districts',
      count: response.data.length,
      file: filename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Historic districts failed: ${error.message}`);
    results.sources.push({
      name: 'St. Paul Historic Districts',
      status: 'failed',
      error: error.message
    });
  }

  // St. Paul Heritage Preservation Sites
  try {
    console.log('🏰 Fetching Heritage Preservation Sites...');
    
    const response = await axios.get('https://information.stpaul.gov/resource/dq8u-5zxe.json', {
      params: {
        $limit: 500
      },
      timeout: 15000
    });
    
    const filename = 'stpaul_heritage_sites_v2.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} heritage sites`);
    
    results.sources.push({
      name: 'Heritage Preservation Sites',
      count: response.data.length,
      file: filename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Heritage sites failed: ${error.message}`);
    results.sources.push({
      name: 'Heritage Preservation Sites',
      status: 'failed',
      error: error.message
    });
  }

  // St. Paul Public Art
  try {
    console.log('🎨 Fetching St. Paul Public Art...');
    
    const response = await axios.get('https://information.stpaul.gov/resource/evkj-8atc.json', {
      params: {
        $limit: 1000
      },
      timeout: 15000
    });
    
    const filename = 'stpaul_public_art.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} public art installations`);
    
    results.sources.push({
      name: 'St. Paul Public Art',
      count: response.data.length,
      file: filename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Public art failed: ${error.message}`);
    results.sources.push({
      name: 'St. Paul Public Art',
      status: 'failed',
      error: error.message
    });
  }

  // St. Paul Parks
  try {
    console.log('🌳 Fetching St. Paul Parks...');
    
    const response = await axios.get('https://information.stpaul.gov/resource/9bon-f4aw.json', {
      params: {
        $limit: 500
      },
      timeout: 15000
    });
    
    const filename = 'stpaul_parks.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} parks`);
    
    results.sources.push({
      name: 'St. Paul Parks',
      count: response.data.length,
      file: filename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Parks failed: ${error.message}`);
    results.sources.push({
      name: 'St. Paul Parks',
      status: 'failed',
      error: error.message
    });
  }

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, '_ramsey_county_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Ramsey County Mining Complete: ${results.totalRecords} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherRamseyCountyData().catch(console.error);
