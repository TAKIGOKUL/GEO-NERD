import React, { useState, useEffect } from 'react';
import './MobileImagePanel.css';

const MobileImagePanel = ({ 
  location, 
  roundResult, 
  distance, 
  points, 
  countdown, 
  onNextRound,
  isRevealed,
  hintLevel,
  onHintRequest 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Progressive disclosure - show details after image loads
  useEffect(() => {
    if (imageLoaded && isRevealed) {
      const timer = setTimeout(() => setShowDetails(true), 500);
      return () => clearTimeout(timer);
    }
  }, [imageLoaded, isRevealed]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(true);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleHintRequest = () => {
    if (onHintRequest) {
      onHintRequest();
    }
  };

  return (
    <div className="mobile-image-panel">
      {/* Image Container with Progressive Loading */}
      <div className="image-container">
        {!imageLoaded && (
          <div className="image-skeleton">
            <div className="skeleton-shimmer"></div>
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <span>Loading location...</span>
            </div>
          </div>
        )}
        
        <div className={`image-wrapper ${imageLoaded ? 'loaded' : 'loading'}`}>
          {location?.image && (
            <img
              src={location.image}
              alt={location.name || 'Location'}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="location-image"
              loading="lazy"
            />
          )}
          
          {/* Image Overlay with Progressive Disclosure */}
          <div className="image-overlay">
            {!isRevealed && (
              <div className="guess-overlay">
                <div className="blur-effect"></div>
                <div className="guess-prompt">
                  <h3>Where is this?</h3>
                  <p>Tap the map to make your guess</p>
                </div>
              </div>
            )}
            
            {isRevealed && (
              <div className="reveal-overlay">
                <div className="location-badge">
                  <span className="location-name">{location?.name}</span>
                  <span className="location-country">{location?.country}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progressive Information Disclosure */}
      <div className="info-section">
        {/* Basic Info - Always Visible */}
        <div className="basic-info">
          <div className="info-row">
            <span className="info-label">🔍 Difficulty</span>
            <div className="difficulty-stars">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`star ${i < (location?.difficulty || 3) ? 'active' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="info-row">
            <span className="info-label">🌍 Category</span>
            <span className="info-value">{location?.category || 'Unknown'}</span>
          </div>
        </div>

        {/* Expandable Details */}
        <button 
          className="expand-button"
          onClick={toggleExpanded}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          <span>More Details</span>
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="detailed-info">
            <div className="info-row">
              <span className="info-label">📍 Coordinates</span>
              <span className="info-value">
                {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}
              </span>
            </div>
            
            <div className="info-row">
              <span className="info-label">🏛️ Built</span>
              <span className="info-value">{location?.built || 'Unknown'}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">👥 UNESCO</span>
              <span className="info-value">{location?.unesco || 'No'}</span>
            </div>
            
            {location?.description && (
              <div className="description">
                <p>{location.description}</p>
              </div>
            )}
            
            {location?.wikipedia && (
              <a 
                href={location.wikipedia} 
                target="_blank" 
                rel="noopener noreferrer"
                className="wikipedia-link"
              >
                <span className="link-icon">📖</span>
                <span>Learn more on Wikipedia</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Hint System */}
      {!isRevealed && (
        <div className="hint-section">
          <button 
            className="hint-button"
            onClick={handleHintRequest}
            disabled={hintLevel >= 3}
          >
            <span className="hint-icon">💡</span>
            <span>Get Hint ({hintLevel}/3)</span>
          </button>
        </div>
      )}

      {/* Results Display */}
      {roundResult && (
        <div className="results-section">
          <div className="result-cards">
            <div className="result-card distance">
              <div className="result-icon">📏</div>
              <div className="result-content">
                <span className="result-label">Distance</span>
                <span className="result-value">{distance} km</span>
              </div>
            </div>
            
            <div className="result-card points">
              <div className="result-icon">⭐</div>
              <div className="result-content">
                <span className="result-label">Points</span>
                <span className="result-value">{points}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Countdown Timer */}
      {countdown > 0 && (
        <div className="countdown-section">
          <div className="countdown-circle">
            <span className="countdown-number">{countdown}</span>
          </div>
          <p className="countdown-text">Next round in {countdown}s</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        {!isRevealed && (
          <button 
            className="action-btn primary"
            onClick={() => {/* Handle guess submission */}}
          >
            <span className="btn-icon">🎯</span>
            <span>Submit Guess</span>
          </button>
        )}
        
        {isRevealed && countdown === 0 && (
          <button 
            className="action-btn primary"
            onClick={onNextRound}
          >
            <span className="btn-icon">➡️</span>
            <span>Next Round</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileImagePanel;
