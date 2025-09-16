import React from 'react';
import { GameStats, RoundResult } from '../App';
import './FinalResults.css';

interface FinalResultsProps {
  gameStats: GameStats;
  roundResults: RoundResult[];
  onPlayAgain: () => void;
  gameMode: string;
}

const FinalResults: React.FC<FinalResultsProps> = ({
  gameStats,
  roundResults,
  onPlayAgain,
  gameMode
}) => {
  const getPerformanceRating = (totalScore: number, roundsPlayed: number) => {
    const averageScore = totalScore / roundsPlayed;
    if (averageScore >= 80) return { rating: 'Geo Master', emoji: '🏆', color: 'var(--accent-success)' };
    if (averageScore >= 70) return { rating: 'Explorer', emoji: '🗺️', color: 'var(--accent-primary)' };
    if (averageScore >= 60) return { rating: 'Navigator', emoji: '🧭', color: 'var(--accent-warning)' };
    if (averageScore >= 50) return { rating: 'Traveler', emoji: '✈️', color: 'var(--accent-secondary)' };
    return { rating: 'Beginner', emoji: '🌱', color: 'var(--text-muted)' };
  };

  const getAchievementBadges = (stats: GameStats) => {
    const badges = [];
    
    if (stats.bestScore >= 90) {
      badges.push({ name: 'Perfect Score', emoji: '🎯', description: 'Scored 90+ points in a round' });
    }
    
    if (stats.bestStreak >= 3) {
      badges.push({ name: 'Hot Streak', emoji: '🔥', description: `${stats.bestStreak} consecutive good guesses` });
    }
    
    if (stats.averageDistance < 500) {
      badges.push({ name: 'Precision Master', emoji: '🎯', description: 'Average distance under 500km' });
    }
    
    if (stats.totalScore >= 400) {
      badges.push({ name: 'High Scorer', emoji: '⭐', description: 'Total score over 400 points' });
    }
    
    return badges;
  };

  const performance = getPerformanceRating(gameStats.totalScore, gameStats.roundsPlayed);
  const achievements = getAchievementBadges(gameStats);

  return (
    <div className="final-results">
      <div className="final-container">
        {/* Header */}
        <div className="final-header animate-fade-in">
          <div className="completion-icon">🎉</div>
          <h1>Game Complete!</h1>
          <p className="game-mode">Mode: {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</p>
        </div>

        {/* Performance Rating */}
        <div className="performance-rating glass animate-fade-in">
          <div className="rating-icon" style={{ color: performance.color }}>
            {performance.emoji}
          </div>
          <div className="rating-content">
            <h2 style={{ color: performance.color }}>{performance.rating}</h2>
            <p>Your geographic expertise level</p>
          </div>
        </div>

        {/* Final Stats */}
        <div className="final-stats glass animate-fade-in">
          <h3>Final Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <span className="stat-value">{gameStats.totalScore}</span>
                <span className="stat-label">Total Score</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-value">{gameStats.bestScore}</span>
                <span className="stat-label">Best Score</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-value">{Math.round(gameStats.totalScore / gameStats.roundsPlayed)}</span>
                <span className="stat-label">Average Score</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📏</div>
              <div className="stat-content">
                <span className="stat-value">{Math.round(gameStats.averageDistance)}</span>
                <span className="stat-label">Avg Distance (km)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="achievements glass animate-fade-in">
            <h3>Achievements Unlocked</h3>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <div key={index} className="achievement-badge">
                  <div className="achievement-emoji">{achievement.emoji}</div>
                  <div className="achievement-content">
                    <span className="achievement-name">{achievement.name}</span>
                    <span className="achievement-desc">{achievement.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Round Summary */}
        <div className="round-summary glass animate-fade-in">
          <h3>Round Summary</h3>
          <div className="rounds-list">
            {roundResults.map((round, index) => (
              <div key={index} className="round-item">
                <div className="round-number">Round {round.roundNumber}</div>
                <div className="round-details">
                  <span className="round-location">{round.location.name}</span>
                  <span className="round-score">{round.bestGuess.score} pts</span>
                </div>
                <div className="round-distance">{Math.round(round.bestGuess.distance)} km</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="final-actions animate-fade-in">
          <button 
            className="play-again-button btn btn-primary"
            onClick={onPlayAgain}
          >
            <span>Play Again</span>
            <div className="button-icon">🔄</div>
          </button>
        </div>

        {/* Share Section */}
        <div className="share-section glass animate-fade-in">
          <h4>Share Your Achievement</h4>
          <p>You achieved the rank of <strong>{performance.rating}</strong> with {gameStats.totalScore} total points!</p>
          <div className="share-buttons">
            <button className="share-button btn btn-secondary">
              📱 Share Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalResults;
