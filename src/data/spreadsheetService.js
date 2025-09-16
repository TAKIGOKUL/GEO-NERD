// Google Sheets integration for GeoGuess locations
// Using public CSV export to fetch data from the spreadsheet

// Import the actual spreadsheet data with proper image URLs
import { spreadsheetLocations } from './spreadsheetData.js';

const SPREADSHEET_ID = '1IcdG9d6VoTlICsVxWRGkHonJe759JeGv40qiWsEosiU';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;

// Function to parse CSV data with proper handling of quoted fields
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // More robust CSV parsing that handles quoted fields with commas
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add the last value
      values.push(current.trim());
      
      // Remove quotes from values
      const cleanValues = values.map(value => value.replace(/^"|"$/g, ''));
      result.push(cleanValues);
    }
  }
  
  return result;
};

// Function to convert Wikipedia file URLs to direct, mobile-friendly image URLs
const convertWikipediaImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/400x300?text=Image+Not+Available';
  
  // If it's already a direct image URL, return as-is
  if (imageUrl.includes('upload.wikimedia.org') || imageUrl.includes('images.unsplash.com')) {
    return imageUrl;
  }
  
  // Function to get Commons API thumbnail URL (more reliable than direct paths)
  const getCommonsThumbUrl = (fileName) => {
    // Clean and encode the filename
    let cleanFileName = fileName.replace(/^File:/, '').trim();
    
    // Handle URL-encoded characters
    cleanFileName = decodeURIComponent(cleanFileName);
    
    // Re-encode for the API
    const encodedFileName = encodeURIComponent(cleanFileName);
    
    // Use the Commons thumbnail API which is more reliable
    return `https://commons.wikimedia.org/w/thumb.php?f=${encodedFileName}&width=800`;
  };

  // Special handling for known problematic images
  const getSpecialImageUrl = (originalUrl, fileName) => {
    // Known working alternatives for problematic images
    const specialCases = {
      'Pamukkale_30.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Pamukkale_30.jpg/800px-Pamukkale_30.jpg',
      'Chefchaouen_%2852189357475%29.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Chefchaouen_%2852189357475%29.jpg/800px-Chefchaouen_%2852189357475%29.jpg',
      'Hallstatt_-_Zentrum_.JPG': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Hallstatt_-_Zentrum_.JPG/800px-Hallstatt_-_Zentrum_.JPG'
    };
    
    // Check if we have a special case
    const cleanFileName = fileName.replace(/^File:/, '').trim();
    const decodedFileName = decodeURIComponent(cleanFileName);
    
    if (specialCases[decodedFileName]) {
      return specialCases[decodedFileName];
    }
    
    return null;
  };

  // Enhanced Special:FilePath conversion
  if (imageUrl.includes('Special:FilePath/')) {
    const fileName = imageUrl.split('Special:FilePath/')[1];
    if (fileName) {
      // Try special case first
      const specialUrl = getSpecialImageUrl(imageUrl, fileName);
      if (specialUrl) {
        return specialUrl;
      }
      // Fall back to Commons API
      return getCommonsThumbUrl(fileName);
    }
  }
  
  // Convert Wikipedia or Commons File: URLs
  if (imageUrl.includes('/wiki/File:')) {
    const fileName = imageUrl.split('/wiki/File:')[1];
    if (fileName) {
      // Try special case first
      const specialUrl = getSpecialImageUrl(imageUrl, fileName);
      if (specialUrl) {
        return specialUrl;
      }
      return getCommonsThumbUrl(fileName);
    }
  }
  
  // If it's a commons.wikimedia.org URL but not direct, try to extract filename
  if (imageUrl.includes('commons.wikimedia.org') && !imageUrl.includes('upload.wikimedia.org')) {
    const fileMatch = imageUrl.match(/File:([^&?#]+)/);
    if (fileMatch) {
      const fileName = fileMatch[1];
      // Try special case first
      const specialUrl = getSpecialImageUrl(imageUrl, fileName);
      if (specialUrl) {
        return specialUrl;
      }
      return getCommonsThumbUrl(fileName);
    }
  }
  
  return imageUrl || 'https://via.placeholder.com/400x300?text=Image+Not+Available';
};

// Local image manifest - images that we've downloaded locally
const localImageManifest = {
  "1": {
    "name": "Chefchaouen Blue Streets",
    "filename": "1_chefchaouen_blue_streets.jpg",
    "localPath": "/images/locations/1_chefchaouen_blue_streets.jpg"
  },
  "2": {
    "name": "Hallstatt Village",
    "filename": "2_hallstatt_village.jpg",
    "localPath": "/images/locations/2_hallstatt_village.jpg"
  },
  "10": {
    "name": "Pamukkale Terraces",
    "filename": "10_pamukkale_terraces.jpg",
    "localPath": "/images/locations/10_pamukkale_terraces.jpg"
  }
};

// Function to get local image path
const getLocalImagePath = (locationId, locationName) => {
  if (!locationId) return null;
  
  // Check if we have a local image for this location
  const localImage = localImageManifest[locationId.toString()];
  if (localImage) {
    console.log(`Using local image for ${locationName}: ${localImage.localPath}`);
    return localImage.localPath;
  }
  
  return null;
};

// Function to check if local image exists using manifest
const checkLocalImageExists = (locationId) => {
  return localImageManifest[locationId] !== undefined;
};

// Function to use image URL directly from spreadsheet with local fallback
const useDirectImageUrl = (imageUrl, locationId, locationName) => {
  // Since we've updated all URLs to reliable sources, just return the imageUrl
  // The ReliableImage component will handle any fallbacks needed
  return imageUrl;
};

// Function to convert spreadsheet row to location object
const convertRowToLocation = (row, index) => {
  if (!row || row.length < 9) return null;
  
  // Based on the provided data structure:
  // ID, Name, Category, Country, Latitude, Longitude, Description, Wikipedia_Link, Image_URL, Map_url
  const imageUrl = row[8] || '';
  const locationId = parseInt(row[0]) || index + 1;
  const locationName = row[1] || 'Unknown Location';
  const directImageUrl = useDirectImageUrl(imageUrl, locationId, locationName);
  
  return {
    id: parseInt(row[0]) || index + 1,
    name: row[1] || 'Unknown Location',
    category: row[2] || 'General',
    country: row[3] || 'Unknown',
    city: row[3] || 'Unknown', // Country field contains city, country format
    latitude: parseFloat(row[4]) || 0,
    longitude: parseFloat(row[5]) || 0,
    description: row[6] || 'No description available',
    wikipediaLink: row[7] || '',
    imageUrl: directImageUrl || 'https://via.placeholder.com/400x300?text=Image+Not+Available',
    mapUrl: row[9] || '',
    // Add default values for missing properties
    subcategory: 'General',
    continent: 'Unknown',
    climate: 'Temperate',
    difficulty: 'Medium',
    culturalContext: 'A significant cultural landmark',
    historicalSignificance: 'Historically important location',
    bestVisitingTime: 'Year-round',
    localAttractions: 'Various local attractions'
  };
};

// Cache for locations to avoid repeated API calls
let locationsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to fetch data from Google Sheets CSV export with caching
export const fetchLocationsFromSpreadsheet = async () => {
  // Check if we have valid cached data
  if (locationsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    console.log('Using cached locations data');
    return locationsCache;
  }

  try {
    console.log('Fetching data from Google Sheets CSV export...');
    
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('No data found in spreadsheet');
    }
    
    // Parse CSV data
    const csvData = parseCSV(csvText);
    
    if (csvData.length < 2) {
      throw new Error('Insufficient data in spreadsheet');
    }
    
    // Skip header row and convert data
    const locations = csvData
      .slice(1) // Skip header row
      .map((row, index) => convertRowToLocation(row, index))
      .filter(location => location !== null && location.name !== 'Unknown Location'); // Remove invalid rows
    
    // Cache the results
    locationsCache = locations;
    cacheTimestamp = Date.now();
    
    console.log(`Successfully fetched ${locations.length} locations from spreadsheet`);
    console.log('Sample location:', locations[0]);
    return locations;
    
  } catch (error) {
    console.error('Error fetching locations from spreadsheet:', error);
    
    // Use actual spreadsheet data as fallback
    console.log('Using actual spreadsheet data with direct image URLs');
    const fallbackData = getActualSpreadsheetData();
    
    // Cache the fallback data too
    locationsCache = fallbackData;
    cacheTimestamp = Date.now();
    
    return fallbackData;
  }
};

// Actual spreadsheet data with proper image URLs from spreadsheet
const getActualSpreadsheetData = () => spreadsheetLocations;

// Fallback static locations (subset of current data)
const getStaticLocations = () => getActualSpreadsheetData();

// Function to ensure all locations have required properties
export const ensureLocationProperties = (location) => ({
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

// Game Mode Filters
export const getLocationsByMode = (locations, mode) => {
  switch (mode) {
    case 'tournament':
      return locations;
    case 'historical':
      return locations.filter(loc => loc.historicalSignificance && loc.historicalSignificance.length > 50);
    case 'explorer':
      return locations.filter(loc => loc.category === 'Natural');
    case 'cultural':
      return locations.filter(loc => loc.category === 'Cultural' || loc.subcategory === 'Street Scenes');
    case 'landmark':
      return locations.filter(loc => loc.subcategory === 'Monuments' || loc.subcategory === 'Landmarks');
    default:
      return locations;
  }
};

// Utility function to get random location based on game mode
export const getRandomLocation = async (mode = 'tournament') => {
  try {
    const locations = await fetchLocationsFromSpreadsheet();
    const filteredLocations = getLocationsByMode(locations, mode);
    const randomIndex = Math.floor(Math.random() * filteredLocations.length);
    const selectedLocation = filteredLocations[randomIndex];
    return ensureLocationProperties(selectedLocation);
  } catch (error) {
    console.error('Error getting random location:', error);
    // Return a fallback location
    return ensureLocationProperties({
      id: 1,
      name: "Chefchaouen Blue Streets",
      category: "Cultural",
      country: "Morocco",
      city: "Chefchaouen",
      latitude: 35.1686,
      longitude: -5.2636,
      description: "A mountain town painted almost entirely blue, hidden in Morocco's Rif mountains.",
      wikipediaLink: "https://en.wikipedia.org/wiki/Chefchaouen",
      imageUrl: useDirectImageUrl("https://en.wikipedia.org/wiki/Special:FilePath/Chefchaouen_%2852189357475%29.jpg", 1, "Chefchaouen Blue Streets")
    });
  }
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

// Enhanced scoring system with hints and bonuses
export const calculateScoreWithHints = (distance, hintLevel, timeBonus = 0, culturalBonus = 0, explorationBonus = 0, streakMultiplier = 1) => {
  const baseScore = Math.max(0, 100 - Math.floor(distance / 250));
  const hintPenalty = hintLevel * 10;
  const speedBonus = timeBonus; // Up to 20 points for sub-10 second guesses
  const finalScore = Math.max(0, (baseScore - hintPenalty + speedBonus + culturalBonus + explorationBonus) * streakMultiplier);
  // Cap the score at 100 points maximum per round
  return Math.min(100, Math.round(finalScore));
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
