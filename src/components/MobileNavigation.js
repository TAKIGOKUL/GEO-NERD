import React from 'react';
import './MobileNavigation.css';

const MobileNavigation = ({ 
  currentRound, 
  maxRounds, 
  totalScore, 
  onMenuToggle, 
  onStatsToggle,
  onSettingsToggle,
  isMenuOpen 
}) => {
  return (
    <div className="mobile-navigation">
      {/* Top Status Bar */}
      <div className="mobile-status-bar">
        <div className="status-left">
          <button 
            className="menu-toggle-btn"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div className="game-progress">
            <span className="round-indicator">Round {currentRound}/{maxRounds}</span>
          </div>
        </div>
        
        <div className="status-right">
          <div className="score-display">
            <span className="score-value">{totalScore}</span>
            <span className="score-label">pts</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        <button 
          className="nav-item"
          onClick={onStatsToggle}
          aria-label="View statistics"
        >
          <div className="nav-icon">📊</div>
          <span className="nav-label">Stats</span>
        </button>
        
        <button 
          className="nav-item primary-action"
          aria-label="Submit guess"
        >
          <div className="nav-icon">🎯</div>
          <span className="nav-label">Guess</span>
        </button>
        
        <button 
          className="nav-item"
          onClick={onSettingsToggle}
          aria-label="Settings"
        >
          <div className="nav-icon">⚙️</div>
          <span className="nav-label">Settings</span>
        </button>
      </div>

      {/* Floating Action Button for Map Interaction */}
      <button 
        className="fab-map"
        aria-label="Center map on location"
      >
        <div className="fab-icon">📍</div>
      </button>
    </div>
  );
};

export default MobileNavigation;
