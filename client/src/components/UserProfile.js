import React, { useState } from 'react';

const UserProfile = ({ user, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username || '');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (newPin && newPin !== confirmPin) {
        setMessage('PINs do not match');
        setLoading(false);
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        username,
        hasPin: !!newPin || user.hasPin
      };

      onUpdateUser(updatedUser);
      localStorage.setItem('soamnia_user', JSON.stringify(updatedUser));
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setNewPin('');
      setConfirmPin('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('soamnia_user');
    onLogout();
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>👤 Profile Settings</h2>
        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      </div>

      <div className="profile-info">
        <div className="info-item">
          <label>🔑 Your Key:</label>
          <span className="key-display">{user.key}</span>
        </div>
        
        <div className="info-item">
          <label>👤 Username:</label>
          <span>{user.username || 'Not set'}</span>
        </div>
        
        <div className="info-item">
          <label>🔒 PIN Protection:</label>
          <span>{user.hasPin ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>

      {!isEditing ? (
        <button 
          onClick={() => setIsEditing(true)} 
          className="edit-button"
        >
          ✏️ Edit Profile
        </button>
      ) : (
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your display name..."
              className="profile-input"
            />
          </div>

          <div className="input-group">
            <label>New PIN (leave empty to keep current)</label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Enter new 4-digit PIN..."
              maxLength="4"
              className="profile-input"
            />
          </div>

          {newPin && (
            <div className="input-group">
              <label>Confirm New PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm new PIN..."
                maxLength="4"
                className="profile-input"
              />
            </div>
          )}

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" disabled={loading} className="save-button">
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                setUsername(user.username || '');
                setNewPin('');
                setConfirmPin('');
                setMessage('');
              }}
              className="cancel-button"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;