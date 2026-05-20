// Test script to verify web scraping functionality
// Using undici fetch which is built into Node.js 18+
const { fetch } = require('undici');

async function testUrlFetching() {
  const testUrls = [
    'https://example.com',
    'https://httpbin.org/user-agent',
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://techcrunch.com',
    'https://github.com'
  ];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
  };

  console.log('Testing URL fetching with comprehensive headers...\n');

  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      
      const startTime = Date.now();
      const response = await fetch(url, {
        headers,
        timeout: 30000
      });
      const endTime = Date.now();
      
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      console.log(`⏱️  Time: ${endTime - startTime}ms`);
      console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);
      
      if (response.ok) {
        const content = await response.text();
        console.log(`📏 Content Length: ${content.length} characters`);
        
        // Check if we got actual HTML content
        if (content.includes('<html') || content.includes('<!DOCTYPE')) {
          console.log('🎯 Got valid HTML content');
        } else if (content.includes('{') && content.includes('}')) {
          console.log('🎯 Got JSON content');
        } else {
          console.log('⚠️  Got unexpected content format');
        }
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('---\n');
  }
}

// Test the actual API endpoints
async function testApiEndpoints() {
  console.log('Testing actual API endpoints...\n');
  
  // Test URL validation
  try {
    console.log('Testing URL validation endpoint...');
    const testValidation = await fetch('http://localhost:3000/api/test-url-validation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' })
    });
    console.log(`URL Validation: ${testValidation.status}`);
  } catch (error) {
    console.log(`URL Validation Error: ${error.message}`);
  }
}

// Run tests
testUrlFetching().then(() => {
  console.log('URL fetching tests completed.');
}).catch(error => {
  console.error('Test failed:', error);
});

testApiEndpoints().then(() => {
  console.log('API endpoint tests completed.');
}).catch(error => {
  console.error('API test failed:', error);
});
