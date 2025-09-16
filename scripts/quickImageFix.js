#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Quick fix for immediate image issues
const problematicImages = [
  {
    id: 10,
    name: 'Pamukkale Terraces',
    originalUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Pamukkale_30.jpg',
    workingUrls: [
      'https://commons.wikimedia.org/w/thumb.php?f=Pamukkale_30.jpg&width=800',
      'https://upload.wikimedia.org/wikipedia/commons/5/50/Pamukkale_30.jpg',
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80' // Unsplash fallback
    ],
    filename: '10_pamukkale_terraces.jpg'
  },
  {
    id: 1,
    name: 'Chefchaouen Blue Streets',
    originalUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Chefchaouen_%2852189357475%29.jpg',
    workingUrls: [
      'https://commons.wikimedia.org/w/thumb.php?f=Chefchaouen_%2852189357475%29.jpg&width=800',
      'https://images.unsplash.com/photo-1539650116574-75c0c6d0cd3d?w=800&q=80' // Chefchaouen from Unsplash
    ],
    filename: '1_chefchaouen_blue_streets.jpg'
  },
  {
    id: 2,
    name: 'Hallstatt Village',
    originalUrl: 'https://en.wikipedia.org/wiki/Special:FilePath/Hallstatt_-_Zentrum_.JPG',
    workingUrls: [
      'https://commons.wikimedia.org/w/thumb.php?f=Hallstatt_-_Zentrum_.JPG&width=800',
      'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80' // Hallstatt from Unsplash
    ],
    filename: '2_hallstatt_village.jpg'
  }
];

const imagesDir = path.join(__dirname, '../public/images/locations');

// Ensure directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${filename} already exists`);
      resolve(filename);
      return;
    }
    
    console.log(`Downloading ${filename}...`);
    
    const request = https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve(filename);
      });
      
      fileStream.on('error', (error) => {
        fs.unlink(filePath, () => {}); // Delete incomplete file
        reject(error);
      });
    });
    
    request.on('error', reject);
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

async function quickFix() {
  console.log('Quick image fix: downloading problematic images locally...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const image of problematicImages) {
    let downloaded = false;
    
    for (const url of image.workingUrls) {
      try {
        console.log(`Trying URL for ${image.name}: ${url}`);
        await downloadImage(url, image.filename);
        successCount++;
        downloaded = true;
        break;
      } catch (error) {
        console.log(`  ✗ Failed: ${error.message}`);
      }
    }
    
    if (!downloaded) {
      console.error(`✗ All download attempts failed for ${image.name}`);
      errorCount++;
    }
  }
  
  console.log(`\n=== Quick Fix Complete ===`);
  console.log(`Success: ${successCount}, Errors: ${errorCount}`);
  
  if (successCount > 0) {
    console.log('\nImages downloaded to: public/images/locations/');
    console.log('You can now use these local images as fallbacks.');
    
    // Create a simple manifest file
    const manifest = {};
    problematicImages.forEach(img => {
      manifest[img.id] = {
        name: img.name,
        filename: img.filename,
        localPath: `/images/locations/${img.filename}`
      };
    });
    
    fs.writeFileSync(
      path.join(imagesDir, 'manifest.json'), 
      JSON.stringify(manifest, null, 2)
    );
    console.log('✓ Created manifest.json for local images');
  }
}

// Run the quick fix
if (require.main === module) {
  quickFix().catch(error => {
    console.error('Quick fix failed:', error);
    process.exit(1);
  });
}

module.exports = { quickFix, problematicImages };
