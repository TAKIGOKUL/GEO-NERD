import React, { useState, useEffect } from 'react';
import { getRandomLocation, calculateDistance, calculateScoreWithHints, getDynamicHint } from '../data/spreadsheetService';
import ImagePanel from './ImagePanel';
import GameMap from './GameMap';
import Results from './Results';
import UserProfile from './UserProfile';
import GameStats from './GameStats';
import FinalResults from './FinalResults';

const Game = ({ userId, ticketId, gameMode, userProfile, setUserProfile, onEndGame, onReset }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [guessCount, setGuessCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [roundResults, setRoundResults] = useState(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [showActualLocation, setShowActualLocation] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  
  // Tournament system state
  const [currentRound, setCurrentRound] = useState(1);
  const [maxRounds] = useState(5);
  const [roundScores, setRoundScores] = useState([]);
  const [tournamentComplete, setTournamentComplete] = useState(false);
  const [isMapDisabled, setIsMapDisabled] = useState(false);
  const [countdown, setCountdown] = useState(null);
  
  const [gameStats, setGameStats] = useState({
    roundsPlayed: 0,
    totalDistance: 0,
    bestScore: 0,
    totalScore: 0
  });

  useEffect(() => {
    loadNewLocation();
  }, []);

  const loadNewLocation = async () => {
    try {
      const location = await getRandomLocation(gameMode);
      setCurrentLocation(location);
      setGuesses([]);
      setGuessCount(0);
      setShowResults(false);
      setRoundResults(null);
      setHasGuessed(false);
      setShowActualLocation(false);
      setHintLevel(0);
      setIsMapDisabled(false); // Re-enable map for new location
      setCountdown(null); // Reset countdown
    } catch (error) {
      console.error('Error loading new location:', error);
      // Fallback to a default location if there's an error
      setCurrentLocation({
        id: 1,
        name: "Chefchaouen Blue Streets",
        category: "Cultural",
        country: "Morocco",
        city: "Chefchaouen",
        latitude: 35.1686,
        longitude: -5.2636,
        description: "A mountain town painted almost entirely blue, hidden in Morocco's Rif mountains.",
        wikipediaLink: "https://en.wikipedia.org/wiki/Chefchaouen",
        imageUrl: "https://via.placeholder.com/400x300?text=Image+Not+Available"
      });
    }
  };

  const nextRound = async () => {
    if (currentRound < maxRounds) {
      setCurrentRound(currentRound + 1);
      await loadNewLocation();
    } else {
      // Tournament complete
      setTournamentComplete(true);
    }
  };


  // Countdown effect for auto-advance to next round
  useEffect(() => {
    if (countdown > 0 && showActualLocation) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showActualLocation) {
      // Auto-advance to next round
      nextRound();
      setCountdown(null);
    }
  }, [countdown, showActualLocation]);

  const placeGuess = (lat, lng) => {
    if (guessCount >= 1 || showResults) return;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      lat,
      lng
    );
    
    const timeBonus = 0;
    const score = calculateScoreWithHints(distance, hintLevel, timeBonus);
    const newGuess = { lat, lng, distance, score, hintLevel, timeBonus };
    
    // Immediately submit the guess instead of just setting it as current
    setGuesses([newGuess]);
    setGuessCount(1);
    setHasGuessed(true);
    setIsMapDisabled(true); // Disable map after submission

    // Show results immediately after one guess and reveal location
    showFinalResults(newGuess);
    setShowActualLocation(true); // Automatically reveal the actual location
    
    // Start countdown for auto-advance (5 seconds)
    setCountdown(5);
  };

  const requestHint = (level) => {
    if (level > hintLevel && level <= 4) {
      setHintLevel(level);
    }
  };


  const showFinalResults = (guess) => {
    const results = {
      location: currentLocation,
      guesses: [guess],
      bestGuess: guess,
      totalScore: guess.score,
      roundNumber: currentRound,
      maxRounds: maxRounds
    };
    
    setRoundResults(results);
    setShowResults(true);
    setTotalScore(totalScore + results.bestGuess.score);
    
    // Store round score for tournament
    setRoundScores(prev => [...prev, {
      round: currentRound,
      score: results.bestGuess.score,
      distance: results.bestGuess.distance,
      location: currentLocation.name,
      wikipediaLink: currentLocation.wikipediaLink
    }]);
    
    setGameStats(prev => ({
      roundsPlayed: prev.roundsPlayed + 1,
      totalDistance: prev.totalDistance + results.bestGuess.distance,
      bestScore: Math.max(prev.bestScore, results.bestGuess.score),
      totalScore: prev.totalScore + results.bestGuess.score
    }));
  };

  const revealActualLocation = () => {
    setShowActualLocation(true);
  };


  const endGame = () => {
    // Calculate final game statistics
    const finalStats = {
      ticketId: ticketId,
      userId: userId,
      gameMode: gameMode,
      totalScore: totalScore,
      roundsPlayed: currentRound - 1,
      roundScores: roundScores,
      averageScore: roundScores.length > 0 ? Math.round(totalScore / roundScores.length) : 0,
      bestRound: roundScores.length > 0 ? Math.max(...roundScores) : 0,
      totalDistance: gameStats.totalDistance,
      gameCompleted: tournamentComplete,
      timestamp: new Date().toISOString()
    };

    // Log final results to console
    console.log('=== GEO-NERD GAME RESULTS ===');
    console.log('Ticket ID:', finalStats.ticketId);
    console.log('User ID:', finalStats.userId);
    console.log('Game Mode:', finalStats.gameMode);
    console.log('Total Score:', finalStats.totalScore);
    console.log('Rounds Played:', finalStats.roundsPlayed);
    console.log('Round Scores:', finalStats.roundScores);
    console.log('Average Score:', finalStats.averageScore);
    console.log('Best Round:', finalStats.bestRound);
    console.log('Total Distance:', finalStats.totalDistance);
    console.log('Game Completed:', finalStats.gameCompleted);
    console.log('Timestamp:', finalStats.timestamp);
    console.log('==============================');

    onEndGame();
  };

  if (!currentLocation) {
    return <div className="loading">Loading...</div>;
  }


  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-info">
          <h2>🌍 GEO-NERD</h2>
          <p>Master the World</p>
        </div>

        <GameStats 
          currentRound={currentRound}
          maxRounds={maxRounds}
          totalScore={totalScore}
          bestScore={gameStats.bestScore}
          roundScores={roundScores}
        />
        
      </div>

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
            hintLevel={hintLevel}
            roundResults={roundResults}
            currentRound={currentRound}
            maxRounds={maxRounds}
            countdown={countdown}
            onNextLocation={nextRound}
            onRevealLocation={revealActualLocation}
          />
        </div>
      </div>

      {tournamentComplete && (
        <FinalResults 
          roundScores={roundScores}
          totalScore={totalScore}
          onEndGame={endGame}
        />
      )}
    </div>
  );
};

export default Game;
