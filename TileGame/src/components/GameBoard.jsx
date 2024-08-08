import React, { useState, useEffect, useRef } from 'react';
import Tile from './Tile'; // Adjust the import path if needed
import { pairs } from './constants';
const all_songs = [
  { id: 1, name: 'Dope', audio: './Dope.mp3' },
  { id: 2, name: 'Cold-Water', audio: './Cold-Water.mp3' },
  { id: 3, name: 'Hold-Me', audio: './Hold-Me.mp3' },
  { id: 4, name: 'Sin', audio: './Sin.mp3' },
  { id: 5, name: 'Talking-To-The-Moon', audio: './Talking-To-The-Moon.mp3' },
  { id: 6, name: 'Tu-Aake-Dekh-Le', audio: './Tu-Aake-Dekh-Le.mp3' },
];

const songs = all_songs.sort(() => Math.random() - 0.5).slice(0, pairs);

const GameBoard = ({ isPlaying, onMatchedPair, onGameEnd, onTileClick }) => {
  const [tiles, setTiles] = useState([]);
  const [flippedTiles, setFlippedTiles] = useState([]);
  const [matchedTiles, setMatchedTiles] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (isPlaying) {
      const shuffledTiles = [...songs, ...songs]
        .sort(() => Math.random() - 0.5)
        .map((song, index) => ({ ...song, tileId: index }));
      setTiles(shuffledTiles);
      setFlippedTiles([]);
      setMatchedTiles([]);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (matchedTiles.length === tiles.length && tiles.length > 0) {
      onGameEnd();
    }
  }, [matchedTiles, onGameEnd, tiles]);

  const playAudio = (audioSrc) => {
    audioRef.current.src = audioSrc;
    audioRef.current.play();
    setIsAudioPlaying(true);
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsAudioPlaying(false);
  };

  const handleTileClick = (clickedTile) => {
    if (isAudioPlaying) {
      setFlippedTiles([]);
      setIsChecking(false);
      stopAudio();
    }

    if (
      isChecking ||
      flippedTiles.length === 2 ||
      matchedTiles.includes(clickedTile.tileId) ||
      flippedTiles.some((tile) => tile.tileId === clickedTile.tileId)
    ) {
      return;
    }

    onTileClick(); // Increment moves

    // Play the audio of the clicked tile
    playAudio(clickedTile.audio);

    const newFlippedTiles = [...flippedTiles, clickedTile];
    setFlippedTiles(newFlippedTiles);

    if (newFlippedTiles.length === 2) {
      setIsChecking(true);
      if (newFlippedTiles[0].name === newFlippedTiles[1].name) {
        setMatchedTiles((prev) => [...prev, newFlippedTiles[0].tileId, newFlippedTiles[1].tileId]);
        onMatchedPair();
        setTimeout(() => {
          setFlippedTiles([]);
          setIsChecking(false);
          stopAudio();
        }, 5000);
      } else {
        setTimeout(() => {
          setFlippedTiles([]);
          setIsChecking(false);
          stopAudio();
        }, 5000);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="min-h-screen grid grid-cols-4 rounded-lg shadow-lg p-10">
        {tiles.map((tile) => (
          <Tile
            key={tile.tileId}
            tile={tile}
            isFlipped={flippedTiles.some((t) => t.tileId === tile.tileId)}
            isMatched={matchedTiles.includes(tile.tileId)}
            onClick={() => handleTileClick(tile)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
