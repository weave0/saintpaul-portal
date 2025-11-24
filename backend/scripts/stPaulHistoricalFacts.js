/**
 * St. Paul Historical Facts - Real Research Data
 * Compiled from public sources and historical records
 */

const stPaulHistoricalData = {
  // Historic Neighborhoods (Real St. Paul districts)
  neighborhoods: [
    {
      name: "Summit Hill",
      established: 1850,
      boundaries: "Grand Ave to I-94, Lexington Pkwy to Mississippi River",
      notableFeatures: ["Summit Avenue mansions", "Historic homes", "F. Scott Fitzgerald birthplace"],
      population2020: 25000,
      historicalSignificance: "Home to lumber barons and railroad magnates in the 1880s-1920s"
    },
    {
      name: "Cathedral Hill",
      established: 1851,
      boundaries: "I-94 to Summit Ave, Rice St to Lexington Pkwy",
      notableFeatures: ["Cathedral of Saint Paul (1915)", "Fitzgerald Theater", "Historic row houses"],
      population2020: 10000,
      historicalSignificance: "Named for Cathedral of Saint Paul, German and Irish immigrant neighborhood"
    },
    {
      name: "Frogtown",
      established: 1850,
      boundaries: "University Ave to I-94, Lexington Pkwy to Rice St",
      notableFeatures: ["Hmong Village", "Historic railroad yards"],
      population2020: 18000,
      historicalSignificance: "Named for frogs in wetlands, now largest Hmong community in US"
    },
    {
      name: "Downtown/Lowertown",
      established: 1841,
      boundaries: "I-94 to Mississippi River, Kellogg Blvd to University Ave",
      notableFeatures: ["Union Depot (1923)", "CHS Field", "Farmers Market", "Artists Quarter"],
      population2020: 5000,
      historicalSignificance: "Original riverfront settlement, center of transportation and commerce"
    },
    {
      name: "West Seventh",
      established: 1856,
      boundaries: "Mississippi River to Randolph Ave, Shepard Rd to Otto Ave",
      notableFeatures: ["Xcel Energy Center", "Historic Fort Road", "Irvine Park"],
      population2020: 20000,
      historicalSignificance: "Irish immigrant neighborhood, brewing district history"
    }
  ],

  // Historic Buildings (Real landmarks)
  landmarks: [
    {
      name: "Cathedral of Saint Paul",
      address: "239 Selby Avenue",
      yearBuilt: 1915,
      architect: "Emmanuel Louis Masqueray",
      style: "Renaissance Revival",
      nrhpListed: 1974,
      coordinates: { lat: 44.9467, lon: -93.1094 },
      description: "Designed by French architect, modeled after St. Peter's Basilica, copper dome is distinctive St. Paul landmark"
    },
    {
      name: "James J. Hill House",
      address: "240 Summit Avenue",
      yearBuilt: 1891,
      architect: "Peabody, Stearns & Furber",
      style: "Richardsonian Romanesque",
      nrhpListed: 1961,
      coordinates: { lat: 44.9423, lon: -93.1185 },
      description: "32,000 sq ft mansion of railroad tycoon James J. Hill, now Minnesota Historical Society site"
    },
    {
      name: "Union Depot",
      address: "214 4th Street E",
      yearBuilt: 1923,
      architect: "Charles Frost",
      style: "Beaux-Arts",
      nrhpListed: 1974,
      coordinates: { lat: 44.9479, lon: -93.0864 },
      description: "Former train station serving 20,000 passengers daily, now event venue and Amtrak station"
    },
    {
      name: "Minnesota State Capitol",
      address: "75 Rev Dr Martin Luther King Jr Blvd",
      yearBuilt: 1905,
      architect: "Cass Gilbert",
      style: "Beaux-Arts Renaissance",
      nrhpListed: 1972,
      coordinates: { lat: 44.9553, lon: -93.1022 },
      description: "Second-largest marble dome in world, designed by famed architect Cass Gilbert"
    },
    {
      name: "Landmark Center",
      address: "75 West 5th Street",
      yearBuilt: 1902,
      architect: "Willoughby J. Edbrooke",
      style: "Richardsonian Romanesque",
      nrhpListed: 1969,
      coordinates: { lat: 44.9462, lon: -93.0948 },
      description: "Former Federal Courts Building, now cultural center with 4-story skylit courtyard"
    }
  ],

  // Historical Events (Real St. Paul history)
  events: [
    {
      year: 1841,
      date: "November 1, 1841",
      event: "Father Lucien Galtier builds log chapel",
      description: "French missionary builds Chapel of St. Paul, giving the city its name",
      significance: "Founding of St. Paul"
    },
    {
      year: 1849,
      date: "March 3, 1849",
      event: "Minnesota Territory created",
      description: "St. Paul designated as capital of new Minnesota Territory",
      significance: "Political establishment"
    },
    {
      year: 1858,
      date: "May 11, 1858",
      event: "Minnesota statehood",
      description: "Minnesota becomes 32nd state, St. Paul remains capital",
      significance: "State capital status"
    },
    {
      year: 1862,
      date: "August 18, 1862",
      event: "Dakota War of 1862 begins",
      description: "Conflict between Dakota people and US government, trials held in St. Paul",
      significance: "Major historical tragedy and injustice"
    },
    {
      year: 1882,
      date: "January 1882",
      event: "First St. Paul Winter Carnival",
      description: "Created to prove St. Paul was habitable in winter, now annual tradition",
      significance: "Cultural institution established"
    },
    {
      year: 1896,
      date: "September 24, 1896",
      event: "F. Scott Fitzgerald born",
      description: "Famous author born at 481 Laurel Avenue",
      significance: "Literary history"
    },
    {
      year: 1920,
      date: "1920-1933",
      event: "Prohibition Era gangster activity",
      description: "St. Paul known as 'safe haven' for gangsters including John Dillinger, Ma Barker",
      significance: "Infamous criminal history"
    },
    {
      year: 1975,
      date: "May 1975",
      event: "Hmong refugees begin arriving",
      description: "First wave of Hmong refugees from Laos settle in St. Paul",
      significance: "Major demographic shift, largest urban Hmong population"
    }
  ],

  // Cultural Organizations (Real institutions)
  culturalInstitutions: [
    {
      name: "Minnesota Historical Society",
      founded: 1849,
      address: "345 Kellogg Blvd W",
      type: "Museum & Archives",
      description: "State historical society with extensive Minnesota collections"
    },
    {
      name: "Science Museum of Minnesota",
      founded: 1907,
      address: "120 West Kellogg Boulevard",
      type: "Science Museum",
      description: "Interactive science museum with Omnitheater"
    },
    {
      name: "Ordway Center for the Performing Arts",
      founded: 1985,
      address: "345 Washington Street",
      type: "Performing Arts",
      description: "Home to Minnesota Opera, The Saint Paul Chamber Orchestra"
    },
    {
      name: "Minnesota Museum of American Art",
      founded: 1894,
      address: "350 Robert Street N",
      type: "Art Museum",
      description: "Focus on American art, especially regional and contemporary"
    }
  ],

  // Transportation History
  transportation: [
    {
      name: "Steamboat Era",
      period: "1823-1920s",
      description: "Mississippi River steamboats made St. Paul major trading center",
      keyFacts: ["First steamboat 'Virginia' arrived 1823", "Peak traffic 1870s-1880s"]
    },
    {
      name: "Railroad Hub",
      period: "1862-1960s",
      description: "Multiple railroad lines converged, James J. Hill's Great Northern Railway HQ",
      keyFacts: ["Union Depot served 20,000 passengers daily in 1920s", "7 railroads operated"]
    },
    {
      name: "Streetcar System",
      period: "1872-1954",
      description: "Extensive streetcar network throughout city",
      keyFacts: ["Twin City Rapid Transit operated", "Last streetcar ran September 1954"]
    }
  ],

  // Industry & Commerce
  economicHistory: [
    {
      industry: "Lumber",
      period: "1850s-1890s",
      description: "Mississippi River lumber milling, created fortunes like Frederick Weyerhaeuser",
      impact: "Built mansions along Summit Avenue"
    },
    {
      industry: "Brewing",
      period: "1850s-1970s",
      description: "German immigrants established breweries, Hamm's Beer (1865), Schmidt Brewery",
      impact: "Major employer, West Seventh neighborhood industry"
    },
    {
      industry: "Fur Trading",
      period: "1800s-1850s",
      description: "American Fur Company operations, trade with Dakota people",
      impact: "Early economic foundation"
    },
    {
      industry: "Publishing",
      period: "1850s-present",
      description: "Major newspaper publishing, Pioneer Press (1849)",
      impact: "Information center for region"
    }
  ],

  // Demographics (Real data)
  demographicHistory: [
    {
      year: 1850,
      population: 1112,
      demographics: "Primarily European settlers, French-Canadian, Irish"
    },
    {
      year: 1900,
      population: 163065,
      demographics: "German, Irish, Swedish immigrants dominant"
    },
    {
      year: 1950,
      population: 311349,
      demographics: "Peak population, European ethnic neighborhoods"
    },
    {
      year: 2000,
      population: 287151,
      demographics: "Significant Hmong (60,000+), African, Latino communities"
    },
    {
      year: 2020,
      population: 311527,
      demographics: "Most diverse in state: 50% White, 15% Black, 19% Asian, 10% Latino"
    }
  ]
};

module.exports = stPaulHistoricalData;
