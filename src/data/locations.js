// Geo-Nerd Location Database - Enhanced with categories and metadata

// Function to ensure all locations have required properties
const ensureLocationProperties = (location) => ({
  ...location,
  subcategory: location.subcategory || 'General',
  continent: location.continent || 'Unknown',
  climate: location.climate || 'Temperate',
  difficulty: location.difficulty || 'Medium',
  culturalContext: location.culturalContext || 'A significant cultural landmark',
  historicalSignificance: location.historicalSignificance || 'Historically important location',
  bestVisitingTime: location.bestVisitingTime || 'Year-round',
  localAttractions: location.localAttractions || 'Various local attractions'
});

export const locations = [
  {
    id: 1,
    name: "Eiffel Tower",
    category: "Architecture",
    subcategory: "Monuments",
    country: "France",
    city: "Paris",
    continent: "Europe",
    climate: "Temperate",
    latitude: 48.8584,
    longitude: 2.2945,
    difficulty: "Easy",
    description: "An iconic iron lattice tower on the Champ de Mars in Paris, France. Built in 1889 for the World's Fair, it stands 330 meters tall and is one of the most recognizable structures in the world.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Eiffel_Tower",
    imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800",
    culturalContext: "Symbol of French engineering and artistic achievement",
    historicalSignificance: "Built for the 1889 World's Fair, originally criticized but now beloved",
    bestVisitingTime: "Spring and Fall for pleasant weather",
    localAttractions: "Champ de Mars, Trocadéro, Seine River"
  },
  {
    id: 2,
    name: "Machu Picchu",
    category: "History",
    subcategory: "Ancient Sites",
    country: "Peru",
    city: "Cusco",
    continent: "South America",
    climate: "Tropical Highland",
    latitude: -13.1631,
    longitude: -72.5450,
    difficulty: "Medium",
    description: "A 15th-century Inca citadel located in the Eastern Cordillera of southern Peru. This UNESCO World Heritage site sits at 2,430 meters above sea level and showcases Incan architectural mastery.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Machu_Picchu",
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800",
    culturalContext: "Sacred Incan city representing harmony between architecture and nature",
    historicalSignificance: "Built around 1450, abandoned during Spanish conquest, rediscovered in 1911",
    bestVisitingTime: "May to September (dry season)",
    localAttractions: "Sacred Valley, Ollantaytambo, Cusco historic center"
  },
  {
    id: 3,
    name: "Great Wall of China",
    category: "Architecture",
    country: "China",
    city: "Beijing",
    latitude: 40.4319,
    longitude: 116.5704,
    description: "A series of fortifications made of stone, brick, and other materials, generally built along an east-to-west line across the historical northern borders of China.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Great_Wall_of_China",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800"
  },
  {
    id: 4,
    name: "Sahara Desert",
    category: "Nature",
    country: "Morocco",
    city: "Merzouga",
    latitude: 25.0000,
    longitude: 0.0000,
    description: "The largest hot desert in the world, covering much of North Africa.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Sahara",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
  },
  {
    id: 5,
    name: "Mount Fuji",
    category: "Nature",
    country: "Japan",
    city: "Tokyo",
    latitude: 35.3606,
    longitude: 138.7274,
    description: "An active stratovolcano and the highest mountain in Japan.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Mount_Fuji",
    imageUrl: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800"
  },
  {
    id: 6,
    name: "Sydney Opera House",
    category: "Architecture",
    country: "Australia",
    city: "Sydney",
    latitude: -33.8568,
    longitude: 151.2153,
    description: "A multi-venue performing arts centre in Sydney, Australia.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Sydney_Opera_House",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
  },
  {
    id: 7,
    name: "Niagara Falls",
    category: "Nature",
    country: "Canada",
    city: "Niagara Falls",
    latitude: 43.0962,
    longitude: -79.0377,
    description: "A group of three waterfalls at the southern end of Niagara Gorge.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Niagara_Falls",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
  },
  {
    id: 8,
    name: "Colosseum",
    category: "History",
    country: "Italy",
    city: "Rome",
    latitude: 41.8902,
    longitude: 12.4922,
    description: "An oval amphitheatre in the centre of Rome, Italy.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Colosseum",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
  },
  {
    id: 9,
    name: "Grand Canyon",
    category: "Nature",
    country: "United States",
    city: "Arizona",
    latitude: 36.1069,
    longitude: -112.1129,
    description: "A steep-sided canyon carved by the Colorado River in Arizona.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Grand_Canyon",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
  },
  {
    id: 10,
    name: "Taj Mahal",
    category: "Architecture",
    country: "India",
    city: "Agra",
    latitude: 27.1751,
    longitude: 78.0421,
    description: "An ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, India.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Taj_Mahal",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
  }
];

// Game Mode Filters
export const getLocationsByMode = (mode) => {
  switch (mode) {
    case 'classic':
      return locations;
    case 'challenge':
      return locations.filter(loc => loc.difficulty === 'Easy' || loc.difficulty === 'Medium');
    case 'sprint':
      return locations.filter(loc => loc.difficulty === 'Easy').slice(0, 5); // Quick 5-question mode
    case 'historical':
      return locations.filter(loc => loc.historicalSignificance && loc.historicalSignificance.length > 50);
    case 'explorer':
      return locations.filter(loc => loc.category === 'Nature');
    case 'cultural':
      return locations.filter(loc => loc.category === 'Culture' || loc.subcategory === 'Street Scenes');
    case 'landmark':
      return locations.filter(loc => loc.subcategory === 'Monuments' || loc.subcategory === 'Landmarks');
    default:
      return locations;
  }
};

// Utility function to get random location based on game mode
export const getRandomLocation = (mode = 'classic') => {
  const filteredLocations = getLocationsByMode(mode);
  const randomIndex = Math.floor(Math.random() * filteredLocations.length);
  const selectedLocation = filteredLocations[randomIndex];
  return ensureLocationProperties(selectedLocation);
};

// Hint System Functions
export const getHintByLevel = (location, hintLevel) => {
  switch (hintLevel) {
    case 0:
      return null; // No hint
    case 1:
      return { type: 'climate', text: `Climate Zone: ${location.climate}` };
    case 2:
      return { type: 'continent', text: `Continent: ${location.continent}` };
    case 3:
      return { type: 'country', text: `Country: ${location.country}` };
    case 4:
      return { type: 'city', text: `Near: ${location.city}` };
    default:
      return null;
  }
};

// Enhanced Scoring System with Multiple Factors
export const calculateScoreWithHints = (distance, hintLevel, timeBonus = 0, culturalBonus = 0, explorationBonus = 0, streakMultiplier = 1) => {
  const baseScore = Math.max(0, 100 - Math.floor(distance / 250));
  const hintPenalty = hintLevel * 10;
  const speedBonus = timeBonus; // Up to 20 points for sub-10 second guesses
  const finalScore = Math.max(0, (baseScore - hintPenalty + speedBonus + culturalBonus + explorationBonus) * streakMultiplier);
  return Math.round(finalScore);
};

// AI-Driven Dynamic Hint System
export const getDynamicHint = (location, hintLevel, imageAnalysis = null) => {
  // Ensure location exists and has required properties
  if (!location) return null;

  const baseHints = [
    { level: 1, text: `Climate Zone: ${location.climate || 'Unknown'}`, penalty: 10 },
    { level: 2, text: `Continent: ${location.continent || 'Unknown'}`, penalty: 20 },
    { level: 3, text: `Country: ${location.country || 'Unknown'}`, penalty: 30 },
    { level: 4, text: `Near: ${location.city || 'Unknown'}`, penalty: 40 }
  ];

  // Enhanced hints based on image analysis
  if (imageAnalysis) {
    switch (hintLevel) {
      case 1:
        return { 
          ...baseHints[0], 
          text: `This region is known for ${(location.climate || 'temperate').toLowerCase()} climate and ${location.culturalContext ? location.culturalContext.split('.')[0] : 'unique cultural features'}.`,
          penalty: 10 
        };
      case 2:
        return { 
          ...baseHints[1], 
          text: `Located in ${location.continent || 'an unknown continent'}, this area is famous for ${location.historicalSignificance ? location.historicalSignificance.split('.')[0] : 'its historical significance'}.`,
          penalty: 20 
        };
      case 3:
        return { 
          ...baseHints[2], 
          text: `This is in ${location.country || 'an unknown country'}, known for ${location.culturalContext ? location.culturalContext.split('.')[0] : 'its rich culture'}.`,
          penalty: 30 
        };
      case 4:
        return { 
          ...baseHints[3], 
          text: `Near ${location.city || 'an unknown city'}, this location is ${location.bestVisitingTime ? `best visited ${location.bestVisitingTime}` : 'a must-see destination'}.`,
          penalty: 40 
        };
    }
  }

  return baseHints[hintLevel - 1] || null;
};

// Utility function to calculate distance between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Utility function to calculate score based on distance
export const calculateScore = (distance) => {
  return Math.max(0, 100 - Math.floor(distance / 250));
};

