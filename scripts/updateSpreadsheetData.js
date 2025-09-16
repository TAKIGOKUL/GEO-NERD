#!/usr/bin/env node

/**
 * Script to help update the spreadsheet data
 * This script provides a template for adding new locations from the Google Spreadsheet
 * 
 * To use this script:
 * 1. Copy data from the Google Spreadsheet
 * 2. Update the newLocations array below
 * 3. Run: node scripts/updateSpreadsheetData.js
 * 4. Copy the output to src/data/spreadsheetData.js
 */

// Template for new locations from spreadsheet
const newLocations = [
  // Add new locations here following this format:image.pngimage.png
  // {
  //   id: 11,
  //   name: "Location Name",
  //   category: "Category",
  //   country: "Country",
  //   city: "City",
  //   latitude: 0.0000,
  //   longitude: 0.0000,
  //   description: "Description from spreadsheet",
  //   wikipediaLink: "Wikipedia URL",
  //   imageUrl: "Image URL",
  //   mapUrl: "Google Maps URL",
  //   subcategory: 'General',
  //   continent: 'Continent',
  //   climate: 'Climate',
  //   difficulty: 'Difficulty',
  //   culturalContext: 'A significant cultural landmark',
  //   historicalSignificance: 'Historically important location',
  //   bestVisitingTime: 'Year-round',
  //   localAttractions: 'Various local attractions'
  // }
];

// Function to generate the JavaScript export
function generateSpreadsheetData() {
  const header = `// Converted data from Google Spreadsheet
// This data is based on the spreadsheet: https://docs.google.com/spreadsheets/d/1IcdG9d6VoTlICsVxWRGkHonJe759JeGv40qiWsEosiU/edit?gid=0#gid=0

export const spreadsheetLocations = [`;

  const footer = `];

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
export const getRandomLocation = (mode = 'tournament') => {
  const filteredLocations = getLocationsByMode(spreadsheetLocations, mode);
  const randomIndex = Math.floor(Math.random() * filteredLocations.length);
  const selectedLocation = filteredLocations[randomIndex];
  return ensureLocationProperties(selectedLocation);
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
  return Math.round(finalScore);
};

// AI-Driven Dynamic Hint System
export const getDynamicHint = (location, hintLevel, imageAnalysis = null) => {
  // Ensure location exists and has required properties
  if (!location) return null;

  const baseHints = [
    { level: 1, text: \`Climate Zone: \${location.climate || 'Unknown'}\`, penalty: 10 },
    { level: 2, text: \`Continent: \${location.continent || 'Unknown'}\`, penalty: 20 },
    { level: 3, text: \`Country: \${location.country || 'Unknown'}\`, penalty: 30 },
    { level: 4, text: \`Near: \${location.city || 'Unknown'}\`, penalty: 40 }
  ];

  // Enhanced hints based on image analysis
  if (imageAnalysis) {
    switch (hintLevel) {
      case 1:
        return { 
          ...baseHints[0], 
          text: \`This region is known for \${(location.climate || 'temperate').toLowerCase()} climate and \${location.culturalContext ? location.culturalContext.split('.')[0] : 'unique cultural features'}.\`,
          penalty: 10 
        };
      case 2:
        return { 
          ...baseHints[1], 
          text: \`Located in \${location.continent || 'an unknown continent'}, this area is famous for \${location.historicalSignificance ? location.historicalSignificance.split('.')[0] : 'its historical significance'}.\`,
          penalty: 20 
        };
      case 3:
        return { 
          ...baseHints[2], 
          text: \`This is in \${location.country || 'an unknown country'}, known for \${location.culturalContext ? location.culturalContext.split('.')[0] : 'its rich culture'}.\`,
          penalty: 30 
        };
      case 4:
        return { 
          ...baseHints[3], 
          text: \`Near \${location.city || 'an unknown city'}, this location is \${location.bestVisitingTime ? \`best visited \${location.bestVisitingTime}\` : 'a must-see destination'}.\`,
          penalty: 40 
        };
    }
  }

  return baseHints[hintLevel - 1] || null;
};`;

  const locationsString = newLocations.map(location => 
    `  ${JSON.stringify(location, null, 2).replace(/\n/g, '\n  ')}`
  ).join(',\n');

  return `${header}\n${locationsString}\n${footer}`;
}

// Run the script
if (require.main === module) {
  console.log('Generated spreadsheet data:');
  console.log('=====================================');
  console.log(generateSpreadsheetData());
  console.log('\n=====================================');
  console.log('Copy the above output to src/data/spreadsheetData.js');
}
