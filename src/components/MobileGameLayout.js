import React, { useState, useEffect } from 'react';
import './MobileGameLayout.css';

const MobileGameLayout = ({ 
  children, 
  currentRound, 
  maxRounds, 
  totalScore,
  onGuessSubmit,
  onNextRound,
  isGameActive 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Gesture handling for swipe navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && isGameActive) {
      // Swipe left to submit guess
      onGuessSubmit();
    }
    if (isRightSwipe && !isGameActive) {
      // Swipe right to go to next round
      onNextRound();
    }
  };

  // Haptic feedback simulation
  const triggerHaptic = (type = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 10, 10],
        error: [50, 50, 50]
      };
      navigator.vibrate(patterns[type] || [10]);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    triggerHaptic('light');
  };

  const handleStatsToggle = () => {
    setIsStatsOpen(!isStatsOpen);
    triggerHaptic('light');
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
    triggerHaptic('light');
  };

  const handleGuessSubmit = () => {
    triggerHaptic('success');
    onGuessSubmit();
  };

  const handleNextRound = () => {
    triggerHaptic('light');
    onNextRound();
  };

  return (
    <div 
      className="mobile-game-layout"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main Content Area */}
      <div className="mobile-content">
        {children}
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav-container">
        <div className="mobile-status-bar">
          <div className="status-left">
            <button 
              className="menu-toggle-btn"
              onClick={handleMenuToggle}
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
            onClick={handleStatsToggle}
            aria-label="View statistics"
          >
            <div className="nav-icon">📊</div>
            <span className="nav-label">Stats</span>
          </button>
          
          <button 
            className={`nav-item primary-action ${isGameActive ? 'guess-active' : 'next-active'}`}
            onClick={isGameActive ? handleGuessSubmit : handleNextRound}
            aria-label={isGameActive ? "Submit guess" : "Next round"}
          >
            <div className="nav-icon">
              {isGameActive ? '🎯' : '➡️'}
            </div>
            <span className="nav-label">
              {isGameActive ? 'Guess' : 'Next'}
            </span>
          </button>
          
          <button 
            className="nav-item"
            onClick={handleSettingsToggle}
            aria-label="Settings"
          >
            <div className="nav-icon">⚙️</div>
            <span className="nav-label">Settings</span>
          </button>
        </div>

        {/* Floating Action Button for Map */}
        <button 
          className="fab-map"
          aria-label="Center map on location"
          onClick={() => triggerHaptic('light')}
        >
          <div className="fab-icon">📍</div>
        </button>
      </div>

      {/* Gesture Hints */}
      <div className="gesture-hints">
        {isGameActive && (
          <div className="swipe-hint">
            <span className="hint-text">👈 Swipe left to submit guess</span>
          </div>
        )}
        {!isGameActive && (
          <div className="swipe-hint">
            <span className="hint-text">👉 Swipe right for next round</span>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <div className="menu-header">
              <h3>🌍 GEO-NERD</h3>
              <button 
                className="close-menu"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="menu-items">
              <button className="menu-item">
                <span className="menu-icon">🏠</span>
                <span>Home</span>
              </button>
              <button className="menu-item">
                <span className="menu-icon">🏆</span>
                <span>Leaderboard</span>
              </button>
              <button className="menu-item">
                <span className="menu-icon">👤</span>
                <span>Profile</span>
              </button>
              <button className="menu-item">
                <span className="menu-icon">ℹ️</span>
                <span>About</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileGameLayout;
