#!/usr/bin/env node
/**
 * Database Index Evaluation Script
 * Analyzes current indexes and provides recommendations
 * 
 * Usage: node backend/scripts/evaluateIndexes.js
 */

const mongoose = require('mongoose');
require('../config/database');
const BuildingSpec = require('../models/BuildingSpec');
const ReconstructionSnapshot = require('../models/ReconstructionSnapshot');

/**
 * Format bytes to human-readable size
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Evaluate indexes for a collection
 * @param {mongoose.Model} Model
 * @returns {Promise<Object>}
 */
async function evaluateIndexes(Model) {
  const collectionName = Model.collection.name;
  const db = mongoose.connection.db;
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Collection: ${collectionName}`);
  console.log('═'.repeat(60));

  // Get index stats
  const stats = await db.collection(collectionName).stats({ indexDetails: true });
  const indexes = await Model.collection.indexes();
  
  console.log(`\n📊 Collection Stats:`);
  console.log(`  Documents: ${stats.count.toLocaleString()}`);
  console.log(`  Size: ${formatBytes(stats.size)}`);
  console.log(`  Index Size: ${formatBytes(stats.totalIndexSize)}`);
  console.log(`  Indexes: ${stats.nindexes}`);

  console.log(`\n📋 Index Details:`);
  indexes.forEach((idx, i) => {
    const keys = Object.entries(idx.key).map(([k, v]) => `${k}:${v}`).join(', ');
    const unique = idx.unique ? ' [UNIQUE]' : '';
    const sparse = idx.sparse ? ' [SPARSE]' : '';
    console.log(`  ${i + 1}. ${idx.name}${unique}${sparse}`);
    console.log(`     Keys: ${keys}`);
    if (idx.expireAfterSeconds) {
      console.log(`     TTL: ${idx.expireAfterSeconds}s`);
    }
  });

  // Get index usage stats (requires MongoDB 3.2+)
  try {
    const indexStats = await db.collection(collectionName).aggregate([
      { $indexStats: {} }
    ]).toArray();

    if (indexStats.length > 0) {
      console.log(`\n📈 Index Usage (since last restart):`);
      indexStats.forEach(stat => {
        const usage = stat.accesses.ops;
        const lastUsed = stat.accesses.since ? new Date(stat.accesses.since).toLocaleString() : 'Never';
        console.log(`  ${stat.name}: ${usage} operations (since ${lastUsed})`);
      });

      // Identify unused indexes
      const unusedIndexes = indexStats.filter(s => s.accesses.ops === 0 && s.name !== '_id_');
      if (unusedIndexes.length > 0) {
        console.log(`\n⚠️  Unused Indexes (consider removing):`);
        unusedIndexes.forEach(idx => {
          console.log(`  - ${idx.name}`);
        });
      }
    }
  } catch (err) {
    console.log(`\n⚠️  Index usage stats not available (requires MongoDB 3.2+)`);
  }

  return { stats, indexes };
}

/**
 * Provide index recommendations
 * @param {Object} buildingSpecStats
 * @param {Object} snapshotStats
 */
function provideRecommendations(buildingSpecStats, snapshotStats) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log('💡 Index Recommendations');
  console.log('═'.repeat(60));

  const recommendations = [];

  // Check for common query patterns
  const bsIndexNames = buildingSpecStats.indexes.map(i => i.name);
  const rsIndexNames = snapshotStats.indexes.map(i => i.name);

  // BuildingSpec recommendations
  if (!bsIndexNames.some(n => n.includes('status') && n.includes('style'))) {
    recommendations.push({
      collection: 'BuildingSpec',
      index: '{ status: 1, architecturalStyle: 1 }',
      reason: 'Optimize filtered queries by status + style',
      command: 'db.buildingspecs.createIndex({ status: 1, architecturalStyle: 1 })'
    });
  }

  if (!bsIndexNames.some(n => n.includes('location') && n === 'location_2dsphere')) {
    recommendations.push({
      collection: 'BuildingSpec',
      index: '{ location: "2dsphere" }',
      reason: 'Enable geospatial queries (nearLat/nearLon, bbox)',
      command: 'db.buildingspecs.createIndex({ location: "2dsphere" })'
    });
  }

  // ReconstructionSnapshot recommendations
  if (!rsIndexNames.some(n => n.includes('year') && n.includes('label'))) {
    recommendations.push({
      collection: 'ReconstructionSnapshot',
      index: '{ year: 1, label: 1 }',
      reason: 'Optimize year-based snapshot lookups',
      command: 'db.reconstructionsnapshots.createIndex({ year: 1, label: 1 })'
    });
  }

  if (recommendations.length === 0) {
    console.log('\n✅ All recommended indexes are already in place!');
  } else {
    console.log('\n📝 Suggested Indexes:\n');
    recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.collection}: ${rec.index}`);
      console.log(`   Reason: ${rec.reason}`);
      console.log(`   Command: ${rec.command}\n`);
    });
  }

  // General best practices
  console.log('\n📚 Index Best Practices:');
  console.log('  • Remove unused indexes to reduce write overhead');
  console.log('  • Create compound indexes for common multi-field queries');
  console.log('  • Use sparse indexes for optional fields queried frequently');
  console.log('  • Monitor index usage with $indexStats aggregation');
  console.log('  • Keep index size reasonable (< 10% of data size is good)');
  
  const bsIndexRatio = (buildingSpecStats.stats.totalIndexSize / buildingSpecStats.stats.size * 100).toFixed(1);
  const rsIndexRatio = (snapshotStats.stats.totalIndexSize / snapshotStats.stats.size * 100).toFixed(1);
  
  console.log(`\n📊 Current Index Ratios:`);
  console.log(`  BuildingSpec: ${bsIndexRatio}% ${bsIndexRatio > 15 ? '⚠️' : '✅'}`);
  console.log(`  ReconstructionSnapshot: ${rsIndexRatio}% ${rsIndexRatio > 15 ? '⚠️' : '✅'}`);
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🔍 Database Index Evaluation Tool');
    console.log('━'.repeat(60));

    // Wait for DB connection
    await new Promise(resolve => {
      if (mongoose.connection.readyState === 1) resolve();
      else mongoose.connection.once('open', resolve);
    });

    const buildingSpecStats = await evaluateIndexes(BuildingSpec);
    const snapshotStats = await evaluateIndexes(ReconstructionSnapshot);

    provideRecommendations(buildingSpecStats, snapshotStats);

    console.log(`\n${'═'.repeat(60)}`);
    console.log('✨ Evaluation complete!');
    console.log('═'.repeat(60));
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { evaluateIndexes, provideRecommendations };
