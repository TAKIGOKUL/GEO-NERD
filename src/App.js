import React, { useState, useEffect } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import FinalResults from './components/FinalResults';
import { fetchLocationsFromSpreadsheet } from './data/spreadsheetService';

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'finished'
  const [gameMode, setGameMode] = useState('tournament');
  const [locations, setLocations] = useState([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [gameStats, setGameStats] = useState({
    totalScore: 0,
    bestScore: 0,
    roundsPlayed: 0,
    totalDistance: 0,
    averageDistance: 0,
    streak: 0,
    bestStreak: 0
  });
  const [roundResults, setRoundResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load locations when component mounts
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const fetchedLocations = await fetchLocationsFromSpreadsheet();
      setLocations(fetchedLocations);
      console.log(`Loaded ${fetchedLocations.length} locations`);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = (mode) => {
    setGameMode(mode);
    setGameState('playing');
    setCurrentLocationIndex(0);
    setGameStats({
      totalScore: 0,
      bestScore: 0,
      roundsPlayed: 0,
      totalDistance: 0,
      averageDistance: 0,
      streak: 0,
      bestStreak: 0
    });
    setRoundResults([]);
  };

  const handleRoundComplete = (result) => {
    const newRoundResults = [...roundResults, result];
    setRoundResults(newRoundResults);

    const newStats = {
      ...gameStats,
      totalScore: gameStats.totalScore + result.bestGuess.score,
      bestScore: Math.max(gameStats.bestScore, result.bestGuess.score),
      roundsPlayed: gameStats.roundsPlayed + 1,
      totalDistance: gameStats.totalDistance + result.bestGuess.distance,
      averageDistance: (gameStats.totalDistance + result.bestGuess.distance) / (gameStats.roundsPlayed + 1),
      streak: result.bestGuess.score >= 50 ? gameStats.streak + 1 : 0,
      bestStreak: Math.max(gameStats.bestStreak, result.bestGuess.score >= 50 ? gameStats.streak + 1 : 0)
    };
    setGameStats(newStats);

    // Check if game is complete
    if (currentLocationIndex >= locations.length - 1) {
      setGameState('finished');
    } else {
      setCurrentLocationIndex(currentLocationIndex + 1);
    }
  };

  const resetGame = () => {
    setGameState('start');
    setCurrentLocationIndex(0);
    setGameStats({
      totalScore: 0,
      bestScore: 0,
      roundsPlayed: 0,
      totalDistance: 0,
      averageDistance: 0,
      streak: 0,
      bestStreak: 0
    });
    setRoundResults([]);
  };

  const getCurrentLocation = () => {
    return locations[currentLocationIndex] || null;
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2>Loading locations...</h2>
          <p>Fetching the latest location data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {gameState === 'start' && (
        <StartScreen 
          onStart={startGame}
          gameMode={gameMode}
          onModeChange={setGameMode}
          locationsCount={locations.length}
        />
      )}
      
      {gameState === 'playing' && getCurrentLocation() && (
        <Game
          location={getCurrentLocation()}
          gameMode={gameMode}
          onRoundComplete={handleRoundComplete}
          gameStats={gameStats}
          currentRound={currentLocationIndex + 1}
          maxRounds={locations.length}
          roundResults={roundResults[currentLocationIndex]}
        />
      )}
      
      {gameState === 'finished' && (
        <FinalResults
          gameStats={gameStats}
          roundResults={roundResults}
          onPlayAgain={resetGame}
          gameMode={gameMode}
        />
      )}
    </div>
  );
}

export default App;
