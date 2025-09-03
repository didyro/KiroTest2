// Test AI integration status
const http = require('http');

const testDreams = [
  "I was flying over a dark forest and suddenly fell into a deep hole",
  "I found myself in my childhood home but everything was different colors",
  "I was giving a presentation but I was completely naked"
];

function testDream(dreamText, index) {
  const postData = JSON.stringify({ dreamText });

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

  console.log(`\n🧪 Test ${index + 1}: "${dreamText}"`);

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✨ Themes:', result.themes.join(', '));
        console.log('💭 Emotions:', result.emotions.join(', '));
        console.log('🔮 Interpretation:', result.interpretation);
        console.log('🎯 Micro-Goals:');
        result.microGoals.forEach((goal, i) => {
          console.log(`   ${i + 1}. ${goal}`);
        });
        
        // Check if it's using demo mode or real AI
        if (result.themes.includes('adventure') && result.themes.includes('freedom')) {
          console.log('📝 Status: Using DEMO responses (add OpenAI API key for real AI)');
        } else {
          console.log('🤖 Status: Using REAL AI responses!');
        }
      } catch (e) {
        console.log('❌ Error parsing response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request failed:', e.message);
  });

  req.write(postData);
  req.end();
}

console.log('🔍 Testing AI Integration Status...');
testDream(testDreams[0], 0);

setTimeout(() => testDream(testDreams[1], 1), 1000);
setTimeout(() => testDream(testDreams[2], 2), 2000);