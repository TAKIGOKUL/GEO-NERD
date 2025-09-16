import React from 'react';

const Results = ({ results, onNextRound, onEndGame, gameStats, countdown }) => {
  const { location, guesses, bestGuess } = results;

  const getDistanceColor = (distance) => {
    if (distance < 100) return '#00ff88'; // Excellent - Green
    if (distance < 1000) return '#ffd700'; // Good - Gold
    if (distance < 5000) return '#ff8c00'; // Fair - Orange
    return '#ff4444'; // Poor - Red
  };

  const getScoreColor = (score) => {
    if (score >= 8000) return '#00ff88'; // Excellent
    if (score >= 5000) return '#ffd700'; // Good
    if (score >= 2000) return '#ff8c00'; // Fair
    return '#ff4444'; // Poor
  };

  return (
    <div className="results-modal">
      <div className="results-content">
        {/* Header with auto-advance countdown */}
        <div className="results-header">
          <div className="header-content">
            <h2>🎯 Round Results</h2>
            {countdown > 0 && (
              <div className="auto-advance-countdown">
                <div className="countdown-circle">
                  <span className="countdown-number">{countdown}</span>
                </div>
                <span className="countdown-text">Auto-advancing to next round...</span>
              </div>
            )}
          </div>
        </div>

        <div className="results-body">
          {/* Main Results Display */}
          <div className="main-results-section">
            <div className="result-cards">
              <div className="result-card distance-card">
                <div className="card-icon">📍</div>
                <div className="card-content">
                  <div className="card-label">Your guess was</div>
                  <div 
                    className="card-value distance-value"
                    style={{ color: getDistanceColor(bestGuess.distance) }}
                  >
                    {Math.round(bestGuess.distance).toLocaleString()}km
                  </div>
                  <div className="card-sublabel">away from the correct location</div>
                </div>
              </div>

              <div className="result-card points-card">
                <div className="card-icon">⭐</div>
                <div className="card-content">
                  <div className="card-label">You earned</div>
                  <div 
                    className="card-value points-value"
                    style={{ color: getScoreColor(bestGuess.score) }}
                  >
                    {bestGuess.score}
                  </div>
                  <div className="card-sublabel">points</div>
                </div>
              </div>
            </div>

            <div className="location-revealed-banner">
              <div className="banner-icon">🎉</div>
              <span>Location revealed!</span>
            </div>
          </div>

          {/* Location Information */}
          <div className="location-info-section">
            <div className="location-header">
              <h3 className="location-name">{location.name}</h3>
              <div className="location-meta">
                <span className="location-place">{location.city}, {location.country}</span>
                <span className="location-category">{location.category}</span>
              </div>
            </div>
            <p className="location-description">{location.description}</p>
          </div>

          {/* Game Statistics */}
          <div className="game-stats-section">
            <h4 className="stats-title">📊 Game Statistics</h4>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{gameStats.totalScore || 0}</div>
                <div className="stat-label">Total Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{gameStats.bestScore || 0}</div>
                <div className="stat-label">Best Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{gameStats.roundsPlayed || 0}</div>
                <div className="stat-label">Rounds</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {gameStats.roundsPlayed > 0 
                    ? Math.round(gameStats.totalDistance / gameStats.roundsPlayed).toLocaleString()
                    : 0} km
                </div>
                <div className="stat-label">Avg Distance</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="results-actions">
            {location.wikipediaLink && (
              <a 
                href={location.wikipediaLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline wikipedia-btn"
              >
                <span className="btn-icon">📖</span>
                Learn More
              </a>
            )}
            <button onClick={onNextRound} className="btn btn-primary next-round-btn">
              <span className="btn-icon">➡️</span>
              Next Round
            </button>
            <button onClick={onEndGame} className="btn btn-secondary end-game-btn">
              <span className="btn-icon">🏁</span>
              End Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
