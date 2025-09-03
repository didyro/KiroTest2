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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key, pin } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }
    
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    const user = userData[hashedKey];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid key' });
    }
    
    // Check PIN if user has one set
    if (user.pin && user.pin !== pin) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    
    res.json({ 
      success: true, 
      user: { 
        key: user.key, 
        username: user.username, 
        hasPin: !!user.pin 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}