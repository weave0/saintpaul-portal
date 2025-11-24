/**
 * Historical Newspaper Archives Scraper
 * Minnesota Digital Newspaper Hub and Chronicling America
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function gatherNewspaperData() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: [],
    totalRecords: 0
  };

  console.log('📰 Historical Newspaper Mining Started...\n');

  // Chronicling America (Library of Congress)
  try {
    console.log('📜 Fetching Chronicling America (LOC)...');
    
    // Search for St. Paul newspapers
    const searchResponse = await axios.get('https://chroniclingamerica.loc.gov/search/pages/results/', {
      params: {
        state: 'Minnesota',
        city: 'Saint Paul',
        dateFilterType: 'yearRange',
        date1: 1849,
        date2: 1963,
        format: 'json',
        rows: 100
      },
      timeout: 20000
    });
    
    const filename = 'chronicling_america_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(searchResponse.data, null, 2));
    
    const count = searchResponse.data.totalItems || 0;
    console.log(`   ✅ ${count} newspaper pages from Chronicling America`);
    
    results.sources.push({
      name: 'Chronicling America',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

    // Get list of St. Paul newspapers
    const titlesResponse = await axios.get('https://chroniclingamerica.loc.gov/search/titles/results/', {
      params: {
        state: 'Minnesota',
        city: 'Saint Paul',
        format: 'json'
      },
      timeout: 15000
    });
    
    const titlesFilename = 'chronicling_america_titles.json';
    fs.writeFileSync(path.join(outputDir, titlesFilename), JSON.stringify(titlesResponse.data, null, 2));
    
    const titlesCount = titlesResponse.data.items?.length || 0;
    console.log(`   ✅ ${titlesCount} St. Paul newspaper titles cataloged`);
    
    results.sources.push({
      name: 'Chronicling America Titles',
      count: titlesCount,
      file: titlesFilename,
      status: 'success'
    });
    results.totalRecords += titlesCount;

  } catch (error) {
    console.log(`   ❌ Chronicling America failed: ${error.message}`);
    results.sources.push({
      name: 'Chronicling America',
      status: 'failed',
      error: error.message
    });
  }

  // Minnesota Digital Newspaper Hub
  try {
    console.log('📰 Fetching Minnesota Digital Newspaper Hub...');
    
    // Try to get St. Paul newspapers from MN Hub
    const response = await axios.get('https://newspapers.mnhs.org/catalog.json', {
      params: {
        'q': 'Saint Paul',
        'f[pub_date_facet][]': '1800s',
        'per_page': 100
      },
      timeout: 15000
    });
    
    const filename = 'mn_newspaper_hub.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.response?.docs?.length || 0;
    console.log(`   ✅ ${count} items from MN Newspaper Hub`);
    
    results.sources.push({
      name: 'Minnesota Newspaper Hub',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ MN Newspaper Hub failed: ${error.message}`);
    results.sources.push({
      name: 'Minnesota Newspaper Hub',
      status: 'failed',
      error: error.message
    });
  }

  // Pioneer Press Historical Archive (metadata)
  const pioneerPressHistory = {
    name: 'St. Paul Pioneer Press',
    founded: 1849,
    originalName: 'Minnesota Pioneer',
    nameHistory: [
      { year: 1849, name: 'Minnesota Pioneer' },
      { year: 1854, name: 'Daily Minnesotan' },
      { year: 1858, name: 'Minnesota Pioneer and Democrat' },
      { year: 1875, name: 'St. Paul Pioneer Press' },
      { year: 1985, name: 'St. Paul Pioneer Press Dispatch' },
      { year: 1998, name: 'St. Paul Pioneer Press' }
    ],
    significance: 'Oldest continuously published newspaper in Minnesota',
    notableEvents: [
      'First newspaper in Minnesota Territory (1849)',
      'Covered Dakota War of 1862',
      'Documented railroad expansion era',
      'Prohibition and gangster era coverage (1920s-1930s)',
      'Civil rights movement coverage (1960s)'
    ],
    digitalArchives: {
      newspaperscom: 'https://www.newspapers.com/title/st-paul-pioneer-press/',
      proquest: 'Available through ProQuest Historical Newspapers'
    }
  };

  fs.writeFileSync(
    path.join(outputDir, 'pioneer_press_history.json'),
    JSON.stringify(pioneerPressHistory, null, 2)
  );
  console.log('   ✅ Pioneer Press historical metadata compiled');
  
  results.sources.push({
    name: 'Pioneer Press History',
    count: 1,
    file: 'pioneer_press_history.json',
    status: 'success'
  });
  results.totalRecords += 1;

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, '_newspaper_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Newspaper Mining Complete: ${results.totalRecords} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherNewspaperData().catch(console.error);
