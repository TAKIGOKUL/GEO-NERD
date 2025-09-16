#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Import the spreadsheet data
const { spreadsheetLocations } = require('../src/data/spreadsheetData.js');

const imagesDir = path.join(__dirname, '../public/images/locations');
const downloadedImagesFile = path.join(imagesDir, 'downloaded.json');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Load previously downloaded images list
let downloadedImages = {};
if (fs.existsSync(downloadedImagesFile)) {
  try {
    downloadedImages = JSON.parse(fs.readFileSync(downloadedImagesFile, 'utf8'));
  } catch (error) {
    console.warn('Could not load downloaded images list:', error.message);
  }
}

// Function to get file extension from URL or content type
const getFileExtension = (url, contentType) => {
  // Try to get extension from URL first
  const urlPath = new URL(url).pathname;
  const urlExt = path.extname(urlPath).toLowerCase();
  if (urlExt && ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(urlExt)) {
    return urlExt;
  }
  
  // Fall back to content type
  if (contentType) {
    if (contentType.includes('jpeg')) return '.jpg';
    if (contentType.includes('jpg')) return '.jpg';
    if (contentType.includes('png')) return '.png';
    if (contentType.includes('gif')) return '.gif';
    if (contentType.includes('webp')) return '.webp';
  }
  
  return '.jpg'; // Default fallback
};

// Function to sanitize filename
const sanitizeFilename = (name) => {
  return name
    .replace(/[^a-zA-Z0-9\s\-_.]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toLowerCase()
    .substring(0, 50); // Limit length
};

// Function to download a single image
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const request = protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      const contentType = response.headers['content-type'];
      const extension = getFileExtension(url, contentType);
      const finalFilename = filename + extension;
      const filePath = path.join(imagesDir, finalFilename);
      
      const fileStream = fs.createWriteStream(filePath);
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded: ${finalFilename}`);
        resolve(finalFilename);
      });
      
      fileStream.on('error', (error) => {
        fs.unlink(filePath, () => {}); // Delete incomplete file
        reject(error);
      });
    });
    
    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
};

// Function to convert Wikipedia URLs to better formats
const getBestImageUrl = (originalUrl) => {
  if (!originalUrl) return null;
  
  // If already a direct image URL, use it
  if (originalUrl.includes('upload.wikimedia.org') || originalUrl.includes('images.unsplash.com')) {
    return originalUrl;
  }
  
  // Convert Special:FilePath URLs
  if (originalUrl.includes('Special:FilePath/')) {
    const fileName = originalUrl.split('Special:FilePath/')[1];
    if (fileName) {
      // Try multiple formats
      return [
        `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(fileName)}&width=800`,
        `https://upload.wikimedia.org/wikipedia/commons/${encodeURIComponent(fileName)}`,
        originalUrl
      ];
    }
  }
  
  return originalUrl;
};

// Main download function
async function downloadAllImages() {
  console.log(`Starting download of ${spreadsheetLocations.length} location images...`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const location of spreadsheetLocations) {
    const sanitizedName = sanitizeFilename(location.name);
    const imageId = `${location.id}_${sanitizedName}`;
    
    // Skip if already downloaded
    if (downloadedImages[location.id]) {
      console.log(`⏭ Skipping ${location.name} (already downloaded)`);
      skipCount++;
      continue;
    }
    
    console.log(`\nDownloading image for: ${location.name}`);
    
    const urls = getBestImageUrl(location.imageUrl);
    const urlsToTry = Array.isArray(urls) ? urls : [urls];
    
    let downloaded = false;
    
    for (const url of urlsToTry) {
      if (!url) continue;
      
      try {
        console.log(`  Trying: ${url}`);
        const filename = await downloadImage(url, imageId);
        
        // Update downloaded images record
        downloadedImages[location.id] = {
          name: location.name,
          originalUrl: location.imageUrl,
          downloadedUrl: url,
          localFilename: filename,
          downloadedAt: new Date().toISOString()
        };
        
        successCount++;
        downloaded = true;
        break;
      } catch (error) {
        console.log(`  ✗ Failed: ${error.message}`);
      }
    }
    
    if (!downloaded) {
      console.log(`  ✗ All download attempts failed for ${location.name}`);
      errorCount++;
    }
    
    // Save progress periodically
    if ((successCount + errorCount) % 10 === 0) {
      fs.writeFileSync(downloadedImagesFile, JSON.stringify(downloadedImages, null, 2));
      console.log(`\nProgress saved. Success: ${successCount}, Errors: ${errorCount}, Skipped: ${skipCount}`);
    }
    
    // Small delay to be respectful to servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Final save
  fs.writeFileSync(downloadedImagesFile, JSON.stringify(downloadedImages, null, 2));
  
  console.log(`\n=== Download Complete ===`);
  console.log(`Successful downloads: ${successCount}`);
  console.log(`Skipped (already downloaded): ${skipCount}`);
  console.log(`Failed downloads: ${errorCount}`);
  console.log(`Total locations: ${spreadsheetLocations.length}`);
  
  // Generate updated spreadsheet data with local URLs
  generateUpdatedSpreadsheetData();
}

// Function to generate updated spreadsheet data with local URLs
function generateUpdatedSpreadsheetData() {
  console.log('\nGenerating updated spreadsheet data with local URLs...');
  
  const updatedLocations = spreadsheetLocations.map(location => {
    const downloaded = downloadedImages[location.id];
    if (downloaded) {
      return {
        ...location,
        imageUrl: `/images/locations/${downloaded.localFilename}`,
        originalImageUrl: location.imageUrl, // Keep original as backup
        localImageAvailable: true
      };
    }
    return {
      ...location,
      localImageAvailable: false
    };
  });
  
  const outputContent = `// Spreadsheet data with local image fallbacks
// Generated automatically by downloadImages.js

export const spreadsheetLocationsWithLocal = ${JSON.stringify(updatedLocations, null, 2)};

// Image download metadata
export const imageDownloadMetadata = ${JSON.stringify(downloadedImages, null, 2)};
`;
  
  const outputFile = path.join(__dirname, '../src/data/spreadsheetDataLocal.js');
  fs.writeFileSync(outputFile, outputContent);
  
  console.log(`✓ Updated spreadsheet data saved to: ${outputFile}`);
}

// Handle command line execution
if (require.main === module) {
  downloadAllImages().catch(error => {
    console.error('Download script failed:', error);
    process.exit(1);
  });
}

module.exports = { downloadAllImages, downloadedImages };
