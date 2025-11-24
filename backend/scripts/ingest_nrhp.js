/**
 * NRHP (National Register of Historic Places) ingestion script
 * Fetches Saint Paul MN listings and extracts architectural metadata.
 * NOTE: NPS site does not offer a clean JSON API; we perform HTML fetch + parse.
 * Usage: node scripts/ingest_nrhp.js output.json
 */
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_SEARCH = 'https://npgallery.nps.gov/NRHP/SearchResults';

async function fetchSearchPage(page = 1) {
  const params = {
    searchType: 'city',
    city: 'Saint Paul',
    state: 'MN',
    page
  };
  const url = `${BASE_SEARCH}?${Object.entries(params).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&')}`;
  const { data } = await axios.get(url);
  return data;
}

function parseListingLinks(html) {
  const $ = cheerio.load(html);
  const links = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('/NRHP/')) {
      const text = $(el).text().trim();
      if (text.length > 3) links.push({ href: 'https://npgallery.nps.gov' + href, title: text });
    }
  });
  // Deduplicate
  const map = new Map();
  links.forEach(l => map.set(l.href, l));
  return [...map.values()];
}

async function fetchDetail(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const title = $('h1').first().text().trim();
  const metaBlocks = {};
  $('.detail-table tr').each((_, tr) => {
    const key = $(tr).find('th').text().trim();
    const val = $(tr).find('td').text().trim();
    if (key) metaBlocks[key] = val;
  });
  // Attempt architecture parsing
  const architecture = metaBlocks['Architectural Style'] || metaBlocks['Architecture'];
  const yearBuilt = metaBlocks['Year Built'] || metaBlocks['Built'];
  const address = metaBlocks['Address'] || metaBlocks['Location'];
  return {
    source: 'NRHP',
    url,
    name: title,
    architecturalStyle: architecture || null,
    yearConstructed: yearBuilt ? Number(String(yearBuilt).match(/\d{4}/)) : undefined,
    address,
    rawMeta: metaBlocks
  };
}

async function run() {
  const output = process.argv[2] || 'nrhp-building-specs.json';
  const allDetails = [];
  for (let page = 1; page <= 3; page++) { // limit pages; adjustable
    try {
      const html = await fetchSearchPage(page);
      const links = parseListingLinks(html);
      for (const link of links) {
        try {
          const detail = await fetchDetail(link.href);
          allDetails.push(detail);
          console.log('Fetched:', detail.name);
        } catch (e) {
          console.warn('Detail fetch failed', link.href, e.message);
        }
      }
    } catch (e) {
      console.warn('Search page failed', page, e.message);
    }
  }
  fs.writeFileSync(path.join(process.cwd(), output), JSON.stringify({ fetchedAt: new Date().toISOString(), count: allDetails.length, items: allDetails }, null, 2));
  console.log('NRHP ingestion complete:', output);
}

run();
