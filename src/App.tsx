import React, { useState } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import './components/StartScreen.css';
import Game from './components/Game';
import './components/Game.css';
import FinalResults from './components/FinalResults';
import './components/FinalResults.css';
import { Location } from './data/locations';

export interface GameStats {
  totalScore: number;
  bestScore: number;
  roundsPlayed: number;
  totalDistance: number;
  averageDistance: number;
  streak: number;
  bestStreak: number;
}

export interface RoundResult {
  location: Location;
  guesses: Array<{
    lat: number;
    lng: number;
    distance: number;
    score: number;
    hintLevel: number;
    timeBonus: number;
  }>;
  bestGuess: {
    lat: number;
    lng: number;
    distance: number;
    score: number;
    hintLevel: number;
    timeBonus: number;
  };
  totalScore: number;
  roundNumber: number;
  maxRounds: number;
}

type GameState = 'start' | 'playing' | 'finished';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [gameMode, setGameMode] = useState<string>('classic');
  const [playerId, setPlayerId] = useState<string>('');
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalScore: 0,
    bestScore: 0,
    roundsPlayed: 0,
    totalDistance: 0,
    averageDistance: 0,
    streak: 0,
    bestStreak: 0
  });
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [maxRounds] = useState<number>(5);

  const startGame = (mode: string, playerId: string) => {
    console.log(`Starting game for player: ${playerId}`);
    setGameMode(mode);
    setPlayerId(playerId);
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

  const handleRoundComplete = (result: RoundResult) => {
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
    if (currentLocationIndex >= maxRounds - 1) {
      setGameState('finished');
    } else {
      setCurrentLocationIndex(currentLocationIndex + 1);
    }
  };

  const handleGameComplete = (finalStats: GameStats) => {
    // Game completion logic will be handled here
    console.log('Game completed with stats:', finalStats);
    // Set to finished state to go back to start screen
    setGameState('finished');
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


  return (
    <div className="app">
      {gameState === 'start' && (
        <StartScreen 
          onStart={startGame}
          gameMode={gameMode}
          onModeChange={setGameMode}
        />
      )}
      
      {gameState === 'playing' && (
        <Game
          gameMode={gameMode}
          onRoundComplete={handleRoundComplete}
          gameStats={gameStats}
          currentRound={currentLocationIndex + 1}
          maxRounds={maxRounds}
          roundResults={roundResults[currentLocationIndex]}
          playerId={playerId}
          onGameComplete={handleGameComplete}
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