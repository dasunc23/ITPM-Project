import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particlePositions, setParticlePositions] = useState([]);
  const eventSourceRef = useRef(null);

  const userId = state?.userId;
  const username = state?.username;
  const isHost = state?.isHost;

  console.log("[Lobby] State Context:", { userId, username, isHost });
  console.log("[Lobby] Current Room:", room);
  console.log("[Lobby] Players:", players);
  // Generate random particle positions on mount
  useEffect(() => {
    const positions = Array.from({ length: 12 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }));
    setParticlePositions(positions);
  }, []);

  // Track mouse movement for interactive particles
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ─── SSE Connection ───────────────────────────
  useEffect(() => {
    if (!roomCode) return;

    const eventSource = new EventSource(`/api/rooms/stream/${roomCode}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'player-joined' || data.type === 'player-left') {
        setPlayers(data.players);
      }

      if (data.type === 'game-started') {
        setGameStarted(true);
        // Navigate to game page — using the broadcasted room's gametype
        setTimeout(() => navigate(`/student-games/play/${data.room.gameType}`, { state: { ...state, room: data.room } }), 2000);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [roomCode, navigate, state]);

  // ─── Start Game ───────────────────────────────
  const handleStart = async () => {
    console.log("[Lobby] handleStart triggered. Players count:", players.length);
    if (players.length < 2) {
      console.warn("[Lobby] Not enough players to start.");
      return;
    }
    setStarting(true);
    setError(null);
    try {
      console.log("[Lobby] Sending start request for room:", roomCode, "by userId:", userId);
      const res = await axios.post(`/api/rooms/start/${roomCode}`, { userId });
      console.log("[Lobby] Start response:", res.data);
    } catch (error) {
      console.error("[Lobby] Start failed:", error.response?.data || error.message);
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

  const sizes = [12, 8, 16, 10, 14, 9, 6, 20, 4, 18, 11, 13];
  const opacities = [0.7, 0.6, 0.8, 0.5, 0.75, 0.65, 0.4, 0.55, 0.3, 0.45, 0.85, 0.5];
  const speeds = [0.02, 0.015, 0.025, 0.01, 0.03, 0.02, 0.005, 0.035, 0.003, 0.04, 0.018, 0.022];
  const delays = ['0s', '1s', '2s', '0.5s', '1.5s', '2.5s', '0.2s', '3s', '1.8s', '2.2s', '0.8s', '1.2s'];
  const durations = ['2s', '3s', '2.5s', '3.5s', '2.8s', '3.2s', '4s', '2.2s', '5s', '3.8s', '2.6s', '4.2s'];

  return (
    <div className="min-h-screen bg-[#040b1d] text-white relative overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#a855f7]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-8 w-60 h-60 bg-[#ec4899]/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-[#0f172a]/40 rounded-full blur-3xl" />

        {particlePositions.map((pos, index) => (
          <div
            key={index}
            className={`absolute rounded-full animate-ping pointer-events-none ${index % 2 === 0 ? 'bg-[#ec4899]' : 'bg-[#a855f7]'
              }`}
            style={{
              width: `${sizes[index]}px`,
              height: `${sizes[index]}px`,
              opacity: opacities[index],
              left: pos.x + mousePosition.x * speeds[index],
              top: pos.y + mousePosition.y * speeds[index],
              animationDelay: delays[index],
              animationDuration: durations[index],
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg">

          {/* Game Started Banner */}
          {gameStarted && (
            <div className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white text-center py-4 rounded-xl mb-6 text-xl font-bold animate-pulse shadow-lg shadow-[#a855f7]/30">
              🎮 Game is starting...
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Game Lobby</h1>
            <p className="text-gray-300">Waiting for players to join...</p>
          </div>

          {/* Room Code Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-[#a855f7]/30 rounded-2xl p-5 mb-5 text-center shadow-xl">
            <p className="text-[#a855f7] text-sm mb-1">Room Code</p>
            <p className="text-5xl font-bold text-white tracking-widest">{roomCode}</p>
            <p className="text-[#ec4899] text-xs mt-2">Share this code with your friends</p>
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-[#a855f7]/20 rounded-2xl px-6 pb-6 pt-12 shadow-xl relative">

            {/* Return Home Link */}
            <div className="absolute top-4 right-4">
              <Link to="/" className="text-[#a855f7] hover:text-[#ec4899] transition-colors text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
            </div>

            {/* Player Count */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Players</h2>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${players.length >= 2
                ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                : 'bg-red-900/40 text-red-300 border border-red-500/40'
                }`}>
                {players.length} / 6
              </span>
            </div>

            {/* Min Players Warning */}
            {players.length < 2 && (
              <div className="bg-yellow-900/40 border border-yellow-600/50 text-yellow-300 rounded-xl p-3 mb-4 text-sm text-center">
                ⚠️ Need at least 2 players to start
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-300 rounded-xl p-3 mb-4 text-sm text-center">
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
                  className="w-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:shadow-lg hover:shadow-[#a855f7]/30 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  {starting ? 'Starting...' : players.length < 2
                    ? '⏳ Waiting for players...'
                    : '🚀 Start Game'}
                </button>
              )}

              {/* Leave Button */}
              <button
                onClick={handleLeave}
                className="w-full bg-white/10 hover:bg-red-900/40 border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-white font-medium py-3 rounded-xl transition-all duration-300"
              >
                Leave Room
              </button>
            </div>
          </div>

          {/* Game Type Badge */}
          {room && (
            <p className="text-center text-gray-500 text-sm mt-4">
              Game Type:{' '}
              <span className="text-[#a855f7] font-medium capitalize">{room.gameType}</span>
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Lobby;