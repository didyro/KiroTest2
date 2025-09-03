import React, { useState, useRef } from 'react';

const DreamInput = ({ onSubmit, loading }) => {
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const textareaRef = useRef(null);

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsRecording(true);
    };

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setDreamText(transcript);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  const stopVoiceRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dreamText.trim()) {
      onSubmit(dreamText.trim());
    }
  };

  return (
    <div className="dream-input-container">
      <form onSubmit={handleSubmit}>
        <div className="input-section">
          <h2>🌙 Tell me about your dream</h2>
          <textarea
            ref={textareaRef}
            className="dream-textarea"
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="I dreamed that I was flying over a beautiful landscape..."
            disabled={loading}
          />
        </div>

        <div className="voice-section">
          <button
            type="button"
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={loading}
          >
            {isRecording ? (
              <>🔴 Stop Recording</>
            ) : (
              <>🎤 Record Dream</>
            )}
          </button>
          {isRecording && (
            <p style={{ marginTop: '1rem', color: '#667eea' }}>
              Listening... Speak your dream aloud
            </p>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!dreamText.trim() || loading}
        >
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Interpreting your dream...
            </div>
          ) : (
            '✨ Interpret My Dream'
          )}
        </button>
      </form>
    </div>
  );
};

export default DreamInput;