import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import DreamInput from './components/DreamInput';
import DreamInterpretation from './components/DreamInterpretation';
import DreamJournal from './components/DreamJournal';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dreams, setDreams] = useState([]);
  const [currentView, setCurrentView] = useState('input');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Check for saved user session
      const savedUser = localStorage.getItem('soamnia_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        loadUserDreams(userData.key);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Error loading user data');
    }
  }, []);

  const loadUserDreams = (key) => {
    try {
      // Load dreams from localStorage
      const savedDreams = localStorage.getItem(`soamnia_dreams_${key}`);
      if (savedDreams) {
        setDreams(JSON.parse(savedDreams));
      }
    } catch (err) {
      console.error('Error loading dreams:', err);
      setDreams([]);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    loadUserDreams(userData.key);
  };

  const handleLogout = () => {
    setUser(null);
    setDreams([]);
    setCurrentView('input');
    setInterpretation(null);
  };

  const handleDreamSubmit = async (dreamText) => {
    setLoading(true);
    try {
      // Call OpenAI API directly from client
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || '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'}`
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

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
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

      setInterpretation({ 
        ...interpretation, 
        dreamText, 
        timestamp: new Date() 
      });
      setCurrentView('interpretation');
      
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      
      // Fallback to demo interpretation if API fails
      const fallbackInterpretations = [
        {
          themes: ["subconscious", "exploration", "mystery"],
          emotions: ["curiosity", "wonder", "intrigue"],
          symbols: ["journey", "discovery", "hidden meanings"],
          interpretation: "Your dream contains rich symbolism that reflects your inner thoughts and desires. The imagery suggests you're processing important life experiences and seeking deeper understanding of yourself.",
          microGoals: [
            "Take 10 minutes today to reflect on what this dream might mean to you",
            "Write down any emotions or memories the dream triggered",
            "Consider how the dream's themes might relate to your current life situation"
          ]
        }
      ];
      
      const fallback = fallbackInterpretations[0];
      setInterpretation({ ...fallback, dreamText, timestamp: new Date() });
      setCurrentView('interpretation');
      
      // Show user that we used fallback
      setTimeout(() => {
        alert('Note: Using offline interpretation due to API connection issue. For full AI analysis, check your internet connection.');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const saveDream = (dreamData) => {
    const newDream = { ...dreamData, id: Date.now() };
    const updatedDreams = [newDream, ...dreams];
    setDreams(updatedDreams);

    // Save to localStorage
    if (user) {
      localStorage.setItem(`soamnia_dreams_${user.key}`, JSON.stringify(updatedDreams));
    }
  };

  // Error fallback
  if (error) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>✨ Soamnia</h1>
        <p>Something went wrong. Let's start fresh!</p>
        <button
          onClick={() => {
            localStorage.clear();
            setError(null);
            setUser(null);
            setDreams([]);
          }}
          style={{
            padding: '1rem 2rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          🔄 Reset App
        </button>
      </div>
    );
  }

  // If not logged in, show auth screen
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">✨ Soamnia</h1>
        <p className="app-subtitle">Transform your dreams into reality</p>
        <div className="user-info">
          <span>Welcome, {user.username || user.key}!</span>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={currentView === 'input' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('input')}
        >
          New Dream
        </button>
        <button
          className={currentView === 'journal' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('journal')}
        >
          Dream Journal ({dreams.length})
        </button>
        <button
          className={currentView === 'profile' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('profile')}
        >
          Profile
        </button>
      </nav>

      <main className="app-main">
        {currentView === 'input' && (
          <DreamInput onSubmit={handleDreamSubmit} loading={loading} />
        )}

        {currentView === 'interpretation' && interpretation && (
          <DreamInterpretation
            interpretation={interpretation}
            onSave={saveDream}
            onNewDream={() => setCurrentView('input')}
          />
        )}

        {currentView === 'journal' && (
          <DreamJournal
            dreams={dreams}
            user={user}
            onViewDream={(dream) => {
              setInterpretation(dream);
              setCurrentView('interpretation');
            }}
            onUpdateDreams={setDreams}
          />
        )}

        {currentView === 'profile' && (
          <UserProfile
            user={user}
            onUpdateUser={setUser}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

export default App;