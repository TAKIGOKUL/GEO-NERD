import React, { useState, useEffect, useCallback } from 'react';
import { Location, getRandomLocation, calculateDistance, calculateScoreWithHints } from '../data/locations';
import ImagePanel from './ImagePanel';
import './ImagePanel.css';
import GameMap from './GameMap';
import './GameMap.css';
import Results from './Results';
import './Results.css';
import Leaderboard from './Leaderboard';
import { GameStats, RoundResult } from '../App';
import { LeaderboardService } from '../services/leaderboardService';
import './Game.css';

interface GameProps {
  gameMode: string;
  onRoundComplete: (result: RoundResult) => void;
  gameStats: GameStats;
  currentRound: number;
  maxRounds: number;
  roundResults?: RoundResult;
  playerId: string;
  onGameComplete: (finalStats: GameStats) => void;
}

const Game: React.FC<GameProps> = ({
  gameMode,
  onRoundComplete,
  gameStats,
  currentRound,
  maxRounds,
  roundResults,
  playerId,
  onGameComplete
}) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [guesses, setGuesses] = useState<Array<{
    lat: number;
    lng: number;
    distance: number;
    score: number;
    hintLevel: number;
    timeBonus: number;
  }>>([]);
  const [guessCount, setGuessCount] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [hasGuessed, setHasGuessed] = useState<boolean>(false);
  const [showActualLocation, setShowActualLocation] = useState<boolean>(false);
  const [isMapDisabled, setIsMapDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  const loadNewLocation = useCallback(() => {
    try {
      const location = getRandomLocation(gameMode);
      setCurrentLocation(location);
      setGuesses([]);
      setGuessCount(0);
      setShowResults(false);
      setHasGuessed(false);
      setShowActualLocation(false);
      setIsMapDisabled(false);
      setCountdown(null);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error loading new location:', error);
    }
  }, [gameMode]);

  const handleGameComplete = useCallback(() => {
    // Calculate final stats
    const finalStats = {
      ...gameStats,
      totalScore: gameStats.totalScore,
      bestScore: gameStats.bestScore,
      roundsPlayed: gameStats.roundsPlayed,
      totalDistance: gameStats.totalDistance,
      averageDistance: gameStats.averageDistance,
      streak: gameStats.streak,
      bestStreak: gameStats.bestStreak
    };

    // Save to leaderboard
    const playerScore = {
      playerId: playerId,
      totalPoints: finalStats.totalScore,
      calculatedScore: LeaderboardService.calculateScore(finalStats.totalScore),
      roundsPlayed: finalStats.roundsPlayed,
      averageDistance: finalStats.averageDistance,
      timestamp: new Date().toISOString(),
      gameMode: gameMode
    };

    LeaderboardService.saveScore(playerScore);

    // Show leaderboard
    setShowLeaderboard(true);

    // Call parent callback
    onGameComplete(finalStats);
  }, [gameStats, playerId, gameMode, onGameComplete]);

  const handleNextRound = useCallback(() => {
    if (currentRound < maxRounds) {
      loadNewLocation();
    } else {
      // Game completed - auto-finish and show leaderboard
      handleGameComplete();
    }
  }, [currentRound, maxRounds, loadNewLocation, handleGameComplete]);

  useEffect(() => {
    loadNewLocation();
  }, [loadNewLocation]);

  // Countdown effect for auto-advance to next round
  useEffect(() => {
    if (countdown && countdown > 0 && showActualLocation) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showActualLocation) {
      // Auto-advance to next round
      handleNextRound();
      setCountdown(null);
    }
  }, [countdown, showActualLocation, handleNextRound]);

  const placeGuess = (lat: number, lng: number) => {
    if (guessCount >= 1 || showResults || !currentLocation) return;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      lat,
      lng
    );
    
    const timeElapsed = Date.now() - startTime;
    const timeBonus = timeElapsed < 10000 ? 10 : 0; // Bonus for quick guesses
    const score = calculateScoreWithHints(distance, 0, timeBonus);
    
    const newGuess = { lat, lng, distance, score, hintLevel: 0, timeBonus };
    
    setGuesses([newGuess]);
    setGuessCount(1);
    setHasGuessed(true);
    setIsMapDisabled(true);

    // Show results immediately after one guess
    showFinalResults(newGuess);
    setShowActualLocation(true);
    
    // Start countdown for auto-advance (5 seconds)
    setCountdown(5);
  };


  const showFinalResults = (guess: typeof guesses[0]) => {
    if (!currentLocation) return;

    const results: RoundResult = {
      location: currentLocation,
      guesses: [guess],
      bestGuess: guess,
      totalScore: guess.score,
      roundNumber: currentRound,
      maxRounds: maxRounds
    };
    
    setShowResults(true);
    onRoundComplete(results);
  };


  const revealActualLocation = () => {
    setShowActualLocation(true);
  };

  const closeLeaderboard = () => {
    setShowLeaderboard(false);
  };

  const handlePlayAgain = () => {
    setShowLeaderboard(false);
    // Reset game state and go back to start screen
    onGameComplete(gameStats);
  };

  if (!currentLocation) {
    return (
      <div className="game-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Game Header */}
      <div className="game-header glass">
        <div className="game-info">
          <h2>Geo-Nerd</h2>
          <p className="tagline">Master the World</p>
        </div>

        <div className="header-stats">
          <div className="round-indicator">
            🎯 Round {currentRound}/{maxRounds}
          </div>
          <div className="score-info">
            <div className="current-score">⚡ {gameStats.totalScore}</div>
            <div className="best-score">BEST: {gameStats.bestScore}</div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="game-content">
        <div className="left-section">
          <GameMap
            location={currentLocation}
            guesses={guesses}
            onGuess={placeGuess}
            showResults={showResults}
            showActualLocation={showActualLocation}
            guessCount={guessCount}
            isDisabled={isMapDisabled}
          />
        </div>
        
        <div className="right-section">
          <ImagePanel 
            location={currentLocation}
            guessCount={guessCount}
            hasGuessed={hasGuessed}
            showActualLocation={showActualLocation}
            gameStats={gameStats}
            roundResults={roundResults}
            currentRound={currentRound}
            maxRounds={maxRounds}
            countdown={countdown}
            onNextLocation={handleNextRound}
            onRevealLocation={revealActualLocation}
          />
        </div>
      </div>

      {/* Results Modal */}
      {showResults && roundResults && (
        <Results
          result={roundResults}
          onNext={handleNextRound}
          isLastRound={currentRound >= maxRounds}
        />
      )}

      {/* Leaderboard Modal */}
      <Leaderboard
        isVisible={showLeaderboard}
        onClose={closeLeaderboard}
        currentPlayerId={playerId}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
};

export default Game;
