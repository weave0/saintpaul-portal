/**
 * Merge NRHP and Sanborn source metadata into existing BuildingSpec records.
 * Assumes NRHP output file: nrhp-building-specs.json (items[] with name, architecturalStyle, yearConstructed)
 * Assumes Sanborn output file: sanborn-index.json (items[] with title, date)
 * Strategy:
 *  - Attempt fuzzy name match (case-insensitive) for NRHP entries to existing specs.
 *  - Append missing architecturalStyle/yearConstructed if absent.
 *  - Append Sanborn map source reference if spec year matches or earlier.
 * Usage: node scripts/mergeSourcesToSpecs.js ../nrhp-building-specs.json ../sanborn-index.json
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const BuildingSpec = require('../models/BuildingSpec');

async function connect() { await mongoose.connect(process.env.MONGODB_URI); }

function loadJSON(p) { return JSON.parse(fs.readFileSync(path.resolve(p), 'utf-8')); }

function normalizeName(n) { return n.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }

async function run() {
  const [nrhpPath, sanbornPath] = process.argv.slice(2);
  if (!nrhpPath || !sanbornPath) {
    console.error('Provide paths: nrhp-building-specs.json sanborn-index.json');
    process.exit(1);
  }
  await connect();
  const nrhp = loadJSON(nrhpPath).items || [];
  const sanborn = loadJSON(sanbornPath).items || [];
  const specs = await BuildingSpec.find({});
  const specMap = new Map();
  specs.forEach(s => specMap.set(normalizeName(s.name), s));

  let updatedCount = 0;
  for (const entry of nrhp) {
    const key = normalizeName(entry.name);
    const spec = specMap.get(key);
    if (!spec) continue;
    let changed = false;
    if (entry.architecturalStyle && !spec.architecturalStyle) {
      spec.architecturalStyle = entry.architecturalStyle;
      changed = true;
    }
    if (entry.yearConstructed && !spec.yearConstructed) {
      spec.yearConstructed = entry.yearConstructed;
      changed = true;
    }
    if (changed) {
      spec.sources.push({
        name: 'NRHP',
        year: entry.yearConstructed || undefined,
        url: entry.url,
        type: 'narrative',
        rawReference: 'NRHP Merge',
        confidence: 'high'
      });
      await spec.save();
      updatedCount++;
      console.log('Updated spec (NRHP merge):', spec.name);
    }
  }

  // Attach Sanborn references when year matches or sheet available around construction
  for (const spec of specs) {
    const year = spec.yearCompleted || spec.yearConstructed;
    if (!year) continue;
    const candidate = sanborn.find(s => s.date && Math.abs(Number(s.date) - Number(year)) <= 2);
    if (candidate && !spec.sources.some(src => src.name === 'Sanborn Fire Insurance Map' && src.year === Number(candidate.date))) {
      spec.sources.push({
        name: 'Sanborn Fire Insurance Map',
        year: Number(candidate.date),
        url: candidate.locUrl,
        type: 'map',
        rawReference: candidate.title,
        confidence: 'medium'
      });
      await spec.save();
      console.log('Attached Sanborn source to:', spec.name);
    }
  }

  console.log(`Merge complete. NRHP updates: ${updatedCount}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
