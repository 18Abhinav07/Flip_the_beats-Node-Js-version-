import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import { pairs } from './components/constants';

const TOTAL_PAIRS = pairs; // Assuming we have 6 pairs of tiles

const App = () => {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [currentPlayerID, setCurrentPlayerID] = useState('');
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [currentPlayerWallet, setCurrentPlayerWallet] = useState('');
  const [playerRegistered, setPlayerRegistered] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  useEffect(() => {

    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const loadLeaderboard = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/leaderboard');
      console.log(response.data)
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    if (matchedPairs === TOTAL_PAIRS && !scoreSubmitted) {
      setScoreSubmitted(true);
      const score = calculateScore();
      await submitScore(currentPlayerID, score, currentPlayerName);
    }
  };

  const startGame = () => {
    if (!playerRegistered) {
      alert('Please register a player id first!');
      return;
    }
    setIsPlaying(true);
    setTime(0);
    setMatchedPairs(0);
    setMoves(0);
    setScoreSubmitted(false);
  };
  const incrementMatchedPairs = () => {
    setMatchedPairs((prev) => {
      const newMatchedPairs = prev + 1;
      return newMatchedPairs;
    });
  };


  const incrementMoves = () => {
    setMoves((prev) => prev + 1);
  };

  const calculateScore = () => {
    return Math.max(10000 - moves * 100, 0);
  };

  const submitScore = async (player_id, score, player_name) => {
    try {
      await axios.post('http://127.0.0.1:3000/api/submit_score', { player_id, score, player_name });
      alert("Submission Done.")
      loadLeaderboard()
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const handlePlayerRegistration = async () => {
    const id = prompt('Enter your player id:');
    if (id) {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/player/${id}`);
        setCurrentPlayerID(response.data.playerId);
        setCurrentPlayerName(response.data.playerName);
        setCurrentPlayerWallet(response.data.walletAddress);
        setPlayerRegistered(true);
      } catch (error) {
        console.error('Error registering player:', error);
      }
    }
    loadLeaderboard()
  };

  return (

    <div className={`${playerRegistered ? "flex flex-row" : "flex flex-col"} bg-black`}>
      {!playerRegistered ? (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-10 shadow-lg rounded-lg bg-gray-100 bg-gradient-to-br from-gray-900 to-gray-800">
          <span className="text-center text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-sky-600 p-5 animate-slidein">Flip the Beats</span>

          <button
            className="bg-sky-500 text-white text-3xl font-bold px-4 py-2 rounded-lg"
            onClick={handlePlayerRegistration}
          >
            Register Player
          </button>
        </div>
      ) :
        <div className="flex flex-col justify-center items-center">
          <GameBoard
            isPlaying={isPlaying}
            onMatchedPair={incrementMatchedPairs}
            onGameEnd={endGame}
            onTileClick={incrementMoves}
          />
        </div>
      }
      <Dashboard
        time={time}
        matchedPairs={matchedPairs}
        isPlaying={isPlaying}
        onStartGame={startGame}
        currentPlayerID={currentPlayerID}
        currentPlayerName={currentPlayerName}
        leaderboard={leaderboard}
        setLeaderboard={setLeaderboard}
        moves={moves}
      />
    </div>
  );
};

export default App;
