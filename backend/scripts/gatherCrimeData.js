/**
 * Crime Statistics and Historical Crime Data Collector
 * St. Paul Police data, FBI stats, historical crime records
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function gatherCrimeData() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: [],
    totalRecords: 0
  };

  console.log('🚔 Crime Statistics & History Mining Started...\n');

  // St. Paul Police Incident Reports (Open Data)
  try {
    console.log('📊 Fetching St. Paul Police Incident Data...');
    
    const response = await axios.get('https://information.stpaul.gov/resource/gppf-fdfq.json', {
      params: {
        $limit: 10000,
        $order: 'date DESC'
      },
      timeout: 30000
    });
    
    const filename = 'stpaul_police_incidents.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} police incident records`);
    
    results.sources.push({
      name: 'St. Paul Police Incidents',
      count: response.data.length,
      file: filename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Police incidents failed: ${error.message}`);
    results.sources.push({
      name: 'St. Paul Police Incidents',
      status: 'failed',
      error: error.message
    });
  }

  // St. Paul Crime Grid Statistics
  try {
    console.log('🗺️  Fetching Crime Grid Statistics...');
    
    const response = await axios.get('https://information.stpaul.gov/resource/n4e9-kyhq.json', {
      params: {
        $limit: 5000
      },
      timeout: 20000
    });
    
    const filename = 'stpaul_crime_grid.json';
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(response.data, null, 2));
    
    console.log(`   ✅ ${response.data.length} crime grid records`);
    
    results.sources.push({
      name: 'Crime Grid Statistics',
      count: response.data.length,
      file: filename,
      status: 'success'
    });
    results.totalRecords += response.data.length;

  } catch (error) {
    console.log(`   ❌ Crime grid failed: ${error.message}`);
    results.sources.push({
      name: 'Crime Grid Statistics',
      status: 'failed',
      error: error.message
    });
  }

  // Historical Crime Data (Manually Researched)
  const historicalCrime = {
    prohibition_era: {
      period: '1920-1933',
      significance: 'St. Paul Agreement - safe haven for gangsters',
      description: 'Under corrupt police chief John "The Big Fellow" O\'Connor, St. Paul became a safe haven for criminals who agreed not to commit crimes within city limits',
      notable_criminals: [
        {
          name: 'John Dillinger',
          active: '1933-1934',
          locations: ['Lincoln Court Apartments', 'Green Lantern Saloon'],
          events: ['Dillinger gang shootout at Lincoln Court (March 31, 1934)'],
          arrested: true,
          date: 'March 31, 1934',
          location: '93 South Lexington Parkway'
        },
        {
          name: 'Ma Barker and the Barker-Karpis Gang',
          active: '1931-1935',
          locations: ['Commodore Hotel', 'Various apartments'],
          crimes: ['William Hamm Jr. kidnapping (1933)', 'Edward Bremer kidnapping (1934)'],
          ransom: 200000,
          description: 'Used St. Paul as planning headquarters for kidnappings and bank robberies'
        },
        {
          name: 'Baby Face Nelson',
          active: '1933-1934',
          locations: ['Various St. Paul safe houses'],
          description: 'Frequently used St. Paul as hideout between robberies'
        },
        {
          name: 'Alvin "Creepy" Karpis',
          active: '1931-1936',
          locations: ['Grand Avenue area'],
          description: 'Key member of Barker-Karpis gang, operated from St. Paul',
          captured: 1936,
          fbi_most_wanted: true
        },
        {
          name: 'Leon Gleckman',
          role: 'Mob boss',
          active: '1920s-1930s',
          description: 'St. Paul\'s most powerful bootlegger and gangster coordinator',
          operations: ['Bootlegging', 'Gambling', 'Prostitution']
        }
      ],
      locations: [
        {
          name: 'Hollyhocks Club',
          address: 'White Bear Lake',
          description: 'Illegal casino and nightclub frequented by gangsters',
          operated: '1925-1933'
        },
        {
          name: 'Green Lantern Saloon',
          address: 'Wabasha Street',
          description: 'Gangster meeting place, owned by Harry Sawyer',
          significance: 'Planning headquarters for kidnappings'
        },
        {
          name: 'Lincoln Court Apartments',
          address: '93 South Lexington Parkway',
          significance: 'Site of John Dillinger shootout',
          date: 'March 31, 1934',
          historical_marker: true
        }
      ],
      end_of_era: {
        event: 'William Hamm Jr. kidnapping',
        date: 'June 15, 1933',
        significance: 'FBI involvement ended "St. Paul System"',
        result: 'Federal crackdown on organized crime in St. Paul'
      }
    },
    notable_cases: [
      {
        case: 'James-Younger Gang',
        year: 1876,
        event: 'Northfield Raid aftermath',
        description: 'Gang members fled through Minnesota after failed Northfield bank robbery',
        connection: 'Some members had St. Paul connections'
      },
      {
        case: 'St. Paul Police Corruption Scandal',
        year: 1935,
        description: 'Massive corruption revealed in police department',
        result: 'Department reorganization, end of "O\'Connor System"'
      }
    ],
    crime_statistics_historical: {
      homicide_rate_1930s: 'Among highest in nation during gangster era',
      kidnapping_capital: 'Called "Kidnapping Capital of America" 1931-1936',
      bootlegging: 'Major distribution hub for illegal alcohol'
    }
  };

  const crimeHistoryFile = 'stpaul_historical_crime.json';
  fs.writeFileSync(path.join(outputDir, crimeHistoryFile), JSON.stringify(historicalCrime, null, 2));
  
  console.log('   ✅ Historical crime data compiled (Prohibition era, gangsters)');
  
  results.sources.push({
    name: 'Historical Crime Data',
    count: 1,
    file: crimeHistoryFile,
    status: 'success',
    note: 'Prohibition-era gangster history, notable criminals, locations'
  });
  results.totalRecords += 1;

  // Save summary
  fs.writeFileSync(
    path.join(outputDir, '_crime_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Crime Data Mining Complete: ${results.totalRecords} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherCrimeData().catch(console.error);
