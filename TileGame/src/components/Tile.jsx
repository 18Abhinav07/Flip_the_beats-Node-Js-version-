import React from 'react';

const Tile = ({ tile, isFlipped, isMatched, onClick }) => {
  return (
    <div
      className={`w-[12vw] h-[15vh] flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${isFlipped || isMatched ? 'bg-gradient-to-tr from-purple-400 to-sky-400 text-white' : 'bg-gradient-to-tr from-gray-300 to-gray-400'
        } ${isMatched ? 'opacity-50' : ''} m-5 `}
      onClick={onClick}
    >
      {isFlipped || isMatched ? tile.name : '?'}
    </div>
  );
};

export default Tile;