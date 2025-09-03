import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [key, setKey] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRandomKey = () => {
    const words = ['dream', 'star', 'moon', 'cloud', 'ocean', 'forest', 'magic', 'wonder', 'mystic', 'cosmic'];
    const numbers = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    setKey(`${word1}-${word2}-${numbers}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && pin && pin !== confirmPin) {
        setError('PINs do not match');
        setLoading(false);
        return;
      }

      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo: accept any key
      if (!key || key.length < 3) {
        setError('Key must be at least 3 characters long');
        setLoading(false);
        return;
      }

      const userData = {
        key,
        username: username || '',
        hasPin: !!pin
      };

      localStorage.setItem('soamnia_user', JSON.stringify(userData));
      onLogin(userData);
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div className="auth-card" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}>
        <h1 className="auth-title" style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.8rem' }}>
          ✨ Welcome to Soamnia
        </h1>
        <p className="auth-subtitle" style={{ color: '#666', marginBottom: '2rem' }}>
          {isLogin ? 'Login with your key' : 'Create your dream account'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#667eea', fontWeight: '500' }}>
              Your Key
            </label>
            <div className="key-input-container" style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={isLogin ? "Enter your key..." : "Choose your unique key..."}
                required
                className="key-input"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
              />
              {!isLogin && (
                <button
                  type="button"
                  onClick={generateRandomKey}
                  className="dice-button"
                  title="Generate random key"
                  style={{
                    padding: '0.75rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  🎲
                </button>
              )}
            </div>
          </div>

          {!isLogin && (
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#667eea', fontWeight: '500' }}>
                Username (Optional)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a display name..."
                className="auth-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          <div className="input-group">
            <label>PIN (Optional)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={isLogin ? "Enter PIN if you have one..." : "Set a 4-digit PIN (optional)..."}
              maxLength="4"
              className="auth-input"
            />
          </div>

          {!isLogin && pin && (
            <div className="input-group">
              <label>Confirm PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm your PIN..."
                maxLength="4"
                className="auth-input"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            className="auth-button"
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '1rem'
            }}
          >
            {loading ? (
              <div className="loading">
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </div>
            ) : (
              isLogin ? '🔑 Login' : '✨ Create Account'
            )}
          </button>
        </form>

        <div className="auth-switch">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setPin('');
              setConfirmPin('');
            }}
            className="switch-button"
          >
            {isLogin ? "Don't have a key? Create account" : "Already have a key? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;