const crypto = require('crypto');

// Shared in-memory storage (in production, use a database)
let userData = {};

function generateRandomKey() {
  const words = ['dream', 'star', 'moon', 'cloud', 'ocean', 'forest', 'magic', 'wonder', 'mystic', 'cosmic'];
  const numbers = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];
  return `${word1}-${word2}-${numbers}`;
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

  if (req.method === 'POST') {
    try {
      const { key, username, pin } = req.body;
      
      if (!key || key.length < 3) {
        return res.status(400).json({ error: 'Key must be at least 3 characters long' });
      }
      
      const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
      
      // Check if key already exists
      if (userData[hashedKey]) {
        return res.status(400).json({ error: 'This key is already taken. Please choose another one.' });
      }
      
      // Create new user data
      userData[hashedKey] = {
        key,
        username: username || '',
        pin: pin || null,
        dreams: [],
        createdAt: new Date().toISOString()
      };
      
      res.json({ 
        success: true, 
        message: 'Account created successfully!',
        user: { key, username: username || '', hasPin: !!pin }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  } else if (req.method === 'GET' && req.query.action === 'generate-key') {
    const randomKey = generateRandomKey();
    res.json({ key: randomKey });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}