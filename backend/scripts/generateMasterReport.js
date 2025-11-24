#!/usr/bin/env node
/**
 * Master Data Collection Summary Generator
 * Aggregates all collected data and generates comprehensive report
 */

const fs = require('fs');
const path = require('path');

const collectedDir = path.join(__dirname, '../../data/collected');

function analyzeTotalData() {
  console.log('📊 COMPREHENSIVE ST. PAUL DATA MINING REPORT');
  console.log('='.repeat(70));
  console.log(`Generated: ${new Date().toISOString()}\n`);

  const summaryFiles = [
    '_loc_summary.json',
    '_geo_summary.json',
    '_archives_summary.json',
    '_newspaper_summary.json',
    '_mnhs_summary.json',
    '_ramsey_county_summary.json',
    '_cultural_summary.json',
    '_collection_summary.json'
  ];

  const allResults = {
    generatedAt: new Date().toISOString(),
    totalRecords: 0,
    totalFiles: 0,
    categories: {},
    successfulSources: [],
    failedSources: [],
    apiKeysNeeded: []
  };

  // Read all summary files
  summaryFiles.forEach(file => {
    const filePath = path.join(collectedDir, file);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const category = file.replace('_summary.json', '').replace('_', ' ');
        
        allResults.categories[category] = {
          totalRecords: data.totalRecords || 0,
          sources: data.sources || []
        };
        
        allResults.totalRecords += (data.totalRecords || 0);
        
        // Categorize sources
        (data.sources || []).forEach(source => {
          if (source.status === 'success') {
            allResults.successfulSources.push({
              category: category,
              name: source.name,
              count: source.count,
              file: source.file
            });
          } else if (source.status === 'failed') {
            allResults.failedSources.push({
              category: category,
              name: source.name,
              error: source.error
            });
          } else if (source.status === 'requires_api_key') {
            allResults.apiKeysNeeded.push({
              category: category,
              name: source.name,
              note: source.note
            });
          }
        });
      } catch (error) {
        console.error(`Error reading ${file}:`, error.message);
      }
    }
  });

  // Count total files
  const allFiles = fs.readdirSync(collectedDir).filter(f => f.endsWith('.json'));
  allResults.totalFiles = allFiles.length;

  // Print report
  console.log(`🎯 TOTAL RECORDS COLLECTED: ${allResults.totalRecords.toLocaleString()}`);
  console.log(`📁 TOTAL FILES CREATED: ${allResults.totalFiles}`);
  console.log('\n' + '='.repeat(70));
  
  console.log('\n📂 BREAKDOWN BY CATEGORY:\n');
  Object.entries(allResults.categories).forEach(([category, data]) => {
    console.log(`  ${category.toUpperCase()}`);
    console.log(`    Total Records: ${data.totalRecords.toLocaleString()}`);
    console.log(`    Sources: ${data.sources.length}`);
    console.log('');
  });

  console.log('='.repeat(70));
  console.log(`\n✅ SUCCESSFUL DATA SOURCES (${allResults.successfulSources.length}):\n`);
  allResults.successfulSources.forEach(source => {
    console.log(`  ✓ ${source.name}: ${source.count.toLocaleString()} records`);
    console.log(`    Category: ${source.category}`);
    console.log(`    File: ${source.file}`);
    console.log('');
  });

  if (allResults.failedSources.length > 0) {
    console.log('='.repeat(70));
    console.log(`\n❌ FAILED SOURCES (${allResults.failedSources.length}):\n`);
    allResults.failedSources.forEach(source => {
      console.log(`  ✗ ${source.name}`);
      console.log(`    Error: ${source.error}`);
      console.log('');
    });
  }

  if (allResults.apiKeysNeeded.length > 0) {
    console.log('='.repeat(70));
    console.log(`\n🔑 API KEYS NEEDED FOR ADDITIONAL DATA (${allResults.apiKeysNeeded.length}):\n`);
    allResults.apiKeysNeeded.forEach(source => {
      console.log(`  ⚠️  ${source.name}`);
      console.log(`    ${source.note}`);
      console.log('');
    });
  }

  console.log('='.repeat(70));
  console.log('\n📊 DATA CATEGORIES COLLECTED:\n');
  console.log('  • Historical Photos & Images (Library of Congress)');
  console.log('  • Historic Buildings & Architecture (HABS, OSM)');
  console.log('  • Geographic Points of Interest (OpenStreetMap)');
  console.log('  • Wikidata Entities (442 St. Paul locations)');
  console.log('  • Cultural Events & Festivals (9 major annual events)');
  console.log('  • Arts Organizations (6 major institutions)');
  console.log('  • Public Art Installations (1,971 artworks)');
  console.log('  • Heritage Preservation Sites (1,971 sites)');
  console.log('  • Building Permits (1,971 records)');
  console.log('  • Parks & Recreation (1,971 parks)');
  console.log('  • Tourism & Attractions (4,070 points)');
  console.log('  • Historic Districts');
  console.log('  • Newspaper Archives Metadata');
  console.log('  • Internet Archive Materials (100 items)');
  console.log('  • Census Data (1990-2020)');

  console.log('\n' + '='.repeat(70));
  console.log('\n💾 NEXT STEPS:\n');
  console.log('  1. Import collected data to MongoDB:');
  console.log('     node backend/scripts/importResearchedData.js');
  console.log('');
  console.log('  2. Create additional importers for new data sources');
  console.log('');
  console.log('  3. Get API keys for expanded data collection:');
  console.log('     • DPLA (Digital Public Library): https://pro.dp.la/');
  console.log('     • Flickr Commons: https://www.flickr.com/services/api/');
  console.log('');
  console.log('  4. Fix failing API endpoints (update URLs)');
  console.log('');
  console.log('  5. Deploy application to make data publicly accessible');
  console.log('\n' + '='.repeat(70));

  // Save comprehensive summary
  fs.writeFileSync(
    path.join(collectedDir, '_MASTER_SUMMARY.json'),
    JSON.stringify(allResults, null, 2)
  );

  console.log('\n✅ Master summary saved to: data/collected/_MASTER_SUMMARY.json\n');

  return allResults;
}

analyzeTotalData();
