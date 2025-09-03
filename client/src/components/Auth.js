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
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">✨ Welcome to Soamnia</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Login with your key' : 'Create your dream account'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Your Key</label>
            <div className="key-input-container">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={isLogin ? "Enter your key..." : "Choose your unique key..."}
                required
                className="key-input"
              />
              {!isLogin && (
                <button
                  type="button"
                  onClick={generateRandomKey}
                  className="dice-button"
                  title="Generate random key"
                >
                  🎲
                </button>
              )}
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>Username (Optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a display name..."
                className="auth-input"
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

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
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