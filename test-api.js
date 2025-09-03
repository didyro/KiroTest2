// Simple test to verify the API is working
const fetch = require('node-fetch');

async function testAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/interpret-dream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dreamText: 'I was flying over mountains with friends'
      }),
    });

    const result = await response.json();
    console.log('✨ API Test Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

testAPI();