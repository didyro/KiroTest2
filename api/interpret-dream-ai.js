export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Soamnia, an AI dream interpreter that helps people understand their dreams and provides actionable micro-goals. 

Analyze the dream and respond with a JSON object containing:
- themes: array of 2-4 main themes (e.g., "adventure", "relationships", "growth")
- emotions: array of 2-4 emotions present (e.g., "excitement", "fear", "curiosity")  
- symbols: array of 2-4 key symbols (e.g., "water", "flying", "animals")
- interpretation: detailed interpretation paragraph (2-3 sentences)
- microGoals: array of exactly 3 specific, actionable micro-goals that relate to the dream's meaning

Keep responses insightful but concise. Focus on practical actions the person can take.`
          },
          {
            role: 'user',
            content: `Please interpret this dream: "${dreamText}"`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to structured parsing if needed
    let interpretation;
    try {
      interpretation = JSON.parse(aiResponse);
    } catch (parseError) {
      // Fallback: extract information from text response
      interpretation = {
        themes: ["mystery", "subconscious", "exploration"],
        emotions: ["curiosity", "wonder", "intrigue"],
        symbols: ["dreams", "mind", "journey"],
        interpretation: aiResponse.substring(0, 200) + "...",
        microGoals: [
          "Reflect on the emotions this dream brought up",
          "Journal about any connections to your waking life",
          "Pay attention to recurring dream themes"
        ]
      };
    }

    res.status(200).json(interpretation);

  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // Return fallback interpretation
    res.status(200).json({
      themes: ["subconscious", "exploration", "mystery"],
      emotions: ["curiosity", "wonder", "intrigue"],
      symbols: ["journey", "discovery", "hidden meanings"],
      interpretation: "Your dream contains rich symbolism that reflects your inner thoughts and desires. The imagery suggests you're processing important life experiences and seeking deeper understanding of yourself.",
      microGoals: [
        "Take 10 minutes today to reflect on what this dream might mean to you",
        "Write down any emotions or memories the dream triggered",
        "Consider how the dream's themes might relate to your current life situation"
      ],
      fallback: true
    });
  }
}