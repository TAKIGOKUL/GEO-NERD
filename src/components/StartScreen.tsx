import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (mode: string, playerId: string) => void;
  gameMode: string;
  onModeChange: (mode: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, gameMode, onModeChange }) => {
  const [selectedMode, setSelectedMode] = useState<string>('classic');
  const [playerId, setPlayerId] = useState<string>('');
  const [showPlayerIdPrompt, setShowPlayerIdPrompt] = useState<boolean>(false);

  const gameModes = [
    {
      id: 'classic',
      name: 'Classic',
      icon: '🌍',
      description: 'Traditional geography challenge',
      color: 'var(--accent-primary)',
      rounds: 5
    }
  ];

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    onModeChange(modeId);
  };

  const handleStart = () => {
    if (!playerId.trim()) {
      setShowPlayerIdPrompt(true);
      return;
    }
    onStart(selectedMode, playerId);
  };

  const handlePlayerIdSubmit = () => {
    if (playerId.trim()) {
      onStart(selectedMode, playerId);
    }
  };

  const selectedModeData = gameModes.find(mode => mode.id === selectedMode);

  return (
    <div className="start-screen">
      <div className="start-container">
        {/* Logo Section */}
        <div className="logo-section animate-fade-in">
          <div className="logo-icon">🌍</div>
          <h1 className="brand-title">Geo-Nerd</h1>
          <p className="tagline">Master the World, One Location at a Time</p>
        </div>

        {/* Mode Selector */}
        <div className="mode-selector animate-fade-in">
          <h3 className="mode-title">Choose Your Challenge</h3>
          <div className="mode-options">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                className={`mode-option glass glass-hover ${
                  selectedMode === mode.id ? 'active' : ''
                }`}
                onClick={() => handleModeSelect(mode.id)}
                style={{
                  borderColor: selectedMode === mode.id ? mode.color : 'var(--glass-border)',
                  boxShadow: selectedMode === mode.id ? `0 0 0 2px ${mode.color}20` : 'var(--glass-shadow)'
                }}
              >
                <div className="mode-icon" style={{ color: mode.color }}>
                  {mode.icon}
                </div>
                <div className="mode-info">
                  <span className="mode-name">{mode.name}</span>
                  <span className="mode-desc">{mode.description}</span>
                  <span className="mode-rounds">{mode.rounds} rounds</span>
                </div>
                {selectedMode === mode.id && (
                  <div className="mode-check">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Player ID Input */}
        <div className="player-id-section animate-fade-in">
          <div className="input-group">
            <label htmlFor="playerId" className="input-label">Enter Your Player ID</label>
            <input
              id="playerId"
              type="text"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="Enter your unique player ID"
              className="player-id-input"
              onKeyPress={(e) => e.key === 'Enter' && handlePlayerIdSubmit()}
            />
            {showPlayerIdPrompt && !playerId.trim() && (
              <p className="error-message">Please enter your Player ID to continue</p>
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className="start-section animate-fade-in">
          <button onClick={handleStart} className="start-button btn btn-primary">
            <span className="start-text">Start Playing</span>
            <div className="start-icon">→</div>
          </button>
        </div>

        {/* Quick Info */}
        <div className="quick-info animate-fade-in">
          <div className="info-item">
            <span className="info-icon">🎮</span>
            <span className="info-text">{selectedModeData?.rounds || 5} rounds per game</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🎯</span>
            <span className="info-text">One guess per location</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🏆</span>
            <span className="info-text">Earn up to {selectedModeData?.rounds ? selectedModeData.rounds * 100 : 500} points</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
