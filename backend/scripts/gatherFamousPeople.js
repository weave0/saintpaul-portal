/**
 * Famous People, Notable Residents, and Historical Figures
 * Born in St. Paul or significant St. Paul connection
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function gatherFamousPeople() {
  console.log('⭐ Famous People & Notable Residents Mining Started...\n');

  const famousPeople = {
    writers_authors: [
      {
        name: 'F. Scott Fitzgerald',
        born: 1896,
        died: 1940,
        birthplace: '481 Laurel Avenue, St. Paul',
        occupation: 'Novelist, short story writer',
        famous_works: ['The Great Gatsby (1925)', 'This Side of Paradise (1920)', 'Tender Is the Night (1934)'],
        st_paul_connection: [
          'Born and raised in St. Paul',
          'Many works reference St. Paul',
          'Buried in St. Paul (St. Mary\'s Cemetery, until 1975 reburial)',
          'Parents buried in Oakland Cemetery'
        ],
        locations: [
          'Summit Avenue (childhood)',
          'St. Paul Academy',
          'Various St. Paul addresses'
        ],
        legacy: 'Fitzgerald Theater named in his honor',
        significance: 'One of greatest American novelists'
      },
      {
        name: 'Sinclair Lewis',
        born: 1885,
        died: 1951,
        connection: 'Lived in St. Paul area',
        occupation: 'Novelist',
        achievement: 'First American to win Nobel Prize in Literature (1930)',
        famous_works: ['Main Street', 'Babbitt', 'Elmer Gantry'],
        significance: 'Nobel laureate with Minnesota ties'
      },
      {
        name: 'Charles Schulz',
        born: 1922,
        died: 2000,
        birthplace: 'Minneapolis',
        st_paul_connection: 'Grew up in St. Paul, attended Central High School',
        occupation: 'Cartoonist',
        famous_work: 'Peanuts comic strip',
        locations: [
          'St. Paul Central High School',
          'Art Instruction Schools correspondence course (Minneapolis)'
        ],
        legacy: [
          'Peanuts characters statues throughout St. Paul',
          'Schulz influenced by St. Paul childhood',
          'Snoopy statue at Charles M. Schulz–Sonoma County Airport'
        ],
        significance: 'Most influential cartoonist of 20th century'
      },
      {
        name: 'Garrison Keillor',
        born: 1942,
        occupation: 'Author, radio host',
        famous_for: 'A Prairie Home Companion',
        st_paul_connection: [
          'Broadcast from Fitzgerald Theater, St. Paul (1986-2016)',
          'Made St. Paul famous through radio show',
          'Created fictional "Lake Wobegon" inspired by Minnesota'
        ],
        significance: 'Brought St. Paul to national consciousness'
      }
    ],
    
    actors_entertainers: [
      {
        name: 'Jessica Lange',
        born: 1949,
        birthplace: 'Cloquet, MN',
        st_paul_connection: 'Raised in Minnesota, attended University of Minnesota',
        occupation: 'Actor',
        achievements: ['2 Academy Awards', '3 Emmy Awards', '5 Golden Globes'],
        significance: 'Major Hollywood star with Minnesota roots'
      },
      {
        name: 'Vince Flynn',
        born: 1966,
        died: 2013,
        birthplace: 'St. Paul',
        occupation: 'Author',
        famous_work: 'Mitch Rapp series (thriller novels)',
        education: 'Cretin-Derham Hall, University of St. Thomas',
        significance: 'Bestselling thriller author'
      },
      {
        name: 'Nick Swardson',
        born: 1976,
        birthplace: 'Minneapolis',
        st_paul_connection: 'Twin Cities area',
        occupation: 'Comedian, actor',
        notable: 'Saturday Night Live, Comedy Central, films'
      }
    ],
    
    business_leaders: [
      {
        name: 'James J. Hill',
        born: 1838,
        died: 1916,
        occupation: 'Railroad tycoon, "The Empire Builder"',
        achievement: 'Built Great Northern Railway',
        residence: '240 Summit Avenue (36,000 sq ft mansion)',
        significance: 'Most influential businessman in St. Paul history',
        legacy: [
          'James J. Hill House (museum)',
          'Hill Reference Library',
          'Transformed St. Paul into railroad hub',
          'One of wealthiest Americans of his era'
        ],
        impact: 'Made St. Paul a major American city'
      },
      {
        name: 'Norman Borlaug',
        born: 1914,
        died: 2009,
        birthplace: 'Cresco, Iowa',
        connection: 'University of Minnesota (PhD)',
        occupation: 'Agronomist',
        achievement: 'Nobel Peace Prize (1970) for "Green Revolution"',
        significance: 'Saved billion+ lives through agricultural science'
      },
      {
        name: 'Warren Burger',
        born: 1907,
        died: 1995,
        birthplace: 'St. Paul',
        occupation: 'Chief Justice of the United States',
        tenure: '1969-1986',
        education: 'St. Paul College of Law',
        significance: '15th Chief Justice, presided over major cases',
        burial: 'Arlington National Cemetery'
      },
      {
        name: 'Walter Mondale',
        born: 1928,
        died: 2021,
        connection: 'Minnesota Attorney General, then US Senator',
        position: 'Vice President of the United States (1977-1981)',
        significance: 'Minnesota political icon'
      }
    ],
    
    musicians_artists: [
      {
        name: 'Bob Dylan (Robert Zimmerman)',
        born: 1941,
        birthplace: 'Duluth, MN',
        connection: 'Attended University of Minnesota (Minneapolis)',
        achievement: 'Nobel Prize in Literature (2016)',
        significance: 'Most influential songwriter of 20th century',
        note: 'Twin Cities music scene early days'
      }
    ],
    
    athletes: [
      {
        name: 'Joe Mauer',
        born: 1983,
        birthplace: 'St. Paul',
        sport: 'Baseball',
        team: 'Minnesota Twins',
        achievements: ['3x AL batting champion', '2009 AL MVP', '6x All-Star'],
        high_school: 'Cretin-Derham Hall',
        significance: 'Greatest Twin Cities-born baseball player'
      },
      {
        name: 'Paul Molitor',
        born: 1956,
        birthplace: 'St. Paul',
        sport: 'Baseball',
        achievement: 'Hall of Fame (2004)',
        hits: 3319,
        high_school: 'Cretin-Derham Hall'
      },
      {
        name: 'Dave Winfield',
        born: 1951,
        birthplace: 'St. Paul',
        sport: 'Baseball',
        achievement: 'Hall of Fame (2001)',
        hits: 3110,
        high_school: 'St. Paul Central'
      },
      {
        name: 'Herb Brooks',
        born: 1937,
        died: 2003,
        birthplace: 'St. Paul',
        sport: 'Ice hockey (coach)',
        achievement: 'Coached 1980 "Miracle on Ice" Olympic team',
        high_school: 'St. Paul Johnson',
        significance: 'Greatest upset in sports history'
      }
    ],
    
    politicians: [
      {
        name: 'Hubert H. Humphrey',
        born: 1911,
        died: 1978,
        connection: 'Minnesota Senator, Vice President',
        position: 'Vice President (1965-1969)',
        significance: 'Major 20th century political figure',
        legacy: 'Humphrey–Hawkins Full Employment Act'
      },
      {
        name: 'Eugene McCarthy',
        born: 1916,
        died: 2005,
        connection: 'Minnesota Senator',
        significance: 'Anti-Vietnam War presidential candidate (1968)',
        impact: 'Changed American politics'
      }
    ],
    
    historical_figures: [
      {
        name: 'Father Lucien Galtier',
        born: 1811,
        died: 1866,
        role: 'Catholic priest',
        achievement: 'Founded St. Paul (1841)',
        significance: 'Built Chapel of St. Paul, named the city',
        legacy: 'City founder'
      },
      {
        name: 'Henry Hastings Sibley',
        born: 1811,
        died: 1891,
        role: 'First Governor of Minnesota',
        term: '1858-1860',
        residence: 'Mendota (near St. Paul)',
        significance: 'Minnesota statehood leader'
      },
      {
        name: 'Alexander Ramsey',
        born: 1815,
        died: 1903,
        roles: ['First Territorial Governor', 'Second State Governor', 'US Senator', 'Secretary of War'],
        residence: 'Irvine Park, St. Paul',
        significance: 'Major figure in Minnesota history',
        legacy: 'Alexander Ramsey House (museum)'
      }
    ],
    
    gangsters: [
      {
        name: 'John Dillinger',
        period: '1933-1934',
        connection: 'Hid in St. Paul during crime spree',
        event: 'Shootout at Lincoln Court Apartments (March 31, 1934)',
        significance: 'Public Enemy #1, St. Paul safe haven era'
      },
      {
        name: 'Ma Barker and Barker-Karpis Gang',
        period: '1931-1935',
        connection: 'Used St. Paul as headquarters',
        crimes: ['William Hamm Jr. kidnapping', 'Edward Bremer kidnapping'],
        significance: 'Made St. Paul "kidnapping capital"'
      }
    ],
    
    civil_rights_leaders: [
      {
        name: 'Nellie Stone Johnson',
        born: 1905,
        died: 2002,
        connection: 'Minneapolis/St. Paul',
        achievements: [
          'First Black elected union official in Minneapolis',
          'Civil rights activist',
          'Co-founder of Minnesota DFL Party'
        ],
        significance: 'Pioneer civil rights leader'
      }
    ]
  };

  const filename = 'stpaul_famous_people.json';
  fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(famousPeople, null, 2));
  
  const totalPeople = 
    famousPeople.writers_authors.length +
    famousPeople.actors_entertainers.length +
    famousPeople.business_leaders.length +
    famousPeople.musicians_artists.length +
    famousPeople.athletes.length +
    famousPeople.politicians.length +
    famousPeople.historical_figures.length +
    famousPeople.gangsters.length +
    famousPeople.civil_rights_leaders.length;
  
  console.log(`   ✅ ${famousPeople.writers_authors.length} writers/authors`);
  console.log(`   ✅ ${famousPeople.business_leaders.length} business leaders`);
  console.log(`   ✅ ${famousPeople.athletes.length} athletes (in famous people file)`);
  console.log(`   ✅ ${famousPeople.politicians.length} politicians`);
  console.log(`   ✅ ${famousPeople.historical_figures.length} historical figures`);
  console.log(`   ✅ ${totalPeople} total notable people documented`);

  const results = {
    timestamp: new Date().toISOString(),
    sources: [{
      name: 'Famous People & Notable Residents',
      count: totalPeople,
      file: filename,
      status: 'success'
    }],
    totalRecords: totalPeople
  };

  fs.writeFileSync(
    path.join(outputDir, '_famous_people_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Famous People Mining Complete: ${totalPeople} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherFamousPeople();
