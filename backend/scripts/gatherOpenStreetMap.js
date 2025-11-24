/**
 * OpenStreetMap & Geographic Data Miner
 * Current and historical geographic data about St. Paul
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// St. Paul bounding box
const STPAUL_BBOX = {
  south: 44.8944,
  west: -93.2300,
  north: 45.0100,
  east: -93.0350
};

async function gatherGeoData() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: [],
    totalRecords: 0
  };

  console.log('🗺️  Geographic Data Mining Started...\n');

  // OpenStreetMap Overpass API - Historic Buildings
  try {
    console.log('🏛️  Fetching OSM Historic Buildings...');
    
    const query = `
      [out:json][timeout:25];
      (
        node["historic"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        way["historic"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        relation["historic"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000
    });
    
    const filename = 'osm_historic_buildings.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.elements?.length || 0;
    console.log(`   ✅ ${count} historic buildings from OSM`);
    
    results.sources.push({
      name: 'OSM Historic Buildings',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ OSM Historic Buildings failed: ${error.message}`);
    results.sources.push({
      name: 'OSM Historic Buildings',
      status: 'failed',
      error: error.message
    });
  }

  // OpenStreetMap - Tourism/Attractions
  try {
    console.log('🎭 Fetching OSM Tourism & Attractions...');
    
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        way["tourism"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        node["amenity"="place_of_worship"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        way["amenity"="place_of_worship"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000
    });
    
    const filename = 'osm_tourism_attractions.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.elements?.length || 0;
    console.log(`   ✅ ${count} tourism/attraction points from OSM`);
    
    results.sources.push({
      name: 'OSM Tourism & Attractions',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ OSM Tourism failed: ${error.message}`);
    results.sources.push({
      name: 'OSM Tourism & Attractions',
      status: 'failed',
      error: error.message
    });
  }

  // OpenStreetMap - Art & Culture
  try {
    console.log('🎨 Fetching OSM Arts & Culture...');
    
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="arts_centre"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        node["amenity"="theatre"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        node["amenity"="library"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        node["tourism"="museum"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        node["tourism"="gallery"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        way["amenity"~"arts_centre|theatre|library"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
        way["tourism"~"museum|gallery"](${STPAUL_BBOX.south},${STPAUL_BBOX.west},${STPAUL_BBOX.north},${STPAUL_BBOX.east});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000
    });
    
    const filename = 'osm_arts_culture.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.elements?.length || 0;
    console.log(`   ✅ ${count} arts/culture venues from OSM`);
    
    results.sources.push({
      name: 'OSM Arts & Culture',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ OSM Arts/Culture failed: ${error.message}`);
    results.sources.push({
      name: 'OSM Arts & Culture',
      status: 'failed',
      error: error.message
    });
  }

  // Wikidata SPARQL - St. Paul entities
  try {
    console.log('📊 Fetching Wikidata St. Paul entities...');
    
    const sparqlQuery = `
      SELECT ?item ?itemLabel ?itemDescription ?coord ?image WHERE {
        ?item wdt:P131* wd:Q28848;  # Located in St. Paul
              wdt:P625 ?coord.       # Has coordinates
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      LIMIT 500
    `;
    
    const response = await axios.get('https://query.wikidata.org/sparql', {
      params: {
        query: sparqlQuery,
        format: 'json'
      },
      headers: {
        'User-Agent': 'StPaulHistoryBot/1.0',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    const filename = 'wikidata_stpaul.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    const count = response.data.results?.bindings?.length || 0;
    console.log(`   ✅ ${count} entities from Wikidata`);
    
    results.sources.push({
      name: 'Wikidata',
      count: count,
      file: filename,
      status: 'success'
    });
    results.totalRecords += count;

  } catch (error) {
    console.log(`   ❌ Wikidata failed: ${error.message}`);
    results.sources.push({
      name: 'Wikidata',
      status: 'failed',
      error: error.message
    });
  }

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, '_geo_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Geographic Data Mining Complete: ${results.totalRecords} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherGeoData().catch(console.error);
