const OpenAI = require('openai');

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dreamText } = req.body;
    
    if (!dreamText) {
      return res.status(400).json({ error: 'Dream text is required' });
    }

    // Check if OpenAI is configured
    if (!openai) {
      // Return a demo response when no API key is configured
      const demoResponse = {
        themes: ["adventure", "freedom", "friendship"],
        emotions: ["excitement", "joy", "wonder"],
        symbols: ["flying", "mountains", "companions"],
        interpretation: "This dream suggests a desire for freedom and adventure in your life. The act of flying represents liberation from constraints, while the mountains symbolize challenges you're ready to overcome. The presence of friends indicates the importance of companionship in your journey.",
        microGoals: [
          "Plan a weekend outdoor adventure with friends",
          "Try a new activity that challenges your comfort zone",
          "Reach out to a friend you haven't spoken to recently"
        ]
      };
      return res.json(demoResponse);
    }

    const prompt = `Analyze this dream and provide interpretation with actionable micro-goals:

Dream: "${dreamText}"

Please respond in this exact JSON format:
{
  "themes": ["theme1", "theme2", "theme3"],
  "emotions": ["emotion1", "emotion2"],
  "symbols": ["symbol1", "symbol2"],
  "interpretation": "A brief, insightful interpretation of the dream's meaning (2-3 sentences)",
  "microGoals": [
    "Specific actionable micro-goal 1",
    "Specific actionable micro-goal 2", 
    "Specific actionable micro-goal 3"
  ]
}

Focus on practical, achievable actions that connect to the dream's themes.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    const interpretation = JSON.parse(response);
    
    res.json(interpretation);
  } catch (error) {
    console.error('Error interpreting dream:', error);
    res.status(500).json({ error: 'Failed to interpret dream' });
  }
}