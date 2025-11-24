/**
 * Cultural Events, Festivals & Arts Organizations Scraper
 * Current and historical cultural data
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function gatherCulturalData() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: [],
    totalRecords: 0
  };

  console.log('🎭 Cultural Events & Arts Data Mining Started...\n');

  // Manual compilation of St. Paul festivals & cultural events
  const festivals = {
    annual_events: [
      {
        name: 'St. Paul Winter Carnival',
        founded: 1886,
        description: 'America\'s oldest and largest winter festival',
        duration: '10 days in late January/early February',
        attendance: 350000,
        signature_events: [
          'Ice Palace construction',
          'Vulcan Victory torchlight parade',
          'King Boreas Grande Day Parade',
          'Ice sculpture competition',
          'Medallion treasure hunt'
        ],
        historical_significance: 'Created to prove St. Paul was habitable in winter, counter to New York reporter\'s claim it was "another Siberia"',
        website: 'https://www.winter-carnival.com'
      },
      {
        name: 'Grand Old Day',
        founded: 1977,
        description: 'Grand Avenue street festival',
        duration: 'First Sunday in June',
        attendance: 250000,
        location: 'Grand Avenue (Summit-Fairview to Dale Street)',
        features: ['Live music', 'Food vendors', '150+ booths', 'Parade'],
        website: 'https://grandave.com/grand-old-day'
      },
      {
        name: 'Minnesota State Fair',
        founded: 1859,
        description: 'One of largest state fairs in USA',
        location: 'Minnesota State Fairgrounds, St. Paul',
        duration: '12 days ending Labor Day',
        annual_attendance: 2000000,
        nickname: 'The Great Minnesota Get-Together',
        famous_for: ['Food on a stick', 'Agriculture exhibits', 'Butter sculptures', 'Live music'],
        website: 'https://www.mnstatefair.org'
      },
      {
        name: 'Hmong New Year',
        founded: 1980,
        description: 'Largest Hmong New Year celebration outside Asia',
        duration: 'November/December (varies)',
        location: 'RiverCentre',
        attendance: 60000,
        features: ['Traditional ball-tossing ceremonies', 'Fashion shows', 'Cultural performances', 'Vendor marketplace'],
        significance: 'Celebrates largest urban Hmong population in USA'
      },
      {
        name: 'Twin Cities Pride',
        founded: 1972,
        description: 'Largest LGBTQ+ pride festival in Upper Midwest',
        duration: 'June',
        attendance: 400000,
        events: ['Pride Parade', 'Ashley Rukes GLBT Pride Festival', 'Concerts', 'Drag shows'],
        location: 'Loring Park (Minneapolis) with St. Paul events'
      },
      {
        name: 'Cinco de Mayo West Side',
        founded: 1933,
        description: 'Historic Mexican-American celebration',
        location: 'West Side (District del Sol)',
        duration: 'First weekend in May',
        attendance: 100000,
        features: ['Parade', 'Music', 'Food', 'Cultural performances'],
        significance: 'One of oldest Cinco de Mayo celebrations in USA'
      },
      {
        name: 'Rondo Days',
        founded: 1983,
        description: 'Celebration of historic African American Rondo neighborhood',
        duration: 'Third Saturday in July',
        location: 'Rondo Avenue (destroyed by I-94 construction in 1960s)',
        purpose: 'Remember and celebrate displaced Rondo community',
        features: ['Parade', 'Music', 'Food', 'Historical exhibits']
      },
      {
        name: 'Saint Paul Art Crawl',
        founded: 1991,
        description: 'Artists open studios to public',
        frequency: 'Twice yearly (Spring & Fall)',
        duration: '3 days',
        participation: '300+ artists',
        location: 'Lowertown Arts District',
        website: 'https://www.artcrawl.org'
      },
      {
        name: 'Flint Hills International Children\'s Festival',
        founded: 1988,
        description: 'Performing arts festival for families',
        duration: '3 days in June',
        location: 'Ordway Center for Performing Arts',
        features: ['Theater', 'Dance', 'Music', 'Interactive art'],
        attendance: 15000
      }
    ],
    arts_organizations: [
      {
        name: 'Ordway Center for Performing Arts',
        founded: 1985,
        type: 'Performing arts center',
        location: '345 Washington St',
        programs: ['Minnesota Opera', 'The Saint Paul Chamber Orchestra', 'Broadway shows'],
        annual_attendance: 250000
      },
      {
        name: 'Minnesota Museum of American Art',
        founded: 1894,
        type: 'Art museum',
        focus: 'American art, regional artists',
        significance: 'Oldest art museum in Minnesota'
      },
      {
        name: 'Penumbra Theatre',
        founded: 1976,
        type: 'African American theater company',
        significance: 'Largest African American theater in Minnesota',
        notable: 'August Wilson premiered plays here'
      },
      {
        name: 'History Theatre',
        founded: 1978,
        type: 'Regional theater',
        focus: 'Minnesota and regional history stories',
        location: '30 E 10th St'
      },
      {
        name: 'Public Art Saint Paul',
        founded: 2014,
        type: 'Public art organization',
        mission: 'Commission and maintain public art',
        notable_works: ['Cloud Ceiling (Union Depot)', 'Peanuts statues citywide']
      },
      {
        name: 'Schubert Club',
        founded: 1882,
        type: 'Musical arts organization',
        significance: 'Oldest arts organization in Minnesota',
        programs: ['Keyboard instrument museum', 'Concerts', 'Education']
      }
    ],
    cultural_districts: [
      {
        name: 'Lowertown Arts District',
        established: 1980,
        description: 'Former warehouse district converted to artist lofts',
        features: ['300+ artist live/work spaces', 'Art galleries', 'Restaurants', 'Art Crawl events'],
        landmarks: ['Northern Warehouse', 'Traffic Zone Center for Visual Art']
      },
      {
        name: 'West 7th Arts & Cultural Corridor',
        description: 'Emerging arts district',
        features: ['Public art installations', 'Artist studios', 'Cultural venues']
      },
      {
        name: 'District del Sol',
        location: 'West Side',
        description: 'Latino cultural and commercial district',
        features: ['Mercado Central', 'Latino-owned businesses', 'Cultural festivals'],
        murals: 'Extensive public murals celebrating Mexican-American heritage'
      }
    ],
    historical_venues: [
      {
        name: 'Fitzgerald Theater',
        built: 1910,
        original_name: 'Sam S. Shubert Theater',
        renamed: 1994,
        significance: 'Home of A Prairie Home Companion (1986-2016)',
        capacity: 1000,
        nrhp: true
      },
      {
        name: 'Palace Theatre',
        built: 1916,
        type: 'Vaudeville theater',
        current_use: 'Live music venue',
        capacity: 2500
      },
      {
        name: 'Landmark Center',
        built: 1902,
        original_use: 'Federal Courts Building',
        current_use: 'Cultural center with 5 arts organizations',
        features: ['Concert hall', 'Galleries', 'Historic courtrooms']
      }
    ]
  };

  const filename = 'stpaul_cultural_events_festivals.json';
  fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(festivals, null, 2));
  
  const totalEvents = festivals.annual_events.length + 
                      festivals.arts_organizations.length + 
                      festivals.cultural_districts.length + 
                      festivals.historical_venues.length;
  
  console.log(`   ✅ ${festivals.annual_events.length} annual festivals documented`);
  console.log(`   ✅ ${festivals.arts_organizations.length} arts organizations cataloged`);
  console.log(`   ✅ ${festivals.cultural_districts.length} cultural districts mapped`);
  console.log(`   ✅ ${festivals.historical_venues.length} historical venues recorded`);
  
  results.sources.push({
    name: 'St. Paul Cultural Events & Festivals',
    count: totalEvents,
    file: filename,
    status: 'success'
  });
  results.totalRecords += totalEvents;

  // Try to get events from St. Paul Open Data
  try {
    console.log('📅 Fetching St. Paul Events...');
    
    const response = await axios.get('https://information.stpaul.gov/resource/gk4x-6db7.json', {
      params: {
        $limit: 500
      },
      timeout: 15000
    });
    
    const eventsFilename = 'stpaul_events_data.json';
    fs.writeFileSync(path.join(outputDir, eventsFilename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} events from St. Paul data`);
    
    results.sources.push({
      name: 'St. Paul Events Data',
      count: response.data.length,
      file: eventsFilename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Events data failed: ${error.message}`);
    results.sources.push({
      name: 'St. Paul Events Data',
      status: 'failed',
      error: error.message
    });
  }

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, '_cultural_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Cultural Data Mining Complete: ${results.totalRecords} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherCulturalData().catch(console.error);
