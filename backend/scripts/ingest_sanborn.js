/**
 * Sanborn Fire Insurance Map metadata ingestion.
 * Uses Library of Congress API to list Saint Paul, Minnesota map items.
 * Each item may correspond to a volume or sheet containing building footprints.
 * This script produces a metadata index; manual or OCR extraction of footprints
 * requires downloading high-resolution TIFF/JPEG assets separately.
 * Usage: node scripts/ingest_sanborn.js sanborn-index.json
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// LOC API query (JSON) - filter Saint Paul Minnesota within Sanborn collection
// The 'fo=json' ensures JSON output; 'at=results' optional for pagination.
const LOC_URL = 'https://www.loc.gov/collections/sanborn-maps/?fa=location:minnesota|city:saint+paul&fo=json';

async function fetchAllPages() {
  let page = 1;
  const items = [];
  while (true) {
    const url = `${LOC_URL}&sp=${page}`; // sp = page number
    const { data } = await axios.get(url, { timeout: 20000 });
    if (!data || !data.results || data.results.length === 0) break;
    data.results.forEach(r => {
      items.push({
        title: r.title,
        date: r.date,
        id: r.id,
        locUrl: r.url,
        description: r.description,
        subjects: r.subjects,
        pdf: r.formats?.find(f => /pdf/i.test(f)) ? r.url + '?download=1' : null,
        // Potential image access - some items include image resources; further calls needed for assets
        access: r.access_restrictions || null
      });
    });
    console.log(`Fetched page ${page}, cumulative items: ${items.length}`);
    page += 1;
    if (page > 10) break; // safeguard limit; adjust as needed
  }
  return items;
}

async function run() {
  const output = process.argv[2] || 'sanborn-index.json';
  try {
    const items = await fetchAllPages();
    const index = {
      fetchedAt: new Date().toISOString(),
      count: items.length,
      source: 'Library of Congress Sanborn Maps Collection',
      query: LOC_URL,
      items
    };
    fs.writeFileSync(path.join(process.cwd(), output), JSON.stringify(index, null, 2));
    console.log('Sanborn metadata ingestion complete:', output);
  } catch (e) {
    console.error('Sanborn ingestion failed:', e.message);
    process.exit(1);
  }
}

run();
