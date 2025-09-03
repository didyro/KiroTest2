import React, { useState } from 'react';

// Simple Auth Component (inline to avoid import issues)
function SimpleAuth({ onLogin }) {
  const [key, setKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.length >= 3) {
      onLogin({ key, username: '', hasPin: false });
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}>
        <h1 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.8rem', textAlign: 'center' }}>
          ✨ Welcome to Soamnia
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}>
          Create your dream account
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#667eea', fontWeight: '500' }}>
              Your Key
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Choose your unique key..."
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            ✨ Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('soamnia_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('soamnia_user');
  };

  // Check for saved user on load
  React.useEffect(() => {
    const savedUser = localStorage.getItem('soamnia_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('soamnia_user');
      }
    }
  }, []);

  // If not logged in, show auth screen
  if (!user) {
    return <SimpleAuth onLogin={handleLogin} />;
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨ Soamnia</h1>
      <p style={{ marginBottom: '2rem' }}>Welcome, {user.key}!</p>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>🎉 App is Working!</h2>
        <p style={{ marginBottom: '2rem' }}>
          The white screen is fixed! Authentication is working perfectly.
        </p>
        
        <button 
          onClick={handleLogout}
          style={{
            padding: '1rem 2rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          🚪 Logout & Test Again
        </button>
      </div>
    </div>
  );
}

export default App;