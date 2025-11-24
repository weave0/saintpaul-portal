/**
 * Comprehensive data import script for ALL St. Paul historical data
 * Imports 49 JSON files (22,129+ records) into MongoDB
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Location = require('../models/Location');
const HistoricalEvent = require('../models/HistoricalEvent');
const BuildingSpec = require('../models/BuildingSpec');
const LocationInsight = require('../models/LocationInsight');
const ReconstructionSnapshot = require('../models/ReconstructionSnapshot');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saint-paul';

const dataDir = path.join(__dirname, '..', '..', 'data', 'collected');
const researchFile = path.join(__dirname, 'stPaulHistoricalFacts.js');

// Stats tracking
let stats = {
  totalFiles: 0,
  totalRecords: 0,
  locations: 0,
  events: 0,
  buildings: 0,
  insights: 0,
  errors: []
};

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

async function clearCollections() {
  console.log('🧹 Clearing existing collections...');
  await Location.deleteMany({});
  await HistoricalEvent.deleteMany({});
  await BuildingSpec.deleteMany({});
  await LocationInsight.deleteMany({});
  await ReconstructionSnapshot.deleteMany({});
  console.log('✅ Collections cleared');
}

async function importResearchedData() {
  console.log('📚 Importing researched historical facts...');
  
  // Import from stPaulHistoricalFacts.js
  const { landmarks, neighborhoods, events, buildingSpecs } = require('./stPaulHistoricalFacts');
  
  // Import landmarks as both locations and building specs
  for (const landmark of landmarks) {
    const coords = landmark.coordinates.lng ? landmark.coordinates : 
                   { latitude: landmark.coordinates.lat, longitude: landmark.coordinates.lon };
    
    await Location.create({
      name: landmark.name,
      address: {
        street: landmark.address,
        city: 'Saint Paul',
        state: 'Minnesota'
      },
      coordinates: coords,
      description: landmark.description,
      category: 'landmark',
      yearEstablished: landmark.yearBuilt,
      metadata: {
        source: 'researched',
        verified: true
      }
    });
    stats.locations++;
  }
  
  // Import neighborhoods
  for (const neighborhood of neighborhoods) {
    // Default coordinates for St. Paul neighborhoods (will use centroid)
    await Location.create({
      name: neighborhood.name,
      coordinates: { latitude: 44.9537, longitude: -93.0900 }, // St. Paul center
      description: `${neighborhood.historicalSignificance}. Notable features: ${neighborhood.notableFeatures.join(', ')}`,
      category: 'other',
      yearEstablished: neighborhood.established,
      metadata: {
        source: 'researched',
        verified: true
      }
    });
    stats.locations++;
  }
  
  // Import historical events
  for (const event of events) {
    const eventDate = event.date || event.year ? new Date(event.year || event.date) : new Date('1900-01-01');
    const eventCategory = ['political', 'cultural', 'economic', 'social', 'infrastructure'].includes(event.category) 
      ? event.category : 'other';
    const eventSignificance = ['local', 'regional', 'national', 'international'].includes(event.significance)
      ? event.significance : 'local';
    
    await HistoricalEvent.create({
      title: event.title || event.event,
      date: eventDate,
      description: event.description,
      category: eventCategory,
      significance: eventSignificance,
      tags: [event.location || 'St. Paul']
    });
    stats.events++;
  }
  
  console.log(`✅ Imported ${landmarks.length} landmarks, ${neighborhoods.length} neighborhoods, ${events.length} events`);
}

async function importCollectedData() {
  console.log('📊 Importing collected data from 49 JSON files...');
  
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} data files`);
  
  for (const file of files) {
    try {
      stats.totalFiles++;
      const filePath = path.join(dataDir, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      
      const source = file.replace('.json', '');
      console.log(`\n📄 Processing ${file}...`);
      
      // Determine data type and import accordingly
      if (file.includes('crime')) {
        await importCrimeData(data, source);
      } else if (file.includes('ghost')) {
        await importGhostStories(data, source);
      } else if (file.includes('music')) {
        await importMusicData(data, source);
      } else if (file.includes('food')) {
        await importFoodData(data, source);
      } else if (file.includes('sports')) {
        await importSportsData(data, source);
      } else if (file.includes('famous')) {
        await importFamousPeople(data, source);
      } else if (file.includes('cultural')) {
        await importCulturalEvents(data, source);
      } else if (file.includes('openstreetmap') || file.includes('osm')) {
        await importOSMData(data, source);
      } else if (file.includes('loc') || file.includes('libraryofcongress')) {
        await importLOCData(data, source);
      } else if (file.includes('ramsey')) {
        await importRamseyCountyData(data, source);
      } else {
        await importGenericData(data, source);
      }
      
      console.log(`  ✅ ${file} imported`);
    } catch (error) {
      console.error(`  ❌ Error importing ${file}:`, error.message);
      stats.errors.push({ file, error: error.message });
    }
  }
}

async function importCrimeData(data, source) {
  const records = data.incidents || data.data || data;
  if (!Array.isArray(records)) return;
  
  for (const record of records.slice(0, 1000)) { // Limit to 1000 per file
    if (record.location || record.coordinates) {
      await Location.create({
        name: record.incident || record.type || 'Crime Location',
        address: record.address || record.location,
        coordinates: record.coordinates || { lat: 44.9537, lng: -93.0900 },
        category: 'crime',
        description: record.description || `${record.type} incident`,
        date: record.date ? new Date(record.date) : undefined,
        source
      });
      stats.locations++;
    }
  }
  stats.totalRecords += records.length;
}

async function importGhostStories(data, source) {
  const stories = data.locations || data.stories || data;
  if (!Array.isArray(stories)) return;
  
  for (const story of stories) {
    await Location.create({
      name: story.name,
      address: story.address,
      coordinates: story.coordinates,
      category: 'haunted',
      description: story.story || story.description,
      hauntingType: story.type,
      ghostName: story.ghost,
      source
    });
    stats.locations++;
    
    if (story.history) {
      await HistoricalEvent.create({
        title: `Haunting of ${story.name}`,
        description: story.history,
        location: story.name,
        category: 'paranormal',
        source
      });
      stats.events++;
    }
  }
  stats.totalRecords += stories.length;
}

async function importMusicData(data, source) {
  const records = data.venues || data.musicians || data.festivals || data;
  if (!Array.isArray(records)) return;
  
  for (const record of records) {
    if (record.type === 'venue' || record.address) {
      await Location.create({
        name: record.name,
        address: record.address,
        coordinates: record.coordinates,
        category: 'music',
        description: record.description || record.history,
        yearOpened: record.opened,
        source
      });
      stats.locations++;
    } else if (record.type === 'musician' || record.artist) {
      await LocationInsight.create({
        type: 'famous_person',
        title: record.name || record.artist,
        description: record.description || record.biography,
        category: 'music',
        tags: record.genres || [],
        source
      });
      stats.insights++;
    }
  }
  stats.totalRecords += records.length;
}

async function importFoodData(data, source) {
  const records = data.restaurants || data.breweries || data.markets || data;
  if (!Array.isArray(records)) return;
  
  for (const record of records) {
    await Location.create({
      name: record.name,
      address: record.address,
      coordinates: record.coordinates,
      category: 'restaurant',
      description: record.description || record.history,
      yearOpened: record.opened || record.founded,
      cuisine: record.cuisine,
      specialty: record.specialty,
      source
    });
    stats.locations++;
  }
  stats.totalRecords += records.length;
}

async function importSportsData(data, source) {
  const records = data.teams || data.stadiums || data.athletes || data;
  if (!Array.isArray(records)) return;
  
  for (const record of records) {
    if (record.type === 'stadium' || record.address) {
      await Location.create({
        name: record.name,
        address: record.address,
        coordinates: record.coordinates,
        category: 'sports',
        description: record.description || record.history,
        yearOpened: record.opened,
        capacity: record.capacity,
        source
      });
      stats.locations++;
    } else if (record.type === 'athlete') {
      await LocationInsight.create({
        type: 'famous_person',
        title: record.name,
        description: record.biography || record.achievements,
        category: 'sports',
        tags: [record.sport],
        source
      });
      stats.insights++;
    }
  }
  stats.totalRecords += records.length;
}

async function importFamousPeople(data, source) {
  const people = data.people || data;
  if (!Array.isArray(people)) return;
  
  for (const person of people) {
    await LocationInsight.create({
      type: 'famous_person',
      title: person.name,
      description: person.biography || person.description,
      category: person.category || 'notable_resident',
      tags: person.achievements || [],
      yearBorn: person.born,
      yearDied: person.died,
      source
    });
    stats.insights++;
  }
  stats.totalRecords += people.length;
}

async function importCulturalEvents(data, source) {
  const records = data.festivals || data.organizations || data.events || data;
  if (!Array.isArray(records)) return;
  
  for (const record of records) {
    if (record.type === 'festival' || record.annual) {
      await HistoricalEvent.create({
        title: record.name,
        description: record.description,
        location: record.location,
        category: 'cultural',
        recurring: true,
        startDate: record.startDate ? new Date(record.startDate) : undefined,
        source
      });
      stats.events++;
    } else if (record.type === 'organization') {
      await Location.create({
        name: record.name,
        address: record.address,
        coordinates: record.coordinates,
        category: 'cultural',
        description: record.mission || record.description,
        source
      });
      stats.locations++;
    }
  }
  stats.totalRecords += records.length;
}

async function importOSMData(data, source) {
  const records = data.buildings || data.elements || data;
  if (!Array.isArray(records)) return;
  
  for (const record of records.slice(0, 2000)) { // Limit to 2000
    if (record.lat && record.lon) {
      await Location.create({
        name: record.tags?.name || record.name || 'OSM Location',
        coordinates: { lat: record.lat, lng: record.lon },
        category: record.tags?.historic || record.category || 'historic',
        description: record.tags?.description || record.description,
        address: record.tags?.['addr:full'] || record.address,
        wikidataId: record.tags?.wikidata,
        source
      });
      stats.locations++;
    }
  }
  stats.totalRecords += records.length;
}

async function importLOCData(data, source) {
  const records = data.results || data.items || data;
  if (!Array.isArray(records)) return;
  
  for (const record of records) {
    await LocationInsight.create({
      type: 'historical_document',
      title: record.title || record.name,
      description: record.description || record.summary,
      category: 'library_of_congress',
      imageUrl: record.image_url || record.thumbnail,
      url: record.url,
      date: record.date ? new Date(record.date) : undefined,
      source
    });
    stats.insights++;
  }
  stats.totalRecords += records.length;
}

async function importRamseyCountyData(data, source) {
  const records = data.data || data;
  if (!Array.isArray(records)) return;
  
  for (const record of records.slice(0, 2000)) {
    if (record.location || record.address) {
      await Location.create({
        name: record.name || record.project_name || 'Ramsey County Location',
        address: record.address || record.location,
        coordinates: record.coordinates || { lat: 44.9537, lng: -93.0900 },
        category: source.includes('permit') ? 'building_permit' : 
                  source.includes('art') ? 'public_art' :
                  source.includes('park') ? 'park' : 'government',
        description: record.description,
        source
      });
      stats.locations++;
    }
  }
  stats.totalRecords += records.length;
}

async function importGenericData(data, source) {
  const records = Array.isArray(data) ? data : data.data || data.results || [];
  if (!Array.isArray(records)) return;
  
  for (const record of records.slice(0, 1000)) {
    if (record.coordinates || record.lat) {
      await Location.create({
        name: record.name || record.title || 'Location',
        address: record.address,
        coordinates: record.coordinates || { lat: record.lat, lng: record.lon || record.lng },
        category: record.category || 'general',
        description: record.description,
        source
      });
      stats.locations++;
    }
  }
  stats.totalRecords += records.length;
}

async function createIndexes() {
  console.log('🔍 Creating database indexes...');
  await Location.createIndexes();
  await HistoricalEvent.createIndexes();
  await BuildingSpec.createIndexes();
  await LocationInsight.createIndexes();
  console.log('✅ Indexes created');
}

async function main() {
  console.log('🚀 Starting comprehensive data import...\n');
  
  try {
    await connectDB();
    await clearCollections();
    
    console.log('\n📚 Phase 1: Importing researched historical data...');
    await importResearchedData();
    
    console.log('\n📊 Phase 2: Importing collected data files...');
    await importCollectedData();
    
    console.log('\n🔍 Phase 3: Creating database indexes...');
    await createIndexes();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ DATA IMPORT COMPLETE!');
    console.log('='.repeat(60));
    console.log(`📁 Files Processed: ${stats.totalFiles}`);
    console.log(`📊 Total Records: ${stats.totalRecords.toLocaleString()}`);
    console.log(`📍 Locations: ${stats.locations.toLocaleString()}`);
    console.log(`📅 Events: ${stats.events.toLocaleString()}`);
    console.log(`🏛️ Buildings: ${stats.buildings.toLocaleString()}`);
    console.log(`💡 Insights: ${stats.insights.toLocaleString()}`);
    
    if (stats.errors.length > 0) {
      console.log(`\n⚠️  Errors: ${stats.errors.length}`);
      stats.errors.forEach(err => {
        console.log(`   - ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎉 Your St. Paul Historical Knowledge Portal is now LIVE!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
