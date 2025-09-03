import React, { useState } from 'react';

const DreamInterpretation = ({ interpretation, onSave, onNewDream }) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(interpretation);
    setSaved(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Dream Interpretation - Soamnia',
          text: `Dream: ${interpretation.dreamText}\n\nInterpretation: ${interpretation.interpretation}\n\nMicro-goals: ${interpretation.microGoals.join(', ')}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `Dream: ${interpretation.dreamText}\n\nInterpretation: ${interpretation.interpretation}\n\nMicro-goals:\n${interpretation.microGoals.map(goal => `• ${goal}`).join('\n')}`;
      navigator.clipboard.writeText(text);
      alert('Dream interpretation copied to clipboard!');
    }
  };

  return (
    <div className="interpretation-container">
      <div className="interpretation-section">
        <h3>🌟 Your Dream</h3>
        <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#666' }}>
          "{interpretation.dreamText}"
        </p>
      </div>

      <div className="themes-emotions">
        <div>
          <h3>🎭 Themes & Symbols</h3>
          <div className="tag-list">
            {interpretation.themes?.map((theme, index) => (
              <span key={index} className="tag">{theme}</span>
            ))}
            {interpretation.symbols?.map((symbol, index) => (
              <span key={index} className="tag">{symbol}</span>
            ))}
          </div>
        </div>
        
        <div>
          <h3>💭 Emotions</h3>
          <div className="tag-list">
            {interpretation.emotions?.map((emotion, index) => (
              <span key={index} className="tag">{emotion}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="interpretation-section">
        <h3>🔮 Dream Meaning</h3>
        <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
          {interpretation.interpretation}
        </p>
      </div>

      <div className="interpretation-section">
        <h3>🎯 Your Real-Life Action Plan</h3>
        <ul className="micro-goals">
          {interpretation.microGoals?.map((goal, index) => (
            <li key={index}>
              <strong>Goal {index + 1}:</strong> {goal}
            </li>
          ))}
        </ul>
      </div>

      <div className="action-buttons">
        <button 
          className="action-btn secondary"
          onClick={onNewDream}
        >
          🌙 New Dream
        </button>
        
        <button 
          className="action-btn primary"
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? '✅ Saved!' : '💾 Save to Journal'}
        </button>
        
        <button 
          className="action-btn secondary"
          onClick={handleShare}
        >
          📤 Share
        </button>
      </div>
    </div>
  );
};

export default DreamInterpretation;