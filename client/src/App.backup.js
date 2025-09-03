// Backup of the full App.js - restore this once we fix the white screen
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate demo interpretation
      const demoInterpretations = [
        {
          themes: ["adventure", "freedom", "exploration"],
          emotions: ["excitement", "curiosity", "wonder"],
          symbols: ["flying", "mountains", "sky"],
          interpretation: "This dream suggests a desire for freedom and adventure in your life. The act of flying represents liberation from constraints, while the mountains symbolize challenges you're ready to overcome.",
          microGoals: [
            "Plan a weekend outdoor adventure",
            "Try a new activity that challenges your comfort zone",
            "Set a goal that feels slightly out of reach"
          ]
        },
        {
          themes: ["relationships", "communication", "connection"],
          emotions: ["love", "warmth", "belonging"],
          symbols: ["friends", "gathering", "home"],
          interpretation: "Your dream reflects the importance of relationships and connection in your life. It suggests a need for deeper bonds and meaningful conversations with those around you.",
          microGoals: [
            "Reach out to a friend you haven't spoken to recently",
            "Plan a gathering with people you care about",
            "Have a meaningful conversation with someone today"
          ]
        },
        {
          themes: ["growth", "transformation", "potential"],
          emotions: ["hope", "determination", "confidence"],
          symbols: ["water", "journey", "light"],
          interpretation: "This dream indicates you're in a period of personal growth and transformation. The symbols suggest you're ready to embrace change and discover new aspects of yourself.",
          microGoals: [
            "Start learning something you've always wanted to try",
            "Take one small step toward a personal goal",
            "Reflect on how you've grown in the past year"
          ]
        }
      ];

      const randomInterpretation = demoInterpretations[Math.floor(Math.random() * demoInterpretations.length)];
      setInterpretation({ ...randomInterpretation, dreamText, timestamp: new Date() });
      setCurrentView('interpretation');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to interpret dream. Please try again.');
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