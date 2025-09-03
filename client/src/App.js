import React, { useState } from 'react';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('soamnia_user');
  };

  // If not logged in, show auth screen
  if (!user) {
    return <Auth onLogin={handleLogin} />;
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
      <p style={{ marginBottom: '2rem' }}>Welcome, {user.username || user.key}!</p>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>🎉 App is Working!</h2>
        <p style={{ marginBottom: '2rem' }}>
          The white screen is fixed! Your authentication is working perfectly.
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