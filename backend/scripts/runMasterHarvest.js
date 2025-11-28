/**
 * Master Data Collection Orchestrator
 * Runs all harvest scripts in sequence with error handling
 */

const fs = require('fs');
const path = require('path');

// Import all harvesters
const { harvestDPLA } = require('./gatherDPLA');
const { searchChroniclingAmerica } = require('./gatherChroniclingAmerica');
const { harvestWikimedia } = require('./gatherWikimedia');
const { searchInternetArchive } = require('./gatherInternetArchive');

const OUTPUT_DIR = path.join(__dirname, '../../data/collected');
const REPORT_PATH = path.join(OUTPUT_DIR, 'harvest-report.json');

/**
 * Run complete harvest pipeline
 */
async function runHarvestPipeline(options = {}) {
  const {
    skipDPLA = false,
    skipNewspapers = false,
    skipWikimedia = false,
    skipInternetArchive = false,
    lightweight = false, // Smaller limits for testing
  } = options;

  console.log('🚀 MASTER DATA HARVEST PIPELINE STARTING\n');
  console.log('=' .repeat(60));
  
  const report = {
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
    sources: {},
    totals: {
      images: 0,
      articles: 0,
      documents: 0,
      audio: 0,
      errors: 0,
    },
    errors: [],
  };

  const limits = lightweight ? {
    dpla: 500,
    newspapers: 1000,
    wikimedia: 500,
    internetArchive: 200,
  } : {
    dpla: 10000,
    newspapers: 50000,
    wikimedia: 5000,
    internetArchive: 1000,
  };

  // ===== 1. DPLA (Digital Public Library of America) =====
  if (!skipDPLA) {
    console.log('\n\n📚 PHASE 1: DPLA HARVEST');
    console.log('=' .repeat(60));
    try {
      const startTime = Date.now();
      const result = await harvestDPLA({
        query: 'Saint Paul Minnesota',
        limit: limits.dpla,
        saveImages: true,
      });
      
      report.sources.dpla = {
        status: 'success',
        itemCount: result.stats.total,
        duration: Date.now() - startTime,
        withImages: result.stats.withImages,
      };
      
      report.totals.images += result.stats.withImages;
      
    } catch (error) {
      console.error('❌ DPLA harvest failed:', error.message);
      report.sources.dpla = { status: 'failed', error: error.message };
      report.errors.push({ source: 'dpla', error: error.message });
      report.totals.errors++;
    }
  }

  // ===== 2. Chronicling America (Newspapers) =====
  if (!skipNewspapers) {
    console.log('\n\n📰 PHASE 2: CHRONICLING AMERICA HARVEST');
    console.log('=' .repeat(60));
    try {
      const startTime = Date.now();
      const result = await searchChroniclingAmerica({
        keywords: 'Saint Paul',
        dateRange: { start: 1850, end: 1922 },
        limit: limits.newspapers,
        extractOCR: true,
      });
      
      report.sources.chroniclingAmerica = {
        status: 'success',
        articleCount: result.stats.total,
        duration: Date.now() - startTime,
        withOCR: result.stats.withOCR,
      };
      
      report.totals.articles += result.stats.total;
      
    } catch (error) {
      console.error('❌ Chronicling America harvest failed:', error.message);
      report.sources.chroniclingAmerica = { status: 'failed', error: error.message };
      report.errors.push({ source: 'chroniclingAmerica', error: error.message });
      report.totals.errors++;
    }
  }

  // ===== 3. Wikimedia Commons =====
  if (!skipWikimedia) {
    console.log('\n\n🖼️  PHASE 3: WIKIMEDIA COMMONS HARVEST');
    console.log('=' .repeat(60));
    try {
      const startTime = Date.now();
      const result = await harvestWikimedia({
        categories: [
          'Saint Paul, Minnesota',
          'History of Saint Paul, Minnesota',
          'Buildings in Saint Paul, Minnesota',
        ],
        limit: limits.wikimedia,
        downloadImages: true,
      });
      
      report.sources.wikimedia = {
        status: 'success',
        imageCount: result.stats.total,
        duration: Date.now() - startTime,
        downloaded: result.stats.downloaded,
      };
      
      report.totals.images += result.stats.total;
      
    } catch (error) {
      console.error('❌ Wikimedia harvest failed:', error.message);
      report.sources.wikimedia = { status: 'failed', error: error.message };
      report.errors.push({ source: 'wikimedia', error: error.message });
      report.totals.errors++;
    }
  }

  // ===== 4. Internet Archive =====
  if (!skipInternetArchive) {
    console.log('\n\n📚 PHASE 4: INTERNET ARCHIVE HARVEST');
    console.log('=' .repeat(60));
    try {
      const startTime = Date.now();
      const result = await searchInternetArchive({
        query: 'Saint Paul Minnesota history',
        mediaTypes: ['texts', 'audio', 'movies'],
        limit: limits.internetArchive,
        downloadFiles: false, // Don't auto-download large files
      });
      
      report.sources.internetArchive = {
        status: 'success',
        itemCount: result.stats.total,
        duration: Date.now() - startTime,
        byType: result.stats.byMediaType,
      };
      
      report.totals.documents += result.stats.byMediaType.texts || 0;
      report.totals.audio += result.stats.byMediaType.audio || 0;
      
    } catch (error) {
      console.error('❌ Internet Archive harvest failed:', error.message);
      report.sources.internetArchive = { status: 'failed', error: error.message };
      report.errors.push({ source: 'internetArchive', error: error.message });
      report.totals.errors++;
    }
  }

  // ===== Final Report =====
  report.endTime = new Date().toISOString();
  report.duration = new Date(report.endTime) - new Date(report.startTime);

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 HARVEST PIPELINE COMPLETE');
  console.log('='.repeat(60));
  console.log('\n📈 TOTALS:');
  console.log(`   Images: ${report.totals.images.toLocaleString()}`);
  console.log(`   Newspaper Articles: ${report.totals.articles.toLocaleString()}`);
  console.log(`   Documents: ${report.totals.documents.toLocaleString()}`);
  console.log(`   Audio Files: ${report.totals.audio}`);
  console.log(`   Errors: ${report.totals.errors}`);
  console.log(`\n⏱️  Duration: ${(report.duration / 1000 / 60).toFixed(1)} minutes`);

  // Save report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n✅ Report saved to: ${REPORT_PATH}`);

  return report;
}

/**
 * Run incremental update (daily/weekly cron job)
 */
async function runIncrementalUpdate() {
  console.log('🔄 INCREMENTAL UPDATE MODE\n');
  
  // Only fetch recent additions (e.g., last week)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Smaller limits for incremental updates
  return await runHarvestPipeline({
    lightweight: true,
  });
}

/**
 * CLI Interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  const options = {
    skipDPLA: args.includes('--skip-dpla'),
    skipNewspapers: args.includes('--skip-newspapers'),
    skipWikimedia: args.includes('--skip-wikimedia'),
    skipInternetArchive: args.includes('--skip-internet-archive'),
    lightweight: args.includes('--lightweight'),
  };

  const incrementalMode = args.includes('--incremental');

  const runFunction = incrementalMode ? runIncrementalUpdate : () => runHarvestPipeline(options);

  runFunction()
    .then((report) => {
      if (report.totals.errors > 0) {
        console.warn(`\n⚠️  Completed with ${report.totals.errors} errors`);
        process.exit(1);
      } else {
        console.log('\n✅ All harvests completed successfully!');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('\n❌ Pipeline failed:', error);
      process.exit(1);
    });
}

module.exports = { runHarvestPipeline, runIncrementalUpdate };
