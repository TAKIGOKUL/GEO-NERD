import React from 'react';
import { Location } from '../data/locations';
import { GameStats, RoundResult } from '../App';
import './ImagePanel.css';

interface ImagePanelProps {
  location: Location;
  guessCount: number;
  hasGuessed: boolean;
  showActualLocation: boolean;
  gameStats: GameStats;
  roundResults?: RoundResult;
  currentRound: number;
  maxRounds: number;
  countdown: number | null;
  onNextLocation: () => void;
  onRevealLocation: () => void;
}

const ImagePanel: React.FC<ImagePanelProps> = ({
  location,
  guessCount,
  hasGuessed,
  showActualLocation,
  gameStats,
  roundResults,
  currentRound,
  maxRounds,
  countdown,
  onNextLocation,
  onRevealLocation
}) => {
  const isDetailsBlurred = !hasGuessed || !showActualLocation;
  
  // Format countdown as minutes:seconds
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="image-panel">
      <div className="location-image">
        <img 
          src={location.imageUrl} 
          alt={location.name}
          key={location.id} // Force re-render with unique key to prevent flickering
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'none' // Prevent transition animations
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
          }}
          onLoad={(e) => {
            // Ensure image doesn't shift by maintaining aspect ratio
            (e.target as HTMLImageElement).style.opacity = '1';
          }}
          onLoadStart={(e) => {
            // Start with full opacity to prevent flashing
            (e.target as HTMLImageElement).style.opacity = '1';
          }}
        />
        
        {/* Auto-skip timer circle - only show when not guessed yet */}
        {!hasGuessed && !showActualLocation && (
          <div className="auto-skip-timer">
            <div className="timer-circle">
              <svg className="timer-svg" viewBox="0 0 100 100">
                <circle
                  className="timer-bg"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="8"
                />
                <circle
                  className="timer-progress"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - (countdown || 10) / 10)}`}
                  style={{
                    transition: 'stroke-dashoffset 1s linear',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%'
                  }}
                />
              </svg>
              <div className="timer-text">
                {countdown || 10}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="location-info">
        {!isDetailsBlurred && (
          <div className="location-details-section">
            <h3>{location.name}</h3>
            <div className="location-details">
              <span className="category">{location.category}</span>
              <span className="location-text">{location.city}, {location.country}</span>
            </div>
            
            <p className="description">{location.description}</p>
          </div>
        )}

        {/* Results Section */}
        {roundResults && showActualLocation && (
          <div className="round-results">
            <div className="result-header">
              <h4>Round Results</h4>
            </div>
            
            <div className="result-stats">
              <div className="distance-result">
                <span className="distance-label">Your guess was</span>
                <span className="distance-value">{Math.round(roundResults.bestGuess.distance)}km</span>
                <span className="distance-subtext">away from the correct location</span>
              </div>
              
              <div className="points-result">
                <span className="points-label">You earned</span>
                <span className="points-value">{roundResults.bestGuess.score}</span>
                <span className="points-subtext">points</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="location-actions">
          {hasGuessed && showActualLocation && (
            <a 
              href={location.wikipediaLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              📖 Wikipedia Link
            </a>
          )}
        </div>
        
        <div className="guess-controls">
          <div className="guess-status">
            {!showActualLocation && (
              <p className="guess-text">
                Click on the map to mark your location
              </p>
            )}
            {showActualLocation && (
              <p className="guess-text">
                Location revealed! Auto-advancing to next round...
              </p>
            )}
          </div>
          
          {countdown && countdown > 0 && showActualLocation && (
            <div className="countdown-display">
              <div className="countdown-circle">
                <span className="countdown-number">{formatCountdown(countdown)}</span>
              </div>
              <p className="countdown-text">Auto-advancing to next round...</p>
            </div>
          )}
          
          <div className="action-buttons">
            {showActualLocation && (
              <button 
                onClick={onNextLocation}
                className="btn btn-success"
              >
                {countdown && countdown > 0 
                  ? `Auto-advancing in ${formatCountdown(countdown)}...` 
                  : (currentRound >= maxRounds ? 'Finish Tournament' : 'Next Location')
                }
              </button>
            )}
          </div>
          
          <div className="game-metrics">
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Total Score</span>
                <span className="metric-value">{gameStats.totalScore}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Best Score</span>
                <span className="metric-value">{gameStats.bestScore}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Rounds</span>
                <span className="metric-value">{gameStats.roundsPlayed}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Avg Distance</span>
                <span className="metric-value">
                  {gameStats.roundsPlayed > 0 
                    ? Math.round(gameStats.totalDistance / gameStats.roundsPlayed) 
                    : 0} km
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePanel;
