/**
 * Food Culture, Restaurants, and Culinary History
 * Historic restaurants, food traditions, breweries, cuisine
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../data/collected');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function gatherFoodHistory() {
  console.log('🍴 Food & Restaurant History Mining Started...\n');

  const foodCulture = {
    historic_restaurants: [
      {
        name: 'Mancini\'s Char House',
        address: '531 West 7th Street',
        opened: 1948,
        cuisine: 'Steakhouse',
        signature: 'Tableside Caesar salad, huge portions',
        significance: 'Classic St. Paul supper club atmosphere',
        status: 'Active',
        cultural_icon: true
      },
      {
        name: 'Mickey\'s Diner',
        address: '36 West 7th Street',
        opened: 1939,
        type: '1937 O\'Mahony dining car',
        cuisine: 'American diner',
        significance: 'Art Deco railroad car diner',
        nrhp_listed: 1983,
        status: 'Active',
        hours: '24/7',
        pop_culture: 'Featured in movies (The Mighty Ducks, Jingle All the Way, A Prairie Home Companion)'
      },
      {
        name: 'St. Paul Grill (Saint Paul Hotel)',
        address: '350 Market Street',
        opened: 1990,
        hotel_established: 1910,
        cuisine: 'American fine dining',
        significance: 'Historic hotel restaurant',
        status: 'Active'
      },
      {
        name: 'Yarusso Bros Italian Restaurant',
        address: '635 Payne Avenue',
        opened: 1933,
        family: 'Yarusso family (3rd generation)',
        cuisine: 'Italian-American',
        significance: 'Oldest Italian restaurant in St. Paul',
        neighborhood: 'Payne-Phalen (historically Italian)',
        status: 'Active'
      },
      {
        name: 'The Lexington',
        address: '1096 Grand Avenue',
        opened: 1935,
        cuisine: 'American supper club',
        signature: 'Walleye, prime rib',
        significance: 'Historic Grand Avenue supper club',
        status: 'Active'
      },
      {
        name: 'Taste of Thailand',
        address: '1671 Selby Avenue',
        opened: 1983,
        significance: 'First Thai restaurant in Twin Cities',
        cuisine: 'Thai',
        status: 'Active',
        pioneer: true
      }
    ],
    
    food_traditions: {
      state_fair_foods: {
        location: 'Minnesota State Fair, St. Paul',
        significance: 'Food capital of Minnesota',
        famous_for: 'Food on a stick',
        iconic_foods: [
          'Pronto Pup (corn dog)',
          'Cheese curds (fried)',
          'Sweet Martha\'s Cookies',
          'Mini donuts',
          'Deep-fried candy bars (various)',
          'Corn on the cob',
          'Spam Curds',
          'Walleye on a stick',
          'Anything on a stick'
        ],
        attendance: '2 million annually',
        economic_impact: 'Vendors make year\'s income in 12 days'
      },
      scandinavian_influence: {
        period: '1850s-present',
        foods: ['Lutefisk', 'Lefse', 'Swedish meatballs', 'Krumkake'],
        significance: 'Large Scandinavian immigrant population',
        modern_presence: 'Still celebrated at church dinners, festivals'
      },
      german_influence: {
        period: '1850s-present',
        foods: ['Bratwurst', 'Sauerkraut', 'German potato salad'],
        legacy: 'Brewing industry'
      },
      hmong_cuisine: {
        period: '1975-present',
        significance: 'Largest urban Hmong community in America',
        foods: [
          'Papaya salad',
          'Laab (larb)',
          'Sticky rice',
          'Egg rolls',
          'Pho (Vietnamese influence)'
        ],
        venues: [
          'Hmong Village food court',
          'University Avenue Hmong restaurants',
          'Hmong markets'
        ],
        impact: 'Transformed St. Paul food scene'
      },
      mexican_latino_cuisine: {
        period: '1900s-present',
        neighborhood: 'West Side (District del Sol)',
        significance: 'Historic Mexican-American community',
        venue: 'Mercado Central',
        foods: ['Tacos', 'Tamales', 'Burritos', 'Mexican pastries'],
        restaurants: 'Numerous authentic Mexican restaurants West Side'
      }
    },
    
    brewery_history: {
      historic_breweries: [
        {
          name: 'Hamm\'s Brewery',
          founded: 1865,
          founder: 'Theodore Hamm',
          location: 'Swede Hollow/East Side',
          peak: 'Fourth-largest brewery in US (1950s)',
          slogan: 'From the Land of Sky Blue Waters',
          mascot: 'Hamm\'s Bear',
          closed: 1997,
          legacy: 'Hamm Building (Landmark Center area)',
          significance: 'Major St. Paul employer, iconic brand'
        },
        {
          name: 'Schmidt Brewery (Jacob Schmidt Brewing Company)',
          founded: 1855,
          location: 'West 7th Street',
          closed: 2002,
          building: 'Schmidt Brewery Artist Lofts (converted)',
          brands: ['Schmidt Beer', 'Grain Belt (acquired)'],
          significance: 'Major St. Paul industry',
          current_use: 'Artist lofts, event space'
        },
        {
          name: 'Yoerg Brewing Company',
          founded: 1848,
          significance: 'First brewery in Minnesota',
          founder: 'Anthony Yoerg',
          closed: 1952,
          location: 'West Side',
          historical_note: 'Predates Minnesota statehood'
        }
      ],
      modern_craft_breweries: [
        {
          name: 'Summit Brewing Company',
          founded: 1986,
          location: 'University Avenue',
          significance: 'Pioneering Midwest craft brewery',
          flagship: 'Summit Extra Pale Ale',
          status: 'Active',
          tours: true
        },
        {
          name: 'Flat Earth Brewing',
          founded: 2007,
          location: 'West 7th Street',
          status: 'Active'
        },
        {
          name: 'Bad Weather Brewing',
          founded: 2012,
          location: 'West 7th Street',
          status: 'Active'
        },
        {
          name: 'Dual Citizen Brewing',
          founded: 2016,
          location: 'Payne-Phalen',
          status: 'Active'
        }
      ],
      prohibition: {
        period: '1920-1933',
        impact: 'Breweries closed or produced "near beer"',
        bootlegging: 'Extensive illegal alcohol trade',
        gangsters: 'St. Paul became major distribution hub',
        post_prohibition: 'Some breweries never recovered'
      }
    },
    
    iconic_foods: [
      {
        food: 'Juicy Lucy (Jucy Lucy)',
        origin: 'Minneapolis (Matt\'s Bar)',
        connection: 'Twin Cities signature burger',
        description: 'Cheese-stuffed burger',
        available: 'Various St. Paul bars and restaurants'
      },
      {
        food: 'Wild Rice',
        significance: 'Minnesota state grain',
        traditional: 'Native American staple',
        modern: 'Used in soups, casseroles, stuffing',
        venues: 'Many St. Paul restaurants feature wild rice dishes'
      },
      {
        food: 'Walleye',
        significance: 'Minnesota state fish',
        preparation: 'Deep-fried, baked, grilled',
        venues: 'Featured at supper clubs, State Fair',
        cultural_importance: 'Friday fish fries tradition'
      },
      {
        food: 'Tater Tot Hotdish',
        type: 'Casserole',
        significance: 'Minnesota comfort food',
        ingredients: ['Ground beef', 'Cream of mushroom soup', 'Tater tots', 'Cheese'],
        occasions: 'Church suppers, potlucks, home cooking'
      }
    ],
    
    food_markets: [
      {
        name: 'St. Paul Farmers\' Market',
        location: 'Lowertown (290 5th Street E)',
        founded: 1853,
        schedule: 'Year-round (indoor winter)',
        significance: 'One of oldest farmers markets in USA',
        vendors: '150+ on peak days',
        products: ['Fresh produce', 'Meat', 'Baked goods', 'Crafts', 'Plants'],
        cultural_importance: 'Community gathering place since 1850s'
      },
      {
        name: 'Hmong Village',
        address: '1001 Johnson Parkway',
        opened: 2000,
        description: 'Indoor Asian marketplace',
        features: ['100+ vendor stalls', 'Food court', 'Hmong groceries', 'Traditional goods'],
        cuisine: ['Hmong', 'Thai', 'Vietnamese', 'Chinese', 'Lao'],
        cultural_significance: 'Largest Hmong marketplace in America'
      },
      {
        name: 'Mercado Central',
        address: '1515 East Lake Street, Minneapolis (St. Paul connection)',
        significance: 'Latino marketplace',
        note: 'St. Paul\'s West Side has many Mexican markets and taquerias'
      }
    ],
    
    culinary_education: [
      {
        institution: 'Saint Paul College Culinary Arts Program',
        established: 1919,
        programs: ['Culinary Arts', 'Baking', 'Hospitality Management'],
        significance: 'Trains Twin Cities chefs'
      }
    ],
    
    famous_chefs: [
      {
        name: 'Lucia Watson',
        restaurant: 'Lucia\'s Restaurant, Lucia\'s Wine Bar',
        location: 'Minneapolis (St. Paul influence)',
        significance: 'Local food movement pioneer',
        era: '1985-present'
      }
    ],
    
    defunct_iconic_restaurants: [
      {
        name: 'The Emporium of Jazz',
        location: 'Grand Avenue',
        period: '1980s-1990s',
        type: 'Jazz club and restaurant',
        significance: 'Important jazz venue'
      },
      {
        name: 'The Flame',
        location: 'Downtown',
        period: '1950s-1980s',
        type: 'Supper club',
        significance: 'Popular mid-century dining'
      }
    ],
    
    food_festivals: [
      {
        name: 'Taste of Minnesota',
        period: '1983-2014 (discontinued)',
        location: 'State Capitol grounds',
        significance: 'Major food festival',
        attendance: 'Hundreds of thousands',
        note: 'Discontinued due to costs'
      },
      {
        name: 'Grand Old Day Food Vendors',
        period: 'Annual (June)',
        location: 'Grand Avenue',
        attendance: 250000
      }
    ]
  };

  const filename = 'stpaul_food_restaurant_history.json';
  fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(foodCulture, null, 2));
  
  const restaurantCount = foodCulture.historic_restaurants.length + foodCulture.defunct_iconic_restaurants.length;
  const breweryCount = foodCulture.brewery_history.historic_breweries.length + foodCulture.brewery_history.modern_craft_breweries.length;
  const totalCount = restaurantCount + breweryCount + foodCulture.food_markets.length + foodCulture.iconic_foods.length;
  
  console.log(`   ✅ ${restaurantCount} restaurants documented (historic + current)`);
  console.log(`   ✅ ${breweryCount} breweries cataloged`);
  console.log(`   ✅ ${foodCulture.food_markets.length} food markets listed`);
  console.log(`   ✅ Food traditions documented (Hmong, Scandinavian, State Fair)`);
  console.log(`   ✅ ${foodCulture.iconic_foods.length} iconic Minnesota foods`);

  const results = {
    timestamp: new Date().toISOString(),
    sources: [{
      name: 'Food & Restaurant History',
      count: totalCount,
      file: filename,
      status: 'success'
    }],
    totalRecords: totalCount
  };

  fs.writeFileSync(
    path.join(outputDir, '_food_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Food History Mining Complete: ${totalCount} total records`);
  console.log('='.repeat(60));
  
  return results;
}

gatherFoodHistory();
