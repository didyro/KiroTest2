const crypto = require('crypto');

// Shared in-memory storage (in production, use a database)
let userData = {};

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

  try {
    const { key } = req.method === 'GET' ? req.query : req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }
    
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    
    if (!userData[hashedKey]) {
      return res.status(401).json({ error: 'Invalid key' });
    }

    if (req.method === 'GET') {
      // Get dreams
      res.json({ dreams: userData[hashedKey].dreams || [] });
    } else if (req.method === 'POST') {
      // Save dream
      const { dream } = req.body;
      
      const newDream = {
        ...dream,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        notes: dream.notes || ''
      };
      
      userData[hashedKey].dreams = userData[hashedKey].dreams || [];
      userData[hashedKey].dreams.unshift(newDream);
      
      res.json({ success: true, dream: newDream });
    } else if (req.method === 'PUT') {
      // Update dream
      const { dreamId, notes } = req.body;
      
      const dreamIndex = userData[hashedKey].dreams.findIndex(d => d.id === dreamId);
      if (dreamIndex === -1) {
        return res.status(404).json({ error: 'Dream not found' });
      }
      
      userData[hashedKey].dreams[dreamIndex].notes = notes;
      userData[hashedKey].dreams[dreamIndex].updatedAt = new Date().toISOString();
      
      res.json({ success: true, dream: userData[hashedKey].dreams[dreamIndex] });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Dreams API error:', error);
    res.status(500).json({ error: 'Operation failed' });
  }
}