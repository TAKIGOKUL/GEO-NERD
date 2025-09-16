import React, { useState } from 'react';

const StartScreen = ({ onStart, gameMode, onModeChange, locationsCount }) => {
  const [selectedMode, setSelectedMode] = useState('tournament');

  const gameModes = [
    {
      id: 'tournament',
      name: 'Tournament',
      icon: '🏆',
      description: '5-round championship',
      color: 'var(--accent)'
    }
  ];

  const handleStart = () => {
    onStart(selectedMode);
  };

  return (
    <div className="start-screen">
      <div className="start-container">
        <div className="logo-section">
          <div className="logo-icon">🌍</div>
          <h1 className="brand-title">GeoGuess</h1>
          <p className="tagline">Guess locations. Earn points. Become a geography master.</p>
        </div>

        <div className="mode-selector">
          <h3 className="mode-title">Choose Your Challenge</h3>
          <div className="mode-options">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                className={`mode-option ${selectedMode === mode.id ? 'active' : ''}`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className="mode-icon" style={{ color: mode.color }}>
                  {mode.icon}
                </div>
                <div className="mode-info">
                  <span className="mode-name">{mode.name}</span>
                  <span className="mode-desc">{mode.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleStart} className="start-button">
          <span className="start-text">Start Playing</span>
          <div className="start-icon">→</div>
        </button>

        <div className="quick-info">
          <div className="info-item">
            <span className="info-icon">🎮</span>
            <span className="info-text">5 rounds per game</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🎯</span>
            <span className="info-text">One guess per location</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🏆</span>
            <span className="info-text">Earn up to 500 points</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;