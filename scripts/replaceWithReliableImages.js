#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Reliable image URLs for all locations - using Unsplash and other reliable sources
const reliableImageMappings = {
  1: {
    name: "Chefchaouen Blue Streets",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d0cd3d?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80"
  },
  2: {
    name: "Hallstatt Village",
    imageUrl: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  },
  3: {
    name: "Salar de Uyuni",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3?w=800&q=80"
  },
  4: {
    name: "Meteora Monasteries",
    imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80"
  },
  5: {
    name: "Shirakawa-go Village",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80"
  },
  6: {
    name: "Colmar Little Venice",
    imageUrl: "https://images.unsplash.com/photo-1539023278647-6b6e13a1ceb1?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1564594985645-4427056e22e2?w=800&q=80"
  },
  7: {
    name: "Cappadocia Hot Air Balloons",
    imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"
  },
  8: {
    name: "Plitvice Lakes",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"
  },
  9: {
    name: "Banaue Rice Terraces",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80"
  },
  10: {
    name: "Pamukkale Terraces",
    imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"
  },
  11: {
    name: "Marrakech Majorelle Garden",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d0cd3d?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80"
  },
  12: {
    name: "CERN Large Hadron Collider",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
  },
  13: {
    name: "Mauna Kea Observatory",
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80"
  },
  14: {
    name: "Baikonur Cosmodrome",
    imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80"
  },
  15: {
    name: "Square Kilometre Array",
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80"
  },
  16: {
    name: "Arecibo Observatory",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80"
  },
  17: {
    name: "Millau Bridge",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fbd31c0c8e32?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
  },
  18: {
    name: "Lotus Temple",
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800&q=80"
  },
  19: {
    name: "Turning Torso",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fbd31c0c8e32?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
  },
  20: {
    name: "Hagia Sophia",
    imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
    backup: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80"
  }
};

async function updateSpreadsheetData() {
  console.log('Updating spreadsheet data with reliable image URLs...');
  
  const spreadsheetDataPath = path.join(__dirname, '../src/data/spreadsheetData.js');
  
  // Read current spreadsheet data
  let spreadsheetContent = fs.readFileSync(spreadsheetDataPath, 'utf8');
  
  // Update each location's imageUrl
  Object.entries(reliableImageMappings).forEach(([id, data]) => {
    const regex = new RegExp(`(id:\\s*${id}[\\s\\S]*?imageUrl:\\s*")[^"]*(")`);
    if (regex.test(spreadsheetContent)) {
      spreadsheetContent = spreadsheetContent.replace(regex, `$1${data.imageUrl}$2`);
      console.log(`✓ Updated ${data.name} with reliable image URL`);
    }
  });
  
  // Backup original file
  const backupPath = spreadsheetDataPath + '.backup';
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, fs.readFileSync(spreadsheetDataPath, 'utf8'));
    console.log('✓ Created backup of original spreadsheet data');
  }
  
  // Write updated content
  fs.writeFileSync(spreadsheetDataPath, spreadsheetContent);
  console.log('✓ Updated spreadsheet data with reliable image URLs');
  
  // Generate image mapping file for fallbacks
  const imageMappingContent = `// Reliable image mappings for locations
// Generated by replaceWithReliableImages.js

export const reliableImageMappings = ${JSON.stringify(reliableImageMappings, null, 2)};

// Function to get reliable image URL for a location
export const getReliableImageUrl = (locationId) => {
  const mapping = reliableImageMappings[locationId];
  return mapping ? mapping.imageUrl : null;
};

// Function to get backup image URL
export const getBackupImageUrl = (locationId) => {
  const mapping = reliableImageMappings[locationId];
  return mapping ? mapping.backup : null;
};
`;
  
  const imageMappingPath = path.join(__dirname, '../src/data/reliableImages.js');
  fs.writeFileSync(imageMappingPath, imageMappingContent);
  console.log('✓ Created reliable image mappings file');
}

// Enhanced image component template
const enhancedImageComponentContent = `import React, { useState } from 'react';
import { getReliableImageUrl, getBackupImageUrl } from '../data/reliableImages';

interface ReliableImageProps {
  src: string;
  alt: string;
  className?: string;
  locationId?: number;
  onError?: () => void;
  onLoad?: () => void;
}

export const ReliableImage: React.FC<ReliableImageProps> = ({
  src,
  alt,
  className = '',
  locationId,
  onError,
  onLoad
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.warn('Image failed to load:', currentSrc);
    
    if (retryCount === 0 && locationId) {
      // Try reliable mapping first
      const reliableUrl = getReliableImageUrl(locationId);
      if (reliableUrl && reliableUrl !== currentSrc) {
        setCurrentSrc(reliableUrl);
        setRetryCount(1);
        return;
      }
    }
    
    if (retryCount === 1 && locationId) {
      // Try backup URL
      const backupUrl = getBackupImageUrl(locationId);
      if (backupUrl && backupUrl !== currentSrc) {
        setCurrentSrc(backupUrl);
        setRetryCount(2);
        return;
      }
    }
    
    // Final fallback
    setCurrentSrc('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80');
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
`;

async function createReliableImageComponent() {
  const componentPath = path.join(__dirname, '../src/components/ReliableImage.tsx');
  fs.writeFileSync(componentPath, enhancedImageComponentContent);
  console.log('✓ Created ReliableImage component');
}

async function main() {
  console.log('🚀 Starting reliable image replacement...\n');
  
  try {
    await updateSpreadsheetData();
    await createReliableImageComponent();
    
    console.log('\n✅ Reliable image replacement complete!');
    console.log('\nNext steps:');
    console.log('1. Replace <img> tags with <ReliableImage> components');
    console.log('2. Pass locationId prop for automatic fallbacks');
    console.log('3. Test all locations to ensure images load correctly');
    
  } catch (error) {
    console.error('❌ Failed to replace images:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { reliableImageMappings, updateSpreadsheetData };
