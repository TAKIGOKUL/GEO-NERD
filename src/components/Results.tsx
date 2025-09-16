import React from 'react';
import { RoundResult } from '../App';
import './Results.css';

interface ResultsProps {
  result: RoundResult;
  onNext: () => void;
  isLastRound: boolean;
}

const Results: React.FC<ResultsProps> = ({ result, onNext, isLastRound }) => {
  const { location, bestGuess, roundNumber } = result;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--accent-success)';
    if (score >= 60) return 'var(--accent-warning)';
    if (score >= 40) return 'var(--accent-primary)';
    return 'var(--accent-error)';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Incredible! 🌟';
    if (score >= 80) return 'Excellent! 🎉';
    if (score >= 70) return 'Great job! 👏';
    if (score >= 60) return 'Good guess! 👍';
    if (score >= 50) return 'Not bad! 😊';
    if (score >= 30) return 'Keep trying! 💪';
    return 'Better luck next time! 🤔';
  };

  const getDistanceMessage = (distance: number) => {
    if (distance < 100) return 'Very close!';
    if (distance < 500) return 'Pretty close!';
    if (distance < 1000) return 'Getting warmer!';
    if (distance < 2000) return 'Not too far off!';
    return 'Keep exploring!';
  };

  return (
    <div className="results-overlay">
      <div className="results-modal glass">
        <div className="results-header">
          <h2>Round {roundNumber} Complete!</h2>
          <div 
            className="score-display"
            style={{ color: getScoreColor(bestGuess.score) }}
          >
            {bestGuess.score} points
          </div>
        </div>

        <div className="results-content">
          {/* Score Breakdown */}
          <div className="score-breakdown">
            <h3>Score Breakdown</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <span className="breakdown-label">Base Score</span>
                <span className="breakdown-value">
                  {Math.max(0, 100 - Math.floor(bestGuess.distance / 250))}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Distance</span>
                <span className="breakdown-value">
                  {Math.round(bestGuess.distance)} km
                </span>
              </div>
              {bestGuess.hintLevel > 0 && (
                <div className="breakdown-item penalty">
                  <span className="breakdown-label">Hint Penalty</span>
                  <span className="breakdown-value">
                    -{bestGuess.hintLevel * 10}
                  </span>
                </div>
              )}
              {bestGuess.timeBonus > 0 && (
                <div className="breakdown-item bonus">
                  <span className="breakdown-label">Speed Bonus</span>
                  <span className="breakdown-value">
                    +{bestGuess.timeBonus}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="location-details">
            <h3>{location.name}</h3>
            <div className="location-meta">
              <span className="location-country">{location.country}</span>
              <span className="location-city">{location.city}</span>
            </div>
            <p className="location-description">{location.description}</p>
            
            {location.culturalContext && (
              <div className="cultural-context">
                <h4>Cultural Context</h4>
                <p>{location.culturalContext}</p>
              </div>
            )}
            
            <a 
              href={location.wikipediaLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="wikipedia-link"
            >
              Learn more on Wikipedia
            </a>
          </div>

          {/* Performance Message */}
          <div className="performance-message">
            <div className="message-icon">
              {bestGuess.score >= 80 ? '🌟' : bestGuess.score >= 60 ? '🎉' : '👍'}
            </div>
            <div className="message-content">
              <h4>{getScoreMessage(bestGuess.score)}</h4>
              <p>{getDistanceMessage(bestGuess.distance)}</p>
            </div>
          </div>
        </div>

        <div className="results-footer">
          <button 
            className="next-button btn btn-primary"
            onClick={onNext}
          >
            {isLastRound ? 'View Final Results' : 'Next Round'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
