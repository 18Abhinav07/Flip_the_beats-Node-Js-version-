import React from 'react';

const Dashboard = ({ time, matchedPairs, isPlaying, onStartGame, currentPlayerID, currentPlayerName, leaderboard, moves }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen overflow-y-auto w-[40vw] p-10 bg-black text-white">
      <h2 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-600">Dashboard</h2>
      <div className="mb-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td className='font-bold'>Player ID:</td>
              <td className='font-bold'>{currentPlayerID}</td>
            </tr>
            <tr>
              <td className='font-bold'>Player Name:</td>
              <td className='font-bold'>{currentPlayerName}</td>
            </tr>
            <tr> 
              <td className='font-bold'>Time:</td>
              <td className='font-bold'>{formatTime(time)}</td>
            </tr>
            <tr> 
              <td className='font-bold'>Matched Pairs:</td>
              <td className='font-bold'>{matchedPairs}</td>
            </tr> 
            <tr> 
              <td className='font-bold'>Moves made:</td>
              <td className='font-bold'>{moves}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex  items-center justify-center space-x-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded font-bold"
          onClick={onStartGame}
          disabled={isPlaying}
        >
          {isPlaying ? 'Game in Progress' : 'Start New Game'}
        </button>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-center text-sky-600">Leaderboard</h3>
        <table className="w-full mt-5">
          <thead>
            <tr>
              <th className="text-left">Rank</th>
              <th className="text-left">Name</th>
              <th className="text-left">Player Id</th>
              <th className="text-left">Score</th>
              <th className="text-left">Played on</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={index} className={currentPlayerID === player.name ? 'bg-yellow-200' : ''}>
                <td>{index + 1}</td>
                <td>{player.playerName}</td>
                <td>{player.playerId}</td>
                <td>{player.score}</td>
                <td>{player.createdAt.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
