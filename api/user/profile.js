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
    const { key, username, pin } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }
    
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    
    if (!userData[hashedKey]) {
      return res.status(401).json({ error: 'Invalid key' });
    }
    
    if (username !== undefined) userData[hashedKey].username = username;
    if (pin !== undefined) userData[hashedKey].pin = pin;
    
    res.json({ 
      success: true, 
      user: { 
        key: userData[hashedKey].key, 
        username: userData[hashedKey].username, 
        hasPin: !!userData[hashedKey].pin 
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
}