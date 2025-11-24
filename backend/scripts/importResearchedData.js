/**
 * Import researched St. Paul historical data to MongoDB
 */
require('dotenv').config();
const mongoose = require('mongoose');
const stPaulData = require('./stPaulHistoricalFacts');

// Import models
const Location = require('../models/Location');
const HistoricalEvent = require('../models/HistoricalEvent');
const BuildingSpec = require('../models/BuildingSpec');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stpaul-history';

async function importData() {
  try {
    console.log('🏛️  Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (optional - comment out if you want to keep existing)
    console.log('🗑️  Clearing existing data...');
    await Location.deleteMany({});
    await HistoricalEvent.deleteMany({});
    await BuildingSpec.deleteMany({});
    console.log('✅ Cleared\n');

    // Import Landmarks as Locations
    console.log('📍 Importing landmarks...');
    const locations = stPaulData.landmarks.map(landmark => ({
      name: landmark.name,
      description: landmark.description,
      coordinates: {
        type: 'Point',
        coordinates: [landmark.coordinates.lon, landmark.coordinates.lat]
      },
      address: landmark.address,
      type: 'landmark',
      historicalPeriod: `Built ${landmark.yearBuilt}`,
      significance: landmark.style,
      metadata: {
        architect: landmark.architect,
        nrhpListed: landmark.nrhpListed,
        architecturalStyle: landmark.style
      },
      sources: [{
        name: 'St. Paul Historical Research',
        url: 'National Register of Historic Places',
        retrievedAt: new Date()
      }]
    }));

    const savedLocations = await Location.insertMany(locations);
    console.log(`✅ Imported ${savedLocations.length} landmarks\n`);

    // Import Neighborhoods as Locations
    console.log('🏘️  Importing neighborhoods...');
    const neighborhoods = stPaulData.neighborhoods.map(hood => ({
      name: hood.name,
      description: hood.historicalSignificance,
      type: 'neighborhood',
      historicalPeriod: `Established ${hood.established}`,
      significance: hood.notableFeatures.join(', '),
      metadata: {
        established: hood.established,
        boundaries: hood.boundaries,
        population2020: hood.population2020,
        notableFeatures: hood.notableFeatures
      },
      sources: [{
        name: 'St. Paul Historical Research',
        retrievedAt: new Date()
      }]
    }));

    const savedNeighborhoods = await Location.insertMany(neighborhoods);
    console.log(`✅ Imported ${savedNeighborhoods.length} neighborhoods\n`);

    // Import Historical Events
    console.log('📅 Importing historical events...');
    const events = stPaulData.events.map(evt => ({
      name: evt.event,
      date: new Date(evt.date || `${evt.year}-01-01`),
      year: evt.year,
      description: evt.description,
      significance: evt.significance,
      category: 'historical',
      sources: [{
        name: 'St. Paul Historical Research',
        retrievedAt: new Date()
      }],
      tags: []
    }));

    const savedEvents = await HistoricalEvent.insertMany(events);
    console.log(`✅ Imported ${savedEvents.length} historical events\n`);

    // Import Building Specifications
    console.log('🏗️  Importing building specifications...');
    const buildings = stPaulData.landmarks.map(landmark => ({
      name: landmark.name,
      address: landmark.address,
      coordinates: {
        type: 'Point',
        coordinates: [landmark.coordinates.lon, landmark.coordinates.lat]
      },
      constructionYear: landmark.yearBuilt,
      architect: landmark.architect,
      architecturalStyle: landmark.style,
      metadata: {
        nrhpListed: landmark.nrhpListed,
        description: landmark.description,
        style: landmark.style
      },
      sources: [{
        name: 'National Register of Historic Places',
        retrievedAt: new Date()
      }]
    }));

    const savedBuildings = await BuildingSpec.insertMany(buildings);
    console.log(`✅ Imported ${savedBuildings.length} building specifications\n`);

    // Summary
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Landmarks: ${savedLocations.length}`);
    console.log(`Neighborhoods: ${savedNeighborhoods.length}`);
    console.log(`Historical Events: ${savedEvents.length}`);
    console.log(`Buildings: ${savedBuildings.length}`);
    console.log(`Total Records: ${savedLocations.length + savedNeighborhoods.length + savedEvents.length + savedBuildings.length}`);
    console.log('='.repeat(60));

    console.log('\n✨ Data import complete!');
    console.log('\nNext steps:');
    console.log('  1. Start API: npm run dev');
    console.log('  2. View locations: http://localhost:3000/api/locations');
    console.log('  3. View events: http://localhost:3000/api/history');
    console.log('  4. View buildings: http://localhost:3000/api/building-specs');

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  importData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = importData;
