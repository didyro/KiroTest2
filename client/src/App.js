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
      // Call our Vercel serverless function
      const response = await fetch('/api/interpret-dream-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamText })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const interpretation = await response.json();
      
      setInterpretation({ 
        ...interpretation, 
        dreamText, 
        timestamp: new Date() 
      });
      setCurrentView('interpretation');
      
      // Show message if using fallback
      if (interpretation.fallback) {
        setTimeout(() => {
          const debugInfo = interpretation.debug ? 
            `\n\nDebug Info:\n- Error: ${interpretation.debug.error}\n- Has API Key: ${interpretation.debug.hasApiKey}\n- Key Prefix: ${interpretation.debug.keyPrefix}` : '';
          alert(`Note: OpenAI API temporarily unavailable. Using intelligent fallback interpretation.${debugInfo}`);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error calling dream interpretation API:', error);
      
      // Final fallback if even our API fails
      const fallbackInterpretation = {
        themes: ["subconscious", "exploration", "mystery"],
        emotions: ["curiosity", "wonder", "intrigue"],
        symbols: ["journey", "discovery", "hidden meanings"],
        interpretation: "Your dream contains rich symbolism that reflects your inner thoughts and desires. The imagery suggests you're processing important life experiences and seeking deeper understanding of yourself.",
        microGoals: [
          "Take 10 minutes today to reflect on what this dream might mean to you",
          "Write down any emotions or memories the dream triggered",
          "Consider how the dream's themes might relate to your current life situation"
        ]
      };
      
      setInterpretation({ ...fallbackInterpretation, dreamText, timestamp: new Date() });
      setCurrentView('interpretation');
      
      // Show user that we used fallback
      setTimeout(() => {
        alert('Note: Connection issue detected. Using offline interpretation mode.');
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