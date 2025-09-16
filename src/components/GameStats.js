import React from 'react';

const GameStats = ({ currentRound, maxRounds, totalScore, bestScore, roundScores, autoSkipTimer, showSkipTimer, onSkip }) => {
  const progressPercentage = (currentRound / maxRounds) * 100;
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="game-stats">
      <div className="round-progress">
        <div className="progress-ring">
          <svg className="progress-ring-svg" width="100" height="100">
            <circle
              className="progress-ring-bg"
              cx="50"
              cy="50"
              r="45"
              strokeWidth="8"
            />
            <circle
              className="progress-ring-fill"
              cx="50"
              cy="50"
              r="45"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="progress-content">
            <span className="progress-number">{currentRound}</span>
            <span className="progress-label">of {maxRounds}</span>
          </div>
        </div>
        <div className="progress-title-section">
          <span className="progress-title">Round</span>
          {showSkipTimer && (
            <div className="skip-timer-section">
              <div className="skip-timer-display">
                <span className="skip-timer-text">Auto-skip in: {autoSkipTimer}s</span>
                <button 
                  className="skip-button"
                  onClick={onSkip}
                  title="Skip to next round"
                >
                  Skip ⏭️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="score-display">
        <div className="score-item">
          <span className="score-value">{totalScore}</span>
          <span className="score-label">Total Score</span>
        </div>
        <div className="score-item">
          <span className="score-value">{bestScore}</span>
          <span className="score-label">Best Round</span>
        </div>
      </div>
      
      {roundScores && roundScores.length > 0 && (
        <div className="round-scores">
          <span className="round-scores-title">Round Scores:</span>
          <div className="score-list">
            {roundScores.map((round, index) => (
              <div key={index} className="round-score-item">
                <span className="round-number">R{round.round}</span>
                <span className="round-points">{round.score}pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;
