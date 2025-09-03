export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const keyPrefix = process.env.OPENAI_API_KEY ? 
      process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'none';

    // Test a simple OpenAI call
    if (hasApiKey) {
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });

      res.status(200).json({
        hasApiKey,
        keyPrefix,
        testCallStatus: testResponse.status,
        testCallOk: testResponse.ok,
        message: testResponse.ok ? 'API key is working!' : 'API key test failed'
      });
    } else {
      res.status(200).json({
        hasApiKey,
        keyPrefix,
        message: 'No API key found in environment variables'
      });
    }
  } catch (error) {
    res.status(200).json({
      hasApiKey: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY ? 
        process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'none',
      error: error.message,
      message: 'Error testing API key'
    });
  }
}