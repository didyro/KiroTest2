import React, { useState } from 'react';

const DreamJournal = ({ dreams, onViewDream, user }) => {
  const [selectedDream, setSelectedDream] = useState(null);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleViewDream = (dream) => {
    setSelectedDream(dream);
    setNotes(dream.notes || '');
    setIsEditingNotes(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedDream || !user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/dreams/${selectedDream.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: user.key,
          notes
        })
      });

      if (response.ok) {
        const updatedDream = { ...selectedDream, notes };
        setSelectedDream(updatedDream);
        setIsEditingNotes(false);
        // Trigger a refresh of the dreams list
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedDream) {
    return (
      <div className="dream-detail">
        <div className="dream-detail-header">
          <button 
            onClick={() => setSelectedDream(null)}
            className="back-button"
          >
            ← Back to Journal
          </button>
          <h2>📖 Dream Details</h2>
        </div>

        <div className="dream-detail-content">
          <div className="dream-section">
            <h3>🌙 Your Dream</h3>
            <p className="dream-text">"{selectedDream.dreamText}"</p>
            <p className="dream-date">{formatDate(selectedDream.timestamp || selectedDream.createdAt)}</p>
          </div>

          <div className="themes-emotions">
            <div>
              <h4>🎭 Themes & Symbols</h4>
              <div className="tag-list">
                {selectedDream.themes?.map((theme, index) => (
                  <span key={index} className="tag">{theme}</span>
                ))}
                {selectedDream.symbols?.map((symbol, index) => (
                  <span key={index} className="tag">{symbol}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h4>💭 Emotions</h4>
              <div className="tag-list">
                {selectedDream.emotions?.map((emotion, index) => (
                  <span key={index} className="tag">{emotion}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="dream-section">
            <h4>🔮 Interpretation</h4>
            <p>{selectedDream.interpretation}</p>
          </div>

          <div className="dream-section">
            <h4>🎯 Micro-Goals</h4>
            <ul className="micro-goals">
              {selectedDream.microGoals?.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>

          <div className="dream-section">
            <div className="notes-header">
              <h4>📝 Personal Notes</h4>
              {!isEditingNotes ? (
                <button 
                  onClick={() => setIsEditingNotes(true)}
                  className="edit-notes-button"
                >
                  ✏️ {selectedDream.notes ? 'Edit' : 'Add'} Notes
                </button>
              ) : (
                <div className="notes-actions">
                  <button 
                    onClick={handleSaveNotes}
                    disabled={loading}
                    className="save-notes-button"
                  >
                    {loading ? 'Saving...' : '💾 Save'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingNotes(false);
                      setNotes(selectedDream.notes || '');
                    }}
                    className="cancel-notes-button"
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
            
            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your personal thoughts, reflections, or additional insights about this dream..."
                className="notes-textarea"
                rows="4"
              />
            ) : (
              <div className="notes-display">
                {selectedDream.notes ? (
                  <p>{selectedDream.notes}</p>
                ) : (
                  <p className="no-notes">No notes added yet. Click "Add Notes" to add your thoughts!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (dreams.length === 0) {
    return (
      <div className="dream-journal">
        <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '2rem' }}>
          📖 Your Dream Journal
        </h2>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No dreams recorded yet</p>
          <p>Start by recording your first dream to build your personal dream journal!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dream-journal">
      <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '2rem' }}>
        📖 Your Dream Journal ({dreams.length} dreams)
      </h2>
      
      <div>
        {dreams.map((dream) => (
          <div 
            key={dream.id} 
            className="dream-entry"
            onClick={() => handleViewDream(dream)}
          >
            <div className="dream-preview">
              "{truncateText(dream.dreamText)}"
            </div>
            
            {dream.notes && (
              <div className="dream-notes-preview">
                📝 {truncateText(dream.notes, 50)}
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div className="dream-date">
                {formatDate(dream.timestamp || dream.createdAt)}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {dream.themes?.slice(0, 2).map((theme, index) => (
                  <span 
                    key={index} 
                    style={{ 
                      background: 'rgba(102, 126, 234, 0.2)', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '10px', 
                      fontSize: '0.8rem',
                      color: '#667eea'
                    }}
                  >
                    {theme}
                  </span>
                ))}
                {dream.themes?.length > 2 && (
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>
                    +{dream.themes.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DreamJournal;