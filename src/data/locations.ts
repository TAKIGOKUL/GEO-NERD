// Geo-Nerd Mobile - Location Database with Enhanced Metadata

export interface Location {
  id: number;
  name: string;
  category: 'Architecture' | 'Nature' | 'History' | 'Culture';
  subcategory: string;
  country: string;
  city: string;
  continent: string;
  climate: string;
  latitude: number;
  longitude: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  wikipediaLink: string;
  imageUrl: string;
  culturalContext?: string;
  historicalSignificance?: string;
  bestVisitingTime?: string;
  localAttractions?: string;
}

// Function to ensure all locations have required properties
const ensureLocationProperties = (location: Partial<Location>): Location => ({
  subcategory: 'General',
  continent: 'Unknown',
  climate: 'Temperate',
  difficulty: 'Medium',
  culturalContext: 'A significant cultural landmark',
  historicalSignificance: 'Historically important location',
  bestVisitingTime: 'Year-round',
  localAttractions: 'Various local attractions',
  ...location,
} as Location);

export const locations: Location[] = [
  {
    id: 1,
    name: "Chefchaouen Blue Streets",
    category: "Culture",
    subcategory: "General",
    country: "Morocco",
    city: "Chefchaouen",
    continent: "Africa",
    climate: "Mediterranean",
    latitude: 35.1686,
    longitude: -5.2636,
    difficulty: "Medium",
    description: "A mountain town painted almost entirely blue, hidden in Morocco's Rif mountains.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Chefchaouen",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Chefchaouen_%2852189357475%29.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 2,
    name: "Hallstatt Village",
    category: "Culture",
    subcategory: "General",
    country: "Austria",
    city: "Hallstatt",
    continent: "Europe",
    climate: "Alpine",
    latitude: 47.5613,
    longitude: 13.6481,
    difficulty: "Easy",
    description: "A fairytale lakeside town in the Austrian Alps with wooden houses and mountain views.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Hallstatt",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Hallstatt_-_Zentrum_.JPG",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 3,
    name: "Salar de Uyuni",
    category: "Nature",
    subcategory: "General",
    country: "Bolivia",
    city: "Uyuni",
    continent: "South America",
    climate: "Desert",
    latitude: -20.1338,
    longitude: -67.4891,
    difficulty: "Medium",
    description: "The world's largest salt flat, becomes a giant mirror after rain.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Salar_de_Uyuni",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Salar_Uyuni_au01.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 4,
    name: "Meteora Monasteries",
    category: "History",
    subcategory: "General",
    country: "Greece",
    city: "Thessaly",
    continent: "Europe",
    climate: "Mediterranean",
    latitude: 39.721,
    longitude: 21.6306,
    difficulty: "Medium",
    description: "Monasteries perched atop towering rock pillars in central Greece.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Meteora",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Meteora%27s_monastery_2.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 5,
    name: "Shirakawa-go",
    category: "Culture",
    subcategory: "General",
    country: "Japan",
    city: "Gifu",
    continent: "Asia",
    climate: "Temperate",
    latitude: 36.2596,
    longitude: 136.8986,
    difficulty: "Medium",
    description: "A UNESCO-listed village with steep thatched farmhouses in Japanese mountains.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Shirakawa-go",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Ogi_Shirakawa-g%C5%8D,_Gifu,_Japan.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 6,
    name: "Colmar Old Town",
    category: "Culture",
    subcategory: "General",
    country: "France",
    city: "Colmar",
    continent: "Europe",
    climate: "Temperate",
    latitude: 48.079,
    longitude: 7.3585,
    difficulty: "Easy",
    description: "Colorful timber-framed houses and canals in Alsace, France.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Colmar",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/ColmarFrance.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 7,
    name: "Cappadocia Fairy Chimneys",
    category: "Nature",
    subcategory: "General",
    country: "Turkey",
    city: "Göreme",
    continent: "Asia",
    climate: "Continental",
    latitude: 38.6431,
    longitude: 34.8278,
    difficulty: "Medium",
    description: "Strange rock formations and cave dwellings famous for hot air balloons.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Cappadocia",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Cappadocia_balloon_trip,_Ortahisar_Castle_%2811893715185%29.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 8,
    name: "Plitvice Lakes",
    category: "Nature",
    subcategory: "General",
    country: "Croatia",
    city: "Lika-Senj",
    continent: "Europe",
    climate: "Temperate",
    latitude: 44.88,
    longitude: 15.6167,
    difficulty: "Easy",
    description: "Terraced lakes and waterfalls with turquoise waters in Croatia.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Plitvice_Lakes_National_Park",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/View_in_Plitvice_Lakes_National_Park.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 9,
    name: "Banaue Rice Terraces",
    category: "Culture",
    subcategory: "General",
    country: "Philippines",
    city: "Banaue",
    continent: "Asia",
    climate: "Tropical",
    latitude: 16.9135,
    longitude: 121.0583,
    difficulty: "Medium",
    description: "Ancient rice terraces carved into the mountains by the Ifugao people.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Banaue_Rice_Terraces",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Banaue-terrace.JPG",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 10,
    name: "Pamukkale Terraces",
    category: "Nature",
    subcategory: "General",
    country: "Turkey",
    city: "Denizli",
    continent: "Asia",
    climate: "Mediterranean",
    latitude: 37.9244,
    longitude: 29.1202,
    difficulty: "Easy",
    description: "White travertine terraces formed by hot springs, also known as a Cotton Castle.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Pamukkale",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Pamukkale_30.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 11,
    name: "Chefchaouen Rif Mountains",
    category: "Nature",
    subcategory: "General",
    country: "Morocco",
    city: "Chefchaouen",
    continent: "Africa",
    climate: "Mediterranean",
    latitude: 35.17,
    longitude: -5.26,
    difficulty: "Medium",
    description: "The Rif mountain backdrop behind Morocco's blue pearl town.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Rif",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Chauen.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 12,
    name: "CERN Large Hadron Collider",
    category: "Architecture",
    subcategory: "General",
    country: "Switzerland",
    city: "Geneva",
    continent: "Europe",
    climate: "Temperate",
    latitude: 46.233,
    longitude: 6.05,
    difficulty: "Hard",
    description: "World's largest particle physics laboratory, home to the LHC.",
    wikipediaLink: "https://en.wikipedia.org/wiki/CERN",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/CERN-aerial_1.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 13,
    name: "Mauna Kea Observatories",
    category: "Architecture",
    subcategory: "General",
    country: "USA",
    city: "Hawaii",
    continent: "North America",
    climate: "Tropical",
    latitude: 19.8206,
    longitude: -155.4681,
    difficulty: "Hard",
    description: "Cluster of world-class observatories atop a dormant volcano.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Mauna_Kea_Observatories",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Mauna_Kea_Summit_2021-06-16_33_%28cropped%29.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 14,
    name: "Baikonur Cosmodrome",
    category: "Architecture",
    subcategory: "General",
    country: "Kazakhstan",
    city: "Baikonur",
    continent: "Asia",
    climate: "Continental",
    latitude: 45.9647,
    longitude: 63.305,
    difficulty: "Hard",
    description: "Historic spaceport, first site to launch humans into space.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Baikonur_Cosmodrome",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Baikonur_Cosmodrome_Soyuz_launch_pad.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 15,
    name: "SKA Observatory (South Africa)",
    category: "Architecture",
    subcategory: "General",
    country: "South Africa",
    city: "Northern Cape",
    continent: "Africa",
    climate: "Desert",
    latitude: -30.7211,
    longitude: 21.4106,
    difficulty: "Hard",
    description: "Part of the Square Kilometre Array, world's largest radio telescope project.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Square_Kilometre_Array",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/SKA_overview.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 16,
    name: "Arecibo Observatory Ruins",
    category: "Architecture",
    subcategory: "General",
    country: "Puerto Rico",
    city: "Arecibo",
    continent: "North America",
    climate: "Tropical",
    latitude: 18.3442,
    longitude: -66.7528,
    difficulty: "Hard",
    description: "Collapsed in 2020, once the world's largest radio telescope.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Arecibo_Observatory",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Arecibo_radio_telescope_SJU_06_2019_6144.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 17,
    name: "Millau Viaduct",
    category: "Architecture",
    subcategory: "General",
    country: "France",
    city: "Millau",
    continent: "Europe",
    climate: "Mediterranean",
    latitude: 44.0692,
    longitude: 3.0228,
    difficulty: "Medium",
    description: "Tallest bridge in the world spanning the Tarn Valley.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Millau_Viaduct",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/ViaducdeMillau.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 18,
    name: "Lotus Temple",
    category: "Architecture",
    subcategory: "General",
    country: "India",
    city: "Delhi",
    continent: "Asia",
    climate: "Continental",
    latitude: 28.5535,
    longitude: 77.2588,
    difficulty: "Medium",
    description: "Bahai House of Worship shaped like a blooming lotus flower.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Lotus_Temple",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/LotusDelhi.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 19,
    name: "Turning Torso",
    category: "Architecture",
    subcategory: "General",
    country: "Sweden",
    city: "Malmö",
    continent: "Europe",
    climate: "Temperate",
    latitude: 55.6133,
    longitude: 12.9769,
    difficulty: "Medium",
    description: "Famous twisting skyscraper by Santiago Calatrava.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Turning_Torso",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Turning_Torso2.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  },
  {
    id: 20,
    name: "Hagia Sophia",
    category: "Architecture",
    subcategory: "General",
    country: "Turkey",
    city: "Istanbul",
    continent: "Europe",
    climate: "Mediterranean",
    latitude: 41.0086,
    longitude: 28.9802,
    difficulty: "Easy",
    description: "Architectural marvel blending Byzantine and Ottoman design.",
    wikipediaLink: "https://en.wikipedia.org/wiki/Hagia_Sophia",
    imageUrl: "https://en.wikipedia.org/wiki/Special:FilePath/Hagia_Sophia_Mars_2013.jpg",
    culturalContext: "A significant cultural landmark",
    historicalSignificance: "Historically important location",
    bestVisitingTime: "Year-round",
    localAttractions: "Various local attractions"
  }
];

// Game Mode Filters
export const getLocationsByMode = (mode: string): Location[] => {
  switch (mode) {
    case 'classic':
      return locations;
    case 'challenge':
      return locations.filter(loc => loc.difficulty === 'Easy' || loc.difficulty === 'Medium');
    case 'sprint':
      return locations.filter(loc => loc.difficulty === 'Easy').slice(0, 5);
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
export const getRandomLocation = (mode: string = 'classic'): Location => {
  const filteredLocations = getLocationsByMode(mode);
  const randomIndex = Math.floor(Math.random() * filteredLocations.length);
  const selectedLocation = filteredLocations[randomIndex];
  return ensureLocationProperties(selectedLocation);
};

// Hint System Functions
export interface Hint {
  type: string;
  text: string;
  penalty: number;
}

export const getHintByLevel = (location: Location, hintLevel: number): Hint | null => {
  switch (hintLevel) {
    case 0:
      return null; // No hint
    case 1:
      return { type: 'climate', text: `Climate Zone: ${location.climate}`, penalty: 10 };
    case 2:
      return { type: 'continent', text: `Continent: ${location.continent}`, penalty: 20 };
    case 3:
      return { type: 'country', text: `Country: ${location.country}`, penalty: 30 };
    case 4:
      return { type: 'city', text: `Near: ${location.city}`, penalty: 40 };
    default:
      return null;
  }
};

// Enhanced Scoring System with Multiple Factors
export const calculateScoreWithHints = (
  distance: number,
  hintLevel: number,
  timeBonus: number = 0,
  culturalBonus: number = 0,
  explorationBonus: number = 0,
  streakMultiplier: number = 1
): number => {
  const baseScore = Math.max(0, 100 - Math.floor(distance / 250));
  const hintPenalty = hintLevel * 10;
  const speedBonus = timeBonus;
  const finalScore = Math.max(0, (baseScore - hintPenalty + speedBonus + culturalBonus + explorationBonus) * streakMultiplier);
  return Math.round(finalScore);
};

// AI-Driven Dynamic Hint System
export const getDynamicHint = (location: Location, hintLevel: number, imageAnalysis: any = null): Hint | null => {
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
          type: 'climate',
          text: `This region is known for ${(location.climate || 'temperate').toLowerCase()} climate and ${location.culturalContext ? location.culturalContext.split('.')[0] : 'unique cultural features'}.`,
          penalty: 10 
        };
      case 2:
        return { 
          type: 'continent',
          text: `Located in ${location.continent || 'an unknown continent'}, this area is famous for ${location.historicalSignificance ? location.historicalSignificance.split('.')[0] : 'its historical significance'}.`,
          penalty: 20 
        };
      case 3:
        return { 
          type: 'country',
          text: `This is in ${location.country || 'an unknown country'}, known for ${location.culturalContext ? location.culturalContext.split('.')[0] : 'its rich culture'}.`,
          penalty: 30 
        };
      case 4:
        return { 
          type: 'city',
          text: `Near ${location.city || 'an unknown city'}, this location is ${location.bestVisitingTime ? `best visited ${location.bestVisitingTime}` : 'a must-see destination'}.`,
          penalty: 40 
        };
    }
  }

  return baseHints[hintLevel - 1] ? { ...baseHints[hintLevel - 1], type: 'base' } : null;
};

// Utility function to calculate distance between two points using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
export const calculateScore = (distance: number): number => {
  return Math.max(0, 100 - Math.floor(distance / 250));
};
