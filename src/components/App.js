import React, { useState } from 'react';
import './App.css';
import '../styles/index.css';
import Game from './Game';
import StartScreen from './StartScreen';
import ParticleEffect from './ParticleEffect';

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'finished'
  const [userId, setUserId] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [gameMode, setGameMode] = useState('tournament');
  const [userProfile, setUserProfile] = useState({
    level: 1,
    xp: 0,
    totalScore: 0,
    gamesPlayed: 0,
    achievements: [],
    expertiseRank: 'Novice'
  });

  const startGame = (inputTicketId, mode = 'tournament') => {
    setTicketId(inputTicketId || '');
    setUserId(`user_${Date.now()}`);
    setGameMode(mode);
    setGameState('playing');
  };

  const endGame = () => {
    setGameState('finished');
  };

  const resetGame = () => {
    setGameState('start');
    setUserId('');
  };

  return (
    <div className="App">
      <ParticleEffect active={true} intensity="medium" />
      
      {gameState === 'start' && (
        <StartScreen onStart={startGame} />
      )}
      {gameState === 'playing' && (
        <Game 
          userId={userId} 
          ticketId={ticketId}
          gameMode={gameMode}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          onEndGame={endGame}
          onReset={resetGame}
        />
      )}
      {gameState === 'finished' && (
        <div className="game-finished">
          <h1>Tournament Complete!</h1>
          <p>Thank you for playing GeoGuess!</p>
          <button onClick={resetGame} className="btn btn-primary">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
