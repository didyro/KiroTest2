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

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('soamnia_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadUserDreams(userData.key);
    }
  }, []);

  const loadUserDreams = async (key) => {
    try {
      const response = await fetch(`/api/dreams?key=${encodeURIComponent(key)}`);
      if (response.ok) {
        const data = await response.json();
        setDreams(data.dreams);
      }
    } catch (error) {
      console.error('Error loading dreams:', error);
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
      const response = await fetch('/api/interpret-dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamText }),
      });

      if (!response.ok) {
        throw new Error('Failed to interpret dream');
      }

      const result = await response.json();
      setInterpretation({ ...result, dreamText, timestamp: new Date() });
      setCurrentView('interpretation');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to interpret dream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveDream = async (dreamData) => {
    if (!user) {
      // Fallback to local storage for non-authenticated users
      const newDream = { ...dreamData, id: Date.now() };
      setDreams(prev => [newDream, ...prev]);
      return;
    }

    try {
      const response = await fetch('/api/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: user.key,
          dream: dreamData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDreams(prev => [data.dream, ...prev]);
      }
    } catch (error) {
      console.error('Error saving dream:', error);
      alert('Failed to save dream. Please try again.');
    }
  };

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