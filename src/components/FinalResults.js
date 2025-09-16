import React from 'react';

const FinalResults = ({ roundScores, totalScore, onNewGame }) => {
  const averageScore = Math.round(totalScore / roundScores.length);
  const maxPossibleScore = roundScores.length * 100;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: "Geography Master", color: "#00ff88", emoji: "🏆" };
    if (percentage >= 75) return { level: "Expert Navigator", color: "#4dabf7", emoji: "🎯" };
    if (percentage >= 60) return { level: "Skilled Explorer", color: "#ffd43b", emoji: "⭐" };
    if (percentage >= 40) return { level: "Learning Traveler", color: "#ff8c42", emoji: "🗺️" };
    return { level: "Aspiring Geographer", color: "#fe4a56", emoji: "🧭" };
  };

  const performance = getPerformanceLevel(percentage);

  return (
    <div className="final-results-modal">
      <div className="final-results-content">
        <div className="final-results-header">
          <div className="performance-badge" style={{ borderColor: performance.color }}>
            <span className="performance-emoji">{performance.emoji}</span>
            <span className="performance-level">{performance.level}</span>
          </div>
          <h2>Tournament Complete!</h2>
          <div className="final-score">
            <span className="final-score-value" style={{ color: performance.color }}>
              {totalScore}
            </span>
            <span className="final-score-label">Total Points out of 500</span>
          </div>
        </div>

        <div className="final-stats">
          <div className="stat-card">
            <span className="stat-value">{percentage}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{averageScore}</span>
            <span className="stat-label">Avg Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{Math.max(...roundScores.map(r => r.score))}</span>
            <span className="stat-label">Best Round</span>
          </div>
        </div>

        <div className="round-breakdown">
          <h3>Round by Round</h3>
          <div className="breakdown-list">
            {roundScores.map((round, index) => (
              <div key={index} className="breakdown-item">
                <div className="breakdown-round">
                  <span className="breakdown-number">Round {round.round}</span>
                  <span className="breakdown-location">{round.location}</span>
                </div>
                <div className="breakdown-score">
                  <span className="breakdown-points">{round.score} pts</span>
                  <span className="breakdown-distance">{Math.round(round.distance)}km</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="final-actions">
          <button onClick={onNewGame} className="btn btn-primary btn-large">
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalResults;
