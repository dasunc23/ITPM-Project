import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlayerList from '../Components/PlayerList.jsx';

const Lobby = () => {
  const { roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [room, setRoom] = useState(state?.room || null);
  const [players, setPlayers] = useState(state?.room?.players || []);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const eventSourceRef = useRef(null);

  const userId = state?.userId;
  const username = state?.username;
  const isHost = state?.isHost;

  // ─── SSE Connection ───────────────────────────
  useEffect(() => {
    if (!roomCode) return;

    // Connect to SSE stream
    const eventSource = new EventSource(`/api/rooms/stream/${roomCode}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'player-joined' || data.type === 'player-left') {
        setPlayers(data.players);
      }

      if (data.type === 'game-started') {
        setGameStarted(true);
        // Navigate to game page — update route when Member 2 is ready
        setTimeout(() => navigate(`/game/${roomCode}`, { state }), 2000);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, [roomCode]);

  // ─── Start Game ───────────────────────────────
  const handleStart = async () => {
    if (players.length < 2) return;

    setStarting(true);
    try {
      await axios.post(`/api/rooms/start/${roomCode}`, { userId });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to start game');
    } finally {
      setStarting(false);
    }
  };

  // ─── Leave Room ───────────────────────────────
  const handleLeave = async () => {
    try {
      await axios.post(`/api/rooms/leave/${roomCode}`, { userId });
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Game Started Banner */}
        {gameStarted && (
          <div className="bg-green-600 text-white text-center py-4 rounded-xl mb-6 text-xl font-bold animate-pulse">
            🎮 Game is starting...
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-1">🏠 Game Lobby</h1>
          <p className="text-slate-400">Waiting for players to join...</p>
        </div>

        {/* Room Code Card */}
        <div className="bg-indigo-900 border border-indigo-500 rounded-2xl p-5 mb-5 text-center">
          <p className="text-indigo-300 text-sm mb-1">Room Code</p>
          <p className="text-5xl font-bold text-white tracking-widest">{roomCode}</p>
          <p className="text-indigo-300 text-xs mt-2">Share this code with your friends</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">

          {/* Player Count */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Players</h2>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold px-3 py-1 rounded-full
                ${players.length >= 2
                  ? 'bg-green-900 text-green-300'
                  : 'bg-red-900 text-red-300'}`}>
                {players.length} / 6
              </span>
            </div>
          </div>

          {/* Min Players Warning */}
          {players.length < 2 && (
            <div className="bg-yellow-900 border border-yellow-600 text-yellow-300 rounded-xl p-3 mb-4 text-sm text-center">
              ⚠️ Need at least 2 players to start
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900 border border-red-500 text-red-300 rounded-xl p-3 mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {/* Player List */}
          <PlayerList players={players} />

          {/* Buttons */}
          <div className="mt-6 space-y-3">

            {/* Start Button — Host Only */}
            {isHost && (
              <button
                onClick={handleStart}
                disabled={players.length < 2 || starting || gameStarted}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
              >
                {starting ? 'Starting...' : players.length < 2
                  ? '⏳ Waiting for players...'
                  : '🚀 Start Game'}
              </button>
            )}

            {/* Leave Button */}
            <button
              onClick={handleLeave}
              className="w-full bg-slate-700 hover:bg-red-800 text-slate-300 hover:text-white font-medium py-3 rounded-xl transition"
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Game Type Badge */}
        {room && (
          <p className="text-center text-slate-500 text-sm mt-4">
            Game Type: <span className="text-indigo-400 font-medium capitalize">{room.gameType}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Lobby;