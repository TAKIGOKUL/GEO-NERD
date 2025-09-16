import React, { useState, useEffect, useCallback } from 'react';
import { LeaderboardService, PlayerScore } from '../services/leaderboardService';
import './Leaderboard.css';

interface LeaderboardProps {
  isVisible: boolean;
  onClose: () => void;
  currentPlayerId?: string;
  onPlayAgain?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ isVisible, onClose, currentPlayerId, onPlayAgain }) => {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [currentPlayerRank, setCurrentPlayerRank] = useState<number>(-1);
  const [currentPlayerBest, setCurrentPlayerBest] = useState<PlayerScore | null>(null);
  const [currentPlayerStats, setCurrentPlayerStats] = useState<any>(null);

  const loadLeaderboard = useCallback(() => {
    const topScores = LeaderboardService.getTopScores(20);
    setScores(topScores);
    
    if (currentPlayerId) {
      const rank = LeaderboardService.getPlayerRank(currentPlayerId);
      const bestScore = LeaderboardService.getPlayerBestScore(currentPlayerId);
      const playerStats = LeaderboardService.getPlayerStats(currentPlayerId);
      setCurrentPlayerRank(rank);
      setCurrentPlayerBest(bestScore);
      setCurrentPlayerStats(playerStats);
    }
  }, [currentPlayerId]);

  useEffect(() => {
    if (isVisible) {
      loadLeaderboard();
    }
  }, [isVisible, currentPlayerId, loadLeaderboard]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="leaderboard-content">
          {/* Current Player Stats */}
          {currentPlayerId && currentPlayerBest && (
            <div className="current-player-stats">
              <h3>Your Performance</h3>
              <div className="player-stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Rank</span>
                  <span className="stat-value">
                    {currentPlayerRank > 0 ? `#${currentPlayerRank}` : 'Unranked'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Best Score</span>
                  <span className="stat-value">{currentPlayerBest.calculatedScore.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Points</span>
                  <span className="stat-value">{currentPlayerBest.totalPoints}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Rounds</span>
                  <span className="stat-value">{currentPlayerBest.roundsPlayed}</span>
                </div>
                {currentPlayerStats && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">Total Games</span>
                      <span className="stat-value">{currentPlayerStats.totalGames}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Avg Score</span>
                      <span className="stat-value">{currentPlayerStats.averageScore.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Top Scores */}
          <div className="top-scores">
            <h3>Top Players</h3>
            {scores.length === 0 ? (
              <div className="no-scores">
                <p>No scores yet. Be the first to play!</p>
              </div>
            ) : (
              <div className="scores-list">
                {scores.map((score, index) => (
                  <div 
                    key={`${score.playerId}-${score.timestamp}`}
                    className={`score-item ${score.playerId === currentPlayerId ? 'current-player' : ''}`}
                  >
                    <div className="rank">
                      {getRankIcon(index)}
                    </div>
                    <div className="player-info">
                      <div className="player-id">{score.playerId}</div>
                      <div className="player-details">
                        {score.roundsPlayed} rounds • {formatTimestamp(score.timestamp)}
                      </div>
                    </div>
                    <div className="score-info">
                      <div className="calculated-score">{score.calculatedScore.toFixed(2)}</div>
                      <div className="total-points">{score.totalPoints} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="leaderboard-info">
            <p>💡 Score = Total Points ÷ 50</p>
            <p>📄 Scores are automatically saved and exported to TXT file</p>
          </div>

          {/* Action Buttons */}
          <div className="leaderboard-actions">
            {onPlayAgain && (
              <button 
                className="btn btn-primary play-again-btn"
                onClick={onPlayAgain}
              >
                🎮 Play Again
              </button>
            )}
            <button 
              className="btn btn-secondary export-btn"
              onClick={() => LeaderboardService.exportLeaderboard()}
            >
              📄 Export TXT
            </button>
            <button 
              className="btn btn-secondary close-btn"
              onClick={onClose}
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
