#!/usr/bin/env node

const https = require('https');
const { spreadsheetLocations } = require('../src/data/spreadsheetData.js');

async function testImageUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      resolve({
        url,
        status: response.statusCode,
        contentType: response.headers['content-type'],
        success: response.statusCode === 200
      });
    });
    
    request.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        error: error.message,
        success: false
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        error: 'Request timeout',
        success: false
      });
    });
  });
}

async function testAllImages() {
  console.log('🧪 Testing all location images...\n');
  
  let successCount = 0;
  let failCount = 0;
  const failedImages = [];
  
  for (const location of spreadsheetLocations.slice(0, 10)) { // Test first 10
    process.stdout.write(`Testing ${location.name}... `);
    
    const result = await testImageUrl(location.imageUrl);
    
    if (result.success) {
      console.log('✅ OK');
      successCount++;
    } else {
      console.log(`❌ FAILED (${result.status})`);
      failCount++;
      failedImages.push({
        name: location.name,
        url: location.imageUrl,
        error: result.error || result.status
      });
    }
    
    // Small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Results:`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (failedImages.length > 0) {
    console.log('\n❌ Failed images:');
    failedImages.forEach(img => {
      console.log(`  - ${img.name}: ${img.error}`);
    });
  } else {
    console.log('\n🎉 All images are working perfectly!');
  }
}

if (require.main === module) {
  testAllImages().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}
