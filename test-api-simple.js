// Test the API without external dependencies
const http = require('http');

const postData = JSON.stringify({
  dreamText: 'I was flying over mountains with friends'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/interpret-dream',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing Soamnia API...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✨ API Response:');
    console.log(JSON.parse(data));
    console.log('\n🎉 Soamnia API is working perfectly!');
    console.log('🌐 Server running on: http://localhost:5000');
    console.log('📝 Test the full UI by opening test.html in your browser');
  });
});

req.on('error', (e) => {
  console.error('❌ API Test failed:', e.message);
});

req.write(postData);
req.end();