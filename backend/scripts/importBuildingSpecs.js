/**
 * Bulk import BuildingSpec documents from JSON file.
 * Usage: node scripts/importBuildingSpecs.js ../data/building-specs-sample.json
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const BuildingSpec = require('../models/BuildingSpec');

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
}

function toGeoPolygon(footprint) {
  if (!Array.isArray(footprint) || footprint.length < 4) return null;
  // Ensure closed ring
  const ring = footprint.slice();
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
  return { type: 'Polygon', coordinates: [ring] };
}

async function run() {
  const file = process.argv[2];
  if (!file) {
    console.error('Provide path to specs JSON.');
    process.exit(1);
  }
  await connect();
  const raw = JSON.parse(fs.readFileSync(path.resolve(file), 'utf-8'));
  const items = raw.items || [];
  let inserted = 0;
  for (const item of items) {
    const existing = await BuildingSpec.findOne({ name: item.name });
    if (existing) {
      console.log('Skip existing:', item.name);
      continue;
    }
    const doc = new BuildingSpec({
      name: item.name,
      centroid: item.centroid,
      footprint: item.footprint,
      footprintGeo: toGeoPolygon(item.footprint),
      dimensions: item.dimensions,
      height: item.height,
      materials: item.materials,
      roof: item.roof,
      architecturalStyle: item.architecturalStyle,
      architect: item.architect,
      engineer: item.engineer,
      builder: item.builder,
      yearDesigned: item.yearDesigned,
      yearConstructed: item.yearConstructed,
      yearCompleted: item.yearCompleted,
      alterations: item.alterations,
      status: item.status,
      sources: item.sources,
      dataQuality: item.dataQuality,
      revision: item.revision
    });
    await doc.save();
    inserted++;
    console.log('Inserted:', item.name);
  }
  console.log(`Import complete. Inserted ${inserted} new specs.`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
