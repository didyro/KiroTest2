const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Dream interpretation endpoint
app.post('/api/interpret-dream', async (req, res) => {
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
});

// Simple file-based storage for user data
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Helper functions
function getUserDataPath(key) {
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
  return path.join(DATA_DIR, `${hashedKey}.json`);
}

function loadUserData(key) {
  try {
    const filePath = getUserDataPath(key);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  return null;
}

function saveUserData(key, data) {
  try {
    const filePath = getUserDataPath(key);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
}

function generateRandomKey() {
  const words = ['dream', 'star', 'moon', 'cloud', 'ocean', 'forest', 'magic', 'wonder', 'mystic', 'cosmic'];
  const numbers = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];
  return `${word1}-${word2}-${numbers}`;
}

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { key, username, pin } = req.body;
    
    if (!key || key.length < 3) {
      return res.status(400).json({ error: 'Key must be at least 3 characters long' });
    }
    
    // Check if key already exists
    const existingData = loadUserData(key);
    if (existingData) {
      return res.status(400).json({ error: 'This key is already taken. Please choose another one.' });
    }
    
    // Create new user data
    const userData = {
      key,
      username: username || '',
      pin: pin || null,
      dreams: [],
      createdAt: new Date().toISOString()
    };
    
    if (saveUserData(key, userData)) {
      res.json({ 
        success: true, 
        message: 'Account created successfully!',
        user: { key, username: userData.username, hasPin: !!pin }
      });
    } else {
      res.status(500).json({ error: 'Failed to create account' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { key, pin } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }
    
    const userData = loadUserData(key);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid key' });
    }
    
    // Check PIN if user has one set
    if (userData.pin && userData.pin !== pin) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    
    res.json({ 
      success: true, 
      user: { 
        key: userData.key, 
        username: userData.username, 
        hasPin: !!userData.pin 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/generate-key', (req, res) => {
  const randomKey = generateRandomKey();
  res.json({ key: randomKey });
});

// User profile endpoints
app.post('/api/user/update-profile', (req, res) => {
  try {
    const { key, username, pin } = req.body;
    
    const userData = loadUserData(key);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid key' });
    }
    
    if (username !== undefined) userData.username = username;
    if (pin !== undefined) userData.pin = pin;
    
    if (saveUserData(key, userData)) {
      res.json({ 
        success: true, 
        user: { 
          key: userData.key, 
          username: userData.username, 
          hasPin: !!userData.pin 
        }
      });
    } else {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Dream management endpoints
app.get('/api/dreams', (req, res) => {
  try {
    const { key } = req.query;
    
    const userData = loadUserData(key);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid key' });
    }
    
    res.json({ dreams: userData.dreams || [] });
  } catch (error) {
    console.error('Get dreams error:', error);
    res.status(500).json({ error: 'Failed to load dreams' });
  }
});

app.post('/api/dreams', (req, res) => {
  try {
    const { key, dream } = req.body;
    
    const userData = loadUserData(key);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid key' });
    }
    
    const newDream = {
      ...dream,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      notes: dream.notes || ''
    };
    
    userData.dreams = userData.dreams || [];
    userData.dreams.unshift(newDream);
    
    if (saveUserData(key, userData)) {
      res.json({ success: true, dream: newDream });
    } else {
      res.status(500).json({ error: 'Failed to save dream' });
    }
  } catch (error) {
    console.error('Save dream error:', error);
    res.status(500).json({ error: 'Failed to save dream' });
  }
});

app.put('/api/dreams/:dreamId', (req, res) => {
  try {
    const { key, notes } = req.body;
    const { dreamId } = req.params;
    
    const userData = loadUserData(key);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid key' });
    }
    
    const dreamIndex = userData.dreams.findIndex(d => d.id === dreamId);
    if (dreamIndex === -1) {
      return res.status(404).json({ error: 'Dream not found' });
    }
    
    userData.dreams[dreamIndex].notes = notes;
    userData.dreams[dreamIndex].updatedAt = new Date().toISOString();
    
    if (saveUserData(key, userData)) {
      res.json({ success: true, dream: userData.dreams[dreamIndex] });
    } else {
      res.status(500).json({ error: 'Failed to update dream' });
    }
  } catch (error) {
    console.error('Update dream error:', error);
    res.status(500).json({ error: 'Failed to update dream' });
  }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`🌟 Soamnia is ready!`);
  console.log(`📱 Open http://localhost:${PORT} to access the app`);
});